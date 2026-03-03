export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 prose prose-slate">
      <h1 className="text-4xl font-black text-slate-900 mb-8">Politique de Confidentialité</h1>
      <div className="space-y-8 text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Collecte des données</h2>
          <p>Nous collectons les informations nécessaires à la création de votre compte et à la gestion de vos transactions (email, nom, données de paiement via nos partenaires).</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Utilisation des données</h2>
          <p>Vos données sont utilisées exclusivement pour le bon fonctionnement du service SubShare et ne sont jamais revendues à des tiers.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Vos droits</h2>
          <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.</p>
        </section>
      </div>
    </div>
  );
}
