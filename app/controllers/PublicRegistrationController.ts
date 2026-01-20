import { Request, Response } from "../../type";
import DB from '../services/DB';
import Validator from '../services/Validator';
import { storeAttendeeSchema } from '../validators/AttendeeValidator';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Helper function to generate QR code
function generateQRCode(attendeeId: string, eventId: string): string {
  const timestamp = Date.now();
  const signature = crypto
    .createHmac('sha256', process.env.QR_CODE_SECRET || 'default-secret')
    .update(`${attendeeId}:${eventId}:${timestamp}`)
    .digest('hex')
    .substring(0, 16);

  return `${attendeeId}-${eventId}-${signature}`;
}

// Helper function to generate confirmation token
function generateConfirmationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

class PublicRegistrationController {
  async register(request: Request, response: Response) {
    const slug = request.params.slug;

    const event = await DB.from('events')
      .where('slug', slug)
      .where('is_public', true)
      .where('registration_open', true)
      .first();

    if (!event) {
      return response.status(404).send('Event not found or registration is closed');
    }

    // Check if registration period is valid
    const now = Date.now();
    if (event.registration_start && now < new Date(event.registration_start).getTime()) {
      return response.status(404).send('Registration has not started yet');
    }

    if (event.registration_end && now > new Date(event.registration_end).getTime()) {
      return response.status(404).send('Registration has ended');
    }

    const eventSettings = await DB.from('event_settings')
      .where('event_id', event.id)
      .first();

    if (eventSettings?.custom_fields) {
      eventSettings.custom_fields = JSON.parse(eventSettings.custom_fields);
    }
 
    return response.inertia('public/register', {
      event,
      eventSettings
    },{
      app_title : event.name
    });
  }

  async store(request: Request, response: Response) {
    const slug = request.params.slug;
    const body = await request.json();

    const event = await DB.from('events')
      .where('slug', slug)
      .where('is_public', true)
      .where('registration_open', true)
      .first();

    if (!event) {
      return response.status(404).send('Event not found or registration is closed');
    }

    // Check if registration period is valid
    const now = Date.now();
    if (event.registration_start && now < new Date(event.registration_start).getTime()) {
      return response.status(404).send('Registration has not started yet');
    }

    if (event.registration_end && now > new Date(event.registration_end).getTime()) {
      return response.status(404).send('Registration has ended');
    }

    const validationResult = Validator.validate(storeAttendeeSchema, body);

    if (!validationResult.success) {
      const errors = validationResult.errors || {};
      const firstError = Object.values(errors)[0]?.[0] || 'Validation failed';
      return response.flash('error', firstError).redirect(`/events/${slug}/register`, 302);
    }

    const data = validationResult.data!;

    try {
      // Check if email already registered for this event
      const existingAttendee = await DB.from('attendees')
        .where('event_id', event.id)
        .where('email', data.email)
        .first();

      if (existingAttendee) {
        return response.flash('error', 'Email already registered for this event').redirect(`/events/${slug}/register`, 302);
      }

      const attendeeId = uuidv4();
      const qrCode = generateQRCode(attendeeId, event.id);
      const confirmationToken = generateConfirmationToken();

      await DB.table('attendees').insert({
        id: attendeeId,
        event_id: event.id,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        job_title: data.job_title || null,
        gender: data.gender || null,
        custom_data: data.custom_data ? JSON.parse(data.custom_data) : null,
        qr_code: qrCode,
        status: 'registered',
        registration_method: 'self',
        registered_at: new Date(),
        notes: null,
        created_by: null,
        created_at: Date.now(),
        updated_at: Date.now()
      });

      // Store confirmation token (could be stored in attendees table or separate table)
      await DB.from('attendees')
        .where('id', attendeeId)
        .update({
          custom_data: JSON.stringify({
            ...data.custom_data ? JSON.parse(data.custom_data) : {},
            confirmation_token: confirmationToken
          })
        });

      // TODO: Send confirmation email with token
      // For now, redirect to confirmation page with token
      return response.redirect(`/events/${slug}/confirm/${confirmationToken}`, 302);
    } catch (error: any) {
      console.log('[PublicRegistrationController.store] Error:', error);
      return response.flash('error', 'Failed to register: ' + (error.message || 'Unknown error')).redirect(`/events/${slug}/register`, 302);
    }
  }

  async confirm(request: Request, response: Response) {
    const slug = request.params.slug;
    const token = request.params.token;

    const event = await DB.from('events')
      .where('slug', slug)
      .where('is_public', true)
      .first();

    if (!event) {
      return response.status(404).send('Event not found');
    }

    // Find attendee by confirmation token
    const attendees = await DB.from('attendees')
      .where('event_id', event.id)
      .select('*');

    let attendee = null;
    for (const att of attendees) {
      try {
        const customData = att.custom_data ? JSON.parse(att.custom_data) : {};
        if (customData.confirmation_token === token) {
          attendee = att;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!attendee) {
      return response.status(404).send('Invalid confirmation token');
    }

    return response.inertia('public/confirm', {
      attendee,
      event
    });
  }

  async ticket(request: Request, response: Response) {
    const slug = request.params.slug;
    const id = request.params.id;

    const event = await DB.from('events')
      .where('slug', slug)
      .first();

    if (!event) {
      return response.status(404).send('Event not found');
    }

    const attendee = await DB.from('attendees')
      .where('id', id)
      .where('event_id', event.id)
      .first();

    if (!attendee) {
      return response.status(404).send('Ticket not found');
    }

    return response.inertia('public/ticket', {
      attendee,
      event
    });
  }
}

export default new PublicRegistrationController();
