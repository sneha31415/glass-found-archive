export enum ItemStatus {
  FOUND = "found",
  CLAIMED = "claimed",
  RETURNED = "returned",
  LOST = "lost",
  MATCHED = "matched" // When a lost item is matched with a found item
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user"
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Question {
  id: string;
  question: string;
  answer: string;
}

export interface Item {
  id: string;
  _id?: string; // MongoDB's default ID field
  name: string;
  description: string;
  category: string;
  location: string;
  dateFound?: string;
  dateLost?: string;
  reportedBy: string;
  reporterName: string;
  reporterContact: string;
  status: ItemStatus;
  imageUrl?: string;
  questions: Question[];
  claimedBy?: string;
  returnedDate?: string;
  createdAt: string;
  updatedAt: string;
  isLostItem?: boolean; // Flag to distinguish lost items
}

export enum ClaimStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface ClaimAttempt {
  id: string;
  itemId: string;
  userId: string;
  userName: string;
  answers: { questionId: string; answer: string }[];
  status: ClaimStatus;
  createdAt: string;
  updatedAt: string;
  reporterResponse?: string;
}
