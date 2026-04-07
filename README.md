# Prox MCP Server

This is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for the LinkedIn Prox API. It allows AI models to interact with LinkedIn accounts to perform various operations such as fetching profiles, connections, messages, and sending invites.

## Features

- **LinkedIn Operations**:
  - Get "Me" Profile (Fetch & Update)
  - Get LinkedIn Profile
  - Get LinkedIn Connections
  - Send LinkedIn Connection Invite
  - Get LinkedIn Conversations
  - Get Messages in Conversation
  - Get Conversation with Recipient
  - Send LinkedIn Message
  - Download File from LinkedIn (via URL)

## Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd prox-mcp
    ```

2.  Install dependencies:

    ```bash
    yarn install
    ```

3.  Build the server:
    ```bash
    yarn build
    ```

## Configuration

The server requires the following environment variables. You can set them in a `.env` file (see `.env.example`) or pass them when running the server.

- `ORG_API_KEY`: Your Organization API Key.
- `PROX_ACCOUNT_ID`: The user id in prox. This is used globally for all LinkedIn operations.
- `API_BASE_URL`: The base URL for the Prox API (default: `https://api.prox.ist`).
- `RECRUITER_LITE_ACCOUNT_ID`: The prox account id used for recruiter lite search tools.

## Usage

### Running with an MCP Client

Add the following configuration to your MCP client (e.g., Claude Desktop, Trae, etc.):

```json
{
  "mcpServers": {
    "prox-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/prox-mcp/build/index.js"],
      "env": {
        "ORG_API_KEY": "<YOUR_ORG_API_KEY>",
        "PROX_ACCOUNT_ID": "<YOUR_PROX_ACCOUNT_ID>",
        "API_BASE_URL": "<API_BASE_URL>",
        "RECRUITER_LITE_ACCOUNT_ID": "<YOUR_RECRUITER_LITE_ACCOUNT_ID>"
      }
    }
  }
}
```

Replace `/absolute/path/to/prox-mcp` with the actual path to your project directory and provide your API key.

### Available Tools

| Tool Name                            | Description                               |
| :----------------------------------- | :---------------------------------------- |
| `get_linkedin_me`                    | Get "Me" Profile (Fetch & Update)         |
| `get_linkedin_profile`               | Get LinkedIn Profile (Basic/Contact/Rich) |
| `get_linkedin_connections`           | Get LinkedIn Connections                  |
| `search_linkedin_people_free_text`   | Search LinkedIn People with Free-Text Filters |
| `search_linkedin_jobs_free_text`     | Search LinkedIn Jobs with Free-Text Filters |
| `search_linkedin_recruiter_people_free_text` | Search Recruiter Lite People with Free-Text Filters |
| `send_linkedin_invite`               | Send LinkedIn Connection Invite           |
| `get_linkedin_conversations`         | Get LinkedIn Conversations                |
| `get_linkedin_conversation_messages` | Get Messages in Conversation              |
| `get_linkedin_conversation_with`     | Get Conversation with Recipient           |
| `send_linkedin_message`              | Send LinkedIn Message                     |
| `download_file_from_linkedin`        | Download File from LinkedIn (via URL)     |

## Development

To run the server in development mode:

```bash
yarn dev
```

This uses `ts-node` to run the TypeScript source directly.
