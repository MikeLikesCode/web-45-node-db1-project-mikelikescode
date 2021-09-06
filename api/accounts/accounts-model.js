const db = require('../../data/db-config');

const getAll = () => {
  return db('accounts');
}
const getById = id => {
  return db('accounts').where('id', id).first();
}

const create = async (account) => {
  return await db('accounts')
    .insert(account)
    .then(id => {
      return getById(id[0])
    })
}

const updateById = (id, account) => {
  return db('accounts')
    .where({ id })
    .update(account)
    .then(() => {
      return getById(id)
    })
}

const deleteById = id => {
  return db('users')
    .where({ id })
    .del();
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
}
