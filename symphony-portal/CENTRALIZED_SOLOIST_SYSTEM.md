# Centralized Soloist System - How It Works

## Overview

The soloist system is **already fully centralized**. You only need to define a soloist ONCE, and it automatically works everywhere in the site.

## Single Source of Truth

**File**: `src/lib/soloistBioPageMaker.tsx`

This is the ONLY place where you define soloist information. All other parts of the site reference this data.

## How to Add a New Soloist (One-Time Entry)

### Step 1: Add Soloist to Central Data File

**File**: `src/lib/soloistBioPageMaker.tsx`

```typescript
export const soloistBioData = {
  // ... existing soloists ...
  
  'new-soloist-slug': {
    name: 'Soloist Full Name',
    instrument: 'Primary Instrument',
    image: getImagePath('/soloist-photo.jpg'),
    bio: [
      'First paragraph about the artist',
      'Second paragraph with background',
      'Third paragraph about achievements'
    ],
    achievements: [
      'Major Award or Recognition',
      'Notable Performance',
      'Recording or Album'
    ]
  }
}
```

**That's it!** The soloist data is now centralized and ready to use.

### Step 2: Add Route Mapping (One Line)

**File**: `src/app/soloists/[slug]/page.tsx`

Add one line to the routing object:

```typescript
const soloistRoutes: { [key: string]: keyof typeof soloistBioData } = {
  'ami-campbell': 'ami-campbell',
  'michael-strings': 'michael-strings',
  'new-soloist-slug': 'new-soloist-slug'  // Add this line
}
```

## How to Use Soloists in Concerts

Once a soloist is defined in the central file, you just reference their slug:

**File**: `src/lib/concertPageMakerBio.tsx`

```typescript
export const concertDataBio = {
  myConcert: {
    title: "My Concert",
    // ... other concert details ...
    soloists: ['ami-campbell', 'new-soloist-slug']  // Just reference by slug!
  }
}
```

## What Happens Automatically

When you reference a soloist by slug, the system automatically:

1. ✅ Pulls their full name from central data
2. ✅ Pulls their instrument from central data
3. ✅ Pulls their photo from central data
4. ✅ Pulls their bio from central data
5. ✅ Creates their bio page at `/soloists/[slug]`
6. ✅ Creates clickable cards on concert pages
7. ✅ Links cards to their bio pages

## Benefits of This System

### 1. **Single Entry Point**
- Define soloist data once in `soloistBioPageMaker.tsx`
- Use everywhere by slug reference

### 2. **Automatic Updates**
- Change soloist info in one place
- Updates everywhere automatically

### 3. **No Duplication**
- Name, instrument, bio, photo stored once
- Referenced by slug everywhere else

### 4. **Type Safety**
- TypeScript ensures slug references are valid
- Catches typos at compile time

## Example: Complete Workflow

### Adding "Sarah Pianist"

**1. Add to central data** (`soloistBioPageMaker.tsx`):
```typescript
'sarah-pianist': {
  name: 'Sarah Pianist',
  instrument: 'Piano',
  image: getImagePath('/sarah.jpg'),
  bio: ['Sarah is an acclaimed pianist...'],
  achievements: ['Grammy Winner', 'Carnegie Hall Debut']
}
```

**2. Add route** (`soloists/[slug]/page.tsx`):
```typescript
'sarah-pianist': 'sarah-pianist'
```

**3. Use in concert** (`concertPageMakerBio.tsx`):
```typescript
soloists: ['sarah-pianist']
```

**Done!** Sarah now has:
- ✅ Bio page at `/soloists/sarah-pianist`
- ✅ Card on concert page with her photo
- ✅ Clickable link to her bio
- ✅ All her info pulled from central data

## Data Flow Diagram

```
soloistBioPageMaker.tsx (SINGLE SOURCE OF TRUTH)
         ↓
         ├─→ Concert Page (references by slug)
         │   └─→ Displays: name, instrument, image, bio preview
         │       └─→ Links to bio page
         │
         └─→ Bio Page (references by slug)
             └─→ Displays: full name, instrument, image, full bio, achievements
```

## Key Files

| File | Purpose | What You Do |
|------|---------|-------------|
| `soloistBioPageMaker.tsx` | **Central data store** | Add soloist data ONCE |
| `soloists/[slug]/page.tsx` | Route mapping | Add one line for routing |
| `concertPageMakerBio.tsx` | Concert data | Reference by slug only |

## Common Tasks

### Update Soloist Bio
**Edit**: `soloistBioPageMaker.tsx` only
**Result**: Updates everywhere automatically

### Change Soloist Photo
**Edit**: `soloistBioPageMaker.tsx` only (change `image` field)
**Result**: New photo appears on concert page AND bio page

### Add Soloist to Concert
**Edit**: `concertPageMakerBio.tsx` only (add slug to `soloists` array)
**Result**: Soloist card appears with all data from central source

### Remove Soloist from Concert
**Edit**: `concertPageMakerBio.tsx` only (remove slug from `soloists` array)
**Result**: Soloist card removed (bio page still exists)

## Why This Is Already Centralized

❌ **NOT** centralized would be:
- Entering name in concert file
- Entering name again in bio file
- Entering instrument in concert file
- Entering instrument again in bio file
- Copying bio text to multiple places

✅ **IS** centralized (current system):
- Enter ALL data once in `soloistBioPageMaker.tsx`
- Reference by slug everywhere else
- System pulls data automatically

## Summary

**You already have a fully centralized system!**

- **One entry point**: `soloistBioPageMaker.tsx`
- **One reference method**: Use slug
- **Automatic propagation**: Data flows everywhere
- **No duplication**: Each piece of info stored once

The system is designed so you never have to enter the same information twice. Define it once, use it everywhere by slug reference.
