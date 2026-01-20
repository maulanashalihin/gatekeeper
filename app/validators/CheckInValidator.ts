import { z } from 'zod';

export const scanCheckInSchema = z.object({
  qr_code: z.string().min(1, 'QR code is required')
});

export const manualCheckInSchema = z.object({
  attendee_id: z.string().min(1, 'Attendee ID is required'),
  notes: z.string().optional()
});

export const undoCheckInSchema = z.object({
  attendee_id: z.string().min(1, 'Attendee ID is required')
});
