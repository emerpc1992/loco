import { Credit, Payment } from '../types/credits';
import { formatCurrency } from './formatters';
import { calculateRemainingAmount } from './payments';

function generateInvoiceNumber(payment: Payment): string {
  const timestamp = payment.id.split('-')[1];
  return `FACT-${timestamp}`;
}

export function generateInvoiceHTML(credit: Credit, payment: Payment, businessName: string): string {
  const remainingAmount = calculateRemainingAmount(credit.totalAmount, credit.payments);
  const invoiceNumber = generateInvoiceNumber(payment);
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Factura ${invoiceNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
          }
          .invoice {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #eee;
          }
          .business-name {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
            color: #2563eb;
          }
          .invoice-title {
            margin: 5px 0;
            color: #666;
          }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .info-group {
            flex: 1;
          }
          .info-group p {
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
          }
          th {
            background-color: #f8f9fa;
            font-weight: bold;
          }
          .amounts {
            margin-top: 20px;
            text-align: right;
          }
          .amounts p {
            margin: 5px 0;
          }
          .total {
            font-size: 18px;
            font-weight: bold;
            color: #2563eb;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <h1 class="business-name">${businessName}</h1>
            <p class="invoice-title">Comprobante de Pago</p>
            <p class="invoice-title">N° ${invoiceNumber}</p>
          </div>

          <div class="info-section">
            <div class="info-group">
              <p><strong>Cliente:</strong> ${credit.clientName}</p>
              <p><strong>Teléfono:</strong> ${credit.clientPhone}</p>
              <p><strong>Fecha:</strong> ${new Date(payment.date).toLocaleDateString()}</p>
            </div>
            <div class="info-group" style="text-align: right;">
              <p><strong>Método de Pago:</strong> ${
                payment.method === 'cash' ? 'Efectivo' :
                payment.method === 'card' ? 'Tarjeta' : 'Transferencia'
              }</p>
              ${payment.reference ? `<p><strong>Referencia:</strong> ${payment.reference}</p>` : ''}
              <p><strong>Crédito N°:</strong> ${credit.code}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th style="text-align: center;">Cantidad</th>
                <th style="text-align: right;">Precio Unit.</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${credit.products.map(product => `
                <tr>
                  <td>${product.name}</td>
                  <td style="text-align: center;">${product.quantity}</td>
                  <td style="text-align: right;">${formatCurrency(product.price)}</td>
                  <td style="text-align: right;">${formatCurrency(product.subtotal)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="amounts">
            <p><strong>Total del Crédito:</strong> ${formatCurrency(credit.totalAmount)}</p>
            <p><strong>Monto Pagado:</strong> ${formatCurrency(payment.amount)}</p>
            <p class="total"><strong>Saldo Pendiente:</strong> ${formatCurrency(remainingAmount)}</p>
          </div>

          <div class="footer">
            <p>¡Gracias por su pago!</p>
            <p>Este documento es un comprobante válido de su pago.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function printInvoice(credit: Credit, payment: Payment, businessName: string): void {
  const invoiceHTML = generateInvoiceHTML(credit, payment, businessName);
  
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
      // Close window after print dialog is closed
      printWindow.onfocus = () => {
        printWindow.close();
      };
    }, 250);
  }
}