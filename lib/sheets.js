// lib/sheets.js
// Écrit une ligne de commande dans un Google Sheet.
//
// Variables d'environnement nécessaires:
//   GOOGLE_SERVICE_ACCOUNT_EMAIL   ex: fenua-bot@mon-projet.iam.gserviceaccount.com
//   GOOGLE_PRIVATE_KEY             la clé privée du compte de service (avec les \n échappés)
//   GOOGLE_SHEET_ID                l'ID du Google Sheet (dans l'URL entre /d/ et /edit)
//
// Comment créer le compte de service (à faire une seule fois):
//   1. console.cloud.google.com > créer un projet > activer "Google Sheets API"
//   2. Identifiants > Créer des identifiants > Compte de service
//   3. Créer une clé JSON pour ce compte, récupérer "client_email" et "private_key"
//   4. Ouvrir ton Google Sheet > Partager > coller l'email du compte de service (accès Éditeur)
//   5. Créer un onglet "Commandes" avec en ligne 1: Date | Nom | Téléphone | Modèle | Couleur | Prix | Adresse | Zone/Créneau | Statut

const { google } = require("googleapis");

function getSheetsClient() {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
  return google.sheets({ version: "v4", auth });
}

async function ajouterCommande(commande) {
  if (
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !process.env.GOOGLE_PRIVATE_KEY ||
    !process.env.GOOGLE_SHEET_ID
  ) {
    console.warn("Config Google Sheets manquante — commande non enregistrée:", commande);
    return false;
  }

  const sheets = getSheetsClient();
  const dateStr = new Date().toLocaleString("fr-FR", { timeZone: "Pacific/Tahiti" });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Commandes!A:I",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          dateStr,
          commande.nom || "",
          commande.telephone || "",
          commande.modele || "",
          commande.couleur || "",
          commande.prix || "",
          commande.adresse || "",
          commande.creneau || "",
          commande.statut || "Nouvelle",
        ],
      ],
    },
  });

  return true;
}

module.exports = { ajouterCommande };
