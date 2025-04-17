import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useSOSAlert } from "@/hooks/useSOSAlert";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useWeb3 } from "@/contexts/Web3Context";

const EmergencyButton = () => {
  const { triggerSOS, isLoading } = useSOSAlert();
  const { isConnected, connectWallet } = useWeb3();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSOSPress = () => {
    if (isProcessing) return; // Prevent multiple triggers
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    // Start countdown
    let count = 3;
    setCountdown(count);
    
    timerRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      
      if (count <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setCountdown(null);
        triggerAlert();
      }
    }, 1000);
  };
  
  const triggerAlert = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      await triggerSOS();
      toast.success("SOS alert triggered successfully");
    } catch (error) {
      console.error("Failed to trigger SOS:", error);
      toast.error("Failed to trigger SOS alert");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const cancelAlert = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCountdown(null);
    toast.info("SOS alert cancelled");
  };

  // Clean up timer on unmount
  const cleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Add cleanup on component unmount
  useState(() => {
    return cleanup;
  });

  if (countdown !== null) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="text-center mb-2">
          <p className="text-lg font-semibold">Sending SOS in</p>
          <p className="text-5xl font-bold text-alert-red">{countdown}</p>
        </div>
        <Button 
          variant="outline" 
          className="mt-4 border-alert-red text-alert-red hover:bg-alert-red/10"
          onClick={cancelAlert}
          disabled={isProcessing}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      className="sos-button h-32 w-32 rounded-full bg-alert-red hover:bg-alert-red/90 text-white flex flex-col items-center justify-center gap-2 animate-pulse-scale"
      disabled={isLoading || isProcessing || !isConnected}
      onClick={handleSOSPress}
    >
      {isLoading || isProcessing ? (
        <>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span>Sending...</span>
        </>
      ) : !isConnected ? (
        <>
          <ShieldAlert className="h-8 w-8" />
          <span>Connect Wallet</span>
        </>
      ) : (
        <>
          <AlertTriangle className="h-8 w-8" />
          <span>SOS</span>
        </>
      )}
    </Button>
  );
};

export default EmergencyButton;
