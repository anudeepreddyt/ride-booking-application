# Implementation status

Implemented in this archive:
- React/Vite responsive landing page, register/login pages, rider booking screen, driver request dashboard, admin ride overview.
- Spring Boot REST API with JWT authentication, BCrypt, roles, fare estimates, booking, driver acceptance, status transitions, ride history.
- PostgreSQL schema managed by Flyway.
- WebSocket/STOMP broker endpoint and ride event topics.
- Google Maps route/map integration when a valid API key is supplied, with honest fallback UI otherwise.
- Docker Compose, backend/frontend Dockerfiles, `.env.example`, README, fare unit tests.

Needs external setup / further hardening:
- Google Cloud project, billing, enabled Maps JavaScript/Places APIs and browser key restrictions.
- Stripe credentials and full Checkout/PaymentIntent + signed webhook flow are not yet implemented; dependency/config placeholders are included only.
- Demo driver/admin seed workflow is documented but not implemented yet; create role-specific users using a local SQL insert or add a controlled admin provisioning flow before using those dashboards.
- WebSocket broker currently broadcasts ride requests and per-ride updates on topics; production-grade authentication and topic subscription authorization must be added before deployment.
- The map's distance/duration defaults are demo values. For live route estimates, connect a server-validated Routes API call; do not trust browser-supplied fare inputs in production.
- PDF receipts, promo codes/support CRUD, OAuth login, email receipts, full admin CRUD, driver location publication, and complete payment flow remain follow-up work.
