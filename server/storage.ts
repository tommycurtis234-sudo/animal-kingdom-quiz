// Storage interface for the Animal Kingdom Quiz
// This app uses client-side state management, so storage is minimal

export interface IStorage {
  // Placeholder for future backend features
}

export class MemStorage implements IStorage {
  constructor() {
    // No server-side storage needed for MVP
  }
}

export const storage = new MemStorage();
