import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Loader2, Pencil, Trash2, Plus, Save, X, GraduationCap, BookOpen, Award, Briefcase, Calendar, MapPin, Globe, Star, Target, Trophy, Settings, User, Mail, Phone, Building } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  startYear: string;
  endYear: string;
  description: string;
  earned: boolean;
  icon: string;
  title: string;
  website: string;
  gpa?: string;
  honors?: string;
}

interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate: string;
  endDate?: string;
  status: 'completed' | 'in-progress' | 'planned';
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

interface Language {
  id: string;
  name: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
}

interface Preference {
  emailNotifications: boolean;
  profileVisibility: 'public' | 'private' | 'connections';
  jobAlerts: boolean;
  marketingEmails: boolean;
  twoFactorAuth: boolean;
  darkMode: boolean;
}

interface ProfileData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  dateOfBirth?: string;
  nationality?: string;
  profilePicture?: string;

  // Professional Information
  currentRole?: string;
  currentCompany?: string;
  yearsOfExperience?: string;
  salaryExpectation?: string;
  availabilityDate?: string;
  workAuthorization?: string;
  remoteWork: boolean;
  willingToRelocate: boolean;

  // Social Links
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;

  // Arrays
  education: Education[];
  workExperience: WorkExperience[];
  projects: Project[];
  skills: string[];
  certifications: Certification[];
  languages: Language[];
  achievements: string[];
  interests: string[];

  // Preferences
  preferences: Preference;
}

const initialEducation: Omit<Education, 'id'> = {
  degree: '',
  field: '',
  institution: '',
  startYear: '',
  endYear: '',
  description: '',
  earned: false,
  icon: '',
  title: '',
  website: '',
  gpa: '',
  honors: ''
};

const initialWorkExperience: Omit<WorkExperience, 'id'> = {
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  achievements: [],
  technologies: []
};

const initialProject: Omit<Project, 'id'> = {
  name: '',
  description: '',
  technologies: [],
  url: '',
  github: '',
  startDate: '',
  endDate: '',
  status: 'completed'
};

const initialCertification: Omit<Certification, 'id'> = {
  name: '',
  issuer: '',
  issueDate: '',
  expiryDate: '',
  credentialId: '',
  url: ''
};

const initialLanguage: Omit<Language, 'id'> = {
  name: '',
  proficiency: 'intermediate'
};

const initialProfile: ProfileData = {
  // Personal Information
  fullName: '',
  email: '',
  phone: '',
  location: '',
  bio: '',
  dateOfBirth: '',
  nationality: '',
  profilePicture: '',

  // Professional Information
  currentRole: '',
  currentCompany: '',
  yearsOfExperience: '',
  salaryExpectation: '',
  availabilityDate: '',
  workAuthorization: 'authorized',
  remoteWork: false,
  willingToRelocate: false,

  // Social Links
  website: '',
  github: '',
  linkedin: '',
  twitter: '',
  portfolio: '',

  // Arrays
  education: [],
  workExperience: [],
  projects: [],
  skills: [],
  certifications: [],
  languages: [],
  achievements: [],
  interests: [],

  // Preferences
  preferences: {
    emailNotifications: true,
    profileVisibility: 'public',
    jobAlerts: true,
    marketingEmails: false,
    twoFactorAuth: false,
    darkMode: false
  }
};

function Profile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newEducation, setNewEducation] = useState<Omit<Education, 'id'>>(initialEducation);
  const [newWorkExperience, setNewWorkExperience] = useState<Omit<WorkExperience, 'id'>>(initialWorkExperience);
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>(initialProject);
  const [newCertification, setNewCertification] = useState<Omit<Certification, 'id'>>(initialCertification);
  const [newLanguage, setNewLanguage] = useState<Omit<Language, 'id'>>(initialLanguage);
  const [newAchievement, setNewAchievement] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError('');
        // TODO: Uncomment when backend is ready
        // const data = await apiService.getUserProfile();
        // setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile data. Using sample data.');
        toast({
          title: 'Error',
          description: 'Could not load profile data. Using sample data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      setIsLoading(true);
      setError('');

      // Validate required fields
      if (!profile.fullName || !profile.email) {
        throw new Error('Full name and email are required');
      }

      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random success/failure
          const isSuccess = Math.random() > 0.2;
          if (isSuccess) {
            resolve('Success');
          } else {
            reject(new Error('Failed to connect to server'));
          }
        }, 1000);
      });

      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
        variant: 'default',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      console.error('Error updating profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to initial state
    setProfile(initialProfile);
    setNewEducation(initialEducation);
    setNewSkill('');
    setError('');
    setIsEditing(false);

    toast({
      title: 'Changes discarded',
      description: 'Your changes have been discarded',
    });
  };

  const handleAddEducation = () => {
    try {
      // Validate required fields
      if (!newEducation.degree || !newEducation.institution) {
        throw new Error('Degree and institution are required');
      }

      // Validate years
      if (newEducation.startYear && newEducation.endYear) {
        const start = parseInt(newEducation.startYear);
        const end = parseInt(newEducation.endYear);
        if (end < start) {
          throw new Error('End year cannot be before start year');
        }
      }

      const education: Education = {
        ...newEducation,
        id: Date.now().toString(),
        earned: true,
        icon: '🎓',
        title: newEducation.degree
      };

      setProfile(prev => ({
        ...prev,
        education: [...prev.education, education],
      }));

      // Reset the form
      setNewEducation(initialEducation);

      toast({
        title: 'Success',
        description: 'Education added successfully!',
        variant: 'default',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add education';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const removeEducation = (id: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));

    toast({
      title: 'Success',
      description: 'Education removed successfully',
    });
  };

  const handleRemoveEducation = (id: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...profile.skills];
    newSkills[index] = value;
    setProfile(prev => ({
      ...prev,
      skills: newSkills
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Additional utility functions
  const addAchievement = () => {
    if (newAchievement.trim()) {
      setProfile(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
      toast({
        title: 'Success',
        description: 'Achievement added successfully!',
      });
    }
  };

  const removeAchievement = (index: number) => {
    setProfile(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const addInterest = () => {
    if (newInterest.trim()) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
      toast({
        title: 'Success',
        description: 'Interest added successfully!',
      });
    }
  };

  const removeInterest = (index: number) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.name.trim()) {
      const language: Language = {
        ...newLanguage,
        id: Date.now().toString()
      };
      setProfile(prev => ({
        ...prev,
        languages: [...prev.languages, language]
      }));
      setNewLanguage(initialLanguage);
      toast({
        title: 'Success',
        description: 'Language added successfully!',
      });
    }
  };

  const removeLanguage = (id: string) => {
    setProfile(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        {isEditing ? (
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-md text-destructive">
          {error}
        </div>
      )}

      <Tabs
        defaultValue="personal"
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="certifications">Certs</TabsTrigger>
          <TabsTrigger value="preferences">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  {isEditing ? (
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) =>
                        setProfile({ ...profile, fullName: e.target.value })
                      }
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-sm">{profile.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="Enter your email"
                    />
                  ) : (
                    <p className="text-sm">{profile.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-sm">{profile.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      placeholder="Enter your location"
                    />
                  ) : (
                    <p className="text-sm">{profile.location}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentRole">Role / Position</Label>
                  {isEditing ? (
                    <Input
                      id="currentRole"
                      value={profile.currentRole || ''}
                      onChange={(e) => setProfile({ ...profile, currentRole: e.target.value })}
                      placeholder="e.g., Software Engineer"
                    />
                  ) : (
                    <p className="text-sm">{profile.currentRole || 'Not specified'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentCompany">Company</Label>
                  {isEditing ? (
                    <Input
                      id="currentCompany"
                      value={profile.currentCompany || ''}
                      onChange={(e) => setProfile({ ...profile, currentCompany: e.target.value })}
                      placeholder="Enter your company"
                    />
                  ) : (
                    <p className="text-sm">{profile.currentCompany || 'Not specified'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                  {isEditing ? (
                    <Select
                      value={profile.yearsOfExperience}
                      onValueChange={(value) => setProfile({ ...profile, yearsOfExperience: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select years of experience" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Year' : 'Years'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm">{profile.yearsOfExperience ? `${profile.yearsOfExperience} years` : 'Not specified'}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="min-h-[120px]"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-sm">{profile.bio}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Social Links</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-sm text-muted-foreground">Website:</span>
                      {isEditing ? (
                        <Input
                          value={profile.website || ''}
                          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                          placeholder="https://yourwebsite.com"
                          className="flex-1"
                        />
                      ) : (
                        <p className="text-sm flex-1">{profile.website || 'Not specified'}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-sm text-muted-foreground">GitHub:</span>
                      {isEditing ? (
                        <Input
                          value={profile.github || ''}
                          onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                          placeholder="https://github.com/username"
                          className="flex-1"
                        />
                      ) : (
                        <p className="text-sm flex-1">{profile.github || 'Not specified'}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-sm text-muted-foreground">LinkedIn:</span>
                      {isEditing ? (
                        <Input
                          value={profile.linkedin || ''}
                          onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                          placeholder="https://linkedin.com/in/username"
                          className="flex-1"
                        />
                      ) : (
                        <p className="text-sm flex-1">{profile.linkedin || 'Not specified'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>
                Manage your educational background and qualifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h3 className="text-lg font-medium">Add New Education</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="degree">Degree *</Label>
                      <Input
                        id="degree"
                        value={newEducation.degree}
                        onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                        placeholder="e.g., Bachelor of Science"
                      />
                    </div>
                    <div>
                      <Label htmlFor="field">Field of Study *</Label>
                      <Input
                        id="field"
                        value={newEducation.field}
                        onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="institution">Institution *</Label>
                      <Input
                        id="institution"
                        value={newEducation.institution}
                        onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                        placeholder="e.g., University of California"
                      />
                    </div>
                    <div>
                      <Label htmlFor="startYear">Start Year</Label>
                      <Input
                        id="startYear"
                        type="number"
                        value={newEducation.startYear}
                        onChange={(e) => setNewEducation({ ...newEducation, startYear: e.target.value })}
                        placeholder="YYYY"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endYear">End Year</Label>
                      <Input
                        id="endYear"
                        type="number"
                        value={newEducation.endYear}
                        onChange={(e) => setNewEducation({ ...newEducation, endYear: e.target.value })}
                        placeholder="YYYY"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="eduDescription">Description</Label>
                      <Textarea
                        id="eduDescription"
                        value={newEducation.description}
                        onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
                        placeholder="Additional details about your education"
                        className="min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Button
                        type="button"
                        onClick={handleAddEducation}
                        disabled={!newEducation.degree || !newEducation.institution}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Education History</h3>
                {profile.education.length === 0 ? (
                  <p className="text-muted-foreground">No education history added yet.</p>
                ) : (
                  <div className="space-y-4">
                    {profile.education.map((edu) => (
                      <Card key={edu.id} className="p-4 relative">
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveEducation(edu.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <GraduationCap className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{edu.degree} in {edu.field}</h4>
                            <p className="text-muted-foreground">{edu.institution}</p>
                            {edu.startYear || edu.endYear ? (
                              <p className="text-sm text-muted-foreground">
                                {edu.startYear} - {edu.endYear || 'Present'}
                              </p>
                            ) : null}
                            {edu.description && (
                              <p className="mt-2 text-sm">{edu.description}</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>
                Manage your technical and professional skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {profile.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={skill}
                          onChange={(e) => handleSkillChange(index, e.target.value)}
                          placeholder="Enter a skill"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSkill(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Enter a new skill"
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addSkill}
                      disabled={!newSkill.trim()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.length > 0 ? (
                    profile.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No skills added yet.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Professional Tab */}
        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>
                Update your career and professional details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentRole">Current Role</Label>
                  {isEditing ? (
                    <Input
                      id="currentRole"
                      value={profile.currentRole || ''}
                      onChange={(e) => setProfile({ ...profile, currentRole: e.target.value })}
                      placeholder="e.g., Senior Software Engineer"
                    />
                  ) : (
                    <p className="text-sm">{profile.currentRole || 'Not specified'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentCompany">Current Company</Label>
                  {isEditing ? (
                    <Input
                      id="currentCompany"
                      value={profile.currentCompany || ''}
                      onChange={(e) => setProfile({ ...profile, currentCompany: e.target.value })}
                      placeholder="e.g., Google Inc."
                    />
                  ) : (
                    <p className="text-sm">{profile.currentCompany || 'Not specified'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                  {isEditing ? (
                    <Select
                      value={profile.yearsOfExperience}
                      onValueChange={(value) => setProfile({ ...profile, yearsOfExperience: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select years of experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Less than 1 year</SelectItem>
                        {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Year' : 'Years'}
                          </SelectItem>
                        ))}
                        <SelectItem value="20+">20+ Years</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm">{profile.yearsOfExperience ? `${profile.yearsOfExperience} years` : 'Not specified'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workAuthorization">Work Authorization</Label>
                  {isEditing ? (
                    <Select
                      value={profile.workAuthorization}
                      onValueChange={(value) => setProfile({ ...profile, workAuthorization: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select work authorization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="authorized">Authorized to work</SelectItem>
                        <SelectItem value="visa-required">Visa required</SelectItem>
                        <SelectItem value="student">Student visa</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm">{profile.workAuthorization || 'Not specified'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryExpectation">Salary Expectation</Label>
                  {isEditing ? (
                    <Input
                      id="salaryExpectation"
                      value={profile.salaryExpectation || ''}
                      onChange={(e) => setProfile({ ...profile, salaryExpectation: e.target.value })}
                      placeholder="e.g., $80,000 - $100,000"
                    />
                  ) : (
                    <p className="text-sm">{profile.salaryExpectation || 'Not specified'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availabilityDate">Availability Date</Label>
                  {isEditing ? (
                    <Input
                      id="availabilityDate"
                      type="date"
                      value={profile.availabilityDate || ''}
                      onChange={(e) => setProfile({ ...profile, availabilityDate: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm">{profile.availabilityDate || 'Not specified'}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Remote Work</Label>
                    <p className="text-sm text-muted-foreground">Open to remote work opportunities</p>
                  </div>
                  {isEditing ? (
                    <Switch
                      checked={profile.remoteWork}
                      onCheckedChange={(checked) => setProfile({ ...profile, remoteWork: checked })}
                    />
                  ) : (
                    <Badge variant={profile.remoteWork ? "default" : "secondary"}>
                      {profile.remoteWork ? "Yes" : "No"}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Willing to Relocate</Label>
                    <p className="text-sm text-muted-foreground">Open to relocation for the right opportunity</p>
                  </div>
                  {isEditing ? (
                    <Switch
                      checked={profile.willingToRelocate}
                      onCheckedChange={(checked) => setProfile({ ...profile, willingToRelocate: checked })}
                    />
                  ) : (
                    <Badge variant={profile.willingToRelocate ? "default" : "secondary"}>
                      {profile.willingToRelocate ? "Yes" : "No"}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>
                Manage your professional work history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h3 className="text-lg font-medium">Add New Experience</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jobTitle">Job Title *</Label>
                      <Input
                        id="jobTitle"
                        value={newWorkExperience.title}
                        onChange={(e) => setNewWorkExperience({ ...newWorkExperience, title: e.target.value })}
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        value={newWorkExperience.company}
                        onChange={(e) => setNewWorkExperience({ ...newWorkExperience, company: e.target.value })}
                        placeholder="e.g., Google Inc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="jobLocation">Location</Label>
                      <Input
                        id="jobLocation"
                        value={newWorkExperience.location}
                        onChange={(e) => setNewWorkExperience({ ...newWorkExperience, location: e.target.value })}
                        placeholder="e.g., San Francisco, CA"
                      />
                    </div>
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="month"
                        value={newWorkExperience.startDate}
                        onChange={(e) => setNewWorkExperience({ ...newWorkExperience, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="month"
                        value={newWorkExperience.endDate}
                        onChange={(e) => setNewWorkExperience({ ...newWorkExperience, endDate: e.target.value })}
                        disabled={newWorkExperience.current}
                      />
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          id="currentJob"
                          checked={newWorkExperience.current}
                          onChange={(e) => setNewWorkExperience({ ...newWorkExperience, current: e.target.checked })}
                          className="mr-2"
                        />
                        <Label htmlFor="currentJob" className="text-sm">Currently working here</Label>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="jobDescription">Description</Label>
                      <Textarea
                        id="jobDescription"
                        value={newWorkExperience.description}
                        onChange={(e) => setNewWorkExperience({ ...newWorkExperience, description: e.target.value })}
                        placeholder="Describe your role and responsibilities..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Button
                        type="button"
                        onClick={() => {
                          if (newWorkExperience.title && newWorkExperience.company) {
                            const experience: WorkExperience = {
                              ...newWorkExperience,
                              id: Date.now().toString(),
                              achievements: [],
                              technologies: []
                            };
                            setProfile(prev => ({
                              ...prev,
                              workExperience: [...prev.workExperience, experience]
                            }));
                            setNewWorkExperience(initialWorkExperience);
                            toast({
                              title: 'Success',
                              description: 'Work experience added successfully!',
                            });
                          }
                        }}
                        disabled={!newWorkExperience.title || !newWorkExperience.company}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Work History</h3>
                {profile.workExperience.length === 0 ? (
                  <p className="text-muted-foreground">No work experience added yet.</p>
                ) : (
                  <div className="space-y-4">
                    {profile.workExperience.map((exp) => (
                      <Card key={exp.id} className="p-4 relative">
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setProfile(prev => ({
                              ...prev,
                              workExperience: prev.workExperience.filter(e => e.id !== exp.id)
                            }))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Briefcase className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{exp.title}</h4>
                            <p className="text-muted-foreground">{exp.company}</p>
                            {exp.location && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {exp.location}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </p>
                            {exp.description && (
                              <p className="mt-2 text-sm">{exp.description}</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Showcase your personal and professional projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h3 className="text-lg font-medium">Add New Project</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="projectName">Project Name *</Label>
                      <Input
                        id="projectName"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        placeholder="e.g., E-commerce Platform"
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectStatus">Status</Label>
                      <Select
                        value={newProject.status}
                        onValueChange={(value: 'completed' | 'in-progress' | 'planned') =>
                          setNewProject({ ...newProject, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="planned">Planned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="projectUrl">Live URL</Label>
                      <Input
                        id="projectUrl"
                        value={newProject.url}
                        onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                        placeholder="https://project-demo.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectGithub">GitHub URL</Label>
                      <Input
                        id="projectGithub"
                        value={newProject.github}
                        onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                        placeholder="https://github.com/user/project"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="projectDescription">Description</Label>
                      <Textarea
                        id="projectDescription"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="Describe your project..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Button
                        type="button"
                        onClick={() => {
                          if (newProject.name) {
                            const project: Project = {
                              ...newProject,
                              id: Date.now().toString(),
                              technologies: []
                            };
                            setProfile(prev => ({
                              ...prev,
                              projects: [...prev.projects, project]
                            }));
                            setNewProject(initialProject);
                            toast({
                              title: 'Success',
                              description: 'Project added successfully!',
                            });
                          }
                        }}
                        disabled={!newProject.name}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Project Portfolio</h3>
                {profile.projects.length === 0 ? (
                  <p className="text-muted-foreground">No projects added yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.projects.map((project) => (
                      <Card key={project.id} className="p-4 relative">
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setProfile(prev => ({
                              ...prev,
                              projects: prev.projects.filter(p => p.id !== project.id)
                            }))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium">{project.name}</h4>
                            <Badge variant={
                              project.status === 'completed' ? 'default' :
                                project.status === 'in-progress' ? 'secondary' : 'outline'
                            }>
                              {project.status}
                            </Badge>
                          </div>
                          {project.description && (
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                          )}
                          <div className="flex gap-2">
                            {project.url && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={project.url} target="_blank" rel="noopener noreferrer">
                                  <Globe className="h-3 w-3 mr-1" />
                                  Live Demo
                                </a>
                              </Button>
                            )}
                            {project.github && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={project.github} target="_blank" rel="noopener noreferrer">
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  Code
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications">
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>
                Manage your professional certifications and credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h3 className="text-lg font-medium">Add New Certification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="certName">Certification Name *</Label>
                      <Input
                        id="certName"
                        value={newCertification.name}
                        onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                        placeholder="e.g., AWS Solutions Architect"
                      />
                    </div>
                    <div>
                      <Label htmlFor="certIssuer">Issuing Organization *</Label>
                      <Input
                        id="certIssuer"
                        value={newCertification.issuer}
                        onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                        placeholder="e.g., Amazon Web Services"
                      />
                    </div>
                    <div>
                      <Label htmlFor="certIssueDate">Issue Date</Label>
                      <Input
                        id="certIssueDate"
                        type="month"
                        value={newCertification.issueDate}
                        onChange={(e) => setNewCertification({ ...newCertification, issueDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="certExpiryDate">Expiry Date (Optional)</Label>
                      <Input
                        id="certExpiryDate"
                        type="month"
                        value={newCertification.expiryDate}
                        onChange={(e) => setNewCertification({ ...newCertification, expiryDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="credentialId">Credential ID</Label>
                      <Input
                        id="credentialId"
                        value={newCertification.credentialId}
                        onChange={(e) => setNewCertification({ ...newCertification, credentialId: e.target.value })}
                        placeholder="Certificate ID or number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="certUrl">Verification URL</Label>
                      <Input
                        id="certUrl"
                        value={newCertification.url}
                        onChange={(e) => setNewCertification({ ...newCertification, url: e.target.value })}
                        placeholder="https://verify-certificate.com"
                      />
                    </div>
                    <div>
                      <Button
                        type="button"
                        onClick={() => {
                          if (newCertification.name && newCertification.issuer) {
                            const certification: Certification = {
                              ...newCertification,
                              id: Date.now().toString()
                            };
                            setProfile(prev => ({
                              ...prev,
                              certifications: [...prev.certifications, certification]
                            }));
                            setNewCertification(initialCertification);
                            toast({
                              title: 'Success',
                              description: 'Certification added successfully!',
                            });
                          }
                        }}
                        disabled={!newCertification.name || !newCertification.issuer}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Certification
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-medium">My Certifications</h3>
                {profile.certifications.length === 0 ? (
                  <p className="text-muted-foreground">No certifications added yet.</p>
                ) : (
                  <div className="space-y-4">
                    {profile.certifications.map((cert) => (
                      <Card key={cert.id} className="p-4 relative">
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setProfile(prev => ({
                              ...prev,
                              certifications: prev.certifications.filter(c => c.id !== cert.id)
                            }))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Award className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{cert.name}</h4>
                            <p className="text-muted-foreground">{cert.issuer}</p>
                            <p className="text-sm text-muted-foreground">
                              Issued: {cert.issueDate}
                              {cert.expiryDate && ` • Expires: ${cert.expiryDate}`}
                            </p>
                            {cert.credentialId && (
                              <p className="text-sm text-muted-foreground">
                                ID: {cert.credentialId}
                              </p>
                            )}
                            {cert.url && (
                              <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                                <a href={cert.url} target="_blank" rel="noopener noreferrer">
                                  Verify Certificate
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Account Preferences</CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
                    </div>
                    <Switch
                      checked={profile.preferences?.emailNotifications}
                      onCheckedChange={(checked) => setProfile(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, emailNotifications: checked }
                      }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Job Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified about relevant job opportunities</p>
                    </div>
                    <Switch
                      checked={profile.preferences?.jobAlerts}
                      onCheckedChange={(checked) => setProfile(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, jobAlerts: checked }
                      }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive promotional emails and updates</p>
                    </div>
                    <Switch
                      checked={profile.preferences?.marketingEmails}
                      onCheckedChange={(checked) => setProfile(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, marketingEmails: checked }
                      }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <Separator />

                <h3 className="text-lg font-medium">Privacy</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                    </div>
                    {isEditing ? (
                      <Select
                        value={profile.preferences?.profileVisibility}
                        onValueChange={(value: 'public' | 'private' | 'connections') =>
                          setProfile(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, profileVisibility: value }
                          }))
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="connections">Connections</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline">
                        {profile.preferences?.profileVisibility || 'Public'}
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <h3 className="text-lg font-medium">Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={profile.preferences?.twoFactorAuth}
                      onCheckedChange={(checked) => setProfile(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, twoFactorAuth: checked }
                      }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <Separator />

                <h3 className="text-lg font-medium">Appearance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Use dark theme for the interface</p>
                    </div>
                    <Switch
                      checked={profile.preferences?.darkMode}
                      onCheckedChange={(checked) => setProfile(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, darkMode: checked }
                      }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Profile;
