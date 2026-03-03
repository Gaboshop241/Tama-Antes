export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-slate-900 mb-6">Divisez vos factures, pas votre plaisir.</h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          SubShare est né d'un constat simple : nous payons tous trop cher pour des services que nous n'utilisons pas à 100%.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900">Notre mission</h2>
          <p className="text-slate-600 leading-relaxed">
            Rendre les services numériques accessibles à tous en optimisant les coûts grâce au partage communautaire sécurisé.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Nous croyons en une économie collaborative où chacun peut profiter du meilleur du divertissement et des outils SaaS sans se ruiner.
          </p>
        </div>
        <div className="bg-indigo-600 rounded-[3rem] aspect-square flex items-center justify-center p-12">
          <div className="text-white text-center">
            <p className="text-6xl font-black mb-2">+100k</p>
            <p className="text-indigo-100 font-bold uppercase tracking-widest text-sm">Utilisateurs actifs</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Prêt à économiser ?</h2>
        <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all">
          Rejoindre l'aventure
        </button>
      </div>
    </div>
  );
}
