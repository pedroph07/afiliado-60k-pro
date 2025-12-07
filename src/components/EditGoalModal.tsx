import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditGoalModalProps {
  open: boolean;
  currentGoal: number;
  onClose: () => void;
  onSave: (goal: number) => void;
}

export function EditGoalModal({ open, currentGoal, onClose, onSave }: EditGoalModalProps) {
  const [goal, setGoal] = useState(currentGoal.toString());

  useEffect(() => {
    setGoal(currentGoal.toString());
  }, [currentGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(goal);
    if (!isNaN(value) && value > 0) {
      onSave(value);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Meta Global</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Nova Meta (R$)</Label>
              <Input
                id="goal"
                type="number"
                min="1"
                step="0.01"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="60000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
