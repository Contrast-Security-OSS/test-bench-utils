'use strict';

const { Connection, Repository, createConnection } = require('typeorm');
const { SQL } = require('sql-template-strings');
const escape = require('escape-html');

const repo = new Repository();
const connection = createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "test",
  password: "test",
  database: "test"
});

// sinks for typeorm.Repository.prototype.query
// typeorm.Connection.prototype.query exist in test-bench-utils

/**
 * Executes a raw SQL query and returns a raw database results.
 * Raw query execution is supported only by relational databases (MongoDB is not supported).
 */
// query(query: string, parameters?: any[]): Promise<any>;
const origRepositoryQuery = Repository.prototype.query;
Repository.prototype.query = async function overloadedRepositoryQuery(query) {
  return origRepositoryQuery.call(this, query).catch((err) => console.log(err));
};

/**
 * Executes raw SQL query and returns raw database results.
 */
// async query(query: string, parameters?: any[], queryRunner?: QueryRunner): Promise<any> {
const origConnectionQuery = Connection.prototype.query;
Connection.prototype.query = async function overloadedConnectionQuery(query) {
  return origConnectionQuery.call(this, query).catch((err) => console.log(err));
};

module.exports['TypeORM.Repository.prototype.query'] = async function repoQuery(
  input,
  { safe = false, noop = false } = {}
) {
  if (noop) return 'NOOP';

  const sql = safe
    ? SQL`SELECT ${input} as "test"`
    : `SELECT "${input}" as "test";`;
  console.log("HELLO ATI");
  console.log(repo);
  return Repository.query(sql).then((result) => console.log(result));
};

module.exports[
  'TypeORM.Connection.prototype.query'
] = async function connectionQuery(input, { safe = false, noop = false } = {}) {
  if (noop) return 'NOOP';

  const sql = safe
    ? SQL`SELECT ${input} as "test"`
    : `SELECT "${input}" as "test";`;
  console.log(connection);
  return Connection.query(sql).then((result) => console.log(result));
};
