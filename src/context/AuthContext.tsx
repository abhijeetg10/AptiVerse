import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export type UserProfile = {
  id: string;
  name: string;
  college: string;
  email?: string;
  avatar_url?: string;
};

interface AuthContextType {
  user: UserProfile | null;
  authUser: User | null;
  isLoading: boolean;
  isProfileComplete: boolean;
  signIn: (email: string, password?: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (name: string, college: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from Supabase
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (data && !error) {
      setUser({
        id: data.id,
        name: data.name || '',
        college: data.college || '',
        email: data.email,
        avatar_url: data.avatar_url,
      });
    } else {
      // If profile doesn't exist yet, we still need to set user to something so they can complete it
      setUser({
        id: userId,
        name: '',
        college: '',
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password?: string) => {
    if (password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    }
    // Fallback to OTP if no password provided
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });
    return { error };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (name: string, college: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id || authUser?.id;
    
    if (!currentUserId) return { error: new Error('Not authenticated') };
    
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', currentUserId)
      .maybeSingle();

    let error;
    if (existingProfile) {
      // Update existing
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ name, college, updated_at: new Date().toISOString() })
        .eq('id', currentUserId);
      error = updateError;
    } else {
      // Insert new
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: currentUserId, name, college, updated_at: new Date().toISOString() });
      error = insertError;
    }
      
    if (!error) {
      setUser((prev) => ({
        ...(prev || {}),
        id: currentUserId,
        name,
        college,
      } as UserProfile));
      return { error: null };
    } else {
      console.error("Failed to update profile:", error);
      return { error };
    }
  };

  const isProfileComplete = !!(user?.name && user?.college);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, authUser, isLoading, updateProfile, signIn, signInWithGoogle, signUp, signOut, isProfileComplete }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
