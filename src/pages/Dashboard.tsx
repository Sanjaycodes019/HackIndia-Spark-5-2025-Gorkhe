import { useUser } from "@/contexts/UserContext";
import { useState, useEffect } from "react";
import EmergencyButton from "@/components/EmergencyButton";
import AlertHistory from "@/components/AlertHistory";
import ProfileSetup from "@/components/ProfileSetup";
import Map from "@/components/Map";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Info, BellRing, AlertTriangle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import SafetyChatBot from "@/components/SafetyChatBot";
import { useWeb3 } from "@/contexts/Web3Context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

const Dashboard = () => {
  const { user, triggerSOS, shareLocation } = useUser();
  const { isConnected, connectWallet } = useWeb3();
  const [currentLocation, setCurrentLocation] = useState<Location>({
    latitude: 30.8778122,
    longitude: 76.8739735,
  });
  const [isSendingSOS, setIsSendingSOS] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    // Get user location on component mount
    updateLocation();
  }, []);

  const updateLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Failed to get your location");
      }
    );
  };
  
  // Get the most recent active alert, if any
  const activeAlert = user?.alertHistory.find((alert) => alert.status === "active");
  
  const handleSOS = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet to use the SOS feature");
      return;
    }

    try {
      setIsSendingSOS(true);
      await triggerSOS();
      toast.success("SOS alert sent successfully!");
    } catch (error) {
      toast.error("Failed to send SOS alert");
      console.error("SOS error:", error);
    } finally {
      setIsSendingSOS(false);
    }
  };

  const handleShareLocation = async () => {
    try {
      setIsSharing(true);
      await shareLocation();
      toast.success("Location shared successfully!");
    } catch (error) {
      toast.error("Failed to share location");
      console.error("Share location error:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Emergency SOS</CardTitle>
              <CardDescription>
                Press the button below in case of an emergency
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <EmergencyButton />
              <p className="mt-6 text-sm text-muted-foreground max-w-md text-center">
                Pressing this button will send an alert to all your emergency contacts
                and record the incident on the blockchain for verification
              </p>
            </CardContent>
          </Card>
          
          <ProfileSetup />
        </div>
        
        <div className="flex flex-col gap-6">
          {activeAlert && (
            <Card className="border-alert-red">
              <CardHeader className="pb-3 bg-alert-red/10">
                <div className="flex items-center">
                  <BellRing className="text-alert-red h-5 w-5 mr-2 animate-pulse" />
                  <CardTitle className="text-alert-red">Active Alert</CardTitle>
                </div>
                <CardDescription>
                  You have an active emergency alert
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm mb-4">
                  <span className="font-medium">Triggered:</span>{" "}
                  {new Date(activeAlert.timestamp).toLocaleString()}
                </p>
                <Map
                  alerts={[activeAlert]}
                  currentLocation={activeAlert.location}
                  className="h-40 mb-4"
                />
                <p className="text-sm text-muted-foreground">
                  Your emergency contacts have been notified and your location is
                  being shared with them in real-time.
                </p>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Your Location</CardTitle>
              <CardDescription>
                This is your current location that will be shared during an emergency
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Map 
                currentLocation={currentLocation}
                className="h-60 mb-4"
              />
            </CardContent>
          </Card>
          
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                <CardTitle>How It Works</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <ol className="space-y-2 list-decimal list-inside text-sm">
                <li>Press the SOS button in an emergency situation</li>
                <li>Your trusted contacts will be instantly notified</li>
                <li>Your real-time location will be shared with them</li>
                <li>The alert is securely stored on the blockchain for verification</li>
                <li>Mark the alert as resolved once you're safe</li>
              </ol>
              <div className="flex items-center mt-4 p-3 bg-safety-purple/10 rounded-md">
                <Shield className="h-5 w-5 text-safety-purple mr-2" />
                <p className="text-sm">
                  All alerts are immutably recorded for accountability and verification
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div>
        <AlertHistory />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleSOS}
                disabled={isSendingSOS}
                className="bg-alert-red hover:bg-alert-red-dark text-white h-24"
              >
                {isSendingSOS ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
                    <span>Sending SOS...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    <span>SOS Alert</span>
                  </div>
                )}
              </Button>
              <Button
                onClick={handleShareLocation}
                disabled={isSharing}
                className="bg-safety-purple hover:bg-safety-purple-dark text-white h-24"
              >
                {isSharing ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
                    <span>Sharing...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Share2 className="h-6 w-6" />
                    <span>Share Location</span>
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <SafetyChatBot />
      </div>
    </div>
  );
};

export default Dashboard;
