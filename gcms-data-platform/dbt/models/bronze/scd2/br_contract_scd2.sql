/* ============================================================
   BRONZE SCD2 MODEL: br_contract_scd2
   ============================================================
   
   PURPOSE:
   Bi-temporal tracking of contract records.
   
   BUSINESS MEANING:
   - Contracts may be signed late
   - Contracts may be corrected or amended
   - Contract terms apply retroactively to the signed date
   - We must distinguish:
     * When contract was effective (signed_date)
     * When the system learned about it (_airbyte_emitted_at)
   
   USE CASES:
   - Legal defensibility: "What contract was in effect on X date?"
   - Late signatures: "When was this contract actually signed vs recorded?"
   - Audit trail: "What contract changes were made retroactively?"
   
   LAYER: Bronze (Historical Truth)
   SOURCE: br_supabase_contract
   MATERIALIZATION: Incremental (SCD2)
   
   ============================================================ */

{{ config(
    materialized='incremental',
    unique_key='scd_id',
    tags=['bronze', 'scd2', 'contract', 'history', 'legal']
) }}

{% if is_incremental() %}

    {{ bitemporal_scd2(
        source_relation=ref('br_supabase_contract'),
        natural_key='contract_id',
        tracked_columns=['concert_id', 'musician_id', 'signed_date', 'file_url'],
        effective_date_column='signed_date',
        recorded_at_column='_airbyte_emitted_at'
    ) }}

{% else %}

    /* --------------------------------------------------------
       INITIAL LOAD
       --------------------------------------------------------
       On first run, load all current records as open versions
       -------------------------------------------------------- */
    select
        {{ dbt_utils.generate_surrogate_key(['contract_id', '_airbyte_emitted_at']) }} as scd_id,
        contract_id as natural_key,
        concert_id,
        musician_id,
        signed_date,
        file_url,
        signed_date as effective_from,
        null as effective_to,
        _airbyte_emitted_at as recorded_at,
        current_timestamp() as inserted_at,
        current_timestamp() as updated_at,
        true as is_current
    from {{ ref('br_supabase_contract') }}

{% endif %}

/* ============================================================
   EXAMPLE QUERIES
   ============================================================
   
   -- Current contracts
   SELECT * FROM bronze.br_contract_scd2
   WHERE is_current = true;
   
   -- Contracts in effect on Feb 28, 2025
   SELECT * FROM bronze.br_contract_scd2
   WHERE date '2025-02-28' BETWEEN effective_from 
     AND COALESCE(effective_to, date '9999-12-31');
   
   -- Contracts known to the system on March 5, 2025
   SELECT * FROM bronze.br_contract_scd2
   WHERE recorded_at <= timestamp '2025-03-05 12:00:00'
     AND is_current = true;
   
   -- Find late-signed contracts (recorded after effective date)
   SELECT * FROM bronze.br_contract_scd2
   WHERE recorded_at > effective_from;
   
   -- Contract history for a specific musician
   SELECT * FROM bronze.br_contract_scd2
   WHERE musician_id = 'some-musician-id'
   ORDER BY effective_from, recorded_at;
   
   ============================================================ */
