const db = require('../database/dbConfig')

module.exports = {
    add, find, findById, findBy
}

async function add(user) {
    try {
        const [id] = await db("users").insert(user, "id");
        return findById(id);
    } catch (error) {
        throw error;
    }
}

function findById(id) {
    return db("users").where({ id }).first();
}

function findBy(filter) {
    console.log('filter', filter)
    return db("users").where('username', filter);
}

function find() {
    return db("users").select("id", "username").orderBy("id");
}