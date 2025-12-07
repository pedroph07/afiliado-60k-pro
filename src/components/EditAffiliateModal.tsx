import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil } from 'lucide-react';
import { Affiliate } from '@/types/affiliate';

interface EditAffiliateModalProps {
  open: boolean;
  affiliate: Affiliate | null;
  onClose: () => void;
  onSave: (id: string, updates: { name?: string; total_sales?: number }) => void;
}

export function EditAffiliateModal({ open, affiliate, onClose, onSave }: EditAffiliateModalProps) {
  const [name, setName] = useState('');
  const [totalSales, setTotalSales] = useState('');

  useEffect(() => {
    if (affiliate) {
      setName(affiliate.name);
      setTotalSales(String(affiliate.total_sales));
    }
  }, [affiliate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (affiliate && name.trim()) {
      onSave(affiliate.id, {
        name: name.trim(),
        total_sales: parseFloat(totalSales) || 0,
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Pencil className="w-5 h-5 text-primary" />
            Editar Afiliado
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-foreground">Nome do Afiliado</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João Silva"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-sales" className="text-foreground">Total de Vendas (R$)</Label>
            <Input
              id="edit-sales"
              type="number"
              min="0"
              step="0.01"
              value={totalSales}
              onChange={(e) => setTotalSales(e.target.value)}
              placeholder="0"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
