import ConcertPage from '../components/ConcertPage'
import { getImagePath } from './imagePath'

interface ConcertEvent {
  title: string
  description: string
  date: string
  venue: string
  seats: string
  price: string
}

interface ConcertData {
  title: string
  subtitle: string
  description: string
  image: string
  imageAlt: string
  aboutTitle: string
  aboutDescription: string[]
  features: string[]
  seasonTitle: string
  events: ConcertEvent[]
  ticketUrl: string
}

export function concertPageMaker(data: ConcertData) {
  return () => <ConcertPage {...data} />
}

// Pre-defined concert data
export const concertData = {
  NightAtTheMovies: {
    title: "GPO",
    subtitle: "Concert",
    description: "Experience the magic of cinema with the Greenville Pops Orchestra as blockbuster movies come to life with a lush live orchestra.",
    image: getImagePath("/NightAtTheMovies.png"),
    imageAlt: "Night at the Movies - Greenville Pops Orchestra conductor",
    aboutTitle: "About Night at the Movies",
    aboutDescription: [
      "Night at the Movies brings the magic of cinema to life with the Greenville Pops Orchestra performing iconic film scores live. Experience your favorite blockbuster movies in a whole new way as our talented musicians provide the soundtrack to unforgettable cinematic moments.",
      "From epic adventures to romantic classics, our Night at the Movies concerts feature beloved film music that has captured hearts and imaginations for generations. Each performance creates an immersive experience where the power of live orchestral music enhances the emotional impact of cinema's greatest moments."
    ],
    features: [
      "Live orchestral performances of iconic film scores",
      "Big screen movie clips synchronized with live music",
      "Popular blockbuster and classic film selections",
      "Professional orchestra with expert conductor",
      "State-of-the-art audio-visual presentation",
      "Family-friendly entertainment for all ages"
    ],
    seasonTitle: "This Season's Movie Concerts",
    events: [
      {
        title: "Night at the Movies",
        description: "Blockbusters come to life with a lush live orchestra featuring your favorite film scores and movie moments.",
        date: "October 3, 2025 at 2:30 PM",
        venue: "Greenville Municipal Auditorium",
        seats: "500 seats available",
        price: "$35"
      }
    ],
    ticketUrl: "https://www.etix.com/ticket/p/73090996/night-at-the-movies-greenville-greenville-municipal-auditorium"
  },

  pianoContest: {
    title: "Piano",
    subtitle: "Contest",
    description: "Witness the next generation of piano virtuosos compete in our prestigious annual piano competition, featuring talented young musicians from across the region.",
    image: getImagePath("/soloist.jpg"),
    imageAlt: "Young pianist performing at piano contest",
    aboutTitle: "About Our Piano Contest",
    aboutDescription: [
      "Our annual Piano Contest celebrates the exceptional talent of young pianists in our community and beyond. This prestigious competition provides a platform for emerging artists to showcase their skills, compete for valuable prizes, and gain performance experience in a professional setting.",
      "The contest features multiple age categories and attracts participants from across the Southeast. Each contestant performs a carefully prepared program, demonstrating technical proficiency, musical interpretation, and artistic maturity. Our distinguished panel of judges includes renowned pianists, pedagogues, and music professionals."
    ],
    features: [
      "Multiple age divisions from elementary through college level",
      "Distinguished panel of professional judges",
      "Cash prizes, trophies, and certificates for winners",
      "Master class opportunities with guest artists",
      "Performance opportunities with local ensembles",
      "Professional recording of winning performances"
    ],
    seasonTitle: "Contest Schedule",
    events: [
      {
        title: "Fall Competition",
        description: "Annual competition featuring young pianists ages 8-18, showcasing their technical skills and musical interpretation.",
        date: "October 18, 2025 at 2:00 PM",
        venue: "Heritage Main Library",
        seats: "Ages 8-18",
        price: "$15"
      },
      {
        title: "Spring Competition",
        description: "Spring showcase featuring advanced young pianists competing for scholarships and performance opportunities.",
        date: "April 18, 2025 at 1:00 PM",
        venue: "Greenville Concert Hall",
        seats: "Ages 14-22",
        price: "$15"
      }
    ],
    ticketUrl: "https://tickets.example.com/piano-contest"
  },

  ashley: {
    title: "GCMS",
    subtitle: "Concert",
    description: "Experience exceptional musical artistry with Ashley, featuring intimate performances that showcase technical brilliance and emotional depth in classical repertoire.",
    image: getImagePath("/The Melodies Of Nature.png"),
    imageAlt: "Ashley performing in concert",
    aboutTitle: "About Ashley Concerts",
    aboutDescription: [
      "Ashley concerts represent a unique blend of classical tradition and contemporary interpretation, bringing fresh perspectives to beloved repertoire. These intimate performances create a special connection between artist and audience, showcasing the power of live classical music in its most personal and communicative form.",
      "Each Ashley concert is carefully curated to tell a musical story, weaving together works that complement and enhance each other. From baroque masterpieces to romantic showpieces, these performances demonstrate the full range of classical expression while maintaining the highest standards of artistic excellence."
    ],
    features: [
      "Intimate venue settings for optimal acoustic experience",
      "Carefully curated programs spanning multiple musical periods",
      "Pre-concert talks and program insights",
      "Meet-the-artist opportunities after select performances",
      "Educational components for music appreciation",
      "Collaborative performances with guest artists"
    ],
    seasonTitle: "This Season's Ashley Concerts",
    events: [
      {
        title: "Fall Recital",
        description: "An evening of classical favorites and contemporary works that showcase technical brilliance and emotional depth.",
        date: "October 19, 2025 at 2:30 PM",
        venue: "Heritage Main Library",
        seats: "120 seats available",
        price: "$40"
      },
      {
        title: "Holiday Performance",
        description: "Festive program featuring seasonal classics and beloved favorites that celebrate the joy of the season.",
        date: "December 13, 2025 at 2:30 PM",
        venue: "Greenville Concert Hall",
        seats: "150 seats available",
        price: "$40"
      }
    ],
    ticketUrl: "https://www.etix.com/ticket/p/98625126/the-melodies-of-nature-greenville-greenville-municipal-auditorium"
  },

  EchoesAndElegance: {
    title: "GCMS",
    subtitle: "Concert",
    description: "Experience the Greenville Chamber Music Society's signature performances featuring our talented resident musicians and special guest artists in intimate chamber music settings.",
    image: getImagePath("/EchoesAndElegance.png"),
    imageAlt: "GCMS ensemble performing",
    aboutTitle: "About GCMS Concerts",
    aboutDescription: [
      "GCMS concerts showcase the very best of our chamber music society, featuring performances by our resident musicians alongside distinguished guest artists. These concerts represent the heart of our organization's mission to bring exceptional chamber music to the Greenville community.",
      "Each GCMS concert is carefully programmed to highlight the unique strengths of our ensemble members while exploring diverse repertoire from baroque masterpieces to contemporary works. These performances demonstrate the collaborative spirit and artistic excellence that define the Greenville Chamber Music Society."
    ],
    features: [
      "Giordi - Renowned for expressive interpretations and technical mastery",
      "Hamin - Celebrated chamber musician with international experience",
      "Robert - Versatile performer specializing in both classical and contemporary works",
      "John - Accomplished musician with extensive solo and ensemble experience",
      "Amanda - Dynamic performer known for engaging stage presence",
      "Ashley - Talented artist bringing fresh perspectives to classical repertoire"
    ],
    seasonTitle: "This Season's GCMS Concerts",
    events: [
      {
        title: "Holiday Concert",
        description: "Featuring Giordi, Hamin, and Robert in festive chamber works",
        date: "December 20, 2025 at 7:30 PM",
        venue: "Heritage Main Library",
        seats: "Giordi, Hamin, Robert",
        price: "$40"
      },
      {
        title: "Spring Showcase",
        description: "Collaborative performance featuring John, Amanda, and Ashley",
        date: "March 22, 2025 at 7:30 PM",
        venue: "Greenville Concert Hall",
        seats: "John, Amanda, Ashley",
        price: "$40"
      }
    ],
    ticketUrl: "https://www.etix.com/ticket/p/31148816/echoes-and-elegance-greenville-greenville-municipal-auditorium"
  },

  eldred: {
    title: "Eldred",
    subtitle: "Concert",
    description: "Experience the artistry of Eldred in an intimate concert setting, featuring masterful interpretations of classical and contemporary repertoire.",
    image: getImagePath("/EldredMarshalInConcert.png"),
    imageAlt: "Eldred performing in concert",
    aboutTitle: "About Eldred Concerts",
    aboutDescription: [
     "Virtuoso pianist Eldred Marshall takes the stage for a powerful solo evening. With dynamic range and soulful interpretation, Marshall brings poetic depth and dazzling clarity to every note. Program to be announced."
    ],
    features: [
      "Expertly curated programs spanning multiple musical eras",
      "Intimate venue settings for optimal listening experience",
      "Educational program notes and pre-concert discussions",
      "Opportunities for audience interaction and Q&A",
      "Collaborative performances with guest musicians",
      "Focus on both technical excellence and emotional expression"
    ],
    seasonTitle: "This Season's Eldred Concerts",
    events: [
      {
        title: "Fall Concert",
        description: "An evening of classical masterworks and contemporary interpretations showcasing exceptional artistry.",
        date: "November 8, 2025 at 7:30 PM",
        venue: "Greenville Municipal Auditorium",
        seats: "100 seats available",
        price: "$35"
      },
      {
        title: "Spring Recital",
        description: "A special spring performance featuring beloved classical favorites and innovative contemporary works.",
        date: "April 12, 2026 at 7:30 PM",
        venue: "Greenville Municipal Auditorium",
        seats: "100 seats available",
        price: "$35"
      }
    ],
    ticketUrl: "https://www.etix.com/ticket/p/51222238/eldred-marshall-in-concert-greenville-greenville-municipal-auditorium"
  },
    allStarChristmas: {
    title: "All-Star Christmas",
    subtitle: "Concert",
    description: "Celebrate the holiday season with a spectacular orchestral performance featuring festive classics and seasonal favorites.",
    image: getImagePath("/all-star-christmas.png"),
    imageAlt: "Orchestra performing a Christmas concert",
    aboutTitle: "About the All-Star Christmas Concert",
    aboutDescription: [
      "The lights are twinkling, the cocoa's warm — and there's music in the air!",
      "Join Tatiana Mayfield, the Greenville Pops Orchestra, and a sleigh-full of",
      "special guests for an evening of holiday cheer. From beloved carols to jazzy",
      "takes on your favorite tunes, this festive concert is the perfect way to kick off a new holiday tradition with the ones you love."
    ],
    features: [
      "Live orchestral performances of Christmas classics",
      "Special guest appearances by renowned artists",
      "Festive decorations and holiday ambiance",
      "Family-friendly entertainment for all ages",
      "Opportunities to sing along with popular carols"
    ],
    seasonTitle: "This Season's Holiday Concerts",
    events: [
      {
        title: "All-Star Christmas Concert",
        description: "A festive orchestral performance featuring holiday classics and seasonal favorites.",
        date: "December 7, 2025 at 7:30 PM",
        venue: "Greenville Municipal Auditorium",
        seats: "250 seats available",
        price: "$50"
      }
    ],
    ticketUrl: "https://www.etix.com/ticket/p/63389680/allstar-christmas-concert-greenville-greenville-municipal-auditorium"
  },
rhythmsOfBelonging: {
  title: "Rhythms of Belonging",
  subtitle: "Concert",
  description: "A unique musical experience celebrating the rhythms that connect us all, featuring a blend of global and classical influences.",
  image: getImagePath("/RhythmsOfBelonging.png"),
  imageAlt: "Musicians performing in a vibrant concert setting",
  aboutTitle: "About Rhythms of Belonging",
  aboutDescription: [
    "Rhythms of Belonging is a celebration of music's power to unite people across cultures and traditions. This concert features a dynamic blend of global rhythms and classical influences, creating a truly unique and inspiring experience.",
    "Join us for an evening of connection and harmony, where music becomes the universal language of belonging. Perfect for audiences of all ages, this concert is a testament to the beauty of diversity and togetherness.",
    "Montgomery, Mendez, and Coleman bring bold, modern energy to a program grounded by Mussorgsky's episodic charm in an evening of rhythm, identity, and contrast that speaks to our deeper sense of belonging."
  ],
  features: [
    "A fusion of global and classical musical styles",
    "Performances by renowned international and local artists",
    "Interactive elements that engage the audience",
    "Vibrant stage design and lighting effects",
    "Family-friendly entertainment for all ages"
  ],
  seasonTitle: "This Season's Special Concerts",
  events: [
    {
      title: "Rhythms of Belonging",
      description: "An inspiring concert celebrating the rhythms that connect us all, featuring global and classical influences.",
      date: "January 15, 2026 at 7:00 PM",
      venue: "Greenville Municipal Auditorium",
      seats: "300 seats available",
      price: "$45"
    }
  ],
  ticketUrl: "https://www.etix.com/ticket/p/31827899/rhythms-of-belonging-greenville-greenville-municipal-auditorium"
},
    retroRewind: {
    title: "Retro Rewind: The Ultimate Mixtape",
    subtitle: "The Ultimate Mixtape",
    description: "Take a trip down memory lane with Retro Rewind: The Ultimate Mixtape, featuring live performances of your favorite hits from the '70s, '80s, and '90s.",
    image: getImagePath("/RetroRewind.png"),
    imageAlt: "Band performing retro hits on stage with vibrant lighting",
    aboutTitle: "About Retro Rewind: The Ultimate Mixtape",
    aboutDescription: [
      "Get your groove on with symphonic takes on pop and rock legends from the '70s and '80s —",
      "Whitney, Styx, Queen, Madonna, Elton, The Beatles, and more.",
      "Come sing along, relive the hits, and make it a night to remember."
    ],
    features: [
      "Live performances of iconic hits from the '70s, '80s, and '90s",
      "Dynamic stage design and lighting effects",
      "Audience sing-along opportunities",
      "Family-friendly entertainment for all ages",
      "Special guest appearances by tribute artists"
    ],
    seasonTitle: "This Season's Retro Concerts",
    events: [
      {
        title: "Retro Rewind: The Ultimate Mixtape",
        description: "A nostalgic journey through the greatest hits of the '70s, '80s, and '90s.",
        date: "February 6, 2026 at 7:30 PM",
        venue: "Greenville Concert Hall",
        seats: "400 seats available",
        price: "$50"
      }
    ],
    ticketUrl: "https://www.etix.com/ticket/p/62288808/retro-rewindthe-ultimate-mixtape-greenville-greenville-municipal-auditorium"
  },
    songsOfTheLandAndSoul: {
    title: "Songs of the Land and Soul",
    subtitle: "Concert",
    description: "Explore the power of place in this evocative program of chamber music and songs by Harry T. Burleigh and Stephen Lias.",
    image: getImagePath("/SongsOfTheLandAndTheSoul.png"),
    imageAlt: "Musicians performing in a serene natural setting",
    aboutTitle: "About Songs of the Land and Soul",
    aboutDescription: [
      "Explore the power of place in this evocative program of chamber music and songs",
      "by Harry T. Burleigh and Stephen Lias. With spiritual depth and natural beauty,",
      "this concert journeys through landscapes both internal and external."
    ],
    features: [
      "Chamber music inspired by natural landscapes",
      "Songs by Harry T. Burleigh and Stephen Lias",
      "A blend of spiritual depth and artistic expression",
      "Intimate venue settings for an immersive experience",
      "Perfect for lovers of classical and contemporary music"
    ],
    seasonTitle: "This Season's Featured Concerts",
    events: [
      {
        title: "Songs of the Land and Soul",
        description: "A journey through landscapes of spiritual depth and natural beauty.",
        date: "February 21, 2026 at 7:30 PM",
        venue: "Greenville Municipal Auditorium",
        seats: "200 seats available",
        price: "$45"
      }
    ],
    ticketUrl: "https://www.etix.com/ticket/p/47664643/mtvernon-music-greenville-greenville-municipal-auditorium"
  },
    windsOfChange: {
    title: "Winds of Change",
    subtitle: "Concert",
    description: "An evening of winds and piano — spirited, expressive, and full of character.",
    image: getImagePath("/WindsOfChange.png"),
    imageAlt: "Musicians performing with wind instruments and piano",
    aboutTitle: "About Winds of Change",
    aboutDescription: [
      "An evening of winds and piano — spirited, expressive, and full of character.",
      "This chamber concert showcases the dynamic textures and tonal colors",
      "that only winds can deliver. Full program to be announced."
    ],
    features: [
      "Dynamic performances featuring wind instruments and piano",
      "Expressive and spirited chamber music",
      "Unique tonal colors and textures",
      "Intimate venue settings for an immersive experience",
      "Perfect for lovers of classical and chamber music"
    ],
    seasonTitle: "This Season's Chamber Concerts",
    events: [
      {
        title: "Winds of Change",
        description: "A chamber concert featuring winds and piano, showcasing dynamic textures and tonal colors.",
        date: "May 5, 2026 at 7:30 PM",
        venue: "Greenville Concert Hall",
        seats: "150 seats available",
        price: "$40"
      }
    ],
    ticketUrl: "https://www.etix.com/ticket/p/76830549/winds-of-change-greenville-greenville-municipal-auditorium"
  },

  voicesInColor: {
    title: "Voices in Color",
    subtitle: "Concert",
    description: "Spring showcase featuring vibrant chamber music performances with diverse musical voices.",
    image: getImagePath("/VoicesInColor.png"),
    imageAlt: "Musicians performing vibrant chamber music",
    aboutTitle: "About Voices in Color",
    aboutDescription: [
      "Voices in Color celebrates the diversity and vibrancy of chamber music through performances that showcase different musical voices and styles. This spring concert features a carefully curated program that highlights the unique colors and textures that emerge when talented musicians come together.",
      "Each piece in this concert represents a different 'voice' in the chamber music repertoire, from intimate duos to larger ensemble works. The program explores how different instruments, composers, and musical traditions contribute their own distinct colors to the rich tapestry of classical music."
    ],
    features: [
      "Diverse repertoire showcasing different musical styles",
      "Performances by talented chamber musicians",
      "Intimate venue settings for optimal acoustic experience",
      "Educational program notes exploring musical diversity",
      "Collaborative performances highlighting ensemble artistry",
      "Perfect introduction to chamber music for new audiences"
    ],
    seasonTitle: "This Season's Chamber Concerts",
    events: [
      {
        title: "Voices in Color",
        description: "Spring showcase featuring vibrant chamber music performances with diverse musical voices.",
        date: "April 17, 2026 at 7:30 PM",
        venue: "Greenville Municipal Auditorium",
        seats: "150 seats available",
        price: "$40"
      }
    ],
    ticketUrl: "https://www.etix.com/ticket/p/34088588/voices-in-color-greenville-greenville-municipal-auditorium"
  },

  dhakaStandard: {
    title: "Global Grooves with Dhaka Standard",
    subtitle: "Concert",
    description: "Experience a unique fusion of classical traditions and international influences celebrating global musical heritage.",
    image: getImagePath("/GlobalGroovesWithDhakaStandard.png"),
    imageAlt: "Dhaka Standard performing international fusion music",
    aboutTitle: "About Global Grooves with Dhaka Standard",
    aboutDescription: [
      "The Global Grooves with Dhaka Standard concert series represents a groundbreaking approach to classical music, blending traditional Western classical repertoire with influences from South Asian musical traditions. These performances celebrate the universal language of music while honoring diverse cultural heritage.",
      "Each Dhaka Standard concert features carefully selected works that demonstrate the interconnectedness of global musical traditions. From classical masterpieces to contemporary compositions that bridge cultural divides, these performances offer audiences a unique perspective on the evolution and universality of musical expression."
    ],
    features: [
      "Fusion of Western classical and South Asian musical traditions",
      "International guest artists and cultural ambassadors",
      "Educational components exploring global musical heritage",
      "Contemporary compositions celebrating cultural diversity",
      "Interactive elements showcasing different musical instruments",
      "Post-concert discussions on cross-cultural musical influences"
    ],
    seasonTitle: "This Season's International Concerts",
    events: [
      {
        title: "Global Grooves with Dhaka Standard",
        description: "International concert celebrating global musical traditions and cross-cultural collaboration.",
        date: "April 25, 2026 at 7:30 PM",
        venue: "Greenville Municipal Auditorium",
        seats: "150 seats available",
        price: "$40"
      }
    ],
    ticketUrl: "https://www.etix.com/ticket/p/65088123/global-grooves-with-dhaka-standard-greenville-greenville-municipal-auditorium"
  },
}
