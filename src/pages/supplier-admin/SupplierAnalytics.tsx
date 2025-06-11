import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Eye,
  Calendar,
  Download
} from 'lucide-react';
import { mockProducts, mockOrders } from '../../data/mockData';

const SupplierAnalytics: React.FC = () => {
  const { currentUser } = useAuth();
  const [dateRange, setDateRange] = useState('30d');

  // Filter data for current supplier
  const supplierProducts = mockProducts.filter(product => 
    product.supplierId === currentUser?.organizationId
  );

  const supplierOrders = mockOrders.filter(order => 
    order.supplierId === currentUser?.organizationId
  );

  // Mock analytics data
  const analyticsData = {
    totalViews: 1250,
    totalOrders: supplierOrders.length,
    totalRevenue: supplierOrders.reduce((sum, order) => sum + order.total, 0),
    conversionRate: ((supplierOrders.length / 1250) * 100).toFixed(1),
    topProducts: [
      { name: 'Premium Office Chair', views: 320, orders: 15, revenue: 3749.85 },
      { name: 'LED Desk Lamp', views: 280, orders: 12, revenue: 719.88 },
      { name: 'Wireless Keyboard', views: 195, orders: 8, revenue: 719.92 },
      { name: 'Ergonomic Mouse', views: 165, orders: 6, revenue: 299.94 },
      { name: 'Conference Table', views: 145, orders: 2, revenue: 1799.98 }
    ],
    monthlyTrends: [
      { month: 'Jan', views: 890, orders: 12, revenue: 2850 },
      { month: 'Feb', views: 920, orders: 15, revenue: 3200 },
      { month: 'Mar', views: 1050, orders: 18, revenue: 4100 },
      { month: 'Apr', views: 1180, orders: 22, revenue: 4800 },
      { month: 'May', views: 1250, orders: 25, revenue: 5200 },
      { month: 'Jun', views: 1320, orders: 28, revenue: 5800 }
    ]
  };

  const handleExportData = () => {
    // Create CSV content
    const csvContent = `Product Name,Views,Orders,Revenue
${analyticsData.topProducts.map(product => 
  `"${product.name}",${product.views},${product.orders},${product.revenue}`
).join('\n')}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'supplier_analytics.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">Track your catalog performance and insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-teal-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={handleExportData}
            className="inline-flex items-center px-4 py-2 border border-teal-300 rounded-md text-sm font-medium text-teal-700 bg-white hover:bg-teal-50"
          >
            <Download size={16} className="mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-teal-100 text-teal-600">
              <Eye size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-xl font-semibold text-gray-900">{analyticsData.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <Package size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-xl font-semibold text-gray-900">{analyticsData.totalOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 text-green-600">
              <TrendingUp size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-xl font-semibold text-gray-900">${analyticsData.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-purple-100 text-purple-600">
              <BarChart3 size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
              <p className="text-xl font-semibold text-gray-900">{analyticsData.conversionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Trends</h3>
          <div className="space-y-4">
            {analyticsData.monthlyTrends.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700 w-8">{month.month}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>Views: {month.views}</span>
                      <span>•</span>
                      <span>Orders: {month.orders}</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-teal-600 h-2 rounded-full"
                        style={{ width: `${(month.views / 1400) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">${month.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Products</h3>
          <div className="space-y-4">
            {analyticsData.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                    <span className="text-sm text-gray-500">{product.views} views</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                    <span>{product.orders} orders</span>
                    <span className="font-medium text-gray-900">${product.revenue.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-teal-600 h-1.5 rounded-full"
                      style={{ width: `${(product.views / 320) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics Table */}
      <div className="bg-white rounded-lg shadow-sm border border-teal-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-teal-100">
          <h3 className="text-lg font-medium text-gray-900">Product Performance Details</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-teal-200">
            <thead className="bg-teal-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversion Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Order Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-teal-100">
              {analyticsData.topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-teal-25">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0 bg-teal-100 rounded-md flex items-center justify-center">
                        <Package size={16} className="text-teal-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {((product.orders / product.views) * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    ${product.revenue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${(product.revenue / product.orders).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <TrendingUp size={20} className="text-teal-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">Performance Insights</h3>
            <div className="mt-2 text-sm text-gray-600">
              <ul className="list-disc pl-5 space-y-1">
                <li>Your conversion rate of {analyticsData.conversionRate}% is above the industry average of 2.5%</li>
                <li>Premium Office Chair is your top performer with the highest revenue per view</li>
                <li>Consider promoting LED Desk Lamp as it has high views but lower conversion</li>
                <li>Monthly trends show consistent growth in both views and orders</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierAnalytics;