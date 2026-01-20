import { Response, Request } from "../../type";
import DB from '../services/DB'

class SuperAdminController {
  async dashboard(request: Request, response: Response) {
    const stats = {
      totalOrganizations: await DB.from('organizations').count('* as count').first(),
      totalUsers: await DB.from('users').count('* as count').first(),
      totalEvents: await DB.from('events').count('* as count').first(),
      totalAttendees: await DB.from('attendees').count('* as count').first(),
    }

    const recentOrganizations = await DB.from('organizations')
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(5)

    const recentEvents = await DB.from('events')
      .select('events.*', 'organizations.name as organization_name')
      .join('organizations', 'events.organization_id', 'organizations.id')
      .orderBy('events.created_at', 'desc')
      .limit(5)

    return response.inertia('admin/dashboard', {
      stats,
      recentOrganizations,
      recentEvents
    })
  }

  async organizations(request: Request, response: Response) {
    const organizations = await DB.from('organizations')
      .select('organizations.*', DB.raw('COUNT(DISTINCT events.id) as event_count'))
      .leftJoin('events', 'organizations.id', 'events.organization_id')
      .groupBy('organizations.id')
      .orderBy('organizations.created_at', 'desc')

    return response.inertia('admin/organizations', { organizations })
  }

  async users(request: Request, response: Response) {
    const users = await DB.from('users')
      .select('users.*', DB.raw('COUNT(DISTINCT organization_members.id) as org_count'))
      .leftJoin('organization_members', 'users.id', 'organization_members.user_id')
      .groupBy('users.id')
      .orderBy('users.created_at', 'desc')

    return response.inertia('admin/users', { users })
  }

  async analytics(request: Request, response: Response) {
    const monthlyStats = await DB.from('organizations')
      .select(
        DB.raw("strftime('%Y-%m', created_at) as month"),
        DB.raw('COUNT(*) as count')
      )
      .groupBy('month')
      .orderBy('month', 'desc')
      .limit(12)

    const eventTypeStats = await DB.from('events')
      .select('type', DB.raw('COUNT(*) as count'))
      .groupBy('type')
      .orderBy('count', 'desc')

    const attendeeStats = await DB.from('attendees')
      .select('status', DB.raw('COUNT(*) as count'))
      .groupBy('status')

    return response.inertia('admin/analytics', {
      monthlyStats,
      eventTypeStats,
      attendeeStats
    })
  }

  async settings(request: Request, response: Response) {
    return response.inertia('admin/settings')
  }
}

export default new SuperAdminController();
