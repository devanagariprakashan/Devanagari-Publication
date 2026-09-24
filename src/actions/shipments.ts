'use server'
import { revalidatePath } from 'next/cache'
import { createIthinkShipment, trackIthinkShipment, getIthinkRates, type ShipmentTracking, type CourierRate } from '@/lib/ithink'
import { createAdminClient } from '@/lib/supabase/admin'

export type CreateShipmentResult =
  | { success: true; waybill: string | null }
  | { error: string }

export type TrackShipmentResult =
  | { success: true; tracking: ShipmentTracking }
  | { error: string }

export type CheckRatesResult =
  | { success: true; rates: CourierRate[] }
  | { error: string }

export async function checkRatesAction(orderId: string, formData: FormData): Promise<CheckRatesResult> {
  const field = (key: string) => ((formData.get(key) as string) || '').trim()
  try {
    const admin = createAdminClient()
    const { data: order, error } = await admin.from('orders').select('pincode,payment_method,total_amount').eq('id', orderId).maybeSingle()
    if (error) throw error
    if (!order?.pincode) return { error: 'This order has no delivery pincode on file.' }

    const rates = await getIthinkRates({
      toPincode: order.pincode,
      length: field('length') || '10',
      width: field('width') || '10',
      height: field('height') || '10',
      weight: field('weight') || '0.5',
      paymentMethod: order.payment_method === 'cod' ? 'cod' : 'prepaid',
      productMrp: String(order.total_amount ?? '0'),
    })
    return { success: true, rates }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Could not fetch live rates.' }
  }
}

export async function trackShipmentAction(awb: string): Promise<TrackShipmentResult> {
  try {
    const tracking = await trackIthinkShipment(awb)
    return { success: true, tracking }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Could not fetch tracking details.' }
  }
}

export async function createShipmentAction(orderId: string, formData: FormData): Promise<CreateShipmentResult> {
  const field = (key: string) => ((formData.get(key) as string) || '').trim() || undefined

  try {
    const result = await createIthinkShipment(orderId, {
      length: field('length'),
      width: field('width'),
      height: field('height'),
      weight: field('weight'),
      courier: field('courier'),
      serviceType: field('serviceType'),
    })
    revalidatePath('/admin/orders')

    switch (result.status) {
      case 'created':
        return { success: true, waybill: result.waybill ?? null }
      case 'already_created':
        return { error: 'A shipment already exists for this order.' }
      case 'already_processing':
        return { error: 'A shipment request for this order is already in progress. Try again in a moment.' }
      case 'not_configured':
        return { error: 'iThink Logistics API credentials are not configured on the server.' }
      case 'failed':
        return { error: result.error }
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Shipment creation failed unexpectedly.' }
  }
}
