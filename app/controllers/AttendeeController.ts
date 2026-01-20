import { Request, Response } from "../../type";
import DB from '../services/DB';
import Validator from '../services/Validator';
import { storeAttendeeSchema, updateAttendeeSchema, importAttendeesSchema } from '../validators/AttendeeValidator';
import { v4 as uuidv4 } from 'uuid';
import { uuidv7 } from 'uuidv7';
import crypto from 'crypto';

// Helper functions
function generateQRCode(attendeeId: string, eventId: string): string {
  const timestamp = Date.now();
  const signature = crypto
    .createHmac('sha256', process.env.QR_CODE_SECRET || 'default-secret')
    .update(`${attendeeId}:${eventId}:${timestamp}`)
    .digest('hex')
    .substring(0, 16);

  return `${attendeeId}-${eventId}-${signature}`;
}

function parseCSV(content: string): any[] {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const attendees: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const attendee: any = {};

    headers.forEach((header, index) => {
      if (header === 'name') attendee.name = values[index];
      else if (header === 'email') attendee.email = values[index];
      else if (header === 'phone') attendee.phone = values[index];
      else if (header === 'company') attendee.company = values[index];
      else if (header === 'job_title') attendee.job_title = values[index];
    });

    if (attendee.name) {
      attendees.push(attendee);
    }
  }

  return attendees;
}

class AttendeeController {
  async index(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const eventUuid = request.params.event_uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const attendees = await DB.from('attendees')
      .leftJoin('users', 'attendees.created_by', 'users.id')
      .where('attendees.event_id', eventUuid)
      .orderBy('attendees.created_at', 'desc')
      .select(
        'attendees.*',
        'users.name as creator_name'
      );

    const event = await DB.from('events')
      .where('id', eventUuid)
      .where('organization_id', orgUuid)
      .first();

    if (!event) {
      return response.flash('error', 'Event not found').redirect(`/organizations/${orgUuid}/events`, 302);
    }

    return response.inertia('attendees/index', {
      attendees,
      event,
      orgUuid
    });
  }

  async create(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const eventUuid = request.params.event_uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const event = await DB.from('events')
      .where('id', eventUuid)
      .where('organization_id', orgUuid)
      .first();

    if (!event) {
      return response.flash('error', 'Event not found').redirect(`/organizations/${orgUuid}/events`, 302);
    }

    return response.inertia('attendees/form', {
      attendee: null,
      event,
      orgUuid
    });
  }

  async store(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const eventUuid = request.params.event_uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const body = await request.json();
    console.log('[AttendeeController.store] Received body:', body);

    const validationResult = Validator.validate(storeAttendeeSchema, body);

    if (!validationResult.success) {
      const errors = validationResult.errors || {};
      console.log('[AttendeeController.store] Validation errors:', errors);
      const firstError = Object.values(errors)[0]?.[0] || 'Validation failed';
      return response.flash('error', firstError).redirect(`/organizations/${orgUuid}/events/${eventUuid}/attendees/create`, 302);
    }

    const data = validationResult.data!;
    console.log('[AttendeeController.store] Validated data:', data);

    try {
      const attendeeId = uuidv7();
      const qrCode = generateQRCode(attendeeId, eventUuid);
      console.log('[AttendeeController.store] Generated QR code:', qrCode);

      await DB.table('attendees').insert({
        id: attendeeId,
        event_id: eventUuid,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        job_title: data.job_title || null,
        custom_data: data.custom_data ? JSON.parse(data.custom_data) : null,
        qr_code: qrCode,
        status: 'registered',
        registration_method: 'admin',
        registered_at: new Date(),
        notes: data.notes || null,
        created_by: user.id,
        created_at: Date.now(),
        updated_at: Date.now()
      });

      return response.flash('success', 'Attendee added successfully').redirect(`/organizations/${orgUuid}/events/${eventUuid}/attendees`, 302);
    } catch (error: any) {
      console.log('[AttendeeController.store] Error:', error);
      if (error.message && error.message.includes('UNIQUE constraint')) {
        return response.flash('error', 'Email already registered for this event').redirect(`/organizations/${orgUuid}/events/${eventUuid}/attendees/create`, 302);
      }
      return response.flash('error', 'Failed to add attendee: ' + (error.message || 'Unknown error')).redirect(`/organizations/${orgUuid}/events/${eventUuid}/attendees/create`, 302);
    }
  }

  async show(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const eventUuid = request.params.event_uuid;
    const uuid = request.params.uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const attendee = await DB.from('attendees')
      .where('id', uuid)
      .where('event_id', eventUuid)
      .first();

    if (!attendee) {
      return response.flash('error', 'Attendee not found').redirect(`/organizations/${orgUuid}/events/${eventUuid}/attendees`, 302);
    }

    const event = await DB.from('events')
      .where('id', eventUuid)
      .where('organization_id', orgUuid)
      .first();

    return response.inertia('attendees/show', {
      attendee,
      event,
      orgUuid
    });
  }

  async edit(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const eventUuid = request.params.event_uuid;
    const uuid = request.params.uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const attendee = await DB.from('attendees')
      .where('id', uuid)
      .where('event_id', eventUuid)
      .first();

    if (!attendee) {
      return response.flash('error', 'Attendee not found').redirect(`/organizations/${orgUuid}/events/${eventUuid}/attendees`, 302);
    }

    const event = await DB.from('events')
      .where('id', eventUuid)
      .where('organization_id', orgUuid)
      .first();

    return response.inertia('attendees/form', {
      attendee,
      event,
      orgUuid
    });
  }

  async update(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const eventUuid = request.params.event_uuid;
    const uuid = request.params.uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const body = await request.json();
    const validationResult = Validator.validate(updateAttendeeSchema, body);

    if (!validationResult.success) {
      const errors = validationResult.errors || {};
      const firstError = Object.values(errors)[0]?.[0] || 'Validation failed';
      return response.flash('error', firstError).redirect(`/organizations/${orgUuid}/events/${eventUuid}/attendees/${uuid}/edit`, 303);
    }

    const data = validationResult.data!;

    try {
      const updateData: any = {
        updated_at: Date.now()
      };

      if (data.name !== undefined) updateData.name = data.name;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.company !== undefined) updateData.company = data.company;
      if (data.job_title !== undefined) updateData.job_title = data.job_title;
      if (data.custom_data !== undefined) updateData.custom_data = data.custom_data ? JSON.parse(data.custom_data) : null;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.status !== undefined) updateData.status = data.status;

      await DB.from('attendees')
        .where('id', uuid)
        .where('event_id', eventUuid)
        .update(updateData);

      return response.flash('success', 'Attendee updated successfully').redirect(`/organizations/${orgUuid}/events/${eventUuid}/attendees`, 303);
    } catch (error: any) {
      if (error.message && error.message.includes('UNIQUE constraint')) {
        return response.flash('error', 'Email already registered for this event').redirect(`/organizations/${orgUuid}/events/${eventUuid}/attendees/${uuid}/edit`, 303);
      }
      return response.flash('error', 'Failed to update attendee').redirect(`/organizations/${orgUuid}/events/${eventUuid}/attendees/${uuid}/edit`, 303);
    }
  }

  async destroy(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const eventUuid = request.params.event_uuid;
    const uuid = request.params.uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    await DB.from('attendees')
      .where('id', uuid)
      .where('event_id', eventUuid)
      .delete();

    return response.flash('success', 'Attendee deleted successfully').redirect(`/organizations/${orgUuid}/events/${eventUuid}/attendees`, 303);
  }

  async import(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const eventUuid = request.params.event_uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const event = await DB.from('events')
      .where('id', eventUuid)
      .where('organization_id', orgUuid)
      .first();

    if (!event) {
      return response.flash('error', 'Event not found').redirect(`/organizations/${orgUuid}/events`, 302);
    }

    return response.inertia('attendees/import', {
      event,
      orgUuid
    });
  }

  async processImport(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const eventUuid = request.params.event_uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    try {
      let fileContent: Buffer | null = null;
      let sendEmail = true;

      await request.multipart(async (field: unknown) => {
        if (field && typeof field === 'object' && 'file' in field && field.file) {
          const multipartField = field as {
            name: string;
            file: { stream: NodeJS.ReadableStream; name: string };
          };

          const chunks: Buffer[] = [];
          const readable = multipartField.file.stream;

          readable.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
          });

          await new Promise<void>((resolve, reject) => {
            readable.on('end', () => {
              fileContent = Buffer.concat(chunks);
              resolve();
            });
            readable.on('error', reject);
          });
        } else if (field && typeof field === 'object' && 'name' in field && 'value' in field) {
          const valueField = field as { name: string; value: string };
          if (valueField.name === 'send_email') {
            sendEmail = valueField.value === 'true';
          }
        }
      });

      if (!fileContent) {
        return response.flash('error', 'No file uploaded').redirect(`/organizations/${orgUuid}/events/${eventUuid}/attendees/import`, 302);
      }

      const content = (fileContent as Buffer).toString('utf-8');

      const attendees = parseCSV(content);
      let successCount = 0;
      let errorCount = 0;

      for (const attendeeData of attendees) {
        try {
          const attendeeId = uuidv4();
          const qrCode = generateQRCode(attendeeId, eventUuid);

          await DB.table('attendees').insert({
            id: attendeeId,
            event_id: eventUuid,
            name: attendeeData.name,
            email: attendeeData.email,
            phone: attendeeData.phone || null,
            company: attendeeData.company || null,
            job_title: attendeeData.job_title || null,
            custom_data: null,
            qr_code: qrCode,
            status: 'registered',
            registration_method: 'import',
            registered_at: new Date(),
            notes: null,
            created_by: user.id,
            created_at: Date.now(),
            updated_at: Date.now()
          });

          successCount++;
        } catch (error: any) {
          errorCount++;
        }
      }

      return response.flash('success', `Imported ${successCount} attendees successfully${errorCount > 0 ? ` (${errorCount} failed)` : ''}`).redirect(`/organizations/${orgUuid}/events/${eventUuid}/attendees`, 302);
    } catch (error: any) {
      return response.flash('error', 'Failed to import attendees: ' + error.message).redirect(`/organizations/${orgUuid}/events/${eventUuid}/attendees/import`, 302);
    }
  }

  async ticket(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const eventUuid = request.params.event_uuid;
    const uuid = request.params.uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const attendee = await DB.from('attendees')
      .where('id', uuid)
      .where('event_id', eventUuid)
      .first();

    if (!attendee) {
      return response.flash('error', 'Attendee not found').redirect(`/organizations/${orgUuid}/events/${eventUuid}/attendees`, 302);
    }

    const event = await DB.from('events')
      .where('id', eventUuid)
      .where('organization_id', orgUuid)
      .first();

    return response.inertia('attendees/ticket', {
      attendee,
      event,
      orgUuid
    });
  }

  async resendEmail(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const eventUuid = request.params.event_uuid;
    const uuid = request.params.uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const attendee = await DB.from('attendees')
      .where('id', uuid)
      .where('event_id', eventUuid)
      .first();

    if (!attendee) {
      return response.flash('error', 'Attendee not found').redirect(`/organizations/${orgUuid}/events/${eventUuid}/attendees`, 302);
    }

    return response.flash('success', 'Email sent successfully').redirect(`/organizations/${orgUuid}/events/${eventUuid}/attendees`, 303);
  }

  async print(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const eventUuid = request.params.event_uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const attendees = await DB.from('attendees')
      .where('event_id', eventUuid)
      .where('status', '!=', 'cancelled')
      .orderBy('created_at', 'asc')
      .select('*');

    const event = await DB.from('events')
      .where('id', eventUuid)
      .where('organization_id', orgUuid)
      .first();

    if (!event) {
      return response.flash('error', 'Event not found').redirect(`/organizations/${orgUuid}/events`, 302);
    }

    return response.inertia('attendees/print', {
      attendees,
      event,
      orgUuid
    });
  }
}

export default new AttendeeController();
