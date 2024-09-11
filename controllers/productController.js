const path = require('path');
const Product = require('../modal/ProductSchema');

const addProduct = async (req, res) => {
    const { title, img, price, company, info, quantity } = req.body;

    try {
        const duplicate = await Product.findOne({ product_img: img });
        if (duplicate) {
            return res.status(409).json("The product image already exists. Try renaming.");
        }

        const newProduct = new Product({
            product_title: title,
            product_img: img,
            product_price: price,
            product_company: company,
            product_info: info,
            product_quantity: quantity
        });

        await newProduct.save();
        return res.status(200).send("Form submitted successfully.");
    } catch (err) {
        return res.status(500).send(err);
    }
};

const getAllProducts = async (req, res) => {
    try {
        let products = await Product.find({});
        console.log(products);
        res.status(200).send(products);
    } catch (err) {
        res.status(500).send(err);
    }
};

const getOneProduct = async (req, res) => {
    const id = Number(req.params.id);

    try {
        let product = await Product.findOne({ product_id: id });
        res.status(200).send(product);
    } catch (err) {
        res.status(500).send(err);
    }
};

// const updateProduct = async (req, res) => {
//     const { id } = req.params;
//     const { inCart, count, total, quantity } = req.body;

//     try {
//         // Find the existing product by product_id
//         let product = await Product.findOne({ product_id: Number(id) });

//         // Log the product for debugging
//         console.log(`PRODUCT FOUND: ${product}`);

//         // Check if the product was found
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         // Modify product fields
//         product.product_inCart = inCart;
//         product.product_total = total;
//         product.product_count = count;
//         product.product_quantity = quantity;

//         // Save the updated product
//         await product.save(); // isNew will be false here, counter will not be incremented

//         // Respond with the updated product
//         res.status(200).json(product);
//     } catch (err) {
//         res.status(500).json({ message: `Error updating product: ${err.message}` });
//     }
// };



const updateProduct = async (req, res) => {
    const id = Number(req.params.id); 
    console.log(`TYPE ${typeof(id)}`);
    const { inCart, count, total, quantity } = req.body;
    console.log(`values - inCart: ${inCart}, count: ${count}, total: ${total}, quantity: ${quantity}`);
    try {
        // Use findOneAndUpdate similar to updatePendingProduct
        let product = await Product.findOneAndUpdate(
            { product_id: id}, // Match by product_id
            { 
                product_inCart: inCart, 
                product_total: total, 
                product_count: count, 
                product_quantity: quantity 
            },
            { new: true } // Return the updated document
        );

        // Check if the product was found and updated
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: `Error updating product, ${err.message}` });
    }
};


const deleteProduct = async (req, res) => {
    const id = req.params.id;

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).send('Product is deleted!');
    } catch (err) {
        res.status(500).send(err);
    }
};

const searchProduct = async (req, res) => {
    const term = req.params.query;

    try {
        const products = await Product.find({
            product_title: { $regex: new RegExp(term, 'i') }
        });
        return res.status(200).json(products);
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    addProduct,
    getAllProducts,
    updateProduct,
    getOneProduct,
    deleteProduct,
    searchProduct
};
