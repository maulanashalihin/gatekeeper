import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('events', function (table) {
        table.uuid('id').primary().notNullable()
        table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE')
        table.string('name', 255).notNullable()
        table.string('slug', 255).unique().notNullable()
        table.text('description').nullable()
        table.enum('type', ['conference', 'workshop', 'concert', 'seminar', 'webinar', 'meetup', 'exhibition', 'sports']).defaultTo('conference').notNullable()
        
        // Event details
        table.timestamp('start_date').notNullable()
        table.timestamp('end_date').notNullable()
        table.string('location', 255).nullable()
        table.string('city', 255).nullable()
        table.string('province', 255).nullable()
        table.string('venue', 255).nullable()
        table.text('address').nullable()
        table.integer('capacity').nullable()
        
        // Event settings
        table.string('image', 255).nullable()
        table.boolean('is_public').defaultTo(false)
        table.boolean('registration_open').defaultTo(true)
        table.timestamp('registration_start').nullable()
        table.timestamp('registration_end').nullable()
        table.timestamp('checkin_start').nullable()
        table.timestamp('checkin_end').nullable()
        
        // Entry system
        table.enum('entry_system', ['qr', 'manual', 'kiosk', 'bulk']).defaultTo('qr').notNullable()
        
        // Status
        table.enum('status', ['draft', 'published', 'ongoing', 'completed', 'cancelled']).defaultTo('draft').notNullable()
        
        table.uuid('created_by').references('id').inTable('users')
        table.bigInteger('created_at')
        table.bigInteger('updated_at')

        table.index('organization_id')
        table.index('slug')
        table.index('status')
        table.index('start_date')
        table.index('created_at')
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('events')
}
