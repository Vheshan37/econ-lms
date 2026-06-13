export type UserRole = "admin" | "student" | "guest";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedYears?: string[]; // For students, e.g., ['2025', '2026']
}

export interface Resource {
  id: string;
  title: string;
  type: "pdf" | "video" | "quiz";
  url: string;
  yearId: string; // e.g., '2025'
  subject?: string;
  isFree?: boolean;
  createdAt: string;
}

export interface Year {
  id: string; // '2025'
  name: string; // '2025 A/L'
  description?: string;
}

export interface Quiz {
  id: string;
  title: string;
  yearId: string;
  questions: {
    id: string;
    text: string;
    options: string[];
    correctOption: number;
  }[];
}
