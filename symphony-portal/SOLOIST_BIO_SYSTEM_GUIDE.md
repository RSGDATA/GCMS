# Soloist Bio System - Complete Guide

## Overview

The Soloist Bio System is a new feature that allows concert pages to display featured soloists with clickable links to detailed biography pages. This system follows the same template-based architecture as existing concert pages, making it easy to add, modify, and maintain soloist information.

## Architecture

### File Structure

```
symphony-portal/
├── src/
│   ├── lib/
│   │   ├── soloistBioPageMaker.tsx      # Soloist bio template maker
│   │   ├── concertPageMakerBio.tsx      # Concert template with bio links
│   │   └── concertData.ts               # Concert data (includes routing)
│   ├── components/
│   │   ├── SoloistBioPage.tsx           # Soloist bio page component
│   │   └── ConcertPageBio.tsx           # Concert page with soloist section
│   └── app/
│       ├── soloists/
│       │   └── [slug]/
│       │       └── page.tsx             # Dynamic soloist route
│       └── concerts/
│           └── [concert-name]/
│               └── page.tsx             # Individual concert pages
```

### How It Works

1. **Soloist Data** is centralized in `soloistBioPageMaker.tsx`
2. **Concert Data** references soloists by slug in `concertPageMakerBio.tsx`
3. **Template Functions** generate pages from data (no hardcoding)
4. **Dynamic Routes** handle URL routing automatically
5. **Site Integration** via `concertData.ts` for calendar and listings

## Two Types of Concert Pages

### Type 1: Standard Concert Pages (Existing)
- Uses: `concertPageMaker.tsx` + `ConcertPage.tsx`
- No soloist bio links
- Examples: Night at the Movies, Eldred Marshall, etc.

### Type 2: Concert Pages with Bio Links (New)
- Uses: `concertPageMakerBio.tsx` + `ConcertPageBio.tsx`
- Features clickable soloist cards
- Example: Test Concert with Featured Soloists

## Key Features

✅ **Fully Templateized** - All data-driven, no hardcoding
✅ **Reusable Soloists** - Same soloist can appear in multiple concerts
✅ **Automatic Routing** - Dynamic routes handle all URLs
✅ **Site Integration** - Appears in concerts list and calendar
✅ **Zero Breaking Changes** - Existing concerts unaffected

## Data Flow

```
1. Add Soloist Data → soloistBioPageMaker.tsx
2. Create Concert Data → concertPageMakerBio.tsx (references soloist slugs)
3. Create Concert Page → /concerts/[name]/page.tsx (uses template)
4. Add to Site → concertData.ts (for listings/calendar)
5. Add Route Mapping → soloists/[slug]/page.tsx (if new soloist)
```

## Example: Test Concert

The test concert demonstrates the complete system:

- **Concert**: Test Concert with Featured Soloists
- **URL**: `/concerts/test-concert-with-soloists`
- **Soloists**: Jane Virtuoso (Piano), Michael Strings (Violin)
- **Bio URLs**: 
  - `/soloists/jane-virtuoso`
  - `/soloists/michael-strings`

## Benefits

1. **Maintainability**: All data in one place, easy to update
2. **Consistency**: Same patterns as existing architecture
3. **Scalability**: Easy to add unlimited soloists and concerts
4. **User Experience**: Rich artist information enhances engagement
5. **SEO**: Individual bio pages improve search visibility

## Next Steps

See the accompanying RUNBOOK for step-by-step instructions on:
- Adding new soloists
- Creating concerts with bio links
- Integrating into the site
- Troubleshooting common issues
