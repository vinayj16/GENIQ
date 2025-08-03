import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Download, FileText, Sparkles, Brain, Target, Eye, Image, FileDown } from 'lucide-react';
import { toast } from 'sonner';

// Types
type Education = {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description: string;
};

type Experience = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
};

type Skill = {
  id: string;
  name: string;
  level: number;
};

type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string;
  url?: string;
};

type AIAnalysis = {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  atsScore: number;
};

const ResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  // State management
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    summary: ''
  });

  const [educations, setEducations] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setPersonalInfo(data.personalInfo || {
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        github: '',
        linkedin: '',
        summary: ''
      });
      setEducations(data.educations || []);
      setExperiences(data.experiences || []);
      setSkills(data.skills || []);
      setProjects(data.projects || []);
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const resumeData = {
      personalInfo,
      educations,
      experiences,
      skills,
      projects,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [personalInfo, educations, experiences, skills, projects]);

  // Personal info handlers
  const handlePersonalInfoChange = (field: keyof typeof personalInfo, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Education handlers
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setEducations(prev => [...prev, newEducation]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducations(prev => prev.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id: string) => {
    setEducations(prev => prev.filter(edu => edu.id !== id));
  };

  // Experience handlers
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false
    };
    setExperiences(prev => [...prev, newExperience]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setExperiences(prev => prev.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id: string) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
  };

  // Skills handlers
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 3
    };
    setSkills(prev => [...prev, newSkill]);
  };

  const updateSkill = (id: string, field: keyof Skill, value: string | number) => {
    setSkills(prev => prev.map(skill =>
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  const removeSkill = (id: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== id));
  };

  // Projects handlers
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      technologies: ''
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects(prev => prev.map(project =>
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  const removeProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  // AI Analysis
  const analyzeResume = async () => {
    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis: AIAnalysis = {
        score: Math.floor(Math.random() * 30) + 70,
        atsScore: Math.floor(Math.random() * 25) + 75,
        strengths: [
          'Strong technical skills section',
          'Quantified achievements in experience',
          'Relevant project portfolio',
          'Clear and concise summary'
        ],
        improvements: [
          'Add more action verbs in descriptions',
          'Include specific metrics and numbers',
          'Optimize keywords for ATS systems',
          'Improve formatting consistency'
        ],
        suggestions: [
          'Consider adding certifications section',
          'Include volunteer work if relevant',
          'Add links to portfolio projects',
          'Tailor resume for specific job roles'
        ]
      };
      setAiAnalysis(mockAnalysis);
      setIsAnalyzing(false);
      toast.success('Resume analysis completed!');
    }, 2000);
  };

  // Generate Resume Preview
  const generateResume = () => {
    if (!personalInfo.name) {
      toast.error('Please add your name first');
      return;
    }
    setShowPreview(true);
  };

  // Download as PDF
  const downloadAsPDF = async () => {
    if (!resumeRef.current) return;
    
    setIsGenerating(true);
    try {
      // Import html2canvas and jsPDF dynamically
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${personalInfo.name || 'resume'}.pdf`);
      toast.success('Resume downloaded as PDF!');
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error('PDF generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download as JPG
  const downloadAsJPG = async () => {
    if (!resumeRef.current) return;
    
    setIsGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const link = document.createElement('a');
      link.download = `${personalInfo.name || 'resume'}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
      
      toast.success('Resume downloaded as JPG!');
    } catch (error) {
      toast.error('Failed to generate JPG');
      console.error('JPG generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Export functionality (JSON)
  const exportResume = () => {
    const resumeData = {
      personalInfo,
      educations,
      experiences,
      skills,
      projects,
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `resume-${personalInfo.name || 'untitled'}.json`;
    link.click();

    URL.revokeObjectURL(url);
    toast.success('Resume exported successfully!');
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Get skill level text
  const getSkillLevel = (level: number) => {
    const levels = ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'];
    return levels[level - 1] || 'Intermediate';
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Resume Builder</h1>
          <p className="text-muted-foreground mt-2">
            Create and optimize your professional resume with AI assistance
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={analyzeResume} disabled={isAnalyzing} variant="outline">
            <Brain className="w-4 h-4 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
          </Button>
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogTrigger asChild>
              <Button onClick={generateResume} className="bg-blue-600 hover:bg-blue-700">
                <Eye className="w-4 h-4 mr-2" />
                Generate Resume
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Resume Preview</span>
                  <div className="flex gap-2">
                    <Button 
                      onClick={downloadAsPDF} 
                      disabled={isGenerating}
                      size="sm"
                      variant="outline"
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      {isGenerating ? 'Generating...' : 'PDF'}
                    </Button>
                    <Button 
                      onClick={downloadAsJPG} 
                      disabled={isGenerating}
                      size="sm"
                      variant="outline"
                    >
                      <Image className="w-4 h-4 mr-2" />
                      {isGenerating ? 'Generating...' : 'JPG'}
                    </Button>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              {/* Resume Template */}
              <div ref={resumeRef} className="bg-white text-black p-8 shadow-lg" style={{ minHeight: '297mm' }}>
                {/* Header */}
                <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    {personalInfo.name || 'Your Name'}
                  </h1>
                  <h2 className="text-xl text-gray-600 mb-4">
                    {personalInfo.title || 'Professional Title'}
                  </h2>
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                    {personalInfo.email && (
                      <span>{personalInfo.email}</span>
                    )}
                    {personalInfo.phone && (
                      <span>{personalInfo.phone}</span>
                    )}
                    {personalInfo.location && (
                      <span>{personalInfo.location}</span>
                    )}
                    {personalInfo.website && (
                      <span>{personalInfo.website}</span>
                    )}
                    {personalInfo.linkedin && (
                      <span>LinkedIn: {personalInfo.linkedin}</span>
                    )}
                    {personalInfo.github && (
                      <span>GitHub: {personalInfo.github}</span>
                    )}
                  </div>
                </div>

                {/* Professional Summary */}
                {personalInfo.summary && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">
                      PROFESSIONAL SUMMARY
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {personalInfo.summary}
                    </p>
                  </div>
                )}

                {/* Experience */}
                {experiences.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-1">
                      PROFESSIONAL EXPERIENCE
                    </h3>
                    {experiences.map((exp, index) => (
                      <div key={exp.id} className={`mb-6 ${index !== experiences.length - 1 ? 'border-b border-gray-200 pb-4' : ''}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">
                              {exp.position}
                            </h4>
                            <h5 className="text-md font-medium text-gray-600">
                              {exp.company}
                            </h5>
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                          </div>
                        </div>
                        {exp.description && (
                          <div className="text-gray-700 leading-relaxed">
                            {exp.description.split('\n').map((line, i) => (
                              <p key={i} className="mb-1">
                                {line.startsWith('•') || line.startsWith('-') ? line : `• ${line}`}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                {educations.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-1">
                      EDUCATION
                    </h3>
                    {educations.map((edu, index) => (
                      <div key={edu.id} className={`mb-4 ${index !== educations.length - 1 ? 'border-b border-gray-200 pb-4' : ''}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">
                              {edu.degree} {edu.field && `in ${edu.field}`}
                            </h4>
                            <h5 className="text-md font-medium text-gray-600">
                              {edu.school}
                            </h5>
                            {edu.gpa && (
                              <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                          </div>
                        </div>
                        {edu.description && (
                          <p className="text-gray-700 leading-relaxed">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-1">
                      TECHNICAL SKILLS
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {skills.map((skill) => (
                        <div key={skill.id} className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">{skill.name}</span>
                          <span className="text-sm text-gray-600">
                            {getSkillLevel(skill.level)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-1">
                      PROJECTS
                    </h3>
                    {projects.map((project, index) => (
                      <div key={project.id} className={`mb-6 ${index !== projects.length - 1 ? 'border-b border-gray-200 pb-4' : ''}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {project.title}
                          </h4>
                          {project.url && (
                            <span className="text-sm text-gray-600">
                              {project.url}
                            </span>
                          )}
                        </div>
                        {project.technologies && (
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Technologies:</strong> {project.technologies}
                          </p>
                        )}
                        {project.description && (
                          <p className="text-gray-700 leading-relaxed">
                            {project.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={exportResume} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={personalInfo.name}
                    onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Professional Title</label>
                  <Input
                    value={personalInfo.title}
                    onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={personalInfo.phone}
                    onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={personalInfo.location}
                    onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Website</label>
                  <Input
                    value={personalInfo.website}
                    onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                    placeholder="https://johndoe.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">GitHub</label>
                  <Input
                    value={personalInfo.github}
                    onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                    placeholder="https://github.com/johndoe"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">LinkedIn</label>
                  <Input
                    value={personalInfo.linkedin}
                    onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Professional Summary</label>
                <Textarea
                  value={personalInfo.summary}
                  onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                  placeholder="Brief professional summary highlighting your key skills and experience..."
                  rows={4}
                />
              </div>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Work Experience</h3>
                <Button onClick={addExperience} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>

              {experiences.map((exp) => (
                <div key={exp.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="text-sm font-medium">Company</label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Company Name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Position</label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          placeholder="Job Title"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Start Date</label>
                        <Input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Date</label>
                        <Input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          disabled={exp.current}
                        />
                        <div className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            id={`current-${exp.id}`}
                            checked={exp.current}
                            onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor={`current-${exp.id}`} className="text-sm">
                            Currently working here
                          </label>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => removeExperience(exp.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      placeholder="Describe your responsibilities and achievements..."
                      rows={3}
                    />
                  </div>
                </div>
              ))}

              {experiences.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No work experience added yet</p>
                  <p className="text-sm">Click "Add Experience" to get started</p>
                </div>
              )}
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Education</h3>
                <Button onClick={addEducation} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </div>

              {educations.map((edu) => (
                <div key={edu.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="text-sm font-medium">School</label>
                        <Input
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                          placeholder="University Name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Degree</label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="Bachelor's, Master's, etc."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Field of Study</label>
                        <Input
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                          placeholder="Computer Science"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">GPA (Optional)</label>
                        <Input
                          value={edu.gpa || ''}
                          onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                          placeholder="3.8"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Start Date</label>
                        <Input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Date</label>
                        <Input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => removeEducation(edu.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={edu.description}
                      onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                      placeholder="Relevant coursework, achievements, activities..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}

              {educations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No education added yet</p>
                  <p className="text-sm">Click "Add Education" to get started</p>
                </div>
              )}
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Skills</h3>
                <Button onClick={addSkill} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <label className="text-sm font-medium">Skill Name</label>
                        <Input
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                          placeholder="JavaScript, React, etc."
                        />
                      </div>
                      <Button
                        onClick={() => removeSkill(skill.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Proficiency Level</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={skill.level}
                          onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium w-12">
                          {skill.level}/5
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Beginner</span>
                        <span>Expert</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {skills.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No skills added yet</p>
                  <p className="text-sm">Click "Add Skill" to get started</p>
                </div>
              )}
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Projects</h3>
                <Button onClick={addProject} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </div>

              {projects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="text-sm font-medium">Project Title</label>
                        <Input
                          value={project.title}
                          onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                          placeholder="Project Name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">URL (Optional)</label>
                        <Input
                          value={project.url || ''}
                          onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                          placeholder="https://github.com/user/project"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => removeProject(project.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Technologies Used</label>
                    <Input
                      value={project.technologies}
                      onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                      placeholder="React, Node.js, MongoDB, etc."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={project.description}
                      onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                      placeholder="Describe the project, your role, and key achievements..."
                      rows={3}
                    />
                  </div>
                </div>
              ))}

              {projects.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No projects added yet</p>
                  <p className="text-sm">Click "Add Project" to get started</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Analysis Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="border rounded-lg p-6 space-y-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold">AI Analysis</h3>
              </div>

              {aiAnalysis ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {aiAnalysis.score}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Overall Score
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {aiAnalysis.atsScore}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ATS Score
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {aiAnalysis.strengths.map((strength, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-orange-600 mb-2">Improvements</h4>
                    <ul className="space-y-1">
                      {aiAnalysis.improvements.map((improvement, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="text-orange-500 mr-2">•</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-blue-600 mb-2">Suggestions</h4>
                    <ul className="space-y-1">
                      {aiAnalysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    Get AI-powered insights about your resume
                  </p>
                  <Button onClick={analyzeResume} disabled={isAnalyzing} className="w-full">
                    <Brain className="w-4 h-4 mr-2" />
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;