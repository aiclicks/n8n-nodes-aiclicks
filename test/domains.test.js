const assert = require('node:assert/strict');
const test = require('node:test');
const { flattenTeamGroups, flattenDomainItems } = require('../dist/nodes/Aiclicks/shared/domains');

const acme = { id: 'd1', name: 'Acme', website: 'acme.com' };
const globex = { id: 'd2', name: 'Globex', website: 'globex.com' };

test('team key domains pass through unchanged', () => {
	assert.deepEqual(flattenTeamGroups([acme, globex]), [acme, globex]);
});

test('master key team groups flatten into domains tagged with their team', () => {
	const groups = [
		{ team_id: 't1', team_name: 'Team One', domains: [acme] },
		{ team_id: 't2', team_name: 'Team Two', domains: [globex] },
	];
	assert.deepEqual(flattenTeamGroups(groups), [
		{ ...acme, team_name: 'Team One' },
		{ ...globex, team_name: 'Team Two' },
	]);
});

test('team with no domains contributes nothing', () => {
	assert.deepEqual(flattenTeamGroups([{ team_name: 'Empty', domains: [] }]), []);
});

test('n8n items are flattened into one item per domain', async () => {
	const items = [{ json: { team_name: 'Team One', domains: [acme, globex] } }];
	assert.deepEqual(await flattenDomainItems(items), [
		{ json: { ...acme, team_name: 'Team One' } },
		{ json: { ...globex, team_name: 'Team One' } },
	]);
});
