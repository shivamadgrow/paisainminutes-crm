-- =====================================================================
-- Paisa in Minutes CRM - Database Reset & Backup Script
-- =====================================================================
-- Description:
--   1. Creates timestamped backup tables for test data QA restoration.
--   2. Clears all lead, application, disbursal, collection, and audit data.
--   3. Resets table auto-increment primary key sequences back to 1.
--   4. PRESERVES user accounts, staff roles, and static CRM settings.
-- =====================================================================

-- Step 1: Create Backup Snapshot Tables (Timestamped)
CREATE TABLE IF NOT EXISTS backup_leads_20260821 AS SELECT * FROM leads;
CREATE TABLE IF NOT EXISTS backup_applications_20260821 AS SELECT * FROM applications;
CREATE TABLE IF NOT EXISTS backup_disbursals_20260821 AS SELECT * FROM disbursals;
CREATE TABLE IF NOT EXISTS backup_collections_20260821 AS SELECT * FROM collections;
CREATE TABLE IF NOT EXISTS backup_activity_logs_20260821 AS SELECT * FROM activity_logs;

-- Step 2: Disable Foreign Key Checks temporarily during reset
SET FOREIGN_KEY_CHECKS = 0;

-- Step 3: Clear Data Tables & Reset Auto-Increment Sequences to 1
TRUNCATE TABLE leads;
ALTER TABLE leads AUTO_INCREMENT = 1;

TRUNCATE TABLE applications;
ALTER TABLE applications AUTO_INCREMENT = 1;

TRUNCATE TABLE disbursals;
ALTER TABLE disbursals AUTO_INCREMENT = 1;

TRUNCATE TABLE collections;
ALTER TABLE collections AUTO_INCREMENT = 1;

TRUNCATE TABLE activity_logs;
ALTER TABLE activity_logs AUTO_INCREMENT = 1;

TRUNCATE TABLE notifications;
ALTER TABLE notifications AUTO_INCREMENT = 1;

-- Step 4: Re-enable Foreign Key Checks
SET FOREIGN_KEY_CHECKS = 1;

-- Confirmation Log
SELECT 'CRM Database successfully reset to zero state. User accounts & settings preserved.' AS status;
