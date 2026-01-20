import LoginController from "../app/controllers/LoginController";
import RegisterController from "../app/controllers/RegisterController";
import PasswordController from "../app/controllers/PasswordController";
import ProfileController from "../app/controllers/ProfileController";
import OAuthController from "../app/controllers/OAuthController";
import Auth from "../app/middlewares/auth"
import PublicController from "../app/controllers/PublicController";
import AssetController from "../app/controllers/AssetController";
import UploadController from "../app/controllers/UploadController";
import S3Controller from "../app/controllers/S3Controller";
import StorageController from "../app/controllers/StorageController";
import OnboardingController from "../app/controllers/OnboardingController";
import DashboardController from "../app/controllers/DashboardController";
import OrganizationController from "../app/controllers/OrganizationController";
import EventController from "../app/controllers/EventController";
import AttendeeController from "../app/controllers/AttendeeController";
import CheckInController from "../app/controllers/CheckInController";
import PublicRegistrationController from "../app/controllers/PublicRegistrationController";
import SuperAdminController from "../app/controllers/SuperAdminController";
import ReportController from "../app/controllers/ReportController";
import RegionController from "../app/controllers/RegionController";
import HyperExpress from 'hyper-express';

// Rate limiting middleware
import {
  authRateLimit,
  apiRateLimit,
  passwordResetRateLimit,
  createAccountRateLimit,
  uploadRateLimit
} from "../app/middlewares/rateLimit";

const Route = new HyperExpress.Router();

/**
 * Region Routes
 * Routes for region/city search and autocomplete
 * ------------------------------------------------
 * GET  /api/regions/search - Search regions/cities by query
 */
Route.get("/api/regions/search", [apiRateLimit], RegionController.search);

/**
 * Public Routes
 * These routes are accessible without authentication
 * ------------------------------------------------
 * GET  / - Home page
 */
Route.get("/", PublicController.index);
Route.get("/test", PublicController.test);

/**
 * Upload Routes
 * Routes for file uploads
 * ------------------------------------------------
 * POST /api/upload/image - Upload image with processing
 * POST /api/upload/file - Upload file (PDF, Word, Excel, etc.)
 */
Route.post("/api/upload/image", [Auth, uploadRateLimit], UploadController.uploadImage);
Route.post("/api/upload/file", [Auth, uploadRateLimit], UploadController.uploadFile);

/**
 * S3 Routes
 * Routes for handling S3 operations
 * ------------------------------------------------
 * POST /api/s3/signed-url - Generate signed URL for file upload
 * GET  /api/s3/public-url/:fileKey - Get public URL for existing file
 * GET  /api/s3/health - S3 service health check
 */
Route.post("/api/s3/signed-url", [Auth, uploadRateLimit], S3Controller.getSignedUrl);
Route.get("/api/s3/public-url/:fileKey", [apiRateLimit], S3Controller.getPublicUrl);
Route.get("/api/s3/health", [apiRateLimit], S3Controller.health);

/**
 * Local Storage Static Files
 * Serves files from local storage
 * ------------------------------------------------
 * GET /storage/* - Serve local storage files
 */
Route.get("/storage/*", StorageController.serveFile);
/**
 * Authentication Routes
 * Routes for handling user authentication
 * ------------------------------------------------
 * GET   /login - Login page
 * POST  /login - Process login
 * GET   /register - Registration page
 * POST  /register - Process registration
 * POST  /logout - Logout user
 * GET   /google/redirect - Google OAuth redirect
 * GET   /google/callback - Google OAuth callback
 */
Route.get("/login", LoginController.loginPage);
Route.post("/login", [authRateLimit], LoginController.processLogin);
Route.get("/register", RegisterController.registerPage);
Route.post("/register", [createAccountRateLimit], RegisterController.processRegister);
Route.post("/logout", LoginController.logout);
Route.get("/google/redirect", OAuthController.redirect);
Route.get("/google/callback", OAuthController.googleCallback);

/**
 * Public Registration Routes
 * Routes for public event registration (no authentication required)
 * ------------------------------------------------
 * GET  /events/:slug/register                 - Public registration form
 * POST /events/:slug/register                 - Submit registration
 * GET  /events/:slug/confirm/:token           - Confirm registration
 * GET  /events/:slug/ticket/:qr_code          - View ticket (public)
 */
Route.get("/events/:slug/register", PublicRegistrationController.register);
Route.post("/events/:slug/register", [createAccountRateLimit], PublicRegistrationController.store);
Route.get("/events/:slug/confirm/:token", PublicRegistrationController.confirm);
Route.get("/events/:slug/ticket/:id", PublicRegistrationController.ticket);

/**
 * Super Admin Routes
 * Routes for super admin dashboard and management
 * ------------------------------------------------
 * GET   /admin/dashboard - Super admin dashboard
 * GET   /admin/organizations - List all organizations
 * GET   /admin/users - List all users
 * GET   /admin/analytics - Platform analytics
 * GET   /admin/settings - Platform settings
 */
Route.get("/admin/dashboard", [Auth], SuperAdminController.dashboard);
Route.get("/admin/organizations", [Auth], SuperAdminController.organizations);
Route.get("/admin/users", [Auth], SuperAdminController.users);
Route.get("/admin/analytics", [Auth], SuperAdminController.analytics);
Route.get("/admin/settings", [Auth], SuperAdminController.settings);

/**
 * Report Export Routes
 * Routes for exporting reports in PDF and Excel formats
 * ------------------------------------------------
 * GET   /organizations/:org_uuid/events/:uuid/export/pdf - Export event analytics to PDF
 * GET   /organizations/:org_uuid/events/:uuid/export/excel - Export event analytics to Excel
 * GET   /organizations/:id/export/pdf - Export organization analytics to PDF
 * GET   /organizations/:id/export/excel - Export organization analytics to Excel
 */
Route.get("/organizations/:org_uuid/events/:uuid/export/pdf", [Auth], ReportController.exportEventAnalyticsPdf);
Route.get("/organizations/:org_uuid/events/:uuid/export/excel", [Auth], ReportController.exportEventAnalyticsExcel);
Route.get("/organizations/:id/export/pdf", [Auth], ReportController.exportOrganizationAnalyticsPdf);
Route.get("/organizations/:id/export/excel", [Auth], ReportController.exportOrganizationAnalyticsExcel);

/**
 * Password Reset Routes
 * Routes for handling password reset
 * ------------------------------------------------
 * GET   /forgot-password - Forgot password page
 * POST  /forgot-password - Send reset password link
 * GET   /reset-password/:id - Reset password page
 * POST  /reset-password - Process password reset
 */
Route.get("/forgot-password", PasswordController.forgotPasswordPage);
Route.post("/forgot-password", [passwordResetRateLimit], PasswordController.sendResetPassword);
Route.get("/reset-password/:id", PasswordController.resetPasswordPage);
Route.post("/reset-password", [authRateLimit], PasswordController.resetPassword);

/**
 * Onboarding Routes
 * Routes for handling user onboarding
 * ------------------------------------------------
 * GET   /onboarding - Onboarding welcome page
 * GET   /onboarding/step/:step - Onboarding step page
 * POST  /onboarding/step/:step - Submit onboarding step
 * POST  /onboarding/skip - Skip onboarding
 * GET   /onboarding/complete - Onboarding completion
 */
Route.get("/onboarding", [Auth], OnboardingController.welcome);
Route.get("/onboarding/step/:step", [Auth], OnboardingController.step);
Route.post("/onboarding/step/:step", [Auth], OnboardingController.submit);
Route.post("/onboarding/skip", [Auth], OnboardingController.skip);
Route.get("/onboarding/complete", [Auth], OnboardingController.complete);

/**
 * Dashboard Routes
 * Routes for organization dashboard
 * ------------------------------------------------
 * GET   /dashboard - Organization dashboard
 * GET   /organizations/:id/dashboard - Organization dashboard by ID
 */
Route.get("/dashboard", [Auth], DashboardController.index);
Route.get("/organizations/:id/dashboard", [Auth], DashboardController.index);

/**
 * Organization Routes
 * Routes for organization management
 * ------------------------------------------------
 * GET   /organizations - List organizations
 * GET   /organizations/create - Create organization form
 * POST  /organizations - Store organization
 * GET   /organizations/:id - Show organization details
 * GET   /organizations/:id/edit - Edit organization form
 * PUT   /organizations/:id - Update organization
 * DELETE /organizations/:id - Delete organization
 * POST  /organizations/switch - Switch organization
 * GET   /organizations/:id/members - List organization members
 * POST  /organizations/:id/members/invite - Invite existing user
 * POST  /organizations/:id/members/invite-new - Invite new user
 * PUT   /organizations/:id/members/:userId - Update member role
 * DELETE /organizations/:id/members/:userId - Remove member
 */
Route.get("/organizations", [Auth], OrganizationController.index);
Route.get("/organizations/create", [Auth], OrganizationController.create);
Route.post("/organizations", [Auth], OrganizationController.store);
Route.get("/organizations/:id", [Auth], OrganizationController.show);
Route.get("/organizations/:id/edit", [Auth], OrganizationController.edit);
Route.put("/organizations/:id", [Auth], OrganizationController.update);
Route.delete("/organizations/:id", [Auth], OrganizationController.destroy);
Route.post("/organizations/switch", [Auth], OrganizationController.switch);
Route.get("/organizations/:id/members", [Auth], OrganizationController.members);
Route.get("/organizations/:id/members/invite", [Auth], OrganizationController.invite);
Route.post("/organizations/:id/members/invite", [Auth], OrganizationController.inviteMember);
Route.post("/organizations/:id/members/invite-new", [Auth], OrganizationController.inviteNewUser);
Route.put("/organizations/:id/members/:userId", [Auth], OrganizationController.updateMemberRole);
Route.delete("/organizations/:id/members/:userId", [Auth], OrganizationController.removeMember);

/**
 * Event Routes
 * Routes for event management
 * ------------------------------------------------
 * GET   /organizations/:org_uuid/events - List events
 * GET   /organizations/:org_uuid/events/create - Create event form
 * POST  /organizations/:org_uuid/events - Store event
 * GET   /organizations/:org_uuid/events/:uuid - Show event details
 * GET   /organizations/:org_uuid/events/:uuid/edit - Edit event form
 * PUT   /organizations/:org_uuid/events/:uuid - Update event
 * DELETE /organizations/:org_uuid/events/:uuid - Delete event
 * GET   /organizations/:org_uuid/events/:uuid/dashboard - Event dashboard
 * GET   /organizations/:org_uuid/events/:uuid/analytics - Event analytics
 * GET   /organizations/:org_uuid/events/:uuid/settings - Event settings
 * PUT   /organizations/:org_uuid/events/:uuid/settings - Update event settings
 * GET   /organizations/:org_uuid/events/:uuid/members - List event members
 * POST  /organizations/:org_uuid/events/:uuid/members - Add member to event
 * DELETE /organizations/:org_uuid/events/:uuid/members/:member_uuid - Remove member from event
 * PUT   /organizations/:org_uuid/events/:uuid/members/:member_uuid - Update member role
 */
Route.get("/organizations/:org_uuid/events", [Auth], EventController.index);
Route.get("/organizations/:org_uuid/events/create", [Auth], EventController.create);
Route.post("/organizations/:org_uuid/events", [Auth], EventController.store);
Route.get("/organizations/:org_uuid/events/:uuid", [Auth], EventController.show);
Route.get("/organizations/:org_uuid/events/:uuid/edit", [Auth], EventController.edit);
Route.put("/organizations/:org_uuid/events/:uuid", [Auth], EventController.update);
Route.delete("/organizations/:org_uuid/events/:uuid", [Auth], EventController.destroy);
Route.get("/organizations/:org_uuid/events/:uuid/dashboard", [Auth], EventController.dashboard);
Route.get("/organizations/:org_uuid/events/:uuid/analytics", [Auth], EventController.analytics);
Route.get("/organizations/:org_uuid/events/:uuid/settings", [Auth], EventController.settings);
Route.put("/organizations/:org_uuid/events/:uuid/settings", [Auth], EventController.updateSettings);
Route.get("/organizations/:org_uuid/events/:uuid/members", [Auth], EventController.members);
Route.post("/organizations/:org_uuid/events/:uuid/members", [Auth], EventController.addMember);
Route.delete("/organizations/:org_uuid/events/:uuid/members/:member_uuid", [Auth], EventController.removeMember);
Route.put("/organizations/:org_uuid/events/:uuid/members/:member_uuid", [Auth], EventController.updateMember);

/**
 * Attendee Routes
 * Routes for attendee management
 * ------------------------------------------------
 * GET   /organizations/:org_uuid/events/:event_uuid/attendees                    - List attendees
 * GET   /organizations/:org_uuid/events/:event_uuid/attendees/create             - Create attendee form
 * POST  /organizations/:org_uuid/events/:event_uuid/attendees                    - Store attendee
 * GET   /organizations/:org_uuid/events/:event_uuid/attendees/import             - Import attendees form
 * POST  /organizations/:org_uuid/events/:event_uuid/attendees/import             - Import attendees (CSV)
 * GET   /organizations/:org_uuid/events/:event_uuid/attendees/:uuid              - Show attendee
 * GET   /organizations/:org_uuid/events/:event_uuid/attendees/:uuid/edit         - Edit attendee form
 * PUT   /organizations/:org_uuid/events/:event_uuid/attendees/:uuid              - Update attendee
 * DELETE /organizations/:org_uuid/events/:event_uuid/attendees/:uuid            - Delete attendee
 * GET   /organizations/:org_uuid/events/:event_uuid/attendees/:uuid/ticket       - View ticket with QR code
 * POST  /organizations/:org_uuid/events/:event_uuid/attendees/:uuid/resend-email - Resend QR code email
 */
Route.get("/organizations/:org_uuid/events/:event_uuid/attendees", [Auth], AttendeeController.index);
Route.get("/organizations/:org_uuid/events/:event_uuid/attendees/create", [Auth], AttendeeController.create);
Route.post("/organizations/:org_uuid/events/:event_uuid/attendees", [Auth], AttendeeController.store);
Route.get("/organizations/:org_uuid/events/:event_uuid/attendees/import", [Auth], AttendeeController.import);
Route.post("/organizations/:org_uuid/events/:event_uuid/attendees/import", [Auth], AttendeeController.processImport);
Route.get("/organizations/:org_uuid/events/:event_uuid/attendees/:uuid", [Auth], AttendeeController.show);
Route.get("/organizations/:org_uuid/events/:event_uuid/attendees/:uuid/edit", [Auth], AttendeeController.edit);
Route.put("/organizations/:org_uuid/events/:event_uuid/attendees/:uuid", [Auth], AttendeeController.update);
Route.delete("/organizations/:org_uuid/events/:event_uuid/attendees/:uuid", [Auth], AttendeeController.destroy);
Route.get("/organizations/:org_uuid/events/:event_uuid/attendees/:uuid/ticket", [Auth], AttendeeController.ticket);
Route.post("/organizations/:org_uuid/events/:event_uuid/attendees/:uuid/resend-email", [Auth], AttendeeController.resendEmail);

/**
 * Check-in Routes
 * Routes for event check-in management
 * ------------------------------------------------
 * GET   /organizations/:org_uuid/events/:event_uuid/checkin - Check-in page (QR scanner)
 * POST  /organizations/:org_uuid/events/:event_uuid/checkin/scan - Scan QR code
 * POST  /organizations/:org_uuid/events/:event_uuid/checkin/manual - Manual check-in
 * GET   /organizations/:org_uuid/events/:event_uuid/checkin/stats - Real-time check-in statistics
 * GET   /organizations/:org_uuid/events/:event_uuid/checkin/history - Check-in history
 * POST  /organizations/:org_uuid/events/:event_uuid/checkin/:attendee_uuid - Check-in attendee
 * DELETE /organizations/:org_uuid/events/:event_uuid/checkin/:attendee_uuid - Undo check-in
 */
Route.get("/organizations/:org_uuid/events/:event_uuid/checkin", [Auth], CheckInController.scan);
Route.get("/organizations/:org_uuid/events/:event_uuid/checkin/manual", [Auth], CheckInController.manual);
Route.get("/organizations/:org_uuid/events/:event_uuid/checkin/stats", [Auth], CheckInController.stats);
Route.get("/organizations/:org_uuid/events/:event_uuid/checkin/history", [Auth], CheckInController.history);
Route.post("/organizations/:org_uuid/events/:event_uuid/checkin/:attendee_uuid", [Auth], CheckInController.checkin);
Route.delete("/organizations/:org_uuid/events/:event_uuid/checkin/:attendee_uuid", [Auth], CheckInController.undo);

/**
 * Protected Routes
 * These routes require authentication
 * ------------------------------------------------
 * GET   /home - User dashboard
 * GET   /profile - User profile
 * POST  /change-profile - Update profile
 * POST  /change-password - Change password
 * DELETE /users - Delete users (admin only)
 */
Route.get("/home", [Auth], ProfileController.homePage);
Route.get("/profile", [Auth], ProfileController.profilePage);
Route.post("/change-profile", [Auth], ProfileController.changeProfile);
Route.post("/change-password", [Auth], PasswordController.changePassword);
Route.delete("/users", [Auth], ProfileController.deleteUsers);

/**
 * Static Asset Handling Routes
 *
 * 1. Dist Assets (/assets/:file)
 * Serves compiled and bundled assets from the dist/assets directory
 * - Handles JavaScript files (*.js) with proper content type
 * - Handles CSS files (*.css) with proper content type
 * - Implements file caching for better performance
 * - Sets appropriate cache headers for browser caching
 * Example URLs:
 * - /assets/app.1234abc.js
 * - /assets/main.5678def.css
 */
Route.get("/assets/:file", AssetController.distFolder);

/**
 * 2. Public Assets (/*) - Catch-all Route
 * Serves static files from the public directory
 * - Must be the LAST route in the file
 * - Only serves files with allowed extensions
 * - Returns 404 for paths without extensions
 * - Implements security checks against unauthorized access
 *
 * Allowed file types:
 * - Images: .ico, .png, .jpeg, .jpg, .gif, .svg
 * - Documents: .txt, .pdf
 * - Fonts: .woff, .woff2, .ttf, .eot
 * - Media: .mp4, .webm, .mp3, .wav
 * - Web: .css, .js
 *
 * Example URLs:
 * - /images/logo.png
 * - /documents/terms.pdf
 * - /fonts/roboto.woff2
 */
Route.get("/public/*", AssetController.publicFolder);

export default Route;
