import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    )
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  try {
    const { concertId, quantity, customerEmail, customerName } = paymentIntent.metadata

    // Update purchase status to completed
    const { error: updateError } = await supabase
      .from('ticket_purchases')
      .update({ status: 'completed' })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    if (updateError) {
      console.error('Error updating purchase status:', updateError)
      return
    }

    // Reduce available seats
    const { error: seatError } = await supabase.rpc('reduce_available_seats', {
      concert_id: concertId,
      seats_to_reduce: parseInt(quantity)
    })

    if (seatError) {
      console.error('Error reducing available seats:', seatError)
      // Note: In production, you might want to implement a retry mechanism
    }

    console.log(`Payment successful for ${customerEmail}: ${quantity} tickets for concert ${concertId}`)
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailure(paymentIntent: any) {
  try {
    // Update purchase status to failed
    const { error: updateError } = await supabase
      .from('ticket_purchases')
      .update({ status: 'failed' })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    if (updateError) {
      console.error('Error updating purchase status:', updateError)
    }

    console.log(`Payment failed for payment intent: ${paymentIntent.id}`)
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}
