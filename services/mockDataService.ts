
import { 
  User, UserRole, Product, InventoryItem, Order, Customer, 
  SupplierPriceRequest, PricingRule,
  SupplierPriceRequestItem, AppNotification, ChatMessage, OrderItem,
  Driver, Packer, RegistrationRequest, OnboardingFormTemplate,
  BusinessProfile, OrderIssue, Industry, ProductUnit, ProcurementRequest,
  ClearanceLot, Lead, AuState, LeadStatus
} from '../types';

export interface RoleIncentive {
  amount: number;
  weeks: number;
  activationDays: number;
  minSpendPerWeek: number;
  referrerBonusEnabled: boolean;
  referrerBonusAmount: number;
}

export const INDUSTRIES: Industry[] = [
  'Cafe', 'Restaurant', 'Pub', 'Hotel', 'Sporting Club', 'RSL', 'Casino', 'Catering', 'Grocery Store', 'Airlines', 'School', 'Aged Care', 'Hospital'
];

class MockDataService {
  private users: User[] = [...USERS_INITIAL];
  private products: Product[] = [...INITIAL_PRODUCTS];
  private inventory: InventoryItem[] = [...INITIAL_INVENTORY];
  private orders: Order[] = [...INITIAL_ORDERS];
  private issues: OrderIssue[] = [];
  private notifications: AppNotification[] = [];
  private customers: Customer[] = [...INITIAL_CUSTOMERS];
  private supplierPriceRequests: SupplierPriceRequest[] = [];
  private procurementRequests: ProcurementRequest[] = [];
  private chatMessages: ChatMessage[] = [];
  private drivers: Driver[] = [];
  private packers: Packer[] = [];
  private clearanceLots: ClearanceLot[] = [];
  private registrationRequests: RegistrationRequest[] = [];
  private leads: Lead[] = [...INITIAL_LEADS];

  private roleIncentives: Record<string, RoleIncentive> = {
    [UserRole.FARMER]: { amount: 1000, weeks: 10, activationDays: 30, minSpendPerWeek: 500, referrerBonusEnabled: true, referrerBonusAmount: 200 },
    [UserRole.WHOLESALER]: { amount: 500, weeks: 5, activationDays: 14, minSpendPerWeek: 1000, referrerBonusEnabled: true, referrerBonusAmount: 100 },
    [UserRole.CONSUMER]: { amount: 100, weeks: 4, activationDays: 7, minSpendPerWeek: 50, referrerBonusEnabled: true, referrerBonusAmount: 25 },
    [UserRole.GROCERY]: { amount: 200, weeks: 8, activationDays: 14, minSpendPerWeek: 200, referrerBonusEnabled: true, referrerBonusAmount: 50 }
  };

  private industryIncentives: Record<Industry, number> = {
    'Cafe': 15, 'Restaurant': 15, 'Pub': 10, 'Hotel': 10, 'Sporting Club': 5, 'RSL': 5, 'Casino': 10, 'Catering': 12, 'Grocery Store': 8, 'Airlines': 15, 'School': 5, 'Aged Care': 5, 'Hospital': 5
  };

  constructor() {
    this.loadFromStorage();
  }

  private saveToStorage() {
    const data = {
      users: this.users,
      products: this.products,
      inventory: this.inventory,
      orders: this.orders,
      issues: this.issues,
      customers: this.customers,
      supplierPriceRequests: this.supplierPriceRequests,
      procurementRequests: this.procurementRequests,
      chatMessages: this.chatMessages,
      notifications: this.notifications,
      drivers: this.drivers,
      packers: this.packers,
      clearanceLots: this.clearanceLots,
      registrationRequests: this.registrationRequests,
      leads: this.leads,
      roleIncentives: this.roleIncentives,
      industryIncentives: this.industryIncentives
    };
    localStorage.setItem('pz_platform_data_v2', JSON.stringify(data));
  }

  private loadFromStorage() {
    const saved = localStorage.getItem('pz_platform_data_v2');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.users = data.users || this.users;
        this.products = data.products || this.products;
        this.inventory = data.inventory || this.inventory;
        this.orders = data.orders || this.orders;
        this.issues = data.issues || this.issues;
        this.customers = data.customers || this.customers;
        this.supplierPriceRequests = data.supplierPriceRequests || this.supplierPriceRequests;
        this.procurementRequests = data.procurementRequests || [];
        this.chatMessages = data.chatMessages || this.chatMessages;
        this.notifications = data.notifications || this.notifications;
        this.drivers = data.drivers || this.drivers;
        this.packers = data.packers || this.packers;
        this.clearanceLots = data.clearanceLots || [];
        this.registrationRequests = data.registrationRequests || [];
        this.leads = data.leads || this.leads;
        this.roleIncentives = data.roleIncentives || this.roleIncentives;
        this.industryIncentives = data.industryIncentives || this.industryIncentives;
      } catch (e) {
        console.error("Failed to load PZ mock data", e);
      }
    }
  }

  getLeads() { return this.leads; }
  
  addLead(lead: Partial<Lead>) {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      businessName: lead.businessName || 'New Entity',
      contactName: lead.contactName || 'TBA',
      email: lead.email || '',
      phone: lead.phone || '',
      status: 'DISCOVERY',
      state: lead.state || 'VIC',
      potentialRevenue: lead.potentialRevenue || 5000,
      timestamp: new Date().toISOString(),
      assignedRepId: lead.assignedRepId,
      assignedRepName: lead.assignedRepName,
      suburb: lead.suburb
    };
    this.leads.push(newLead);
    this.saveToStorage();
    return newLead;
  }

  convertLeadToCustomer(lead: Lead) {
    const existing = this.customers.find(c => c.businessName === lead.businessName);
    if (!existing) {
        const newCustomer: Customer = {
            id: `cust-${Date.now()}`,
            businessName: lead.businessName,
            contactName: lead.contactName,
            email: lead.email,
            phone: lead.phone,
            category: 'Restaurant', // Default for conversion
            location: lead.suburb,
            connectionStatus: 'Active',
            pzMarkup: 15,
            pzPaymentTermsDays: 7,
            supplierPaymentTermsDays: 14,
            assignedPzRepId: lead.assignedRepId,
            assignedPzRepName: lead.assignedRepName
        };
        this.customers.push(newCustomer);
        
        // Also create a basic User record for the directory
        const newUser: User = {
            id: newCustomer.id,
            name: lead.contactName,
            businessName: lead.businessName,
            role: UserRole.CONSUMER,
            email: lead.email,
            phone: lead.phone,
            isConfirmed: true,
            hasSetCredentials: false
        };
        this.users.push(newUser);
        
        this.saveToStorage();
    }
  }

  updateLeadStatus(leadId: string, status: LeadStatus) {
    const idx = this.leads.findIndex(l => l.id === leadId);
    if (idx > -1) {
        this.leads[idx].status = status;
        if (status === 'ONBOARDED') {
            this.convertLeadToCustomer(this.leads[idx]);
        }
        this.saveToStorage();
    }
  }

  getAllUsers() { return this.users; }
  getPzRepresentatives() { return this.users.filter(u => u.role === UserRole.PZ_REP); }
  getOrders(userId: string) { return this.orders; }
  getCustomers() { return this.customers; }
  getAllProducts() { return this.products; }
  getProduct(id: string) { return this.products.find(p => p.id === id); }
  getAllInventory() { return this.inventory; }

  getInventory(userId: string) { return this.inventory.filter(i => i.ownerId === userId); }

  getRegistrationRequests() { return this.registrationRequests; }

  updateCustomerRep(id: string, repId: string) {
    const c = this.customers.find(cust => cust.id === id);
    const rep = this.users.find(u => u.id === repId);
    if (c && rep) {
        c.assignedPzRepId = repId;
        c.assignedPzRepName = rep.name;
        this.saveToStorage();
    }
  }

  updateCustomerSupplier(id: string, supplierId: string) {
    const c = this.customers.find(cust => cust.id === id);
    const supplier = this.users.find(u => u.id === supplierId);
    if (c && supplier) {
        c.connectedSupplierId = supplierId;
        c.connectedSupplierName = supplier.businessName;
        c.connectedSupplierRole = supplier.role;
        this.saveToStorage();
    }
  }

  getRepCustomers(repId: string) { return this.customers.filter(c => c.assignedPzRepId === repId); }
  getRepIssues(repId: string) { return this.orders.filter(o => o.issue && o.issue.assignedRepId === repId); }

  getRepStats(repId: string) {
    const rep = this.users.find(u => u.id === repId);
    const repOrders = this.orders.filter(o => {
        const customer = this.customers.find(c => c.id === o.buyerId);
        return customer?.assignedPzRepId === repId;
    });
    const commissionRate = rep?.commissionRate || 5;
    
    return {
        totalSales: repOrders.reduce((sum, o) => sum + o.totalAmount, 0),
        commissionMade: repOrders.filter(o => o.paymentStatus === 'Paid').reduce((sum, o) => sum + (o.totalAmount * (commissionRate / 100)), 0),
        commissionComing: repOrders.filter(o => o.paymentStatus !== 'Paid').reduce((sum, o) => sum + (o.totalAmount * (commissionRate / 100)), 0),
        customerCount: this.customers.filter(c => c.assignedPzRepId === repId).length,
        orders: repOrders,
        health: 85, 
        grade: 'A+',
        opportunitiesManaged: this.leads.filter(l => l.assignedRepId === repId).length
    };
  }

  updateBusinessProfile(userId: string, profile: any) {
    const u = this.users.find(user => user.id === userId);
    if (u) { 
      u.businessProfile = { ...u.businessProfile, ...profile }; 
      this.saveToStorage(); 
    }
  }

  logCommunication(log: any) {
    this.chatMessages.push(log);
    this.saveToStorage();
  }

  getCommunicationLogs() { return this.chatMessages; }

  markOrderAsPaid(id: string, receiptUrl: string) {
    const o = this.orders.find(ord => ord.id === id);
    if (o) { o.paymentStatus = 'Paid'; o.customerReceiptUrl = receiptUrl; this.saveToStorage(); }
  }

  markOrderAsRemitted(id: string, receiptUrl: string) {
    const o = this.orders.find(ord => ord.id === id);
    if (o) { o.supplierPayoutStatus = 'Remitted'; o.supplierReceiptUrl = receiptUrl; this.saveToStorage(); }
  }

  createSupplierPriceRequest(req: SupplierPriceRequest) { this.supplierPriceRequests.push(req); this.saveToStorage(); }
  getAllSupplierPriceRequests() { return this.supplierPriceRequests; }
  
  finalizeDeal(requestId: string) {
      const req = this.supplierPriceRequests.find(r => r.id === requestId);
      if (req) {
          req.status = 'WON';
          const customer: Customer = {
              id: `cust-${Date.now()}`,
              businessName: req.customerContext,
              contactName: 'Lead Customer',
              location: req.customerLocation,
              category: 'Restaurant',
              connectionStatus: 'Active',
              connectedSupplierId: req.supplierId,
              connectedSupplierName: 'Supplier',
              pzMarkup: 15,
              pzPaymentTermsDays: 7,
              supplierPaymentTermsDays: 14,
              assignedPzRepId: 'u-rep1', 
              assignedPzRepName: 'Mark Representative'
          };
          this.customers.push(customer);
          this.saveToStorage();
          return customer;
      }
      return null;
  }

  getPackers(wholesalerId: string) { return this.packers.filter(p => p.wholesalerId === wholesalerId); }
  getDrivers(wholesalerId: string) { return this.drivers.filter(d => d.wholesalerId === wholesalerId); }
  
  acceptOrderV2(orderId: string) {
    const o = this.orders.find(ord => ord.id === orderId);
    if (o) {
        o.status = 'Confirmed';
        o.confirmedAt = new Date().toISOString();
        this.saveToStorage();
    }
  }

  packOrder(orderId: string, packerName: string) {
    const o = this.orders.find(ord => ord.id === orderId);
    if (o) {
        o.status = 'Ready for Delivery';
        o.preparedAt = new Date().toISOString();
        o.packedAt = new Date().toISOString();
        this.saveToStorage();
    }
  }

  addProcurementRequest(request: ProcurementRequest) {
    this.procurementRequests.push(request);
    this.saveToStorage();
  }

  getProcurementRequests(userId: string) {
      return this.procurementRequests.filter(r => r.buyerId === userId || r.supplierId === userId);
  }

  updateProcurementQuote(requestId: string, price: number) {
      const req = this.procurementRequests.find(r => r.id === requestId);
      if (req) {
          req.status = 'QUOTED';
          req.offeredPrice = price;
          this.saveToStorage();
      }
  }

  acceptProcurementQuote(requestId: string) {
      const req = this.procurementRequests.find(r => r.id === requestId);
      if (req) {
          req.status = 'ACCEPTED';
          const orderItems: OrderItem[] = [{
              productId: req.productId,
              quantityKg: req.quantity,
              pricePerKg: req.offeredPrice || 0,
              unit: req.unit as any
          }];
          this.createFullOrder(req.buyerId, orderItems, (req.offeredPrice || 0) * req.quantity);
          this.saveToStorage();
      }
  }

  confirmUser(userId: string) {
      const u = this.users.find(user => user.id === userId);
      if (u) { u.isConfirmed = true; this.saveToStorage(); }
  }

  updateUserCredentials(userId: string, email: string) {
      const u = this.users.find(user => user.id === userId);
      if (u) { 
        u.email = email; 
        u.hasSetCredentials = true; 
        this.saveToStorage(); 
      }
  }

  verifyCodeLogin(code: string) {
      const req = this.registrationRequests.find(r => r.temporaryCode === code && r.status === 'Approved');
      if (req) {
          let user = this.users.find(u => u.email === req.email);
          if (!user) {
              user = {
                  id: `u-${Date.now()}`,
                  name: `${req.firstName} ${req.lastName}`,
                  businessName: req.businessName,
                  email: req.email,
                  role: req.requestedRole,
                  isConfirmed: true,
                  hasSetCredentials: false
              };
              this.users.push(user);
              this.saveToStorage();
          }
          return user;
      }
      if (code === '123456') return this.users.find(u => u.role === UserRole.ADMIN);
      if (code === 'REP123') return this.users.find(u => u.id === 'u-rep1');
      return null;
  }

  addProduct(product: Product) { this.products.push(product); this.saveToStorage(); }

  updateProductPricing(productId: string, price: number, unit: ProductUnit) {
      const p = this.products.find(prod => prod.id === productId);
      if (p) { p.defaultPricePerKg = price; p.unit = unit; this.saveToStorage(); }
  }

  addInventoryItem(item: InventoryItem) { this.inventory.push(item); this.saveToStorage(); }

  generateLotId() { return `PZ-LOT-${Math.floor(1000 + Math.random() * 9000)}`; }

  hasOutstandingInvoices(userId: string) {
      return this.orders.some(o => o.buyerId === userId && o.paymentStatus === 'Overdue');
  }

  toggleFavorite(userId: string, productId: string) {
      const u = this.users.find(user => user.id === userId);
      if (u) {
          const favorites = u.favoriteProductIds || [];
          if (favorites.includes(productId)) {
              u.favoriteProductIds = favorites.filter(id => id !== productId);
          } else {
              u.favoriteProductIds = [...favorites, productId];
          }
          this.saveToStorage();
      }
  }

  createFullOrder(buyerId: string, items: OrderItem[], totalAmount: number) {
      const newOrder: Order = {
          id: `o-${Date.now()}`,
          buyerId,
          sellerId: 'u2', 
          items,
          totalAmount,
          status: 'Pending',
          date: new Date().toISOString(),
          paymentStatus: 'Unpaid'
      };
      this.orders.push(newOrder);
      this.saveToStorage();
      return newOrder;
  }

  updateCustomerMarkup(customerId: string, markup: number) {
      const c = this.customers.find(cust => cust.id === customerId);
      if (c) { c.pzMarkup = markup; this.saveToStorage(); }
  }

  getDriverOrders(driverId: string) {
      const driver = this.drivers.find(d => d.id === driverId);
      return this.orders.filter(o => o.logistics?.driverName === driver?.name);
  }

  addDriver(driver: Driver) { this.drivers.push(driver); this.saveToStorage(); }

  deliverOrder(orderId: string, driverName: string, photo: string) {
      const o = this.orders.find(ord => ord.id === orderId);
      if (o) {
          o.status = 'Delivered';
          o.deliveredAt = new Date().toISOString();
          if (!o.logistics) o.logistics = {};
          o.logistics.driverName = driverName;
          o.logistics.deliveryPhoto = photo;
          this.saveToStorage();
      }
  }

  addEmployee(user: User) { this.users.push(user); this.saveToStorage(); }

  updateUserVersion(userId: string, version: 'v1' | 'v2') {
      const u = this.users.find(user => user.id === userId);
      if (u) { u.dashboardVersion = version; this.saveToStorage(); }
  }

  updateUserSmsPreference(userId: string, enabled: boolean, phone: string) {
      const u = this.users.find(user => user.id === userId);
      if (u) { 
        u.smsNotificationsEnabled = enabled; 
        u.phone = phone; 
        this.saveToStorage(); 
      }
  }

  approveRegistration(requestId: string) {
      const req = this.registrationRequests.find(r => r.id === requestId);
      if (req) {
          req.status = 'Approved';
          req.temporaryCode = Math.floor(100000 + Math.random() * 900000).toString();
          this.saveToStorage();
      }
  }

  rejectRegistration(requestId: string) {
      const req = this.registrationRequests.find(r => r.id === requestId);
      if (req) { req.status = 'Rejected'; this.saveToStorage(); }
  }

  getRoleIncentives() { return this.roleIncentives; }
  getIndustryIncentives() { return this.industryIncentives; }
  
  updateIndustryIncentive(industry: Industry, value: number) {
      this.industryIncentives[industry] = value;
      this.saveToStorage();
  }
  
  updateRoleIncentive(role: string, incentive: RoleIncentive) {
      this.roleIncentives[role] = incentive;
      this.saveToStorage();
  }

  findBuyersForProduct(productName: string) {
      return this.customers.filter(c => c.commonProducts?.toLowerCase().includes(productName.toLowerCase()));
  }

  updateProductPrice(productId: string, price: number) {
      const p = this.products.find(prod => prod.id === productId);
      if (p) { p.defaultPricePerKg = price; this.saveToStorage(); }
  }

  addAppNotification(userId: string, title: string, message: string, type: any) {
      const n: AppNotification = {
          id: `notif-${Date.now()}`,
          userId,
          title,
          message,
          type,
          timestamp: new Date().toISOString(),
          isRead: false
      };
      this.notifications.push(n);
      this.saveToStorage();
  }

  getWholesalers() { return this.users.filter(u => u.role === UserRole.WHOLESALER); }

  submitSignup(data: any) {
      const req: RegistrationRequest = {
          id: `req-${Date.now()}`,
          businessName: data.businessName,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          mobile: data.mobile,
          requestedRole: data.requestedRole,
          status: 'Pending',
          submittedDate: new Date().toISOString(),
          consumerData: {
              location: data.location,
              mobile: data.mobile
          }
      };
      this.registrationRequests.push(req);
      this.saveToStorage();
  }

  submitOrderIssue(orderId: string, type: string, description: string) {
      const o = this.orders.find(ord => ord.id === orderId);
      if (o) {
          const issue: OrderIssue = {
              id: `iss-${Date.now()}`,
              orderId,
              type,
              description,
              reportedAt: new Date().toISOString(),
              supplierStatus: 'PENDING',
              repStatus: 'UNSEEN'
          };
          o.issue = issue;
          this.issues.push(issue);
          this.saveToStorage();
      }
  }

  addPacker(packer: Packer) { this.packers.push(packer); this.saveToStorage(); }
  
  getPackerOrders(packerId: string) {
      return this.orders.filter(o => o.status === 'Confirmed' || o.status === 'Pending');
  }

  onboardNewBusiness(data: any) {
      const user: User = {
          id: `u-${Date.now()}`,
          name: data.businessName,
          businessName: data.businessName,
          email: data.email,
          role: data.role,
          isConfirmed: false,
          hasSetCredentials: false
      };
      this.users.push(user);
      this.saveToStorage();
      return user;
  }

  deleteUser(userId: string) {
      this.users = this.users.filter(u => u.id !== userId);
      this.saveToStorage();
  }

  sendOnboardingComms(customerId: string) {
      console.log(`Sending onboarding comms to ${customerId}`);
  }

  getAppNotifications(userId: string) { return this.notifications.filter(n => n.userId === userId); }
  
  markNotificationAsRead(id: string) {
      const n = this.notifications.find(notif => notif.id === id);
      if (n) { n.isRead = true; this.saveToStorage(); }
  }
  
  markAllNotificationsRead(userId: string) {
      this.notifications.filter(n => n.userId === userId).forEach(n => n.isRead = true);
      this.saveToStorage();
  }

  createManualPortalInvite(data: any) {
      const req: RegistrationRequest = {
          id: `req-${Date.now()}`,
          businessName: data.businessName,
          firstName: data.firstName || data.name,
          lastName: data.lastName || '',
          email: data.email,
          mobile: data.mobile,
          requestedRole: data.role || UserRole.CONSUMER,
          status: 'Approved',
          submittedDate: new Date().toISOString(),
          temporaryCode: Math.floor(100000 + Math.random() * 900000).toString()
      };
      this.registrationRequests.push(req);
      this.saveToStorage();
      return { id: req.id, code: req.temporaryCode };
  }

  uploadToDeli(data: any, businessName: string) {
      console.log(`Uploading ${data.productName} for ${businessName} to The Deli App`);
  }

  updateUserInterests(userId: string, selling: string[], buying: string[]) {
      const u = this.users.find(user => user.id === userId);
      if (u) {
          u.activeSellingInterests = selling;
          u.activeBuyingInterests = buying;
          this.saveToStorage();
      }
  }

  getClearanceLots() { return this.clearanceLots; }
  addClearanceLot(lot: ClearanceLot) { this.clearanceLots.push(lot); this.saveToStorage(); }

  getTodayIssues() { return this.issues.filter(i => new Date(i.reportedAt).toDateString() === new Date().toDateString()); }

  updateSupplierPriceRequestResponse(requestId: string, items: SupplierPriceRequestItem[]) {
      const req = this.supplierPriceRequests.find(r => r.id === requestId);
      if (req) {
          req.status = 'SUBMITTED';
          req.items = items;
          this.saveToStorage();
      }
  }
}

const USERS_INITIAL: User[] = [
  { id: 'u1', name: 'Admin User', businessName: 'Platform Zero HQ', role: UserRole.ADMIN, email: 'admin@pz.com', favoriteProductIds: [], isConfirmed: true, hasSetCredentials: true },
  { id: 'u-rep1', name: 'Mark Representative', businessName: 'Platform Zero', role: UserRole.PZ_REP, email: 'mark@rep.com', commissionRate: 5, isConfirmed: true, hasSetCredentials: true },
  { id: 'u2', name: 'Sarah Wholesaler', businessName: 'Fresh Wholesalers Adelaide', role: UserRole.WHOLESALER, email: 'sarah@fresh.com', phone: '0411 111 111', dashboardVersion: 'v2', businessProfile: { isComplete: true } as any, favoriteProductIds: [], isConfirmed: true, hasSetCredentials: true },
  { id: 'u3', name: 'Bob Farmer', businessName: 'Green Valley Farms', role: UserRole.FARMER, email: 'bob@greenvalley.com', favoriteProductIds: [], isConfirmed: true, hasSetCredentials: true },
  { id: 'u4', name: 'Alice Consumer', businessName: 'The Morning Cafe', role: UserRole.CONSUMER, email: 'alice@cafe.com', industry: 'Cafe', favoriteProductIds: ['p1'], isConfirmed: true, hasSetCredentials: true },
  { id: 'u5', name: 'Gary Grocer', businessName: 'Local Corner Grocers', role: UserRole.GROCERY, email: 'gary@grocer.com', industry: 'Grocery Store', favoriteProductIds: [], isConfirmed: true, hasSetCredentials: true },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Roma Tomatoes', variety: 'Truss', category: 'Vegetable', imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400', defaultPricePerKg: 4.50, unit: 'KG' },
  { id: 'p2', name: 'Iceberg Lettuce', variety: 'Crisp', category: 'Vegetable', imageUrl: 'https://images.unsplash.com/photo-1622206141855-8979313f8981?auto=format&fit=crop&q=80&w=400', defaultPricePerKg: 3.20, unit: 'KG' },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv1', ownerId: 'u2', productId: 'p1', lotNumber: 'PZ-LOT-1001', quantityKg: 30, status: 'Available', uploadedAt: new Date().toISOString(), harvestDate: new Date().toISOString(), expiryDate: new Date(Date.now() + 86400000 * 5).toISOString() },
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'u4', businessName: 'The Morning Cafe', contactName: 'Alice Consumer', email: 'alice@cafe.com', phone: '0433 333 333', category: 'Cafe', location: 'Adelaide CBD', connectedSupplierId: 'u2', connectedSupplierName: 'Fresh Wholesalers Adelaide', connectionStatus: 'Active', pzMarkup: 15, pzPaymentTermsDays: 7, commonProducts: 'Tomatoes, Lettuce', assignedPzRepId: 'u-rep1', assignedPzRepName: 'Mark Representative' },
];

const INITIAL_ORDERS: Order[] = [
  { id: 'o-101', buyerId: 'u4', sellerId: 'u2', status: 'Delivered', date: new Date().toISOString(), totalAmount: 325.00, items: [{ productId: 'p1', quantityKg: 50, pricePerKg: 4.50 }], paymentStatus: 'Paid', source: 'Marketplace' },
  { id: 'o-102', buyerId: 'u4', sellerId: 'u2', status: 'Delivered', date: new Date().toISOString(), totalAmount: 185.00, items: [{ productId: 'p1', quantityKg: 50, pricePerKg: 4.50 }], paymentStatus: 'Paid', source: 'Marketplace' },
  { id: 'o-103', buyerId: 'u4', sellerId: 'u2', status: 'Delivered', date: new Date().toISOString(), totalAmount: 450.00, items: [{ productId: 'p1', quantityKg: 50, pricePerKg: 4.50 }], paymentStatus: 'Paid', source: 'Marketplace' },
];

const INITIAL_LEADS: Lead[] = [
    { id: 'l1', businessName: 'ADELAIDE HILLS BISTRO', contactName: 'Sarah Smith', email: 'sarah@ccc.com', phone: '0400 111 222', status: 'DISCOVERY', state: 'SA', potentialRevenue: 4500, timestamp: new Date().toISOString(), suburb: 'CRAFERS, SA', assignedRepId: 'u-rep1' },
    { id: 'l2', businessName: 'CITY CENTRAL CATERING', contactName: 'Sarah Smith', email: 'sarah@ccc.com', phone: '0400 111 222', status: 'ENGAGEMENT', state: 'SA', potentialRevenue: 12000, timestamp: new Date().toISOString(), suburb: 'ADELAIDE CBD', assignedRepId: 'u-rep1' },
    { id: 'l3', businessName: 'ORGANIC GROCERS CO', contactName: 'Michael Brown', email: 'mike@org.com', phone: '0400 333 444', status: 'PROPOSAL', state: 'SA', potentialRevenue: 8000, timestamp: new Date().toISOString(), suburb: 'NORWOOD, SA', assignedRepId: 'u-rep1' },
    { id: 'l4', businessName: 'THE SALAD BAR', contactName: 'James Bond', email: 'james@ harbour.com', phone: '0412 121 121', status: 'CLOSING', state: 'SA', potentialRevenue: 3200, timestamp: new Date().toISOString(), suburb: 'UNLEY, SA', assignedRepId: 'u-rep1' },
];

export const mockService = new MockDataService();
