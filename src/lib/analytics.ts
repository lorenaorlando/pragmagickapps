// Google Analytics 4 (gtag is loaded in index.html with automatic page views turned off,
// because this is a single-page app: each screen change is sent from App instead).

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const send = (...args: unknown[]) => {
  try {
    window.gtag?.(...args);
  } catch {
    // analytics must never break the app
  }
};

export const trackPageView = (path: string) =>
  send('event', 'page_view', {
    page_location: window.location.origin + path,
    page_title: document.title,
  });

/**
 * Events sent by the app:
 * language_selected, spread_start, three_card_mode, reading_complete,
 * booking_click (Ko-fi / WhatsApp / Instagram), testimonials_open, share,
 * sticker_drawn, kit_offer_click, generate_lead (sticker kit email), kit_download, kit_install,
 * goal_open (app-store campaign), coin_flip
 */
export const track = (event: string, params: Params = {}) => send('event', event, params);
