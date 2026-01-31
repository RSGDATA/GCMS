# Demo Queries - Quick Reference

**Simple, visual queries to run during your demo**

---

## 🎯 Purpose

These queries are designed to be:
- **Simple** - Easy to understand
- **Visual** - Show clear results
- **Impressive** - Demonstrate the power of the system
- **Non-technical** - Musicians can understand them

---

## 📊 Query 1: Who Gets Paid What?

**Purpose:** Show payroll calculations for all musicians

**When to use:** Main demo moment - shows the core value

```sql
SELECT 
    musician_name,
    instrument,
    total_services,
    total_payment
FROM gold.fct_musician_payment
WHERE season_name = 'Fall 2024'
ORDER BY total_payment DESC;
```

**What to say:**
> "Here's exactly what each musician earned this season. The system calculated this automatically based on attendance and contract rates."

**Expected results:**
- Sarah Johnson (Violin) - $375
- Michael Chen (Violin) - $310
- Emily Rodriguez (Viola) - $310
- etc.

---

## 📊 Query 2: Payment Breakdown for One Musician

**Purpose:** Show detailed breakdown of how payment was calculated

**When to use:** To show transparency and detail

```sql
SELECT 
    musician_name,
    season_name,
    rehearsals_attended,
    concerts_performed,
    rehearsal_payment,
    concert_payment,
    total_payment
FROM gold.fct_musician_payment
WHERE musician_name = 'Sarah Johnson'
ORDER BY season_name;
```

**What to say:**
> "Let's look at Sarah's payment in detail. She attended 2 rehearsals at $75 each, and performed in 1 concert at $150. Total: $375. Completely transparent."

---

## 📊 Query 3: Historical View

**Purpose:** Show we keep complete history

**When to use:** To demonstrate the "never lose data" feature

```sql
SELECT 
    musician_name,
    concert_name,
    concert_date,
    attended,
    payment_amount
FROM gold.fct_musician_payment
WHERE musician_name = 'Sarah Johnson'
ORDER BY concert_date DESC;
```

**What to say:**
> "We can see Sarah's entire history - every concert, every payment, going back as far as we need. Nothing is ever lost."

---

## 📊 Query 4: Who Performed in a Concert?

**Purpose:** Show concert participation

**When to use:** To show we track everything

```sql
SELECT 
    musician_name,
    instrument,
    role,
    payment_amount
FROM gold.fct_musician_payment
WHERE concert_name = 'Fall Gala Concert'
ORDER BY role, musician_name;
```

**What to say:**
> "Here's everyone who performed in the Fall Gala. Sarah was concertmaster, everyone else was a performer. The system knows who did what."

---

## 📊 Query 5: Season Summary

**Purpose:** Show aggregate statistics

**When to use:** To show big-picture view

```sql
SELECT 
    season_name,
    COUNT(DISTINCT musician_name) as total_musicians,
    SUM(total_payment) as total_payroll,
    AVG(total_payment) as avg_payment_per_musician
FROM gold.fct_musician_payment
GROUP BY season_name
ORDER BY season_name;
```

**What to say:**
> "Here's the big picture: Fall 2024 season had 10 musicians, total payroll of $X, average payment of $Y per musician."

---

## 📊 Query 6: Attendance Summary

**Purpose:** Show who's most active

**When to use:** To show engagement tracking

```sql
SELECT 
    musician_name,
    instrument,
    total_services,
    rehearsals_attended,
    concerts_performed
FROM gold.fct_musician_payment
WHERE season_name = 'Fall 2024'
ORDER BY total_services DESC;
```

**What to say:**
> "This shows who's been most active this season. Sarah attended 3 services total - 2 rehearsals and 1 concert."

---

## 🎯 Backup Queries (If Needed)

### **Simple Count Query**

```sql
SELECT COUNT(*) as total_musicians
FROM gold.dim_musician
WHERE is_active = true;
```

> "We have 10 active musicians in the system."

### **Concert List**

```sql
SELECT 
    name,
    concert_date,
    venue
FROM gold.dim_concert
ORDER BY concert_date;
```

> "Here are all our concerts this season."

---

## 💡 Tips for Running Queries

### **Before the Demo:**
1. Test each query to make sure it works
2. Know what results to expect
3. Have screenshots as backup

### **During the Demo:**
1. Copy/paste the query (don't type it live)
2. Explain what you're asking BEFORE you run it
3. Point out key results when they appear
4. Keep it brief - don't dwell on details

### **If a Query Fails:**
1. Don't panic!
2. Say: "Let me show you the results from when I ran this earlier"
3. Show screenshot
4. Move on quickly

---

## 📋 Query Checklist

Before the demo, verify:

- [ ] All queries run successfully
- [ ] Results look correct
- [ ] You understand what each query shows
- [ ] You have screenshots of results
- [ ] Snowflake connection is working
- [ ] You can copy/paste queries quickly

---

## 🎬 Suggested Demo Flow

1. **Start with Query 1** - Show the main payroll results
2. **Then Query 2** - Drill into one musician's details
3. **Then Query 3** - Show historical tracking
4. **Optional: Query 4 or 5** - If time permits and audience is engaged
5. **Skip Query 6** - Unless specifically asked about attendance

**Total time:** 3-4 minutes for queries

---

## 🚨 Emergency Backup

If Snowflake is down or queries won't run:

**Option 1:** Show screenshots
> "Here's what it looks like when we run this query..."

**Option 2:** Show Excel export
> "I exported the results earlier, here they are..."

**Option 3:** Describe the results
> "When we run this, we see Sarah earned $375, Michael earned $310..."

**Remember:** The audience cares about WHAT the system does, not HOW you show it.

---

## ✅ Success Criteria

You'll know the queries worked if:

- [ ] Results appear quickly (< 5 seconds)
- [ ] Data looks realistic and correct
- [ ] Audience can understand the results
- [ ] You can explain what they're seeing
- [ ] Questions are about the data, not the query

---

**Keep it simple, keep it visual, keep it moving! 🚀**
