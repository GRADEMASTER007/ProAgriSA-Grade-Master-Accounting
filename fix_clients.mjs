import fs from 'fs';

const filePath = 'src/components/ClientsView.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const regex = /\{\/\* 3\. QUOTES TAB \*\/\}[\s\S]*?\{\/\* 7\. NOTES TAB \*\/\}/m;

const replacement = `{/* 3. QUOTES TAB */}
                {activeTab === 'quotes' && (
                  <div className="space-y-3 font-mono">
                    {clientQuotes.length === 0 ? (
                      <p className="text-[#6B7280] text-xs text-center py-4">No quotes found for this client.</p>
                    ) : (
                      <div className="bg-[#11141D] border border-[#1F2430] rounded-lg overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#161B28] text-[#9CA3AF]">
                            <tr>
                              <th className="px-3 py-2 font-semibold">Quote #</th>
                              <th className="px-3 py-2 font-semibold">Date</th>
                              <th className="px-3 py-2 font-semibold">Status</th>
                              <th className="px-3 py-2 text-right font-semibold">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1F2430]">
                            {clientQuotes.map((q) => (
                              <tr key={q.id} className="hover:bg-[#1A202C] text-white border-[#1F2430]">
                                <td className="px-3 py-2">{q.quoteNumber}</td>
                                <td className="px-3 py-2">{q.quoteDate}</td>
                                <td className="px-3 py-2">
                                  <span className={\`px-2 py-0.5 rounded text-[10px] \${q.status === 'Accepted' ? 'bg-emerald-950 text-emerald-400' : 'bg-[#252D3D] text-gray-300'}\`}>{q.status}</span>
                                </td>
                                <td className="px-3 py-2 text-right">{formatCurrency(q.grandTotal, companySettings.defaultCurrency)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. INVOICES TAB */}
                {activeTab === 'invoices' && (
                  <div className="space-y-3 font-mono">
                    {clientInvoices.length === 0 ? (
                      <p className="text-[#6B7280] text-xs text-center py-4">No invoices found for this client.</p>
                    ) : (
                      <div className="bg-[#11141D] border border-[#1F2430] rounded-lg overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#161B28] text-[#9CA3AF]">
                            <tr>
                              <th className="px-3 py-2 font-semibold">Invoice #</th>
                              <th className="px-3 py-2 font-semibold">Date</th>
                              <th className="px-3 py-2 font-semibold">Status</th>
                              <th className="px-3 py-2 text-right font-semibold">Balance</th>
                              <th className="px-3 py-2 text-right font-semibold">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1F2430]">
                            {clientInvoices.map((inv) => (
                              <tr key={inv.id} className="hover:bg-[#1A202C] text-white border-[#1F2430]">
                                <td className="px-3 py-2">{inv.invoiceNumber}</td>
                                <td className="px-3 py-2">{inv.invoiceDate}</td>
                                <td className="px-3 py-2">
                                  <span className={\`px-2 py-0.5 rounded text-[10px] \${inv.status === 'Paid' ? 'bg-emerald-950 text-emerald-400' : inv.status === 'Overdue' ? 'bg-red-950 text-red-400' : 'bg-amber-950 text-amber-400'}\`}>{inv.status}</span>
                                </td>
                                <td className="px-3 py-2 text-right text-amber-400">{formatCurrency(inv.balanceDue, companySettings.defaultCurrency)}</td>
                                <td className="px-3 py-2 text-right">{formatCurrency(inv.grandTotal, companySettings.defaultCurrency)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. PAYMENTS TAB */}
                {activeTab === 'payments' && (
                  <div className="space-y-3 font-mono">
                    {clientPayments.length === 0 ? (
                      <p className="text-[#6B7280] text-xs text-center py-4">No payments found for this client.</p>
                    ) : (
                      <div className="bg-[#11141D] border border-[#1F2430] rounded-lg overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#161B28] text-[#9CA3AF]">
                            <tr>
                              <th className="px-3 py-2 font-semibold">Receipt #</th>
                              <th className="px-3 py-2 font-semibold">Date</th>
                              <th className="px-3 py-2 font-semibold">Method</th>
                              <th className="px-3 py-2 font-semibold">Ref</th>
                              <th className="px-3 py-2 text-right font-semibold">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1F2430]">
                            {clientPayments.map((p) => (
                              <tr key={p.id} className="hover:bg-[#1A202C] text-white border-[#1F2430]">
                                <td className="px-3 py-2">{p.receiptNumber}</td>
                                <td className="px-3 py-2">{p.date}</td>
                                <td className="px-3 py-2">{p.method}</td>
                                <td className="px-3 py-2">{p.reference}</td>
                                <td className="px-3 py-2 text-right text-emerald-400">{formatCurrency(p.amount, companySettings.defaultCurrency)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 6. TIMELINE TAB */}
                {activeTab === 'timeline' && (
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

                {/* 7. NOTES TAB */}`;

content = content.replace(regex, replacement);

fs.writeFileSync(filePath, content);
console.log("Fixed clients view");
