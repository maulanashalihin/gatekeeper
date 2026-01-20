/**
 * Organization Validation Schemas
 * Schemas for OrganizationController
 */

import { z } from 'zod';
import { field } from './CommonValidator';

/**
 * Store organization schema
 * Used by: OrganizationController.store
 */
export const storeOrganizationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255, 'Name must be at most 255 characters').trim(),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(255, 'Slug must be at most 255 characters').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and dashes'),
  description: z.string().optional(),
  logo: z.string().url('Invalid logo URL').optional(),
});

/**
 * Update organization schema
 * Used by: OrganizationController.update
 */
export const updateOrganizationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255, 'Name must be at most 255 characters').trim().optional(),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(255, 'Slug must be at most 255 characters').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and dashes').optional(),
  description: z.string().optional(),
  logo: z.string().url('Invalid logo URL').optional(),
  onboarding_completed: z.boolean().optional(),
  onboarding_step: z.number().int().min(1).max(5).optional(),
});

/**
 * Invite member schema (existing user)
 * Used by: OrganizationController.inviteMember
 */
export const inviteMemberSchema = z.object({
  email: field.email,
  role: z.enum(['admin', 'manager', 'staff'], {
    message: 'Role must be admin, manager, or staff',
  }),
});

/**
 * Invite new user schema
 * Used by: OrganizationController.inviteNewUser
 */
export const inviteNewUserSchema = z.object({
  email: field.email,
  name: field.name,
  role: z.enum(['admin', 'manager', 'staff'], {
    message: 'Role must be admin, manager, or staff',
  }),
});

/**
 * Update member role schema
 * Used by: OrganizationController.updateMemberRole
 */
export const updateMemberRoleSchema = z.object({
  role: z.enum(['admin', 'manager', 'staff'], {
    message: 'Role must be admin, manager, or staff',
  }),
});

/**
 * Switch organization schema
 * Used by: OrganizationController.switch
 */
export const switchOrganizationSchema = z.object({
  organization_id: z.string().uuid('Invalid organization ID'),
});
