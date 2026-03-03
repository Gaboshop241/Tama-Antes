import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { TrendingUp, Users, CreditCard, Wallet } from "lucide-react";

export default function Overview() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/payments/history")
      .then(res => res.json())
      .then(data => setPayments(data));
  }, []);

  const stats = [
    { name: "Économies réalisées", value: "42.50€", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100" },
    { name: "Abonnements actifs", value: "3", icon: CreditCard, color: "text-indigo-600", bg: "bg-indigo-100" },
    { name: "Membres dans vos groupes", value: "8", icon: Users, color: "text-amber-600", bg: "bg-amber-100" },
    { name: "Solde disponible", value: "12.80€", icon: Wallet, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Bonjour, {user?.name} !</h1>
        <p className="text-slate-500">Voici un aperçu de votre activité sur SubShare.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-slate-500 text-sm font-medium mb-1">{stat.name}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Dernières activités</h2>
          <div className="space-y-6">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <div key={payment.id} className="flex items-center gap-4 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-slate-900">Paiement pour {payment.subscription_name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">ID: {payment.chariow_order_id}</p>
                    <p className="text-xs text-slate-400">{new Date(payment.created_at).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm font-bold text-emerald-600">-{payment.amount}€</p>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-10">Aucune activité récente.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Demandes en attente</h2>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-bold text-slate-900">Jean D. souhaite rejoindre Spotify</p>
                  <p className="text-xs text-slate-400">Il y a 5 heures</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600">Accepter</button>
                  <button className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200">Refuser</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
