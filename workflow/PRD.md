# GateKeeper - Product Requirements Document

## 1. Objectives & Goals

### Primary Objective
Build a modern, scalable SaaS platform for event ticketing and attendance management using QR code scanning technology.

### Business Goals
- Enable organizations to efficiently manage multiple events
- Streamline attendee check-in process with QR code technology
- Provide real-time attendance tracking and analytics
- Support flexible event types and entry systems
- Enable team collaboration for event management

### Success Criteria
- Users can create and manage multiple events
- Attendees can register via public forms or be added by admins
- QR codes are automatically generated for each attendee
- Check-in process is fast and reliable (< 2 seconds per scan)
- Real-time attendance statistics are available
- Multiple users can collaborate on event management
- System handles 10,000+ attendees per event without performance degradation

## 2. Core Features

### 2.1 Multi-tenant SaaS Platform
- Organization accounts with multiple users
- Each organization can manage multiple events
- User roles and permissions (Admin, Manager, Staff)
- Team collaboration features

### 2.2 Event Management
- Create/Edit/Delete events
- Event types: Conference, Workshop, Concert, Seminar, Webinar, Meetup, Exhibition, Sports Event
- Event details: Name, description, date/time, location, city, province, venue, address, capacity
- Event settings: Registration open/close, check-in start/end, public/private
- Event images and branding (banner image displayed on event detail page and tickets)
- **Location Autocomplete**: Smart autocomplete for Indonesian cities and provinces using RegionService
- **Enhanced Form UX**: Helper text for all form fields (Public Event, Status, Entry System, Event Image URL) to improve user understanding

### 2.3 Attendee Management
- **Admin Input**: Bulk import via CSV/Excel, manual entry
- **Self-Registration**: Public registration forms with custom fields
- Attendee information: Name, email, phone, company, custom fields
- Attendee status: Registered, Checked-in, Cancelled
- QR code generation for each attendee
- Email notifications (registration confirmation, QR code delivery)

### 2.4 Check-in System
- **QR Code Scanning**: Fast, contactless check-in via mobile device
- **Manual Check-in**: Staff-assisted verification (lookup by name/email)
- **Self-service Kiosks**: Automated check-in stations
- Real-time check-in status updates
- Check-in history and audit trail
- Duplicate check-in prevention

### 2.5 Analytics & Reporting
- Real-time attendance statistics
- Check-in rate tracking
- Attendee demographics
- Event performance metrics
- Export reports (CSV, PDF)

### 2.6 User Management
- User authentication (email/password, OAuth)
- User roles and permissions
- Team member invitations
- Activity logs
- **Organization switching** - Switch between organizations when user belongs to multiple organizations

### 2.7 Onboarding
- **Welcome tour**: Guided tour for new users
- **Organization setup**: Step-by-step organization creation
- **First event creation**: Guided event creation wizard
- **Team invitation**: Easy team member onboarding
- **Progress tracking**: Track onboarding completion
- **Skip option**: Allow experienced users to skip onboarding

### 2.8 Multi-level Dashboard
- **Super Admin Dashboard**: Platform-wide statistics, organization management, system health
- **Organization Dashboard**: Organization overview, events summary, team management, quick actions
- **Event Dashboard**: Event details, attendee statistics, check-in status, event analytics

## 3. User Roles & Permissions

### Super Admin
- Platform-wide administration
- Manage all organizations
- View platform-wide analytics
- System configuration
- User management across platform

### Organization Admin
- Create and manage events
- Invite and manage team members
- View all analytics and reports
- Full access to all organization features
- Organization settings

### Event Manager
- Manage assigned events
- Add/edit attendees
- View event analytics
- Manage check-in operations
- Event settings

### Event Staff
- Scan QR codes for check-in
- Manual check-in capability
- View real-time attendance
- Limited event management access

### Attendee
- Register for public events
- Receive QR code via email
- View event details
- Check-in status

## 4. Event Types & Entry Systems

### Event Types
1. **Conference** - Multi-day events with sessions, speakers, networking
2. **Workshop** - Interactive training sessions with hands-on activities
3. **Concert** - Live entertainment events with multiple performances
4. **Seminar** - Educational presentations and discussions
5. **Webinar** - Online virtual events with remote attendees
6. **Meetup** - Community gatherings and networking events
7. **Exhibition** - Trade shows and expos with booths
8. **Sports Event** - Tournaments and competitions

### Entry Systems
1. **QR Code Scanning** - Primary method, fast and contactless
2. **Manual Check-in** - Backup method, staff-assisted
3. **Self-service Kiosks** - Automated check-in stations
4. **Bulk Import** - For pre-registered attendees

## 5. User Flows

### New User Onboarding Flow
1. User signs up / logs in
2. System checks if user has completed onboarding
3. **Step 1: Welcome** - Welcome screen with "Get Started" or "Skip" option
4. **Step 2: Organization Setup** - Create organization (name, description, logo)
5. **Step 3: First Event** - Create first event with guided wizard
6. **Step 4: Team Invitation** - Invite team members (optional)
7. **Step 5: Completion** - Success message with next steps
8. User redirected to Organization Dashboard

### Event Organizer Flow
1. Sign up/Login to platform
2. Complete onboarding (if new user)
3. Access Organization Dashboard
4. Create new event
5. Configure event details and settings
6. Add attendees (import or share registration link)
7. Generate QR codes for attendees
8. Monitor registrations
9. On event day: Access Event Dashboard
10. Set up check-in stations
11. Scan QR codes as attendees arrive
12. Monitor real-time attendance
13. View analytics and reports

### Super Admin Flow
1. Login to platform
2. Access Super Admin Dashboard
3. View platform-wide statistics
4. Manage organizations (view, suspend, delete)
5. Monitor system health
6. Configure system settings
7. View platform analytics

### Attendee Flow
1. Receive event invitation or find public event
2. Register via form (name, email, phone, etc.)
3. Receive confirmation email with QR code
4. On event day: Present QR code at entrance
5. Get checked in
6. Attend event

### Staff Flow
1. Login to platform
2. Access assigned event from Organization Dashboard
3. Access Event Dashboard
4. Open QR scanner
5. Scan attendee QR codes
6. View check-in confirmation
7. Handle manual check-ins if needed
8. Monitor attendance statistics

## 6. Design Specifications

### Branding Colors

#### Primary Colors
- **Primary**: `#6366F1` (Indigo 500)
- **Primary Dark**: `#4F46E5` (Indigo 600)
- **Primary Light**: `#818CF8` (Indigo 400)

#### Secondary Colors
- **Secondary**: `#10B981` (Emerald 500)
- **Secondary Dark**: `#059669` (Emerald 600)
- **Secondary Light**: `#34D399` (Emerald 400)

#### Neutral Colors
- **Background**: `#F9FAFB` (Gray 50)
- **Surface**: `#FFFFFF` (White)
- **Border**: `#E5E7EB` (Gray 200)
- **Text Primary**: `#111827` (Gray 900)
- **Text Secondary**: `#6B7280` (Gray 500)
- **Text Muted**: `#9CA3AF` (Gray 400)

#### Status Colors
- **Success**: `#10B981` (Emerald 500)
- **Success Surface**: `#D1FAE5` (Emerald 100)
- **Warning**: `#F59E0B` (Amber 500)
- **Warning Surface**: `#FEF3C7` (Amber 100)
- **Error**: `#EF4444` (Red 500)
- **Error Surface**: `#FEE2E2` (Red 100)
- **Info**: `#3B82F6` (Blue 500)
- **Info Surface**: `#DBEAFE` (Blue 100)

### Typography

#### Font Family
- **Primary**: Inter (UI text)
- **Secondary**: Poppins (headings)

#### Font Sizes
- **H1**: 36px / 2.25rem (font-bold)
- **H2**: 30px / 1.875rem (font-bold)
- **H3**: 24px / 1.5rem (font-semibold)
- **H4**: 20px / 1.25rem (font-semibold)
- **H5**: 18px / 1.125rem (font-semibold)
- **Body Large**: 16px / 1rem (font-normal)
- **Body**: 14px / 0.875rem (font-normal)
- **Body Small**: 12px / 0.75rem (font-normal)
- **Caption**: 11px / 0.6875rem (font-medium)

#### Font Weights
- **Regular**: 400
- **Medium**: 500
- **SemiBold**: 600
- **Bold**: 700

### Design Tokens

#### Spacing
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

#### Border Radius
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **2xl**: 32px
- **full**: 9999px

#### Shadows
- **sm**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **md**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **lg**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- **xl**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`

### Visual Identity

#### Logo
- Modern, clean design with QR code element
- Primary color: Indigo 500 (#6366F1)
- Secondary accent: Emerald 500 (#10B981)

#### Iconography
- Use Lucide Icons for consistency
- Primary icons use Indigo color
- Status icons use corresponding status colors

#### Button Styles
- **Primary**: Indigo background, white text, rounded-xl
- **Secondary**: White background, Indigo border, Indigo text, rounded-xl
- **Ghost**: Transparent background, Indigo text, rounded-xl
- **Destructive**: Red background, white text, rounded-xl

#### Card Styles
- White background
- Rounded-2xl corners
- Light gray border (#E5E7EB)
- Subtle shadow (sm)
- Hover: shadow-lg, border color change

#### Form Elements
- Inputs: White background, rounded-xl, gray border, focus: Indigo border
- Labels: Bold, gray-700
- Error messages: Red text, error surface background
- Success messages: Green text, success surface background

### Layout Patterns

#### Super Admin Dashboard Layout
- **Sidebar Navigation** (left, 250px):
  - Dashboard
  - Organizations
  - Users
  - Analytics
  - Settings
- **Top Header**:
  - Platform logo
  - Platform name
  - User profile dropdown (Edit Profile, Switch Organization, Logout)
  - Notifications
- **Main Content Area**:
  - Platform-wide statistics cards (total organizations, total users, total events, active events)
  - Recent organizations table
  - System health indicators
  - Quick actions
- **Responsive**: Sidebar collapses on mobile

#### Organization Dashboard Layout
- **Sidebar Navigation** (left, 250px):
  - Dashboard
  - Events
  - Team Members
  - Organization Settings
- **Top Header**:
  - Organization logo
  - Organization name
  - User profile dropdown (Edit Profile, Switch Organization, Logout)
  - Notifications
- **Main Content Area**:
  - Organization statistics cards (total events, total attendees, upcoming events, active events)
  - Recent events list
  - Team members overview
  - Quick actions (Create Event, Invite Member)
- **Responsive**: Sidebar collapses on mobile

#### Event Dashboard Layout
- **Top Navigation Bar**:
  - Back to Organization Dashboard
  - Event name
  - Event status badge
  - Event settings button
- **Tab Navigation**:
  - Overview
  - Attendees
  - Check-in
  - Analytics
  - Settings
- **Main Content Area** (per tab):
  - **Overview**: Event details, attendee statistics, check-in status, quick actions
  - **Attendees**: Attendee list, search, filter, add attendee, import
  - **Check-in**: QR scanner, manual check-in, check-in history, real-time stats
  - **Analytics**: Charts, graphs, attendance trends, demographics
  - **Settings**: Event configuration, registration settings, check-in settings
- **Responsive**: Tab navigation becomes dropdown on mobile

#### Event Card
- Event image (top, 16:9 aspect ratio)
- Event title (H3)
- Event date/time (icon + text)
- Event location (icon + text)
- Attendee count (badge)
- Action buttons (Edit, Delete, View)

#### Attendee List
- Table layout with columns: Name, Email, Status, Actions
- Row hover effect
- Status badges (Registered, Checked-in, Cancelled)
- Bulk actions toolbar

#### QR Scanner
- Full-screen camera view
- Scan frame overlay (center)
- Scan result popup
- Manual check-in button
- Attendance stats overlay

## 7. Technical Requirements

### Performance
- Page load time: < 2 seconds
- QR code scan time: < 1 second
- API response time: < 500ms
- Support 10,000+ concurrent users

### Security
- User authentication and authorization
- QR code encryption/validation
- Rate limiting on public endpoints
- CSRF protection
- Input validation and sanitization
- Secure file uploads

### Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile devices (iOS, Android)
- Camera access for QR scanning
- Offline capability for check-in (PWA)

### Scalability
- Multi-tenant architecture
- Database indexing for performance
- Caching layer for frequently accessed data
- CDN for static assets

## 8. Success Metrics

### User Engagement
- Active organizations: 100+ in first 6 months
- Events created per organization: 5+ average
- Attendee check-in rate: 85%+

### Performance
- Average check-in time: < 2 seconds
- System uptime: 99.9%
- QR code scan success rate: 95%+

### Business
- User retention rate: 80% after 3 months
- Feature adoption rate: 70%+
- Customer satisfaction: 4.5/5 stars