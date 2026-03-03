import { Link } from "react-router-dom";
import { Users, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface SubscriptionCardProps {
  subscription: {
    id: number;
    name: string;
    category: string;
    total_price: number;
    slots_total: number;
    slots_available: number;
    logo_url: string;
    owner_name: string;
  };
}

export default function SubscriptionCard({ subscription }: any) {
  const pricePerSlot = (subscription.total_price / subscription.slots_total).toFixed(2);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 transition-all group"
    >
      <Link to={`/subscription/${subscription.id}`}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
              <img
                src={subscription.logo_url || `https://picsum.photos/seed/${subscription.name}/200/200`}
                alt={subscription.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {subscription.category}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
            {subscription.name}
          </h3>
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Proposé par {subscription.owner_name}</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-600">
              <Users className="w-4 h-4" />
              <span className="text-sm font-bold">{subscription.slots_available} places</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-indigo-600 leading-none">
                {pricePerSlot}€
              </p>
              <span className="text-[10px] text-slate-400 font-medium">/ mois</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
