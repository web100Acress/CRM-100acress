import React from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import MobileDashboard from './MobileDashboard';
import Desktopdashboard from './Desktopdashboard';

const Dashboard = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return <MobileDashboard />;
  }

  return <Desktopdashboard />;
};

export default Dashboard;
