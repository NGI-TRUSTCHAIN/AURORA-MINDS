/*
PART 1 - BEFORE RUNNING THE FOLLOWING, PLEASE READ THE README.txt FILE!
*/


CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Inserting a new user with a hashed password
INSERT INTO "user" (username, hashed_password)
VALUES ('admin', crypt('karanasios7', gen_salt('bf')));

-- Create a temporary table to load CSV data
CREATE TEMP TABLE temp_adhd_mobile (
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
    clinician_id INTEGER,
    child_id INTEGER
);

-- Copy data from CSV file into the temporary table
COPY temp_adhd_mobile(
    adhd_id, perception_1, fine_motor, pre_writing, visual_motor_integration, spatial_orientation, 
    perception_2, cognitive_flexibility, attention_deficit, sustained_attention, target, 
    parent_id, clinician_id, child_id)
FROM 'C:\tmp\adhd.csv'  -- Modify the path accordingly
DELIMITER ','
CSV HEADER;

-- Insert data into adhd table from the temporary table
INSERT INTO adhd (
    adhd_id, perception_1, fine_motor, pre_writing, visual_motor_integration, spatial_orientation, 
    perception_2, cognitive_flexibility, attention_deficit, sustained_attention, target, parent_id, clinician_id, child_id
)
SELECT 
    adhd_id, perception_1, fine_motor, pre_writing, visual_motor_integration, spatial_orientation, 
    perception_2, cognitive_flexibility, attention_deficit, sustained_attention, target, 
    parent_id, clinician_id, child_id
FROM temp_adhd_mobile;

-- Drop the temporary table
DROP TABLE temp_adhd_mobile;
