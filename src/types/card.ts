export type Domain = string;

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
  name: string;
  description: string;
  type: string;
  rarity: string;
  faction: string;
  stats: CardStatsDTO;
  keywords: string[];
  art: CardArtDTO;
  flavorText: string;
  tags: string[];
}

export interface DeckEntry {
  card: Card;
  count: number;
}