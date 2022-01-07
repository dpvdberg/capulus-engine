const SequelizeAuto = require('sequelize-auto');

require("./database/generators/auth_tables")

const auto = new SequelizeAuto('capulus', 'capulus', 'xdgL5pGgJsf9PZhTdif', {
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
