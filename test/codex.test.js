const assert = require('node:assert/strict');
const test = require('node:test');
const pkg = require('../package.json');
const codex = require('../dist/nodes/Aiclicks/Aiclicks.node.json');
const { Aiclicks } = require('../dist/nodes/Aiclicks/Aiclicks.node');

test('codex node is the fully-qualified <package>.<nodeName> identifier', () => {
	assert.equal(codex.node, `${pkg.name}.${new Aiclicks().description.name}`);
});

test('codex nodeVersion matches the node version', () => {
	assert.equal(Number(codex.nodeVersion), new Aiclicks().description.version);
});
