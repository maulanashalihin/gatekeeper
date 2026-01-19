# GateKeeper

🎟️ **Modern Event Ticketing SaaS Platform** - QR Code-based Attendance System

Streamline event management with real-time QR code scanning, attendee tracking, and multi-tenant event organization.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup database
cp .env.example .env
npx knex migrate:latest

# Start development
npm run dev
```

Visit `http://localhost:5555`

## ✨ Features

### Event Management
- **Multi-tenant SaaS** - Organizations can create and manage multiple events
- **Team Collaboration** - Multiple users can manage the same event
- **Event Types** - Conferences, Workshops, Concerts, Seminars, Webinars, and more
- **Flexible Entry Systems** - QR code scanning, Manual check-in, Self-service kiosks

### Attendee Management
- **Admin Input** - Event organizers can bulk import attendees
- **Self-Registration** - Attendees can register via public forms
- **QR Code Generation** - Automatic QR code generation for each attendee
- **Real-time Check-in** - Scan QR codes to mark attendance instantly

### Analytics & Reporting
- **Attendance Tracking** - Real-time attendance statistics
- **Check-in History** - Complete audit trail of all check-ins
- **Event Analytics** - Insights into attendee engagement

## 📊 Tech Stack

| Layer | Technology |
|-------|------------|
| Server | HyperExpress |
| Database | BetterSQLite3 + Knex |
| Frontend | Svelte 5 + Inertia.js |
| Styling | TailwindCSS 3 |
| Build | Vite |
| QR Code | qrcode.js |
| Validation | Zod |

## 🎯 Event Types

GateKeeper supports various event types with customizable entry systems:

- **Conferences** - Multi-day events with sessions
- **Workshops** - Interactive training sessions
- **Concerts** - Live entertainment events
- **Seminars** - Educational presentations
- **Webinars** - Online virtual events
- **Meetups** - Community gatherings
- **Exhibitions** - Trade shows and expos
- **Sports Events** - Tournaments and competitions

## 🔐 Entry Systems

- **QR Code Scanning** - Fast, contactless check-in via mobile app
- **Manual Check-in** - Staff-assisted verification
- **Self-service Kiosks** - Automated check-in stations
- **Bulk Import** - Excel/CSV import for large events

## 👥 User Roles

- **Organization Admin** - Create and manage events, invite team members
- **Event Manager** - Manage specific events, oversee check-in operations
- **Event Staff** - Scan QR codes, manage on-site operations
- **Attendee** - Register for events, receive QR codes, check-in

## 📚 Documentation

- [Product Requirements](workflow/PRD.md) - Features, specifications, design system
- [Technical Design](workflow/TDD.md) - Architecture, database schema, API endpoints
- [Development Progress](workflow/PROGRESS.md) - Implementation tracking

## 🏗️ Project Structure

```
app/
├── controllers/          # Request handlers
│   ├── EventController.ts
│   ├── AttendeeController.ts
│   └── CheckInController.ts
├── middlewares/          # Auth, rate limiting
├── services/             # DB, QR generation, Email
└── validators/           # Input validation

resources/
├── js/
│   ├── Pages/            # Svelte/Inertia pages
│   │   ├── events/
│   │   ├── attendees/
│   │   └── checkin/
│   └── Components/       # Reusable components
│       ├── QRScanner.svelte
│       └── EventCard.svelte

routes/                   # Route definitions
migrations/               # Database migrations
```

## 🚀 Getting Started

### For Event Organizers

1. **Sign up** - Create your organization account
2. **Create Event** - Set up your event details and configuration
3. **Add Attendees** - Import attendees or share registration link
4. **Generate QR Codes** - Automatically generated for each attendee
5. **Check-in Attendees** - Scan QR codes at event entrance

### For Attendees

1. **Register** - Fill out event registration form
2. **Receive QR Code** - Get your unique QR code via email
3. **Check-in** - Present QR code at event entrance

## 📝 License

MIT License
