import { User } from '../context/AuthContext';

// Mock users data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@example.com',
    role: 'master_admin',
    organizationId: '1',
    organizationName: 'Master Organization',
    lastLogin: {
      timestamp: '2023-09-15T08:30:45Z',
      ip: '192.168.1.105'
    },
    status: 'active'
  },
  {
    id: '2',
    name: 'Sarah Client',
    email: 'sarah@client.com',
    role: 'client_admin',
    organizationId: '2',
    organizationName: 'Acme Corp',
    lastLogin: {
      timestamp: '2023-09-14T14:22:10Z',
      ip: '192.168.1.120'
    },
    status: 'active'
  },
  {
    id: '3',
    name: 'Mike Supplier',
    email: 'mike@supplier.com',
    role: 'supplier_admin',
    organizationId: '3',
    organizationName: 'Supply Solutions',
    lastLogin: {
      timestamp: '2023-09-13T11:45:32Z',
      ip: '192.168.1.135'
    },
    status: 'active'
  },
  {
    id: '4',
    name: 'Jessica User',
    email: 'jessica@client.com',
    role: 'client_user',
    organizationId: '2',
    organizationName: 'Acme Corp',
    lastLogin: {
      timestamp: '2023-09-12T09:15:20Z',
      ip: '192.168.1.140'
    },
    status: 'active'
  },
  {
    id: '5',
    name: 'Tom Supplier',
    email: 'tom@supplier.com',
    role: 'supplier_user',
    organizationId: '3',
    organizationName: 'Supply Solutions',
    lastLogin: {
      timestamp: '2023-09-10T16:30:05Z',
      ip: '192.168.1.155'
    },
    status: 'inactive'
  },
  {
    id: '6',
    name: 'Alex New',
    email: 'alex@example.com',
    role: 'client_user',
    organizationId: '4',
    organizationName: 'Global Industries',
    lastLogin: {
      timestamp: '2023-09-05T10:20:15Z',
      ip: '192.168.1.160'
    },
    status: 'pending'
  },
  {
    id: '7',
    name: 'Emma Requestor',
    email: 'emma@client.com',
    role: 'requestor',
    organizationId: '2',
    organizationName: 'Acme Corp',
    lastLogin: {
      timestamp: '2023-09-16T13:45:20Z',
      ip: '192.168.1.175'
    },
    status: 'active'
  }
];

// Mock organizations data
export interface Organization {
  id: string;
  name: string;
  type: 'client' | 'supplier';
  contactEmail: string;
  contactPhone: string;
  address: string;
  createdAt: string;
  status: 'active' | 'archived';
  defaultVisibility: boolean;
}

export const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Master Organization',
    type: 'client',
    contactEmail: 'contact@master.com',
    contactPhone: '+1 (555) 123-4567',
    address: '123 Admin St, New York, NY 10001',
    createdAt: '2023-01-01T00:00:00Z',
    status: 'active',
    defaultVisibility: true
  },
  {
    id: '2',
    name: 'Acme Corp',
    type: 'client',
    contactEmail: 'contact@acmecorp.com',
    contactPhone: '+1 (555) 234-5678',
    address: '456 Client Ave, Los Angeles, CA 90001',
    createdAt: '2023-02-15T00:00:00Z',
    status: 'active',
    defaultVisibility: true
  },
  {
    id: '3',
    name: 'Supply Solutions',
    type: 'supplier',
    contactEmail: 'contact@supplysolutions.com',
    contactPhone: '+1 (555) 345-6789',
    address: '789 Supplier Blvd, Chicago, IL 60007',
    createdAt: '2023-03-10T00:00:00Z',
    status: 'active',
    defaultVisibility: true
  },
  {
    id: '4',
    name: 'Global Industries',
    type: 'client',
    contactEmail: 'contact@globalindustries.com',
    contactPhone: '+1 (555) 456-7890',
    address: '101 Global St, Houston, TX 77001',
    createdAt: '2023-04-20T00:00:00Z',
    status: 'active',
    defaultVisibility: true
  },
  {
    id: '5',
    name: 'Tech Providers',
    type: 'supplier',
    contactEmail: 'contact@techproviders.com',
    contactPhone: '+1 (555) 567-8901',
    address: '202 Tech Dr, San Francisco, CA 94105',
    createdAt: '2023-05-05T00:00:00Z',
    status: 'active',
    defaultVisibility: false
  },
  {
    id: '6',
    name: 'Factory Direct',
    type: 'supplier',
    contactEmail: 'contact@factorydirect.com',
    contactPhone: '+1 (555) 678-9012',
    address: '303 Factory Ln, Detroit, MI 48127',
    createdAt: '2023-06-12T00:00:00Z',
    status: 'archived',
    defaultVisibility: false
  }
];

// Mock visibility matrix data
export interface VisibilityRelation {
  supplierId: string;
  clientId: string;
  isVisible: boolean;
  lastUpdated: string;
  updatedBy: string;
  updaterIp: string;
}

export const mockVisibilityMatrix: VisibilityRelation[] = [
  { supplierId: '3', clientId: '2', isVisible: true, lastUpdated: '2023-07-10T09:15:30Z', updatedBy: 'John Admin', updaterIp: '192.168.1.105' },
  { supplierId: '3', clientId: '4', isVisible: true, lastUpdated: '2023-07-11T10:20:45Z', updatedBy: 'John Admin', updaterIp: '192.168.1.105' },
  { supplierId: '5', clientId: '2', isVisible: true, lastUpdated: '2023-07-12T11:30:15Z', updatedBy: 'John Admin', updaterIp: '192.168.1.105' },
  { supplierId: '5', clientId: '4', isVisible: false, lastUpdated: '2023-07-13T14:45:20Z', updatedBy: 'John Admin', updaterIp: '192.168.1.105' },
  { supplierId: '6', clientId: '2', isVisible: false, lastUpdated: '2023-07-14T16:25:10Z', updatedBy: 'John Admin', updaterIp: '192.168.1.105' },
  { supplierId: '6', clientId: '4', isVisible: false, lastUpdated: '2023-07-15T09:10:05Z', updatedBy: 'John Admin', updaterIp: '192.168.1.105' },
];

// Mock products data
export interface Product {
  id: string;
  name: string;
  sku: string;
  supplierId: string;
  supplierName: string;
  description: string;
  category: string;
  price: {
    current: number;
    proposed?: number;
    approvalStatus?: 'pending' | 'approved' | 'rejected';
    expiryDate: string;
  };
  status: 'active' | 'archived' | 'pending_approval';
  createdAt: string;
  lastModified: string;
  modificationHistory: {
    timestamp: string;
    user: string;
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Office Chair',
    sku: 'CHAIR-001',
    supplierId: '3',
    supplierName: 'Supply Solutions',
    description: 'Ergonomic office chair with lumbar support and adjustable height.',
    category: 'Furniture',
    price: {
      current: 249.99,
      proposed: 269.99,
      approvalStatus: 'pending',
      expiryDate: '2023-09-30T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-05-15T00:00:00Z',
    lastModified: '2023-09-10T14:30:00Z',
    modificationHistory: [
      {
        timestamp: '2023-09-10T14:30:00Z',
        user: 'Mike Supplier',
        field: 'price',
        oldValue: '249.99',
        newValue: '269.99'
      }
    ]
  },
  {
    id: '2',
    name: 'LED Desk Lamp',
    sku: 'LAMP-002',
    supplierId: '3',
    supplierName: 'Supply Solutions',
    description: 'Adjustable LED desk lamp with multiple brightness levels and color temperatures.',
    category: 'Lighting',
    price: {
      current: 59.99,
      expiryDate: '2023-11-15T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-06-20T00:00:00Z',
    lastModified: '2023-06-20T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '3',
    name: 'Wireless Keyboard',
    sku: 'KEY-003',
    supplierId: '5',
    supplierName: 'Tech Providers',
    description: 'Bluetooth keyboard with backlit keys and multi-device connectivity.',
    category: 'Electronics',
    price: {
      current: 89.99,
      proposed: 79.99,
      approvalStatus: 'pending',
      expiryDate: '2023-10-05T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-07-05T00:00:00Z',
    lastModified: '2023-09-12T10:15:00Z',
    modificationHistory: [
      {
        timestamp: '2023-09-12T10:15:00Z',
        user: 'Tech Support',
        field: 'price',
        oldValue: '89.99',
        newValue: '79.99'
      }
    ]
  },
  {
    id: '4',
    name: 'Ergonomic Mouse',
    sku: 'MOUSE-004',
    supplierId: '5',
    supplierName: 'Tech Providers',
    description: 'Vertical ergonomic mouse designed to reduce wrist strain.',
    category: 'Electronics',
    price: {
      current: 49.99,
      expiryDate: '2023-09-25T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-07-10T00:00:00Z',
    lastModified: '2023-07-10T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '5',
    name: 'Steel Filing Cabinet',
    sku: 'CAB-005',
    supplierId: '6',
    supplierName: 'Factory Direct',
    description: 'Three-drawer steel filing cabinet with lock.',
    category: 'Furniture',
    price: {
      current: 129.99,
      expiryDate: '2023-10-20T00:00:00Z',
    },
    status: 'archived',
    createdAt: '2023-08-01T00:00:00Z',
    lastModified: '2023-08-15T16:40:00Z',
    modificationHistory: [
      {
        timestamp: '2023-08-15T16:40:00Z',
        user: 'John Admin',
        field: 'status',
        oldValue: 'active',
        newValue: 'archived'
      }
    ]
  },
  {
    id: '6',
    name: 'Conference Table',
    sku: 'TABLE-006',
    supplierId: '3',
    supplierName: 'Supply Solutions',
    description: 'Large oval conference table that seats 12 people.',
    category: 'Furniture',
    price: {
      current: 899.99,
      proposed: 949.99,
      approvalStatus: 'pending',
      expiryDate: '2023-12-01T00:00:00Z',
    },
    status: 'pending_approval',
    createdAt: '2023-09-01T00:00:00Z',
    lastModified: '2023-09-01T00:00:00Z',
    modificationHistory: []
  },
  // Additional products for pagination
  {
    id: '7',
    name: 'Standing Desk Converter',
    sku: 'DESK-007',
    supplierId: '3',
    supplierName: 'Supply Solutions',
    description: 'Height-adjustable desk converter for sit-stand workstations.',
    category: 'Furniture',
    price: {
      current: 199.99,
      expiryDate: '2024-01-15T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-08-10T00:00:00Z',
    lastModified: '2023-08-10T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '8',
    name: 'Wireless Headphones',
    sku: 'HEAD-008',
    supplierId: '5',
    supplierName: 'Tech Providers',
    description: 'Noise-cancelling wireless headphones with 30-hour battery life.',
    category: 'Electronics',
    price: {
      current: 159.99,
      expiryDate: '2024-02-28T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-08-15T00:00:00Z',
    lastModified: '2023-08-15T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '9',
    name: 'Monitor Stand',
    sku: 'STAND-009',
    supplierId: '3',
    supplierName: 'Supply Solutions',
    description: 'Adjustable monitor stand with storage drawer.',
    category: 'Furniture',
    price: {
      current: 79.99,
      expiryDate: '2024-03-10T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-08-20T00:00:00Z',
    lastModified: '2023-08-20T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '10',
    name: 'USB-C Hub',
    sku: 'HUB-010',
    supplierId: '5',
    supplierName: 'Tech Providers',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card slots.',
    category: 'Electronics',
    price: {
      current: 39.99,
      expiryDate: '2024-01-20T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-08-25T00:00:00Z',
    lastModified: '2023-08-25T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '11',
    name: 'Desk Organizer',
    sku: 'ORG-011',
    supplierId: '3',
    supplierName: 'Supply Solutions',
    description: 'Bamboo desk organizer with multiple compartments.',
    category: 'Office Supplies',
    price: {
      current: 24.99,
      expiryDate: '2024-04-15T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-09-01T00:00:00Z',
    lastModified: '2023-09-01T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '12',
    name: 'Webcam HD',
    sku: 'CAM-012',
    supplierId: '5',
    supplierName: 'Tech Providers',
    description: '1080p HD webcam with auto-focus and built-in microphone.',
    category: 'Electronics',
    price: {
      current: 69.99,
      expiryDate: '2024-05-01T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-09-05T00:00:00Z',
    lastModified: '2023-09-05T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '13',
    name: 'Whiteboard',
    sku: 'BOARD-013',
    supplierId: '3',
    supplierName: 'Supply Solutions',
    description: 'Magnetic dry erase whiteboard with aluminum frame.',
    category: 'Office Supplies',
    price: {
      current: 89.99,
      expiryDate: '2024-06-30T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-09-10T00:00:00Z',
    lastModified: '2023-09-10T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '14',
    name: 'Bluetooth Speaker',
    sku: 'SPEAK-014',
    supplierId: '5',
    supplierName: 'Tech Providers',
    description: 'Portable Bluetooth speaker with 360-degree sound.',
    category: 'Electronics',
    price: {
      current: 79.99,
      expiryDate: '2024-07-15T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-09-12T00:00:00Z',
    lastModified: '2023-09-12T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '15',
    name: 'Task Chair',
    sku: 'CHAIR-015',
    supplierId: '3',
    supplierName: 'Supply Solutions',
    description: 'Mesh back task chair with adjustable armrests.',
    category: 'Furniture',
    price: {
      current: 179.99,
      expiryDate: '2024-08-01T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-09-15T00:00:00Z',
    lastModified: '2023-09-15T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '16',
    name: 'Laptop Stand',
    sku: 'STAND-016',
    supplierId: '5',
    supplierName: 'Tech Providers',
    description: 'Aluminum laptop stand with heat dissipation design.',
    category: 'Electronics',
    price: {
      current: 45.99,
      expiryDate: '2024-09-10T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-09-18T00:00:00Z',
    lastModified: '2023-09-18T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '17',
    name: 'Paper Shredder',
    sku: 'SHRED-017',
    supplierId: '3',
    supplierName: 'Supply Solutions',
    description: 'Cross-cut paper shredder with 6-sheet capacity.',
    category: 'Office Supplies',
    price: {
      current: 119.99,
      expiryDate: '2024-10-20T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-09-20T00:00:00Z',
    lastModified: '2023-09-20T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '18',
    name: 'Wireless Charger',
    sku: 'CHARGE-018',
    supplierId: '5',
    supplierName: 'Tech Providers',
    description: 'Fast wireless charging pad with LED indicator.',
    category: 'Electronics',
    price: {
      current: 29.99,
      expiryDate: '2024-11-15T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-09-22T00:00:00Z',
    lastModified: '2023-09-22T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '19',
    name: 'Bookshelf',
    sku: 'SHELF-019',
    supplierId: '3',
    supplierName: 'Supply Solutions',
    description: '5-tier wooden bookshelf with modern design.',
    category: 'Furniture',
    price: {
      current: 149.99,
      expiryDate: '2024-12-01T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-09-25T00:00:00Z',
    lastModified: '2023-09-25T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '20',
    name: 'Cable Management Kit',
    sku: 'CABLE-020',
    supplierId: '5',
    supplierName: 'Tech Providers',
    description: 'Complete cable management solution with clips and sleeves.',
    category: 'Electronics',
    price: {
      current: 19.99,
      expiryDate: '2025-01-10T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-09-28T00:00:00Z',
    lastModified: '2023-09-28T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '21',
    name: 'Executive Desk',
    sku: 'DESK-021',
    supplierId: '3',
    supplierName: 'Supply Solutions',
    description: 'Large executive desk with built-in drawers and cable management.',
    category: 'Furniture',
    price: {
      current: 599.99,
      expiryDate: '2025-02-15T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-10-01T00:00:00Z',
    lastModified: '2023-10-01T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '22',
    name: 'Tablet Stand',
    sku: 'TAB-022',
    supplierId: '5',
    supplierName: 'Tech Providers',
    description: 'Adjustable tablet stand compatible with all tablet sizes.',
    category: 'Electronics',
    price: {
      current: 34.99,
      expiryDate: '2025-03-20T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-10-03T00:00:00Z',
    lastModified: '2023-10-03T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '23',
    name: 'Floor Lamp',
    sku: 'LAMP-023',
    supplierId: '3',
    supplierName: 'Supply Solutions',
    description: 'Modern LED floor lamp with dimmer control.',
    category: 'Lighting',
    price: {
      current: 129.99,
      expiryDate: '2025-04-10T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-10-05T00:00:00Z',
    lastModified: '2023-10-05T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '24',
    name: 'Power Bank',
    sku: 'POWER-024',
    supplierId: '5',
    supplierName: 'Tech Providers',
    description: '20000mAh portable power bank with fast charging.',
    category: 'Electronics',
    price: {
      current: 49.99,
      expiryDate: '2025-05-25T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-10-08T00:00:00Z',
    lastModified: '2023-10-08T00:00:00Z',
    modificationHistory: []
  },
  {
    id: '25',
    name: 'Storage Cabinet',
    sku: 'CAB-025',
    supplierId: '3',
    supplierName: 'Supply Solutions',
    description: 'Two-door storage cabinet with adjustable shelves.',
    category: 'Furniture',
    price: {
      current: 199.99,
      expiryDate: '2025-06-30T00:00:00Z',
    },
    status: 'active',
    createdAt: '2023-10-10T00:00:00Z',
    lastModified: '2023-10-10T00:00:00Z',
    modificationHistory: []
  }
];

// Mock orders data
export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  status: 'submitted' | 'processed' | 'completed' | 'cancelled';
  total: number;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    priceApproved: boolean;
  }[];
  buyer: {
    name: string;
    email: string;
    department: string;
  };
}

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    clientId: '2',
    clientName: 'Acme Corp',
    supplierId: '3',
    supplierName: 'Supply Solutions',
    orderDate: '2023-09-16T10:30:00Z',
    status: 'submitted',
    total: 849.95,
    items: [
      {
        productId: '1',
        productName: 'Premium Office Chair',
        quantity: 3,
        unitPrice: 249.99,
        totalPrice: 749.97,
        priceApproved: true
      },
      {
        productId: '2',
        productName: 'LED Desk Lamp',
        quantity: 2,
        unitPrice: 49.99,
        totalPrice: 99.98,
        priceApproved: true
      }
    ],
    buyer: {
      name: 'Jessica User',
      email: 'jessica@client.com',
      department: 'Operations'
    }
  },
  {
    id: 'ORD-002',
    clientId: '4',
    clientName: 'Global Industries',
    supplierId: '5',
    supplierName: 'Tech Providers',
    orderDate: '2023-09-15T14:15:00Z',
    status: 'processed',
    total: 1439.84,
    items: [
      {
        productId: '3',
        productName: 'Wireless Keyboard',
        quantity: 8,
        unitPrice: 89.99,
        totalPrice: 719.92,
        priceApproved: true
      },
      {
        productId: '4',
        productName: 'Ergonomic Mouse',
        quantity: 12,
        unitPrice: 59.99,
        totalPrice: 719.92,
        priceApproved: false
      }
    ],
    buyer: {
      name: 'Alex New',
      email: 'alex@example.com',
      department: 'IT'
    }
  },
  {
    id: 'ORD-003',
    clientId: '2',
    clientName: 'Acme Corp',
    supplierId: '6',
    supplierName: 'Factory Direct',
    orderDate: '2023-09-14T09:45:00Z',
    status: 'completed',
    total: 649.95,
    items: [
      {
        productId: '5',
        productName: 'Steel Filing Cabinet',
        quantity: 5,
        unitPrice: 129.99,
        totalPrice: 649.95,
        priceApproved: true
      }
    ],
    buyer: {
      name: 'Sarah Client',
      email: 'sarah@client.com',
      department: 'Administration'
    }
  },
  {
    id: 'ORD-004',
    clientId: '4',
    clientName: 'Global Industries',
    supplierId: '3',
    supplierName: 'Supply Solutions',
    orderDate: '2023-09-13T11:20:00Z',
    status: 'cancelled',
    total: 1799.98,
    items: [
      {
        productId: '6',
        productName: 'Conference Table',
        quantity: 2,
        unitPrice: 899.99,
        totalPrice: 1799.98,
        priceApproved: true
      }
    ],
    buyer: {
      name: 'Alex New',
      email: 'alex@example.com',
      department: 'Facilities'
    }
  }
];

// Mock requests data for requestor role
export interface Request {
  id: string;
  requestorId: string;
  requestorName: string;
  clientId: string;
  clientName: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  total: number;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    supplierId: string;
    supplierName: string;
  }[];
  notes?: string;
  adminComments?: string;
}

export const mockRequests: Request[] = [
  {
    id: 'REQ-001',
    requestorId: '7',
    requestorName: 'Emma Requestor',
    clientId: '2',
    clientName: 'Acme Corp',
    requestDate: '2023-09-16T14:30:00Z',
    status: 'pending',
    total: 329.97,
    items: [
      {
        productId: '1',
        productName: 'Premium Office Chair',
        quantity: 1,
        unitPrice: 249.99,
        totalPrice: 249.99,
        supplierId: '3',
        supplierName: 'Supply Solutions'
      },
      {
        productId: '3',
        productName: 'Wireless Keyboard',
        quantity: 1,
        unitPrice: 79.99,
        totalPrice: 79.99,
        supplierId: '5',
        supplierName: 'Tech Providers'
      }
    ],
    notes: 'Needed for new employee workstation setup'
  },
  {
    id: 'REQ-002',
    requestorId: '7',
    requestorName: 'Emma Requestor',
    clientId: '2',
    clientName: 'Acme Corp',
    requestDate: '2023-09-14T11:15:00Z',
    status: 'approved',
    total: 159.98,
    items: [
      {
        productId: '2',
        productName: 'LED Desk Lamp',
        quantity: 2,
        unitPrice: 59.99,
        totalPrice: 119.98,
        supplierId: '3',
        supplierName: 'Supply Solutions'
      },
      {
        productId: '4',
        productName: 'Ergonomic Mouse',
        quantity: 1,
        unitPrice: 49.99,
        totalPrice: 49.99,
        supplierId: '5',
        supplierName: 'Tech Providers'
      }
    ],
    notes: 'Office lighting improvement',
    adminComments: 'Approved for immediate procurement'
  },
  {
    id: 'REQ-003',
    requestorId: '7',
    requestorName: 'Emma Requestor',
    clientId: '2',
    clientName: 'Acme Corp',
    requestDate: '2023-09-12T09:45:00Z',
    status: 'rejected',
    total: 899.99,
    items: [
      {
        productId: '6',
        productName: 'Conference Table',
        quantity: 1,
        unitPrice: 899.99,
        totalPrice: 899.99,
        supplierId: '3',
        supplierName: 'Supply Solutions'
      }
    ],
    notes: 'Conference room upgrade',
    adminComments: 'Budget not available for this quarter'
  },
  {
    id: 'REQ-004',
    requestorId: '7',
    requestorName: 'Emma Requestor',
    clientId: '2',
    clientName: 'Acme Corp',
    requestDate: '2023-09-10T16:20:00Z',
    status: 'fulfilled',
    total: 89.98,
    items: [
      {
        productId: '11',
        productName: 'Desk Organizer',
        quantity: 2,
        unitPrice: 24.99,
        totalPrice: 49.98,
        supplierId: '3',
        supplierName: 'Supply Solutions'
      },
      {
        productId: '10',
        productName: 'USB-C Hub',
        quantity: 1,
        unitPrice: 39.99,
        totalPrice: 39.99,
        supplierId: '5',
        supplierName: 'Tech Providers'
      }
    ],
    notes: 'Office organization supplies',
    adminComments: 'Delivered and installed'
  }
];

// Mock activity log data
export interface ActivityLog {
  id: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
  action: string;
  details: string;
  entityType: 'user' | 'organization' | 'product' | 'order' | 'visibility' | 'request';
  entityId: string;
}

export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    timestamp: '2023-09-16T15:30:45Z',
    user: {
      id: '1',
      name: 'John Admin',
      role: 'master_admin'
    },
    action: 'approved_price',
    details: 'Approved price increase for Premium Office Chair from $249.99 to $269.99',
    entityType: 'product',
    entityId: '1'
  },
  {
    id: '2',
    timestamp: '2023-09-16T14:20:30Z',
    user: {
      id: '4',
      name: 'Jessica User',
      role: 'client_user'
    },
    action: 'placed_order',
    details: 'Placed order ORD-001 for 3 chairs and 2 lamps, total $849.95',
    entityType: 'order',
    entityId: 'ORD-001'
  },
  {
    id: '3',
    timestamp: '2023-09-16T14:30:00Z',
    user: {
      id: '7',
      name: 'Emma Requestor',
      role: 'requestor'
    },
    action: 'submitted_request',
    details: 'Submitted request REQ-001 for office chair and keyboard, total $329.97',
    entityType: 'request',
    entityId: 'REQ-001'
  },
  {
    id: '4',
    timestamp: '2023-09-16T11:15:20Z',
    user: {
      id: '3',
      name: 'Mike Supplier',
      role: 'supplier_admin'
    },
    action: 'updated_product',
    details: 'Updated product Conference Table description',
    entityType: 'product',
    entityId: '6'
  },
  {
    id: '5',
    timestamp: '2023-09-15T16:45:10Z',
    user: {
      id: '1',
      name: 'John Admin',
      role: 'master_admin'
    },
    action: 'changed_visibility',
    details: 'Changed visibility of Supply Solutions for Global Industries to visible',
    entityType: 'visibility',
    entityId: '3-4'
  },
  {
    id: '6',
    timestamp: '2023-09-15T15:30:45Z',
    user: {
      id: '6',
      name: 'Alex New',
      role: 'client_user'
    },
    action: 'placed_order',
    details: 'Placed order ORD-002 for Tech Providers items, total $1439.84',
    entityType: 'order',
    entityId: 'ORD-002'
  },
  {
    id: '7',
    timestamp: '2023-09-15T14:20:30Z',
    user: {
      id: '2',
      name: 'Sarah Client',
      role: 'client_admin'
    },
    action: 'created_user',
    details: 'Created new user Jessica User for Acme Corp',
    entityType: 'user',
    entityId: '4'
  },
  {
    id: '8',
    timestamp: '2023-09-15T10:10:05Z',
    user: {
      id: '3',
      name: 'Mike Supplier',
      role: 'supplier_admin'
    },
    action: 'requested_price_change',
    details: 'Requested price change for Premium Office Chair from $249.99 to $269.99',
    entityType: 'product',
    entityId: '1'
  },
  {
    id: '9',
    timestamp: '2023-09-14T16:30:45Z',
    user: {
      id: '2',
      name: 'Sarah Client',
      role: 'client_admin'
    },
    action: 'placed_order',
    details: 'Placed order ORD-003 for 5 filing cabinets, total $649.95',
    entityType: 'order',
    entityId: 'ORD-003'
  },
  {
    id: '10',
    timestamp: '2023-09-14T11:20:15Z',
    user: {
      id: '1',
      name: 'John Admin',
      role: 'master_admin'
    },
    action: 'created_organization',
    details: 'Created new supplier organization Factory Direct',
    entityType: 'organization',
    entityId: '6'
  },
  {
    id: '11',
    timestamp: '2023-09-14T11:15:00Z',
    user: {
      id: '7',
      name: 'Emma Requestor',
      role: 'requestor'
    },
    action: 'submitted_request',
    details: 'Submitted request REQ-002 for desk lamps and mouse, total $159.98',
    entityType: 'request',
    entityId: 'REQ-002'
  },
  {
    id: '12',
    timestamp: '2023-09-13T14:45:30Z',
    user: {
      id: '6',
      name: 'Alex New',
      role: 'client_user'
    },
    action: 'placed_order',
    details: 'Placed order ORD-004 for 2 conference tables, total $1799.98',
    entityType: 'order',
    entityId: 'ORD-004'
  },
  {
    id: '13',
    timestamp: '2023-09-13T13:10:25Z',
    user: {
      id: '6',
      name: 'Alex New',
      role: 'client_user'
    },
    action: 'cancelled_order',
    details: 'Cancelled order ORD-004 for conference tables',
    entityType: 'order',
    entityId: 'ORD-004'
  },
  {
    id: '14',
    timestamp: '2023-09-13T09:05:10Z',
    user: {
      id: '1',
      name: 'John Admin',
      role: 'master_admin'
    },
    action: 'updated_visibility',
    details: 'Updated default visibility settings for Tech Providers to false',
    entityType: 'organization',
    entityId: '5'
  },
  {
    id: '15',
    timestamp: '2023-09-12T16:20:45Z',
    user: {
      id: '5',
      name: 'Tom Supplier',
      role: 'supplier_user'
    },
    action: 'requested_price_change',
    details: 'Requested price decrease for Wireless Keyboard from $89.99 to $79.99',
    entityType: 'product',
    entityId: '3'
  },
  {
    id: '16',
    timestamp: '2023-09-12T10:15:30Z',
    user: {
      id: '1',
      name: 'John Admin',
      role: 'master_admin'
    },
    action: 'deactivated_user',
    details: 'Deactivated user Tom Supplier',
    entityType: 'user',
    entityId: '5'
  },
  {
    id: '17',
    timestamp: '2023-09-12T09:45:00Z',
    user: {
      id: '7',
      name: 'Emma Requestor',
      role: 'requestor'
    },
    action: 'submitted_request',
    details: 'Submitted request REQ-003 for conference table, total $899.99',
    entityType: 'request',
    entityId: 'REQ-003'
  },
  {
    id: '18',
    timestamp: '2023-09-11T15:45:20Z',
    user: {
      id: '3',
      name: 'Mike Supplier',
      role: 'supplier_admin'
    },
    action: 'added_product',
    details: 'Added new product Conference Table',
    entityType: 'product',
    entityId: '6'
  },
  {
    id: '19',
    timestamp: '2023-09-11T14:30:10Z',
    user: {
      id: '1',
      name: 'John Admin',
      role: 'master_admin'
    },
    action: 'changed_visibility',
    details: 'Changed visibility of Tech Providers for Acme Corp to visible',
    entityType: 'visibility',
    entityId: '5-2'
  },
  {
    id: '20',
    timestamp: '2023-09-11T11:20:05Z',
    user: {
      id: '2',
      name: 'Sarah Client',
      role: 'client_admin'
    },
    action: 'updated_organization',
    details: 'Updated contact information for Acme Corp',
    entityType: 'organization',
    entityId: '2'
  },
];

// Helper functions for data filtering and manipulation
export const getRecentOrders = (days: number = 2) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return mockOrders.filter(order => 
    new Date(order.orderDate) >= cutoffDate
  );
};

export const getPendingPriceApprovals = () => {
  return mockProducts.filter(product => 
    product.price.approvalStatus === 'pending'
  );
};

export const getExpiringPrices = (days: number = 7) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + days);
  
  return mockProducts.filter(product => 
    new Date(product.price.expiryDate) <= cutoffDate && 
    product.status === 'active'
  );
};

export const getOrganizationsByType = (type: 'client' | 'supplier') => {
  return mockOrganizations.filter(org => org.type === type);
};

export const getActiveUsers = () => {
  return mockUsers.filter(user => user.status === 'active');
};

// Data for charts
export const getOrdersByStatusData = () => {
  const statusCounts = mockOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    labels: Object.keys(statusCounts).map(status => 
      status.charAt(0).toUpperCase() + status.slice(1)
    ),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          '#3B82F6', // primary-500
          '#10B981', // success-500
          '#F59E0B', // warning-500
          '#EF4444', // danger-500
        ],
        borderWidth: 1,
      },
    ],
  };
};

export const getUserGrowthData = () => {
  // Simulate user growth over last 6 months
  const labels = [];
  const data = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    labels.push(date.toLocaleString('default', { month: 'short' }));
    
    // Simulate growing user count
    // This would come from real data in production
    const baseCount = mockUsers.length;
    const growthFactor = Math.floor(Math.random() * 3) + (5 - i);
    data.push(baseCount - growthFactor);
  }
  
  return {
    labels,
    datasets: [
      {
        label: 'Users',
        data,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };
};