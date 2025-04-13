
export enum ItemStatus {
  FOUND = "found",
  CLAIMED = "claimed",
  RETURNED = "returned"
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
  name: string;
  description: string;
  category: string;
  location: string;
  dateFound: string;
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
}

export interface ClaimAttempt {
  id: string;
  itemId: string;
  userId: string;
  userName: string;
  answers: { questionId: string; answer: string }[];
  isSuccessful: boolean;
  createdAt: string;
}
