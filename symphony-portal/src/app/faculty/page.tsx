'use client'

import Link from 'next/link'
import { Music, ArrowLeft } from 'lucide-react'

export default function FacultyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          href="/about"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to About
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
            Our Faculty
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Meet our distinguished faculty of world-class musicians and educators 
            who bring passion, expertise, and dedication to every lesson and performance.
          </p>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Robert Gonzalez</h3>
                <p className="text-blue-600 font-medium">Violin Faculty</p>
              </div>
              <p className="text-gray-600 mb-4">
                Robert Gonzalez is a professional violinist and dedicated music educator based in Texas. He earned his degree in violin performance in 2016 from Texas Tech University and has since performed with several respected ensembles, including the Lubbock Symphony, Wichita Falls Symphony, Las Colinas Symphony, and the Dallas Opera. Robert’s passion for performance began early—at age 15, he was featured as a soloist with the Dallas Symphony Orchestra, performing Kreisler’s Preludium and Allegro.
                In addition to his performance career, Robert is committed to music education. He maintains a thriving private violin studio and spent many years teaching in various after-school programs, where he helped young musicians develop both technical skill and artistic expression. Known for his expressive playing and thoughtful teaching approach, Robert bridges his experience on professional stages with a deep passion for nurturing the next generation of violinists.
              </p>
              <div className="text-sm text-gray-500">
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Giordi Frederick</h3>
                <p className="text-blue-600 font-medium">Piano Faculty</p>
              </div>
              <p className="text-gray-600 mb-4">
                Giordi Frederick is a classically trained pianist and composer based in North Texas. He holds a degree in piano performance from East Texas A&M University and has been performing for over 24 years. His career spans both domestic and international stages, with a particular focus on solo and collaborative work in the Dallas–Fort Worth area. In addition to his classical foundation, Mr. Frederick serves as pianist, arranger, and composer for Dhaka Standard, an international jazz ensemble based in Dhaka, Bangladesh. His versatility as a performer is matched by his dedication to the craft of piano itself; for nearly a decade, he has owned and operated a respected piano tuning and restoration business in the DFW area. Mr. Frederick’s work reflects a deep commitment to musical excellence, cross-cultural collaboration, and the preservation of the piano tradition.
              </p>
              <div className="text-sm text-gray-500">
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Ashley Alarcon</h3>
                <p className="text-blue-600 font-medium">Flute Faculty & Conductor</p>
              </div>
              <p className="text-gray-600 mb-4">
                Ashley Alarcon is known for her engaging, inclusive, imaginative, and interactive approach  to  music.  She  is  a  professional  flutist,  educator,  arts  advocate,  and conductor  based  in  Dallas,  Texas.  She  holds  a  Masters  of  Music  in  Flute Performance  from  the  University  of  New  Mexico,  and  has  certificates  from  the Curtis Institute Mentor Network, Suzuki Flute Book 1 and philosophy Every Child Can, and is an alumnus of the prestigious Teaching Artist Training Institute.   Ms. Alarcon currently serves as the Young Musicians Manager of Teaching and Learning for the Dallas Symphony Orchestra. Her passion for using wholesome and  inclusive  approaches  to  education  has  helped  children  overcome underperformance at school and become more engaged and confident individuals. Her interest in education also extends to  mentoring Teaching Artists build upon their  existing  performance  foundation  to  enhance  their  educational  skills  in  the classroom.   As a performer, Alarcon freelances within the DFW Metroplex and, has served as interim  Principal  Flute  with  the  Queretaro  Philharmonic,  Mexico,  and  has collaborated with the Mexico City Philharmonic, Eduardo Mata Youth Orchestra, and the Mexico City Grand Opera Orchestra
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Hamin Kim</h3>
                <p className="text-blue-600 font-medium">Artist in residence</p>
              </div>
              <p className="text-gray-600 mb-4">
                Bio
              </p>
            </div>
          </div>
        </div>
        
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-light mb-6">Learn from the Best</h2>
          <p className="text-xl mb-8 opacity-90">
            Our faculty members are not only accomplished performers but also dedicated educators 
            committed to nurturing the next generation of musicians.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/students/signup"
              className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition-colors"
            >
              Join Our Programs
            </Link>
            <Link 
              href="/concerts"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors border border-white"
            >
              See Them Perform
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  )
}
