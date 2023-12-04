const fs = require('fs').promises;

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async getProducts() {
        try {
            const productsData = await fs.readFile(this.path);
            return JSON.parse(productsData);
        } catch (error) {
            console.error('Error al leer el archivo de productos:', error.message);
            return [];
        }
    }

    async addProduct(product) {
        try {
            const products = await this.getProducts();
            product.id = this.generateID(products);
            products.push(product);
            await this._saveProducts(products);
            return products;
        } catch (error) {
            console.error('Error al agregar un producto:', error.message);
            throw error;
        }
    }

    async updateProduct(productId, updatedFields) {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex(product => product.id === productId);
            if (productIndex !== -1) {
                products[productIndex] = { ...products[productIndex], ...updatedFields };
                await this._saveProducts(products);
            }
            return products;
        } catch (error) {
            console.error('Error al actualizar un producto:', error.message);
            throw error;
        }
    }

    async deleteProduct(productId) {
        try {
            const products = await this.getProducts();
            const updatedProducts = products.filter(product => product.id !== productId);
            await this._saveProducts(updatedProducts);
            return updatedProducts;
        } catch (error) {
            console.error('Error al eliminar un producto:', error.message);
            throw error;
        }
    }

    generateID(products) {
        return products.length > 0 ? Math.max(...products.map(product => product.id)) + 1 : 1;
    }

    async _saveProducts(products) {
        try {
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        } catch (error) {
            console.error('Error al guardar los productos:', error.message);
            throw error;
        }
    }
}

module.exports = ProductManager;
