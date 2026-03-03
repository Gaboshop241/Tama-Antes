export default function Contact() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Contactez-nous</h1>
        <p className="text-slate-500">Une question ? Notre équipe vous répond en moins de 24h.</p>
      </div>

      <form className="space-y-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Nom complet</label>
          <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Email</label>
          <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Message</label>
          <textarea rows={5} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none"></textarea>
        </div>
        <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all">
          Envoyer le message
        </button>
      </form>
    </div>
  );
}
