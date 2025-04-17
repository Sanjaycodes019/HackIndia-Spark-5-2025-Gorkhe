import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { sendAlertEmail } from "@/services/emailService";
import { pinJSONToIPFS } from "@/services/ipfsService";
import { storeSOSAlert } from "@/services/blockchainService";

export type Contact = {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  walletAddress?: string;
  isEmergencyContact: boolean;
};

export type Alert = {
  id: string;
  timestamp: number;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: "active" | "resolved" | "false_alarm";
  respondedBy?: Contact[];
  notes?: string;
  blockchainTxHash?: string;
};

export type UserProfile = {
  name: string;
  phoneNumber: string;
  email: string;
  walletAddress?: string;
  emergencyContacts: Contact[];
  alertHistory: Alert[];
};

export type UserContextType = {
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  triggerSOS: () => Promise<Alert | undefined>;
  addContact: (contact: Omit<Contact, "id">) => void;
  removeContact: (id: string) => void;
  updateContact: (id: string, updatedFields: Partial<Contact>) => void;
  resolveAlert: (id: string, notes?: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async (email: string, password: string) => {
    // Simulating API call
    console.log("Logging in with", email, password);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Create a new profile with the user's email
    const newProfile: UserProfile = {
      name: email.split('@')[0], // Use the part before @ as the name
      phoneNumber: "",
      email: email,
      walletAddress: "",
      emergencyContacts: [],
      alertHistory: [],
    };
    
    setUserProfile(newProfile);
    setIsLoggedIn(true);
    return true;
  };

  const logout = () => {
    setUserProfile(null);
    setIsLoggedIn(false);
  };

  const triggerSOS = async () => {
    if (!userProfile) {
      toast.error("You must be logged in to trigger an SOS alert");
      return;
    }

    try {
      // Get current location
      console.log("Getting current location...");
      const position = await getCurrentPosition();
      console.log("Location obtained:", position.coords);
      
      // Prepare SOS data
      const sosData = {
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        timestamp: Date.now(),
        userInfo: {
          name: userProfile.name,
          contact: userProfile.phoneNumber,
        },
        emergencyDetails: "Emergency SOS alert triggered",
      };
      
      console.log("Prepared SOS data:", sosData);
      
      // Store data on IPFS
      toast.info("Storing alert data on IPFS...");
      let ipfsHash;
      try {
        ipfsHash = await pinJSONToIPFS(sosData);
        console.log("Data stored on IPFS with hash:", ipfsHash);
        toast.success("Data stored on IPFS successfully");
      } catch (ipfsError) {
        console.error("IPFS storage failed:", ipfsError);
        toast.error("Failed to store data on IPFS. Continuing with local alert only.");
        // Continue with local alert even if IPFS fails
      }
      
      // Store IPFS hash on blockchain if available
      let txHash;
      if (ipfsHash) {
        toast.info("Recording alert on blockchain...");
        try {
          txHash = await storeSOSAlert(ipfsHash);
          console.log("Alert recorded on blockchain with tx:", txHash);
          toast.success("Alert recorded on blockchain successfully");
        } catch (blockchainError) {
          console.error("Blockchain recording failed:", blockchainError);
          toast.error("Failed to record on blockchain. Continuing with local alert only.");
          // Continue with local alert even if blockchain fails
        }
      }
      
      const newAlert: Alert = {
        id: `alert-${Date.now()}`,
        timestamp: Date.now(),
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        status: "active",
        blockchainTxHash: txHash,
        notes: sosData.emergencyDetails
      };
      
      // Update user profile with new alert
      setUserProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          alertHistory: [newAlert, ...prev.alertHistory],
        };
      });

      // Send email notifications to emergency contacts
      const emergencyContacts = userProfile.emergencyContacts.filter(
        contact => contact.isEmergencyContact && contact.email
      );

      if (emergencyContacts.length === 0) {
        toast.warning("No emergency contacts found to notify");
      } else {
        toast.info(`Sending alerts to ${emergencyContacts.length} emergency contacts...`);
        
        let successCount = 0;
        let failureCount = 0;

        // Send emails to all emergency contacts
        for (const contact of emergencyContacts) {
          try {
            const success = await sendAlertEmail(
              contact.email,
              userProfile.name,
              newAlert.location,
              newAlert.timestamp
            );

            if (success) {
              successCount++;
              console.log(`Alert sent successfully to ${contact.name} (${contact.email})`);
            } else {
              failureCount++;
              console.error(`Failed to send alert to ${contact.name} (${contact.email})`);
            }
          } catch (emailError) {
            failureCount++;
            console.error(`Error sending email to ${contact.name}:`, emailError);
          }
        }

        // Show appropriate notifications
        if (successCount > 0) {
          toast.success(`Alert sent to ${successCount} emergency contact${successCount > 1 ? 's' : ''}`);
        }
        if (failureCount > 0) {
          toast.error(`Failed to send alert to ${failureCount} contact${failureCount > 1 ? 's' : ''}`);
        }
      }
      
      return newAlert;
    } catch (error) {
      console.error("Failed to trigger SOS:", error);
      toast.error("Failed to trigger SOS alert");
      throw error;
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const addContact = (contact: Omit<Contact, "id">) => {
    setUserProfile((prev) => {
      if (!prev) return prev;
      const newContact = {
        ...contact,
        id: `contact-${Date.now()}`,
      };
      return {
        ...prev,
        emergencyContacts: [...prev.emergencyContacts, newContact],
      };
    });
  };

  const removeContact = (id: string) => {
    setUserProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        emergencyContacts: prev.emergencyContacts.filter(
          (contact) => contact.id !== id
        ),
      };
    });
  };

  const updateContact = (id: string, updatedFields: Partial<Contact>) => {
    setUserProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        emergencyContacts: prev.emergencyContacts.map((contact) =>
          contact.id === id ? { ...contact, ...updatedFields } : contact
        ),
      };
    });
  };

  const resolveAlert = (id: string, notes?: string) => {
    setUserProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        alertHistory: prev.alertHistory.map((alert) =>
          alert.id === id
            ? {
                ...alert,
                status: "resolved",
                notes: notes || alert.notes,
              }
            : alert
        ),
      };
    });
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        setUserProfile,
        isLoggedIn,
        login,
        logout,
        triggerSOS,
        addContact,
        removeContact,
        updateContact,
        resolveAlert,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
