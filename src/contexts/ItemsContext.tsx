
import React, { createContext, useContext, useState, useEffect } from "react";
import { Item, ItemStatus, Question, ClaimAttempt } from "@/types";
import { mockItems } from "@/data/mockData";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface ItemsContextType {
  items: Item[];
  addItem: (item: Omit<Item, "id" | "createdAt" | "updatedAt" | "status">) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  getItem: (id: string) => Item | undefined;
  claimItem: (itemId: string, answers: { questionId: string; answer: string }[]) => boolean;
  returnItem: (itemId: string) => void;
  reportLostItem: (lostItem: Omit<Item, "id" | "createdAt" | "updatedAt" | "status" | "questions">) => void;
  getLostItems: () => Item[];
  getFoundItems: () => Item[];
  checkForMatches: (newItem: Item) => Item[];
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load items from localStorage or use mock data
    const savedItems = localStorage.getItem("items");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      setItems(mockItems);
      localStorage.setItem("items", JSON.stringify(mockItems));
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("items", JSON.stringify(items));
    }
  }, [items]);

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

  const claimItem = (itemId: string, answers: { questionId: string; answer: string }[]): boolean => {
    if (!user) {
      toast.error("You must be logged in to claim an item");
      return false;
    }

    const item = getItem(itemId);
    if (!item) {
      toast.error("Item not found");
      return false;
    }

    if (item.status !== ItemStatus.FOUND) {
      toast.error("This item is not available for claiming");
      return false;
    }

    // Check if all questions are answered correctly
    const allCorrect = item.questions.every(question => {
      const userAnswer = answers.find(a => a.questionId === question.id)?.answer;
      return userAnswer && userAnswer.toLowerCase() === question.answer.toLowerCase();
    });

    if (allCorrect) {
      updateItem(itemId, { 
        status: ItemStatus.CLAIMED, 
        claimedBy: user.id 
      });
      
      toast.success("Item claimed successfully! Please collect it from the lost and found office.");
      return true;
    } else {
      toast.error("Incorrect answers. Please try again.");
      return false;
    }
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
      claimItem,
      returnItem,
      reportLostItem,
      getLostItems,
      getFoundItems,
      checkForMatches
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
