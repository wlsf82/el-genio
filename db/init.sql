-- Create test_suites table
CREATE TABLE test_suites (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create test_cases table
CREATE TABLE test_cases (
    id SERIAL PRIMARY KEY,
    test_suite_id INTEGER NOT NULL REFERENCES test_suites(id),
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create test_steps table
CREATE TABLE test_steps (
    id SERIAL PRIMARY KEY,
    test_case_id INTEGER NOT NULL REFERENCES test_cases(id),
    command VARCHAR(255) NOT NULL,
    selector TEXT,
    value TEXT,
    length_value INTEGER,
    contained_text TEXT,
    chain_option VARCHAR(50),
    is_chained BOOLEAN DEFAULT false,
    step_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX idx_test_cases_suite_id ON test_cases(test_suite_id);
CREATE INDEX idx_test_steps_case_id ON test_steps(test_case_id);
CREATE INDEX idx_test_suites_deleted_at ON test_suites(deleted_at);
CREATE INDEX idx_test_cases_deleted_at ON test_cases(deleted_at);
CREATE INDEX idx_test_steps_deleted_at ON test_steps(deleted_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_test_suites_updated_at
    BEFORE UPDATE ON test_suites
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_cases_updated_at
    BEFORE UPDATE ON test_cases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_steps_updated_at
    BEFORE UPDATE ON test_steps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
