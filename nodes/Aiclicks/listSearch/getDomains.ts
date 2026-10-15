import type { ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult } from 'n8n-workflow';
import { flattenTeamGroups, type Domain, type TeamGroup } from '../shared/domains';

type DomainsResponse = { data: { items: Array<Domain | TeamGroup> } };

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
