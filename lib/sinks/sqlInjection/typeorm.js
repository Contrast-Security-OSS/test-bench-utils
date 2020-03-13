'use strict';
require('reflect-metadata');
const hooker = require('hooker');
const {
  EntityManager,
  Connection,
  Repository,
  createConnection
} = require('typeorm');
const { SQL } = require('sql-template-strings');
const escape = require('escape-html');

const repo = new Repository();
repo.manager = new Connection({ type: 'mysql' });
repo.manager.isConnected = true;
const connection = new Connection({ type: 'mysql' });
connection.isConnected = true;
/**
 * Executes a raw SQL query and returns a raw database results.
 * Raw query execution is supported only by relational databases (MongoDB is not supported).
 */
// query(query: string, parameters?: any[]): Promise<any>;
const origRepositoryQuery = Repository.prototype.query;
Repository.prototype.query = async function overloadedRepositoryQuery(query) {
  debugger;
  // 'this' refers internally to Repository
  // manager is of type EntityManager
  // this.manager = new EntityManager(connection);
  origRepositoryQuery.call(this, query).catch((err) => console.log(err));
  return { query };
};

const origConnection = Connection.prototype.createQueryRunner;
Connection.prototype.createQueryRunner = async function overloadedQuery(mode) {
  debugger;
  origConnection.call(this, mode).catch((err) => { console.log(err)});
};

/**
 * Executes raw SQL query and returns raw database results.
 */
// async query(query: string, parameters?: any[], queryRunner?: QueryRunner): Promise<any> {
const origConnectionQuery = Connection.prototype.query;
Connection.prototype.query = async function overloadedConnectionQuery(
  query,
  params,
  queryRunner
) {
  debugger;
  origConnectionQuery
    .call(this, query, params, queryRunner)
    .catch((err) => console.log(err));
  return { query };
};

module.exports['TypeORM.Repository.prototype.query'] = async function repoQuery(
  input,
  { safe = false, noop = false } = {}
) {
  if (noop) return 'NOOP';

  const sql = safe
    ? SQL`SELECT ${input} as "test"`
    : `SELECT "${input}" as "test";`;
  return new Promise((resolve, reject) => {
    repo.query(sql, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
  // return JSON.stringify(result);
};

module.exports[
  'TypeORM.Connection.prototype.query'
] = async function connectionQuery(input, { safe = false, noop = false } = {}) {
  if (noop) return 'NOOP';

  const sql = safe
    ? SQL`SELECT ${input} as "test"`
    : `SELECT "${input}" as "test";`;
  // const result = await connection
    // .query(sql)
    // .then((result) => console.log(result));
  // return JSON.stringify(result);
  return new Promise((resolve, reject) => {
    debugger;
    connection.createQueryRunner('master').then((connection) => {
      connection.query(
        sql,
        {},
        {
          release() {
            return true;
          }
        },
        (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
  });
};
