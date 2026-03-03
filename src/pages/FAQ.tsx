export default function FAQ() {
  const faqs = [
    { q: "Comment fonctionne le partage d'abonnement ?", a: "Le propriétaire d'un abonnement multi-écrans propose les places qu'il n'utilise pas. Les membres rejoignent le groupe et paient leur part directement sur SubShare." },
    { q: "Est-ce légal ?", a: "Oui, la plupart des services autorisent le partage au sein d'un même foyer ou cercle d'amis. SubShare facilite simplement la gestion financière entre les membres." },
    { q: "Comment suis-je payé ?", a: "Si vous êtes propriétaire, l'argent est collecté auprès des membres et versé sur votre solde SubShare. Vous pouvez ensuite le virer vers votre compte bancaire." },
    { q: "Que se passe-t-il si l'accès ne fonctionne plus ?", a: "SubShare garantit vos paiements. Si un propriétaire ne fournit plus l'accès, vous êtes intégralement remboursé pour le mois en cours." },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-black text-slate-900 mb-12 text-center">Questions fréquentes</h1>
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4">{faq.q}</h3>
            <p className="text-slate-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
