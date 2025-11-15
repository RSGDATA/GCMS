import { soloistBioPageMaker, soloistBioData, SOLOISTS } from '@/lib/soloistBioPageMaker'

// Map of slug to soloist data key - using constants from central source
const soloistRoutes: { [key: string]: keyof typeof soloistBioData } = {
  [SOLOISTS.AMI_CAMPBELL]: SOLOISTS.AMI_CAMPBELL,
  [SOLOISTS.CRAIG_LEFFER]: SOLOISTS.CRAIG_LEFFER,
  [SOLOISTS.DESIREE_ELSEVIER]: SOLOISTS.DESIREE_ELSEVIER,
  [SOLOISTS.ELIZABETH_ELSNER]: SOLOISTS.ELIZABETH_ELSNER,
}

interface SoloistPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function SoloistPage({ params }: SoloistPageProps) {
  const { slug } = await params
  const dataKey = soloistRoutes[slug]
  
  if (!dataKey || !soloistBioData[dataKey]) {
    // Return a simple not found component
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-900 mb-4">Soloist Not Found</h1>
          <p className="text-gray-600">The soloist you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const SoloistBioPageComponent = soloistBioPageMaker(soloistBioData[dataKey])
  return <SoloistBioPageComponent />
}

// Generate static params for all soloists
export async function generateStaticParams() {
  return Object.keys(soloistRoutes).map((slug) => ({
    slug,
  }))
}

// Generate metadata for each soloist page
export async function generateMetadata({ params }: SoloistPageProps) {
  const { slug } = await params
  const dataKey = soloistRoutes[slug]
  
  if (!dataKey || !soloistBioData[dataKey]) {
    return {
      title: 'Soloist Not Found',
    }
  }

  const soloist = soloistBioData[dataKey]

  return {
    title: `${soloist.name} - ${soloist.instrument} | GCMS`,
    description: soloist.bio[0],
  }
}
