CREATE TABLE ride_declines (
    id BIGSERIAL PRIMARY KEY,
    ride_id BIGINT NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
    driver_id BIGINT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_ride_declines_ride_driver UNIQUE (ride_id, driver_id)
);
CREATE INDEX idx_ride_declines_driver ON ride_declines(driver_id);
