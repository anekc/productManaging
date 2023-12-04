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
    }

    deleteProduct(productId) {
        const products = this.getProducts();
        const updatedProducts = products.filter(product => product.id !== productId);
        this._saveProducts(updatedProducts);
    }

    generateID(products) {
        return products.length > 0 ? Math.max(...products.map(product => product.id)) + 1 : 1;
    }

    _saveProducts(products) {
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
    }
}

// Ejemplo de uso:

// Crear una instancia de ProductManager con un archivo de datos llamado "productos.json"
const manager = new ProductManager("productos.json");

// Agregar un producto
const newProduct = {
    title: "SKU1",
    description: "Descripción DE SKU1",
    price: 100,
    thumbnail: "./imagen.jpg",
    code: "SKU201",
    stock: 25
};
manager.addProduct(newProduct);

// Obtener todos los productos
const allProducts = manager.getProducts();
console.log("Todos los productos:", allProducts);

// Obtener un producto por su ID
const productIdToGet = 1; // Suponiendo que el ID existe
const product = manager.getProductById(productIdToGet);
console.log(Producto con ID ${productIdToGet}:, product);

// Actualizar un producto por su ID
const productIdToUpdate = 1; // Suponiendo que el ID existe
const updatedFields = {
    title: "Producto Modificado",
    price: 129.99
};
manager.updateProduct(productIdToUpdate, updatedFields);

// Eliminar un producto por su ID
const productIdToDelete = 1; // Suponiendo que el ID existe
manager.deleteProduct(productIdToDelete);