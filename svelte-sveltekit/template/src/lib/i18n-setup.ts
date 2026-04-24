// src/lib/i18n-setup.ts
//
// Default setup: bundles a single English locale file. Replace or extend
// using one of the patterns below if your app needs more languages or
// wants to load translations on demand.
//
import { i18n } from '@keenmate/svelte-pure-admin';
import en from './locales/en.json';

export function setupI18n() {
	i18n.init({
		locale: 'en',
		fallbackLocale: 'en',
		languages: [{ code: 'en', name: 'English' }],
		translations: { en }
	});
}

// ── Example: lazy-loaded JSON from an endpoint ──────────────────────────
// Put translation files in static/locales/ (SvelteKit serves them from
// /locales/{code}.json). Only the active locale is fetched; switching to
// another language triggers another fetch.
//
// export function setupI18n() {
// 	i18n.init({
// 		locale: 'en',
// 		fallbackLocale: 'en',
// 		languages: [
// 			{ code: 'en', name: 'English' },
// 			{ code: 'cs', name: 'Czech', nativeName: 'Čeština' },
// 			{ code: 'de', name: 'Deutsch' }
// 		],
// 		translations: { en },                        // ship `en` inline so the first paint has strings
// 		loadTranslations: async (locale) => {
// 			const res = await fetch(`/locales/${locale}.json`);
// 			if (!res.ok) throw new Error(`Failed to load locale ${locale}: ${res.status}`);
// 			return res.json();
// 		}
// 	});
// }

// ── Example: bundled-but-code-split via Vite dynamic import ─────────────
// Translation JSON ships with the app but each locale lives in its own
// chunk — Vite splits them automatically. No HTTP roundtrip; works offline.
//
// export function setupI18n() {
// 	i18n.init({
// 		locale: 'en',
// 		fallbackLocale: 'en',
// 		languages: [
// 			{ code: 'en', name: 'English' },
// 			{ code: 'cs', name: 'Czech', nativeName: 'Čeština' }
// 		],
// 		translations: { en },
// 		loadTranslations: async (locale) => {
// 			const mod = await import(`./locales/${locale}.json`);
// 			return mod.default;
// 		}
// 	});
// }

// ── Example: API endpoint with auth + caching ───────────────────────────
// For SaaS apps that serve translations from your backend (e.g. per-tenant
// overrides, in-app translation editing, A/B-tested copy).
//
// export function setupI18n() {
// 	const cache = new Map<string, Record<string, string>>();
//
// 	i18n.init({
// 		locale: 'en',
// 		fallbackLocale: 'en',
// 		languages: [
// 			{ code: 'en', name: 'English' },
// 			{ code: 'cs', name: 'Czech' }
// 		],
// 		translations: { en },
// 		loadTranslations: async (locale) => {
// 			if (cache.has(locale)) return cache.get(locale)!;
// 			const res = await fetch(`/api/i18n/${locale}`, {
// 				headers: { Authorization: `Bearer ${getAuthToken()}` }
// 			});
// 			if (!res.ok) throw new Error(`Failed to load locale ${locale}`);
// 			const data = await res.json();
// 			cache.set(locale, data);
// 			return data;
// 		}
// 	});
// }
//
// // Switch language at runtime — async if the locale needs to be loaded:
// // await i18n.setLocale('cs');
