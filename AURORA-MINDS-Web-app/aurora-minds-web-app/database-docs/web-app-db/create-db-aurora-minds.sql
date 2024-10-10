-- Drop tables if they exist
DROP TABLE IF EXISTS adhd;
DROP TABLE IF EXISTS questionnaire;
DROP TABLE IF EXISTS child;
DROP TABLE IF EXISTS login_user;

-- User Table Creation
CREATE TABLE IF NOT EXISTS login_user (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR UNIQUE,
    password VARCHAR,
    contact_number VARCHAR,
    role VARCHAR,
    last_login timestamp
);

-- Child Table Creation
CREATE TABLE IF NOT EXISTS child (
    child_id INTEGER PRIMARY KEY,
    first_name VARCHAR,
    last_name VARCHAR,
    score DECIMAL,
    parent_id INTEGER,
    clinician_id INTEGER,
    FOREIGN KEY (parent_id) REFERENCES login_user(id),
    FOREIGN KEY (clinician_id) REFERENCES login_user(id)
);

-- ADHD Table Creation
CREATE TABLE IF NOT EXISTS adhd (
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
    child_id INTEGER NOT NULL,
    FOREIGN KEY (child_id) REFERENCES child(child_id)
);

-- Questionnaire Table Creation
CREATE TABLE IF NOT EXISTS questionnaire (
    questionnaire_id SERIAL PRIMARY KEY,
    gender VARCHAR,
    weight DECIMAL,
    height DECIMAL,
    date_of_birth DATE,
    is_native_greek_language BOOLEAN,
    place_of_residence VARCHAR,
    regional_unit VARCHAR,
    school_name VARCHAR,
    school_grade VARCHAR,
    school_class_section VARCHAR,
    has_parent_fully_custody BOOLEAN,
    comments TEXT,
    has_hearing_problem BOOLEAN,
    has_vision_problem BOOLEAN,
    has_early_learning_difficulties BOOLEAN,
    has_delayed_development BOOLEAN,
    has_autism BOOLEAN,
    has_deprivation_neglect BOOLEAN,
    has_childhood_aphasia BOOLEAN,
    has_intellectual_disability BOOLEAN,
    child_id INTEGER UNIQUE,  -- Ensure one-to-one relationship
    FOREIGN KEY (child_id) REFERENCES child(child_id)
);
