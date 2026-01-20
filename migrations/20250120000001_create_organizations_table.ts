import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('organizations', function (table) {
        table.uuid('id').primary().notNullable()
        table.string('name', 255).notNullable()
        table.string('slug', 255).unique().notNullable()
        table.text('description').nullable()
        table.string('logo', 255).nullable()
        table.json('settings').nullable()
        table.boolean('onboarding_completed').defaultTo(false)
        table.integer('onboarding_step').defaultTo(1)
        table.bigInteger('created_at')
        table.bigInteger('updated_at')
        table.uuid('created_by').nullable().references('id').inTable('users').onDelete('SET NULL');
        table.index('created_at')
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('organizations')
}
