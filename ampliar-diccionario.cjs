// Ejecutar con: node ampliar-diccionario.cjs
// Fusiona entradas base de RLA-ES sin expandir afijos.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const target = path.join(__dirname, 'palabras.js');
const source = fs.readFileSync(target, 'utf8');
const original = vm.runInNewContext(source + '\ntextoPalabras;');
const existing = original.split(/\r?\n/).map(w => w.trim().normalize('NFC')).filter(Boolean);
// Conserva nombres y expresiones originales; elimina el residuo de cierre ';'.
const words = new Set(existing.filter(w => w !== ';'));
const before = words.size;
const entries = fs.readFileSync(path.join(__dirname, 'diccionario/es.dic'), 'utf8').split(/\r?\n/).slice(1);
for (const entry of entries) {
    const word = entry.split(/[\/\s]/)[0].normalize('NFC');
    // Las nuevas entradas deben ser palabras, sin nombres propios ni siglas.
    if (/^[a-záéíóúüñ]+$/u.test(word)) words.add(word);
}
const output = '// Ampliado con RLA-ES. Fuente y licencia: diccionario/README.md\n' +
    'const textoPalabras = `\n' + [...words].join('\n') + '\n`;\n';
fs.writeFileSync(target, output, 'utf8');
console.log(JSON.stringify({entradasOriginales: existing.length, originalesUnicas: before, agregadas: words.size - before, total: words.size}, null, 2));
