function UsersLoadingSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="bg-orange-100/40 p-3 rounded-xl animate-pulse border border-orange-100/50">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-orange-200/60 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-orange-200/60 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-orange-200/40 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default UsersLoadingSkeleton;

