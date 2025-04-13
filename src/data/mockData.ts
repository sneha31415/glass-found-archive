
import { Item, ItemStatus, User, UserRole } from "@/types";

export const mockUsers: User[] = [
  {
    id: "user1",
    email: "john.doe@vjti.ac.in",
    name: "John Doe",
    role: UserRole.ADMIN,
    createdAt: "2025-04-10T10:30:00Z",
  },
  {
    id: "user2",
    email: "jane.smith@vjti.ac.in",
    name: "Jane Smith",
    role: UserRole.USER,
    createdAt: "2025-04-10T11:45:00Z",
  },
  {
    id: "user3",
    email: "mike.jones@vjti.ac.in",
    name: "Mike Jones",
    role: UserRole.USER,
    createdAt: "2025-04-11T09:15:00Z",
  }
];

export const mockItems: Item[] = [
  {
    id: "item1",
    name: "Laptop",
    description: "Silver Dell XPS 15 laptop",
    category: "Electronics",
    location: "Library, 2nd Floor",
    dateFound: "2025-04-09T15:30:00Z",
    reportedBy: "user1",
    reporterName: "John Doe",
    reporterContact: "john.doe@vjti.ac.in",
    status: ItemStatus.FOUND,
    imageUrl: "https://i.imgur.com/JQNw7vY.jpg",
    questions: [
      {
        id: "q1",
        question: "What is the laptop's wallpaper?",
        answer: "Mountains"
      },
      {
        id: "q2",
        question: "What software is pinned to the taskbar?",
        answer: "Chrome, VSCode, Spotify"
      },
      {
        id: "q3",
        question: "Is there any sticker on the laptop?",
        answer: "Yes, VJTI logo sticker"
      }
    ],
    createdAt: "2025-04-09T15:35:00Z",
    updatedAt: "2025-04-09T15:35:00Z"
  },
  {
    id: "item2",
    name: "Water Bottle",
    description: "Blue Hydro Flask with stickers",
    category: "Personal Items",
    location: "Canteen",
    dateFound: "2025-04-10T12:15:00Z",
    reportedBy: "user2",
    reporterName: "Jane Smith",
    reporterContact: "jane.smith@vjti.ac.in",
    status: ItemStatus.CLAIMED,
    imageUrl: "https://i.imgur.com/PZm8nYy.jpg",
    questions: [
      {
        id: "q4",
        question: "What color is the bottle cap?",
        answer: "Black"
      },
      {
        id: "q5",
        question: "Name one sticker on the bottle",
        answer: "VJTI logo"
      }
    ],
    claimedBy: "user3",
    createdAt: "2025-04-10T12:20:00Z",
    updatedAt: "2025-04-11T14:30:00Z"
  },
  {
    id: "item3",
    name: "Calculator",
    description: "Texas Instruments TI-84 Plus",
    category: "Academic",
    location: "Room 303, Engineering Building",
    dateFound: "2025-04-11T09:45:00Z",
    reportedBy: "user3",
    reporterName: "Mike Jones",
    reporterContact: "mike.jones@vjti.ac.in",
    status: ItemStatus.FOUND,
    imageUrl: "https://i.imgur.com/MbrFOaZ.jpg",
    questions: [
      {
        id: "q6",
        question: "Is the battery cover present?",
        answer: "Yes"
      },
      {
        id: "q7",
        question: "What is written on the back of the calculator?",
        answer: "Owner's name: Priya Sharma"
      }
    ],
    createdAt: "2025-04-11T09:50:00Z",
    updatedAt: "2025-04-11T09:50:00Z"
  },
  {
    id: "item4",
    name: "Wireless Earbuds",
    description: "White AirPods Pro with case",
    category: "Electronics",
    location: "Computer Lab",
    dateFound: "2025-04-12T16:20:00Z",
    reportedBy: "user1",
    reporterName: "John Doe",
    reporterContact: "john.doe@vjti.ac.in",
    status: ItemStatus.RETURNED,
    imageUrl: "https://i.imgur.com/JBrUOl5.jpg",
    questions: [
      {
        id: "q8",
        question: "Is there any engraving on the case?",
        answer: "Yes, initials AS"
      },
      {
        id: "q9",
        question: "Are the earbuds charged?",
        answer: "Yes, about 80%"
      }
    ],
    claimedBy: "user2",
    returnedDate: "2025-04-13T10:15:00Z",
    createdAt: "2025-04-12T16:25:00Z",
    updatedAt: "2025-04-13T10:20:00Z"
  }
];
