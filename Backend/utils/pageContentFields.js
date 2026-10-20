/*
|--------------------------------------------------------------------------
| Page Content Fields
|--------------------------------------------------------------------------
| Home / About / Skills / Contact pages ke editable text fields aur unki
| max length. Model aur controller dono yahi list use karte hain, taaki
| sirf whitelisted fields hi save ho sakein.
|
| Empty string ka matlab: frontend apna default (translated) text dikhayega.
|--------------------------------------------------------------------------
*/

const PAGE_TEXT_FIELDS = {
  home: {
    greeting: 60,
    viewWorkLabel: 40,
    resumeLabel: 40,
    currentlyLabel: 40,
    availabilityText: 80,
  },
  about: {
    eyebrow: 60,
    heading: 60,
    headingHighlight: 60,
    subtitle: 500,
  },
  skills: {
    eyebrow: 60,
    heading: 60,
    headingHighlight: 60,
    subtitle: 400,
  },
  contact: {
    eyebrow: 60,
    heading: 60,
    headingHighlight: 60,
    subtitle: 400,
  },
};

// Sirf Home page ke tech bubbles (Hero) ke liye list field
const PAGE_LIST_FIELDS = {
  home: { techBubbles: { maxItems: 6, maxLength: 30 } },
};

const PAGE_KEYS = Object.keys(PAGE_TEXT_FIELDS);

module.exports = { PAGE_TEXT_FIELDS, PAGE_LIST_FIELDS, PAGE_KEYS };