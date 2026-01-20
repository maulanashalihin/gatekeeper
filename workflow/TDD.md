# GateKeeper - Technical Design Document

## 1. System Architecture

### 1.1 Architecture Overview

GateKeeper follows a **multi-tenant SaaS architecture** with the following components:

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Web App    │  │  Mobile App  │  │  Public API  │     │
│  │ (Svelte 5)   │  │   (PWA)      │  │  (Inertia)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Controllers  │  │ Middlewares  │  │  Services    │     │
│  │              │  │              │  │              │     │
│  │ - Event      │  │ - Auth       │  │ - DB (Knex)  │     │
│  │ - Attendee   │  │ - RateLimit  │  │ - QRCode     │     │
│  │ - CheckIn    │  │ - CSRF       │  │ - Email      │     │
│  │ - Org        │  │ - Validate   │  │ - Cache      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Database   │  │    Cache     │  │   Storage    │     │
│  │  (SQLite)    │  │  (Database)  │  │   (Local)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Tech Stack Details

| Component | Technology | Purpose |
|-----------|------------|---------|
| Server | HyperExpress | High-performance HTTP server |
| Database | BetterSQLite3 + Knex | Data persistence |
| Frontend | Svelte 5 + Inertia.js | Reactive UI without client-side routing |
| Styling | TailwindCSS 3 | Utility-first CSS |
| Build | Vite | Fast build tool |
| QR Code | qrcode.js | QR code generation |
| Validation | Zod | Input validation |
| Email | Resend/Nodemailer | Email notifications |

### 1.3 Multi-tenant Strategy

**Organization-based multi-tenancy:**
- Each organization has its own data isolation
- All queries include `organization_id` filter
- Users belong to organizations with specific roles
- Events and attendees are scoped to organizations

## 2. Database Schema

### 2.1 ER Diagram

```
#### users (built-in)
- Already has: `is_admin` (boolean, default false)
- **All tables use UUIDv7 as primary key**

    │
    ├── organizations (1:N)
    │       │
    │       ├── events (1:N)
    │       │       │
    │       │       ├── attendees (1:N)
    │       │       │       │
    │       │       │       └── check_ins (1:N)
    │       │       │
    │       │       ├── event_members (1:N)
    │       │       │
    │       │       └── event_settings (1:1)
    │       │
    │       └── organization_members (1:N)
    │
    └── organization_members (1:N)
```

### 2.2 Table Definitions

#### organizations
```typescript
{
  id: string (primary, UUIDv7)
  name: string (255, not null)
  slug: string (255, unique, not null)
  description: text (nullable)
  logo: string (255, nullable) - URL to logo image
  settings: json (nullable) - organization settings
  onboarding_completed: boolean (default false) - whether organization setup is complete
  onboarding_step: integer (default 1) - current onboarding step (1-5)
  created_at: timestamp
  updated_at: timestamp
}
```

#### organization_members
```typescript
{
  id: string (primary, UUIDv7)
  organization_id: string (foreign key → organizations.id)
  user_id: string (foreign key → users.id)
  role: enum ('admin', 'manager', 'staff') (not null, default 'staff')
  added_by: string (foreign key → users.id, nullable) - who added this member
  added_at: timestamp (not null)
  created_at: timestamp
  updated_at: timestamp
  
  indexes:
    - organization_id, user_id (unique)
    - organization_id
    - user_id
}
```

#### events
```typescript
{
  id: string (primary, UUIDv7)
  organization_id: string (foreign key → organizations.id, not null)
  name: string (255, not null)
  slug: string (255, unique, not null)
  description: text (nullable)
  type: enum ('conference', 'workshop', 'concert', 'seminar', 'webinar', 'meetup', 'exhibition', 'sports') (not null, default 'conference')
  
  // Event details
  start_date: timestamp (not null)
  end_date: timestamp (not null)
  location: string (255, nullable) - Full location string (e.g., "Jakarta, DKI Jakarta")
  city: string (255, nullable) - City name (e.g., "Jakarta")
  province: string (255, nullable) - Province name (e.g., "DKI Jakarta")
  venue: string (255, nullable)
  address: text (nullable)
  capacity: integer (nullable)
  
  // Event settings
  image: string (255, nullable) - URL to event image
  is_public: boolean (default false)
  registration_open: boolean (default true)
  registration_start: timestamp (nullable)
  registration_end: timestamp (nullable)
  checkin_start: timestamp (nullable)
  checkin_end: timestamp (nullable)
  
  // Entry system
  entry_system: enum ('qr', 'manual', 'kiosk', 'bulk') (not null, default 'qr')
  
  // Status
  status: enum ('draft', 'published', 'ongoing', 'completed', 'cancelled') (not null, default 'draft')
  
  created_by: string (foreign key → users.id)
  created_at: timestamp
  updated_at: timestamp
  
  indexes:
    - organization_id
    - slug (unique)
    - status
    - start_date
}
```

#### event_members
```typescript
{
  id: string (primary, UUIDv7)
  event_id: string (foreign key → events.id, not null)
  user_id: string (foreign key → users.id, not null)
  role: enum ('manager', 'staff') (not null, default 'staff')
  added_by: string (foreign key → users.id, nullable)
  added_at: timestamp
  created_at: timestamp
  updated_at: timestamp
  
  indexes:
    - event_id, user_id (unique)
    - event_id
    - user_id
}
```

#### event_settings
```typescript
{
  id: string (primary, UUIDv7)
  event_id: string (foreign key → events.id, unique, not null)
  
  // Registration settings
  require_approval: boolean (default false)
  custom_fields: json (nullable) - array of custom field definitions
  allow_self_registration: boolean (default true)
  
  // Check-in settings
  allow_duplicate_checkin: boolean (default false)
  require_verification: boolean (default false)
  
  // Notification settings
  send_confirmation_email: boolean (default true)
  send_qr_email: boolean (default true)
  
  // Other settings
  timezone: string (50, default 'UTC')
  locale: string (10, default 'en')
  
  created_at: timestamp
  updated_at: timestamp
}
```

#### attendees
```typescript
{
  id: string (primary, UUIDv7)
  event_id: string (foreign key → events.id, not null)
  
  // Attendee information
  name: string (255, not null)
  email: string (255, not null)
  phone: string (50, nullable)
  company: string (255, nullable)
  job_title: string (255, nullable)
  
  // Custom fields
  custom_data: json (nullable)
  
  // QR code
  qr_code: string (255, unique, not null) - unique identifier for QR code
  qr_code_url: string (255, nullable) - URL to QR code image
  
  // Status
  status: enum ('registered', 'checked_in', 'cancelled', 'no_show') (not null, default 'registered')
  
  // Registration info
  registration_method: enum ('admin', 'self', 'import') (not null, default 'self')
  registered_at: timestamp (not null)
  
  // Check-in info
  checked_in_at: timestamp (nullable)
  checked_in_by: string (foreign key → users.id, nullable)
  
  // Notes
  notes: text (nullable)
  
  created_by: string (foreign key → users.id, nullable)
  created_at: timestamp
  updated_at: timestamp
  
  indexes:
    - event_id
    - email
    - qr_code (unique)
    - status
    - registered_at
}
```

#### check_ins
```typescript
{
  id: string (primary, UUIDv7)
  attendee_id: string (foreign key → attendees.id, not null)
  event_id: string (foreign key → events.id, not null)
  
  // Check-in details
  method: enum ('qr', 'manual', 'kiosk') (not null)
  checked_in_at: timestamp (not null)
  checked_in_by: string (foreign key → users.id, nullable)
  
  // Device info
  device_info: json (nullable) - user agent, device type
  
  // Location (optional)
  latitude: decimal (nullable)
  longitude: decimal (nullable)
  
  // Notes
  notes: text (nullable)
  
  created_at: timestamp
  
  indexes:
    - attendee_id
    - event_id
    - checked_in_at
}
```

#### activity_logs (for audit trail)
```typescript
{
  id: string (primary, UUIDv7)
  user_id: string (foreign key → users.id, nullable)
  organization_id: string (foreign key → organizations.id, nullable)
  event_id: string (foreign key → events.id, nullable)
  attendee_id: string (foreign key → attendees.id, nullable)
  
  action: string (100, not null) - e.g., 'event.created', 'attendee.checked_in'
  entity_type: string (50, nullable) - e.g., 'event', 'attendee'
  entity_id: string (nullable)
  
  changes: json (nullable) - before/after values
  ip_address: string (45, nullable)
  user_agent: string (500, nullable)
  
  created_at: timestamp
  
  indexes:
    - user_id
    - organization_id
    - event_id
    - action
    - created_at
}
```

### 2.3 Relationships

- **users ↔ organizations**: Many-to-many via `organization_members`
- **organizations ↔ events**: One-to-many
- **events ↔ attendees**: One-to-many
- **attendees ↔ check_ins**: One-to-many
- **events ↔ users**: Many-to-many via `event_members`
- **events ↔ event_settings**: One-to-one

## 3. API Endpoints & Routes

### 3.1 Authentication Routes (Built-in)

```
GET  /login                    - Login page
POST /login                    - Login submit
GET  /register                 - Registration page
POST /register                 - Registration submit
POST /logout                   - Logout
GET  /forgot-password          - Forgot password page
POST /forgot-password          - Forgot password submit
GET  /reset-password/:token    - Reset password page
POST /reset-password/:token    - Reset password submit
```

### 3.2 Dashboard Routes

```
# Super Admin Dashboard
GET  /admin/dashboard          - Super Admin dashboard
GET  /admin/organizations      - List all organizations
GET  /admin/organizations/:uuid  - View organization details
GET  /admin/users              - List all users
GET  /admin/analytics          - Platform analytics
GET  /admin/settings           - System settings

# Organization Dashboard
GET  /dashboard                - Organization dashboard (for org members)
GET  /organizations/:uuid/dashboard - Organization dashboard
```

### 3.3 Onboarding Routes

```
GET  /onboarding               - Onboarding welcome page
GET  /onboarding/step/:step    - Onboarding step
POST /onboarding/step/:step    - Submit onboarding step
POST /onboarding/skip          - Skip onboarding
GET  /onboarding/complete      - Onboarding completion
```

### 3.4 Organization Routes

```
GET  /organizations                    - List organizations
GET  /organizations/create             - Create organization form
POST /organizations                    - Store organization
GET  /organizations/:uuid              - Show organization
GET  /organizations/:uuid/edit         - Edit organization form
PUT  /organizations/:uuid              - Update organization
DELETE /organizations/:uuid            - Delete organization

GET  /organizations/:uuid/members      - List organization members
GET  /organizations/:uuid/members/invite - Invite member form
POST /organizations/:uuid/members/invite - Send invitation
DELETE /organizations/:uuid/members/:user_uuid - Remove member
PUT  /organizations/:uuid/members/:user_uuid - Update member role
```

### 3.5 Event Routes

```
GET  /organizations/:org_uuid/events                    - List events (filtered by organization)
GET  /organizations/:org_uuid/events/create             - Create event form
POST /organizations/:org_uuid/events                    - Store event
GET  /organizations/:org_uuid/events/:uuid              - Show event details
GET  /organizations/:org_uuid/events/:uuid/edit         - Edit event form
PUT  /organizations/:org_uuid/events/:uuid              - Update event
DELETE /organizations/:org_uuid/events/:uuid            - Delete event

GET  /organizations/:org_uuid/events/:uuid/dashboard    - Event dashboard
GET  /organizations/:org_uuid/events/:uuid/settings     - Event settings
PUT  /organizations/:org_uuid/events/:uuid/settings     - Update event settings

GET  /organizations/:org_uuid/events/:uuid/members      - List event members
GET  /organizations/:org_uuid/events/:uuid/members/add  - Add member form
POST /organizations/:org_uuid/events/:uuid/members      - Add member to event
DELETE /organizations/:org_uuid/events/:uuid/members/:user_uuid - Remove member from event
```

### 3.6 Attendee Routes

```
GET  /organizations/:org_uuid/events/:event_uuid/attendees                    - List attendees
GET  /organizations/:org_uuid/events/:event_uuid/attendees/create             - Create attendee form
POST /organizations/:org_uuid/events/:event_uuid/attendees                    - Store attendee
GET  /organizations/:org_uuid/events/:event_uuid/attendees/import             - Import attendees form
POST /organizations/:org_uuid/events/:event_uuid/attendees/import             - Import attendees (CSV/Excel)
GET  /organizations/:org_uuid/events/:event_uuid/attendees/:uuid              - Show attendee
GET  /organizations/:org_uuid/events/:event_uuid/attendees/:uuid/edit         - Edit attendee form
PUT  /organizations/:org_uuid/events/:event_uuid/attendees/:uuid              - Update attendee
DELETE /organizations/:org_uuid/events/:event_uuid/attendees/:uuid            - Delete attendee
POST /organizations/:org_uuid/events/:event_uuid/attendees/:uuid/cancel       - Cancel attendee registration

GET  /organizations/:org_uuid/events/:event_uuid/attendees/:uuid/qr-code      - Generate QR code image
GET  /organizations/:org_uuid/events/:event_uuid/attendees/:uuid/ticket       - View ticket with QR code
POST /organizations/:org_uuid/events/:event_uuid/attendees/:uuid/resend-email - Resend QR code email
```

### 3.7 Check-in Routes

```
GET  /organizations/:org_uuid/events/:event_uuid/checkin              - Check-in page (QR scanner)
POST /organizations/:org_uuid/events/:event_uuid/checkin/scan         - Scan QR code
POST /organizations/:org_uuid/events/:event_uuid/checkin/manual       - Manual check-in
GET  /organizations/:org_uuid/events/:event_uuid/checkin/stats        - Real-time check-in statistics
GET  /organizations/:org_uuid/events/:event_uuid/checkin/history      - Check-in history
POST /organizations/:org_uuid/events/:event_uuid/checkin/:attendee_uuid - Check-in attendee
DELETE /organizations/:org_uuid/events/:event_uuid/checkin/:attendee_uuid - Undo check-in
```

### 3.8 Public Registration Routes

```
GET  /events/:slug/register                 - Public registration form
POST /events/:slug/register                 - Submit registration
GET  /events/:slug/confirm/:token           - Confirm registration
GET  /events/:slug/ticket/:qr_code          - View ticket (public)
```

### 3.9 API Routes (JSON responses)

```
GET  /api/events/:uuid/attendees              - List attendees (JSON)
GET  /api/events/:uuid/stats                  - Event statistics (JSON)
GET  /api/events/:uuid/checkin/realtime       - Real-time check-in data (JSON)
POST /api/attendees/:uuid/checkin             - Check-in attendee (JSON)
GET  /api/attendees/:qr_code/info             - Get attendee info by QR code (JSON)
GET  /api/regions/search                      - Search Indonesian cities/provinces (JSON)
```

### 3.10 Region Service Routes

```
GET  /api/regions/search?q={query}&limit={limit}&threshold={threshold} - Search regions/cities
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "kota": "Jakarta",
      "provinsi": "DKI Jakarta",
      "score": 1.0
    }
  ]
}
```

**RegionService Methods:**
- `searchKota(query, limit, threshold)` - Fuzzy search for cities using Levenshtein distance
- `getAllProvinces()` - Get all Indonesian provinces
- `getKotaByProvince(province)` - Get cities by province
- `getAllKota()` - Get all cities with provinces

**RegionController:**
- `search(request, response)` - Handles region search API endpoint
- Validates query parameter `q` (minimum 2 characters)
- Returns matching cities/provinces with similarity scores
- Supports optional `limit` (default: 10) and `threshold` (default: 0.5) parameters

**Autocomplete Component:**
- Reusable Svelte component for autocomplete inputs
- Props: `value`, `label`, `placeholder`, `apiUrl`, `displayField`, `disabled`, `onChange`, `onSelect`
- Debounced API calls for performance
- Used in event forms and onboarding for location selection

## 4. Data Models & Flow

### 4.1 Event Creation Flow

```
1. User creates organization (if not exists)
2. User creates event
   - Basic info (name, type, dates, location)
   - Event settings (public/private, registration, check-in)
3. System generates unique slug
4. System creates event_settings record
5. System logs activity
6. User adds event members (managers, staff)
```

### 4.2 Organization Member Invitation Flow

**Adding Existing User:**
1. Admin searches for existing user by email
2. Admin selects user and assigns role (admin/manager/staff)
3. System creates organization_members record with user_id and role
4. System sends notification email to user
5. User can immediately access organization (no acceptance needed)

**Adding New User:**
1. Admin enters email and assigns role
2. System generates random password (12 characters)
3. System creates user record with email, generated password
4. System creates organization_members record with user_id and role
5. System sends welcome email with:
   - Email and generated password
   - Link to login
   - Organization name
6. User logs in with email + generated password
7. User prompted to change password on first login
8. User can immediately access organization (no acceptance needed)

**Removing Member:**
1. Admin removes user from organization
2. System deletes organization_members record
3. User no longer has access to organization data

**No Invitation Process:**
- No invitation token needed
- No invitation expiration
- No acceptance/decline status
- Immediate access upon addition

### 4.3 Organization Switching Flow

**Switching Organizations:**
1. User clicks on profile dropdown in header
2. User selects "Switch Organization"
3. System shows list of organizations where user is a member
4. User clicks on organization to navigate
5. System redirects to `/organizations/{organization_uuid}/dashboard`
6. Current organization is determined by UUID in URL
7. User can now access events and data from the selected organization

**Profile Dropdown Menu:**
- Edit Profile
- Switch Organization (shows list of user's organizations)
- Logout

**Organization List Display:**
- Show organization name and logo
- Show user role in each organization
- Show total events count per organization
- Click on organization to navigate to its dashboard

**URL Structure:**
- Organization dashboard: `/organizations/{uuid}/dashboard`
- Event dashboard: `/organizations/{org_uuid}/events/{event_uuid}/dashboard`
- Attendees: `/organizations/{org_uuid}/events/{event_uuid}/attendees`
- Check-in: `/organizations/{org_uuid}/events/{event_uuid}/checkin`

### 4.4 Attendee Registration Flow

```
Admin Input:
1. Admin adds attendee manually
2. OR Admin imports CSV/Excel
3. System validates data
4. System generates unique QR code
5. System generates QR code image
6. System sends confirmation email with QR code
7. System logs activity

Self-Registration:
1. Attendee fills registration form
2. System validates input
3. System creates attendee record
4. System generates unique QR code
5. System generates QR code image
6. System sends confirmation email with QR code
7. System logs activity
```

### 4.3 Check-in Flow

```
QR Code Scanning:
1. Staff opens check-in page
2. Staff scans QR code with camera
3. System reads QR code data
4. System validates QR code
5. System checks if attendee exists
6. System checks if already checked in
7. System creates check_in record
8. System updates attendee status
9. System shows confirmation
10. System logs activity

Manual Check-in:
1. Staff searches attendee by name/email
2. Staff selects attendee
3. System shows attendee details
4. Staff confirms check-in
5. System creates check_in record
6. System updates attendee status
7. System shows confirmation
8. System logs activity
```

### 4.4 QR Code Generation

```
QR Code Format:
{
  "v": 1,
  "aid": "<attendee_id>",
  "eid": "<event_id>",
  "sig": "<signature>"
}

Signature: HMAC-SHA256(attendee_id + event_id, secret_key)

Validation:
1. Parse QR code JSON
2. Verify signature
3. Check if attendee exists
4. Check if attendee belongs to event
5. Check if already checked in
```

## 5. Security Considerations

### 5.1 Authentication & Authorization

- **Authentication**: Built-in session-based auth
- **Authorization**: Role-based access control (RBAC)
  - Organization Admin: Full access to organization
  - Event Manager: Full access to assigned events
  - Event Staff: Check-in access to assigned events
- **Multi-tenant isolation**: All queries scoped to organization_id

### 5.2 QR Code Security

- **Unique QR codes**: Each attendee gets unique QR code
- **Signature validation**: QR codes signed with HMAC
- **Expiration**: QR codes valid only during event period
- **One-time use**: Prevent duplicate check-ins (configurable)
- **Rate limiting**: Prevent brute force attacks on public endpoints

### 5.3 Data Protection

- **Input validation**: All inputs validated with Zod schemas
- **SQL injection prevention**: Use parameterized queries (Knex)
- **CSRF protection**: Built-in CSRF middleware
- **XSS prevention**: Inertia.js automatically escapes output
- **Rate limiting**: On public endpoints (registration, check-in)

### 5.4 Privacy

- **GDPR compliance**: Data export, deletion capabilities
- **Email privacy**: Emails not exposed in public views
- **Access logs**: Track who accessed attendee data

## 6. Performance Optimization

### 6.1 Database Optimization

- **Indexing**: All foreign keys and frequently queried fields indexed
- **Query optimization**: Use joins efficiently, avoid N+1 queries
- **Pagination**: Large datasets paginated
- **Caching**: Cache frequently accessed data (event stats, settings)

### 6.2 Frontend Optimization

- **Code splitting**: Lazy load routes
- **Image optimization**: Use WebP format, lazy loading
- **QR code caching**: Generated QR codes cached
- **Debouncing**: Search and autocomplete debounced

### 6.3 QR Code Scanning Performance

- **Fast scanning**: Use optimized QR code library
- **Offline capability**: Cache attendee data for offline check-in
- **Real-time updates**: WebSocket for real-time stats (optional)

## 7. Technical Specifications from PRD.md

### 7.1 Event Types Implementation

```typescript
enum EventType {
  CONFERENCE = 'conference',
  WORKSHOP = 'workshop',
  CONCERT = 'concert',
  SEMINAR = 'seminar',
  WEBINAR = 'webinar',
  MEETUP = 'meetup',
  EXHIBITION = 'exhibition',
  SPORTS = 'sports'
}
```

### 7.2 Entry Systems Implementation

```typescript
enum EntrySystem {
  QR = 'qr',           // QR code scanning
  MANUAL = 'manual',   // Manual check-in
  KIOSK = 'kiosk',     // Self-service kiosk
  BULK = 'bulk'        // Bulk import
}
```

### 7.3 User Roles Implementation

```typescript
enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff'
}

enum OrganizationRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff'
}

enum EventRole {
  MANAGER = 'manager',
  STAFF = 'staff'
}
```

### 7.4 Attendee Status Implementation

```typescript
enum AttendeeStatus {
  REGISTERED = 'registered',
  CHECKED_IN = 'checked_in',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}
```

### 7.5 Event Status Implementation

```typescript
enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

## 8. Deployment Considerations

### 8.1 Environment Variables

```
# Database
DATABASE_PATH=./storage/database.sqlite

# App
APP_URL=http://localhost:5555
APP_PORT=5555
APP_ENV=development

# Security
APP_KEY=<your-secret-key>
QR_CODE_SECRET=<your-qr-code-secret>

# Email
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=<your-api-key>
SMTP_FROM=noreply@gatekeeper.com

# Storage
STORAGE_DRIVER=local
STORAGE_PATH=./storage
```

### 8.2 Production Checklist

- [ ] Set strong APP_KEY
- [ ] Set strong QR_CODE_SECRET
- [ ] Configure production database (PostgreSQL recommended)
- [ ] Configure email service
- [ ] Set up SSL/TLS
- [ ] Configure CDN for static assets
- [ ] Set up backup strategy
- [ ] Configure monitoring and logging
- [ ] Set up error tracking (Sentry)
- [ ] Configure rate limiting
- [ ] Enable CORS if needed
- [ ] Set up cron jobs for maintenance