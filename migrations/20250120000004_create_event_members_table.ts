import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('event_members', function (table) {
        table.uuid('id').primary().notNullable()
        table.uuid('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE')
        table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
        table.enum('role', ['manager', 'staff']).defaultTo('staff').notNullable()
        table.uuid('added_by').nullable().references('id').inTable('users')
        table.timestamp('added_at').nullable()
        table.bigInteger('created_at')
        table.bigInteger('updated_at')
        
        table.unique(['event_id', 'user_id'])
        table.index('event_id')
        table.index('user_id')
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('event_members')
}
