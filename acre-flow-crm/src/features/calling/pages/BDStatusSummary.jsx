import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Spin, Space, Card, Row, Col, Statistic, Tag, Typography, Drawer, Avatar, Badge, Descriptions } from 'antd';
import { ReloadOutlined, UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, HomeOutlined, MessageOutlined, MobileOutlined, CloseOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import DashboardLayout from '@/layout/DashboardLayout';
import BDStatusSummaryMobile from './BDStatusSummary.mobile';
import './BDStatusSummary.css';

const { Title, Text } = Typography;

export default function BDStatusSummary() {
  const userRole = localStorage.getItem('userRole') || 'super-admin';
  const userName = localStorage.getItem('userName') || 'User';
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [forceMobile, setForceMobile] = useState(false);
  
  // Detect mobile device and handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width <= 768);
    };
    
    // Initial detection
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Also check user agent for mobile devices
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  // Use combined detection or force mobile
  const shouldUseMobile = forceMobile || isMobile || isMobileDevice || windowWidth <= 768;
  
  // Debug log
  console.log('📱 Mobile Detection Debug:', {
    windowWidth,
    isMobile,
    isMobileDevice,
    forceMobile,
    shouldUseMobile,
    userAgent: navigator.userAgent,
    platform: navigator.platform
  });
  
  // Additional debug for mobile component
  console.log('📱 BDStatusSummaryMobile component loaded:', !!BDStatusSummaryMobile);
  
  // Force mobile view for testing - remove this in production
  const forceTestMobile = true; // Set to false to disable
  
  // Return mobile component for mobile devices
  if (shouldUseMobile || forceTestMobile) {
    console.log('📱 Using Mobile View', { shouldUseMobile, forceTestMobile });
    try {
      return <BDStatusSummaryMobile userRole={userRole} />;
    } catch (error) {
      console.error('❌ Error rendering mobile component:', error);
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3>Mobile View Error</h3>
          <p>Could not load mobile view: {error.message}</p>
          <button onClick={() => setForceMobile(false)}>Try Desktop View</button>
        </div>
      );
    }
  } else {
    console.log('🖥️ Using Desktop View');
  }
  
  const [loading, setLoading] = useState(true);
  const [bdSummary, setBdSummary] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBD, setSelectedBD] = useState(null);
  const [bdDetails, setBdDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchBDSummary = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching BD Summary from frontend...');
      const token = localStorage.getItem('token');
      console.log('🔑 Token exists:', !!token);
      
      const response = await fetch('https://bcrm.100acress.com/api/leads/bd-status-summary', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 BD Summary Response:', data);
      setBdSummary(data.data || []);
    } catch (error) {
      console.error('❌ Error fetching BD summary:', error);
      // Try test API as fallback
      try {
        console.log('🔄 Trying test API...');
        const testResponse = await fetch('https://bcrm.100acress.com/test-bd-status');
        const testData = await testResponse.json();
        console.log('📊 Test API Response:', testData);
        if (testData.success) {
          setBdSummary(testData.data || []);
        }
      } catch (testError) {
        console.error('❌ Test API also failed:', testError);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBDDetails = async (bdId) => {
    setDetailsLoading(true);
    try {
      console.log('🔄 Fetching BD Details from frontend...');
      const token = localStorage.getItem('token');
      
      const response = await fetch(`https://bcrm.100acress.com/api/leads/bd-status/${bdId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      console.log('📡 BD Details Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 BD Details Response:', data);
      setBdDetails(data.data || null);
    } catch (error) {
      console.error('❌ Error fetching BD details:', error);
      setBdDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchBDSummary();
    
    // Set up polling for real-time updates every 10 seconds
    const interval = setInterval(() => {
      fetchBDSummary();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleViewDetails = async (record) => {
    setSelectedBD(record);
    setModalVisible(true);
    await fetchBDDetails(record.bdId);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedBD(null);
    setBdDetails(null);
  };

  // Simplified columns - only Name, Email, and View Details
  const columns = [
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name',
      width: '35%'
    },
    { 
      title: 'Email', 
      dataIndex: 'email', 
      key: 'email',
      width: '45%'
    },
    {
      title: 'Action',
      key: 'action',
      width: '20%',
      render: (_, record) => (
        <Button 
          onClick={() => handleViewDetails(record)} 
          size="small"
          type="primary"
          icon={<UserOutlined />}
        >
          View Details
        </Button>
      ),
    },
  ];

  // Function to render assignment chain hierarchy
  const renderAssignmentChain = (chain) => {
    if (!chain || chain.length === 0) return 'No assignments';
    
    return (
      <div style={{ fontSize: '12px' }}>
        {chain.map((entry, index) => (
          <div key={index} style={{ marginBottom: '8px', padding: '8px', backgroundColor: entry.status === 'assigned' ? '#f0f9ff' : entry.status === 'completed' ? '#f0fdf4' : '#fef2f2', borderRadius: '4px' }}>
            <div style={{ fontWeight: 'bold', color: '#1e40af' }}>{entry.name} ({entry.role})</div>
            <div style={{ color: '#6b7280', marginTop: '4px' }}>Status: <span style={{ fontWeight: 'bold', color: entry.status === 'assigned' ? '#2563eb' : entry.status === 'completed' ? '#16a34a' : '#dc2626' }}>{entry.status}</span></div>
            <div style={{ color: '#6b7280' }}>Assigned: {new Date(entry.assignedAt).toLocaleDateString()}</div>
            {entry.completedAt && <div style={{ color: '#6b7280' }}>Completed: {new Date(entry.completedAt).toLocaleDateString()}</div>}
            {entry.notes && <div style={{ color: '#6b7280', fontStyle: 'italic' }}>Notes: {entry.notes}</div>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout userRole={userRole}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <div style={{ flex: 1, padding: 24 }}>
          {/* User Info Header */}
          <div style={{ 
            marginBottom: '20px', 
            padding: '16px', 
            backgroundColor: '#f8fafc', 
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar size="large" icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              <div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>
                  {userName}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  BD Status Summary
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button 
                type="text" 
                icon={<MessageOutlined />}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}
                onClick={() => {
                  console.log('Message clicked');
                }}
              >
                Message
              </Button>
              <Button 
                type={forceMobile ? 'primary' : 'text'}
                icon={<MobileOutlined />}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  fontSize: '14px',
                  backgroundColor: forceMobile ? '#1890ff' : 'transparent',
                  color: forceMobile ? '#fff' : undefined
                }}
                onClick={() => {
                  setForceMobile(!forceMobile);
                  console.log('Force Mobile:', !forceMobile);
                }}
              >
                {forceMobile ? 'Desktop View' : 'Mobile View'}
              </Button>
            </div>
          </div>

          {/* Summary View */}
          <div>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={3} style={{ margin: 0 }}>BD Lead Status Analytics</Title>
              <Space>
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />} 
                  onClick={fetchBDSummary}
                  loading={loading}
                >
                  Refresh
                </Button>
              </Space>
            </div>
            
            {/* Main Table - Simplified */}
            <div className="table-container">
              <Table
                columns={columns}
                dataSource={bdSummary}
                rowKey="bdId"
                loading={loading}
                pagination={{ 
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                }}
                scroll={{ x: 800 }}
                size="middle"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar size="large" icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
            <div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {selectedBD?.name || 'BD Details'}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal' }}>
                {selectedBD?.email}
              </div>
            </div>
          </div>
        }
        open={modalVisible}
        onCancel={handleCloseModal}
        width={1200}
        footer={[
          <Button key="close" type="primary" onClick={handleCloseModal}>
            Close
          </Button>
        ]}
        closeIcon={<CloseOutlined />}
      >
        {detailsLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', color: '#666' }}>Loading BD details...</div>
          </div>
        ) : !bdDetails ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <div style={{ fontSize: '16px', color: '#666' }}>No data found for this BD</div>
          </div>
        ) : (
          <>
            {/* BD Statistics Overview */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={12} md={8}>
                <Card 
                  style={{ 
                    background: 'linear-gradient(135deg, #fef3f2 0%, #fee4e2 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <Statistic
                    title={<span style={{ color: '#64748b', fontSize: '14px' }}>Total Leads</span>}
                    value={selectedBD?.totalLeads || 0}
                    valueStyle={{ color: '#dc2626', fontSize: '28px', fontWeight: 'bold' }}
                    prefix={<UserOutlined style={{ fontSize: '20px', marginRight: '8px' }} />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card 
                  style={{ 
                    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <Statistic
                    title={<span style={{ color: '#64748b', fontSize: '14px' }}>Hot Leads</span>}
                    value={selectedBD?.hot || 0}
                    valueStyle={{ color: '#dc2626', fontSize: '28px', fontWeight: 'bold' }}
                    prefix={<span style={{ fontSize: '20px', marginRight: '8px' }}>🔥</span>}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card 
                  style={{ 
                    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <Statistic
                    title={<span style={{ color: '#64748b', fontSize: '14px' }}>Warm Leads</span>}
                    value={selectedBD?.warm || 0}
                    valueStyle={{ color: '#f59e0b', fontSize: '28px', fontWeight: 'bold' }}
                    prefix={<span style={{ fontSize: '20px', marginRight: '8px' }}>🌡️</span>}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card 
                  style={{ 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <Statistic
                    title={<span style={{ color: '#64748b', fontSize: '14px' }}>Cold Leads</span>}
                    value={selectedBD?.cold || 0}
                    valueStyle={{ color: '#6b7280', fontSize: '28px', fontWeight: 'bold' }}
                    prefix={<span style={{ fontSize: '20px', marginRight: '8px' }}>❄️</span>}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card 
                  style={{ 
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <Statistic
                    title={<span style={{ color: '#64748b', fontSize: '14px' }}>Follow-ups</span>}
                    value={selectedBD?.followUps || 0}
                    valueStyle={{ color: '#10b981', fontSize: '28px', fontWeight: 'bold' }}
                    prefix={<MessageOutlined style={{ fontSize: '20px', marginRight: '8px' }} />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card 
                  style={{ 
                    background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <Statistic
                    title={<span style={{ color: '#64748b', fontSize: '14px' }}>Conversion Rate</span>}
                    value={selectedBD?.conversionRate || 0}
                    suffix="%"
                    valueStyle={{ color: '#8b5cf6', fontSize: '28px', fontWeight: 'bold' }}
                    prefix={<span style={{ fontSize: '20px', marginRight: '8px' }}>📈</span>}
                  />
                </Card>
              </Col>
            </Row>

            {/* Circular Charts Section - Side by Side */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col xs={24} md={12}>
                <Card 
                  style={{ 
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    height: '100%'
                  }}
                >
                  <Title level={5} style={{ marginBottom: '16px', textAlign: 'center' }}>Lead Status Distribution</Title>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Hot Leads', value: selectedBD?.hot || 0, color: '#dc2626' },
                          { name: 'Warm Leads', value: selectedBD?.warm || 0, color: '#f59e0b' },
                          { name: 'Cold Leads', value: selectedBD?.cold || 0, color: '#6b7280' },
                        ]}
                        cx="50%"
                        cy="45%"
                        labelLine={false}
                        label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Hot Leads', value: selectedBD?.hot || 0, color: '#dc2626' },
                          { name: 'Warm Leads', value: selectedBD?.warm || 0, color: '#f59e0b' },
                          { name: 'Cold Leads', value: selectedBD?.cold || 0, color: '#6b7280' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend 
                        verticalAlign="bottom" 
                        height={30}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              
              <Col xs={24} md={12}>
                <Card 
                  style={{ 
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    height: '100%'
                  }}
                >
                  <Title level={5} style={{ marginBottom: '16px', textAlign: 'center' }}>Work Progress Distribution</Title>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { 
                            name: 'Pending', 
                            value: bdDetails?.leads?.filter(l => !l.workProgress || l.workProgress === 'pending').length || 0, 
                            color: '#fbbf24' 
                          },
                          { 
                            name: 'In Progress', 
                            value: bdDetails?.leads?.filter(l => l.workProgress === 'inprogress').length || 0, 
                            color: '#3b82f6' 
                          },
                          { 
                            name: 'Done', 
                            value: bdDetails?.leads?.filter(l => l.workProgress === 'done').length || 0, 
                            color: '#10b981' 
                          },
                        ]}
                        cx="50%"
                        cy="45%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Pending', color: '#fbbf24' },
                          { name: 'In Progress', color: '#3b82f6' },
                          { name: 'Done', color: '#10b981' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend 
                        verticalAlign="bottom" 
                        height={30}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            {/* Leads Details Table */}
            <div style={{ marginTop: '24px' }}>
              <Title level={5} style={{ marginBottom: '16px' }}>Lead Details</Title>
              <Table
                columns={[
                  { title: 'Lead Name', dataIndex: 'name', key: 'name', width: 150 },
                  { 
                    title: 'Status', 
                    dataIndex: 'status', 
                    key: 'status',
                    width: 100,
                    render: (status) => {
                      const colors = {
                        Hot: '#dc2626',
                        Warm: '#f59e0b',
                        Cold: '#6b7280'
                      };
                      return (
                        <Tag color={colors[status] || '#6b7280'}>
                          {status}
                        </Tag>
                      );
                    }
                  },
                  { 
                    title: 'Follow-ups', 
                    dataIndex: 'followUps', 
                    key: 'followUps', 
                    width: 100,
                    render: (f) => (f ? f.length : 0) 
                  },
                  { title: 'Budget', dataIndex: 'budget', key: 'budget', width: 120 },
                  { title: 'Location', dataIndex: 'location', key: 'location', width: 150 },
                  { 
                    title: 'Work Progress', 
                    dataIndex: 'workProgress', 
                    key: 'workProgress',
                    width: 120,
                    render: (progress) => {
                      const config = {
                        pending: { color: '#fbbf24', label: 'PENDING' },
                        inprogress: { color: '#3b82f6', label: 'IN PROGRESS' },
                        done: { color: '#10b981', label: 'DONE' }
                      };
                      const curr = config[progress] || { color: '#6b7280', label: 'PENDING' };
                      return (
                        <Tag color={curr.color} style={{ fontWeight: 'bold' }}>
                          {curr.label}
                        </Tag>
                      );
                    }
                  },
                  { 
                    title: 'Assignment Hierarchy', 
                    dataIndex: 'assignmentChain', 
                    key: 'assignmentChain',
                    width: 250,
                    render: renderAssignmentChain
                  },
                ]}
                dataSource={bdDetails.leads || []}
                rowKey="_id"
                pagination={{ 
                  pageSize: 5,
                  showSizeChanger: true,
                  size: 'small'
                }}
                size="small"
                scroll={{ x: 1000, y: 400 }}
                expandable={{
                  expandedRowRender: (record) => (
                    <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                      <h4 style={{ marginBottom: '12px', color: '#374151' }}>Lead Details</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div><strong>Phone:</strong> {record.phone || 'N/A'}</div>
                        <div><strong>Property:</strong> {record.property || 'N/A'}</div>
                        <div><strong>Email:</strong> {record.email}</div>
                        <div><strong>Created:</strong> {new Date(record.createdAt).toLocaleDateString()}</div>
                      </div>
                      {record.followUps && record.followUps.length > 0 && (
                        <div style={{ marginTop: '12px' }}>
                          <h5 style={{ marginBottom: '8px', color: '#374151' }}>Follow-ups:</h5>
                          {record.followUps.map((followUp, index) => (
                            <div key={index} style={{ 
                              padding: '8px', 
                              backgroundColor: 'white', 
                              borderRadius: '4px', 
                              marginBottom: '4px',
                              border: '1px solid #e5e7eb'
                            }}>
                              <div style={{ fontWeight: 'bold', color: '#1f2937' }}>{followUp.comment}</div>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                {followUp.author} ({followUp.role}) - {followUp.timestamp}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ),
                  rowExpandable: (record) => true,
                }}
              />
            </div>
          </>
        )}
      </Modal>
    </DashboardLayout>
  );
}