import React, { useState } from 'react';
import {
  Video,
  Play,
  Pause,
  Edit,
  Upload,
  Download,
  Clock,
  Users,
  Calendar,
  Plus,
  Search,
  Filter,
  FileVideo,
  Camera,
  Scissors,
  Volume2,
  Image,
  Type,
  Palette
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';
import { Button } from '@/layout/button';
import { Input } from '@/layout/input';
import { Badge } from '@/layout/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/layout/tabs';

const VideoEditing = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Property Tour - Luxury Villa',
      type: 'Property Showcase',
      status: 'In Progress',
      duration: '5:30',
      format: '4K',
      editor: 'Arjun Mehta',
      client: 'Premium Properties Ltd',
      deadline: '2024-01-25',
      progress: 75,
      thumbnail: '/placeholder-video.jpg',
      description: 'Luxury villa tour with drone shots and interior walkthrough'
    },
    {
      id: 2,
      title: 'Company Introduction Video',
      type: 'Corporate',
      status: 'Review',
      duration: '3:45',
      format: '1080p',
      editor: 'Sneha Gupta',
      client: '100acres.com',
      deadline: '2024-01-20',
      progress: 90,
      thumbnail: '/placeholder-video.jpg',
      description: 'Corporate introduction video with animations and voice-over'
    },
    {
      id: 3,
      title: 'Real Estate Market Analysis',
      type: 'Educational',
      status: 'Completed',
      duration: '12:15',
      format: '1080p',
      editor: 'Rahul Sharma',
      client: 'Market Insights',
      deadline: '2024-01-15',
      progress: 100,
      thumbnail: '/placeholder-video.jpg',
      description: 'Market analysis video with charts, graphs and expert interviews'
    }
  ]);

  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Property Showcase Template',
      category: 'Real Estate',
      duration: '2:30',
      elements: ['Transitions', 'Text Overlays', 'Music'],
      thumbnail: '/template1.jpg'
    },
    {
      id: 2,
      name: 'Corporate Intro Template',
      category: 'Business',
      duration: '1:45',
      elements: ['Logo Animation', 'Corporate Colors', 'Professional Music'],
      thumbnail: '/template2.jpg'
    },
    {
      id: 3,
      name: 'Social Media Template',
      category: 'Marketing',
      duration: '0:30',
      elements: ['Square Format', 'Trendy Transitions', 'Upbeat Music'],
      thumbnail: '/template3.jpg'
    }
  ]);

  const [assets, setAssets] = useState([
    { type: 'video', name: 'drone_footage_01.mp4', size: '2.1 GB', duration: '10:30' },
    { type: 'audio', name: 'background_music.mp3', size: '15 MB', duration: '3:45' },
    { type: 'image', name: 'property_photo_001.jpg', size: '8 MB', duration: '-' },
    { type: 'image', name: 'logo_animation.mov', size: '450 MB', duration: '0:15' }
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Review': return 'bg-yellow-100 text-yellow-800';
      case 'On Hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssetIcon = (type) => {
    switch(type) {
      case 'video': return <FileVideo size={20} className="text-blue-500" />;
      case 'audio': return <Volume2 size={20} className="text-green-500" />;
      case 'image': return <Image size={20} className="text-purple-500" />;
      default: return <FileVideo size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Video className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold">{projects.filter(p => p.status !== 'Completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Hours This Month</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Videos</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Video Editing Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search projects..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      {/* Thumbnail */}
                      <div className="relative mb-3">
                        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Video className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                          {project.duration}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-sm">{project.title}</h3>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>

                        <p className="text-xs text-gray-600">{project.description}</p>

                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{project.type}</span>
                          <span>{project.format}</span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{width: `${project.progress}%`}}
                            ></div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">{project.editor}</span>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Calendar size={10} />
                            <span>{project.deadline}</span>
                          </div>
                        </div>

                        <div className="flex gap-1 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit size={12} className="mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Play size={12} className="mr-1" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Video Templates</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        <div className="w-full h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <Type className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white px-1 py-0.5 rounded text-xs">
                          {template.duration}
                        </div>
                      </div>

                      <h4 className="font-semibold text-sm mb-1">{template.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{template.category}</p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.elements.map((element, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {element}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Play size={12} className="mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" className="flex-1">
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Assets Tab */}
            <TabsContent value="assets" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search assets..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Asset
                </Button>
              </div>

              <div className="space-y-2">
                {assets.map((asset, index) => (
                  <Card key={index}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getAssetIcon(asset.type)}
                          <div>
                            <p className="font-medium text-sm">{asset.name}</p>
                            <p className="text-xs text-gray-500">
                              {asset.size} • {asset.duration !== '-' ? asset.duration : 'Image'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Download size={12} />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit size={12} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Arjun Mehta', role: 'Senior Video Editor', projects: 8, expertise: 'Motion Graphics' },
                  { name: 'Sneha Gupta', role: 'Video Editor', projects: 5, expertise: 'Color Grading' },
                  { name: 'Rahul Sharma', role: 'Video Editor', projects: 6, expertise: 'Documentary Style' },
                  { name: 'Kavya Patel', role: 'Motion Graphics Designer', projects: 4, expertise: 'Animation' }
                ].map((member, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Users className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{member.role}</p>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Active Projects:</span>
                            <span className="font-medium">{member.projects}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Expertise:</span>
                            <Badge variant="outline" className="text-xs">{member.expertise}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Performance:</span>
                            <Badge className="bg-green-100 text-green-800 text-xs">Excellent</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoEditing;