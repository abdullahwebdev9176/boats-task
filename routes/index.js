const express = require('express');
const app = express();
const router = express.Router();
const { getDB } = require('../config/db');
const { type_based_page, allowed_pages } = require('../helpers/utils');
const { getStyles, jQueryUIStyle, getJquery, jQueryUIScript, getFilter } = require('../helpers/assets-helper');


router.get('/', (req, res) => {
    const name = 'Muhammad Abdullah';
    res.render('home', { 
        title: 'Home',
        name: name
    });
});

router.get('/:page', async(req, res) => {
    let db = getDB();

    const page = type_based_page(req.params.page);

    if(!allowed_pages.includes(req.params.page)){
        return res.status(404).send('Page Not Found');
    }
    
    const result = await db.collection('boats').find(page).limit(12).toArray();

    // console.log(result);

    const styles = [...jQueryUIStyle(), ...getStyles()];
    const scripts = [...getJquery(), ...jQueryUIScript(), ...getFilter()];


    res.render('boats', { 
        title: 'Boats',
        page: page,
        boats: result,
        styles: styles,
        scripts: scripts
    });
});

module.exports = router;