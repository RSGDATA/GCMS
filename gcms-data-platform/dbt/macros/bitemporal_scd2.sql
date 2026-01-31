/* ============================================================
   DBT MACRO: bitemporal_scd2
   ============================================================
   
   PURPOSE:
   Reusable macro for implementing bi-temporal SCD Type 2 logic.
   
   TRACKS TWO TIME DIMENSIONS:
   1. Business Time (effective_from/effective_to) - When it happened in reality
   2. System Time (recorded_at) - When the system learned about it
   
   PRINCIPLE:
   - Never overwrites history
   - Always expires old versions
   - Inserts corrected versions cleanly
   - Enables payroll reproducibility and retroactive corrections
   
   PARAMETERS:
   - source_relation: The source table/model to track
   - natural_key: Business key column name (string)
   - tracked_columns: List of columns that define reality
   - effective_date_column: Business effective date (string)
   - recorded_at_column: System knowledge timestamp (string)
   
   USAGE EXAMPLE:
   {{ bitemporal_scd2(
       source_relation=ref('br_supabase_attendance'),
       natural_key='attendance_id',
       tracked_columns=['musician_id', 'rehearsal_id', 'attended'],
       effective_date_column='cast(rehearsal_date as date)',
       recorded_at_column='_airbyte_emitted_at'
   ) }}
   
   ============================================================ */

{% macro bitemporal_scd2(
    source_relation,
    natural_key,
    tracked_columns,
    effective_date_column,
    recorded_at_column
) %}

with source_data as (
    /* --------------------------------------------------------
       SOURCE DATA
       --------------------------------------------------------
       This represents "what the source believes now"
       -------------------------------------------------------- */
    select
        {{ natural_key }} as natural_key,
        {% for col in tracked_columns %}
        {{ col }}{% if not loop.last %},{% endif %}
        {% endfor %},
        {{ effective_date_column }} as effective_from,
        {{ recorded_at_column }} as recorded_at
    from {{ source_relation }}
),

current_versions as (
    /* --------------------------------------------------------
       CURRENT OPEN VERSIONS IN TARGET
       --------------------------------------------------------
       Only look at records marked as current
       -------------------------------------------------------- */
    select *
    from {{ this }}
    where is_current = true
),

detected_changes as (
    /* --------------------------------------------------------
       CHANGE DETECTION
       --------------------------------------------------------
       A change occurs when:
       - Record is new (not in current_versions)
       - OR any tracked column differs
       - OR effective date differs
       -------------------------------------------------------- */
    select
        s.*
    from source_data s
    left join current_versions c
        on s.natural_key = c.natural_key
    where
        c.natural_key is null
        or (
            {% for col in tracked_columns %}
            s.{{ col }} <> c.{{ col }}
            {% if not loop.last %} or {% endif %}
            {% endfor %}
            or s.effective_from <> c.effective_from
        )
),

expired_rows as (
    /* --------------------------------------------------------
       EXPIRE OLD REALITY
       --------------------------------------------------------
       Close out previously believed truth by:
       - Setting effective_to to day before new effective_from
       - Setting is_current to false
       - Updating updated_at timestamp
       -------------------------------------------------------- */
    select
        c.scd_id,
        c.natural_key,
        {% for col in tracked_columns %}
        c.{{ col }},
        {% endfor %}
        c.effective_from,
        dateadd(day, -1, ch.effective_from) as effective_to,
        c.recorded_at,
        c.inserted_at,
        current_timestamp() as updated_at,
        false as is_current
    from current_versions c
    join detected_changes ch
      on c.natural_key = ch.natural_key
),

new_versions as (
    /* --------------------------------------------------------
       INSERT NEW REALITY
       --------------------------------------------------------
       This becomes the new truth going forward:
       - Generate new scd_id
       - Set effective_to to NULL (open-ended)
       - Set is_current to true
       - Record insertion timestamp
       -------------------------------------------------------- */
    select
        {{ dbt_utils.generate_surrogate_key(['natural_key', 'recorded_at']) }} as scd_id,
        natural_key,
        {% for col in tracked_columns %}
        {{ col }},
        {% endfor %}
        effective_from,
        null as effective_to,
        recorded_at,
        current_timestamp() as inserted_at,
        current_timestamp() as updated_at,
        true as is_current
    from detected_changes
)

/* --------------------------------------------------------
   UNION EXPIRED AND NEW VERSIONS
   --------------------------------------------------------
   Return both:
   - Expired versions (closed out old records)
   - New versions (new current truth)
   -------------------------------------------------------- */
select * from expired_rows
union all
select * from new_versions

{% endmacro %}

/* ============================================================
   WHAT THIS MACRO GUARANTEES
   ============================================================
   
   For every table you apply it to, you can ALWAYS answer:
   
   1. What was true in reality on a given date?
      WHERE date BETWEEN effective_from AND COALESCE(effective_to, '9999-12-31')
   
   2. When did the system learn about it?
      WHERE recorded_at <= timestamp
   
   3. What did we believe at payroll time?
      WHERE recorded_at <= payroll_timestamp AND is_current = true
   
   4. What was corrected later?
      WHERE recorded_at > effective_from
   
   5. Can we reproduce historical decisions?
      YES - Query by recorded_at to see system state at any point
   
   THIS IS BI-TEMPORAL SCD TYPE 2.
   THIS IS WHAT REMOVES ADMIN WORK.
   THIS IS OPERATIONAL LEVERAGE.
   
   ============================================================ */
