import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Save, Home, Bed, Bath, Square, MapPin } from 'lucide-react';

const ProjectsAddBhk = () => {
  const [bhkConfigs, setBhkConfigs] = useState([]);
  const [isAddingConfig, setIsAddingConfig] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [selectedProject, setSelectedProject] = useState('');
  
  const [formData, setFormData] = useState({
    projectId: '',
    projectName: '',
    bhkType: '',
    carpetArea: '',
    builtUpArea: '',
    superBuiltUpArea: '',
    price: '',
    pricePerSqft: '',
    bedrooms: '',
    bathrooms: '',
    balconies: '',
    parking: '',
    facing: '',
    floorNumber: '',
    totalFloors: '',
    possessionDate: '',
    description: '',
    amenities: [],
    specifications: {},
    images: [],
    status: 'available'
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [projects, setProjects] = useState([]);

  // Mock projects data
  useEffect(() => {
    setProjects([
      { id: 1, name: 'Luxury Villas', location: 'Gurgaon' },
      { id: 2, name: 'Sky Towers', location: 'Mumbai' },
      { id: 3, name: 'Green Valley', location: 'Bangalore' }
    ]);
  }, []);

  // Mock BHK configurations
  useEffect(() => {
    setBhkConfigs([
      {
        id: 1,
        projectId: 1,
        projectName: 'Luxury Villas',
        bhkType: '3BHK',
        carpetArea: '1500 sq ft',
        builtUpArea: '1800 sq ft',
        superBuiltUpArea: '2200 sq ft',
        price: '1.2 Cr',
        pricePerSqft: '8000',
        bedrooms: 3,
        bathrooms: 2,
        balconies: 2,
        parking: '2 Wheeler + 4 Wheeler',
        facing: 'North',
        floorNumber: '5',
        totalFloors: '15',
        possessionDate: '2024-12-31',
        description: 'Spacious 3BHK with modern amenities',
        amenities: ['Power Backup', 'Lift', 'Security', 'Gym'],
        specifications: {
          flooring: 'Vitrified Tiles',
          walls: 'Plaster of Paris',
          kitchen: 'Modular Kitchen',
            windows: 'UPVC Windows'
        },
        status: 'available'
      }
    ]);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProjectChange = (projectId) => {
    const project = projects.find(p => p.id === parseInt(projectId));
    setSelectedProject(projectId);
    setFormData(prev => ({
      ...prev,
      projectId: parseInt(projectId),
      projectName: project ? project.name : ''
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

  const handleSpecificationChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingConfig) {
      setBhkConfigs(prev => prev.map(config => 
        config.id === editingConfig.id 
          ? { ...config, ...formData }
          : config
      ));
      setEditingConfig(null);
    } else {
      const newConfig = {
        id: Date.now(),
        ...formData
      };
      setBhkConfigs(prev => [...prev, newConfig]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      projectId: '',
      projectName: '',
      bhkType: '',
      carpetArea: '',
      builtUpArea: '',
      superBuiltUpArea: '',
      price: '',
      pricePerSqft: '',
      bedrooms: '',
      bathrooms: '',
      balconies: '',
      parking: '',
      facing: '',
      floorNumber: '',
      totalFloors: '',
      possessionDate: '',
      description: '',
      amenities: [],
      specifications: {},
      images: [],
      status: 'available'
    });
    setSelectedProject('');
    setIsAddingConfig(false);
    setEditingConfig(null);
  };

  const handleEdit = (config) => {
    setEditingConfig(config);
    setFormData(config);
    setSelectedProject(config.projectId.toString());
    setIsAddingConfig(true);
  };

  const handleDelete = (id) => {
    setBhkConfigs(prev => prev.filter(config => config.id !== id));
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

  const calculatePricePerSqft = () => {
    if (formData.price && formData.carpetArea) {
      const price = parseFloat(formData.price.replace(/[^0-9]/g, ''));
      const area = parseFloat(formData.carpetArea.replace(/[^0-9]/g, ''));
      if (!isNaN(price) && !isNaN(area) && area > 0) {
        const pricePerSqft = Math.round(price / area);
        setFormData(prev => ({
          ...prev,
          pricePerSqft: pricePerSqft.toString()
        }));
      }
    }
  };

  useEffect(() => {
    calculatePricePerSqft();
  }, [formData.price, formData.carpetArea]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">BHK Configuration Manager</h1>
        <Button onClick={() => setIsAddingConfig(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add BHK Configuration
        </Button>
      </div>

      {/* Add/Edit BHK Configuration Form */}
      {isAddingConfig && (
        <Card>
          <CardHeader>
            <CardTitle>{editingConfig ? 'Edit BHK Configuration' : 'Add New BHK Configuration'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectId">Project</Label>
                  <Select value={selectedProject} onValueChange={handleProjectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name} - {project.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bhkType">BHK Type</Label>
                  <Select value={formData.bhkType} onValueChange={(value) => handleInputChange('bhkType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select BHK type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1BHK">1BHK</SelectItem>
                      <SelectItem value="2BHK">2BHK</SelectItem>
                      <SelectItem value="3BHK">3BHK</SelectItem>
                      <SelectItem value="4BHK">4BHK</SelectItem>
                      <SelectItem value="5BHK">5BHK</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="Duplex">Duplex</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Area Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Square className="w-4 h-4" />
                  Area Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="carpetArea">Carpet Area</Label>
                    <Input
                      id="carpetArea"
                      value={formData.carpetArea}
                      onChange={(e) => handleInputChange('carpetArea', e.target.value)}
                      placeholder="e.g., 1500 sq ft"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="builtUpArea">Built-up Area</Label>
                    <Input
                      id="builtUpArea"
                      value={formData.builtUpArea}
                      onChange={(e) => handleInputChange('builtUpArea', e.target.value)}
                      placeholder="e.g., 1800 sq ft"
                    />
                  </div>
                  <div>
                    <Label htmlFor="superBuiltUpArea">Super Built-up Area</Label>
                    <Input
                      id="superBuiltUpArea"
                      value={formData.superBuiltUpArea}
                      onChange={(e) => handleInputChange('superBuiltUpArea', e.target.value)}
                      placeholder="e.g., 2200 sq ft"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Total Price</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="e.g., 1.2 Cr"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pricePerSqft">Price per Sq Ft</Label>
                    <Input
                      id="pricePerSqft"
                      value={formData.pricePerSqft}
                      onChange={(e) => handleInputChange('pricePerSqft', e.target.value)}
                      placeholder="Auto-calculated"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Room Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Room Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="balconies">Balconies</Label>
                    <Input
                      id="balconies"
                      type="number"
                      value={formData.balconies}
                      onChange={(e) => handleInputChange('balconies', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="parking">Parking</Label>
                    <Input
                      id="parking"
                      value={formData.parking}
                      onChange={(e) => handleInputChange('parking', e.target.value)}
                      placeholder="e.g., 2 Wheeler + 4 Wheeler"
                    />
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="facing">Facing</Label>
                    <Select value={formData.facing} onValueChange={(value) => handleInputChange('facing', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select facing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="North">North</SelectItem>
                        <SelectItem value="South">South</SelectItem>
                        <SelectItem value="East">East</SelectItem>
                        <SelectItem value="West">West</SelectItem>
                        <SelectItem value="North-East">North-East</SelectItem>
                        <SelectItem value="North-West">North-West</SelectItem>
                        <SelectItem value="South-East">South-East</SelectItem>
                        <SelectItem value="South-West">South-West</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="floorNumber">Floor Number</Label>
                    <Input
                      id="floorNumber"
                      value={formData.floorNumber}
                      onChange={(e) => handleInputChange('floorNumber', e.target.value)}
                      placeholder="e.g., 5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalFloors">Total Floors</Label>
                    <Input
                      id="totalFloors"
                      value={formData.totalFloors}
                      onChange={(e) => handleInputChange('totalFloors', e.target.value)}
                      placeholder="e.g., 15"
                    />
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="flooring">Flooring</Label>
                    <Input
                      id="flooring"
                      value={formData.specifications.flooring || ''}
                      onChange={(e) => handleSpecificationChange('flooring', e.target.value)}
                      placeholder="e.g., Vitrified Tiles"
                    />
                  </div>
                  <div>
                    <Label htmlFor="walls">Walls</Label>
                    <Input
                      id="walls"
                      value={formData.specifications.walls || ''}
                      onChange={(e) => handleSpecificationChange('walls', e.target.value)}
                      placeholder="e.g., Plaster of Paris"
                    />
                  </div>
                  <div>
                    <Label htmlFor="kitchen">Kitchen</Label>
                    <Input
                      id="kitchen"
                      value={formData.specifications.kitchen || ''}
                      onChange={(e) => handleSpecificationChange('kitchen', e.target.value)}
                      placeholder="e.g., Modular Kitchen"
                    />
                  </div>
                  <div>
                    <Label htmlFor="windows">Windows</Label>
                    <Input
                      id="windows"
                      value={formData.specifications.windows || ''}
                      onChange={(e) => handleSpecificationChange('windows', e.target.value)}
                      placeholder="e.g., UPVC Windows"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="possessionDate">Possession Date</Label>
                  <Input
                    id="possessionDate"
                    type="date"
                    value={formData.possessionDate}
                    onChange={(e) => handleInputChange('possessionDate', e.target.value)}
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
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  placeholder="Describe the BHK configuration..."
                />
              </div>

              {/* Amenities */}
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
                      <Trash2 className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveAmenity(index)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {editingConfig ? 'Update Configuration' : 'Create Configuration'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* BHK Configurations List */}
      <div className="space-y-4">
        {bhkConfigs.map(config => (
          <Card key={config.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{config.projectName} - {config.bhkType}</h3>
                    <Badge className={getStatusColor(config.status)}>
                      {config.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{config.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                    <div><strong>Carpet Area:</strong> {config.carpetArea}</div>
                    <div><strong>Built-up Area:</strong> {config.builtUpArea}</div>
                    <div><strong>Super Built-up:</strong> {config.superBuiltUpArea}</div>
                    <div><strong>Price:</strong> {config.price}</div>
                    <div><strong>Price/Sq Ft:</strong> {config.pricePerSqft}</div>
                    <div><strong>Bedrooms:</strong> {config.bedrooms}</div>
                    <div><strong>Bathrooms:</strong> {config.bathrooms}</div>
                    <div><strong>Balconies:</strong> {config.balconies}</div>
                    <div><strong>Parking:</strong> {config.parking}</div>
                    <div><strong>Facing:</strong> {config.facing}</div>
                    <div><strong>Floor:</strong> {config.floorNumber}/{config.totalFloors}</div>
                    <div><strong>Possession:</strong> {config.possessionDate}</div>
                  </div>

                  {config.amenities.length > 0 && (
                    <div className="mb-3">
                      <strong>Amenities:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {config.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {Object.keys(config.specifications).length > 0 && (
                    <div>
                      <strong>Specifications:</strong>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1 text-sm">
                        {Object.entries(config.specifications).map(([key, value]) => (
                          <div key={key}>
                            <strong>{key}:</strong> {value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(config)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(config.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bhkConfigs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No BHK configurations added yet. Click "Add BHK Configuration" to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectsAddBhk;
