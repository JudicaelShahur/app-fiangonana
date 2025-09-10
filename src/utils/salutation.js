
export const salutation = () => {
  const now = new Date();
  const h = now.getHours();
  
  if (h >= 1 && h < 12) return "Bonjour";
  if (h >= 12 && h < 18) return "Bon après-midi";
  return "Bonsoir";
};
