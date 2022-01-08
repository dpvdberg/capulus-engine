const SequelizeAuto = require('sequelize-auto');

require("./database/generators/auth_tables")

const auto = new SequelizeAuto(process.env.MYSQL_USER, process.env.MYSQL_DB, process.env.MYSQL_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    directory: './database/models',
    views: true,
    noAlias: true
})


function removeAliases(path = './database/models/init-models.js') {
    const fs = require('fs');

    const REGEX = /as:\s'.*?',\s/g;
    var fileContent = fs.readFileSync(path, 'utf8');
    fileContent = fileContent.replace(REGEX, '');
    fs.writeFileSync(path, fileContent);
}

auto.run().then(() => removeAliases());
