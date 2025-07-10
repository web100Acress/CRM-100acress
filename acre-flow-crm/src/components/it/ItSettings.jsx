import React, { useState } from 'react';
import {
  Settings,
  Server,
  Shield,
  Database,
  Wifi,
  Monitor,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Globe,
  Lock,
  Key
} from 'lucide-react';
// These components are from ShadCN UI, which internally uses Tailwind CSS.
// Their internal styling will persist.
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const ItSettings = () => {
  const [systemSettings, setSystemSettings] = useState({
    serverStatus: 'Online',
    databaseStatus: 'Connected',
    backupStatus: 'Active',
    securityStatus: 'Secure',
    autoBackup: true,
    notifications: true,
    maintenance: false
  });

  const [networkSettings, setNetworkSettings] = useState({
    bandwidth: '1 Gbps',
    latency: '5ms',
    uptime: '99.9%',
    connections: 450
  });

  const [securitySettings, setSecuritySettings] = useState({
    firewall: true,
    antiVirus: true,
    encryption: true,
    twoFactor: true,
    lastScan: '2024-01-19 10:30 AM'
  });

  // --- Inline Styles Definition ---
  const styles = {
    // General Layout
    mainContainer: {
      padding: '24px', // space-y-6
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', // Default 1 column
      gap: '16px', // gap-4
    },
    // Media queries for responsive grids (injected via <style> tag)
    mediaQueries: `
      @media (min-width: 768px) { /* md breakpoint */
        .it-grid-md-4 {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .it-grid-md-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .it-grid-md-5-cols { /* For TabsList grid-cols-5 on md */
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }
      }
    `,

    // Card Styles
    cardContentPadding: {
      padding: '16px', // p-4
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px', // gap-2
    },
    cardTitle: {
      fontSize: '20px', // text-xl
      fontWeight: '600', // font-semibold
    },
    cardTitleIcon: {
      height: '20px', // h-5
      width: '20px', // w-5
    },

    // Status Cards
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px', // space-x-2
    },
    statIcon: {
      height: '32px', // h-8
      width: '32px', // w-8
    },
    statTextSmall: {
      fontSize: '14px', // text-sm
      fontWeight: '500', // font-medium
      color: '#4b5563', // text-gray-600
    },
    statIconBlue: { color: '#2563eb' }, // text-blue-600
    statIconGreen: { color: '#16a34a' }, // text-green-600
    statIconYellow: { color: '#ca8a04' }, // text-yellow-600
    statIconPurple: { color: '#9333ea' }, // text-purple-600

    // Badge Styles (conditional colors handled by getStatusColor functions)
    badgeBase: {
      padding: '2px 8px', // px-2 py-1
      borderRadius: '9999px', // rounded-full
      fontSize: '12px', // text-xs
      fontWeight: '600', // font-semibold
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeGreen: { backgroundColor: '#d1fae5', color: '#065f46' }, // bg-green-100 text-green-800
    badgeRed: { backgroundColor: '#fee2e2', color: '#991b1b' },   // bg-red-100 text-red-800
    badgeYellow: { backgroundColor: '#fef3c7', color: '#b45309' }, // bg-yellow-100 text-yellow-800
    badgeGray: { backgroundColor: '#e5e7eb', color: '#374151' },  // bg-gray-100 text-gray-800
    badgeBlue: { backgroundColor: '#dbeafe', color: '#1e40af' },  // bg-blue-100 text-blue-800

    // Tabs
    tabsContent: {
      marginTop: '16px', // space-y-4
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    tabsListGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', // Default 1 column
      width: '100%',
    },

    // Form Elements & Sections
    sectionTitle: {
      fontSize: '18px', // text-lg
      fontWeight: '600', // font-semibold
    },
    formSectionSpaceY: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px', // space-y-4
    },
    formFieldSpaceY: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px', // space-y-2
    },
    formLabel: {
      fontSize: '14px', // text-sm
      fontWeight: '500', // font-medium
    },
    inputField: {
      width: '100%',
      padding: '8px 12px', // px-3 py-2
      border: '1px solid #d1d5db', // border border-gray-300
      borderRadius: '6px', // rounded-md
      outline: 'none',
    },
    selectField: {
      width: '100%',
      padding: '8px 12px', // px-3 py-2
      border: '1px solid #d1d5db', // border border-gray-300
      borderRadius: '6px', // rounded-md
      outline: 'none',
      backgroundColor: '#ffffff', // Ensure background is white
    },
    flexBetweenCenter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    flexItemsCenterGap2: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px', // gap-2
    },
    textSmallGray: {
      fontSize: '14px', // text-sm
      color: '#4b5563', // text-gray-600
    },
    textMedium: {
      fontWeight: '500', // font-medium
    },
    // Security tab specific
    securitySwitchIcon: {
      height: '20px', // h-5
      width: '20px', // w-5
    },
    securityIconBlue: { color: '#2563eb' },
    securityIconYellow: { color: '#ca8a04' },
    securityIconGreen: { color: '#16a34a' },
    securityIconPurple: { color: '#9333ea' },
    borderTopPaddingTop: {
      paddingTop: '16px', // pt-4
      borderTop: '1px solid #e5e7eb', // border-t
    },
    buttonFullWidth: {
      width: '100%',
    },
    buttonMarginTop: {
      marginTop: '8px', // mt-2
    },
    buttonMarginTop4: {
      marginTop: '16px', // mt-4
    },
    // Progress Bar (Monitoring)
    progressBarContainer: {
      width: '80px', // w-20
      backgroundColor: '#e5e7eb', // bg-gray-200
      borderRadius: '9999px', // rounded-full
      height: '8px', // h-2
    },
    progressBarFillBlue: { backgroundColor: '#2563eb', height: '8px', borderRadius: '9999px' }, // bg-blue-600
    progressBarFillGreen: { backgroundColor: '#16a34a', height: '8px', borderRadius: '9999px' }, // bg-green-600
    progressBarFillYellow: { backgroundColor: '#ca8a04', height: '8px', borderRadius: '9999px' }, // bg-yellow-600
    progressBarFillPurple: { backgroundColor: '#9333ea', height: '8px', borderRadius: '9999px' }, // bg-purple-600
    // Save button at bottom
    saveButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end', // justify-end
      marginTop: '24px', // mt-6
      paddingTop: '24px', // pt-6
      borderTop: '1px solid #e5e7eb', // border-t
    },
    saveButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px', // gap-2
    },
    saveButtonIcon: {
      height: '16px', // h-4
      width: '16px', // w-4
    },
  };

  // Helper functions to return style objects based on status
  const getStatusColor = (status) => {
    switch(status) {
      case 'Online':
      case 'Connected':
      case 'Active':
      case 'Secure':
        return styles.badgeGreen;
      case 'Offline':
      case 'Disconnected':
      case 'Inactive':
      case 'Vulnerable':
        return styles.badgeRed;
      case 'Warning':
      case 'Maintenance':
        return styles.badgeYellow;
      default:
        return styles.badgeGray;
    }
  };

  const handleSettingChange = (key, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSecurityChange = (key, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div style={styles.mainContainer}>
      {/* Inject media queries for responsive grids */}
      <style>{styles.mediaQueries}</style>

      {/* System Status Cards */}
      <div style={styles.gridContainer} className="it-grid-md-4">
        <Card>
          <CardContent style={styles.cardContentPadding}>
            <div style={styles.statItem}>
              <Server style={{ ...styles.statIcon, ...styles.statIconBlue }} />
              <div>
                <p style={styles.statTextSmall}>Server Status</p>
                <Badge style={getStatusColor(systemSettings.serverStatus)}>
                  {systemSettings.serverStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={styles.cardContentPadding}>
            <div style={styles.statItem}>
              <Database style={{ ...styles.statIcon, ...styles.statIconGreen }} />
              <div>
                <p style={styles.statTextSmall}>Database</p>
                <Badge style={getStatusColor(systemSettings.databaseStatus)}>
                  {systemSettings.databaseStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={styles.cardContentPadding}>
            <div style={styles.statItem}>
              <Shield style={{ ...styles.statIcon, ...styles.statIconYellow }} />
              <div>
                <p style={styles.statTextSmall}>Security</p>
                <Badge style={getStatusColor(systemSettings.securityStatus)}>
                  {systemSettings.securityStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={styles.cardContentPadding}>
            <div style={styles.statItem}>
              <RefreshCw style={{ ...styles.statIcon, ...styles.statIconPurple }} />
              <div>
                <p style={styles.statTextSmall}>Backup</p>
                <Badge style={getStatusColor(systemSettings.backupStatus)}>
                  {systemSettings.backupStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Settings */}
      <Card>
        <CardHeader>
          <CardTitle style={styles.cardTitle}>
            <Settings style={styles.cardTitleIcon} />
            IT Infrastructure Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="system" style={{ width: '100%' }}>
            <TabsList style={styles.tabsListGrid} className="it-grid-md-5-cols">
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="backup">Backup</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            </TabsList>

            {/* System Settings */}
            <TabsContent value="system" style={styles.tabsContent}>
              <div style={styles.gridContainer} className="it-grid-md-2">
                <div style={styles.formSectionSpaceY}>
                  <h3 style={styles.sectionTitle}>Server Configuration</h3>

                  <div style={styles.formFieldSpaceY}>
                    <label style={styles.formLabel}>Server Name</label>
                    <Input defaultValue="100acres-main-server" style={styles.inputField} />
                  </div>

                  <div style={styles.formFieldSpaceY}>
                    <label style={styles.formLabel}>Environment</label>
                    <select style={styles.selectField}>
                      <option>Production</option>
                      <option>Staging</option>
                      <option>Development</option>
                    </select>
                  </div>

                  <div style={styles.formFieldSpaceY}>
                    <label style={styles.formLabel}>Time Zone</label>
                    <select style={styles.selectField}>
                      <option>Asia/Kolkata</option>
                      <option>UTC</option>
                      <option>America/New_York</option>
                    </select>
                  </div>
                </div>

                <div style={styles.formSectionSpaceY}>
                  <h3 style={styles.sectionTitle}>System Preferences</h3>

                  <div style={styles.flexBetweenCenter}>
                    <div>
                      <p style={styles.textMedium}>Auto Updates</p>
                      <p style={styles.textSmallGray}>Automatically install system updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div style={styles.flexBetweenCenter}>
                    <div>
                      <p style={styles.textMedium}>Maintenance Mode</p>
                      <p style={styles.textSmallGray}>Enable maintenance mode</p>
                    </div>
                    <Switch
                      checked={systemSettings.maintenance}
                      onCheckedChange={(checked) => handleSettingChange('maintenance', checked)}
                    />
                  </div>

                  <div style={styles.flexBetweenCenter}>
                    <div>
                      <p style={styles.textMedium}>System Notifications</p>
                      <p style={styles.textSmallGray}>Receive system alerts</p>
                    </div>
                    <Switch
                      checked={systemSettings.notifications}
                      onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Network Settings */}
            <TabsContent value="network" style={styles.tabsContent}>
              <div style={styles.gridContainer} className="it-grid-md-2">
                <Card>
                  <CardHeader>
                    <CardTitle style={styles.cardTitle}>
                      <Wifi style={styles.cardTitleIcon} />
                      Network Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent style={styles.cardContentPadding}>
                    <div style={styles.formSectionSpaceY}> {/* space-y-3 */}
                      <div style={styles.flexBetweenCenter}>
                        <span>Bandwidth</span>
                        <span style={styles.textMedium}>{networkSettings.bandwidth}</span>
                      </div>
                      <div style={styles.flexBetweenCenter}>
                        <span>Latency</span>
                        <span style={styles.textMedium}>{networkSettings.latency}</span>
                      </div>
                      <div style={styles.flexBetweenCenter}>
                        <span>Uptime</span>
                        <span style={{ ...styles.textMedium, ...styles.badgeGreen.color }}>{networkSettings.uptime}</span>
                      </div>
                      <div style={styles.flexBetweenCenter}>
                        <span>Active Connections</span>
                        <span style={styles.textMedium}>{networkSettings.connections}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle style={styles.cardTitle}>Network Configuration</CardTitle>
                  </CardHeader>
                  <CardContent style={styles.cardContentPadding}>
                    <div style={styles.formSectionSpaceY}> {/* space-y-3 */}
                      <div style={styles.formFieldSpaceY}>
                        <label style={styles.formLabel}>DNS Server</label>
                        <Input defaultValue="8.8.8.8" style={styles.inputField} />
                      </div>
                      <div style={styles.formFieldSpaceY}>
                        <label style={styles.formLabel}>Gateway</label>
                        <Input defaultValue="192.168.1.1" style={styles.inputField} />
                      </div>
                      <div style={styles.formFieldSpaceY}>
                        <label style={styles.formLabel}>Subnet Mask</label>
                        <Input defaultValue="255.255.255.0" style={styles.inputField} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" style={styles.tabsContent}>
              <div style={styles.gridContainer} className="it-grid-md-2">
                <div style={styles.formSectionSpaceY}> {/* space-y-4 */}
                  <h3 style={styles.sectionTitle}>Security Status</h3>

                  <div style={styles.formSectionSpaceY}> {/* space-y-3 */}
                    <div style={styles.flexBetweenCenter}>
                      <div style={styles.flexItemsCenterGap2}>
                        <Shield style={{ ...styles.securitySwitchIcon, ...styles.securityIconBlue }} />
                        <span>Firewall</span>
                      </div>
                      <div style={styles.flexItemsCenterGap2}>
                        <Switch
                          checked={securitySettings.firewall}
                          onCheckedChange={(checked) => handleSecurityChange('firewall', checked)}
                        />
                        <Badge style={securitySettings.firewall ? styles.badgeGreen : styles.badgeRed}>
                          {securitySettings.firewall ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>

                    <div style={styles.flexBetweenCenter}>
                      <div style={styles.flexItemsCenterGap2}>
                        <AlertTriangle style={{ ...styles.securitySwitchIcon, ...styles.securityIconYellow }} />
                        <span>Anti-Virus</span>
                      </div>
                      <div style={styles.flexItemsCenterGap2}>
                        <Switch
                          checked={securitySettings.antiVirus}
                          onCheckedChange={(checked) => handleSecurityChange('antiVirus', checked)}
                        />
                        <Badge style={securitySettings.antiVirus ? styles.badgeGreen : styles.badgeRed}>
                          {securitySettings.antiVirus ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>

                    <div style={styles.flexBetweenCenter}>
                      <div style={styles.flexItemsCenterGap2}>
                        <Lock style={{ ...styles.securitySwitchIcon, ...styles.securityIconGreen }} />
                        <span>Encryption</span>
                      </div>
                      <div style={styles.flexItemsCenterGap2}>
                        <Switch
                          checked={securitySettings.encryption}
                          onCheckedChange={(checked) => handleSecurityChange('encryption', checked)}
                        />
                        <Badge style={securitySettings.encryption ? styles.badgeGreen : styles.badgeRed}>
                          {securitySettings.encryption ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>

                    <div style={styles.flexBetweenCenter}>
                      <div style={styles.flexItemsCenterGap2}>
                        <Key style={{ ...styles.securitySwitchIcon, ...styles.securityIconPurple }} />
                        <span>Two-Factor Auth</span>
                      </div>
                      <div style={styles.flexItemsCenterGap2}>
                        <Switch
                          checked={securitySettings.twoFactor}
                          onCheckedChange={(checked) => handleSecurityChange('twoFactor', checked)}
                        />
                        <Badge style={securitySettings.twoFactor ? styles.badgeGreen : styles.badgeRed}>
                          {securitySettings.twoFactor ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div style={styles.borderTopPaddingTop}>
                    <p style={styles.textSmallGray}>
                      Last Security Scan: {securitySettings.lastScan}
                    </p>
                    <Button style={styles.buttonMarginTop}>
                      <RefreshCw style={styles.saveButtonIcon} />
                      Run Security Scan
                    </Button>
                  </div>
                </div>

                <div style={styles.formSectionSpaceY}> {/* space-y-4 */}
                  <h3 style={styles.sectionTitle}>Access Control</h3>

                  <div style={styles.formSectionSpaceY}> {/* space-y-3 */}
                    <div style={styles.formFieldSpaceY}>
                      <label style={styles.formLabel}>Admin Password Policy</label>
                      <select style={styles.selectField}>
                        <option>Strong (12+ chars, mixed)</option>
                        <option>Medium (8+ chars)</option>
                        <option>Basic (6+ chars)</option>
                      </select>
                    </div>

                    <div style={styles.formFieldSpaceY}>
                      <label style={styles.formLabel}>Session Timeout (minutes)</label>
                      <Input type="number" defaultValue="30" style={styles.inputField} />
                    </div>

                    <div style={styles.formFieldSpaceY}>
                      <label style={styles.formLabel}>Max Login Attempts</label>
                      <Input type="number" defaultValue="5" style={styles.inputField} />
                    </div>
                  </div>

                  <div style={styles.borderTopPaddingTop}>
                    <h4 style={{ ...styles.textMedium, marginBottom: '8px' }}>Allowed IP Addresses</h4> {/* font-medium mb-2 */}
                    <div style={styles.formFieldSpaceY}> {/* space-y-2 */}
                      <Input placeholder="192.168.1.100" style={styles.inputField} />
                      <Button variant="outline" size="sm">Add IP</Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Backup Settings */}
            <TabsContent value="backup" style={styles.tabsContent}>
              <div style={styles.gridContainer} className="it-grid-md-2">
                <Card>
                  <CardHeader>
                    <CardTitle style={styles.cardTitle}>Backup Configuration</CardTitle>
                  </CardHeader>
                  <CardContent style={styles.cardContentPadding}>
                    <div style={styles.formSectionSpaceY}> {/* space-y-4 */}
                      <div style={styles.flexBetweenCenter}>
                        <div>
                          <p style={styles.textMedium}>Auto Backup</p>
                          <p style={styles.textSmallGray}>Automatically backup data</p>
                        </div>
                        <Switch
                          checked={systemSettings.autoBackup}
                          onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                        />
                      </div>

                      <div style={styles.formFieldSpaceY}>
                        <label style={styles.formLabel}>Backup Frequency</label>
                        <select style={styles.selectField}>
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                        </select>
                      </div>

                      <div style={styles.formFieldSpaceY}>
                        <label style={styles.formLabel}>Backup Time</label>
                        <Input type="time" defaultValue="02:00" style={styles.inputField} />
                      </div>

                      <div style={styles.formFieldSpaceY}>
                        <label style={styles.formLabel}>Retention Period (days)</label>
                        <Input type="number" defaultValue="30" style={styles.inputField} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle style={styles.cardTitle}>Backup Status</CardTitle>
                  </CardHeader>
                  <CardContent style={styles.cardContentPadding}>
                    <div style={styles.formSectionSpaceY}> {/* space-y-3 */}
                      <div style={styles.flexBetweenCenter}>
                        <span>Last Backup</span>
                        <span style={styles.textMedium}>Jan 19, 2024 02:00 AM</span>
                      </div>
                      <div style={styles.flexBetweenCenter}>
                        <span>Backup Size</span>
                        <span style={styles.textMedium}>2.5 GB</span>
                      </div>
                      <div style={styles.flexBetweenCenter}>
                        <span>Status</span>
                        <Badge style={styles.badgeGreen}>Successful</Badge>
                      </div>
                      <div style={styles.flexBetweenCenter}>
                        <span>Next Backup</span>
                        <span style={styles.textMedium}>Jan 20, 2024 02:00 AM</span>
                      </div>
                    </div>

                    <div style={{ ...styles.buttonMarginTop4, ...styles.formFieldSpaceY }}> {/* mt-4 space-y-2 */}
                      <Button style={styles.buttonFullWidth}>
                        <RefreshCw style={styles.saveButtonIcon} />
                        Create Backup Now
                      </Button>
                      <Button variant="outline" style={styles.buttonFullWidth}>
                        Restore from Backup
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Monitoring Settings */}
            <TabsContent value="monitoring" style={styles.tabsContent}>
              <div style={styles.gridContainer} className="it-grid-md-2">
                <Card>
                  <CardHeader>
                    <CardTitle style={styles.cardTitle}>
                      <Monitor style={styles.cardTitleIcon} />
                      System Monitoring
                    </CardTitle>
                  </CardHeader>
                  <CardContent style={styles.cardContentPadding}>
                    <div style={styles.formSectionSpaceY}> {/* space-y-4 */}
                      <div style={styles.flexBetweenCenter}>
                        <span>CPU Usage</span>
                        <div style={styles.flexItemsCenterGap2}>
                          <div style={styles.progressBarContainer}>
                            <div style={{ ...styles.progressBarFillBlue, width: '45%' }}></div>
                          </div>
                          <span style={styles.formLabel}>45%</span>
                        </div>
                      </div>

                      <div style={styles.flexBetweenCenter}>
                        <span>Memory Usage</span>
                        <div style={styles.flexItemsCenterGap2}>
                          <div style={styles.progressBarContainer}>
                            <div style={{ ...styles.progressBarFillGreen, width: '62%' }}></div>
                          </div>
                          <span style={styles.formLabel}>62%</span>
                        </div>
                      </div>

                      <div style={styles.flexBetweenCenter}>
                        <span>Disk Usage</span>
                        <div style={styles.flexItemsCenterGap2}>
                          <div style={styles.progressBarContainer}>
                            <div style={{ ...styles.progressBarFillYellow, width: '78%' }}></div>
                          </div>
                          <span style={styles.formLabel}>78%</span>
                        </div>
                      </div>

                      <div style={styles.flexBetweenCenter}>
                        <span>Network I/O</span>
                        <div style={styles.flexItemsCenterGap2}>
                          <div style={styles.progressBarContainer}>
                            <div style={{ ...styles.progressBarFillPurple, width: '35%' }}></div>
                          </div>
                          <span style={styles.formLabel}>35%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle style={styles.cardTitle}>Alert Settings</CardTitle>
                  </CardHeader>
                  <CardContent style={styles.cardContentPadding}>
                    <div style={styles.formSectionSpaceY}> {/* space-y-4 */}
                      <div style={styles.formFieldSpaceY}>
                        <label style={styles.formLabel}>CPU Alert Threshold (%)</label>
                        <Input type="number" defaultValue="80" style={styles.inputField} />
                      </div>

                      <div style={styles.formFieldSpaceY}>
                        <label style={styles.formLabel}>Memory Alert Threshold (%)</label>
                        <Input type="number" defaultValue="85" style={styles.inputField} />
                      </div>

                      <div style={styles.formFieldSpaceY}>
                        <label style={styles.formLabel}>Disk Alert Threshold (%)</label>
                        <Input type="number" defaultValue="90" style={styles.inputField} />
                      </div>

                      <div style={styles.flexBetweenCenter}>
                        <div>
                          <p style={styles.textMedium}>Email Alerts</p>
                          <p style={styles.textSmallGray}>Send alerts via email</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div style={styles.flexBetweenCenter}>
                        <div>
                          <p style={styles.textMedium}>SMS Alerts</p>
                          <p style={styles.textSmallGray}>Send critical alerts via SMS</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div style={styles.saveButtonContainer}>
            <Button style={styles.saveButton}>
              <Save style={styles.saveButtonIcon} />
              Save All Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItSettings;