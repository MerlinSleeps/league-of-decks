// src/components/site/Header.tsx

"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LoginModal } from '@/components/auth/LoginModal';

export default function Header() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    // This <header> is the main flex container
    <header className="container mx-auto p-4 flex justify-between items-center border-b border-gray-700">
      
      {/* 1. This new <div> groups the Logo and Nav Links together on the LEFT */}
      <div className="flex items-center gap-6">
        <Link href="/" className="text-2xl font-bold text-white">
          League of Decks
        </Link>

        {/* 2. This <nav> holds your new links */}
        <nav className="flex gap-4">
          <Link href="/cards" className="text-gray-300 hover:text-white">
            Gallery
          </Link>
          <Link href="/build" className="text-gray-300 hover:text-white">
            Builder
          </Link>
          <Link href="/my-decks" className="text-gray-300 hover:text-white">
            My Decks
          </Link>
        </nav>
      </div>

      {/* 3. This <nav> (which you already had) stays on the RIGHT */}
      <nav>
        {user ? (
          // User is logged in
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user.email}</span>
            <Button onClick={handleLogout} variant="outline">
              Log Out
            </Button>
          </div>
        ) : (
          // User is logged out
          <LoginModal>
            <Button>Log In</Button>
          </LoginModal>
        )}
      </nav>
    </header>
  );
}