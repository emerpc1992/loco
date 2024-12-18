import React, { useState } from 'react';
import { SaleList } from './SaleList';
import { SaleForm } from './SaleForm';
import { Plus } from 'lucide-react';
import { useSales } from '../../../hooks/useSales';
import { useProducts } from '../../../hooks/useProducts';
import { useClients } from '../../../hooks/useClients';
import { useStaff } from '../../../hooks/useStaff';
import { Sale } from '../../../types/sales';
import { generateSaleId } from '../../../utils/staff';
import { calculateTotalCommission } from '../../../utils/staff';

export function SalesModule() {
  const [isCreating, setIsCreating] = useState(false);
  const { sales, addSale, deleteSale } = useSales();
  const { products } = useProducts();
  const { clients, addClient } = useClients();
  const { staff, updateStaff } = useStaff();

  const handleCreateSale = (saleData: Sale) => {
    // Add the sale
    addSale(saleData);

    // If there's a staff member assigned, update their sales record
    if (saleData.staff) {
      const { member, commission } = saleData.staff;
      const staffMember = staff.find(s => s.code === member.code);
      
      if (staffMember) {
        const newSale = {
          id: generateSaleId(),
          date: new Date().toISOString(),
          amount: saleData.total,
          commission,
          discount: 0,
          totalCommission: calculateTotalCommission(saleData.total, commission, 0)
        };

        const updatedStaffMember = {
          ...staffMember,
          sales: [...staffMember.sales, newSale]
        };

        updateStaff(staffMember.code, updatedStaffMember);
      }
    }

    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Ventas</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Nueva Venta</span>
        </button>
      </div>

      {isCreating && (
        <SaleForm
          products={products}
          clients={clients}
          staff={staff}
          onAddClient={addClient}
          onSubmit={handleCreateSale}
          onCancel={() => setIsCreating(false)}
        />
      )}

      <SaleList
        sales={sales}
        onDelete={deleteSale}
      />
    </div>
  );
}