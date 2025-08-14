export interface Concert {
  id: string
  title: string
  description: string
  date: string
  venue: string
  ticket_price: number
  available_seats: number
  image_url: string | null
  performer?: string
  type: 'orchestra' | 'chamber' | 'solo' | 'jazz' | 'special'
}

// Helper function to convert UTC to Central Time
// This takes a UTC date string and converts it to Central Time (America/Chicago timezone)
const utcToCentralTime = (utcTimeString: string): string => {
  // Parse the UTC date
  const utcDate = new Date(utcTimeString)
  
  // Convert to Central Time using the America/Chicago timezone
  // This automatically handles DST (CDT/CST) transitions
  const centralTimeString = utcDate.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
  
  // Convert the formatted string back to ISO format for consistency
  const [datePart, timePart] = centralTimeString.split(', ')
  const [month, day, year] = datePart.split('/')
  const formattedDate = `${year}-${month}-${day}T${timePart}`
  
  return new Date(formattedDate).toISOString()
}

// Centralized concert data - single source of truth
// NOTE: Dates are stored in UTC and converted to Central Time for display
// Format: 'YYYY-MM-DDTHH:MM:00Z' (UTC timezone)
export const concertData: Concert[] = [
  // October 2025
  {
    id: 'NightAtTheMovies-oct',
    title: 'Night at the Movies',
    description: 'Blockbusters come to life with lush live orchestration in this dazzling evening of cinematic favorites. Vocal powerhouse Sabatina Maura performs showstoppers like Defying Gravity, The Wizard and I, and Never Enough, in an unforgettable night of drama, sparkle, and song.',
    date: utcToCentralTime('2025-10-04T00:30:00Z'), // Friday 7:30 PM Central Time (UTC: Saturday 12:30 AM)
    venue: 'Greenville Municipal Auditorium',
    ticket_price: 35,
    available_seats: 500,
    image_url: '/Crop-NightAtTheMovies.png',
    performer: 'GPO (Greenville Pops Orchestra)',
    type: 'orchestra'
  },
  {
    id: 'melodies-of-nature-oct',
    title: 'The Melodies of Nature',
    description: 'Nature hums, whispers, and roars in this vibrant program of Respighi, Mason Bates, Brittney Benton, and Amy Beach. From woodland dreamscapes to earthy rhythms, this evening paints an aural canvas of the wild.',
    date: utcToCentralTime('2025-10-19T19:00:00Z'), // Sunday 2:00 PM Central Time (UTC: Sunday 7:00 PM)
    venue: 'Greenville Municipal Auditorium',
    ticket_price: 40,
    available_seats: 120,
    image_url: '/Crop-TheMelodiesOfNature.png',
    performer: 'GCMS Musician\'s Collective',
    type: 'chamber'
  },

  // November 2025
  {
    id: 'eldred-marshall-nov',
    title: 'Eldred Marshall in Concert',
    description: 'Virtuoso pianist Eldred Marshall takes the stage for a powerful solo evening. With dynamic range and soulful interpretation, Marshall brings poetic depth and dazzling clarity to every note. Program to be announced.',
    date: utcToCentralTime('2025-11-09T01:30:00Z'), // Saturday 7:30 PM Central Time (UTC: Sunday 1:30 AM)
    venue: 'Greenville Municipal Auditorium',
    ticket_price: 35,
    available_seats: 100,
    image_url: '/Crop-EldrenMarshallInConcert.png',
    performer: 'Eldred Marshall',
    type: 'solo'
  },

  // December 2025
  {
    id: 'all-star-christmas-dec',
    title: 'All-Star Christmas Concert',
    description: "The lights are twinkling, the cocoa's warm — and there's music in the air! Join Tatiana Mayfield, the Greenville Pops Orchestra, and a sleigh-full of special guests for an evening of holiday cheer. From beloved carols to jazzy takes on your favorite tunes, this festive concert is the perfect way to kick off a new holiday tradition with the ones you love.",
    date: utcToCentralTime('2025-12-07T20:00:00Z'), // Sunday 2:00 PM Central Time (UTC: Sunday 8:00 PM)
    venue: 'Greenville Municipal Auditorium',
    ticket_price: 50,
    available_seats: 250,
    image_url: '/Crop-AllStarChristmasConcert.png',
    performer: 'GPO (Greenville Pops Orchestra)',
    type: 'orchestra'
  },
  {
    id: 'rhythms-of-belonging-dec',
    title: 'Rhythms of Belonging',
    description: 'An inspiring concert celebrating the rhythms that connect us all, featuring global and classical influences.',
    date: utcToCentralTime('2025-12-14T01:30:00Z'), // Saturday 7:30 PM Central Time (UTC: Sunday 1:30 AM)
    venue: 'Greenville Municipal Auditorium',
    ticket_price: 45,
    available_seats: 300,
    image_url: '/Crop-RhythmsofBelonging.png',
    performer: 'GCMS Musician\'s Collective',
    type: 'chamber'
  },
  {
    id: 'echoes-and-elegance-dec',
    title: 'Echoes and Elegance',
    description: 'Holiday concert featuring Giordi, Hamin, and Robert in festive chamber works.',
    date: utcToCentralTime('2025-12-21T01:30:00Z'), // Saturday 7:30 PM Central Time (UTC: Sunday 1:30 AM)
    venue: 'Greenville Municipal Auditorium',
    ticket_price: 40,
    available_seats: 120,
    image_url: '/Crop-EchoesAndElegance.png',
    performer: 'GCMS Musician\'s Collective',
    type: 'chamber'
  },

  // February 2026
  {
    id: 'retro-rewind-feb',
    title: 'Retro Rewind: The Ultimate Mixtape',
    description: "Get your groove on with symphonic takes on pop and rock legends from the '70s and '80s — Whitney, Styx, Queen, Madonna, Elton, The Beatles, and more. Come sing along, relive the hits, and make it a night to remember.",
    date: utcToCentralTime('2026-02-07T01:30:00Z'), // Friday 7:30 PM Central Time (UTC: Saturday 1:30 AM)
    venue: 'Greenville Municipal Auditorium',
    ticket_price: 50,
    available_seats: 400,
    image_url: '/Crop-RetroRewind.png',
    performer: 'GPO (Greenville Pops Orchestra)',
    type: 'orchestra'
  },
  {
    id: 'songs-of-the-land-and-soul-feb',
    title: 'Songs of the Land and Soul',
    description: "Explore the power of place in this evocative program of chamber music and songs by Harry T. Burleigh and Stephen Lias. With spiritual depth and natural beauty, this concert journeys through landscapes both internal and external.",
    date: utcToCentralTime('2026-02-22T01:30:00Z'), // Saturday 7:30 PM Central Time (UTC: Sunday 1:30 AM)
    venue: 'Greenville Municipal Auditorium',
    ticket_price: 45,
    available_seats: 200,
    image_url: '/Crop-SongsOfTheLand.png',
    performer: 'Mt. Vernon Music',
    type: 'chamber'
  },

  // March 2026
  {
    id: 'winds-of-change-mar',
    title: 'Winds of Change',
    description: "An evening of winds and piano — spirited, expressive, and full of character. This chamber concert showcases the dynamic textures and tonal colors that only winds can deliver. Full program to be announced.",
    date: utcToCentralTime('2026-03-22T19:00:00Z'), // Sunday 2:00 PM Central Time (UTC: Sunday 7:00 PM)
    venue: 'Greenville Municipal Auditorium',
    ticket_price: 40,
    available_seats: 150,
    image_url: '/Crop-WindsOfChange.png',
    performer: 'GCMS Musician\'s Collective',
    type: 'chamber'
  },

  // April 2026
  {
    id: 'voices-in-color-apr',
    title: 'Voices in Color',
    description: "A vibrant kaleidoscope of works by women and composers of color, this concert speaks in a dazzling range of styles. From the meditative Winter Spirits by Katherine Hoover to the rhythmic fire of Jessie Montgomery's Starburst, and María Grever's reimagined bolero, each voice shines in vivid detail. This program will also feature a performance of Claude Bolling's jazz suite for flute and piano trio.",
    date: utcToCentralTime('2026-04-18T00:30:00Z'), // Friday 7:30 PM Central Time (UTC: Saturday 12:30 AM)
    venue: 'Greenville Municipal Auditorium',
    ticket_price: 35,
    available_seats: 100,
    image_url: '/Crop-VoicesInColor.png',
    performer: 'GCMS Musician\'s Collective',
    type: 'chamber'
  },
  {
    id: 'global-grooves-dhaka-standard-apr',
    title: 'Global Grooves with Dhaka Standard',
    description: 'International concert celebrating global musical traditions and cross-cultural collaboration.',
    date: utcToCentralTime('2026-04-26T00:30:00Z'), // Saturday 7:30 PM Central Time (UTC: Sunday 12:30 AM)
    venue: 'Greenville Municipal Auditorium',
    ticket_price: 40,
    available_seats: 150,
    image_url: '/Crop-GlobalGrooves.png',
    performer: 'Dhaka Standard',
    type: 'jazz'
  }
]

// Helper functions for working with concert data
export const getConcertById = (id: string): Concert | undefined => {
  return concertData.find(concert => concert.id === id)
}

export const getConcertsByType = (type: Concert['type']): Concert[] => {
  return concertData.filter(concert => concert.type === type)
}

export const getConcertsByPerformer = (performer: string): Concert[] => {
  return concertData.filter(concert => concert.performer?.includes(performer))
}

export const getUpcomingConcerts = (limit?: number): Concert[] => {
  const now = new Date()
  const upcoming = concertData
    .filter(concert => new Date(concert.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  return limit ? upcoming.slice(0, limit) : upcoming
}

export const getConcertsForDate = (date: Date): Concert[] => {
  return concertData.filter(concert => {
    const concertDate = new Date(concert.date)
    return concertDate.toDateString() === date.toDateString()
  })
}

// Concert routing helper - maps concert IDs to their page routes
export const getConcertRoute = (concertId: string): string => {
  const routeMap: { [key: string]: string } = {
    'NightAtTheMovies-oct': 'NightAtTheMovies',
    'melodies-of-nature-oct': 'ashley',
    'eldred-marshall-nov': 'eldred',
    'all-star-christmas-dec': 'AllStarChristmasConcert',
    'rhythms-of-belonging-dec': 'RhythmOfBelonging',
    'echoes-and-elegance-dec': 'EchoesAndElegance',
    'retro-rewind-feb': 'RetroRewind',
    'songs-of-the-land-and-soul-feb': 'SongsOfTheLandAndTheSoul',
    'winds-of-change-mar': 'WindsOfChange',
    'voices-in-color-apr': 'VoicesInColor',
    'global-grooves-dhaka-standard-apr': 'dhaka-standard'
  }
  
  return routeMap[concertId] || 'NightAtTheMovies'
}
