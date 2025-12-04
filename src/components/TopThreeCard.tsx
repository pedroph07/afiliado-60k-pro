import { Affiliate } from '@/types/affiliate';
import { RankBadge } from './RankBadge';
import { Crown, Gift, Star, Zap, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopThreeCardProps {
  affiliate: Affiliate;
  position: 1 | 2 | 3;
}

const benefits = {
  1: {
    title: 'Campeão',
    items: ['Bônus de R$ 5.000', 'Viagem exclusiva', 'Troféu personalizado'],
    icon: Crown,
    gradient: 'bg-gradient-gold',
    textGradient: 'text-gradient-gold',
    glow: 'shadow-gold',
    border: 'border-gold/30',
  },
  2: {
    title: 'Vice-Campeão',
    items: ['Bônus de R$ 2.500', 'Day Spa Premium', 'Medalha de Prata'],
    icon: Trophy,
    gradient: 'bg-gradient-silver',
    textGradient: 'text-gradient-silver',
    glow: '',
    border: 'border-silver/30',
  },
  3: {
    title: '3º Lugar',
    items: ['Bônus de R$ 1.000', 'Jantar especial', 'Medalha de Bronze'],
    icon: Star,
    gradient: 'bg-gradient-bronze',
    textGradient: 'text-gradient-bronze',
    glow: '',
    border: 'border-bronze/30',
  },
};

export function TopThreeCard({ affiliate, position }: TopThreeCardProps) {
  const benefit = benefits[position];
  const Icon = benefit.icon;

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
        'relative bg-gradient-card rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02]',
        benefit.border,
        benefit.glow,
        position === 1 && 'lg:-mt-4 lg:scale-105'
      )}
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <RankBadge position={position} size="lg" />
      </div>

      <div className="pt-8 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-foreground uppercase">
          {affiliate.name.slice(0, 2)}
        </div>

        <div>
          <h3 className={cn('text-xl font-bold', benefit.textGradient)}>
            {affiliate.name}
          </h3>
          <p className="text-2xl font-bold text-foreground mt-1">
            {formatCurrency(affiliate.totalSales)}
          </p>
          <p className="text-sm text-muted-foreground">
            {affiliate.salesCount} {affiliate.salesCount === 1 ? 'venda' : 'vendas'}
          </p>
        </div>

        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Gift className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{benefit.title}</span>
          </div>
          <ul className="space-y-2">
            {benefit.items.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-3 h-3 text-accent flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
