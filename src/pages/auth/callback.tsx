import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        if (user) {
          toast.success("Email verified successfully!");
          navigate("/dashboard");
        } else {
          toast.error("Verification failed. Please try again.");
          navigate("/login");
        }
      } catch (error: any) {
        toast.error(error.message || "Error during verification");
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Verifying your email...</h2>
        <p className="text-muted-foreground">Please wait while we verify your email address.</p>
      </div>
    </div>
  );
} 