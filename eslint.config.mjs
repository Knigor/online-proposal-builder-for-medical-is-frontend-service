// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
        rules: {
                // ругается на фантомные пробелы
                'no-irregular-whitespace': 'off',
                // ругается на закрытие пустых тегов (input)
                'vue/html-self-closing': 'off',
                // при модульной архитектуре, названия страниц внутри модулей воспринимает как компоненты и ругается
                'vue/multi-word-component-names': 'off'
        }
})
