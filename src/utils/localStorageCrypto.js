
import CryptoJS from "crypto-js";
const SECRET_KEY = "ma_secret_clef_123"; 

/**
 * Save data encrypted ao amin'ny localStorage
 * @param {string} key - key ao amin'ny localStorage
 * @param {any} data - data ho voa-encrypt
 */
export const saveToLocalStorage = (key, data) => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    localStorage.setItem(key, ciphertext);
  } catch (e) {
    console.error("Erreur saving to localStorage:", e);
  }
};

/**
 * Maka data avy amin'ny localStorage ary decrypt
 * @param {string} key - key ao amin'ny localStorage
 * @returns {any} - object/array voa-decrypt na null raha misy erreur
 */
export const loadFromLocalStorage = (key) => {
  try {
    const ciphertext = localStorage.getItem(key);
    if (!ciphertext) return null;
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (e) {
    console.error("Erreur decrypting localStorage:", e);
    return null;
  }
};

/**
 * Remove data ao amin'ny localStorage
 * @param {string} key - key ao amin'ny localStorage
 */
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error("Erreur removing localStorage item:", e);
  }
};
