import React, { useState } from "react";
import { Alert, useUser } from "@/contexts/UserContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  ExternalLink,
  Info,
  ChevronDown,
  ChevronUp,
  Hash,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AlertHistory = () => {
  const { userProfile, resolveAlert } = useUser();
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  const alerts = userProfile?.alertHistory || [];

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleResolveAlert = (alertId: string) => {
    resolveAlert(alertId, "Manually resolved by user");
    toast.success("Alert marked as resolved");
  };

  const handleViewOnBlockchain = (txHash: string) => {
    window.open(`https://etherscan.io/tx/${txHash}`, "_blank");
  };

  const toggleExpandAlert = (alertId: string) => {
    if (expandedAlertId === alertId) {
      setExpandedAlertId(null);
    } else {
      setExpandedAlertId(alertId);
    }
  };

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alert History</CardTitle>
          <CardDescription>
            Your recent emergency alerts will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6">
            <Clock className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-center text-muted-foreground">
              No alerts triggered yet
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert History</CardTitle>
        <CardDescription>
          View and manage your emergency alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <React.Fragment key={alert.id}>
                <TableRow 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpandAlert(alert.id)}
                >
                  <TableCell>
                    <div className="flex items-center">
                      {alert.status === "active" ? (
                        <AlertTriangle className="h-4 w-4 text-alert-red mr-2" />
                      ) : alert.status === "resolved" ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      )}
                      <span className={alert.status === "active" ? "font-medium text-alert-red" : ""}>
                        {alert.status === "active"
                          ? "Active"
                          : alert.status === "resolved"
                          ? "Resolved"
                          : "False Alarm"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(alert.timestamp)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Info className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm">
                        {alert.notes || "Emergency SOS alert triggered"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                      <a
                        href={`https://www.google.com/maps?q=${alert.location.latitude},${alert.location.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Location
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {alert.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResolveAlert(alert.id);
                          }}
                        >
                          Resolve
                        </Button>
                      )}
                      {alert.blockchainTxHash && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewOnBlockchain(alert.blockchainTxHash!);
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpandAlert(alert.id);
                        }}
                      >
                        {expandedAlertId === alert.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedAlertId === alert.id && (
                  <TableRow>
                    <TableCell colSpan={5} className="bg-muted/30">
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Alert Details</h4>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <Info className="h-4 w-4 text-muted-foreground mr-2" />
                                <span>{alert.notes || "Emergency SOS alert triggered"}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                                <span>Triggered on {formatDate(alert.timestamp)}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <User className="h-4 w-4 text-muted-foreground mr-2" />
                                <span>Status: {alert.status}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Location Information</h4>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                                <span>Address: {alert.location.address || "Not available"}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <span className="mr-2">Coordinates:</span>
                                <a
                                  href={`https://www.google.com/maps?q=${alert.location.latitude},${alert.location.longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  {alert.location.latitude}, {alert.location.longitude}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        {alert.blockchainTxHash && (
                          <div>
                            <h4 className="font-medium mb-2">Blockchain Information</h4>
                            <div className="flex items-center text-sm">
                              <Hash className="h-4 w-4 text-muted-foreground mr-2" />
                              <span>Transaction Hash: </span>
                              <a
                                href={`https://etherscan.io/tx/${alert.blockchainTxHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline ml-2"
                              >
                                {alert.blockchainTxHash}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AlertHistory;
