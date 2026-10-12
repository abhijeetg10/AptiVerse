import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export type UserProfile = {
  id: string;
  name: string;
  college: string;
  department?: string;
  email?: string;
  avatar_url?: string;
  role?: string;
  is_blocked?: boolean;
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
  updateProfile: (name: string, college: string, department?: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from Supabase
  const fetchProfile = async (userId: string) => {
    const localDept = localStorage.getItem('aptiverse_user_department_' + userId) || '';

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    const { data: { session } } = await supabase.auth.getSession();
    const metaDept = session?.user?.user_metadata?.department || localDept;
    const metaName = session?.user?.user_metadata?.full_name || '';

    if (data && !error) {
      setUser({
        id: data.id,
        name: data.name || metaName || '',
        college: data.college || '',
        department: (data as any).department || metaDept || '',
        email: data.email || session?.user?.email,
        avatar_url: data.avatar_url || session?.user?.user_metadata?.avatar_url,
        role: data.role || 'user',
        is_blocked: data.is_blocked || false,
      });
    } else {
      // If profile doesn't exist yet, seed with auth user metadata
      setUser({
        id: userId,
        name: metaName,
        college: session?.user?.user_metadata?.college || '',
        department: metaDept || '',
        email: session?.user?.email,
        avatar_url: session?.user?.user_metadata?.avatar_url,
        role: 'user',
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

  const updateProfile = async (name: string, college: string, department?: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id || authUser?.id;
    
    if (!currentUserId) return { error: new Error('Not authenticated') };

    if (department) {
      localStorage.setItem('aptiverse_user_department_' + currentUserId, department);
    }
    
    // Sync into auth user metadata so it stays persistent with OAuth session
    await supabase.auth.updateUser({
      data: {
        full_name: name,
        college,
        department: department || ''
      }
    });
    
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', currentUserId)
      .maybeSingle();

    const avatar_url = authUser?.user_metadata?.avatar_url || user?.avatar_url || null;

    let error: any = null;
    const payloadWithDept: any = { 
      name, 
      college, 
      avatar_url, 
      updated_at: new Date().toISOString() 
    };
    if (department) payloadWithDept.department = department;

    const isColumnMissingError = (err: any) => {
      if (!err) return false;
      const code = String(err.code || '');
      const msg = String(err.message || '').toLowerCase();
      return code === '42703' || code === 'PGRST204' || msg.includes('department') || msg.includes('schema cache');
    };

    if (existingProfile) {
      payloadWithDept.is_blocked = false;
      const res = await supabase
        .from('profiles')
        .update(payloadWithDept)
        .eq('id', currentUserId);
      if (res.error && isColumnMissingError(res.error)) {
        const { department: _, ...payloadWithoutDept } = payloadWithDept;
        const fallbackRes = await supabase
          .from('profiles')
          .update(payloadWithoutDept)
          .eq('id', currentUserId);
        error = fallbackRes.error;
      } else {
        error = res.error;
      }
    } else {
      const res = await supabase
        .from('profiles')
        .insert({ id: currentUserId, ...payloadWithDept });
      if (res.error && isColumnMissingError(res.error)) {
        const { department: _, ...payloadWithoutDept } = payloadWithDept;
        const fallbackRes = await supabase
          .from('profiles')
          .insert({ id: currentUserId, ...payloadWithoutDept });
        error = fallbackRes.error;
      } else {
        error = res.error;
      }
    }
      
    if (!error) {
      setUser((prev) => ({
        ...(prev || {}),
        id: currentUserId,
        name,
        college,
        department: department || prev?.department || '',
        avatar_url,
        is_blocked: false
      } as UserProfile));
      return { error: null };
    } else {
      console.error("Failed to update profile:", error);
      return { error };
    }
  };

  const isProfileComplete = !!(user?.name && user?.college && user?.department);

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
