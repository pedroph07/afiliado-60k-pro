import { Affiliate } from '@/types/affiliate';
import { RankBadge } from './RankBadge';
import { Crown, Star, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopThreeCardProps {
  affiliate: Affiliate;
  position: 1 | 2 | 3;
  goalReached: boolean;
}

const positionConfig = {
  1: {
    title: 'Campeão',
    icon: Crown,
    gradient: 'bg-gradient-gold',
    textGradient: 'text-gradient-gold',
    glow: 'shadow-gold',
    border: 'border-gold/30',
  },
  2: {
    title: 'Vice-Campeão',
    icon: Trophy,
    gradient: 'bg-gradient-silver',
    textGradient: 'text-gradient-silver',
    glow: '',
    border: 'border-silver/30',
  },
  3: {
    title: '3º Lugar',
    icon: Star,
    gradient: 'bg-gradient-bronze',
    textGradient: 'text-gradient-bronze',
    glow: '',
    border: 'border-bronze/30',
  },
};

export function TopThreeCard({ affiliate, position, goalReached }: TopThreeCardProps) {
  const config = positionConfig[position];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div
      className={cn(
        'relative bg-gradient-card rounded-2xl p-4 sm:p-6 border transition-all duration-300 hover:scale-[1.02]',
        config.border,
        config.glow,
        position === 1 && 'lg:-mt-4 lg:scale-105'
      )}
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <RankBadge position={position} size="lg" />
      </div>

      <div className="pt-8 text-center space-y-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-muted flex items-center justify-center text-xl sm:text-2xl font-bold text-foreground uppercase">
          {affiliate.name.slice(0, 2)}
        </div>

        <div>
          <h3 className={cn('text-lg sm:text-xl font-bold', config.textGradient)}>
            {affiliate.name}
          </h3>
          <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">
            {formatCurrency(Number(affiliate.total_sales))}
          </p>
          <p className="text-sm text-muted-foreground">
            {affiliate.sales_count} {affiliate.sales_count === 1 ? 'venda' : 'vendas'}
          </p>
        </div>

        {goalReached && (
          <div className="pt-4 border-t border-border/50">
            <span className={cn('text-sm font-semibold', config.textGradient)}>
              {config.title}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
