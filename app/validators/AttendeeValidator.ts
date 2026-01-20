/**
 * Attendee Validation Schemas
 * Schemas for AttendeeController
 */

import { z } from 'zod';
import { field } from './CommonValidator';

/**
 * Store attendee schema
 * Used by: AttendeeController.store
 */
export const storeAttendeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255, 'Name must be at most 255 characters'),
  email: z.string().email('Invalid email address').max(255, 'Email must be at most 255 characters'),
  phone: z.string().max(50, 'Phone must be at most 50 characters').optional(),
  company: z.string().max(255, 'Company must be at most 255 characters').optional(),
  job_title: z.string().max(255, 'Job title must be at most 255 characters').optional(),
  custom_data: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Update attendee schema
 * Used by: AttendeeController.update
 */
export const updateAttendeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255, 'Name must be at most 255 characters').optional(),
  email: z.string().email('Invalid email address').max(255, 'Email must be at most 255 characters').optional(),
  phone: z.string().max(50, 'Phone must be at most 50 characters').optional(),
  company: z.string().max(255, 'Company must be at most 255 characters').optional(),
  job_title: z.string().max(255, 'Job title must be at most 255 characters').optional(),
  custom_data: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['registered', 'checked_in', 'cancelled', 'no_show']).optional(),
});

/**
 * Import attendees schema
 * Used by: AttendeeController.import
 */
export const importAttendeesSchema = z.object({
  file: z.any(),
  send_email: z.coerce.boolean().default(true),
});
