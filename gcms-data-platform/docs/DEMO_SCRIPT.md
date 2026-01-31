# GCMS Data Platform - Demo Script

**5-10 Minute Demo for Non-Technical Musicians**

---

## 🎯 Demo Goal

Show musicians how the new system makes payroll **automatic, accurate, and transparent** - without overwhelming them with technical details.

---

## 📋 Pre-Demo Checklist

- [ ] Sample data loaded in Supabase
- [ ] dbt models run successfully
- [ ] Snowflake has data in Gold layer
- [ ] Screenshots ready as backup
- [ ] Airflow UI accessible (localhost:8080)
- [ ] Snowflake UI accessible
- [ ] Practice run completed

---

## 🎬 Demo Script (5-10 minutes)

### **OPENING (1 minute)** - Set the Stage

**What to say:**

> "Hi everyone! I want to show you something that's going to make all of our lives easier. You know how payroll used to take hours of manual work, and sometimes there were mistakes? Well, we've built something that changes all of that."

**Show:** Old spreadsheet (if you have one) or just describe the pain

> "Before, someone had to manually look at who attended rehearsals, who performed in concerts, calculate different rates for different musicians, and hope they didn't make any mistakes. It took 5-10 hours every payroll cycle."

**Pause for effect**

> "Now watch this..."

---

### **ACT 1 (2-3 minutes)** - Show the Data

**What to say:**

> "Let me show you the data we're working with. This is real information about our musicians, concerts, and attendance."

**Screen 1: Supabase (Optional - can skip if too technical)**

Navigate to: https://supabase.com/dashboard/project/stttpmepakavlubbsqaq

> "Here's our database where all the information lives. We have:"
> - "10 musicians - Sarah, Michael, Emily, and others"
> - "4 concerts this season"
> - "Attendance records from rehearsals"

**Keep it brief - don't dwell here**

---

### **ACT 2 (3-4 minutes)** - The Magic Happens

**What to say:**

> "Now here's where it gets cool. Every night at 1 AM, the system automatically:"
> 1. "Pulls all the attendance data"
> 2. "Calculates what each musician should be paid"
> 3. "Checks everything for errors"
> 4. "Has the results ready by morning"

**Screen 2: Airflow UI** (localhost:8080)

Show the DAG (don't explain what a DAG is):

> "This is our automation system. See these green boxes? Each one is a step that ran successfully last night."

**Point to the dbt_run_models DAG**

> "This one calculates all the payroll. It runs automatically every night."

**If you want to be bold, trigger it live:**
- Click "Trigger DAG"
- Watch it run (takes 2-5 minutes)
- Or show a screenshot of a successful run

> "And that's it. No manual work. No spreadsheets. No mistakes."

---

### **ACT 3 (2-3 minutes)** - Show the Results

**What to say:**

> "Now let me show you the results - this is what matters to you as musicians."

**Screen 3: Snowflake**

Open Snowflake and run this query:

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

**What to say while it runs:**

> "This is our data warehouse - think of it like a super-powered calculator that can handle millions of records."

**When results appear:**

> "Look at this! Here's exactly what each musician earned this season:"
> - "Sarah Johnson (Violin) - attended 2 rehearsals, 1 concert - earned $375"
> - "Michael Chen (Violin) - same attendance - earned $310"
> - "And so on..."

**Point out the key benefits:**

> "Notice a few things:"
> 1. "It's completely transparent - you can see exactly how your payment was calculated"
> 2. "Different musicians have different rates based on their role (principal, section leader, regular)"
> 3. "The system tracks everything automatically"

---

### **ACT 4 (1-2 minutes)** - The History Feature

**What to say:**

> "Here's something really powerful - we never lose history."

**Run this query:**

```sql
SELECT 
    musician_name,
    concert_name,
    attended,
    payment_amount,
    calculated_date
FROM gold.fct_musician_payment
WHERE musician_name = 'Sarah Johnson'
ORDER BY calculated_date DESC;
```

**What to say:**

> "See this? We can answer questions like:"
> - "'What did Sarah earn last season?'"
> - "'How many concerts did she perform in?'"
> - "'When was she paid?'"

> "And if we ever need to fix a mistake - like if someone's attendance was marked wrong - we can correct it WITHOUT losing the original record. The system tracks both what happened AND when we learned about it."

**This is the "wow" moment - pause to let it sink in**

---

### **CLOSING (1 minute)** - What This Means for You

**What to say:**

> "So what does this mean for you as musicians?"

**List the benefits:**

1. **"Faster Payments"**
   > "Payroll that used to take 10 hours now takes 1 hour. You get paid faster."

2. **"Accurate Payments"**
   > "No more calculation errors. The system does the math perfectly every time."

3. **"Transparency"**
   > "You can see exactly how your payment was calculated. No mysteries."

4. **"Fair Treatment"**
   > "Everyone is treated consistently. Same rules for everyone."

5. **"Less Stress for Staff"**
   > "Our staff can focus on music, not spreadsheets."

**Final statement:**

> "This system is already built and tested. We're rolling it out next month. Any questions?"

---

## 💬 Handling Questions

### **Q: "Will this replace people?"**

**A:** "No! This replaces tedious spreadsheet work. Our staff will have more time to focus on what matters - supporting you and making great music."

### **Q: "What if there's a mistake?"**

**A:** "Great question! The system has 50+ automatic checks to catch errors. And if something does slip through, we can fix it easily because we keep complete history."

### **Q: "Can I see my own payment history?"**

**A:** "Yes! We're building a portal where you can log in and see your attendance, performances, and payments. Coming soon."

### **Q: "What if I have a question about my payment?"**

**A:** "Same as always - contact the office. But now they can answer your question in seconds instead of hours, because all the data is right there."

### **Q: "How much did this cost?"**

**A:** "The technology costs about $X per month (fill in actual cost). But it saves us 10+ hours per payroll cycle, which pays for itself many times over. Plus, it eliminates costly errors."

### **Q: "What if the system goes down?"**

**A:** "We have backups and redundancy. The system runs automatically every night, so even if something fails, we catch it immediately and fix it before payroll is due."

---

## 🎯 Key Messages to Emphasize

1. **"Automatic"** - No more manual work
2. **"Accurate"** - Zero calculation errors
3. **"Transparent"** - You can see everything
4. **"Fast"** - Get paid faster
5. **"Fair"** - Consistent treatment for everyone

---

## 🚨 If Technical Issues Occur

**Don't panic!** Have these backup options ready:

### **Option 1: Use Screenshots**

> "Let me show you what it looks like when it runs..." (show screenshots)

### **Option 2: Focus on Results**

> "The system ran last night. Here are the results..." (show pre-run query results)

### **Option 3: Tell the Story**

> "Let me walk you through what happens..." (describe the process without showing screens)

**Remember:** They care about the OUTCOME, not the PROCESS. If tech fails, focus on benefits.

---

## 📸 Screenshots to Have Ready

1. **Airflow DAG - Successful Run** (all green boxes)
2. **Snowflake Query Results** (musician payments)
3. **Sample Payment Breakdown** (one musician's details)
4. **Historical Data** (showing we keep history)

---

## 🎤 Presentation Tips

### **Do:**
- ✅ Speak slowly and clearly
- ✅ Use simple language (avoid: "ETL", "pipeline", "schema")
- ✅ Focus on benefits, not features
- ✅ Tell stories ("Sarah the violinist...")
- ✅ Pause for questions
- ✅ Show enthusiasm!

### **Don't:**
- ❌ Use technical jargon
- ❌ Explain how it works under the hood
- ❌ Apologize for technical issues
- ❌ Rush through it
- ❌ Assume they understand tech terms

---

## ⏱️ Timing Guide

- **Opening:** 1 minute
- **Show Data:** 2 minutes
- **Show Automation:** 3 minutes
- **Show Results:** 2 minutes
- **Closing:** 1 minute
- **Questions:** 2-3 minutes

**Total:** 9-12 minutes (perfect for 10-minute slot)

---

## ✅ Success Criteria

You'll know the demo was successful if:

- [ ] Musicians understand it makes payroll automatic
- [ ] They see it benefits them (faster, accurate payments)
- [ ] They're excited, not scared
- [ ] Questions are about "when" not "why"
- [ ] You get positive feedback

---

## 🎯 One-Sentence Summary

**If you only have 30 seconds:**

> "We built a system that automatically calculates payroll every night with zero errors, so you get paid faster and more accurately, and our staff can focus on music instead of spreadsheets."

---

**Good luck! You've got this! 🎉**

Remember: They're musicians, not engineers. Keep it simple, focus on benefits, and show your enthusiasm. The system is amazing - let that shine through!
