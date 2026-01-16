import React, { useState } from 'react';
import { useProducts } from '../../context/ProductsContext';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import {
  Button,
  Card,
  Input,
  Select,
  Textarea,
  Modal,
  ModalFooter,
  Badge,
  getStatusVariant,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { productCategories } from '../../data/mockData';

/**
 * Products page with full CRUD functionality
 */
export default function Products() {
  const { user } = useAuth();
  const { currentStoreId } = useStore();
  const { getProductsByStore, addProduct, updateProduct, deleteProduct } = useProducts();
  
  // Get current store's products
  const storeId = currentStoreId || user?.storeId || 1;
  const products = getProductsByStore(storeId);
  
  // State for modals and forms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    inventory: '',
    category: 'Apparel',
    status: 'active',
    image: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Category options for select
  const categoryOptions = productCategories.map((cat) => ({
    value: cat,
    label: cat,
  }));

  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' },
  ];

  // Filter products by search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open modal for adding new product
  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      compareAtPrice: '',
      inventory: '',
      category: 'Apparel',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal for editing existing product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice?.toString() || '',
      inventory: product.inventory.toString(),
      category: product.category,
      status: product.status,
      image: product.image,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price))) {
      errors.price = 'Valid price is required';
    }
    
    if (formData.inventory === '' || isNaN(parseInt(formData.inventory))) {
      errors.inventory = 'Valid inventory count is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
      inventory: parseInt(formData.inventory),
      category: formData.category,
      status: formData.status,
      image: formData.image,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData, storeId);
    }

    setIsLoading(false);
    setIsModalOpen(false);
  };

  // Open delete confirmation
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (productToDelete) {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      deleteProduct(productToDelete.id);
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Products</h1>
          <p className="text-secondary-500 mt-1">
            Manage your store's products
          </p>
        </div>
        <Button onClick={handleAddProduct}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-secondary-500 flex items-center">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card noPadding>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-secondary-500">
                  {searchQuery ? 'No products match your search' : 'No products yet. Add your first product!'}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-secondary-800">
                          {product.name}
                        </p>
                        <p className="text-xs text-secondary-500 truncate max-w-xs">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-secondary-600">
                    {product.category}
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium text-secondary-800">
                        {product.price.toFixed(2)} TND
                      </span>
                      {product.compareAtPrice && (
                        <span className="ml-2 text-xs text-secondary-400 line-through">
                          {product.compareAtPrice.toFixed(2)} TND
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        product.inventory === 0
                          ? 'text-red-600'
                          : product.inventory < 20
                          ? 'text-yellow-600'
                          : 'text-secondary-600'
                      }`}
                    >
                      {product.inventory}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(product.status)}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Product Name */}
            <Input
              id="name"
              name="name"
              label="Product Name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
            />

            {/* Description */}
            <Textarea
              id="description"
              name="description"
              label="Description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />

            {/* Price and Compare Price */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="price"
                name="price"
                label="Price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                error={formErrors.price}
              />
              <Input
                id="compareAtPrice"
                name="compareAtPrice"
                label="Compare at Price (Optional)"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.compareAtPrice}
                onChange={handleChange}
              />
            </div>

            {/* Inventory and Category */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="inventory"
                name="inventory"
                label="Inventory"
                type="number"
                min="0"
                placeholder="0"
                value={formData.inventory}
                onChange={handleChange}
                error={formErrors.inventory}
              />
              <Select
                id="category"
                name="category"
                label="Category"
                value={formData.category}
                onChange={handleChange}
                options={categoryOptions}
              />
            </div>

            {/* Status */}
            <Select
              id="status"
              name="status"
              label="Status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
            />

            {/* Image URL */}
            <Input
              id="image"
              name="image"
              label="Image URL"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleChange}
            />

            {/* Image Preview */}
            {formData.image && (
              <div className="mt-2">
                <p className="text-sm text-secondary-500 mb-2">Preview:</p>
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <ModalFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {editingProduct ? 'Save Changes' : 'Add Product'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Product"
        size="sm"
      >
        <p className="text-secondary-600">
          Are you sure you want to delete "{productToDelete?.name}"? This action
          cannot be undone.
        </p>
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            isLoading={isLoading}
          >
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
