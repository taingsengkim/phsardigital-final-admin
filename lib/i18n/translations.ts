export type Language = "en" | "kh"

export const translations = {
  en: {
    // App & Header
    appTitle: "Phsar Digital",
    adminPanel: "Admin Panel",
    superAdmin: "Super Admin",
    signOut: "Sign Out",
    notifications: "Notifications",

    // Navigation
    navDashboard: "Dashboard",
    navBuyers: "Buyers",
    navSellers: "Sellers",
    navSubscriptions: "Subscriptions",
    navCategories: "Categories",
    navListingsModeration: "Listings Moderation",
    navPurchases: "Purchases",
    navNotifications: "Notifications",
    navReports: "Reports",
    navAnalytics: "Analytics",
    navSettings: "Settings",

    // Common Actions & Filters
    allStatuses: "All statuses",
    allCategories: "All categories",
    allSellers: "All sellers",
    searchPlaceholder: "Search...",
    resetFilters: "Reset Filters",
    grantSubscription: "Grant Subscription",
    createPlan: "Create New Plan",
    editPlan: "Edit Plan",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    confirm: "Confirm",
    actions: "Actions",
    refreshing: "Refreshing...",
    status: "Status",
    date: "Date",

    // Status Badges
    statusActive: "Active",
    statusDraft: "Draft",
    statusPending: "Pending",
    statusSuspended: "Suspended",
    statusBanned: "Banned",
    statusRejected: "Rejected",
    statusExpired: "Expired",
    statusCancelled: "Cancelled",

    // Stats Titles
    statTotalListings: "TOTAL LISTINGS",
    statLiveListings: "LIVE LISTINGS",
    statUnderReview: "UNDER REVIEW",
    statBannedListings: "BANNED LISTINGS",
    statActiveSubscribers: "ACTIVE SUBSCRIBERS",
    statMonthlyRevenue: "MONTHLY REVENUE",
    statCancellationRate: "CANCELLATION RATE",

    // Moderation Panel
    listingAuditPanel: "Listing Audit Panel",
    approveProduct: "Approve Product",
    banProduct: "Ban Product",
    banSeller: "Ban Seller",
    flagForReview: "Flag for Review",
    archiveListing: "Archive Listing",
    suspensionReason: "Suspension Reason",
    reasonPlaceholder: "Provide a clear, detailed reason...",

    // Sidebar footer
    sidebarMotto: "Secure Marketplace, Trusted by All.",
  },
  kh: {
    // App & Header
    appTitle: "ផ្សារឌីជីថល",
    adminPanel: "ផ្ទាំងគ្រប់គ្រង",
    superAdmin: "អ្នកគ្រប់គ្រងជាន់ខ្ពស់",
    signOut: "ចាកចេញ",
    notifications: "ការជូនដំណឹង",

    // Navigation
    navDashboard: "ផ្ទាំងគ្រប់គ្រង",
    navBuyers: "អ្នកទិញ",
    navSellers: "អ្នកលក់",
    navSubscriptions: "កញ្ចប់ជាវ",
    navCategories: "ប្រភេទផលិតផល",
    navListingsModeration: "ការត្រួតពិនិត្យផលិតផល",
    navPurchases: "ការទិញ",
    navNotifications: "ការជូនដំណឹង",
    navReports: "របាយការណ៍",
    navAnalytics: "វិភាគទិន្នន័យ",
    navSettings: "ការកំណត់",

    // Common Actions & Filters
    allStatuses: "ស្ថានភាពទាំងអស",
    allCategories: "ប្រភេទទាំងអស់",
    allSellers: "អ្នកលក់ទាំងអស់",
    searchPlaceholder: "ស្វែងរក...",
    resetFilters: "កំណត់តម្រងឡើងវិញ",
    grantSubscription: "ផ្តល់កញ្ចប់ជាវ",
    createPlan: "បង្កើតកញ្ចប់ថ្មី",
    editPlan: "កែប្រែកញ្ចប់",
    cancel: "បោះបង់",
    saveChanges: "រក្សាទុកការផ្លាស់ប្តូរ",
    confirm: "បញ្ជាក់",
    actions: "សកម្មភាព",
    refreshing: "កំពុងធ្វើបច្ចុប្បន្នភាព...",
    status: "ស្ថានភាព",
    date: "កាលបរិច្ឆេទ",

    // Status Badges
    statusActive: "សកម្ម",
    statusDraft: "ព្រាង",
    statusPending: "រង់ចាំពិនិត្យ",
    statusSuspended: "ផ្អាកបណ្តោះអាសន្ន",
    statusBanned: "បិទគណនី",
    statusRejected: "បដិសេធ",
    statusExpired: "ផុតកំណត់",
    statusCancelled: "បានបោះបង់",

    // Stats Titles
    statTotalListings: "ផលិតផលសរុប",
    statLiveListings: "ផលិតផលកំពុងលក់",
    statUnderReview: "កំពុងពិនិត្យ",
    statBannedListings: "ផលិតផលបានបិទ",
    statActiveSubscribers: "អ្នកជាវសកម្ម",
    statMonthlyRevenue: "ចំណូលប្រចាំខែ",
    statCancellationRate: "អត្រាបោះបង់",

    // Moderation Panel
    listingAuditPanel: "ផ្ទាំងពិនិត្យផលិតផល",
    approveProduct: "អនុម័តផលិតផល",
    banProduct: "បិទផលិតផល",
    banSeller: "បិទអ្នកលក់",
    flagForReview: "ដាក់រង់ចាំពិនិត្យ",
    archiveListing: "រក្សាទុកប័ណ្ណសារ",
    suspensionReason: "មូលហេតុនៃការផ្អាក",
    reasonPlaceholder: "ផ្តល់មូលហេតុច្បាស់លាស់...",

    // Sidebar footer
    sidebarMotto: "ផ្សារសុវត្ថិភាព ទំនុកចិត្តសម្រាប់ទាំងអស់គ្នា",
  },
} as const

export type TranslationKey = keyof typeof translations.en
