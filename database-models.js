const SequelizeAuto = require('sequelize-auto');

const auto = new SequelizeAuto('capulus', 'capulus', 'xdgL5pGgJsf9PZhTdif', {
    host: 'localhost',
    dialect: 'mysql',
    directory: './database/models',
    views: true,
    noAlias: true
})

auto.run();
