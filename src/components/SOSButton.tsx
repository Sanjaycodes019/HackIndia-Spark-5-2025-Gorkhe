import { Button } from "./ui/button";
import { useSOSAlert } from "../hooks/useSOSAlert";
import { Loader2 } from "lucide-react";

interface SOSButtonProps {
  userInfo?: {
    name?: string;
    contact?: string;
  };
  emergencyDetails?: string;
  className?: string;
}

export const SOSButton = ({ userInfo, emergencyDetails, className }: SOSButtonProps) => {
  const { triggerSOS, isLoading } = useSOSAlert({ userInfo });

  const handleClick = async () => {
    try {
      await triggerSOS(emergencyDetails);
    } catch (error) {
      // Error is already handled in the hook
      console.error('SOS button error:', error);
    }
  };

  return (
    <Button
      variant="destructive"
      size="lg"
      className={`w-full max-w-md ${className || ''}`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending SOS...
        </>
      ) : (
        'SOS ALERT'
      )}
    </Button>
  );
}; 