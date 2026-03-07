const express = require('express');
const router = express.Router();
const cron = require('node-cron');

const runFeed = require('../cron/cron-feed');

cron.schedule('*/5 * * * *', async() => {
    const result = await runFeed();
  console.log('Running cron job to update feed data, result:', result.inventory.length, 'boats and', result.soldBoats.length, 'sold boats');
});


module.exports = router;