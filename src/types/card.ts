export interface Card {
  id: string;
  name: string;
  type: "Champion" | "Follower" | "Spell"; // Use a union for specific types
  cost: number;
  faction: "Noxus" | "Demacia"; // Add other factions as you find them
  text: string;
  might: number | null; // Spells have null might
  imageUrl: string;
}