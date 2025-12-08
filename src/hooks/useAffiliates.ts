import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Affiliate } from '@/types/affiliate';

export type { Affiliate };

export function useAffiliates() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState(60000);

  const fetchAffiliates = useCallback(async () => {
    const { data, error } = await supabase
      .from('affiliates')
      .select('*')
      .order('total_sales', { ascending: false });

    if (!error && data) {
      setAffiliates(data);
    }
    setLoading(false);
  }, []);

  const fetchGoal = useCallback(async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'goal')
      .maybeSingle();

    if (!error && data) {
      setGoal(Number(data.value));
    }
  }, []);

  useEffect(() => {
    fetchAffiliates();
    fetchGoal();

    // Subscribe to realtime updates
    const affiliatesChannel = supabase
      .channel('affiliates-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'affiliates'
        },
        () => {
          fetchAffiliates();
        }
      )
      .subscribe();

    const salesChannel = supabase
      .channel('sales-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales'
        },
        () => {
          fetchAffiliates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(affiliatesChannel);
      supabase.removeChannel(salesChannel);
    };
  }, [fetchAffiliates, fetchGoal]);

  const addAffiliate = useCallback(async (name: string, initialSales: number = 0) => {
    const { data, error } = await supabase
      .from('affiliates')
      .insert({
        name,
        total_sales: initialSales,
        sales_count: initialSales > 0 ? 1 : 0,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }, []);

  const updateAffiliateSales = useCallback(async (id: string, amount: number) => {
    // First insert the sale
    const { error: saleError } = await supabase
      .from('sales')
      .insert({
        affiliate_id: id,
        amount,
      });

    if (saleError) {
      throw saleError;
    }

    // Then update affiliate totals
    const affiliate = affiliates.find(a => a.id === id);
    if (affiliate) {
      const { error } = await supabase
        .from('affiliates')
        .update({
          total_sales: Number(affiliate.total_sales) + amount,
          sales_count: affiliate.sales_count + 1,
        })
        .eq('id', id);

      if (error) {
        throw error;
      }
    }
  }, [affiliates]);

  const removeAffiliate = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('affiliates')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }, []);

  const editAffiliate = useCallback(async (id: string, updates: { name?: string; total_sales?: number; sales_count?: number }) => {
    const { error } = await supabase
      .from('affiliates')
      .update(updates)
      .eq('id', id);

    if (error) {
      throw error;
    }
  }, []);

  const updateGoal = useCallback(async (newGoal: number) => {
    const { error } = await supabase
      .from('settings')
      .update({ value: newGoal })
      .eq('key', 'goal');

    if (error) {
      throw error;
    }

    setGoal(newGoal);
  }, []);

  const totalSales = affiliates.reduce((sum, a) => sum + Number(a.total_sales), 0);

  return {
    affiliates,
    totalSales,
    goal,
    loading,
    addAffiliate,
    updateAffiliateSales,
    removeAffiliate,
    editAffiliate,
    updateGoal,
    refetch: fetchAffiliates,
  };
}
