const assert = require('node:assert/strict');
const test = require('node:test');
const {
	commaSeparatedToArray,
	competitorLinesToObjects,
	promptLinesToObjects,
} = require('../dist/nodes/Aiclicks/shared/fields');

function evaluate(expression, value) {
	const body = expression.replace(/^=\{\{/, '').replace(/\}\}$/, '');
	return new Function('$value', `return ${body};`)(value);
}

test('competitor lines become website and name pairs', () => {
	assert.deepEqual(evaluate(competitorLinesToObjects, 'rival.com, Rival Inc\n\n  other.io  \nthird.lt, Third, UAB'), [
		{ competitor_domain: 'rival.com', competitor_name: 'Rival Inc' },
		{ competitor_domain: 'other.io', competitor_name: 'other.io' },
		{ competitor_domain: 'third.lt', competitor_name: 'Third, UAB' },
	]);
});

test('empty competitor list sends no competitors', () => {
	assert.deepEqual(evaluate(competitorLinesToObjects, ''), []);
});

test('prompt lines become prompt objects', () => {
	assert.deepEqual(evaluate(promptLinesToObjects, 'best crm\n\n  crm for agencies '), [
		{ text: 'best crm' },
		{ text: 'crm for agencies' },
	]);
});

test('comma-separated ids drop blanks', () => {
	assert.deepEqual(evaluate(commaSeparatedToArray, 'a, b,,c '), ['a', 'b', 'c']);
});
