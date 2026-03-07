const express = require('express');
const app = express();
const router = express.Router();
const { getDB } = require('../config/db');
const { type_based_page, allowed_pages, filtered_boats, applied_filters } = require('../helpers/utils');
const { getStyles, jQueryUIStyle, getJquery, jQueryUIScript, getFilter, getScripts } = require('../helpers/assets-helper');


router.get('/', (req, res) => {
    const name = 'Muhammad Abdullah';
    res.render('home', {
        title: 'Home',
        name: name
    });
});

router.all('/get-boats', async (req, res) => {
    let db = getDB();

    console.log('Received filter payload:', req.body);

    const filterData = await applied_filters(req.body);
    const page = type_based_page(req.body.page);

    console.log('query:', filterData);

    const boats = await db.collection('boats').find(filterData).toArray();

    console.log('Boats fetched based on filters:', boats.length);

    res.json({
        message: 'Boats fetched successfully',
        boats: boats
    });
});

router.all('/:page', async (req, res) => {
    let db = getDB();

    const page = type_based_page(req.params.page);

    if (!allowed_pages.includes(req.params.page)) {
        return res.status(404).send('Page Not Found');
    }

    if (req.query.filter == 'true') {

        const boats = await db.collection('boats').find(filterData).toArray();

        // console.log('Boats fetched based on filters:', boats);
        
        res.json({
            message: 'Boats fetched successfully',
            boats: boats
        });
        return;
    }

    // console.log('Final Query:', filterData);

    // const finalQuery = { ...page, ...filterData };


    const result = await db.collection('boats').find(page).toArray();

    const { conditions, brand, model, series, minLength, maxLength, minYear, maxYear } = await filtered_boats(result);

    // console.log('length', minLength, maxLength);
    // console.log('year', minYear, maxYear);

    const styles = [...jQueryUIStyle(), ...getStyles()];
    const scripts = [...getJquery(), ...jQueryUIScript(), ...getFilter(), ...getScripts()];


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
        styles: styles,
        scripts: scripts
    });
});

module.exports = router;