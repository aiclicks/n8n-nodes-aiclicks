# n8n-nodes-aiclicks

An [n8n](https://n8n.io/) community node for [AIclicks](https://aiclicks.io). Use it to pull brand visibility, citations, sentiment, competitor, ChatGPT ads and GA4 AI-traffic data into your workflows, or to add prompts and competitors to track.

The node is also usable as a tool by n8n's **AI Agent**, so an agent can answer questions such as "how did our visibility on Perplexity change this month?" on its own.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Usage](#usage) · [Resources](#resources)

## Installation

In n8n, go to **Settings → Community Nodes → Install** and enter `n8n-nodes-aiclicks`. See the [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

## Credentials

1. In AIclicks, open **Settings → Developers** and create an API key (`ak_live_...`). A team key reads one team's brands; a master key reads every team you belong to.
2. In n8n, create an **AIclicks API** credential and paste the key. n8n checks it against `/api/v1/validate`.

Write operations (Domain → Create, Prompt → Add, Competitor → Add) need a Pro plan or higher and membership of the brand's team.

## Operations

| Resource | Operations |
|---|---|
| Account | Validate Key, Get Team Usage |
| Brand Metric | Get Visibility, Get Mentions, Get Citability, Get Citations Time Series, Get Citations, Get Brand Rankings, Get Model Leaderboard, Get Citation Domains, Get Competitor Citations, Get Citation Share, Get Topic Metrics, Get Tag Metrics, Get Engage Recommendations |
| ChatGPT Ad | Get KPIs, Get Leaderboard, Get Timeline, Get Prompts, Get Cards |
| Competitor | Get Many, Add, Get Discovery, Get Time Series, Add Many, Update |
| Domain | Get Many, Create, Get Status |
| GA4 AI Traffic | Get Summary, Get by LLM, Get Timeline, Get Top Pages, Get Top Locations, Get Top Browsers, Get Devices, Get Key Events |
| Prompt | Get Many, Add, Get Statistics, Get Fanout Queries, Get Tags, Get Topics, Get Metrics, Get Brands, Get Answers, Add Many, Update, Archive, Set Tags, Set Topics, Create Tag, Create Topic |
| Sentiment | Get Overview, Get Time Series, Get Themes, Get Theme Sources, Get Answers |

Most operations take a **Domain** (pick from the list or paste its ID) and **Days**, a trailing window of 1-365 days.

- **Get Many** operations have **Return All** and **Limit**. Prompt → Get Many pages through every prompt when Return All is on.
- Other long lists (Prompt → Get Metrics and Get Answers, Sentiment → Get Answers, Brand Metric → Get Citation Domains and Get Engage Recommendations) return one page at a time. Set **Page** and **Page Size** under **Options**, where you also find sorting and filters.
- **Get Citations** has **Filters**: **Brand-Owned Pages** (only your own pages, or only third-party ones) and **Page Mentions Brand** (only cited pages that name your brand, or only those that don't, a ready-made outreach list).
- List-shaped results (time series, citations, rankings, themes, GA4 breakdowns) come out as one n8n item per row, ready for Google Sheets or a Loop node. An empty result produces no items; turn on the node's **Always Output Data** setting if later steps must still run.
- **Simplify** (on by default) trims wide responses (Get Citations, Competitor → Get Time Series) to their most useful fields, including whether each cited page mentions your brand and which competitors it names. Turn it off for the raw response.
- With a master key, Domain → Get Many returns every domain across your teams, each tagged with `team_name`.
- Write operations take IDs: prompt IDs from Prompt → Get Many, tag and topic IDs from Get Tags / Get Topics (or Create Tag / Create Topic), competitor IDs from Competitor → Get Many. Fields that take several IDs accept a comma-separated list.
- **Add Many** takes one prompt per line, or one competitor per line as `website, name`. Competitor → Add Many can instead track the top N brands from Get Discovery.
- **Domain → Create** has a **Pitch Brand** option: a 7-day brand for pitching a prospect, for agency teams on Pro or higher. It uses a pitch credit instead of a brand slot.

## Usage

- **Weekly report:** Schedule Trigger → AIclicks (Brand Metric → Get Visibility) → Slack.
- **AI Agent:** add AIclicks as a tool on an AI Agent node, and let the agent pick the resource and operation.
- **Outreach list:** Brand Metric → Get Citations with the **Page Mentions Brand** filter added and switched off → Google Sheets, to list pages AI cites that don't name you yet.
- New prompts and competitors can take up to about 30 minutes to appear in the AIclicks dashboard.

## Resources

- [AIclicks](https://aiclicks.io)
- [AIclicks API documentation](https://docs.aiclicks.io)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## Version history

- 0.1.0: first release.
- 0.2.0: 21 new operations (prompt metrics and answers, bulk prompt and competitor writes, tags and topics, citation domains and share, topic and tag metrics, engage recommendations, domain status, team usage), citation filters for brand-owned pages and page mentions, and pitch brands on Domain → Create.
