import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, HelpCircle, CheckCircle, AlertCircle } from 'lucide-react';

interface VoiceCodingInterfaceProps {
  onCodeChange: (code: string) => void;
  language: string;
  initialCode?: string;
}

const VoiceCodingInterface: React.FC<VoiceCodingInterfaceProps> = ({
  onCodeChange,
  language,
  initialCode = ''
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [voiceCommands, setVoiceCommands] = useState<string[]>([]);

  const [code, setCode] = useState(initialCode);
  const [showHelp, setShowHelp] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(null);

  const commands = {
    'start coding': () => {
      speak('Starting coding session. You can now dictate your code.');
      setIsListening(true);
    },
    'stop coding': () => {
      speak('Stopping coding session.');
      setIsListening(false);
    },
    'new line': () => {
      const newCode = code + '\n';
      setCode(newCode);
      onCodeChange(newCode);
    },
    'indent': () => {
      const newCode = code + '  ';
      setCode(newCode);
      onCodeChange(newCode);
    },
    'function': () => {
      const functionTemplate = language === 'javascript' ? 'function name() {\n  \n}' :
                              language === 'python' ? 'def name():\n    pass' :
                              language === 'java' ? 'public void name() {\n    \n}' :
                              'void name() {\n    \n}';
      const newCode = code + functionTemplate;
      setCode(newCode);
      onCodeChange(newCode);
      speak('Function template added');
    },
    'if statement': () => {
      const ifTemplate = language === 'javascript' ? 'if (condition) {\n  \n}' :
                        language === 'python' ? 'if condition:\n    pass' :
                        'if (condition) {\n    \n}';
      const newCode = code + ifTemplate;
      setCode(newCode);
      onCodeChange(newCode);
      speak('If statement template added');
    },
    'for loop': () => {
      const forTemplate = language === 'javascript' ? 'for (let i = 0; i < length; i++) {\n  \n}' :
                         language === 'python' ? 'for i in range(length):\n    pass' :
                         language === 'java' ? 'for (int i = 0; i < length; i++) {\n    \n}' :
                         'for (int i = 0; i < length; i++) {\n    \n}';
      const newCode = code + forTemplate;
      setCode(newCode);
      onCodeChange(newCode);
      speak('For loop template added');
    },
    'clear code': () => {
      setCode('');
      onCodeChange('');
      speak('Code cleared');
    },
    'run tests': () => {
      speak('Running tests...');
      // Trigger test execution
    },
    'get hint': () => {
      speak('Here is a hint: Consider using a hash map for optimal time complexity.');
    },
    'explain solution': () => {
      speak('Let me explain the current approach. This solution uses a two-pointer technique to solve the problem efficiently.');
    }
  };

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            setConfidence(confidence);
            processVoiceCommand(transcript.toLowerCase().trim());
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };

      setIsEnabled(true);
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const processVoiceCommand = (command: string) => {
    setVoiceCommands(prev => [...prev.slice(-4), command]);

    // Check for exact command matches
    if (commands[command as keyof typeof commands]) {
      commands[command as keyof typeof commands]();
      return;
    }

    // Check for partial matches or code dictation
    if (command.includes('add') || command.includes('write') || command.includes('type')) {
      const codeToAdd = command.replace(/^(add|write|type)\s+/, '');
      const newCode = code + codeToAdd + ' ';
      setCode(newCode);
      onCodeChange(newCode);
      return;
    }

    // If no command match, treat as code dictation
    if (command.length > 0) {
      const newCode = code + command + ' ';
      setCode(newCode);
      onCodeChange(newCode);
    }
  };

  const speak = (text: string) => {
    if (synthRef.current && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      synthRef.current.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!isEnabled) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      speak('Voice coding stopped');
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      speak('Voice coding started. I am listening for your commands.');
    }
  };

  const toggleMute = () => {
    if (synthRef.current) {
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Mic className="w-5 h-5 mr-2 text-blue-600" />
            Voice Coding Interface
          </h3>
          {isListening && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-600 font-medium">Listening...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Voice Commands Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          
          <button
            onClick={toggleMute}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle Audio Feedback"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          
          <button
            onClick={toggleListening}
            disabled={!isEnabled}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isListening
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? 'Stop' : 'Start'} Voice Coding</span>
          </button>
        </div>
      </div>

      {!isEnabled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800">
              Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari for the best experience.
            </span>
          </div>
        </div>
      )}

      {showHelp && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-900 mb-3">Available Voice Commands:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="space-y-1">
              <div><code className="bg-blue-100 px-2 py-1 rounded text-blue-800">"start coding"</code> - Begin voice input</div>
              <div><code className="bg-blue-100 px-2 py-1 rounded text-blue-800">"stop coding"</code> - End voice input</div>
              <div><code className="bg-blue-100 px-2 py-1 rounded text-blue-800">"new line"</code> - Add line break</div>
              <div><code className="bg-blue-100 px-2 py-1 rounded text-blue-800">"indent"</code> - Add indentation</div>
              <div><code className="bg-blue-100 px-2 py-1 rounded text-blue-800">"function"</code> - Add function template</div>
            </div>
            <div className="space-y-1">
              <div><code className="bg-blue-100 px-2 py-1 rounded text-blue-800">"if statement"</code> - Add if template</div>
              <div><code className="bg-blue-100 px-2 py-1 rounded text-blue-800">"for loop"</code> - Add for loop template</div>
              <div><code className="bg-blue-100 px-2 py-1 rounded text-blue-800">"clear code"</code> - Clear all code</div>
              <div><code className="bg-blue-100 px-2 py-1 rounded text-blue-800">"run tests"</code> - Execute tests</div>
              <div><code className="bg-blue-100 px-2 py-1 rounded text-blue-800">"get hint"</code> - Get AI hint</div>
            </div>
          </div>
          <p className="text-blue-700 text-sm mt-3">
            💡 You can also dictate code directly. Say "add" or "write" followed by your code.
          </p>
        </div>
      )}

      {transcript && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Live Transcript:</span>
            {confidence > 0 && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                confidence > 0.8 ? 'bg-green-100 text-green-800' :
                confidence > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {Math.round(confidence * 100)}% confidence
              </span>
            )}
          </div>
          <p className="text-gray-900 font-mono text-sm">{transcript}</p>
        </div>
      )}

      {voiceCommands.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
          <span className="text-sm font-medium text-gray-700 block mb-2">Recent Commands:</span>
          <div className="space-y-1">
            {voiceCommands.slice(-3).map((command, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600 font-mono">{command}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Accessibility Features:</span>
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Screen Reader Compatible</span>
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">High Contrast Mode</span>
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">Large Text Support</span>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          This interface supports hands-free coding for accessibility. Use voice commands to navigate and write code without using your hands.
        </p>
      </div>
    </div>
  );
};

export default VoiceCodingInterface;