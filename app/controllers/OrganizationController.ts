import { Request, Response } from "../../type";
import DB from '../services/DB';
import Validator from '../services/Validator';
import { storeOrganizationSchema, updateOrganizationSchema, inviteMemberSchema, inviteNewUserSchema, updateMemberRoleSchema } from '../validators/OrganizationValidator';
import { randomBytes } from 'crypto';

class OrganizationController {
  async index(request: Request, response: Response) {
    const user = request.user;
    if (!user) {
      return response.redirect('/login', 302);
    }

    const organizations = await DB.from('organization_members')
      .join('organizations', 'organization_members.organization_id', 'organizations.id')
      .where('organization_members.user_id', user.id)
      .select(
        'organizations.id',
        'organizations.name',
        'organizations.slug',
        'organizations.description',
        'organizations.logo',
        'organizations.onboarding_completed',
        'organization_members.role',
        'organization_members.added_at'
      )
      .orderBy('organizations.created_at', 'desc');

    return response.inertia('organizations/index', {
      organizations
    });
  }

  async create(request: Request, response: Response) {
    return response.redirect('/onboarding', 303);
  }

  async store(request: Request, response: Response) {
    const user = request.user;
    if (!user) {
      return response.redirect('/login', 302);
    }

    const body = await request.json();
    const validationResult = Validator.validate(storeOrganizationSchema, body);
    if (!validationResult.success) {
      const firstError = Object.values(validationResult.errors || {})[0]?.[0] || 'Validasi gagal';
      return response.flash('error', firstError).redirect('/organizations/create', 302);
    }

    const { name, slug, description, logo } = validationResult.data!;

    try {
      const existingOrg = await DB.from('organizations').where('slug', slug).first();
      if (existingOrg) {
        return response.flash('error', 'Slug sudah digunakan').redirect('/organizations/create', 302);
      }

      const [organizationId] = await DB.table('organizations').insert({
        id: DB.raw("(hex(randomblob(16)))"),
        name,
        slug,
        description: description || null,
        logo: logo || null,
        settings: null,
        onboarding_completed: false,
        onboarding_step: 1,
        created_by: user.id,
        created_at: Date.now(),
        updated_at: Date.now()
      });

      await DB.table('organization_members').insert({
        id: DB.raw("(hex(randomblob(16)))"),
        organization_id: organizationId,
        user_id: user.id,
        role: 'admin',
        added_by: user.id,
        added_at: new Date(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      return response.flash('success', 'Organisasi berhasil dibuat').redirect(`/organizations/${organizationId}/dashboard`, 302);
    } catch (error: any) {
      console.error('Error creating organization:', error);
      if (error.code === 'SQLITE_CONSTRAINT') {
        return response.flash('error', 'Slug sudah digunakan').redirect('/organizations/create', 302);
      }
      return response.flash('error', 'Terjadi kesalahan').redirect('/organizations/create', 302);
    }
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const user = request.user;
    if (!user) {
      return response.redirect('/login', 302);
    }

    const organization = await DB.from('organizations').where('id', id).first();
    if (!organization) {
      return response.flash('error', 'Organisasi tidak ditemukan').redirect('/organizations', 303);
    }

    const member = await DB.from('organization_members')
      .where('organization_id', id)
      .where('user_id', user.id)
      .first();

    if (!member) {
      return response.flash('error', 'Anda tidak memiliki akses ke organisasi ini').redirect('/organizations', 303);
    }

    return response.redirect(`/organizations/${id}/dashboard`, 303);
  }

  async edit(request: Request, response: Response) {
    const { id } = request.params;
    const user = request.user;
    if (!user) {
      return response.redirect('/login', 302);
    }

    const organization = await DB.from('organizations').where('id', id).first();
    if (!organization) {
      return response.flash('error', 'Organisasi tidak ditemukan').redirect('/organizations', 303);
    }

    const member = await DB.from('organization_members')
      .where('organization_id', id)
      .where('user_id', user.id)
      .first();

    if (!member || (member.role !== 'admin' && member.role !== 'manager')) {
      return response.flash('error', 'Anda tidak memiliki izin untuk mengedit organisasi ini').redirect('/organizations', 303);
    }

    return response.inertia('organizations/form', {
      organization
    });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const user = request.user;
    if (!user) {
      return response.redirect('/login', 302);
    }

    const body = await request.json();
    const validationResult = Validator.validate(updateOrganizationSchema, body);
    if (!validationResult.success) {
      const firstError = Object.values(validationResult.errors || {})[0]?.[0] || 'Validasi gagal';
      return response.flash('error', firstError).redirect(`/organizations/${id}/edit`, 303);
    }

    const organization = await DB.from('organizations').where('id', id).first();
    if (!organization) {
      return response.flash('error', 'Organisasi tidak ditemukan').redirect('/organizations', 303);
    }

    const member = await DB.from('organization_members')
      .where('organization_id', id)
      .where('user_id', user.id)
      .first();

    if (!member || (member.role !== 'admin' && member.role !== 'manager')) {
      return response.flash('error', 'Anda tidak memiliki izin untuk mengedit organisasi ini').redirect('/organizations', 303);
    }

    const { name, slug, description, logo, onboarding_completed, onboarding_step } = validationResult.data!;

    try {
      const updateData: any = {
        updated_at: Date.now()
      };

      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (logo !== undefined) updateData.logo = logo;
      if (onboarding_completed !== undefined) updateData.onboarding_completed = onboarding_completed;
      if (onboarding_step !== undefined) updateData.onboarding_step = onboarding_step;

      if (slug !== undefined && slug !== organization.slug) {
        const existingOrg = await DB.from('organizations').where('slug', slug).whereNot('id', id).first();
        if (existingOrg) {
          return response.flash('error', 'Slug sudah digunakan').redirect(`/organizations/${id}/edit`, 303);
        }
        updateData.slug = slug;
      }

      await DB.from('organizations').where('id', id).update(updateData);

      return response.flash('success', 'Organisasi berhasil diperbarui').redirect(`/organizations/${id}/dashboard`, 303);
    } catch (error: any) {
      console.error('Error updating organization:', error);
      return response.flash('error', 'Terjadi kesalahan').redirect(`/organizations/${id}/edit`, 303);
    }
  }

  async destroy(request: Request, response: Response) {
    const { id } = request.params;
    const user = request.user;
    if (!user) {
      return response.redirect('/login', 302);
    }

    const organization = await DB.from('organizations').where('id', id).first();
    if (!organization) {
      return response.flash('error', 'Organisasi tidak ditemukan').redirect('/organizations', 303);
    }

    const member = await DB.from('organization_members')
      .where('organization_id', id)
      .where('user_id', user.id)
      .first();

    if (!member || member.role !== 'admin') {
      return response.flash('error', 'Anda tidak memiliki izin untuk menghapus organisasi ini').redirect('/organizations', 303);
    }

    try {
      await DB.from('organizations').where('id', id).delete();
      return response.flash('success', 'Organisasi berhasil dihapus').redirect('/organizations', 303);
    } catch (error: any) {
      console.error('Error deleting organization:', error);
      return response.flash('error', 'Terjadi kesalahan').redirect('/organizations', 303);
    }
  }

  async switch(request: Request, response: Response) {
    const user = request.user;
    if (!user) {
      return response.redirect('/login', 302);
    }

    const body = await request.json();
    const organizationId = body.organization_id;

    const organization = await DB.from('organizations').where('id', organizationId).first();
    if (!organization) {
      return response.flash('error', 'Organisasi tidak ditemukan').redirect('/organizations', 303);
    }

    const member = await DB.from('organization_members')
      .where('organization_id', organizationId)
      .where('user_id', user.id)
      .first();

    if (!member) {
      return response.flash('error', 'Anda tidak memiliki akses ke organisasi ini').redirect('/organizations', 303);
    }

    return response.flash('success', `Berhasil beralih ke ${organization.name}`).redirect(`/organizations/${organizationId}/dashboard`, 303);
  }

  async members(request: Request, response: Response) {
    const { id } = request.params;
    const user = request.user;
    if (!user) {
      return response.redirect('/login', 302);
    }

    const organization = await DB.from('organizations').where('id', id).first();
    if (!organization) {
      return response.flash('error', 'Organisasi tidak ditemukan').redirect('/organizations', 303);
    }

    const member = await DB.from('organization_members')
      .where('organization_id', id)
      .where('user_id', user.id)
      .first();

    if (!member) {
      return response.flash('error', 'Anda tidak memiliki akses ke organisasi ini').redirect('/organizations', 303);
    }

    const members = await DB.from('organization_members')
      .join('users', 'organization_members.user_id', 'users.id')
      .where('organization_members.organization_id', id)
      .select(
        'organization_members.id',
        'organization_members.role',
        'organization_members.added_at',
        'organization_members.added_by',
        'users.id as user_id',
        'users.name',
        'users.email',
        'users.avatar'
      )
      .orderBy('organization_members.created_at', 'desc');

    return response.inertia('organizations/members', {
      organization,
      members,
      currentUserRole: member.role
    });
  }

  async invite(request: Request, response: Response) {
    const { id } = request.params;
    const user = request.user;
    if (!user) {
      return response.redirect('/login', 302);
    }

    const organization = await DB.from('organizations').where('id', id).first();
    if (!organization) {
      return response.flash('error', 'Organisasi tidak ditemukan').redirect('/organizations', 303);
    }

    const member = await DB.from('organization_members')
      .where('organization_id', id)
      .where('user_id', user.id)
      .first();

    if (!member || (member.role !== 'admin' && member.role !== 'manager')) {
      return response.flash('error', 'Anda tidak memiliki izin untuk mengundang anggota').redirect('/organizations', 303);
    }

    return response.inertia('organizations/invite', {
      organization,
      currentUserRole: member.role
    });
  }

  async inviteMember(request: Request, response: Response) {
    const { id } = request.params;
    const user = request.user;
    if (!user) {
      return response.redirect('/login', 302);
    }

    const body = await request.json();
    const validationResult = Validator.validate(inviteMemberSchema, body);
    if (!validationResult.success) {
      const firstError = Object.values(validationResult.errors || {})[0]?.[0] || 'Validasi gagal';
      return response.flash('error', firstError).redirect(`/organizations/${id}/members`, 303);
    }

    const { email, role } = validationResult.data!;

    const organization = await DB.from('organizations').where('id', id).first();
    if (!organization) {
      return response.flash('error', 'Organisasi tidak ditemukan').redirect('/organizations', 303);
    }

    const member = await DB.from('organization_members')
      .where('organization_id', id)
      .where('user_id', user.id)
      .first();

    if (!member || (member.role !== 'admin' && member.role !== 'manager')) {
      return response.flash('error', 'Anda tidak memiliki izin untuk menambahkan anggota').redirect(`/organizations/${id}/members`, 303);
    }

    const existingUser = await DB.from('users').where('email', email).first();
    if (!existingUser) {
      return response.flash('error', 'Pengguna tidak ditemukan').redirect(`/organizations/${id}/members`, 303);
    }

    const existingMember = await DB.from('organization_members')
      .where('organization_id', id)
      .where('user_id', existingUser.id)
      .first();

    if (existingMember) {
      return response.flash('error', 'Pengguna sudah menjadi anggota organisasi ini').redirect(`/organizations/${id}/members`, 303);
    }

    try {
      await DB.table('organization_members').insert({
        id: DB.raw("(hex(randomblob(16)))"),
        organization_id: id,
        user_id: existingUser.id,
        role,
        added_by: user.id,
        added_at: new Date(),
        created_at: Date.now(),
        updated_at: Date.now()
      });

      return response.flash('success', 'Anggota berhasil ditambahkan').redirect(`/organizations/${id}/members`, 303);
    } catch (error: any) {
      console.error('Error inviting member:', error);
      return response.flash('error', 'Terjadi kesalahan').redirect(`/organizations/${id}/members`, 303);
    }
  }

  async inviteNewUser(request: Request, response: Response) {
    const { id } = request.params;
    const user = request.user;
    if (!user) {
      return response.redirect('/login', 302);
    }

    const body = await request.json();
    const validationResult = Validator.validate(inviteNewUserSchema, body);
    if (!validationResult.success) {
      const firstError = Object.values(validationResult.errors || {})[0]?.[0] || 'Validasi gagal';
      return response.flash('error', firstError).redirect(`/organizations/${id}/members`, 303);
    }

    const { email, name, role } = validationResult.data!;

    const organization = await DB.from('organizations').where('id', id).first();
    if (!organization) {
      return response.flash('error', 'Organisasi tidak ditemukan').redirect('/organizations', 303);
    }

    const member = await DB.from('organization_members')
      .where('organization_id', id)
      .where('user_id', user.id)
      .first();

    if (!member || (member.role !== 'admin' && member.role !== 'manager')) {
      return response.flash('error', 'Anda tidak memiliki izin untuk menambahkan anggota').redirect(`/organizations/${id}/members`, 303);
    }

    const existingUser = await DB.from('users').where('email', email).first();

    try {
      if (existingUser) {
        // User already exists, just add them to the organization
        const existingMember = await DB.from('organization_members')
          .where('organization_id', id)
          .where('user_id', existingUser.id)
          .first();

        if (existingMember) {
          return response.flash('error', 'Pengguna sudah menjadi anggota organisasi ini').redirect(`/organizations/${id}/members`, 303);
        }

        await DB.table('organization_members').insert({
          id: DB.raw("(hex(randomblob(16)))"),
          organization_id: id,
          user_id: existingUser.id,
          role,
          added_by: user.id,
          added_at: new Date(),
          created_at: Date.now(),
          updated_at: Date.now()
        });

        return response.flash('success', 'Anggota berhasil ditambahkan').redirect(`/organizations/${id}/members`, 303);
      } else {
        // Create new user
        const generatedPassword = randomBytes(6).toString('hex');

        const [userId] = await DB.table('users').insert({
          id: DB.raw("(hex(randomblob(16)))"),
          name: name || email.split('@')[0],
          email,
          password: generatedPassword,
          is_verified: true,
          created_at: Date.now(),
          updated_at: Date.now()
        });

        await DB.table('organization_members').insert({
          id: DB.raw("(hex(randomblob(16)))"),
          organization_id: id,
          user_id: userId,
          role,
          added_by: user.id,
          added_at: new Date(),
          created_at: Date.now(),
          updated_at: Date.now()
        });

        return response.flash('success', 'Pengguna baru berhasil ditambahkan').redirect(`/organizations/${id}/members`, 303);
      }
    } catch (error: any) {
      console.error('Error inviting user:', error);
      return response.flash('error', 'Terjadi kesalahan').redirect(`/organizations/${id}/members`, 303);
    }
  }

  async updateMemberRole(request: Request, response: Response) {
    const { id, userId } = request.params;
    const user = request.user;
    if (!user) {
      return response.redirect('/login', 302);
    }

    const body = await request.json();
    const validationResult = Validator.validate(updateMemberRoleSchema, body);
    if (!validationResult.success) {
      const firstError = Object.values(validationResult.errors || {})[0]?.[0] || 'Validasi gagal';
      return response.flash('error', firstError).redirect(`/organizations/${id}/members`, 303);
    }

    const { role } = validationResult.data!;

    const organization = await DB.from('organizations').where('id', id).first();
    if (!organization) {
      return response.flash('error', 'Organisasi tidak ditemukan').redirect('/organizations', 303);
    }

    const currentMember = await DB.from('organization_members')
      .where('organization_id', id)
      .where('user_id', user.id)
      .first();

    if (!currentMember || currentMember.role !== 'admin') {
      return response.flash('error', 'Anda tidak memiliki izin untuk mengubah peran anggota').redirect(`/organizations/${id}/members`, 303);
    }

    const targetMember = await DB.from('organization_members')
      .where('organization_id', id)
      .where('user_id', userId)
      .first();

    if (!targetMember) {
      return response.flash('error', 'Anggota tidak ditemukan').redirect(`/organizations/${id}/members`, 303);
    }

    if (targetMember.user_id === user.id) {
      return response.flash('error', 'Anda tidak dapat mengubah peran Anda sendiri').redirect(`/organizations/${id}/members`, 303);
    }

    try {
      await DB.from('organization_members')
        .where('organization_id', id)
        .where('user_id', userId)
        .update({
          role,
          updated_at: Date.now()
        });

      return response.flash('success', 'Peran anggota berhasil diperbarui').redirect(`/organizations/${id}/members`, 303);
    } catch (error: any) {
      console.error('Error updating member role:', error);
      return response.flash('error', 'Terjadi kesalahan').redirect(`/organizations/${id}/members`, 303);
    }
  }

  async removeMember(request: Request, response: Response) {
    const { id, userId } = request.params;
    const user = request.user;
    if (!user) {
      return response.redirect('/login', 302);
    }

    const organization = await DB.from('organizations').where('id', id).first();
    if (!organization) {
      return response.flash('error', 'Organisasi tidak ditemukan').redirect('/organizations', 303);
    }

    const currentMember = await DB.from('organization_members')
      .where('organization_id', id)
      .where('user_id', user.id)
      .first();

    if (!currentMember || currentMember.role !== 'admin') {
      return response.flash('error', 'Anda tidak memiliki izin untuk menghapus anggota').redirect(`/organizations/${id}/members`, 303);
    }

    const targetMember = await DB.from('organization_members')
      .where('organization_id', id)
      .where('user_id', userId)
      .first();

    if (!targetMember) {
      return response.flash('error', 'Anggota tidak ditemukan').redirect(`/organizations/${id}/members`, 303);
    }

    if (targetMember.user_id === user.id) {
      return response.flash('error', 'Anda tidak dapat menghapus diri sendiri').redirect(`/organizations/${id}/members`, 303);
    }

    try {
      await DB.from('organization_members')
        .where('organization_id', id)
        .where('user_id', userId)
        .delete();

      return response.flash('success', 'Anggota berhasil dihapus').redirect(`/organizations/${id}/members`, 303);
    } catch (error: any) {
      console.error('Error removing member:', error);
      return response.flash('error', 'Terjadi kesalahan').redirect(`/organizations/${id}/members`, 303);
    }
  }
}

export default new OrganizationController();
