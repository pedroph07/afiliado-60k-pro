import { Tables } from '@/integrations/supabase/types';

export type Affiliate = Tables<'affiliates'>;

export interface TopBenefit {
  position: 1 | 2 | 3;
  title: string;
  description: string;
  icon: string;
}
