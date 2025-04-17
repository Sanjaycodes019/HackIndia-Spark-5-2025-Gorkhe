import { useState, useRef } from 'react';
import { pinJSONToIPFS } from '../services/ipfsService';
import { storeSOSAlert } from '../services/blockchainService';
import { toast } from 'sonner';
import { useUser } from '../contexts/UserContext';
import { sendAlertEmail } from '../services/emailService';

interface UseSOSAlertProps {
  userInfo?: {
    name?: string;
    contact?: string;
  };
}

export const useSOSAlert = ({ userInfo }: UseSOSAlertProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile, setUserProfile } = useUser();
  const isProcessingRef = useRef(false);

  const triggerSOS = async (emergencyDetails?: string) => {
    if (!userProfile) {
      toast.error("You must be logged in to trigger an SOS alert");
      return;
    }

    // Use ref to prevent multiple simultaneous calls
    if (isProcessingRef.current) {
      console.log('SOS alert already in progress');
      return;
    }

    try {
      isProcessingRef.current = true;
      setIsLoading(true);

      // Get current location with timeout
      const position = await Promise.race([
        new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Location request timed out')), 10000)
        )
      ]);

      // Get address from coordinates using reverse geocoding
      let address = '';
      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`
        );
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          address = data.features[0].properties.formatted;
        }
      } catch (error) {
        console.error('Error getting address:', error);
      }

      // Prepare SOS data
      const sosData = {
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: address
        },
        timestamp: Date.now(),
        userInfo: {
          name: userProfile.name,
          contact: userProfile.phoneNumber,
        },
        emergencyDetails: emergencyDetails || "Emergency SOS alert triggered",
        notes: emergencyDetails || "Emergency SOS alert triggered"
      };

      console.log('Preparing to store SOS data:', sosData);

      // Store data on IPFS with timeout
      toast.info("Storing alert data on IPFS...");
      let ipfsHash;
      try {
        ipfsHash = await Promise.race([
          pinJSONToIPFS(sosData),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('IPFS storage timed out')), 15000)
          )
        ]);
        console.log("Data stored on IPFS with hash:", ipfsHash);
        toast.success("Data stored on IPFS successfully");
      } catch (ipfsError) {
        console.error("IPFS storage failed:", ipfsError);
        toast.error("Failed to store data on IPFS. Continuing with local alert only.");
        // Continue with local alert even if IPFS fails
      }
      
      // Store IPFS hash on blockchain with timeout
      let txHash;
      if (ipfsHash) {
        toast.info("Recording alert on blockchain...");
        try {
          txHash = await Promise.race([
            storeSOSAlert(ipfsHash),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Blockchain recording timed out')), 20000)
            )
          ]);
          console.log("Alert recorded on blockchain with tx:", txHash);
          toast.success("Alert recorded on blockchain successfully");
        } catch (blockchainError) {
          console.error("Blockchain recording failed:", blockchainError);
          toast.error("Failed to record on blockchain. Continuing with local alert only.");
          // Continue with local alert even if blockchain fails
        }
      }

      // Create new alert
      const newAlert = {
        id: `alert-${Date.now()}`,
        timestamp: Date.now(),
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: address
        },
        status: "active" as const,
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
              sosData.location,
              sosData.timestamp
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

      return { ipfsHash, txHash, sosData };
    } catch (error) {
      console.error('Error triggering SOS:', error);
      
      let errorMessage = 'Failed to store SOS Alert';
      if (error instanceof Error) {
        if (error.message.includes('timed out')) {
          errorMessage = 'Operation timed out. Please try again.';
        } else if (error.message.includes('MetaMask')) {
          errorMessage = 'Please ensure MetaMask is installed and connected.';
        } else if (error.message.includes('IPFS')) {
          errorMessage = 'Failed to store data on IPFS. Please try again.';
        } else if (error.message.includes('blockchain')) {
          errorMessage = 'Failed to record on blockchain. Please try again.';
        } else if (error.message.includes('Account request already in progress')) {
          errorMessage = 'MetaMask is already processing a request. Please wait.';
        } else if (error.message.includes('user rejected')) {
          errorMessage = 'Transaction was rejected. Please try again.';
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds to complete the transaction.';
        }
      }
      
      toast.error(errorMessage, {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      throw error;
    } finally {
      setIsLoading(false);
      isProcessingRef.current = false;
    }
  };

  return {
    triggerSOS,
    isLoading,
  };
}; 