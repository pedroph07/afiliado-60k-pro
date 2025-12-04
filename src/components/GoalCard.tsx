import { Target, TrendingUp } from 'lucide-react';
import { ProgressRing } from './ProgressRing';

interface GoalCardProps {
  currentTotal: number;
  goal: number;
}

export function GoalCard({ currentTotal, goal }: GoalCardProps) {
  const progress = (currentTotal / goal) * 100;
  const remaining = Math.max(0, goal - currentTotal);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-gradient-card rounded-2xl p-6 md:p-8 border border-border/50 shadow-card">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex-shrink-0">
          <ProgressRing progress={progress} size={180} />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-muted-foreground">Meta Global</h2>
          </div>
          
          <div className="space-y-1">
            <p className="text-4xl md:text-5xl font-bold text-foreground">
              {formatCurrency(currentTotal)}
            </p>
            <p className="text-muted-foreground">
              de <span className="text-foreground font-semibold">{formatCurrency(goal)}</span>
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Faltam <span className="text-primary font-semibold">{formatCurrency(remaining)}</span> para bater a meta
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
