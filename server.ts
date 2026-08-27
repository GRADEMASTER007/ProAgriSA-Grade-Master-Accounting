import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { whatsappRouter } from "./src/api/whatsapp.js";
import { getGenAI } from "./src/lib/gemini.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Mount WhatsApp Meta API routes
app.use('/api/whatsapp', whatsappRouter);


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Assistant Chat Route
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, message, history, context, dbState } = req.body;

    const rawMessages = messages || (history ? [...history.map((h: any) => ({ role: h.role === 'model' ? 'assistant' : 'user', content: h.parts?.[0]?.text || h.text || '' })), { role: 'user', content: message }] : [{ role: 'user', content: message || '' }]);
    const state = dbState || context || {};

    if (!rawMessages || !Array.isArray(rawMessages) || rawMessages.length === 0) {
      return res.status(400).json({ error: 'Messages array or message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback local rule-based assistant if no API key is set yet
      const lastUserMsg = rawMessages[rawMessages.length - 1]?.content || '';
      return res.json({
        content: `I received your request: "${lastUserMsg}". To enable full live Gemini intelligence, please ensure your GEMINI_API_KEY is configured. You can still use our direct Quotations and Invoices generator screens to create and download official PDFs instantly.`,
        actionDraft: null,
      });
    }

    const ai = getGenAI();

    // Prepare context from current database state
    const clientsList = (state?.clients || []).map((c: any) => ({
      id: c.id,
      companyName: c.companyName,
      contactPerson: c.contactPerson,
      email: c.email,
      phone: c.phone,
      whatsapp: c.whatsapp,
      country: c.country,
      city: c.city,
      clientType: c.clientType,
      specialPricing: c.specialPricing,
    }));

    const productsList = (state?.products || []).map((p: any) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      standardPrice: p.standardPrice,
      wholesalePrice: p.wholesalePrice,
      retailPrice: p.retailPrice,
      unit: p.unit,
      category: p.category,
    }));

    const shippingList = (state?.shippingRates || []).map((s: any) => ({
      id: s.id,
      destinationCountry: s.destinationCountry,
      destinationProvince: s.destinationProvince,
      shippingCompany: s.shippingCompany,
      cost: s.cost,
      deliveryTime: s.deliveryTime,
      shippingMethod: s.shippingMethod,
    }));

    const outstandingInvoices = (state?.invoices || [])
      .filter((inv: any) => inv.status !== 'Paid' && inv.balanceDue > 0)
      .map((inv: any) => ({
        invoiceNumber: inv.invoiceNumber,
        client: inv.clientSnapshot?.companyName,
        grandTotal: inv.grandTotal,
        amountPaid: inv.amountPaid,
        balanceDue: inv.balanceDue,
        dueDate: inv.dueDate,
        status: inv.status,
      }));

    const companyInfo = state?.companySettings || {
      companyName: 'Healthy Fields Business Hub',
      tradingName: 'ProAgriSA / Healthy Fields Business Hub',
      physicalAddress: 'Franschhoek Estate Unit 11, 22 Wren Street, Chancliff Ridge / Rant en Dal, Krugersdorp, 1739, South Africa',
      phone: '+27 83 447 4639',
      whatsapp: '+27 83 447 4639',
      email: 'admin@proagrisa.co.za',
      vatNumber: '4820293819',
      bankName: 'Capitec Business Bank',
      accountName: 'Healthy Fields',
      accountNumber: '1052 3916 30',
      branchCode: '450105',
    };

    const knowledgeSnippets = (state?.knowledge || []).map((k: any) => ({
      title: k.title,
      category: k.category,
      content: k.content,
    }));

    const systemPrompt = `You are the private AI Business Assistant for "Healthy Fields Business Hub / ProAgriSA Grade Master" — an enterprise agricultural CRM, Quotation, Invoicing, and PDF generator system.
The user is the business owner and operations manager.

COMPANY OFFICIAL ADDRESS FOR ALL BUSINESS:
Franschhoek Estate Unit 11, 22 Wren Street, Chancliff Ridge / Rant en Dal, Krugersdorp, Area Code 1739, South Africa.

CRITICAL OPERATIONAL RULES:
1. STRICT PRICING & FINANCIAL ACCURACY:
   - NEVER invent or hallucinate product prices, shipping rates, or totals.
   - When a client is specified, ALWAYS check for:
     a) Client-specific special price (client.specialPricing[productId])
     b) Client tier (if Wholesale/Commercial Farm, use product.wholesalePrice)
     c) Standard price (product.standardPrice)
   - When shipping destination is specified (e.g. Botswana, Namibia, Zimbabwe, South Africa), retrieve the exact shipping cost from the Shipping database.
   - If a product, client special price, or shipping rate cannot be found with certainty, state clearly what was found and ask the owner for confirmation or clarification instead of guessing.

2. INVOICING & PDF CREATION:
   - When the user asks to create/generate an invoice or quote (or make a PDF to download), compute the line items, quantities, unit prices, discounts, freight shipping costs, and VAT (15% in SA, or 0% for zero-rated cross-border export).
   - ALWAYS output an action draft in json_action format so the interactive UI immediately renders the document card with 1-click "Download PDF" and "Save & Download PDF" buttons.
   - Tell the user in your message: "I have prepared your Tax Invoice / Quotation. You can download the official PDF directly using the buttons below, or save it to your ledger."

CURRENT DATABASE STATE SNAPSHOT:
- Company: ${JSON.stringify(companyInfo)}
- Clients (${clientsList.length}): ${JSON.stringify(clientsList)}
- Products (${productsList.length}): ${JSON.stringify(productsList)}
- Shipping Rates (${shippingList.length}): ${JSON.stringify(shippingList)}
- Outstanding Invoices: ${JSON.stringify(outstandingInvoices)}
- Knowledge Base: ${JSON.stringify(knowledgeSnippets)}

When responding, if your response prepares a quote or invoice (or if user asked to create one), output a JSON block at the very end of your message in the exact format:
\`\`\`json_action
{
  "type": "create_invoice" | "create_quote",
  "title": "Action title",
  "summary": "Short 1-line summary",
  "data": {
    "clientId": "client-id",
    "clientName": "Company Name",
    "invoiceDate": "YYYY-MM-DD",
    "dueDate": "YYYY-MM-DD",
    "items": [
      {
        "productId": "prod-id",
        "sku": "SKU",
        "name": "Product Name",
        "unit": "plant",
        "quantity": 500,
        "unitPrice": 15.0,
        "discountPercent": 0,
        "discountAmount": 0,
        "lineTotal": 7500.0,
        "priceSource": "client_special" | "wholesale" | "standard"
      }
    ],
    "subtotal": 7500.0,
    "shippingCost": 2500.0,
    "shippingDetails": "Road Freight",
    "vatRate": 15,
    "vatAmount": 1500.0,
    "grandTotal": 11500.0,
    "notes": "...",
    "currency": "ZAR"
  }
}
\`\`\`

Keep all conversational text polite, professional, concise, and focused on agricultural business operations.`;

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Understood. I am Healthy Fields & ProAgriSA AI Business Copilot, connected to your database with live PDF generation capability.' }] },
      ...rawMessages.map((m: any) => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content || m.text || '' }],
      })),
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        temperature: 0.2,
      },
    });

    const responseText = response.text || '';
    
    // Parse any embedded json_action block or action_draft block
    let cleanedContent = responseText;
    let actionDraft = null;

    const actionMatch = responseText.match(/```(?:json_action|action_draft)\s*([\s\S]*?)\s*```/);
    if (actionMatch) {
      try {
        actionDraft = JSON.parse(actionMatch[1]);
        if (actionDraft.type === 'invoice_preview') actionDraft.type = 'create_invoice';
        if (actionDraft.type === 'quote_preview') actionDraft.type = 'create_quote';
        actionDraft.status = 'pending_confirmation';
        cleanedContent = responseText.replace(/```(?:json_action|action_draft)\s*[\s\S]*?\s*```/, '').trim();
      } catch (e) {
        console.warn('Failed to parse json_action block:', e);
      }
    }

    res.json({
      content: cleanedContent,
      text: cleanedContent,
      actionDraft,
    });
  } catch (err: any) {
    console.error('Error in /api/ai/chat:', err);
    res.status(500).json({ error: err.message || 'Internal AI processing error' });
  }
});

// Email dispatch route
app.post('/api/email/send', (req, res) => {
  const { to, subject, body, documentNumber } = req.body;
  if (!to) {
    return res.status(400).json({ error: 'Recipient email is required' });
  }

  // Record simulated / live transmission
  console.log(`[Email Dispatch] Sending to: ${to} | Subject: ${subject} | Ref: ${documentNumber}`);
  res.json({
    success: true,
    messageId: `msg_${Date.now()}`,
    status: 'Sent',
    sentAt: new Date().toISOString(),
  });
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ProAgriSA Grade Master Accounting server running on http://localhost:${PORT}`);
  });
}

startServer();
