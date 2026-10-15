import type { ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult } from 'n8n-workflow';

type Domain = { id: string; name: string; website: string; team_name?: string };

type TeamGroup = { team_name: string; domains: Domain[] };

type DomainsResponse = { data: { items: Array<Domain | TeamGroup> } };

function flattenTeamGroups(items: Array<Domain | TeamGroup>): Domain[] {
	return items.flatMap((item) =>
		'domains' in item ? item.domains.map((domain) => ({ ...domain, team_name: item.team_name })) : [item],
	);
}

function toSearchItem(domain: Domain): INodeListSearchItems {
	const team = domain.team_name ? ` · ${domain.team_name}` : '';
	return { name: `${domain.name} (${domain.website})${team}`, value: domain.id };
}

function isMatch(item: INodeListSearchItems, filter?: string): boolean {
	return !filter || item.name.toLowerCase().includes(filter.toLowerCase());
}

export async function getDomains(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'aiclicksApi', {
		method: 'GET',
		url: 'https://api.aiclicks.io/api/v1/domains',
		json: true,
	})) as DomainsResponse;

	const results = flattenTeamGroups(response.data.items)
		.map(toSearchItem)
		.filter((item) => isMatch(item, filter));
	return { results };
}
