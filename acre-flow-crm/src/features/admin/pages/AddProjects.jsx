import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, X, Save, Eye } from 'lucide-react';

const AddProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  
  const [formData, setFormData] = useState({
    projectName: '',
    projectType: '',
    location: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    features: [],
    amenities: [],
    images: [],
    status: 'available',
    featured: false,
    developer: '',
    completionDate: '',
    possessionDate: ''
  });

  const [newFeature, setNewFeature] = useState('');
  const [newAmenity, setNewAmenity] = useState('');

  // Mock data
  useEffect(() => {
    setProjects([
      {
        id: 1,
        projectName: 'Luxury Villas',
        projectType: 'Residential',
        location: 'Gurgaon',
        price: '2.5 Cr',
        area: '3500 sq ft',
        bedrooms: '4',
        bathrooms: '3',
        description: 'Premium luxury villas with modern amenities',
        features: ['Swimming Pool', 'Garden', 'Gym'],
        amenities: ['Power Backup', 'Security', 'Parking'],
        images: [],
        status: 'available',
        featured: true,
        developer: 'ABC Builders',
        completionDate: '2024-12-31',
        possessionDate: '2025-03-31'
      }
    ]);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProject) {
      setProjects(prev => prev.map(project => 
        project.id === editingProject.id 
          ? { ...project, ...formData }
          : project
      ));
      setEditingProject(null);
    } else {
      const newProject = {
        id: Date.now(),
        ...formData
      };
      setProjects(prev => [...prev, newProject]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      projectName: '',
      projectType: '',
      location: '',
      price: '',
      area: '',
      bedrooms: '',
      bathrooms: '',
      description: '',
      features: [],
      amenities: [],
      images: [],
      status: 'available',
      featured: false,
      developer: '',
      completionDate: '',
      possessionDate: ''
    });
    setIsAddingProject(false);
    setEditingProject(null);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData(project);
    setIsAddingProject(true);
  };

  const handleDelete = (id) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      'under-construction': 'bg-yellow-100 text-yellow-800',
      sold: 'bg-red-100 text-red-800',
      'coming-soon': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Projects Preview</h1>
          <Button onClick={() => setPreviewMode(false)}>
            Back to Edit
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Card key={project.id} className="overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{project.projectName}</h3>
                  {project.featured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
                </div>
                <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                <div className="space-y-1 text-sm">
                  <div><strong>Type:</strong> {project.projectType}</div>
                  <div><strong>Location:</strong> {project.location}</div>
                  <div><strong>Price:</strong> {project.price}</div>
                  <div><strong>Area:</strong> {project.area}</div>
                  <div><strong>Bedrooms:</strong> {project.bedrooms}</div>
                  <div><strong>Bathrooms:</strong> {project.bathrooms}</div>
                </div>
                <div className="mt-3">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                {project.features.length > 0 && (
                  <div className="mt-3">
                    <strong>Features:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Add Projects</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={() => setIsAddingProject(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Project
          </Button>
        </div>
      </div>

      {/* Add/Edit Project Form */}
      {isAddingProject && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Mixed-Use">Mixed Use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="area">Area</Label>
                  <Input
                    id="area"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="developer">Developer</Label>
                  <Input
                    id="developer"
                    value={formData.developer}
                    onChange={(e) => handleInputChange('developer', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="under-construction">Under Construction</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="coming-soon">Coming Soon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="completionDate">Completion Date</Label>
                  <Input
                    id="completionDate"
                    type="date"
                    value={formData.completionDate}
                    onChange={(e) => handleInputChange('completionDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="possessionDate">Possession Date</Label>
                  <Input
                    id="possessionDate"
                    type="date"
                    value={formData.possessionDate}
                    onChange={(e) => handleInputChange('possessionDate', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label>Features</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  />
                  <Button type="button" onClick={handleAddFeature}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {feature}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveFeature(index)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Amenities</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Add an amenity"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                  />
                  <Button type="button" onClick={handleAddAmenity}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {amenity}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveAmenity(index)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                />
                <Label htmlFor="featured">Featured Project</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {editingProject ? 'Update Project' : 'Create Project'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map(project => (
          <Card key={project.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{project.projectName}</h3>
                    {project.featured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{project.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div><strong>Type:</strong> {project.projectType}</div>
                    <div><strong>Location:</strong> {project.location}</div>
                    <div><strong>Price:</strong> {project.price}</div>
                    <div><strong>Area:</strong> {project.area}</div>
                    <div><strong>Bedrooms:</strong> {project.bedrooms}</div>
                    <div><strong>Bathrooms:</strong> {project.bathrooms}</div>
                    <div><strong>Developer:</strong> {project.developer}</div>
                    <div><strong>Completion:</strong> {project.completionDate}</div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(project.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No projects added yet. Click "Add Project" to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddProjects;
