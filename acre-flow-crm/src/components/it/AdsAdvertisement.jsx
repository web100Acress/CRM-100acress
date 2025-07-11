import React, { useState } from 'react';
import {
  Megaphone,
  Target,
  Eye,
  MousePointer,
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  BarChart3,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Play,
  Pause,
  Edit,
  Facebook,
  Instagram,
  Youtube,
  Globe
} from 'lucide-react';
// These components are from ShadCN UI, which internally uses Tailwind CSS.
// Their internal styling will persist.
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdsAdvertisement = () => {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Luxury Property Facebook Campaign',
      platform: 'Facebook',
      type: 'Image Ads',
      status: 'Active',
      budget: 50000,
      spent: 35000,
      impressions: 250000,
      clicks: 12500,
      ctr: 5.0,
      conversions: 85,
      cpa: 412,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      targetAudience: '25-45, Real Estate Investors',
      adCreative: 'luxury-property-ad.jpg'
    },
    {
      id: 2,
      name: 'Home Buyers Google Ads',
      platform: 'Google',
      type: 'Search Ads',
      status: 'Active',
      budget: 75000,
      spent: 68000,
      impressions: 180000,
      clicks: 8500,
      ctr: 4.7,
      conversions: 125,
      cpa: 544,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      targetAudience: 'First-time home buyers',
      adCreative: 'search-ad-copy.txt'
    },
    {
      id: 3,
      name: 'Property Investment YouTube Campaign',
      platform: 'YouTube',
      type: 'Video Ads',
      status: 'Paused',
      budget: 40000,
      spent: 25000,
      impressions: 150000,
      clicks: 4500,
      ctr: 3.0,
      conversions: 35,
      cpa: 714,
      startDate: '2023-12-01',
      endDate: '2024-01-15',
      targetAudience: 'Property investors, 30-55',
      adCreative: 'investment-video-ad.mp4'
    }
  ]);

  const [adCreatives, setAdCreatives] = useState([
    {
      id: 1,
      name: 'Luxury Villa Showcase',
      type: 'Image',
      size: '1200x628',
      platform: 'Facebook/Instagram',
      status: 'Active',
      performance: 'High',
      thumbnail: '/creative1.jpg'
    },
    {
      id: 2,
      name: 'Property Investment Guide',
      type: 'Video',
      size: '1920x1080',
      platform: 'YouTube',
      status: 'In Review',
      performance: 'Medium',
      thumbnail: '/creative2.jpg'
    },
    {
      id: 3,
      name: 'Home Buying Tips Carousel',
      type: 'Carousel',
      size: '1080x1080',
      platform: 'Instagram',
      status: 'Draft',
      performance: '-',
      thumbnail: '/creative3.jpg'
    }
  ]);

  const [audiences, setAudiences] = useState([
    {
      name: 'First-time Home Buyers',
      size: '2.5M',
      age: '25-35',
      interests: ['Real Estate', 'Home Loans', 'Property Investment'],
      platforms: ['Facebook', 'Google', 'Instagram']
    },
    {
      name: 'Luxury Property Investors',
      size: '850K',
      age: '35-55',
      interests: ['Luxury Real Estate', 'Investment', 'High-end Properties'],
      platforms: ['Facebook', 'LinkedIn', 'YouTube']
    },
    {
      name: 'Property Dealers',
      size: '450K',
      age: '28-50',
      interests: ['Real Estate Business', 'Property Deals', 'Commercial Properties'],
      platforms: ['LinkedIn', 'Google', 'Facebook']
    }
  ]);

  // --- Inline Styles Definition ---
  const styles = {
    // General Layout
    mainContainer: {
      padding: '24px', // space-y-6 for direct children
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    gridContainer4Cols: {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', // Default 1 column
      gap: '16px', // gap-4
    },
    // Media query for md:grid-cols-4
    // This will be injected via a <style> tag
    mediaQueries: `
      @media (min-width: 768px) { /* md breakpoint */
        .ads-grid-md-4 {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .ads-grid-md-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .ads-grid-lg-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
      @media (min-width: 1024px) { /* lg breakpoint */
        .ads-grid-lg-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
    `,

    // Card Styles
    cardContentPadding: {
      padding: '16px', // p-4
    },
    cardHeader: {
      // CardHeader is a ShadCN component, its padding is internal.
      // CardTitle flex items-center
      display: 'flex',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: '20px', // text-xl
      fontWeight: '600', // font-semibold
    },
    cardHoverShadow: { // For hover effect, needs JS to apply onMouseEnter/Leave or external CSS
      // boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // hover:shadow-md
      // transition: 'box-shadow 0.2s ease-in-out', // transition-shadow
    },

    // Stats Cards
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
    statTextLarge: {
      fontSize: '24px', // text-2xl
      fontWeight: '700', // font-bold
    },
    statIconBlue: { color: '#2563eb' }, // text-blue-600
    statIconGreen: { color: '#16a34a' }, // text-green-600
    statIconYellow: { color: '#ca8a04' }, // text-yellow-600
    statIconPurple: { color: '#9333ea' }, // text-purple-600

    // Main Content Tabs
    tabsList: {
      display: 'grid',
      width: '100%',
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', // grid-cols-4
    },
    tabsContent: {
      marginTop: '16px', // space-y-4 for direct children
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },

    // Campaigns Tab
    campaignControls: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    campaignControlGroup: {
      display: 'flex',
      gap: '8px', // gap-2
    },
    searchInputWrapper: {
      position: 'relative',
    },
    searchInputIcon: {
      position: 'absolute',
      left: '12px', // left-3
      top: '50%',
      transform: 'translateY(-50%)',
      height: '16px', // h-4
      width: '16px', // w-4
      color: '#9ca3af', // text-gray-400
    },
    searchInput: {
      paddingLeft: '40px', // pl-10
      width: '256px', // w-64
    },
    campaignCard: {
      // No specific shadow/transition here as it's on the parent Card
    },
    campaignCardContent: {
      padding: '16px', // p-4
    },
    campaignHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start', // items-start
      marginBottom: '16px', // mb-4
    },
    campaignInfoGroup: {
      display: 'flex',
      gap: '12px', // gap-3
    },
    campaignIconWrapper: {
      width: '48px', // w-12
      height: '48px', // h-12
      backgroundColor: '#f3f4f6', // bg-gray-100
      borderRadius: '8px', // rounded-lg
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    campaignName: {
      fontWeight: '600', // font-semibold
      fontSize: '18px', // text-lg
    },
    campaignBadges: {
      display: 'flex',
      gap: '8px', // gap-2
      marginTop: '4px', // mt-1
    },
    campaignBudgetInfo: {
      textAlign: 'right',
    },
    campaignBudgetLabel: {
      fontSize: '14px', // text-sm
      color: '#4b5563', // text-gray-600
    },
    campaignBudgetAmount: {
      fontWeight: '600', // font-semibold
      fontSize: '18px', // text-lg
    },
    campaignSpentText: {
      fontSize: '12px', // text-xs
      color: '#6b7280', // text-gray-500
    },
    campaignMetricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', // grid-cols-2
      gap: '16px', // gap-4
      marginBottom: '16px', // mb-4
    },
    campaignMetricLabel: {
      fontSize: '14px', // text-sm
      color: '#4b5563', // text-gray-600
    },
    campaignMetricValue: {
      fontWeight: '600', // font-semibold
    },
    campaignDurationText: {
      fontSize: '12px', // text-xs
    },
    campaignAudienceSection: {
      marginBottom: '12px', // mb-3
    },
    campaignAudienceLabel: {
      fontSize: '14px', // text-sm
      color: '#4b5563', // text-gray-600
      marginBottom: '4px', // mb-1
    },
    campaignAudienceValue: {
      fontSize: '14px', // text-sm
    },
    campaignActions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    campaignActionGroup: {
      display: 'flex',
      gap: '8px', // gap-2
    },
    actionButtonIcon: {
      marginRight: '4px', // mr-1
      height: '12px', // size={12}
      width: '12px',
    },

    // Ad Creatives Tab
    creativeGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', // grid-cols-1
      gap: '16px', // gap-4
    },
    creativeCard: {
      // Hover shadow handled by Card component, but transition-shadow is lost
    },
    creativeImageWrapper: {
      position: 'relative',
      marginBottom: '12px', // mb-3
    },
    creativePlaceholder: {
      width: '100%',
      height: '128px', // h-32
      backgroundColor: '#e5e7eb', // bg-gray-200
      borderRadius: '8px', // rounded-lg
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    creativePlaceholderIcon: {
      height: '32px', // h-8
      width: '32px', // w-8
      color: '#9ca3af', // text-gray-400
    },
    creativeBadgeAbsolute: {
      position: 'absolute',
      top: '8px', // top-2
      right: '8px', // right-2
    },
    creativeDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px', // space-y-2
    },
    creativeName: {
      fontWeight: '600', // font-semibold
      fontSize: '14px', // text-sm
    },
    creativeMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px', // text-xs
      color: '#4b5563', // text-gray-600
    },
    creativePlatformPerformance: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    creativePlatformText: {
      fontSize: '12px', // text-xs
      color: '#4b5563', // text-gray-600
    },
    creativeActions: {
      display: 'flex',
      gap: '4px', // gap-1
      paddingTop: '8px', // pt-2
    },
    creativeActionButton: {
      flex: '1', // flex-1
    },

    // Audiences Tab
    audienceHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    audienceTitle: {
      fontSize: '18px', // text-lg
      fontWeight: '600', // font-semibold
    },
    audienceCardContent: {
      padding: '16px', // p-4
    },
    audienceInfoTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px', // mb-3
    },
    audienceName: {
      fontWeight: '600', // font-semibold
      fontSize: '18px', // text-lg
    },
    audienceSize: {
      fontSize: '14px', // text-sm
      color: '#4b5563', // text-gray-600
    },
    audienceAgeLabel: {
      fontSize: '14px', // text-sm
      color: '#4b5563', // text-gray-600
    },
    audienceAgeValue: {
      fontWeight: '600', // font-semibold
    },
    audienceDetailsSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px', // space-y-3
    },
    audienceSubLabel: {
      fontSize: '14px', // text-sm
      color: '#4b5563', // text-gray-600
      marginBottom: '4px', // mb-1
    },
    audienceInterests: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px', // gap-1
    },
    audiencePlatforms: {
      display: 'flex',
      gap: '8px', // gap-2
    },
    platformItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px', // gap-1
    },
    platformText: {
      fontSize: '12px', // text-xs
    },
    audienceActions: {
      display: 'flex',
      gap: '8px', // gap-2
      marginTop: '12px', // mt-3
    },

    // Analytics Tab
    analyticsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', // grid-cols-1
      gap: '16px', // gap-4
    },
    analyticsCardContent: {
      padding: '16px', // p-4
    },
    analyticsDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px', // space-y-3
    },
    analyticsDetailRow: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    analyticsValue: {
      fontWeight: '600', // font-semibold
    },
    analyticsValueGreen: { color: '#16a34a' }, // text-green-600
    analyticsPlatformItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    analyticsPlatformInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px', // gap-2
    },
    monthlyReportGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', // grid-cols-2
      gap: '16px', // gap-4
    },
    reportMetric: {
      textAlign: 'center',
    },
    reportMetricValue: {
      fontSize: '24px', // text-2xl
      fontWeight: '700', // font-bold
    },
    reportMetricLabel: {
      fontSize: '14px', // text-sm
      color: '#4b5563', // text-gray-600
    },
    reportMetricBlue: { color: '#2563eb' },
    reportMetricGreen: { color: '#16a34a' },
    reportMetricYellow: { color: '#ca8a04' },
    reportMetricPurple: { color: '#9333ea' },
  };

  // Helper functions to return style objects based on status/performance
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return { backgroundColor: '#d1fae5', color: '#065f46' }; // bg-green-100 text-green-800
      case 'Paused': return { backgroundColor: '#fef3c7', color: '#b45309' }; // bg-yellow-100 text-yellow-800
      case 'Completed': return { backgroundColor: '#dbeafe', color: '#1e40af' }; // bg-blue-100 text-blue-800
      case 'Draft': return { backgroundColor: '#e5e7eb', color: '#374151' }; // bg-gray-100 text-gray-800
      case 'In Review': return { backgroundColor: '#ede9fe', color: '#6d28d9' }; // bg-purple-100 text-purple-800
      default: return { backgroundColor: '#e5e7eb', color: '#374151' }; // bg-gray-100 text-gray-800
    }
  };

  const getPerformanceColor = (performance) => {
    switch(performance) {
      case 'High': return { backgroundColor: '#d1fae5', color: '#065f46' }; // bg-green-100 text-green-800
      case 'Medium': return { backgroundColor: '#fef3c7', color: '#b45309' }; // bg-yellow-100 text-yellow-800
      case 'Low': return { backgroundColor: '#fee2e2', color: '#991b1b' }; // bg-red-100 text-red-800
      default: return { backgroundColor: '#e5e7eb', color: '#374151' }; // bg-gray-100 text-gray-800
    }
  };

  const getPlatformIcon = (platform) => {
    // Icons themselves are components, so their color can be set via style prop
    switch(platform) {
      case 'Facebook': return <Facebook size={16} style={{ color: '#1877F2' }} />;
      case 'Instagram': return <Instagram size={16} style={{ color: '#E4405F' }} />;
      case 'YouTube': return <Youtube size={16} style={{ color: '#FF0000' }} />;
      case 'Google': return <Globe size={16} style={{ color: '#4285F4' }} />;
      default: return <Globe size={16} style={{ color: '#6b7280' }} />;
    }
  };

  return (
    <div style={styles.mainContainer}>
      {/* Inject media queries for responsive grids */}
      <style>{styles.mediaQueries}</style>

      {/* Stats Cards */}
      <div style={styles.gridContainer4Cols} className="ads-grid-md-4">
        <Card>
          <CardContent style={styles.cardContentPadding}>
            <div style={styles.statItem}>
              <DollarSign style={{ ...styles.statIcon, ...styles.statIconBlue }} />
              <div>
                <p style={styles.statTextSmall}>Total Spend</p>
                <p style={styles.statTextLarge}>₹1,28,000</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={styles.cardContentPadding}>
            <div style={styles.statItem}>
              <Eye style={{ ...styles.statIcon, ...styles.statIconGreen }} />
              <div>
                <p style={styles.statTextSmall}>Total Impressions</p>
                <p style={styles.statTextLarge}>580K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={styles.cardContentPadding}>
            <div style={styles.statItem}>
              <MousePointer style={{ ...styles.statIcon, ...styles.statIconYellow }} />
              <div>
                <p style={styles.statTextSmall}>Total Clicks</p>
                <p style={styles.statTextLarge}>25.5K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={styles.cardContentPadding}>
            <div style={styles.statItem}>
              <Target style={{ ...styles.statIcon, ...styles.statIconPurple }} />
              <div>
                <p style={styles.statTextSmall}>Conversions</p>
                <p style={styles.statTextLarge}>245</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle style={styles.cardTitle}>Ads & Advertisement Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tabs component (ShadCN) */}
          <Tabs defaultValue="campaigns" style={{ width: '100%' }}>
            <TabsList style={styles.tabsList}>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="creatives">Ad Creatives</TabsTrigger>
              <TabsTrigger value="audiences">Audiences</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" style={styles.tabsContent}>
              <div style={styles.campaignControls}>
                <div style={styles.campaignControlGroup}>
                  <div style={styles.searchInputWrapper}>
                    <Search style={styles.searchInputIcon} />
                    <Input placeholder="Search campaigns..." style={styles.searchInput} />
                  </div>
                  <Button variant="outline">
                    <Filter style={styles.actionButtonIcon} />
                    Filter
                  </Button>
                </div>
                <Button>
                  <Plus style={styles.actionButtonIcon} />
                  Create Campaign
                </Button>
              </div>

              <div style={styles.tabsContent}> {/* Reusing tabsContent style for inner spacing */}
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} style={styles.campaignCard}>
                    <CardContent style={styles.campaignCardContent}>
                      <div style={styles.campaignHeader}>
                        <div style={styles.campaignInfoGroup}>
                          <div style={styles.campaignIconWrapper}>
                            {getPlatformIcon(campaign.platform)}
                          </div>
                          <div>
                            <h3 style={styles.campaignName}>{campaign.name}</h3>
                            <div style={styles.campaignBadges}>
                              <Badge variant="outline">{campaign.platform}</Badge>
                              <Badge variant="outline">{campaign.type}</Badge>
                              <Badge style={getStatusColor(campaign.status)}>
                                {campaign.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div style={styles.campaignBudgetInfo}>
                          <p style={styles.campaignBudgetLabel}>Budget</p>
                          <p style={styles.campaignBudgetAmount}>₹{campaign.budget.toLocaleString()}</p>
                          <p style={styles.campaignSpentText}>
                            Spent: ₹{campaign.spent.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div style={styles.campaignMetricsGrid} className="ads-grid-md-6">
                        <div>
                          <p style={styles.campaignMetricLabel}>Impressions</p>
                          <p style={styles.campaignMetricValue}>{campaign.impressions.toLocaleString()}</p>
                        </div>
                        <div>
                          <p style={styles.campaignMetricLabel}>Clicks</p>
                          <p style={styles.campaignMetricValue}>{campaign.clicks.toLocaleString()}</p>
                        </div>
                        <div>
                          <p style={styles.campaignMetricLabel}>CTR</p>
                          <p style={styles.campaignMetricValue}>{campaign.ctr}%</p>
                        </div>
                        <div>
                          <p style={styles.campaignMetricLabel}>Conversions</p>
                          <p style={styles.campaignMetricValue}>{campaign.conversions}</p>
                        </div>
                        <div>
                          <p style={styles.campaignMetricLabel}>CPA</p>
                          <p style={styles.campaignMetricValue}>₹{campaign.cpa}</p>
                        </div>
                        <div>
                          <p style={styles.campaignMetricLabel}>Duration</p>
                          <p style={{ ...styles.campaignMetricValue, ...styles.campaignDurationText }}>
                            {campaign.startDate} to {campaign.endDate}
                          </p>
                        </div>
                      </div>

                      <div style={styles.campaignAudienceSection}>
                        <p style={styles.campaignAudienceLabel}>Target Audience</p>
                        <p style={styles.campaignAudienceValue}>{campaign.targetAudience}</p>
                      </div>

                      <div style={styles.campaignActions}>
                        <div style={styles.campaignActionGroup}>
                          <Button size="sm" variant="outline">
                            <Edit size={12} style={styles.actionButtonIcon} />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            {campaign.status === 'Active' ? (
                              <>
                                <Pause size={12} style={styles.actionButtonIcon} />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play size={12} style={styles.actionButtonIcon} />
                                Resume
                              </>
                            )}
                          </Button>
                          <Button size="sm" variant="outline">
                            <BarChart3 size={12} style={styles.actionButtonIcon} />
                            Analytics
                          </Button>
                        </div>
                        <Button size="sm" variant="outline">
                          <ExternalLink size={12} style={styles.actionButtonIcon} />
                          View on Platform
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Ad Creatives Tab */}
            <TabsContent value="creatives" style={styles.tabsContent}>
              <div style={styles.campaignControls}> {/* Reusing campaignControls for consistency */}
                <div style={styles.campaignControlGroup}>
                  <div style={styles.searchInputWrapper}>
                    <Search style={styles.searchInputIcon} />
                    <Input placeholder="Search creatives..." style={styles.searchInput} />
                  </div>
                  <Button variant="outline">
                    <Filter style={styles.actionButtonIcon} />
                    Filter
                  </Button>
                </div>
                <Button>
                  <Plus style={styles.actionButtonIcon} />
                  Create Creative
                </Button>
              </div>

              <div style={styles.creativeGrid} className="ads-grid-lg-3">
                {adCreatives.map((creative) => (
                  <Card key={creative.id} style={styles.creativeCard}>
                    <CardContent style={styles.cardContentPadding}>
                      <div style={styles.creativeImageWrapper}>
                        <div style={styles.creativePlaceholder}>
                          <Megaphone style={styles.creativePlaceholderIcon} />
                        </div>
                        <div style={styles.creativeBadgeAbsolute}>
                          <Badge style={getStatusColor(creative.status)}>
                            {creative.status}
                          </Badge>
                        </div>
                      </div>

                      <div style={styles.creativeDetails}>
                        <h3 style={styles.creativeName}>{creative.name}</h3>

                        <div style={styles.creativeMeta}>
                          <span >{creative.type}</span>
                          <span >{creative.size}</span>
                        </div>

                        <div style={styles.creativePlatformPerformance}>
                          <span style={styles.creativePlatformText}>{creative.platform}</span>
                          {creative.performance !== '-' && (
                            <Badge style={getPerformanceColor(creative.performance)} variant="outline">
                              {creative.performance}
                            </Badge>
                          )}
                        </div>

                        <div style={styles.creativeActions}>
                          <Button size="sm" variant="outline" style={styles.creativeActionButton}>
                            <Edit size={12} style={styles.actionButtonIcon} />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" style={styles.creativeActionButton}>
                            <Eye size={12} style={styles.actionButtonIcon} />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Audiences Tab */}
            <TabsContent value="audiences" style={styles.tabsContent}>
              <div style={styles.audienceHeader}>
                <h3 style={styles.audienceTitle}>Target Audiences</h3>
                <Button>
                  <Plus style={styles.actionButtonIcon} />
                  Create Audience
                </Button>
              </div>

              <div style={styles.tabsContent}> {/* Reusing tabsContent style for inner spacing */}
                {audiences.map((audience, index) => (
                  <Card key={index} style={styles.audienceCard}>
                    <CardContent style={styles.audienceCardContent}>
                      <div style={styles.audienceInfoTop}>
                        <div>
                          <h3 style={styles.audienceName}>{audience.name}</h3>
                          <p style={styles.audienceSize}>Size: {audience.size} people</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={styles.audienceAgeLabel}>Age Group</p>
                          <p style={styles.audienceAgeValue}>{audience.age}</p>
                        </div>
                      </div>

                      <div style={styles.audienceDetailsSection}>
                        <div>
                          <p style={styles.audienceSubLabel}>Interests</p>
                          <div style={styles.audienceInterests}>
                            {audience.interests.map((interest, i) => (
                              <Badge key={i} variant="outline" style={{ fontSize: '12px' }}>
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p style={styles.audienceSubLabel}>Platforms</p>
                          <div style={styles.audiencePlatforms}>
                            {audience.platforms.map((platform, i) => (
                              <div key={i} style={styles.platformItem}>
                                {getPlatformIcon(platform)}
                                <span style={styles.platformText}>{platform}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div style={styles.audienceActions}>
                        <Button size="sm" variant="outline">
                          <Edit size={12} style={styles.actionButtonIcon} />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Target size={12} style={styles.actionButtonIcon} />
                          Use in Campaign
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" style={styles.tabsContent}>
              <div style={styles.analyticsGrid} className="ads-grid-md-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Performance</CardTitle>
                  </CardHeader>
                  <CardContent style={styles.analyticsCardContent}>
                    <div style={styles.analyticsDetails}>
                      <div style={styles.analyticsDetailRow}>
                        <span>Best Performing Campaign</span>
                        <span style={styles.analyticsValue}>Home Buyers Google Ads</span>
                      </div>
                      <div style={styles.analyticsDetailRow}>
                        <span>Highest CTR</span>
                        <span style={styles.analyticsValue}>5.0%</span>
                      </div>
                      <div style={styles.analyticsDetailRow}>
                        <span>Lowest CPA</span>
                        <span style={styles.analyticsValue}>₹412</span>
                      </div>
                      <div style={styles.analyticsDetailRow}>
                        <span>Total ROI</span>
                        <span style={{ ...styles.analyticsValue, ...styles.analyticsValueGreen }}>235%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Platform Performance</CardTitle>
                  </CardHeader>
                  <CardContent style={styles.analyticsCardContent}>
                    <div style={styles.analyticsDetails}>
                      <div style={styles.analyticsPlatformItem}>
                        <div style={styles.analyticsPlatformInfo}>
                          <Facebook size={16} style={{ color: '#1877F2' }} />
                          <span>Facebook</span>
                        </div>
                        <span style={styles.analyticsValue}>₹35,000 spent</span>
                      </div>
                      <div style={styles.analyticsPlatformItem}>
                        <div style={styles.analyticsPlatformInfo}>
                          <Globe size={16} style={{ color: '#4285F4' }} />
                          <span>Google</span>
                        </div>
                        <span style={styles.analyticsValue}>₹68,000 spent</span>
                      </div>
                      <div style={styles.analyticsPlatformItem}>
                        <div style={styles.analyticsPlatformInfo}>
                          <Youtube size={16} style={{ color: '#FF0000' }} />
                          <span>YouTube</span>
                        </div>
                        <span style={styles.analyticsValue}>₹25,000 spent</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Report</CardTitle>
                </CardHeader>
                <CardContent style={styles.analyticsCardContent}>
                  <div style={styles.monthlyReportGrid} className="ads-grid-md-4">
                    <div style={styles.reportMetric}>
                      <p style={{ ...styles.reportMetricValue, ...styles.reportMetricBlue }}>₹1,28,000</p>
                      <p style={styles.reportMetricLabel}>Total Spend</p>
                    </div>
                    <div style={styles.reportMetric}>
                      <p style={{ ...styles.reportMetricValue, ...styles.reportMetricGreen }}>245</p>
                      <p style={styles.reportMetricLabel}>Conversions</p>
                    </div>
                    <div style={styles.reportMetric}>
                      <p style={{ ...styles.reportMetricValue, ...styles.reportMetricYellow }}>4.4%</p>
                      <p style={styles.reportMetricLabel}>Avg CTR</p>
                    </div>
                    <div style={styles.reportMetric}>
                      <p style={{ ...styles.reportMetricValue, ...styles.reportMetricPurple }}>₹523</p>
                      <p style={styles.reportMetricLabel}>Avg CPA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdsAdvertisement;