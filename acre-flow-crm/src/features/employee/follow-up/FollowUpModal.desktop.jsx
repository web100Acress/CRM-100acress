import React from 'react';
import FollowUpModal from './FollowUpModal';

const FollowUpModalDesktop = ({ lead, onClose, userRole }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <FollowUpModal lead={lead} onClose={onClose} userRole={userRole} />
      </div>
    </div>
  );
};

export default FollowUpModalDesktop;
