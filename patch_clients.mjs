import fs from 'fs';

const filePath = 'src/components/ClientsView.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

content = content.replace(
  "| 'communications' | 'notes'>('overview');",
  "| 'timeline' | 'notes'>('overview');"
);

content = content.replace(
  "{ id: 'communications', label: 'Comms Log' },",
  "{ id: 'timeline', label: 'Timeline' },"
);

content = content.replace(
  "activeTab === 'communications'",
  "activeTab === 'timeline'"
);

const timelineReplacement = `                {activeTab === 'timeline' && (
                  <div className="space-y-4 font-mono">
                    {(() => {
                      // Aggregate all events
                      const events = [
                        ...clientQuotes.map(q => ({ type: 'Quote', date: q.quoteDate, data: q })),
                        ...clientInvoices.map(i => ({ type: 'Invoice', date: i.invoiceDate, data: i })),
                        ...clientPayments.map(p => ({ type: 'Payment', date: p.date, data: p })),
                        ...clientCommunications.map(c => ({ type: 'Communication', date: c.sentAt, data: c }))
                      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                      
                      if (events.length === 0) return <p className="text-xs text-[#6B7280] py-6 text-center">No timeline events recorded.</p>;
                      
                      return events.map((ev, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center border shrink-0 bg-[#161B28]">
                               {ev.type === 'Quote' && <FileText className="w-3 h-3 text-cyan-400" />}
                               {ev.type === 'Invoice' && <Receipt className="w-3 h-3 text-amber-400" />}
                               {ev.type === 'Payment' && <CreditCard className="w-3 h-3 text-emerald-400" />}
                               {ev.type === 'Communication' && (ev.data.channel === 'WhatsApp' ? <MessageSquare className="w-3 h-3 text-emerald-400" /> : <Mail className="w-3 h-3 text-blue-400" />)}
                            </div>
                            {i !== events.length - 1 && <div className="w-px h-full bg-[#1F2430] my-1"></div>}
                          </div>
                          <div className="pb-4 flex-1">
                             <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-white text-xs">{ev.type}</span>
                                <span className="text-[10px] text-[#6B7280]">{formatDate(ev.date)}</span>
                             </div>
                             <div className="bg-[#11141D] p-3 rounded-lg border border-[#1F2430] text-[11px] text-[#9CA3AF]">
                                {ev.type === 'Quote' && <div>Quote {ev.data.quoteNumber} - {formatCurrency(ev.data.grandTotal, companySettings.defaultCurrency)} ({ev.data.status})</div>}
                                {ev.type === 'Invoice' && <div>Invoice {ev.data.invoiceNumber} - {formatCurrency(ev.data.grandTotal, companySettings.defaultCurrency)} ({ev.data.status})</div>}
                                {ev.type === 'Payment' && <div>Payment {ev.data.receiptNumber} - {formatCurrency(ev.data.amount, companySettings.defaultCurrency)}</div>}
                                {ev.type === 'Communication' && <div>{ev.data.channel} • {ev.data.documentType}: {ev.data.message}</div>}
                             </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                )}
`;

content = content.replace(
  /<div className="space-y-2 font-mono">[\s\S]*?clientCommunications\.map\(\(c\) => \([\s\S]*?\)\)[\s\S]*?\}[\s\S]*?<\/div>[\s\S]*?\)\}/m,
  timelineReplacement
);

fs.writeFileSync(filePath, content);
console.log("Timeline patched successfully");
