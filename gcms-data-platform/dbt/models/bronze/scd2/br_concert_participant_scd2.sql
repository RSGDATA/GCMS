/* ============================================================
   BRONZE SCD2 MODEL: br_concert_participant_scd2
   ============================================================
   
   PURPOSE:
   Bi-temporal tracking of concert participant pay terms.
   
   BUSINESS MEANING:
   - Pay terms may change
   - Corrections happen after rehearsals
   - Pay must be recomputed as-of payroll time
   - THIS is where admin work normally lives
   
   USE CASES:
   - Payroll reproducibility: "What pay terms did payroll use?"
   - Contract changes: "When did the agreed amount change?"
   - Audit trail: "What was corrected retroactively?"
   
   LAYER: Bronze (Historical Truth)
   SOURCE: br_supabase_concert_participant
   MATERIALIZATION: Incremental (SCD2)
   
   ============================================================ */

{{ config(
    materialized='incremental',
    unique_key='scd_id',
    tags=['bronze', 'scd2', 'concert_participant', 'history', 'payroll']
) }}

{% if is_incremental() %}

    {{ bitemporal_scd2(
        source_relation=ref('br_supabase_concert_participant'),
        natural_key='concert_participant_id',
        tracked_columns=['concert_id', 'musician_id', 'role', 'pay_type', 'agreed_amount'],
        effective_date_column='cast(_airbyte_emitted_at as date)',
        recorded_at_column='_airbyte_emitted_at'
    ) }}

{% else %}

    /* --------------------------------------------------------
       INITIAL LOAD
       --------------------------------------------------------
       On first run, load all current records as open versions
       -------------------------------------------------------- */
    select
        {{ dbt_utils.generate_surrogate_key(['concert_participant_id', '_airbyte_emitted_at']) }} as scd_id,
        concert_participant_id as natural_key,
        concert_id,
        musician_id,
        role,
        pay_type,
        agreed_amount,
        cast(_airbyte_emitted_at as date) as effective_from,
        null as effective_to,
        _airbyte_emitted_at as recorded_at,
        current_timestamp() as inserted_at,
        current_timestamp() as updated_at,
        true as is_current
    from {{ ref('br_supabase_concert_participant') }}

{% endif %}

/* ============================================================
   EXAMPLE QUERIES
   ============================================================
   
   -- Current pay terms
   SELECT * FROM bronze.br_concert_participant_scd2
   WHERE is_current = true;
   
   -- Pay terms as-of payroll run on March 5, 2025
   SELECT * FROM bronze.br_concert_participant_scd2
   WHERE recorded_at <= timestamp '2025-03-05 12:00:00'
     AND is_current = true;
   
   -- Show all pay term changes for a specific concert
   SELECT * FROM bronze.br_concert_participant_scd2
   WHERE concert_id = 'some-concert-id'
   ORDER BY recorded_at;
   
   -- Find retroactive pay corrections
   SELECT * FROM bronze.br_concert_participant_scd2
   WHERE recorded_at > effective_from;
   
   ============================================================ */
