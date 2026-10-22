# @anweb/n8n-nodes-memocore

This is an n8n community node. It lets you use [memocore](https://memocore.ai) in your n8n workflows.

memocore is shared memory for a team and its AI tools: notes and tables that every member and every connected AI assistant can search and update.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Usage](#usage)
[Example workflows](#example-workflows)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

**Memo**

- Search: find memos by meaning and keywords, optionally filtered by tags
- Get: get the full text of a memo
- Create: save a new memo to a project
- Update: change the text, tags or other fields of a memo
- Delete: move a memo to the archive, where it is erased after 45 days

**Row** (table projects)

- Query: filter and sort the rows of a table, optionally by tags or in the archive
- Aggregate: count, sum, average, minimum or maximum over the rows, in total or grouped by up to two columns
- Get: get one row with all its values
- Create: add a row, with a field for each column, plus an optional title, summary, tags and lifetime
- Update: change some values of a row; columns you leave out keep their values
- Delete: move a row to the archive

**Project**

- Get Many: list the projects the key can access
- Get: get one project, with its columns if it is a table

**Tag**

- Get Many: list or search the tags of those projects

The node can also be used as a tool by n8n AI agents.

## Credentials

You need a memocore team with an active subscription.

1. In memocore, open your team's **Integrations** page, go to **Catalog** and choose **n8n**.
2. Pick the projects n8n may use and click **Connect n8n**.
3. Copy the key. It starts with `mc_ck_` and is shown only once.
4. In n8n, create a **Memocore API** credential and paste the key.

The node sees only the projects you picked. Personal memos are not available to it. You can change the projects or disconnect n8n on the same Integrations page at any time.

## Usage

- **Search Hints** are keywords and questions the memo should be found by. They are used for search only and never shown to readers.
- **Summary** is a short public description of the memo. Do not put private information there.
- **Expires In** sets how long a memo lives before it moves to the archive, for example `30m`, `2h`, `3d` or `1w`.
- Everything the node writes is signed in memocore with the name of your n8n connection, so the team can see where a change came from.

## Example workflows

**Form answers into a table**

1. Add an **n8n Form Trigger** with the questions you want to ask.
2. Add a **Memocore** node: Resource **Row**, Operation **Create**, and pick your table.
3. Map each form answer to a column under **Columns**.

Every submission becomes a row the team and its AI assistants can query.

**An AI agent with team memory**

1. Add an **AI Agent** node with a chat model.
2. Under **Tools**, add **Memocore** twice: once with Memo → **Search**, once with Memo → **Create**.
3. In the agent's system message, tell it to search memocore before answering and to save new facts it learns.

The agent now answers from what your team has already written down and adds to it.

**Morning list of open tasks**

1. Add a **Schedule Trigger** that runs every weekday at 9:00.
2. Add a **Memocore** node: Resource **Row**, Operation **Query**, with the condition `Status` **Equals** `Open` and a sort by `Due`.
3. Send the rows to Slack, email or any other node.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [memocore](https://memocore.ai)

## Version history

- 0.1.4: the Equals operator in row conditions works when picked from the list.
- 0.1.3: Row Get and Aggregate, filters for Row Query, memo fields for Row Create and Update.
- 0.1.2: dates in datetime columns are sent in the workflow's time zone.
- 0.1.1: published through npm trusted publishing, no changes to the node.
- 0.1.0: first release with the Memo, Row, Project and Tag resources.
