import { Crown, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RankBadgeProps {
  position: number;
  size?: 'sm' | 'md' | 'lg';
}

export function RankBadge({ position, size = 'md' }: RankBadgeProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  const iconSizes = {
    sm: 12,
    md: 18,
    lg: 24,
  };

  if (position === 1) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gradient-gold shadow-gold animate-float',
          sizeClasses[size]
        )}
      >
        <Crown size={iconSizes[size]} className="text-accent-foreground" />
      </div>
    );
  }

  if (position === 2) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gradient-silver',
          sizeClasses[size]
        )}
      >
        <Medal size={iconSizes[size]} className="text-background" />
      </div>
    );
  }

  if (position === 3) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gradient-bronze',
          sizeClasses[size]
        )}
      >
        <Award size={iconSizes[size]} className="text-accent-foreground" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-muted font-bold text-muted-foreground',
        sizeClasses[size]
      )}
    >
      {position}
    </div>
  );
}
