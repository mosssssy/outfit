import React from "react";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Outfit Color Picker</h1>
      <p className="text-gray-600 mb-6">
        Discover your perfect color combination for any outfit
      </p>
      <div className="space-y-4">
        <button className="w-64 py-3 bg-white text-gray-800 font-medium border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-center">
          <span className="mr-2">🎨</span> Try Color Picker
        </button>
        <button className="w-64 py-3 bg-white text-gray-800 font-medium border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-center">
          <span className="mr-2">👤</span> My Page
        </button>
      </div>
    </div>
  );
}

export default Home;
