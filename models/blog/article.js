const { blog } = require('@/mods/__databases');

async function getArticleList() {
    let rows = await blog.query('SELECT * FROM blog.article_table ORDER BY `publish_time`');

    // let sliders = [];
    // let banners = [];

    // rows.forEach(item => {
    //     item.img = `/files/` + item.img;

    //     if (item.position == 1) sliders.push(item);
    //     else banners.push(item);
    // });

    return { rows };
}

module.exports = {
    getArticleList
};