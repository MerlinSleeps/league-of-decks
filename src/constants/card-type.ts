export const CARD_TYPE = {
  Legend: "Legend",
  Champion: "Champion",
  Signature: "Signature",
  Unit: "Unit",
  Spell: "Spell",
  Gear: "Gear",
  Rune: "Rune",
  Battlefield: "Battlefield",
} as const;

export type CardType = keyof typeof CARD_TYPE;
export type CardTypeValue = (typeof CARD_TYPE)[CardType];
