export interface Affiliate {
  id: string;
  name: string;
  avatar?: string;
  totalSales: number;
  salesCount: number;
  createdAt: Date;
}

export interface TopBenefit {
  position: 1 | 2 | 3;
  title: string;
  description: string;
  icon: string;
}
