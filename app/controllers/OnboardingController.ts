import DB from "../services/DB";
import { Response, Request } from "../../type";
import { uuidv7 } from "uuidv7";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

class OnboardingController {
   public async welcome(request: Request, response: Response) {
      if (!request.user) {
         return response.redirect("/login");
      }

      const user = await DB.from("users").where("id", request.user.id).first();

      if (!user) {
         return response.redirect("/login");
      }

      return response.inertia("onboarding/welcome", { user });
   }

   public async step(request: Request, response: Response) {
      if (!request.user) {
         return response.redirect("/login");
      }

      const step = parseInt(request.params.step || "1");

      if (step < 1 || step > 3) {
         return response.redirect("/onboarding/step/1");
      }

      const user = await DB.from("users").where("id", request.user.id).first();

      if (!user) {
         return response.redirect("/login");
      }

      let data: any = { user, step };

      return response.inertia("onboarding/step", data);
   }

   public async submit(request: Request, response: Response) {
      if (!request.user) {
         return response.redirect("/login");
      }

      const step = parseInt(request.params.step || "1");
      const body = await request.json();

      try {
         if (step === 1) {
            const { name, description } = body;

            if (!name) {
               return response
                  .flash("error", "Organization name is required")
                  .redirect("/onboarding/step/1");
            }

            const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

            const existingOrg = await DB.from("organizations")
               .where("slug", slug)
               .first();

            if (existingOrg) {
               return response
                  .flash("error", "Organization with this name already exists")
                  .redirect("/onboarding/step/1");
            }

            await DB.table("organizations").insert({
               id: uuidv7(),
               name,
               slug,
               description: description || null,
               created_by: request.user.id,
               onboarding_completed: false,
               onboarding_step: 2,
               created_at: Date.now(),
               updated_at: Date.now()
            });

            const org = await DB.from("organizations").where("slug", slug).first();

            await DB.table("organization_members").insert({
               id: uuidv7(),
               organization_id: org.id,
               user_id: request.user.id,
               role: "admin",
               added_by: request.user.id,
               added_at: Date.now(),
               created_at: Date.now(),
               updated_at: Date.now()
            });

            return response.redirect("/onboarding/step/2");
         }

         if (step === 2) {
            const { name, type, start_date, end_date, location, skip_event } = body;

            if (!skip_event && (!name || !start_date || !end_date)) {
               return response
                  .flash("error", "Please fill in all required fields")
                  .redirect("/onboarding/step/2");
            }

            // Get the most recently created organization that's not completed onboarding
            const organization = await DB.from("organizations")
               .where("created_by", request.user.id) 
               .orderBy("created_at", "desc")
               .first();

            if (!organization) {
               return response
                  .flash("error", "Organization not found")
                  .redirect("/onboarding/step/1");
            }

            const organization_id = organization.id;

            if (!skip_event) {
               const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

               const existingEvent = await DB.from("events")
                  .where("slug", slug)
                  .first();

               if (existingEvent) {
                  return response
                     .flash("error", "Event with this name already exists")
                     .redirect("/onboarding/step/2");
               }

               await DB.table("events").insert({
                  id: uuidv7(),
                  organization_id,
                  name,
                  slug,
                  type: type || "conference",
                  start_date: dayjs(start_date).utc().valueOf(),
                  end_date: dayjs(end_date).utc().valueOf(),
                  location: location || null,
                  status: "draft",
                  entry_system: "qr",
                  created_by: request.user.id,
                  created_at: Date.now(),
                  updated_at: Date.now()
               });

               const event = await DB.from("events").where("slug", slug).first();

               await DB.table("event_settings").insert({
                  id: uuidv7(),
                  event_id: event.id,
                  require_approval: false,
                  custom_fields: null,
                  allow_self_registration: true,
                  allow_duplicate_checkin: false,
                  require_verification: false,
                  send_confirmation_email: true,
                  send_qr_email: true,
                  timezone: "UTC",
                  locale: "en",
                  created_at: Date.now(),
                  updated_at: Date.now()
               });
            }

            await DB.from("organizations")
               .where("id", organization_id)
               .update({
                  onboarding_step: 3,
                  updated_at: Date.now()
               });

            return response.redirect("/onboarding/step/3");
         }

         if (step === 3) {
            const { skip_team, emails } = body;

            // Get the most recently created organization that's not completed onboarding
            const organization = await DB.from("organizations")
               .where("created_by", request.user.id) 
               .orderBy("created_at", "desc")
               .first();

            if (!organization) {
               return response
                  .flash("error", "Organization not found")
                  .redirect("/onboarding/step/1");
            }

            const organization_id = organization.id;

            if (!skip_team && emails && emails.length > 0) {
               for (const email of emails) {
                  if (!email || !email.includes('@')) continue;

                  const existingUser = await DB.from("users").where("email", email.trim()).first();

                  if (existingUser) {
                     const existingMember = await DB.from("organization_members")
                        .where("organization_id", organization_id)
                        .where("user_id", existingUser.id)
                        .first();

                     if (!existingMember) {
                        await DB.table("organization_members").insert({
                           id: uuidv7(),
                           organization_id,
                           user_id: existingUser.id,
                           role: "staff",
                           added_by: request.user.id,
                           added_at: Date.now(),
                           created_at: Date.now(),
                           updated_at: Date.now()
                        });
                     }
                  }
               }
            }

            await DB.from("organizations")
               .where("id", organization_id)
               .update({
                  onboarding_completed: true,
                  onboarding_step: 4,
                  updated_at: Date.now()
               });

            return response.redirect("/onboarding/complete");
         }

         return response.redirect("/onboarding/step/1");
      } catch (error: any) {
         console.error("Onboarding submit error:", error);
         return response
            .flash("error", "An error occurred. Please try again.")
            .redirect(`/onboarding/step/${step}`);
      }
   }

   public async skip(request: Request, response: Response) {
      if (!request.user) {
         return response.redirect("/login");
      }

      const organization = await DB.from("organizations")
         .where("created_by", request.user.id)
         .where("onboarding_completed", false)
         .orderBy("created_at", "desc")
         .first();

      if (organization) {
         await DB.from("organizations")
            .where("id", organization.id)
            .update({
               onboarding_completed: true,
               onboarding_step: 5,
               updated_at: Date.now()
            });
      }

      return response.redirect("/onboarding/complete");
   }

   public async complete(request: Request, response: Response) {
      if (!request.user) {
         return response.redirect("/login");
      }

      const organization = await DB.from("organizations")
         .where("created_by", request.user.id)
         .orderBy("created_at", "desc")
         .first();

      if (!organization) {
         return response.redirect("/organizations/create");
      }

      return response.inertia("onboarding/complete", {
         user: request.user,
         organization: organization
      });
   }
}

export default new OnboardingController();
