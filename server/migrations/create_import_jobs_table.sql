-- Create import_jobs table for tracking data import operations
DROP TABLE IF EXISTS import_jobs CASCADE;
CREATE TABLE IF NOT EXISTS import_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    estimated_records INTEGER NOT NULL DEFAULT 0,
    records_processed INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'processing',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Foreign key constraint (assuming users table exists)
    CONSTRAINT fk_import_jobs_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    -- Check constraints
    CONSTRAINT chk_import_jobs_status 
        CHECK (status IN ('processing', 'completed', 'error', 'cancelled')),
    
    CONSTRAINT chk_import_jobs_file_size 
        CHECK (file_size > 0),
    
    CONSTRAINT chk_import_jobs_records 
        CHECK (estimated_records >= 0 AND records_processed >= 0)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_import_jobs_user_id ON import_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_import_jobs_status ON import_jobs(status);
CREATE INDEX IF NOT EXISTS idx_import_jobs_created_at ON import_jobs(created_at DESC);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_import_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_import_jobs_updated_at
    BEFORE UPDATE ON import_jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_import_jobs_updated_at();

-- Add comments for documentation
COMMENT ON TABLE import_jobs IS 'Tracks AdaLove 1.0 data import operations';
COMMENT ON COLUMN import_jobs.id IS 'Unique identifier for the import job';
COMMENT ON COLUMN import_jobs.user_id IS 'ID of the user who initiated the import';
COMMENT ON COLUMN import_jobs.filename IS 'Original filename of the uploaded file';
COMMENT ON COLUMN import_jobs.file_size IS 'Size of the uploaded file in bytes';
COMMENT ON COLUMN import_jobs.estimated_records IS 'Estimated number of records to process';
COMMENT ON COLUMN import_jobs.records_processed IS 'Number of records actually processed';
COMMENT ON COLUMN import_jobs.status IS 'Current status of the import job';
COMMENT ON COLUMN import_jobs.error_message IS 'Error message if import failed';
COMMENT ON COLUMN import_jobs.created_at IS 'Timestamp when the import job was created';
COMMENT ON COLUMN import_jobs.updated_at IS 'Timestamp when the import job was last updated';
