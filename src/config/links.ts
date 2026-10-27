// Contact, booking and pricing. Edit here and every screen picks it up.

export const WHATSAPP_NUMBER = '573138642943';
export const INSTAGRAM_HANDLE = 'pragmagicka';
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}/`;
export const INSTAGRAM_DM_URL = `https://ig.me/m/${INSTAGRAM_HANDLE}`;
export const KOFI_BOOKING_URL = 'https://ko-fi.com/pragmagicka/commissions';
export const KOFI_GOAL_URL = 'https://ko-fi.com/pragmagicka/goal?g=1';
export const CONTACT_EMAIL = 'lorena@pragmagick.app';

/** AMIGAAAAAAAH sticker kit, unlocked with an email address */
export const STICKER_KIT_URL = '/kit/amigah-stickers.zip';
/** One-tap install links, once the packs exist (t.me/addstickers/... and a Sticker.ly link) */
export const TELEGRAM_STICKERS_URL: string | null = null;
export const WHATSAPP_STICKERS_URL: string | null = null;
/** Emails from the kit form are sent here through FormSubmit (no account needed) */
export const LEADS_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

/** Price of a 1:1 reading in USD. Leave null to hide the price. */
export const READING_PRICE_USD: number | null = null;

export const whatsappUrl = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
