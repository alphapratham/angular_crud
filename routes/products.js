var express = require('express');
var router = express.Router();
const ProductModel = require('../model/ProductModel');

/* GET home page. */
router.get('/manageProducts', function(req, res, next) {
  res.render('products/index', { title: 'Express' });
});

//Methot To Create New Product
router.post('/createProduct', async(req, res)=>{
  try {
    let newProduct = await new ProductModel(req.body).save();
    console.log(newProduct)
    return res.send(newProduct).status(201);
  } catch (err) {
    console.log(err);
    return res.send(err.message).status(500);
  }
});

//Method To Get All Products
router.get('/getAllProducts', async(req, res)=>{
  try {
    let products = await ProductModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
            _id: 1,
          name: 1,
            price: 1,
            quantity: 1,
            createdBy: 1,
           fullName: {$concat: [ {$arrayElemAt: ["$user.firstName", 0]}, " ", {$arrayElemAt: ["$user.lastName", 0]}]}
        }
      }
    ]);

    return res.send(products).status(200);
  } catch (err) {
    console.log(err);
    return res.send(err.message).status(500);
  }
});

//Method To Update Product
router.put('/editProduct/:productId', async(req, res)=>{
  try {
    let product = await ProductModel.findOneAndUpdate({_id: req.params.productId}, {$set: req.body}, {new: true});
    return res.send(product).status(201);
  } catch (err) {
    return res.send(err.message).status(500);
  }
});

//Method To Delete Product
router.delete('/deleteProduct/:productId', async(req, res)=>{
  try {
    await ProductModel.findOneAndDelete({_id: req.params.productId});
    return res.sendStatus(200);
  } catch (err) {
    return res.send(err.message).status(500);
  }
})

module.exports = router;
