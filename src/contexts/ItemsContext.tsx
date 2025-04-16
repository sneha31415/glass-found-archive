import React, { createContext, useContext, useState, useEffect } from "react";
import { Item, ItemStatus, Question, ClaimAttempt, ClaimStatus } from "@/types";
import { mockItems } from "@/data/mockData";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface ItemsContextType {
  items: Item[];
  addItem: (item: Omit<Item, "id" | "createdAt" | "updatedAt" | "status">) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  getItem: (id: string) => Item | undefined;
  submitClaim: (itemId: string, answers: { questionId: string; answer: string }[]) => void;
  reviewClaim: (itemId: string, claimId: string, status: ClaimStatus, response?: string) => void;
  returnItem: (itemId: string) => void;
  reportLostItem: (lostItem: Omit<Item, "id" | "createdAt" | "updatedAt" | "status" | "questions">) => void;
  getLostItems: () => Item[];
  getFoundItems: () => Item[];
  checkForMatches: (newItem: Item) => Item[];
  getClaimAttempts: (itemId: string) => ClaimAttempt[];
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [claimAttempts, setClaimAttempts] = useState<ClaimAttempt[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load items and claim attempts from localStorage
    const savedItems = localStorage.getItem("items");
    const savedClaims = localStorage.getItem("claimAttempts");
    
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      setItems(mockItems);
      localStorage.setItem("items", JSON.stringify(mockItems));
    }
    
    if (savedClaims) {
      setClaimAttempts(JSON.parse(savedClaims));
    }
  }, []);

  // Save items and claim attempts to localStorage whenever they change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("items", JSON.stringify(items));
    }
    if (claimAttempts.length > 0) {
      localStorage.setItem("claimAttempts", JSON.stringify(claimAttempts));
    }
  }, [items, claimAttempts]);

  const addItem = (newItem: Omit<Item, "id" | "createdAt" | "updatedAt" | "status">) => {
    const timestamp = new Date().toISOString();
    const item: Item = {
      ...newItem,
      id: `item${Date.now()}`,
      status: ItemStatus.FOUND,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const newItems = [...items, item];
    setItems(newItems);
    
    // Check for potential matches with lost items
    const matches = checkForMatches(item);
    if (matches.length > 0) {
      toast.success(`Found ${matches.length} potential matches with reported lost items!`);
    } else {
      toast.success("Item reported successfully");
    }
  };

  const updateItem = (id: string, updatedFields: Partial<Item>) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, ...updatedFields, updatedAt: new Date().toISOString() } 
          : item
      )
    );
    toast.success("Item updated successfully");
  };

  const deleteItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.success("Item deleted successfully");
  };

  const getItem = (id: string) => {
    return items.find(item => item.id === id);
  };

  const submitClaim = (itemId: string, answers: { questionId: string; answer: string }[]) => {
    if (!user) {
      toast.error("You must be logged in to claim an item");
      return;
    }

    const item = getItem(itemId);
    if (!item) {
      toast.error("Item not found");
      return;
    }

    if (item.status !== ItemStatus.FOUND) {
      toast.error("This item is not available for claiming");
      return;
    }

    const timestamp = new Date().toISOString();
    const claimAttempt: ClaimAttempt = {
      id: `claim${Date.now()}`,
      itemId,
      userId: user.id,
      userName: user.name,
      answers,
      status: ClaimStatus.PENDING,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    setClaimAttempts(prev => [...prev, claimAttempt]);
    toast.success("Claim submitted successfully! The reporter will review your answers.");
  };

  const reviewClaim = (itemId: string, claimId: string, status: ClaimStatus, response?: string) => {
    if (!user) {
      toast.error("You must be logged in to review claims");
      return;
    }

    const item = getItem(itemId);
    if (!item) {
      toast.error("Item not found");
      return;
    }

    if (item.reportedBy !== user.id && user.role !== 'admin') {
      toast.error("You are not authorized to review this claim");
      return;
    }

    const claim = claimAttempts.find(c => c.id === claimId);
    if (!claim) {
      toast.error("Claim not found");
      return;
    }

    const timestamp = new Date().toISOString();
    setClaimAttempts(prev => 
      prev.map(c => 
        c.id === claimId 
          ? { ...c, status, reporterResponse: response, updatedAt: timestamp }
          : c
      )
    );

    if (status === ClaimStatus.APPROVED) {
      updateItem(itemId, { 
        status: ItemStatus.CLAIMED, 
        claimedBy: claim.userId 
      });
      toast.success("Claim approved! The claimant has been notified.");
    } else {
      toast.success("Claim rejected");
    }
  };

  const getClaimAttempts = (itemId: string) => {
    return claimAttempts.filter(claim => claim.itemId === itemId);
  };

  const returnItem = (itemId: string) => {
    if (!user) {
      toast.error("You must be logged in to mark an item as returned");
      return;
    }

    const item = getItem(itemId);
    if (!item) {
      toast.error("Item not found");
      return;
    }

    if (item.status !== ItemStatus.CLAIMED) {
      toast.error("This item is not currently claimed");
      return;
    }

    updateItem(itemId, { 
      status: ItemStatus.RETURNED, 
      returnedDate: new Date().toISOString() 
    });
    
    toast.success("Item marked as returned");
  };

  // Add functionality to report lost items
  const reportLostItem = (lostItem: Omit<Item, "id" | "createdAt" | "updatedAt" | "status" | "questions">) => {
    const timestamp = new Date().toISOString();
    const item: Item = {
      ...lostItem,
      id: `lost${Date.now()}`,
      status: ItemStatus.LOST,
      questions: [], // Lost items don't have verification questions
      createdAt: timestamp,
      updatedAt: timestamp,
      isLostItem: true
    };

    const newItems = [...items, item];
    setItems(newItems);
    
    // Check for potential matches with found items
    const matches = checkForMatches(item);
    if (matches.length > 0) {
      toast.success(`Found ${matches.length} potential matches with reported found items!`);
    } else {
      toast.success("Lost item reported successfully");
    }
  };

  // Get all lost items
  const getLostItems = () => {
    return items.filter(item => item.status === ItemStatus.LOST || item.isLostItem);
  };

  // Get all found items (not lost, not matched)
  const getFoundItems = () => {
    return items.filter(item => !item.isLostItem && item.status !== ItemStatus.MATCHED);
  };

  // Check for potential matches between lost and found items
  const checkForMatches = (newItem: Item): Item[] => {
    // If the new item is a lost item, check against found items
    // If the new item is a found item, check against lost items
    const itemsToCheckAgainst = newItem.isLostItem ? 
      items.filter(item => !item.isLostItem && [ItemStatus.FOUND].includes(item.status)) :
      items.filter(item => item.isLostItem);
    
    // Simple matching algorithm based on name and category
    // Could be improved with more sophisticated matching
    return itemsToCheckAgainst.filter(item => 
      item.name.toLowerCase().includes(newItem.name.toLowerCase()) ||
      newItem.name.toLowerCase().includes(item.name.toLowerCase()) ||
      item.category.toLowerCase() === newItem.category.toLowerCase() ||
      (item.description && newItem.description && 
        (item.description.toLowerCase().includes(newItem.description.toLowerCase()) ||
         newItem.description.toLowerCase().includes(item.description.toLowerCase())))
    );
  };

  return (
    <ItemsContext.Provider value={{ 
      items, 
      addItem, 
      updateItem, 
      deleteItem, 
      getItem,
      submitClaim,
      reviewClaim,
      returnItem,
      reportLostItem,
      getLostItems,
      getFoundItems,
      checkForMatches,
      getClaimAttempts
    }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error("useItems must be used within an ItemsProvider");
  }
  return context;
};
