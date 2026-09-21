## VoIP Management

A white-label web application for managing and monitoring VoIP services through FreePBX.

The application provides a simplified web interface to manage FreePBX extensions and monitor call activity without directly interacting with the FreePBX administration interface.

## Features

- **Dashboard** — Overview of total extensions, weekly calls, answered and missed calls today
- **Extensions** — List all SIP extensions with details; edit extension name, caller ID and SIP secret
- **Calls** — Browse call history (last 7 days) with status badges and duration

## Requirements

- Node.js 18+
- A running **FreePBX** server with API access enabled
- A FreePBX OAuth2 API client (Client ID + Secret) with the scopes: `gql:core`, `gql:cdr`

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file at the project root:

```env
FREEPBX_URL=http://<your-freepbx-ip>
FREEPBX_CLIENT_ID=<your-client-id>
FREEPBX_CLIENT_SECRET=<your-client-secret>
NEXT_PUBLIC_COMPANY_NAME=Your Company Name
```

### 3. Add your company logo

Place your logo file at:

```
public/
```

and rename it to logo.png

It will appear automatically in the sidebar.

### 4. Run the development server

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/
│   ├── dashboard/       # Dashboard page
│   ├── extensions/      # Extensions list & edit pages
│   ├── calls/           # Call history page
│   └── api/             # API routes (proxies to FreePBX GraphQL)
├── components/
│   ├── Header.tsx       # Top navigation bar
│   └── Sidebar.tsx      # Side navigation menu
```

---

## FreePBX API Setup

1. In FreePBX, go to **Admin → API**
2. Create a new API client
3. Grant the scopes: `gql:core`, `gql:cdr`
4. Copy the **Client ID** and **Client Secret** into `.env.local`
