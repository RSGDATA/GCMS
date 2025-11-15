# Truly Centralized Soloist System

## Overview

The soloist system is now **100% centralized** with **ZERO hardcoded strings**. Every soloist slug is defined ONCE as a constant and referenced everywhere using that constant.

## Single Source of Truth

**File**: `src/lib/soloistBioPageMaker.tsx`

This file contains:
1. **SOLOIST CONSTANTS** - Define each slug ONCE
2. **Soloist Data** - All bio information

## How It Works

### Step 1: Define Soloist Constant (ONE TIME ONLY)

**File**: `src/lib/soloistBioPageMaker.tsx`

```typescript
export const SOLOISTS = {
  AMI_CAMPBELL: 'ami-campbell',        // ← Define slug ONCE here
  MICHAEL_STRINGS: 'michael-strings',  // ← Define slug ONCE here
  // Add new soloists here
} as const
```

### Step 2: Use Constant in Data Definition

**Same File**: `src/lib/soloistBioPageMaker.tsx`

```typescript
export const soloistBioData = {
  [SOLOISTS.AMI_CAMPBELL]: {  // ← Use constant, not string
    name: 'Ami Campbell',
    instrument: 'Violin',
    image: getImagePath('/Orchestra-headshot-Ami-Campbell.png'),
    bio: ['...'],
  },
  [SOLOISTS.MICHAEL_STRINGS]: {  // ← Use constant, not string
    name: 'Michael Strings',
    instrument: 'Violin',
    image: getImagePath('/soloist.jpg'),
    bio: ['...'],
  }
}
```

### Step 3: Use Constant in Concert Data

**File**: `src/lib/concertPageMakerBio.tsx`

```typescript
import { SOLOISTS } from './soloistBioPageMaker'

export const concertDataBio = {
  myConcert: {
    title: "My Concert",
    // ... other fields ...
    soloists: [
      SOLOISTS.AMI_CAMPBELL,      // ← Use constant, not string
      SOLOISTS.MICHAEL_STRINGS    // ← Use constant, not string
    ]
  }
}
```

### Step 4: Use Constant in Routing

**File**: `src/app/soloists/[slug]/page.tsx`

```typescript
import { SOLOISTS } from '@/lib/soloistBioPageMaker'

const soloistRoutes = {
  [SOLOISTS.AMI_CAMPBELL]: SOLOISTS.AMI_CAMPBELL,        // ← Use constant
  [SOLOISTS.MICHAEL_STRINGS]: SOLOISTS.MICHAEL_STRINGS  // ← Use constant
}
```

## Adding a New Soloist - Complete Example

### Example: Adding "Sarah Pianist"

**1. Add constant** (`soloistBioPageMaker.tsx`):
```typescript
export const SOLOISTS = {
  AMI_CAMPBELL: 'ami-campbell',
  MICHAEL_STRINGS: 'michael-strings',
  SARAH_PIANIST: 'sarah-pianist',  // ← Add ONCE here
} as const
```

**2. Add data** (same file):
```typescript
export const soloistBioData = {
  // ... existing soloists ...
  [SOLOISTS.SARAH_PIANIST]: {  // ← Use constant
    name: 'Sarah Pianist',
    instrument: 'Piano',
    image: getImagePath('/sarah.jpg'),
    bio: ['Sarah is an acclaimed pianist...'],
  }
}
```

**3. Add route** (`soloists/[slug]/page.tsx`):
```typescript
const soloistRoutes = {
  [SOLOISTS.AMI_CAMPBELL]: SOLOISTS.AMI_CAMPBELL,
  [SOLOISTS.MICHAEL_STRINGS]: SOLOISTS.MICHAEL_STRINGS,
  [SOLOISTS.SARAH_PIANIST]: SOLOISTS.SARAH_PIANIST,  // ← Use constant
}
```

**4. Use in concert** (`concertPageMakerBio.tsx`):
```typescript
soloists: [
  SOLOISTS.SARAH_PIANIST,  // ← Use constant
  SOLOISTS.AMI_CAMPBELL
]
```

## Benefits of This System

### ✅ Zero Hardcoded Strings
- No typing 'ami-campbell' multiple times
- No risk of typos
- TypeScript autocomplete everywhere

### ✅ Single Point of Change
- Want to change 'ami-campbell' to 'ami-campbell-violin'?
- Change it ONCE in the SOLOISTS constant
- Updates everywhere automatically

### ✅ Type Safety
- TypeScript catches errors at compile time
- Autocomplete suggests available soloists
- Impossible to reference non-existent soloist

### ✅ Easy Refactoring
- Rename a soloist? Change one constant
- Remove a soloist? Delete one constant
- IDE can find all usages instantly

## Comparison: Before vs After

### ❌ Before (Hardcoded Strings)
```typescript
// File 1
'ami-campbell': { ... }

// File 2
soloists: ['ami-campbell', 'michael-strings']

// File 3
'ami-campbell': 'ami-campbell'

// Problem: 'ami-campbell' typed 3+ times!
```

### ✅ After (Constants)
```typescript
// File 1 - Define ONCE
SOLOISTS = {
  AMI_CAMPBELL: 'ami-campbell'  // ← ONLY place with string
}

// File 2 - Use constant
[SOLOISTS.AMI_CAMPBELL]: { ... }

// File 3 - Use constant
soloists: [SOLOISTS.AMI_CAMPBELL]

// File 4 - Use constant
[SOLOISTS.AMI_CAMPBELL]: SOLOISTS.AMI_CAMPBELL

// Result: String defined ONCE, constant used everywhere!
```

## Changing a Soloist Slug

### Example: Rename 'ami-campbell' to 'ami-campbell-violin'

**Old Way (Hardcoded)**:
1. Find 'ami-campbell' in soloistBioPageMaker.tsx
2. Find 'ami-campbell' in concertPageMakerBio.tsx
3. Find 'ami-campbell' in soloists/[slug]/page.tsx
4. Hope you didn't miss any!

**New Way (Constants)**:
1. Change ONE line:
```typescript
export const SOLOISTS = {
  AMI_CAMPBELL: 'ami-campbell-violin',  // ← Change ONCE
  // ...
}
```
2. Done! Updates everywhere automatically.

## File Reference

| File | What You Do | Example |
|------|-------------|---------|
| `soloistBioPageMaker.tsx` | 1. Add constant<br>2. Add data | `SARAH_PIANIST: 'sarah-pianist'`<br>`[SOLOISTS.SARAH_PIANIST]: {...}` |
| `concertPageMakerBio.tsx` | Use constant in array | `soloists: [SOLOISTS.SARAH_PIANIST]` |
| `soloists/[slug]/page.tsx` | Add route mapping | `[SOLOISTS.SARAH_PIANIST]: SOLOISTS.SARAH_PIANIST` |

## Key Principle

**The string value (e.g., 'ami-campbell') appears in EXACTLY ONE PLACE:**
```typescript
export const SOLOISTS = {
  AMI_CAMPBELL: 'ami-campbell',  // ← ONLY place with the string!
} as const
```

**Everywhere else uses the constant:**
```typescript
SOLOISTS.AMI_CAMPBELL  // ← No strings, just constants!
```

## Summary

✅ **Define slug ONCE** in SOLOISTS constant  
✅ **Use constant everywhere** (data, concerts, routes)  
✅ **Zero hardcoded strings** outside the constant definition  
✅ **Type-safe** with autocomplete  
✅ **Easy to maintain** - change once, updates everywhere  

This is a truly centralized system where each piece of information exists in exactly one place.
