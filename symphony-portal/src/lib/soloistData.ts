export interface SoloistBio {
  slug: string
  name: string
  instrument: string
  image: string
  bio: string[]
  achievements?: string[]
}

// Centralized soloist bio data
export const soloistData: { [key: string]: SoloistBio } = {
  'jane-virtuoso': {
    slug: 'jane-virtuoso',
    name: 'Jane Virtuoso',
    instrument: 'Piano',
    image: '/soloist.jpg', // Using existing placeholder image
    bio: [
      'Jane Virtuoso is an internationally acclaimed pianist known for her passionate interpretations and technical brilliance. With performances spanning five continents, she has captivated audiences at prestigious venues including Carnegie Hall, Royal Albert Hall, and the Sydney Opera House.',
      'A graduate of the Juilliard School, Jane studied under renowned pedagogues and has won numerous international competitions. Her repertoire ranges from baroque masterpieces to contemporary works, with a particular affinity for Romantic-era compositions.',
      'Beyond her solo career, Jane is dedicated to music education and frequently conducts masterclasses at leading conservatories. She has recorded several critically acclaimed albums and continues to push the boundaries of piano performance through innovative programming and collaborations.'
    ],
    achievements: [
      'Winner, International Chopin Piano Competition',
      'Soloist with New York Philharmonic, Berlin Philharmonic',
      'Recording Artist with Deutsche Grammophon',
      'Professor of Piano, Manhattan School of Music',
      'Recipient, Avery Fisher Career Grant'
    ]
  },
  'michael-strings': {
    slug: 'michael-strings',
    name: 'Michael Strings',
    instrument: 'Violin',
    image: '/soloist.jpg', // Using existing placeholder image
    bio: [
      'Michael Strings has established himself as one of the most versatile violinists of his generation. His performances blend technical mastery with deep musical insight, bringing fresh perspectives to both classical and contemporary repertoire.',
      'Trained at the Curtis Institute of Music, Michael has performed as soloist with major orchestras worldwide and is a sought-after chamber musician. His interpretations of Bach, Beethoven, and Brahms have been praised for their clarity and emotional depth.',
      'Michael is also an advocate for new music, having premiered works by leading contemporary composers. He plays on a rare 1742 Guarneri del Gesù violin, generously on loan from a private collection.'
    ],
    achievements: [
      'First Prize, Queen Elisabeth Competition',
      'Concertmaster, Chamber Orchestra of Europe',
      'Founding Member, Virtuoso String Quartet',
      'Commissioner of 15+ new violin works',
      'Grammy Nominee for Best Classical Instrumental Solo'
    ]
  }
}

// Helper function to get soloist by slug
export const getSoloistBySlug = (slug: string): SoloistBio | undefined => {
  return soloistData[slug]
}

// Helper function to get all soloists
export const getAllSoloists = (): SoloistBio[] => {
  return Object.values(soloistData)
}

// Helper function to get multiple soloists by slugs
export const getSoloistsBySlugs = (slugs: string[]): SoloistBio[] => {
  return slugs.map(slug => soloistData[slug]).filter(Boolean)
}
