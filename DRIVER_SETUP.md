# Wayfare Driver Registration and Ride Requests

## Create a driver account
1. Start PostgreSQL and the Spring Boot backend.
2. Start the frontend with `npm run dev` from `frontend`.
3. Sign out of the current rider account.
4. Open `http://localhost:5173/register`.
5. Select **Driver** under Account type and create the account.
6. You should be signed in and redirected to `/driver`.

Driver registration uses the dedicated backend endpoint `POST /api/auth/register/driver`. The server assigns the `DRIVER` role; the public registration request cannot assign `ADMIN`.

## Test accept / decline
1. Sign in with a separate Rider account and create a ride.
2. Sign in with the Driver account and open the Driver dashboard.
3. Click **Refresh requests** to load pending rides.
4. **Accept ride** assigns the ride to the current driver and changes its status to `ACCEPTED`.
5. **Decline** records that this driver declined the request. The ride remains `REQUESTED` and can still be seen by other drivers. The same driver will no longer see that request after refresh.

Flyway migration `V2__ride_declines.sql` creates the table used to remember per-driver declines. Flyway applies it automatically when the backend starts.

## Notes
- Driver and rider accounts need different email addresses.
- Existing ride requests with status `REQUESTED` should appear on the Driver dashboard.
- If a driver dashboard request fails, open browser DevTools (F12) → Network and inspect `GET /api/driver/rides/available`. `401/403` usually indicates an authentication or role issue; `500` indicates a backend error.
- This is a development/portfolio implementation. For production, add driver identity verification, vehicle onboarding, availability controls, and stronger operational monitoring.
