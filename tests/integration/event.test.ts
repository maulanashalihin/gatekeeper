import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import DB from '../../app/services/DB';
import Authenticate from '../../app/services/Authenticate';
import { v4 as uuidv4 } from 'uuid';

describe('Event Integration Tests', () => {
  let userId: string;
  let orgId: string;
  let eventId: string;
  let eventSettingsId: string;
  let eventMemberId: string;

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
  });

  afterEach(async () => {
    // Cleanup in reverse order
    if (eventMemberId) {
      await DB('event_members').where('id', eventMemberId).delete();
    }
    if (eventSettingsId) {
      await DB('event_settings').where('id', eventSettingsId).delete();
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

  describe('Event CRUD', () => {
    it('should create event', async () => {
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
        location: 'Test Location',
        venue: 'Test Venue',
        address: 'Test Address',
        capacity: 100,
        is_public: false,
        registration_open: true,
        entry_system: 'qr',
        status: 'draft',
        created_by: userId,
        created_at: Date.now(),
        updated_at: Date.now()
      });

      const event = await DB('events').where('id', eventId).first();
      expect(event).toBeDefined();
      expect(event.name).toBe('Test Event');
      expect(event.type).toBe('conference');
      expect(event.organization_id).toBe(orgId);
    });

    it('should read event', async () => {
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
        status: 'draft',
        created_by: userId,
        created_at: Date.now(),
        updated_at: Date.now()
      });

      const event = await DB('events').where('id', eventId).first();
      expect(event.name).toBe('Test Event');
      expect(event.description).toBe('Test event description');
    });

    it('should update event', async () => {
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
        status: 'draft',
        created_by: userId,
        created_at: Date.now(),
        updated_at: Date.now()
      });

      await DB('events').where('id', eventId).update({
        name: 'Updated Event',
        description: 'Updated description',
        status: 'published',
        updated_at: Date.now()
      });

      const event = await DB('events').where('id', eventId).first();
      expect(event.name).toBe('Updated Event');
      expect(event.description).toBe('Updated description');
      expect(event.status).toBe('published');
    });

    it('should delete event', async () => {
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
        status: 'draft',
        created_by: userId,
        created_at: Date.now(),
        updated_at: Date.now()
      });

      await DB('events').where('id', eventId).delete();

      const event = await DB('events').where('id', eventId).first();
      expect(event).toBeUndefined();
    });

    it('should enforce unique slug constraint per organization', async () => {
      const slug = `test-event-${Date.now()}-${Math.random()}`;
      
      await DB.table('events').insert({
        id: uuidv4(),
        organization_id: orgId,
        name: 'Test Event 1',
        slug,
        description: 'Test description',
        type: 'conference',
        start_date: Date.now() + 86400000,
        end_date: Date.now() + 172800000,
        is_public: false,
        registration_open: true,
        entry_system: 'qr',
        status: 'draft',
        created_by: userId,
        created_at: Date.now(),
        updated_at: Date.now()
      });

      // Try to insert duplicate slug in same organization
      await expect(
        DB.table('events').insert({
          id: uuidv4(),
          organization_id: orgId,
          name: 'Test Event 2',
          slug,
          description: 'Test description',
          type: 'conference',
          start_date: Date.now() + 86400000,
          end_date: Date.now() + 172800000,
          is_public: false,
          registration_open: true,
          entry_system: 'qr',
          status: 'draft',
          created_by: userId,
          created_at: Date.now(),
          updated_at: Date.now()
        })
      ).rejects.toThrow();
    });
  });

  describe('Event Settings', () => {
    beforeEach(async () => {
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
        status: 'draft',
        created_by: userId,
        created_at: Date.now(),
        updated_at: Date.now()
      });
    });

    it('should create event settings', async () => {
      eventSettingsId = uuidv4();
      await DB.table('event_settings').insert({
        id: eventSettingsId,
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

      const settings = await DB('event_settings').where('event_id', eventId).first();
      expect(settings).toBeDefined();
      expect(settings.allow_self_registration).toBe(1); // SQLite returns 0/1
      expect(settings.send_confirmation_email).toBe(1);
    });

    it('should update event settings', async () => {
      eventSettingsId = uuidv4();
      await DB.table('event_settings').insert({
        id: eventSettingsId,
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

      await DB('event_settings').where('event_id', eventId).update({
        require_approval: true,
        allow_duplicate_checkin: true,
        updated_at: Date.now()
      });

      const settings = await DB('event_settings').where('event_id', eventId).first();
      expect(settings.require_approval).toBe(1); // SQLite returns 0/1
      expect(settings.allow_duplicate_checkin).toBe(1);
    });

    it('should enforce unique event_id constraint', async () => {
      eventSettingsId = uuidv4();
      await DB.table('event_settings').insert({
        id: eventSettingsId,
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

      // Try to insert duplicate event_id
      await expect(
        DB.table('event_settings').insert({
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
        })
      ).rejects.toThrow();
    });
  });

  describe('Event Members', () => {
    beforeEach(async () => {
      eventId = uuidv4();
      await DB.table('events').insert({
        id: eventId,
        organization_id: orgId,
        name: 'Test Event',
        slug: `test-event-${Date.now()}`,
        description: 'Test event description',
        type: 'conference',
        start_date: Date.now() + 86400000,
        end_date: Date.now() + 172800000,
        is_public: false,
        registration_open: true,
        entry_system: 'qr',
        status: 'draft',
        created_by: userId,
        created_at: Date.now(),
        updated_at: Date.now()
      });
    });

    it('should add member to event', async () => {
      eventMemberId = uuidv4();
      await DB.table('event_members').insert({
        id: eventMemberId,
        event_id: eventId,
        user_id: userId,
        role: 'manager',
        added_by: userId,
        added_at: Date.now(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      const member = await DB('event_members').where('id', eventMemberId).first();
      expect(member).toBeDefined();
      expect(member.role).toBe('manager');
      expect(member.event_id).toBe(eventId);
      expect(member.user_id).toBe(userId);
    });

    it('should update member role', async () => {
      eventMemberId = uuidv4();
      await DB.table('event_members').insert({
        id: eventMemberId,
        event_id: eventId,
        user_id: userId,
        role: 'manager',
        added_by: userId,
        added_at: Date.now(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      await DB('event_members').where('id', eventMemberId).update({
        role: 'staff',
        updated_at: Date.now()
      });

      const member = await DB('event_members').where('id', eventMemberId).first();
      expect(member.role).toBe('staff');
    });

    it('should remove member from event', async () => {
      eventMemberId = uuidv4();
      await DB.table('event_members').insert({
        id: eventMemberId,
        event_id: eventId,
        user_id: userId,
        role: 'manager',
        added_by: userId,
        added_at: Date.now(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      await DB('event_members').where('id', eventMemberId).delete();

      const member = await DB('event_members').where('id', eventMemberId).first();
      expect(member).toBeUndefined();
    });

    it('should enforce unique event-user constraint', async () => {
      eventMemberId = uuidv4();
      await DB.table('event_members').insert({
        id: eventMemberId,
        event_id: eventId,
        user_id: userId,
        role: 'manager',
        added_by: userId,
        added_at: Date.now(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      // Try to insert duplicate
      await expect(
        DB.table('event_members').insert({
          id: uuidv4(),
          event_id: eventId,
          user_id: userId,
          role: 'staff',
          added_by: userId,
          added_at: Date.now(),
          created_at: Date.now(),
          updated_at: Date.now()
        })
      ).rejects.toThrow();
    });
  });

  describe('Event Analytics', () => {
    let attendee1Id: string;
    let attendee2Id: string;

    beforeEach(async () => {
      eventId = uuidv4();
      await DB.table('events').insert({
        id: eventId,
        organization_id: orgId,
        name: 'Test Event',
        slug: `test-event-${Date.now()}`,
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

      // Create attendees
      attendee1Id = uuidv4();
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

      attendee2Id = uuidv4();
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
    });

    it('should count total attendees', async () => {
      const result = await DB('attendees')
        .where('event_id', eventId)
        .count('* as total')
        .first();

      expect(result?.total).toBe(2);
    });

    it('should count checked-in attendees', async () => {
      const result = await DB('attendees')
        .where('event_id', eventId)
        .where('status', 'checked_in')
        .count('* as total')
        .first();

      expect(result?.total).toBe(1);
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
      const rate = total > 0 ? (checkedIn / total) * 100 : 0;

      expect(rate).toBe(50);
    });

    it('should get attendees by status', async () => {
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
  });
});
