const assert = require('node:assert/strict');
const test = require('node:test');
const { rowsOf, unwrapData } = require('../dist/nodes/Aiclicks/shared/fields');

test('envelope with items splits into one row per item', () => {
	assert.deepEqual(rowsOf({ items: [{ a: 1 }, { a: 2 }], total: 2 }), [{ a: 1 }, { a: 2 }]);
});

test('bare array data splits into rows', () => {
	assert.deepEqual(rowsOf([{ a: 1 }, { a: 2 }]), [{ a: 1 }, { a: 2 }]);
});

test('object without items stays a single row', () => {
	assert.deepEqual(rowsOf({ timeline: [1, 2] }), [{ timeline: [1, 2] }]);
});

test('non-array items field is not split', () => {
	assert.deepEqual(rowsOf({ items: 3 }), [{ items: 3 }]);
});

test('response body is unwrapped from data into n8n items', async () => {
	const items = [{ json: { data: { items: [{ a: 1 }, { a: 2 }] }, generated_at: 'now' } }];
	assert.deepEqual(await unwrapData(items), [{ json: { a: 1 } }, { json: { a: 2 } }]);
});
