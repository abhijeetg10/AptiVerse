import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface PlatformRatings {
  total: number;
  average: number;
  loading: boolean;
}

// In-memory cache to prevent redundant fetches across pages
let cachedRatings: { total: number; average: number } | null = null;

export const usePlatformRatings = () => {
  const [ratings, setRatings] = useState<PlatformRatings>({
    total: cachedRatings?.total ?? 0,
    average: cachedRatings?.average ?? 5.0,
    loading: !cachedRatings,
  });

  useEffect(() => {
    if (cachedRatings) {
      return;
    }

    let isMounted = true;
    const fetchRatings = async () => {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('rating');

        if (error) throw error;

        if (data && data.length > 0) {
          const valid = data.filter((d) => d.rating && d.rating > 0);
          const total = valid.length;
          const sum = valid.reduce((acc, curr) => acc + curr.rating, 0);
          const average = total > 0 ? Number((sum / total).toFixed(1)) : 5.0;

          const result = { total, average };
          cachedRatings = result;
          if (isMounted) {
            setRatings({ total, average, loading: false });
          }
        } else {
          const result = { total: 0, average: 5.0 };
          cachedRatings = result;
          if (isMounted) setRatings({ total: 0, average: 5.0, loading: false });
        }
      } catch (err) {
        console.error('Error fetching platform ratings:', err);
        if (isMounted) {
          setRatings({ total: 0, average: 5.0, loading: false });
        }
      }
    };

    fetchRatings();
    return () => {
      isMounted = false;
    };
  }, []);

  return ratings;
};
