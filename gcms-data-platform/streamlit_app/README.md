# 🎵 GCMS Concert Explorer

Interactive Streamlit application for exploring concert data from the GCMS Data Warehouse.

## 🎯 Features

### Hierarchical Concert Exploration
- **Concert Selection**: Choose from all concerts in the database
- **Overview Dashboard**: High-level metrics and visualizations
- **Program Details**: View pieces performed with program notes
- **Musician Information**: Detailed musician data by section
- **Rehearsal Tracking**: Attendance and scheduling information
- **Financial Analysis**: Payment breakdowns and cost analysis

### Interactive Drill-Down
Starting from a concert, drill down into:
- 🎼 **Pieces** → Composers, program notes
- 🎻 **Musicians** → Instruments, sections, payments
- 📅 **Rehearsals** → Schedules, attendance rates
- 💰 **Payments** → Financial summaries, cost distribution

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Access to Snowflake GCMS_DEV database
- Snowflake private key file

### Installation

1. **Install dependencies:**
```bash
cd streamlit_app
pip install -r requirements.txt
```

2. **Configure Snowflake credentials:**

**Option A: Using Streamlit Secrets (Recommended)**
```bash
cp .streamlit/secrets.toml.example .streamlit/secrets.toml
```

Edit `.streamlit/secrets.toml`:
```toml
[snowflake]
user = "your_snowflake_user"
account = "your_snowflake_account"
warehouse = "TRANSFORMING"
database = "GCMS_DEV"
schema = "MOVEMENT_II_FINALE"
role = "ACCOUNTADMIN"
```

**Option B: Using Environment Variables**
```bash
export SNOWFLAKE_USER="your_user"
export SNOWFLAKE_ACCOUNT="your_account"
export SNOWFLAKE_PRIVATE_KEY_PATH="/path/to/snowflake_key.p8"
export SNOWFLAKE_WAREHOUSE="TRANSFORMING"
export SNOWFLAKE_DATABASE="GCMS_DEV"
export SNOWFLAKE_SCHEMA="MOVEMENT_II_FINALE"
export SNOWFLAKE_ROLE="ACCOUNTADMIN"
```

3. **Run the app:**
```bash
streamlit run app.py
```

The app will open in your browser at `http://localhost:8501`

## 📊 App Structure

```
streamlit_app/
├── app.py                          # Main application
├── requirements.txt                # Python dependencies
├── README.md                       # This file
├── .streamlit/
│   ├── config.toml                # Streamlit configuration
│   └── secrets.toml.example       # Secrets template
└── utils/
    ├── __init__.py
    ├── snowflake_connector.py     # Database connection
    └── queries.py                 # SQL queries
```

## 🎨 User Interface

### Sidebar
- **Concert Selector**: Dropdown to choose concert
- **Concert Details**: Quick info about selected concert

### Main Tabs

**1. 📊 Overview**
- Total musicians, costs, payments
- Payment distribution chart
- Detailed payment breakdown table

**2. 🎼 Program & Pieces**
- List of pieces performed
- Composer information
- Program notes (expandable)

**3. 🎻 Musicians**
- Musicians grouped by section
- Instrument, union status
- Payment and attendance details

**4. 📅 Rehearsals & Attendance**
- Rehearsal schedule
- Required vs optional services
- Individual attendance rates

**5. 💰 Payments & Financials**
- Payment type breakdown
- Per-service vs lump-sum
- Overall financial summary

## 🔧 Configuration

### Streamlit Settings
Edit `.streamlit/config.toml` to customize:
- Theme colors
- Server port
- CORS settings

### Database Connection
The app connects to:
- **Database**: `GCMS_DEV`
- **Schemas**: 
  - `MOVEMENT_I` (raw data)
  - `MOVEMENT_II_FINALE` (star schema)
- **Warehouse**: `TRANSFORMING`

## 📝 Data Requirements

The app expects the following tables to exist:

**Star Schema (MOVEMENT_II_FINALE):**
- `DIM_CONCERT` - Concert dimension
- `DIM_MUSICIAN` - Musician dimension
- `FCT_MUSICIAN_PAYMENT` - Payment facts

**Raw Data (MOVEMENT_I):**
- `CONCERT_PIECE` - Concert-piece relationships
- `PIECE` - Musical pieces
- `REHEARSAL` - Rehearsal schedule
- `ATTENDANCE` - Attendance records
- `MUSICIAN` - Musician details

## 🎯 Demo Workflow

1. **Select a Concert** from the sidebar dropdown
2. **View Overview** to see high-level metrics
3. **Explore Program** to see what pieces were performed
4. **Check Musicians** to see who participated
5. **Review Rehearsals** to see preparation details
6. **Analyze Payments** to understand costs

## 🐛 Troubleshooting

### Connection Issues
```
Error: Failed to connect to Snowflake
```
**Solution**: Check your credentials in `.streamlit/secrets.toml` or environment variables

### No Data Displayed
```
No concerts found in the database
```
**Solution**: Run the data pipeline first:
```bash
docker exec gcms-airflow-worker airflow dags trigger manual_pipeline_simple
```

### Import Errors
```
ModuleNotFoundError: No module named 'streamlit'
```
**Solution**: Install dependencies:
```bash
pip install -r requirements.txt
```

## 🚀 Deployment

### Local Development
```bash
streamlit run app.py
```

### Production Deployment

**Streamlit Cloud:**
1. Push code to GitHub
2. Connect repository to Streamlit Cloud
3. Add secrets in Streamlit Cloud dashboard
4. Deploy!

**Docker:**
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8501
CMD ["streamlit", "run", "app.py"]
```

## 📚 Additional Resources

- [Streamlit Documentation](https://docs.streamlit.io)
- [Snowflake Python Connector](https://docs.snowflake.com/en/user-guide/python-connector.html)
- [GCMS Data Platform Documentation](../README.md)

## 🎉 Features Showcase

### What Makes This Demo Special:

✅ **Real-time Data** - Connects directly to Snowflake  
✅ **Interactive Exploration** - Drill down from concerts to any detail  
✅ **Beautiful Visualizations** - Charts and formatted tables  
✅ **Production-Ready** - Uses actual star schema from data warehouse  
✅ **Fast Performance** - Cached queries for quick response  

### Perfect For:

- 📊 **Executive Presentations** - Show data warehouse capabilities
- 🎯 **Stakeholder Demos** - Interactive data exploration
- 💼 **Business Reviews** - Financial and operational insights
- 🎓 **Training** - Teach users how to explore data

## 🔐 Security Notes

- **Never commit** `.streamlit/secrets.toml` to git
- **Use environment variables** in production
- **Rotate credentials** regularly
- **Limit database permissions** to read-only for the app

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the main project README
3. Check Streamlit logs for error details

---

**Built with ❤️ for the GCMS Data Platform**  
*Powered by Streamlit, Snowflake, and dbt*
