export interface CardStatsDTO {
  energy: number;
  might: number;
  cost: number;
  power: number;
};

export interface CardArtDTO {
  thumbnailURL: string;
  fullURL: string;
  artist: string;
}

export interface Card {
  id: string;
  collectorNumber: number;
  set: string;       
  name: string; // card name
  description: string;
  type: string;
  rarity: string; // common, uncommon, rare, epic, overnumbered and alterante art
  faction: string;
  stats: CardStatsDTO;
  keywords: string[];
  art: CardArtDTO;
  flavorText: string;
  tags: string[]; // additional tags on the card like Signature Card, faction (eg. Ionia), etc.
}

export interface DeckEntry {
  card: Card;
  count: number;
}