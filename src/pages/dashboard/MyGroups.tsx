import { useState, useEffect } from "react";
import { Users, Settings, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function MyGroups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd fetch only the user's created groups
    fetch("/api/subscriptions")
      .then(res => res.json())
      .then(data => {
        setGroups(data.slice(0, 2)); // Mocking user's groups
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Mes partages</h1>
          <p className="text-slate-500">Gérez les abonnements que vous partagez avec la communauté.</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-32 bg-white rounded-3xl animate-pulse" />)}
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 text-center">
          <p className="text-slate-400 mb-6">Vous ne partagez aucun abonnement pour le moment.</p>
          <Link to="/dashboard/create" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">
            Créer mon premier partage
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                <img src={group.logo_url || `https://picsum.photos/seed/${group.name}/200/200`} alt={group.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{group.name}</h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {group.slots_total - group.slots_available} / {group.slots_total} membres</span>
                  <span className="text-indigo-600 font-bold">{group.total_price}€ / mois total</span>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <Link to={`/subscription/${group.id}`} className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all">
                  <ExternalLink className="w-5 h-5" />
                </Link>
                <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
