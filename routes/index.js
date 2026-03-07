const express = require('express');
const app = express();
const router = express.Router();
const { getDB } = require('../config/db');
const { type_based_page, allowed_pages, filtered_boats, applied_filters } = require('../helpers/utils');
const { getStyles, jQueryUIStyle, getJquery, jQueryUIScript, getFilter, getScripts } = require('../helpers/assets-helper');
const settings = require('../config/setting.json');


router.get('/', (req, res) => {
    const name = 'Muhammad Abdullah';
    res.render('home', {
        title: 'Home',
        name: name
    });
});

router.all('/:page', async (req, res) => {
    let db = getDB();

    const page = type_based_page(req.params.page);

    if (!allowed_pages.includes(req.params.page)) {
        return res.status(404).send('Page Not Found');
    }

    const boat_limit = settings.boat_limit || 12;

    if (req.query.filter == 'true') {

        const filterData = await applied_filters(req.body);

        const boats = await db.collection('boats').find(filterData).limit(boat_limit).toArray();

        console.log('Boats fetched based on filters:', boats.length);
        
        res.json({
            message: 'Boats fetched successfully',
            boats: boats
        });
        return;
    }

    if (req.query.loadMore == 'true') {

        const filterData = await applied_filters(req.body);

        const page = parseInt(req.query.page);
        const boat_skip = page * boat_limit;

        console.log('Load More Request - Page:', page, 'Skip:', boat_skip);

        const boats = await db.collection('boats').find(filterData).skip(boat_skip).limit(boat_limit).toArray();

        console.log('Boats fetched based on filters:', boats.length);
        
        res.json({
            message: 'Boats fetched successfully',
            boats: boats,
            currentPage: page + 1
        });
        return;
    }

    // console.log('Final Query:', filterData);

    // const finalQuery = { ...page, ...filterData };


    const result = await db.collection('boats').find(page).limit(boat_limit).toArray();
    const boats = await db.collection('boats').find(page).toArray();

    const { conditions, brand, model, series, minLength, maxLength, minYear, maxYear } = await filtered_boats(boats);

    // console.log('length', minLength, maxLength);
    // console.log('year', minYear, maxYear);

    const styles = [...jQueryUIStyle(), ...getStyles()];
    const scripts = [...getJquery(), ...jQueryUIScript(), ...getFilter(), ...getScripts()];

    const boatsCount = boats.length;
    const totalPages = Math.ceil(boatsCount / boat_limit);
    let currentPage = 1;

    res.render('boats', {
        title: 'Boats',
        pageUrl: page,
        boats: result,
        conditions: conditions,
        brand: brand,
        model: model,
        series: series,
        maxLength: maxLength,
        minLength: minLength,
        maxYear: maxYear,
        minYear: minYear,
        totalPages: totalPages,
        currentPage: currentPage,
        boatsCount: boatsCount,
        styles: styles,
        scripts: scripts
    });
});

module.exports = router;