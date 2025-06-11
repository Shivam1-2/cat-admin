import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Package,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';
import { format, parseISO, isBefore } from 'date-fns';

const MyCart: React.FC = () => {
  const { currentUser } = useAuth();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  
  // Mock cart items (would come from cart context/state)
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Premium Office Chair',
      description: 'Ergonomic office chair with lumbar support and adjustable height.',
      supplierName: 'Supply Solutions',
      supplierId: '3',
      price: 249.99,
      quantity: 2,
      expiryDate: '2023-09-30T00:00:00Z',
      category: 'Furniture',
      sku: 'CHAIR-001'
    },
    {
      id: '2',
      name: 'LED Desk Lamp',
      description: 'Adjustable LED desk lamp with multiple brightness levels and color temperatures.',
      supplierName: 'Supply Solutions',
      supplierId: '3',
      price: 59.99,
      quantity: 3,
      expiryDate: '2023-11-15T00:00:00Z',
      category: 'Lighting',
      sku: 'LAMP-002'
    },
    {
      id: '3',
      name: 'Wireless Keyboard',
      description: 'Bluetooth keyboard with backlit keys and multi-device connectivity.',
      supplierName: 'Tech Providers',
      supplierId: '5',
      price: 89.99,
      quantity: 1,
      expiryDate: '2023-10-05T00:00:00Z',
      category: 'Electronics',
      sku: 'KEY-003'
    }
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = parseISO(expiryDate);
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    return isBefore(expiry, sevenDaysFromNow);
  };

  const isExpired = (expiryDate: string) => {
    return isBefore(parseISO(expiryDate), new Date());
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmitOrder = () => {
    console.log('Submitting order:', {
      items: cartItems,
      subtotal,
      totalItems,
      notes: orderNotes,
      buyer: currentUser
    });
    
    // Clear cart and close modal
    setCartItems([]);
    setShowSubmitModal(false);
    setOrderNotes('');
  };

  // Group items by supplier
  const itemsBySupplier = cartItems.reduce((groups, item) => {
    const supplier = item.supplierName;
    if (!groups[supplier]) {
      groups[supplier] = [];
    }
    groups[supplier].push(item);
    return groups;
  }, {} as Record<string, typeof cartItems>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Cart</h1>
          <p className="text-sm text-gray-600 mt-1">Review and submit your material list</p>
        </div>
        {cartItems.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              {totalItems} items
            </span>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-900 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-8 text-center">
          <ShoppingCart size={48} className="mx-auto text-emerald-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
          <p className="mt-1 text-sm text-gray-500">
            Browse catalogs to add products to your cart.
          </p>
          <button 
            onClick={() => window.location.href = '/browse'}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Browse Catalogs
          </button>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
                  <Package size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Items</p>
                  <p className="text-xl font-semibold text-gray-900">{totalItems}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <ShoppingCart size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Suppliers</p>
                  <p className="text-xl font-semibold text-gray-900">{Object.keys(itemsBySupplier).length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <Check size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Subtotal</p>
                  <p className="text-xl font-semibold text-gray-900">${subtotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Items by Supplier */}
          <div className="space-y-6">
            {Object.entries(itemsBySupplier).map(([supplierName, items]) => (
              <div key={supplierName} className="bg-white rounded-lg shadow-sm border border-emerald-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50">
                  <h3 className="text-lg font-medium text-gray-900">{supplierName}</h3>
                  <p className="text-sm text-gray-600">
                    {items.length} product{items.length !== 1 ? 's' : ''} • 
                    ${items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </p>
                </div>
                
                <div className="divide-y divide-emerald-100">
                  {items.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="h-16 w-16 bg-emerald-100 rounded-md flex items-center justify-center">
                            <Package size={24} className="text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-lg font-medium text-gray-900">{item.name}</h4>
                              {isExpired(item.expiryDate) && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Expired
                                </span>
                              )}
                              {isExpiringSoon(item.expiryDate) && !isExpired(item.expiryDate) && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Expiring Soon
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                              <span>SKU: {item.sku}</span>
                              <span>•</span>
                              <span>{item.category}</span>
                              <span>•</span>
                              <span>Expires: {format(parseISO(item.expiryDate), 'MMM d, yyyy')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">per unit</p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="text-lg font-medium w-12 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">total</p>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-900 p-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      
                      {(isExpired(item.expiryDate) || isExpiringSoon(item.expiryDate)) && (
                        <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <AlertTriangle className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-yellow-800">
                                {isExpired(item.expiryDate) 
                                  ? 'This product price has expired. Contact supplier for current pricing.'
                                  : 'This product price expires soon. Submit your order to lock in current pricing.'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
                <p className="text-sm text-gray-600">
                  {totalItems} items from {Object.keys(itemsBySupplier).length} supplier{Object.keys(itemsBySupplier).length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">${subtotal.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Subtotal</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md text-lg font-medium flex items-center"
              >
                <Check size={20} className="mr-2" />
                Submit Material List
              </button>
            </div>
          </div>
        </>
      )}

      {/* Submit Order Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-lg w-full mx-auto p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowSubmitModal(false)}
              >
                <span className="sr-only">Close</span>
                <X size={24} />
              </button>
            </div>
            
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Submit Material List
              </h3>
              
              <div className="mt-4">
                <div className="bg-emerald-50 p-4 rounded-md mb-4">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">Order Summary</div>
                    <div className="text-gray-600 mt-1">
                      {totalItems} items • ${subtotal.toFixed(2)} total
                    </div>
                    <div className="text-gray-600">
                      From {Object.keys(itemsBySupplier).length} supplier{Object.keys(itemsBySupplier).length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="order-notes" className="block text-sm font-medium text-gray-700">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="order-notes"
                    rows={3}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="Add any special instructions or notes for this order..."
                  />
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    Your material list will be submitted for approval. You'll be notified once it's processed.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:col-start-2 sm:text-sm"
                onClick={handleSubmitOrder}
              >
                <Check size={16} className="mr-2" />
                Submit Order
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => setShowSubmitModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCart;