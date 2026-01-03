import React from 'react';
import ItInfrastructure from '@/features/it/pages/ItInfrastructure';

const ItInfrastructureDesktop = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">IT Infrastructure</h1>
        <ItInfrastructure />
      </div>
    </div>
  );
};

export default ItInfrastructureDesktop;
