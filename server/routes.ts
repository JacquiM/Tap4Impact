import type { Express } from "express";
import { createServer, type Server } from "http";
import { 
  generatePayFastSignature, 
  validatePayFastSignature,
  validatePayFastIP,
  type PayFastData
} from "./payfast-utils";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  app.post("/api/payfast/create-payment", async (req, res) => {
    try {
      const { amount, frequency, name, email } = req.body;
      console.log('Creating PayFast payment:', { amount, frequency, name, email });
      
      const billingDate = new Date();
      billingDate.setDate(billingDate.getDate() + 1);
      const formattedDate = billingDate.toISOString().split('T')[0];

      const frequencyMap: Record<string, string> = {
        'monthly': '3',
        'quarterly': '4',
        'biannually': '5',
        'annual': '6'
      };

      const paymentData: Record<string, string> = {
        merchant_id: process.env.PAYFAST_MERCHANT_ID || '',
        merchant_key: process.env.PAYFAST_MERCHANT_KEY || '',
        return_url: "https://tap4impact.org",
        cancel_url: "https://tap4impact.org",
        name_first: name.trim(),
        email_address: email.trim(),
        amount: Number(amount).toFixed(2),
        item_name: "Monthly Donation",
        subscription_type: "1",
        billing_date: formattedDate,
        recurring_amount: Number(amount).toFixed(2),
        frequency: frequencyMap[frequency] || '3',
        cycles: "0"
      };

      const passphrase = process.env.PAYFAST_PASSPHRASE;
      const signature = generatePayFastSignature(paymentData, passphrase);

      const formData = { ...paymentData, signature };

      const baseUrl = process.env.PAYFAST_MODE === "sandbox"
        ? "https://sandbox.payfast.co.za/eng/process"
        : "https://www.payfast.co.za/eng/process";

      res.json({ url: baseUrl, formData });
    } catch (error: any) {
      console.error('Error creating PayFast payment:', error);
      res.status(500).json({ error: "Failed to create payment", message: error.message });
    }
  });

  app.post("/api/payfast/notify", async (req, res) => {
    try {
      console.log('Received PayFast ITN:', req.body);
      const pfData = req.body as PayFastData;
      const passphrase = process.env.PAYFAST_PASSPHRASE;
      
      const isValidSignature = validatePayFastSignature(pfData, passphrase);
      if (!isValidSignature) {
        console.error('Invalid PayFast signature');
        return res.status(400).send('Invalid signature');
      }
      
      const clientIP = req.ip || req.socket.remoteAddress || '';
      if (!validatePayFastIP(clientIP)) {
        console.error('Invalid PayFast IP:', clientIP);
        return res.status(403).send('Invalid IP');
      }
      
      console.log('Valid PayFast notification:', pfData);
      res.status(200).send('OK');
    } catch (error: any) {
      console.error('Error processing PayFast ITN:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get("/api/payfast/return", (req, res) => {
    res.redirect('/?payment=success');
  });

  app.get("/api/payfast/cancel", (req, res) => {
    res.redirect('/?payment=cancelled');
  });

  const httpServer = createServer(app);
  return httpServer;
}
