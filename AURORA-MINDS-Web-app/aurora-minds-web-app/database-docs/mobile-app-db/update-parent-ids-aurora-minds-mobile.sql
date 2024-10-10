-- Create a temporary table to load CSV data
CREATE TEMP TABLE temp_child_parent_ids (
    child_id INTEGER,
    parent_id INTEGER
);

-- Copy data from CSV file into the temporary table
COPY temp_child_parent_ids(child_id, parent_id)
FROM '/tmp/child_parent_ids.csv'  -- Modify the path accordingly
DELIMITER ','
CSV HEADER;

-- Update parent_id in the adhd table based on the matched child_id
UPDATE adhd
SET parent_id = temp_child_parent_ids.parent_id
FROM temp_child_parent_ids
WHERE adhd.child_id = temp_child_parent_ids.child_id;

-- Drop the temporary table
DROP TABLE temp_child_parent_ids;
