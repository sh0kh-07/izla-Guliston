export default function Loading() {
    return (
        <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="animate-pulse bg-white rounded-2xl shadow-md p-5 space-y-4"
                    >
                        {/* Image */}
                        <div className="w-full h-40 bg-gray-200 rounded-xl"></div>
                        {/* Title */}
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        {/* Text */}
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                        {/* Button */}
                        <div className="h-10 bg-gray-200 rounded-lg w-1/2"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}