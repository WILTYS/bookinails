import { useState } from 'react'
import { Download, Printer, Eye, Plus, Edit, Trash2, Send } from 'lucide-react'

interface Invoice {
  id: string
  number: string
  client_name: string
  client_email: string
  date: string
  due_date: string
  services: Array<{
    name: string
    quantity: number
    unit_price: number
    total: number
  }>
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  payment_method?: string
}

// Générateur de facture PDF
function generateInvoicePDF(invoice: Invoice) {
  // Dans une vraie app, utiliser jsPDF ou une API backend
  console.log('Génération PDF pour facture:', invoice.number)
  
  // Simuler le téléchargement
  const element = document.createElement('a')
  const file = new Blob([`Facture ${invoice.number} - ${invoice.client_name}`], { type: 'text/plain' })
  element.href = URL.createObjectURL(file)
  element.download = `facture-${invoice.number}.pdf`
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

// Composant facture individuelle
function InvoiceCard({ invoice, onEdit, onDelete, onSend }: {
  invoice: Invoice
  onEdit: (invoice: Invoice) => void
  onDelete: (id: string) => void
  onSend: (id: string) => void
}) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800'
  }

  const statusLabels = {
    draft: 'Brouillon',
    sent: 'Envoyée',
    paid: 'Payée',
    overdue: 'En retard'
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">Facture #{invoice.number}</h4>
          <p className="text-sm text-gray-600">{invoice.client_name}</p>
          <p className="text-xs text-gray-500">{new Date(invoice.date).toLocaleDateString('fr-FR')}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">{invoice.total}€</div>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status]}`}>
            {statusLabels[invoice.status]}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => generateInvoicePDF(invoice)}
          className="flex-1 flex items-center justify-center space-x-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-3 rounded text-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>PDF</span>
        </button>
        
        {invoice.status === 'draft' && (
          <button
            onClick={() => onSend(invoice.id)}
            className="flex-1 flex items-center justify-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Envoyer</span>
          </button>
        )}
        
        <button
          onClick={() => onEdit(invoice)}
          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onDelete(invoice.id)}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Formulaire de création/édition de facture
function InvoiceForm({ invoice, onSave, onCancel }: {
  invoice?: Invoice
  onSave: (invoice: Invoice) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<Invoice>>(invoice || {
    client_name: '',
    client_email: '',
    date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    services: [{ name: '', quantity: 1, unit_price: 0, total: 0 }],
    tax_rate: 20
  })

  const updateService = (index: number, field: string, value: any) => {
    const newServices = [...(formData.services || [])]
    newServices[index] = { ...newServices[index], [field]: value }
    
    if (field === 'quantity' || field === 'unit_price') {
      newServices[index].total = newServices[index].quantity * newServices[index].unit_price
    }
    
    setFormData({ ...formData, services: newServices })
  }

  const addService = () => {
    setFormData({
      ...formData,
      services: [...(formData.services || []), { name: '', quantity: 1, unit_price: 0, total: 0 }]
    })
  }

  const removeService = (index: number) => {
    const newServices = (formData.services || []).filter((_, i) => i !== index)
    setFormData({ ...formData, services: newServices })
  }

  const calculateTotals = () => {
    const subtotal = (formData.services || []).reduce((sum, service) => sum + service.total, 0)
    const tax_amount = subtotal * ((formData.tax_rate || 0) / 100)
    const total = subtotal + tax_amount
    return { subtotal, tax_amount, total }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { subtotal, tax_amount, total } = calculateTotals()
    
    const invoiceData: Invoice = {
      ...formData,
      id: invoice?.id || Date.now().toString(),
      number: invoice?.number || `FAC-${Date.now().toString().slice(-6)}`,
      subtotal,
      tax_amount,
      total,
      status: 'draft'
    } as Invoice
    
    onSave(invoiceData)
  }

  const { subtotal, tax_amount, total } = calculateTotals()

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {invoice ? 'Modifier la facture' : 'Nouvelle facture'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du client
              </label>
              <input
                type="text"
                required
                value={formData.client_name || ''}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email du client
              </label>
              <input
                type="email"
                required
                value={formData.client_email || ''}
                onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de facture
              </label>
              <input
                type="date"
                required
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'échéance
              </label>
              <input
                type="date"
                required
                value={formData.due_date || ''}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Prestations</h3>
              <button
                type="button"
                onClick={addService}
                className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {(formData.services || []).map((service, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <label className="block text-xs text-gray-600 mb-1">Prestation</label>
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) => updateService(index, 'name', e.target.value)}
                      placeholder="Manucure française..."
                      className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Qté</label>
                    <input
                      type="number"
                      min="1"
                      value={service.quantity}
                      onChange={(e) => updateService(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Prix unit.</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={service.unit_price}
                      onChange={(e) => updateService(index, 'unit_price', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Total</label>
                    <div className="px-2 py-2 text-sm bg-gray-50 rounded text-right font-medium">
                      {service.total.toFixed(2)}€
                    </div>
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totaux */}
          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total HT:</span>
                  <span className="font-medium">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>TVA:</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.tax_rate || 0}
                      onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 0 })}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                    <span>% = {tax_amount.toFixed(2)}€</span>
                  </div>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total TTC:</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              {invoice ? 'Modifier' : 'Créer'} la facture
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function InvoiceGenerator() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      number: 'FAC-001',
      client_name: 'Marie Dubois',
      client_email: 'marie.dubois@email.com',
      date: '2024-01-15',
      due_date: '2024-02-15',
      services: [
        { name: 'Manucure française', quantity: 1, unit_price: 35, total: 35 },
        { name: 'Pose de gel', quantity: 1, unit_price: 45, total: 45 }
      ],
      subtotal: 80,
      tax_rate: 20,
      tax_amount: 16,
      total: 96,
      status: 'paid'
    }
  ])
  
  const [showForm, setShowForm] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>()

  const handleSaveInvoice = (invoice: Invoice) => {
    if (editingInvoice) {
      setInvoices(prev => prev.map(inv => inv.id === invoice.id ? invoice : inv))
    } else {
      setInvoices(prev => [...prev, invoice])
    }
    setShowForm(false)
    setEditingInvoice(undefined)
  }

  const handleDeleteInvoice = (id: string) => {
    if (confirm('Supprimer cette facture ?')) {
      setInvoices(prev => prev.filter(inv => inv.id !== id))
    }
  }

  const handleSendInvoice = (id: string) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === id ? { ...inv, status: 'sent' as const } : inv
    ))
  }

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Factures</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle facture</span>
        </button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Total facturé</div>
          <div className="text-2xl font-bold text-gray-900">
            {invoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(0)}€
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Factures payées</div>
          <div className="text-2xl font-bold text-green-600">
            {invoices.filter(inv => inv.status === 'paid').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">En attente</div>
          <div className="text-2xl font-bold text-blue-600">
            {invoices.filter(inv => inv.status === 'sent').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">En retard</div>
          <div className="text-2xl font-bold text-red-600">
            {invoices.filter(inv => inv.status === 'overdue').length}
          </div>
        </div>
      </div>

      {/* Liste des factures */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {invoices.map(invoice => (
          <InvoiceCard
            key={invoice.id}
            invoice={invoice}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
            onSend={handleSendInvoice}
          />
        ))}
      </div>

      {/* Formulaire */}
      {showForm && (
        <InvoiceForm
          invoice={editingInvoice}
          onSave={handleSaveInvoice}
          onCancel={() => {
            setShowForm(false)
            setEditingInvoice(undefined)
          }}
        />
      )}
    </div>
  )
}
