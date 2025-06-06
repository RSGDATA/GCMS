import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { sanitizeInput, validateEmail } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { concertId, quantity, customerEmail, customerName } = body

    // Validate inputs
    if (!concertId || !quantity || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      concertId: sanitizeInput(concertId),
      quantity: parseInt(quantity),
      customerEmail: sanitizeInput(customerEmail),
      customerName: sanitizeInput(customerName)
    }

    // Validate email
    if (!validateEmail(sanitizedData.customerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Validate quantity
    if (isNaN(sanitizedData.quantity) || sanitizedData.quantity < 1 || sanitizedData.quantity > 10) {
      return NextResponse.json(
        { error: 'Invalid ticket quantity' },
        { status: 400 }
      )
    }

    // Get concert details
    const concertQuery = supabase
      .from('concerts')
      .select('*')
      .eq('id', sanitizedData.concertId)
      .single()
    
    const { data: concert, error: concertError } = await concertQuery

    if (concertError || !concert) {
      return NextResponse.json(
        { error: 'Concert not found' },
        { status: 404 }
      )
    }

    // Check availability
    if (concert.available_seats < sanitizedData.quantity) {
      return NextResponse.json(
        { error: 'Not enough tickets available' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const totalAmount = concert.ticket_price * sanitizedData.quantity

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        concertId: sanitizedData.concertId,
        quantity: sanitizedData.quantity.toString(),
        customerEmail: sanitizedData.customerEmail,
        customerName: sanitizedData.customerName,
      },
      receipt_email: sanitizedData.customerEmail,
      description: `${sanitizedData.quantity} ticket(s) for ${concert.title}`,
    })

    // Store pending purchase in database
    const { error: insertError } = await supabase
      .from('ticket_purchases')
      .insert({
        concert_id: sanitizedData.concertId,
        customer_email: sanitizedData.customerEmail,
        customer_name: sanitizedData.customerName,
        quantity: sanitizedData.quantity,
        total_amount: totalAmount,
        stripe_payment_intent_id: paymentIntent.id,
        status: 'pending'
      })

    if (insertError) {
      console.error('Error storing purchase:', insertError)
      // Continue anyway, as the payment intent was created
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      totalAmount: totalAmount
    })

  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
