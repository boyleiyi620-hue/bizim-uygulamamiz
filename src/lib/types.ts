export type Theme = "dark" | "romantic" | "light";

export interface Partner {
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  assignee: "p1" | "p2" | "both";
  done: boolean;
  createdAt: string;
  doneAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  emoji: string;
}

export interface ShoppingItem {
  id: string;
  title: string;
  done: boolean;
}

export interface Photo {
  id: string;
  dataUrl: string;
  note: string;
  date: string;
}

export interface SpecialDay {
  id: string;
  title: string;
  date: string; // MM-DD
  emoji: string;
}

export interface Score {
  id: string;
  game: string;
  winner: "p1" | "p2" | "beraber";
  p1: number;
  p2: number;
  date: string;
}

export interface Message {
  id: string;
  from: "p1" | "p2";
  text: string;
  date: string;
}

export interface Heart {
  id: string;
  from: "p1" | "p2";
  date: string;
}

export interface QuestionAnswer {
  id: string;
  question: string;
  a1: string;
  a2: string;
  date: string;
}

export interface SurpriseDone {
  id: string;
  text: string;
  category: string;
  date: string;
}

export interface CoupleState {
  code: string;
  p1: Partner;
  p2: Partner;
  startDate: string; // YYYY-MM-DD
  theme: Theme;
  tasks: Task[];
  goals: Goal[];
  shopping: ShoppingItem[];
  photos: Photo[];
  specialDays: SpecialDay[];
  scores: Score[];
  messages: Message[];
  hearts: Heart[];
  questionAnswers: QuestionAnswer[];
  surprises: SurpriseDone[];
  favoriteQuestions: string[];
  updatedAt: number;
}

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export function emptyState(code: string, p1: Partner, p2: Partner, startDate: string): CoupleState {
  return {
    code,
    p1,
    p2,
    startDate,
    theme: "dark",
    tasks: [],
    goals: [],
    shopping: [],
    photos: [],
    specialDays: [
      { id: uid(), title: "Tanışma / İlk buluşma", date: startDate.slice(5), emoji: "💞" },
    ],
    scores: [],
    messages: [],
    hearts: [],
    questionAnswers: [],
    surprises: [],
    favoriteQuestions: [],
    updatedAt: Date.now(),
  };
}
