-- Migration: 20261026_add_actual_disbursal_fields.sql
-- Purpose: Add editable actual disbursal amount, date, and remarks to loan applications table
-- Safety: Non-destructive, idempotent, preserves all existing leads and applied amounts.
-- Existing disbursed records remain NULL (Not recorded) until verified by an authorized admin.

-- 1. Ensure loan_applications table has actual_disbursal_amount (nullable decimal/numeric)
SET @dbname = DATABASE();
SET @tablename = "loan_applications";

-- Check and add actual_disbursal_amount
SET @precheck = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                 WHERE TABLE_SCHEMA = @dbname 
                 AND TABLE_NAME = @tablename 
                 AND COLUMN_NAME = 'actual_disbursal_amount');
SET @sql = IF(@precheck = 0, 
              'ALTER TABLE loan_applications ADD COLUMN actual_disbursal_amount DECIMAL(12, 2) DEFAULT NULL AFTER applied_amount;', 
              'SELECT "Column actual_disbursal_amount already exists" AS notice;');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add disbursal_date
SET @precheck_date = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                      WHERE TABLE_SCHEMA = @dbname 
                      AND TABLE_NAME = @tablename 
                      AND COLUMN_NAME = 'disbursal_date');
SET @sql_date = IF(@precheck_date = 0, 
                   'ALTER TABLE loan_applications ADD COLUMN disbursal_date DATE DEFAULT NULL AFTER actual_disbursal_amount;', 
                   'SELECT "Column disbursal_date already exists" AS notice;');
PREPARE stmt_date FROM @sql_date;
EXECUTE stmt_date;
DEALLOCATE PREPARE stmt_date;

-- Check and add disbursal_remarks
SET @precheck_rem = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                     WHERE TABLE_SCHEMA = @dbname 
                     AND TABLE_NAME = @tablename 
                     AND COLUMN_NAME = 'disbursal_remarks');
SET @sql_rem = IF(@precheck_rem = 0, 
                  'ALTER TABLE loan_applications ADD COLUMN disbursal_remarks TEXT DEFAULT NULL AFTER disbursal_date;', 
                  'SELECT "Column disbursal_remarks already exists" AS notice;');
PREPARE stmt_rem FROM @sql_rem;
EXECUTE stmt_rem;
DEALLOCATE PREPARE stmt_rem;

-- Check and add index on status and actual_disbursal_amount for fast CRM reporting
SET @idx_check = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
                  WHERE TABLE_SCHEMA = @dbname 
                  AND TABLE_NAME = @tablename 
                  AND INDEX_NAME = 'idx_status_disbursal');
SET @sql_idx = IF(@idx_check = 0, 
                  'CREATE INDEX idx_status_disbursal ON loan_applications(status, actual_disbursal_amount);', 
                  'SELECT "Index idx_status_disbursal already exists" AS notice;');
PREPARE stmt_idx FROM @sql_idx;
EXECUTE stmt_idx;
DEALLOCATE PREPARE stmt_idx;

-- Verification query
SELECT COUNT(*) AS total_leads_preserved,
       COUNT(actual_disbursal_amount) AS verified_actual_disbursals_count
FROM loan_applications;
