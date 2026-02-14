import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import englishLabels from './i18n/en.json';
import spanishLabels from './i18n/es.json';
import {registerTranslations} from "@customation/ui";

registerTranslations('EN', englishLabels);
registerTranslations('ES', spanishLabels);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
