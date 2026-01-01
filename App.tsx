import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, MessageSquare, ShoppingBag, Heart, User, Radio, Bot, 
  Bell, CloudSun, TrendingUp, ChevronRight,
  Search, MapPin, ArrowRight, Lock, Phone, CheckCircle,
  Briefcase, Building2, UserCircle, Upload, ScanFace, Calendar, Mail, Flag, FileText, Camera, Eye, EyeOff, ShieldCheck, Play,
  Wind, Droplets, Sun, AlertTriangle, Ambulance, Flame, Shield, X, LayoutGrid, Thermometer, Smile, MoreHorizontal, Share2, Clock, MessageCircle as CommentIcon, Send,
  Loader2, Sparkles, Zap, Brain, Mic, Navigation, CloudRain, Cloud, CloudLightning, Moon
} from 'lucide-react';
import { AppTab } from './types';
import { HealthModule } from './components/HealthModule';
import { MarketModule } from './components/MarketModule';
import { ChatModule } from './components/ChatModule';
import { ProfileModule } from './components/ProfileModule';
import { VideoFeedModule } from './components/VideoFeedModule';
import { ServicesModule } from './components/ServicesModule';
import { JobsModule } from './components/JobsModule';
import { AdviceModule } from './components/AdviceModule';
import { FeedModule } from './components/FeedModule';
import { askLocalAssistant } from './services/geminiService';

// --- ANIMATED MASTA AVATAR COMPONENT ---
const MastaAvatar: React.FC<{ mood: string }> = ({ mood }) => {
  // Eye movement state for realism (idle looking around)
  const [lookDir, setLookDir] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (mood !== 'idle') {
      setLookDir({ x: 0, y: 0 });
      return;
    }
    // Random subtle eye movement when idle
    const interval = setInterval(() => {
      const x = (Math.random() - 0.5) * 4;
      const y = (Math.random() - 0.5) * 2;
      setLookDir({ x, y });
      setTimeout(() => setLookDir({ x: 0, y: 0 }), 1500); // Return to center
    }, 4000);
    return () => clearInterval(interval);
  }, [mood]);

  // Dynamic Styles based on Mood
  const isHappy = mood === 'happy';
  const isThinking = mood === 'thinking';
  const isListening = mood === 'listening';
  const isBlinking = mood === 'blinking';

  return (
    <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isListening ? 'scale-110' : 'scale-100'}`}>
      
      {/* Glow Effect / Aura */}
      <div className={`absolute inset-0 rounded-full blur-md transition-all duration-500 ${
        isThinking ? 'bg-indigo-400/60 animate-pulse' : 
        isListening ? 'bg-orange-400/60 animate-ping opacity-30' : 
        isHappy ? 'bg-green-400/50' : 'bg-white/10'
      }`}></div>

      {/* Head Shape */}
      <div className={`relative w-full h-full rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-inner transition-colors duration-500 border border-white/20
        ${isThinking ? 'bg-gradient-to-tr from-indigo-600 to-blue-500' : 
          isHappy ? 'bg-gradient-to-tr from-green-500 to-emerald-400' :
          isListening ? 'bg-gradient-to-tr from-orange-500 to-amber-500' :
          'bg-gradient-to-tr from-gray-200 to-white' // Idle is White/Gray (Robot/Clean look)
        }
      `}>
        
        {/* Face Container */}
        <div 
          className="flex flex-col items-center justify-center gap-1 transition-transform duration-500"
          style={{ transform: `translate(${lookDir.x}px, ${lookDir.y}px)` }}
        >
          {/* Eyes Row */}
          <div className={`flex gap-[6px] items-center transition-all duration-300 ${isThinking ? 'animate-bounce' : ''}`}>
            
            {/* Left Eye */}
            <div className={`bg-gray-900 transition-all duration-200 rounded-full 
              ${isHappy ? 'w-2.5 h-1.5 rotate-[-10deg] rounded-t-lg mt-1' : 
                isBlinking ? 'w-2.5 h-[1px] mt-1' : 
                'w-2 h-3'
              }
              ${isThinking ? 'translate-y-[-1px]' : ''}
            `}></div>

            {/* Right Eye */}
            <div className={`bg-gray-900 transition-all duration-200 rounded-full 
              ${isHappy ? 'w-2.5 h-1.5 rotate-[10deg] rounded-t-lg mt-1' : 
                isBlinking ? 'w-2.5 h-[1px] mt-1' : 
                'w-2 h-3'
              }
              ${isThinking ? 'translate-y-[1px]' : ''}
            `}></div>
          </div>

          {/* Mouth (SVG for morphing) */}
          <div className="w-4 h-2 flex justify-center">
             {isHappy ? (
                // Happy Smile
                <svg viewBox="0 0 20 10" className="w-3 h-1.5 fill-none stroke-gray-900 stroke-[3] stroke-linecap-round">
                   <path d="M2,2 Q10,12 18,2" />
                </svg>
             ) : isListening ? (
                // O Mouth
                <div className="w-1.5 h-1.5 rounded-full border border-gray-900 bg-transparent animate-pulse"></div>
             ) : isThinking ? (
                // Flat/Hmm Mouth
                <div className="w-2 h-[2px] bg-gray-900 rounded-full opacity-60"></div>
             ) : (
                // Idle Small Smile
                <svg viewBox="0 0 20 5" className="w-2 h-1 fill-none stroke-gray-900 stroke-[3] stroke-linecap-round opacity-40">
                   <path d="M2,1 Q10,6 18,1" />
                </svg>
             )}
          </div>
        </div>

        {/* Shine Reflection */}
        <div className="absolute top-1 right-2 w-2 h-1 bg-white/40 rounded-full rotate-[-45deg]"></div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [isAuth, setIsAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true); // Control Bottom Nav Visibility
  
  // Auth State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Registration Flow State
  const [regStep, setRegStep] = useState(0); // 0: Type, 1: Info, 2: Verification, 3: Phone/OTP
  const [accountType, setAccountType] = useState<'classic' | 'pro' | 'enterprise'>('classic');
  
  // Mock Saved User (Simulating LocalStorage)
  const [savedUser, setSavedUser] = useState<{name: string, avatar: string, id: string} | null>(null);

  // Form Data
  const [formData, setFormData] = useState({
    loginIdentifier: '', // Email or Phone for login
    password: '',
    firstName: '',
    lastName: '',
    gender: 'M',
    nationality: 'Congolaise',
    dob: '',
    email: '',
    phone: '',
    address: '',
    profession: '',
    experience: '',
    currentCompany: '',
    description: '',
    companyName: '', // For Enterprise
    otp: ''
  });

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showSOS, setShowSOS] = useState(false); // State for SOS Modal
  const [toast, setToast] = useState<string | null>(null);

  // Verification State
  const [idUploaded, setIdUploaded] = useState(false);
  const [faceScanned, setFaceScanned] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  // Home Feed State
  const [botQuery, setBotQuery] = useState('');
  const [botResponse, setBotResponse] = useState<string | null>(null);
  const [botLoading, setBotLoading] = useState(false);
  // Masta Mood State: 'idle' | 'blinking' | 'thinking' | 'happy' | 'listening'
  const [mastaMood, setMastaMood] = useState('idle');

  // Masta Lifecycle (Blinking & Idle animations)
  useEffect(() => {
    if (mastaMood === 'thinking' || mastaMood === 'happy') return;

    // Random blinking interval between 3s and 6s
    const blinkInterval = setInterval(() => {
      setMastaMood(prev => prev === 'idle' ? 'blinking' : prev);
      setTimeout(() => setMastaMood(prev => prev === 'blinking' ? 'idle' : prev), 200);
    }, Math.random() * 3000 + 3000);

    return () => clearInterval(blinkInterval);
  }, [mastaMood]);

  // Handle typing to change mood
  useEffect(() => {
    if (botQuery.length > 0 && !botLoading && !botResponse) {
      setMastaMood('listening');
    } else if (botQuery.length === 0 && !botLoading && !botResponse) {
      setMastaMood('idle');
    }
  }, [botQuery, botLoading, botResponse]);

  // Mock Feed Data (Converted to State for interactivity)
  const [homeFeed, setHomeFeed] = useState([
    {
      id: 1,
      type: 'news',
      author: 'Lualaba Gouvernorat',
      avatar: 'https://picsum.photos/50/50?random=gov',
      time: 'Il y a 2h',
      content: 'Lancement officiel des travaux de réhabilitation de la route RN39. Une avancée majeure pour fluidifier le transport des minerais et des personnes.',
      image: 'https://picsum.photos/500/300?random=road',
      likes: 124,
      comments: 45,
      isVerified: true,
      isLiked: false
    },
    {
      id: 2,
      type: 'user',
      author: 'Maman Tina Bio',
      avatar: 'https://picsum.photos/50/50?random=tina',
      time: 'Il y a 4h',
      content: '📢 Arrivage de poissons frais du lac ce matin au marché de Musompo ! Venez nombreux, prix imbattables pour les 50 premiers clients. 🐟',
      image: 'https://picsum.photos/500/300?random=fish',
      likes: 56,
      comments: 12,
      isVerified: false,
      isLiked: false
    },
    {
      id: 3,
      type: 'alert',
      author: 'SNEL Info',
      avatar: 'https://picsum.photos/50/50?random=snel',
      time: 'Il y a 30 min',
      content: '⚠️ Coupure d\'électricité programmée dans le quartier Golf et Joli Site pour maintenance des transformateurs. Retour prévu vers 18h.',
      likes: 230,
      comments: 89,
      isVerified: true,
      isLiked: false
    }
  ]);

  // Comment Modal State for Home Feed
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');

  // --- HANDLERS FOR HOME FEED ---

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleHomeLike = (id: number) => {
    setHomeFeed(prev => prev.map(post => {
      if (post.id === id) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleHomeShare = async (post: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post de ${post.author}`,
          text: post.content,
          url: window.location.href
        });
      } catch (error) {
         console.log('Error sharing', error);
      }
    } else {
       showToast("Lien copié !");
    }
  };

  const submitComment = () => {
    if (!commentText.trim() || !activeCommentId) return;
    setHomeFeed(prev => prev.map(post => 
       post.id === activeCommentId ? { ...post, comments: post.comments + 1 } : post
    ));
    setCommentText('');
    setActiveCommentId(null);
    showToast("Commentaire envoyé !");
  };

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Simulate retrieving a previously logged in user
  useEffect(() => {
    // In a real app, this would come from localStorage or SecureStore
    const mockPreviousUser = {
      name: 'Bienvenu',
      avatar: 'https://picsum.photos/200/200?random=user',
      id: '0999000000'
    };
    
    // Slight delay to simulate loading config
    setTimeout(() => {
        setSavedUser(mockPreviousUser);
        // Pre-fill identifier
        setFormData(prev => ({ ...prev, loginIdentifier: mockPreviousUser.id }));
    }, 500);
  }, []);

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate API call for password auth
    setTimeout(() => {
      if (formData.loginIdentifier && formData.password.length >= 4) {
        setIsAuth(true);
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleRegistrationNext = () => {
    // Basic validation could go here
    if (regStep === 1) {
       // Check required fields
       if (!formData.password) {
         // Should validate password presence
       }
    }
    if (regStep === 2) {
       // Strict check for verification
       if (!idUploaded || !faceScanned) return; 
    }
    if (regStep === 3) {
       // Final OTP check
       setIsLoading(true);
       setTimeout(() => {
         setIsAuth(true);
         setIsLoading(false);
       }, 1500);
       return;
    }
    setRegStep(prev => prev + 1);
  };

  const handleBotAsk = async () => {
    if(!botQuery.trim()) return;
    setBotLoading(true);
    setMastaMood('thinking');
    
    const res = await askLocalAssistant(botQuery);
    
    setBotResponse(res);
    setBotLoading(false);
    setMastaMood('happy');
    
    // Go back to idle after celebrating the response
    setTimeout(() => {
      setMastaMood('idle');
    }, 4000);
  };

  // --- RENDER HELPERS FOR REGISTRATION ---

  const renderAccountTypeSelection = () => (
    <div className="space-y-4 animate-slide-up">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">Choisissez votre profil</h3>
      
      <div 
        onClick={() => setAccountType('classic')}
        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${accountType === 'classic' ? 'border-lualaba-500 bg-lualaba-50 dark:bg-lualaba-900/20' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}
      >
        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
           <UserCircle size={24} />
        </div>
        <div>
           <h4 className="font-bold text-gray-900 dark:text-white">Compte Classique</h4>
           <p className="text-xs text-gray-500 dark:text-gray-400">Pour les citoyens et particuliers.</p>
        </div>
        {accountType === 'classic' && <CheckCircle className="ml-auto text-lualaba-600" size={20} />}
      </div>

      <div 
        onClick={() => setAccountType('pro')}
        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${accountType === 'pro' ? 'border-lualaba-500 bg-lualaba-50 dark:bg-lualaba-900/20' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}
      >
        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full text-purple-600 dark:text-purple-400">
           <Briefcase size={24} />
        </div>
        <div>
           <h4 className="font-bold text-gray-900 dark:text-white">Professionnel</h4>
           <p className="text-xs text-gray-500 dark:text-gray-400">Indépendants, experts, créateurs.</p>
        </div>
        {accountType === 'pro' && <CheckCircle className="ml-auto text-lualaba-600" size={20} />}
      </div>

      <div 
        onClick={() => setAccountType('enterprise')}
        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${accountType === 'enterprise' ? 'border-lualaba-500 bg-lualaba-50 dark:bg-lualaba-900/20' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}
      >
        <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full text-orange-600 dark:text-orange-400">
           <Building2 size={24} />
        </div>
        <div>
           <h4 className="font-bold text-gray-900 dark:text-white">Entreprise</h4>
           <p className="text-xs text-gray-500 dark:text-gray-400">Sociétés, ONGs, Commerces.</p>
        </div>
        {accountType === 'enterprise' && <CheckCircle className="ml-auto text-lualaba-600" size={20} />}
      </div>
    </div>
  );

  const InputField = ({ icon: Icon, placeholder, value, onChange, type = "text", label, rightElement }: any) => (
    <div className="space-y-1">
       {label && <label className="text-xs font-bold text-gray-500 uppercase ml-1">{label}</label>}
       <div className="relative">
          <Icon className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input 
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl py-3.5 pl-12 pr-12 outline-none focus:ring-2 focus:ring-lualaba-500/20 focus:border-lualaba-500 transition-all text-gray-800 dark:text-white text-sm"
          />
          {rightElement && (
            <div className="absolute right-4 top-3.5">
              {rightElement}
            </div>
          )}
       </div>
    </div>
  );

  const renderInfoForm = () => (
    <div className="space-y-4 animate-slide-left max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
      
      {/* FIELDS FOR ENTERPRISE */}
      {accountType === 'enterprise' ? (
        <>
          <InputField icon={Building2} label="Nom de l'entreprise" placeholder="Ex: Mining Solutions SARL" value={formData.companyName} onChange={(v: string) => updateForm('companyName', v)} />
          <InputField icon={FileText} label="Numéro RCCM / ID Nat" placeholder="Documents officiels" value={formData.profession} onChange={(v: string) => updateForm('profession', v)} />
        </>
      ) : (
        /* FIELDS FOR CLASSIC & PRO */
        <>
          <div className="flex gap-3">
             <div className="flex-1">
                <InputField icon={User} label="Prénom" placeholder="Prénom" value={formData.firstName} onChange={(v: string) => updateForm('firstName', v)} />
             </div>
             <div className="flex-1">
                <InputField icon={User} label="Nom" placeholder="Nom" value={formData.lastName} onChange={(v: string) => updateForm('lastName', v)} />
             </div>
          </div>
          
          <div className="flex gap-3">
             <div className="flex-1 space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Genre</label>
                <div className="flex bg-gray-50 dark:bg-gray-700/50 rounded-xl p-1 border border-gray-200 dark:border-gray-600">
                   {['M', 'F'].map(g => (
                     <button 
                       key={g} 
                       onClick={() => updateForm('gender', g)}
                       className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors ${formData.gender === g ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white' : 'text-gray-400'}`}
                     >
                       {g}
                     </button>
                   ))}
                </div>
             </div>
             <div className="flex-1">
                <InputField icon={Calendar} label="Date Naissance" type="date" value={formData.dob} onChange={(v: string) => updateForm('dob', v)} />
             </div>
          </div>

          <InputField icon={Flag} label="Nationalité" placeholder="Ex: Congolaise" value={formData.nationality} onChange={(v: string) => updateForm('nationality', v)} />
        </>
      )}

      {/* FIELDS FOR PRO SPECIFIC */}
      {accountType === 'pro' && (
        <>
           <InputField icon={Briefcase} label="Profession" placeholder="Ex: Ingénieur Civil" value={formData.profession} onChange={(v: string) => updateForm('profession', v)} />
           <div className="flex gap-3">
             <div className="flex-1">
               <InputField icon={TrendingUp} label="Expérience" placeholder="Ex: 5 ans" value={formData.experience} onChange={(v: string) => updateForm('experience', v)} />
             </div>
             <div className="flex-[2]">
               <InputField icon={Building2} label="Entreprise Actuelle" placeholder="Nom de la société" value={formData.currentCompany} onChange={(v: string) => updateForm('currentCompany', v)} />
             </div>
           </div>
        </>
      )}

      {/* COMMON FIELDS ALL TYPES */}
      <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Coordonnées & Sécurité</label>
        <div className="space-y-3">
          <InputField icon={Mail} placeholder="email@exemple.com" value={formData.email} onChange={(v: string) => updateForm('email', v)} type="email" />
          <InputField icon={MapPin} placeholder="Adresse de résidence (Q, Av, No)" value={formData.address} onChange={(v: string) => updateForm('address', v)} />
          
          {/* Added Password Field to Registration */}
          <InputField 
            icon={Lock} 
            label="Créer un mot de passe"
            placeholder="••••••••" 
            type={showPassword ? "text" : "password"}
            value={formData.password} 
            onChange={(v: string) => updateForm('password', v)} 
            rightElement={
              <button onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />
        </div>
      </div>
      
      {(accountType === 'pro' || accountType === 'enterprise') && (
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Description / Bio</label>
          <textarea 
            className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-3 outline-none focus:ring-2 focus:ring-lualaba-500/20 focus:border-lualaba-500 transition-all text-gray-800 dark:text-white text-sm min-h-[80px]"
            placeholder="Décrivez votre activité..."
            value={formData.description}
            onChange={(e) => updateForm('description', e.target.value)}
          />
        </div>
      )}

    </div>
  );

  const renderVerification = () => (
    <div className="space-y-6 animate-slide-left">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/50 flex gap-3">
         <ShieldCheck className="text-yellow-600 dark:text-yellow-400 shrink-0" size={24} />
         <div>
            <h4 className="font-bold text-yellow-800 dark:text-yellow-300 text-sm">Vérification d'Identité</h4>
            <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
              {accountType === 'enterprise' 
                ? "Pour les entreprises, veuillez fournir les documents légaux et vérifier l'identité du représentant."
                : "Pour valider et certifier votre compte, veuillez fournir une pièce d'identité valide et effectuer un scan facial."}
            </p>
         </div>
      </div>

      {/* ID Upload */}
      <div 
        onClick={() => setIdUploaded(true)}
        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${idUploaded ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-lualaba-500'}`}
      >
         {idUploaded ? (
            <>
              <CheckCircle size={40} className="text-green-500 mb-2" />
              <span className="font-bold text-green-700 dark:text-green-400">Document reçu</span>
            </>
         ) : (
            <>
              <Upload size={32} className="text-gray-400 mb-2" />
              <span className="font-bold text-gray-700 dark:text-gray-300">
                 {accountType === 'enterprise' ? "Documents Entreprise" : "Pièce d'identité"}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                 {accountType === 'enterprise' ? "RCCM, ID Nat, Statuts" : "Carte d'électeur, Passeport ou Permis"}
              </span>
            </>
         )}
      </div>

      {/* Face Scan */}
      <div 
        onClick={() => setFaceScanned(true)}
        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${faceScanned ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-lualaba-500'}`}
      >
         {faceScanned ? (
            <>
              <CheckCircle size={40} className="text-green-500 mb-2" />
              <span className="font-bold text-green-700 dark:text-green-400">Visage vérifié</span>
            </>
         ) : (
            <>
              <ScanFace size={32} className="text-gray-400 mb-2" />
              <span className="font-bold text-gray-700 dark:text-gray-300">Scan du Visage</span>
              <span className="text-xs text-gray-400 mt-1">
                {accountType === 'enterprise' ? "Vérification du représentant" : "Selfie vidéo sécurisé"}
              </span>
            </>
         )}
      </div>
    </div>
  );

  const renderPhoneOTP = () => (
    <div className="animate-slide-left h-full flex flex-col">
       <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">Validation Finale</h3>
          <p className="text-sm text-gray-500 text-center mb-6">Nous allons envoyer un code SMS pour lier ce compte.</p>
          
          <InputField 
            icon={Phone} 
            placeholder="Numéro de téléphone" 
            value={formData.phone} 
            onChange={(v: string) => updateForm('phone', v)} 
            type="tel"
            label="Numéro Mobile"
          />

          {formData.phone.length > 5 && (
            <div className="mt-6">
                <label className="block text-center text-xs font-bold text-gray-400 uppercase mb-4">Code reçu par SMS</label>
                <div className="flex justify-center gap-3">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                        formData.otp.length === i 
                          ? 'border-lualaba-500 bg-white dark:bg-gray-800 ring-4 ring-lualaba-500/10' 
                          : formData.otp.length > i 
                            ? 'border-lualaba-600 bg-lualaba-50 dark:bg-lualaba-900/10 text-lualaba-600'
                            : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 text-gray-400'
                      }`}>
                        {formData.otp[i] || ''}
                      </div>
                    ))}
                </div>
                <input 
                    type="tel" 
                    value={formData.otp}
                    onChange={(e) => {
                      if (e.target.value.length <= 4) updateForm('otp', e.target.value);
                    }}
                    autoFocus
                    className="opacity-0 absolute inset-x-0 h-20 cursor-pointer" 
                  />
            </div>
          )}
       </div>
    </div>
  );

  const renderSOSModal = () => (
    <div className="fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-sm flex flex-col items-end justify-end sm:items-center sm:justify-center p-4 animate-fade-in">
       {/* Close Area */}
       <div className="absolute inset-0" onClick={() => setShowSOS(false)}></div>

       <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative z-10 animate-slide-up mb-4 sm:mb-0">
          <div className="flex justify-between items-center mb-6">
             <div>
                <h2 className="text-2xl font-black text-red-600 uppercase tracking-tight flex items-center gap-2">
                   <AlertTriangle size={28} fill="currentColor" className="text-red-500" /> Urgence
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Appuyez pour appeler immédiatement.</p>
             </div>
             <button 
                onClick={() => setShowSOS(false)}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
             >
                <X size={20} className="text-gray-600 dark:text-gray-300"/>
             </button>
          </div>

          <div className="space-y-3">
             <a href="tel:112" className="w-full bg-blue-600 text-white p-4 rounded-2xl flex items-center gap-4 font-bold text-lg shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-transform">
                <div className="bg-white/20 p-2.5 rounded-xl"><Shield size={24} fill="currentColor"/></div>
                <div className="flex-1 text-left">
                   <span className="block leading-none">Police</span>
                   <span className="text-xs opacity-70 font-normal">Intervention rapide</span>
                </div>
                <span className="text-xl font-black opacity-90">112</span>
             </a>
             
             <a href="tel:118" className="w-full bg-red-500 text-white p-4 rounded-2xl flex items-center gap-4 font-bold text-lg shadow-lg shadow-red-500/20 active:scale-[0.98] transition-transform">
                <div className="bg-white/20 p-2.5 rounded-xl"><Ambulance size={24}/></div>
                <div className="flex-1 text-left">
                   <span className="block leading-none">Ambulance</span>
                   <span className="text-xs opacity-70 font-normal">Secours médical</span>
                </div>
                <span className="text-xl font-black opacity-90">118</span>
             </a>

             <a href="tel:119" className="w-full bg-orange-500 text-white p-4 rounded-2xl flex items-center gap-4 font-bold text-lg shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-transform">
                <div className="bg-white/20 p-2.5 rounded-xl"><Flame size={24} fill="currentColor"/></div>
                <div className="flex-1 text-left">
                   <span className="block leading-none">Pompiers</span>
                   <span className="text-xs opacity-70 font-normal">Incendie & Sauvetage</span>
                </div>
                <span className="text-xl font-black opacity-90">119</span>
             </a>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <button className="w-full py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-xl flex items-center justify-center gap-2 border border-red-100 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                <MapPin size={18} /> Envoyer ma position GPS
              </button>
              <p className="text-[10px] text-center text-gray-400 mt-3">
                 Votre localisation sera partagée avec les services d'urgence connectés.
              </p>
          </div>
       </div>
    </div>
  );

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col relative overflow-hidden transition-colors duration-300 font-sans">
        
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-br from-lualaba-600 to-lualaba-700 rounded-b-[3rem] z-0 overflow-hidden">
           <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] opacity-10" 
                style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mb-16"></div>
        </div>

        {/* Content Container */}
        <div className="flex-1 flex flex-col z-10 px-6 pt-12 pb-6 max-w-md mx-auto w-full">
          
          {/* Header */}
          <div className="text-center text-white mb-6 mt-2">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl mx-auto flex items-center justify-center shadow-lg mb-4 border border-white/30">
               <Radio className="text-white" size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black tracking-tight mb-1">Lualaba Connect</h1>
            <p className="text-lualaba-100 text-sm font-medium opacity-90">
              La super-app de la province
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-6 border border-gray-100 dark:border-gray-700 flex-1 flex flex-col overflow-hidden relative">
            
            {/* --- LOGIN MODE --- */}
            {authMode === 'login' ? (
              <div className="flex flex-col h-full animate-slide-up">
                 <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex mb-6">
                   <button className="flex-1 py-2 text-sm font-bold bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm rounded-lg transition-all">Connexion</button>
                   <button onClick={() => setAuthMode('register')} className="flex-1 py-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 transition-all">Inscription</button>
                 </div>

                 <div className="flex-1 flex flex-col">
                    <div className="text-left mb-6">
                      {savedUser && (
                        <div className="mb-4 flex justify-center">
                           <img src={savedUser.avatar} alt="User" className="w-20 h-20 rounded-full border-4 border-lualaba-100 dark:border-gray-700 shadow-md" />
                        </div>
                      )}
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 text-center">
                        Bon retour{savedUser ? `, ${savedUser.name}` : ''} !
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                         {savedUser ? 'Connectez-vous pour continuer.' : 'Connectez-vous pour accéder à vos services.'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* IDENTIFIER FIELD */}
                      <InputField 
                        icon={Mail} 
                        label="Identifiant"
                        placeholder="Email ou Téléphone" 
                        value={formData.loginIdentifier} 
                        onChange={(v: string) => updateForm('loginIdentifier', v)} 
                      />

                      {/* PASSWORD FIELD */}
                      <div>
                        <InputField 
                          icon={Lock} 
                          label="Mot de passe"
                          placeholder="••••••••" 
                          type={showPassword ? "text" : "password"}
                          value={formData.password} 
                          onChange={(v: string) => updateForm('password', v)}
                          rightElement={
                            <button onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          }
                        />
                        <div className="flex justify-end mt-2">
                           <button className="text-xs font-bold text-lualaba-600 hover:underline">Mot de passe oublié ?</button>
                        </div>
                      </div>
                    </div>
                 </div>

                 <button 
                  onClick={handleLogin}
                  disabled={isLoading || !formData.loginIdentifier || formData.password.length < 4}
                  className="w-full bg-lualaba-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-lualaba-700 active:scale-[0.98] transition-all shadow-lg shadow-lualaba-600/30 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:shadow-none"
                >
                  {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"/> : 'Se connecter'}
                </button>
              </div>
            ) : (
              /* --- REGISTER MODE (WIZARD) --- */
              <div className="flex flex-col h-full">
                 <div className="flex items-center justify-between mb-4">
                    {regStep > 0 && (
                      <button onClick={() => setRegStep(prev => prev - 1)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <ChevronRight className="rotate-180 text-gray-400" size={20} />
                      </button>
                    )}
                    <span className="text-xs font-bold text-lualaba-600 dark:text-lualaba-400 uppercase tracking-widest">
                       Étape {regStep + 1} / 4
                    </span>
                    <button onClick={() => { setAuthMode('login'); setRegStep(0); }} className="text-xs font-bold text-gray-400 hover:text-gray-600">
                       Annuler
                    </button>
                 </div>

                 <div className="flex-1 overflow-hidden relative">
                    {regStep === 0 && renderAccountTypeSelection()}
                    {regStep === 1 && renderInfoForm()}
                    {regStep === 2 && renderVerification()}
                    {regStep === 3 && renderPhoneOTP()}
                 </div>

                 <button 
                  onClick={handleRegistrationNext}
                  disabled={
                    isLoading || 
                    (regStep === 2 && (!idUploaded || !faceScanned)) || 
                    (regStep === 3 && formData.otp.length !== 4)
                  }
                  className="w-full bg-lualaba-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-lualaba-700 active:scale-[0.98] transition-all shadow-lg shadow-lualaba-600/30 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"/> : (regStep === 3 ? 'Terminer' : 'Suivant')} <ArrowRight size={20} />
                </button>
              </div>
            )}
            
          </div>

          <p className="text-center text-[10px] text-gray-400 mt-4 max-w-xs mx-auto">
             En créant un compte, vous acceptez la <a href="#" className="underline">Politique de Confidentialité</a> du Lualaba Numérique.
          </p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.ADVICE: return <AdviceModule onBack={() => setActiveTab(AppTab.HOME)} />;
      case AppTab.JOBS: return <JobsModule onBack={() => setActiveTab(AppTab.HOME)} />;
      case AppTab.SERVICES: return <ServicesModule onBack={() => setActiveTab(AppTab.HOME)} />;
      case AppTab.HEALTH: return <HealthModule onBack={() => setActiveTab(AppTab.PROFILE)} />;
      case AppTab.VIDEO: return <VideoFeedModule />;
      case AppTab.MARKET: return <MarketModule />;
      case AppTab.CHAT: return <ChatModule 
          setTabBarVisible={setIsTabBarVisible} 
          onBack={() => setActiveTab(AppTab.HOME)} 
          darkMode={darkMode} 
          toggleDarkMode={() => setDarkMode(!darkMode)} 
      />;
      case AppTab.FEED: return <FeedModule onBack={() => setActiveTab(AppTab.HOME)} />;
      case AppTab.PROFILE: 
        return <ProfileModule 
                  onLogout={() => setIsAuth(false)} 
                  darkMode={darkMode} 
                  toggleDarkMode={() => setDarkMode(!darkMode)}
                  onOpenHealth={() => setActiveTab(AppTab.HEALTH)} 
                />;
      default: // HOME
        return (
          <div className="h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-y-auto custom-scrollbar relative">
            
            {/* TOAST NOTIFICATION FOR HOME */}
            {toast && (
              <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold animate-fade-in flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" /> {toast}
              </div>
            )}

            {/* HOME COMMENT MODAL */}
            {activeCommentId && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl p-4 shadow-2xl animate-slide-up">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">Commentaires</h3>
                      <button onClick={() => setActiveCommentId(null)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                          <X size={20} className="text-gray-500" />
                      </button>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto mb-4 space-y-3">
                      <div className="text-center text-gray-400 py-4 text-xs">
                          Soyez le premier à commenter !
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Écrivez votre commentaire..."
                        className="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-lualaba-500 outline-none text-gray-800 dark:text-white"
                        autoFocus
                      />
                      <button 
                          onClick={submitComment}
                          disabled={!commentText.trim()}
                          className="bg-lualaba-600 text-white p-3 rounded-xl hover:bg-lualaba-700 disabled:opacity-50 transition-colors"
                      >
                          <Send size={20} />
                      </button>
                    </div>
                </div>
              </div>
            )}

            <div className="flex flex-col pb-32">
              
              {/* Header Section (Part of Scroll) */}
              <div className="bg-[#0b3d35] dark:bg-[#06201c] pb-24 rounded-b-[3rem] relative overflow-hidden shrink-0">
                {/* Background gradients/blobs */}
                 <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[100%] bg-teal-500/20 blur-[100px] rounded-full pointer-events-none"></div>
                 <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>

                <div className="px-6 pt-10 relative z-10">
                  {/* Top Row: Avatar + Text + Call Button */}
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={savedUser?.avatar || "https://picsum.photos/200/200?random=user"} className="w-14 h-14 rounded-full border-2 border-teal-400 p-0.5 object-cover" alt="User" />
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#0b3d35] rounded-full"></div>
                        </div>
                        <div>
                           <h2 className="text-teal-400 font-black tracking-wider text-sm uppercase">LUALABACONNECT</h2>
                           <p className="text-white font-bold text-lg leading-tight">Bonjour, {formData.firstName || 'Richard'}</p>
                           <p className="text-teal-100/60 text-xs font-medium capitalize">
                             {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                           </p>
                        </div>
                     </div>
                     
                     <button 
                       onClick={() => setShowSOS(true)}
                       className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-red-900/30 bg-gray-300 p-1 active:scale-95 transition-transform"
                     >
                        <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center relative shadow-inner border border-red-600 overflow-hidden">
                            {/* Gloss effect */}
                            <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/30 to-transparent rounded-t-full"></div>
                            <span className="text-white font-black text-sm tracking-wider drop-shadow-md z-10 font-sans">SOS</span>
                        </div>
                     </button>
                  </div>

                  {/* Modern iPhone Style Weather Widget - UPDATED */}
                  <div 
                    onClick={() => showToast("Météo détaillée bientôt disponible")}
                    className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[2rem] p-4 text-white shadow-xl relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                  >
                      {/* Top Row: Location & Current Status */}
                      <div className="flex justify-between items-start mb-2">
                          <div>
                              <h3 className="text-lg font-bold flex items-center gap-1 drop-shadow-md">
                                  Lubumbashi <Navigation size={14} fill="currentColor" />
                              </h3>
                              <div className="text-6xl font-thin tracking-tighter drop-shadow-lg leading-none">
                                  22°
                              </div>
                          </div>
                          <div className="text-right flex flex-col items-end pt-1">
                              <CloudRain size={32} className="mb-1 drop-shadow-md text-blue-200 fill-blue-200/20 animate-pulse-slow" />
                              <span className="font-semibold text-base drop-shadow-md">Pluie</span>
                              <span className="text-xs font-medium opacity-90 drop-shadow-md flex gap-2 mt-0.5">
                                <span>H:25°</span>
                                <span>B:19°</span>
                              </span>
                          </div>
                      </div>

                      {/* Bottom Row: Hourly Forecast */}
                      <div className="flex justify-between items-center text-center px-1 mt-3 pt-3 border-t border-white/10">
                          {[
                            { time: 'Maintenant', icon: CloudRain, temp: '22°' },
                            { time: '13 h', icon: CloudRain, temp: '24°' },
                            { time: '14 h', icon: CloudLightning, temp: '25°' },
                            { time: '15 h', icon: Cloud, temp: '24°' },
                            { time: '16 h', icon: Cloud, temp: '23°' },
                            { time: '17 h', icon: CloudSun, temp: '22°' },
                          ].map((hour, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1">
                                <span className="text-[10px] font-bold opacity-80 uppercase">{hour.time}</span>
                                <hour.icon size={18} className="text-white drop-shadow-sm my-0.5" />
                                <span className="text-xs font-bold">{hour.temp}</span>
                            </div>
                          ))}
                      </div>
                  </div>
                </div>
              </div>

              {/* Overlapping AI Widget (Masta na nga) */}
              <div className="px-6 -mt-16 relative z-20 mb-6 shrink-0">
                 <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-1 shadow-lg shadow-indigo-500/20">
                   <div className="bg-indigo-950/20 rounded-xl p-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-2 text-white">
                            <div className="p-1.5 bg-white/20 rounded-full transition-all duration-300">
                               {/* Updated Dynamic Masta Avatar */}
                               <MastaAvatar mood={mastaMood} />
                            </div>
                            <span className="font-black italic text-2xl tracking-tighter">Masta</span>
                         </div>
                         <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">Bêta</span>
                      </div>

                      {!botResponse ? (
                          <>
                            {/* Updated Introduction Text */}
                            <p className="text-indigo-100 text-xs mb-3 font-medium leading-relaxed">
                              Pose moi une question, je suis ton assistant personnel
                            </p>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={botQuery}
                                onChange={(e) => setBotQuery(e.target.value)}
                                placeholder="Posez votre question..." 
                                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs placeholder:text-indigo-200/70 outline-none focus:bg-white/20 text-white transition-colors"
                              />
                              <button 
                                onClick={handleBotAsk} 
                                disabled={botLoading} 
                                className="bg-white text-indigo-600 px-3 rounded-lg text-xs font-bold shadow-md active:scale-95 transition-transform"
                              >
                                {botLoading ? <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"/> : <ChevronRight size={18}/>}
                              </button>
                            </div>
                          </>
                      ) : (
                          <div className="animate-fade-in">
                            <div className="bg-white/10 rounded-lg p-3 mb-2 border border-white/10">
                              <p className="text-xs text-white/90 leading-relaxed">{botResponse}</p>
                            </div>
                            <button onClick={() => { setBotResponse(null); setBotQuery(''); }} className="text-xs text-indigo-200 font-bold hover:text-white transition-colors">Poser une autre question</button>
                          </div>
                      )}
                   </div>
                </div>
              </div>

              <div className="px-6 space-y-6 pt-2 shrink-0">

                {/* 2. Global Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Rechercher un service, un produit..." 
                    className="w-full bg-white dark:bg-gray-800 pl-12 pr-4 py-3.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-sm outline-none focus:ring-2 focus:ring-lualaba-500/20 text-gray-800 dark:text-white transition-all"
                  />
                </div>

                {/* 5. Live Info Cards (News & Market) */}
                <div className="grid grid-cols-1 gap-4">
                   {/* Mining Info */}
                   <div className="bg-gray-900 dark:bg-black rounded-2xl p-4 text-white shadow-lg relative overflow-hidden group border border-gray-800">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                      <div className="relative z-10 flex justify-between items-center">
                         <div>
                            <p className="text-gray-400 text-xs font-bold uppercase mb-1">Cours du Cuivre (LME)</p>
                            <h4 className="text-2xl font-bold text-emerald-400">$9,840.50 <span className="text-xs text-emerald-200 font-normal">/ Tonne</span></h4>
                            <div className="flex items-center gap-1 text-green-400 text-xs mt-1">
                               <TrendingUp size={12} /> +1.2% aujourd'hui
                            </div>
                         </div>
                         <div className="h-12 w-12 bg-emerald-900/50 rounded-full flex items-center justify-center border border-emerald-500/30">
                            <TrendingUp className="text-emerald-400" size={24} />
                         </div>
                      </div>
                   </div>

                   {/* Actu Feed (Horizontal Scroll / Carousel) */}
                   <div className="mt-2">
                      <div className="flex justify-between items-center mb-4 px-1">
                         <h3 className="font-bold text-gray-900 dark:text-white text-lg">Actu</h3>
                         <button 
                            onClick={() => setActiveTab(AppTab.FEED)}
                            className="text-xs text-lualaba-600 dark:text-lualaba-400 font-bold"
                         >
                            Tout voir
                         </button>
                      </div>
                      
                      <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x snap-mandatory -mx-6 px-6">
                         {homeFeed.map((post) => (
                            <div key={post.id} className="min-w-[85%] snap-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                               {/* Header */}
                               <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center gap-3">
                                     <img src={post.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-600" alt={post.author} />
                                     <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1">
                                           {post.author}
                                           {post.isVerified && <CheckCircle size={12} className="text-blue-500 fill-blue-500 text-white" />}
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{post.time}</p>
                                     </div>
                                  </div>
                                  <div className="flex gap-1">
                                    {post.type === 'alert' && (
                                        <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded font-bold uppercase text-[9px]">Alerte</span>
                                    )}
                                    {post.type === 'news' && (
                                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-bold uppercase text-[9px]">Info</span>
                                    )}
                                  </div>
                               </div>
                               
                               {/* Content */}
                               <p className="text-sm text-gray-800 dark:text-gray-200 mb-3 leading-relaxed line-clamp-3">
                                  {post.content}
                               </p>
                               
                               {/* Image */}
                               {post.image && (
                                  <div className="rounded-xl overflow-hidden mb-3 border border-gray-100 dark:border-gray-700 h-40 shrink-0">
                                     <img src={post.image} className="w-full h-full object-cover" alt="Post" />
                                  </div>
                               )}
                               
                               {/* Actions */}
                               <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-700/50 mt-auto">
                                  <div className="flex items-center gap-4">
                                     <button 
                                        onClick={() => handleHomeLike(post.id)}
                                        className={`flex items-center gap-1.5 text-xs font-bold transition-colors group ${post.isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'}`}
                                     >
                                        <Heart size={16} className={`transition-transform group-hover:scale-110 ${post.isLiked ? 'fill-current' : ''}`} /> 
                                        <span>{post.likes}</span>
                                     </button>
                                     <button 
                                        onClick={() => setActiveCommentId(post.id)}
                                        className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs font-bold hover:text-blue-500 transition-colors group"
                                     >
                                        <CommentIcon size={16} className="group-hover:scale-110 transition-transform" /> 
                                        <span>{post.comments}</span>
                                     </button>
                                  </div>
                                  <button 
                                     onClick={() => handleHomeShare(post)}
                                     className="text-gray-400 hover:text-lualaba-600 transition-colors hover:bg-lualaba-50 dark:hover:bg-lualaba-900/10 p-1.5 rounded-full"
                                  >
                                     <Share2 size={16} />
                                  </button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* 6. Bottom Action Cards (Services, Jobs, Advice) */}
                <div className="space-y-3 mt-2">
                    {/* Services Rapides */}
                    <div 
                      onClick={() => setActiveTab(AppTab.SERVICES)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-5 flex items-center justify-between text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                                <LayoutGrid size={28} />
                            </div>
                            <div>
                                <span className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-md mb-1.5 inline-block backdrop-blur-sm">NOUVEAU</span>
                                <h3 className="font-bold text-lg leading-tight">Services Rapides</h3>
                                <p className="text-blue-100 text-xs font-medium mt-0.5">Food, Ménage, Auto & plus...</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-md">
                            <ChevronRight size={20} strokeWidth={3} />
                        </div>
                    </div>

                    {/* Emploi & Annonce */}
                    <div 
                      onClick={() => setActiveTab(AppTab.JOBS)}
                      className="bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-[2rem] p-5 flex items-center justify-between text-white shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-transform cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                                <Briefcase size={28} />
                            </div>
                            <div>
                                <span className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-md mb-1.5 inline-block backdrop-blur-sm">OPPORTUNITÉS</span>
                                <h3 className="font-bold text-lg leading-tight">Emploi & Annonce</h3>
                                <p className="text-purple-100 text-xs font-medium mt-0.5">Recrutement, Freelance, Annonces</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-md">
                            <ChevronRight size={20} strokeWidth={3} />
                        </div>
                    </div>

                    {/* Conseil du jour */}
                    <div 
                      onClick={() => setActiveTab(AppTab.ADVICE)}
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-[2rem] p-5 flex items-center justify-between text-white shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-transform cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                                <Thermometer size={28} />
                            </div>
                            <div>
                                <span className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-md mb-1.5 inline-block backdrop-blur-sm">CONSEIL DU JOUR</span>
                                <h3 className="font-bold text-lg leading-tight">Pic de chaleur prévu</h3>
                                <p className="text-teal-100 text-xs font-medium mt-0.5 max-w-[180px] leading-tight">Hydratez-vous régulièrement aujourd'hui.</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-teal-600 shadow-md">
                            <ChevronRight size={20} strokeWidth={3} />
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-full bg-white dark:bg-gray-900 relative max-w-md mx-auto shadow-2xl overflow-hidden flex flex-col transition-colors duration-300">
      {/* Dynamic Content */}
      <div className="flex-1 overflow-hidden relative">
        {renderContent()}
      </div>

      {showSOS && renderSOSModal()}

      {/* Floating Transparent Bottom Navigation */}
      {isTabBarVisible && (
        <nav className="h-[72px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 flex justify-around items-center px-4 absolute bottom-6 left-5 right-5 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-black/50 z-50 transition-all duration-300">
          <NavButton icon={<Home size={24} />} label="Accueil" isActive={activeTab === AppTab.HOME} onClick={() => setActiveTab(AppTab.HOME)} />
          <NavButton icon={<MessageSquare size={24} />} label="Chat" isActive={activeTab === AppTab.CHAT} onClick={() => setActiveTab(AppTab.CHAT)} />
          
          {/* VIDEO/TIKTOK Button - Center Pop-out */}
          <div className="relative -top-8 group">
             <div className="absolute inset-0 bg-black rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
             <button 
               onClick={() => setActiveTab(AppTab.VIDEO)}
               className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-95 ${activeTab === AppTab.VIDEO ? 'bg-black text-white border-2 border-lualaba-500' : 'bg-gray-800 dark:bg-gray-700 text-white'}`}
             >
               <Play size={24} fill="currentColor" className="ml-1"/>
             </button>
          </div>
          
          {/* Market Button (Previously Health spot) */}
          <NavButton icon={<ShoppingBag size={24} />} label="Market" isActive={activeTab === AppTab.MARKET} onClick={() => setActiveTab(AppTab.MARKET)} />
          
          {/* Profile Button */}
          <NavButton icon={<User size={24} />} label="Profil" isActive={activeTab === AppTab.PROFILE || activeTab === AppTab.HEALTH} onClick={() => setActiveTab(AppTab.PROFILE)} />
        </nav>
      )}
    </div>
  );
};

const NavButton: React.FC<{ icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${isActive ? 'text-lualaba-600 dark:text-lualaba-400 scale-110' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
  >
    {icon}
    {isActive && <span className="absolute -bottom-1 w-1 h-1 bg-lualaba-600 rounded-full"></span>}
  </button>
);

export default App;