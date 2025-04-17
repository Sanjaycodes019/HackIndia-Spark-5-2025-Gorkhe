
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useWeb3 } from "@/contexts/Web3Context";
import { Wallet, User, Phone, Mail, Save } from "lucide-react";

const ProfileSetup = () => {
  const { userProfile, setUserProfile } = useUser();
  const { walletAddress } = useWeb3();
  
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    phoneNumber: userProfile?.phoneNumber || "",
    email: userProfile?.email || "",
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSave = () => {
    if (!formData.name || !formData.phoneNumber || !formData.email) {
      toast.error("All fields are required");
      return;
    }
    
    setUserProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
      };
    });
    
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>
          Manage your personal information and emergency contacts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center justify-center">
            <Avatar className="h-24 w-24">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${userProfile?.name}`} 
                alt={userProfile?.name || "User"} 
              />
              <AvatarFallback className="text-2xl">
                {userProfile?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <Button 
              variant="link" 
              className="mt-2"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="name">Full Name</Label>
              </div>
              {isEditing ? (
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              ) : (
                <p className="text-sm font-medium">{userProfile?.name}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="phoneNumber">Phone Number</Label>
              </div>
              {isEditing ? (
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Your phone number"
                />
              ) : (
                <p className="text-sm font-medium">{userProfile?.phoneNumber}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="email">Email</Label>
              </div>
              {isEditing ? (
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                />
              ) : (
                <p className="text-sm font-medium">{userProfile?.email}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center">
                <Wallet className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label>Wallet Address</Label>
              </div>
              <p className="text-sm font-mono">
                {walletAddress || userProfile?.walletAddress || "Not connected"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      {isEditing && (
        <CardFooter>
          <Button 
            onClick={handleSave}
            className="bg-safety-purple hover:bg-safety-purple-dark text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProfileSetup;
