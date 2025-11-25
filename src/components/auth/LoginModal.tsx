"use client";

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*.])[\S]{8,}$/;

type AuthMode = 'login' | 'signup' | 'reset';

export function LoginModal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');

  // Form State
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Feedback State
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when opening/closing
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setMode('login');
      setError(null);
      setSuccessMessage(null);
      setEmail('');
      setPassword('');
      setUsername('');
    }
  };

  const handleAuthAction = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      // --- 1. HANDLE LOGIN ---
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        setIsOpen(false);
      }

      // --- 2. HANDLE SIGN UP ---
      else if (mode === 'signup') {

        if (!PASSWORD_REGEX.test(password)) {
          throw new Error("Password must be at least 8 characters and contain a number and a special character (!@#$%^&*.).");
        }
        if (!username.trim()) {
          throw new Error("Username is required.");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: username });

        await setDoc(doc(db, "users", user.uid), {
          username: username,
          email: email,
          createdAt: serverTimestamp(),
          deckCount: 0,
        });

        setIsOpen(false);
      }

      // --- 3. HANDLE PASSWORD RESET ---
      else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setSuccessMessage("Check your email for a password reset link.");
        setIsLoading(false);
        return;
      }

    } catch (err: any) {
      let msg = err.message;
      if (msg.includes("auth/email-already-in-use")) msg = "Email is already registered.";
      if (msg.includes("auth/invalid-credential")) msg = "Invalid email or password.";
      if (msg.includes("auth/weak-password")) msg = "Password is too weak.";
      setError(msg);
    } finally {
      if (mode !== 'reset') setIsLoading(false);
    }
  };

  const getTitle = () => {
    if (mode === 'login') return "Welcome Back";
    if (mode === 'signup') return "Create an Account";
    return "Reset Password";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">{getTitle()}</DialogTitle>
          <DialogDescription className="text-center">
            {mode === 'reset'
              ? "Enter your email to receive a reset link."
              : "Enter your details to continue to Runic Library."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {mode === 'signup' && (
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="RiftMaster99"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          {mode !== 'reset' && (
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                {mode === 'login' && (
                  <button
                    className="text-xs text-cyan-400 hover:underline"
                    onClick={() => setMode('reset')}
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500 text-center font-medium">{error}</p>}
          {successMessage && <p className="text-sm text-green-500 text-center font-medium">{successMessage}</p>}

          <Button onClick={handleAuthAction} disabled={isLoading} className="w-full mt-2">
            {isLoading ? "Processing..." : (
              mode === 'login' ? "Log In" :
                mode === 'signup' ? "Sign Up" : "Send Reset Link"
            )}
          </Button>

          <div className="relative mt-2">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="text-center text-sm">
            {mode === 'login' ? (
              <p>
                Don't have an account?{" "}
                <button
                  className="text-cyan-400 hover:underline font-bold"
                  onClick={() => setMode('signup')}
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  className="text-cyan-400 hover:underline font-bold"
                  onClick={() => setMode('login')}
                >
                  Log In
                </button>
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}