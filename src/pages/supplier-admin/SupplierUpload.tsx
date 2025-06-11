import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Upload, 
  Download, 
  FileText, 
  Check, 
  X, 
  AlertTriangle,
  Package,
  Clock
} from 'lucide-react';

const SupplierUpload: React.FC = () => {
  const { currentUser } = useAuth();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  // Mock upload history
  const uploadHistory = [
    {
      id: '1',
      filename: 'products_batch_001.csv',
      uploadDate: '2023-09-15T10:30:00Z',
      status: 'completed',
      totalRows: 150,
      successRows: 148,
      errorRows: 2,
      uploadedBy: currentUser?.name
    },
    {
      id: '2',
      filename: 'electronics_catalog.xlsx',
      uploadDate: '2023-09-10T14:20:00Z',
      status: 'completed',
      totalRows: 75,
      successRows: 75,
      errorRows: 0,
      uploadedBy: currentUser?.name
    },
    {
      id: '3',
      filename: 'furniture_products.csv',
      uploadDate: '2023-09-05T09:15:00Z',
      status: 'failed',
      totalRows: 200,
      successRows: 0,
      errorRows: 200,
      uploadedBy: currentUser?.name
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Mock upload results
          setUploadResults({
            filename: uploadFile.name,
            totalRows: 120,
            successRows: 115,
            errorRows: 5,
            errors: [
              { row: 15, error: 'Invalid price format: "abc"' },
              { row: 32, error: 'Missing required field: description' },
              { row: 67, error: 'Invalid date format: "2023-13-45"' },
              { row: 89, error: 'Price must be greater than 0' },
              { row: 103, error: 'Product name exceeds maximum length' }
            ]
          });
          setShowResults(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDownloadTemplate = () => {
    // Create a sample CSV content
    const csvContent = `name,description,category,price,effective_date,expiry_date,image_url
"Premium Office Chair","Ergonomic office chair with lumbar support","Furniture",249.99,"2023-09-01","2024-09-01","https://example.com/chair.jpg"
"LED Desk Lamp","Adjustable LED desk lamp with multiple brightness levels","Lighting",59.99,"2023-09-01","2024-06-01","https://example.com/lamp.jpg"
"Wireless Keyboard","Bluetooth keyboard with backlit keys","Electronics",89.99,"2023-09-01","2024-03-01","https://example.com/keyboard.jpg"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_upload_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check size={16} className="text-green-600" />;
      case 'failed':
        return <X size={16} className="text-red-600" />;
      case 'processing':
        return <Clock size={16} className="text-yellow-600" />;
      default:
        return <FileText size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload Products</h1>
          <p className="text-sm text-gray-600 mt-1">Bulk upload products to your catalog</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Product Catalog</h3>
        
        <div className="space-y-6">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-teal-300 rounded-lg p-8 text-center">
            <Upload size={48} className="mx-auto text-teal-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Upload your product file</h4>
            <p className="text-sm text-gray-600 mb-4">
              Supported formats: CSV, XLSX (Max file size: 10MB)
            </p>
            
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 cursor-pointer"
            >
              Choose File
            </label>
            
            {uploadFile && (
              <div className="mt-4 p-3 bg-teal-50 rounded-md">
                <div className="flex items-center justify-center">
                  <FileText size={20} className="text-teal-600 mr-2" />
                  <span className="text-sm font-medium text-teal-800">{uploadFile.name}</span>
                  <button
                    onClick={() => setUploadFile(null)}
                    className="ml-2 text-teal-600 hover:text-teal-800"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="bg-teal-50 p-4 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-teal-800">Uploading...</span>
                <span className="text-sm text-teal-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-teal-200 rounded-full h-2">
                <div 
                  className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center px-4 py-2 border border-teal-300 rounded-md text-sm font-medium text-teal-700 bg-white hover:bg-teal-50"
            >
              <Download size={16} className="mr-2" />
              Download Template
            </button>
            
            <button
              onClick={handleUpload}
              disabled={!uploadFile || isUploading}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={16} className="mr-2" />
              {isUploading ? 'Uploading...' : 'Upload Products'}
            </button>
          </div>
        </div>
      </div>

      {/* Upload Results */}
      {showResults && uploadResults && (
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex items-center">
                <Package size={20} className="text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Total Rows</p>
                  <p className="text-xl font-semibold text-blue-900">{uploadResults.totalRows}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex items-center">
                <Check size={20} className="text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">Successful</p>
                  <p className="text-xl font-semibold text-green-900">{uploadResults.successRows}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-md">
              <div className="flex items-center">
                <X size={20} className="text-red-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-red-800">Errors</p>
                  <p className="text-xl font-semibold text-red-900">{uploadResults.errorRows}</p>
                </div>
              </div>
            </div>
          </div>

          {uploadResults.errors.length > 0 && (
            <div className="border-l-4 border-red-400 bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Errors Found</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {uploadResults.errors.map((error: any, index: number) => (
                        <li key={index}>
                          Row {error.row}: {error.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload History */}
      <div className="bg-white rounded-lg shadow-sm border border-teal-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-teal-100">
          <h3 className="text-lg font-medium text-gray-900">Upload History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-teal-200">
            <thead className="bg-teal-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Results
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-teal-100">
              {uploadHistory.map((upload) => (
                <tr key={upload.id} className="hover:bg-teal-25">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText size={20} className="text-teal-600 mr-3" />
                      <span className="text-sm font-medium text-gray-900">{upload.filename}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(upload.status)
                    }`}>
                      {getStatusIcon(upload.status)}
                      <span className="ml-1">{upload.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <span className="text-green-600">{upload.successRows} success</span>
                      {upload.errorRows > 0 && (
                        <span className="text-red-600 ml-2">{upload.errorRows} errors</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      Total: {upload.totalRows} rows
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(upload.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {upload.uploadedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FileText size={20} className="text-teal-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">File Requirements</h3>
            <div className="mt-2 text-sm text-gray-600">
              <p className="mb-2">Your upload file must include the following columns:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>name</strong> - Product name (required)</li>
                <li><strong>description</strong> - Product description (required)</li>
                <li><strong>category</strong> - Product category (required)</li>
                <li><strong>price</strong> - Product price in decimal format (required)</li>
                <li><strong>effective_date</strong> - Date when price becomes effective (YYYY-MM-DD)</li>
                <li><strong>expiry_date</strong> - Date when price expires (YYYY-MM-DD)</li>
                <li><strong>image_url</strong> - URL to product image (optional)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierUpload;