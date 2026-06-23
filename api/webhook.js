// api/webhook.js
// Point d'entrée appelé par ManyChat à chaque message reçu sur Messenger.
//
// Configuration ManyChat (External Request):
//   Méthode: POST
//   URL: https://TON-PROJET.vercel.app/api/webhook
//   Body (JSON):
//     {
//       "message": "{{last user message text}}",
//       "subscriber_id": "{{subscriber id}}"
//     }
//   Réponse attendue par ManyChat: champ "reponse" → à afficher comme réponse au client
//
// NOTE SUR L'HISTORIQUE: cette version garde l'historique en mémoire seulement
// pendant l'exécution (pas persistant entre messages). Pour un vrai suivi de
// conversation multi-tours, on pourra ajouter un stockage (ex: Vercel KV) —
// on commence simple, on améliore après les premiers tests.

const { getStockActuel } = require("../lib/shopify");
const { obtenirReponse } = require("../lib/claude");
const { ajouterCommande } = require("../lib/sheets");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée, utiliser POST" });
  }

  try {
    const { message, subscriber_id } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Le champ 'message' est requis" });
    }

    const stockActuel = await getStockActuel();

    const resultat = await obtenirReponse({
      messageClient: message,
      stockActuel,
    });

    if (resultat.commande_detectee && resultat.commande) {
      try {
        await ajouterCommande(resultat.commande);
      } catch (err) {
        // On ne bloque jamais la réponse au client si l'écriture Sheets échoue
        console.error("Erreur écriture Google Sheets:", err);
      }
    }

    return res.status(200).json({
      reponse: resultat.reponse,
      subscriber_id: subscriber_id || null,
    });
  } catch (err) {
    console.error("Erreur webhook:", err);
    return res.status(200).json({
      reponse:
        "Désolé, j'ai un petit souci technique en ce moment 🙏 Tu peux réessayer dans une minute ou je te réponds très vite en personne !",
    });
  }
};
