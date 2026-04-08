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

| Method | Endpoint                                           | Description                 |
| :----- | :------------------------------------------------- | :-------------------------- |
| `GET`  | `/v1/tasks/<task_id>`                              | Get Task Details            |
| `POST` | `/v1/tasks/<task_id>:cancel`                       | Cancel Task                 |
| `POST` | `/v1/tasks/<task_id>/2fa/code`                     | Submit 2FA Code             |
| `GET`  | `/v1/accounts/<account_id>/tasks`                  | List Tasks for Account      |
| `POST` | `/v1/accounts/<account_id>/tasks/login`            | Start Login Task            |
| `GET`  | `/v1/accounts/<account_id>/tasks/login`            | Get Latest Login Task       |
| `POST` | `/v1/accounts/<account_id>/tasks/health-check`     | Start Health Check Task     |
| `POST` | `/v1/accounts/<account_id>/tasks/recruiter-switch` | Start Recruiter Switch Task |

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

### LinkedIn Recruiter Lite Operations

| Method | Endpoint                                                               | Description                                    |
| :----- | :--------------------------------------------------------------------- | :--------------------------------------------- |
| `GET`  | `/v1/accounts/<account_id>/linkedin-recruiter/company-typeahead`       | Recruiter Company Typeahead                    |
| `GET`  | `/v1/accounts/<account_id>/linkedin-recruiter/industry-typeahead`      | Recruiter Industry Typeahead                   |
| `GET`  | `/v1/accounts/<account_id>/linkedin-recruiter/job-title-typeahead`     | Recruiter Job Title (Occupation) Typeahead     |
| `GET`  | `/v1/accounts/<account_id>/linkedin-recruiter/location-typeahead`      | Recruiter Location Typeahead                   |
| `GET`  | `/v1/accounts/<account_id>/linkedin-recruiter/school-typeahead`        | Recruiter School Typeahead                     |
| `GET`  | `/v1/accounts/<account_id>/linkedin-recruiter/skill-typeahead`         | Recruiter Skill Typeahead                      |
| `GET`  | `/v1/accounts/<account_id>/linkedin-recruiter/zip-typeahead`           | Recruiter ZIP Typeahead                        |
| `POST` | `/v1/accounts/<account_id>/linkedin-recruiter/search-people`           | Recruiter Search People (ID-based filters)     |
| `POST` | `/v1/accounts/<account_id>/linkedin-recruiter/search-people-free-text` | Recruiter Search People with Free-Text Filters |

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

#### `POST /v1/accounts/<account_id>/tasks/recruiter-switch` (Start Recruiter Switch)

Body Parameters (JSON):

No parameters required.

**Path Parameters:**

- `account_id`: string (required) - Account identifier.

**Usage:**

- Switches the LinkedIn account into a Recruiter Lite contract so subsequent `linkedin-recruiter/*` calls can run.
- Account `abs` must be `VALID` (i.e. logged in) before calling this endpoint.

**Response Details:**

- `201 Created` when a new recruiter-switch task is created.
- `200 OK` when returning an existing/skipped task (idempotency hit, live-task skip).
- Body: `{ "data": { "task": { ...Task Object... } } }`
- `400 Bad Request` with `error.code = "account_not_valid"` if the account is not in a logged-in state.
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

### LinkedIn Recruiter Lite Operations

These endpoints require the account to be switched into a LinkedIn Recruiter Lite contract first (see `POST /v1/accounts/<account_id>/tasks/recruiter-switch`). All endpoints validate that the account `abs` is `VALID` and return `423 Locked` with `error.code = "account_abs_not_valid"` otherwise.

#### Recruiter Typeahead Endpoints

The seven typeahead endpoints below share the same shape:

**Common Query Parameters:**

- `keyword`: string (required) - Search keyword.
- `return_original`: boolean (optional, default: false) - If true, returns the raw upstream response body.

**Common Response:**

- `200 OK` on success.
- Body: `{ "data": [ ...typed entries... ] }` (see per-endpoint fields below).
- `400 Bad Request` with `error.code = "missing_param"` when `keyword` is absent.
- `424 Failed Dependency` with `error.code = "upstream_error"` when LinkedIn returns a non-200 status.

##### `GET /v1/accounts/<account_id>/linkedin-recruiter/company-typeahead`

Returns Recruiter company suggestions. Each entry: `{ title, company_id, company_url, company_logo_url, ... }`.

##### `GET /v1/accounts/<account_id>/linkedin-recruiter/industry-typeahead`

Returns Recruiter industry suggestions. Each entry: `{ title, industry_id }`.

##### `GET /v1/accounts/<account_id>/linkedin-recruiter/job-title-typeahead`

Returns Recruiter occupation/job title suggestions. Each entry: `{ title, title_id }`. The `title_id` value feeds the `occupations[].title_id` field of the people-search body.

##### `GET /v1/accounts/<account_id>/linkedin-recruiter/location-typeahead`

Returns Recruiter geo location suggestions. Each entry: `{ title, display_name, location_id }`. The `location_id` is the `geo_id` used in the search body's `locations[]`.

##### `GET /v1/accounts/<account_id>/linkedin-recruiter/school-typeahead`

Returns Recruiter school suggestions. Each entry: `{ name, school_id, organization_id }`. Note: the recruiter people-search facet expects the `organization_id` value (passed as `school_id` in the search body), not the typeahead `school_id`.

##### `GET /v1/accounts/<account_id>/linkedin-recruiter/skill-typeahead`

Returns Recruiter skill suggestions. Each entry: `{ name, skill_id }`.

##### `GET /v1/accounts/<account_id>/linkedin-recruiter/zip-typeahead`

Returns Recruiter ZIP/postal location suggestions. Shares the location parser; each entry: `{ title, display_name, location_id }`.

#### Recruiter Search People — Shared Response Shape

Both `search-people` and `search-people-free-text` return the same parsed envelope:

```json
{
  "data": {
    "paging": { "start": 0, "count": 25, "total": 1234 },
    "total": 1234,
    "formatted_total": "1,234",
    "highlight_terms": ["..."],
    "facets": [ { "type": "...", "name": "...", "values": [...] } ],
    "query_summary": [ { "type": "...", "label": "..." } ],
    "candidates": [ { ...Candidate Object... } ]
  }
}
```

**Candidate Object Fields (`candidates[]`):**

| Field                | Type          | Description                                           |
| :------------------- | :------------ | :---------------------------------------------------- |
| `hit_urn`            | string\|null  | Recruiter search hit URN                              |
| `profile_urn`        | string\|null  | Member profile URN                                    |
| `t_hash_id`          | string\|null  | Recruiter `t_` hash ID extracted from the profile URN |
| `public_id`          | string\|null  | LinkedIn public profile identifier                    |
| `member_id`          | integer\|null | LinkedIn member ID                                    |
| `anonymized`         | boolean\|null | Whether LinkedIn anonymized the candidate             |
| `first_name`         | string\|null  | First name (or unobfuscated when available)           |
| `last_name`          | string\|null  | Last name (or unobfuscated when available)            |
| `headline`           | string\|null  | Profile headline                                      |
| `industry`           | string\|null  | Industry name                                         |
| `location`           | string\|null  | Resolved location display name                        |
| `public_profile_url` | string\|null  | Canonical LinkedIn profile URL                        |
| `profile_picture`    | string\|null  | Best profile picture URL when available               |
| `num_connections`    | integer\|null | Connection count                                      |
| `network_distance`   | string\|null  | Connection distance label                             |
| `open_to_work`       | boolean\|null | Whether the member is open to new opportunities       |
| `can_send_inmail`    | boolean\|null | Whether you can InMail the member                     |
| `has_verifications`  | boolean\|null | Whether LinkedIn has profile verifications            |
| `top_features`       | array         | Top "interested in" feature groups                    |
| `current_positions`  | array         | Parsed current positions                              |
| `work_experience`    | array         | Parsed work experience entries                        |
| `educations`         | array         | Parsed education entries                              |
| `insights`           | object        | Parsed insights payload                               |
| `recruiting`         | object        | Parsed recruiting metadata                            |

If `return_original=true` is supplied as a query parameter, the raw upstream LinkedIn response body is returned instead of the parsed envelope.

#### Recruiter Search People — Per-Entry Sub-Filters

Several list-based filters on both `search-people` and `search-people-free-text` accept optional per-entry sub-filters that map onto LinkedIn's internal query flags. All sub-filters default to the legacy behavior when omitted, so existing request bodies continue to work unchanged.

**`filter_type`** — inclusion / exclusion mode. Maps onto LinkedIn's `negated` and `required` flags.

| Value                    | Meaning                                                       | `negated` / `required` |
| :----------------------- | :------------------------------------------------------------ | :--------------------- |
| `"can_have"` _(default)_ | Optional / soft match — boosts relevance but does not filter. | `false` / `false`      |
| `"must_have"`            | Mandatory inclusion — every result must match this entry.     | `false` / `true`       |
| `"doesnt_have"`          | Exclusion — drop every result that matches this entry.        | `true` / `false`       |

Applies to: `titles`, `locations`, `skills`, `companies`, `current_companies`, `past_companies`, `industries`, `schools`.

**`time_scope`** — restricts title/company matching to a particular stretch of the member's work history. Maps onto the LinkedIn `scope.timeScope` enum.

| Value                           | Meaning                                                                                |
| :------------------------------ | :------------------------------------------------------------------------------------- |
| `"current_or_past"` _(default)_ | Match anyone who currently holds or previously held this title/company.                |
| `"current"`                     | Only match members currently holding this title/working at this company.               |
| `"past"`                        | Match members whose history includes this title/company (current holders still count). |
| `"past_not_current"`            | Previously held but not currently held — classic "ex-X" filter.                        |

Applies to: `titles`, `companies`.

**`geo_scope`** — restricts location matching between the member's current location and their stated relocation preference. Maps onto the LinkedIn `scope.geoRegionScope` enum.

| Value                     | Meaning                                                                                                |
| :------------------------ | :----------------------------------------------------------------------------------------------------- |
| `"current"` _(default)_   | Currently located in this area.                                                                        |
| `"preferred_not_current"` | "Open to relocate only" — member expressed preference for this area but does not currently live there. |
| `"current_or_preferred"`  | Currently located in this area OR open to relocate to it.                                              |

Applies to: `locations`.

**How sub-filters appear in request bodies:**

- **ID-bearing endpoint** (`search-people`): add the sub-filter field alongside the existing `name` / id field. Example:
  ```json
  {
    "name": "Software Engineer",
    "title_id": 9,
    "filter_type": "must_have",
    "time_scope": "current"
  }
  ```
- **Free-text endpoint** (`search-people-free-text`): each supported filter accepts either a legacy plain string _or_ a dict `{ "name": "...", "filter_type": "...", "time_scope": "...", "geo_scope": "..." }`. The two forms may be mixed within the same list. Example:
  ```json
  "past_companies": [
    "Amazon",
    { "name": "Meta", "filter_type": "doesnt_have" }
  ]
  ```

Sub-filters compose orthogonally — you can set `filter_type` and `time_scope` on the same title, or `filter_type` and `geo_scope` on the same location. Unknown values return `400 Bad Request` with `error.code = "validation_error"` and the list of allowed values.

#### `POST /v1/accounts/<account_id>/linkedin-recruiter/search-people` (Recruiter Search People)

**Query Parameters:**

- `return_original`: boolean (optional, default: false) - If true, returns the raw LinkedIn response body.

**Body Parameters (JSON):**

- `titles`: array (optional) - List of `{ name, title_id }` entries. Resolve `title_id` via `linkedin-recruiter/job-title-typeahead`. Forwarded to LinkedIn as `query.occupations[]` (matched against LinkedIn's standardized title taxonomy). **Supports sub-filters** `filter_type` and `time_scope` — see the "Per-Entry Sub-Filters" section above.
- `start`: integer (optional, default: 0) - Pagination offset.
- `keywords`: string (optional) - Free-text keyword filter.
- `first_names`: array of strings (optional)
- `last_names`: array of strings (optional)
- `skills`: array of `{ name, skill_id }` (optional) - Resolve via `skill-typeahead`. **Supports sub-filter** `filter_type`.
- `companies`: array of `{ name, company_id }` (optional) - Resolve via `company-typeahead`. **Supports sub-filters** `filter_type` and `time_scope`.
- `current_companies`: array of `{ name, company_id }` (optional). **Supports sub-filter** `filter_type`.
- `past_companies`: array of `{ name, company_id }` (optional). **Supports sub-filter** `filter_type`.
- `schools`: array of `{ name, school_id }` (optional) - `school_id` is the typeahead `organization_id`. **Supports sub-filter** `filter_type`.
- `graduation_years`: object (optional) - `{ "min": int, "max": int }`; either bound is optional.
- `industries`: array of `{ name, industry_id }` (optional) - Resolve via `industry-typeahead`. **Supports sub-filter** `filter_type`.
- `seniorities`: array of `{ name, seniority_id }` (optional) - `seniority_id` is an integer (`1=Unpaid`, `2=Training`, `3=Entry`, `4=Senior`, `5=Manager`, `6=Director`, `7=VP`, `8=CXO`, `9=Partner`, `10=Owner`).
- `company_sizes`: array of `{ name, size_id }` (optional) - `size_id` is a single-letter code (`A=Self-employed`, `B=1-10`, `C=11-50`, `D=51-200`, `E=201-500`, `F=501-1000`, `G=1001-5000`, `H=5001-10,000`, `I=10,000+`).
- `job_functions`: array of `{ name, function_id }` (optional) - `function_id` is an integer. Allowed values: `1=Accounting`, `2=Administrative`, `3=Arts and Design`, `4=Business Development`, `5=Community and Social Services`, `6=Consulting`, `7=Education`, `8=Engineering`, `9=Entrepreneurship`, `10=Finance`, `11=Healthcare Services`, `12=Human Resources`, `13=Information Technology`, `14=Legal`, `15=Marketing`, `16=Media and Communication`, `17=Military and Protective Services`, `18=Operations`, `19=Product Management`, `20=Program and Project Management`, `21=Purchasing`, `22=Quality Assurance`, `23=Real Estate`, `24=Research`, `25=Sales`, `26=Customer Success and Support`.
- `networks`: array of `{ name, network_id }` (optional) - `network_id` is a single-letter code (`F=1st Connections`, `S=2nd Connections`, `A=Group Members`, `O=3rd + Everyone Else`).
- `yoe`: object (optional) - `{ "min": int, "max": int }` years-of-experience bounds; either is optional.
- `locations`: array of `{ name, geo_id }` (optional) - `geo_id` is the `location_id` from the location typeahead. **Supports sub-filters** `filter_type` and `geo_scope` (defaults to `"current"`).
- `zip_codes`: array of `{ name, geo_id }` (optional) - Postal codes resolved via `zip-typeahead`. `name` is the postal code label (e.g. `"94105"`); `geo_id` is the typeahead `location_id`.
- `distance`: integer (optional) - Radius in miles around the supplied `zip_codes`. Must be a positive integer.
- `profile_languages`: array of `{ name, language_id }` (optional) - `language_id` is a short language code. Allowed values: `en=English`, `es=Spanish`, `zh=Chinese`, `de=German`, `fr=French`, `it=Italian`, `pt=Portuguese`, `nl=Dutch`, `in=Bahasa Indonesia`, `ms=Malay`, `ro=Romanian`, `ru=Russian`, `tr=Turkish`, `sv=Swedish`, `pl=Polish`, `ja=Japanese`, `cs=Czech`, `da=Danish`, `no=Norwegian`, `ko=Korean`, `_o=Others`.
- `recently_joined`: array of `{ name, bucket_id }` (optional) - Filter for members who recently joined LinkedIn. `bucket_id` is an integer. Allowed values: `1=1 day ago`, `2=2-7 days ago`, `3=8-14 days ago`, `4=15-30 days ago`, `5=1-3 months ago`.
- `is_veteran`: boolean (optional) - When `true`, restricts results to members with a US military background (LinkedIn `IS_VETERAN` facet). Omit or `false` to disable.

**Example Body:**

```json
{
  "titles": [
    {
      "name": "Software Engineer",
      "title_id": 9,
      "filter_type": "must_have",
      "time_scope": "current"
    },
    { "name": "Staff Engineer", "title_id": 25201 },
    { "name": "Recruiter", "title_id": 346, "filter_type": "doesnt_have" }
  ],
  "start": 0,
  "keywords": "python distributed systems",
  "first_names": ["Jane"],
  "last_names": ["Doe"],
  "skills": [
    { "name": "Kubernetes", "skill_id": "1234", "filter_type": "must_have" },
    { "name": "PHP", "skill_id": "6", "filter_type": "doesnt_have" }
  ],
  "companies": [
    {
      "name": "Amazon",
      "company_id": "1586",
      "filter_type": "must_have",
      "time_scope": "past_not_current"
    }
  ],
  "current_companies": [{ "name": "Acme", "company_id": "1441" }],
  "past_companies": [
    { "name": "Globex", "company_id": "1442", "filter_type": "doesnt_have" }
  ],
  "schools": [
    { "name": "MIT", "school_id": "1234", "filter_type": "must_have" }
  ],
  "graduation_years": { "min": 2010, "max": 2015 },
  "industries": [
    {
      "name": "Software Development",
      "industry_id": "4",
      "filter_type": "must_have"
    }
  ],
  "seniorities": [{ "name": "Senior", "seniority_id": 4 }],
  "company_sizes": [{ "name": "51-200", "size_id": "D" }],
  "job_functions": [{ "name": "Engineering", "function_id": 8 }],
  "networks": [{ "name": "2nd Connections", "network_id": "S" }],
  "yoe": { "min": 3, "max": 10 },
  "locations": [
    {
      "name": "San Francisco Bay Area",
      "geo_id": "90000084",
      "filter_type": "must_have",
      "geo_scope": "current_or_preferred"
    }
  ],
  "zip_codes": [{ "name": "94105", "geo_id": "100525183" }],
  "distance": 25,
  "profile_languages": [{ "name": "English", "language_id": "en" }],
  "recently_joined": [{ "name": "1-3 months ago", "bucket_id": 5 }],
  "is_veteran": true
}
```

**Response Details:**

- `200 OK` on success. Body: `{ "data": { ...Search Envelope... } }` (see "Recruiter Search People — Shared Response Shape" above).
- `400 Bad Request` with `error.code = "validation_error"` when any filter has the wrong shape.
- `423 Locked` with `error.code = "account_abs_not_valid"` when the account is not ready.
- `424 Failed Dependency` with `error.code = "upstream_error"` when LinkedIn rejects the search.
- `429 Too Many Requests` with `error.code = "recruiter_search_in_progress"` and a `Retry-After` header when another recruiter people-search is already running for this account. Only one recruiter people-search runs at a time per account, across all server processes.

#### `POST /v1/accounts/<account_id>/linkedin-recruiter/search-people-free-text` (Recruiter Search People, Free-Text)

Same response envelope as `search-people`, but the most common filters can be supplied as plain strings — the endpoint resolves them to IDs server-side via the corresponding typeahead before running the search.

**Query Parameters:**

- `return_original`: boolean (optional, default: false) - If true, returns the raw LinkedIn response body.

**Body Parameters (JSON):**

- `titles`: array of strings _or_ dicts (optional) - Free-text job title names, resolved via `job-title-typeahead`. Forwarded to LinkedIn as `query.occupations[]`. Dict form: `{ name, filter_type?, time_scope? }` — see "Per-Entry Sub-Filters".
- `start`: integer (optional, default: 0) - Pagination offset.
- `keywords`: string (optional)
- `first_names`: array of strings (optional)
- `last_names`: array of strings (optional)
- `skills`: array of strings _or_ dicts (optional) - Free-text skill names, resolved via `skill-typeahead`. Dict form: `{ name, filter_type? }`.
- `companies`: array of strings _or_ dicts (optional) - Free-text company names, resolved via `company-typeahead`. Dict form: `{ name, filter_type?, time_scope? }`.
- `current_companies`: array of strings _or_ dicts (optional) - Free-text company names, resolved via `company-typeahead`. Dict form: `{ name, filter_type? }`.
- `past_companies`: array of strings _or_ dicts (optional) - Free-text company names, resolved via `company-typeahead`. Dict form: `{ name, filter_type? }`.
- `locations`: array of strings _or_ dicts (optional) - Free-text location names, resolved via `location-typeahead`. Dict form: `{ name, filter_type?, geo_scope? }`.
- `schools`: array of strings _or_ dicts (optional) - Free-text school names, resolved via `school-typeahead` (uses `organization_id`). Dict form: `{ name, filter_type? }`.
- `industries`: array of strings _or_ dicts (optional) - Free-text industry names, resolved via `industry-typeahead`. Dict form: `{ name, filter_type? }`.
- `graduation_years`: object (optional) - `{ "min": int, "max": int }`.
- `company_sizes`: array of strings (optional) - Each value must be one of the single-letter codes: `A=Self-employed`, `B=1-10`, `C=11-50`, `D=51-200`, `E=201-500`, `F=501-1000`, `G=1001-5000`, `H=5001-10,000`, `I=10,000+`.
- `job_functions`: array of integers (optional) - Each value must be a valid `function_id`. Allowed values: `1=Accounting`, `2=Administrative`, `3=Arts and Design`, `4=Business Development`, `5=Community and Social Services`, `6=Consulting`, `7=Education`, `8=Engineering`, `9=Entrepreneurship`, `10=Finance`, `11=Healthcare Services`, `12=Human Resources`, `13=Information Technology`, `14=Legal`, `15=Marketing`, `16=Media and Communication`, `17=Military and Protective Services`, `18=Operations`, `19=Product Management`, `20=Program and Project Management`, `21=Purchasing`, `22=Quality Assurance`, `23=Real Estate`, `24=Research`, `25=Sales`, `26=Customer Success and Support`.
- `seniorities`: array of integers (optional) - Each value must be a valid `seniority_id`. Allowed values: `1=Unpaid`, `2=Training`, `3=Entry`, `4=Senior`, `5=Manager`, `6=Director`, `7=VP`, `8=CXO`, `9=Partner`, `10=Owner`.
- `networks`: array of strings (optional) - Each value must be one of the single-letter codes: `F=1st Connections`, `S=2nd Connections`, `A=Group Members`, `O=3rd + Everyone Else`.
- `yoe`: object (optional) - `{ "min": int, "max": int }`.
- `zip_codes`: array of strings (optional) - Free-text postal codes (e.g. `"94105"`), resolved server-side via `zip-typeahead`.
- `distance`: integer (optional) - Radius in miles around the supplied `zip_codes`. Must be a positive integer.
- `profile_languages`: array of strings (optional) - Each value must be one of the language codes: `en=English`, `es=Spanish`, `zh=Chinese`, `de=German`, `fr=French`, `it=Italian`, `pt=Portuguese`, `nl=Dutch`, `in=Bahasa Indonesia`, `ms=Malay`, `ro=Romanian`, `ru=Russian`, `tr=Turkish`, `sv=Swedish`, `pl=Polish`, `ja=Japanese`, `cs=Czech`, `da=Danish`, `no=Norwegian`, `ko=Korean`, `_o=Others`.
- `recently_joined`: array of integers (optional) - Each value must be a valid recently-joined `bucket_id`. Allowed values: `1=1 day ago`, `2=2-7 days ago`, `3=8-14 days ago`, `4=15-30 days ago`, `5=1-3 months ago`.
- `is_veteran`: boolean (optional) - When `true`, restricts results to members with a US military background.

**Example Body:**

```json
{
  "titles": [
    {
      "name": "Software Engineer",
      "filter_type": "must_have",
      "time_scope": "current"
    },
    "Staff Engineer",
    { "name": "Recruiter", "filter_type": "doesnt_have" }
  ],
  "start": 0,
  "keywords": "python distributed systems",
  "first_names": ["Jane"],
  "last_names": ["Doe"],
  "skills": [
    { "name": "Kubernetes", "filter_type": "must_have" },
    "Go",
    { "name": "PHP", "filter_type": "doesnt_have" }
  ],
  "companies": [
    {
      "name": "Amazon",
      "filter_type": "must_have",
      "time_scope": "past_not_current"
    }
  ],
  "current_companies": ["Acme"],
  "past_companies": [
    "Globex",
    { "name": "Oracle", "filter_type": "doesnt_have" }
  ],
  "locations": [
    {
      "name": "San Francisco Bay Area",
      "filter_type": "must_have",
      "geo_scope": "current_or_preferred"
    }
  ],
  "schools": [{ "name": "MIT", "filter_type": "must_have" }],
  "industries": [
    { "name": "Software Development", "filter_type": "must_have" }
  ],
  "graduation_years": { "min": 2010, "max": 2015 },
  "company_sizes": ["D", "E"],
  "job_functions": [8, 13],
  "seniorities": [4, 5],
  "networks": ["S"],
  "yoe": { "min": 3, "max": 10 },
  "zip_codes": ["94105"],
  "distance": 25,
  "profile_languages": ["en"],
  "recently_joined": [5],
  "is_veteran": true
}
```

**Notes:**

- Each free-text filter is resolved by hitting the corresponding recruiter typeahead. The first match with a non-null ID is used.
- If a free-text filter cannot be resolved, the API returns `400 Bad Request` with `error.code = "no_match"` (and the unresolved name in the message).
- This endpoint expects free-text shapes for `titles`, `skills`, `companies`, `current_companies`, `past_companies`, `locations`, `zip_codes`, `schools`, `industries`, `company_sizes`, `job_functions`, `seniorities`, `networks`, `profile_languages`, and `recently_joined`. Other filters (`first_names`, `last_names`, `graduation_years`, `yoe`, `keywords`, `distance`, `is_veteran`) keep their normal shapes.
- For filters that support **per-entry sub-filters** (`titles`, `skills`, `companies`, `current_companies`, `past_companies`, `locations`, `schools`, `industries`), each entry may be either a plain string (legacy form, no sub-filters — same behavior as before) _or_ a dict `{ name, filter_type?, time_scope?, geo_scope? }` with only the sub-filters that apply to that field. The two forms can be mixed within the same list. See "Per-Entry Sub-Filters" above for the supported values and semantics.

**Response Details:**

- `200 OK` on success. Body matches the shared search envelope above.
- `400 Bad Request` with `error.code = "validation_error"` for invalid free-text shapes.
- `400 Bad Request` with `error.code = "no_match"` when a free-text value cannot be resolved.
- `423 Locked` with `error.code = "account_abs_not_valid"` when the account is not ready.
- `424 Failed Dependency` with `error.code = "upstream_error"` when LinkedIn rejects the search.
- `429 Too Many Requests` with `error.code = "recruiter_search_in_progress"` and a `Retry-After` header when another recruiter people-search is already running for this account. Only one recruiter people-search runs at a time per account, across all server processes; the lock covers the typeahead resolution step as well as the search call.

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
