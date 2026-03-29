import nodemailer from "nodemailer";
import path from "path";
import { generateInvoicePDF, ensurePDFDirectory } from "./pdfGenerator.js";

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Vérifier la configuration email
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log("✅ Configuration email validée");
    return true;
  } catch (error) {
    console.error("❌ Erreur de configuration email:", error.message);
    return false;
  }
}

// Envoyer une facture par email
export async function sendInvoiceEmail(invoice, recipientEmail) {
  try {
    // Générer le PDF
    const pdfDir = ensurePDFDirectory();
    const filename = `facture-${invoice.id}.pdf`;
    const filepath = path.join(pdfDir, filename);
    
    await generateInvoicePDF(invoice, filepath);

    // Calculer le montant payé
    const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
    const remainingAmount = invoice.totalTTC - totalPaid;

    // Contenu de l'email
    const mailOptions = {
      from: `"${process.env.COMPANY_NAME || 'Votre Entreprise'}" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `Facture N°${invoice.id} - ${invoice.client.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .invoice-details { background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #4CAF50; }
            .amount { font-size: 24px; font-weight: bold; color: #4CAF50; }
            .status { display: inline-block; padding: 5px 10px; border-radius: 5px; font-weight: bold; }
            .status-paid { background-color: #4CAF50; color: white; }
            .status-unpaid { background-color: #f44336; color: white; }
            .status-partial { background-color: #FF9800; color: white; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Facture N°${invoice.id}</h1>
            </div>
            
            <div class="content">
              <p>Bonjour ${invoice.client.name},</p>
              
              <p>Veuillez trouver ci-joint votre facture pour nos services.</p>
              
              <div class="invoice-details">
                <h3>Détails de la facture</h3>
                <p><strong>Client:</strong> ${invoice.client.name}</p>
                <p><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString("fr-FR")}</p>
                <p><strong>Montant Total HT:</strong> ${invoice.totalHT.toFixed(2)} TND</p>
                <p><strong>TVA (${(invoice.taxRate * 100).toFixed(0)}%):</strong> ${(invoice.totalTTC - invoice.totalHT).toFixed(2)} TND</p>
                <p class="amount">Montant Total TTC: ${invoice.totalTTC.toFixed(2)} TND</p>
                
                ${totalPaid > 0 ? `
                  <p><strong>Montant payé:</strong> ${totalPaid.toFixed(2)} TND</p>
                  <p><strong>Reste à payer:</strong> ${remainingAmount.toFixed(2)} TND</p>
                ` : ''}
                
                <p>
                  <span class="status ${
                    invoice.status === 'paid' ? 'status-paid' :
                    totalPaid > 0 ? 'status-partial' : 'status-unpaid'
                  }">
                    ${
                      invoice.status === 'paid' ? '✓ PAYÉE' :
                      totalPaid > 0 ? 'PARTIELLEMENT PAYÉE' : 'NON PAYÉE'
                    }
                  </span>
                </p>
              </div>
              
              <h3>Articles facturés:</h3>
              <ul>
                ${invoice.invoiceItems.map(item => `
                  <li>
                    <strong>${item.product.name}</strong> - 
                    Quantité: ${item.quantity} × ${item.price.toFixed(2)} TND = 
                    ${(item.quantity * item.price).toFixed(2)} TND
                  </li>
                `).join('')}
              </ul>
              
              <p>Pour toute question concernant cette facture, n'hésitez pas à nous contacter.</p>
              
              <p>Cordialement,<br>
              ${process.env.COMPANY_NAME || 'Votre Entreprise'}</p>
            </div>
            
            <div class="footer">
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
              <p>${process.env.COMPANY_NAME || 'Votre Entreprise'} - ${process.env.COMPANY_ADDRESS || ''}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `Facture-${invoice.id}.pdf`,
          path: filepath,
        },
      ],
    };

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email envoyé: ${info.messageId}`);
    
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
}

// Envoyer un rappel de paiement
export async function sendPaymentReminderEmail(invoice, recipientEmail) {
  try {
    const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
    const remainingAmount = invoice.totalTTC - totalPaid;

    const mailOptions = {
      from: `"${process.env.COMPANY_NAME || 'Votre Entreprise'}" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `Rappel - Facture N°${invoice.id} impayée`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .reminder { background-color: #fff3cd; border-left: 4px solid #FF9800; padding: 15px; margin: 20px 0; }
            .amount { font-size: 24px; font-weight: bold; color: #FF9800; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Rappel de Paiement</h1>
            </div>
            
            <div class="content">
              <p>Bonjour ${invoice.client.name},</p>
              
              <div class="reminder">
                <p>Nous vous rappelons que la facture N°${invoice.id} émise le ${new Date(invoice.createdAt).toLocaleDateString("fr-FR")} reste impayée.</p>
                
                <p class="amount">Montant à régler: ${remainingAmount.toFixed(2)} TND</p>
                
                ${totalPaid > 0 ? `<p><em>Un acompte de ${totalPaid.toFixed(2)} TND a déjà été versé.</em></p>` : ''}
              </div>
              
              <p>Merci de procéder au règlement dans les plus brefs délais.</p>
              
              <p>Cordialement,<br>
              ${process.env.COMPANY_NAME || 'Votre Entreprise'}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du rappel:", error);
    throw error;
  }
}