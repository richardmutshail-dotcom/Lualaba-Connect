import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Phone, Video, Mic, Image as ImageIcon, Paperclip, 
  Send, ArrowLeft, Check, CheckCheck, MoreVertical, Smile, X, 
  Camera, Trash2, Reply, Search, Users, Shield, ShieldCheck, UserCog, UserMinus, ChevronRight,
  FileText, Film, Grid, Pin, Menu, Lock, Archive, VolumeX, Edit2, Plus,
  User, Bookmark, Settings, UserPlus, HelpCircle, Moon, Sun, ChevronDown, LogOut,
  PhoneIncoming, PhoneOutgoing, PhoneMissed, Share2, Info, Bell, Key, Smartphone,
  MapPin, Globe, Zap, Fingerprint, Delete, ShieldAlert, Volume2, HardDrive, Palette, CircleHelp, Languages, Eye, Home as HomeIcon,
  Flashlight, Repeat, Aperture, Pause, Play
} from 'lucide-react';
import { ChatSession, Message, MessageStatus, ChatRole, MessageType } from '../types';
import { CallInterface } from './CallInterface';

// --- PERSISTENT STATE (Outside Component) ---
let chatSecuritySettings = {
  isEnabled: false,
  code: '1234'
};

// --- MOCK DATA ---

interface Story {
  id: string;
  name: string;
  img: string;
  isMe?: boolean;
  hasStory: boolean;
  ringColor?: string;
  content?: string;
  time?: string;
}

const initialStoriesData: Story[] = [
  { id: 'me', name: 'Ma story', img: 'https://picsum.photos/60/60?random=me', isMe: true, hasStory: false },
  { id: '1', name: 'Drc', img: 'https://picsum.photos/60/60?random=drc', ringColor: 'border-green-500', hasStory: true, content: 'https://picsum.photos/400/800?random=story1', time: '12 min' },
  { id: '2', name: 'AARON', img: 'https://picsum.photos/60/60?random=aaron', ringColor: 'border-pink-500', hasStory: true, content: 'https://picsum.photos/400/800?random=story2', time: '1h' },
  { id: '3', name: 'Maman', img: 'https://picsum.photos/60/60?random=maman', ringColor: 'border-blue-500', hasStory: true, content: 'https://picsum.photos/400/800?random=story3', time: '3h' },
  { id: '4', name: 'Boss', img: 'https://picsum.photos/60/60?random=boss', ringColor: 'border-purple-500', hasStory: true, content: 'https://picsum.photos/400/800?random=story4', time: '5h' },
];

const mockTabs = [
  { id: 'all', label: 'Tous', count: 0 },
  { id: 'work', label: 'Pro', count: 4 },
  { id: 'unread', label: 'Non lus', count: 12 },
  { id: 'perso', label: 'Perso', count: 0 },
];

// Extended ChatSession type locally to support category for filtering
type ExtendedChatSession = ChatSession & { 
  verified?: boolean; 
  muted?: boolean; 
  isChannel?: boolean; 
  pinned?: boolean;
  category?: 'work' | 'perso'; // Added for filtering
};

const initialSessions: ExtendedChatSession[] = [
  { 
    id: 'archived', 
    type: 'group',
    name: 'Archives', 
    lastMessage: 'X-ACTION, DANDADAN...', 
    lastMessageTime: new Date(), 
    avatar: '', 
    unread: 149,
    isOnline: false,
    pinned: false,
    category: 'perso'
  },
  { 
    id: 'saved_messages',
    type: 'private',
    name: 'Messages enregistrés',
    lastMessage: 'Fichier important.pdf',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    avatar: '', 
    unread: 0,
    isOnline: true,
    pinned: true,
    category: 'perso'
  },
  { 
    id: '1', 
    type: 'private',
    name: 'Papa Jean', 
    lastMessage: 'On se voit demain au chantier?', 
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), 
    avatar: 'https://picsum.photos/60/60?random=10', 
    unread: 2,
    isOnline: true,
    pinned: true,
    category: 'perso'
  },
  { 
    id: 'copilot', 
    type: 'private',
    name: 'Microsoft Copilot', 
    lastMessage: 'En partageant votre téléphone...', 
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60), 
    avatar: 'https://picsum.photos/60/60?random=copilot', 
    unread: 0,
    verified: true,
    isOnline: false,
    category: 'work'
  },
  { 
    id: '2', 
    type: 'group',
    name: 'Lualaba Mining Info', 
    lastMessage: 'Nouveaux prix du cuivre affichés.', 
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 120), 
    avatar: 'https://picsum.photos/60/60?random=mining', 
    unread: 30,
    verified: true,
    members: ['Admin'],
    muted: true,
    category: 'work'
  },
  { 
    id: 'support', 
    type: 'private',
    name: 'Support Lualaba', 
    lastMessage: 'Comment pouvons-nous vous aider ?', 
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), 
    avatar: 'https://picsum.photos/60/60?random=support', 
    unread: 0,
    verified: true,
    isOnline: true,
    category: 'work'
  },
  { 
    id: '3', 
    type: 'private',
    name: 'ANT Inc.', 
    lastMessage: 'Message vocal', 
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5), 
    avatar: 'https://picsum.photos/60/60?random=12', 
    unread: 0,
    isOnline: false,
    category: 'work'
  },
  { 
    id: '4', 
    type: 'private',
    name: 'ChatGPT | Nano Banana', 
    lastMessage: 'Nouvel outil disponible : vision.', 
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), 
    avatar: 'https://picsum.photos/60/60?random=gpt', 
    unread: 0,
    verified: false,
    isOnline: true,
    category: 'work'
  },
  { 
    id: '5', 
    type: 'group',
    name: 'Films Série Netflix', 
    lastMessage: 'Saison 2 disponible maintenant !', 
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48), 
    avatar: 'https://picsum.photos/60/60?random=netflix', 
    unread: 56,
    isChannel: true,
    category: 'perso'
  },
];

const archivedSessionsMock: ChatSession[] = [
  {
    id: 'arch1',
    type: 'private',
    name: 'Ancien Collègue',
    lastMessage: 'Bonne continuation !',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    avatar: 'https://picsum.photos/60/60?random=arch1',
    unread: 0,
    isOnline: false
  },
  {
    id: 'arch2',
    type: 'group',
    name: 'Projet 2023',
    lastMessage: 'Le projet est clôturé.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    avatar: 'https://picsum.photos/60/60?random=arch2',
    unread: 0,
    isOnline: false
  },
  {
    id: 'arch3',
    type: 'private',
    name: 'Livraison Jumia',
    lastMessage: 'Votre colis est arrivé.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    avatar: 'https://picsum.photos/60/60?random=arch3',
    unread: 0,
    isOnline: false
  }
];

const initialMessages: Message[] = [
  { id: '1', senderId: '2', type: 'text', text: 'Bonjour, comment vas-tu ?', timestamp: new Date(Date.now() - 1000000), status: 'read', isMe: false },
  { id: '2', senderId: 'me', type: 'text', text: 'Ça va bien merci, et le travail ?', timestamp: new Date(Date.now() - 900000), status: 'read', isMe: true },
  { id: '3', senderId: '2', type: 'audio', text: '', mediaDuration: '0:14', timestamp: new Date(Date.now() - 800000), status: 'read', isMe: false },
  { id: '4', senderId: 'me', type: 'image', text: 'Regarde le plan', mediaUrl: 'https://picsum.photos/300/200?random=1', timestamp: new Date(Date.now() - 700000), status: 'read', isMe: true },
  { id: '5', senderId: '2', type: 'text', text: 'On avance doucement sur le projet Kolwezi.', timestamp: new Date(Date.now() - 600000), status: 'read', isMe: false },
  { id: '6', senderId: '2', type: 'document', text: 'Contrat_Mine_V2.pdf', fileName: 'Contrat_Mine_V2.pdf', fileSize: '2.4 MB', timestamp: new Date(Date.now() - 500000), status: 'read', isMe: false },
  { id: '7', senderId: 'me', type: 'video', text: '', mediaUrl: 'https://picsum.photos/300/200?random=2', mediaDuration: '0:45', timestamp: new Date(Date.now() - 400000), status: 'read', isMe: true },
  { id: '8', senderId: '2', type: 'text', text: 'Super ! On valide ça demain.', timestamp: new Date(Date.now() - 300000), status: 'read', isMe: false },
];

const mockContacts = [
  { id: 'c1', name: 'Alice M.', status: 'En ligne', avatar: 'https://picsum.photos/100/100?random=c1' },
  { id: 'c2', name: 'Bob K.', status: 'Vu récemment', avatar: 'https://picsum.photos/100/100?random=c2' },
  { id: 'c3', name: 'Charlie D.', status: 'En ligne', avatar: 'https://picsum.photos/100/100?random=c3' },
  { id: 'c4', name: 'David L.', status: 'Vu à 10:30', avatar: 'https://picsum.photos/100/100?random=c4' },
  { id: 'c5', name: 'Esther M.', status: 'En ligne', avatar: 'https://picsum.photos/100/100?random=c5' },
];

const mockCalls = [
  { id: 1, name: 'Papa Jean', type: 'incoming', date: 'Aujourd\'hui, 10:45', missed: false },
  { id: 2, name: 'Maman', type: 'missed', date: 'Hier, 20:12', missed: true },
  { id: 3, name: 'Boss', type: 'outgoing', date: 'Hier, 14:30', missed: false },
  { id: 4, name: 'AARON', type: 'incoming', date: '12 Juin', missed: false },
];

// --- HELPER COMPONENTS ---

const FormatTime = (date: Date) => {
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { day: '2-digit', month: 'short' });
};

// --- MAIN COMPONENT ---

interface ChatModuleProps {
  setTabBarVisible?: (visible: boolean) => void;
  onBack?: () => void;
  darkMode?: boolean;
  toggleDarkMode?: () => void;
}

type ChatView = 'list' | 'profile' | 'new_group' | 'contacts' | 'calls' | 'settings' | 'features' | 'archived' | 'camera';

export const ChatModule: React.FC<ChatModuleProps> = ({ setTabBarVisible, onBack, darkMode = false, toggleDarkMode }) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ChatView>('list');
  const [isInCall, setIsInCall] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showSidebar, setShowSidebar] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  
  // STORIES STATE
  const [stories, setStories] = useState(initialStoriesData);
  const [viewingStory, setViewingStory] = useState<any | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // LOCK STATE
  const [isLocked, setIsLocked] = useState(chatSecuritySettings.isEnabled);
  const [passcode, setPasscode] = useState('');
  const [lockError, setLockError] = useState(false);
  
  // CONFIGURATION STATE
  const [showSetup, setShowSetup] = useState(false);
  const [setupCode, setSetupCode] = useState('');
  
  // SETTINGS STATE
  const [settingsSubView, setSettingsSubView] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState({
    phone: '+243 975 876 854',
    username: '@richard_lyon',
    bio: 'Architecte Logiciel Senior 🏗️ | Passionné de Tech & Innovation au Lualaba.'
  });
  const [editModal, setEditModal] = useState<{key: string, label: string, value: string} | null>(null);
  const [notifSettings, setNotifSettings] = useState({ sound: true, vibrate: true, groups: true });
  const [dataSettings, setDataSettings] = useState({ autoDownload: true, dataSaver: false });
  const [chatSettings, setChatSettings] = useState({ fontSize: 'Moyen', wallpaper: 'Défaut' });
  const [appLang, setAppLang] = useState('Français');

  // List View State
  const [sessions, setSessions] = useState<ExtendedChatSession[]>(initialSessions);

  // Active Chat State
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  
  // New Group State
  const [newGroupName, setNewGroupName] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChatId]);

  // Handle Tab Bar Visibility
  useEffect(() => {
    if (setTabBarVisible) {
      setTabBarVisible(false);
    }
    return () => {
        if (setTabBarVisible) setTabBarVisible(true);
    };
  }, [setTabBarVisible]);

  // --- FILTER LOGIC ---
  const getFilteredSessions = () => {
    return sessions.filter(session => {
        // Always exclude Saved Messages from the main list flow (it's accessed via menu or sidebar usually, or specific logic)
        if (session.id === 'saved_messages') return false;

        switch (activeTab) {
            case 'unread':
                return session.unread > 0;
            case 'work':
                return session.category === 'work';
            case 'perso':
                return session.category === 'perso';
            case 'all':
            default:
                return true;
        }
    });
  };

  const filteredSessions = getFilteredSessions();

  // --- STORY LOGIC ---
  useEffect(() => {
    let interval: any;
    if (viewingStory && !isPaused) {
      interval = setInterval(() => {
        setStoryProgress(prev => {
          if (prev >= 100) {
            handleNextStory();
            return 0;
          }
          return prev + 1; // 1% every 50ms = 5 seconds duration
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [viewingStory, isPaused]);

  const handleStoryClick = (story: any) => {
    if (story.isMe && !story.hasStory) {
        setCurrentView('camera');
        return;
    }
    if (story.hasStory) {
        setViewingStory(story);
        setStoryProgress(0);
    }
  };

  const handleNextStory = () => {
    setViewingStory(null);
    setStoryProgress(0);
  };

  const handlePrevStory = () => {
    setStoryProgress(0); // Restart current
  };

  const handlePostStory = () => {
    if (capturedImage) {
        setStories(prev => prev.map(s => s.id === 'me' ? { ...s, hasStory: true, content: capturedImage, time: 'À l\'instant' } : s));
        setCapturedImage(null);
        setCurrentView('list');
        showToast("Statut mis à jour !");
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleShareInvite = () => {
    const text = "Rejoins-moi sur Lualaba Connect, l'app de chat ultime du Lualaba !";
    if (navigator.share) {
      navigator.share({ title: 'Invitation', text, url: window.location.href }).catch(console.error);
    } else {
      showToast("Lien d'invitation copié !");
    }
    setShowSidebar(false);
  };

  const handleSavedMessages = () => {
    setActiveChatId('saved_messages');
    setShowSidebar(false);
  };

  const handleSupportChat = () => {
    setActiveChatId('support');
    setShowSidebar(false);
    setCurrentView('list');
  };

  const saveProfileEdit = () => {
    if (editModal) {
        setUserProfile(prev => ({...prev, [editModal.key]: editModal.value}));
        setEditModal(null);
        showToast("Profil mis à jour !");
    }
  };
  
  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
        showToast("Le nom du groupe ne peut pas être vide.");
        return;
    }
    
    const newGroup: ExtendedChatSession = {
        id: `group_${Date.now()}`,
        type: 'group',
        name: newGroupName,
        lastMessage: 'Groupe créé',
        lastMessageTime: new Date(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newGroupName)}&background=random`,
        unread: 0,
        isOnline: false,
        members: ['Vous'],
        category: 'perso'
    };
    
    setSessions(prev => [newGroup, ...prev]);
    setNewGroupName('');
    setCurrentView('list');
    setActiveChatId(newGroup.id);
    showToast("Groupe créé avec succès !");
  };

  const handleStartChat = (contact: any) => {
     // Check if chat exists
     const existingSession = sessions.find(s => s.name === contact.name);
     if (existingSession) {
         setActiveChatId(existingSession.id);
         setCurrentView('list');
         return;
     }

     const newChat: ExtendedChatSession = {
         id: `chat_${Date.now()}`,
         type: 'private',
         name: contact.name,
         lastMessage: '',
         lastMessageTime: new Date(),
         avatar: contact.avatar,
         unread: 0,
         isOnline: contact.status === 'En ligne',
         category: 'perso'
     };
     setSessions(prev => [newChat, ...prev]);
     setCurrentView('list');
     setActiveChatId(newChat.id);
  };

  // --- LOCK FUNCTIONALITY ---
  
  const handleLockClick = () => {
    if (chatSecuritySettings.isEnabled) {
        setIsLocked(true);
    } else {
        setShowSetup(true);
    }
  };

  const confirmSetup = () => {
    if (setupCode.length !== 4) {
        showToast("Le code doit avoir 4 chiffres.");
        return;
    }
    chatSecuritySettings.code = setupCode;
    chatSecuritySettings.isEnabled = true;
    setShowSetup(false);
    showToast("Protection activée. Code enregistré.");
    setIsLocked(true); 
  };

  const handleDigitPress = (digit: string) => {
    if (passcode.length < 4) {
      const newPass = passcode + digit;
      setPasscode(newPass);
      setLockError(false);
      
      if (newPass.length === 4) {
        setTimeout(() => {
          if (newPass === chatSecuritySettings.code) {
            setIsLocked(false);
            setPasscode('');
          } else {
            setLockError(true);
            setPasscode('');
            if (navigator.vibrate) navigator.vibrate(200);
          }
        }, 300);
      }
    }
  };

  const handleDeleteDigit = () => {
    setPasscode(prev => prev.slice(0, -1));
    setLockError(false);
  };

  const renderLockScreen = () => (
    <div className="flex flex-col h-full bg-[#1b2734] text-white items-center justify-center relative font-sans z-50">
        {onBack && (
            <button onClick={onBack} className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/10 transition-colors">
                <ArrowLeft size={24} />
            </button>
        )}
        <div className="absolute top-10 flex flex-col items-center animate-fade-in">
            <div className="w-20 h-20 bg-[#232d36] rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-[#1b2734]">
                <Lock size={32} className="text-[#50a0e8]" />
            </div>
            <h2 className="text-xl font-bold mb-2">Chat Verrouillé</h2>
            <p className="text-sm text-gray-400">Entrez votre code d'accès</p>
        </div>

        <div className="flex gap-4 mb-12 mt-32">
            {[0, 1, 2, 3].map(i => (
                <div 
                    key={i} 
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                        i < passcode.length 
                            ? (lockError ? 'bg-red-500 border-red-500' : 'bg-[#50a0e8] border-[#50a0e8]') 
                            : 'border-gray-500'
                    } ${lockError ? 'animate-shake' : ''}`}
                ></div>
            ))}
        </div>

        <div className="w-full max-w-xs grid grid-cols-3 gap-6 px-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button 
                    key={num}
                    onClick={() => handleDigitPress(num.toString())}
                    className="w-16 h-16 rounded-full text-2xl font-medium hover:bg-white/10 transition-colors flex items-center justify-center"
                >
                    {num}
                </button>
            ))}
            <div className="flex items-center justify-center">
                <button 
                    className="w-16 h-16 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-[#50a0e8]"
                >
                    <Fingerprint size={28} />
                </button>
            </div>
            <button 
                onClick={() => handleDigitPress('0')}
                className="w-16 h-16 rounded-full text-2xl font-medium hover:bg-white/10 transition-colors flex items-center justify-center"
            >
                0
            </button>
            <div className="flex items-center justify-center">
                <button 
                    onClick={handleDeleteDigit}
                    className="w-16 h-16 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                    <Delete size={24} />
                </button>
            </div>
        </div>
    </div>
  );

  const renderSetupModal = () => (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-[#232d36] w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-slide-up text-white border border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <ShieldAlert size={24} className="text-[#50a0e8]" /> Sécuriser
                </h3>
                <button onClick={() => setShowSetup(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <X size={20} />
                </button>
            </div>
            
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                Définissez un code d'accès personnel. Ce code sera demandé à chaque fois que vous ouvrirez l'onglet Chat.
            </p>

            <div className="space-y-4">
                <div className="bg-[#17212b] p-3 rounded-xl border border-gray-700">
                    <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Nouveau Code (4 chiffres)</label>
                    <input 
                        type="tel" 
                        maxLength={4}
                        placeholder="Ex: 1234" 
                        value={setupCode} 
                        onChange={(e) => setSetupCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))} 
                        className="w-full bg-transparent text-2xl font-mono tracking-widest text-white outline-none text-center"
                        autoFocus
                    />
                </div>
                
                <button 
                    onClick={confirmSetup}
                    disabled={setupCode.length !== 4}
                    className="w-full bg-[#50a0e8] text-white py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-[#4392da] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Check size={20} />
                    Activer la protection
                </button>
            </div>
        </div>
    </div>
  );

  // Handle sending a message
  const sendMessage = (type: MessageType = 'text', content: string = inputText) => {
    if (!content.trim() && type === 'text') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: type === 'text' ? content : (type === 'document' ? 'Doc.pdf' : ''),
      type: type,
      mediaDuration: type === 'audio' ? '0:05' : undefined,
      timestamp: new Date(),
      status: 'sending',
      isMe: true,
      replyTo: replyingTo ? {
        id: replyingTo.id,
        text: replyingTo.type === 'text' ? replyingTo.text : (replyingTo.type === 'audio' ? '🎤 Message vocal' : '📷 Photo'),
        senderName: replyingTo.isMe ? 'Vous' : 'Contact'
      } : undefined
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setReplyingTo(null);
    setIsRecording(false);

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'sent' } : m));
    }, 500);

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'read' } : m));
    }, 2500);
  };

  const SidebarMenuItem = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
    <div 
      onClick={() => {
        if(onClick) onClick();
      }}
      className="flex items-center gap-5 px-5 py-3.5 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer text-gray-700 dark:text-white transition-colors"
    >
      <Icon size={24} className="text-gray-500 dark:text-gray-400" />
      <span className="font-medium text-[15px]">{label}</span>
    </div>
  );

  // --- RENDER LOGIC WITH LOCK CHECK ---
  
  if (isLocked) {
      return renderLockScreen();
  }

  // --- SUB-VIEW RENDERER ---
  const renderSubView = () => {
    const SubHeader = ({ title, onBack }: {title: string, onBack?: () => void}) => (
        <div className="bg-white dark:bg-[#232d36] px-4 py-3 flex items-center gap-4 shadow-md sticky top-0 z-20 text-gray-900 dark:text-white transition-colors">
            <button onClick={onBack || (() => setCurrentView('list'))} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                <ArrowLeft size={22} />
            </button>
            <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        </div>
    );

    const SettingsToggle = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
      <div className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-[#2b3742] cursor-pointer transition-colors" onClick={(e) => { e.stopPropagation(); onChange(); }}>
         <span className="text-[15px] font-medium">{label}</span>
         <div className={`w-10 h-5 rounded-full relative transition-colors ${checked ? 'bg-[#50a0e8]' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${checked ? 'left-6' : 'left-1'}`}></div>
         </div>
      </div>
    );

    const SettingsAction = ({ label, value, onClick, icon: Icon }: any) => (
      <div onClick={onClick} className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-[#2b3742] cursor-pointer transition-colors">
         <div className="flex items-center gap-4">
            {Icon && <Icon size={20} className="text-gray-400" />}
            <span className="text-[15px] font-medium">{label}</span>
         </div>
         <div className="flex items-center gap-2">
            {value && <span className="text-sm text-[#50a0e8]">{value}</span>}
            <ChevronRight size={18} className="text-gray-500" />
         </div>
      </div>
    );

    if (currentView === 'profile') {
        return (
            <div className="flex flex-col h-full bg-gray-50 dark:bg-[#1b2734] text-gray-900 dark:text-white transition-colors">
                <SubHeader title="Mon Profil" />
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col items-center">
                    <div className="relative mb-6 group cursor-pointer">
                        <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden border-4 border-white dark:border-[#1b2734] shadow-xl">
                            <img src="https://picsum.photos/200/200?random=user" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 right-0 bg-[#50a0e8] p-3 rounded-full shadow-lg border-4 border-white dark:border-[#1b2734] hover:bg-[#4392da] transition-colors text-white">
                            <Camera size={20} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{userProfile.username.replace('@', '')}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 font-mono">{userProfile.phone}</p>
                    
                    <div className="w-full max-w-md bg-white dark:bg-[#232d36] rounded-2xl overflow-hidden shadow-lg mb-6">
                        <div onClick={() => setEditModal({ key: 'bio', label: 'Modifier Bio', value: userProfile.bio })} className="p-4 border-b border-gray-100 dark:border-[#131b24] hover:bg-gray-50 dark:hover:bg-[#2b3742] transition-colors cursor-pointer group">
                            <p className="text-xs text-[#50a0e8] font-bold uppercase mb-1 flex justify-between">Bio <Edit2 size={12} /></p>
                            <p className="text-[15px] leading-relaxed">{userProfile.bio}</p>
                        </div>
                        <div onClick={() => setEditModal({ key: 'username', label: 'Modifier Nom d\'utilisateur', value: userProfile.username })} className="p-4 hover:bg-gray-50 dark:hover:bg-[#2b3742] transition-colors cursor-pointer group">
                            <p className="text-xs text-[#50a0e8] font-bold uppercase mb-1 flex justify-between">Nom d'utilisateur <Edit2 size={12} /></p>
                            <p className="text-[15px]">{userProfile.username}</p>
                        </div>
                    </div>
                    <div className="w-full max-w-md bg-white dark:bg-[#232d36] rounded-2xl overflow-hidden shadow-lg">
                         <div className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-[#2b3742] transition-colors cursor-pointer text-red-500 dark:text-red-400">
                            <LogOut size={20} />
                            <span className="font-medium">Déconnexion</span>
                         </div>
                    </div>
                </div>
            </div>
        );
    }

    if (currentView === 'settings') {
        const handleSettingsBack = () => {
            if (settingsSubView) {
                setSettingsSubView(null);
            } else {
                setCurrentView('list');
            }
        };

        const SubHeaderSettings = () => (
            <SubHeader title={
                settingsSubView === 'notifications' ? 'Notifications' :
                settingsSubView === 'privacy' ? 'Confidentialité' :
                settingsSubView === 'data' ? 'Données & Stockage' :
                settingsSubView === 'chat_settings' ? 'Paramètres Échanges' :
                settingsSubView === 'language' ? 'Langue' : 'Paramètres'
            } onBack={handleSettingsBack} />
        );

        return (
             <div className="flex flex-col h-full bg-gray-50 dark:bg-[#1b2734] text-gray-900 dark:text-white transition-colors">
                <SubHeaderSettings />
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                    {/* EDIT MODAL */}
                    {editModal && (
                        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                            <div className="bg-white dark:bg-[#232d36] w-full max-w-sm rounded-2xl p-5 shadow-2xl animate-slide-up border border-gray-200 dark:border-gray-700">
                                <h3 className="font-bold mb-4 text-lg dark:text-white">{editModal.label}</h3>
                                <input 
                                    className="w-full bg-gray-100 dark:bg-[#17212b] p-3 rounded-xl border border-gray-300 dark:border-gray-600 outline-none focus:border-[#50a0e8] mb-4 text-gray-900 dark:text-white" 
                                    value={editModal.value}
                                    onChange={(e) => setEditModal({...editModal, value: e.target.value})}
                                    autoFocus
                                />
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => setEditModal(null)} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">Annuler</button>
                                    <button onClick={saveProfileEdit} className="px-4 py-2 bg-[#50a0e8] text-white rounded-lg font-bold">Sauvegarder</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {!settingsSubView ? (
                        /* MAIN SETTINGS LIST */
                        <>
                            <div className="bg-white dark:bg-[#232d36] rounded-xl overflow-hidden shadow-sm">
                                <div className="p-4 border-b border-gray-100 dark:border-[#131b24] text-[#50a0e8] font-bold text-sm">Compte</div>
                                <div onClick={() => setEditModal({ key: 'phone', label: 'Numéro', value: userProfile.phone })} className="p-4 hover:bg-gray-50 dark:hover:bg-[#2b3742] cursor-pointer flex items-center gap-4">
                                    <span className="text-[15px]">{userProfile.phone}</span>
                                </div>
                                <div onClick={() => setEditModal({ key: 'username', label: 'Username', value: userProfile.username })} className="p-4 hover:bg-gray-50 dark:hover:bg-[#2b3742] cursor-pointer flex items-center gap-4">
                                    <span className="text-[15px]">{userProfile.username}</span>
                                </div>
                                <div onClick={() => setEditModal({ key: 'bio', label: 'Bio', value: userProfile.bio })} className="p-4 hover:bg-gray-50 dark:hover:bg-[#2b3742] cursor-pointer flex items-center gap-4">
                                    <span className="text-[15px] truncate max-w-full block">{userProfile.bio}</span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-[#232d36] rounded-xl overflow-hidden shadow-sm">
                                {[
                                    { id: 'notifications', icon: Bell, label: 'Notifications et Sons', color: 'text-red-500 dark:text-red-400' },
                                    { id: 'privacy', icon: Lock, label: 'Confidentialité et Sécurité', color: 'text-gray-500 dark:text-gray-400' },
                                    { id: 'data', icon: Archive, label: 'Données et Stockage', color: 'text-green-500 dark:text-green-400' },
                                    { id: 'chat_settings', icon: Moon, label: 'Paramètres des échanges', color: 'text-[#50a0e8]' },
                                    { id: 'language', icon: Globe, label: 'Langue', color: 'text-purple-500 dark:text-purple-400' },
                                ].map((item) => (
                                    <div key={item.id} onClick={() => setSettingsSubView(item.id)} className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-[#2b3742] cursor-pointer border-b border-gray-100 dark:border-[#131b24] last:border-0 transition-colors">
                                        <item.icon size={22} className={item.color} />
                                        <span className="text-[15px] font-medium">{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white dark:bg-[#232d36] rounded-xl overflow-hidden shadow-sm">
                                <div onClick={handleSupportChat} className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-[#2b3742] cursor-pointer transition-colors">
                                    <HelpCircle size={22} className="text-orange-500 dark:text-orange-400" />
                                    <span className="text-[15px] font-medium">Poser une question</span>
                                </div>
                                <div onClick={() => showToast("FAQ Bientôt disponible")} className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-[#2b3742] cursor-pointer transition-colors">
                                    <Info size={22} className="text-blue-500 dark:text-blue-400" />
                                    <span className="text-[15px] font-medium">FAQ Lualaba Connect</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* SUB VIEWS */
                        <div className="bg-white dark:bg-[#232d36] rounded-xl overflow-hidden animate-slide-left shadow-sm">
                            
                            {settingsSubView === 'notifications' && (
                                <>
                                    <SettingsToggle label="Sons des messages" checked={notifSettings.sound} onChange={() => setNotifSettings({...notifSettings, sound: !notifSettings.sound})} />
                                    <SettingsToggle label="Vibreur" checked={notifSettings.vibrate} onChange={() => setNotifSettings({...notifSettings, vibrate: !notifSettings.vibrate})} />
                                    <SettingsToggle label="Notifications de groupe" checked={notifSettings.groups} onChange={() => setNotifSettings({...notifSettings, groups: !notifSettings.groups})} />
                                    <SettingsAction label="Sonnerie" value="Note (Défaut)" onClick={() => showToast("Changement de sonnerie...")} />
                                </>
                            )}

                            {settingsSubView === 'privacy' && (
                                <>
                                    <SettingsAction 
                                        label="Verrouillage par code" 
                                        value={chatSecuritySettings.isEnabled ? "Activé" : "Désactivé"} 
                                        onClick={() => {
                                            if(!chatSecuritySettings.isEnabled) setShowSetup(true);
                                            else showToast("Code déjà configuré (1234)");
                                        }}
                                        icon={Key}
                                    />
                                    <SettingsAction label="Utilisateurs bloqués" value="0" onClick={() => showToast("Aucun utilisateur bloqué")} icon={UserMinus} />
                                    <SettingsAction label="Vu récemment" value="Tout le monde" onClick={() => showToast("Paramètre mis à jour")} icon={Eye} />
                                    <SettingsAction label="Groupes" value="Mes contacts" onClick={() => showToast("Paramètre mis à jour")} icon={Users} />
                                </>
                            )}

                            {settingsSubView === 'data' && (
                                <>
                                    <div className="p-4 border-b border-gray-100 dark:border-[#131b24] text-xs text-gray-400 font-bold uppercase">Utilisation Réseau</div>
                                    <div className="p-4 flex justify-between items-center">
                                        <span>LAN Usage</span>
                                        <span className="text-[#50a0e8] font-bold">1.2 GB</span>
                                    </div>
                                    <div className="p-4 border-b border-gray-100 dark:border-[#131b24] text-xs text-gray-400 font-bold uppercase mt-2">Média Auto</div>
                                    <SettingsToggle label="Téléchargement Auto (LAN)" checked={dataSettings.autoDownload} onChange={() => setDataSettings({...dataSettings, autoDownload: !dataSettings.autoDownload})} />
                                    <SettingsToggle label="Mode Économie de données" checked={dataSettings.dataSaver} onChange={() => setDataSettings({...dataSettings, dataSaver: !dataSettings.dataSaver})} />
                                </>
                            )}

                            {settingsSubView === 'chat_settings' && (
                                <>
                                    <SettingsAction label="Taille du texte" value={chatSettings.fontSize} onClick={() => showToast("Ajustement taille...")} icon={FileText} />
                                    <SettingsAction label="Fond d'écran" value={chatSettings.wallpaper} onClick={() => showToast("Galerie fonds d'écran")} icon={ImageIcon} />
                                    <SettingsToggle label="Thème Sombre" checked={darkMode} onChange={toggleDarkMode || (() => {})} />
                                </>
                            )}

                            {settingsSubView === 'language' && (
                                <>
                                    {['Français', 'Swahili', 'English'].map(lang => (
                                        <div key={lang} onClick={() => setAppLang(lang)} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-[#2b3742] cursor-pointer border-b border-gray-100 dark:border-[#131b24] last:border-0">
                                            <span>{lang}</span>
                                            {appLang === lang && <Check size={18} className="text-[#50a0e8]" />}
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>
             </div>
        );
    }

    if (currentView === 'contacts') {
        return (
             <div className="flex flex-col h-full bg-gray-50 dark:bg-[#1b2734] text-gray-900 dark:text-white transition-colors">
                <SubHeader title="Nouveau Message" />
                <div className="p-4 overflow-y-auto custom-scrollbar">
                    <div className="mb-4 relative">
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input type="text" placeholder="Rechercher..." className="w-full bg-white dark:bg-[#232d36] text-gray-900 dark:text-white pl-12 pr-4 py-3 rounded-xl outline-none placeholder-gray-500 shadow-sm" />
                    </div>
                    <div onClick={() => setCurrentView('new_group')} className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-[#2b3742] rounded-xl cursor-pointer transition-colors mb-2 text-[#50a0e8]">
                        <div className="w-12 h-12 rounded-full border-2 border-[#50a0e8] flex items-center justify-center">
                            <Users size={20} />
                        </div>
                        <span className="font-bold">Nouveau Groupe</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-[#2b3742] rounded-xl cursor-pointer transition-colors mb-2 text-[#50a0e8]">
                        <div className="w-12 h-12 rounded-full border-2 border-[#50a0e8] flex items-center justify-center">
                            <UserPlus size={20} />
                        </div>
                        <span className="font-bold">Inviter des amis</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-[#2b3742] rounded-xl cursor-pointer transition-colors mb-4 text-[#50a0e8]">
                        <div className="w-12 h-12 rounded-full border-2 border-[#50a0e8] flex items-center justify-center">
                            <MapPin size={20} />
                        </div>
                        <span className="font-bold">Chercher des personnes à proximité</span>
                    </div>
                    
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 px-2">Vos contacts</h3>
                    {mockContacts.map((contact) => (
                        <div key={contact.id} onClick={() => handleStartChat(contact)} className="flex items-center gap-4 p-3 hover:bg-white dark:hover:bg-[#232d36] rounded-xl cursor-pointer transition-colors group">
                            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 relative overflow-hidden">
                                <img src={contact.avatar} className="w-full h-full object-cover" />
                                {contact.status === 'En ligne' && (
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#232d36] rounded-full"></div>
                                )}
                            </div>
                            <div className="flex-1 border-b border-gray-100 dark:border-[#232d36] pb-3 group-last:border-0">
                                <h4 className="font-bold text-[16px]">{contact.name}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{contact.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        );
    }

    if (currentView === 'calls') {
        return (
             <div className="flex flex-col h-full bg-gray-50 dark:bg-[#1b2734] text-gray-900 dark:text-white transition-colors">
                <SubHeader title="Appels" />
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {mockCalls.map((call) => (
                        <div key={call.id} className="flex items-center gap-4 p-3 hover:bg-white dark:hover:bg-[#232d36] rounded-xl cursor-pointer transition-colors">
                            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xl font-bold">
                                {call.name[0]}
                            </div>
                            <div className="flex-1">
                                <h4 className={`font-bold text-[16px] ${call.missed ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{call.name}</h4>
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    {call.type === 'incoming' && <PhoneIncoming size={12} className="text-green-500 dark:text-green-400"/>}
                                    {call.type === 'outgoing' && <PhoneOutgoing size={12} className="text-green-500 dark:text-green-400"/>}
                                    {call.type === 'missed' && <PhoneMissed size={12} className="text-red-500 dark:text-red-400"/>}
                                    {call.date}
                                </div>
                            </div>
                            <button className="p-3 hover:bg-gray-100 dark:hover:bg-[#2b3742] rounded-full text-[#50a0e8]">
                                <Phone size={20} />
                            </button>
                        </div>
                    ))}
                </div>
                <button className="fixed bottom-6 right-6 w-14 h-14 bg-[#50a0e8] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#4392da] transition-transform active:scale-95">
                    <PhoneOutgoing size={24} />
                </button>
             </div>
        );
    }

    if (currentView === 'new_group') {
        return (
             <div className="flex flex-col h-full bg-gray-50 dark:bg-[#1b2734] text-gray-900 dark:text-white transition-colors">
                <SubHeader title="Nouveau Groupe" />
                <div className="p-4">
                    <div className="flex items-center gap-4 mb-6">
                        <button className="w-16 h-16 rounded-full bg-white dark:bg-[#232d36] flex items-center justify-center text-[#50a0e8] border border-[#50a0e8] border-dashed hover:bg-gray-50 dark:hover:bg-[#2b3742] transition-colors">
                            <Camera size={24} />
                        </button>
                        <input 
                            type="text" 
                            placeholder="Nom du groupe" 
                            className="bg-transparent border-b-2 border-[#50a0e8] text-gray-900 dark:text-white py-2 px-1 text-lg outline-none w-full placeholder-gray-500" 
                            autoFocus 
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                        />
                    </div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Ajouter des membres</h3>
                    <div className="space-y-2">
                        {mockContacts.map(c => (
                            <div key={c.id} className="flex items-center gap-4 p-2 hover:bg-white dark:hover:bg-[#232d36] rounded-xl cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden"><img src={c.avatar} className="w-full h-full object-cover"/></div>
                                <span className="font-bold">{c.name}</span>
                                <div className="ml-auto w-5 h-5 rounded border-2 border-gray-400 dark:border-gray-500"></div>
                            </div>
                        ))}
                    </div>
                </div>
                <button 
                    onClick={handleCreateGroup}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-[#50a0e8] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#4392da] transition-transform active:scale-95"
                >
                    <Check size={28} />
                </button>
             </div>
        );
    }

    if (currentView === 'features') {
        return (
             <div className="flex flex-col h-full bg-gray-50 dark:bg-[#1b2734] text-gray-900 dark:text-white transition-colors">
                <SubHeader title="Fonctionnalités Chat" />
                <div className="p-6 text-center space-y-8 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col items-center gap-4 animate-slide-up">
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500 dark:text-blue-400">
                            <ShieldCheck size={40} />
                        </div>
                        <h3 className="text-xl font-bold">Sécurisé & Privé</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">Vos messages sont chiffrés de bout en bout. Personne, pas même Lualaba Connect, ne peut les lire.</p>
                    </div>
                    <div className="flex flex-col items-center gap-4 animate-slide-up" style={{animationDelay: '0.1s'}}>
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-500 dark:text-green-400">
                            <Zap size={40} />
                        </div>
                        <h3 className="text-xl font-bold">Ultra Rapide</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">Optimisé pour le réseau local (LAN). Envoyez des fichiers lourds en un clin d'œil.</p>
                    </div>
                    <div className="flex flex-col items-center gap-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
                        <div className="w-20 h-20 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center text-purple-500 dark:text-purple-400">
                            <Smartphone size={40} />
                        </div>
                        <h3 className="text-xl font-bold">Appels HD</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">Appels audio et vidéo clairs, même avec une connexion 3G faible.</p>
                    </div>
                </div>
             </div>
        );
    }

    if (currentView === 'archived') {
        return (
            <div className="flex flex-col h-full bg-gray-50 dark:bg-[#1b2734] text-gray-900 dark:text-white transition-colors">
               <SubHeader title="Archives" />
               <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                  <div className="text-center text-xs text-gray-400 py-2">
                     Les discussions archivées restent masquées jusqu'à ce qu'un nouveau message arrive.
                  </div>
                  {archivedSessionsMock.map(session => (
                    <div 
                      key={session.id} 
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2b3742] transition-colors cursor-pointer group"
                    >
                      <div className="relative shrink-0">
                        <img src={session.avatar} alt={session.name} className="w-[54px] h-[54px] rounded-full object-cover bg-gray-200 dark:bg-[#2b3742]" />
                      </div>
                      <div className="flex-1 min-w-0 border-b border-gray-100 dark:border-black/20 h-[72px] flex flex-col justify-center pr-1 group-last:border-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-bold text-[16px] text-gray-900 dark:text-white truncate">{session.name}</h3>
                          <span className="text-[12px] text-gray-500 dark:text-gray-400">{FormatTime(session.lastMessageTime)}</span>
                        </div>
                        <p className="text-[15px] truncate max-w-[80%] leading-snug text-gray-500 dark:text-gray-400">
                           {session.lastMessage}
                        </p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
        );
    }

    if (currentView === 'camera') {
        return (
            <div className="flex flex-col h-full bg-black text-white relative animate-fade-in">
                {/* Top Controls */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
                    <button onClick={() => setCurrentView('list')} className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md">
                        <X size={24} />
                    </button>
                    <div className="bg-black/40 px-3 py-1 rounded-full backdrop-blur-md text-xs font-bold flex items-center gap-2">
                        <Flashlight size={14} className="text-yellow-400" /> Auto
                    </div>
                    <button className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md">
                        <Settings size={24} />
                    </button>
                </div>

                {/* Viewfinder */}
                <div className="flex-1 bg-gray-900 relative overflow-hidden">
                    {/* Simulated Camera Feed or Captured Image */}
                    {capturedImage ? (
                        <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                            <p className="text-sm">Aperçu Caméra</p>
                        </div>
                    )}
                    
                    {/* Grid Lines */}
                    {!capturedImage && (
                        <div className="absolute inset-0 grid grid-cols-3 pointer-events-none opacity-30">
                            <div className="border-r border-white/50 h-full"></div>
                            <div className="border-r border-white/50 h-full"></div>
                            <div className="absolute top-1/3 left-0 right-0 border-t border-white/50"></div>
                            <div className="absolute top-2/3 left-0 right-0 border-t border-white/50"></div>
                        </div>
                    )}
                </div>

                {/* Bottom Controls */}
                <div className="bg-black p-6 pb-12 flex flex-col justify-end items-center relative z-20 gap-6">
                    
                    {capturedImage ? (
                        <div className="flex w-full gap-4">
                            <button onClick={() => setCapturedImage(null)} className="flex-1 bg-gray-800 py-3 rounded-xl font-bold">Réessayer</button>
                            <button onClick={handlePostStory} className="flex-1 bg-[#50a0e8] py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-500/30">
                                Mon Statut
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center w-full">
                            <button className="p-3 rounded-full bg-gray-800 hover:bg-gray-700">
                                <ImageIcon size={24} />
                            </button>
                            
                            {/* Shutter Button */}
                            <button 
                                onClick={() => setCapturedImage("https://picsum.photos/400/800?random=" + Date.now())}
                                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform"
                            >
                                <div className="w-16 h-16 bg-white rounded-full"></div>
                            </button>

                            <button className="p-3 rounded-full bg-gray-800 hover:bg-gray-700">
                                <Repeat size={24} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (viewingStory) {
        return (
            <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in h-full">
                {/* Progress Bars */}
                <div className="absolute top-2 left-2 right-2 flex gap-1 z-20">
                    <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-white transition-all duration-100 ease-linear" 
                            style={{ width: `${storyProgress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Header */}
                <div className="absolute top-6 left-0 right-0 p-4 flex items-center justify-between z-20">
                    <div className="flex items-center gap-3">
                        <img src={viewingStory.img} className="w-10 h-10 rounded-full border border-white/50" />
                        <div>
                            <h3 className="text-white font-bold text-sm drop-shadow-md">{viewingStory.name}</h3>
                            <p className="text-white/80 text-xs drop-shadow-md">{viewingStory.time}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="text-white drop-shadow-md"><MoreVertical size={24} /></button>
                        <button onClick={() => setViewingStory(null)} className="text-white drop-shadow-md"><X size={28} /></button>
                    </div>
                </div>

                {/* Navigation Overlay */}
                <div className="absolute inset-0 flex z-10">
                    <div 
                        className="flex-1 h-full" 
                        onClick={handlePrevStory}
                        onMouseDown={() => setIsPaused(true)}
                        onMouseUp={() => setIsPaused(false)}
                        onTouchStart={() => setIsPaused(true)}
                        onTouchEnd={() => setIsPaused(false)}
                    ></div>
                    <div 
                        className="flex-1 h-full" 
                        onClick={handleNextStory}
                        onMouseDown={() => setIsPaused(true)}
                        onMouseUp={() => setIsPaused(false)}
                        onTouchStart={() => setIsPaused(true)}
                        onTouchEnd={() => setIsPaused(false)}
                    ></div>
                </div>

                {/* Image Content */}
                <div className="flex-1 flex items-center justify-center bg-gray-900">
                    <img src={viewingStory.content || viewingStory.img} className="max-h-full max-w-full object-contain" />
                </div>

                {/* Footer Reply */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20 pb-8">
                    <div className="flex items-center gap-3">
                        <input 
                            type="text" 
                            placeholder="Envoyer un message..." 
                            className="flex-1 bg-transparent border border-white/50 rounded-full px-4 py-3 text-white placeholder-white/70 outline-none focus:border-white backdrop-blur-md"
                        />
                        <button className="p-3 rounded-full text-white hover:bg-white/10 transition-colors">
                            <Send size={24} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
  };

  if (activeChatId) {
    const session = sessions.find(s => s.id === activeChatId);
    if (!session) return null;

    if (isInCall) {
      return <CallInterface session={session} onEnd={() => setIsInCall(false)} />;
    }

    // TELEGRAM-STYLE ACTIVE CHAT VIEW
    return (
      <div className="flex flex-col h-full bg-[#e4e4e7] dark:bg-[#1e2329] relative font-sans transition-colors">
        {/* Chat Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
             style={{ 
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
             }}>
        </div>
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none hidden dark:block"
             style={{ 
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
             }}>
        </div>

        {/* 1. APP BAR (Telegram Chat Style) */}
        <div className="bg-white dark:bg-[#232d36] px-2 py-1.5 flex items-center shadow-md sticky top-0 z-20 cursor-pointer transition-colors">
          <button onClick={() => setActiveChatId(null)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-white mr-1 transition-colors">
            <ArrowLeft size={22} />
          </button>
          
          <div className="flex items-center flex-1">
            {session.id === 'saved_messages' ? (
                <div className="w-10 h-10 rounded-full mr-3 bg-[#50a0e8] flex items-center justify-center text-white">
                    <Bookmark size={20} fill="currentColor" />
                </div>
            ) : (
                <img src={session.avatar || "https://picsum.photos/60/60?random=default"} alt="Avatar" className="w-10 h-10 rounded-full mr-3 object-cover" />
            )}
            <div className="flex flex-col">
              <h3 className="font-bold text-[15px] text-gray-900 dark:text-white leading-tight flex items-center gap-1">
                {session.name}
                {session.verified && <CheckCheck size={14} className="text-blue-500 dark:text-blue-400" fill="currentColor" strokeWidth={1} />}
              </h3>
              <p className="text-[12px] text-gray-500 dark:text-gray-400">
                {session.id === 'saved_messages' ? 'Cloud Personnel' : (session.type === 'group' 
                  ? `${session.members?.length || 15} membres` 
                  : (session.isOnline ? <span className="text-blue-500 dark:text-blue-400">En ligne</span> : 'Vu récemment'))}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-600 dark:text-white">
            <button 
              onClick={() => setIsInCall(true)}
              className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <Phone size={20} />
            </button>
            <button className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"><MoreVertical size={20} /></button>
          </div>
        </div>

        {/* 2. MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 pb-4 z-10 custom-scrollbar">
          
          <div className="flex justify-center my-4 sticky top-2 z-10">
            <span className="bg-gray-200/80 dark:bg-[#18222d]/80 text-gray-600 dark:text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
              Aujourd'hui
            </span>
          </div>

          {messages.map((msg, index) => {
            const isLastFromSender = index === messages.length - 1 || messages[index + 1].senderId !== msg.senderId;
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-full`}
              >
                <div className={`relative max-w-[85%] min-w-[80px] shadow-sm transition-all
                  ${msg.isMe 
                    ? 'bg-[#e3f2fd] dark:bg-[#2b5278] text-gray-900 dark:text-white rounded-l-2xl rounded-tr-2xl rounded-br-md' // Sent (Light blue / Telegram dark blue)
                    : 'bg-white dark:bg-[#232d36] text-gray-900 dark:text-white rounded-r-2xl rounded-tl-2xl rounded-bl-md' // Received (White / Telegram dark gray)
                  } ${!isLastFromSender ? 'mb-1' : 'mb-3'}`
                }>
                  
                  {/* Content Container */}
                  <div className={`px-3 pt-2 pb-5 ${msg.type === 'image' || msg.type === 'video' ? 'p-1 pb-6' : ''}`}>
                    {/* Media Types */}
                    {msg.type === 'image' && (
                      <div className="rounded-lg overflow-hidden mb-1">
                         <img src={msg.mediaUrl} alt="attachment" className="w-full h-auto max-w-sm object-cover" />
                      </div>
                    )}
                    {msg.type === 'audio' && (
                      <div className="flex items-center gap-3 p-1 min-w-[200px]">
                        <button className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.isMe ? 'bg-[#bbdefb] dark:bg-[#5288c1]' : 'bg-gray-100 dark:bg-[#5288c1]'}`}>
                          <Mic size={20} className={msg.isMe ? "fill-blue-600 dark:fill-white text-blue-600 dark:text-white" : "fill-gray-600 dark:fill-white text-gray-600 dark:text-white"} />
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-0.5 h-6 mb-1 opacity-70">
                             {[...Array(15)].map((_, i) => (
                               <div key={i} className={`w-1 rounded-full ${msg.isMe ? 'bg-blue-600 dark:bg-white' : 'bg-gray-600 dark:bg-white'}`} style={{ height: `${Math.random() * 80 + 20}%`}}></div>
                             ))}
                          </div>
                          <span className="text-[10px] text-gray-500 dark:text-gray-300">{msg.mediaDuration}</span>
                        </div>
                      </div>
                    )}

                    {/* Text Message */}
                    {msg.text && (
                      <p className="text-[15px] leading-snug whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    )}
                  </div>

                  {/* Metadata (Time & Status inside bubble) */}
                  <div className="absolute bottom-1 right-2 flex items-end gap-1 select-none">
                    <span className="text-[10px] text-gray-400 dark:text-gray-400">
                      {FormatTime(msg.timestamp)}
                    </span>
                    {msg.isMe && (
                       <div className="mb-0.5">
                          {msg.status === 'read' ? <CheckCheck size={14} className="text-[#50a0e8] dark:text-[#59a5f5]" /> : <Check size={14} className="text-gray-400 dark:text-white/70" />}
                       </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* 3. INPUT AREA (Telegram Style) */}
        <div className="bg-white dark:bg-[#232d36] px-2 py-2 flex items-end gap-2 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.1)] transition-colors">
           <button className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <Paperclip size={24} className="rotate-45" />
           </button>

           <div className="flex-1 bg-gray-100 dark:bg-[#17212b] rounded-2xl flex items-end p-2 transition-colors min-h-[44px]">
              <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Message" 
                className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white px-2 py-1 placeholder-gray-500 text-[16px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                 <Smile size={24} />
              </button>
           </div>

           <button 
              onClick={() => inputText ? sendMessage() : setIsRecording(!isRecording)}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-[#50a0e8] dark:bg-[#2b5278] text-white hover:bg-[#4392da] dark:hover:bg-[#35628d] transition-all active:scale-95 shadow-md"
            >
              {inputText ? <Send size={20} className="ml-1" /> : <Mic size={24} />}
            </button>
        </div>
      </div>
    );
  }

  // --- SUB-VIEW RENDER LOGIC ---
  if (currentView !== 'list') {
      return renderSubView();
  }

  // --- LIST VIEW (Telegram Mobile Style) ---
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#1b2734] text-gray-900 dark:text-white relative font-sans transition-colors">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#232d36] text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold animate-fade-in flex items-center gap-2 border border-gray-700">
           <Check size={16} className="text-green-400" /> {toast}
        </div>
      )}

      {/* Setup Modal */}
      {showSetup && renderSetupModal()}

      {/* Story Viewer */}
      {viewingStory && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in h-full">
            {/* Progress Bars */}
            <div className="absolute top-2 left-2 right-2 flex gap-1 z-20">
                <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-white transition-all duration-100 ease-linear" 
                        style={{ width: `${storyProgress}%` }}
                    ></div>
                </div>
            </div>

            {/* Header */}
            <div className="absolute top-6 left-0 right-0 p-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                    <img src={viewingStory.img} className="w-10 h-10 rounded-full border border-white/50" />
                    <div>
                        <h3 className="text-white font-bold text-sm drop-shadow-md">{viewingStory.name}</h3>
                        <p className="text-white/80 text-xs drop-shadow-md">{viewingStory.time}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="text-white drop-shadow-md"><MoreVertical size={24} /></button>
                    <button onClick={() => setViewingStory(null)} className="text-white drop-shadow-md"><X size={28} /></button>
                </div>
            </div>

            {/* Navigation Overlay */}
            <div className="absolute inset-0 flex z-10">
                <div 
                    className="flex-1 h-full" 
                    onClick={handlePrevStory}
                    onMouseDown={() => setIsPaused(true)}
                    onMouseUp={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                ></div>
                <div 
                    className="flex-1 h-full" 
                    onClick={handleNextStory}
                    onMouseDown={() => setIsPaused(true)}
                    onMouseUp={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                ></div>
            </div>

            {/* Image Content */}
            <div className="flex-1 flex items-center justify-center bg-gray-900">
                <img src={viewingStory.content || viewingStory.img} className="max-h-full max-w-full object-contain" />
            </div>

            {/* Footer Reply */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20 pb-8">
                <div className="flex items-center gap-3">
                    <input 
                        type="text" 
                        placeholder="Envoyer un message..." 
                        className="flex-1 bg-transparent border border-white/50 rounded-full px-4 py-3 text-white placeholder-white/70 outline-none focus:border-white backdrop-blur-md"
                    />
                    <button className="p-3 rounded-full text-white hover:bg-white/10 transition-colors">
                        <Send size={24} />
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* 1. Header (Menu, Title, Icons) */}
      <div className="px-4 py-3 bg-white dark:bg-[#232d36] sticky top-0 z-20 flex items-center justify-between shadow-md transition-colors">
         <div className="flex items-center gap-4">
            {onBack && (
              <button 
                onClick={onBack}
                className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                 <HomeIcon size={24} />
              </button>
            )}
            <button 
              onClick={() => setShowSidebar(true)}
              className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
               <Menu size={26} />
            </button>
            <h2 className="text-xl font-bold tracking-tight">Chat</h2>
         </div>
         <div className="flex gap-5 text-gray-500 dark:text-gray-300">
            <button onClick={handleLockClick} className={`hover:text-gray-900 dark:hover:text-white ${chatSecuritySettings.isEnabled ? 'text-[#50a0e8]' : ''}`}><Lock size={22} /></button>
            <button className="hover:text-gray-900 dark:hover:text-white"><Search size={24} /></button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        
        {/* 2. Stories Rail */}
        <div className="bg-white dark:bg-[#232d36] pt-2 pb-3 overflow-x-auto no-scrollbar flex gap-4 px-4 border-b border-gray-100 dark:border-[#131b24] transition-colors">
           {stories.map(story => (
             <div key={story.id} className="flex flex-col items-center gap-1 min-w-[60px] cursor-pointer" onClick={() => handleStoryClick(story)}>
                <div className={`w-[60px] h-[60px] rounded-full p-[2px] ${(story.isMe && !story.hasStory) ? '' : `border-2 ${story.hasStory ? (story.isMe ? 'border-[#50a0e8]' : story.ringColor) : 'border-gray-300 dark:border-gray-600'}`}`}>
                   <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-white dark:border-[#232d36]">
                      <img src={story.img} className="w-full h-full object-cover" alt={story.name} />
                      {story.isMe && !story.hasStory && (
                        <div className="absolute bottom-0 right-0 bg-white dark:bg-white rounded-full p-0.5">
                           <Plus size={12} className="text-[#232d36]" />
                        </div>
                      )}
                   </div>
                </div>
                <span className="text-[11px] text-gray-500 dark:text-gray-300 truncate w-full text-center">{story.name}</span>
             </div>
           ))}
        </div>

        {/* 3. Folders Tabs */}
        <div className="bg-white dark:bg-[#232d36] px-2 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-gray-100 dark:border-black/20 shadow-sm sticky top-0 z-10 transition-colors">
           {mockTabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`px-3 py-3 text-sm font-bold uppercase whitespace-nowrap relative flex items-center gap-1.5 transition-colors ${
                 activeTab === tab.id ? 'text-[#50a0e8]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
               }`}
             >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 rounded-full ${
                    activeTab === tab.id ? 'bg-[#50a0e8] text-white dark:text-[#232d36]' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#50a0e8] rounded-t-full"></div>
                )}
             </button>
           ))}
        </div>

        {/* 4. Chat List */}
        <div className="pb-28">
           {filteredSessions.map(session => {
             // Handle Archive Row separately if needed, or just style it
             if (session.id === 'archived') {
               return (
                 <div 
                    key={session.id} 
                    onClick={() => setCurrentView('archived')}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2b3742] transition-colors cursor-pointer group"
                 >
                    <div className="w-[54px] h-[54px] rounded-full bg-gray-200 dark:bg-[#2b3742] flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700/50">
                       <Archive size={24} />
                    </div>
                    <div className="flex-1 border-b border-gray-100 dark:border-[#131b24] h-full flex flex-col justify-center py-2 min-w-0">
                       <div className="flex justify-between items-center mb-0.5">
                          <h3 className="font-bold text-[16px] text-gray-900 dark:text-white">Archives</h3>
                          <span className="bg-gray-400 dark:bg-[#4d5966] text-white text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">{session.unread}</span>
                       </div>
                       <p className="text-[14px] text-gray-500 dark:text-gray-400 truncate">{session.lastMessage}</p>
                    </div>
                 </div>
               );
             }

             return (
               <div 
                 key={session.id} 
                 onClick={() => setActiveChatId(session.id)}
                 className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2b3742] transition-colors cursor-pointer group"
               >
                 <div className="relative shrink-0">
                   <img src={session.avatar} alt={session.name} className="w-[54px] h-[54px] rounded-full object-cover bg-gray-200 dark:bg-[#2b3742]" />
                   {session.isOnline && (
                     <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-[#42d46e] border-2 border-white dark:border-[#1b2734] rounded-full"></div>
                   )}
                 </div>
                 
                 <div className="flex-1 min-w-0 border-b border-gray-100 dark:border-black/20 h-[72px] flex flex-col justify-center pr-1 group-last:border-0">
                   <div className="flex justify-between items-baseline mb-1">
                     <h3 className="font-bold text-[16px] text-gray-900 dark:text-white truncate flex items-center gap-1">
                        {session.name}
                        {session.verified && (
                           <div className="bg-[#50a0e8] rounded-full p-[2px]">
                              <Check size={10} className="text-white" strokeWidth={4} />
                           </div>
                        )}
                        {session.muted && <VolumeX size={14} className="text-gray-400 dark:text-gray-500" />}
                     </h3>
                     <div className="flex items-center gap-1 shrink-0">
                        {session.id === '3' && <CheckCheck size={16} className="text-[#50a0e8]" />} 
                        <span className="text-[12px] text-gray-500 dark:text-gray-400">
                          {FormatTime(session.lastMessageTime)}
                        </span>
                     </div>
                   </div>
                   
                   <div className="flex justify-between items-center">
                     <p className={`text-[15px] truncate max-w-[80%] leading-snug ${session.unread > 0 ? 'text-gray-800 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                        {session.name === 'ANT Inc.' && <span className="text-gray-900 dark:text-white">Vous: </span>}
                        {session.lastMessage}
                     </p>
                     
                     <div className="flex flex-col items-end gap-1">
                        {session.pinned && <Pin size={14} className="text-gray-400 dark:text-gray-500 rotate-45" fill="currentColor" />}
                        {session.unread > 0 && (
                          <span className="bg-[#50a0e8] dark:bg-[#4d5966] text-white text-[12px] font-bold min-w-[24px] h-[24px] px-1.5 flex items-center justify-center rounded-full">
                            {session.unread}
                          </span>
                        )}
                     </div>
                   </div>
                 </div>
               </div>
             );
           })}
           {filteredSessions.length === 0 && (
               <div className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">
                   Aucune discussion dans cette catégorie.
               </div>
           )}
        </div>
      </div>

      {/* FAB - New Chat (Camera) */}
      <button 
        onClick={() => setCurrentView('camera')}
        className="fixed bottom-24 right-4 w-14 h-14 bg-[#50a0e8] hover:bg-[#4392da] text-white rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95 z-30"
      >
         <Camera size={26} />
      </button>
      
      {/* Secondary Edit FAB (New Message/Contact) */}
      <button 
        onClick={() => setCurrentView('contacts')}
        className="fixed bottom-40 right-6 w-10 h-10 bg-gray-600 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-full shadow-md flex items-center justify-center transition-transform active:scale-95 z-20"
      >
         <Edit2 size={18} />
      </button>

      {/* --- SIDEBAR MENU (Telegram Style) --- */}
      {showSidebar && (
         <div className="fixed inset-0 z-50 flex animate-fade-in">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSidebar(false)}></div>
            
            {/* Sidebar Content */}
            <div className="relative w-[85%] max-w-[320px] bg-white dark:bg-[#1c242d] h-full shadow-2xl flex flex-col animate-slide-left overflow-hidden">
               
               {/* Sidebar Header */}
               <div className="bg-[#50a0e8] dark:bg-[#232d36] p-5 pb-4 pt-12 flex flex-col relative text-white">
                  
                  {/* Sun/Moon Toggle */}
                  <div className="absolute top-4 right-4">
                     <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-white/10 text-white">
                        {darkMode ? <Sun size={22} /> : <Moon size={22} />}
                     </button>
                  </div>

                  {/* Profile Info */}
                  <div 
                    onClick={() => {
                        setCurrentView('profile');
                        setShowSidebar(false);
                    }}
                    className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 mb-4 border-2 border-white dark:border-[#1c242d] overflow-hidden cursor-pointer"
                  >
                     <img src="https://picsum.photos/200/200?random=user" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                        <h3 className="font-bold text-[17px] leading-tight">Mr Richard Lyon</h3>
                        <p className="text-[13px] text-gray-100 dark:text-gray-400 mt-0.5 font-medium">+243 975876854</p>
                     </div>
                     <button className="p-1 mb-1 rounded-full hover:bg-white/10 transition-colors">
                        <ChevronDown size={20} className="text-white" />
                     </button>
                  </div>
               </div>

               {/* Sidebar Menu Items */}
               <div className="flex-1 overflow-y-auto py-2 custom-scrollbar bg-white dark:bg-[#17212b]">
                  <SidebarMenuItem icon={User} label="Mon profil" onClick={() => setCurrentView('profile')} />
                  <div className="h-[1px] bg-gray-100 dark:bg-black/20 my-1 mx-0"></div>
                  
                  <SidebarMenuItem icon={Users} label="Nouveau groupe" onClick={() => setCurrentView('new_group')} />
                  <SidebarMenuItem icon={UserPlus} label="Contacts" onClick={() => setCurrentView('contacts')} />
                  <SidebarMenuItem icon={Phone} label="Appels" onClick={() => setCurrentView('calls')} />
                  <SidebarMenuItem icon={Bookmark} label="Messages enregistrés" onClick={handleSavedMessages} />
                  <SidebarMenuItem icon={Settings} label="Paramètres" onClick={() => setCurrentView('settings')} />
                  
                  <div className="h-[1px] bg-gray-100 dark:bg-black/20 my-1 mx-0"></div>
                  
                  <SidebarMenuItem icon={UserPlus} label="Inviter des amis" onClick={handleShareInvite} />
                  <SidebarMenuItem icon={HelpCircle} label="Fonctionnalités de Chat" onClick={() => setCurrentView('features')} />
               </div>

               {/* Sidebar Footer */}
               <div className="p-4 text-xs text-gray-400 dark:text-gray-500 text-center bg-white dark:bg-[#17212b]">
                  Lualaba Connect v1.0.5
               </div>
            </div>
         </div>
      )}

    </div>
  );
};