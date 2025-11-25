import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Download, Loader2, ThumbsUp, ThumbsDown, MessageSquare, Sparkles, History } from 'lucide-react';

const ProjectEditor = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState({});
  const [refining, setRefining] = useState({});
  const [feedback, setFeedback] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const [projectRes, sectionsRes] = await Promise.all([
        axios.get(`${API}/projects/${projectId}`),
        axios.get(`${API}/projects/${projectId}/sections`)
      ]);

      setProject(projectRes.data);
      
      // Load feedback and comments for each section
      const sectionsWithData = await Promise.all(
        sectionsRes.data.map(async (section) => {
          try {
            const [feedbackRes, commentsRes, revisionsRes] = await Promise.all([
              axios.get(`${API}/sections/${section.id}/feedback`),
              axios.get(`${API}/sections/${section.id}/comments`),
              axios.get(`${API}/sections/${section.id}/revisions`)
            ]);
            
            // Set initial feedback and comments state
            const sectionId = section.id;
            setFeedback(prev => ({...prev, [sectionId]: feedbackRes.data.feedback}));
            setComments(prev => ({...prev, [sectionId]: feedbackRes.data.comment || ''}));
            
            return {
              ...section,
              persistedComments: commentsRes.data || [],
              revisionHistory: revisionsRes.data || [],
              liked: feedbackRes.data.liked,
              disliked: feedbackRes.data.disliked
            };
          } catch (error) {
            console.error(`Failed to load data for section ${section.id}:`, error);
            return {
              ...section,
              persistedComments: [],
              revisionHistory: [],
              liked: false,
              disliked: false
            };
          }
        })
      );
      
      setSections(sectionsWithData);

      if (sectionsRes.data.length === 0) {
        await generateContent();
      }
    } catch (error) {
      toast.error('Failed to load project');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async () => {
    if (generating) {
      toast.info('Generation is already in progress. Please wait...');
      return;
    }
    
    setGenerating(true);
    toast.info('🤖 Starting content generation... This may take 30-60 seconds.', {
      duration: 5000,
      id: 'generation-start'
    });
    
    try {
      const response = await axios.post(`${API}/generate-content`, {
        project_id: projectId
      });
      
      if (response.data.message === 'Content already generated') {
        toast.success('✅ Content is ready!');
        setSections(response.data.sections || []);
      } else {
        toast.success('✅ Content generated successfully!');
        await fetchProject();
        
        // Start progress checking in case of network issues
        const progressCheck = setInterval(async () => {
          if (sections.length === 0) {
            try {
              await fetchProject();
            } catch (err) {
              console.log('Progress check failed:', err);
            }
          } else {
            clearInterval(progressCheck);
          }
        }, 5000);
        
        // Clear interval after 2 minutes
        setTimeout(() => clearInterval(progressCheck), 120000);
      }
    } catch (error) {
      console.error('Generation error:', error);
      
      if (error.response?.status === 400 && error.response?.data?.detail?.includes('already generated')) {
        toast.success('✅ Content is already available!');
        await fetchProject();
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        toast.info('⏳ Generation is processing... Please wait, content will appear when ready.', {
          duration: 8000,
          id: 'generation-progress'
        });
        
        // Start checking for content periodically
        const checkInterval = setInterval(async () => {
          try {
            await fetchProject();
            if (sections.length > 0) {
              clearInterval(checkInterval);
              toast.success('✅ Content is now ready!');
            }
          } catch (err) {
            // Continue checking
          }
        }, 3000);
        
        // Stop checking after 3 minutes
        setTimeout(() => {
          clearInterval(checkInterval);
          toast.info('💡 If content doesn\'t appear, try refreshing the page.');
        }, 180000);
      } else {
        toast.error('❌ Generation failed. Please try again.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleRefine = async (sectionId) => {
    if (!refinePrompt[sectionId]) {
      toast.error('Please enter a refinement instruction');
      return;
    }

    setRefining({ ...refining, [sectionId]: true });
    try {
      const response = await axios.post(`${API}/refine-content`, {
        section_id: sectionId,
        prompt: refinePrompt[sectionId]
      });

      // Add new revision to history immediately
      const newRevision = {
        prompt: refinePrompt[sectionId],
        response: response.data.content,
        created_at: new Date().toISOString(),
        timestamp: new Date().toISOString()
      };
      
      setSections(sections.map(s =>
        s.id === sectionId ? { 
          ...s, 
          content: response.data.content,
          revisionHistory: [newRevision, ...(s.revisionHistory || [])]
        } : s
      ));
      setRefinePrompt({ ...refinePrompt, [sectionId]: '' });
      toast.success('Content refined!');
    } catch (error) {
      toast.error('Failed to refine content');
    } finally {
      setRefining({ ...refining, [sectionId]: false });
    }
  };

  const handleFeedback = async (sectionId, feedbackType) => {
    try {
      await axios.post(`${API}/feedback`, {
        section_id: sectionId,
        feedback: feedbackType,
        comment: comments[sectionId] || ''
      });
      
      // Update local state immediately
      setFeedback({ ...feedback, [sectionId]: feedbackType });
      
      // Update sections state to reflect the change
      setSections(sections.map(section => 
        section.id === sectionId 
          ? { 
              ...section, 
              liked: feedbackType === 'like',
              disliked: feedbackType === 'dislike'
            }
          : section
      ));
      
      toast.success(`Feedback recorded: ${feedbackType}`);
    } catch (error) {
      toast.error('Failed to save feedback');
    }
  };

  const handleComment = async (sectionId) => {
    const comment = comments[sectionId]?.trim();
    if (!comment) return;

    try {
      await axios.post(`${API}/feedback`, {
        section_id: sectionId,
        feedback: feedback[sectionId] || '',
        comment: comment
      });
      
      // Add comment to section's persisted comments immediately
      const newComment = {
        comment: comment,
        created_at: new Date().toISOString()
      };
      
      setSections(sections.map(section => 
        section.id === sectionId 
          ? { 
              ...section, 
              persistedComments: [newComment, ...(section.persistedComments || [])]
            }
          : section
      ));
      
      // Clear the comment input
      setComments({ ...comments, [sectionId]: '' });
      toast.success('Comment saved');
    } catch (error) {
      toast.error('Failed to save comment');
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API}/export/${projectId}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${project.name}.${project.type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Document exported successfully!');
    } catch (error) {
      toast.error('Failed to export document');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                data-testid="back-to-dashboard-btn"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project?.name}</h1>
                <p className="text-sm text-gray-500">{project?.topic}</p>
              </div>
            </div>
            <Button
              onClick={handleExport}
              disabled={sections.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              data-testid="export-btn"
            >
              <Download className="w-4 h-4 mr-2" />
              Export {project?.type === 'docx' ? 'Word' : 'PowerPoint'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {generating ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating Content...</h3>
              <p className="text-gray-600">Generating your document sections</p>
            </CardContent>
          </Card>
        ) : sections.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20">
              {generating ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🤖 AI is generating your content...</h3>
                  <p className="text-gray-600 mb-4">This usually takes 30-60 seconds. Please don't close this tab.</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                    💡 Tip: Generation continues even if you see network errors. Content will appear when ready.
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">No content generated yet</p>
                  <Button 
                    onClick={generateContent} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    🤖 Generate Content
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {sections.map((section, index) => (
              <Card key={section.id} className="border-l-4 border-l-indigo-500" data-testid={`section-${section.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">
                        {project.type === 'docx' ? `Section ${index + 1}` : `Slide ${index + 1}`}: {section.title}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={(section.liked || feedback[section.id] === 'like') ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFeedback(section.id, 'like')}
                        data-testid={`like-btn-${section.id}`}
                        className={`${(section.liked || feedback[section.id] === 'like') ? 'bg-green-500 hover:bg-green-600' : ''}`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={(section.disliked || feedback[section.id] === 'dislike') ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFeedback(section.id, 'dislike')}
                        data-testid={`dislike-btn-${section.id}`}
                        className={`${(section.disliked || feedback[section.id] === 'dislike') ? 'bg-red-500 hover:bg-red-600' : ''}`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800 whitespace-pre-wrap" data-testid={`section-content-${section.id}`}>
                      {section.content}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Enter refinement instructions (e.g., 'Make this more formal', 'Add more details', 'Shorten to 100 words')"
                        value={refinePrompt[section.id] || ''}
                        onChange={(e) => setRefinePrompt({ ...refinePrompt, [section.id]: e.target.value })}
                        rows={2}
                        data-testid={`refine-input-${section.id}`}
                      />
                      <Button
                        onClick={() => handleRefine(section.id)}
                        disabled={refining[section.id]}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        data-testid={`refine-btn-${section.id}`}
                      >
                        {refining[section.id] ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <><Sparkles className="w-4 h-4 mr-2" /> Refine</>
                        )}
                      </Button>
                    </div>

                    {/* Display revision history */}
                    {section.revisionHistory && section.revisionHistory.length > 0 && (
                      <div className="mb-4 space-y-3">
                        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <History className="w-4 h-4" />
                          Revision History ({section.revisionHistory.length} revisions)
                        </h4>
                        {section.revisionHistory.map((revision, revisionIndex) => (
                          <div key={revisionIndex} className="bg-purple-50 p-3 rounded border-l-4 border-purple-400 space-y-2">
                            <div>
                              <p className="text-xs font-medium text-purple-800 mb-1">Prompt:</p>
                              <p className="text-sm text-purple-700 italic">"{revision.prompt}"</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-purple-800 mb-1">Response:</p>
                              <p className="text-sm text-gray-700 bg-white p-2 rounded border">{revision.response}</p>
                            </div>
                            <p className="text-xs text-purple-600">
                              {new Date(revision.created_at).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Display existing comments */}
                    {section.persistedComments && section.persistedComments.length > 0 && (
                      <div className="mb-4 space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Previous Comments
                        </h4>
                        {section.persistedComments.map((comment, commentIndex) => (
                          <div key={commentIndex} className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                            <p className="text-sm text-gray-700">{comment.comment}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(comment.created_at).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Add new comment */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 mt-2 text-gray-500" />
                        <Textarea
                          placeholder="Add your comments or notes..."
                          value={comments[section.id] || ''}
                          onChange={(e) => setComments({ ...comments, [section.id]: e.target.value })}
                          rows={2}
                          className="flex-1"
                          data-testid={`comment-input-${section.id}`}
                        />
                      </div>
                      {comments[section.id]?.trim() && (
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            onClick={() => handleComment(section.id)}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            Save Comment
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectEditor;
