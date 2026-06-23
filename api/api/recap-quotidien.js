// api/recap-quotidien.js
// Tourne automatiquement chaque jour à ~18h00 heure de Tahiti (voir vercel.json).
// Lit les commandes du jour dans le Google Sheet et construit un résumé.
// Pour l'instant, le résumé est juste loggé / renvoyé par l'endpoint — comme tu consultes
// déjà le Sheet directement, ce n'est pas obligatoire de l'envoyer ailleurs. Si tu veux
// le recevoir par Messenger ou email en plus, dis-le moi et on branchera l'envoi.

const { google } = require("googleapis");

function getSheetsClient() {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  );
  return google.sheets({ version: "v4", auth });
}

module.exports = async (req, res) => {
  try {
    const sheets = getSheetsClient();
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Commandes!A:I",
    });

    const lignes = result.data.values || [];
    const [, ...donnees] = lignes; // ignore la ligne d'en-tête

    const aujourdhui = new Date().toLocaleDateString("fr-FR", {
      timeZone: "Pacific/Tahiti",
    });

    const commandesDuJour = donnees.filter((ligne) =>
      (ligne[0] || "").startsWith(aujourdhui)
    );

    const resume = {
      date: aujourdhui,
      nombre_commandes: commandesDuJour.length,
      commandes: commandesDuJour.map((l) => ({
        nom: l[1],
        telephone: l[2],
        modele: l[3],
        couleur: l[4],
        prix: l[5],
        adresse: l[6],
        creneau: l[7],
        statut: l[8],
      })),
    };

    console.log("Récap du jour:", JSON.stringify(resume, null, 2));

    return res.status(200).json(resume);
  } catch (err) {
    console.error("Erreur récap quotidien:", err);
    return res.status(500).json({ error: "Erreur lors de la génération du récap" });
  }
};
