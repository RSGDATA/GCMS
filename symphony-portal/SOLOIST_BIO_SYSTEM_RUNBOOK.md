# Soloist Bio System - Runbook

## Quick Reference

This runbook provides step-by-step instructions for common tasks with the Soloist Bio System.

---

## Task 1: Add a New Soloist

### Step 1: Add Soloist Data

**File**: `src/lib/soloistBioPageMaker.tsx`

Add a new entry to the `soloistBioData` object:

```typescript
export const soloistBioData = {
  // ... existing soloists ...
  
  'new-soloist-slug': {
    name: 'Soloist Full Name',
    instrument: 'Primary Instrument',
    image: getImagePath('/soloist-photo.jpg'),
    bio: [
      'First paragraph - opening statement about the artist',
      'Second paragraph - background and training',
      'Third paragraph - current work and achievements'
    ],
    achievements: [
      'Major Award or Recognition',
      'Notable Performance Venue',
      'Recording Label or Album',
      'Teaching Position',
      'Competition Win'
    ]
  }
}
```

**Notes:**
- Slug must be URL-friendly (lowercase, hyphens, no spaces)
- Image should be placed in `/public` folder
- Bio array: Each string is a paragraph
- Achievements are optional but recommended

### Step 2: Add Route Mapping

**File**: `src/app/soloists/[slug]/page.tsx`

Add the new slug to the `soloistRoutes` object:

```typescript
const soloistRoutes: { [key: string]: keyof typeof soloistBioData } = {
  'jane-virtuoso': 'jane-virtuoso',
  'michael-strings': 'michael-strings',
  'new-soloist-slug': 'new-soloist-slug'  // Add this line
}
```

### Step 3: Test the Bio Page

1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:3002/soloists/new-soloist-slug`
3. Verify:
   - Name and instrument display correctly
   - Image loads
   - Bio paragraphs render
   - Achievements list appears (if provided)

---

## Task 2: Create a Concert with Bio Links

### Step 1: Add Concert Data

**File**: `src/lib/concertPageMakerBio.tsx`

Add a new entry to the `concertDataBio` object:

```typescript
export const concertDataBio = {
  // ... existing concerts ...
  
  newConcertName: {
    title: 'Concert Title',
    subtitle: 'Optional Subtitle',
    description: 'Brief description for the hero section',
    image: getImagePath('/concert-poster.png'),
    imageAlt: 'Alt text for concert image',
    aboutTitle: 'About This Concert',
    aboutDescription: [
      'First paragraph about the concert',
      'Second paragraph with more details',
      'Third paragraph about the program'
    ],
    features: [
      '<strong>Composer Name</strong> - Work Title',
      '        I. Movement One',
      '        II. Movement Two',
      '<strong>Another Composer</strong> - Another Work'
    ],
    seasonTitle: "This Season's Concerts",
    ticketUrl: 'https://www.etix.com/ticket/p/XXXXXXXX/concert-name',
    soloists: ['jane-virtuoso', 'new-soloist-slug']  // Reference soloist slugs
  }
}
```

### Step 2: Create Concert Page

**File**: `src/app/concerts/new-concert-name/page.tsx`

Create a new file with this content:

```typescript
import { concertPageMakerBio, concertDataBio } from '@/lib/concertPageMakerBio'

export default concertPageMakerBio(concertDataBio.newConcertName)
```

### Step 3: Test the Concert Page

1. Navigate to: `http://localhost:3002/concerts/new-concert-name`
2. Verify:
   - Concert information displays
   - "Featured Soloists" section appears
   - Soloist cards are clickable
   - Clicking leads to correct bio pages

---

## Task 3: Integrate Concert into Site

To make the concert appear in the concerts list and calendar:

### Step 1: Add to Concert Data

**File**: `src/lib/concertData.ts`

Add entry to the `concertData` array:

```typescript
export const concertData: Concert[] = [
  // ... existing concerts ...
  
  {
    id: 'unique-concert-id-month',
    title: 'Concert Title',
    description: 'Brief description for listings',
    date: utcToCentralTime('2026-06-15T00:30:00Z'), // Adjust date/time
    venue: 'Greenville Municipal Auditorium',
    ticket_price: 45,
    available_seats: 200,
    image_url: '/Crop-ConcertImage.png',
    performer: 'GCMS Musician\'s Collective',
    type: 'special'  // or 'orchestra', 'chamber', 'solo', 'jazz'
  }
]
```

**Date Format Notes:**
- Format: `YYYY-MM-DDTHH:MM:00Z`
- Time is in UTC, will be converted to Central Time
- For 7:30 PM Central: Use `00:30:00Z` next day
- For 3:00 PM Central: Use `20:00:00Z` same day

### Step 2: Add Route Mapping

In the same file (`concertData.ts`), add to `getConcertRoute`:

```typescript
export const getConcertRoute = (concertId: string): string => {
  const routeMap: { [key: string]: string } = {
    // ... existing routes ...
    'unique-concert-id-month': 'new-concert-name'
  }
  
  return routeMap[concertId] || 'NightAtTheMovies'
}
```

### Step 3: Verify Integration

1. Go to: `http://localhost:3002/concerts`
2. Find your concert in the list
3. Click to verify it opens correctly
4. Check calendar view for the date

---

## Task 4: Update Existing Soloist

### To Update Bio Text

**File**: `src/lib/soloistBioPageMaker.tsx`

Find the soloist entry and modify:

```typescript
'soloist-slug': {
  name: 'Same Name',
  instrument: 'Same Instrument',
  image: getImagePath('/same-image.jpg'),
  bio: [
    'Updated first paragraph',
    'Updated second paragraph',
    'New third paragraph'
  ],
  achievements: [
    'New achievement',
    'Updated achievement'
  ]
}
```

Changes take effect immediately (hot reload in dev mode).

### To Update Photo

1. Add new image to `/public` folder
2. Update the `image` field:
   ```typescript
   image: getImagePath('/new-soloist-photo.jpg')
   ```

---

## Task 5: Remove a Soloist from a Concert

**File**: `src/lib/concertPageMakerBio.tsx`

Find the concert and remove the soloist slug:

```typescript
concertName: {
  // ... other fields ...
  soloists: ['jane-virtuoso']  // Removed 'michael-strings'
}
```

The soloist bio page remains accessible but won't appear on this concert.

---

## Task 6: Convert Existing Concert to Bio-Enabled

### Step 1: Add Concert to concertPageMakerBio.tsx

Copy the concert data from `concertPageMaker.tsx` and add `soloists` field.

### Step 2: Update Concert Page File

**File**: `src/app/concerts/[concert-name]/page.tsx`

Change from:
```typescript
import { concertPageMaker, concertData } from '@/lib/concertPageMaker'
export default concertPageMaker(concertData.concertName)
```

To:
```typescript
import { concertPageMakerBio, concertDataBio } from '@/lib/concertPageMakerBio'
export default concertPageMakerBio(concertDataBio.concertName)
```

---

## Troubleshooting

### Issue: Soloist bio page shows "Not Found"

**Solution**: Check that:
1. Slug in URL matches slug in `soloistBioData`
2. Slug is added to `soloistRoutes` in `/app/soloists/[slug]/page.tsx`
3. No typos in slug (case-sensitive)

### Issue: Concert doesn't show in listings

**Solution**: Verify:
1. Concert added to `concertData` array in `concertData.ts`
2. Date is in the future
3. Route mapping added to `getConcertRoute`

### Issue: Soloist cards don't appear on concert page

**Solution**: Check:
1. Concert uses `concertPageMakerBio` (not `concertPageMaker`)
2. `soloists` array has valid slugs
3. Slugs match entries in `soloistBioData`

### Issue: Images not loading

**Solution**:
1. Verify image exists in `/public` folder
2. Check path uses `getImagePath('/image.jpg')`
3. Ensure image filename matches exactly (case-sensitive)

### Issue: Next.js async params error

**Solution**: Ensure dynamic routes use:
```typescript
params: Promise<{ slug: string }>
// and
const { slug } = await params
```

---

## Best Practices

1. **Slug Naming**: Use lowercase with hyphens (e.g., `john-smith-piano`)
2. **Image Sizes**: Optimize images before uploading (recommended: 800x800px for soloists)
3. **Bio Length**: 2-3 paragraphs ideal, 4-5 maximum
4. **Achievements**: 3-5 items, most impressive first
5. **Testing**: Always test in dev before deploying
6. **Consistency**: Follow existing patterns in data structure

---

## Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Test production build locally
npm run start
```

---

## File Reference

| File | Purpose |
|------|---------|
| `soloistBioPageMaker.tsx` | Soloist data and template |
| `concertPageMakerBio.tsx` | Concert data with bio links |
| `concertData.ts` | Site integration (listings/calendar) |
| `soloists/[slug]/page.tsx` | Dynamic soloist routing |
| `SoloistBioPage.tsx` | Bio page component |
| `ConcertPageBio.tsx` | Concert page component |

---

## Support

For questions or issues:
1. Check this runbook first
2. Review `SOLOIST_BIO_SYSTEM_GUIDE.md` for architecture details
3. Examine existing examples (Test Concert, Jane Virtuoso)
4. Check Next.js 15 documentation for routing issues
