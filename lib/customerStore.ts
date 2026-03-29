export interface Customer {
    id: string
    name: string
    email: string
    phone?: string
    company?: string
    totalInvoices: number
    totalRevenue: number
    createdAt: string
    }

class CustomerStore {
    private static instance: CustomerStore
    private customers: Customer[] = []
    private listeners: (() => void)[] = []

    private constructor() {
    this.loadInitialData()
    }

    static getInstance(): CustomerStore {
    if (!CustomerStore.instance) {
        CustomerStore.instance = new CustomerStore()
    }
    return CustomerStore.instance
    }

    private loadInitialData() {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('facturaa_customers')
        if (stored) {
        this.customers = JSON.parse(stored)
        } else {
        this.customers = [
            {
            id: '1',
            name: 'TechCorp SARL',
            email: 'contact@techcorp.tn',
            phone: '+216 12 345 678',
            company: 'TechCorp',
            totalInvoices: 5,
            totalRevenue: 450000,
            createdAt: '2024-01-10'
            },
            {
            id: '2',
            name: 'Digital Solutions',
            email: 'info@digital.tn',
            phone: '+216 23 456 789',
            company: 'Digital Solutions Ltd',
            totalInvoices: 3,
            totalRevenue: 280000,
            createdAt: '2024-01-15'
            },
            {
            id: '3',
            name: 'Innovate Plus',
            email: 'contact@innovate.tn',
            company: 'Innovate Plus',
            totalInvoices: 7,
            totalRevenue: 520000,
            createdAt: '2024-02-01'
            }
        ]
        this.saveToStorage()
        }
    }
    }

    private saveToStorage() {
    if (typeof window !== 'undefined') {
        localStorage.setItem('facturaa_customers', JSON.stringify(this.customers))
    }
    }

    subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => {
        this.listeners = this.listeners.filter(l => l !== listener)
    }
    }

    private notify() {
    this.listeners.forEach(listener => listener())
    }

    getAll(): Customer[] {
    return [...this.customers]
    }

    getById(id: string): Customer | undefined {
    return this.customers.find(c => c.id === id)
    }

    create(customer: Omit<Customer, 'id' | 'createdAt' | 'totalInvoices' | 'totalRevenue'>): Customer {
    const newCustomer: Customer = {
        ...customer,
        id: String(Date.now()),
        createdAt: new Date().toISOString().split('T')[0],
        totalInvoices: 0,
        totalRevenue: 0
    }
    this.customers.unshift(newCustomer)
    this.saveToStorage()
    this.notify()
    return newCustomer
    }

    update(id: string, updates: Partial<Customer>): Customer | null {
    const index = this.customers.findIndex(c => c.id === id)
    if (index === -1) return null
    
    this.customers[index] = { ...this.customers[index], ...updates }
    this.saveToStorage()
    this.notify()
    return this.customers[index]
    }

    delete(id: string): boolean {
    const index = this.customers.findIndex(c => c.id === id)
    if (index === -1) return false
    
    this.customers.splice(index, 1)
    this.saveToStorage()
    this.notify()
    return true
    }
}

export const customerStore = CustomerStore.getInstance()