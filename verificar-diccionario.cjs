const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
function element() {
    return {children: [], value: '', style: {}, disabled: true, textContent: '', listeners: {},
        classList: {add(){}, remove(){}, toggle(){}, contains(){return false;}},
        setAttribute(name, value){this[name] = value;},
        addEventListener(name, fn){this.listeners[name] = fn;},
        appendChild(child){this.children.push(child);},
        set innerHTML(value){this.children = [];}, get innerHTML(){return '';}};
}
const elements = new Map();
const context = vm.createContext({console, document: {
    getElementById(id){if (!elements.has(id)) elements.set(id, element()); return elements.get(id);},
    createElement: element, body: element(), addEventListener(){}
}, clearTimeout(){}, setTimeout(fn){fn();}, setInterval(){return 1;}});
vm.runInContext(fs.readFileSync('palabras.js', 'utf8'), context);
vm.runInContext(fs.readFileSync('palabras-simples.js', 'utf8'), context);
const html = fs.readFileSync('gemini-code-1784681061232.html', 'utf8');
const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');
vm.runInContext(inline, context);
const run = code => vm.runInContext(code, context);
assert.equal(run('originalWordPool.length'), 58086);
assert.equal(run('new Set(originalWordPool).size'), 58086);
assert.equal(elements.get('word-grid').children.length, 6);
assert.equal(elements.get('suffix-filter').disabled, false);
assert.equal(run('new Set(getNextWords(500)).size'), 500);
for (const suffix of ['ción', 'ar', 'ño', 'üino', 'xyzsinresultado', '']) {
    elements.get('suffix-filter').value = suffix;
    elements.get('suffix-filter').listeners.input({target: {value: suffix}});
    assert.equal(run('wordPool.length'), run(`originalWordPool.filter(w => w.toLowerCase().endsWith(${JSON.stringify(suffix)})).length`));
    if (suffix === 'xyzsinresultado') assert.equal(run('isSystemPaused'), true);
    else assert.ok(run('wordPool.length') > 0);
}
assert.equal(run('isSystemPaused && isManualPause'), true);
elements.get('persistent-pause-btn').listeners.click();
assert.equal(run('isSystemPaused'), false);
elements.get('count-slider').listeners.input({target: {value: '50'}});
assert.equal(elements.get('word-grid').children.length, 50);
assert.equal(new Set(elements.get('word-grid').children.map(c=>c.textContent)).size, 50);
console.log('OK: carga, unicidad, selección aleatoria, filtros con tildes/ñ/ü, sin resultados, restauración y 50 tarjetas. DOM simulado, sin prueba visual.');

const simpleButton = elements.get('simple-words-btn');
assert.equal(simpleButton.disabled, false);
simpleButton.listeners.click();
assert.equal(simpleButton['aria-pressed'], 'true');
assert.equal(run('wordPool.length'), 20000);
assert.equal(run('new Set(simpleWordPool).size'), 20000);
assert.equal(run('simpleWordPool.every(w => originalWordPool.includes(w))'), true);
elements.get('suffix-filter').value = 'ción';
elements.get('suffix-filter').listeners.input();
assert.equal(run('wordPool.every(w => w.endsWith("ción") && simpleWordPool.includes(w))'), true);
assert.ok(run('wordPool.length') > 0);
elements.get('persistent-pause-btn').listeners.click();
simpleButton.listeners.click();
assert.equal(run('isManualPause && isSystemPaused'), true);
assert.equal(run('wordPool.length'), run('originalWordPool.filter(w => w.endsWith("ción")).length'));
elements.get('suffix-filter').value = '';
elements.get('suffix-filter').listeners.input();
assert.equal(run('wordPool.length'), 58086);
console.log('OK: modo simple 20.000, check, subconjunto, filtro combinado, pausa manual y retorno al diccionario completo.');

run('wordPool = ["casa", "mesa", "luna", "sol"]; availableWords = ["casa"]; displayedWords = ["casa", "mesa"];');
assert.deepEqual(Array.from(run('getNextWords(3)')).sort(), ['luna','sol']);
run('displayedWords = ["luna", "sol"];');
assert.deepEqual(Array.from(run('getNextWords(3)')).sort(), ['casa','mesa']);
run('wordPool = ["casa"]; availableWords = ["casa"]; displayedWords = ["casa"];');
assert.equal(run('getNextWords(6).length'),0);
console.log('OK: sin repeticiones al rellenar bolsa, tandas pequeñas, repetición posterior y filtro de una sola palabra.');
