# How the Calendar Gets Its Data

## Overview

The calendar page automatically displays all concerts from the centralized `concertData.ts` file. When you add a concert to `concertData.ts`, it automatically appears in the calendar - no additional configuration needed!

## Data Flow Diagram

```
concertData.ts (SINGLE SOURCE)
       ↓
       ├─→ Calendar Page (displays all concerts)
       ├─→ Concerts List Page (displays all concerts)
       ├─→ Homepage Carousel (displays next 3 concerts)
       └─→ Individual Concert Pages (via routing)
```

## Step-by-Step Data Flow

### 1. **Data Source** (`src/lib/concertData.ts`)

All concert data is stored in ONE place:

```typescript
export const concertData: Concert[] = [
  {
    id: 'echoes-through-time-dec',
    title: 'Echoes Through Time',
    description: '...',
    date: utcToCentralTime('2025-12-21T01:30:00Z'),
    venue: 'Greenville Municipal Auditorium',
    ticket_price: 45,
    available_seats: 200,
    image_url: '/ABCD_Banner.png',
    performer: 'GCMS Musician\'s Collective',
    type: 'special'
  },
  // ... more concerts
]
```

### 2. **Calendar Imports the Data** (`src/app/calendar/page.tsx`)

```typescript
import { concertData, getConcertsForDate, getConcertRoute } from '@/lib/concertData'
```

The calendar imports:
- `concertData` - The full array of all concerts
- `getConcertsForDate()` - Helper function to find concerts on a specific date
- `getConcertRoute()` - Helper function to get the URL for a concert

### 3. **Calendar Loads the Data**

```typescript
const fetchConcerts = async () => {
  try {
    // Use centralized concert data
    setConcerts(concertData)  // ← Loads ALL concerts
  } catch (error) {
    console.error('Error:', error)
    setConcerts([])
  } finally {
    setLoading(false)
  }
}
```

**Key Point**: The calendar simply uses `concertData` directly. No API calls, no database queries - just imports the array!

### 4. **Calendar Displays Concerts by Date**

```typescript
const getEventsForDate = (date: Date): CalendarEvent[] => {
  return concerts
    .filter(concert => {
      const concertDate = new Date(concert.date)
      return concertDate.toDateString() === date.toDateString()
    })
    .map(concert => ({
      ...concert,
      date: new Date(concert.date)
    }))
}
```

For each day in the calendar:
1. Check if any concerts match that date
2. Display concert title on that day
3. Show event details when clicked

### 5. **Calendar Links to Concert Pages**

```typescript
const handleViewConcert = (concertId: string) => {
  // Use centralized routing logic
  const concertType = getConcertRoute(concertId)  // ← Gets route from mapping
  
  // Navigate to concert page
  const targetUrl = getNavigationPath(`/concerts/${concertType}`)
  window.location.href = targetUrl
}
```

When you click a concert:
1. Gets the concert ID (e.g., `'echoes-through-time-dec'`)
2. Looks up the route in `getConcertRoute()` (e.g., `'test-concert-with-soloists'`)
3. Navigates to `/concerts/test-concert-with-soloists`

## How to Add a Concert to the Calendar

### Step 1: Add Concert Data

**File**: `src/lib/concertData.ts`

```typescript
export const concertData: Concert[] = [
  // ... existing concerts ...
  {
    id: 'my-new-concert-jan',
    title: 'My New Concert',
    description: 'An amazing concert...',
    date: utcToCentralTime('2026-01-15T01:30:00Z'), // Jan 14, 7:30 PM Central
    venue: 'Greenville Municipal Auditorium',
    ticket_price: 40,
    available_seats: 150,
    image_url: '/my-concert.png',
    performer: 'GCMS Musician\'s Collective',
    type: 'chamber'
  }
]
```

### Step 2: Add Route Mapping

**Same File**: `src/lib/concertData.ts`

```typescript
export const getConcertRoute = (concertId: string): string => {
  const routeMap: { [key: string]: string } = {
    // ... existing routes ...
    'my-new-concert-jan': 'my-new-concert'  // ← Add this line
  }
  
  return routeMap[concertId] || 'NightAtTheMovies'
}
```

### Step 3: That's It!

The concert now automatically appears:
- ✅ On the calendar on January 14th
- ✅ In the "All Upcoming Events" list
- ✅ In the concerts page
- ✅ In the homepage carousel (if it's one of the next 3)

## Key Features

### Automatic Date Handling

The calendar automatically:
- Converts UTC dates to Central Time
- Groups concerts by date
- Displays concerts on the correct calendar day
- Shows time in the event details

### Visual Indicators

- **Today's Date**: Highlighted in amber
- **Days with Events**: Blue background
- **Event Count**: Shows "+X more" if multiple events on one day

### Interactive Features

1. **Click a Date**: See all events for that day in the sidebar
2. **Click "Learn More"**: Navigate to the concert page
3. **Navigate Months**: Use arrows to browse different months
4. **View All**: Link to full concerts list at the bottom

## Important Notes

### Date Format

Dates in `concertData.ts` are in UTC and converted to Central Time:

```typescript
// For 7:30 PM Central on Dec 20, 2025:
date: utcToCentralTime('2025-12-21T01:30:00Z')
//                      ↑ Next day in UTC because Central is behind
```

### Concert ID

The `id` field must be unique and match the key in `getConcertRoute()`:

```typescript
// In concertData array:
id: 'echoes-through-time-dec'

// In getConcertRoute mapping:
'echoes-through-time-dec': 'test-concert-with-soloists'
```

### Image Path

Images are automatically processed with `getImagePath()`:

```typescript
image_url: '/my-concert.png'  // File in /public folder
```

## Troubleshooting

### Concert Not Showing on Calendar

**Check**:
1. Is the concert in `concertData` array?
2. Is the date in the future?
3. Is the date format correct (UTC)?

### Clicking Concert Goes to Wrong Page

**Check**:
1. Does the concert ID have a route mapping in `getConcertRoute()`?
2. Does the route match an actual concert page folder?

### Concert Shows on Wrong Date

**Check**:
1. UTC to Central Time conversion
2. Remember: Central Time is UTC-6 (or UTC-5 during DST)
3. For evening concerts, use next day in UTC

## Summary

**Single Source of Truth**: `concertData.ts`

**Automatic Updates**: Add concert → Appears everywhere

**No Extra Configuration**: Calendar reads directly from `concertData`

**Centralized Routing**: One mapping controls all navigation

The calendar is fully automated - just add concerts to `concertData.ts` and they appear automatically!
