import { useState, useEffect } from "react";
import { CreditCard, Calendar, MessageSquare, ShieldCheck } from "lucide-react";

export default function MySubscriptions() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/my-subscriptions")
      .then(res => res.json())
      .then(data => {
        setSubs(data.map((s: any) => ({
          ...s,
          owner: s.owner_name,
          price: (s.total_price / s.slots_total).toFixed(2),
          status: s.member_status,
          payment_status: s.payment_status
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Mes abonnements</h1>
        <p className="text-slate-500">Retrouvez tous les services auxquels vous avez souscrit.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-32 bg-white rounded-3xl animate-pulse" />)}
        </div>
      ) : subs.length === 0 ? (
        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 text-center">
          <p className="text-slate-400 mb-6">Vous n'avez rejoint aucun groupe pour le moment.</p>
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">
            Explorer la marketplace
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {subs.map((sub) => (
            <div key={sub.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                <CreditCard className="w-8 h-8 text-indigo-600" />
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <h3 className="text-xl font-bold text-slate-900">{sub.name}</h3>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase">Actif</span>
                </div>
                <p className="text-sm text-slate-500">Proposé par {sub.owner}</p>
              </div>

              <div className="grid grid-cols-2 md:flex gap-8 text-center md:text-left">
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase mb-1">Prix</p>
                  <p className="font-bold text-slate-900">{sub.price}€/mois</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase mb-1">Prochain prélèvement</p>
                  <p className="font-bold text-slate-900">{sub.next_renewal_date ? new Date(sub.next_renewal_date).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${sub.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  {sub.payment_status === 'paid' ? 'Payé' : 'En attente'}
                </div>
                <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2 font-bold text-sm">
                  <MessageSquare className="w-5 h-5" /> Chat
                </button>
                <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all">
                  <ShieldCheck className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
