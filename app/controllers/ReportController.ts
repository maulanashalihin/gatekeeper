import { Response, Request } from "../../type";
import DB from '../services/DB';
import Validator from '../services/Validator';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

class ReportController {
  /**
   * Export event analytics to PDF
   */
  async exportEventAnalyticsPdf(request: Request, response: Response) {
    try {
      const { org_uuid, uuid } = request.params;

      const event = await DB.from('events')
        .where('id', uuid)
        .where('organization_id', org_uuid)
        .first();

      if (!event) {
        return response.flash('error', 'Event not found').redirect(`/organizations/${org_uuid}/events`, 302);
      }

    // Get analytics data
    const totalRegistrations = await DB.from('attendees')
      .where('event_id', uuid)
      .count('* as total')
      .first();

    const totalCheckins = await DB.from('attendees')
      .where('event_id', uuid)
      .where('status', 'checked_in')
      .count('* as total')
      .first();

    const pendingCheckins = (totalRegistrations?.total || 0) - (totalCheckins?.total || 0);

    const checkinRate = totalRegistrations?.total > 0
      ? Math.round((totalCheckins?.total || 0) / totalRegistrations.total * 100)
      : 0;

    const attendees = await DB.from('attendees')
      .where('event_id', uuid)
      .select('name', 'email', 'phone', 'company', 'status', 'registered_at', 'checked_in_at')
      .orderBy('registered_at', 'desc');

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('Event Analytics Report', { align: 'center' });
    doc.moveDown();

    // Event details
    doc.fontSize(14).font('Helvetica-Bold').text('Event Details');
    doc.fontSize(11).font('Helvetica');
    doc.text(`Name: ${event.name}`);
    doc.text(`Type: ${event.type}`);
    doc.text(`Date: ${new Date(event.start_date).toLocaleDateString()} - ${new Date(event.end_date).toLocaleDateString()}`);
    doc.text(`Location: ${event.location || 'N/A'}`);
    doc.moveDown();

    // Statistics
    doc.fontSize(14).font('Helvetica-Bold').text('Statistics');
    doc.fontSize(11).font('Helvetica');
    doc.text(`Total Registrations: ${totalRegistrations?.total || 0}`);
    doc.text(`Total Check-ins: ${totalCheckins?.total || 0}`);
    doc.text(`Pending Check-ins: ${pendingCheckins}`);
    doc.text(`Check-in Rate: ${checkinRate}%`);
    doc.moveDown();

    // Attendees table
    doc.fontSize(14).font('Helvetica-Bold').text('Attendees');
    doc.moveDown();

    const tableTop = doc.y;
    const tableLeft = 50;
    const colWidths = [100, 150, 100, 100, 80];
    const headers = ['Name', 'Email', 'Status', 'Registered', 'Checked In'];

    // Draw headers
    doc.fontSize(10).font('Helvetica-Bold');
    headers.forEach((header, i) => {
      doc.text(header, tableLeft + colWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop, { width: colWidths[i] });
    });

    doc.moveDown(0.5);

    // Draw rows
    doc.fontSize(9).font('Helvetica');
    attendees.forEach((attendee: any) => {
      const row = [
        attendee.name || 'N/A',
        attendee.email || 'N/A',
        attendee.status || 'N/A',
        attendee.registered_at ? new Date(attendee.registered_at).toLocaleDateString() : 'N/A',
        attendee.checked_in_at ? new Date(attendee.checked_in_at).toLocaleDateString() : '-'
      ];

      row.forEach((text, i) => {
        doc.text(text, tableLeft + colWidths.slice(0, i).reduce((a, b) => a + b, 0), doc.y, { width: colWidths[i] });
      });

      doc.moveDown(0.3);
    });

    doc.end();

    await new Promise<void>((resolve) => {
      doc.on('end', resolve);
    });

    const pdfBuffer = Buffer.concat(chunks);

    response.type('application/pdf');
    response.header('Content-Disposition', `attachment; filename="${event.name.replace(/\s+/g, '_')}_analytics.pdf"`);
    return response.send(pdfBuffer);
    } catch (error: any) {
      console.error('exportEventAnalyticsPdf error:', error);
      return response.flash('error', 'Terjadi kesalahan saat membuat PDF').redirect(`/organizations/${request.params.org_uuid}/events`, 302);
    }
  }

  /**
   * Export event analytics to Excel
   */
  async exportEventAnalyticsExcel(request: Request, response: Response) {
    try {
      const { org_uuid, uuid } = request.params;

      const event = await DB.from('events')
        .where('id', uuid)
        .where('organization_id', org_uuid)
        .first();

      if (!event) {
        return response.flash('error', 'Event not found').redirect(`/organizations/${org_uuid}/events`, 302);
      }

    // Get analytics data
    const totalRegistrations = await DB.from('attendees')
      .where('event_id', uuid)
      .count('* as total')
      .first();

    const totalCheckins = await DB.from('attendees')
      .where('event_id', uuid)
      .where('status', 'checked_in')
      .count('* as total')
      .first();

    const pendingCheckins = (totalRegistrations?.total || 0) - (totalCheckins?.total || 0);

    const checkinRate = totalRegistrations?.total > 0
      ? Math.round((totalCheckins?.total || 0) / totalRegistrations.total * 100)
      : 0;

    const attendees = await DB.from('attendees')
      .where('event_id', uuid)
      .select('name', 'email', 'phone', 'company', 'job_title', 'status', 'registered_at', 'checked_in_at')
      .orderBy('registered_at', 'desc');

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'GateKeeper';
    workbook.created = new Date();

    // Summary sheet
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.addRow(['Event Analytics Report']);
    summarySheet.addRow([]);
    summarySheet.addRow(['Event Details']);
    summarySheet.addRow(['Name', event.name]);
    summarySheet.addRow(['Type', event.type]);
    summarySheet.addRow(['Date', `${new Date(event.start_date).toLocaleDateString()} - ${new Date(event.end_date).toLocaleDateString()}`]);
    summarySheet.addRow(['Location', event.location || 'N/A']);
    summarySheet.addRow([]);
    summarySheet.addRow(['Statistics']);
    summarySheet.addRow(['Total Registrations', totalRegistrations?.total || 0]);
    summarySheet.addRow(['Total Check-ins', totalCheckins?.total || 0]);
    summarySheet.addRow(['Pending Check-ins', pendingCheckins]);
    summarySheet.addRow(['Check-in Rate', `${checkinRate}%`]);

    // Style summary sheet
    summarySheet.getRow(1).font = { bold: true, size: 16 };
    summarySheet.getRow(3).font = { bold: true };
    summarySheet.getRow(9).font = { bold: true };

    // Attendees sheet
    const attendeesSheet = workbook.addWorksheet('Attendees');
    attendeesSheet.addRow(['Name', 'Email', 'Phone', 'Company', 'Job Title', 'Status', 'Registered', 'Checked In']);

    attendees.forEach((attendee: any) => {
      attendeesSheet.addRow([
        attendee.name || 'N/A',
        attendee.email || 'N/A',
        attendee.phone || 'N/A',
        attendee.company || 'N/A',
        attendee.job_title || 'N/A',
        attendee.status || 'N/A',
        attendee.registered_at ? new Date(attendee.registered_at).toLocaleDateString() : 'N/A',
        attendee.checked_in_at ? new Date(attendee.checked_in_at).toLocaleDateString() : '-'
      ]);
    });

    // Style attendees sheet
    attendeesSheet.getRow(1).font = { bold: true };
    attendeesSheet.columns.forEach((column) => {
      column.width = 20;
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    response.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.header('Content-Disposition', `attachment; filename="${event.name.replace(/\s+/g, '_')}_analytics.xlsx"`);
    return response.send(buffer);
    } catch (error: any) {
      console.error('exportEventAnalyticsExcel error:', error);
      return response.flash('error', 'Terjadi kesalahan saat membuat Excel').redirect(`/organizations/${request.params.org_uuid}/events`, 302);
    }
  }

  /**
   * Export organization analytics to PDF
   */
  async exportOrganizationAnalyticsPdf(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const organization = await DB.from('organizations')
        .where('id', id)
        .first();

      if (!organization) {
        return response.flash('error', 'Organization not found').redirect('/organizations', 302);
      }

    // Get organization stats
    const totalEvents = await DB.from('events')
      .where('organization_id', id)
      .count('* as total')
      .first();

    const totalAttendees = await DB.from('attendees')
      .join('events', 'attendees.event_id', 'events.id')
      .where('events.organization_id', id)
      .count('* as total')
      .first();

    const totalCheckins = await DB.from('attendees')
      .join('events', 'attendees.event_id', 'events.id')
      .where('events.organization_id', id)
      .where('attendees.status', 'checked_in')
      .count('* as total')
      .first();

    const events = await DB.from('events')
      .where('organization_id', id)
      .select('name', 'type', 'start_date', 'end_date', 'status')
      .orderBy('start_date', 'desc');

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('Organization Analytics Report', { align: 'center' });
    doc.moveDown();

    // Organization details
    doc.fontSize(14).font('Helvetica-Bold').text('Organization Details');
    doc.fontSize(11).font('Helvetica');
    doc.text(`Name: ${organization.name}`);
    doc.text(`Description: ${organization.description || 'N/A'}`);
    doc.moveDown();

    // Statistics
    doc.fontSize(14).font('Helvetica-Bold').text('Statistics');
    doc.fontSize(11).font('Helvetica');
    doc.text(`Total Events: ${totalEvents?.total || 0}`);
    doc.text(`Total Attendees: ${totalAttendees?.total || 0}`);
    doc.text(`Total Check-ins: ${totalCheckins?.total || 0}`);
    doc.moveDown();

    // Events table
    doc.fontSize(14).font('Helvetica-Bold').text('Events');
    doc.moveDown();

    const tableTop = doc.y;
    const tableLeft = 50;
    const colWidths = [150, 100, 100, 80];
    const headers = ['Name', 'Type', 'Date', 'Status'];

    // Draw headers
    doc.fontSize(10).font('Helvetica-Bold');
    headers.forEach((header, i) => {
      doc.text(header, tableLeft + colWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop, { width: colWidths[i] });
    });

    doc.moveDown(0.5);

    // Draw rows
    doc.fontSize(9).font('Helvetica');
    events.forEach((event: any) => {
      const row = [
        event.name || 'N/A',
        event.type || 'N/A',
        `${new Date(event.start_date).toLocaleDateString()}`,
        event.status || 'N/A'
      ];

      row.forEach((text, i) => {
        doc.text(text, tableLeft + colWidths.slice(0, i).reduce((a, b) => a + b, 0), doc.y, { width: colWidths[i] });
      });

      doc.moveDown(0.3);
    });

    doc.end();

    await new Promise<void>((resolve) => {
      doc.on('end', resolve);
    });

    const pdfBuffer = Buffer.concat(chunks);

    response.type('application/pdf');
    response.header('Content-Disposition', `attachment; filename="${organization.name.replace(/\s+/g, '_')}_analytics.pdf"`);
    return response.send(pdfBuffer);
    } catch (error: any) {
      console.error('exportOrganizationAnalyticsPdf error:', error);
      return response.flash('error', 'Terjadi kesalahan saat membuat PDF').redirect('/organizations', 302);
    }
  }

  /**
   * Export organization analytics to Excel
   */
  async exportOrganizationAnalyticsExcel(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const organization = await DB.from('organizations')
        .where('id', id)
        .first();

      if (!organization) {
        return response.flash('error', 'Organization not found').redirect('/organizations', 302);
      }

      // Get organization stats
      const totalEvents = await DB.from('events')
        .where('organization_id', id)
        .count('* as total')
        .first();

      const totalAttendees = await DB.from('attendees')
        .join('events', 'attendees.event_id', 'events.id')
        .where('events.organization_id', id)
        .count('* as total')
        .first();

      const totalCheckins = await DB.from('attendees')
        .join('events', 'attendees.event_id', 'events.id')
        .where('events.organization_id', id)
        .where('attendees.status', 'checked_in')
        .count('* as total')
        .first();

      const events = await DB.from('events')
        .where('organization_id', id)
        .select('name', 'type', 'start_date', 'end_date', 'status')
        .orderBy('start_date', 'desc');

      // Create workbook
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'GateKeeper';
      workbook.created = new Date();

      // Summary sheet
      const summarySheet = workbook.addWorksheet('Summary');
      summarySheet.addRow(['Organization Analytics Report']);
      summarySheet.addRow([]);
      summarySheet.addRow(['Organization Details']);
      summarySheet.addRow(['Name', organization.name]);
      summarySheet.addRow(['Description', organization.description || 'N/A']);
      summarySheet.addRow([]);
      summarySheet.addRow(['Statistics']);
      summarySheet.addRow(['Total Events', totalEvents?.total || 0]);
      summarySheet.addRow(['Total Attendees', totalAttendees?.total || 0]);
      summarySheet.addRow(['Total Check-ins', totalCheckins?.total || 0]);

      // Style summary sheet
      summarySheet.getRow(1).font = { bold: true, size: 16 };
      summarySheet.getRow(3).font = { bold: true };
      summarySheet.getRow(7).font = { bold: true };

      // Events sheet
      const eventsSheet = workbook.addWorksheet('Events');
      eventsSheet.addRow(['Name', 'Type', 'Start Date', 'End Date', 'Status']);

      events.forEach((event: any) => {
        eventsSheet.addRow([
          event.name || 'N/A',
          event.type || 'N/A',
          new Date(event.start_date).toLocaleDateString(),
          new Date(event.end_date).toLocaleDateString(),
          event.status || 'N/A'
        ]);
      });

      // Style events sheet
      eventsSheet.getRow(1).font = { bold: true };
      eventsSheet.columns.forEach((column) => {
        column.width = 20;
      });

      // Generate buffer
      const buffer = await workbook.xlsx.writeBuffer();

      response.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      response.header('Content-Disposition', `attachment; filename="${organization.name.replace(/\s+/g, '_')}_analytics.xlsx"`);
      return response.send(buffer);
    } catch (error: any) {
      console.error('exportOrganizationAnalyticsExcel error:', error);
      return response.flash('error', 'Terjadi kesalahan saat membuat Excel').redirect('/organizations', 302);
    }
  }
}

export default new ReportController();
