import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import DB from '../../app/services/DB';
import Authenticate from '../../app/services/Authenticate';
import { v4 as uuidv4 } from 'uuid';

describe('Attendee Integration Tests', () => {
  let userId: string;
  let orgId: string;
  let eventId: string;
  let attendeeId: string;

  beforeEach(async () => {
    // Create test user
    userId = uuidv4();
    const hashedPassword = await Authenticate.hash('testPassword123');
    await DB.table('users').insert({
      id: userId,
      name: 'Test User',
      email: `test-${Date.now()}-${Math.random()}@example.com`,
      password: hashedPassword,
      is_verified: true,
      created_at: Date.now(),
      updated_at: Date.now()
    });

    // Create organization with unique slug
    orgId = uuidv4();
    const orgSlug = `test-org-${Date.now()}-${Math.random()}`;
    await DB.table('organizations').insert({
      id: orgId,
      name: 'Test Organization',
      slug: orgSlug,
      description: 'Test description',
      onboarding_completed: false,
      onboarding_step: 1,
      created_at: Date.now(),
      updated_at: Date.now()
    });

    // Add user as org member
    await DB.table('organization_members').insert({
      id: uuidv4(),
      organization_id: orgId,
      user_id: userId,
      role: 'admin',
      added_by: userId,
      added_at: new Date(),
      created_at: Date.now(),
      updated_at: Date.now()
    });

    // Create event with unique slug
    eventId = uuidv4();
    const eventSlug = `test-event-${Date.now()}-${Math.random()}`;
    await DB.table('events').insert({
      id: eventId,
      organization_id: orgId,
      name: 'Test Event',
      slug: eventSlug,
      description: 'Test event description',
      type: 'conference',
      start_date: Date.now() + 86400000,
      end_date: Date.now() + 172800000,
      is_public: false,
      registration_open: true,
      entry_system: 'qr',
      status: 'published',
      created_by: userId,
      created_at: Date.now(),
      updated_at: Date.now()
    });
  });

  afterEach(async () => {
    // Cleanup in reverse order
    if (attendeeId) {
      await DB('attendees').where('id', attendeeId).delete();
    }
    if (eventId) {
      await DB('events').where('id', eventId).delete();
    }
    if (orgId) {
      await DB('organization_members').where('organization_id', orgId).delete();
      await DB('organizations').where('id', orgId).delete();
    }
    if (userId) {
      await DB('users').where('id', userId).delete();
    }
  });

  describe('Attendee CRUD', () => {
    it('should create attendee', async () => {
      attendeeId = uuidv4();
      const qrCode = `qr-${attendeeId}-${eventId}`;
      
      await DB.table('attendees').insert({
        id: attendeeId,
        event_id: eventId,
        name: 'Test Attendee',
        email: `attendee-${Date.now()}@example.com`,
        phone: '+1234567890',
        company: 'Test Company',
        job_title: 'Developer',
        custom_data: null,
        qr_code: qrCode,
        qr_code_url: null,
        status: 'registered',
        registration_method: 'admin',
        registered_at: Date.now(),
        notes: null,
        created_by: userId,
        created_at: Date.now(),
        updated_at: Date.now()
      });

      const attendee = await DB('attendees').where('id', attendeeId).first();
      expect(attendee).toBeDefined();
      expect(attendee.name).toBe('Test Attendee');
      expect(attendee.email).toContain('attendee-');
      expect(attendee.event_id).toBe(eventId);
      expect(attendee.status).toBe('registered');
      expect(attendee.qr_code).toBe(qrCode);
    });

    it('should read attendee', async () => {
      attendeeId = uuidv4();
      await DB.table('attendees').insert({
        id: attendeeId,
        event_id: eventId,
        name: 'Test Attendee',
        email: `attendee-${Date.now()}@example.com`,
        qr_code: `qr-${attendeeId}`,
        status: 'registered',
        registration_method: 'admin',
        registered_at: Date.now(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      const attendee = await DB('attendees').where('id', attendeeId).first();
      expect(attendee.name).toBe('Test Attendee');
      expect(attendee.email).toContain('attendee-');
    });

    it('should update attendee', async () => {
      attendeeId = uuidv4();
      await DB.table('attendees').insert({
        id: attendeeId,
        event_id: eventId,
        name: 'Test Attendee',
        email: `attendee-${Date.now()}@example.com`,
        qr_code: `qr-${attendeeId}`,
        status: 'registered',
        registration_method: 'admin',
        registered_at: Date.now(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      await DB('attendees').where('id', attendeeId).update({
        name: 'Updated Attendee',
        phone: '+9876543210',
        company: 'Updated Company',
        status: 'checked_in',
        checked_in_at: Date.now(),
        checked_in_by: userId,
        updated_at: Date.now()
      });

      const attendee = await DB('attendees').where('id', attendeeId).first();
      expect(attendee.name).toBe('Updated Attendee');
      expect(attendee.phone).toBe('+9876543210');
      expect(attendee.company).toBe('Updated Company');
      expect(attendee.status).toBe('checked_in');
    });

    it('should delete attendee', async () => {
      attendeeId = uuidv4();
      await DB.table('attendees').insert({
        id: attendeeId,
        event_id: eventId,
        name: 'Test Attendee',
        email: `attendee-${Date.now()}@example.com`,
        qr_code: `qr-${attendeeId}`,
        status: 'registered',
        registration_method: 'admin',
        registered_at: Date.now(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      await DB('attendees').where('id', attendeeId).delete();

      const attendee = await DB('attendees').where('id', attendeeId).first();
      expect(attendee).toBeUndefined();
    });
  });

  describe('QR Code Generation', () => {
    it('should generate unique QR code for each attendee', async () => {
      const attendee1Id = uuidv4();
      const attendee2Id = uuidv4();

      await DB.table('attendees').insert({
        id: attendee1Id,
        event_id: eventId,
        name: 'Attendee 1',
        email: `attendee1-${Date.now()}@example.com`,
        qr_code: `qr-${attendee1Id}`,
        status: 'registered',
        registration_method: 'admin',
        registered_at: Date.now(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      await DB.table('attendees').insert({
        id: attendee2Id,
        event_id: eventId,
        name: 'Attendee 2',
        email: `attendee2-${Date.now()}@example.com`,
        qr_code: `qr-${attendee2Id}`,
        status: 'registered',
        registration_method: 'admin',
        registered_at: Date.now(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      const attendee1 = await DB('attendees').where('id', attendee1Id).first();
      const attendee2 = await DB('attendees').where('id', attendee2Id).first();

      expect(attendee1.qr_code).not.toBe(attendee2.qr_code);
    });

    it('should enforce unique QR code constraint', async () => {
      const qrCode = `qr-${Date.now()}`;
      
      await DB.table('attendees').insert({
        id: uuidv4(),
        event_id: eventId,
        name: 'Attendee 1',
        email: `attendee1-${Date.now()}@example.com`,
        qr_code: qrCode,
        status: 'registered',
        registration_method: 'admin',
        registered_at: Date.now(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      // Try to insert duplicate QR code
      await expect(
        DB.table('attendees').insert({
          id: uuidv4(),
          event_id: eventId,
          name: 'Attendee 2',
          email: `attendee2-${Date.now()}@example.com`,
          qr_code: qrCode,
          status: 'registered',
          registration_method: 'admin',
          registered_at: Date.now(),
          created_at: Date.now(),
          updated_at: Date.now()
        })
      ).rejects.toThrow();
    });
  });

  describe('Attendee Status Transitions', () => {
    it('should transition from registered to checked_in', async () => {
      attendeeId = uuidv4();
      await DB.table('attendees').insert({
        id: attendeeId,
        event_id: eventId,
        name: 'Test Attendee',
        email: `attendee-${Date.now()}@example.com`,
        qr_code: `qr-${attendeeId}`,
        status: 'registered',
        registration_method: 'admin',
        registered_at: Date.now(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      await DB('attendees').where('id', attendeeId).update({
        status: 'checked_in',
        checked_in_at: Date.now(),
        checked_in_by: userId,
        updated_at: Date.now()
      });

      const attendee = await DB('attendees').where('id', attendeeId).first();
      expect(attendee.status).toBe('checked_in');
      expect(attendee.checked_in_at).toBeDefined();
      expect(attendee.checked_in_by).toBe(userId);
    });

    it('should transition from checked_in to cancelled', async () => {
      attendeeId = uuidv4();
      await DB.table('attendees').insert({
        id: attendeeId,
        event_id: eventId,
        name: 'Test Attendee',
        email: `attendee-${Date.now()}@example.com`,
        qr_code: `qr-${attendeeId}`,
        status: 'checked_in',
        registration_method: 'admin',
        registered_at: Date.now(),
        checked_in_at: Date.now(),
        checked_in_by: userId,
        created_at: Date.now(),
        updated_at: Date.now()
      });

      await DB('attendees').where('id', attendeeId).update({
        status: 'cancelled',
        updated_at: Date.now()
      });

      const attendee = await DB('attendees').where('id', attendeeId).first();
      expect(attendee.status).toBe('cancelled');
    });
  });

  describe('Attendee Filtering', () => {
    beforeEach(async () => {
      // Create multiple attendees with different statuses
      const statuses = ['registered', 'checked_in', 'cancelled', 'no_show'];
      
      for (let i = 0; i < statuses.length; i++) {
        const id = uuidv4();
        await DB.table('attendees').insert({
          id,
          event_id: eventId,
          name: `Attendee ${i + 1}`,
          email: `attendee${i + 1}-${Date.now()}@example.com`,
          qr_code: `qr-${id}`,
          status: statuses[i],
          registration_method: 'admin',
          registered_at: Date.now(),
          created_at: Date.now(),
          updated_at: Date.now()
        });
      }
    });

    it('should filter attendees by status', async () => {
      const registered = await DB('attendees')
        .where('event_id', eventId)
        .where('status', 'registered')
        .select('*');

      const checkedIn = await DB('attendees')
        .where('event_id', eventId)
        .where('status', 'checked_in')
        .select('*');

      expect(registered).toHaveLength(1);
      expect(checkedIn).toHaveLength(1);
    });

    it('should get all attendees for an event', async () => {
      const attendees = await DB('attendees')
        .where('event_id', eventId)
        .select('*')
        .orderBy('created_at', 'desc');

      expect(attendees).toHaveLength(4);
    });

    it('should count attendees by status', async () => {
      const registeredCount = await DB('attendees')
        .where('event_id', eventId)
        .where('status', 'registered')
        .count('* as total')
        .first();

      const checkedInCount = await DB('attendees')
        .where('event_id', eventId)
        .where('status', 'checked_in')
        .count('* as total')
        .first();

      expect(Number(registeredCount?.total)).toBe(1);
      expect(Number(checkedInCount?.total)).toBe(1);
    });
  });

  describe('Attendee with Check-in Cascade', () => {
    let checkInId: string;

    beforeEach(async () => {
      attendeeId = uuidv4();
      await DB.table('attendees').insert({
        id: attendeeId,
        event_id: eventId,
        name: 'Test Attendee',
        email: `attendee-${Date.now()}@example.com`,
        qr_code: `qr-${attendeeId}`,
        status: 'registered',
        registration_method: 'admin',
        registered_at: Date.now(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      checkInId = uuidv4();
      await DB.table('check_ins').insert({
        id: checkInId,
        attendee_id: attendeeId,
        event_id: eventId,
        method: 'qr',
        checked_in_at: Date.now(),
        checked_in_by: userId,
        created_at: Date.now()
      });
    });

    it('should cascade delete check-ins when attendee is deleted', async () => {
      await DB('attendees').where('id', attendeeId).delete();

      const checkIn = await DB('check_ins').where('id', checkInId).first();
      expect(checkIn).toBeUndefined();
    });
  });
});
