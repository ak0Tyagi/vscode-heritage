import { Tab, Booking, Package, ServiceConfig, Expense, PaymentMethod, ExpenseCategory, Vendor } from './types';

export const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'bookings', label: 'All Bookings', icon: '📋' },
    { id: 'new-booking', label: 'New Booking', icon: '➕' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'expenses', label: 'Expenses', icon: '💰' },
    { id: 'analytics', label: 'Analytics & Reports', icon: '📈' },
    { id: 'control-center', label: 'Control Center', icon: '⚙️' },
    { id: 'accounts', label: 'Accounts', icon: '🧾' },
];

export const SAMPLE_BOOKINGS: Booking[] = [
    {
        bookingId: 'HG-2025-001',
        clientName: 'Rajesh & Priya Wedding',
        status: 'Upcoming',
        tier: 'Gold',
        season: '2025-26',
        eventDate: '2025-03-15',
        contact: '9876543210',
        rate: 250000,
        payments: [{ id: 'pay_1', date: '2025-01-15', amount: 100000, method: 'Bank', type: 'Received' }],
        discount: 25000,
        expenses: 180000,
        eventType: 'Wedding',
        guests: 300,
        shift: 'Night',
        services: { 'ac-hall': true, 'lighting-decoration': true, 'dj-setup': 'premium' }
    },
    {
        bookingId: 'HG-2025-002',
        clientName: 'TechCorp Annual Meet',
        status: 'Completed',
        tier: 'Diamond',
        season: '2025-26',
        eventDate: '2025-02-20',
        contact: '8765432109',
        rate: 180000,
        payments: [
            { id: 'pay_2', date: '2025-01-20', amount: 90000, method: 'Bank', type: 'Received' },
            { id: 'pay_3', date: '2025-02-18', amount: 90000, method: 'Card', type: 'Received' }
        ],
        expenses: 120000,
        eventType: 'Corporate',
        guests: 150,
        shift: 'Day',
        services: { 'ac-hall': true, 'coffee-machine': true, 'waiters-count': 6 }
    },
    {
        bookingId: 'HG-2024-045',
        clientName: 'Kumar Family Function',
        status: 'Cancelled',
        tier: 'Silver',
        season: '2024-25',
        eventDate: '2025-01-10',
        contact: '7654321098',
        rate: 120000,
        payments: [{ id: 'pay_4', date: '2024-12-10', amount: 30000, method: 'Cash', type: 'Received' }],
        expenses: 5000,
        eventType: 'Family Function',
        guests: 100,
        shift: 'Day',
        services: { 'ac-hall': true },
        refundAmount: 25000,
    },
    {
        bookingId: 'HG-2025-003',
        clientName: 'Anjali Mehendi Ceremony',
        status: 'Upcoming',
        tier: 'Silver',
        season: '2025-26',
        eventDate: '2025-04-05',
        contact: '9988776655',
        rate: 110000,
        payments: [{ id: 'pay_5', date: '2025-03-05', amount: 50000, method: 'UPI', type: 'Received' }],
        expenses: 70000,
        eventType: 'Mehendi',
        guests: 120,
        shift: 'Day',
        services: { 'flower-decoration': true }
    }
];

export const SAMPLE_EXPENSES: Expense[] = [
    // Booking Expenses
    { id: 'exp-001', bookingId: 'HG-2025-001', expenseDate: '2025-03-14', category: 'Catering', vendor: 'Royal Caterers', amount: 95000, paymentMethod: 'Bank', type: 'Paid' },
    { id: 'exp-002', bookingId: 'HG-2025-001', expenseDate: '2025-03-15', category: 'Decoration', vendor: 'Floral Dreams', amount: 65000, paymentMethod: 'UPI', type: 'Paid' },
    { id: 'exp-003', bookingId: 'HG-2025-001', expenseDate: '2025-03-15', category: 'Staff', vendor: 'Event Staff Co', amount: 20000, paymentMethod: 'Cash', type: 'Paid', manpowerCount: 10, ratePerPerson: 2000 },
    { id: 'exp-004', bookingId: 'HG-2025-002', expenseDate: '2025-02-19', category: 'AV Equipment', vendor: 'Sound & Light Pro', amount: 50000, paymentMethod: 'Bank', type: 'Paid' },
    { id: 'exp-005', bookingId: 'HG-2025-002', expenseDate: '2025-02-20', category: 'Catering', vendor: 'Quick Bites', amount: 70000, paymentMethod: 'Card', type: 'Paid' },
    
    // General Expenses
    { id: 'exp-101', expenseDate: '2025-03-01', category: 'Salary', vendor: 'Staff Salaries', amount: 80000, paymentMethod: 'Bank', type: 'Paid' },
    { id: 'exp-102', expenseDate: '2025-03-05', category: 'Utilities', vendor: 'Electricity Board', amount: 15000, paymentMethod: 'UPI', type: 'Paid' },
    { id: 'exp-103', expenseDate: '2025-03-10', category: 'Maintenance', vendor: 'Plumbing Services', amount: 3500, paymentMethod: 'Cash', type: 'Paid' },
    { id: 'exp-104', expenseDate: '2025-02-25', category: 'Marketing', vendor: 'Online Ads', amount: 12000, paymentMethod: 'Card', type: 'Paid' },
];


export const DEFAULT_SERVICES_CONFIG: ServiceConfig = {
    infrastructure: [
        { id: 'ac-hall', name: 'AC Hall', type: 'checkbox' },
        { id: 'indoor-stage', name: 'Indoor Stage', type: 'checkbox' },
        { id: 'coffee-machine', name: 'Coffee Machine', type: 'checkbox' },
        { id: 'generator-setup', name: 'Generator Setup', type: 'dropdown', options: ['None', '15 KVA Generator', '25 KVA Generator'] }
    ],
    decoration: [
        { id: 'flower-decoration', name: 'Flower Decoration', type: 'checkbox' },
        { id: 'lighting-decoration', name: 'Lighting Decoration', type: 'checkbox' },
        { id: 'natural-flower-decoration', name: 'Natural Flower Decoration', type: 'checkbox' }
    ],
    labour: [
        { id: 'service-manager-count', name: 'Service Manager', type: 'number', min: 0, max: 5 },
        { id: 'waiters-count', name: 'Waiters', type: 'number', min: 0, max: 20 }
    ],
    halwai: [
        { id: 'fruit-counter-count', name: 'Fruit Counter', type: 'number', min: 0, max: 10 },
        { id: 'main-course-counter-count', name: 'Main Course Counter', type: 'number', min: 0, max: 10 },
        { id: 'snacks-counter-count', name: 'Snacks Counter', type: 'number', min: 0, max: 10 }
    ],
    extra: [
        { id: 'dj-setup', name: 'DJ Setup', type: 'dropdown', options: ['None', 'Basic DJ Setup', 'Premium DJ Setup'] },
        { id: 'anar-matka', name: 'Anar Matka', type: 'checkbox' }
    ],
    'entry-decor': [
        { id: 'mirror-entry', name: 'Mirror Entry', type: 'checkbox' },
        { id: 'balloon-arch', name: 'Balloon Arch', type: 'checkbox' },
        { id: 'welcome-gate', name: 'Welcome Gate', type: 'checkbox' }
    ]
};

export const DEFAULT_PACKAGES: Package[] = [
    {
        id: 'pkg-silver',
        name: 'Silver Package',
        price: 110000,
        services: { 
            'ac-hall': true, 'flower-decoration': true, 'waiters-count': 5, 
            'generator-setup': '15kva', 'main-course-counter-count': 2
        }
    },
    {
        id: 'pkg-gold',
        name: 'Gold Package',
        price: 145000,
        services: { 
            'ac-hall': true, 'flower-decoration': true, 'lighting-decoration': true,
            'waiters-count': 8, 'service-manager-count': 1, 'generator-setup': '25kva',
            'main-course-counter-count': 3, 'dj-setup': 'basic'
        }
    },
    {
        id: 'pkg-diamond',
        name: 'Diamond Package',
        price: 180000,
        services: { 
            'ac-hall': true, 'natural-flower-decoration': true, 'lighting-decoration': true,
            'waiters-count': 12, 'service-manager-count': 2, 'generator-setup': '25kva',
            'main-course-counter-count': 4, 'dj-setup': 'premium', 'mirror-entry': true
        }
    }
];

export const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategory[] = [
    { id: 'catering', name: 'Catering', requiresManpower: false },
    { id: 'decoration', name: 'Decoration', requiresManpower: false },
    { id: 'staff', name: 'Staff', requiresManpower: true },
    { id: 'labour', name: 'Labour', requiresManpower: true },
    { id: 'av-equipment', name: 'AV Equipment', requiresManpower: false },
    { id: 'salary', name: 'Salary', requiresManpower: false },
    { id: 'utilities', name: 'Utilities', requiresManpower: false },
    { id: 'maintenance', name: 'Maintenance', requiresManpower: false },
    { id: 'marketing', name: 'Marketing', requiresManpower: false },
    { id: 'refund', name: 'Refund', requiresManpower: false },
    { id: 'other', name: 'Other', requiresManpower: false },
];

export const DEFAULT_VENDORS: Vendor[] = [
    { id: 'v-1', name: 'Royal Caterers', categoryId: 'catering' },
    { id: 'v-2', name: 'Floral Dreams', categoryId: 'decoration' },
    { id: 'v-3', name: 'Event Staff Co', categoryId: 'staff' },
    { id: 'v-4', name: 'Sound & Light Pro', categoryId: 'av-equipment' },
    { id: 'v-5', name: 'Quick Bites', categoryId: 'catering' },
    { id: 'v-6', name: 'Electricity Board', categoryId: 'utilities' },
    { id: 'v-7', name: 'Plumbing Services', categoryId: 'maintenance' },
];


export const SERVICE_CATEGORY_STYLES: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    infrastructure: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800', icon: '🏗️' },
    decoration: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800', icon: '🎨' },
    labour: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800', icon: '👥' },
    halwai: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800', icon: '🍽️' },
    extra: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-800', icon: '⚡' },
    'entry-decor': { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-800', icon: '🎭' }
};