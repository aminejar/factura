import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function generateInvoicePDF(invoice, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(outputPath);

      doc.pipe(stream);

      // En-tête
      doc
        .fontSize(20)
        .text("FACTURE", 50, 50, { align: "right" })
        .fontSize(10)
        .text(`Facture N° ${invoice.id}`, { align: "right" })
        .text(`Date: ${new Date(invoice.createdAt).toLocaleDateString("fr-FR")}`, {
          align: "right",
        })
        .moveDown();

      // Informations de l'entreprise (à personnaliser)
      doc
        .fontSize(12)
        .text("Votre Entreprise", 50, 120)
        .fontSize(10)
        .text("Adresse de votre entreprise", 50, 140)
        .text("Téléphone: +216 XX XXX XXX", 50, 155)
        .text("Email: contact@entreprise.tn", 50, 170)
        .moveDown();

      // Informations du client
      doc
        .fontSize(12)
        .text("Facturer à:", 50, 220)
        .fontSize(10)
        .text(invoice.client.name, 50, 240)
        .text(invoice.client.email || "", 50, 255)
        .text(invoice.client.phone || "", 50, 270)
        .text(invoice.client.address || "", 50, 285)
        .moveDown();

      // Ligne de séparation
      doc
        .moveTo(50, 320)
        .lineTo(550, 320)
        .stroke();

      // En-tête du tableau
      const tableTop = 340;
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Désignation", 50, tableTop)
        .text("Quantité", 300, tableTop)
        .text("Prix Unit.", 380, tableTop)
        .text("Total", 480, tableTop, { align: "right" });

      // Ligne après l'en-tête
      doc
        .moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

      // Items de la facture
      let currentY = tableTop + 25;
      doc.font("Helvetica");

      invoice.invoiceItems.forEach((item) => {
        const itemTotal = item.price * item.quantity;

        doc
          .text(item.product.name, 50, currentY, { width: 240 })
          .text(item.quantity.toString(), 300, currentY)
          .text(`${item.price.toFixed(2)} TND`, 380, currentY)
          .text(`${itemTotal.toFixed(2)} TND`, 480, currentY, { align: "right" });

        if (item.product.description) {
          currentY += 15;
          doc.fontSize(8).text(item.product.description, 50, currentY, { width: 240 });
          doc.fontSize(10);
        }

        currentY += 25;
      });

      // Ligne avant les totaux
      currentY += 10;
      doc
        .moveTo(50, currentY)
        .lineTo(550, currentY)
        .stroke();

      // Totaux
      currentY += 20;
      doc
        .fontSize(10)
        .text("Total HT:", 380, currentY)
        .text(`${invoice.totalHT.toFixed(2)} TND`, 480, currentY, { align: "right" });

      currentY += 20;
      doc
        .text(`TVA (${(invoice.taxRate * 100).toFixed(0)}%):`, 380, currentY)
        .text(`${(invoice.totalTTC - invoice.totalHT).toFixed(2)} TND`, 480, currentY, {
          align: "right",
        });

      currentY += 20;
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Total TTC:", 380, currentY)
        .text(`${invoice.totalTTC.toFixed(2)} TND`, 480, currentY, { align: "right" });

      // Statut de paiement
      currentY += 40;
      const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
      const remainingAmount = invoice.totalTTC - totalPaid;

      doc.font("Helvetica").fontSize(10);

      if (invoice.status === "paid") {
        doc.fillColor("green").text("✓ PAYÉE", 50, currentY);
      } else if (totalPaid > 0) {
        doc
          .fillColor("orange")
          .text(`Payé: ${totalPaid.toFixed(2)} TND`, 50, currentY)
          .text(`Reste: ${remainingAmount.toFixed(2)} TND`, 50, currentY + 15);
      } else {
        doc.fillColor("red").text("❌ NON PAYÉE", 50, currentY);
      }

      // Pied de page
      doc
        .fillColor("black")
        .fontSize(8)
        .text(
          "Merci pour votre confiance !",
          50,
          700,
          { align: "center", width: 500 }
        )
        .text(
          "Cette facture est payable dans les 30 jours suivant la date d'émission.",
          50,
          715,
          { align: "center", width: 500 }
        );

      doc.end();

      stream.on("finish", () => resolve(outputPath));
      stream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
}

// Fonction pour créer le répertoire des PDFs si nécessaire
export function ensurePDFDirectory() {
  const pdfDir = path.join(process.cwd(), "invoices");
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }
  return pdfDir;
}