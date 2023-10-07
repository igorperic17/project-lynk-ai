
CREATE DATABASE projectlynk;
-- \c projectlynk
CREATE EXTENSION pgvector;

-- Example SQL to create a table with a vector column
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT,
    vector VECTOR(512)
);

