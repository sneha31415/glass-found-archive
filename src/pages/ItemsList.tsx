
import { useState, useEffect } from "react";
import { useItems } from "@/contexts/ItemsContext";
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
import { ItemStatus } from "@/types";
import { Search, SlidersHorizontal, X } from "lucide-react";

const ItemsList = () => {
  const { items } = useItems();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredItems, setFilteredItems] = useState(items);
  
  // Get unique categories
  const categories = Array.from(new Set(items.map(item => item.category)));

  // Apply filters
  useEffect(() => {
    let result = items;
    
    // Search filter
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(item => item.status === statusFilter);
    }
    
    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(item => item.category === categoryFilter);
    }
    
    setFilteredItems(result);
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
          subtitle={`Browse all items (${filteredItems.length} items found)`} 
        />
        <Button 
          variant="outline" 
          className="mt-4 md:mt-0 flex items-center gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={16} />
          Filters
        </Button>
      </div>

      {/* Search and filters */}
      <div className={`glass p-4 rounded-lg mb-8 transition-all duration-300 ${showFilters ? "block" : "hidden md:block"}`}>
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

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="glass flex flex-col items-center justify-center p-12 rounded-lg">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No items found</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            We couldn't find any items matching your search criteria. Try adjusting your filters or search terms.
          </p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
};

export default ItemsList;
