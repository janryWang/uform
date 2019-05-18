import { getIn, each } from './utils'
import locales from './locale'

const self: any = this || global || window

interface LocaleMessages {
  [key: string]: string | LocaleMessages
}

interface Locales {
  [lang: string]: LocaleMessages
}

const getBrowserlanguage = () => {
  if (!self.navigator) { return 'en' }
  return self.navigator.browserlanguage || self.navigator.language || 'en'
}

const LOCALE = {
  messages: {},
  lang: getBrowserlanguage()
}

const getMatchLang = (lang: string) => {
  let find = LOCALE.lang
  each(LOCALE.messages, (messages: LocaleMessages, key: string) => {
    if (key.indexOf(lang) > -1 || String(lang).indexOf(key) > -1) {
      find = key
      return false
    }
  })
  return find
}

export const setLocale = (locale: Locales) => {
  Object.assign(LOCALE.messages, locale)
}

export const setLanguage = (lang: string) => {
  LOCALE.lang = lang
}

export const getMessage = (path: string) => {
  return getIn(LOCALE.messages, `${getMatchLang(LOCALE.lang)}.${path}`) || 'field is not valid,but not found error message.'
}

setLocale(locales)
