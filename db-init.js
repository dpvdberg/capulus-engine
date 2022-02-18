const {Umzug, SequelizeStorage} = require('umzug');
const sequelize = require("./database/models").sequelize;
const {Sequelize} = require('sequelize');

const resolver = ({ name, path, context }) => {
    const migration = require(path || '')
    return {
        name,
        up: async () => migration.up(context, Sequelize),
        down: async () => migration.down(context, Sequelize),
    }
}

const migrator = new Umzug({
    migrations: {
        glob: 'database/migrations/*.js',
        resolve: resolver,
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({sequelize}),
    logger: console,
});

const seeder = new Umzug({
    migrations: {
        glob: 'database/seeders/*.js',
        resolve: resolver,
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({sequelize, modelName: 'SequelizeData'}),
    logger: console,
});

(async () => {
    await migrator.up().then(() => {
        console.log("[DB] Migrations complete")
        seeder.up().then(() => {
            console.log("[DB] Seeders complete")
        })
    });
})();
