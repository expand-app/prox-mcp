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
const API_BASE_URL = process.env.API_BASE_URL || "https://api.prox.ist"; // Placeholder
const PROX_ACCOUNT_ID = process.env.PROX_ACCOUNT_ID;
const RECRUITER_LITE_ACCOUNT_ID = process.env.RECRUITER_LITE_ACCOUNT_ID;

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
    name: "search_linkedin_people_free_text",
    description:
      "Search LinkedIn People with free-text filters. All parameters are optional.",
    inputSchema: {
      type: "object",
      description: "All fields are optional. Omit any filters you do not need.",
      properties: {
        keywords: {
          type: "string",
          description: "Main people-search keywords",
        },
        locationName: {
          type: "string",
          description: "Free-text location name",
        },
        currentCompanyName: {
          type: "string",
          description: "Free-text current company name",
        },
        pastCompanyName: {
          type: "string",
          description: "Free-text past company name",
        },
        industryName: {
          type: "string",
          description: "Free-text industry name",
        },
        network: {
          type: "string",
          description: "F=1st-degree, S=2nd-degree, O=others",
        },
        connectionOf: {
          type: "string",
          description:
            "LinkedIn profile hash ID to search within their connections",
        },
        followerOf: {
          type: "string",
          description:
            "LinkedIn profile hash ID to search within their followers",
        },
        openToVolunteer: {
          type: "boolean",
          description: "Filter people open to volunteer opportunities",
        },
        profileLanguage: {
          type: "string",
          description: "Profile language code such as en, es, or zh",
        },
        schoolName: {
          type: "string",
          description: "Free-text school name",
        },
        serviceCategoryName: {
          type: "string",
          description: "Free-text service category or skill name",
        },
        firstName: {
          type: "string",
          description: "Person first name",
        },
        lastName: {
          type: "string",
          description: "Person last name",
        },
        title: {
          type: "string",
          description: "Job title of the people being searched",
        },
        company: {
          type: "string",
          description: "Free-text company filter",
        },
        school: {
          type: "string",
          description: "Free-text school filter",
        },
        start: {
          type: "integer",
          default: 0,
          description: "Pagination offset",
        },
      },
    },
  },
  {
    name: "search_linkedin_jobs_free_text",
    description:
      "Search LinkedIn Jobs with free-text filters. All parameters are optional.",
    inputSchema: {
      type: "object",
      description: "All fields are optional. Omit any filters you do not need.",
      properties: {
        keywords: {
          type: "string",
          description: "Main job-search keywords",
        },
        locationName: {
          type: "string",
          description: "Free-text location name",
        },
        companyName: {
          type: "string",
          description: "Free-text company name",
        },
        timePostedRange: {
          type: "string",
          description: "Relative time filter such as 1d, 1w, 1mo, or 3mo",
        },
        jobType: {
          type: "string",
          description:
            "Job type filter: F=full time, P=part time, C=contract, T=temporary, V=volunteer, I=internship, O=other",
        },
        sortBy: {
          type: "string",
          default: "R",
          description: "Sort order: DD=most recent, R=relevance",
        },
        applyWithLinkedIn: {
          type: "boolean",
          description: "Restrict to Easy Apply / Apply with LinkedIn jobs",
        },
        commitment: {
          type: "integer",
          description:
            "Company commitment filter: 1=DEI, 2=sustainability, 3=work-life balance, 4=social impact, 5=career growth",
        },
        distance: {
          type: "integer",
          description: "Distance in miles",
        },
        expLevel: {
          type: "integer",
          description:
            "Experience level: 1=internship, 2=entry, 3=associate, 4=mid-senior, 5=director, 6=executive",
        },
        earlyApplicant: {
          type: "boolean",
          description: "Restrict to jobs where you are an early applicant",
        },
        functionName: {
          type: "string",
          description: "Free-text job function name",
        },
        industryName: {
          type: "string",
          description: "Free-text industry name",
        },
        inYourNetwork: {
          type: "boolean",
          description: "Restrict to jobs in your network",
        },
        populatedPlaceName: {
          type: "string",
          description: "Free-text populated place name",
        },
        salaryBucketV2: {
          type: "string",
          description:
            "Salary bucket: 1=$40k+, 2=$60k+, 3=$80k+, 4=$100k+, 5=$120k+, 6=$140k+, 7=$160k+, 8=$180k+, 9=$200k+",
        },
        titleName: {
          type: "string",
          description: "Free-text job title name",
        },
        workplaceType: {
          type: "integer",
          description: "Workplace type: 1=onsite, 2=remote, 3=hybrid",
        },
        start: {
          type: "integer",
          default: 0,
          description: "Pagination offset",
        },
        count: {
          type: "integer",
          default: 25,
          description: "Number of results to request",
        },
      },
    },
  },
  {
    name: "search_linkedin_recruiter_people_free_text",
    description:
      "Search Recruiter Lite people with free-text filters. All parameters are optional. This API cannot be called in parallel; only one pending recruiter lite search call is allowed at a time.",
    inputSchema: {
      type: "object",
      description:
        "All fields are optional. Omit any filters you do not need. This API cannot be called in parallel; only one pending recruiter lite search call is allowed at a time.",
      properties: {
        titles: {
          type: "array",
          items: { type: "string" },
          description: "Job title of the people being searched",
        },
        start: {
          type: "integer",
          default: 0,
          description: "Pagination offset",
        },
        keywords: {
          type: "string",
          description: "Free-text search keywords",
        },
        first_names: {
          type: "array",
          items: { type: "string" },
          description: "First names",
        },
        last_names: {
          type: "array",
          items: { type: "string" },
          description: "Last names",
        },
        skills: {
          type: "array",
          items: { type: "string" },
          description: "Free-text skill names",
        },
        companies: {
          type: "array",
          items: { type: "string" },
          description: "Free-text company names",
        },
        current_companies: {
          type: "array",
          items: { type: "string" },
          description: "Free-text current company names",
        },
        past_companies: {
          type: "array",
          items: { type: "string" },
          description: "Free-text past company names",
        },
        locations: {
          type: "array",
          items: { type: "string" },
          description: "Free-text location names",
        },
        schools: {
          type: "array",
          items: { type: "string" },
          description: "Free-text school / university names",
        },
        industries: {
          type: "array",
          items: { type: "string" },
          description: "Free-text industry names",
        },
        graduation_years: {
          type: "object",
          properties: {
            min: { type: "integer" },
            max: { type: "integer" },
          },
          description: "Graduation year range",
        },
        company_sizes: {
          type: "array",
          items: { type: "string" },
          description:
            "Company size codes: A=Self-employed, B=1-10, C=11-50, D=51-200, E=201-500, F=501-1000, G=1001-5000, H=5001-10,000, I=10,000+",
        },
        job_functions: {
          type: "array",
          items: { type: "integer" },
          description:
            "Job function IDs. Allowed values: 1=Accounting, 2=Administrative, 3=Arts and Design, 4=Business Development, 5=Community and Social Services, 6=Consulting, 7=Education, 8=Engineering, 9=Entrepreneurship, 10=Finance, 11=Healthcare Services, 12=Human Resources, 13=Information Technology, 14=Legal, 15=Marketing, 16=Media and Communication, 17=Military and Protective Services, 18=Operations, 19=Product Management, 20=Program and Project Management, 21=Purchasing, 22=Quality Assurance, 23=Real Estate, 24=Research, 25=Sales, 26=Customer Success and Support",
        },
        seniorities: {
          type: "array",
          items: { type: "integer" },
          description:
            "Seniority IDs. Allowed values: 1=Unpaid, 2=Training, 3=Entry, 4=Senior, 5=Manager, 6=Director, 7=VP, 8=CXO, 9=Partner, 10=Owner",
        },
        networks: {
          type: "array",
          items: { type: "string" },
          description:
            "Network codes. Allowed values: F=1st Connections, S=2nd Connections, A=Group Members, O=3rd + Everyone Else",
        },
        zip_codes: {
          type: "array",
          items: { type: "string" },
          description: "Free-text postal codes such as 94105",
        },
        distance: {
          type: "integer",
          description: "Radius in miles around zip_codes; must be a positive integer",
        },
        profile_languages: {
          type: "array",
          items: { type: "string" },
          description:
            "Language codes: en=English, es=Spanish, zh=Chinese, de=German, fr=French, it=Italian, pt=Portuguese, nl=Dutch, in=Bahasa Indonesia, ms=Malay, ro=Romanian, ru=Russian, tr=Turkish, sv=Swedish, pl=Polish, ja=Japanese, cs=Czech, da=Danish, no=Norwegian, ko=Korean, _o=Others",
        },
        recently_joined: {
          type: "array",
          items: { type: "integer" },
          description:
            "Recently-joined bucket IDs: 1=1 day ago, 2=2-7 days ago, 3=8-14 days ago, 4=15-30 days ago, 5=1-3 months ago",
        },
        is_veteran: {
          type: "boolean",
          description:
            "When true, restricts results to members with a US military background",
        },
        yoe: {
          type: "object",
          properties: {
            min: { type: "integer" },
            max: { type: "integer" },
          },
          description: "Years of experience range",
        },
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
                await apiClient.get(
                  `/v1/accounts/${PROX_ACCOUNT_ID}/linkedin/me`,
                ),
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
      case "search_linkedin_people_free_text": {
        const rest = args || {};
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiClient.get(
                  `/v1/accounts/${PROX_ACCOUNT_ID}/linkedin/search-people-free-text`,
                  rest,
                ),
              ),
            },
          ],
        };
      }
      case "search_linkedin_jobs_free_text": {
        const rest = args || {};
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiClient.get(
                  `/v1/accounts/${PROX_ACCOUNT_ID}/linkedin/search-jobs-free-text`,
                  rest,
                ),
              ),
            },
          ],
        };
      }
      case "search_linkedin_recruiter_people_free_text": {
        if (!RECRUITER_LITE_ACCOUNT_ID) {
          throw new Error(
            "RECRUITER_LITE_ACCOUNT_ID environment variable is required for recruiter lite search",
          );
        }
        const rest = args || {};
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiClient.post(
                  `/v1/accounts/${RECRUITER_LITE_ACCOUNT_ID}/linkedin-recruiter/search-people-free-text`,
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
