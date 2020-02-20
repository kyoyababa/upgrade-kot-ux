import langJa from '../../_locales/ja/messages.json';
import langEn from '../../_locales/en/messages.json';

export enum Locale {
  EN = "en",
  JA = "ja"
}

function messages(locale: Locale, key: string): string {
  const findI18nCode = (locale: Locale): string => {
    switch (locale) {
      case 'en': return langEn;
      default: return langJa;
    }
  }

  const i18nObject = findI18nCode(locale)[key];
  if (!i18nObject) return '';

  return i18nObject.message;
}

export function getMessage(key: string, callBack: Function): void {
  chrome.storage.sync.get(['lang'], lang => {
    const langVal = lang.lang;

    if (!langVal) {
      callBack(chrome.i18n.getMessage(key));

      return;
    }

    callBack(messages(langVal, key));
  });
}
