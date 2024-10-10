-- Drop tables if they exist
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS adhd;

-- Creating the user table
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL
);

-- ADHD Table Creation
CREATE TABLE IF NOT EXISTS adhd (
    adhd_id SERIAL PRIMARY KEY,
    perception_1 DECIMAL,
    fine_motor DECIMAL,
    pre_writing DECIMAL,
    visual_motor_integration DECIMAL,
    spatial_orientation DECIMAL,
    perception_2 DECIMAL,
    cognitive_flexibility DECIMAL,
    attention_deficit DECIMAL,
    sustained_attention DECIMAL,
    target DECIMAL,
    parent_id INTEGER,
    clinician_id INTEGER NOT NULL,
    child_id INTEGER NOT NULL
);
