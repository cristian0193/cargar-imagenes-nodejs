const productController = require('../service/productService')

exports.assignRouterUser = function(app, multiparty) {
    app.post('/product/create', productController.createItem);
    app.get('/product/items', productController.consultItems);
}