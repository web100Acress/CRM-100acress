import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Spin, Space, Card, Row, Col, Statistic, Tag, Typography, Drawer, Avatar, Badge, message } from 'antd';
import { ReloadOutlined, UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, HomeOutlined, MessageOutlined, MobileOutlined } from '@ant-design/icons';
// import Sidebar from '@/layout/Sidebar';
import DashboardLayout from '@/layout/DashboardLayout';
import httpClient from '@/api/http';
import ENDPOINTS from '@/api/endpoints';
import './BDStatusSummary.css';

const { Title, Text } = Typography;

export default function BDStatusSummary() {
  const userRole = localStorage.getItem('userRole') || 'super-admin';
  const userName = localStorage.getItem('userName') || 'User';
  const [loading, setLoading] = useState(true);
  const [bdSummary, setBdSummary] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [bdDetails, setBdDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isSingleBDView, setIsSingleBDView] = useState(false);
  const [currentBDId, setCurrentBDId] = useState(null);

  const fetchBDDetails = async (bdId) => {
    setDetailsLoading(true);
    try {
      console.log('🔄 Fetching BD Details for BD ID:', bdId);
      const token = localStorage.getItem('token');
      console.log('🔑 Token exists:', !!token);
      
      if (!bdId) {
        throw new Error('BD ID is required');
      }
      
      // httpClient interceptor returns response.data directly
      const response = await httpClient.get(ENDPOINTS.LEADS.BD_STATUS(bdId));
      console.log('📊 BD Details Response:', response);
      
      // Handle different response structures
      // API might return: { success: true, data: {...} } or just {...}
      let bdData = null;
      if (response?.data) {
        bdData = response.data;
      } else if (response && typeof response === 'object' && !Array.isArray(response)) {
        bdData = response;
      }
      
      if (bdData) {
        setBdDetails(bdData);
        setIsSingleBDView(true);
        setCurrentBDId(bdId);
        message.success('BD details loaded successfully');
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      console.error('❌ Error fetching BD details:', error);
      const errorMessage = error?.message || 'Failed to fetch BD details. Please try again.';
      message.error(errorMessage);
      setBdDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const fetchBDSummary = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching BD Summary...');
      const token = localStorage.getItem('token');
      console.log('🔑 Token exists:', !!token);
      
      const response = await httpClient.get(ENDPOINTS.LEADS.BD_STATUS_SUMMARY);
      console.log('📊 BD Summary Response:', response);
      
      // Handle different response structures
      const summaryData = response?.data || response || [];
      
      if (Array.isArray(summaryData)) {
        setBdSummary(summaryData);
        message.success(`Loaded ${summaryData.length} BD summaries`);
      } else if (summaryData && Array.isArray(summaryData.data)) {
        setBdSummary(summaryData.data);
        message.success(`Loaded ${summaryData.data.length} BD summaries`);
      } else {
        setBdSummary([]);
        message.warning('No BD summary data available');
      }
    } catch (error) {
      console.error('❌ Error fetching BD summary:', error);
      const errorMessage = error?.message || 'Failed to fetch BD summary. Please try again.';
      message.error(errorMessage);
      setBdSummary([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if URL contains a BD ID
    const pathArray = window.location.pathname.split('/');
    const bdIdFromUrl = pathArray[pathArray.length - 1];
    
    if (bdIdFromUrl && bdIdFromUrl !== 'bd-status-summary') {
      // Load specific BD details
      fetchBDDetails(bdIdFromUrl);
    } else {
      // Load summary view
      fetchBDSummary();
      setIsSingleBDView(false);
      setCurrentBDId(null);
    }
    
    // Set up polling for real-time updates every 10 seconds
    const interval = setInterval(() => {
      if (isSingleBDView && currentBDId) {
        fetchBDDetails(currentBDId);
      } else {
        fetchBDSummary();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [isSingleBDView, currentBDId]);

  const handleViewDetails = (bdId) => {
    // Navigate to the same page format with BD details
    // This will open the same component but with a specific BD's details
    window.location.href = `/bd-status-summary/${bdId}`;
  };

  // Mobile responsive view details handler
  const handleMobileViewDetails = async (bdId) => {
    setDetailsLoading(true);
    try {
      if (!bdId) {
        throw new Error('BD ID is required');
      }
      
      const response = await httpClient.get(ENDPOINTS.LEADS.BD_STATUS(bdId));
      console.log('📊 Mobile BD Details Response:', response);
      
      // Handle different response structures
      const bdData = response?.data || response;
      
      if (bdData) {
        setBdDetails(bdData);
        setDrawerVisible(true);
        message.success('BD details loaded');
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error('❌ Error fetching BD details for mobile view:', error);
      message.error(error?.message || 'Failed to load BD details');
      setBdDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Leads', dataIndex: 'totalLeads', key: 'totalLeads' },
    { title: 'Hot', dataIndex: 'hot', key: 'hot' },
    { title: 'Warm', dataIndex: 'warm', key: 'warm' },
    { title: 'Cold', dataIndex: 'cold', key: 'cold' },
    { title: 'Follow-ups', dataIndex: 'followUps', key: 'followUps' },
    { title: 'Conversion %', dataIndex: 'conversionRate', key: 'conversionRate', render: v => v + '%' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            onClick={() => handleViewDetails(record.bdId)} 
            size="small"
            type="primary"
            icon={<UserOutlined />}
            className="desktop-view"
          >
            View Details
          </Button>
          <Button 
            onClick={() => handleMobileViewDetails(record.bdId)} 
            size="small"
            type="primary"
            icon={<UserOutlined />}
            className="mobile-view"
          >
            Details
          </Button>
        </Space>
      ),
    },
  ];

  // Function to render assignment chain hierarchy
  const renderAssignmentChain = (chain) => {
    if (!chain || chain.length === 0) return 'No assignments';
    
    return (
      <div style={{ fontSize: '12px' }}>
        {chain.map((entry, index) => (
          <div key={index} style={{ marginBottom: '4px', padding: '4px', backgroundColor: entry.status === 'assigned' ? '#f0f9ff' : entry.status === 'completed' ? '#f0fdf4' : '#fef2f2', borderRadius: '4px' }}>
            <div style={{ fontWeight: 'bold', color: '#1e40af' }}>{entry.name} ({entry.role})</div>
            <div style={{ color: '#6b7280' }}>Status: <span style={{ fontWeight: 'bold', color: entry.status === 'assigned' ? '#2563eb' : entry.status === 'completed' ? '#16a34a' : '#dc2626' }}>{entry.status}</span></div>
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
        {/* <Sidebar userRole={userRole} /> */}
        <div style={{ flex: 1, padding: 24 }}>
          {/* User Info Header - Simplified for Summary View */}
          {!isSingleBDView ? (
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
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Button 
                  type="text" 
                  icon={<MessageOutlined />}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}
                  onClick={() => {
                    // Message functionality - can be implemented later
                    console.log('Message clicked');
                  }}
                >
                  Message
                </Button>
                <Button 
                  type="text" 
                  icon={<MobileOutlined />}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}
                  onClick={() => {
                    // Mobile view details - toggle mobile view
                    window.open('/bd-status-summary', '_blank');
                  }}
                >
                  Mobile View
                </Button>
              </div>
            </div>
          ) : (
            /* Full Header for Single BD View */
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
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>
                    {userName} {bdDetails && `- ${bdDetails.bd.name}`}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    BD Detailed Status View
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Button 
                  type="text" 
                  icon={<MessageOutlined />}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  onClick={() => {
                    // Message functionality - can be implemented later
                    console.log('Message clicked');
                  }}
                >
                  Message
                </Button>
                <Button 
                  type="text" 
                  icon={<MobileOutlined />}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  onClick={() => {
                    // Mobile view details - toggle mobile view
                    window.open('/bd-status-summary', '_blank');
                  }}
                >
                  Mobile View
                </Button>
                <Button 
                  type="primary" 
                  onClick={() => {
                    window.location.href = '/bd-status-summary';
                  }}
                >
                  Back to Summary
                </Button>
              </div>
            </div>
          )}

          {/* Single BD View */}
          {isSingleBDView ? (
          <div>
            <div style={{ 
              marginBottom: '24px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '16px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div>
                <Title level={2} style={{ margin: 0, color: '#1e293b' }}>
                  {bdDetails ? `${bdDetails.bd.name} - Complete Status Overview` : 'Loading BD Details...'}
                </Title>
                {bdDetails && (
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    Real-time status updates • Last refreshed: {new Date().toLocaleTimeString()}
                  </Text>
                )}
              </div>
              <Space>
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />} 
                  onClick={() => currentBDId && fetchBDDetails(currentBDId)}
                  loading={detailsLoading}
                  size="large"
                >
                  Refresh
                </Button>
              </Space>
            </div>

            {detailsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px', color: '#666' }}>Loading BD details...</div>
              </div>
            ) : !bdDetails ? (
              <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <div style={{ fontSize: '16px', color: '#666', marginBottom: '16px' }}>No data found for this BD</div>
                <Button onClick={() => window.location.href = '/bd-status-summary'}>
                  Back to Summary
                </Button>
              </div>
            ) : (
              <>
                {/* BD Summary Cards - Advanced Design */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                  <Col xs={24} sm={12} md={8} lg={6}>
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
                        value={bdDetails.leads.length}
                        valueStyle={{ color: '#dc2626', fontSize: '32px', fontWeight: 'bold' }}
                        prefix={<UserOutlined style={{ fontSize: '24px', marginRight: '8px' }} />}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
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
                        value={bdDetails.leads.filter(l => l.status === 'Hot').length}
                        valueStyle={{ color: '#dc2626', fontSize: '32px', fontWeight: 'bold' }}
                        prefix={<span style={{ fontSize: '24px', marginRight: '8px' }}>🔥</span>}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
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
                        value={bdDetails.leads.filter(l => l.status === 'Warm').length}
                        valueStyle={{ color: '#f59e0b', fontSize: '32px', fontWeight: 'bold' }}
                        prefix={<span style={{ fontSize: '24px', marginRight: '8px' }}>🌡️</span>}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
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
                        value={bdDetails.leads.filter(l => l.status === 'Cold').length}
                        valueStyle={{ color: '#6b7280', fontSize: '32px', fontWeight: 'bold' }}
                        prefix={<span style={{ fontSize: '24px', marginRight: '8px' }}>❄️</span>}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Card 
                      style={{ 
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Statistic
                        title={<span style={{ color: '#64748b', fontSize: '14px' }}>Total Follow-ups</span>}
                        value={bdDetails.leads.reduce((sum, l) => sum + (Array.isArray(l.followUps) ? l.followUps.length : 0), 0)}
                        valueStyle={{ color: '#10b981', fontSize: '32px', fontWeight: 'bold' }}
                        prefix={<MessageOutlined style={{ fontSize: '24px', marginRight: '8px' }} />}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Card 
                      style={{ 
                        background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Statistic
                        title={<span style={{ color: '#64748b', fontSize: '14px' }}>Completed</span>}
                        value={bdDetails.leads.filter(l => l.workProgress === 'done').length}
                        valueStyle={{ color: '#8b5cf6', fontSize: '32px', fontWeight: 'bold' }}
                        prefix={<span style={{ fontSize: '24px', marginRight: '8px' }}>✅</span>}
                      />
                    </Card>
                  </Col>
                </Row>

                {/* Leads Table */}
                <Table
                columns={[
                  { title: 'Lead', dataIndex: 'name', key: 'name' },
                  { title: 'Status', dataIndex: 'status', key: 'status' },
                  { title: 'Follow-ups', dataIndex: 'followUps', key: 'followUps', render: (f) => (f ? f.length : 0) },
                  { title: 'Budget', dataIndex: 'budget', key: 'budget' },
                  { title: 'Location', dataIndex: 'location', key: 'location' },
                  { 
                    title: 'Work Progress', 
                    dataIndex: 'workProgress', 
                    key: 'workProgress',
                    render: (progress) => {
                      const colors = {
                        pending: '#fbbf24',
                        inprogress: '#3b82f6',
                        done: '#10b981'
                      };
                      return (
                        <span style={{ 
                          backgroundColor: colors[progress] || '#6b7280',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {progress ? progress.toUpperCase() : 'PENDING'}
                        </span>
                      );
                    }
                  },
                  { 
                    title: 'Assignment Hierarchy', 
                    dataIndex: 'assignmentChain', 
                    key: 'assignmentChain',
                    render: renderAssignmentChain
                  },
                  {
                    title: 'Action',
                    key: 'action',
                    render: (_, record) => (
                      <Space>
                        <Button 
                          size="small"
                          type="primary"
                          icon={<MessageOutlined />}
                          onClick={() => {
                            // Message functionality - can be implemented later
                            console.log('Message lead:', record.name);
                            // You can implement messaging functionality here
                            alert(`Message feature for ${record.name} will be implemented soon!`);
                          }}
                        >
                          Message
                        </Button>
                      </Space>
                    ),
                  },
                ]}
                dataSource={bdDetails.leads}
                rowKey="_id"
                pagination={{ 
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                }}
                size="small"
                scroll={{ x: 800 }}
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
              </>
            )}
          </div>
        ) : (
          /* Summary View */
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
            
            {/* Main Table - Responsive */}
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
                size="small"
              />
            </div>
          </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
