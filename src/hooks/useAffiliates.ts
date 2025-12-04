import { useState, useCallback } from 'react';
import { Affiliate } from '@/types/affiliate';

const STORAGE_KEY = 'affiliates-data';

const loadFromStorage = (): Affiliate[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.map((a: Affiliate) => ({
        ...a,
        createdAt: new Date(a.createdAt),
      }));
    }
  } catch (e) {
    console.error('Error loading affiliates:', e);
  }
  return [];
};

const saveToStorage = (affiliates: Affiliate[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(affiliates));
};

export function useAffiliates() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>(loadFromStorage);

  const addAffiliate = useCallback((name: string, initialSales: number = 0) => {
    const newAffiliate: Affiliate = {
      id: crypto.randomUUID(),
      name,
      totalSales: initialSales,
      salesCount: initialSales > 0 ? 1 : 0,
      createdAt: new Date(),
    };

    setAffiliates((prev) => {
      const updated = [...prev, newAffiliate];
      saveToStorage(updated);
      return updated;
    });

    return newAffiliate;
  }, []);

  const updateAffiliateSales = useCallback((id: string, amount: number) => {
    setAffiliates((prev) => {
      const updated = prev.map((a) =>
        a.id === id
          ? { ...a, totalSales: a.totalSales + amount, salesCount: a.salesCount + 1 }
          : a
      );
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const removeAffiliate = useCallback((id: string) => {
    setAffiliates((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const editAffiliate = useCallback((id: string, updates: Partial<Pick<Affiliate, 'name' | 'totalSales'>>) => {
    setAffiliates((prev) => {
      const updated = prev.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      );
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const sortedAffiliates = [...affiliates].sort((a, b) => b.totalSales - a.totalSales);
  const totalSales = affiliates.reduce((sum, a) => sum + a.totalSales, 0);

  return {
    affiliates: sortedAffiliates,
    totalSales,
    addAffiliate,
    updateAffiliateSales,
    removeAffiliate,
    editAffiliate,
  };
}
