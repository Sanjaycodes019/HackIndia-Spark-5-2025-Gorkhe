import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { email, password, confirmPassword, firstName, lastName, phone } = formData;

    // Basic validation
    if (!email || !password || !confirmPassword || !firstName || !lastName || !phone) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      console.log("Starting registration process...");
      console.log("Form data:", formData);

      // First, check if email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", email)
        .single();

      if (existingUser) {
        toast.error("Email already registered");
        setLoading(false);
        return;
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      console.log("Auth response:", { authData, authError });

      if (authError) {
        console.error("Auth error:", authError);
        toast.error(authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        console.error("No user data returned from auth");
        toast.error("Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      console.log("Creating profile for user:", authData.user.id);
      
      // Create user profile in profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: authData.user.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select();

      console.log("Profile creation response:", { profileData, profileError });

      if (profileError) {
        console.error("Profile error:", profileError);
        toast.error(profileError.message);
        setLoading(false);
        return;
      }

      toast.success("Registration successful! Please check your email to verify your account.");
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Error during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="Enter your first name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="Enter your phone number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Create a password"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="Confirm your password"
        />
      </div>

      <div className="flex flex-col gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("/login")}
          disabled={loading}
        >
          Already have an account? Login
        </Button>
      </div>
    </form>
  );
} 