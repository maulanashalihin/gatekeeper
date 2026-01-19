import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('activity_logs', function (table) {
        table.uuid('id').primary().notNullable()
        table.uuid('user_id').nullable().references('id').inTable('users')
        table.uuid('organization_id').nullable().references('id').inTable('organizations')
        table.uuid('event_id').nullable().references('id').inTable('events')
        table.uuid('attendee_id').nullable().references('id').inTable('attendees')
        
        table.string('action', 100).notNullable()
        table.string('entity_type', 50).nullable()
        table.string('entity_id', 36).nullable()
        
        table.json('changes').nullable()
        table.string('ip_address', 45).nullable()
        table.string('user_agent', 500).nullable()
        
        table.bigInteger('created_at')
        
        table.index('user_id')
        table.index('organization_id')
        table.index('event_id')
        table.index('action')
        table.index('created_at')
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('activity_logs')
}
