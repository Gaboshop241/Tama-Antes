import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  CreditCard, 
  Settings, 
  MessageSquare,
  ChevronRight,
  Plus
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import CreateGroup from "./dashboard/CreateGroup";
import Overview from "./dashboard/Overview";
import MyGroups from "./dashboard/MyGroups";
import MySubscriptions from "./dashboard/MySubscriptions";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-20 text-center">Chargement...</div>;
  if (!user) return <div className="p-20 text-center">Veuillez vous connecter</div>;

  const sidebarLinks = [
    { name: "Vue d'ensemble", path: "/dashboard", icon: LayoutDashboard },
    { name: "Mes abonnements", path: "/dashboard/subscriptions", icon: CreditCard },
    { name: "Mes partages", path: "/dashboard/groups", icon: Users },
    { name: "Messages", path: "/dashboard/messages", icon: MessageSquare },
    { name: "Paramètres", path: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                    isActive 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <Link
            to="/dashboard/create"
            className="mt-6 flex items-center justify-center gap-2 w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100"
          >
            <Plus className="w-5 h-5" />
            Partager un service
          </Link>
        </aside>

        {/* Main Content */}
        <div className="flex-grow">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="create" element={<CreateGroup />} />
            <Route path="groups" element={<MyGroups />} />
            <Route path="subscriptions" element={<MySubscriptions />} />
            <Route path="*" element={<div className="p-12 text-center text-slate-400">Cette section arrive bientôt !</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
