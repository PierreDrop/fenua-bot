// lib/catalogue.js
// Informations fixes sur les produits Fenua Store (specs, descriptions, livraison).
// Le STOCK (couleurs disponibles) est récupéré en temps réel depuis Shopify dans lib/shopify.js
// — ce fichier ne contient que ce qui ne change pas souvent.

const CATALOGUE_STATIQUE = `
CATALOGUE FENUA STORE (infos fixes — le stock à jour est fourni séparément)

1. Nautilus - 41mm — 10 000 XPF (prix habituel 13 000 XPF, -23%)
   Couleurs possibles: Verte, Noir, Bleue
   Boîtier 41mm, bracelet largeur 22mm

2. Nautilus Femme — 10 000 XPF (prix habituel 13 000 XPF, -23%)
   Couleurs possibles: Rose, Noir, Verte, Bleue, Blanche, Or
   Boîtier 41mm, bracelet largeur 22mm

3. Oak - 41mm — 15 000 XPF (prix habituel 20 000 XPF, -25%)
   Couleurs possibles: Or, Fer/Vert, Fer/Noir, Fer/Blanc
   Boîtier 41mm, bracelet largeur 22mm

4. The King's Oak - 41mm — 20 000 XPF
   Couleurs possibles: Or, Fer/Noir, Fer/Bleu
   Boîtier 41mm, bracelet largeur 22mm

SPECS COMMUNES À TOUS LES MODÈLES:
- Acier inoxydable 316L
- Mouvement à quartz japonais (fiable, peu d'entretien)
- Verre saphir anti-rayures
- Résistant à l'eau (3ATM) — éclaboussures et pluie, PAS la nage/plongée
- Bracelet ajustable, outil de réglage offert
- Garantie 1 an, retour possible sous 14 jours

LIVRAISON:
- Gratuite à Tahiti. Préparation 24-48h, livraison estimée 1 à 3 jours.
- Livraison l'après-midi en semaine entre Punaauia et Arue.
- Livraison le samedi matin pour Mahina, Paea, Papara et toute la presqu'île.
- Envoi dans les îles de Polynésie tous les jours dès réception du paiement. Fret: 1 500 XPF.
- Paiement: à la livraison (cash, COD) pour Tahiti. Pour les îles, paiement à l'avance avant envoi.
- Précommande possible par Messenger pour une couleur épuisée: paiement à la précommande, livraison le mois suivant à l'arrivage.
- Service client 8h-17h via Messenger.
`.trim();

module.exports = { CATALOGUE_STATIQUE };
