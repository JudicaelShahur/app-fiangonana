export const getBackendMessage = (err) => {
  let messageErreur = "Erreur lors de l'inscription";

  const data = err || {}; // Raha err dia avy backend
  if (data.message) messageErreur = data.message;

  if (data.results) {
    const messages = Object.values(data.results).flat().join(" | ");
    messageErreur += `: ${messages}`;
  }

  return messageErreur;
};
