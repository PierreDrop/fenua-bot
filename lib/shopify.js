// lib/shopify.js
// Récupère le stock en temps réel depuis Shopify Admin API.
//
// Variables d'environnement nécessaires (à mettre dans Vercel > Settings > Environment Variables):
//   SHOPIFY_STORE_DOMAIN   ex: fenuastore-co.myshopify.com  (PAS l'URL publique fenuastore.co)
//   SHOPIFY_ADMIN_TOKEN    token généré dans Shopify Admin > Apps > Développer des apps > Token Admin API
//
// Comment créer le token Shopify (à faire une seule fois):
//   1. Dans l'admin Shopify: Paramètres > Apps et canaux de vente > Développer des apps
//   2. Créer une app, lui donner la permission "read_products" et "read_inventory"
//   3. Installer l'app, copier le "Token d'accès Admin API" (commence par shpat_...)

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VERSION = "2024-10";

async function shopifyFetch(path) {
  const url = `https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/${path}`;
  const res = await fetch(url, {
    headers: {
      "X-Shopify-Access-Token": SHOPIFY_TOKEN,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`Shopify API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function getStockActuel() {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
    return "STOCK EN TEMPS RÉEL INDISPONIBLE (config Shopify manquante) — utiliser le catalogue statique uniquement, et préciser au client de vérifier la disponibilité.";
  }

  try {
    const data = await shopifyFetch(
      "products.json?fields=id,title,variants&limit=50"
    );

    const lignes = data.products.map((produit) => {
      const variantes = produit.variants
        .map((v) => {
          const dispo = v.inventory_quantity > 0 ? "EN STOCK" : "ÉPUISÉ";
          return `${v.title}: ${dispo} (${v.price} XPF)`;
        })
        .join(", ");
      return `${produit.title} — ${variantes}`;
    });

    return "STOCK ACTUEL EN TEMPS RÉEL (Shopify):\n" + lignes.join("\n");
  } catch (err) {
    console.error("Erreur Shopify:", err);
    return "STOCK EN TEMPS RÉEL INDISPONIBLE (erreur API) — utiliser le catalogue statique avec prudence et inviter le client à confirmer la disponibilité.";
  }
}

module.exports = { getStockActuel };
