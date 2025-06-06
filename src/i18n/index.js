
import { createI18n } from 'vue-i18n'
import en from './en.json'
import es from './es.json'

const userLang = navigator.language || navigator.userLanguage
const locale = userLang.startsWith('es') ? 'es' : 'en'

export default createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages: {
    en,
    es
  }
})


// Get-ChildItem -Path .\src -Include *.vue,*.js,*.ts -Recurse |
//   Select-String -Pattern '\$t\(\s*["'']([^"'']+)["'']\s*\)' |
//   ForEach-Object { $_.Matches.Groups[1].Value } |
//   Sort-Object -Unique
