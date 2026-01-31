"""
GCMS Concert Explorer
Interactive demo of the GCMS Data Warehouse
"""

import streamlit as st
import pandas as pd
from utils.snowflake_connector import get_snowflake_connection
from utils.queries import *

# Page configuration
st.set_page_config(
    page_title="GCMS Concert Explorer",
    page_icon="🎵",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
    <style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        text-align: center;
    }
    </style>
""", unsafe_allow_html=True)

# Initialize connection
@st.cache_resource
def init_connection():
    return get_snowflake_connection()

conn = init_connection()

# Header
st.markdown('<div class="main-header">🎵 GCMS Concert Explorer</div>', unsafe_allow_html=True)
st.markdown("### Explore concert data from the GCMS Data Warehouse")
st.markdown("---")

# Sidebar - Concert Selection
st.sidebar.title("🎯 Select Concert")

# Get list of concerts with payment data indicator
@st.cache_data(ttl=600)
def get_concerts():
    query = """
    SELECT 
        c.concert_id,
        c.title,
        c.concert_date,
        c.season_name,
        c.fiscal_year_name,
        COUNT(p.payment_key) as payment_count
    FROM GCMS_DEV.MOVEMENT_II_FINALE.DIM_CONCERT c
    LEFT JOIN GCMS_DEV.MOVEMENT_II_FINALE.FCT_MUSICIAN_PAYMENT p ON c.concert_id = p.concert_id
    GROUP BY c.concert_id, c.title, c.concert_date, c.season_name, c.fiscal_year_name
    ORDER BY c.concert_date DESC
    """
    return pd.read_sql(query, conn)

concerts_df = get_concerts()

if concerts_df.empty:
    st.error("No concerts found in the database. Please run the data pipeline first.")
    st.stop()

# Concert selector
concert_options = concerts_df.apply(
    lambda x: f"{x['TITLE']} ({x['CONCERT_DATE'].strftime('%Y-%m-%d')})", 
    axis=1
)
selected_concert_idx = st.sidebar.selectbox(
    "Choose a concert:",
    range(len(concert_options)),
    format_func=lambda x: concert_options[x]
)

selected_concert = concerts_df.iloc[selected_concert_idx]
concert_id = selected_concert['CONCERT_ID']

# Display selected concert info in sidebar
st.sidebar.markdown("---")
st.sidebar.markdown("### 📋 Concert Details")
st.sidebar.write(f"**Title:** {selected_concert['TITLE']}")
st.sidebar.write(f"**Date:** {selected_concert['CONCERT_DATE'].strftime('%B %d, %Y')}")
st.sidebar.write(f"**Season:** {selected_concert['SEASON_NAME']}")
st.sidebar.write(f"**Fiscal Year:** {selected_concert['FISCAL_YEAR_NAME']}")

# Main content area
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "📊 Overview", 
    "🎼 Program & Pieces", 
    "🎻 Musicians", 
    "📅 Rehearsals & Attendance",
    "💰 Payments & Financials"
])

# TAB 1: Overview
with tab1:
    st.header("Concert Overview")
    
    # Get summary metrics
    @st.cache_data(ttl=600)
    def get_concert_summary(concert_id):
        query = f"""
        SELECT 
            COUNT(DISTINCT musician_id) as total_musicians,
            SUM(gross_amount) as total_cost,
            SUM(net_amount) as total_paid,
            SUM(deductions) as total_deductions,
            AVG(attended_services) as avg_attendance_rate,
            SUM(required_services) as total_required_services
        FROM GCMS_DEV.MOVEMENT_II_FINALE.FCT_MUSICIAN_PAYMENT
        WHERE concert_id = '{concert_id}'
        """
        return pd.read_sql(query, conn)
    
    summary = get_concert_summary(concert_id)
    
    if not summary.empty and summary['TOTAL_MUSICIANS'].iloc[0] is not None:
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("👥 Total Musicians", int(summary['TOTAL_MUSICIANS'].iloc[0] or 0))
        with col2:
            total_cost = summary['TOTAL_COST'].iloc[0] or 0
            st.metric("💵 Total Cost", f"${total_cost:,.2f}")
        with col3:
            total_paid = summary['TOTAL_PAID'].iloc[0] or 0
            st.metric("💰 Total Paid", f"${total_paid:,.2f}")
        with col4:
            deductions = summary['TOTAL_DEDUCTIONS'].iloc[0] or 0
            st.metric("📉 Deductions", f"${deductions:,.2f}")
        
        st.markdown("---")
        
        # Payment distribution chart
        st.subheader("Payment Distribution by Musician")
        
        payment_query = f"""
        SELECT 
            m.full_name as musician,
            m.instrument,
            p.gross_amount,
            p.net_amount,
            p.pay_type
        FROM GCMS_DEV.MOVEMENT_II_FINALE.FCT_MUSICIAN_PAYMENT p
        JOIN GCMS_DEV.MOVEMENT_II_FINALE.DIM_MUSICIAN m ON p.musician_id = m.musician_id
        WHERE p.concert_id = '{concert_id}'
        ORDER BY p.gross_amount DESC
        """
        payment_df = pd.read_sql(payment_query, conn)
        
        if not payment_df.empty:
            st.bar_chart(payment_df.set_index('MUSICIAN')['GROSS_AMOUNT'])
            
            st.markdown("### Detailed Payment Breakdown")
            st.dataframe(
                payment_df.style.format({
                    'GROSS_AMOUNT': '${:,.2f}',
                    'NET_AMOUNT': '${:,.2f}'
                }),
                use_container_width=True
            )
    else:
        st.info("No payment data available for this concert.")

# TAB 2: Program & Pieces
with tab2:
    st.header("Concert Program")
    
    # Add cache clear button
    if st.button("🔄 Refresh Data"):
        st.cache_data.clear()
        st.rerun()
    
    @st.cache_data(ttl=60)  # Reduced cache time to 60 seconds
    def get_concert_pieces(concert_id):
        query = f"""
        SELECT 
            cp.program_order,
            p.title,
            p.composer,
            p.duration_minutes
        FROM GCMS_DEV.MOVEMENT_II_MOVEMENT_II.BR_SUPABASE_CONCERT_PIECE cp
        JOIN GCMS_DEV.MOVEMENT_II_MOVEMENT_II.BR_SUPABASE_PIECE p ON cp.piece_id = p.piece_id
        WHERE cp.concert_id = '{concert_id}'
        ORDER BY cp.program_order
        """
        return pd.read_sql(query, conn)
    
    pieces_df = get_concert_pieces(concert_id)
    
    if not pieces_df.empty:
        st.markdown(f"### {len(pieces_df)} Pieces in Program")
        
        for idx, piece in pieces_df.iterrows():
            st.markdown(f"**{int(piece['PROGRAM_ORDER'])}. {piece['TITLE']}** by {piece['COMPOSER']}")
            if pd.notna(piece.get('DURATION_MINUTES')):
                st.write(f"   Duration: {int(piece['DURATION_MINUTES'])} minutes")
            st.markdown("---")
    else:
        st.info("No program pieces found for this concert.")

# TAB 3: Musicians
with tab3:
    st.header("Musicians")
    
    @st.cache_data(ttl=600)
    def get_concert_musicians(concert_id):
        query = f"""
        SELECT 
            m.*,
            p.pay_type,
            p.gross_amount,
            p.net_amount,
            p.attended_services,
            p.required_services
        FROM GCMS_DEV.MOVEMENT_II_FINALE.FCT_MUSICIAN_PAYMENT p
        JOIN GCMS_DEV.MOVEMENT_II_FINALE.DIM_MUSICIAN m ON p.musician_id = m.musician_id
        WHERE p.concert_id = '{concert_id}'
        """
        return pd.read_sql(query, conn)
    
    musicians_df = get_concert_musicians(concert_id)
    
    if not musicians_df.empty:
        st.markdown(f"### {len(musicians_df)} Musicians Participated")
        st.dataframe(musicians_df, use_container_width=True)
    else:
        st.info("No musician data available for this concert.")

# TAB 4: Rehearsals & Attendance
with tab4:
    st.header("Rehearsals & Attendance")
    
    @st.cache_data(ttl=60)
    def get_concert_rehearsals(concert_id):
        query = f"""
        SELECT 
            r.rehearsal_id,
            r.rehearsal_date,
            r.location,
            r.required,
            r.service_value,
            COUNT(DISTINCT a.musician_id) as total_musicians,
            SUM(CASE WHEN a.attended THEN 1 ELSE 0 END) as attended_count
        FROM GCMS_DEV.MOVEMENT_II_MOVEMENT_II.BR_SUPABASE_REHEARSAL r
        LEFT JOIN GCMS_DEV.MOVEMENT_II_MOVEMENT_II.BR_SUPABASE_ATTENDANCE a 
            ON r.rehearsal_id = a.rehearsal_id
        WHERE r.concert_id = '{concert_id}'
        GROUP BY r.rehearsal_id, r.rehearsal_date, r.location, r.required, r.service_value
        ORDER BY r.rehearsal_date
        """
        return pd.read_sql(query, conn)
    
    rehearsals_df = get_concert_rehearsals(concert_id)
    
    if not rehearsals_df.empty:
        st.markdown(f"### {len(rehearsals_df)} Rehearsals Scheduled")
        
        for idx, rehearsal in rehearsals_df.iterrows():
            attendance_rate = (rehearsal['ATTENDED_COUNT'] / rehearsal['TOTAL_MUSICIANS'] * 100) if rehearsal['TOTAL_MUSICIANS'] > 0 else 0
            
            with st.expander(f"📅 {rehearsal['REHEARSAL_DATE'].strftime('%B %d, %Y at %I:%M %p')} - {rehearsal['LOCATION']}"):
                col1, col2, col3, col4 = st.columns(4)
                
                with col1:
                    st.metric("Required", "Yes" if rehearsal['REQUIRED'] else "No")
                with col2:
                    st.metric("Service Value", f"${rehearsal['SERVICE_VALUE']:.2f}" if rehearsal['SERVICE_VALUE'] else "N/A")
                with col3:
                    st.metric("Total Musicians", int(rehearsal['TOTAL_MUSICIANS']))
                with col4:
                    st.metric("Attendance Rate", f"{attendance_rate:.1f}%")
                
                # Get detailed attendance for this rehearsal
                attendance_query = f"""
                SELECT 
                    m.full_name,
                    m.instrument,
                    a.attended,
                    a.check_in_time
                FROM GCMS_DEV.MOVEMENT_II_MOVEMENT_II.BR_SUPABASE_ATTENDANCE a
                JOIN GCMS_DEV.MOVEMENT_II_FINALE.DIM_MUSICIAN m 
                    ON a.musician_id = m.musician_id
                WHERE a.rehearsal_id = '{rehearsal['REHEARSAL_ID']}'
                ORDER BY m.full_name
                """
                attendance_df = pd.read_sql(attendance_query, conn)
                
                if not attendance_df.empty:
                    st.markdown("#### Attendance Details")
                    # Format the dataframe
                    attendance_df['ATTENDED'] = attendance_df['ATTENDED'].apply(lambda x: '✅ Present' if x else '❌ Absent')
                    attendance_df['CHECK_IN_TIME'] = attendance_df['CHECK_IN_TIME'].apply(
                        lambda x: x.strftime('%I:%M %p') if pd.notna(x) else 'N/A'
                    )
                    st.dataframe(
                        attendance_df[['FULL_NAME', 'INSTRUMENT', 'ATTENDED', 'CHECK_IN_TIME']],
                        use_container_width=True,
                        hide_index=True
                    )
    else:
        st.info("No rehearsal data found for this concert.")

# TAB 5: Payments & Financials
with tab5:
    st.header("Financial Summary")
    
    @st.cache_data(ttl=600)
    def get_payment_summary(concert_id):
        query = f"""
        SELECT 
            pay_type,
            COUNT(*) as musician_count,
            SUM(gross_amount) as total_gross,
            SUM(deductions) as total_deductions,
            SUM(net_amount) as total_net,
            AVG(gross_amount) as avg_gross
        FROM GCMS_DEV.MOVEMENT_II_FINALE.FCT_MUSICIAN_PAYMENT
        WHERE concert_id = '{concert_id}'
        GROUP BY pay_type
        """
        return pd.read_sql(query, conn)
    
    payment_summary = get_payment_summary(concert_id)
    
    if not payment_summary.empty:
        st.markdown("### Payment Type Breakdown")
        
        for idx, row in payment_summary.iterrows():
            with st.expander(f"💵 {row['PAY_TYPE']} ({int(row['MUSICIAN_COUNT'])} musicians)"):
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric("Total Gross", f"${row['TOTAL_GROSS']:,.2f}")
                with col2:
                    st.metric("Total Deductions", f"${row['TOTAL_DEDUCTIONS']:,.2f}")
                with col3:
                    st.metric("Total Net", f"${row['TOTAL_NET']:,.2f}")
                
                st.write(f"**Average per musician:** ${row['AVG_GROSS']:,.2f}")
        
        # Overall totals
        st.markdown("---")
        st.markdown("### Overall Concert Financials")
        
        total_gross = payment_summary['TOTAL_GROSS'].sum()
        total_deductions = payment_summary['TOTAL_DEDUCTIONS'].sum()
        total_net = payment_summary['TOTAL_NET'].sum()
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("💵 Total Gross Amount", f"${total_gross:,.2f}")
        with col2:
            st.metric("📉 Total Deductions", f"${total_deductions:,.2f}")
        with col3:
            st.metric("💰 Total Net Paid", f"${total_net:,.2f}")
    else:
        st.info("No payment data available for this concert.")

# Footer
st.markdown("---")
st.markdown("""
    <div style='text-align: center; color: #666;'>
        <p>GCMS Data Platform | Powered by Snowflake, dbt, and Streamlit</p>
        <p>Data refreshed daily via automated Airflow pipeline</p>
    </div>
""", unsafe_allow_html=True)
