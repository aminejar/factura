export interface Invoice {
  id: string
  createTs: string
  status: 'open' | 'paid' | 'partially_paid' | 'overdue' | 'uncollectible' | 'void'
  value: number
  customer: {
    name: string
    email: string
  }
}

export const mockInvoices: Invoice[] = [
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

