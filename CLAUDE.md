# Métrica (Genwords): guía para agentes

App: "Métrica" (en la tienda "Métrica: rimas y letras"), para escribir canciones. Las prioridades las define Proshe, no las cambies sin preguntar.

## Hoy
Web en HTML/JS (`index.html`) que muestra N palabras al azar en español (default 6) que cambian cada X segundos (default 5), con pausa, refrescar, filtro por terminación, modo "palabras simples" e historial. Diccionario propio: `palabras.js` y `palabras-simples.js`, generados desde `diccionario/` con los scripts `.cjs` (ampliar-diccionario, generar-palabras-simples, verificar-diccionario, verificar-navegador). Respetá las licencias de `diccionario/`.

## Plan en dos etapas
1. **Web app para probar (ahora).** Mobile-first, a ancho de iPhone (~390x844), con estilo nativo de iOS (fuente del sistema, títulos grandes, listas agrupadas, tab bar, modo oscuro), instalable desde Safari con "Agregar a inicio" (PWA con manifest). HTML/CSS/JS simple, sin frameworks ni paso de build. Publicada en GitHub Pages.
2. **Cuando esté lista, pasarla 1 a 1 a SwiftUI** (iOS 17+), sin rediseñar. Por eso, en la web: separá la lógica (rimas, diccionario, sesiones) de la interfaz en módulos JS puros con tests, y usá componentes que tengan equivalente directo en SwiftUI.

## Qué sumar, en este orden
1. Rima real en español: consonante (igual desde la última vocal tónica) y asonante (solo vocales desde la tónica). Tené en cuenta acentos, diptongos/hiatos y palabras agudas, graves y esdrújulas. Con tests de casos difíciles.
2. Bloc para escribir la letra al lado de las palabras (que no sea solo un generador, para evitar rechazo de Apple por la regla 4.2).
3. Favoritos y sesiones guardadas (por ahora en localStorage).
4. Modo freestyle: palabras con timer tipo batalla.

Monetización a definir (probable: gratis + pago único, como Unforgettables). No la armes hasta que Proshe la defina.

## Reglas
- Trabajá en una rama nueva con pull request; nunca directo en `main` y nunca force-push.
- Cambios chicos y simples, sin abstracciones de más.
- Antes de dar algo por terminado, probalo de verdad (tests y abrir la página) y contá cómo lo probaste.
- Textos de la app en español rioplatense.
