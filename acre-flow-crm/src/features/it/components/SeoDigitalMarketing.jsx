import React, { useState } from 'react';
import {
  Search,
  TrendingUp,
  Eye,
  MousePointer,
  Globe,
  BarChart3,
  Target,
  Users,
  Calendar,
  Plus,
  Filter,
  ExternalLink,
  Star,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';
import { Button } from '@/layout/button';
import { Input } from '@/layout/input';
import { Badge } from '@/layout/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/layout/tabs';

const SeoDigitalMarketing = () => {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Real Estate SEO Campaign',
      type: 'SEO',
      status: 'Active',
      budget: 25000,
      spent: 18500,
      clicks: 12500,
      impressions: 150000,
      ctr: 8.3,
      conversions: 45,
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      keywords: ['property for sale', 'buy house', 'real estate']
    },
    {
      id: 2,
      name: 'Social Media Marketing',
      type: 'Social Media',
      status: 'Active',
      budget: 15000,
      spent: 12000,
      clicks: 8500,
      impressions: 95000,
      ctr: 8.9,
      conversions: 32,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      keywords: ['facebook ads', 'instagram marketing', 'social media']
    },
    {
      id: 3,
      name: 'Google Ads - Property Listing',
      type: 'PPC',
      status: 'Paused',
      budget: 35000,
      spent: 28000,
      clicks: 15200,
      impressions: 180000,
      ctr: 8.4,
      conversions: 68,
      startDate: '2023-12-01',
      endDate: '2024-01-31',
      keywords: ['buy property', 'property investment', 'real estate deals']
    }
  ]);

  const [keywords, setKeywords] = useState([
    {
      keyword: 'property for sale',
      position: 3,
      volume: 8100,
      difficulty: 65,
      trend: 'up',
      clicks: 450,
      impressions: 12000
    },
    {
      keyword: 'buy house',
      position: 7,
      volume: 6500,
      difficulty: 72,
      trend: 'up',
      clicks: 280,
      impressions: 8500
    },
    {
      keyword: 'real estate investment',
      position: 12,
      volume: 4300,
      difficulty: 68,
      trend: 'down',
      clicks: 180,
      impressions: 6200
    },
    {
      keyword: '2bhk flat for sale',
      position: 5,
      volume: 3200,
      difficulty: 45,
      trend: 'up',
      clicks: 320,
      impressions: 7800
    }
  ]);

  const [websites, setWebsites] = useState([
    {
      url: 'www.100acres.com',
      traffic: 125000,
      bounce_rate: 35,
      avg_session: '3:45',
      pages_per_session: 4.2,
      organic_traffic: 85000,
      paid_traffic: 40000,
      seo_score: 87
    }
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty < 30) return 'bg-green-100 text-green-800';
    if (difficulty < 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ?
      <ArrowUp size={14} className="text-green-500" /> :
      <ArrowDown size={14} className="text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Impressions</p>
                <p className="text-2xl font-bold">425K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MousePointer className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold">36K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Conversions</p>
                <p className="text-2xl font-bold">145</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg CTR</p>
                <p className="text-2xl font-bold">8.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>SEO & Digital Marketing Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="campaigns" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search campaigns..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </div>

              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{campaign.name}</h3>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{campaign.type}</Badge>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Budget</p>
                          <p className="font-semibold">₹{campaign.budget.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">
                            Spent: ₹{campaign.spent.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Impressions</p>
                          <p className="font-semibold text-lg">{campaign.impressions.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Clicks</p>
                          <p className="font-semibold text-lg">{campaign.clicks.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">CTR</p>
                          <p className="font-semibold text-lg">{campaign.ctr}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Conversions</p>
                          <p className="font-semibold text-lg">{campaign.conversions}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {campaign.keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{campaign.startDate} - {campaign.endDate}</span>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Keywords Tab */}
            <TabsContent value="keywords" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search keywords..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Keyword
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Keyword</th>
                      <th className="text-left p-3 font-medium">Position</th>
                      <th className="text-left p-3 font-medium">Volume</th>
                      <th className="text-left p-3 font-medium">Difficulty</th>
                      <th className="text-left p-3 font-medium">Trend</th>
                      <th className="text-left p-3 font-medium">Clicks</th>
                      <th className="text-left p-3 font-medium">Impressions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map((keyword, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{keyword.keyword}</td>
                        <td className="p-3">
                          <Badge variant="outline" className="font-medium">
                            #{keyword.position}
                          </Badge>
                        </td>
                        <td className="p-3">{keyword.volume.toLocaleString()}</td>
                        <td className="p-3">
                          <Badge className={getDifficultyColor(keyword.difficulty)}>
                            {keyword.difficulty}%
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            {getTrendIcon(keyword.trend)}
                          </div>
                        </td>
                        <td className="p-3">{keyword.clicks}</td>
                        <td className="p-3">{keyword.impressions.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              {websites.map((website, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      {website.url}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{website.traffic.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Total Traffic</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{website.bounce_rate}%</p>
                        <p className="text-sm text-gray-600">Bounce Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">{website.avg_session}</p>
                        <p className="text-sm text-gray-600">Avg Session</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{website.pages_per_session}</p>
                        <p className="text-sm text-gray-600">Pages/Session</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                          <p className="text-lg font-bold">{website.organic_traffic.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Organic Traffic</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <MousePointer className="h-8 w-8 mx-auto mb-2 text-green-600" />
                          <p className="text-lg font-bold">{website.paid_traffic.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Paid Traffic</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                          <p className="text-lg font-bold">{website.seo_score}/100</p>
                          <p className="text-sm text-gray-600">SEO Score</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly SEO Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Organic Traffic Growth</span>
                        <span className="font-semibold text-green-600">+15.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Keywords Ranking</span>
                        <span className="font-semibold">847</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Top 10 Keywords</span>
                        <span className="font-semibold">23</span>
                      </div>
                      <Button className="w-full mt-4">Download Report</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Spend</span>
                        <span className="font-semibold">₹58,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Conversions</span>
                        <span className="font-semibold">145</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost per Conversion</span>
                        <span className="font-semibold">₹403</span>
                      </div>
                      <Button className="w-full mt-4">Download Report</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeoDigitalMarketing;