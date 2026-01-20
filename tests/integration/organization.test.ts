import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import DB from '../../app/services/DB';
import Authenticate from '../../app/services/Authenticate';
import { v4 as uuidv4 } from 'uuid';

describe('Organization Integration Tests', () => {
  let userId: string;
  let orgId: string;
  let memberId: string;

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
  });

  afterEach(async () => {
    // Cleanup in reverse order
    if (memberId) {
      await DB('organization_members').where('id', memberId).delete();
    }
    if (orgId) {
      await DB('organizations').where('id', orgId).delete();
    }
    if (userId) {
      await DB('users').where('id', userId).delete();
    }
  });

  describe('Organization CRUD', () => {
    it('should create organization', async () => {
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

      const org = await DB('organizations').where('id', orgId).first();
      expect(org).toBeDefined();
      expect(org.name).toBe('Test Organization');
      expect(org.slug).toContain('test-org');
    });

    it('should read organization', async () => {
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

      const org = await DB('organizations').where('id', orgId).first();
      expect(org.name).toBe('Test Organization');
      expect(org.description).toBe('Test description');
    });

    it('should update organization', async () => {
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

      await DB('organizations').where('id', orgId).update({
        name: 'Updated Organization',
        description: 'Updated description',
        updated_at: Date.now()
      });

      const org = await DB('organizations').where('id', orgId).first();
      expect(org.name).toBe('Updated Organization');
      expect(org.description).toBe('Updated description');
    });

    it('should delete organization', async () => {
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

      await DB('organizations').where('id', orgId).delete();

      const org = await DB('organizations').where('id', orgId).first();
      expect(org).toBeUndefined();
    });
  });

  describe('Organization Members', () => {
    beforeEach(async () => {
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
    });

    it('should add member to organization', async () => {
      memberId = uuidv4();
      await DB.table('organization_members').insert({
        id: memberId,
        organization_id: orgId,
        user_id: userId,
        role: 'admin',
        added_by: userId,
        added_at: new Date(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      const member = await DB('organization_members').where('id', memberId).first();
      expect(member).toBeDefined();
      expect(member.role).toBe('admin');
      expect(member.organization_id).toBe(orgId);
      expect(member.user_id).toBe(userId);
    });

    it('should update member role', async () => {
      memberId = uuidv4();
      await DB.table('organization_members').insert({
        id: memberId,
        organization_id: orgId,
        user_id: userId,
        role: 'admin',
        added_by: userId,
        added_at: new Date(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      await DB('organization_members').where('id', memberId).update({
        role: 'manager',
        updated_at: Date.now()
      });

      const member = await DB('organization_members').where('id', memberId).first();
      expect(member.role).toBe('manager');
    });

    it('should remove member from organization', async () => {
      memberId = uuidv4();
      await DB.table('organization_members').insert({
        id: memberId,
        organization_id: orgId,
        user_id: userId,
        role: 'admin',
        added_by: userId,
        added_at: new Date(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      await DB('organization_members').where('id', memberId).delete();

      const member = await DB('organization_members').where('id', memberId).first();
      expect(member).toBeUndefined();
    });

    it('should enforce unique organization-user constraint', async () => {
      memberId = uuidv4();
      await DB.table('organization_members').insert({
        id: memberId,
        organization_id: orgId,
        user_id: userId,
        role: 'admin',
        added_by: userId,
        added_at: new Date(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      // Try to insert duplicate
      await expect(
        DB.table('organization_members').insert({
          id: uuidv4(),
          organization_id: orgId,
          user_id: userId,
          role: 'manager',
          added_by: userId,
          added_at: new Date(),
          created_at: Date.now(),
          updated_at: Date.now()
        })
      ).rejects.toThrow();
    });

    it('should get all members of organization', async () => {
      memberId = uuidv4();
      await DB.table('organization_members').insert({
        id: memberId,
        organization_id: orgId,
        user_id: userId,
        role: 'admin',
        added_by: userId,
        added_at: new Date(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      const members = await DB('organization_members')
        .where('organization_id', orgId)
        .select('*');

      expect(members).toHaveLength(1);
      expect(members[0].user_id).toBe(userId);
    });
  });

  describe('Organization Slug Uniqueness', () => {
    it('should enforce unique slug constraint', async () => {
      const slug = `test-org-${Date.now()}-${Math.random()}`;
      
      await DB.table('organizations').insert({
        id: uuidv4(),
        name: 'Test Organization 1',
        slug,
        description: 'Test description',
        onboarding_completed: false,
        onboarding_step: 1,
        created_at: Date.now(),
        updated_at: Date.now()
      });

      // Try to insert duplicate slug
      await expect(
        DB.table('organizations').insert({
          id: uuidv4(),
          name: 'Test Organization 2',
          slug,
          description: 'Test description',
          onboarding_completed: false,
          onboarding_step: 1,
          created_at: Date.now(),
          updated_at: Date.now()
        })
      ).rejects.toThrow();
    });
  });

  describe('Organization with Events Cascade', () => {
    let eventId: string;

    beforeEach(async () => {
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
        created_at: Date.now(),
        updated_at: Date.now()
      });
    });

    it('should cascade delete events when organization is deleted', async () => {
      await DB('organizations').where('id', orgId).delete();

      const event = await DB('events').where('id', eventId).first();
      expect(event).toBeUndefined();
    });
  });
});
