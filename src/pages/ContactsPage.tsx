
import { ContactsList } from "@/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const ContactsPage = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Trusted Contacts</h1>
            <p className="text-muted-foreground">
              Manage the people who will be notified during emergencies
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ContactsList />
          </div>
          
          <div>
            <Card className="bg-muted/30">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-safety-purple" />
                  <CardTitle>Why Add Contacts?</CardTitle>
                </div>
                <CardDescription>
                  Learn about trusted contacts and how they help
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="font-medium mb-1">Immediate Response</h3>
                    <p className="text-muted-foreground">
                      Your trusted contacts will receive instant notifications with your
                      location when you trigger an SOS alert.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Blockchain Verification</h3>
                    <p className="text-muted-foreground">
                      Contacts with wallet addresses can verify alerts on the
                      blockchain for added security and accountability.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Multiple Notification Methods</h3>
                    <p className="text-muted-foreground">
                      Contacts will be notified via multiple channels (SMS, email, app)
                      to ensure they receive your emergency alert.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Location Tracking</h3>
                    <p className="text-muted-foreground">
                      Your location will be shared in real-time with your emergency
                      contacts to help them find you quickly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
