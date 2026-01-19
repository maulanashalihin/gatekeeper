import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('check_ins', function (table) {
        table.uuid('id').primary().notNullable()
        table.uuid('attendee_id').notNullable().references('id').inTable('attendees').onDelete('CASCADE')
        table.uuid('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE')
        
        // Check-in details
        table.enum('method', ['qr', 'manual', 'kiosk']).notNullable()
        table.timestamp('checked_in_at').notNullable()
        table.uuid('checked_in_by').nullable().references('id').inTable('users')
        
        // Device info
        table.json('device_info').nullable()
        
        // Location (optional)
        table.decimal('latitude', 10, 6).nullable()
        table.decimal('longitude', 10, 6).nullable()
        
        // Notes
        table.text('notes').nullable()
        
        table.bigInteger('created_at')
        
        table.index('attendee_id')
        table.index('event_id')
        table.index('checked_in_at')
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('check_ins')
}
