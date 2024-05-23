import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import HOME_EN from 'src/locales/en/home.json'
import CART_EN from 'src/locales/en/cart.json'
import FOOTER_EN from 'src/locales/en/footer.json'
import PRODUCT_EN from 'src/locales/en/product.json'
import PROFILE_EN from 'src/locales/en/profile.json'
import AUTHENTICATION_EN from 'src/locales/en/authentication.json'

import HOME_VI from 'src/locales/vi/home.json'
import CART_VI from 'src/locales/vi/cart.json'
import FOOTER_VI from 'src/locales/vi/footer.json'
import PRODUCT_VI from 'src/locales/vi/product.json'
import PROFILE_VI from 'src/locales/vi/profile.json'
import AUTHENTICATION_VI from 'src/locales/vi/authentication.json'

export const locales = {
    en: 'English',
    vi: 'Tiếng Việt'
} as const

export const resources = {
    en: {
        home: HOME_EN,
        cart: CART_EN,
        footer: FOOTER_EN,
        product: PRODUCT_EN,
        profile: PROFILE_EN,
        authentication: AUTHENTICATION_EN
    },
    vi: {
        home: HOME_VI,
        cart: CART_VI,
        footer: FOOTER_VI,
        product: PRODUCT_VI,
        profile: PROFILE_VI,
        authentication: AUTHENTICATION_VI
    }
} as const

export const defaultNS = 'product'

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
    resources,
    lng: 'vi',
    ns: ['home', 'product', 'footer', 'authentication', 'profile'],
    fallbackLng: 'vi',
    defaultNS,
    interpolation: {
        escapeValue: false
    }
})
