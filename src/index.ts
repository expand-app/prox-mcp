import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { ApiClient } from "./api.js";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.ORG_API_KEY;
const API_BASE_URL = process.env.API_BASE_URL || "https://api.prox.com"; // Placeholder
const PROX_ACCOUNT_ID = process.env.PROX_ACCOUNT_ID;

if (!API_KEY) {
  console.error("Error: ORG_API_KEY environment variable is required");
  process.exit(1);
}

if (!PROX_ACCOUNT_ID) {
  console.error("Error: PROX_ACCOUNT_ID environment variable is required");
  process.exit(1);
}

const apiClient = new ApiClient(API_BASE_URL, API_KEY);

const server = new Server(
  {
    name: "prox-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

const TOOLS = [
  // LinkedIn Operations
  {
    name: "get_linkedin_me",
    description: "Get 'Me' Profile (Fetch & Update)",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_linkedin_profile",
    description: "Get LinkedIn Profile (Basic/Contact/Rich)",
    inputSchema: {
      type: "object",
      properties: {
        profile_id: {
          type: "string",
          description: "The hash id or public id in linkedin",
        },
      },
      required: ["profile_id"],
    },
  },
  {
    name: "get_linkedin_connections",
    description: "Get LinkedIn Connections",
    inputSchema: {
      type: "object",
      properties: {
        count: { type: "integer", default: 25 },
        start: { type: "integer", default: 0 },
      },
    },
  },
  {
    name: "send_linkedin_invite",
    description: "Send LinkedIn Connection Invite",
    inputSchema: {
      type: "object",
      properties: {
        hash_id: {
          type: "string",
          description: "The hash id in linkedin, which should start with `ACo`",
        },
        message: { type: "string" },
      },
      required: ["hash_id"],
    },
  },
  {
    name: "get_linkedin_conversations",
    description: "Get LinkedIn Conversations",
    inputSchema: {
      type: "object",
      properties: {
        hash_id: {
          type: "string",
          description: "The hash id in linkedin, which should start with `ACo`",
        },
        count: { type: "integer", default: 20 },
        last_activity_at: { type: "integer" },
      },
    },
  },
  {
    name: "get_linkedin_conversation_messages",
    description: "Get Messages in Conversation",
    inputSchema: {
      type: "object",
      properties: {
        conversation_id: { type: "string" },
        hash_id: {
          type: "string",
          description: "The hash id in linkedin, which should start with `ACo`",
        },
        conversation_urn: { type: "string" },
        delivered_at: { type: "integer" },
        prev_cursor: { type: "string" },
      },
      required: ["conversation_id"],
    },
  },
  {
    name: "get_linkedin_conversation_with",
    description: "Get Conversation with Recipient",
    inputSchema: {
      type: "object",
      properties: {
        other_hash_id: {
          type: "string",
          description: "The hash id in linkedin, which should start with `ACo`",
        },
      },
      required: ["other_hash_id"],
    },
  },
  {
    name: "send_linkedin_message",
    description: "Send LinkedIn Message",
    inputSchema: {
      type: "object",
      properties: {
        conversation_id: { type: "string" },
        receiver_hash_id: {
          type: "string",
          description: "The hash id in linkedin, which should start with `ACo`",
        },
        text: { type: "string" },
      },
      required: ["text"],
    },
  },
  {
    name: "download_file_from_linkedin",
    description: "Download File from LinkedIn (via URL)",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string" },
      },
      required: ["url"],
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // LinkedIn Operations
      case "get_linkedin_me": {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiClient.get(`/v1/accounts/${PROX_ACCOUNT_ID}/linkedin/me`),
              ),
            },
          ],
        };
      }
      case "get_linkedin_profile": {
        const { profile_id } = (args || {}) as {
          profile_id: string;
        };
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiClient.get(
                  `/v1/accounts/${PROX_ACCOUNT_ID}/linkedin/profile`,
                  { profile_id },
                ),
              ),
            },
          ],
        };
      }
      case "get_linkedin_connections": {
        const rest = args || {};
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiClient.get(
                  `/v1/accounts/${PROX_ACCOUNT_ID}/linkedin/connections`,
                  rest,
                ),
              ),
            },
          ],
        };
      }
      case "send_linkedin_invite": {
        const rest = args || {};
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiClient.post(
                  `/v1/accounts/${PROX_ACCOUNT_ID}/linkedin/invite`,
                  rest,
                ),
              ),
            },
          ],
        };
      }
      case "get_linkedin_conversations": {
        const rest = args || {};
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiClient.get(
                  `/v1/accounts/${PROX_ACCOUNT_ID}/linkedin/conversations`,
                  rest,
                ),
              ),
            },
          ],
        };
      }
      case "get_linkedin_conversation_messages": {
        const { conversation_id, ...rest } = (args || {}) as {
          conversation_id: string;
        };
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiClient.get(
                  `/v1/accounts/${PROX_ACCOUNT_ID}/linkedin/conversations/${conversation_id}/messages`,
                  rest,
                ),
              ),
            },
          ],
        };
      }
      case "get_linkedin_conversation_with": {
        const { other_hash_id } = (args || {}) as {
          other_hash_id: string;
        };
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiClient.get(
                  `/v1/accounts/${PROX_ACCOUNT_ID}/linkedin/conversations/with/${other_hash_id}`,
                ),
              ),
            },
          ],
        };
      }
      case "send_linkedin_message": {
        const rest = args || {};
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiClient.post(
                  `/v1/accounts/${PROX_ACCOUNT_ID}/linkedin/message`,
                  rest,
                ),
              ),
            },
          ],
        };
      }
      case "download_file_from_linkedin": {
        const { url } = (args || {}) as { url: string };
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiClient.post(
                  `/v1/accounts/${PROX_ACCOUNT_ID}/linkedin/download-file`,
                  { url },
                ),
              ),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Prox MCP Server running on stdio");
  console.error(`Available tools: ${TOOLS.length}`);
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
