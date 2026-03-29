export default function LoadingSpinner() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
        <p className="text-xl font-semibold text-purple-900">Loading Dashboard...</p>
      </div>
    </main>
  )
}