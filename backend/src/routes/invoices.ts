import express from "express";
import PDFDocument from "pdfkit";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const invoices = await prisma.invoice.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { job: true } });
    return res.json({ success: true, invoices });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to load invoices" });
  }
});

router.get("/:id/download", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const id = String(req.params.id);
    const invoice: any = await prisma.invoice.findFirst({ where: { id, userId }, include: { job: true, user: true } });
    if (!invoice) return res.status(404).json({ success: false, error: "Invoice not found" });

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
    doc.pipe(res);

    doc.fontSize(24).fillColor("#FFD700").text("WritersNite Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).fillColor("#F5F5F5").text(`Invoice #${invoice.invoiceNumber}`);
    doc.text(`Date: ${invoice.createdAt.toISOString().split("T")[0]}`);
    doc.text(`Billed to: ${invoice.user?.fullName ?? invoice.user?.email ?? ""}`);
    doc.moveDown();

    if (invoice.job) {
      doc.fontSize(14).fillColor("#FFD700").text("Job details");
      doc.fontSize(12).fillColor("#F5F5F5").text(`Title: ${invoice.job.title}`);
      doc.text(`Description: ${invoice.job.description.slice(0, 150)}...`);
      doc.moveDown();
    }

    doc.fontSize(14).fillColor("#FFD700").text("Amount");
    doc.fontSize(12).fillColor("#F5F5F5").text(`KES ${invoice.amount}`);
    doc.end();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to generate invoice" });
  }
});

export default router;
