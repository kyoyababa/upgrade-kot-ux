import langJa from '../../_locales/ja/messages.json';
import langEn from '../../_locales/en/messages.json';

export enum Locale {
  EN = "en",
  JA = "ja"
}

function messages(locale: Locale, key: string): string {
  let i18n;

  switch (locale) {
    case "en": i18n = langEn; break;
    default: i18n = langJa;
  }

  return i18n[key].message;
}

export function getMessage(key: string, callBack: Function): void {
  let message = chrome.i18n.getMessage(key);
  chrome.storage.sync.get(['lang'], lang => {
    const langVal = lang.lang;
    if (langVal != undefined) {
      message = messages(langVal, key);
    }

      callBack(message);
  });
}
