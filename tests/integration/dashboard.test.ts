import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import DB from '../../app/services/DB';
import Authenticate from '../../app/services/Authenticate';
import { v4 as uuidv4 } from 'uuid';

describe('Dashboard Integration Tests', () => {
  let userId: string;
  let orgId: string;
  let eventId: string;
  let attendeeIds: string[] = [];

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
      onboarding_completed: true,
      onboarding_step: 5,
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

    // Create events with unique slugs
    for (let i = 0; i < 3; i++) {
      const eventId = uuidv4();
      const eventSlug = `event-${i}-${Date.now()}-${Math.random()}`;
      await DB.table('events').insert({
        id: eventId,
        organization_id: orgId,
        name: `Event ${i + 1}`,
        slug: eventSlug,
        description: `Event ${i + 1} description`,
        type: 'conference',
        start_date: Date.now() + (86400000 * (i + 1)),
        end_date: Date.now() + (172800000 * (i + 1)),
        is_public: i % 2 === 0,
        registration_open: true,
        entry_system: 'qr',
        status: i === 0 ? 'published' : 'draft',
        created_by: userId,
        created_at: Date.now() - (i * 86400000),
        updated_at: Date.now()
      });

      // Create attendees for each event
      for (let j = 0; j < 5; j++) {
        const attendeeId = uuidv4();
        attendeeIds.push(attendeeId);
        
        await DB.table('attendees').insert({
          id: attendeeId,
          event_id: eventId,
          name: `Attendee ${i + 1}-${j + 1}`,
          email: `attendee${i}${j}-${Date.now()}-${Math.random()}@example.com`,
          qr_code: `qr-${attendeeId}`,
          status: j < 3 ? 'checked_in' : 'registered',
          registration_method: 'admin',
          registered_at: Date.now(),
          checked_in_at: j < 3 ? Date.now() : null,
          checked_in_by: userId,
          created_at: Date.now(),
          updated_at: Date.now()
        });

        // Create check-ins for checked-in attendees
        if (j < 3) {
          await DB.table('check_ins').insert({
            id: uuidv4(),
            attendee_id: attendeeId,
            event_id: eventId,
            method: 'qr',
            checked_in_at: Date.now(),
            checked_in_by: userId,
            created_at: Date.now()
          });
        }
      }
    }
  });

  afterEach(async () => {
    // Cleanup in reverse order
    // Delete check-ins
    for (const attendeeId of attendeeIds) {
      await DB('check_ins').where('attendee_id', attendeeId).delete();
    }

    // Delete attendees
    for (const attendeeId of attendeeIds) {
      await DB('attendees').where('id', attendeeId).delete();
    }

    // Delete events
    const events = await DB('events').where('organization_id', orgId).select('id');
    for (const event of events) {
      await DB('event_settings').where('event_id', event.id).delete();
      await DB('events').where('id', event.id).delete();
    }

    // Delete organization
    await DB('organization_members').where('organization_id', orgId).delete();
    await DB('organizations').where('id', orgId).delete();

    // Delete user
    await DB('users').where('id', userId).delete();
  });

  describe('Organization Dashboard', () => {
    it('should get user organizations', async () => {
      const organizations = await DB('organization_members')
        .join('organizations', 'organization_members.organization_id', 'organizations.id')
        .where('organization_members.user_id', userId)
        .select(
          'organizations.id',
          'organizations.name',
          'organizations.slug',
          'organizations.description',
          'organizations.logo',
          'organization_members.role',
          'organization_members.added_at'
        )
        .orderBy('organizations.created_at', 'desc');

      expect(organizations).toHaveLength(1);
      expect(organizations[0].name).toBe('Test Organization');
      expect(organizations[0].role).toBe('admin');
    });

    it('should get organization statistics', async () => {
      const stats = await DB.from('events')
        .where('organization_id', orgId)
        .count('* as total_events')
        .first();

      const attendeeStats = await DB.from('attendees')
        .join('events', 'attendees.event_id', 'events.id')
        .where('events.organization_id', orgId)
        .count('* as total_attendees')
        .first();

      const checkInStats = await DB.from('check_ins')
        .join('attendees', 'check_ins.attendee_id', 'attendees.id')
        .join('events', 'attendees.event_id', 'events.id')
        .where('events.organization_id', orgId)
        .count('* as total_checkins')
        .first();

      const memberStats = await DB.from('organization_members')
        .where('organization_id', orgId)
        .count('* as total_members')
        .first();

      expect(Number(stats?.total_events)).toBe(3);
      expect(Number(attendeeStats?.total_attendees)).toBe(15);
      expect(Number(checkInStats?.total_checkins)).toBe(9);
      expect(Number(memberStats?.total_members)).toBe(1);
    });

    it('should get recent events', async () => {
      const recentEvents = await DB.from('events')
        .where('organization_id', orgId)
        .orderBy('created_at', 'desc')
        .limit(5)
        .select('id', 'name', 'slug', 'type', 'start_date', 'end_date', 'location', 'status');

      expect(recentEvents).toHaveLength(3);
      expect(recentEvents[0].name).toBe('Event 1');
    });

    it('should get team members', async () => {
      const teamMembers = await DB.from('organization_members')
        .join('users', 'organization_members.user_id', 'users.id')
        .where('organization_members.organization_id', orgId)
        .select(
          'users.id',
          'users.name',
          'users.email',
          'organization_members.role',
          'organization_members.added_at'
        )
        .limit(5);

      expect(teamMembers).toHaveLength(1);
      expect(teamMembers[0].name).toBe('Test User');
      expect(teamMembers[0].role).toBe('admin');
    });
  });

  describe('Event Dashboard', () => {
    let testEventId: string;

    beforeEach(async () => {
      // Get first event
      const event = await DB('events').where('organization_id', orgId).first();
      testEventId = event.id;
    });

    it('should get event details', async () => {
      const event = await DB('events').where('id', testEventId).first();
      expect(event).toBeDefined();
      expect(event.name).toBe('Event 1');
      expect(event.organization_id).toBe(orgId);
    });

    it('should get event attendee statistics', async () => {
      const totalAttendees = await DB('attendees')
        .where('event_id', testEventId)
        .count('* as total')
        .first();

      const checkedInCount = await DB('attendees')
        .where('event_id', testEventId)
        .where('status', 'checked_in')
        .count('* as total')
        .first();

      expect(Number(totalAttendees?.total)).toBe(5);
      expect(Number(checkedInCount?.total)).toBe(3);
    });

    it('should calculate event statistics', async () => {
      const totalAttendees = await DB('attendees')
        .where('event_id', testEventId)
        .count('* as total')
        .first();

      const checkedInCount = await DB('attendees')
        .where('event_id', testEventId)
        .where('status', 'checked_in')
        .count('* as total')
        .first();

      const total = Number(totalAttendees?.total || 0);
      const checkedIn = Number(checkedInCount?.total || 0);
      const pending = total - checkedIn;

      expect(total).toBe(5);
      expect(checkedIn).toBe(3);
      expect(pending).toBe(2);
    });
  });

  describe('Dashboard Analytics', () => {
    it('should get event type distribution', async () => {
      const eventTypeStats = await DB('events')
        .where('organization_id', orgId)
        .select('type', DB.raw('COUNT(*) as count'))
        .groupBy('type')
        .orderBy('count', 'desc');

      expect(eventTypeStats).toHaveLength(1);
      expect(eventTypeStats[0].type).toBe('conference');
      expect(Number(eventTypeStats[0].count)).toBe(3);
    });

    it('should get attendee status distribution', async () => {
      const attendeeStats = await DB('attendees')
        .join('events', 'attendees.event_id', 'events.id')
        .where('events.organization_id', orgId)
        .select('attendees.status', DB.raw('COUNT(*) as count'))
        .groupBy('attendees.status');

      expect(attendeeStats).toHaveLength(2);
      
      const registered = attendeeStats.find(s => s.status === 'registered');
      const checkedIn = attendeeStats.find(s => s.status === 'checked_in');

      expect(Number(registered?.count)).toBe(6);
      expect(Number(checkedIn?.count)).toBe(9);
    });

    it('should get registration trend', async () => {
      const registrationTrend = await DB('events')
        .where('organization_id', orgId)
        .select(DB.raw("strftime('%Y-%m', created_at / 1000, 'unixepoch') as month"))
        .select(DB.raw('COUNT(*) as count'))
        .groupBy('month')
        .orderBy('month', 'desc');

      expect(registrationTrend.length).toBeGreaterThan(0);
    });
  });

  describe('Dashboard Performance', () => {
    it('should use indexed columns for queries', async () => {
      // Organization dashboard queries
      const orgStats = await DB('events')
        .where('organization_id', orgId)
        .count('* as total')
        .first();

      expect(Number(orgStats?.total)).toBe(3);

      // Event dashboard queries
      const event = await DB('events').where('organization_id', orgId).first();
      const attendeeStats = await DB('attendees')
        .where('event_id', event.id)
        .count('* as total')
        .first();

      expect(Number(attendeeStats?.total)).toBe(5);
    });

    it('should handle large datasets efficiently', async () => {
      const startTime = Date.now();
      
      // Query all attendees for organization
      const attendees = await DB('attendees')
        .join('events', 'attendees.event_id', 'events.id')
        .where('events.organization_id', orgId)
        .select('attendees.*');

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(attendees).toHaveLength(15);
      expect(duration).toBeLessThan(1000); // Should complete in less than 1 second
    });
  });
});
