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
    ticketUrl: "https://showtimeatthegma.com"
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
    title: "Ashley",
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
        date: "December 13, 2025 at 1:30 PM",
        venue: "Greenville Concert Hall",
        seats: "150 seats available",
        price: "$40"
      }
    ],
    ticketUrl: "https://tickets.example.com/ashley-concert"
  },

  gcms: {
    title: "GCMS",
    subtitle: "Concert",
    description: "Experience the Greenville Chamber Music Society's signature performances featuring our talented resident musicians and special guest artists in intimate chamber music settings.",
    image: getImagePath("/chamber.png"),
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
    ticketUrl: "https://tickets.example.com/gcms-concert"
  },

  eldred: {
    title: "Eldred",
    subtitle: "Concert",
    description: "Experience the artistry of Eldred in an intimate concert setting, featuring masterful interpretations of classical and contemporary repertoire.",
    image: getImagePath("/EldredMarshalInConcert.png"),
    imageAlt: "Eldred performing in concert",
    aboutTitle: "About Eldred Concerts",
    aboutDescription: [
      "Eldred concerts offer audiences a unique opportunity to experience classical music through the lens of exceptional artistry and deep musical understanding. These performances showcase a commitment to both traditional repertoire and innovative programming, creating memorable musical experiences that resonate long after the final note.",
      "Each Eldred performance is characterized by meticulous attention to detail, expressive interpretation, and a profound connection to the music. Whether presenting beloved classics or introducing audiences to lesser-known gems, these concerts demonstrate the transformative power of live classical music performance."
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
        venue: "Heritage Main Library",
        seats: "100 seats available",
        price: "$35"
      },
      {
        title: "Spring Recital",
        description: "A special spring performance featuring beloved classical favorites and innovative contemporary works.",
        date: "April 12, 2026 at 7:30 PM",
        venue: "Heritage Main Library",
        seats: "100 seats available",
        price: "$35"
      }
    ],
    ticketUrl: "https://tickets.example.com/eldred-concert"
  },

  AllStarChristmasConcert: {
    title: "All Star",
    subtitle: "Christmas Concert",
    description: "Celebrate the season with beloved holiday films accompanied by live orchestral music in this magical Christmas concert experience.",
    image: getImagePath("/AllStartChristmasConcert.png"),
    imageAlt: "All Star Christmas Concert - Holiday celebration with orchestra",
    aboutTitle: "About All Star Christmas Concert",
    aboutDescription: [
      "The All Star Christmas Concert brings the magic of the holiday season to life through beloved Christmas films and festive orchestral music. This special holiday performance combines the joy of cinema with the warmth of live orchestral accompaniment, creating an unforgettable seasonal celebration.",
      "Experience the wonder of Christmas through iconic holiday movies enhanced by beautiful live music. From classic Christmas films to modern holiday favorites, this concert captures the spirit of the season and brings families together for a truly magical musical experience."
    ],
    features: [
      "Live orchestral performances of beloved Christmas film scores",
      "Holiday movie clips synchronized with festive music",
      "Classic and contemporary Christmas film selections",
      "Professional orchestra with expert holiday arrangements",
      "Family-friendly holiday entertainment",
      "Festive atmosphere perfect for the Christmas season"
    ],
    seasonTitle: "This Season's Christmas Concerts",
    events: [
      {
        title: "Holiday Movie Magic",
        description: "Celebrate the season with beloved holiday films accompanied by live orchestral music.",
        date: "December 7, 2025 at 1:30 PM",
        venue: "Greenville Municipal Auditorium",
        seats: "500 seats available",
        price: "$35"
      }
    ],
    ticketUrl: "https://showtimeatthegma.com"
  }
}
