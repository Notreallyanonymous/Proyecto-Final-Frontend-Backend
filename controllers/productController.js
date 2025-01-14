const Product = require("../models/Product");
// const jwt = require('jsonwebtoken');

// crear nuevos productos
exports.create = async (req, res) => {
    const { name, category, price, coin, stock, image } = req.body;

    try {
        const existingProduct = await Product.findOne({ name })
        if (existingProduct) {
            return res.status(400).json({ errorMessage: 'Ya existe un producto con ese nombre' });
        }

        const newProduct = new Product({ name, category, price, coin, stock, image });
        await newProduct.save();
        return res.status(201).json({ message: 'Nuevo producto registrado', status: 201 });
    } catch (err) {
        return res.status(400).json({ errorMessage: `Error registrando productos, ${err.message}` });
    }
}

// actualizar productos
exports.update = async (req, res) => {
    const { name, category, price, stock } = req.body;
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ errorMessage: 'El Id del producto es requerido' });
    }

    try {
        const existingProduct = await Product.findOne({ _id: id })
        if (!existingProduct) {
            return res.status(404).json({ errorMessage: 'El producto que intentas editar no existe' });
        }

        existingProduct.name = name || existingProduct.name;
        existingProduct.category = category || existingProduct.category;
        existingProduct.price = price || existingProduct.price;
        existingProduct.stock = stock || existingProduct.stock;

        await existingProduct.save();

        return res.status(200).json({ message: 'Producto actualizado con éxito', status: 200, data: existingProduct });
    } catch (err) {
        return res.status(400).json({ errorMessage: `Error actualizando el producto, ${err.message}` });
    }
}

// eliminar productos
exports.delete = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ errorMessage: 'El Id del producto es requerido' });
    }

    try {
        const product = await Product.findByIdAndDelete(id)
        if (!product) {
            return res.status(404).json({ errorMessage: 'El producto que intentas eliminar no existe' });
        }

        return res.status(200).json({ message: 'Producto eliminado con éxito', status: 200});
    } catch (err) {
        return res.status(400).json({ errorMessage: `Error actualizando el producto, ${err.message}` });
    }
}

//cargar todos los productos
exports.getAll = async (req, res) => {
    try {
        const products = await Product.find()
        return res.status(201).json({ data: products, status: 201 });
    } catch (error) {
        return res.status(400).json({ message: `Error al cargar todos los productos, ${err.message}` });
    }
}

//cargar un productos
exports.getOne = async (req, res) => {
    const { id } = req.params;

    try {
        const existingProduct = await Product.findById(id)
        if (!existingProduct) {
            return res.status(404).json({ errorMessage: 'El producto buscado no existe' });
        }

        return res.status(201).json({ message: 'Producto encontrado con éxito', status: 201, data: existingProduct });
    } catch (error) {
        return res.status(400).json({ errorMessage: `Error al cargar todos los productos, ${err.message}` });
    }
}