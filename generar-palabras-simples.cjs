const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = __dirname;
const dictionary = new Set(vm.runInNewContext(fs.readFileSync(path.join(root, 'palabras.js'), 'utf8') + '\ntextoPalabras;').split(/\r?\n/).filter(Boolean));
const ranked = fs.readFileSync(path.join(root, 'diccionario/frecuencias-es.txt'), 'utf8').trim().split(/\r?\n/).map(line => {
    const [word, count] = line.trim().split(/\s+/);
    return {word: word.normalize('NFC'), count: Number(count)};
}).filter(({word, count}) => /^[a-záéíóúüñ]+$/u.test(word) && dictionary.has(word) && Number.isFinite(count)).sort((a,b) => b.count - a.count);
const words = [...new Set(ranked.map(entry => entry.word))].slice(0, 20000);
if (words.length !== 20000) throw new Error(`Solo hay ${words.length} coincidencias: se necesita una fuente más amplia.`);
fs.writeFileSync(path.join(root, 'palabras-simples.js'), '// Selección por frecuencia de FrequencyWords / OpenSubtitles 2018. CC BY-SA 4.0.\n// Fuente, atribución y transformación: diccionario/README.md\nconst textoPalabrasSimples = `\n' + words.join('\n') + '\n`;\n');
console.log(`Generadas ${words.length} palabras simples; ${ranked.length} coincidencias disponibles.`);

