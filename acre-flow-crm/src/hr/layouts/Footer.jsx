import React from 'react';

const HrFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              © 2024 HRMS. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HrFooter;
