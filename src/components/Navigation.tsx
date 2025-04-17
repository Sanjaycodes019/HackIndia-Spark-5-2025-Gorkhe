import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Shield,
  Users,
  Bell,
  Map,
  Menu,
  X,
  User,
  Home,
  LogOut,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import ConnectWallet from "./ConnectWallet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navigation = () => {
  const location = useLocation();
  const { userProfile, logout, isLoggedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Alerts",
      path: "/alerts",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      name: "Contacts",
      path: "/contacts",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Map",
      path: "/map",
      icon: <Map className="h-5 w-5" />,
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-safety-purple" />
            <span className="font-bold text-lg text-safety-purple">SafeHer</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isLoggedIn &&
            navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors hover:text-safety-purple",
                  location.pathname === item.path
                    ? "text-safety-purple"
                    : "text-muted-foreground"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <div className="hidden md:flex items-center gap-4">
                <ConnectWallet />
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${userProfile?.name}`} 
                      alt={userProfile?.name || "User"} 
                    />
                    <AvatarFallback>{userProfile?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{userProfile?.name}</p>
                    <Button
                      onClick={logout}
                      variant="link"
                      className="h-auto p-0 text-xs text-muted-foreground"
                    >
                      Log out
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                onClick={toggleMenu}
                variant="ghost"
                className="md:hidden"
                size="icon"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="ghost" className="hidden md:flex">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  className="bg-safety-purple hover:bg-safety-purple-dark text-white"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Register
                </Button>
              </Link>
              <Button
                onClick={toggleMenu}
                variant="ghost"
                className="md:hidden"
                size="icon"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container flex flex-col py-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 py-2 border-b mb-2">
                  <Avatar>
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${userProfile?.name}`} 
                      alt={userProfile?.name || "User"} 
                    />
                    <AvatarFallback>{userProfile?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{userProfile?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {userProfile?.email}
                    </p>
                  </div>
                </div>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-safety-purple",
                      location.pathname === item.path
                        ? "text-safety-purple"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
                <div className="mt-2 pt-2 border-t">
                  <ConnectWallet />
                </div>
                <Button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  variant="ghost"
                  className="mt-2 justify-start px-0"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link 
                  to="/login" 
                  className="py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link 
                  to="/register" 
                  className="py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button 
                    className="w-full justify-start bg-safety-purple hover:bg-safety-purple-dark text-white"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
