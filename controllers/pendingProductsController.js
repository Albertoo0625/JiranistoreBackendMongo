const mongoose = require('mongoose');
const path = require('path');

// Assuming you have defined a Mongoose schema for pending products
const PendingProduct = require('../modal/pendingProductsSchema');

// 1. Add pending product
const addPendingProduct = async (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  const { title, price, company, info, quantity, email, user_id } = req.body;
  const image = req.files.img;
  const cleanProductInfo = info.replace(/[\r\n\t]/g, ' ');

  const filepath = path.join(__dirname, '..', 'public', 'images', `${image.name}`);
  image.mv(filepath, (err) => {
    if (err) return res.status(500).json({ status: "error", message: err });
  });

  const fullFilePath = `http://localhost:3500/images/${image.name}`;

  try {
    const newPendingProduct = new PendingProduct({
      pending_product_title: title,
      pending_product_img: fullFilePath,
      pending_product_price: price,
      pending_product_company: company,
      pending_product_info: cleanProductInfo,
      pending_product_quantity: quantity,
      pending_product_email: email,
      pending_product_user_id: user_id,
    });

    await newPendingProduct.save();
    return res.status(200).send("Form submitted successfully.");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// 2. Get all pending products
const getAllPendingProducts = async (req, res) => {
  try {
    let products = await PendingProduct.find({ pending_product_approval_status: false });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// 3. Get single pending product
const getOnePendingProduct = async (req, res) => {
  let id = req.params.id;
  try {
    let product = await PendingProduct.findOne({ _id: id });
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// 4. Update pending product
const updatePendingProduct = async (req, res) => {
  const id = req.params.id;
  const { approvalstatus } = req.body;
  try {
    let product = await PendingProduct.findOneAndUpdate(
      { _id: id },
      { pending_product_approval_status: approvalstatus },
      { new: true }
    );
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: `Error updating product, ${error.message}` });
  }
};

// 5. Delete pending product by id
const deletePendingProduct = async (req, res) => {
  let id = req.params.id;
  try {
    await PendingProduct.findByIdAndDelete(id);
    res.status(200).send('Product is deleted!');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  addPendingProduct,
  getAllPendingProducts,
  updatePendingProduct,
  getOnePendingProduct,
  deletePendingProduct
};
