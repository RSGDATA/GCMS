/* ============================================================
   BRONZE SCD2 MODEL: br_attendance_scd2
   ============================================================
   
   PURPOSE:
   Bi-temporal tracking of attendance records.
   
   BUSINESS MEANING:
   - Attendance may be recorded late
   - Attendance may be corrected after the fact
   - We must distinguish:
     * When attendance happened in reality (rehearsal_date)
     * When the system learned about it (_airbyte_emitted_at)
   
   USE CASES:
   - Payroll reproducibility: "What did payroll see on March 5?"
   - Retroactive corrections: "What was corrected after the fact?"
   - Historical reconstruction: "What was true on Feb 28?"
   
   LAYER: Bronze (Historical Truth)
   SOURCE: br_supabase_attendance
   MATERIALIZATION: Incremental (SCD2)
   
   ============================================================ */

{{ config(
    materialized='incremental',
    unique_key='scd_id',
    tags=['bronze', 'scd2', 'attendance', 'history']
) }}

{% if is_incremental() %}

    {{ bitemporal_scd2(
        source_relation=ref('br_supabase_attendance'),
        natural_key='attendance_id',
        tracked_columns=['musician_id', 'rehearsal_id', 'concert_id', 'attended', 'check_in_time'],
        effective_date_column='cast(check_in_time as date)',
        recorded_at_column='_airbyte_emitted_at'
    ) }}

{% else %}

    /* --------------------------------------------------------
       INITIAL LOAD
       --------------------------------------------------------
       On first run, load all current records as open versions
       -------------------------------------------------------- */
    select
        {{ dbt_utils.generate_surrogate_key(['attendance_id', '_airbyte_emitted_at']) }} as scd_id,
        attendance_id as natural_key,
        musician_id,
        rehearsal_id,
        concert_id,
        attended,
        check_in_time,
        cast(check_in_time as date) as effective_from,
        null as effective_to,
        _airbyte_emitted_at as recorded_at,
        current_timestamp() as inserted_at,
        current_timestamp() as updated_at,
        true as is_current
    from {{ ref('br_supabase_attendance') }}

{% endif %}

/* ============================================================
   EXAMPLE QUERIES
   ============================================================
   
   -- Current state (what we believe now)
   SELECT * FROM bronze.br_attendance_scd2
   WHERE is_current = true;
   
   -- What was true on Feb 28, 2025?
   SELECT * FROM bronze.br_attendance_scd2
   WHERE date '2025-02-28' BETWEEN effective_from 
     AND COALESCE(effective_to, date '9999-12-31');
   
   -- What did payroll see on March 5, 2025?
   SELECT * FROM bronze.br_attendance_scd2
   WHERE recorded_at <= timestamp '2025-03-05 12:00:00'
     AND is_current = true;
   
   -- Show all corrections (learned after the fact)
   SELECT * FROM bronze.br_attendance_scd2
   WHERE recorded_at > effective_from;
   
   ============================================================ */
