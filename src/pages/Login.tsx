import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      // Error is already handled in the login function
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <div className="container max-w-md">
        <div className="glass rounded-lg p-8">
          <div className="mb-8 text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mx-auto flex items-center justify-center mb-4">
              <span className="text-white text-xl font-bold">VJ</span>
            </div>
            <h1 className="text-2xl font-bold">VJTI Lost & Found</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to access the lost and found system
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="your.email@vjti.ac.in"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" size="sm" className="text-xs text-primary h-auto p-0">
                  Forgot password?
                </Button>
              </div>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input"
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-muted-foreground">
              Test accounts:
            </p>
            <div className="text-xs text-muted-foreground mt-2 space-y-1">
              <p>Admin: john.doe@vjti.ac.in</p>
              <p>User: jane.smith@vjti.ac.in</p>
              <p>(Any password will work)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
