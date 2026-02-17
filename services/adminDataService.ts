import { Tenant, PlatformAnalytics, SystemHealth, SystemLog } from '../types';

const ADMIN_DATA_KEY = 'stemedge_admin_data';

// --- MOCK DATA GENERATORS ---

const generateTenants = (): Tenant[] => [
    {
        id: 't-101',
        name: 'Lincoln High School',
        type: 'School',
        status: 'Active',
        plan: 'Enterprise',
        joinedDate: Date.now() - (180 * 24 * 60 * 60 * 1000), // 6 months ago
        teacherCount: 45,
        studentCount: 1200,
        activeUsersLast7Days: 850,
        storageUsedGB: 450.5
    },
    {
        id: 't-102',
        name: 'Tech Valley District',
        type: 'District',
        status: 'Active',
        plan: 'Enterprise',
        joinedDate: Date.now() - (365 * 24 * 60 * 60 * 1000), // 1 year ago
        teacherCount: 120,
        studentCount: 3500,
        activeUsersLast7Days: 2800,
        storageUsedGB: 1200.2
    },
    {
        id: 't-103',
        name: 'Nova Science Academy',
        type: 'School',
        status: 'Trial',
        plan: 'Pro',
        joinedDate: Date.now() - (10 * 24 * 60 * 60 * 1000), // 10 days ago
        trialEndsAt: Date.now() + (4 * 24 * 60 * 60 * 1000), // Ends in 4 days
        teacherCount: 8,
        studentCount: 150,
        activeUsersLast7Days: 145, // High engagement
        storageUsedGB: 15.0
    },
    {
        id: 't-104',
        name: 'Westside Prep',
        type: 'School',
        status: 'Expired',
        plan: 'Basic',
        joinedDate: Date.now() - (400 * 24 * 60 * 60 * 1000),
        teacherCount: 12,
        studentCount: 300,
        activeUsersLast7Days: 0,
        storageUsedGB: 45.0
    },
    {
        id: 't-105',
        name: 'Future Innovators Online',
        type: 'School',
        status: 'Suspended',
        plan: 'Pro',
        joinedDate: Date.now() - (60 * 24 * 60 * 60 * 1000),
        teacherCount: 5,
        studentCount: 50,
        activeUsersLast7Days: 2,
        storageUsedGB: 10.5
    }
];

const generateLogs = (): SystemLog[] => [
    { id: 'l-1', timestamp: Date.now() - 10000, level: 'INFO', tenantId: 't-102', message: 'Bulk student import completed successfully.' },
    { id: 'l-2', timestamp: Date.now() - 500000, level: 'WARNING', tenantId: 't-101', message: 'API Rate limit approaching (90%).' },
    { id: 'l-3', timestamp: Date.now() - 800000, level: 'ERROR', tenantId: 't-105', message: 'Payment gateway rejected transaction.' },
    { id: 'l-4', timestamp: Date.now() - 1200000, level: 'INFO', tenantId: 'System', message: 'Daily backup completed.' },
    { id: 'l-5', timestamp: Date.now() - 3600000, level: 'WARNING', tenantId: 't-103', message: 'Trial expiration notification sent.' },
];

export const adminDataService = {
    getTenants: (): Tenant[] => {
        const stored = localStorage.getItem(ADMIN_DATA_KEY);
        if (stored) return JSON.parse(stored);
        
        const tenants = generateTenants();
        localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(tenants));
        return tenants;
    },

    getPlatformAnalytics: (): PlatformAnalytics => {
        // In a real app, this calculates from DB. Here we mock.
        return {
            totalTenants: 5,
            totalUsers: 5200,
            activeTenants: 3,
            growthRate: 12.5,
            topTopics: [
                { name: 'Cellular Biology', attempts: 15400 },
                { name: 'Physics: Forces', attempts: 12300 },
                { name: 'Organic Chemistry', attempts: 9800 },
            ],
            commonMisconceptions: [
                { topic: 'Mitosis vs Meiosis', errorRate: 45 },
                { topic: 'Newton\'s 3rd Law', errorRate: 38 },
                { topic: 'Stoichiometry', errorRate: 52 },
            ]
        };
    },

    getSystemHealth: (): SystemHealth => {
        return {
            apiStatus: 'Healthy',
            apiLatency: 45,
            storageTotal: 50, // TB
            storageUsed: 12.4, // TB
            recentLogs: generateLogs()
        };
    },

    // Mock action
    updateTenantStatus: (tenantId: string, status: Tenant['status']) => {
        const tenants = adminDataService.getTenants();
        const tenant = tenants.find(t => t.id === tenantId);
        if (tenant) {
            tenant.status = status;
            localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(tenants));
            return true;
        }
        return false;
    }
};