const fs = require('fs');
let code = fs.readFileSync('src/components/WhatsAppInboxView.tsx', 'utf8');

const target = `<textarea 
                  value={messageInput}`;
const replace = `<div className="relative flex-1">
                  {messageInput === "/" && <QuickRepliesDropdown onSelect={(t) => setMessageInput(t)} />}
                  <textarea 
                  value={messageInput}`;

code = code.replace(target, replace);
code = code.replace('className="flex-1 bg-[#0A0B0E]', 'className="w-full bg-[#0A0B0E]');

const target2 = `rows={Math.min(4, messageInput.split('\\n').length || 1)}
                />
  </div>
                />`;
const target3 = `rows={Math.min(4, messageInput.split('\\n').length || 1)}
                />`;

// I'll just restore the original and patch it properly.
