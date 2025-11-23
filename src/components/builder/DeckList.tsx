"use client";

import { useState } from 'react';
import { useDeckBuilder } from '@/context/DeckBuilderContext';
import { useAuth } from '@/context/AuthContext';

import { Button } from '@/components/ui/button';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';

export default function DeckList() {
  const {
    championLegend,
    mainDeck,
    runeDeck,
    battlefieldDeck,
    removeFromMainDeck,
    removeFromRuneDeck,
    removeFromBattlefieldDeck,
    validation
  } = useDeckBuilder();

  const { user } = useAuth();
  const [deckName, setDeckName] = useState('');

  const handleSaveDeck = async () => {
    if (!user) {
      alert('You must be logged in to save a deck.');
      return;
    }
    try {
      const token = await user.getIdToken();

      const fullDeck = {
        legend: championLegend,
        mainDeck,
        runeDeck,
        battlefieldDeck
      };

      const response = await fetch('/api/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: deckName, deck: fullDeck }),
      });
      if (!response.ok) throw new Error('Failed to save deck');
      alert('Deck saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Error saving deck.');
    }
  };

  return (
    <aside className="sticky top-24 bg-gray-900 p-4 rounded-lg border border-gray-700 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Deck</h2>
        <div className="flex items-center gap-2">
          {validation.isDeckValid ? (
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-600 text-white hover:bg-green-700">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Valid
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-red-600 text-white hover:bg-red-700">
              <AlertCircle className="w-3 h-3 mr-1" /> Invalid
            </span>
          )}
        </div>
      </div>

      <div className="flex-grow pr-4 overflow-y-auto">
        <div className="space-y-6">

          {/* LEGEND SECTION */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Legend</h3>
            {championLegend ? (
              <div className="bg-purple-900/30 border border-purple-500/50 p-3 rounded flex items-center gap-3">
                <img src={championLegend.art.thumbnailURL} alt={championLegend.name} className="w-12 h-12 rounded object-cover" />
                <div>
                  <p className="font-bold text-purple-200">{championLegend.name}</p>
                  <p className="text-xs text-purple-300">{championLegend.faction}</p>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-gray-600 rounded p-4 text-center text-gray-500 text-sm">
                Select a Legend to start
              </div>
            )}
          </div>

          {/* MAIN DECK SECTION */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Main Deck</h3>
              <span className={`text-xs font-bold ${validation.isMainDeckSizeValid ? 'text-green-400' : 'text-red-400'}`}>
                {validation.totalMainDeckCards} / 40
              </span>
            </div>

            {validation.mainDeckErrors.length > 0 && (
              <div className="mb-2 p-2 bg-red-900/20 border border-red-900 rounded text-xs text-red-300">
                {validation.mainDeckErrors.map((err, i) => <div key={i}>• {err}</div>)}
              </div>
            )}

            <div className="space-y-1">
              {mainDeck.map(({ card, count }) => (
                <div key={card.id} className="group flex justify-between items-center bg-gray-800/50 hover:bg-gray-800 p-2 rounded text-sm transition-colors">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center text-xs font-mono text-gray-400">{card.stats.cost}</div>
                    <span className="truncate">{card.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">x{count}</span>
                    <button
                      onClick={() => removeFromMainDeck(card.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RUNE DECK SECTION */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Rune Deck</h3>
              <span className={`text-xs font-bold ${validation.isRuneDeckSizeValid ? 'text-green-400' : 'text-red-400'}`}>
                {validation.totalRuneCards} / 12
              </span>
            </div>

            {validation.runeDeckErrors.length > 0 && (
              <div className="mb-2 p-2 bg-red-900/20 border border-red-900 rounded text-xs text-red-300">
                {validation.runeDeckErrors.map((err, i) => <div key={i}>• {err}</div>)}
              </div>
            )}

            <div className="space-y-1">
              {runeDeck.map(({ card, count }) => (
                <div key={card.id} className="group flex justify-between items-center bg-gray-800/50 hover:bg-gray-800 p-2 rounded text-sm transition-colors">
                  <span className="truncate text-blue-200">{card.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">x{count}</span>
                    <button
                      onClick={() => removeFromRuneDeck(card.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BATTLEFIELD DECK SECTION */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Battlefield</h3>
              <span className={`text-xs font-bold ${validation.isBattlefieldDeckSizeValid ? 'text-green-400' : 'text-red-400'}`}>
                {validation.totalBattlefieldCards} / 3
              </span>
            </div>

            {validation.battlefieldDeckErrors.length > 0 && (
              <div className="mb-2 p-2 bg-red-900/20 border border-red-900 rounded text-xs text-red-300">
                {validation.battlefieldDeckErrors.map((err, i) => <div key={i}>• {err}</div>)}
              </div>
            )}

            <div className="space-y-1">
              {battlefieldDeck.map(({ card, count }) => (
                <div key={card.id} className="group flex justify-between items-center bg-gray-800/50 hover:bg-gray-800 p-2 rounded text-sm transition-colors">
                  <span className="truncate text-orange-200">{card.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromBattlefieldDeck(card.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full" disabled={!validation.isDeckValid || !user}>
              {user ? 'Save Deck' : 'Log in to save'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Save Your Deck</AlertDialogTitle>
              <AlertDialogDescription>
                Give your new deck a name.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input
              placeholder="My Awesome Deck"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSaveDeck}>
                Save
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
}