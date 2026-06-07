# MEETLY

A full-stack dating application with member discovery, likes, real-time messaging, photo uploads, and an admin panel. The frontend and backend live in this single repository.

## Demo Video

Watch a walkthrough of the project here:

**[MEETLY Demo on YouTube](https://youtu.be/EGU3LkEHfIA?si=tbIq3OZdAd7OaXw1)**

## Features

- **Authentication** — Register, login, and JWT-based sessions
- **Member profiles** — Browse, filter, and view detailed profiles with photos
- **Likes** — Like members and view liked/liked-by lists
- **Messaging** — Private messages with real-time delivery via SignalR
- **Presence** — Online/offline status tracking
- **Photo management** — Upload and manage photos (Cloudinary)
- **Admin panel** — User and photo moderation (Admin / Moderator roles)

## Tech Stack

### Frontend (`client/`)

| Technology | Purpose |
|---|---|
| [Angular 20](https://angular.dev) | SPA framework |
| [TypeScript 5.8](https://www.typescriptlang.org/) | Typed JavaScript |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [DaisyUI](https://daisyui.com/) | UI component library |
| [RxJS](https://rxjs.dev/) | Reactive state and async streams |
| [@microsoft/signalr](https://www.npmjs.com/package/@microsoft/signalr) | Real-time WebSocket communication |

### Backend (`API/`)

| Technology | Purpose |
|---|---|
| [ASP.NET Core 9](https://dotnet.microsoft.com/) | REST API and hosting |
| [Entity Framework Core 9](https://learn.microsoft.com/en-us/ef/core/) | ORM and database migrations |
| [SQL Server](https://www.microsoft.com/sql-server) | Relational database |
| [ASP.NET Core Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity) | User accounts and roles |
| [JWT Bearer](https://jwt.io/) | API authentication |
| [SignalR](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction) | Real-time hubs (messages, presence) |
| [Cloudinary](https://cloudinary.com/) | Image upload and storage |

## Project Structure

```
DatingApp/
├── API/                    # ASP.NET Core Web API
│   ├── Controllers/        # REST endpoints
│   ├── Data/               # DbContext, repositories, seed data
│   ├── Entities/           # Domain models
│   ├── DTOs/               # Request/response shapes
│   ├── Services/           # Business logic (tokens, photos)
│   ├── SignalR/            # Presence and message hubs
│   ├── Middlewares/        # Global exception handling
│   └── wwwroot/            # Angular production build output
├── client/                 # Angular frontend
│   ├── src/
│   │   ├── app/            # Root app config and routes
│   │   ├── core/           # Services, guards, interceptors, pipes
│   │   ├── features/       # Feature modules (members, messages, admin, …)
│   │   ├── shared/         # Reusable UI components
│   │   └── environments/   # API URLs per environment
│   └── ssl/                # Local HTTPS certificates for dev server
├── docker-compose.yml      # SQL Server container
└── DatingApp.sln           # .NET solution file
```

## Prerequisites

Install the following before running the project locally:

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/) and npm
- [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for SQL Server), **or** a local SQL Server instance
- A [Cloudinary](https://cloudinary.com/) account (free tier works for development)

## Configuration

### Backend — `API/appsettings.json`

`appsettings.json` is gitignored because it contains secrets. Create it manually:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=DatingApp;User Id=SA;Password=Password@1;TrustServerCertificate=True"
  },
  "TokenKey": "super secret unguessable key at least 64 characters long for HMAC signing",
  "CloudinarySettings": {
    "CloudName": "your-cloud-name",
    "ApiKey": "your-api-key",
    "ApiSecret": "your-api-secret"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Information"
    }
  },
  "AllowedHosts": "*"
}
```

| Setting | Description |
|---|---|
| `DefaultConnection` | SQL Server connection string. Must match your Docker or local instance. |
| `TokenKey` | Secret used to sign JWT tokens. Use a long, random string in production. |
| `CloudinarySettings` | Credentials from your Cloudinary dashboard. Required for photo uploads. |

### Frontend — environments

Development URLs are in `client/src/environments/environment.development.ts`:

```typescript
export const environment = {
  production: false,
  baseUrl: 'https://localhost:5001/api/',
  hubUrl: 'https://localhost:5001/hubs/'
};
```

Production builds use relative paths (`api/`, `hubs/`) because the Angular app is served from the API's `wwwroot` folder.

## First-Time Setup

Do these steps once before your first run:

1. Install all [prerequisites](#prerequisites).
2. Create `API/appsettings.json` using the [configuration template](#configuration).
3. Install frontend dependencies:

```bash
cd client
npm install
```

## Start the Full Stack (Development)

You need **three terminals** — one for the database, one for the API, and one for the Angular client.

### Terminal 1 — Database

From the repository root:

```bash
docker compose up -d
```

SQL Server starts on port **1433** (`SA` / `Password@1`).

### Terminal 2 — API

```bash
cd API
dotnet run
```

Wait until you see the API listening at **https://localhost:5001**.

On first run it will:

- Apply EF Core migrations automatically
- Seed demo members from `API/Data/UserSeedData.json`
- Create an admin account (see [Seed data](#seed-data))

### Terminal 3 — Angular client

```bash
cd client
ng serve
```

Wait until the build completes and the dev server is ready at **https://localhost:4200**.

### Open the app

Navigate to [https://localhost:4200](https://localhost:4200) in your browser.

> **Note:** The API CORS policy allows `https://localhost:4200` and `http://localhost:4200`. Use the HTTPS dev URL.

### Quick reference — what runs where

| Service | URL | How to start |
|---|---|---|
| SQL Server | `localhost:1433` | `docker compose up -d` |
| API | https://localhost:5001 | `cd API && dotnet run` |
| Angular client | https://localhost:4200 | `cd client && ng serve` |

## Stop the Full Stack

Shut everything down in reverse order:

### 1. Stop the Angular dev server

In the terminal running `ng serve`, press **`Ctrl + C`**.

### 2. Stop the API

In the terminal running `dotnet run`, press **`Ctrl + C`**.

### 3. Stop the database

From the repository root:

```bash
docker compose down
```

This stops and removes the SQL Server container. Your data persists in the Docker volume until you remove it with `docker compose down -v`.

### Quick reference — how to stop

| Service | How to stop |
|---|---|
| Angular client | `Ctrl + C` in the `ng serve` terminal |
| API | `Ctrl + C` in the `dotnet run` terminal |
| SQL Server | `docker compose down` from the repo root |

> **Tip:** You can leave the database running between sessions. Next time, skip Terminal 1 and only start the API and Angular client.

## Production Build

The Angular build output is configured to land directly in `API/wwwroot`:

```bash
cd client
ng build
```

Then run only the API — it serves both the REST API and the compiled SPA:

```bash
cd API
dotnet run
```

Open [https://localhost:5001](https://localhost:5001).

To stop production mode: press **`Ctrl + C`** in the API terminal, then run `docker compose down` if you started the database.

## Seed Data

On first startup (empty database), the API seeds:

| Account | Password | Roles |
|---|---|---|
| `admin@test.com` | `Pa$$w0rd` | Admin, Moderator |
| Seeded members from `UserSeedData.json` | `Pa$$w0rd` | Member |

## API Overview

### Controllers

| Controller | Route prefix | Description |
|---|---|---|
| `AccountController` | `/api/account` | Register, login, current user |
| `MembersController` | `/api/members` | Member list, details, updates |
| `LikesController` | `/api/likes` | Like/unlike, liked lists |
| `MessageController` | `/api/messages` | Send and retrieve messages |
| `AdminController` | `/api/admin` | User and photo management |
| `BuggyController` | `/api/buggy` | Error testing (development) |

### SignalR Hubs

| Hub | Endpoint | Purpose |
|---|---|---|
| `PresenceHub` | `/hubs/presence` | Online/offline presence |
| `MessageHub` | `/hubs/messages` | Real-time message delivery |

Hub connections pass the JWT via the `access_token` query parameter.

## Frontend Routes

| Path | Description | Auth required |
|---|---|---|
| `/` | Home / landing | No |
| `/members` | Member discovery | Yes |
| `/members/:id` | Member profile, photos, messages | Yes |
| `/lists` | Liked members lists | Yes |
| `/messages` | Inbox | Yes |
| `/admin` | Admin panel | Admin role |
| `/errors` | API error testing | No |

## Development Notes

- **HTTPS everywhere** — Both the API (`:5001`) and Angular dev server (`:4200`) use HTTPS locally.
- **Auto-migration** — `Program.cs` runs `Database.MigrateAsync()` on startup; no manual `dotnet ef database update` is required for local dev.
- **Unit of Work** — Repositories are accessed through `IUnitOfWork` rather than individual repository injections.
- **Roles** — `Member`, `Moderator`, and `Admin` are seeded in `AppDbContext`.

## Useful Commands

```bash
# API
cd API
dotnet run                          # Start API
dotnet ef migrations add <Name>     # Add a new migration
dotnet ef database update           # Apply migrations manually

# Client
cd client
npm install                         # Install dependencies
ng serve                            # Dev server (HTTPS :4200)
ng build                            # Production build → API/wwwroot
ng test                             # Run unit tests

# Database
docker compose up -d                # Start SQL Server
docker compose down                 # Stop SQL Server
```

## Troubleshooting

| Problem | Solution |
|---|---|
| API fails on startup with "Token key not found" | Create `API/appsettings.json` with a `TokenKey` value. |
| Cannot connect to database | Ensure Docker is running (`docker compose up -d`) and the connection string matches. |
| CORS errors in browser | Run the client on `https://localhost:4200`, not a different port. |
| Photo upload fails | Verify `CloudinarySettings` in `appsettings.json`. |
| SSL certificate warning | Expected in local dev; trust the cert or proceed in the browser. |

## License

This project is for educational purposes.
