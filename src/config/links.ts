// Contact, booking and pricing. Edit here and every screen picks it up.

export const WHATSAPP_NUMBER = '573138642943';
export const INSTAGRAM_HANDLE = 'pragmagicka';
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}/`;
export const INSTAGRAM_DM_URL = `https://ig.me/m/${INSTAGRAM_HANDLE}`;
export const KOFI_BOOKING_URL = 'https://ko-fi.com/pragmagicka/commissions';
export const KOFI_GOAL_URL = 'https://ko-fi.com/pragmagicka/goal?g=1';
export const CONTACT_EMAIL = 'lorena@pragmagick.app';

/** Where people can buy the physical stickers */
export const STICKER_SHOP_URL = 'https://ko-fi.com/pragmagicka/shop';

/** Set to true if every 1:1 reading comes with a physical sticker */
export const READING_INCLUDES_STICKER = false;

/** Price of a 1:1 reading in USD. Leave null to hide the price. */
export const READING_PRICE_USD: number | null = null;

export const whatsappUrl = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
