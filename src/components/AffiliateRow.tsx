import { Affiliate } from '@/types/affiliate';
import { RankBadge } from './RankBadge';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AffiliateRowProps {
  affiliate: Affiliate;
  position: number;
  onAddSale?: (id: string) => void;
  onEdit?: (affiliate: Affiliate) => void;
  onDelete?: (id: string) => void;
}

export function AffiliateRow({ affiliate, position, onAddSale, onEdit, onDelete }: AffiliateRowProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const isTop3 = position <= 3;
  const hasActions = onAddSale || onEdit || onDelete;

  return (
    <div className={cn(
      'flex items-center gap-4 p-4 rounded-xl bg-gradient-card border border-border/50 transition-all duration-200 hover:border-primary/30',
      isTop3 && 'border-primary/20'
    )}>
      <RankBadge position={position} size="md" />

      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-foreground uppercase flex-shrink-0">
        {affiliate.name.slice(0, 2)}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground truncate">{affiliate.name}</h4>
        <p className="text-sm text-muted-foreground">
          {affiliate.sales_count} {affiliate.sales_count === 1 ? 'venda' : 'vendas'}
        </p>
      </div>

      <div className="text-right">
        <p className={cn('text-lg font-bold', isTop3 ? 'text-primary' : 'text-foreground')}>
          {formatCurrency(Number(affiliate.total_sales))}
        </p>
      </div>

      {hasActions && (
        <div className="flex items-center gap-1">
          {onAddSale && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={() => onAddSale(affiliate.id)}>
              <Plus className="w-4 h-4" />
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted" onClick={() => onEdit(affiliate)}>
              <Pencil className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(affiliate.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
