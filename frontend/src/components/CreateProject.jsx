import React, { useState } from 'react';
import axios from 'axios';
import { API } from '../App';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { ArrowLeft, FileText, Presentation, Plus, Trash2, Loader2, Sparkles } from 'lucide-react';

const CreateProject = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
    name: '',
    type: '',
    topic: '',
    outline: [''],
    slides: ['']
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleTypeSelect = (type) => {
    setProjectData({ ...projectData, type });
    setStep(2);
  };

  const addItem = () => {
    if (projectData.type === 'docx') {
      setProjectData({ ...projectData, outline: [...projectData.outline, ''] });
    } else {
      setProjectData({ ...projectData, slides: [...projectData.slides, ''] });
    }
  };

  const removeItem = (index) => {
    if (projectData.type === 'docx') {
      const newOutline = projectData.outline.filter((_, i) => i !== index);
      setProjectData({ ...projectData, outline: newOutline });
    } else {
      const newSlides = projectData.slides.filter((_, i) => i !== index);
      setProjectData({ ...projectData, slides: newSlides });
    }
  };

  const updateItem = (index, value) => {
    if (projectData.type === 'docx') {
      const newOutline = [...projectData.outline];
      newOutline[index] = value;
      setProjectData({ ...projectData, outline: newOutline });
    } else {
      const newSlides = [...projectData.slides];
      newSlides[index] = value;
      setProjectData({ ...projectData, slides: newSlides });
    }
  };

  const handleAITemplate = async () => {
    if (!projectData.topic) {
      toast.error('Please enter a topic first');
      return;
    }

    setAiLoading(true);
    try {
      const response = await axios.post(`${API}/ai-template`, {
        type: projectData.type,
        topic: projectData.topic
      });

      if (projectData.type === 'docx') {
        setProjectData({ ...projectData, outline: response.data.items });
      } else {
        setProjectData({ ...projectData, slides: response.data.items });
      }
      toast.success('Template generated successfully!');
    } catch (error) {
      toast.error('Failed to generate template');
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!projectData.name || !projectData.topic) {
      toast.error('Please fill in all required fields');
      return;
    }

    const items = projectData.type === 'docx' ? projectData.outline : projectData.slides;
    const validItems = items.filter(item => item.trim());

    if (validItems.length === 0) {
      toast.error(`Please add at least one ${projectData.type === 'docx' ? 'section' : 'slide'}`);
      return;
    }

    setLoading(true);
    try {
      const config = projectData.type === 'docx'
        ? { outline: validItems }
        : { slides: validItems };

      const response = await axios.post(`${API}/projects`, {
        name: projectData.name,
        type: projectData.type,
        topic: projectData.topic,
        config
      });

      toast.success('Project created! Generating content...');
      navigate(`/project/${response.data.id}`);
    } catch (error) {
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => step === 1 ? navigate('/dashboard') : setStep(1)}
            className="flex items-center gap-2"
            data-testid="back-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 1 ? (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Project</h1>
              <p className="text-gray-600">Choose your document type to get started</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-indigo-400"
                onClick={() => handleTypeSelect('docx')}
                data-testid="select-docx-btn"
              >
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Word Document</CardTitle>
                  <CardDescription>Create a structured document with sections and paragraphs</CardDescription>
                </CardHeader>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-indigo-400"
                onClick={() => handleTypeSelect('pptx')}
                data-testid="select-pptx-btn"
              >
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Presentation className="w-10 h-10 text-orange-600" />
                  </div>
                  <CardTitle className="text-2xl">PowerPoint</CardTitle>
                  <CardDescription>Create a presentation with slides and bullet points</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Configure {projectData.type === 'docx' ? 'Document' : 'Presentation'}
              </h1>
              <p className="text-gray-600">Set up your project structure</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Q4 Marketing Strategy"
                    value={projectData.name}
                    onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                    className="mt-1"
                    data-testid="project-name-input"
                  />
                </div>

                <div>
                  <Label htmlFor="topic">Main Topic *</Label>
                  <Textarea
                    id="topic"
                    placeholder="e.g., A comprehensive analysis of electric vehicle market trends in 2025"
                    value={projectData.topic}
                    onChange={(e) => setProjectData({ ...projectData, topic: e.target.value })}
                    rows={3}
                    className="mt-1"
                    data-testid="project-topic-input"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>{projectData.type === 'docx' ? 'Document Outline' : 'Slide Titles'} *</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAITemplate}
                      disabled={aiLoading || !projectData.topic}
                      className="flex items-center gap-2"
                      data-testid="ai-suggest-btn"
                    >
                      {aiLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                      ) : (
                        <><Sparkles className="w-4 h-4" /> Smart Suggest</>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {(projectData.type === 'docx' ? projectData.outline : projectData.slides).map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={projectData.type === 'docx' ? `Section ${index + 1}` : `Slide ${index + 1}`}
                          value={item}
                          onChange={(e) => updateItem(index, e.target.value)}
                          data-testid={`item-input-${index}`}
                        />
                        {(projectData.type === 'docx' ? projectData.outline.length : projectData.slides.length) > 1 && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeItem(index)}
                            data-testid={`remove-item-${index}`}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={addItem}
                    className="w-full mt-3"
                    data-testid="add-item-btn"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add {projectData.type === 'docx' ? 'Section' : 'Slide'}
                  </Button>
                </div>

                <Button
                  onClick={handleCreate}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  data-testid="create-and-generate-btn"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
                  ) : (
                    'Create & Generate Content'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreateProject;
