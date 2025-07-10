import React, { useState } from 'react';
import {
  Code,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  CheckSquare,
  Clock,
  AlertCircle,
  GitBranch,
  Bug,
  Zap,
  Database,
  Smartphone,
  Globe,
  Server
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SoftwareDevelopment = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'E-commerce Platform',
      type: 'Web Development',
      status: 'In Progress',
      progress: 75,
      priority: 'High',
      developer: 'Rahul Sharma',
      startDate: '2024-01-01',
      deadline: '2024-02-15',
      technologies: ['React', 'Node.js', 'MongoDB'],
      description: 'Complete e-commerce solution with payment integration'
    },
    {
      id: 2,
      name: 'Mobile App - Property Finder',
      type: 'Mobile Development',
      status: 'Testing',
      progress: 90,
      priority: 'High',
      developer: 'Priya Singh',
      startDate: '2023-12-01',
      deadline: '2024-01-30',
      technologies: ['React Native', 'Firebase', 'Google Maps API'],
      description: 'Real estate property finding mobile application'
    },
    {
      id: 3,
      name: 'Admin Dashboard',
      type: 'Web Development',
      status: 'Planning',
      progress: 25,
      priority: 'Medium',
      developer: 'Amit Kumar',
      startDate: '2024-01-15',
      deadline: '2024-03-01',
      technologies: ['Vue.js', 'Express.js', 'PostgreSQL'],
      description: 'Comprehensive admin dashboard for property management'
    }
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Fix payment gateway integration',
      project: 'E-commerce Platform',
      assignee: 'Rahul Sharma',
      status: 'In Progress',
      priority: 'High',
      dueDate: '2024-01-20',
      type: 'Bug'
    },
    {
      id: 2,
      title: 'Implement user authentication',
      project: 'Mobile App - Property Finder',
      assignee: 'Priya Singh',
      status: 'Completed',
      priority: 'High',
      dueDate: '2024-01-18',
      type: 'Feature'
    },
    {
      id: 3,
      title: 'Database optimization',
      project: 'Admin Dashboard',
      assignee: 'Amit Kumar',
      status: 'Todo',
      priority: 'Medium',
      dueDate: '2024-01-25',
      type: 'Enhancement'
    }
  ]);

  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Testing': return 'bg-yellow-100 text-yellow-800';
      case 'Planning': return 'bg-purple-100 text-purple-800';
      case 'Todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Web Development': return <Globe size={16} />;
      case 'Mobile Development': return <Smartphone size={16} />;
      case 'Backend': return <Server size={16} />;
      case 'Database': return <Database size={16} />;
      default: return <Code size={16} />;
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch(type) {
      case 'Bug': return <Bug size={16} className="text-red-500" />;
      case 'Feature': return <Zap size={16} className="text-blue-500" />;
      case 'Enhancement': return <GitBranch size={16} className="text-green-500" />;
      default: return <CheckSquare size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold">{projects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'Completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'In Progress').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold">{tasks.filter(t => t.priority === 'High').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Software Development Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="developers">Developers</TabsTrigger>
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
                <Button onClick={() => setShowAddProject(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(project.type)}
                          <h3 className="font-semibold text-sm">{project.name}</h3>
                        </div>
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>

                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{width: `${project.progress}%`}}
                          ></div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.technologies.map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{project.developer}</span>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <Calendar size={12} />
                        <span>Due: {project.deadline}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search tasks..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <Button onClick={() => setShowAddTask(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  AddTask
                </Button>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <Card key={task.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getTaskTypeIcon(task.type)}
                          <div className="flex-1">
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-gray-600">{task.project}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>{task.assignee}</span>
                              <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                <span>{task.dueDate}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Developers Tab */}
            <TabsContent value="developers" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Rahul Sharma', 'Priya Singh', 'Amit Kumar'].map((developer, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Users className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-semibold">{developer}</h3>
                        <p className="text-sm text-gray-600 mb-3">Full Stack Developer</p>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Active Projects:</span>
                            <span className="font-medium">2</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Completed Tasks:</span>
                            <span className="font-medium">15</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Performance:</span>
                            <Badge className="bg-green-100 text-green-800">Excellent</Badge>
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

export default SoftwareDevelopment;