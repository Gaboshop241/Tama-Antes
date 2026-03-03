import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-indigo-600 mb-4 block">
              SubShare
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              La plateforme leader pour partager vos abonnements et diviser vos factures en toute sécurité.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Plateforme</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/marketplace" className="hover:text-indigo-600">Marketplace</Link></li>
              <li><Link to="/about" className="hover:text-indigo-600">Comment ça marche</Link></li>
              <li><Link to="/faq" className="hover:text-indigo-600">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Légal</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/terms" className="hover:text-indigo-600">CGU</Link></li>
              <li><Link to="/privacy" className="hover:text-indigo-600">Confidentialité</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-600">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Suivez-nous</h4>
            <div className="flex gap-4">
              {/* Social icons would go here */}
              <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
              <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
              <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-100 pt-8 text-center text-slate-400 text-xs">
          © {new Date().getFullYear()} SubShare. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
