import React, { useState } from "react";
import AlertHistory from "@/components/AlertHistory";
import Map from "@/components/Map";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BellRing, Clock, CheckCircle, AlertTriangle, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AlertsPage = () => {
  const { userProfile, resolveAlert } = useUser();
  const [activeTab, setActiveTab] = useState("all");
  
  const activeAlerts = userProfile?.alertHistory.filter(
    (alert) => alert.status === "active"
  ) || [];
  
  const resolvedAlerts = userProfile?.alertHistory.filter(
    (alert) => alert.status === "resolved"
  ) || [];

  const handleResolveAlert = (alertId: string) => {
    resolveAlert(alertId, "Manually resolved by user");
    toast.success("Alert marked as resolved");
  };

  const handleViewOnBlockchain = (txHash: string) => {
    window.open(`https://etherscan.io/tx/${txHash}`, "_blank");
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Alert History</h1>
          <p className="text-muted-foreground">
            View and manage your emergency alerts
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="active" className="relative">
            Active
            {activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-alert-red text-[10px] text-white">
                {activeAlerts.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <AlertHistory />
        </TabsContent>
        
        <TabsContent value="active" className="mt-6">
          {activeAlerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Clock className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-center text-muted-foreground">
                  No active alerts
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <Card key={alert.id} className="border-alert-red">
                  <CardHeader className="pb-3 bg-alert-red/10">
                    <div className="flex items-center">
                      <BellRing className="text-alert-red h-5 w-5 mr-2 animate-pulse" />
                      <CardTitle className="text-alert-red">
                        Active Emergency Alert
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Triggered on {formatDate(alert.timestamp)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Alert Details</h4>
                        <p className="text-sm text-muted-foreground">
                          {alert.notes || "Emergency SOS alert triggered"}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Location Information</h4>
                        <div className="flex items-center mb-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                          <a
                            href={`https://www.google.com/maps?q=${alert.location.latitude},${alert.location.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline"
                          >
                            View on Google Maps
                          </a>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Latitude: {alert.location.latitude}</p>
                          <p>Longitude: {alert.location.longitude}</p>
                          {alert.location.address && (
                            <p>Address: {alert.location.address}</p>
                          )}
                        </div>
                      </div>
                      
                      <Map
                        alerts={[alert]}
                        currentLocation={alert.location}
                        className="h-60 mb-4"
                      />
                      
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          onClick={() => handleResolveAlert(alert.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Resolved
                        </Button>
                        
                        {alert.blockchainTxHash && (
                          <Button
                            variant="ghost"
                            onClick={() => handleViewOnBlockchain(alert.blockchainTxHash!)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View on Blockchain
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="resolved" className="mt-6">
          {resolvedAlerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-center text-muted-foreground">
                  No resolved alerts
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {resolvedAlerts.map((alert) => (
                <Card key={alert.id} className="border-green-500">
                  <CardHeader className="pb-3 bg-green-500/10">
                    <div className="flex items-center">
                      <CheckCircle className="text-green-500 h-5 w-5 mr-2" />
                      <CardTitle className="text-green-500">
                        Resolved Emergency Alert
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Resolved on {formatDate(alert.timestamp)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Alert Details</h4>
                        <p className="text-sm text-muted-foreground">
                          {alert.notes || "Emergency SOS alert triggered"}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Location Information</h4>
                        <div className="flex items-center mb-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                          <a
                            href={`https://www.google.com/maps?q=${alert.location.latitude},${alert.location.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline"
                          >
                            View on Google Maps
                          </a>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Latitude: {alert.location.latitude}</p>
                          <p>Longitude: {alert.location.longitude}</p>
                          {alert.location.address && (
                            <p>Address: {alert.location.address}</p>
                          )}
                        </div>
                      </div>
                      
                      <Map
                        alerts={[alert]}
                        currentLocation={alert.location}
                        className="h-60 mb-4"
                      />
                      
                      {alert.blockchainTxHash && (
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            onClick={() => handleViewOnBlockchain(alert.blockchainTxHash!)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View on Blockchain
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="map" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Locations</CardTitle>
              <CardDescription>
                View all alert locations on the map
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Map
                alerts={userProfile?.alertHistory || []}
                className="h-[500px]"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertsPage;
