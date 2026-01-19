import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('event_settings', function (table) {
        table.uuid('id').primary().notNullable()
        table.uuid('event_id').notNullable().unique().references('id').inTable('events').onDelete('CASCADE')
        
        // Registration settings
        table.boolean('require_approval').defaultTo(false)
        table.json('custom_fields').nullable()
        table.boolean('allow_self_registration').defaultTo(true)
        
        // Check-in settings
        table.boolean('allow_duplicate_checkin').defaultTo(false)
        table.boolean('require_verification').defaultTo(false)
        
        // Notification settings
        table.boolean('send_confirmation_email').defaultTo(true)
        table.boolean('send_qr_email').defaultTo(true)
        
        // Other settings
        table.string('timezone', 50).defaultTo('UTC')
        table.string('locale', 10).defaultTo('en')
        
        table.bigInteger('created_at')
        table.bigInteger('updated_at')
        
        table.index('event_id')
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('event_settings')
}
