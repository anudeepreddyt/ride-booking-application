# Cab Booking Application

A full-stack ride-hailing portfolio project built with React + Vite and Spring Boot.

## Included
- React responsive UI with rider, driver, and admin views
- Spring Boot REST API, JWT login, BCrypt password hashing, role-based endpoints
- PostgreSQL persistence with Flyway migration
- Booking flow with configurable fare estimation
- Google Maps frontend integration with a clear fallback when no key is configured
- WebSocket/STOMP infrastructure for ride updates
- Stripe integration configuration scaffold (requires Stripe keys)
- Dockerfiles, Docker Compose, environment examples, and tests

## Requirements
- Java 17+
- Node.js 20+
- Docker Desktop (recommended) OR local PostgreSQL
- Optional Google Maps API key and Stripe test keys

## Run with Docker
1. Copy `.env.example` to `.env` and edit values as needed.
2. Start services:
   ```bash
   docker compose up --build
   ```
3. Frontend: http://localhost:5173
4. Backend health: http://localhost:8080/api/health

The frontend uses `VITE_API_BASE_URL` and `VITE_GOOGLE_MAPS_API_KEY`. Google Maps is not active without a valid key; the UI will show a configuration fallback rather than pretending live maps work.

## Run locally without Docker
### Backend
```bash
cd backend
# Set DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET in your environment
./mvnw spring-boot:run
```
On Windows use `mvnw.cmd spring-boot:run`. If the Maven wrapper is not present in your environment, use `mvn spring-boot:run`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Demo account creation
Register a rider through the UI. Driver/admin accounts should be provisioned by an administrator in a production system. For local demo only, you can set `APP_DEMO_SEED=true` to seed:
- `driver@example.com` / `DriverDemo123!`
- `admin@example.com` / `AdminDemo123!`

Change all demo credentials before sharing/deployment. Demo seeding is disabled by default.

## Important integration notes
- Google Maps requires an API key and enabled APIs/billing in Google Cloud. Restrict browser keys by HTTP referrer.
- Stripe payment code is configured for test-mode credentials; configure webhook secret and verify webhook signatures before production use. Do not store card details.
- Live driver GPS requires device/browser location permission and authenticated WebSocket subscriptions. Test with two browser sessions.
- This is a portfolio MVP foundation, not a certified production ride-hailing service. Review security, payment webhooks, abuse prevention, legal/privacy requirements, and load handling before real-world use.

## Project layout
- `backend/`: Spring Boot API
- `frontend/`: React + Vite UI
- `docker-compose.yml`: PostgreSQL, backend, frontend
