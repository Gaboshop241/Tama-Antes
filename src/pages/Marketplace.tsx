import { useState, useEffect } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import SubscriptionCard from "../components/SubscriptionCard";
import { motion } from "framer-motion";

export default function Marketplace() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["Tous", "SVOD", "Musique", "Logiciels", "Cloud", "Jeux Vidéo", "Presse"];

  useEffect(() => {
    fetch("/api/subscriptions")
      .then((res) => res.json())
      .then((data) => {
        setSubscriptions(data);
        setLoading(false);
      });
  }, []);

  const filteredSubs = subscriptions.filter((sub) => {
    const matchesCategory = category === "Tous" || sub.category === category;
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Marketplace</h1>
          <p className="text-slate-500">Trouvez l'abonnement idéal parmi des centaines d'offres.</p>
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-indigo-600 transition-all shadow-sm">
            <SlidersHorizontal className="w-5 h-5" />
            Filtres
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-12 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
              category === cat
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-3xl h-80 animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredSubs.map((sub) => (
            <SubscriptionCard key={sub.id} subscription={sub} />
          ))}
          {filteredSubs.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-400 text-lg">Aucun abonnement ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
