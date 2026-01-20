import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('organization_members', function (table) {
        table.uuid('id').primary().notNullable()
        table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE')
        table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
        table.enum('role', ['admin', 'manager', 'staff']).defaultTo('staff').notNullable()
        table.uuid('added_by').nullable().references('id').inTable('users')
        table.timestamp('added_at').notNullable()
        table.bigInteger('created_at')
        table.bigInteger('updated_at')

        table.unique(['organization_id', 'user_id'])
        table.index('organization_id')
        table.index('user_id')
        table.index('created_at')
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('organization_members')
}
