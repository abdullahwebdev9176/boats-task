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

module.exports = router;