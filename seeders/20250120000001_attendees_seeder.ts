import { Knex } from "knex";
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

function generateQRCode(attendeeId: string, eventId: string): string {
  const timestamp = Date.now();
  const signature = crypto
    .createHmac('sha256', process.env.QR_CODE_SECRET || 'default-secret')
    .update(`${attendeeId}:${eventId}:${timestamp}`)
    .digest('hex')
    .substring(0, 16);

  return `${attendeeId}-${eventId}-${signature}`;
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('attendees').del();

  // Get first event and user for foreign keys
  const event = await knex('events').first();
  const user = await knex('users').first();

  if (!event || !user) {
    console.log('No event or user found. Skipping attendees seeder.');
    return;
  }

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const attendees = [
    {
      id: uuidv4(),
      event_id: event.id,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+6281234567890',
      company: 'Tech Corp',
      job_title: 'Software Engineer',
      custom_data: null,
      qr_code: generateQRCode(uuidv4(), event.id),
      qr_code_url: null,
      status: 'registered',
      registration_method: 'self',
      registered_at: new Date(now - 2 * day).toISOString(),
      checked_in_at: null,
      checked_in_by: null,
      notes: null,
      created_by: user.id,
      created_at: now - 2 * day,
      updated_at: now - 2 * day
    },
    {
      id: uuidv4(),
      event_id: event.id,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+6281234567891',
      company: 'Innovation Labs',
      job_title: 'Product Manager',
      custom_data: null,
      qr_code: generateQRCode(uuidv4(), event.id),
      qr_code_url: null,
      status: 'checked_in',
      registration_method: 'self',
      registered_at: new Date(now - 3 * day).toISOString(),
      checked_in_at: new Date(now).toISOString(),
      checked_in_by: user.id,
      notes: null,
      created_by: user.id,
      created_at: now - 3 * day,
      updated_at: now
    },
    {
      id: uuidv4(),
      event_id: event.id,
      name: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      phone: '+6281234567892',
      company: 'Digital Solutions',
      job_title: 'CTO',
      custom_data: null,
      qr_code: generateQRCode(uuidv4(), event.id),
      qr_code_url: null,
      status: 'registered',
      registration_method: 'admin',
      registered_at: new Date(now - 1 * day).toISOString(),
      checked_in_at: null,
      checked_in_by: null,
      notes: 'VIP attendee',
      created_by: user.id,
      created_at: now - 1 * day,
      updated_at: now - 1 * day
    },
    {
      id: uuidv4(),
      event_id: event.id,
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      phone: '+6281234567893',
      company: 'Creative Studio',
      job_title: 'UX Designer',
      custom_data: null,
      qr_code: generateQRCode(uuidv4(), event.id),
      qr_code_url: null,
      status: 'registered',
      registration_method: 'self',
      registered_at: new Date(now - 4 * day).toISOString(),
      checked_in_at: null,
      checked_in_by: null,
      notes: null,
      created_by: user.id,
      created_at: now - 4 * day,
      updated_at: now - 4 * day
    },
    {
      id: uuidv4(),
      event_id: event.id,
      name: 'David Brown',
      email: null,
      phone: '+6281234567894',
      company: 'Startup Inc',
      job_title: 'Founder',
      custom_data: null,
      qr_code: generateQRCode(uuidv4(), event.id),
      qr_code_url: null,
      status: 'registered',
      registration_method: 'import',
      registered_at: new Date(now - 5 * day).toISOString(),
      checked_in_at: null,
      checked_in_by: null,
      notes: 'Walk-in registration',
      created_by: user.id,
      created_at: now - 5 * day,
      updated_at: now - 5 * day
    },
    {
      id: uuidv4(),
      event_id: event.id,
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '+6281234567895',
      company: 'Tech Corp',
      job_title: 'Data Scientist',
      custom_data: null,
      qr_code: generateQRCode(uuidv4(), event.id),
      qr_code_url: null,
      status: 'checked_in',
      registration_method: 'self',
      registered_at: new Date(now - 2 * day).toISOString(),
      checked_in_at: new Date(now - 1 * day).toISOString(),
      checked_in_by: user.id,
      notes: null,
      created_by: user.id,
      created_at: now - 2 * day,
      updated_at: now - 1 * day
    },
    {
      id: uuidv4(),
      event_id: event.id,
      name: 'Robert Wilson',
      email: 'robert.wilson@example.com',
      phone: '+6281234567896',
      company: 'Enterprise Systems',
      job_title: 'DevOps Engineer',
      custom_data: null,
      qr_code: generateQRCode(uuidv4(), event.id),
      qr_code_url: null,
      status: 'registered',
      registration_method: 'admin',
      registered_at: new Date(now - 1 * day).toISOString(),
      checked_in_at: null,
      checked_in_by: null,
      notes: null,
      created_by: user.id,
      created_at: now - 1 * day,
      updated_at: now - 1 * day
    },
    {
      id: uuidv4(),
      event_id: event.id,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      phone: '+6281234567897',
      company: 'Digital Agency',
      job_title: 'Marketing Director',
      custom_data: null,
      qr_code: generateQRCode(uuidv4(), event.id),
      qr_code_url: null,
      status: 'registered',
      registration_method: 'self',
      registered_at: new Date(now - 3 * day).toISOString(),
      checked_in_at: null,
      checked_in_by: null,
      notes: null,
      created_by: user.id,
      created_at: now - 3 * day,
      updated_at: now - 3 * day
    },
    {
      id: uuidv4(),
      event_id: event.id,
      name: 'James Taylor',
      email: null,
      phone: '+6281234567898',
      company: null,
      job_title: null,
      custom_data: null,
      qr_code: generateQRCode(uuidv4(), event.id),
      qr_code_url: null,
      status: 'no_show',
      registration_method: 'self',
      registered_at: new Date(now - 7 * day).toISOString(),
      checked_in_at: null,
      checked_in_by: null,
      notes: 'Did not attend',
      created_by: user.id,
      created_at: now - 7 * day,
      updated_at: now
    },
    {
      id: uuidv4(),
      event_id: event.id,
      name: 'Amanda Martinez',
      email: 'amanda.martinez@example.com',
      phone: '+6281234567899',
      company: 'Cloud Services',
      job_title: 'Cloud Architect',
      custom_data: null,
      qr_code: generateQRCode(uuidv4(), event.id),
      qr_code_url: null,
      status: 'cancelled',
      registration_method: 'self',
      registered_at: new Date(now - 6 * day).toISOString(),
      checked_in_at: null,
      checked_in_by: null,
      notes: 'Cancelled due to schedule conflict',
      created_by: user.id,
      created_at: now - 6 * day,
      updated_at: now - 5 * day
    },
    {
      id: uuidv4(),
      event_id: event.id,
      name: 'Christopher Lee',
      email: 'christopher.lee@example.com',
      phone: '+6281234567800',
      company: 'FinTech Co',
      job_title: 'Backend Developer',
      custom_data: null,
      qr_code: generateQRCode(uuidv4(), event.id),
      qr_code_url: null,
      status: 'checked_in',
      registration_method: 'import',
      registered_at: new Date(now - 4 * day).toISOString(),
      checked_in_at: new Date(now - 2 * day).toISOString(),
      checked_in_by: user.id,
      notes: null,
      created_by: user.id,
      created_at: now - 4 * day,
      updated_at: now - 2 * day
    },
    {
      id: uuidv4(),
      event_id: event.id,
      name: 'Jessica Garcia',
      email: 'jessica.garcia@example.com',
      phone: '+6281234567801',
      company: 'Media House',
      job_title: 'Content Strategist',
      custom_data: null,
      qr_code: generateQRCode(uuidv4(), event.id),
      qr_code_url: null,
      status: 'registered',
      registration_method: 'self',
      registered_at: new Date(now - 2 * day).toISOString(),
      checked_in_at: null,
      checked_in_by: null,
      notes: null,
      created_by: user.id,
      created_at: now - 2 * day,
      updated_at: now - 2 * day
    }
  ];

  await knex('attendees').insert(attendees);
}
