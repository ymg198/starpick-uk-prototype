// Prototype sign-in: every sign-in option logs into the demo account (data/products.js → DEMO_USER).
// Orders placed with "Buy now" are added on top of the demo order history.
import { DEMO_USER } from '../data/products.js';
import { store } from './utils.js';

export function currentUser() {
  const u = store.get('user', null);
  if (!u) return null;
  return { ...DEMO_USER, ...u, orders: [...store.get('newOrders', []), ...DEMO_USER.orders] };
}

export function signIn(method, email) {
  const user = { method, email: email || DEMO_USER.email };
  store.set('user', user);
  return currentUser();
}

export function signOut() {
  store.set('user', null);
}

export function placeOrder(productIds) {
  const order = {
    id: 'SP-' + (21000 + Math.floor(Math.random() * 900)),
    date: new Date().toISOString().slice(0, 10),
    status: 'Processing',
    items: productIds,
  };
  store.set('newOrders', [order, ...store.get('newOrders', [])]);
  return order;
}

// All product ids this user has bought, newest first
export function purchasedIds(user = currentUser()) {
  if (!user) return [];
  return [...new Set(user.orders.flatMap((o) => o.items))];
}

export const initials = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
