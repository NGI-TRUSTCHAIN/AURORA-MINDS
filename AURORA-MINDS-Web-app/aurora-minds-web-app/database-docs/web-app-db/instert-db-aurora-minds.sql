/*
PART 2 - BEFORE RUNNING THE FOLLOWING, PLEASE READ THE README.txt FILE!
*/

-- Define variables for username and password
DO $$ 
DECLARE 
    -- Update info accordingly
    db_user TEXT := 'yourusername';
    db_password TEXT := 'yourpassword';
BEGIN
    -- Ensure the dblink extension is enabled
    EXECUTE 'CREATE EXTENSION IF NOT EXISTS dblink';

    -- Create a temporary table to load data from aurora-minds-mobile adhd table
    EXECUTE '
    CREATE TEMP TABLE temp_mobile_adhd (
        adhd_id INTEGER PRIMARY KEY,
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
    )';

    -- Load data from the aurora-minds-mobile adhd table into the temporary table
    EXECUTE format('
    INSERT INTO temp_mobile_adhd
    SELECT * FROM dblink(''dbname=aurora-minds-mobile user=%s password=%s'', 
    ''SELECT adhd_id, perception_1, fine_motor, pre_writing, visual_motor_integration, spatial_orientation, 
            perception_2, cognitive_flexibility, attention_deficit, sustained_attention, target, 
            parent_id, clinician_id, child_id FROM adhd'') 
    AS t(adhd_id INTEGER, perception_1 DECIMAL, fine_motor DECIMAL, pre_writing DECIMAL, 
        visual_motor_integration DECIMAL, spatial_orientation DECIMAL, perception_2 DECIMAL, 
        cognitive_flexibility DECIMAL, attention_deficit DECIMAL, sustained_attention DECIMAL, 
        target DECIMAL, parent_id INTEGER, clinician_id INTEGER, child_id INTEGER)', 
    db_user, db_password);

    -- Get parent_ids from the existing login_user table
    EXECUTE '
    WITH parent_ids AS (
        SELECT id, ROW_NUMBER() OVER () AS rn FROM login_user WHERE role = ''PARENT''
    ),
    numbered_temp_adhd AS (
        SELECT adhd_id, child_id, clinician_id, ROW_NUMBER() OVER (ORDER BY child_id) AS rn FROM temp_mobile_adhd
    )

    -- Insert child records based on the above data
    INSERT INTO child (child_id, first_name, last_name, score, parent_id, clinician_id)
    SELECT 
        numbered_temp_adhd.child_id AS child_id,
        ''FirstName'' || numbered_temp_adhd.child_id,  -- Random first name
        ''LastName'' || numbered_temp_adhd.child_id,  -- Random last name
        NULL AS score,  -- Empty score field
        parent_ids.id AS parent_id,  -- Assign parent_id based on the row number
        numbered_temp_adhd.clinician_id  -- Use clinician_id from the temp table
    FROM numbered_temp_adhd
    JOIN parent_ids ON parent_ids.rn = ((numbered_temp_adhd.rn - 1) % (SELECT COUNT(*) FROM parent_ids) + 1)';

    -- Remove the last 10 child records based on the last 10 adhd records in aurora-minds-mobile db
    -- This is for the demo
    EXECUTE format('
    DELETE FROM child
    WHERE child_id IN (
        SELECT child_id
        FROM dblink(''dbname=aurora-minds-mobile user=%s password=%s'', 
                    ''SELECT child_id 
                      FROM adhd 
                      ORDER BY adhd_id DESC 
                      LIMIT 10'') 
        AS t(child_id INTEGER)
    )', db_user, db_password);

    -- Create random questionnaires
    EXECUTE '
    INSERT INTO questionnaire (
        gender, weight, height, date_of_birth, is_native_greek_language, place_of_residence,
        regional_unit, school_name, school_grade, school_class_section, has_parent_fully_custody, comments,
        has_hearing_problem, has_vision_problem, has_early_learning_difficulties, has_delayed_development,
        has_autism, has_deprivation_neglect, has_childhood_aphasia, has_intellectual_disability, child_id
    )
    SELECT
        CASE WHEN RANDOM() < 0.5 THEN ''Male'' ELSE ''Female'' END,  -- Random gender
        ROUND((RANDOM() * 50 + 20)::numeric, 2),  -- Random weight between 20 and 70
        ROUND((RANDOM() * 50 + 100)::numeric, 2),  -- Random height between 100 and 150
        CURRENT_DATE - INTERVAL ''1 year'' * FLOOR(RANDOM() * 6 + 5),  -- Random date of birth between 5 and 10 years old
        RANDOM() < 0.5,  -- Random boolean for is_native_greek_language
        ''Place '' || child_ids.i,  -- Random place of residence
        ''Region '' || child_ids.i,  -- Random regional unit
        ''School '' || FLOOR(RANDOM() * 10 + 1),  -- Random school name
        ''Grade '' || FLOOR(RANDOM() * 12 + 1),  -- Random school grade between 1 and 12
        ''Section '' || CHR(FLOOR(RANDOM() * 26 + 65)::int),  -- Random school class section A-Z
        true,  -- Always true for has_parent_fully_custody
        ''Comments '' || child_ids.i,  -- Random comments
        RANDOM() < 0.5,  -- Random boolean for has_hearing_problem
        RANDOM() < 0.5,  -- Random boolean for has_vision_problem
        RANDOM() < 0.5,  -- Random boolean for has_early_learning_difficulties
        RANDOM() < 0.5,  -- Random boolean for has_delayed_development
        RANDOM() < 0.5,  -- Random boolean for has_autism
        RANDOM() < 0.5,  -- Random boolean for has_deprivation_neglect
        RANDOM() < 0.5,  -- Random boolean for has_childhood_aphasia
        RANDOM() < 0.5,  -- Random boolean for has_intellectual_disability
        child_ids.child_id  -- Assign to a random child_id
    FROM (
        SELECT child_id, ROW_NUMBER() OVER () AS i
        FROM child
        ORDER BY RANDOM()
    ) AS child_ids';

    -- Insert data into adhd table for children that exist in child table and assign random parent_ids
    EXECUTE '
    INSERT INTO adhd (
        adhd_id, perception_1, fine_motor, pre_writing, visual_motor_integration, spatial_orientation, 
        perception_2, cognitive_flexibility, attention_deficit, sustained_attention, target, child_id
    )
    SELECT 
        temp_mobile_adhd.adhd_id, temp_mobile_adhd.perception_1, temp_mobile_adhd.fine_motor, temp_mobile_adhd.pre_writing, 
        temp_mobile_adhd.visual_motor_integration, temp_mobile_adhd.spatial_orientation, temp_mobile_adhd.perception_2, 
        temp_mobile_adhd.cognitive_flexibility, temp_mobile_adhd.attention_deficit, temp_mobile_adhd.sustained_attention, 
        temp_mobile_adhd.target, temp_mobile_adhd.child_id
    FROM temp_mobile_adhd
    JOIN child ON temp_mobile_adhd.child_id = child.child_id';

    -- Export parent and child IDs to a CSV file
    EXECUTE '
    COPY (
        SELECT child_id, parent_id 
        FROM child
    ) TO ''C:\tmp\child_parent_ids.csv'' WITH CSV HEADER';

    -- Drop the temporary table
    EXECUTE 'DROP TABLE temp_mobile_adhd';
END $$;
