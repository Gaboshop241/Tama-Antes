import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Zap, Users, ArrowRight } from "lucide-react";

export default function Home() {
  const popularServices = [
    { name: "Netflix", price: "4.50", logo: "https://picsum.photos/seed/netflix/200/200", category: "SVOD" },
    { name: "Spotify", price: "2.99", logo: "https://picsum.photos/seed/spotify/200/200", category: "Musique" },
    { name: "Disney+", price: "3.20", logo: "https://picsum.photos/seed/disney/200/200", category: "SVOD" },
    { name: "YouTube Premium", price: "3.50", logo: "https://picsum.photos/seed/youtube/200/200", category: "Vidéo" },
    { name: "Canal+", price: "7.90", logo: "https://picsum.photos/seed/canal/200/200", category: "SVOD" },
    { name: "Crunchyroll", price: "1.99", logo: "https://picsum.photos/seed/anime/200/200", category: "Anime" },
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50 rounded-full blur-3xl -z-10 opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold mb-6">
              Économisez jusqu'à 75% sur vos abonnements
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
              Partagez vos abonnements <br />
              <span className="text-indigo-600">en toute sécurité.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Rejoignez plus de 100 000 utilisateurs qui divisent leurs factures Netflix, Spotify, Disney+ et bien d'autres.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/marketplace"
                className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
              >
                Trouver un abonnement <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/dashboard/create"
                className="w-full sm:w-auto bg-white text-slate-900 border-2 border-slate-200 px-10 py-4 rounded-2xl font-bold text-lg hover:border-indigo-600 transition-all"
              >
                Partager mon abonnement
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Services populaires</h2>
            <p className="text-slate-500">Les abonnements les plus demandés en ce moment</p>
          </div>
          <Link to="/marketplace" className="text-indigo-600 font-bold hover:underline">
            Voir tout
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {popularServices.map((service, i) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group cursor-pointer"
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-50">
                <img
                  src={service.logo}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{service.name}</h3>
              <p className="text-xs text-slate-400 mb-3">{service.category}</p>
              <p className="text-indigo-600 font-black">
                dès {service.price}€<span className="text-[10px] text-slate-400 font-normal">/mois</span>
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-900 py-24 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Pourquoi choisir SubShare ?</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Nous avons construit la plateforme la plus sûre pour vos partages.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">Paiements sécurisés</h3>
              <p className="text-slate-400">
                Vos transactions sont protégées et les fonds ne sont débloqués qu'une fois l'accès confirmé.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">Automatisé</h3>
              <p className="text-slate-400">
                Plus besoin de relancer vos amis. Les prélèvements et virements sont automatiques chaque mois.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">Communauté vérifiée</h3>
              <p className="text-slate-400">
                Un système de notation et de vérification pour garantir des échanges sereins.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
