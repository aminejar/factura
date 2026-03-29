const fetch = require('node-fetch');

async function testPayment() {
  try {
    const response = await fetch('http://localhost:5001/api/payments', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNzY2ODQyMzM4MjYzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzY2OTIzMTQ3fQ.ABqafllhlQcPOmuuAkbHU0oDabcR21YUZU2cBxPnulc',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        invoiceId: 'inv-002',
        montant: 500,
        mode_paiement: 'virement',
        date_paiement: '2024-01-21',
        reference: 'TEST-001',
        notes: 'Paiement test partiel'
      })
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testPayment();
