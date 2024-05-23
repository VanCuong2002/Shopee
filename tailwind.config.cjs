/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    corePlugins: {
        container: false
    },
    theme: {
        extend: {
            colors: {
                orange: '#ee4d2d'
            }
        },
        screens: {
            xs: { max: '575px' }, // <576px
            sm: '576px', // ≥576px
            md: '768px', // ≥768px
            lg: '992px', // ≥992px
            xl: '1200px', // ≥1200px
            xxl: '1400px' // ≥1400px
        }
    },
    plugins: [
        plugin(function ({ addComponents, theme }) {
            addComponents({
                '.container': {
                    maxWidth: theme('columns.7xl'),
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    paddingLeft: theme('spacing.4'),
                    paddingRight: theme('spacing.4')
                }
            })
        })
    ]
}
