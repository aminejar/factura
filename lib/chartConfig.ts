import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export const chartConfig = {
  barChartData: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Revenue (TND)',
      data: [5000, 12000, 7500, 9000],
      backgroundColor: 'rgba(147, 51, 234, 0.8)',
      borderRadius: 8,
      borderWidth: 0,
    }],
  },
  lineChartData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue Growth',
      data: [3000, 5000, 4000, 7000, 6000, 9000],
      borderColor: 'rgb(147, 51, 234)',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: 'rgb(147, 51, 234)',
    }],
  },
  chartOptions: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { size: 12 } },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { color: '#6b7280', font: { size: 12 } },
      },
    },
  }
}