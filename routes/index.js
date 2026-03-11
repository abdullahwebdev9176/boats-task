const express = require('express');
const app = express();
const router = express.Router();
const { getDB } = require('../config/db');
const { type_based_page, allowed_pages, filtered_boats, applied_filters, sortOptions } = require('../helpers/utils');
const { getStyles, jQueryUIStyle, getJquery, jQueryUIScript, getFilter, getScripts } = require('../helpers/assets-helper');
const settings = require('../config/setting.json');
const { ObjectId } = require('mongodb');


router.get('/', (req, res) => {
    const name = 'Muhammad Abdullah';
    res.render('home', {
        title: 'Home',
        name: name
    });
});

router.all('/boat-search', async (req, res) => {

    let db = getDB();

    const { searchValue, sortValue } = req.body;

    const limit = settings.boat_limit || 12;

    let searchQuery = {};
    
    if (searchValue) {
        searchQuery = {
            BoatTitle: { $regex: searchValue, $options: 'i' }
        };
    }

    const sortOptionsQuery = sortOptions(sortValue);

    const boats = await db.collection('boats').find(searchQuery).sort(sortOptionsQuery).limit(limit).toArray();

    const totalboats = await db.collection('boats').find(searchQuery).sort(sortOptionsQuery).toArray();

    const totalPages = Math.ceil(totalboats / limit);

    res.json({
        message: 'Boat search results',
        boats: boats,
        boatsCount: totalboats.length,
        totalPages: totalPages,
        currentPage: 1
    });

});

router.all('/:page', async (req, res) => {
    let db = getDB();

    const page = type_based_page(req.params.page);

    if (!allowed_pages.includes(req.params.page)) {
        return res.status(404).send('Page Not Found');
    }

    const boat_limit = settings.boat_limit || 12;

        console.log('filterData', req.query);


    if (req.query.filter == 'true') {

        console.log('Filter request')

        const filterData = await applied_filters(req.query);


        const boats = await db.collection('boats').find(filterData).limit(boat_limit).toArray();
        const boatsCount = await db.collection('boats').find(filterData).toArray();

        // console.log('Boats fetched based on filters:', boats.length);

        res.json({
            message: 'Boats fetched successfully',
            boats: boats,
            availableFilters:boatsCount,
            boatsCount: boatsCount.length
        });
        return;
    }

    if (req.query.loadMore == 'true') {

        const filterData = await applied_filters(req.query);

        const page = parseInt(req.query.page);
        const boat_skip = page * boat_limit;

        console.log('Load More Request - Page:', page, 'Skip:', boat_skip);

        const boats = await db.collection('boats').find(filterData).skip(boat_skip).limit(boat_limit).toArray();

        // console.log('Boats fetched based on filters:', boats.length);
        let currentPage = page + 1;

        res.json({
            message: 'Boats fetched successfully',
            boats: boats,
            currentPage: currentPage
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

    const seriesFilter = series.filter(item => item !== '');

    res.render('boats', {
        title: 'Boats',
        pageUrl: page,
        boats: result,
        conditions: conditions,
        brand: brand,
        model: model,
        series: seriesFilter,
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

router.get('/boat-details/:id', async (req, res) => {
    let db = getDB();

    const result = await db.collection('boats').findOne({ _id: new ObjectId(req.params.id) });

    // console.log('Boat Details Request - ID:', result);

    res.render('boat-details', {
        title: 'Boat Details',
        boatTitle: result.BoatTitle
    });
});

module.exports = router;