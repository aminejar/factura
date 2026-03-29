// lib/invoiceStore.ts - Store simple pour gérer l'état global
import { Invoice } from './mockData'

class InvoiceStore {
  private static instance: InvoiceStore
  private invoices: Invoice[] = []
  private listeners: (() => void)[] = []

  private constructor() {
    // Charger les données mockées au démarrage
    this.loadInitialData()
  }

  static getInstance(): InvoiceStore {
    if (!InvoiceStore.instance) {
      InvoiceStore.instance = new InvoiceStore()
    }
    return InvoiceStore.instance
  }

  private loadInitialData() {
    // Charger depuis localStorage ou données mock
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('facturaa_invoices')
      if (stored) {
        this.invoices = JSON.parse(stored)
      } else {
        // Données initiales mockées
        this.invoices = [
          {
            id: '1',
            createTs: '2024-01-15',
            status: 'paid',
            value: 250000,
            customer: { name: 'TechCorp SARL', email: 'contact@techcorp.tn' }
          },
          {
            id: '2',
            createTs: '2024-01-20',
            status: 'open',
            value: 150000,
            customer: { name: 'Digital Solutions', email: 'info@digital.tn' }
          },
          {
            id: '3',
            createTs: '2024-01-25',
            status: 'paid',
            value: 180000,
            customer: { name: 'Innovate Plus', email: 'contact@innovate.tn' }
          },
          {
            id: '4',
            createTs: '2024-02-01',
            status: 'uncollectible',
            value: 90000,
            customer: { name: 'StartUp Co', email: 'hello@startup.tn' }
          },
          {
            id: '5',
            createTs: '2024-02-05',
            status: 'paid',
            value: 320000,
            customer: { name: 'Global Trade Ltd', email: 'sales@global.tn' }
          },
          {
            id: '6',
            createTs: '2024-02-10',
            status: 'open',
            value: 120000,
            customer: { name: 'Creative Agency', email: 'hello@creative.tn' }
          },
        ]
        this.saveToStorage()
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('facturaa_invoices', JSON.stringify(this.invoices))
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

  getAll(): Invoice[] {
    return [...this.invoices]
  }

  getById(id: string): Invoice | undefined {
    return this.invoices.find(inv => inv.id === id)
  }

  create(invoice: Omit<Invoice, 'id' | 'createTs'>): Invoice {
    const newInvoice: Invoice = {
      ...invoice,
      id: String(Date.now()),
      createTs: new Date().toISOString().split('T')[0]
    }
    this.invoices.unshift(newInvoice) // Ajouter au début
    this.saveToStorage()
    this.notify()
    return newInvoice
  }

  update(id: string, updates: Partial<Invoice>): Invoice | null {
    const index = this.invoices.findIndex(inv => inv.id === id)
    if (index === -1) return null
    
    this.invoices[index] = { ...this.invoices[index], ...updates }
    this.saveToStorage()
    this.notify()
    return this.invoices[index]
  }

  delete(id: string): boolean {
    const index = this.invoices.findIndex(inv => inv.id === id)
    if (index === -1) return false
    
    this.invoices.splice(index, 1)
    this.saveToStorage()
    this.notify()
    return true
  }
}

export const invoiceStore = InvoiceStore.getInstance()