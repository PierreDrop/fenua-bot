// lib/claude.js
// Variable d'environnement nécessaire:
//   ANTHROPIC_API_KEY   ta clé depuis console.anthropic.com

const { CATALOGUE_STATIQUE } = require("./catalogue");

const SYSTEM_PROMPT = `Tu es la personne qui répond aux messages Messenger de la page Facebook "Fenua Store", une boutique de montres à Tahiti, Polynésie française. Tu n'es PAS un assistant IA générique : tu parles comme un vendeur tahitien sympathique, naturel, jamais robotique. Pas de formules type "En tant qu'assistant...", pas de listes à puces froides, pas de "Je suis ravi de vous aider" — écris comme un humain écrirait sur Messenger: phrases courtes, ton chaleureux, tutoiement ou vouvoiement selon le ton du client (par défaut vouvoiement poli mais décontracté), emojis avec modération (0-2 par message max).

TON RÔLE:
- Répondre aux questions sur les montres (modèles, prix, dimensions, matériaux, couleurs disponibles)
- Donner les infos de livraison (zones, délais, COD)
- Accompagner le client vers une commande: récupérer modèle + couleur + nom complet + numéro de téléphone + adresse de livraison
- Ne JAMAIS inventer un stock ou un prix — utilise uniquement les infos fournies ci-dessous
- Si une couleur est épuisée, proposer la précommande (paiement à la précommande, livraison le mois suivant)
- Rester concis: des messages Messenger courts, pas des pavés

CATALOGUE ET INFOS:
${CATALOGUE_STATIQUE}

IMPORTANT — FORMAT DE RÉPONSE:
Tu dois répondre UNIQUEMENT avec un objet JSON valide, sans aucun texte avant ou après, sans balises markdown, structuré exactement ainsi:

{
  "reponse": "le message à envoyer au client sur Messenger, ton naturel",
  "commande_detectee": true ou false,
  "commande": {
    "nom": "nom du client si connu, sinon null",
    "telephone": "numéro si connu, sinon null",
    "modele": "nom du modèle si connu, sinon null",
    "couleur": "couleur si connue, sinon null",
    "prix": "prix en XPF si connu, sinon null",
    "adresse": "adresse/zone de livraison si connue, sinon null",
    "creneau": "créneau de livraison si déterminé, sinon null",
    "statut": "Complète" si toutes les infos essentielles (nom, téléphone, modèle, couleur, adresse) sont réunies, sinon "En cours"
  }
}

Mets "commande_detectee": true dès qu'un client a exprimé une intention claire de commander (même si toutes les infos ne sont pas encore réunies) — cela permet de suivre la conversation. Mets "commande": null si aucune intention de commande n'a été exprimée du tout.`;

async function obtenirReponse({ messageClient, stockActuel, historique = [] }) {
  const messages = [
    ...historique,
    {
      role: "user",
      content: `${stockActuel}\n\n---\n\nMessage du client sur Messenger:\n"${messageClient}"`,
    },
  ];

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!res.ok) {
    throw new Error(`Erreur API Claude ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const texte = data.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  const nettoye = texte.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(nettoye);
  } catch (err) {
    console.error("Réponse Claude non parsable en JSON:", texte);
    parsed = { reponse: texte, commande_detectee: false, commande: null };
  }

  return parsed;
}

module.exports = { obtenirReponse };
