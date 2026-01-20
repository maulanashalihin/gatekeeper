import { Request, Response } from "../../type";
import DB from '../services/DB';
import CacheService from '../services/CacheService';

class DashboardController {
  async index(request: Request, response: Response) {
    const user = request.user;
    if (!user) {
      return response.redirect('/login', 302);
    }

    // Get organization ID from URL if provided
    const { id } = request.params;

    // Get user's organizations
    const userOrganizations = await DB.from('organization_members')
      .join('organizations', 'organization_members.organization_id', 'organizations.id')
      .where('organization_members.user_id', user.id)
      .select(
        'organizations.id',
        'organizations.name',
        'organizations.slug',
        'organizations.description',
        'organizations.logo',
        'organization_members.role',
        'organization_members.added_at'
      );

    // Use specified organization or first organization as default
    let organization = null;
    if (id) {
      organization = userOrganizations.find((org: any) => org.id === id);
    } else {
      organization = userOrganizations.length > 0 ? userOrganizations[0] : null;
    }

    // If no organization found, redirect to organizations list
    if (!organization) {
      return response.redirect('/organizations', 303);
    }

    let statistics: any = {};
    let recentEvents: any[] = [];
    let teamMembers: any[] = [];

    if (organization) {
      // Get organization statistics with caching (5 minutes)
      const cacheKey = `org_stats_${organization.id}`;
      statistics = await CacheService.remember(cacheKey, 5, async () => {
        const stats = await DB.from('events')
          .where('organization_id', organization.id)
          .count('* as total_events')
          .first();

        const attendeeStats = await DB.from('attendees')
          .join('events', 'attendees.event_id', 'events.id')
          .where('events.organization_id', organization.id)
          .count('* as total_attendees')
          .first();

        const checkInStats = await DB.from('check_ins')
          .join('attendees', 'check_ins.attendee_id', 'attendees.id')
          .join('events', 'attendees.event_id', 'events.id')
          .where('events.organization_id', organization.id)
          .count('* as total_checkins')
          .first();

        const memberStats = await DB.from('organization_members')
          .where('organization_id', organization.id)
          .count('* as total_members')
          .first();

        return {
          total_events: stats?.total_events || 0,
          total_attendees: attendeeStats?.total_attendees || 0,
          total_checkins: checkInStats?.total_checkins || 0,
          total_members: memberStats?.total_members || 0
        };
      });

      // Get recent events with caching (2 minutes)
      const eventsCacheKey = `org_events_${organization.id}`;
      recentEvents = await CacheService.remember(eventsCacheKey, 2, async () => {
        return await DB.from('events')
          .where('organization_id', organization.id)
          .orderBy('created_at', 'desc')
          .limit(5)
          .select('id', 'name', 'slug', 'type', 'start_date', 'end_date', 'location', 'status');
      });

      // Get team members with caching (10 minutes)
      const membersCacheKey = `org_members_${organization.id}`;
      teamMembers = await CacheService.remember(membersCacheKey, 10, async () => {
        return await DB.from('organization_members')
          .join('users', 'organization_members.user_id', 'users.id')
          .where('organization_members.organization_id', organization.id)
          .select(
            'users.id',
            'users.name',
            'users.email',
            'organization_members.role',
            'organization_members.added_at'
          )
          .limit(5);
      });
    }

    return response.inertia('dashboard/index', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      organization,
      statistics,
      recentEvents,
      teamMembers,
      userOrganizations
    });
  }
}

export default new DashboardController();
