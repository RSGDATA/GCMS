/**
 * Data Contract Export
 * 
 * This module provides a stable API contract for exporting concert and soloist data
 * to the data pipeline. The contract is versioned to track breaking changes.
 * 
 * Benefits:
 * - Website can be refactored without breaking the pipeline
 * - Type-safe at source (TypeScript)
 * - Explicit versioning
 * - Self-documenting
 */

import { concertData, Concert } from './concertData'
import { soloistData, SoloistBio } from './soloistData'

/**
 * Program piece information for a concert
 */
export interface ConcertProgram {
  piece_id: string
  composer: string
  piece_title: string
  movement?: string
  duration_minutes?: number
  order_in_program: number
}

/**
 * Extended concert interface with program and soloist information
 */
export interface ConcertWithProgram extends Concert {
  program?: ConcertProgram[]
  soloists?: string[]  // Array of soloist slugs
  images?: string[]
  program_notes?: string
  conductor?: string
  ensemble?: string
}

/**
 * Data Contract - Stable interface between website and data pipeline
 * Version 1.0.0
 */
export interface DataContract {
  version: string
  exported_at: string
  concerts: ConcertWithProgram[]
  soloists: SoloistBio[]
}

/**
 * Export the complete data contract
 * This is the single source of truth for the data pipeline
 */
export function exportDataContract(): DataContract {
  return {
    version: '1.0.0',
    exported_at: new Date().toISOString(),
    concerts: concertData as ConcertWithProgram[],
    soloists: Object.values(soloistData)
  }
}

/**
 * Get concerts that have already happened (past concerts)
 * Used by the data pipeline to load only completed concerts
 */
export function getPastConcerts(): ConcertWithProgram[] {
  const now = new Date()
  return (concertData as ConcertWithProgram[]).filter(concert => {
    const concertDate = new Date(concert.date)
    return concertDate < now
  })
}

/**
 * Get concerts for a specific date
 */
export function getConcertsForDate(date: Date): ConcertWithProgram[] {
  return (concertData as ConcertWithProgram[]).filter(concert => {
    const concertDate = new Date(concert.date)
    return concertDate.toDateString() === date.toDateString()
  })
}

/**
 * Validate data contract structure
 * Ensures all required fields are present
 */
export function validateDataContract(contract: DataContract): boolean {
  // Check version
  if (!contract.version || typeof contract.version !== 'string') {
    return false
  }
  
  // Check exported_at
  if (!contract.exported_at || isNaN(Date.parse(contract.exported_at))) {
    return false
  }
  
  // Check concerts array
  if (!Array.isArray(contract.concerts)) {
    return false
  }
  
  // Validate each concert has required fields
  for (const concert of contract.concerts) {
    if (!concert.id || !concert.title || !concert.date || !concert.venue) {
      return false
    }
  }
  
  // Check soloists array
  if (!Array.isArray(contract.soloists)) {
    return false
  }
  
  return true
}
