import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Volume2,
  Upload,
  Download,
  Calendar,
  Clock,
  Users,
  Video,
  Camera,
  Settings,
  Plus,
  Search,
  Filter,
  Headphones,
  Radio,
  FileAudio
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';
import { Button } from '@/layout/button';
import { Input } from '@/layout/input';
import { Badge } from '@/layout/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/layout/tabs';

const AnchorRecording = () => {
  const [recordings, setRecordings] = useState([
    {
      id: 1,
      title: 'Property Market Update - Episode 15',
      type: 'Podcast',
      status: 'Completed',
      duration: '25:30',
      anchor: 'Rohit Sharma',
      recordingDate: '2024-01-18',
      fileSize: '48 MB',
      format: 'MP3',
      quality: 'High',
      script: 'Weekly market analysis and property trends discussion',
      thumbnail: '/podcast-thumb.jpg'
    },
    {
      id: 2,
      title: 'Company Announcement Video',
      type: 'Video Recording',
      status: 'In Progress',
      duration: '8:45',
      anchor: 'Priya Mehta',
      recordingDate: '2024-01-19',
      fileSize: '2.1 GB',
      format: 'MP4',
      quality: '4K',
      script: 'New product launch announcement for investors',
      thumbnail: '/video-thumb.jpg'
    },
    {
      id: 3,
      title: 'Real Estate Tips - Audio Series',
      type: 'Audio Recording',
      status: 'Scheduled',
      duration: '15:00',
      anchor: 'Amit Kumar',
      recordingDate: '2024-01-22',
      fileSize: '-',
      format: 'WAV',
      quality: 'Studio',
      script: 'Tips for first-time home buyers',
      thumbnail: '/audio-thumb.jpg'
    }
  ]);

  const [anchors, setAnchors] = useState([
    {
      name: 'Rohit Sharma',
      specialization: 'Real Estate Expert',
      experience: '5 years',
      recordings: 45,
      rating: 4.8,
      languages: ['Hindi', 'English'],
      expertise: ['Market Analysis', 'Investment Tips']
    },
    {
      name: 'Priya Mehta',
      specialization: 'Corporate Presenter',
      experience: '3 years',
      recordings: 28,
      rating: 4.7,
      languages: ['English', 'Gujarati'],
      expertise: ['Product Demos', 'Presentations']
    },
    {
      name: 'Amit Kumar',
      specialization: 'Content Creator',
      experience: '4 years',
      recordings: 32,
      rating: 4.9,
      languages: ['Hindi', 'English', 'Punjabi'],
      expertise: ['Educational Content', 'Storytelling']
    }
  ]);

  const [equipment, setEquipment] = useState([
    { name: 'Professional Microphone - Shure SM7B', status: 'Available', location: 'Studio A' },
    { name: '4K Camera - Sony A7S III', status: 'In Use', location: 'Studio B' },
    { name: 'Audio Interface - Focusrite Scarlett', status: 'Available', location: 'Studio A' },
    { name: 'Lighting Kit - Professional LED', status: 'Available', location: 'Studio B' },
    { name: 'Teleprompter', status: 'Maintenance', location: 'Storage' }
  ]);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState('00:00');

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEquipmentStatusColor = (status) => {
    switch(status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'In Use': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Podcast': return <Radio size={16} className="text-purple-500" />;
      case 'Video Recording': return <Camera size={16} className="text-blue-500" />;
      case 'Audio Recording': return <Mic size={16} className="text-green-500" />;
      default: return <FileAudio size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mic className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Recordings</p>
                <p className="text-2xl font-bold">{recordings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Anchors</p>
                <p className="text-2xl font-bold">{anchors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Hours This Month</p>
                <p className="text-2xl font-bold">87</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Equipment Available</p>
                <p className="text-2xl font-bold">{equipment.filter(e => e.status === 'Available').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recording Studio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            Live Recording Studio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
            <div className="text-center space-y-4">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${isRecording ? 'bg-red-100' : 'bg-gray-200'}`}>
                {isRecording ? (
                  <Square className="h-12 w-12 text-red-600" />
                ) : (
                  <Mic className="h-12 w-12 text-gray-600" />
                )}
              </div>
              <div>
                <p className="text-2xl font-bold">{recordingTime}</p>
                <p className="text-gray-600">Recording Time</p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  variant={isRecording ? "destructive" : "default"}
                  onClick={() => setIsRecording(!isRecording)}
                >
                  {isRecording ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Anchor & Recording Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recordings" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="recordings">Recordings</TabsTrigger>
              <TabsTrigger value="anchors">Anchors</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
            </TabsList>

            {/* Recordings Tab */}
            <TabsContent value="recordings" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search recordings..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Recording
                </Button>
              </div>

              <div className="space-y-4">
                {recordings.map((recording) => (
                  <Card key={recording.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            {getTypeIcon(recording.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{recording.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{recording.script}</p>
                            <div className="flex gap-2">
                              <Badge variant="outline">{recording.type}</Badge>
                              <Badge className={getStatusColor(recording.status)}>
                                {recording.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{recording.duration}</p>
                          <p className="text-sm text-gray-600">{recording.format} • {recording.quality}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-gray-600">Anchor</p>
                          <p className="font-medium">{recording.anchor}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Date</p>
                          <p className="font-medium">{recording.recordingDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">File Size</p>
                          <p className="font-medium">{recording.fileSize}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Quality</p>
                          <p className="font-medium">{recording.quality}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Play size={12} className="mr-1" />
                          Play
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download size={12} className="mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Upload size={12} className="mr-1" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Anchors Tab */}
            <TabsContent value="anchors" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Anchor Team</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Anchor
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {anchors.map((anchor, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <Headphones className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{anchor.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{anchor.specialization}</p>

                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div>
                              <p className="text-gray-600">Experience</p>
                              <p className="font-medium">{anchor.experience}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Recordings</p>
                              <p className="font-medium">{anchor.recordings}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Rating</p>
                              <p className="font-medium flex items-center gap-1">
                                ⭐ {anchor.rating}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Languages</p>
                              <p className="font-medium">{anchor.languages.length}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Languages</p>
                              <div className="flex flex-wrap gap-1">
                                {anchor.languages.map((lang, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {lang}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Expertise</p>
                              <div className="flex flex-wrap gap-1">
                                {anchor.expertise.map((exp, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {exp}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Recording Schedule</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Recording
                </Button>
              </div>

              <div className="space-y-3">
                {recordings.filter(r => r.status === 'Scheduled').map((recording) => (
                  <Card key={recording.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} className="text-blue-500" />
                            <span className="font-medium">{recording.recordingDate}</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(recording.status)}>
                          {recording.status}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <h4 className="font-medium">{recording.title}</h4>
                        <p className="text-sm text-gray-600">
                          Anchor: {recording.anchor} • Duration: {recording.duration}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Equipment Tab */}
            <TabsContent value="equipment" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Recording Equipment</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Equipment
                </Button>
              </div>

              <div className="space-y-3">
                {equipment.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Settings className="h-6 w-6 text-gray-500" />
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600">{item.location}</p>
                          </div>
                        </div>
                        <Badge className={getEquipmentStatusColor(item.status)}>
                          {item.status}
                        </Badge>
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

export default AnchorRecording;