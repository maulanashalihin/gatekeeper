import { Request, Response } from "../../type";
import DB from '../services/DB';
import Validator from '../services/Validator';
import CacheService from '../services/CacheService';
import { uuidv7 } from "uuidv7";
import { storeEventSchema, updateEventSchema, eventSettingsSchema, addEventMemberSchema, updateEventMemberSchema } from '../validators/EventValidator';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

class EventController {
  async index(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const events = await DB.from('events')
      .where('organization_id', orgUuid)
      .orderBy('created_at', 'desc')
      .select('*');

    return response.inertia('events/index', {
      events,
      orgUuid
    });
  }

  async create(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    return response.inertia('events/form', {
      event: null,
      orgUuid
    });
  }

  async store(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const body = await request.json();
    const validationResult = Validator.validate(storeEventSchema, body);

    if (!validationResult.success) {
      const errors = validationResult.errors || {};
      const firstError = Object.values(errors)[0]?.[0] || 'Validation failed';
      return response.flash('error', firstError).redirect(`/organizations/${orgUuid}/events/create`, 302);
    }

    const data = validationResult.data!;

    try {
      await DB.table('events').insert({
        id: uuidv7(),
        organization_id: orgUuid,
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        type: data.type,
        start_date: dayjs(data.start_date).utc().valueOf(),
        end_date: dayjs(data.end_date).utc().valueOf(),
        location: data.location || null,
        city: data.city || null,
        province: data.province || null,
        venue: data.venue || null,
        address: data.address || null,
        capacity: data.capacity || null,
        image: data.image || null,
        is_public: data.is_public,
        registration_open: data.registration_open,
        registration_start: data.registration_start ? dayjs(data.registration_start).utc().valueOf() : null,
        registration_end: data.registration_end ? dayjs(data.registration_end).utc().valueOf() : null,
        checkin_start: data.checkin_start ? dayjs(data.checkin_start).utc().valueOf() : null,
        checkin_end: data.checkin_end ? dayjs(data.checkin_end).utc().valueOf() : null,
        entry_system: data.entry_system,
        status: data.status,
        created_by: user.id,
        created_at: Date.now(),
        updated_at: Date.now()
      });

      // Clear organization cache
      await CacheService.forget(`org_stats_${orgUuid}`);
      await CacheService.forget(`org_events_${orgUuid}`);

      return response.flash('success', 'Event created successfully').redirect(`/organizations/${orgUuid}/events`, 302);
    } catch (error: any) {
      console.error('Error creating event:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      if (error.message && error.message.includes('UNIQUE constraint')) {
        return response.flash('error', 'Slug already exists').redirect(`/organizations/${orgUuid}/events/create`, 302);
      }
      if (error.message && error.message.includes('no such column')) {
        return response.flash('error', 'Database schema error: ' + error.message).redirect(`/organizations/${orgUuid}/events/create`, 302);
      }
      return response.flash('error', 'Failed to create event: ' + (error.message || 'Unknown error')).redirect(`/organizations/${orgUuid}/events/create`, 302);
    }
  }

  async show(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const uuid = request.params.uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const event = await DB.from('events')
      .where('id', uuid)
      .where('organization_id', orgUuid)
      .first();

    if (!event) {
      return response.flash('error', 'Event not found').redirect(`/organizations/${orgUuid}/events`, 302);
    }

    return response.inertia('events/show', {
      event,
      orgUuid
    });
  }

  async edit(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const uuid = request.params.uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const event = await DB.from('events')
      .where('id', uuid)
      .where('organization_id', orgUuid)
      .first();

    if (!event) {
      return response.flash('error', 'Event not found').redirect(`/organizations/${orgUuid}/events`, 302);
    }

    return response.inertia('events/form', {
      event,
      orgUuid
    });
  }

  async update(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const uuid = request.params.uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const body = await request.json();
    const validationResult = Validator.validate(updateEventSchema, body);

    if (!validationResult.success) {
      const errors = validationResult.errors || {};
      const firstError = Object.values(errors)[0]?.[0] || 'Validation failed';
      return response.flash('error', firstError).redirect(`/organizations/${orgUuid}/events/${uuid}/edit`, 303);
    }

    const data = validationResult.data!;

    try {
      const updateData: any = {
        updated_at: Date.now()
      };

      if (data.name !== undefined) updateData.name = data.name;
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.type !== undefined) updateData.type = data.type;
      if (data.start_date !== undefined) updateData.start_date = dayjs(data.start_date).utc().valueOf();
      if (data.end_date !== undefined) updateData.end_date = dayjs(data.end_date).utc().valueOf();
      if (data.location !== undefined) updateData.location = data.location;
      if (data.city !== undefined) updateData.city = data.city;
      if (data.province !== undefined) updateData.province = data.province;
      if (data.venue !== undefined) updateData.venue = data.venue;
      if (data.address !== undefined) updateData.address = data.address;
      if (data.capacity !== undefined) updateData.capacity = data.capacity;
      if (data.image !== undefined) updateData.image = data.image;
      if (data.is_public !== undefined) updateData.is_public = data.is_public;
      if (data.registration_open !== undefined) updateData.registration_open = data.registration_open;
      if (data.registration_start !== undefined) updateData.registration_start = data.registration_start ? dayjs(data.registration_start).utc().valueOf() : null;
      if (data.registration_end !== undefined) updateData.registration_end = data.registration_end ? dayjs(data.registration_end).utc().valueOf() : null;
      if (data.checkin_start !== undefined) updateData.checkin_start = data.checkin_start ? dayjs(data.checkin_start).utc().valueOf() : null;
      if (data.checkin_end !== undefined) updateData.checkin_end = data.checkin_end ? dayjs(data.checkin_end).utc().valueOf() : null;
      if (data.entry_system !== undefined) updateData.entry_system = data.entry_system;
      if (data.status !== undefined) updateData.status = data.status;

      await DB.from('events')
        .where('id', uuid)
        .where('organization_id', orgUuid)
        .update(updateData);

      // Clear organization cache
      await CacheService.forget(`org_stats_${orgUuid}`);
      await CacheService.forget(`org_events_${orgUuid}`);

      return response.flash('success', 'Event updated successfully').redirect(`/organizations/${orgUuid}/events`, 303);
    } catch (error: any) {
      if (error.message && error.message.includes('UNIQUE constraint')) {
        return response.flash('error', 'Slug already exists').redirect(`/organizations/${orgUuid}/events/${uuid}/edit`, 303);
      }
      return response.flash('error', 'Failed to update event').redirect(`/organizations/${orgUuid}/events/${uuid}/edit`, 303);
    }
  }

  async destroy(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const uuid = request.params.uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    await DB.from('events')
      .where('id', uuid)
      .where('organization_id', orgUuid)
      .delete();

    // Clear organization cache
    await CacheService.forget(`org_stats_${orgUuid}`);
    await CacheService.forget(`org_events_${orgUuid}`);

    return response.flash('success', 'Event deleted successfully').redirect(`/organizations/${orgUuid}/events`, 303);
  }

  async dashboard(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const uuid = request.params.uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const event = await DB.from('events')
      .where('id', uuid)
      .where('organization_id', orgUuid)
      .first();

    if (!event) {
      return response.flash('error', 'Event not found').redirect(`/organizations/${orgUuid}/events`, 302);
    }

    const totalAttendees = await DB.from('attendees')
      .where('event_id', uuid)
      .count('* as total')
      .first();

    const checkedInCount = await DB.from('attendees')
      .where('event_id', uuid)
      .where('status', 'checked_in')
      .count('* as total')
      .first();

    const statistics = {
      total_attendees: totalAttendees?.total || 0,
      checked_in: checkedInCount?.total || 0,
      pending: (totalAttendees?.total || 0) - (checkedInCount?.total || 0)
    };

    return response.inertia('events/dashboard', {
      event,
      statistics,
      orgUuid
    });
  }

  async analytics(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const uuid = request.params.uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const event = await DB.from('events')
      .where('id', uuid)
      .where('organization_id', orgUuid)
      .first();

    if (!event) {
      return response.flash('error', 'Event not found').redirect(`/organizations/${orgUuid}/events`, 302);
    }

    // Optimized: Single query with conditional counting instead of multiple queries
    const stats = await DB.from('attendees')
      .where('event_id', uuid)
      .select(
        DB.raw('COUNT(*) as total_registrations'),
        DB.raw("COUNT(CASE WHEN status = 'checked_in' THEN 1 END) as total_checkins")
      )
      .first();

    const totalRegistrations = stats?.total_registrations || 0;
    const totalCheckins = stats?.total_checkins || 0;
    const pendingCheckins = totalRegistrations - totalCheckins;

    const checkinRate = totalRegistrations > 0
      ? Math.round((totalCheckins / totalRegistrations) * 100)
      : 0;

    const pendingRate = totalRegistrations > 0
      ? Math.round((pendingCheckins / totalRegistrations) * 100)
      : 0;

    const registrationTrend = await DB.from('attendees')
      .where('event_id', uuid)
      .select(DB.raw('DATE(created_at) as date'))
      .select(DB.raw('COUNT(*) as count'))
      .groupBy('date')
      .orderBy('date', 'asc')
      .limit(7);

    const maxRegistrations = Math.max(...(registrationTrend.map(r => r.count) || [1]));

    const checkinTrend = await DB.from('check_ins')
      .join('attendees', 'check_ins.attendee_id', 'attendees.id')
      .where('attendees.event_id', uuid)
      .select(DB.raw("strftime('%H', check_ins.created_at) as hour"))
      .select(DB.raw('COUNT(*) as count'))
      .groupBy('hour')
      .orderBy('hour', 'asc');

    const maxCheckins = Math.max(...(checkinTrend.map(c => c.count) || [1]));

    const statusBreakdown = [
      {
        label: 'Checked In',
        count: totalCheckins?.total || 0,
        percentage: checkinRate,
        color: '#10b981'
      },
      {
        label: 'Pending',
        count: pendingCheckins,
        percentage: pendingRate,
        color: '#f59e0b'
      }
    ];

    const peakTimes = checkinTrend
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(t => ({
        time: `${t.hour}:00 - ${t.hour + 1}:00`,
        count: t.count
      }));

    const recentActivity = await DB.from('check_ins')
      .join('attendees', 'check_ins.attendee_id', 'attendees.id')
      .where('attendees.event_id', uuid)
      .select('check_ins.created_at', 'attendees.name', 'attendees.status')
      .orderBy('check_ins.created_at', 'desc')
      .limit(10);

    const analytics = {
      total_registrations: totalRegistrations?.total || 0,
      total_checkins: totalCheckins?.total || 0,
      pending_checkins: pendingCheckins,
      checkin_rate: checkinRate,
      pending_rate: pendingRate,
      registration_growth: 12,
      avg_checkin_time: '2 min',
      registration_trend: registrationTrend.map(t => ({
        label: new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' }),
        count: t.count
      })),
      max_registrations: maxRegistrations,
      checkin_trend: checkinTrend.map(t => ({
        label: `${t.hour}:00`,
        count: t.count
      })),
      max_checkins: maxCheckins,
      status_breakdown: statusBreakdown,
      peak_times: peakTimes,
      recent_activity: recentActivity.map(a => ({
        time: new Date(a.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        name: a.name,
        status: a.status
      }))
    };

    return response.inertia('events/analytics', {
      event,
      analytics,
      orgUuid
    });
  }

  async settings(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const uuid = request.params.uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const event = await DB.from('events')
      .where('id', uuid)
      .where('organization_id', orgUuid)
      .first();

    if (!event) {
      return response.flash('error', 'Event not found').redirect(`/organizations/${orgUuid}/events`, 302);
    }

    const eventSettings = await DB.from('event_settings')
      .where('event_id', uuid)
      .first();

    if (eventSettings?.custom_fields) {
      eventSettings.custom_fields = JSON.parse(eventSettings.custom_fields);
    }

    return response.inertia('events/settings', {
      event,
      eventSettings,
      orgUuid
    });
  }

  async updateSettings(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const uuid = request.params.uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const body = await request.json();
    const validationResult = Validator.validate(eventSettingsSchema, body);

    if (!validationResult.success) {
      const errors = validationResult.errors || {};
      const firstError = Object.values(errors)[0]?.[0] || 'Validation failed';
      return response.flash('error', firstError).redirect(`/organizations/${orgUuid}/events/${uuid}/settings`, 303);
    }

    const data = validationResult.data!;

    const existingSettings = await DB.from('event_settings')
      .where('event_id', uuid)
      .first();

    const settingsData = {
      event_id: uuid,
      require_approval: data.require_approval,
      custom_fields: data.custom_fields || null,
      allow_self_registration: data.allow_self_registration,
      allow_duplicate_checkin: data.allow_duplicate_checkin,
      require_verification: data.require_verification,
      enable_gender : data.enable_gender,
      send_confirmation_email: data.send_confirmation_email,
      send_qr_email: data.send_qr_email,
      timezone: data.timezone,
      locale: data.locale,
      updated_at: Date.now()
    };

    if (existingSettings) {
      await DB.from('event_settings')
        .where('event_id', uuid)
        .update(settingsData);
    } else {
      await DB.table('event_settings').insert({
        id : uuid,
        ...settingsData,
        created_at: Date.now()
      });
    }

    return response.flash('success', 'Event settings updated successfully').redirect(`/organizations/${orgUuid}/events/${uuid}/settings`, 303);
  }

  async members(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const uuid = request.params.uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const event = await DB.from('events')
      .where('id', uuid)
      .where('organization_id', orgUuid)
      .first();

    if (!event) {
      return response.flash('error', 'Event not found').redirect(`/organizations/${orgUuid}/events`, 302);
    }

    const members = await DB.from('event_members')
      .join('users', 'event_members.user_id', 'users.id')
      .where('event_members.event_id', uuid)
      .select(
        'event_members.id',
        'event_members.role',
        'event_members.added_at',
        'users.id as user_id',
        'users.name',
        'users.email'
      );

    return response.inertia('events/members', {
      event,
      members,
      orgUuid
    });
  }

  async addMember(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const uuid = request.params.uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const body = await request.json();
    const validationResult = Validator.validate(addEventMemberSchema, body);

    if (!validationResult.success) {
      const errors = validationResult.errors || {};
      const firstError = Object.values(errors)[0]?.[0] || 'Validation failed';
      return response.flash('error', firstError).redirect(`/organizations/${orgUuid}/events/${uuid}/members`, 302);
    }

    const data = validationResult.data!;

    const existingMember = await DB.from('event_members')
      .where('event_id', uuid)
      .where('user_id', data.user_id)
      .first();

    if (existingMember) {
      return response.flash('error', 'User is already a member of this event').redirect(`/organizations/${orgUuid}/events/${uuid}/members`, 302);
    }

    await DB.table('event_members').insert({
      event_id: uuid,
      user_id: data.user_id,
      role: data.role,
      added_by: user.id,
      added_at: Date.now(),
      created_at: Date.now(),
      updated_at: Date.now()
    });

    return response.flash('success', 'Member added successfully').redirect(`/organizations/${orgUuid}/events/${uuid}/members`, 302);
  }

  async removeMember(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const uuid = request.params.uuid;
    const memberUuid = request.params.member_uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    await DB.from('event_members')
      .where('id', memberUuid)
      .where('event_id', uuid)
      .delete();

    return response.flash('success', 'Member removed successfully').redirect(`/organizations/${orgUuid}/events/${uuid}/members`, 303);
  }

  async updateMember(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const uuid = request.params.uuid;
    const memberUuid = request.params.member_uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const body = await request.json();
    const validationResult = Validator.validate(updateEventMemberSchema, body);

    if (!validationResult.success) {
      const errors = validationResult.errors || {};
      const firstError = Object.values(errors)[0]?.[0] || 'Validation failed';
      return response.flash('error', firstError).redirect(`/organizations/${orgUuid}/events/${uuid}/members`, 303);
    }

    const data = validationResult.data!;

    await DB.from('event_members')
      .where('id', memberUuid)
      .where('event_id', uuid)
      .update({
        role: data.role,
        updated_at: Date.now()
      });

    return response.flash('success', 'Member role updated successfully').redirect(`/organizations/${orgUuid}/events/${uuid}/members`, 303);
  }
}

export default new EventController();
