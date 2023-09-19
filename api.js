const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');
const groceryListDAO = require('../groceryListAPI/repository/groceryListDAO');
const logger = require('./log');
const PORT = 8000;

// Third-party middleware
server.use(bodyParser.json());

// Custom middleware
const validateNewItem = (req, res, next) => {
    if(!req.body.name || !req.body.quantity || !req.body.price || !req.body.category){
        req.body.valid = false;
        next();
    }else{
        req.body.valid = true;
        next();
    }
}

// Handlers
server.get('/groceryitems', (req, res) => {
    groceryListDAO.retrieveGroceryList()
        .then((data) => {
            res.send(data.Items);
            logger.info("Successfully retrieved list.");
        })
        .catch((err) => {
            res.send('Failed to retreive list...');
            logger.error(err);
        })
});

server.post('/groceryitems', validateNewItem, (req, res) => {
    const body = req.body;

    if(req.body.valid) {
        groceryListDAO.addOrUpdateGroceryItem(uuid.v4(), body.name, body.quantity, body.price, body.category)
            .then(() => {
                res.send('Successfully added item!');
                logger.info("Successfully added item.");
            })
            .catch((err) => {
                res.send('Failed to add item...');
                logger.error(err);
            })
    }
    else {
        res.send('Invalid item properties...');
        logger.error('Invalid item properties provided for grocery list item creation.');
    }
});

server.put('/groceryitems', validateNewItem, (req, res) => {
    const body = req.body;
    let itemNum = req.query.item;

    if(req.body.valid) {
        if(itemNum) {
            groceryListDAO.addOrUpdateGroceryItem(itemNum, body.name, body.quantity, body.price, body.category)
                .then(() => {
                    res.send('Successfully updated item!');
                    logger.info("Successfully updated item.");
                })
                .catch((err) => {
                    res.send('Failed to update item...');
                    logger.error(err);
                })
        }
        else {
            res.send('No item ID given...');
            logger.error('No item ID was provided for grocery list item replacement.');
        }
    }
    else {
        res.send('Invalid item properties...');
        logger.error('Invalid item properties provided for grocery list item replacement.');
    }

});

server.delete('/groceryitems', (req, res) => {
    let itemNum = req.query.item;

    if(itemNum) {
        groceryListDAO.deleteGroceryItemById(itemNum)
            .then(() => {
                res.send('Successfully deleted item!');
                logger.info("Successfully deleted item.");
            })
    }
    else {
        res.send('No item ID given...');
        logger.error('No item ID was provided for grocery list item deletion.');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    logger.info(`Server is running on port ${PORT}`);
});