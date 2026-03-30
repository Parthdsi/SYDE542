export type Screen = "machines" | "workout" | "swap" | "live" | "help";

export interface Exercise {
  id: string;
  name: string;
  weight: number;
  sets: number;
  reps: number;
  setsCompleted: number;
  station: string;
  zone: string;
  available: boolean;
  waitingCount?: number;
  waitTime?: number;
}
