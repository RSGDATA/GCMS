"""
SQL Queries for the GCMS Concert Explorer
Centralized query definitions
"""

# Concert queries
GET_ALL_CONCERTS = """
SELECT 
    concert_id,
    title,
    concert_date,
    season_name,
    fiscal_year_name,
    venue,
    notes
FROM GCMS_DEV.MOVEMENT_II_FINALE.DIM_CONCERT
ORDER BY concert_date DESC
"""

def get_concert_summary_query(concert_id):
    return f"""
    SELECT 
        COUNT(DISTINCT musician_id) as total_musicians,
        SUM(gross_amount) as total_cost,
        SUM(net_amount) as total_paid,
        SUM(deductions) as total_deductions,
        AVG(attended_services) as avg_attendance_rate,
        SUM(required_services) as total_required_services
    FROM GCMS_DEV.MOVEMENT_II_FINALE.FCT_MUSICIAN_PAYMENT
    WHERE concert_id = {concert_id}
    """

def get_concert_pieces_query(concert_id):
    return f"""
    SELECT 
        cp.concert_piece_id,
        p.title as piece_title,
        p.composer,
        cp.order_number,
        cp.program_notes
    FROM GCMS_DEV.MOVEMENT_I.CONCERT_PIECE cp
    JOIN GCMS_DEV.MOVEMENT_I.PIECE p ON cp.piece_id = p.piece_id
    WHERE cp.concert_id = {concert_id}
    ORDER BY cp.order_number
    """

def get_concert_musicians_query(concert_id):
    return f"""
    SELECT 
        m.musician_id,
        m.full_name,
        m.instrument,
        m.section,
        m.union_member,
        p.pay_type,
        p.gross_amount,
        p.net_amount,
        p.deductions,
        p.attended_services,
        p.required_services
    FROM GCMS_DEV.MOVEMENT_II_FINALE.FCT_MUSICIAN_PAYMENT p
    JOIN GCMS_DEV.MOVEMENT_II_FINALE.DIM_MUSICIAN m ON p.musician_id = m.musician_id
    WHERE p.concert_id = {concert_id}
    ORDER BY m.section, m.instrument, m.full_name
    """

def get_rehearsals_query(concert_id):
    return f"""
    SELECT 
        rehearsal_id,
        rehearsal_date,
        required,
        service_value,
        notes
    FROM GCMS_DEV.MOVEMENT_I.REHEARSAL
    WHERE concert_id = {concert_id}
    ORDER BY rehearsal_date
    """

def get_attendance_query(concert_id):
    return f"""
    SELECT 
        m.full_name as musician,
        m.instrument,
        COUNT(CASE WHEN a.attended THEN 1 END) as attended_count,
        COUNT(*) as total_rehearsals,
        ROUND(COUNT(CASE WHEN a.attended THEN 1 END) * 100.0 / COUNT(*), 1) as attendance_rate
    FROM GCMS_DEV.MOVEMENT_I.ATTENDANCE a
    JOIN GCMS_DEV.MOVEMENT_I.REHEARSAL r ON a.rehearsal_id = r.rehearsal_id
    JOIN GCMS_DEV.MOVEMENT_I.MUSICIAN m ON a.musician_id = m.musician_id
    WHERE r.concert_id = {concert_id}
    GROUP BY m.full_name, m.instrument
    ORDER BY attendance_rate DESC, m.full_name
    """

def get_payment_summary_query(concert_id):
    return f"""
    SELECT 
        pay_type,
        COUNT(*) as musician_count,
        SUM(gross_amount) as total_gross,
        SUM(deductions) as total_deductions,
        SUM(net_amount) as total_net,
        AVG(gross_amount) as avg_gross,
        MIN(gross_amount) as min_gross,
        MAX(gross_amount) as max_gross
    FROM GCMS_DEV.MOVEMENT_II_FINALE.FCT_MUSICIAN_PAYMENT
    WHERE concert_id = {concert_id}
    GROUP BY pay_type
    ORDER BY total_gross DESC
    """

def get_payment_distribution_query(concert_id):
    return f"""
    SELECT 
        m.full_name as musician,
        m.instrument,
        m.section,
        p.gross_amount,
        p.net_amount,
        p.pay_type
    FROM GCMS_DEV.MOVEMENT_II_FINALE.FCT_MUSICIAN_PAYMENT p
    JOIN GCMS_DEV.MOVEMENT_II_FINALE.DIM_MUSICIAN m ON p.musician_id = m.musician_id
    WHERE p.concert_id = {concert_id}
    ORDER BY p.gross_amount DESC
    """
