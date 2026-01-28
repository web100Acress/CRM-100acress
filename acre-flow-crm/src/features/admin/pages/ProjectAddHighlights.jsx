import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save } from 'lucide-react';

const ProjectAddHighlights = () => {
  const [highlights, setHighlights] = useState([
    { id: 1, title: '', description: '' }
  ]);

  const addHighlight = () => {
    setHighlights([
      ...highlights,
      { id: Date.now(), title: '', description: '' }
    ]);
  };

  const removeHighlight = (id) => {
    setHighlights(highlights.filter(highlight => highlight.id !== id));
  };

  const updateHighlight = (id, field, value) => {
    setHighlights(highlights.map(highlight =>
      highlight.id === id ? { ...highlight, [field]: value } : highlight
    ));
  };

  const handleSave = () => {
    console.log('Saving highlights:', highlights);
    // TODO: Add save functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Project Highlights</h1>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Highlights
        </Button>
      </div>

      <div className="space-y-4">
        {highlights.map((highlight, index) => (
          <Card key={highlight.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Highlight {index + 1}</span>
                {highlights.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeHighlight(highlight.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`title-${highlight.id}`}>Title</Label>
                <Input
                  id={`title-${highlight.id}`}
                  value={highlight.title}
                  onChange={(e) => updateHighlight(highlight.id, 'title', e.target.value)}
                  placeholder="Enter highlight title"
                />
              </div>
              <div>
                <Label htmlFor={`description-${highlight.id}`}>Description</Label>
                <Textarea
                  id={`description-${highlight.id}`}
                  value={highlight.description}
                  onChange={(e) => updateHighlight(highlight.id, 'description', e.target.value)}
                  placeholder="Enter highlight description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          onClick={addHighlight}
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Another Highlight
        </Button>
      </div>
    </div>
  );
};

export default ProjectAddHighlights;
