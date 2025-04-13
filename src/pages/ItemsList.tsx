
import { useState, useEffect } from "react";
import { useItems } from "@/contexts/ItemsContext";
import { useNavigate } from "react-router-dom";
import PageTitle from "@/components/PageTitle";
import ItemCard from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemStatus } from "@/types";
import { Search, SlidersHorizontal, X, Plus, SearchX } from "lucide-react";

const ItemsList = () => {
  const { items, getLostItems, getFoundItems } = useItems();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredFoundItems, setFilteredFoundItems] = useState(getFoundItems());
  const [filteredLostItems, setFilteredLostItems] = useState(getLostItems());
  const [activeTab, setActiveTab] = useState("found");
  
  // Get unique categories
  const categories = Array.from(new Set(items.map(item => item.category)));

  // Apply filters
  useEffect(() => {
    let foundResult = getFoundItems();
    let lostResult = getLostItems();
    
    // Search filter
    if (searchTerm) {
      foundResult = foundResult.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      lostResult = lostResult.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter - only applies to found items
    if (statusFilter !== "all") {
      foundResult = foundResult.filter(item => item.status === statusFilter);
    }
    
    // Category filter
    if (categoryFilter !== "all") {
      foundResult = foundResult.filter(item => item.category === categoryFilter);
      lostResult = lostResult.filter(item => item.category === categoryFilter);
    }
    
    setFilteredFoundItems(foundResult);
    setFilteredLostItems(lostResult);
  }, [items, searchTerm, statusFilter, categoryFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  return (
    <div className="container py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <PageTitle 
          title="Lost & Found Items" 
          subtitle={activeTab === "found" 
            ? `Browse found items (${filteredFoundItems.length} items)`
            : `Browse reported lost items (${filteredLostItems.length} items)`
          } 
        />
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={16} />
            Filters
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => navigate(activeTab === "found" ? "/report-found" : "/report-lost")}
          >
            <Plus size={16} />
            Report {activeTab === "found" ? "Found" : "Lost"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="found" className="w-full mb-8" onValueChange={setActiveTab}>
        <TabsList className="glass w-full max-w-md mx-auto grid grid-cols-2">
          <TabsTrigger value="found">Found Items</TabsTrigger>
          <TabsTrigger value="lost">Lost Items</TabsTrigger>
        </TabsList>

        {/* Search and filters */}
        <div className={`glass p-4 rounded-lg mt-6 mb-8 transition-all duration-300 ${showFilters ? "block" : "hidden md:block"}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input pl-9"
              />
            </div>
            
            {activeTab === "found" && (
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value={ItemStatus.FOUND}>Found</SelectItem>
                    <SelectItem value={ItemStatus.CLAIMED}>Claimed</SelectItem>
                    <SelectItem value={ItemStatus.RETURNED}>Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="glass-input">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="glass">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X size={16} />
              Clear Filters
            </Button>
          </div>
        </div>

        <TabsContent value="found">
          {filteredFoundItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFoundItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="glass flex flex-col items-center justify-center p-12 rounded-lg">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No found items</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                We couldn't find any items matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <div className="flex gap-4">
                <Button onClick={clearFilters}>Clear Filters</Button>
                <Button variant="outline" onClick={() => navigate("/report-found")}>
                  Report a Found Item
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="lost">
          {filteredLostItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLostItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="glass flex flex-col items-center justify-center p-12 rounded-lg">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <SearchX className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No lost items reported</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                There are no lost items reported that match your search criteria. You can report your lost item using the button below.
              </p>
              <div className="flex gap-4">
                <Button onClick={clearFilters}>Clear Filters</Button>
                <Button variant="outline" onClick={() => navigate("/report-lost")}>
                  Report a Lost Item
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ItemsList;
