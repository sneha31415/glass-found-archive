import React, { createContext, useContext, useState, useEffect } from "react";
import { Item, ItemStatus, Question, ClaimAttempt, ClaimStatus } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface ItemsContextType {
  items: Item[];
  addItem: (item: Omit<Item, "id" | "createdAt" | "updatedAt" | "status">) => Promise<void>;
  updateItem: (id: string, item: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getItem: (id: string) => Item | undefined;
  submitClaim: (itemId: string, answers: { questionId: string; answer: string }[]) => Promise<void>;
  reviewClaim: (itemId: string, claimId: string, status: ClaimStatus, response?: string) => Promise<void>;
  returnItem: (itemId: string) => Promise<void>;
  reportLostItem: (lostItem: Omit<Item, "id" | "createdAt" | "updatedAt" | "status" | "questions">) => Promise<void>;
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
    // Load items from API
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items');
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data = await response.json();
        // Transform MongoDB _id to id for frontend
        const transformedItems = data.map((item: any) => ({
          ...item,
          id: item._id || item.id
        }));
        setItems(transformedItems);
      } catch (error) {
        console.error('Error fetching items:', error);
        toast.error('Failed to load items');
      }
    };

    fetchItems();
  }, []);

  const addItem = async (newItem: Omit<Item, "id" | "createdAt" | "updatedAt" | "status">) => {
    try {
      const response = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newItem)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item');
      }

      const addedItem = await response.json();
      setItems(prevItems => [...prevItems, addedItem]);
      toast.success("Item reported successfully");
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add item');
    }
  };

  const updateItem = async (id: string, updatedFields: Partial<Item>) => {
    try {
      const response = await fetch(`http://localhost:5000/api/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedFields)
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      const updatedItem = await response.json();
      setItems(prevItems => 
        prevItems.map(item => item.id === id ? updatedItem : item)
      );
      toast.success("Item updated successfully");
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      setItems(prevItems => prevItems.filter(item => item.id !== id));
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const getItem = (id: string) => {
    return items.find(item => {
      // Convert both IDs to strings for comparison
      const itemId = item.id?.toString() || item._id?.toString();
      return itemId === id;
    });
  };

  const submitClaim = async (itemId: string, answers: { questionId: string; answer: string }[]) => {
    if (!user) {
      toast.error("You must be logged in to claim an item");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/items/${itemId}/claim`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ answers })
      });

      if (!response.ok) {
        throw new Error('Failed to submit claim');
      }

      const updatedItem = await response.json();
      setItems(prevItems => 
        prevItems.map(item => item.id === itemId ? updatedItem : item)
      );
      toast.success("Claim submitted successfully");
    } catch (error) {
      console.error('Error submitting claim:', error);
      toast.error('Failed to submit claim');
    }
  };

  const returnItem = async (itemId: string) => {
    if (!user) {
      toast.error("You must be logged in to mark an item as returned");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/items/${itemId}/return`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark item as returned');
      }

      const updatedItem = await response.json();
      setItems(prevItems => 
        prevItems.map(item => item.id === itemId ? updatedItem : item)
      );
      toast.success("Item marked as returned");
    } catch (error) {
      console.error('Error marking item as returned:', error);
      toast.error('Failed to mark item as returned');
    }
  };

  const reportLostItem = async (lostItem: Omit<Item, "id" | "createdAt" | "updatedAt" | "status" | "questions">) => {
    try {
      const response = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...lostItem,
          status: ItemStatus.LOST
        })
      });

      if (!response.ok) {
        throw new Error('Failed to report lost item');
      }

      const addedItem = await response.json();
      setItems(prevItems => [...prevItems, addedItem]);
      toast.success("Lost item reported successfully");
    } catch (error) {
      console.error('Error reporting lost item:', error);
      toast.error('Failed to report lost item');
    }
  };

  const getLostItems = () => {
    return items.filter(item => item.status === ItemStatus.LOST);
  };

  const getFoundItems = () => {
    return items.filter(item => item.status === ItemStatus.FOUND);
  };

  const checkForMatches = (newItem: Item): Item[] => {
    const itemsToCheckAgainst = newItem.status === ItemStatus.LOST ? 
      items.filter(item => item.status === ItemStatus.FOUND) :
      items.filter(item => item.status === ItemStatus.LOST);
    
    return itemsToCheckAgainst.filter(item => 
      item.name.toLowerCase().includes(newItem.name.toLowerCase()) ||
      item.category.toLowerCase().includes(newItem.category.toLowerCase())
    );
  };

  const getClaimAttempts = (itemId: string) => {
    return claimAttempts.filter(claim => claim.itemId === itemId);
  };

  const reviewClaim = async (itemId: string, claimId: string, status: ClaimStatus, responseText?: string) => {
    if (!user) {
      toast.error("You must be logged in to review claims");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/items/${itemId}/review-claim`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ claimId, status, response: responseText })
      });

      if (!response.ok) {
        throw new Error('Failed to review claim');
      }

      const updatedItem = await response.json();
      setItems(prevItems => 
        prevItems.map(item => item.id === itemId ? updatedItem : item)
      );
      toast.success(status === ClaimStatus.APPROVED ? "Claim approved!" : "Claim rejected");
    } catch (error) {
      console.error('Error reviewing claim:', error);
      toast.error('Failed to review claim');
    }
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
