import ConcertPageBio from '../components/ConcertPageBio'
import { getImagePath } from './imagePath'
import { soloistBioData, SOLOISTS } from './soloistBioPageMaker'

interface SoloistInfo {
  slug: string
  name: string
  instrument: string
  image: string
  bio: string
}

interface ConcertDataBio {
  title: string
  subtitle: string
  description: string
  image: string
  imageAlt: string
  aboutTitle: string
  aboutDescription: string[]
  features: string[]
  seasonTitle: string
  ticketUrl: string
  soloists?: string[] // Array of soloist slugs
}

export function concertPageMakerBio(data: ConcertDataBio) {
  // Transform soloist slugs into full soloist info
  const soloistInfo: SoloistInfo[] | undefined = data.soloists?.map(slug => {
    const soloist = soloistBioData[slug as keyof typeof soloistBioData]
    return {
      slug,
      name: soloist.name,
      instrument: soloist.instrument,
      image: soloist.image,
      bio: soloist.bio[0] // First paragraph for preview
    }
  })

  return () => <ConcertPageBio {...data} soloists={soloistInfo} />
}

// Pre-defined concert data with bio links - centralized like concert data
export const concertDataBio = {
  testConcertWithSoloists: {
    title: "Echoes Through Time",
    subtitle: "",
    description: "This evocative program journeys through the expressive power of the string quartet, from the refined depths of Mozart to the soulful lyricism of Dvořák and the radiant voice of Florence Price.",
    image: getImagePath("/ABCD_Poster.png"),
    imageAlt: "Echoes Through Time Concert",
    aboutTitle: "Program Notes: Classical to Modern Elegance",
    aboutDescription: [
      "This evocative program journeys through the expressive power of the string quartet, from the refined depths of Mozart to the soulful lyricism of Dvořák and the radiant voice of Florence Price.",
      "W.A. Mozart – String Quartet in D Minor, K.421: A masterpiece of Classical intensity, Mozart's D minor quartet brims with dramatic contrasts and exquisite balance. Its poised melodies and intricate dialogue between instruments reveal Mozart at his most emotionally raw and harmonically daring.",
      "Antonín Dvořák – Cypresses: Originally conceived as songs of love and longing, Dvořák's Cypresses transform into intimate miniatures for string quartet—each one a tender reflection of unspoken emotions and romantic nostalgia.",
      "Florence Price – String Quartet in G Major (Unfinished, 1929): With warmth and lyric grace, Price blends European formalism with spiritual and folk-inspired melodies. Though unfinished, her G Major Quartet radiates brilliance and heartfelt sincerity, offering a glimpse into one of America's most important musical voices.",
      "Together, these works trace a path from Classical elegance to Romantic expression and the rich modern soundscape of Price—performed by world-class musicians in an evening of timeless beauty and emotional depth."
    ],
    features: [
      "<strong>W.A. Mozart</strong> – String Quartet in D Minor, K.421",
      "        I. Allegro Moderato",
      "        II. Andante",
      "        III. Menuetto and Trio",
      "        IV. Allegretto ma non troppo",
      "<strong>Antonín Dvořák</strong> – Cypresses",
      "<strong>Florence Price</strong> – String Quartet in G Major (Unfinished, 1929)",
      "        I. Allegro",
      "        II. Andante Moderato"
    ],
    seasonTitle: "This Season's Test Concerts",
    ticketUrl: "https://www.etix.com/ticket/p/00000000/test-concert-greenville-greenville-municipal-auditorium",
    soloists: [SOLOISTS.AMI_CAMPBELL, SOLOISTS.ELIZABETH_ELSNER, SOLOISTS.CRAIG_LEFFER, SOLOISTS.DESIREE_ELSEVIER] // Reference soloist slugs using constants
  }
}
