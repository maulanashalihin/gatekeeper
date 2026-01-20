import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('attendees', function (table) {
        table.uuid('id').primary().notNullable()
        table.uuid('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE')
        
        // Attendee information
        table.string('name', 255).notNullable()
        table.string('email', 255).notNullable()
        table.string('phone', 50).nullable()
        table.string('company', 255).nullable()
        table.string('job_title', 255).nullable()
        
        // Custom fields
        table.json('custom_data').nullable()
        
        // QR code
        table.string('qr_code', 255).unique().notNullable()
        table.string('qr_code_url', 255).nullable()
        
        // Status
        table.enum('status', ['registered', 'checked_in', 'cancelled', 'no_show']).defaultTo('registered').notNullable()
        
        // Registration info
        table.enum('registration_method', ['admin', 'self', 'import']).defaultTo('self').notNullable()
        table.timestamp('registered_at').notNullable()
        
        // Check-in info
        table.timestamp('checked_in_at').nullable()
        table.uuid('checked_in_by').nullable().references('id').inTable('users')
        
        // Notes
        table.text('notes').nullable()
        
        table.uuid('created_by').nullable().references('id').inTable('users')
        table.bigInteger('created_at')
        table.bigInteger('updated_at')

        table.index('event_id')
        table.index('email')
        table.index('qr_code')
        table.index('status')
        table.index('registered_at')
        table.index('created_at')
        table.index(['event_id', 'status'])
        table.index(['event_id', 'created_at'])
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('attendees')
}
