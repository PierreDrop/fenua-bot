# Bot Messenger Fenua Store — Guide de mise en place

## Ce que fait ce bot
1. Reçoit les messages Messenger via ManyChat
2. Vérifie le stock réel sur Shopify
3. Fait répondre Claude de manière naturelle (catalogue, prix, livraison)
4. Détecte les commandes et les note dans un Google Sheet
5. Un résumé quotidien automatique liste les commandes du jour

## Étape 1 — Déployer sur Vercel
1. Mets ce dossier dans un repo GitHub (ou utilise `vercel deploy` en CLI depuis ce dossier)
2. Sur vercel.com, importe le repo (ou confirme le déploiement CLI)
3. Récupère l'URL de déploiement, ex: `https://fenua-bot.vercel.app`

## Étape 2 — Variables d'environnement (Vercel > Settings > Environment Variables)
| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Ta clé depuis console.anthropic.com |
| `SHOPIFY_STORE_DOMAIN` | Ton domaine `.myshopify.com` (pas fenuastore.co) |
| `SHOPIFY_ADMIN_TOKEN` | Token Admin API Shopify (voir lib/shopify.js pour comment le créer) |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Email du compte de service Google |
| `GOOGLE_PRIVATE_KEY` | Clé privée du compte de service (garder les `\n`) |
| `GOOGLE_SHEET_ID` | ID du Sheet (dans l'URL entre `/d/` et `/edit`) |

Après avoir ajouté les variables, redéploie le projet pour qu'elles soient prises en compte.

## Étape 3 — Préparer le Google Sheet
Crée un onglet nommé exactement `Commandes` avec en ligne 1 ces colonnes :
`Date | Nom | Téléphone | Modèle | Couleur | Prix | Adresse | Zone/Créneau | Statut`

Partage le Sheet (bouton Partager) avec l'email du compte de service Google, en lui donnant l'accès Éditeur.

## Étape 4 — Trouver le token Admin Shopify
1. Admin Shopify > Paramètres > Apps et canaux de vente > Développer des apps
2. Créer une app, configurer l'accès API Admin avec les scopes `read_products` et `read_inventory`
3. Installer l'app sur ta boutique, copier le token (commence par `shpat_...`)

## Étape 5 — Configurer ManyChat
1. Connecte ta page Facebook Fenua Store à ManyChat
2. Crée
