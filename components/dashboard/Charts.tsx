import { Bar, Line } from 'react-chartjs-2'
import { chartConfig } from '@/lib/chartConfig'
import { useInvoices } from '@/lib/hooks/useInvoices'
import { useState } from 'react'

export default function Charts() {
  const { invoices, error } = useInvoices()
  const [chartError, setChartError] = useState<string | null>(null)

  // Generate chart data from real invoices
  const generateChartData = () => {
    try {
      // Group invoices by month for the last 6 months
      const now = new Date()
      const months = []
      const revenueByMonth = {}
      const invoicesByMonth = {}

      // Generate last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        months.push(monthKey)
        revenueByMonth[monthKey] = 0
        invoicesByMonth[monthKey] = 0
      }

      // Aggregate data
      invoices.forEach(invoice => {
        try {
          const invoiceDate = new Date(invoice.createTs)
          if (isNaN(invoiceDate.getTime())) {
            console.warn('Invalid invoice date:', invoice.createTs)
            return // Skip invalid dates
          }

          const monthKey = invoiceDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

          if (revenueByMonth[monthKey] !== undefined) {
            revenueByMonth[monthKey] += invoice.value / 100 // Convert to TND
            invoicesByMonth[monthKey] += 1
          }
        } catch (err) {
          console.warn('Error processing invoice for chart:', invoice.id, err)
        }
      })

      return {
        months,
        revenues: months.map(month => revenueByMonth[month]),
        invoiceCounts: months.map(month => invoicesByMonth[month])
      }
    } catch (err) {
      console.error('Error generating chart data:', err)
      setChartError('Failed to generate chart data')
      // Return fallback data
      return {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        revenues: [0, 0, 0, 0, 0, 0],
        invoiceCounts: [0, 0, 0, 0, 0, 0]
      }
    }
  }

  const chartData = generateChartData()

  const barChartData = {
    labels: chartData.months,
    datasets: [{
      label: 'Revenue (TND)',
      data: chartData.revenues,
      backgroundColor: 'rgba(147, 51, 234, 0.8)',
      borderRadius: 8,
      borderWidth: 0,
    }],
  }

  const lineChartData = {
    labels: chartData.months,
    datasets: [{
      label: 'Revenue Growth',
      data: chartData.revenues,
      borderColor: 'rgb(147, 51, 234)',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: 'rgb(147, 51, 234)',
    }],
  }

  const chartOptions = chartConfig.chartOptions

  // Handle chart rendering errors
  const renderChart = (ChartComponent: any, data: any, title: string) => {
    try {
      return <ChartComponent data={data} options={chartOptions} />
    } catch (err) {
      console.error(`Error rendering ${title} chart:`, err)
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <p className="text-sm">Unable to load {title.toLowerCase()} chart</p>
          </div>
        </div>
      )
    }
  }

  if (error || chartError) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Charts Unavailable</h3>
        <p className="text-yellow-700 text-sm">
          {error || chartError || 'Unable to load chart data. Please check your connection.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Monthly Revenue</h3>
          <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            View Details
          </button>
        </div>
        <div className="h-64">
          {renderChart(Bar, barChartData, 'Revenue')}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Revenue Trend</h3>
          <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            View Details
          </button>
        </div>
        <div className="h-64">
          {renderChart(Line, lineChartData, 'Trend')}
        </div>
      </div>
    </div>
  )
}