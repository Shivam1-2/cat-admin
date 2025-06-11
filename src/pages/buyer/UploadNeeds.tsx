import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Upload, 
  Download, 
  FileText, 
  Check, 
  X, 
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';

const UploadNeeds: React.FC = () => {
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
      filename: 'office_supplies_q3.csv',
      uploadDate: '2023-09-15T10:30:00Z',
      status: 'approved',
      totalRows: 25,
      successRows: 25,
      errorRows: 0,
      uploadedBy: currentUser?.name,
      approvedBy: 'Sarah Client',
      approvalDate: '2023-09-16T09:15:00Z'
    },
    {
      id: '2',
      filename: 'marketing_materials.xlsx',
      uploadDate: '2023-09-10T14:20:00Z',
      status: 'pending',
      totalRows: 15,
      successRows: 15,
      errorRows: 0,
      uploadedBy: currentUser?.name
    },
    {
      id: '3',
      filename: 'it_equipment_needs.csv',
      uploadDate: '2023-09-05T09:15:00Z',
      status: 'rejected',
      totalRows: 30,
      successRows: 0,
      errorRows: 30,
      uploadedBy: currentUser?.name,
      rejectedBy: 'Sarah Client',
      rejectionReason: 'Incomplete product specifications'
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
            totalRows: 20,
            successRows: 18,
            errorRows: 2,
            errors: [
              { row: 8, error: 'Missing required field: description' },
              { row: 15, error: 'Invalid price format: "TBD"' }
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
    const csvContent = `product_name,description,category,estimated_price,internal_id,priority,department
"Ergonomic Office Chairs","Adjustable height office chairs with lumbar support","Furniture",250.00,"CHAIR-001","High","Operations"
"LED Desk Lamps","Adjustable LED desk lamps with USB charging","Lighting",75.00,"LAMP-001","Medium","Operations"
"Wireless Keyboards","Bluetooth keyboards for remote work","Electronics",90.00,"KB-001","Medium","IT"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'internal_needs_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      case 'rejected':
        return <X size={16} className="text-red-600" />;
      default:
        return <FileText size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload Internal Needs</h1>
          <p className="text-sm text-gray-600 mt-1">Submit your product requirements for approval</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Product Requirements</h3>
        
        <div className="space-y-6">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-emerald-300 rounded-lg p-8 text-center">
            <Upload size={48} className="mx-auto text-emerald-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Upload your requirements file</h4>
            <p className="text-sm text-gray-600 mb-4">
              Supported formats: CSV, XLSX (Max file size: 5MB)
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
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
            >
              Choose File
            </label>
            
            {uploadFile && (
              <div className="mt-4 p-3 bg-emerald-50 rounded-md">
                <div className="flex items-center justify-center">
                  <FileText size={20} className="text-emerald-600 mr-2" />
                  <span className="text-sm font-medium text-emerald-800">{uploadFile.name}</span>
                  <button
                    onClick={() => setUploadFile(null)}
                    className="ml-2 text-emerald-600 hover:text-emerald-800"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="bg-emerald-50 p-4 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-emerald-800">Uploading...</span>
                <span className="text-sm text-emerald-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-emerald-200 rounded-full h-2">
                <div 
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center px-4 py-2 border border-emerald-300 rounded-md text-sm font-medium text-emerald-700 bg-white hover:bg-emerald-50"
            >
              <Download size={16} className="mr-2" />
              Download Template
            </button>
            
            <button
              onClick={handleUpload}
              disabled={!uploadFile || isUploading}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={16} className="mr-2" />
              {isUploading ? 'Uploading...' : 'Submit for Approval'}
            </button>
          </div>
        </div>
      </div>

      {/* Upload Results */}
      {showResults && uploadResults && (
        <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex items-center">
                <FileText size={20} className="text-blue-600 mr-2" />
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
                  <p className="text-sm font-medium text-green-800">Processed</p>
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

          <div className="mt-4 p-4 bg-emerald-50 rounded-md">
            <p className="text-sm text-emerald-800">
              Your requirements have been submitted for approval. You'll be notified once they're reviewed by your Client Admin.
            </p>
          </div>
        </div>
      )}

      {/* Upload History */}
      <div className="bg-white rounded-lg shadow-sm border border-emerald-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-emerald-100">
          <h3 className="text-lg font-medium text-gray-900">Upload History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-emerald-200">
            <thead className="bg-emerald-50">
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
                  Reviewer
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-emerald-100">
              {uploadHistory.map((upload) => (
                <tr key={upload.id} className="hover:bg-emerald-25">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText size={20} className="text-emerald-600 mr-3" />
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
                      <span className="text-green-600">{upload.successRows} processed</span>
                      {upload.errorRows > 0 && (
                        <span className="text-red-600 ml-2">{upload.errorRows} errors</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      Total: {upload.totalRows} items
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(upload.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {upload.status === 'approved' && upload.approvedBy && (
                      <div>
                        <div className="text-green-600">{upload.approvedBy}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(upload.approvalDate!).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                    {upload.status === 'rejected' && upload.rejectedBy && (
                      <div>
                        <div className="text-red-600">{upload.rejectedBy}</div>
                        <div className="text-xs text-red-400">{upload.rejectionReason}</div>
                      </div>
                    )}
                    {upload.status === 'pending' && (
                      <span className="text-yellow-600">Pending Review</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FileText size={20} className="text-emerald-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">File Requirements</h3>
            <div className="mt-2 text-sm text-gray-600">
              <p className="mb-2">Your upload file must include the following columns:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>product_name</strong> - Name of the product you need (required)</li>
                <li><strong>description</strong> - Detailed description of requirements (required)</li>
                <li><strong>category</strong> - Product category (required)</li>
                <li><strong>estimated_price</strong> - Your estimated budget per unit (optional)</li>
                <li><strong>internal_id</strong> - Your internal reference ID (optional)</li>
                <li><strong>priority</strong> - Priority level: High, Medium, Low (optional)</li>
                <li><strong>department</strong> - Requesting department (optional)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadNeeds;