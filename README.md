# Holidaze

A modern accommodation booking frontend built with React and Bootstrap, consuming the [Noroff Holidaze API v2](https://docs.noroff.dev/docs/v2/holidaze/bookings).

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment & API](#environment--api)
- [Pages & Routes](#pages--routes)
- [User Roles](#user-roles)
- [For Testers](#for-testers)

---

## About

Holidaze is a full-featured holiday venue booking application. Customers can browse venues, check availability, and make bookings. Venue managers can list and manage their own properties and view incoming bookings.

---

## Features

### Customer
- Browse all available venues with pagination
- Search venues by name or destination
- View venue details including image gallery, amenities, location and availability calendar
- Book a venue by selecting dates and number of guests
- View and cancel upcoming bookings
- Update profile avatar and bio

### Venue Manager
- Create new venue listings with images, amenities and location
- Edit and delete owned venues
- View all bookings per venue in a responsive overview

### General
- Register as a customer or venue manager (requires `stud.noroff.no` email)
- Login / Logout
- Fully responsive — works on mobile, tablet and desktop

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [React 18](https://react.dev) | UI framework |
| [Vite](https://vitejs.dev) | Build tool & dev server |
| [React Bootstrap](https://react-bootstrap.github.io) | Component library |
| [Bootstrap 5](https://getbootstrap.com) | CSS framework |
| [React Router v6](https://reactrouter.com) | Client-side routing |
| [react-datepicker](https://reactdatepicker.com) | Availability calendar |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/edrivvoll/project-exam-2.git
cd holidaze

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview
```

---

## Environment & API

The app uses the **Noroff Holidaze API v2**.

| Setting | Value |
|---|---|
| Base URL | `https://v2.api.noroff.dev` |
| API Key header | `X-Noroff-API-Key` |
| Auth header | `Authorization: Bearer <token>` |

The API key is set in [`src/api/client.js`](src/api/client.js). To generate your own:

1. Register at [Noroff](https://noroff.no) with a `stud.noroff.no` email
2. Log in and call `POST /auth/create-api-key` with your Bearer token
3. Replace the key in `src/api/client.js`

---

## Pages & Routes

| Route | Page | Access |
|---|---|---|
| `/` | Home — venue listing & search | Public |
| `/venues/:id` | Venue detail, calendar & booking | Public |
| `/login` | Login | Public |
| `/register` | Register as customer or manager | Public |
| `/profile` | Update avatar & bio | Logged in |
| `/my-bookings` | View & cancel bookings | Customer |
| `/manager` | Manager dashboard — venue list | Venue Manager |
| `/manager/venues/new` | Create a new venue | Venue Manager |
| `/manager/venues/:id/edit` | Edit an existing venue | Venue Manager |
| `/manager/venues/:id/bookings` | View bookings for a venue | Venue Manager |

---

## User Roles

### Customer
Register with `venueManager: false` (default). Can browse venues, make bookings and manage their profile.

### Venue Manager
Register with `venueManager: true`. Can create, edit and delete venues, and view all bookings on those venues. Cannot make bookings as a guest.

> **Note:** Registration requires a `stud.noroff.no` email address as mandated by the Noroff API.

---

## For Testers

### Quick setup checklist

1. Clone the repo and run `npm install && npm run dev` — no `.env` file is needed.
2. The API key is already hardcoded in `src/api/client.js` so the app works out of the box.
3. **Registration requires a `stud.noroff.no` email address.** The API rejects all other domains at the registration endpoint, so testers must use such an address or use the pre-made test accounts below.

### Test accounts

> These accounts exist in the Noroff API sandbox. Passwords are case-sensitive.

| Role | Email | Password |
|---|---|---|
| Customer | `testcustomer@stud.noroff.no` | `Test1234!` |
| Venue Manager | `testmanager@stud.noroff.no` | `Test1234!` |

If those accounts no longer exist, register a new one with a `stud.noroff.no` email at `/register` and select the appropriate role.

### Testing the customer flow

1. Log in as a customer.
2. Browse venues on the home page — search and pagination both work.
3. Open a venue and use the calendar to pick dates (booked dates are blocked out).
4. Submit a booking and verify it appears on `/my-bookings`.
5. Cancel a booking from `/my-bookings`.
6. Update avatar/bio on `/profile`.

### Testing the venue manager flow

1. Log in as a venue manager.
2. Go to `/manager` — your venue dashboard.
3. Create a new venue via the **Create Venue** button (fill in name, description, price, max guests; images and location are optional).
4. Edit or delete the venue from the dashboard.
5. Click **View Bookings** on a venue to see all customer bookings for it.

### Known limitations

- A venue manager account **cannot** make bookings as a guest — this is intentional per the API spec.
- Image URLs must be publicly accessible — local file uploads are not supported.
- The availability calendar blocks already-booked date ranges but does **not** prevent selecting a partial overlap at the API level (the API itself validates and returns an error in that case).
- There is no email-verification step; the `stud.noroff.no` domain check is the only gate.

### Auth & storage

Authentication tokens are stored in `localStorage` under the keys `hz_token` (JWT) and `hz_user` (serialised user object). Clearing localStorage or opening a private window gives you a clean logged-out state.

---

## Resources

- [Noroff API Documentation](https://docs.noroff.dev)
- [Noroff API Swagger](https://v2.api.noroff.dev/docs/static/index.html)
