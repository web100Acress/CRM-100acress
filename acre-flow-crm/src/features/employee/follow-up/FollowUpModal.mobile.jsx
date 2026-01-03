import React from 'react';
import FollowUpModal from './FollowUpModal';

const FollowUpModalMobile = ({ lead, onClose, userRole }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <FollowUpModal lead={lead} onClose={onClose} userRole={userRole} />
      </div>
    </div>
  );
};

export default FollowUpModalMobile;
