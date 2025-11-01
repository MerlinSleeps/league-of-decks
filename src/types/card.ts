export interface Card {
  id: string;
  name: string;
  type: string;
  cost: number;
  faction: string;
  text: string;
  might: number;
  imageUrl: string;
}

export interface DeckEntry {
  card: Card;
  count: number;
}

export interface ApiCardArtDTO {
  fullURL: string;
}

export interface ApiCardStatsDTO {
  cost: number;
  might: number;
}

export interface ApiCardDTO {
  id: string;
  name: string;
  description: string;
  type: string;
  faction: string;
  stats: ApiCardStatsDTO;
  art: ApiCardArtDTO;
}

export interface ApiSetDTO {
  id: string;
  name: string;
  cards: ApiCardDTO[];
}

export interface ApiRiftboundContentDTO {
  game: string;
  version: string;
  sets: ApiSetDTO[];
}