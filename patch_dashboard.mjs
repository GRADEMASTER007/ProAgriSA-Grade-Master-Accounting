import fs from 'fs';

const filePath = 'src/components/DashboardView.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Add imports for unread count
content = content.replace(
  "import { NavSection } from './Navbar';",
  "import { NavSection } from './Navbar';\nimport { collection, onSnapshot, query, where } from 'firebase/firestore';\nimport { db } from '../lib/firebase';\nimport { MessageSquare, Mail } from 'lucide-react';"
);

// Add state for unread counts
const stateReplacement = `  const { clients, products, quotes, invoices, payments, activities, companySettings, shippingRates, knowledge: knowledgeBase } = useApp();
  
  const [whatsappUnread, setWhatsappUnread] = useState(0);
  const [emailUnread, setEmailUnread] = useState(0);

  React.useEffect(() => {
    const qW = query(collection(db, 'whatsapp_conversations'), where('unreadCount', '>', 0));
    const uW = onSnapshot(qW, snap => setWhatsappUnread(snap.docs.reduce((acc, doc) => acc + (doc.data().unreadCount || 0), 0)));
    
    const qE = query(collection(db, 'email_conversations'), where('unreadCount', '>', 0));
    const uE = onSnapshot(qE, snap => setEmailUnread(snap.docs.reduce((acc, doc) => acc + (doc.data().unreadCount || 0), 0)));
    
    return () => { uW(); uE(); };
  }, []);
`;
content = content.replace(
  "  const { clients, products, quotes, invoices, payments, activities, companySettings, shippingRates, knowledge: knowledgeBase } = useApp();",
  stateReplacement
);

// Add the cards
const cardsReplacement = `      {/* KPI Stats Grid with Sleek Visuals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">`;
content = content.replace(
  `      {/* KPI Stats Grid with Sleek Visuals */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">`,
  cardsReplacement
);

// Insert the communication cards right after the active clients card
const clientBaseEnd = `            <button
              onClick={() => onNavigate('clients')}
              className="text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              Directory <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>`;

const newCards = `
        {/* WhatsApp Communications */}
        <div className="bg-[#11141D] p-4 rounded-xl border border-[#1F2430] shadow-sm relative overflow-hidden group hover:border-green-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-medium text-[#9CA3AF] uppercase tracking-wider">WhatsApp</span>
            <div className="p-2 bg-green-950/80 text-green-400 border border-green-800/40 rounded-lg">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mt-2 font-mono">
            <span className="text-xl sm:text-2xl font-bold text-white">{whatsappUnread}</span>
            <span className="text-xs text-green-400 font-semibold">Unread</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#9CA3AF]">
            <span>Business Inbox</span>
            <button
              onClick={() => onNavigate('whatsapp-inbox')}
              className="text-green-400 hover:underline flex items-center gap-0.5"
            >
              Open <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {/* Email Communications */}
        <div className="bg-[#11141D] p-4 rounded-xl border border-[#1F2430] shadow-sm relative overflow-hidden group hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-medium text-[#9CA3AF] uppercase tracking-wider">Emails</span>
            <div className="p-2 bg-blue-950/80 text-blue-400 border border-blue-800/40 rounded-lg">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mt-2 font-mono">
            <span className="text-xl sm:text-2xl font-bold text-white">{emailUnread}</span>
            <span className="text-xs text-blue-400 font-semibold">Unread</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#9CA3AF]">
            <span>Support & Sales</span>
            <button
              onClick={() => onNavigate('email-inbox')}
              className="text-blue-400 hover:underline flex items-center gap-0.5"
            >
              Open <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
`;

content = content.replace(clientBaseEnd, clientBaseEnd + newCards);

fs.writeFileSync(filePath, content);
console.log("Patched successfully");
