const EcoCardSkeleton = () => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        {/* Image skeleton */}
        <div className="w-full h-48 bg-gray-300"></div>
        
        <div className="p-4">
          {/* Title skeleton */}
          <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
          
          {/* Description skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
          
          {/* Meta info skeleton */}
          <div className="flex gap-4 mb-4">
            <div className="h-4 bg-gray-300 rounded w-16"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
          
          {/* Button skeleton */}
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  };
  
  export default EcoCardSkeleton;