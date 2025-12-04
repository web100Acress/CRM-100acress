import React from 'react';
import { FileText, Plus, Search, Filter } from 'lucide-react';

const ListedProperties = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Listed Properties</h2>
          <p className="text-gray-600">Manage all property listings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          <span>Add Property</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search properties..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((property) => (
          <div key={property} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Property {property}</h3>
              <p className="text-gray-600 text-sm mb-3">Beautiful property in prime location</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-blue-600">$250,000</span>
                <span className="text-sm text-gray-500">3 Beds • 2 Baths</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListedProperties;
