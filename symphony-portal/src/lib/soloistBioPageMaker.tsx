import SoloistBioPage from '@/components/SoloistBioPage'
import { getImagePath } from './imagePath'

interface SoloistBioData {
  name: string
  instrument: string
  image: string
  bio: string[]
  achievements?: string[]
}

export function soloistBioPageMaker(data: SoloistBioData) {
  return () => <SoloistBioPage {...data} />
}

// ============================================
// SOLOIST SLUG CONSTANTS - SINGLE SOURCE OF TRUTH
// Define each soloist slug ONCE here, use the constant everywhere
// ============================================
export const SOLOISTS = {
  AMI_CAMPBELL: 'ami-campbell',
  CRAIG_LEFFER: 'craig-leffer',
  DESIREE_ELSEVIER: 'desiree-elsevier',
  ELIZABETH_ELSNER: 'elizabeth-elsner',
  JASON_LIM: 'jason-lim-pops-conductor',
} as const

// Pre-defined soloist bio data - centralized like concert data
export const soloistBioData = {
  [SOLOISTS.AMI_CAMPBELL]: {
    name: 'Ami Campbell',
    instrument: 'Violin',
    image: getImagePath('/Orchestra-headshot-Ami-Campbell.png'),
    bio: [
      'Dallas Opera Concertmaster Ami Campbell (Davolt) previously served as Associate Concertmaster for 15 years, (including 3 years as acting Concertmaster). This season she will also continue to serve as Guest Concertmaster with The Atlanta Opera for their Ring Cycle.',
      'Previously, she held positions in the violin sections of The Seattle Symphony, The St Louis Symphony, The Colorado Symphony (including 1 yr as assistant concertmaster), The Portland Opera and others before settling in Dallas with her husband, DSO trumpeter Russell Campbell. In addition to these positions, she has performed as a frequent sub with The Dallas Symphony for many years and maintains a private violin studio.',
      'In the summer season, Ami takes part in the Bravo Vail Valley Music Festival (Colorado) and The Grand Teton Music Festival (Jackson Hole, WY). Ami\'s teachers included Raphael Spiro (Portland, OR), Sally Thomas and Steven Clapp (Juilliard), Henryk Kowalski (Indiana University) and Syoko Aki (Yale University). She was honored to have had additional studies with both Josef Gingold (Indiana) and Dorothy DeLay (Juilliard).',
      'Other engagements around the US have included guest artist with Pacific Northwest Ballet (associate concertmaster and soloist), Javalina Chamber Music Festival (which she founded in Tucson, AZ) Seattle Chamber Players, Seattle Opera, Music in the Mountains (Durango), Chintimini Chamber Music Festival (Oregon), Oregon Ballet Theater, Sarasota Opera, Cascade Music Festival, Vancouver Symphony (WA, Concertmaster), The Spoleto Festival (Charleston) and others.'
    ]
  },
  [SOLOISTS.CRAIG_LEFFER]: {
    name: 'Craig Leffer',
    instrument: 'Cello',
    image: getImagePath('/CraigLeffer.jpeg'),
    bio: [
      'Cellist Craig Leffer performs as a member of the Dallas Opera Orchestra, Texas Winds Musical Outreach, and as Artist-in-Residence for Baylor Scott & White Health. He has been Lecturer in Cello at the University of Texas at Arlington Department of Music since 2016.',

       'Leffer has previously served as principal cellist and soloist with the Midland-Odessa Symphony and Abilene Philharmonic Orchestra, and as a member of the Permian Basin String Quartet. Festival appearances include Bravo! Vail with the Dallas Symphony, National Repertory Orchestra, Kent Blossom, and as principal cellist of the New York String Orchestra Seminar at Carnegie Hall.',

       'A New York native, Leffer is a graduate of the Manhattan School of Music Preparatory Division and holds degrees in cello performance from the Eastman School of Music (BM) and Cleveland Institute of Music (MM), where he studied with Marion Feldman, Steven Doane, and Stephen Geber.'
    ]
  },
    [SOLOISTS.DESIREE_ELSEVIER]: {
    name: 'Désirée Elsevier',
    instrument: 'Viola',
    image: getImagePath('/Desiree_Elsevier.jpeg'),
    bio: [
      'A New York native, Désirée Elsevier was a full time member of the Metropolitan Opera Orchestra in New York until 2021.  She currently resides in Dallas, TX, playing extra with the Dallas Opera, the Austin Symphony and the Dallas Symphony Orchestra.  She can also be heard with Voices of Change in Dallas and the Victoria Bach Festival in Victoria, Texas.',
      'She is one of the principal violists of Classical Tahoe, a summer festival in Lake Tahoe, NV.  She has also been a coach at the Verbier Festival in Switzerland since 2015, and a coach at the Chamber Music Conference and Composer’s Forum of the East formerly of Bennington, VT.',
      'A member of the World Orchestra for Peace founded by Sir Georg Solti which performs concerts in the name of world peace an harmony across the world, from Chicago to Beijing.',
      'As a soloist, she performed the Bartok Concerto for Viola and Orchestra in Portland, OR and in Greeley,CO.  She also premiered Glen Cortese’s Viola Concerto  for viola and chamber orchestra with the Western New York Chamber Orchestra.',
      'Her first job was as Assistant Principal viola in the Orchestra di San Carlo, in Naples, Italy, where she learned to drive and negotiate (i.e. argue) in Italian.',
      'She can also be heard on numerous movie soundtracks and albums.',
      'She holds a Bachelor of Science in Economics from Cornell University from what is now the Dyson School of Economics, where she also studied music composition with Karl Husa and Stephen Stucky.  She went on to receive Bachelor and Master’s degrees in music from the Manhattan School of Music, studying with Lillian Fuchs and Karen Tuttle.',
      'The very, very, very best thing she ever did was to have two children, who are now two amazing and completely launched adults!'
    ]
  },

  [SOLOISTS.ELIZABETH_ELSNER]: {
    name: 'Elizabeth Elsner',
    instrument: 'Violin',
    image: getImagePath('/ElizabethElsner.JPG'),
    bio: [
      'Elizabeth Elsner is currently concertmaster of the Abilene Philharmonic and is an Adjunct Professor of Violin at The University of Texas at Arlington.  Since her move to the Dallas area, she has performed with the Fort Worth Symphony, the Dallas Opera, the East Texas Symphony, the Arkansas Symphony and other various area orchestras.',
      'Previously, Elizabeth held the position of concertmaster of the Midland/Odessa Symphony, and was a member of the Permian Basin Sting Quartet.    She received her Bachelor and Master of Music degrees from The Cleveland Institute of Music studying violin with Linda Cerone, Stephen Majeske and Stephen Rose,and chamber music with Peter Salaff and the Cavani Quartet.  She has been a member of the National Repertory Orchestra, Aspen Music Festival, Cleveland Pops Orchestra, and assistant concertmaster of the Peoria Symphony.'
    ]
  },
  [SOLOISTS.JASON_LIM]: {
    name: 'Jason Lim',
    instrument: 'Conductor',
    image: getImagePath('/PopsConductor.jpg'),
    bio: [
      'Jason Lim serves as Artistic Director and Conductor of the Greenville Pops Orchestra, leading the ensemble in its inaugural season. His passion for accessible, engaging programming and commitment to musical excellence make him the perfect visionary to launch this exciting new chapter in Greenville\'s cultural landscape.',
      'With a diverse background spanning classical and popular music, Jason brings a unique perspective to the podium. His conducting style combines technical precision with an infectious enthusiasm that resonates with both musicians and audiences alike.',
      'Jason\'s programming philosophy centers on creating memorable musical experiences that bridge the gap between classical tradition and contemporary entertainment. From beloved film scores and Broadway hits to jazz standards and pop arrangements, he curates concerts that celebrate the rich diversity of orchestral music while maintaining the highest artistic standards.',
      'Under his leadership, the Greenville Pops Orchestra has quickly established itself as a vital part of the community\'s cultural fabric, bringing joy and entertainment to audiences of all ages and musical backgrounds.'
    ]
  }
}
