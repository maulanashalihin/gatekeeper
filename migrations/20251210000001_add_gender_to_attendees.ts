import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Add gender field to attendees table
    await knex.schema.alterTable('attendees', function (table) {
        table.enum('gender', ['male', 'female']).nullable().after('job_title');
    });

    // Add enable_gender setting to event_settings table
    await knex.schema.alterTable('event_settings', function (table) {
        table.boolean('enable_gender').defaultTo(false).after('allow_self_registration');
    });
}

export async function down(knex: Knex): Promise<void> {
    // Remove gender field from attendees table
    await knex.schema.alterTable('attendees', function (table) {
        table.dropColumn('gender');
    });

    // Remove enable_gender setting from event_settings table
    await knex.schema.alterTable('event_settings', function (table) {
        table.dropColumn('enable_gender');
    });
}
