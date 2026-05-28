/**
 * Cart utility — per-account cart persistence.
 *
 * Cart items are stored under email-scoped keys:
 *   retailCart_<email>  /  b2bCart_<email>
 *
 * The global "active" keys (retailCart / b2bCart) always mirror the
 * logged-in account's data so that existing page code that reads those
 * keys continues to work without changes.
 */

const ACTIVE_RETAIL = "retailCart";
const ACTIVE_B2B    = "b2bCart";

function accountRetailKey(email: string) {
  return `retailCart_${email.toLowerCase()}`;
}
function accountB2BKey(email: string) {
  return `b2bCart_${email.toLowerCase()}`;
}

/** Call on login: restore this account's saved cart into the active keys. */
export function restoreCartForAccount(email: string): void {
  const retail = localStorage.getItem(accountRetailKey(email)) || "[]";
  const b2b    = localStorage.getItem(accountB2BKey(email))    || "[]";
  localStorage.setItem(ACTIVE_RETAIL, retail);
  localStorage.setItem(ACTIVE_B2B,    b2b);
}

/** Call on logout: save the active cart back under the account key, then clear active keys. */
export function saveAndClearCartForAccount(email: string): void {
  const retail = localStorage.getItem(ACTIVE_RETAIL) || "[]";
  const b2b    = localStorage.getItem(ACTIVE_B2B)    || "[]";
  if (email) {
    localStorage.setItem(accountRetailKey(email), retail);
    localStorage.setItem(accountB2BKey(email),    b2b);
  }
  localStorage.removeItem(ACTIVE_RETAIL);
  localStorage.removeItem(ACTIVE_B2B);
}

/** Sync the active keys back to the account's named keys (call after every cart mutation). */
export function syncCartToAccount(email: string): void {
  if (!email) return;
  const retail = localStorage.getItem(ACTIVE_RETAIL) || "[]";
  const b2b    = localStorage.getItem(ACTIVE_B2B)    || "[]";
  localStorage.setItem(accountRetailKey(email), retail);
  localStorage.setItem(accountB2BKey(email),    b2b);
}
