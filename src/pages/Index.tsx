import { useState } from 'react';
import { useAffiliates } from '@/hooks/useAffiliates';
import { GoalCard } from '@/components/GoalCard';
import { TopThreeCard } from '@/components/TopThreeCard';
import { AffiliateRow } from '@/components/AffiliateRow';
import { AddAffiliateModal } from '@/components/AddAffiliateModal';
import { AddSaleModal } from '@/components/AddSaleModal';
import { EditAffiliateModal } from '@/components/EditAffiliateModal';
import { Button } from '@/components/ui/button';
import { UserPlus, Trophy, Users } from 'lucide-react';
import { Affiliate } from '@/types/affiliate';
import { toast } from 'sonner';

const GOAL = 60000;

const Index = () => {
  const { affiliates, totalSales, addAffiliate, updateAffiliateSales, removeAffiliate, editAffiliate } = useAffiliates();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);

  const topThree = affiliates.slice(0, 3);
  const others = affiliates.slice(3);

  const handleAddAffiliate = (name: string, initialSales: number) => {
    addAffiliate(name, initialSales);
    toast.success(`${name} adicionado com sucesso!`);
  };

  const handleAddSale = (id: string) => {
    const affiliate = affiliates.find(a => a.id === id);
    if (affiliate) {
      setSelectedAffiliate(affiliate);
      setShowSaleModal(true);
    }
  };

  const handleSaleSubmit = (amount: number) => {
    if (selectedAffiliate) {
      updateAffiliateSales(selectedAffiliate.id, amount);
      toast.success(`Venda de R$ ${amount.toLocaleString('pt-BR')} registrada!`);
    }
  };

  const handleEdit = (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate);
    setShowEditModal(true);
  };

  const handleEditSave = (id: string, updates: { name?: string; totalSales?: number }) => {
    editAffiliate(id, updates);
    toast.success('Afiliado atualizado!');
  };

  const handleDelete = (id: string) => {
    const affiliate = affiliates.find(a => a.id === id);
    if (affiliate) {
      removeAffiliate(id);
      toast.success(`${affiliate.name} removido`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container max-w-6xl py-8 px-4 md:py-12">
        {/* Header */}
        <header className="text-center mb-10 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-accent glow-gold" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Ranking de Afiliados
            </h1>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            Acompanhe o desempenho dos seus afiliados e veja quem está mais perto de conquistar os prêmios!
          </p>
        </header>

        {/* Goal Progress */}
        <section className="mb-10 animate-scale-in">
          <GoalCard currentTotal={totalSales} goal={GOAL} />
        </section>

        {/* Top 3 */}
        {topThree.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold text-foreground">Top 3 - Premiação</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {topThree[1] && (
                <div className="md:order-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <TopThreeCard affiliate={topThree[1]} position={2} />
                </div>
              )}
              {topThree[0] && (
                <div className="md:order-2 animate-slide-up">
                  <TopThreeCard affiliate={topThree[0]} position={1} />
                </div>
              )}
              {topThree[2] && (
                <div className="md:order-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <TopThreeCard affiliate={topThree[2]} position={3} />
                </div>
              )}
            </div>
          </section>
        )}

        {/* All Affiliates */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Todos os Afiliados ({affiliates.length})
              </h2>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <UserPlus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>

          {affiliates.length === 0 ? (
            <div className="text-center py-16 bg-gradient-card rounded-2xl border border-border/50">
              <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum afiliado cadastrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Adicione seus afiliados para começar a rastrear as vendas
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <UserPlus className="w-4 h-4" />
                Adicionar Primeiro Afiliado
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {affiliates.map((affiliate, index) => (
                <AffiliateRow
                  key={affiliate.id}
                  affiliate={affiliate}
                  position={index + 1}
                  onAddSale={handleAddSale}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>

        {/* Modals */}
        <AddAffiliateModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddAffiliate}
        />

        <AddSaleModal
          open={showSaleModal}
          affiliateName={selectedAffiliate?.name || ''}
          onClose={() => {
            setShowSaleModal(false);
            setSelectedAffiliate(null);
          }}
          onAdd={handleSaleSubmit}
        />

        <EditAffiliateModal
          open={showEditModal}
          affiliate={selectedAffiliate}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAffiliate(null);
          }}
          onSave={handleEditSave}
        />
      </div>
    </div>
  );
};

export default Index;
