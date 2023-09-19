const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-west-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();

// Get the grocery list
function retrieveGroceryList() {
    const params = {
        TableName: 'grocery_items'
    }

    return docClient.scan(params).promise();
}

// Create or update a grocery list item
function addOrUpdateGroceryItem(grocery_item_id, name, quantity, price, category) {

    const params = {
        TableName: 'grocery_items',
        Item: {
            grocery_item_id,
            name,
            quantity,
            price,
            category
        }
    }

    return docClient.put(params).promise();
}

// Delete a grocery list item
function deleteGroceryItemById(grocery_item_id) {
    const params = {
        TableName: 'grocery_items',
        Key: {
            grocery_item_id
        }
    }

    return docClient.delete(params).promise();
}

module.exports = {
    retrieveGroceryList,
    addOrUpdateGroceryItem,
    deleteGroceryItemById
};