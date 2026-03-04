const axios = require('axios');
const express = require('express');
const router = express.Router();
const xml2js = require('xml2js');
const { getDB } = require('../config/db');


const runFeed = async () => {
    try {
        const reponse = await axios.get('https://callersiq.com/cali_marine_huntington_beach_xml_feed');

        const xmlData = reponse.data;

        const parser = new xml2js.Parser({ explicitArray: false });
        const parserResult = await parser.parseStringPromise(xmlData);
        console.log(parserResult);

        const boatsArray = [];
        const soldBoatsArray = [];

        for (const boat of parserResult.inventory.item) {

            const initialBoatTitle = boat.year + ' ' + boat.make + ' ' + boat.model;

            const splittedTitle = initialBoatTitle.split(' ');

            const BoatTitle = splittedTitle.map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }).join(' ');

            const inventory_images = Object.values(boat.inventory_images ? boat.inventory_images : {});
            const product_images = inventory_images.length > 0 ? inventory_images[0] : [];

            

            const boatData = {
                id: boat.id,
                BoatTitle: BoatTitle,
                condition: boat.condition,
                product_images: product_images,
                year: boat.year,
                make: boat.make,
                model: boat.model,
                series: boat.series,
                price: boat.price,
                description: boat.description,
                condition: boat.condition,
                stock_number: boat.stock_number,
                class: boat.class,
                length: boat.length,
                category: boat.category,
                telephone: boat.telephone,
                boat_images: inventory_images
            }

            if(boat.sale_status.toLowerCase().includes('sold')) {
                soldBoatsArray.push(boatData);
            }else {
                boatsArray.push(boatData);
            }
        }

        console.log(boatsArray.length);
        console.log(soldBoatsArray.length);

        const db = getDB();

        const boatsCollection = db.collection('boats');
        const deletedBoats = await boatsCollection.deleteMany({});
        const insertedBoats = await boatsCollection.insertMany(boatsArray);

        return {
            deletedBoats: deletedBoats,
            insertedBoats: insertedBoats,
            boatsArray: boatsArray,
            soldBoatsArray: soldBoatsArray
        }


    } catch (error) {
        console.error(error);
    }
}

router.get('/run-feed', async (req, res) => {
    const result = await runFeed();
    res.json({
        result: result.boatsArray,
    });
});

module.exports = router;