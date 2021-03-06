const {Umzug, SequelizeStorage} = require('umzug');
const sequelize = require("./database/models").sequelize;
const {Sequelize} = require('sequelize');
const {user} = require("./routes/api/auth/userAttacher");
const models = require("./database/models");
const yesno = require('yesno');

const resolver = ({name, path, context}) => {
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


function addAdmin() {
    return user.findOne(
        {
            where: {
                provider: 'local',
                email: process.env.ADMIN_EMAIL
            }
        }
    ).then((u) => {
            if (u !== null) {
                // admin already exists, exit
                return
            }

            user.register(
                user.build({
                    provider: 'local',
                    email: process.env.ADMIN_EMAIL,
                    first_name: 'Admin',
                    last_name: ''
                }),
                process.env.ADMIN_PASSWORD,
                (err, u) => {
                    if (err) {
                        console.error("Could not create admin user")
                    }
                    console.log("Admin account inserted")

                    models.role.findOne({
                        where: {
                            name: 'admin'
                        }
                    }).then(r => {
                            if (r == null) {
                                console.error("Admin role not found!");
                                return;
                            }

                            models.user_role.create({
                                user_id: u.id,
                                role_id: r.id
                            }).then(() => console.log("Admin account role assigned"))
                        },
                        err => console.error(`Error finding admin role, ${err}`)
                    )
                }
            )
        }
    );
}

(async () => {
    if(process.env.RESET_DB) {
        console.log("[DB] Clearing database")
        let ok;
        if (process.env.RESET_DB === "ask") {
            ok = await yesno({
                question: 'Are you sure you want to clear the database?'
            });
        } else if (process.env.RESET_DB === "yes") {
            ok = true;
        } else {
            ok = false;
        }
        try {
            if (ok) {
                await seeder.down({to: 0}).then(() => migrator.down({to: 0}));
            }
        } catch (e) {
            console.warn("Could not clear")
            console.warn(e)
        }
    }

    await migrator.up().then(() => {
        console.log("[DB] Migrations complete")
        seeder.up().then(() => {
            console.log("[DB] Seeders complete")
            addAdmin();
        })
    });
})();
