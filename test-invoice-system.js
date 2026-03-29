// Test script to verify invoice status logic
import fetch from 'node-fetch';

async function testInvoiceSystem() {
  try {
    console.log('🧪 Testing Invoice Status System...\n');

    // Test 1: Get all invoices and check their statuses
    console.log('1. Getting all invoices...');
    const invoicesResponse = await fetch('http://localhost:5000/api/invoices', {
      headers: {
        'Authorization': 'Bearer demo_token_invoice_system',
        'Content-Type': 'application/json',
      }
    });

    const invoices = await invoicesResponse.json();
    console.log('✅ Found invoices:', invoices.length);

    if (invoices.length > 0) {
      console.log('📊 Invoice Status Summary:');
      const statusCounts = invoices.reduce((acc, inv) => {
        acc[inv.status] = (acc[inv.status] || 0) + 1;
        return acc;
      }, {});

      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`   ${status}: ${count} invoices`);
      });

      // Test 2: Create a payment and check if status updates
      const firstInvoice = invoices.find(inv => inv.status !== 'paid');
      if (firstInvoice) {
        console.log(`\n2. Creating payment for invoice: ${firstInvoice.invoiceNumber || firstInvoice.id}`);
        console.log(`   Current status: ${firstInvoice.status}`);
        console.log(`   Total: ${firstInvoice.total || firstInvoice.montant_ttc}`);
        console.log(`   Paid: ${firstInvoice.paidAmount || 0}`);
        console.log(`   Remaining: ${firstInvoice.remainingAmount || firstInvoice.montant_restant}`);

        const paymentAmount = Math.min(50, firstInvoice.remainingAmount || firstInvoice.montant_restant || 50);

        const paymentResponse = await fetch('http://localhost:5000/api/payments', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer demo_token_invoice_system',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            invoiceId: firstInvoice.id,
            amount: paymentAmount,
            method: 'bank_transfer',
            date: new Date().toISOString().split('T')[0]
          })
        });

        const paymentResult = await paymentResponse.json();

        if (paymentResponse.ok) {
          console.log('✅ Payment created successfully!');
          console.log('📈 Payment details:', {
            amount: paymentResult.payment?.amount,
            invoiceStatus: paymentResult.invoiceStatus,
            totalPaid: paymentResult.totalPaid,
            remainingAmount: paymentResult.remainingAmount
          });

          // Test 3: Check if invoice status was updated
          console.log('\n3. Verifying invoice status update...');
          const updatedInvoiceResponse = await fetch(`http://localhost:5000/api/invoices/${firstInvoice.id}`, {
            headers: {
              'Authorization': 'Bearer demo_token_invoice_system',
              'Content-Type': 'application/json',
            }
          });

          const updatedInvoice = await updatedInvoiceResponse.json();
          console.log('🔄 Updated invoice status:', updatedInvoice.status);
          console.log('💰 Updated paid amount:', updatedInvoice.paidAmount);
          console.log('📊 Updated remaining:', updatedInvoice.remainingAmount);

        } else {
          console.log('❌ Payment creation failed:', paymentResult);
        }
      }
    }

    console.log('\n🎉 Invoice system test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testInvoiceSystem();

