import { useState, useEffect } from "react";
import Map from "@/components/Map";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Navigation, AlertTriangle, Share2 } from "lucide-react";
import { toast } from "sonner";

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

const MapPage = () => {
  const { userProfile } = useUser();
  const [currentLocation, setCurrentLocation] = useState<Location>({
    latitude: 30.8778122,
    longitude: 76.8739735,
    address: "Kalujhanda, Solan",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    // Get user location on component mount
    updateLocation();
  }, []);

  const updateLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
        toast.success("Location updated successfully");
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Failed to get your location");
        setIsLoading(false);
      }
    );
  };

  const shareLocation = () => {
    setIsSharing(true);
    
    // Simulate sharing location with contacts
    setTimeout(() => {
      setIsSharing(false);
      toast.success("Location shared with emergency contacts");
    }, 2000);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Location Tracking</h1>
          <p className="text-muted-foreground">
            View and share your location in real-time
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={updateLocation}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></span>
            ) : (
              <Navigation className="h-4 w-4" />
            )}
            Update Location
          </Button>
          <Button
            onClick={shareLocation}
            disabled={isSharing}
            className="bg-safety-purple hover:bg-safety-purple-dark text-white"
          >
            {isSharing ? (
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            ) : (
              <Share2 className="h-4 w-4 mr-2" />
            )}
            Share Location
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger value="current">Current Location</TabsTrigger>
          <TabsTrigger value="alerts">Alert Locations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    <CardTitle>Your Location</CardTitle>
                  </div>
                  <CardDescription>
                    This is your real-time location that will be shared during emergencies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Map
                    currentLocation={currentLocation}
                    className="h-[400px]"
                  />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Location Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Coordinates</h3>
                      <p className="text-muted-foreground">
                        {currentLocation.latitude.toFixed(6)},{" "}
                        {currentLocation.longitude.toFixed(6)}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium">Address</h3>
                      <p className="text-muted-foreground">
                        {currentLocation.address || "Address not available"}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium">Last Updated</h3>
                      <p className="text-muted-foreground">
                        {new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-sm font-medium mb-2">Privacy Notice</h3>
                    <p className="text-xs text-muted-foreground">
                      Your location is only shared with your emergency contacts when
                      you trigger an SOS alert or manually share it.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6 bg-muted/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-alert-red" />
                    <CardTitle>Safety Tips</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>Keep location services enabled for accurate alerts</li>
                    <li>Update your location when you change areas</li>
                    <li>Share your location with a trusted contact when travelling</li>
                    <li>Check that your emergency contacts are up to date</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="alerts" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <CardTitle>Alert Locations History</CardTitle>
              </div>
              <CardDescription>
                View all your past emergency alert locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Map
                alerts={userProfile?.alertHistory}
                currentLocation={currentLocation}
                className="h-[400px]"
              />
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  {userProfile?.alertHistory.length === 0
                    ? "No alert history found"
                    : `Showing ${userProfile?.alertHistory.length} past alert locations`}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MapPage;
