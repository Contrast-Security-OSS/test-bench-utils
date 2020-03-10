'use strict';

module.exports = {};
module.exports['sequelize.prototype.query'] = require('./sequelize');
module.exports['mysql/lib/Connection.query'] = require('./mysql');
module.exports[
  'pg.Connection.prototype.query (String)'
] = require('./pg/string');
module.exports[
  'pg.Connection.prototype.query (Object)'
] = require('./pg/object');
module.exports['TypeORM.Repository.prototype.query'] = require('./typeorm')[
  'TypeORM.Repository.prototype.query'
];
module.exports['TypeORM.Collection.prototype.query'] = require('./typeorm')[
  'TypeORM.Connection.prototype.query'
];
