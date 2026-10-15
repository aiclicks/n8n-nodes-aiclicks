import type { IDataObject, INodeExecutionData } from 'n8n-workflow';

export type Domain = { id: string; name: string; website: string; team_name?: string };

export type TeamGroup = { team_name: string; domains: Domain[] };

function isTeamGroup(item: Domain | TeamGroup): item is TeamGroup {
	return 'domains' in item;
}

export function flattenTeamGroups(items: Array<Domain | TeamGroup>): Domain[] {
	return items.flatMap((item) =>
		isTeamGroup(item) ? item.domains.map((domain) => ({ ...domain, team_name: item.team_name })) : [item],
	);
}

export async function flattenDomainItems(items: INodeExecutionData[]): Promise<INodeExecutionData[]> {
	const domains = flattenTeamGroups(items.map((item) => item.json as Domain | TeamGroup));
	return domains.map((domain) => ({ json: domain as IDataObject }));
}
