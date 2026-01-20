/**
 * Event Validation Schemas
 * Schemas for EventController
 */

import { z } from 'zod';
import { field } from './CommonValidator';

/**
 * Store event schema
 * Used by: EventController.store
 */
export const storeEventSchema = z.object({
  name: z.string().min(2, 'Event name must be at least 2 characters').max(255, 'Event name must be at most 255 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(255, 'Slug must be at most 255 characters').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and dashes'),
  description: z.string().optional(),
  type: z.enum(['conference', 'workshop', 'concert', 'seminar', 'webinar', 'meetup', 'exhibition', 'sports'], {
    message: 'Please select a valid event type'
  }),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  location: z.string().max(255, 'Location must be at most 255 characters').optional(),
  city: z.string().max(255, 'City must be at most 255 characters').optional(),
  province: z.string().max(255, 'Province must be at most 255 characters').optional(),
  venue: z.string().max(255, 'Venue must be at most 255 characters').optional(),
  address: z.string().optional(),
  capacity: z.coerce.number().int({ message: 'Capacity must be a whole number' }).positive({ message: 'Capacity must be greater than 0' }).optional(),
  image: z.string().url({ message: 'Image must be a valid URL' }).optional().or(z.literal('')),
  is_public: z.coerce.boolean().default(false),
  registration_open: z.coerce.boolean().default(true),
  registration_start: z.string().optional(),
  registration_end: z.string().optional(),
  checkin_start: z.string().optional(),
  checkin_end: z.string().optional(),
  entry_system: z.enum(['qr', 'manual', 'kiosk', 'bulk'], {
    message: 'Please select a valid entry system'
  }).default('qr'),
  status: z.enum(['draft', 'published', 'ongoing', 'completed', 'cancelled'], {
    message: 'Please select a valid event status'
  }).default('draft'),
}).refine(
  (data) => {
    if (!data.start_date || !data.end_date) return true;
    return new Date(data.start_date) <= new Date(data.end_date);
  },
  {
    message: 'Start date must be before end date',
    path: ['start_date'],
  }
).refine(
  (data) => {
    if (!data.registration_start || !data.registration_end) return true;
    return new Date(data.registration_start) <= new Date(data.registration_end);
  },
  {
    message: 'Registration start must be before registration end',
    path: ['registration_start'],
  }
).refine(
  (data) => {
    if (!data.checkin_start || !data.checkin_end) return true;
    return new Date(data.checkin_start) <= new Date(data.checkin_end);
  },
  {
    message: 'Check-in start must be before check-in end',
    path: ['checkin_start'],
  }
);

/**
 * Update event schema
 * Used by: EventController.update
 */
export const updateEventSchema = z.object({
  name: z.string().min(2, 'Event name must be at least 2 characters').max(255, 'Event name must be at most 255 characters').optional(),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(255, 'Slug must be at most 255 characters').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and dashes').optional(),
  description: z.string().optional(),
  type: z.enum(['conference', 'workshop', 'concert', 'seminar', 'webinar', 'meetup', 'exhibition', 'sports'], {
    message: 'Please select a valid event type'
  }).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  location: z.string().max(255, 'Location must be at most 255 characters').optional(),
  city: z.string().max(255, 'City must be at most 255 characters').optional(),
  province: z.string().max(255, 'Province must be at most 255 characters').optional(),
  venue: z.string().max(255, 'Venue must be at most 255 characters').optional(),
  address: z.string().optional(),
  capacity: z.coerce.number().int({ message: 'Capacity must be a whole number' }).positive({ message: 'Capacity must be greater than 0' }).optional(),
  image: z.string().url({ message: 'Image must be a valid URL' }).optional().or(z.literal('')).optional(),
  is_public: z.coerce.boolean().optional(),
  registration_open: z.coerce.boolean().optional(),
  registration_start: z.string().optional(),
  registration_end: z.string().optional(),
  checkin_start: z.string().optional(),
  checkin_end: z.string().optional(),
  entry_system: z.enum(['qr', 'manual', 'kiosk', 'bulk'], {
    message: 'Please select a valid entry system'
  }).optional(),
  status: z.enum(['draft', 'published', 'ongoing', 'completed', 'cancelled'], {
    message: 'Please select a valid event status'
  }).optional(),
}).refine(
  (data) => {
    if (!data.start_date || !data.end_date) return true;
    return new Date(data.start_date) <= new Date(data.end_date);
  },
  {
    message: 'Start date must be before end date',
    path: ['start_date'],
  }
).refine(
  (data) => {
    if (!data.registration_start || !data.registration_end) return true;
    return new Date(data.registration_start) <= new Date(data.registration_end);
  },
  {
    message: 'Registration start must be before registration end',
    path: ['registration_start'],
  }
).refine(
  (data) => {
    if (!data.checkin_start || !data.checkin_end) return true;
    return new Date(data.checkin_start) <= new Date(data.checkin_end);
  },
  {
    message: 'Check-in start must be before check-in end',
    path: ['checkin_start'],
  }
);

/**
 * Event settings schema
 * Used by: EventController.settings
 */
export const eventSettingsSchema = z.object({
  require_approval: z.coerce.boolean().default(false),
  custom_fields: z.string().optional(),
  allow_self_registration: z.coerce.boolean().default(true),
  enable_gender: z.coerce.boolean().default(false),
  allow_duplicate_checkin: z.coerce.boolean().default(false),
  require_verification: z.coerce.boolean().default(false),
  send_confirmation_email: z.coerce.boolean().default(true),
  send_qr_email: z.coerce.boolean().default(true),
  timezone: z.string().max(50).default('UTC'),
  locale: z.string().max(10).default('en'),
});

/**
 * Add event member schema
 * Used by: EventController.addMember
 */
export const addEventMemberSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  role: z.enum(['manager', 'staff']).default('staff'),
});

/**
 * Update event member schema
 * Used by: EventController.updateMember
 */
export const updateEventMemberSchema = z.object({
  role: z.enum(['manager', 'staff']),
});
