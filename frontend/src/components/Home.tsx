import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  MessageSquare,
  Bot,
  Settings,
  Zap,
  Save,
  RefreshCw,
  Info,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [customInstructions, setCustomInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInstructions, setIsLoadingInstructions] = useState(false);

  // Load saved instructions from server on component mount
  useEffect(() => {
    const loadInstructions = async () => {
      setIsLoadingInstructions(true);
      try {
        const response = await axios.get('http://localhost:5001/api/messages/instruction');
        if (response.data.instructions) {
          setCustomInstructions(response.data.instructions);
        }
      } catch (error) {
        console.error('Error loading instructions from server:', error);
        // Fallback to localStorage if server fails
        const savedInstructions = localStorage.getItem('customInstructions');
        if (savedInstructions) {
          setCustomInstructions(savedInstructions);
          toast.info('Loaded instructions from local storage');
        }
      } finally {
        setIsLoadingInstructions(false);
      }
    };

    loadInstructions();
  }, []);

  const handleSaveInstructions = async () => {
    if (!customInstructions.trim()) {
      toast.error('Please enter some instructions before saving');
      return;
    }

    setIsLoading(true);

    try {
      // Fixed: Send 'instructions' instead of 'systemInstruction'
      await axios.post('http://localhost:5001/api/messages/instruction', {
        instructions: customInstructions.trim(),
      });

      // Save locally as backup
      localStorage.setItem('customInstructions', customInstructions.trim());

      toast.success('Custom instructions saved successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to save instructions. Please try again.';
      toast.error(errorMessage);
      console.error('Error saving instructions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadInstructions = async () => {
    setIsLoadingInstructions(true);
    try {
      const response = await axios.get('http://localhost:5001/api/messages/instruction');
      if (response.data.instructions) {
        setCustomInstructions(response.data.instructions);
        toast.success('Instructions loaded from server');
      } else {
        toast.info('No saved instructions found on server');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to load instructions';
      toast.error(errorMessage);
      console.error('Error loading instructions:', error);
    } finally {
      setIsLoadingInstructions(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/10">
              <Bot className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              AI Chat Dashboard
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Manage your AI conversations and bot settings
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bot Information Card */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Bot Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="font-medium">API Model</span>
                </div>
                <Badge
                  variant="default"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  Gemini 2.0-Flash
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Status</span>
                </div>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300"
                >
                  Active
                </Badge>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Features</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Multimodal
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Fast Response
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Code Generation
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Real-time
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="border-2 border-muted">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => navigate('/chats')}
                className="w-full h-12 text-lg font-medium"
                size="lg"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                View All Chats
              </Button>

              <Button
                variant="outline"
                className="w-full h-12"
                size="lg"
                onClick={() => navigate('/new-chat')}
              >
                Start New Conversation
              </Button>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button variant="ghost" size="sm" className="h-10">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-10"
                  onClick={handleLoadInstructions}
                  disabled={isLoadingInstructions}
                >
                  {isLoadingInstructions ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Reload
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Custom Instructions Card */}
        <Card className="border-2 border-primary/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Bot className="h-6 w-6 text-primary" />
              Custom Instructions for Bot
              {isLoadingInstructions && (
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </CardTitle>
            <p className="text-muted-foreground">
              Define how you want the AI to behave and respond in conversations.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instructions" className="text-base font-medium">
                Instructions
              </Label>
              <Textarea
                id="instructions"
                placeholder={isLoadingInstructions ? "Loading instructions..." : `Enter your custom instructions here... 

For example:
- Always respond in a professional tone
- Provide detailed explanations with examples
- Ask clarifying questions when needed
- Format code responses with proper syntax highlighting`}
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                className="min-h-[150px] resize-none text-sm"
                maxLength={2000}
                disabled={isLoadingInstructions}
              />
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>
                  Be specific about tone, style, and behavior preferences
                </span>
                <span>{customInstructions.length}/2000</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSaveInstructions}
                disabled={isLoading || !customInstructions.trim() || isLoadingInstructions}
                className="flex-1 h-11"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Instructions
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => setCustomInstructions('')}
                disabled={isLoading || isLoadingInstructions}
                className="px-6"
              >
                Clear
              </Button>

              <Button
                variant="outline"
                onClick={handleLoadInstructions}
                disabled={isLoading || isLoadingInstructions}
                className="px-6"
              >
                {isLoadingInstructions ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats or Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <MessageSquare className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">127</div>
              <div className="text-sm text-muted-foreground">
                Total Messages
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Bot className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <div className="text-2xl font-bold">15</div>
              <div className="text-sm text-muted-foreground">Active Chats</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Zap className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;