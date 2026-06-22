<template>
  <div style="display: none;"></div>
</template>

<script setup>
const print = (reservation) => {
  const r = reservation
  if (!r?.id) return

  const guestName = r.guest || 'N/A'
  const guestEmail = r.email || ''
  const todayDate = new Date().toLocaleDateString()
  const checkIn = r.checkIn || ''
  const checkOut = r.checkOut || ''
  const status = r.statusLabel || ''
  
  const roomName = r.raw?.room ? `Room ${r.raw.room.number}` : (r.room || 'N/A')
  const roomType = r.raw?.room?.type || ''
  const priceNight = Number(r.raw?.room?.price || 0)
  const total = Number(r.total || 0)

  const win = window.open('', '_blank', 'width=900,height=650')
  if (!win) return

  win.document.open()
  win.document.write(`<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Invoice #${r.id}</title>
      <style>
        :root {
          --primary-color: #111827;
          --secondary-color: #4b5563;
          --border-color: #e5e7eb;
          --accent-color: #059669; /* Elegant green accent */
        }
        * { box-sizing: border-box; }
        body { 
          font-family: 'Helvetica Neue', 'Inter', Helvetica, Arial, sans-serif; 
          margin: 0; 
          padding: 40px; 
          color: var(--primary-color);
          background-color: #fff;
          -webkit-font-smoothing: antialiased;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 2px solid var(--primary-color);
          padding-bottom: 24px;
          margin-bottom: 32px;
        }
        .header h1 {
          margin: 0;
          font-size: 36px;
          font-weight: 300;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .hotel-info {
          text-align: right;
          color: var(--secondary-color);
          font-size: 14px;
          line-height: 1.5;
        }
        .hotel-info h2 {
          margin: 0 0 4px 0;
          color: var(--primary-color);
          font-size: 18px;
          font-weight: 600;
        }
        .meta-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .meta-section h3 {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--secondary-color);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 8px;
          margin-bottom: 12px;
        }
        .meta-section p {
          margin: 4px 0;
          font-size: 15px;
          line-height: 1.6;
        }
        .status-badge {
          display: inline-block;
          margin-top: 8px;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          background-color: #f3f4f6;
          color: var(--secondary-color);
        }
        .status-badge.paid, .status-badge.confirmed { background-color: #def7ec; color: var(--accent-color); }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 32px;
        }
        th {
          background-color: #f9fafb;
          text-align: left;
          padding: 14px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--secondary-color);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }
        td {
          padding: 16px 14px;
          border-bottom: 1px solid var(--border-color);
          font-size: 15px;
        }
        .text-right { text-align: right; }
        .summary-section {
          display: flex;
          justify-content: flex-end;
        }
        .totals-box {
          width: 300px;
        }
        .totals-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 15px;
          color: var(--secondary-color);
        }
        .totals-row.grand-total {
          color: var(--primary-color);
          font-size: 20px;
          font-weight: bold;
          border-top: 2px solid var(--primary-color);
          padding-top: 14px;
          margin-top: 4px;
        }
        .footer {
          margin-top: 60px;
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid var(--border-color);
          color: var(--secondary-color);
          font-size: 13px;
        }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <header class="header">
          <h1>Invoice</h1>
          <div class="hotel-info">
            <h2>Battambang Hotel</h2>
            <p>03 Battambang, Cambodia</p>
          </div>
        </header>

        <div class="meta-details">
          <div class="meta-section">
            <h3>Billed To</h3>
            <p><strong>${guestName}</strong></p>
            ${guestEmail ? `<p>${guestEmail}</p>` : ''}
          </div>
          <div class="meta-section">
            <h3>Reservation Details</h3>
            <p><strong>Invoice No:</strong> #${r.id}</p>
            <p><strong>Date Issued:</strong> ${todayDate}</p>
            <p><strong>Check-in:</strong> ${checkIn}</p>
            <p><strong>Check-out:</strong> ${checkOut}</p>
            <div class="status-badge ${status.toLowerCase()}">${status}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-right">Rate / Night</th>
              <th class="text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${roomName}</strong>
                ${roomType ? `<br><span style="color: #6b7280; font-size: 13px;">Room Type: ${roomType}</span>` : ''}
              </td>
              <td class="text-right">$${priceNight.toFixed(2)}</td>
              <td class="text-right">$${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="summary-section">
          <div class="totals-box">
            <div class="totals-row">
              <span>Subtotal</span>
              <span>$${total.toFixed(2)}</span>
            </div>
            <div class="totals-row">
              <span>Taxes & Fees</span>
              <span>Included</span>
            </div>
            <div class="totals-row grand-total">
              <span>Total Balance</span>
              <span>$${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <footer class="footer">
          <p>Thank you for choosing battambang hotel. We hope you enjoyed your visit!</p>
          <p style="margin-top: 8px; font-size: 12px; color: #9ca3af;">If you have any questions about this invoice, please contact +855 963612863</p>
        </footer>
      </div>
      <script>
        window.onload = function() { window.print(); };
      <\/script>
    </body>
  </html>`)
  win.document.close()
}

defineExpose({ print })
</script>
