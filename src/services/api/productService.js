import mockData from "@/services/mockData/products.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProductService {
  constructor() {
    this.products = [...mockData];
  }

  async getAll() {
    await delay(300);
    return [...this.products];
  }

  async getById(id) {
    await delay(200);
    const product = this.products.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  }

  async create(productData) {
    await delay(400);
    
    // Find the highest existing Id and add 1
    const maxId = this.products.reduce((max, product) => 
      Math.max(max, product.Id), 0
    );
    
    const newProduct = {
      ...productData,
      Id: maxId + 1,
      lastUpdated: new Date().toISOString()
    };
    
    this.products.push(newProduct);
    return { ...newProduct };
  }

  async update(id, productData) {
    await delay(350);
    
    const index = this.products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    const updatedProduct = {
      ...this.products[index],
      ...productData,
      Id: parseInt(id),
      lastUpdated: new Date().toISOString()
    };
    
    this.products[index] = updatedProduct;
    return { ...updatedProduct };
  }

  async delete(id) {
    await delay(250);
    
    const index = this.products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    const deletedProduct = this.products.splice(index, 1)[0];
    return { ...deletedProduct };
  }

  async adjustStock(id, type, quantity, notes = "") {
    await delay(300);
    
    const product = await this.getById(id);
    const newStock = type === "add" 
      ? product.currentStock + quantity 
      : Math.max(0, product.currentStock - quantity);
    
    return await this.update(id, { 
      ...product, 
      currentStock: newStock 
    });
  }
}

export const productService = new ProductService();