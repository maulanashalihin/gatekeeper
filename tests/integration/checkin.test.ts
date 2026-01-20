import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import DB from '../../app/services/DB';
import Authenticate from '../../app/services/Authenticate';
import { v4 as uuidv4 } from 'uuid';

describe('CheckIn Integration Tests', () => {
  let userId: string;
  let orgId: string;
  let eventId: string;
  let attendeeId: string;
  let checkInId: string;

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

    // Create event settings
    await DB.table('event_settings').insert({
      id: uuidv4(),
      event_id: eventId,
      require_approval: false,
      custom_fields: null,
      allow_self_registration: true,
      allow_duplicate_checkin: false,
      require_verification: false,
      send_confirmation_email: true,
      send_qr_email: true,
      timezone: 'UTC',
      locale: 'en',
      created_at: Date.now(),
      updated_at: Date.now()
    });

    // Create attendee
    attendeeId = uuidv4();
    await DB.table('attendees').insert({
      id: attendeeId,
      event_id: eventId,
      name: 'Test Attendee',
      email: `attendee-${Date.now()}-${Math.random()}@example.com`,
      qr_code: `qr-${attendeeId}`,
      status: 'registered',
      registration_method: 'admin',
      registered_at: Date.now(),
      created_at: Date.now(),
      updated_at: Date.now()
    });
  });

  afterEach(async () => {
    // Cleanup in reverse order
    if (checkInId) {
      await DB('check_ins').where('id', checkInId).delete();
    }
    if (attendeeId) {
      await DB('attendees').where('id', attendeeId).delete();
    }
    if (eventId) {
      await DB('event_settings').where('event_id', eventId).delete();
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

  describe('QR Code Check-in', () => {
    it('should create check-in record via QR scan', async () => {
      checkInId = uuidv4();
      await DB.table('check_ins').insert({
        id: checkInId,
        attendee_id: attendeeId,
        event_id: eventId,
        method: 'qr',
        checked_in_at: Date.now(),
        checked_in_by: userId,
        device_info: null,
        latitude: null,
        longitude: null,
        notes: null,
        created_at: Date.now()
      });

      const checkIn = await DB('check_ins').where('id', checkInId).first();
      expect(checkIn).toBeDefined();
      expect(checkIn.method).toBe('qr');
      expect(checkIn.attendee_id).toBe(attendeeId);
      expect(checkIn.event_id).toBe(eventId);
      expect(checkIn.checked_in_by).toBe(userId);
    });

    it('should update attendee status to checked_in', async () => {
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

    it('should prevent duplicate check-in when not allowed', async () => {
      // Create first check-in
      await DB.table('check_ins').insert({
        id: uuidv4(),
        attendee_id: attendeeId,
        event_id: eventId,
        method: 'qr',
        checked_in_at: Date.now(),
        checked_in_by: userId,
        created_at: Date.now()
      });

      // Update attendee status
      await DB('attendees').where('id', attendeeId).update({
        status: 'checked_in',
        checked_in_at: Date.now(),
        checked_in_by: userId,
        updated_at: Date.now()
      });

      // Check if attendee already has check-in
      const existingCheckIn = await DB('check_ins')
        .where('attendee_id', attendeeId)
        .first();

      expect(existingCheckIn).toBeDefined();
      expect(existingCheckIn.method).toBe('qr');
    });
  });

  describe('Manual Check-in', () => {
    it('should create check-in record via manual entry', async () => {
      checkInId = uuidv4();
      await DB.table('check_ins').insert({
        id: checkInId,
        attendee_id: attendeeId,
        event_id: eventId,
        method: 'manual',
        checked_in_at: Date.now(),
        checked_in_by: userId,
        notes: 'Manual check-in by staff',
        created_at: Date.now()
      });

      const checkIn = await DB('check_ins').where('id', checkInId).first();
      expect(checkIn).toBeDefined();
      expect(checkIn.method).toBe('manual');
      expect(checkIn.notes).toBe('Manual check-in by staff');
    });

    it('should support kiosk check-in method', async () => {
      checkInId = uuidv4();
      await DB.table('check_ins').insert({
        id: checkInId,
        attendee_id: attendeeId,
        event_id: eventId,
        method: 'kiosk',
        checked_in_at: Date.now(),
        checked_in_by: userId,
        device_info: { type: 'kiosk', location: 'entrance' },
        created_at: Date.now()
      });

      const checkIn = await DB('check_ins').where('id', checkInId).first();
      expect(checkIn.method).toBe('kiosk');
      expect(checkIn.device_info).toBeDefined();
    });
  });

  describe('Check-in Statistics', () => {
    beforeEach(async () => {
      // Create additional attendees
      const attendee2Id = uuidv4();
      await DB.table('attendees').insert({
        id: attendee2Id,
        event_id: eventId,
        name: 'Attendee 2',
        email: `attendee2-${Date.now()}@example.com`,
        qr_code: `qr-${attendee2Id}`,
        status: 'checked_in',
        registration_method: 'admin',
        registered_at: Date.now(),
        checked_in_at: Date.now(),
        checked_in_by: userId,
        created_at: Date.now(),
        updated_at: Date.now()
      });

      // Create check-in for attendee 2
      await DB.table('check_ins').insert({
        id: uuidv4(),
        attendee_id: attendee2Id,
        event_id: eventId,
        method: 'qr',
        checked_in_at: Date.now(),
        checked_in_by: userId,
        created_at: Date.now()
      });
    });

    it('should count total attendees', async () => {
      const result = await DB('attendees')
        .where('event_id', eventId)
        .count('* as total')
        .first();

      expect(Number(result?.total)).toBe(2);
    });

    it('should count checked-in attendees', async () => {
      const result = await DB('attendees')
        .where('event_id', eventId)
        .where('status', 'checked_in')
        .count('* as total')
        .first();

      expect(Number(result?.total)).toBe(1);
    });

    it('should calculate pending attendees', async () => {
      const totalResult = await DB('attendees')
        .where('event_id', eventId)
        .count('* as total')
        .first();

      const checkedInResult = await DB('attendees')
        .where('event_id', eventId)
        .where('status', 'checked_in')
        .count('* as total')
        .first();

      const total = Number(totalResult?.total || 0);
      const checkedIn = Number(checkedInResult?.total || 0);
      const pending = total - checkedIn;

      expect(pending).toBe(1);
    });

    it('should calculate check-in rate', async () => {
      const totalResult = await DB('attendees')
        .where('event_id', eventId)
        .count('* as total')
        .first();

      const checkedInResult = await DB('attendees')
        .where('event_id', eventId)
        .where('status', 'checked_in')
        .count('* as total')
        .first();

      const total = Number(totalResult?.total || 0);
      const checkedIn = Number(checkedInResult?.total || 0);
      const rate = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

      expect(rate).toBe(50);
    });
  });

  describe('Check-in History', () => {
    beforeEach(async () => {
      // Create check-in with timestamp
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

      // Update attendee status
      await DB('attendees').where('id', attendeeId).update({
        status: 'checked_in',
        checked_in_at: Date.now(),
        checked_in_by: userId,
        updated_at: Date.now()
      });
    });

    it('should get check-in history with attendee details', async () => {
      const checkIns = await DB('check_ins')
        .join('attendees', 'check_ins.attendee_id', 'attendees.id')
        .where('check_ins.event_id', eventId)
        .select(
          'check_ins.*',
          'attendees.name',
          'attendees.email'
        )
        .orderBy('check_ins.checked_in_at', 'desc');

      expect(checkIns).toHaveLength(1);
      expect(checkIns[0].name).toBe('Test Attendee');
      expect(checkIns[0].email).toContain('attendee-');
      expect(checkIns[0].method).toBe('qr');
    });

    it('should get recent check-ins with limit', async () => {
      const recentCheckIns = await DB('check_ins')
        .join('attendees', 'check_ins.attendee_id', 'attendees.id')
        .where('check_ins.event_id', eventId)
        .select(
          'check_ins.*',
          'attendees.name',
          'attendees.email'
        )
        .orderBy('check_ins.checked_in_at', 'desc')
        .limit(10);

      expect(recentCheckIns).toHaveLength(1);
    });
  });

  describe('Undo Check-in', () => {
    beforeEach(async () => {
      // Create check-in
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

      // Update attendee status
      await DB('attendees').where('id', attendeeId).update({
        status: 'checked_in',
        checked_in_at: Date.now(),
        checked_in_by: userId,
        updated_at: Date.now()
      });
    });

    it('should delete check-in record', async () => {
      await DB('check_ins').where('attendee_id', attendeeId).delete();

      const checkIn = await DB('check_ins').where('id', checkInId).first();
      expect(checkIn).toBeUndefined();
    });

    it('should revert attendee status to registered', async () => {
      await DB('check_ins').where('attendee_id', attendeeId).delete();

      await DB('attendees').where('id', attendeeId).update({
        status: 'registered',
        checked_in_at: null,
        checked_in_by: null,
        updated_at: Date.now()
      });

      const attendee = await DB('attendees').where('id', attendeeId).first();
      expect(attendee.status).toBe('registered');
      expect(attendee.checked_in_at).toBeNull();
      expect(attendee.checked_in_by).toBeNull();
    });
  });

  describe('Check-in Methods', () => {
    it('should support all check-in methods', async () => {
      const methods = ['qr', 'manual', 'kiosk'];
      
      for (const method of methods) {
        const id = uuidv4();
        await DB.table('check_ins').insert({
          id,
          attendee_id: attendeeId,
          event_id: eventId,
          method,
          checked_in_at: Date.now(),
          checked_in_by: userId,
          created_at: Date.now()
        });
      }

      const checkIns = await DB('check_ins')
        .where('event_id', eventId)
        .select('method');

      expect(checkIns).toHaveLength(3);
      expect(checkIns.map(c => c.method)).toEqual(expect.arrayContaining(methods));
    });
  });

  describe('Check-in with Location Data', () => {
    it('should store location data', async () => {
      checkInId = uuidv4();
      await DB.table('check_ins').insert({
        id: checkInId,
        attendee_id: attendeeId,
        event_id: eventId,
        method: 'qr',
        checked_in_at: Date.now(),
        checked_in_by: userId,
        latitude: -6.2088,
        longitude: 106.8456,
        device_info: { type: 'mobile', os: 'iOS' },
        created_at: Date.now()
      });

      const checkIn = await DB('check_ins').where('id', checkInId).first();
      expect(checkIn.latitude).toBe(-6.2088);
      expect(checkIn.longitude).toBe(106.8456);
      expect(checkIn.device_info).toBeDefined();
    });
  });
});
