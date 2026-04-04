/**
 * Data Export API Endpoint
 * 
 * Provides a stable REST API for the data pipeline to extract concert and soloist data.
 * This endpoint returns the data contract that can be consumed by external systems.
 * 
 * Endpoint: GET /api/data-export
 * 
 * Response: JSON data contract with version, timestamp, concerts, and soloists
 * 
 * Usage:
 * - Data pipeline calls this endpoint daily
 * - Returns all concert and soloist data
 * - Versioned for breaking change tracking
 */

import { NextResponse } from 'next/server'
import { exportDataContract, validateDataContract } from '@/lib/dataExport'

export const dynamic = 'force-static'

export async function GET() {
  try {
    // Export the data contract
    const dataContract = exportDataContract()
    
    // Validate the contract structure
    const isValid = validateDataContract(dataContract)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid data contract structure' },
        { status: 500 }
      )
    }
    
    // Return the data contract with appropriate headers
    return NextResponse.json(dataContract, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Data-Contract-Version': dataContract.version,
        'X-Exported-At': dataContract.exported_at
      }
    })
  } catch (error) {
    console.error('Error exporting data contract:', error)
    return NextResponse.json(
      { error: 'Failed to export data contract' },
      { status: 500 }
    )
  }
}

// Optional: Add OPTIONS for CORS if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}
