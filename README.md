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
| Account | Validate Key |
| Analytic | Get Visibility, Get Mentions, Get Citability, Get Citations Time Series, Get Citations, Get Brand Rankings, Get Model Leaderboard |
| ChatGPT Ad | Get KPIs, Get Leaderboard, Get Timeline, Get Prompts, Get Cards |
| Competitor | Get Many, Add, Get Discovery, Get Time Series |
| Domain | Get Many, Create |
| GA4 AI Traffic | Get Summary, Get by LLM, Get Timeline, Get Top Pages, Get Top Locations, Get Top Browsers, Get Devices, Get Key Events |
| Prompt | Get Many, Add, Get Statistics, Get Fanout Queries, Get Tags, Get Topics |
| Sentiment | Get Overview, Get Time Series, Get Themes, Get Theme Sources |

Most operations take a **Domain** (pick from the list or paste its ID) and **Days**, a trailing window of 1-365 days.

## Usage

- **Weekly report:** Schedule Trigger → AIclicks (Analytic → Get Visibility) → Slack.
- **AI Agent:** add AIclicks as a tool on an AI Agent node, and let the agent pick the resource and operation.
- New prompts and competitors can take up to about 30 minutes to appear in the AIclicks dashboard.

## Resources

- [AIclicks](https://aiclicks.io)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## Version history

- 0.1.0: first release.
