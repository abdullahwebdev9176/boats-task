const express = require('express');
const app = express();
const router = express.Router();


router.get('/', (req, res) => {
    const name = 'Muhammad Abdullah';
    res.render('home', { 
        title: 'Home',
        name: name
    });
});

router.get('/:page', (req, res) => {

    const page = type_based_page(req.params.page);


    res.render('boats', { 
        title: 'Boats',
        page: page
    });
});

module.exports = router;