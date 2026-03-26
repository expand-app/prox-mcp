# APIs Supporting Org API Key Authentication

This document lists the API endpoints that support `OrgApiKeyAuthentication`. These endpoints can be accessed using an Organization API Key.

## Authentication

To authenticate using an Organization API Key, include the following header in your request:

```
X-Api-Key: <YOUR_ORG_API_KEY>
```

## API List

### Account Management

| Method   | Endpoint                            | Description                     |
| :------- | :---------------------------------- | :------------------------------ |
| `POST`   | `/v1/accounts`                      | Create a new LinkedIn Account   |
| `GET`    | `/v1/accounts`                      | List LinkedIn Accounts          |
| `GET`    | `/v1/accounts/<account_id>`         | Get Account Details             |
| `PATCH`  | `/v1/accounts/<account_id>`         | Update Account Details          |
| `DELETE` | `/v1/accounts/<account_id>`         | Delete Account                  |
| `POST`   | `/v1/accounts/<account_id>:unlogin` | Unlogin Account (Clear Session) |

### Task Management

| Method | Endpoint                                       | Description             |
| :----- | :--------------------------------------------- | :---------------------- |
| `GET`  | `/v1/tasks/<task_id>`                          | Get Task Details        |
| `POST` | `/v1/tasks/<task_id>:cancel`                   | Cancel Task             |
| `POST` | `/v1/tasks/<task_id>/2fa/code`                 | Submit 2FA Code         |
| `GET`  | `/v1/accounts/<account_id>/tasks`              | List Tasks for Account  |
| `POST` | `/v1/accounts/<account_id>/tasks/login`        | Start Login Task        |
| `GET`  | `/v1/accounts/<account_id>/tasks/login`        | Get Latest Login Task   |
| `POST` | `/v1/accounts/<account_id>/tasks/health-check` | Start Health Check Task |

### LinkedIn Operations

| Method | Endpoint                                                                      | Description                                   |
| :----- | :---------------------------------------------------------------------------- | :-------------------------------------------- |
| `GET`  | `/v1/accounts/<account_id>/linkedin/me`                                       | Get "Me" Profile (Fetch & Update)             |
| `GET`  | `/v1/accounts/<account_id>/linkedin/profile`                                  | Get LinkedIn Profile (Basic/Contact/Rich)     |
| `GET`  | `/v1/accounts/<account_id>/linkedin/connections`                              | Get LinkedIn Connections                      |
| `GET`  | `/v1/accounts/<account_id>/linkedin/search-people`                            | Search LinkedIn People by IDs/Text            |
| `GET`  | `/v1/accounts/<account_id>/linkedin/search-people-free-text`                  | Search LinkedIn People with Free-Text Filters |
| `GET`  | `/v1/accounts/<account_id>/linkedin/search-jobs`                              | Search LinkedIn Jobs by IDs                   |
| `GET`  | `/v1/accounts/<account_id>/linkedin/search-jobs-free-text`                    | Search LinkedIn Jobs with Free-Text Filters   |
| `POST` | `/v1/accounts/<account_id>/linkedin/invite`                                   | Send LinkedIn Connection Invite               |
| `GET`  | `/v1/accounts/<account_id>/linkedin/conversations`                            | Get LinkedIn Conversations                    |
| `GET`  | `/v1/accounts/<account_id>/linkedin/conversations/<conversation_id>/messages` | Get Messages in Conversation                  |
| `GET`  | `/v1/accounts/<account_id>/linkedin/conversations/with/<other_hash_id>`       | Get Conversation with Recipient               |
| `POST` | `/v1/accounts/<account_id>/linkedin/message`                                  | Send LinkedIn Message                         |
| `POST` | `/v1/accounts/<account_id>/linkedin/upload-messaging-attachment`              | Upload Attachment and Send Message            |
| `POST` | `/v1/accounts/<account_id>/linkedin/download-file`                            | Download File from LinkedIn (via URL)         |

### SSE (Server-Sent Events)

| Method | Endpoint                              | Description       |
| :----- | :------------------------------------ | :---------------- |
| `POST` | `/v1/accounts/<account_id>/sse/start` | Start SSE Session |
| `POST` | `/v1/accounts/<account_id>/sse/stop`  | Stop SSE Session  |

## API Parameters

This section details the parameters for each API endpoint.

### Account Management

Use these endpoints to create, inspect, update, and remove LinkedIn account records managed by your organization.

**Response Envelope:**

- Success responses use: `{ "data": ... }`
- Error responses use: `{ "error": { "code": "string", "message": "string", "details": {} } }`

**Account Object Fields (`account`):**

| Field             | Type          | Description                   |
| :---------------- | :------------ | :---------------------------- |
| `id`              | string (uuid) | Internal account ID           |
| `username`        | string\|null  | LinkedIn username/login       |
| `email`           | string\|null  | Account email                 |
| `phone`           | string\|null  | Account phone                 |
| `member_id`       | integer\|null | LinkedIn member ID            |
| `hash_id`         | string\|null  | LinkedIn hash ID              |
| `public_id`       | string\|null  | LinkedIn public identifier    |
| `abs`             | string        | Account browser/session state |
| `abs_reason_code` | string\|null  | Reason for current `abs`      |
| `abs_updated_at`  | string\|null  | Last `abs` update timestamp   |
| `created_at`      | string        | Creation timestamp            |
| `updated_at`      | string        | Last update timestamp         |

#### `POST /v1/accounts` (Create Account)

**Body Parameters (JSON):**

- `username`: string (optional)
- `email`: string (optional)
- `phone`: string (optional)
- `password`: string (optional)
- `member_id`: string (optional)
- `hash_id`: string (optional)
- `public_id`: string (optional)

**Example Body:**

```json
{
  "email": "demo@example.com",
  "password": "your-password",
  "public_id": "john-doe"
}
```

**Response Details:**

- `201 Created` on success.
- Body: `{ "data": { "account": { ...Account Object... } } }`
- `409 Conflict` with `error.code = "account_conflict"` if a duplicate account exists.
- `400 Bad Request` with `error.code = "validation_error"` for invalid payload.

#### `GET /v1/accounts` (List Accounts)

**Query Parameters:**

- `limit`: integer (optional, default: 20, max: 100)
- `cursor`: string (optional, ISO 8601 datetime for pagination)

**Notes:**

- Use `limit` + `cursor` for cursor-based pagination.
- Pass the `cursor` returned by the previous response to fetch the next page.

**Response Details:**

- `200 OK` on success.
- Body: `{ "data": [ ...Account Object... ] }`

#### `GET /v1/accounts/<account_id>` (Get Account Details)

**Path Parameters:**

- `account_id`: string (required) - Internal account identifier.

**Usage:**

- Fetch current account metadata before mutating operations.
- Useful for validating whether login/session-related fields are present.

**Response Details:**

- `200 OK` on success.
- Body: `{ "data": { "account": { ...Account Object... } } }`
- `404 Not Found` with `error.code = "account_not_found"` if the account does not exist in the org.

#### `PATCH /v1/accounts/<account_id>` (Update Account)

**Body Parameters (JSON):**

- Same fields as `POST /v1/accounts`, all optional.

**Path Parameters:**

- `account_id`: string (required) - Internal account identifier.

**Notes:**

- Only send fields that need to be changed.
- Unspecified fields remain unchanged.

**Response Details:**

- `200 OK` on success.
- Body: `{ "data": { "account": { ...Account Object... } } }`
- `400 Bad Request` with `error.code = "validation_error"` for invalid payload.
- `404 Not Found` with `error.code = "account_not_found"` if account is missing.

#### `DELETE /v1/accounts/<account_id>` (Delete Account)

**Path Parameters:**

- `account_id`: string (required) - Internal account identifier.

**Notes:**

- Removes the managed account from the organization workspace.
- Recommended to stop active automations/tasks before deletion.

**Response Details:**

- `200 OK` on success.
- Body: `{ "data": { "message": "Account deleted" } }`
- `404 Not Found` with `error.code = "account_not_found"` if account is missing.

#### `POST /v1/accounts/<account_id>:unlogin` (Unlogin Account)

**Path Parameters:**

- `account_id`: string (required) - Internal account identifier.

**Body Parameters (JSON):**

- No parameters required.

**Usage:**

- Clears the stored login/session state for the account.
- Commonly used before re-running login with fresh credentials.

**Response Details:**

- `200 OK` on success.
- Body: `{ "data": { "account": { ...Account Object... } } }`
- `404 Not Found` with `error.code = "account_not_found"` if account is missing.

### Task Management

Task endpoints are asynchronous-control APIs for login, health-check, and other account operations.

**Task Object Fields (`task`):**

| Field                 | Type          | Description                                                                        |
| :-------------------- | :------------ | :--------------------------------------------------------------------------------- |
| `id`                  | string (uuid) | Task ID                                                                            |
| `linkedin_account_id` | string (uuid) | Related account ID                                                                 |
| `kind`                | string        | Task type (for example: `login`, `health_check`)                                   |
| `status`              | string        | Current state (`queued`, `running`, `waiting_user`, `stopping`, `succeeded`, etc.) |
| `request_source`      | string\|null  | Source label for the request                                                       |
| `request_id`          | string\|null  | Idempotency key echoed back                                                        |
| `priority`            | integer       | Scheduling priority                                                                |
| `step`                | string\|null  | Current workflow step                                                              |
| `step_message`        | string\|null  | Human-readable progress/status                                                     |
| `twofa_method`        | string\|null  | 2FA challenge method                                                               |
| `twofa_deadline_at`   | string\|null  | 2FA deadline                                                                       |
| `result_code`         | string\|null  | Result code for completion/skip/failure                                            |
| `error_message`       | string\|null  | Error summary if failed                                                            |
| `error_details`       | object        | Error details payload                                                              |
| `scheduled_at`        | string\|null  | Scheduler timestamp                                                                |
| `started_at`          | string\|null  | Start timestamp                                                                    |
| `finished_at`         | string\|null  | End timestamp                                                                      |
| `cancel_requested_at` | string\|null  | Cancellation request timestamp                                                     |
| `cancel_requested_by` | string\|null  | Cancellation actor                                                                 |
| `cancel_reason`       | string\|null  | Cancellation reason                                                                |
| `created_at`          | string        | Creation timestamp                                                                 |
| `updated_at`          | string        | Last update timestamp                                                              |

#### `GET /v1/tasks/<task_id>` (Get Task Details)

**Path Parameters:**

- `task_id`: string (required) - Task identifier returned by a task-start endpoint.

**Usage:**

- Poll this endpoint to monitor execution progress and final outcome.

**Response Details:**

- `200 OK` on success.
- Body: `{ "data": { "task": { ...Task Object... } } }`
- `404 Not Found` if `task_id` is missing or not in your org.

#### `POST /v1/tasks/<task_id>:cancel` (Cancel Task)

**Body Parameters (JSON):**

- `reason`: string (optional) - Reason for cancellation.

**Path Parameters:**

- `task_id`: string (required) - Task identifier.

**Response Details:**

- `200 OK` on success.
- Body: `{ "data": { "task": { ...Task Object... } } }`
- If task is already terminal, returns current task unchanged.
- `400 Bad Request` with `error.code = "validation_error"` for invalid payload.

#### `POST /v1/tasks/<task_id>/2fa/code` (Submit 2FA)

**Body Parameters (JSON):**

- `code`: string (required) - The 2FA code.

**Path Parameters:**

- `task_id`: string (required) - Task identifier for the login flow waiting on 2FA.

**Usage:**

- Use only when the login task indicates 2FA input is required.
- Submit quickly to avoid code expiration.

**Response Details:**

- `200 OK` on success.
- Body: `{ "data": { "task": { ...Task Object... } } }`
- `409 Conflict` with `error.code = "task_invalid_state"` when task is not waiting for code or challenge type does not accept a code.

#### `GET /v1/accounts/<account_id>/tasks` (List Tasks)

**Query Parameters:**

- `kind`: string (optional) - Filter by task kind (e.g., `login`, `health_check`).
- `limit`: integer (optional, default: 20)
- `cursor`: string (optional, ISO 8601 datetime)

**Path Parameters:**

- `account_id`: string (required) - Account identifier.

**Response Details:**

- `200 OK` on success.
- Body: `{ "data": { "tasks": [ ...Task Object... ] } }`
- `404 Not Found` with `error.code = "account_not_found"` if account is missing.

#### `POST /v1/accounts/<account_id>/tasks/login` (Start Login)

Body Parameters (JSON):

No parameters required.

**Path Parameters:**

- `account_id`: string (required) - Account identifier.

**Response Behavior:**

- Returns a task object/id that should be tracked via `GET /v1/tasks/<task_id>`.

**Response Details:**

- `201 Created` when a new login task is created.
- `200 OK` when returning an existing/skipped task (for example idempotency hit, already-valid account, or live-task skip).
- Body: `{ "data": { "task": { ...Task Object... } } }`
- `409 Conflict` with `error.code = "task_conflict"` when concurrent task creation conflicts.

#### `POST /v1/accounts/<account_id>/tasks/health-check` (Start Health Check)

Body Parameters (JSON):

No parameters required.

**Path Parameters:**

- `account_id`: string (required) - Account identifier.

**Response Details:**

- `201 Created` when a new health-check task is created.
- `200 OK` when returning an existing/skipped task (for example idempotency hit or live-task skip).
- Body: `{ "data": { "task": { ...Task Object... } } }`
- `409 Conflict` with `error.code = "task_conflict"` when concurrent task creation conflicts.

#### `GET /v1/accounts/<account_id>/tasks/login` (Get Latest Login Task)

**Path Parameters:**

- `account_id`: string (required) - Account identifier.

**Usage:**

- Quick way to inspect the most recent login attempt for an account.
- Useful when resuming automation after process restarts.

**Response Details:**

- `200 OK` on success.
- Body: `{ "data": { "task": { ...Task Object... } } }`
- `404 Not Found` with `error.code = "task_not_found"` if no login task exists yet.

### LinkedIn Operations

#### `GET /v1/accounts/<account_id>/linkedin/me` (Get Me Profile)

**Query Parameters:**

- `return_original`: boolean (optional, default: false) - If true, returns the raw upstream responses under `search_jobs` and `job_details`.

#### `GET /v1/accounts/<account_id>/linkedin/profile` (Get Profile)

**Query Parameters:**

- `profile_id`: string (required) - The member identity (vanity name or ID).
- `return_original_basic`: boolean (optional, default: false) - If true, returns the original LinkedIn response for basic profile.
- `return_original_contact`: boolean (optional, default: false) - If true, returns the original LinkedIn response for contact info.
- `return_original_rich`: boolean (optional, default: false) - If true, returns the original LinkedIn response for rich profile.

#### `GET /v1/accounts/<account_id>/linkedin/connections` (Get Connections)

**Query Parameters:**

- `count`: integer (optional, default: 25)
- `start`: integer (optional, default: 0)
- `return_original`: boolean (optional, default: false) - If true, returns the raw upstream responses under `search_jobs` and `job_details`.

#### Search People Result Object Fields

| Field             | Type          | Description                                           |
| :---------------- | :------------ | :---------------------------------------------------- |
| `member_id`       | integer\|null | LinkedIn member ID                                    |
| `hash_id`         | string\|null  | LinkedIn profile hash ID                              |
| `public_id`       | string\|null  | LinkedIn public profile identifier                    |
| `member_distance` | string\|null  | LinkedIn connection distance value                    |
| `name`            | string\|null  | Profile display name                                  |
| `headline`        | string\|null  | Primary profile headline                              |
| `summary`         | string\|null  | Summary snippet when present                          |
| `location`        | string\|null  | Profile location text                                 |
| `profile_url`     | string\|null  | Canonical LinkedIn profile URL                        |
| `insights`        | string\|null  | First insight string when present                     |
| `badgeHoverText`  | string\|null  | Badge hover text such as verification or premium text |

#### `GET /v1/accounts/<account_id>/linkedin/search-people` (Search People)

**Query Parameters:**

- `keywords`: string (optional) - Main people-search keywords.
- `locationId`: string (optional) - LinkedIn location ID.
- `currentCompanyId`: string (optional) - LinkedIn current company ID.
- `pastCompanyId`: string (optional) - LinkedIn past company ID.
- `industryId`: string (optional) - LinkedIn industry ID.
- `network`: string (optional) - Network filter. Example values: `F` = 1st-degree, `S` = 2nd-degree, `O` = others.
- `connectionOf`: string (optional) - LinkedIn profile hash ID to search connections of.
- `followerOf`: string (optional) - LinkedIn profile hash ID to search followers of.
- `openToVolunteer`: boolean (optional)
- `profileLanguage`: string (optional) - Language code. Example values: `en` = English, `es` = Spanish, `zh` = Chinese.
- `schoolId`: string (optional) - LinkedIn school/company ID.
- `serviceCategoryId`: string (optional) - LinkedIn service category / standardized skill ID.
- `firstName`: string (optional)
- `lastName`: string (optional)
- `title`: string (optional) - Job title of the people being searched.
- `company`: string (optional) - Free-text company filter.
- `school`: string (optional) - Free-text school filter.
- `start`: integer (optional, default: 0) - Pagination offset for the search results.
- `return_original`: boolean (optional, default: false) - If true, returns the original LinkedIn response body.

**Response Details:**

- `200 OK` on success.
- Body: `{ "data": [ ...Search People Result Object... ] }`

#### `GET /v1/accounts/<account_id>/linkedin/search-people-free-text` (Search People with Free-Text Filters)

**Query Parameters:**

- `keywords`: string (optional) - Main people-search keywords.
- `locationName`: string (optional) - Free-text location name, resolved to `locationId`.
- `currentCompanyName`: string (optional) - Free-text current company name, resolved to `currentCompanyId`.
- `pastCompanyName`: string (optional) - Free-text past company name, resolved to `pastCompanyId`.
- `industryName`: string (optional) - Free-text industry name, resolved to `industryId`.
- `network`: string (optional) - Network filter. Example values: `F` = 1st-degree, `S` = 2nd-degree, `O` = others.
- `connectionOf`: string (optional) - Free-text person name, resolved to a profile hash ID.
- `followerOf`: string (optional) - Free-text person name, resolved to a profile hash ID.
- `openToVolunteer`: boolean (optional)
- `profileLanguage`: string (optional) - Language code. Example values: `en` = English, `es` = Spanish, `zh` = Chinese.
- `schoolName`: string (optional) - Free-text school name, resolved to `schoolId`.
- `serviceCategoryName`: string (optional) - Free-text service category name, which is also the skill name, resolved to `serviceCategoryId`.
- `firstName`: string (optional)
- `lastName`: string (optional)
- `title`: string (optional) - Job title of the people being searched.
- `company`: string (optional) - Free-text company filter.
- `school`: string (optional) - Free-text school filter.
- `start`: integer (optional, default: 0) - Pagination offset for the search results.
- `return_original`: boolean (optional, default: false) - If true, returns the original LinkedIn response body.

**Notes:**

- This endpoint resolves name-based filters through LinkedIn typeahead before running the final people search.
- If a provided free-text filter cannot be resolved, the API returns `400 Bad Request` with `error.code = "resolution_error"`.

**Response Details:**

- `200 OK` on success.
- Body: `{ "data": [ ...Search People Result Object... ] }`

**Job Search Result Object Fields (`data[]`):**

| Field          | Type          | Description                        |
| :------------- | :------------ | :--------------------------------- |
| `job_id`       | integer\|null | LinkedIn job posting ID            |
| `job_title`    | string\|null  | Job title                          |
| `job_url`      | string\|null  | Canonical LinkedIn job URL         |
| `job_company`  | string\|null  | Company name                       |
| `job_insight`  | string\|null  | Relevance or promoted insight text |
| `job_location` | string\|null  | Job location text                  |

**Additional Job Enrichment Fields (merged into `jobs[]` when details are available):**

| Field                   | Type             | Description                                                              |
| :---------------------- | :--------------- | :----------------------------------------------------------------------- |
| `job_id`                | integer\|null    | LinkedIn job posting ID                                                  |
| `job_title`             | string\|null     | Detailed job title                                                       |
| `job_url`               | string\|null     | Canonical LinkedIn job URL                                               |
| `job_company`           | string\|null     | Company name                                                             |
| `company_id`            | integer\|null    | LinkedIn company ID                                                      |
| `company_url`           | string\|null     | Company LinkedIn URL when available                                      |
| `company_logo_url`      | string\|null     | Best available company logo URL                                          |
| `job_location`          | string\|null     | Resolved location text                                                   |
| `location_id`           | integer\|null    | LinkedIn geo/location ID                                                 |
| `workplace_type`        | string\|null     | Primary workplace type label                                             |
| `workplace_types`       | array of strings | Resolved workplace type labels                                           |
| `job_insights`          | array of strings | Flattened detail-card insights such as workplace type or employment type |
| `saved`                 | boolean\|null    | Whether LinkedIn currently marks the job as saved                        |
| `navigation_subtitle`   | string\|null     | Header subtitle shown on the job details page                            |
| `tertiary_description`  | string\|null     | Additional summary text from the detail card                             |
| `posted_on_text`        | string\|null     | Relative posted-time text when available                                 |
| `job_description`       | string\|null     | Full job description text                                                |
| `job_posted_at`         | integer\|null    | Raw LinkedIn post timestamp in milliseconds                              |
| `job_state`             | string\|null     | LinkedIn job state                                                       |
| `content_source`        | string\|null     | LinkedIn content-source identifier                                       |
| `reposted_job`          | boolean\|null    | Whether LinkedIn marks the job as reposted                               |
| `is_verified`           | boolean          | Whether LinkedIn marks the job as verified                               |
| `verification_url`      | string\|null     | LinkedIn verification details URL                                        |
| `apply_cta_text`        | string\|null     | Apply button text                                                        |
| `applied_at`            | integer\|null    | Raw LinkedIn application timestamp in milliseconds when present          |
| `onsite_apply`          | boolean\|null    | Whether the job can be applied to directly on LinkedIn                   |
| `in_page_offsite_apply` | boolean\|null    | Whether LinkedIn exposes in-page offsite apply for the job               |
| `company_apply_url`     | string\|null     | Offsite/company apply URL when available                                 |

#### `GET /v1/accounts/<account_id>/linkedin/search-jobs` (Search Jobs)

**Query Parameters:**

- `keywords`: string (optional) - Main job-search keywords.
- `locationId`: string (optional) - LinkedIn location ID for the search area.
- `companyId`: string (optional) - LinkedIn company ID.
- `timePostedRange`: string (optional) - Relative time filter. Example values: `1d` = 1 day, `1w` = 1 week, `1mo` = 1 month, `3mo` = 3 months.
- `jobType`: string (optional) - Job type filter. Example values: `F` = full time, `P` = part time, `C` = contract, `T` = temporary, `V` = volunteer, `I` = internship, `O` = other.
- `sortBy`: string (optional, default: `R`) - Sort order. Example values: `DD` = most recent, `R` = relevance.
- `applyWithLinkedIn`: boolean (optional) - Restrict to Easy Apply / Apply with LinkedIn jobs.
- `commitment`: integer (optional) - Company commitment filter. Example values: `1` = diversity, equity, and inclusion, `2` = environmental sustainability, `3` = work-life balance, `4` = social impact, `5` = career growth and learning.
- `distance`: integer (optional) - Distance in miles.
- `expLevel`: integer (optional) - Experience level. Example values: `1` = internship, `2` = entry level, `3` = associate, `4` = mid-senior level, `5` = director, `6` = executive.
- `earlyApplicant`: boolean (optional) - Restrict to jobs where you are an early applicant.
- `functionId`: string (optional) - LinkedIn job function ID.
- `industryId`: string (optional) - LinkedIn industry ID.
- `inYourNetwork`: boolean (optional) - Restrict to jobs in your network.
- `populatedPlaceGeoId`: string (optional) - LinkedIn populated place geo ID.
- `salaryBucketV2`: string (optional) - Salary filter bucket. Example values: `1` = $40,000+, `2` = $60,000+, `3` = $80,000+, `4` = $100,000+, `5` = $120,000+, `6` = $140,000+, `7` = $160,000+, `8` = $180,000+, `9` = $200,000+.
- `titleId`: string (optional) - LinkedIn standardized job title ID.
- `workplaceType`: integer (optional) - Workplace type. Example values: `1` = onsite, `2` = remote, `3` = hybrid.
- `start`: integer (optional, default: 0) - Pagination offset for the search results.
- `count`: integer (optional, default: 25) - Number of results to request.
- `decorationId`: string (optional) - LinkedIn jobs decoration ID. Defaults to `com.linkedin.voyager.dash.deco.jobs.search.JobSearchCardsCollection-213`.
- `jobDetailsCount`: integer (optional, default: all prefetched jobs on the current page) - Count used for the follow-up LinkedIn job-details GraphQL request.
- `jobPostingDetailDescriptionStart`: integer (optional, default: 0) - Description pagination start for the follow-up LinkedIn job-details GraphQL request.
- `jobPostingDetailDescriptionCount`: integer (optional, default: 5) - Description pagination count for the follow-up LinkedIn job-details GraphQL request.
- `return_original`: boolean (optional, default: false) - If true, returns the original LinkedIn response body.

**Response Details:**

- `200 OK` on success.
- Body: `{ "data": { "jobs": [ ...Job Search Result Object... ] } }`

**Notes:**

- After the initial job search call succeeds, this endpoint makes a second LinkedIn GraphQL request for richer job details.
- The second request uses the prefetch job-card URNs from the search response metadata (`data.metadata.jobCardPrefetchQueries`).
- If `jobDetailsCount` is omitted, the second request fetches details for all prefetched jobs on the current search page.
- In normal mode, each parsed detail record is merged into the matching item in `jobs[]` by `job_id`; unmatched parsed detail records are appended.
- If `return_original=true`, the response returns the raw upstream `search_jobs` and `job_details` payloads instead.

#### `GET /v1/accounts/<account_id>/linkedin/search-jobs-free-text` (Search Jobs with Free-Text Filters)

**Query Parameters:**

- `keywords`: string (optional) - Main job-search keywords.
- `locationName`: string (optional) - Free-text location name, resolved to `locationId`.
- `companyName`: string (optional) - Free-text company name, resolved to `companyId`.
- `timePostedRange`: string (optional) - Relative time filter. Example values: `1d` = 1 day, `1w` = 1 week, `1mo` = 1 month, `3mo` = 3 months.
- `jobType`: string (optional) - Job type filter. Example values: `F` = full time, `P` = part time, `C` = contract, `T` = temporary, `V` = volunteer, `I` = internship, `O` = other.
- `sortBy`: string (optional, default: `R`) - Sort order. Example values: `DD` = most recent, `R` = relevance.
- `applyWithLinkedIn`: boolean (optional) - Restrict to Easy Apply / Apply with LinkedIn jobs.
- `commitment`: integer (optional) - Company commitment filter. Example values: `1` = diversity, equity, and inclusion, `2` = environmental sustainability, `3` = work-life balance, `4` = social impact, `5` = career growth and learning.
- `distance`: integer (optional) - Distance in miles.
- `expLevel`: integer (optional) - Experience level. Example values: `1` = internship, `2` = entry level, `3` = associate, `4` = mid-senior level, `5` = director, `6` = executive.
- `earlyApplicant`: boolean (optional) - Restrict to jobs where you are an early applicant.
- `functionName`: string (optional) - Free-text job function name, resolved to `functionId`.
- `industryName`: string (optional) - Free-text industry name, resolved to `industryId`.
- `inYourNetwork`: boolean (optional) - Restrict to jobs in your network.
- `populatedPlaceName`: string (optional) - Free-text populated place name, resolved to `populatedPlaceGeoId`.
- `salaryBucketV2`: string (optional) - Salary filter bucket. Example values: `1` = $40,000+, `2` = $60,000+, `3` = $80,000+, `4` = $100,000+, `5` = $120,000+, `6` = $140,000+, `7` = $160,000+, `8` = $180,000+, `9` = $200,000+.
- `titleName`: string (optional) - Free-text job title name, resolved to `titleId`.
- `workplaceType`: integer (optional) - Workplace type. Example values: `1` = onsite, `2` = remote, `3` = hybrid.
- `start`: integer (optional, default: 0) - Pagination offset for the search results.
- `count`: integer (optional, default: 25) - Number of results to request.
- `decorationId`: string (optional) - LinkedIn jobs decoration ID. Defaults to `com.linkedin.voyager.dash.deco.jobs.search.JobSearchCardsCollection-213`.
- `jobDetailsCount`: integer (optional, default: all prefetched jobs on the current page) - Count used for the follow-up LinkedIn job-details GraphQL request.
- `jobPostingDetailDescriptionStart`: integer (optional, default: 0) - Description pagination start for the follow-up LinkedIn job-details GraphQL request.
- `jobPostingDetailDescriptionCount`: integer (optional, default: 5) - Description pagination count for the follow-up LinkedIn job-details GraphQL request.
- `return_original`: boolean (optional, default: false) - If true, returns the original LinkedIn response body.

**Response Details:**

- `200 OK` on success.
- Body: `{ "data": { "jobs": [ ...Job Search Result Object... ] } }`

**Notes:**

- This endpoint resolves name-based filters through LinkedIn typeahead before running the final jobs search.
- If a provided free-text filter cannot be resolved, the API returns `400 Bad Request` with `error.code = "resolution_error"`.
- After resolving any free-text filters, this endpoint follows the same two-step search-plus-details flow as `search-jobs`.
- If `jobDetailsCount` is omitted, the second request fetches details for all prefetched jobs on the current search page.
- In normal mode, each parsed detail record is merged into the matching item in `jobs[]` by `job_id`; unmatched parsed detail records are appended.
- If `return_original=true`, the response returns the raw upstream `search_jobs` and `job_details` payloads instead.

#### `POST /v1/accounts/<account_id>/linkedin/invite` (Send Invite)

**Body Parameters (JSON):**

- `hash_id`: string (required) - The hash ID of the user to invite.
- `message`: string (optional) - Custom invitation message.
- `return_original`: boolean (optional, default: false) - If true, returns the original LinkedIn response body.

#### `GET /v1/accounts/<account_id>/linkedin/conversations` (Get Conversations)

**Query Parameters:**

- `hash_id`: string (optional) - Explicit account hash ID (usually inferred).
- `count`: integer (optional, default: 20)
- `last_activity_at`: integer (optional) - Timestamp for pagination.
- `return_original`: boolean (optional, default: false) - If true, returns the original LinkedIn response body.

#### `GET /v1/accounts/<account_id>/linkedin/conversations/<conversation_id>/messages`

**Query Parameters:**

- `hash_id`: string (optional)
- `conversation_urn`: string (optional)
- `delivered_at`: integer (optional)
- `prev_cursor`: string (optional)
- `return_original`: boolean (optional, default: false) - If true, returns the original LinkedIn response body.

#### `GET /v1/accounts/<account_id>/linkedin/conversations/with/<other_hash_id>`

**Query Parameters:**

- `hash_id`: string (optional)
- `return_original`: boolean (optional, default: false) - If true, returns the original LinkedIn response body.

#### `POST /v1/accounts/<account_id>/linkedin/message` (Send Message)

**Body Parameters (JSON):**

- `conversation_id`: string (optional) - Existing conversation ID.
- `receiver_hash_id`: string (optional) - Recipient hash ID (if new conversation).
- `text`: string (required usually) - Message content.
- `return_original`: boolean (optional, default: false) - If true, returns the original LinkedIn response body.

#### `POST /v1/accounts/<account_id>/linkedin/upload-messaging-attachment` (Upload Attachment and Send Message)

**Body Parameters (multipart/form-data):**

- `attachment`: file (required) - The attachment file to upload.
- `conversation_id`: string (optional) - Existing conversation ID.
- `receiver_hash_id`: string (optional) - Recipient hash ID (if new conversation).
- `text`: string (optional, default: empty string) - Message body text (can be empty when sending attachment).
- `return_original`: boolean (optional, default: false) - If true, returns the original LinkedIn response body.

#### `POST /v1/accounts/<account_id>/linkedin/download-file`

**Body Parameters (JSON):**

- `url`: string (required) - The file URL to download.

### SSE (Server-Sent Events)

#### `POST /v1/accounts/<account_id>/sse/start`

**Body Parameters (JSON):**

- `callback_url`: string (required) - URL to receive events.
- `callback_token`: string (required) - Authentication token for callback.
- `forward_heartbeat`: boolean (optional, default: false) - Whether to forward heartbeat events.

#### `POST /v1/accounts/<account_id>/sse/stop`

**Body Parameters (JSON):**

- No parameters required.

### SSE Callback Event Payloads

When an SSE session is active, events are forwarded to your `callback_url` as `POST` requests with a JSON body. If a `callback_token` was provided, it is sent in the `X-Callback-Token` header.

There are 6 event types:

#### `heartbeat`

Only forwarded when `forward_heartbeat` is `true`.

```json
{
  "type": "heartbeat"
}
```

#### `client_connection_confirmed`

Sent when the SSE connection to LinkedIn is established and confirmed.

```json
{
  "type": "client_connection_confirmed"
}
```

#### `message_received`

A new message was received in a conversation.

```json
{
  "type": "message_received",
  "event_id": "string",
  "sent_at": "string",
  "unread_conversations_count": 3,
  "conversation_unread_count": 1,
  "conversation_last_activity_at": "string",
  "sender": {
    "member_id": 123456789,
    "hash_id": "abc123",
    "public_identifier": "john-doe",
    "firstname": "John",
    "lastname": "Doe",
    "headline": "Software Engineer at Acme"
  },
  "message": {
    "message_sub_type": "null or string",
    "message_body_render_format": "DEFAULT",
    "message_body": "Hey, how are you?",
    "conversation_id": "2-YWJj...",
    "delivered_at": "1710000000000"
  }
}
```

#### `message_sent`

A message was sent from the connected account.

```json
{
  "type": "message_sent",
  "event_id": "string",
  "sent_at": "string",
  "unread_conversations_count": null,
  "conversation_unread_count": null,
  "conversation_last_activity_at": "string",
  "sender": { "...same as above..." },
  "message": { "...same as above..." }
}
```

#### `sponsored_inmail_received`

A sponsored InMail was received. The payload structure is identical to `message_received`, but `message.message_sub_type` will be `"SPONSORED_INMAIL"`.

```json
{
  "type": "sponsored_inmail_received",
  "event_id": "string",
  "sent_at": "string",
  "unread_conversations_count": null,
  "conversation_unread_count": null,
  "conversation_last_activity_at": "string",
  "sender": { "...same as message_received..." },
  "message": {
    "message_sub_type": "SPONSORED_INMAIL",
    "message_body_render_format": "string",
    "message_body": "string",
    "conversation_id": "string",
    "delivered_at": "string"
  }
}
```

#### `custom_connection_request_accepted`

A connection request was accepted (fallback type when the event doesn't match the above message types).

```json
{
  "type": "custom_connection_request_accepted",
  "event_id": "string",
  "sent_at": "string",
  "unread_conversations_count": null,
  "conversation_unread_count": null,
  "conversation_last_activity_at": "string",
  "sender": { "...same as message_received..." },
  "message": {}
}
```

#### Field Reference

| Field                                | Type          | Description                                     |
| :----------------------------------- | :------------ | :---------------------------------------------- |
| `type`                               | string        | Event type (see above)                          |
| `event_id`                           | string        | Unique event identifier                         |
| `sent_at`                            | string        | Timestamp when the event left the server        |
| `unread_conversations_count`         | integer\|null | Total unread conversation count                 |
| `conversation_unread_count`          | integer\|null | Unread count for the specific conversation      |
| `conversation_last_activity_at`      | string\|null  | Last activity timestamp for the conversation    |
| `sender.member_id`                   | integer       | LinkedIn member ID                              |
| `sender.hash_id`                     | string        | LinkedIn hash ID                                |
| `sender.public_identifier`           | string        | LinkedIn vanity URL slug                        |
| `sender.firstname`                   | string        | First name                                      |
| `sender.lastname`                    | string        | Last name                                       |
| `sender.headline`                    | string        | Profile headline                                |
| `message.message_sub_type`           | string\|null  | Message subtype (e.g., `SPONSORED_INMAIL`)      |
| `message.message_body_render_format` | string        | Body render format (e.g., `DEFAULT`)            |
| `message.message_body`               | string        | The message text content                        |
| `message.conversation_id`            | string        | Conversation identifier                         |
| `message.delivered_at`               | string        | Timestamp (epoch ms) when message was delivered |
