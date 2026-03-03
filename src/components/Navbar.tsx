import * as React from "react";
import { Link } from "react-router-dom";
import { Search, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenAuth = () => {
    console.log("Opening Auth Modal...");
    setIsAuthModalOpen(true);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
              SubShare
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/marketplace" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                Marketplace
              </Link>
              <Link to="/about" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                Comment ça marche ?
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un service..."
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
              />
            </div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 font-medium">
                  <User className="w-5 h-5" />
                  <span>{user.name}</span>
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleOpenAuth}
                className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-sm"
              >
                Connexion
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4">
          <Link to="/marketplace" className="block text-slate-600 font-medium">Marketplace</Link>
          <Link to="/about" className="block text-slate-600 font-medium">Comment ça marche ?</Link>
          {!user && (
            <button
              onClick={handleOpenAuth}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold"
            >
              Connexion
            </button>
          )}
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
}
