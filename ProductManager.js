const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, '[]');
        }
    }

    addProduct(product) {
        const products = this.getProducts();
        product.id = this.generateID(products);
        products.push(product);
        this._saveProducts(products);
        return products;
    }

    getProducts() {
        const productsData = fs.readFileSync(this.path);
        return JSON.parse(productsData);
    }

    getProductById(productId) {
        const products = this.getProducts();
        return products.find(product => product.id === productId);
    }

    updateProduct(productId, updatedFields) {
        const products = this.getProducts();
        const productIndex = products.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            products[productIndex] = { ...products[productIndex], ...updatedFields };
            this._saveProducts(products);
        }
        return products;
    }

    deleteProduct(productId) {
        const products = this.getProducts();
        const updatedProducts = products.filter(product => product.id !== productId);
        this._saveProducts(updatedProducts);
        return updatedProducts;
    }

    generateID(products) {
        return products.length > 0 ? Math.max(...products.map(product => product.id)) + 1 : 1;
    }

    _saveProducts(products) {
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
    }
}

// Ejemplo de uso:

const manager = new ProductManager("productos.json");

const newProduct = {
    title: "SKU1",
    description: "Descripción DE SKU1",
    price: 100,
    thumbnail: "./imagen.jpg",
    code: "SKU201",
    stock: 25
};
const updatedProducts = manager.addProduct(newProduct);
console.log("Todos los productos después de agregar uno:", updatedProducts);

const allProducts = manager.getProducts();
console.log("Todos los productos:", allProducts);

const productIdToGet = 1;
const product = manager.getProductById(productIdToGet);
console.log(`Producto con ID ${productIdToGet}:`, product);

const productIdToUpdate = 1;
const updatedFields = {
    title: "Producto Modificado",
    price: 129.99
};
manager.updateProduct(productIdToUpdate, updatedFields);

const productIdToDelete = 1;
manager.deleteProduct(productIdToDelete);
