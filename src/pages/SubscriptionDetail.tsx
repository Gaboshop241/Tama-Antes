import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Shield, Users, Info, MessageCircle, Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function SubscriptionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/subscriptions/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSub(data);
        setLoading(false);
      });
  }, [id]);

  const handleJoin = async () => {
    if (!user) {
      toast.error("Veuillez vous connecter pour rejoindre un groupe");
      return;
    }

    try {
      const res = await fetch(`/api/subscriptions/${id}/join`, { method: "POST" });
      const data = await res.json();
      
      if (res.ok && data.checkout_url) {
        toast.success("Redirection vers le paiement...");
        window.location.href = data.checkout_url;
      } else {
        toast.error(data.error || "Une erreur est survenue");
      }
    } catch (err) {
      toast.error("Erreur de connexion");
    }
  };

  if (loading) return <div className="p-20 text-center">Chargement...</div>;
  if (!sub) return <div className="p-20 text-center">Abonnement introuvable</div>;

  const pricePerSlot = (sub.total_price / sub.slots_total).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
              <div className="w-32 h-32 rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                <img
                  src={sub.logo_url || `https://picsum.photos/seed/${sub.name}/200/200`}
                  alt={sub.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase">
                    {sub.category}
                  </span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Vérifié
                  </span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-2">{sub.name}</h1>
                <p className="text-slate-500 flex items-center gap-2">
                  Proposé par <span className="font-bold text-slate-900">{sub.owner_name}</span>
                  <span className="flex items-center text-amber-500"><Star className="w-4 h-4 fill-current" /> 4.9</span>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">À propos de cet abonnement</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {sub.description || "Aucune description fournie pour cet abonnement."}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">Places disponibles</h3>
                </div>
                <p className="text-3xl font-black text-indigo-600">
                  {sub.slots_available} <span className="text-lg text-slate-400 font-normal">/ {sub.slots_total}</span>
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">Garantie SubShare</h3>
                </div>
                <p className="text-slate-500 text-sm">
                  Remboursement garanti si l'accès ne fonctionne pas.
                </p>
              </div>
            </div>
          </div>

          {/* Reviews Section Placeholder */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Avis des membres</h2>
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="border-b border-slate-100 pb-6 last:border-0">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-slate-900">Utilisateur {i}</span>
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                  <p className="text-slate-600 italic">"Super partage, accès immédiat et propriétaire très réactif. Je recommande !"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Checkout */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl sticky top-24">
            <div className="text-center mb-8">
              <p className="text-slate-500 mb-2">Prix par place</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-black text-indigo-600">{pricePerSlot}€</span>
                <span className="text-slate-400 font-medium">/mois</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Paiement sécurisé mensuel</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Info className="w-4 h-4 text-indigo-500" />
                <span>Sans engagement, annulez à tout moment</span>
              </div>
            </div>

            <button
              onClick={handleJoin}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 mb-4"
            >
              Rejoindre le groupe
            </button>
            
            <button className="w-full flex items-center justify-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors">
              <MessageCircle className="w-5 h-5" /> Contacter le propriétaire
            </button>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white">
            <h3 className="text-xl font-bold mb-4">Comment ça marche ?</h3>
            <ul className="space-y-4 text-sm text-indigo-100">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 font-bold text-xs">1</span>
                Vous payez votre place sur SubShare
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 font-bold text-xs">2</span>
                Le propriétaire vous envoie les accès
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 font-bold text-xs">3</span>
                Vous profitez de votre service !
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
