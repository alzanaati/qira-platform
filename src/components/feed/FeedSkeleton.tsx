export default function FeedSkeleton() {
  return (
    <div className="w-full h-screen bg-gray-900 animate-pulse flex flex-col justify-end p-6">
      <div className="flex items-end gap-3">
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-700 rounded-full w-32" />
          <div className="h-4 bg-gray-700 rounded-full w-48" />
          <div className="h-4 bg-gray-700 rounded-full w-24" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 bg-gray-700 rounded-full" />
          <div className="w-12 h-12 bg-gray-700 rounded-full" />
          <div className="w-12 h-12 bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}