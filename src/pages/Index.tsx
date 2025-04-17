import { useUser } from "@/contexts/UserContext";
import Dashboard from "./Dashboard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, BellRing, Users, MapPin } from "lucide-react";

const Index = () => {
  const { isLoggedIn } = useUser();

  if (isLoggedIn) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-safety-purple/5 py-20">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <div className="mb-8 flex items-center gap-4">
            <Shield className="h-16 w-16 text-safety-purple" />
            <h1 className="text-5xl font-bold text-safety-purple">SafeHer</h1>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-3xl">
            Blockchain-powered SOS system for women's safety
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Stay safe with our immutable alert system, trusted contacts network, and real-time location sharing. Every alert is secured on the blockchain for accountability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register">
              <Button className="text-lg h-12 px-8 bg-safety-purple hover:bg-safety-purple-dark text-white">
                Create Account
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="text-lg h-12 px-8">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How it Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-safety-purple/5 rounded-lg">
              <div className="bg-safety-purple/10 p-4 rounded-full mb-4">
                <BellRing className="h-8 w-8 text-safety-purple" />
              </div>
              <h3 className="text-xl font-bold mb-2">Emergency SOS</h3>
              <p className="text-muted-foreground">
                Quickly trigger alerts that notify your trusted contacts with your location and status.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-safety-purple/5 rounded-lg">
              <div className="bg-safety-purple/10 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-safety-purple" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trusted Network</h3>
              <p className="text-muted-foreground">
                Build a network of guardians who can respond quickly to your emergency alerts.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-safety-purple/5 rounded-lg">
              <div className="bg-safety-purple/10 p-4 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-safety-purple" />
              </div>
              <h3 className="text-xl font-bold mb-2">Location Tracking</h3>
              <p className="text-muted-foreground">
                Share your real-time location with trusted contacts during emergencies.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-safety-purple/5 rounded-lg">
              <div className="bg-safety-purple/10 p-4 rounded-full mb-4">
                <Shield className="h-8 w-8 text-safety-purple" />
              </div>
              <h3 className="text-xl font-bold mb-2">Blockchain Security</h3>
              <p className="text-muted-foreground">
                All alerts are securely stored on the blockchain, creating an immutable record for accountability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-safety-purple/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to feel safer?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join SafeHer today and take control of your personal safety with blockchain-powered protection.
          </p>
          <Link to="/register">
            <Button className="text-lg h-12 px-8 bg-safety-purple hover:bg-safety-purple-dark text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
