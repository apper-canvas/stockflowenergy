import { toast } from 'react-toastify';

class ProductService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'product_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "sku_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "current_stock_c" } },
          { field: { Name: "low_stock_threshold_c" } },
          { field: { Name: "last_updated_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ],
        orderBy: [
          {
            fieldName: "Id",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to match UI expectations
      const transformedData = response.data.map(item => ({
        Id: item.Id,
        name: item.Name || '',
        sku: item.sku_c || '',
        price: item.price_c || 0,
        currentStock: item.current_stock_c || 0,
        lowStockThreshold: item.low_stock_threshold_c || 10,
        lastUpdated: item.last_updated_c || new Date().toISOString(),
        tags: item.Tags || '',
        owner: item.Owner || null,
        createdOn: item.CreatedOn || null,
        createdBy: item.CreatedBy || null,
        modifiedOn: item.ModifiedOn || null,
        modifiedBy: item.ModifiedBy || null
      }));

      return transformedData;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "sku_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "current_stock_c" } },
          { field: { Name: "low_stock_threshold_c" } },
          { field: { Name: "last_updated_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }

      // Transform database fields to match UI expectations
      const item = response.data;
      return {
        Id: item.Id,
        name: item.Name || '',
        sku: item.sku_c || '',
        price: item.price_c || 0,
        currentStock: item.current_stock_c || 0,
        lowStockThreshold: item.low_stock_threshold_c || 10,
        lastUpdated: item.last_updated_c || new Date().toISOString(),
        tags: item.Tags || '',
        owner: item.Owner || null,
        createdOn: item.CreatedOn || null,
        createdBy: item.CreatedBy || null,
        modifiedOn: item.ModifiedOn || null,
        modifiedBy: item.ModifiedBy || null
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching product with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(productData) {
    try {
      // Transform UI data to database field names - only Updateable fields
      const dbData = {
        Name: productData.name || '',
        sku_c: productData.sku || '',
        price_c: parseFloat(productData.price) || 0,
        current_stock_c: parseInt(productData.currentStock) || 0,
        low_stock_threshold_c: parseInt(productData.lowStockThreshold) || 10,
        last_updated_c: new Date().toISOString(),
        Tags: productData.tags || ''
      };

      const params = {
        records: [dbData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create product ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdRecord = successfulRecords[0].data;
          // Transform back to UI format
          return {
            Id: createdRecord.Id,
            name: createdRecord.Name || '',
            sku: createdRecord.sku_c || '',
            price: createdRecord.price_c || 0,
            currentStock: createdRecord.current_stock_c || 0,
            lowStockThreshold: createdRecord.low_stock_threshold_c || 10,
            lastUpdated: createdRecord.last_updated_c || new Date().toISOString()
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating product:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, productData) {
    try {
      // Transform UI data to database field names - only Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: productData.name || '',
        sku_c: productData.sku || '',
        price_c: parseFloat(productData.price) || 0,
        current_stock_c: parseInt(productData.currentStock) || 0,
        low_stock_threshold_c: parseInt(productData.lowStockThreshold) || 10,
        last_updated_c: new Date().toISOString()
      };

      if (productData.tags !== undefined) {
        dbData.Tags = productData.tags;
      }

      const params = {
        records: [dbData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update product ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedRecord = successfulUpdates[0].data;
          // Transform back to UI format
          return {
            Id: updatedRecord.Id,
            name: updatedRecord.Name || '',
            sku: updatedRecord.sku_c || '',
            price: updatedRecord.price_c || 0,
            currentStock: updatedRecord.current_stock_c || 0,
            lowStockThreshold: updatedRecord.low_stock_threshold_c || 10,
            lastUpdated: updatedRecord.last_updated_c || new Date().toISOString()
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating product:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete product ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting product:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async adjustStock(id, type, quantity, notes = "") {
    try {
      const product = await this.getById(id);
      if (!product) return null;

      const newStock = type === "add" 
        ? product.currentStock + quantity 
        : Math.max(0, product.currentStock - quantity);
      
      return await this.update(id, { 
        ...product, 
        currentStock: newStock 
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error adjusting stock:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }
}

export const productService = new ProductService();