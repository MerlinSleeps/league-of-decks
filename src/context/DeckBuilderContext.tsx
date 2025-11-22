// src/context/DeckBuilderContext.tsx

"use client";

import type { Card, DeckEntry, Domain } from '@/types/card';
import React, { createContext, useContext, useState, useMemo } from 'react';

// --- DECK BUILDING RULES (from our conversation) ---
const RULES = {
  MAIN_DECK_MIN_SIZE: 40,
  MAIN_DECK_MAX_SIZE: 100, // Our new rule
  RUNE_DECK_SIZE: 12,
  BATTLEFIELD_DECK_SIZE: 3,
  MAIN_DECK_COPY_LIMIT: 3,
  SIGNATURE_CARD_LIMIT: 3,
};

// --- VALIDATION LOGIC ---

/**
 * Helper function to check if a card's domains are a subset
 * of the deck's domain identity.
 * Rule 103.1.b.4: A multi-domain card is only allowed if the
 * identity contains ALL of the card's domains.
 */
function isCardInDomain(card: Card, identity: Domain[]): boolean {
  if (identity.length === 0) return false; // No legend selected
  return card.domains.every((domain) => identity.includes(domain));
}

// --- CONTEXT DEFINITION ---

// This is the shape of our validation results
export interface ValidationState {
  domainIdentity: Domain[];
  championTag: string | null;

  // Main Deck
  totalMainDeckCards: number;
  isMainDeckSizeValid: boolean;
  mainDeckErrors: string[]; // e.g., ["Fireball: Max 3 copies", "Garen: Invalid Domain"]
  
  // Signature Cards
  totalSignatureCards: number;
  isSignatureCardCountValid: boolean;
  
  // Rune Deck
  totalRuneCards: number;
  isRuneDeckSizeValid: boolean;
  runeDeckErrors: string[];
  
  // Battlefield Deck
  totalBattlefieldCards: number;
  isBattlefieldDeckSizeValid: boolean;
  isBattlefieldDeckUnique: boolean;
  battlefieldDeckErrors: string[];

  // Overall
  isDeckValid: boolean;
}

// This is the new shape of our context
interface DeckBuilderContextType {
  // 1. The four new deck lists
  championLegend: Card | null;
  mainDeck: DeckEntry[];
  runeDeck: DeckEntry[];
  battlefieldDeck: DeckEntry[];

  // 2. New, smarter add/remove functions
  addCard: (card: Card) => void;
  removeFromMainDeck: (cardId: string) => void;
  removeFromRuneDeck: (cardId: string) => void;
  removeFromBattlefieldDeck: (cardId: string) => void;
  setLegend: (card: Card) => void;

  // 3. The real-time validation state
  validation: ValidationState;
}

const DeckBuilderContext = createContext<DeckBuilderContextType | undefined>(
  undefined
);

// --- PROVIDER COMPONENT ---

export const DeckBuilderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // We now have 4 separate states for our deck
  const [championLegend, setChampionLegend] = useState<Card | null>(null);
  const [mainDeck, setMainDeck] = useState<DeckEntry[]>([]);
  const [runeDeck, setRuneDeck] = useState<DeckEntry[]>([]);
  const [battlefieldDeck, setBattlefieldDeck] = useState<DeckEntry[]>([]);

  // --- 1. CORE DECK LOGIC (ADD/REMOVE) ---

  const setLegend = (card: Card) => {
    if (card.cardType === 'Legend') {
      setChampionLegend(card);
    }
  };

  /**
   * A smart 'addCard' function that puts the card in the right deck
   * based on its 'cardType'.
   */
  const addCard = (cardToAdd: Card) => {
    switch (cardToAdd.cardType) {
      case 'Legend':
        setChampionLegend(cardToAdd);
        break;
      
      case 'Rune':
        setRuneDeck((current) => {
          const entry = current.find((e) => e.card.id === cardToAdd.id);
          if (entry) {
            // Runes also follow the 3-copy rule? Let's assume yes.
            // ASK: Is there a copy limit for Runes? Assuming 3.
            return current.map((e) =>
              e.card.id === cardToAdd.id
                ? { ...e, count: Math.min(e.count + 1, RULES.MAIN_DECK_COPY_LIMIT) } 
                : e
            );
          }
          return [...current, { card: cardToAdd, count: 1 }];
        });
        break;

      case 'Battlefield':
        setBattlefieldDeck((current) => {
          const exists = current.find((e) => e.card.id === cardToAdd.id);
          if (exists) return current; // Rule 103.4.c: No duplicates
          return [...current, { card: cardToAdd, count: 1 }];
        });
        break;

      // All other types go into the Main Deck
      case 'Champion':
      case 'Unit':
      case 'Spell':
      case 'Gear':
        setMainDeck((current) => {
          const entry = current.find((e) => e.card.id === cardToAdd.id);
          if (entry) {
            // Enforce 3-copy limit
            return current.map((e) =>
              e.card.id === cardToAdd.id
                ? { ...e, count: Math.min(e.count + 1, RULES.MAIN_DECK_COPY_LIMIT) }
                : e
            );
          }
          return [...current, { card: cardToAdd, count: 1 }];
        });
        break;
    }
  };

  // We need separate remove functions for each deck list
  const removeFromMainDeck = (cardId: string) => {
    setMainDeck((current) => {
      const entry = current.find((e) => e.card.id === cardId);
      if (entry && entry.count > 1) {
        return current.map((e) =>
          e.card.id === cardId ? { ...e, count: e.count - 1 } : e
        );
      }
      return current.filter((e) => e.card.id !== cardId);
    });
  };

  const removeFromRuneDeck = (cardId: string) => {
    setRuneDeck((current) => {
      // (Similar logic to removeFromMainDeck)
      const entry = current.find((e) => e.card.id === cardId);
      if (entry && entry.count > 1) {
        return current.map((e) =>
          e.card.id === cardId ? { ...e, count: e.count - 1 } : e
        );
      }
      return current.filter((e) => e.card.id !== cardId);
    });
  };

  const removeFromBattlefieldDeck = (cardId: string) => {
    setBattlefieldDeck((current) => current.filter((e) => e.card.id !== cardId));
  };


  // --- 2. REAL-TIME VALIDATION LOGIC ---

  /**
   * This 'useMemo' hook is the "brain".
   * It watches all 4 deck lists and recalculates the
   * validation state ONLY when one of them changes.
   */
  const validation = useMemo((): ValidationState => {
    const state: ValidationState = {
      domainIdentity: championLegend?.domains || [],
      championTag: championLegend?.championTag || null,
      
      totalMainDeckCards: 0,
      isMainDeckSizeValid: false,
      mainDeckErrors: [],

      totalSignatureCards: 0,
      isSignatureCardCountValid: false,

      totalRuneCards: 0,
      isRuneDeckSizeValid: false,
      runeDeckErrors: [],

      totalBattlefieldCards: 0,
      isBattlefieldDeckSizeValid: false,
      isBattlefieldDeckUnique: true, // Assume true
      battlefieldDeckErrors: [],

      isDeckValid: false,
    };

    if (!championLegend) {
      state.isDeckValid = false;
      return state; // No legend, nothing is valid
    }

    // --- Main Deck Validation ---
    state.totalMainDeckCards = mainDeck.reduce((sum, e) => sum + e.count, 0);
    state.isMainDeckSizeValid =
      state.totalMainDeckCards >= RULES.MAIN_DECK_MIN_SIZE &&
      state.totalMainDeckCards <= RULES.MAIN_DECK_MAX_SIZE;
    
    // Check Main Deck copies, domains, and signature rules
    mainDeck.forEach((entry) => {
      // Rule 103.2.b: 3-copy limit
      if (entry.count > RULES.MAIN_DECK_COPY_LIMIT) {
        state.mainDeckErrors.push(`${entry.card.name}: Max ${RULES.MAIN_DECK_COPY_LIMIT} copies allowed.`);
      }
      // Rule 103.2.c: Domain Identity
      if (!isCardInDomain(entry.card, state.domainIdentity)) {
        state.mainDeckErrors.push(`${entry.card.name}: Not in your Domain Identity.`);
      }
      // Rule 103.2.a.2: Chosen Champion tag match
      if (entry.card.cardType === 'Champion' && entry.card.championTag !== state.championTag) {
        state.mainDeckErrors.push(`${entry.card.name}: Champion tag does not match Legend.`);
      }
      // Rule 103.2.d.2: Signature card tag match
      if (entry.card.isSignature && entry.card.championTag !== state.championTag) {
        state.mainDeckErrors.push(`${entry.card.name}: Signature card does not match Legend.`);
      }
    });
    
    // Rule 103.2.d.1: 3-signature card limit
    state.totalSignatureCards = mainDeck
      .filter((e) => e.card.isSignature)
      .reduce((sum, e) => sum + e.count, 0);
    state.isSignatureCardCountValid = state.totalSignatureCards <= RULES.SIGNATURE_CARD_LIMIT;


    // --- Rune Deck Validation ---
    state.totalRuneCards = runeDeck.reduce((sum, e) => sum + e.count, 0);
    state.isRuneDeckSizeValid = state.totalRuneCards === RULES.RUNE_DECK_SIZE;
    
    runeDeck.forEach((entry) => {
      // Rule 103.3.a.1: Domain Identity
      if (!isCardInDomain(entry.card, state.domainIdentity)) {
        state.runeDeckErrors.push(`${entry.card.name}: Not in your Domain Identity.`);
      }
    });

    // --- Battlefield Deck Validation ---
    state.totalBattlefieldCards = battlefieldDeck.length;
    state.isBattlefieldDeckSizeValid = state.totalBattlefieldCards === RULES.BATTLEFIELD_DECK_SIZE;
    
    // Rule 103.4.c: No duplicates
    const battlefieldNames = new Set(battlefieldDeck.map(e => e.card.name));
    state.isBattlefieldDeckUnique = battlefieldNames.size === battlefieldDeck.length;
    if (!state.isBattlefieldDeckUnique) {
      state.battlefieldDeckErrors.push("Battlefield deck cannot have duplicate cards.");
    }
    
    battlefieldDeck.forEach((entry) => {
      // Rule 103.4.b: Domain Identity
      if (!isCardInDomain(entry.card, state.domainIdentity)) {
        state.battlefieldDeckErrors.push(`${entry.card.name}: Not in your Domain Identity.`);
      }
    });

    // --- Overall Validation ---
    state.isDeckValid =
      championLegend !== null &&
      state.isMainDeckSizeValid &&
      state.isSignatureCardCountValid &&
      state.isRuneDeckSizeValid &&
      state.isBattlefieldDeckSizeValid &&
      state.isBattlefieldDeckUnique &&
      state.mainDeckErrors.length === 0 &&
      state.runeDeckErrors.length === 0 &&
      state.battlefieldDeckErrors.length === 0;

    return state;
  }, [championLegend, mainDeck, runeDeck, battlefieldDeck]); // Re-run when any list changes

  
  // --- 3. FINAL CONTEXT VALUE ---
  
  const value = {
    championLegend,
    mainDeck,
    runeDeck,
    battlefieldDeck,
    addCard,
    removeFromMainDeck,
    removeFromRuneDeck,
    removeFromBattlefieldDeck,
    setLegend,
    validation, // Provide the validation state to the app
  };

  return (
    <DeckBuilderContext.Provider value={value}>
      {children}
    </DeckBuilderContext.Provider>
  );
};

// Custom hook to easily use the context
export const useDeckBuilder = () => {
  const context = useContext(DeckBuilderContext);
  if (context === undefined) {
    throw new Error('useDeckBuilder must be used within a DeckBuilderProvider');
  }
  return context;
};