import { Request, Response } from "../../type";
import DB from '../services/DB';
import Validator from '../services/Validator';
import { scanCheckInSchema, manualCheckInSchema, undoCheckInSchema } from '../validators/CheckInValidator';

class CheckInController {
  async scan(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const eventUuid = request.params.event_uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const event = await DB.from('events')
      .where('id', eventUuid)
      .where('organization_id', orgUuid)
      .first();

    if (!event) {
      return response.flash('error', 'Event not found').redirect(`/organizations/${orgUuid}/events`, 302);
    }

    return response.inertia('events/checkin/scanner', {
      event,
      orgUuid
    });
  }

  async manual(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const eventUuid = request.params.event_uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const event = await DB.from('events')
      .where('id', eventUuid)
      .where('organization_id', orgUuid)
      .first();

    if (!event) {
      return response.flash('error', 'Event not found').redirect(`/organizations/${orgUuid}/events`, 302);
    }

    return response.inertia('events/checkin/manual', {
      event,
      orgUuid
    });
  }

  async stats(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const eventUuid = request.params.event_uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const event = await DB.from('events')
      .where('id', eventUuid)
      .where('organization_id', orgUuid)
      .first();

    if (!event) {
      return response.flash('error', 'Event not found').redirect(`/organizations/${orgUuid}/events`, 302);
    }

    const totalAttendees = await DB.from('attendees')
      .where('event_id', eventUuid)
      .count('* as total')
      .first();

    const checkedInCount = await DB.from('attendees')
      .where('event_id', eventUuid)
      .where('status', 'checked_in')
      .count('* as total')
      .first();

    const checkIns = await DB.from('check_ins')
      .join('attendees', 'check_ins.attendee_id', 'attendees.id')
      .where('check_ins.event_id', eventUuid)
      .select(
        'check_ins.*',
        'attendees.name',
        'attendees.email'
      )
      .orderBy('check_ins.checked_in_at', 'desc')
      .limit(10);

    const statistics = {
      total_attendees: totalAttendees?.total || 0,
      checked_in: checkedInCount?.total || 0,
      pending: (totalAttendees?.total || 0) - (checkedInCount?.total || 0),
      check_in_rate: totalAttendees?.total > 0 
        ? Math.round(((checkedInCount?.total || 0) / totalAttendees.total) * 100) 
        : 0
    };

    return response.inertia('events/checkin/stats', {
      event,
      statistics,
      checkIns,
      orgUuid
    });
  }

  async history(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const eventUuid = request.params.event_uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const event = await DB.from('events')
      .where('id', eventUuid)
      .where('organization_id', orgUuid)
      .first();

    if (!event) {
      return response.flash('error', 'Event not found').redirect(`/organizations/${orgUuid}/events`, 302);
    }

    const checkIns = await DB.from('check_ins')
      .join('attendees', 'check_ins.attendee_id', 'attendees.id')
      .where('check_ins.event_id', eventUuid)
      .select(
        'check_ins.*',
        'attendees.name',
        'attendees.email'
      )
      .orderBy('check_ins.checked_in_at', 'desc');

    return response.inertia('events/checkin/history', {
      event,
      checkIns,
      orgUuid
    });
  }

  async checkin(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const eventUuid = request.params.event_uuid;
    const attendeeUuid = request.params.attendee_uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const attendee = await DB.from('attendees')
      .where('id', attendeeUuid)
      .where('event_id', eventUuid)
      .first();

    if (!attendee) {
      return response.status(404).json({ success: false, message: 'Attendee not found' });
    }

    if (attendee.status === 'checked_in') {
      return response.status(400).json({
        success: false,
        message: 'Attendee already checked in',
        attendee
      });
    }

    const eventSettings = await DB.from('event_settings')
      .where('event_id', eventUuid)
      .first();

    if (eventSettings && !eventSettings.allow_duplicate_checkin) {
      const existingCheckIn = await DB.from('check_ins')
        .where('attendee_id', attendeeUuid)
        .first();

      if (existingCheckIn) {
        return response.status(400).json({
          success: false,
          message: 'Duplicate check-in not allowed',
          attendee
        });
      }
    }

    await DB.table('check_ins').insert({
      attendee_id: attendeeUuid,
      event_id: eventUuid,
      method: 'qr',
      checked_in_at: Date.now(),
      checked_in_by: user.id,
      created_at: Date.now()
    });

    await DB.from('attendees')
      .where('id', attendeeUuid)
      .update({
        status: 'checked_in',
        checked_in_at: Date.now(),
        checked_in_by: user.id,
        updated_at: Date.now()
      });

    return response.json({
      success: true,
      message: 'Check-in successful',
      attendee: {
        ...attendee,
        status: 'checked_in',
        checked_in_at: Date.now()
      }
    });
  }

  async undo(request: Request, response: Response) {
    const user = request.user;
    const orgUuid = request.params.org_uuid;
    const eventUuid = request.params.event_uuid;
    const attendeeUuid = request.params.attendee_uuid;

    if (!user) {
      return response.redirect('/login', 302);
    }

    const attendee = await DB.from('attendees')
      .where('id', attendeeUuid)
      .where('event_id', eventUuid)
      .first();

    if (!attendee) {
      return response.flash('error', 'Attendee not found').redirect(`/organizations/${orgUuid}/events/${eventUuid}/checkin/history`, 303);
    }

    if (attendee.status !== 'checked_in') {
      return response.flash('error', 'Attendee is not checked in').redirect(`/organizations/${orgUuid}/events/${eventUuid}/checkin/history`, 303);
    }

    await DB.from('check_ins')
      .where('attendee_id', attendeeUuid)
      .delete();

    await DB.from('attendees')
      .where('id', attendeeUuid)
      .update({
        status: 'registered',
        checked_in_at: null,
        checked_in_by: null,
        updated_at: Date.now()
      });

    return response.flash('success', 'Check-in undone successfully').redirect(`/organizations/${orgUuid}/events/${eventUuid}/checkin/history`, 303);
  }
}

export default new CheckInController();
