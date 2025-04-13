
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "@/contexts/ItemsContext";
import { useAuth } from "@/contexts/AuthContext";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, SearchX } from "lucide-react";
import { toast } from "sonner";

const ReportLost = () => {
  const { reportLostItem } = useItems();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [dateLost, setDateLost] = useState(new Date().toISOString().split("T")[0]);
  const [reporterName, setReporterName] = useState(user ? user.name : "");
  const [reporterContact, setReporterContact] = useState(user ? user.email : "");
  const [imageUrl, setImageUrl] = useState("");
  
  const validateForm = () => {
    if (!name) return "Item name is required";
    if (!description) return "Description is required";
    if (!category) return "Category is required";
    if (!location) return "Last seen location is required";
    if (!dateLost) return "Date lost is required";
    if (!reporterName) return "Your name is required";
    if (!reporterContact) return "Contact information is required";
    
    return null;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    
    reportLostItem({
      name,
      description,
      category,
      location,
      dateLost: new Date(dateLost).toISOString(),
      reportedBy: user ? user.id : "anonymous",
      reporterName,
      reporterContact,
      imageUrl: imageUrl || undefined
    });
    
    navigate("/items");
  };
  
  return (
    <div className="container py-20">
      <PageTitle 
        title="Report a Lost Item" 
        subtitle="Submit details about your lost item to help us find it" 
      />
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Item Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                placeholder="e.g., Laptop, Wallet, Water Bottle"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., Electronics, Personal Items, Academic"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the item (color, brand, unique features, etc.)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass-input min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Last Seen Location</Label>
              <Input
                id="location"
                placeholder="e.g., Library, Canteen, Room 202"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateLost">Date Lost</Label>
              <Input
                id="dateLost"
                type="date"
                value={dateLost}
                onChange={(e) => setDateLost(e.target.value)}
                className="glass-input"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input
                id="imageUrl"
                placeholder="URL to an image of the item"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="glass-input"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Please provide a URL to an image if available
              </p>
            </div>
          </div>
        </div>
        
        <div className="glass rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="reporterName">Your Name</Label>
              <Input
                id="reporterName"
                placeholder="Your full name"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reporterContact">Contact Information</Label>
              <Input
                id="reporterContact"
                placeholder="Your email or phone number"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                className="glass-input"
              />
            </div>
          </div>
          
          <div className="flex items-start mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-500">Important Note</h4>
              <p className="text-sm text-muted-foreground">
                By submitting this form, you confirm that you've lost this item and are hoping to find it. If someone finds an item matching your description, we'll notify you through your provided contact information.
              </p>
            </div>
          </div>
        </div>
        
        <div className="glass rounded-lg p-6">
          <div className="flex items-start p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <SearchX className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-500">Check Found Items First</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Before reporting a lost item, please check our collection of found items. Your item might already be there waiting for you to claim it!
              </p>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/items")}
                className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20"
              >
                Browse Found Items
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit">
            Submit Report
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReportLost;
