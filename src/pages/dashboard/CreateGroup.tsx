import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Euro, Users, Image as ImageIcon, FileText, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

export default function CreateGroup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "SVOD",
    total_price: "",
    slots_total: "",
    description: "",
    logo_url: ""
  });

  const categories = ["SVOD", "Musique", "Logiciels", "Cloud", "Jeux Vidéo", "Presse"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          total_price: parseFloat(formData.total_price),
          slots_total: parseInt(formData.slots_total)
        }),
      });

      if (res.ok) {
        toast.success("Votre abonnement est maintenant partagé !");
        navigate("/dashboard/groups");
      } else {
        const data = await res.json();
        toast.error(data.error || "Une erreur est survenue");
      }
    } catch (err) {
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Partager un abonnement</h1>
        <p className="text-slate-500">Remplissez les informations pour créer votre groupe de partage.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Package className="w-4 h-4" /> Nom du service
            </label>
            <input
              type="text"
              placeholder="Ex: Netflix Premium, Spotify Family..."
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              Catégorie
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Euro className="w-4 h-4" /> Prix total mensuel (€)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Ex: 17.99"
              required
              value={formData.total_price}
              onChange={(e) => setFormData({ ...formData, total_price: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Users className="w-4 h-4" /> Nombre total de places
            </label>
            <input
              type="number"
              placeholder="Ex: 4"
              required
              value={formData.slots_total}
              onChange={(e) => setFormData({ ...formData, slots_total: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> URL du logo (optionnel)
          </label>
          <input
            type="url"
            placeholder="https://..."
            value={formData.logo_url}
            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Description
          </label>
          <textarea
            placeholder="Détails sur l'abonnement, règles du groupe..."
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Création..." : "Publier l'annonce"}
            {!loading && <ChevronRight className="w-6 h-6" />}
          </button>
        </div>
      </form>
    </div>
  );
}
