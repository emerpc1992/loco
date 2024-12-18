import React, { useState } from 'react';
import { CreditList } from './CreditList';
import { CreditForm } from './CreditForm';
import { CreditSearch } from './CreditSearch';
import { Plus } from 'lucide-react';
import { useCredits } from '../../../hooks/useCredits';
import { useProducts } from '../../../hooks/useProducts';
import { Credit } from '../../../types/credits';

export function CreditsModule() {
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    credits, 
    addCredit, 
    updateCredit, 
    deleteCredit, 
    addPayment, 
    cancelPayment,
    deletePayment 
  } = useCredits();
  const { products } = useProducts();

  const handleCreateCredit = (creditData: Omit<Credit, 'payments' | 'remainingAmount'>) => {
    addCredit(creditData);
    setIsCreating(false);
  };

  const filteredCredits = credits.filter(credit => {
    const searchLower = searchTerm.toLowerCase();
    return (
      credit.code.toLowerCase().includes(searchLower) ||
      credit.clientName.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Créditos</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Nuevo Crédito</span>
        </button>
      </div>

      <div className="md:w-64">
        <CreditSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      {isCreating && (
        <CreditForm
          products={products}
          onSubmit={handleCreateCredit}
          onCancel={() => setIsCreating(false)}
        />
      )}

      <CreditList
        credits={filteredCredits}
        onUpdate={updateCredit}
        onDelete={deleteCredit}
        onAddPayment={addPayment}
        onCancelPayment={cancelPayment}
        onDeletePayment={deletePayment}
      />
    </div>
  );
}