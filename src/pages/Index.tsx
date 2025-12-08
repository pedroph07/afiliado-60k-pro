import { useState } from 'react';
import { useAffiliates, Affiliate } from '@/hooks/useAffiliates';
import { useAuth } from '@/contexts/AuthContext';
import { GoalCard } from '@/components/GoalCard';
import { TopThreeCard } from '@/components/TopThreeCard';
import { AffiliateRow } from '@/components/AffiliateRow';
import { AddAffiliateModal } from '@/components/AddAffiliateModal';
import { AddSaleModal } from '@/components/AddSaleModal';
import { EditAffiliateModal } from '@/components/EditAffiliateModal';
import { EditGoalModal } from '@/components/EditGoalModal';
import { Button } from '@/components/ui/button';
import { UserPlus, Trophy, Users, LogOut, Settings, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const { affiliates, totalSales, goal, loading, addAffiliate, updateAffiliateSales, removeAffiliate, editAffiliate, updateGoal } = useAffiliates();
  const { user, isAdmin, signOut } = useAuth();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);

  const topThree = affiliates.slice(0, 3);

  const handleAddAffiliate = async (name: string, initialSales: number) => {
    try {
      await addAffiliate(name, initialSales);
      toast.success(`${name} adicionado com sucesso!`);
    } catch (error) {
      toast.error('Erro ao adicionar afiliado');
    }
  };

  const handleAddSale = (id: string) => {
    const affiliate = affiliates.find(a => a.id === id);
    if (affiliate) {
      setSelectedAffiliate(affiliate);
      setShowSaleModal(true);
    }
  };

  const handleSaleSubmit = async (amount: number) => {
    if (selectedAffiliate) {
      try {
        await updateAffiliateSales(selectedAffiliate.id, amount);
        toast.success(`Venda de R$ ${amount.toLocaleString('pt-BR')} registrada!`);
      } catch (error) {
        toast.error('Erro ao registrar venda');
      }
    }
  };

  const handleEdit = (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate);
    setShowEditModal(true);
  };

  const handleEditSave = async (id: string, updates: { name?: string; total_sales?: number; sales_count?: number }) => {
    try {
      await editAffiliate(id, updates);
      toast.success('Afiliado atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar afiliado');
    }
  };

  const goalReached = totalSales >= goal;

  const handleDelete = async (id: string) => {
    const affiliate = affiliates.find(a => a.id === id);
    if (affiliate) {
      try {
        await removeAffiliate(id);
        toast.success(`${affiliate.name} removido`);
      } catch (error) {
        toast.error('Erro ao remover afiliado');
      }
    }
  };

  const handleGoalSave = async (newGoal: number) => {
    try {
      await updateGoal(newGoal);
      toast.success('Meta atualizada!');
    } catch (error) {
      toast.error('Erro ao atualizar meta');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Até logo!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container max-w-6xl py-8 px-4 md:py-12">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-10 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="hidden sm:flex flex-1" />
            <div className="flex items-center gap-2 sm:gap-3">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-accent glow-gold" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Masternylus
              </h1>
            </div>
            <div className="flex flex-1 justify-end gap-2">
              {isAdmin && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowGoalModal(true)}
                  title="Editar Meta"
                  className="h-8 w-8 sm:h-10 sm:w-10"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              )}
              <Button variant="outline" size="icon" onClick={handleSignOut} title="Sair" className="h-8 w-8 sm:h-10 sm:w-10">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto px-4">
            {isAdmin 
              ? 'Gerencie seus afiliados e acompanhe o progresso das vendas!'
              : 'Acompanhe o desempenho dos afiliados e veja quem está mais perto de conquistar os prêmios!'}
          </p>
          {!isAdmin && (
            <p className="text-xs text-muted-foreground mt-2">
              Logado como: {user?.email}
            </p>
          )}
        </header>

        {/* Goal Progress */}
        <section className="mb-10 animate-scale-in">
          <GoalCard currentTotal={totalSales} goal={goal} />
        </section>

        {/* Top 3 */}
        {topThree.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold text-foreground">Top 3 - Premiação</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {topThree[1] && (
                <div className="order-2 sm:order-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <TopThreeCard affiliate={topThree[1]} position={2} goalReached={goalReached} />
                </div>
              )}
              {topThree[0] && (
                <div className="order-1 sm:order-2 animate-slide-up">
                  <TopThreeCard affiliate={topThree[0]} position={1} goalReached={goalReached} />
                </div>
              )}
              {topThree[2] && (
                <div className="order-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <TopThreeCard affiliate={topThree[2]} position={3} goalReached={goalReached} />
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
            {isAdmin && (
              <Button onClick={() => setShowAddModal(true)}>
                <UserPlus className="w-4 h-4" />
                Adicionar
              </Button>
            )}
          </div>

          {affiliates.length === 0 ? (
            <div className="text-center py-16 bg-gradient-card rounded-2xl border border-border/50">
              <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum afiliado cadastrado
              </h3>
              <p className="text-muted-foreground mb-6">
                {isAdmin 
                  ? 'Adicione seus afiliados para começar a rastrear as vendas'
                  : 'Aguarde o administrador adicionar os afiliados'}
              </p>
              {isAdmin && (
                <Button onClick={() => setShowAddModal(true)}>
                  <UserPlus className="w-4 h-4" />
                  Adicionar Primeiro Afiliado
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {affiliates.map((affiliate, index) => (
                <AffiliateRow
                  key={affiliate.id}
                  affiliate={affiliate}
                  position={index + 1}
                  onAddSale={isAdmin ? handleAddSale : undefined}
                  onEdit={isAdmin ? handleEdit : undefined}
                  onDelete={isAdmin ? handleDelete : undefined}
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

        <EditGoalModal
          open={showGoalModal}
          currentGoal={goal}
          onClose={() => setShowGoalModal(false)}
          onSave={handleGoalSave}
        />
      </div>
    </div>
  );
};

export default Index;
