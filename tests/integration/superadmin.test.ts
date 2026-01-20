import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import DB from '../../app/services/DB';
import Authenticate from '../../app/services/Authenticate';
import { v4 as uuidv4 } from 'uuid';

describe('SuperAdmin Integration Tests', () => {
  let adminUserId: string;
  let orgIds: string[] = [];
  let userIds: string[] = [];
  let eventIds: string[] = [];
  let attendeeIds: string[] = [];

  beforeEach(async () => {
    // Create admin user
    adminUserId = uuidv4();
    const hashedPassword = await Authenticate.hash('adminPassword123');
    await DB.table('users').insert({
      id: adminUserId,
      name: 'Super Admin',
      email: `admin-${Date.now()}@example.com`,
      password: hashedPassword,
      is_verified: true,
      is_admin: true,
      created_at: Date.now(),
      updated_at: Date.now()
    });

    // Create organizations
    for (let i = 0; i < 3; i++) {
      const orgId = uuidv4();
      orgIds.push(orgId);
      
      await DB.table('organizations').insert({
        id: orgId,
        name: `Organization ${i + 1}`,
        slug: `org-${i + 1}-${Date.now()}`,
        description: `Organization ${i + 1} description`,
        onboarding_completed: true,
        onboarding_step: 5,
        created_at: Date.now() - (i * 86400000),
        updated_at: Date.now()
      });

      // Add admin as org member
      await DB.table('organization_members').insert({
        id: uuidv4(),
        organization_id: orgId,
        user_id: adminUserId,
        role: 'admin',
        added_by: adminUserId,
        added_at: new Date(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      // Create users for each organization
      for (let j = 0; j < 2; j++) {
        const userId = uuidv4();
        userIds.push(userId);
        
        const userHashedPassword = await Authenticate.hash('userPassword123');
        await DB.table('users').insert({
          id: userId,
          name: `User ${i + 1}-${j + 1}`,
          email: `user${i}${j}-${Date.now()}@example.com`,
          password: userHashedPassword,
          is_verified: true,
          created_at: Date.now(),
          updated_at: Date.now()
        });

        await DB.table('organization_members').insert({
          id: uuidv4(),
          organization_id: orgId,
          user_id: userId,
          role: j === 0 ? 'manager' : 'staff',
          added_by: adminUserId,
          added_at: new Date(),
          created_at: Date.now(),
          updated_at: Date.now()
        });

        // Create events
        for (let k = 0; k < 2; k++) {
          const eventId = uuidv4();
          eventIds.push(eventId);
          
          await DB.table('events').insert({
            id: eventId,
            organization_id: orgId,
            name: `Event ${i + 1}-${k + 1}`,
            slug: `event-${i}${k}-${Date.now()}`,
            description: `Event ${i + 1}-${k + 1} description`,
            type: 'conference',
            start_date: Date.now() + (86400000 * (k + 1)),
            end_date: Date.now() + (172800000 * (k + 1)),
            is_public: k % 2 === 0,
            registration_open: true,
            entry_system: 'qr',
            status: k === 0 ? 'published' : 'draft',
            created_by: userId,
            created_at: Date.now(),
            updated_at: Date.now()
          });

          // Create attendees
          for (let l = 0; l < 3; l++) {
            const attendeeId = uuidv4();
            attendeeIds.push(attendeeId);
            
            await DB.table('attendees').insert({
              id: attendeeId,
              event_id: eventId,
              name: `Attendee ${i}-${k}-${l}`,
              email: `attendee${i}${k}${l}-${Date.now()}@example.com`,
              qr_code: `qr-${attendeeId}`,
              status: l < 2 ? 'checked_in' : 'registered',
              registration_method: 'admin',
              registered_at: Date.now(),
              checked_in_at: l < 2 ? Date.now() : null,
              checked_in_by: userId,
              created_at: Date.now(),
              updated_at: Date.now()
            });

            // Create check-ins for checked-in attendees
            if (l < 2) {
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
    for (const eventId of eventIds) {
      await DB('event_settings').where('event_id', eventId).delete();
      await DB('events').where('id', eventId).delete();
    }

    // Delete organization members
    for (const orgId of orgIds) {
      await DB('organization_members').where('organization_id', orgId).delete();
    }

    // Delete organizations
    for (const orgId of orgIds) {
      await DB('organizations').where('id', orgId).delete();
    }

    // Delete users
    for (const userId of userIds) {
      await DB('users').where('id', userId).delete();
    }

    // Delete admin user
    await DB('users').where('id', adminUserId).delete();
  });

  describe('Platform-wide Statistics', () => {
    it('should get total organizations count', async () => {
      const result = await DB('organizations').count('* as count').first();
      expect(Number(result?.count)).toBeGreaterThanOrEqual(3);
    });

    it('should get total users count', async () => {
      const result = await DB('users').count('* as count').first();
      expect(Number(result?.count)).toBeGreaterThanOrEqual(7); // 1 admin + 6 regular users
    });

    it('should get total events count', async () => {
      const result = await DB('events').count('* as count').first();
      expect(Number(result?.count)).toBeGreaterThanOrEqual(12); // 3 orgs * 2 users * 2 events
    });

    it('should get total attendees count', async () => {
      const result = await DB('attendees').count('* as count').first();
      expect(Number(result?.count)).toBeGreaterThanOrEqual(36); // 12 events * 3 attendees
    });
  });

  describe('Recent Organizations', () => {
    it('should get recent organizations', async () => {
      const recentOrganizations = await DB('organizations')
        .select('*')
        .orderBy('created_at', 'desc')
        .limit(5);

      expect(recentOrganizations.length).toBeGreaterThanOrEqual(3);
      expect(recentOrganizations[0].name).toContain('Organization');
    });

    it('should get organizations with event count', async () => {
      const organizations = await DB('organizations')
        .select('organizations.*', DB.raw('COUNT(DISTINCT events.id) as event_count'))
        .leftJoin('events', 'organizations.id', 'events.organization_id')
        .groupBy('organizations.id')
        .orderBy('organizations.created_at', 'desc');

      expect(organizations.length).toBeGreaterThan(0);
      expect(Number(organizations[0].event_count)).toBeGreaterThan(0);
    });
  });

  describe('Recent Events', () => {
    it('should get recent events with organization name', async () => {
      const recentEvents = await DB('events')
        .select('events.*', 'organizations.name as organization_name')
        .join('organizations', 'events.organization_id', 'organizations.id')
        .orderBy('events.created_at', 'desc')
        .limit(5);

      expect(recentEvents).toHaveLength(5);
      expect(recentEvents[0].organization_name).toBeDefined();
    });
  });

  describe('Platform Analytics', () => {
    it('should get monthly organization creation stats', async () => {
      const monthlyStats = await DB('organizations')
        .select(
          DB.raw("strftime('%Y-%m', created_at / 1000, 'unixepoch') as month"),
          DB.raw('COUNT(*) as count')
        )
        .groupBy('month')
        .orderBy('month', 'desc')
        .limit(12);

      expect(monthlyStats.length).toBeGreaterThan(0);
    });

    it('should get event type distribution', async () => {
      const eventTypeStats = await DB('events')
        .select('type', DB.raw('COUNT(*) as count'))
        .groupBy('type')
        .orderBy('count', 'desc');

      expect(eventTypeStats).toHaveLength(1);
      expect(eventTypeStats[0].type).toBe('conference');
      expect(Number(eventTypeStats[0].count)).toBe(12);
    });

    it('should get attendee status distribution', async () => {
      const attendeeStats = await DB('attendees')
        .select('status', DB.raw('COUNT(*) as count'))
        .groupBy('status');

      expect(attendeeStats).toHaveLength(2);
      
      const registered = attendeeStats.find(s => s.status === 'registered');
      const checkedIn = attendeeStats.find(s => s.status === 'checked_in');

      expect(Number(registered?.count)).toBe(12); // 36 total / 3 = 12 registered
      expect(Number(checkedIn?.count)).toBe(24); // 36 total / 3 * 2 = 24 checked_in
    });

    it('should get organization growth over time', async () => {
      const stats = await DB('organizations')
        .select(
          DB.raw("strftime('%Y-%m', created_at / 1000, 'unixepoch') as month"),
          DB.raw('COUNT(*) as count')
        )
        .groupBy('month')
        .orderBy('month', 'asc');

      expect(stats.length).toBeGreaterThan(0);
    });
  });

  describe('User Management', () => {
    it('should get all users with organization count', async () => {
      const users = await DB('users')
        .select('users.*', DB.raw('COUNT(DISTINCT organization_members.id) as org_count'))
        .leftJoin('organization_members', 'users.id', 'organization_members.user_id')
        .groupBy('users.id')
        .orderBy('users.created_at', 'desc');

      expect(users).toHaveLength(7);
      
      // Admin should be in all 3 organizations
      const admin = users.find(u => u.id === adminUserId);
      expect(Number(admin?.org_count)).toBe(3);

      // Regular users should be in 1 organization each
      const regularUsers = users.filter(u => u.id !== adminUserId);
      for (const user of regularUsers) {
        expect(Number(user.org_count)).toBe(1);
      }
    });

    it('should get user roles distribution', async () => {
      const roles = await DB('organization_members')
        .select('role', DB.raw('COUNT(*) as count'))
        .groupBy('role');

      expect(roles).toHaveLength(3); // admin, manager, staff
      
      const adminCount = roles.find(r => r.role === 'admin');
      const managerCount = roles.find(r => r.role === 'manager');
      const staffCount = roles.find(r => r.role === 'staff');

      expect(Number(adminCount?.count)).toBe(3); // 1 admin per org
      expect(Number(managerCount?.count)).toBe(3); // 1 manager per org
      expect(Number(staffCount?.count)).toBe(3); // 1 staff per org
    });
  });

  describe('System Health', () => {
    it('should get active organizations count', async () => {
      const activeOrgs = await DB('organizations')
        .where('onboarding_completed', true)
        .count('* as count')
        .first();

      expect(Number(activeOrgs?.count)).toBe(3);
    });

    it('should get published events count', async () => {
      const publishedEvents = await DB('events')
        .where('status', 'published')
        .count('* as count')
        .first();

      expect(Number(publishedEvents?.count)).toBe(6); // 12 events / 2 = 6 published
    });

    it('should get total check-ins count', async () => {
      const result = await DB('check_ins').count('* as count').first();
      expect(Number(result?.count)).toBe(24); // 36 attendees * 2/3 checked_in
    });

    it('should get check-in rate across all events', async () => {
      const totalAttendees = await DB('attendees').count('* as total').first();
      const totalCheckIns = await DB('check_ins').count('* as total').first();

      const total = Number(totalAttendees?.total || 0);
      const checkIns = Number(totalCheckIns?.total || 0);
      const rate = total > 0 ? Math.round((checkIns / total) * 100) : 0;

      expect(rate).toBe(67); // 24/36 = 66.67% ≈ 67%
    });
  });

  describe('Platform Performance', () => {
    it('should handle large dataset queries efficiently', async () => {
      const startTime = Date.now();
      
      // Query all platform data
      const stats = {
        organizations: await DB('organizations').count('* as count').first(),
        users: await DB('users').count('* as count').first(),
        events: await DB('events').count('* as count').first(),
        attendees: await DB('attendees').count('* as count').first(),
        checkIns: await DB('check_ins').count('* as count').first()
      };

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000); // Should complete in less than 1 second
      expect(Number(stats.organizations?.count)).toBeGreaterThan(0);
      expect(Number(stats.users?.count)).toBeGreaterThan(0);
      expect(Number(stats.events?.count)).toBeGreaterThan(0);
      expect(Number(stats.attendees?.count)).toBeGreaterThan(0);
      expect(Number(stats.checkIns?.count)).toBeGreaterThan(0);
    });

    it('should use indexed columns for performance', async () => {
      if (orgIds.length === 0) {
        // Skip if no orgIds were created
        return;
      }

      const startTime = Date.now();
      
      // Query using indexed columns
      const events = await DB('events')
        .where('organization_id', orgIds[0])
        .where('status', 'published')
        .select('*');

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(events.length).toBeGreaterThanOrEqual(0);
      expect(duration).toBeLessThan(100); // Should be very fast with indexes
    });
  });
});
