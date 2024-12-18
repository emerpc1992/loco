import React from 'react';
import { Sale } from '../../../types/sales';
import { formatCurrency } from '../../../utils/formatters';
import { Trash2, User, CreditCard, Banknote, ArrowUpRight } from 'lucide-react';

interface SaleListProps {
  sales: Sale[];
  onDelete: (id: string) => void;
}

export function SaleList({ sales, onDelete }: SaleListProps) {
  // Sort sales in reverse chronological order
  const sortedSales = [...sales].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <Banknote className="h-4 w-4 text-green-600" />;
      case 'card':
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      case 'transfer':
        return <ArrowUpRight className="h-4 w-4 text-purple-600" />;
      default:
        return null;
    }
  };

  if (sales.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay ventas registradas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedSales.map((sale) => (
        <div key={sale.id} className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-medium text-gray-900">
                  {sale.client.name}
                </h3>
                <span className="text-sm text-gray-500">
                  {new Date(sale.date).toLocaleDateString()}
                </span>
                {sale.payment && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    {getPaymentIcon(sale.payment.method)}
                    <span>
                      {sale.payment.method === 'cash' ? 'Efectivo' : 
                       sale.payment.method === 'card' ? 'Tarjeta' : 'Transferencia'}
                    </span>
                    {sale.payment.reference && (
                      <span className="text-gray-500">
                        ({sale.payment.reference})
                      </span>
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">Venta: {sale.id}</p>
              {sale.staff && (
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <User className="h-4 w-4 mr-1" />
                  {sale.staff.member.name} ({sale.staff.commission}% comisión)
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <p className="text-lg font-medium text-gray-900">
                {formatCurrency(sale.total)}
              </p>
              <button
                onClick={() => onDelete(sale.id)}
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                title="Eliminar venta"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-gray-700">Productos:</h4>
            {sale.products.map((product, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/48?text=No+Image';
                      }}
                    />
                  )}
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.quantity}x {formatCurrency(product.salePrice)}
                    </p>
                  </div>
                </div>
                <span className="font-medium">{formatCurrency(product.subtotal)}</span>
              </div>
            ))}
          </div>

          {sale.notes && (
            <div className="mt-4 text-sm">
              <span className="font-medium text-gray-700">Notas:</span>{' '}
              {sale.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}