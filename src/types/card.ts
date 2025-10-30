export interface Card {
  id: string;
  name: string;
  type: "Champion" | "Follower" | "Spell";
  cost: number;
  faction: "Noxus" | "Demacia";
  text: string;
  might: number | null;
  imageUrl: string;
}