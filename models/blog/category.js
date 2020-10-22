const { blog } = require('@/mods/__databases');

async function getCategory() {
    let rows = await blog.query('SELECT * FROM blog.category_table ORDER BY `order`');

    return { rows };
}

module.exports = {
    getCategory
};