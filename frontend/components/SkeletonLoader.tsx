interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular' | 'card'
  width?: string | number
  height?: string | number
  lines?: number
}

export function Skeleton({ 
  className = '', 
  variant = 'text', 
  width, 
  height, 
  lines = 1 
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"
  
  const variantClasses = {
    text: 'rounded h-4',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    card: 'rounded-xl'
  }

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1rem' : undefined)
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]}`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : '100%'
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

// Skeleton pour SalonCard
export function SalonCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <Skeleton variant="rectangular" height="200px" className="w-full" />
      <div className="p-6">
        <Skeleton variant="text" width="70%" height="24px" className="mb-2" />
        <Skeleton variant="text" lines={2} className="mb-4" />
        <div className="flex items-center justify-between mb-4">
          <Skeleton variant="text" width="100px" />
          <Skeleton variant="text" width="80px" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton variant="circular" width="20px" height="20px" />
          <Skeleton variant="text" width="120px" />
        </div>
      </div>
    </div>
  )
}

// Skeleton pour Dashboard
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <Skeleton variant="text" width="200px" height="32px" className="mb-4" />
        <Skeleton variant="text" lines={2} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
            <Skeleton variant="text" width="120px" className="mb-2" />
            <Skeleton variant="text" width="80px" height="36px" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <Skeleton variant="text" width="150px" height="24px" />
        </div>
        <div className="divide-y divide-gray-200">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton variant="circular" width="40px" height="40px" />
                <div>
                  <Skeleton variant="text" width="150px" className="mb-2" />
                  <Skeleton variant="text" width="100px" />
                </div>
              </div>
              <Skeleton variant="rectangular" width="80px" height="32px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Page Loading avec glassmorphism
export function PageLoader({ message = "Chargement..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-primary-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-700 font-medium">{message}</p>
        </div>
      </div>
    </div>
  )
}
