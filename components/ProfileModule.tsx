import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, CreditCard, Shield, Globe, Bell, Smartphone, LogOut, ChevronRight, Moon, Download, HelpCircle, Edit3, MapPin, BarChart3, Wifi, Sun, Camera, QrCode, HeartPulse, Activity, Flame, Lock, X, Fingerprint, Gamepad2, Users, Dna, PlayCircle, MessageCircle, Info, Check, Mic, Music, Trophy, RefreshCw, AlertTriangle, Sparkles, Smile, Heart, Star, ShieldCheck, Ghost, Search, Send, Image as ImageIcon, Video, Zap, ArrowLeft, FileText, DollarSign, History } from 'lucide-react';

interface ProfileModuleProps {
  onLogout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onOpenHealth: () => void;
}

// --- MOCK DATA FOR POP THE BALLOON ---
const mockCandidates = [
  { id: 1, name: 'Jessica', age: 24, bio: "Étudiante en Droit. J'aime la rumba et les voyages.", interests: ['Musique', 'Voyage'], img: 'https://picsum.photos/300/400?random=girl1', voice: '0:15' },
  { id: 2, name: 'Sarah', age: 22, bio: "Entrepreneur mode. Cherche quelqu'un d'ambitieux.", interests: ['Mode', 'Business'], img: 'https://picsum.photos/300/400?random=girl2', voice: '0:10' },
  { id: 3, name: 'Naomi', age: 26, bio: "Infirmière. Douce et attentionnée. Pas de prise de tête.", interests: ['Santé', 'Cuisine'], img: 'https://picsum.photos/300/400?random=girl3', voice: '0:22' },
  { id: 4, name: 'Divine', age: 23, bio: "Artiste peintre. J'aime les esprits créatifs.", interests: ['Art', 'Cinéma'], img: 'https://picsum.photos/300/400?random=girl4', voice: '0:18' },
];

const popReasons = ["Pas mon style", "Trop jeune/vieux", "Bio ennuyeuse", "Juste pour le fun"];

// --- MOCK DATA FOR DATING ---
const datingProfiles = [
    { 
        id: 101, 
        name: 'Elodie', 
        age: 23, 
        distance: '2 km',
        bio: "Passionnée de tech et de danse. Je cherche quelqu'un de sincère pour discuter et voir plus si affinités. 💃🏾💻", 
        interests: ['Tech', 'Danse', 'Rumba', 'Cuisine'], 
        img: 'https://picsum.photos/400/600?random=date1', 
        verified: true,
        affinity: 95
    },
    { 
        id: 102, 
        name: 'Marc', 
        age: 27, 
        distance: '5 km',
        bio: "Entrepreneur minier. J'aime le sport et les sortis le week-end. Pas de faux profils svp.", 
        interests: ['Business', 'Sport', 'Voyage'], 
        img: 'https://picsum.photos/400/600?random=date2', 
        verified: true,
        affinity: 80
    },
    { 
        id: 103, 
        name: 'Vanessa', 
        age: 21, 
        distance: '10 km',
        bio: "Étudiante. J'aime rire et profiter de la vie. Venez on joue à Pop the Balloon ! 🎈", 
        interests: ['Mode', 'Humour', 'Jeux'], 
        img: 'https://picsum.photos/400/600?random=date3', 
        verified: false,
        affinity: 65
    }
];

// --- MOCK DATA FOR TRUTH OR DARE ---
const todData = {
  truth: [
    "Quel est ton pire râteau ?",
    "As-tu déjà espionné le téléphone de ton partenaire ?",
    "Quelle est la chose la plus folle que tu aies faite par amour ?",
    "Si tu devais sortir avec une personne ici, qui serait-ce ?",
    "Quel est ton plus gros mensonge ?",
    "As-tu déjà ghosté quelqu'un après un premier RDV ?",
    "Quelle est ta recherche Google la plus gênante ?"
  ],
  dare: [
    "Fais 10 pompes maintenant.",
    "Envoie un emoji ❤️ à la 3ème personne de tes contacts.",
    "Laisse le groupe lire ton dernier SMS.",
    "Imite le cri d'un animal choisi par le groupe.",
    "Poste une photo dossier en story pendant 10 minutes.",
    "Danse sur une musique choisie par les autres sans musique.",
    "Appelle un ami et chante-lui 'Joyeux Anniversaire'."
  ]
};

// --- MOCK TRANSACTIONS ---
const mockTransactions = [
    { id: 1, title: 'Achat Market', date: 'Aujourd\'hui, 10:30', amount: '-45.000 FC', type: 'debit' },
    { id: 2, title: 'Recharge Canal+', date: 'Hier, 18:45', amount: '-15.00 $', type: 'debit' },
    { id: 3, title: 'Dépôt Mobile Money', date: '20 Juin', amount: '+100.00 $', type: 'credit' },
    { id: 4, title: 'Course Taxi', date: '18 Juin', amount: '-5.000 FC', type: 'debit' },
];

export const ProfileModule: React.FC<ProfileModuleProps> = ({ onLogout, darkMode, toggleDarkMode, onOpenHealth }) => {
  // State for settings toggles
  const [notifications, setNotifications] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);

  // Profile Navigation State
  const [profileSubView, setProfileSubView] = useState<'main' | 'personal' | 'security' | 'wallet' | 'language' | 'help'>('main');

  // Personal Info State
  const [userProfile, setUserProfile] = useState({
      name: 'Bienvenu Mutshail',
      email: 'bienvenu@lualabaconnect.cd',
      phone: '+243 975 876 854',
      bio: "Entrepreneur digital passionné par la tech et le développement du Lualaba 🚀",
      location: 'Kolwezi, Q. Mutoshi'
  });

  // Wallet State
  const [showBalance, setShowBalance] = useState(true);

  // Language State
  const [currentLang, setCurrentLang] = useState('Français');

  // Adult Space State
  const [showAdultSpace, setShowAdultSpace] = useState(false);
  const [isAdultVerified, setIsAdultVerified] = useState(false);
  const [adultPin, setAdultPin] = useState('');
  const [pinError, setPinError] = useState(false);
  
  // Navigation within Adult Space
  const [adultView, setAdultView] = useState<'dashboard' | 'pop-game' | 'tod-game' | 'dating-home'>('dashboard');

  // --- POP THE BALLOON STATE ---
  const [popGameState, setPopGameState] = useState<'lobby' | 'playing' | 'results'>('lobby');
  const [candidates, setCandidates] = useState(mockCandidates.map(c => ({ ...c, isPopped: false, popReason: '' })));
  const [poppingId, setPoppingId] = useState<number | null>(null);
  const [showReasonModal, setShowReasonModal] = useState<number | null>(null);

  // --- TRUTH OR DARE STATE ---
  const [todPhase, setTodPhase] = useState<'setup' | 'spin' | 'choice' | 'challenge' | 'scoreboard'>('setup');
  const [todPlayers, setTodPlayers] = useState<{id: number, name: string, score: number, avatar: string}[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState<{type: 'truth'|'dare', text: string} | null>(null);
  
  // New State for Online Interaction
  const [todResponse, setTodResponse] = useState('');
  const [isSubmittingTod, setIsSubmittingTod] = useState(false);

  // --- DATING STATE ---
  const [currentProfileIdx, setCurrentProfileIdx] = useState(0);
  const [matches, setMatches] = useState<any[]>([]);
  const [lastDirection, setLastDirection] = useState<string | null>(null);
  const [showMatchAnim, setShowMatchAnim] = useState(false);

  const handleUnlockAdult = () => {
    if (adultPin === '1818') {
        setIsAdultVerified(true);
        setPinError(false);
    } else {
        setPinError(true);
        setTimeout(() => setPinError(false), 500);
        if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  // --- POP THE BALLOON LOGIC ---
  const handlePopClick = (id: number) => setShowReasonModal(id);
  
  const confirmPop = (id: number, reason: string) => {
      // 1. Trigger Sound
      const audio = new Audio('https://www.soundjay.com/misc/sounds/balloon-pop-1.mp3');
      audio.volume = 0.6;
      audio.play().catch(e => console.log('Audio play failed', e));

      // 2. Trigger Haptics
      if (navigator.vibrate) navigator.vibrate([50, 50, 100]);

      // 3. Set Popping State (Visual Effect)
      setPoppingId(id);
      
      // 4. Update Data after animation finishes
      setTimeout(() => {
          setCandidates(prev => prev.map(c => c.id === id ? { ...c, isPopped: true, popReason: reason } : c));
          setPoppingId(null);
          setShowReasonModal(null);
      }, 700); // Matches animation duration
  };

  const resetPopGame = () => {
      setCandidates(mockCandidates.map(c => ({ ...c, isPopped: false, popReason: '' })));
      setPopGameState('lobby');
  };

  // --- TRUTH OR DARE LOGIC ---
  const addTodPlayer = () => {
    if (!newPlayerName.trim()) return;
    const newPlayer = {
      id: Date.now(),
      name: newPlayerName,
      score: 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newPlayerName}`
    };
    setTodPlayers([...todPlayers, newPlayer]);
    setNewPlayerName('');
  };

  const startTodGame = () => {
    if (todPlayers.length < 2) {
      // Auto add 'Vous' and 'Bot' if alone
      setTodPlayers([
        { id: 1, name: 'Vous', score: 0, avatar: 'https://picsum.photos/100/100?random=me' },
        { id: 2, name: 'Masta Bot', score: 0, avatar: 'https://picsum.photos/100/100?random=bot' }
      ]);
    }
    setTodPhase('spin');
  };

  const spinTheWheel = () => {
    // Random rotation between 720deg (2 spins) and 1800deg (5 spins)
    const spin = Math.floor(Math.random() * 1080) + 720; 
    setWheelRotation(prev => prev + spin);
    setTodResponse(''); // Reset previous response
    
    // Determine next player logic (random for fun, but sequential for fairness in code)
    const nextIndex = Math.floor(Math.random() * todPlayers.length);
    
    setTimeout(() => {
      setCurrentPlayerIndex(nextIndex);
      setTodPhase('choice');
    }, 3000); // 3s spin duration
  };

  const selectChallenge = (type: 'truth' | 'dare') => {
    const list = type === 'truth' ? todData.truth : todData.dare;
    const randomText = list[Math.floor(Math.random() * list.length)];
    setCurrentChallenge({ type, text: randomText });
    setTodPhase('challenge');
  };

  const submitChallengeResponse = () => {
    if(!todResponse.trim()) return;
    
    setIsSubmittingTod(true);
    
    // Simulate sending to network
    setTimeout(() => {
        completeChallenge(true);
        setIsSubmittingTod(false);
    }, 1500);
  };

  const completeChallenge = (success: boolean) => {
    if (success) {
      const points = currentChallenge?.type === 'truth' ? 50 : 100;
      setTodPlayers(prev => prev.map((p, i) => i === currentPlayerIndex ? { ...p, score: p.score + points } : p));
    }
    setTodPhase('scoreboard');
  };

  // --- DATING LOGIC ---
  const swipe = (direction: 'left' | 'right' | 'game') => {
      setLastDirection(direction);
      const currentProfile = datingProfiles[currentProfileIdx];
      
      if (direction === 'right') {
          // It's a match!
          setMatches([...matches, currentProfile]);
          setShowMatchAnim(true);
          setTimeout(() => setShowMatchAnim(false), 2000);
      } else if (direction === 'game') {
          // Invite to Game logic (Simulated)
          alert(`Invitation à jouer envoyée à ${currentProfile.name} !`);
      }

      setTimeout(() => {
          if (currentProfileIdx < datingProfiles.length - 1) {
              setCurrentProfileIdx(currentProfileIdx + 1);
          } else {
              // End of stack
              // Reset for demo purposes or show empty state
          }
          setLastDirection(null);
      }, 300);
  };

  // --- SUB-VIEWS RENDERERS ---

  const SubHeader = ({ title }: { title: string }) => (
      <div className="bg-white dark:bg-gray-800 px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4 sticky top-0 z-20">
          <button onClick={() => setProfileSubView('main')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
          </button>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
  );

  const renderPersonalInfo = () => (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-slide-left">
          <SubHeader title="Informations Personnelles" />
          <div className="p-6 space-y-6">
              <div className="flex justify-center mb-4 relative">
                  <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
                      <img src="https://picsum.photos/200/200?random=user" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute bottom-0 right-1/2 translate-x-12 bg-lualaba-600 text-white p-2 rounded-full shadow-md hover:bg-lualaba-700 transition-colors border-2 border-white dark:border-gray-900">
                      <Camera size={16} />
                  </button>
              </div>

              <div className="space-y-4">
                  <InputGroup label="Nom complet" value={userProfile.name} onChange={(v) => setUserProfile({...userProfile, name: v})} icon={User} />
                  <InputGroup label="Email" value={userProfile.email} onChange={(v) => setUserProfile({...userProfile, email: v})} icon={Send} />
                  <InputGroup label="Téléphone" value={userProfile.phone} onChange={(v) => setUserProfile({...userProfile, phone: v})} icon={Smartphone} />
                  <InputGroup label="Localisation" value={userProfile.location} onChange={(v) => setUserProfile({...userProfile, location: v})} icon={MapPin} />
                  
                  <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">Bio</label>
                      <div className="relative">
                          <Edit3 className="absolute left-4 top-3.5 text-gray-400" size={18} />
                          <textarea 
                              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 pl-12 text-sm outline-none focus:ring-2 focus:ring-lualaba-500 dark:text-white min-h-[100px]"
                              value={userProfile.bio}
                              onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                          />
                      </div>
                  </div>
              </div>

              <button className="w-full bg-lualaba-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-lualaba-600/30 hover:bg-lualaba-700 transition-all mt-4">
                  Enregistrer les modifications
              </button>
          </div>
      </div>
  );

  const renderSecurity = () => (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-slide-left">
          <SubHeader title="Sécurité & Confidentialité" />
          <div className="p-4 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                  <div className="flex justify-between items-center p-2">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400"><Lock size={20} /></div>
                          <div>
                              <h4 className="font-bold text-gray-900 dark:text-white text-sm">Mot de passe</h4>
                              <p className="text-xs text-gray-500">Dernière modif. il y a 3 mois</p>
                          </div>
                      </div>
                      <button className="text-lualaba-600 dark:text-lualaba-400 text-xs font-bold bg-lualaba-50 dark:bg-lualaba-900/20 px-3 py-1.5 rounded-lg">Modifier</button>
                  </div>
                  
                  <div className="h-[1px] bg-gray-100 dark:bg-gray-700"></div>

                  <div className="flex justify-between items-center p-2">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400"><ShieldCheck size={20} /></div>
                          <div>
                              <h4 className="font-bold text-gray-900 dark:text-white text-sm">Double authentification (2FA)</h4>
                              <p className="text-xs text-gray-500">Sécuriser la connexion</p>
                          </div>
                      </div>
                      <Switch checked={true} onChange={() => {}} />
                  </div>

                  <div className="h-[1px] bg-gray-100 dark:bg-gray-700"></div>

                  <div className="flex justify-between items-center p-2">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400"><Fingerprint size={20} /></div>
                          <div>
                              <h4 className="font-bold text-gray-900 dark:text-white text-sm">FaceID / TouchID</h4>
                              <p className="text-xs text-gray-500">Connexion rapide</p>
                          </div>
                      </div>
                      <Switch checked={false} onChange={() => {}} />
                  </div>
              </div>

              <h3 className="text-xs font-bold text-gray-400 uppercase ml-2">Appareils Connectés</h3>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                  <div className="flex items-center gap-3 p-2">
                      <Smartphone size={24} className="text-gray-400" />
                      <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">iPhone 13 Pro</h4>
                          <p className="text-xs text-green-500 font-medium">Actif maintenant • Kolwezi</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 opacity-60">
                      <Smartphone size={24} className="text-gray-400" />
                      <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">Samsung S21</h4>
                          <p className="text-xs text-gray-500">Hier à 14:30 • Lubumbashi</p>
                      </div>
                      <button className="text-red-500 text-xs font-bold">Déconnecter</button>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderWallet = () => (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-slide-left">
          <SubHeader title="Portefeuille & Factures" />
          <div className="p-4 space-y-6">
              {/* Balance Card */}
              <div className="bg-gradient-to-br from-gray-900 to-black dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-lualaba-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Solde disponible</p>
                      <div className="flex items-baseline gap-2 mb-6">
                          <h2 className="text-4xl font-black">{showBalance ? '24,500' : '••••••'} <span className="text-lg font-normal text-gray-400">FC</span></h2>
                          <button onClick={() => setShowBalance(!showBalance)} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                              {showBalance ? <ArrowLeft size={0} className="hidden" /> : null} {/* Dummy for consistency */}
                              {showBalance ? <Ghost size={16} className="opacity-50"/> : <Smile size={16} className="opacity-50"/>}
                          </button>
                      </div>
                      <div className="flex gap-4">
                          <button className="flex-1 bg-lualaba-600 py-3 rounded-xl font-bold text-sm shadow-lg shadow-lualaba-600/30 flex items-center justify-center gap-2 hover:bg-lualaba-700 transition-colors">
                              <DollarSign size={16} /> Recharger
                          </button>
                          <button className="flex-1 bg-white/10 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                              <FileText size={16} /> Relevé
                          </button>
                      </div>
                  </div>
              </div>

              {/* Transactions */}
              <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-2">Historique</h3>
                  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                      {mockTransactions.map((t) => (
                          <div key={t.id} className="p-4 border-b border-gray-50 dark:border-gray-700 last:border-0 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                              <div className="flex items-center gap-4">
                                  <div className={`p-3 rounded-xl ${t.type === 'credit' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                                      {t.type === 'credit' ? <ArrowLeft className="rotate-[-45deg]" size={20} /> : <ArrowLeft className="rotate-[135deg]" size={20} />}
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{t.title}</h4>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.date}</p>
                                  </div>
                              </div>
                              <span className={`font-bold text-sm ${t.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                  {t.amount}
                              </span>
                          </div>
                      ))}
                      <div className="p-4 text-center">
                          <button className="text-xs font-bold text-lualaba-600 dark:text-lualaba-400">Voir tout l'historique</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderLanguage = () => (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-slide-left">
          <SubHeader title="Langue" />
          <div className="p-4 space-y-2">
              {['Français', 'Swahili', 'English', 'Lingala'].map((lang) => (
                  <div 
                    key={lang} 
                    onClick={() => setCurrentLang(lang)}
                    className={`p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all border ${
                        currentLang === lang 
                        ? 'bg-lualaba-50 border-lualaba-200 dark:bg-lualaba-900/20 dark:border-lualaba-800' 
                        : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700 hover:border-lualaba-200'
                    }`}
                  >
                      <span className={`font-bold ${currentLang === lang ? 'text-lualaba-700 dark:text-lualaba-400' : 'text-gray-700 dark:text-gray-300'}`}>
                          {lang}
                      </span>
                      {currentLang === lang && <div className="bg-lualaba-600 text-white p-1 rounded-full"><Check size={14} /></div>}
                  </div>
              ))}
          </div>
      </div>
  );

  const renderHelp = () => (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-slide-left">
          <SubHeader title="Centre d'aide" />
          <div className="p-4 space-y-6">
              <div className="bg-lualaba-600 rounded-3xl p-6 text-white shadow-lg text-center">
                  <HelpCircle size={40} className="mx-auto mb-4 opacity-80" />
                  <h3 className="text-xl font-bold mb-2">Comment pouvons-nous vous aider ?</h3>
                  <p className="text-sm opacity-90 mb-6">Notre équipe est disponible 24/7 pour répondre à vos questions.</p>
                  <button className="bg-white text-lualaba-600 px-6 py-3 rounded-xl font-bold text-sm w-full hover:bg-gray-100 transition-colors">
                      Contacter le support
                  </button>
              </div>

              <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 px-2">Questions Fréquentes</h3>
                  <div className="space-y-3">
                      {[
                          'Comment recharger mon compte ?',
                          'Comment changer mon mot de passe ?',
                          'Je n\'arrive pas à commander un taxi',
                          'Mes notifications ne s\'affichent pas'
                      ].map((q, i) => (
                          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{q}</span>
                              <ChevronRight size={18} className="text-gray-400" />
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  );

  // --- RENDERERS ---

  const renderPopTheBalloonGame = () => {
      const activeCandidates = candidates.filter(c => !c.isPopped).length;

      if (popGameState === 'lobby') {
          return (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in">
                  <div className="relative mb-8">
                      <div className="absolute inset-0 bg-red-600 blur-[60px] opacity-20 rounded-full"></div>
                      <div className="w-32 h-40 bg-gradient-to-br from-red-500 to-pink-600 rounded-[50%] shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.3),10px_20px_30px_rgba(0,0,0,0.4)] flex items-center justify-center relative animate-float">
                          <span className="text-4xl">🎈</span>
                          <div className="absolute top-8 left-8 w-8 h-4 bg-white/30 rounded-[50%] rotate-[-45deg] blur-[2px]"></div>
                      </div>
                  </div>
                  <h2 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Pop the Balloon</h2>
                  <p className="text-gray-400 mb-8 max-w-xs text-sm">
                      Le jeu viral arrive sur Lualaba Connect ! <br/>
                      <span className="text-red-400 font-bold">Éclatez le ballon</span> si vous n'êtes pas intéressé. <br/>
                      <span className="text-green-400 font-bold">Gardez-le</span> pour matcher.
                  </p>
                  <button 
                    onClick={() => setPopGameState('playing')}
                    className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-white/10"
                  >
                      Lancer la partie
                  </button>
              </div>
          );
      }

      if (popGameState === 'results') {
          const matches = candidates.filter(c => !c.isPopped);
          return (
              <div className="flex flex-col h-full p-6 animate-slide-up">
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">Résultats du Round</h2>
                  <div className="flex-1 overflow-y-auto space-y-4">
                      {matches.length > 0 ? (
                          <>
                            <p className="text-center text-gray-400 text-sm mb-4">Vous avez gardé {matches.length} ballons ! 🔥</p>
                            {matches.map(c => (
                                <div key={c.id} className="bg-[#1a1a1a] p-4 rounded-2xl flex items-center gap-4 border border-green-500/30">
                                    <img src={c.img} className="w-16 h-16 rounded-full object-cover border-2 border-green-500" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white text-lg">{c.name}, {c.age}</h3>
                                        <div className="flex gap-2 mt-1">
                                            <button className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
                                                <MessageCircle size={14} /> Discuter
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                          </>
                      ) : (
                          <div className="text-center text-gray-500 mt-20">
                              <p className="text-6xl mb-4">💔</p>
                              <p>Vous êtes difficile ! Aucun ballon n'a survécu.</p>
                          </div>
                      )}
                  </div>
                  <button onClick={resetPopGame} className="w-full bg-gray-800 text-white py-4 rounded-xl font-bold mt-4">Rejouer</button>
              </div>
          );
      }

      // PLAYING STATE
      return (
          <div className="flex flex-col h-full bg-black relative">
              {/* Top Bar */}
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-bold text-red-500 uppercase tracking-widest">En direct</span>
                  </div>
                  <div className="text-white font-bold">{activeCandidates} Ballons restants</div>
                  <button onClick={() => setPopGameState('results')} className="bg-white text-black px-3 py-1 rounded-lg text-xs font-bold">
                      Terminer
                  </button>
              </div>

              {/* Game Area */}
              <div className="flex-1 overflow-x-auto overflow-y-hidden whitespace-nowrap p-6 flex items-center gap-6 snap-x snap-mandatory">
                  {candidates.map((candidate) => (
                      <div key={candidate.id} className="relative w-72 h-[65vh] snap-center shrink-0 rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 group transition-all duration-300">
                          
                          {/* EXPLOSION EFFECT (Conditional) */}
                          {poppingId === candidate.id && (
                              <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-pulse">
                                  {/* Shockwave */}
                                  <div className="w-64 h-64 bg-white rounded-full animate-ping opacity-50 absolute"></div>
                                  {/* Flash */}
                                  <div className="absolute inset-0 bg-white/40 animate-pulse duration-75"></div>
                                  {/* Comic Text */}
                                  <div className="absolute z-50 transform rotate-[-12deg] animate-bounce scale-150 transition-transform">
                                      <span className="text-7xl font-black text-red-600 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] tracking-tighter" style={{ textShadow: '4px 4px 0px white' }}>POW!</span>
                                  </div>
                                  <div className="absolute top-1/3 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                                  <div className="absolute bottom-1/3 right-10 w-4 h-4 bg-yellow-400 rounded-full animate-ping delay-100"></div>
                              </div>
                          )}

                          {/* Background Image */}
                          <img 
                            src={candidate.img} 
                            className={`w-full h-full object-cover transition-all duration-500 ${candidate.isPopped ? 'grayscale opacity-30 blur-sm' : ''} ${poppingId === candidate.id ? 'scale-125 opacity-50 blur-md grayscale transition-all duration-300' : ''}`} 
                          />
                          
                          {/* Info Overlay (Always visible at bottom) */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-5 pt-20 transition-opacity duration-300">
                              <h3 className="text-2xl font-black text-white">{candidate.name}, {candidate.age}</h3>
                              <p className="text-sm text-gray-300 line-clamp-2 mt-1 whitespace-normal">{candidate.bio}</p>
                              <div className="flex gap-2 mt-3 flex-wrap">
                                  {candidate.interests.map(i => (
                                      <span key={i} className="text-[10px] bg-white/10 text-white px-2 py-1 rounded-md border border-white/10">{i}</span>
                                  ))}
                              </div>
                              {candidate.isPopped && (
                                  <div className="mt-4 bg-red-900/50 border border-red-500/50 text-red-200 text-xs p-2 rounded-lg text-center font-bold animate-fade-in">
                                      🎈 Éclaté : {candidate.popReason}
                                  </div>
                              )}
                          </div>

                          {/* THE BALLOON (Overlay) */}
                          {!candidate.isPopped && (
                              <div 
                                onClick={() => handlePopClick(candidate.id)}
                                className={`absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 ${poppingId === candidate.id ? 'scale-[2.5] opacity-0' : 'hover:scale-105'}`}
                              >
                                  <div className="absolute bottom-0 w-0.5 h-[40%] bg-white/50 origin-bottom animate-sway"></div>
                                  <div className="w-48 h-56 bg-gradient-to-br from-red-500 via-red-600 to-red-800 rounded-[50%] shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.5),10px_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center relative animate-float">
                                      <div className="absolute top-10 left-10 w-12 h-6 bg-white/20 rounded-[50%] rotate-[-45deg] blur-[4px]"></div>
                                      <span className="text-white font-black text-xl drop-shadow-lg uppercase tracking-widest opacity-90 rotate-[-5deg]">Pop Me</span>
                                  </div>
                                  <div className="absolute bottom-32 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                                      Appuie pour éclater 💥
                                  </div>
                              </div>
                          )}
                      </div>
                  ))}
              </div>

              {/* REASON MODAL */}
              {showReasonModal && (
                  <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
                      <div className="bg-[#1a1a1a] w-full max-w-sm rounded-2xl p-5 border border-red-500/30 shadow-2xl animate-slide-up">
                          <h3 className="text-white font-bold text-lg mb-4 text-center">Pourquoi popper ce ballon ?</h3>
                          <div className="grid grid-cols-2 gap-3">
                              {popReasons.map(r => (
                                  <button 
                                    key={r}
                                    onClick={() => confirmPop(showReasonModal, r)}
                                    className="bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white py-3 rounded-xl text-xs font-bold transition-colors"
                                  >
                                      {r}
                                  </button>
                              ))}
                          </div>
                          <button onClick={() => setShowReasonModal(null)} className="mt-4 w-full py-3 text-gray-500 text-sm hover:text-white">Annuler</button>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const renderTruthOrDareGame = () => {
    return (
      <div className="flex flex-col h-full bg-[#111] relative text-white animate-fade-in overflow-hidden">
        
        {/* Background Ambient */}
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        {/* HEADER */}
        <div className="p-4 flex items-center justify-between border-b border-white/10 z-10">
           <h2 className="font-black text-xl text-amber-500 tracking-wider italic uppercase flex items-center gap-2">
             <Dna size={24} /> Action ou Vérité
           </h2>
           <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div className="text-xs font-bold text-gray-400">En direct</div>
           </div>
        </div>

        {/* --- PHASE: SETUP --- */}
        {todPhase === 'setup' && (
          <div className="flex-1 p-6 flex flex-col justify-center animate-slide-up max-w-md mx-auto w-full">
             <h3 className="text-2xl font-bold text-center mb-2">Qui joue ?</h3>
             <p className="text-gray-400 text-center text-sm mb-8">Ajoutez vos amis ou jouez avec l'IA.</p>
             
             <div className="bg-[#222] p-4 rounded-2xl mb-4 max-h-48 overflow-y-auto custom-scrollbar border border-white/5">
                {todPlayers.length === 0 && <p className="text-center text-gray-600 text-sm italic">Aucun joueur ajouté</p>}
                {todPlayers.map(p => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 font-bold">{p.name[0]}</div>
                        <span className="font-bold">{p.name}</span>
                     </div>
                     <button onClick={() => setTodPlayers(todPlayers.filter(pl => pl.id !== p.id))} className="text-red-500 hover:bg-white/10 p-1 rounded"><X size={16}/></button>
                  </div>
                ))}
             </div>

             <div className="flex gap-2 mb-8">
                <input 
                  type="text" 
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTodPlayer()}
                  placeholder="Nom du joueur..."
                  className="flex-1 bg-[#222] border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button onClick={addTodPlayer} className="bg-white/10 px-4 rounded-xl hover:bg-white/20"><Users size={20}/></button>
             </div>

             <button 
               onClick={startTodGame}
               className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-black text-lg py-4 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-transform"
             >
               COMMENCER LA PARTIE
             </button>
          </div>
        )}

        {/* --- PHASE: SPIN --- */}
        {todPhase === 'spin' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
             <h3 className="text-xl font-bold text-gray-400 mb-8 uppercase tracking-widest">C'est au tour de...</h3>
             
             {/* THE WHEEL */}
             <div className="relative w-64 h-64 mb-12">
                <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 z-20 text-white drop-shadow-lg">
                   <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-amber-500"></div>
                </div>
                <div 
                  className="w-full h-full rounded-full border-4 border-amber-500/30 overflow-hidden relative shadow-[0_0_50px_rgba(245,158,11,0.2)] transition-transform duration-[3000ms] cubic-bezier(0.1, 0, 0.2, 1)"
                  style={{ transform: `rotate(${wheelRotation}deg)` }}
                >
                   {/* Simplified Wheel Segments */}
                   <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#f59e0b_0deg_90deg,#1f2937_90deg_180deg,#f59e0b_180deg_270deg,#1f2937_270deg_360deg)] opacity-20"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                   </div>
                </div>
             </div>

             <button 
                onClick={spinTheWheel}
                className="bg-white text-black px-10 py-4 rounded-full font-black text-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform active:scale-95 animate-pulse"
             >
                TOURNER
             </button>
          </div>
        )}

        {/* --- PHASE: CHOICE --- */}
        {todPhase === 'choice' && (
           <div className="flex-1 flex flex-col items-center justify-center p-6 animate-slide-up">
              <div className="mb-8 text-center">
                 <img src={todPlayers[currentPlayerIndex].avatar} className="w-20 h-20 rounded-full border-4 border-amber-500 mx-auto mb-4" />
                 <h3 className="text-3xl font-black text-white">{todPlayers[currentPlayerIndex].name}</h3>
                 <p className="text-gray-400 mt-1">Fais ton choix !</p>
              </div>

              <div className="grid grid-cols-1 gap-6 w-full max-w-xs">
                 <button 
                   onClick={() => selectChallenge('truth')}
                   className="group relative h-32 bg-[#1a1a1a] rounded-2xl border-2 border-blue-500/50 flex flex-col items-center justify-center hover:bg-blue-500 hover:border-blue-500 transition-all duration-300"
                 >
                    <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">😇</span>
                    <span className="text-2xl font-black uppercase tracking-widest text-blue-400 group-hover:text-white">VÉRITÉ</span>
                    <span className="text-xs text-gray-500 group-hover:text-blue-100 mt-1">+50 Points</span>
                 </button>

                 <button 
                   onClick={() => selectChallenge('dare')}
                   className="group relative h-32 bg-[#1a1a1a] rounded-2xl border-2 border-red-500/50 flex flex-col items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all duration-300"
                 >
                    <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">😈</span>
                    <span className="text-2xl font-black uppercase tracking-widest text-red-400 group-hover:text-white">ACTION</span>
                    <span className="text-xs text-gray-500 group-hover:text-red-100 mt-1">+100 Points</span>
                 </button>
              </div>
           </div>
        )}

        {/* --- PHASE: CHALLENGE & RESPONSE --- */}
        {todPhase === 'challenge' && currentChallenge && (
           <div className="flex-1 flex flex-col items-center justify-center p-6 animate-scale-in text-center relative overflow-y-auto custom-scrollbar">
              <div className={`absolute inset-0 opacity-10 blur-[100px] pointer-events-none ${currentChallenge.type === 'truth' ? 'bg-blue-600' : 'bg-red-600'}`}></div>
              
              <div className="uppercase tracking-[0.2em] font-bold text-sm mb-6 text-gray-400">
                 {currentChallenge.type === 'truth' ? 'Vérité' : 'Action'} pour {todPlayers[currentPlayerIndex].name}
              </div>

              {/* Challenge Text */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl w-full shadow-2xl mb-6">
                 <p className="text-xl md:text-2xl font-bold leading-relaxed">
                    "{currentChallenge.text}"
                 </p>
              </div>

              {/* Interaction Area (Online Mode) */}
              <div className="w-full max-w-sm space-y-4 mb-6">
                  {currentChallenge.type === 'truth' ? (
                      <div className="relative">
                          <textarea 
                              value={todResponse}
                              onChange={(e) => setTodResponse(e.target.value)}
                              placeholder="Écris ta réponse ici pour le groupe..."
                              className="w-full bg-blue-900/20 border border-blue-500/30 rounded-2xl p-4 text-white placeholder-blue-300/50 outline-none focus:border-blue-500 focus:bg-blue-900/40 transition-all h-32 resize-none"
                          />
                          <div className="absolute bottom-3 right-3 text-blue-400">
                              <MessageCircle size={18} />
                          </div>
                      </div>
                  ) : (
                      <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-4 text-left">
                          <p className="text-xs font-bold text-red-300 uppercase mb-3">Preuve requise</p>
                          <div className="flex gap-2 mb-3">
                              <button className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors">
                                  <Camera size={20} className="text-white" />
                                  <span className="text-[10px] text-gray-300">Caméra</span>
                              </button>
                              <button className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors">
                                  <ImageIcon size={20} className="text-white" />
                                  <span className="text-[10px] text-gray-300">Galerie</span>
                              </button>
                              <button className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors">
                                  <Video size={20} className="text-white" />
                                  <span className="text-[10px] text-gray-300">Vidéo</span>
                              </button>
                          </div>
                          <input 
                              type="text" 
                              value={todResponse}
                              onChange={(e) => setTodResponse(e.target.value)}
                              placeholder="Ou décris ce que tu as fait..."
                              className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500"
                          />
                      </div>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 w-full max-w-sm">
                 <button 
                   onClick={submitChallengeResponse}
                   disabled={isSubmittingTod || !todResponse.trim()}
                   className={`w-full py-4 rounded-xl font-black text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
                       isSubmittingTod ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02] active:scale-95'
                   } ${currentChallenge.type === 'truth' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-red-600 hover:bg-red-500'}`}
                 >
                    {isSubmittingTod ? (
                        <>Envoi en cours...</>
                    ) : (
                        <><Send size={18} /> ENVOYER AU GROUPE</>
                    )}
                 </button>
                 
                 <button 
                   onClick={() => completeChallenge(false)}
                   className="py-3 text-xs text-gray-500 font-bold hover:text-white transition-colors"
                 >
                    JE REFUSE (ABANDON -10 PTS)
                 </button>
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-500">
                  <Globe size={12} />
                  <span>Visible par tous les joueurs connectés</span>
              </div>
           </div>
        )}

        {/* --- PHASE: SCOREBOARD --- */}
        {todPhase === 'scoreboard' && (
           <div className="flex-1 flex flex-col p-6 animate-slide-up">
              <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
                 <Trophy className="text-yellow-400" /> Classement
              </h3>

              <div className="flex-1 space-y-3 overflow-y-auto">
                 {[...todPlayers].sort((a,b) => b.score - a.score).map((p, index) => (
                    <div key={p.id} className={`flex items-center justify-between p-4 rounded-xl border ${index === 0 ? 'bg-amber-500/20 border-amber-500' : 'bg-[#222] border-white/5'}`}>
                       <div className="flex items-center gap-4">
                          <span className={`font-black text-lg w-6 ${index === 0 ? 'text-amber-500' : 'text-gray-500'}`}>#{index + 1}</span>
                          <span className="font-bold text-lg">{p.name}</span>
                       </div>
                       <span className="font-mono font-bold text-amber-400">{p.score} pts</span>
                    </div>
                 ))}
              </div>

              <button 
                 onClick={() => setTodPhase('spin')}
                 className="w-full bg-white text-black py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 mt-4 hover:bg-gray-200 transition-colors"
              >
                 <RefreshCw size={20} /> TOUR SUIVANT
              </button>
           </div>
        )}

      </div>
    );
  };

  const renderDatingModule = () => {
      // Logic for Dating
      const currentProfile = datingProfiles[currentProfileIdx];
      const finished = currentProfileIdx >= datingProfiles.length;

      return (
          <div className="flex flex-col h-full bg-[#111] relative text-white animate-fade-in overflow-hidden">
              {/* Header */}
              <div className="p-4 flex items-center justify-between z-20">
                  <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                          <Users size={20} className="text-white" />
                      </div>
                      <div>
                          <h2 className="font-bold text-lg leading-none">Découverte</h2>
                          <p className="text-[10px] text-gray-400">Rencontres affinitaires</p>
                      </div>
                  </div>
                  <div className="flex gap-2">
                      <button className="p-2 bg-[#222] rounded-full hover:bg-[#333]"><Trophy size={18} className="text-yellow-500" /></button>
                      <button className="p-2 bg-[#222] rounded-full hover:bg-[#333]"><MessageCircle size={18} /></button>
                  </div>
              </div>

              {/* Match Animation Overlay */}
              {showMatchAnim && (
                  <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center animate-scale-in">
                      <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 italic mb-4 animate-pulse">IT'S A MATCH!</h2>
                      <div className="flex items-center gap-4 mb-8">
                          <img src="https://picsum.photos/200/200?random=user" className="w-24 h-24 rounded-full border-4 border-white" />
                          <div className="w-12 h-1 bg-white rounded-full"></div>
                          <img src={matches[matches.length-1].img} className="w-24 h-24 rounded-full border-4 border-purple-500" />
                      </div>
                      <button onClick={() => setShowMatchAnim(false)} className="bg-white text-black px-8 py-3 rounded-full font-bold">Continuer</button>
                  </div>
              )}

              {/* Content Area */}
              <div className="flex-1 relative flex flex-col items-center justify-center p-4">
                  {finished ? (
                      <div className="text-center">
                          <div className="w-24 h-24 bg-[#222] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                              <Search size={40} className="text-gray-500" />
                          </div>
                          <h3 className="text-xl font-bold mb-2">C'est tout pour le moment !</h3>
                          <p className="text-gray-400 text-sm">Revenez plus tard pour de nouveaux profils.</p>
                          <button onClick={() => setCurrentProfileIdx(0)} className="mt-6 text-purple-400 text-sm font-bold">Revoir les profils</button>
                      </div>
                  ) : (
                      <div className="w-full max-w-sm h-full max-h-[600px] relative">
                          {/* Main Card */}
                          <div className={`w-full h-full rounded-3xl overflow-hidden relative shadow-2xl border border-white/10 transition-transform duration-300 ${lastDirection === 'left' ? '-translate-x-full opacity-0 rotate-[-10deg]' : lastDirection === 'right' ? 'translate-x-full opacity-0 rotate-[10deg]' : ''}`}>
                              {/* Image */}
                              <img src={currentProfile.img} className="w-full h-full object-cover" />
                              
                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                              {/* Affinity Badge */}
                              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 border border-purple-500/50">
                                  <Sparkles size={14} className="text-purple-400" />
                                  <span className="text-xs font-bold text-white">{currentProfile.affinity}% Compatible</span>
                              </div>

                              {/* Profile Info */}
                              <div className="absolute bottom-0 left-0 right-0 p-6 pb-24">
                                  <div className="flex items-center gap-2 mb-1">
                                      <h2 className="text-3xl font-black">{currentProfile.name}, {currentProfile.age}</h2>
                                      {currentProfile.verified && <Check className="bg-blue-500 p-0.5 rounded-full w-5 h-5 text-white" strokeWidth={3} />}
                                  </div>
                                  
                                  <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                                      <MapPin size={14} /> {currentProfile.distance} • <Ghost size={14} /> Actif
                                  </div>

                                  {/* Interests Tags */}
                                  <div className="flex flex-wrap gap-2 mb-3">
                                      {currentProfile.interests.map(tag => (
                                          <span key={tag} className="text-[10px] font-bold bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md text-white border border-white/10">
                                              {tag}
                                          </span>
                                      ))}
                                  </div>

                                  <p className="text-sm text-gray-200 line-clamp-2 leading-relaxed opacity-90">
                                      {currentProfile.bio}
                                  </p>
                              </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 items-center px-6">
                              <button 
                                  onClick={() => swipe('left')}
                                  className="w-14 h-14 bg-[#222] rounded-full flex items-center justify-center text-red-500 border border-white/10 hover:scale-110 transition-transform shadow-lg"
                              >
                                  <X size={28} strokeWidth={3} />
                              </button>
                              
                              <button 
                                  onClick={() => swipe('game')}
                                  className="w-12 h-12 bg-yellow-500 text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-yellow-500/20"
                                  title="Inviter à jouer"
                              >
                                  <Gamepad2 size={24} />
                              </button>

                              <button 
                                  onClick={() => swipe('right')}
                                  className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-pink-500/30"
                              >
                                  <Heart size={28} fill="currentColor" />
                              </button>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      );
  };

  const renderAdultModal = () => {
    if (!showAdultSpace) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col animate-fade-in text-white font-sans overflow-hidden">
            {/* Close Button */}
            <button 
                onClick={() => { setShowAdultSpace(false); setAdultPin(''); setIsAdultVerified(false); setAdultView('dashboard'); resetPopGame(); }} 
                className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-20"
            >
                <X size={24} />
            </button>

            {!isAdultVerified ? (
                // --- LOCK SCREEN ---
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-slide-up">
                    <div className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center mb-6 border border-red-500/50 shadow-[0_0_30px_rgba(220,38,38,0.3)] animate-pulse">
                        <Lock size={40} className="text-red-500" />
                    </div>
                    <h2 className="text-2xl font-black mb-2 uppercase tracking-wider text-red-500">Zone +18</h2>
                    <p className="text-gray-400 text-sm mb-8 max-w-xs leading-relaxed">
                        Contenu réservé aux adultes. Vérification d'identité et code d'accès requis.
                    </p>
                    
                    <div className="relative mb-6">
                        <input 
                            type="password" 
                            value={adultPin} 
                            onChange={e => setAdultPin(e.target.value)} 
                            placeholder="Code PIN" 
                            className={`bg-white/5 border ${pinError ? 'border-red-500 text-red-500' : 'border-white/20 text-white'} rounded-2xl px-6 py-4 text-center text-3xl tracking-[0.5em] outline-none w-64 placeholder:text-gray-700 placeholder:text-sm placeholder:tracking-normal transition-all focus:border-red-500/50`} 
                            maxLength={4}
                            autoFocus
                        />
                        {pinError && <p className="absolute -bottom-6 left-0 right-0 text-red-500 text-xs font-bold animate-shake">Code incorrect</p>}
                    </div>
                    
                    <button 
                        onClick={handleUnlockAdult} 
                        className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-3.5 rounded-2xl font-bold w-64 mb-6 shadow-lg shadow-red-900/40 hover:scale-105 transition-transform active:scale-95"
                    >
                        Entrer
                    </button>
                    
                    <div className="flex items-center gap-2 text-gray-500 text-xs mt-4 cursor-pointer hover:text-white transition-colors">
                        <Fingerprint size={16} /> Utiliser l'empreinte digitale
                    </div>
                    <p className="text-[10px] text-gray-600 mt-2">Code par défaut : 1818</p>
                </div>
            ) : (
                // --- CONTENT SWITCHER ---
                <div className="flex-1 flex flex-col h-full">
                    {adultView === 'pop-game' ? (
                        <div className="flex-1 relative">
                            {renderPopTheBalloonGame()}
                            {popGameState === 'lobby' && (
                                <button onClick={() => setAdultView('dashboard')} className="absolute top-4 left-4 p-2 bg-white/10 rounded-full hover:bg-white/20 z-20">
                                    <ChevronRight className="rotate-180" size={24} />
                                </button>
                            )}
                        </div>
                    ) : adultView === 'tod-game' ? (
                        <div className="flex-1 relative">
                            {renderTruthOrDareGame()}
                            {todPhase === 'setup' && (
                                <button onClick={() => setAdultView('dashboard')} className="absolute top-4 left-4 p-2 bg-white/10 rounded-full hover:bg-white/20 z-20">
                                    <ChevronRight className="rotate-180" size={24} />
                                </button>
                            )}
                        </div>
                    ) : adultView === 'dating-home' ? (
                        <div className="flex-1 relative">
                            {renderDatingModule()}
                            <button onClick={() => setAdultView('dashboard')} className="absolute top-4 left-4 p-2 bg-white/10 rounded-full hover:bg-white/20 z-30">
                                <ChevronRight className="rotate-180" size={24} />
                            </button>
                        </div>
                    ) : (
                        // --- ADULT DASHBOARD ---
                        <div className="fixed inset-0 z-50 bg-[#0f1014] flex flex-col animate-fade-in overflow-y-auto custom-scrollbar">
                            {/* Header */}
                            <div className="px-6 py-6 flex items-center justify-between sticky top-0 bg-[#0f1014]/90 backdrop-blur-md z-20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                                        <Flame size={24} fill="currentColor" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-white leading-none">Espace Adulte</h2>
                                        <p className="text-[10px] font-bold text-rose-500 tracking-widest mt-1">CONNECTÉ • SÉCURISÉ</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowAdultSpace(false)}
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 px-4 pb-10 space-y-4">
                                {/* Rencontres */}
                                <div onClick={() => setAdultView('dating-home')} className="bg-[#2a1b4e] rounded-3xl p-5 relative overflow-hidden border border-white/5 cursor-pointer active:scale-[0.98] transition-transform">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                    <div className="flex gap-4 items-center relative z-10">
                                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-purple-300">
                                            <Users size={32} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-white text-lg">Rencontres</h3>
                                                <span className="bg-purple-500/20 text-purple-300 text-[9px] font-black px-2 py-0.5 rounded border border-purple-500/30 uppercase tracking-wide">Matching IA</span>
                                            </div>
                                            <p className="text-purple-200/60 text-xs leading-relaxed">Trouvez l'amour par affinités. Vérification d'identité requise.</p>
                                        </div>
                                        <ChevronRight className="text-purple-500/50" />
                                    </div>
                                </div>

                                {/* Pop the Balloon */}
                                <div onClick={() => setAdultView('pop-game')} className="bg-[#2b1510] rounded-3xl p-5 relative overflow-hidden border border-white/5 cursor-pointer active:scale-[0.98] transition-transform">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                    <div className="flex gap-4 items-center relative z-10">
                                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                            <span className="text-2xl">🎈</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-white text-lg mb-1">Pop the Balloon</h3>
                                            <p className="text-orange-200/60 text-xs leading-relaxed">Jeu de séduction viral. Éclatez pour éliminer, discutez pour matcher.</p>
                                        </div>
                                        <ChevronRight className="text-orange-500/50" />
                                    </div>
                                </div>

                                {/* Action ou Vérité */}
                                <div onClick={() => setAdultView('tod-game')} className="bg-[#2b220a] rounded-3xl p-5 relative overflow-hidden border border-white/5 cursor-pointer active:scale-[0.98] transition-transform">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                    <div className="flex gap-4 items-center relative z-10">
                                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                            <Dna size={28} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-white text-lg mb-1">Action ou Vérité</h3>
                                            <p className="text-yellow-200/60 text-xs leading-relaxed">La roue tourne ! Défis coquins, points et badges à gagner.</p>
                                        </div>
                                        <ChevronRight className="text-yellow-500/50" />
                                    </div>
                                </div>

                                {/* Jeux & Challenges */}
                                <div className="bg-[#0f1e33] rounded-3xl p-5 relative overflow-hidden border border-white/5 cursor-pointer active:scale-[0.98] transition-transform">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                    <div className="flex gap-4 items-center relative z-10">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                            <Gamepad2 size={32} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-white text-lg mb-1">Jeux & Challenges</h3>
                                            <p className="text-blue-200/60 text-xs leading-relaxed">Mini-jeux interactifs et défis hebdomadaires pour l'engagement.</p>
                                        </div>
                                        <ChevronRight className="text-blue-500/50" />
                                    </div>
                                </div>

                                {/* Zone Premium */}
                                <div className="bg-[#2b0e1a] rounded-3xl p-5 relative overflow-hidden border border-white/5 cursor-pointer active:scale-[0.98] transition-transform">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                    <div className="flex gap-4 items-center relative z-10">
                                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                            <PlayCircle size={32} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-white text-lg mb-1">Zone Premium</h3>
                                            <p className="text-pink-200/60 text-xs leading-relaxed">Vidéos exclusives, tutoriels et articles réservés aux adultes.</p>
                                        </div>
                                        <ChevronRight className="text-pink-500/50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
  };

  // --- MAIN RENDER ---

  if (profileSubView !== 'main') {
      if (profileSubView === 'personal') return renderPersonalInfo();
      if (profileSubView === 'security') return renderSecurity();
      if (profileSubView === 'wallet') return renderWallet();
      if (profileSubView === 'language') return renderLanguage();
      if (profileSubView === 'help') return renderHelp();
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 pb-28 overflow-y-auto custom-scrollbar transition-colors duration-300">
      {/* Enhanced Header Profile Card */}
      <div className="bg-white dark:bg-gray-800 pb-8 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10 shadow-sm transition-colors duration-300 relative overflow-hidden">
        {/* Decorative Background Gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-lualaba-600 to-lualaba-400 opacity-10 dark:opacity-20"></div>
        
        <div className="flex flex-col items-center px-6 pt-10 relative z-10">
            <div className="relative group cursor-pointer">
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 mb-4 overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl ring-4 ring-lualaba-50 dark:ring-lualaba-900/20">
                    <img src="https://picsum.photos/200/200?random=user" alt="User" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                </div>
                <button className="absolute bottom-2 right-1 bg-lualaba-600 text-white p-2.5 rounded-full shadow-lg hover:bg-lualaba-700 transition-colors border-4 border-white dark:border-gray-800 active:scale-90">
                    <Camera size={18} />
                </button>
            </div>
            
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mt-2">{userProfile.name}</h2>
            
            <div className="flex items-center gap-2 mt-2">
                 <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 text-xs font-bold bg-white/50 dark:bg-gray-700/50 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-600 backdrop-blur-sm">
                    <MapPin size={14} className="text-lualaba-600" />
                    <span>{userProfile.location}</span>
                 </div>
                 <button className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                    <QrCode size={16} />
                 </button>
            </div>
            
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-4 text-center max-w-xs line-clamp-2">
              "{userProfile.bio}"
            </p>
        </div>

        {/* Stats Row - Card Style */}
        <div className="flex justify-center gap-4 mt-8 px-6">
            <StatCard label="Commandes" value="24" icon="🛍️" />
            <StatCard label="Contacts" value="1.2k" icon="👥" />
            <StatCard label="Réputation" value="4.9" icon="⭐" isRating />
        </div>
      </div>

      {/* ACCESS TO HEALTH MODULE */}
      <div className="px-4 mt-6">
         <button 
           onClick={onOpenHealth}
           className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 p-1 rounded-3xl shadow-lg shadow-teal-500/20 group hover:scale-[1.02] transition-transform"
         >
           <div className="bg-white dark:bg-gray-900 rounded-[22px] p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-2xl text-teal-600 dark:text-teal-400">
                    <HeartPulse size={28} className="animate-pulse" />
                 </div>
                 <div className="text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Ma Santé</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Dossier médical, RDV, IA Santé</p>
                 </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full text-gray-400 group-hover:text-teal-500 transition-colors">
                 <ChevronRight size={20} />
              </div>
           </div>
         </button>
      </div>

      {/* ACCESS TO ADULT SPACE (NEW) */}
      <div className="px-4 mt-4">
         <button 
           onClick={() => setShowAdultSpace(true)}
           className="w-full bg-gradient-to-r from-red-600 to-pink-600 p-1 rounded-3xl shadow-lg shadow-red-600/20 group hover:scale-[1.02] transition-transform"
         >
           <div className="bg-white dark:bg-gray-900 rounded-[22px] p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-2xl text-red-600 dark:text-red-400">
                    <Flame size={28} fill="currentColor" />
                 </div>
                 <div className="text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Espace Adultes (+18)</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Rencontres, Jeux & Fun</p>
                 </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full text-gray-400 group-hover:text-red-500 transition-colors">
                 <Lock size={20} />
              </div>
           </div>
         </button>
      </div>

      {/* Subscription Card */}
      <div className="px-4 mt-6">
        <div className="bg-gradient-to-br from-gray-900 to-black dark:from-black dark:to-gray-900 rounded-3xl p-6 text-white shadow-xl shadow-gray-200 dark:shadow-none relative overflow-hidden border border-gray-800 group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
            {/* Animated Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-lualaba-500/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-lualaba-500/30 transition-colors duration-500"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                         <div className="p-1.5 bg-green-500/20 rounded-lg"><Wifi size={18} className="text-green-400" /></div>
                         <h3 className="font-bold text-lg tracking-wide">Lualaba Premium</h3>
                    </div>
                    <p className="text-gray-400 text-xs font-medium">Renouvellement: <span className="text-gray-300">30 Juin 2024</span></p>
                </div>
                <div className="flex flex-col items-end gap-1">
                   <span className="bg-gradient-to-r from-lualaba-600 to-lualaba-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg shadow-lualaba-500/20">Actif</span>
                   <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Plan Pro</span>
                </div>
            </div>
            
            <div className="space-y-4 relative z-10">
                <div className="flex justify-between text-xs font-bold text-gray-300">
                    <span className="flex items-center gap-1.5"><BarChart3 size={14} className="text-lualaba-500"/> Data LAN Utilisée</span>
                    <span>45GB <span className="text-gray-500 font-normal">/ Illimité</span></span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
                    <div className="h-full bg-gradient-to-r from-lualaba-600 via-lualaba-500 to-malachite-500 w-[35%] rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)] relative overflow-hidden">
                       <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                   <p className="text-[10px] text-gray-400">Accès prioritaire aux services miniers activé.</p>
                   <ChevronRight size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                </div>
            </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="px-4 mt-8 space-y-8">
        
        {/* Account Settings */}
        <section>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-4">Compte</h3>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <SettingItem onClick={() => setProfileSubView('personal')} icon={<User size={20} />} label="Informations personnelles" />
                <SettingItem onClick={() => setProfileSubView('security')} icon={<Shield size={20} />} label="Sécurité & Confidentialité" />
                <SettingItem onClick={() => setProfileSubView('wallet')} icon={<CreditCard size={20} />} label="Portefeuille & Factures" badge={showBalance ? "24,500 FC" : "••••"} badgeColor="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" />
            </div>
        </section>

        {/* App Settings */}
        <section>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-4">Préférences</h3>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <SettingItem 
                    icon={<Bell size={20} />} 
                    label="Notifications" 
                    rightElement={<Switch checked={notifications} onChange={() => setNotifications(!notifications)} />}
                />
                 <SettingItem 
                    icon={<Smartphone size={20} />} 
                    label="Économiseur de données" 
                    subtitle="Compresse les médias sur le LAN"
                    rightElement={<Switch checked={dataSaver} onChange={() => setDataSaver(!dataSaver)} />}
                />
                 <SettingItem 
                    icon={darkMode ? <Sun size={20} /> : <Moon size={20} />} 
                    label={darkMode ? "Mode Clair" : "Mode Sombre"}
                    rightElement={<Switch checked={darkMode} onChange={toggleDarkMode} />}
                />
                 <SettingItem 
                    onClick={() => setProfileSubView('language')}
                    icon={<Globe size={20} />} 
                    label="Langue" 
                    rightElement={<span className="text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg">{currentLang}</span>}
                />
            </div>
        </section>

         {/* Support */}
        <section>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-4">Support</h3>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <SettingItem onClick={() => setProfileSubView('help')} icon={<HelpCircle size={20} />} label="Centre d'aide" />
                <SettingItem icon={<Download size={20} />} label="Mises à jour" badge="v1.0.4" badgeColor="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" />
            </div>
        </section>

        <button 
            onClick={onLogout}
            className="w-full bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mt-4 hover:bg-red-100 dark:hover:bg-red-900/20 active:scale-[0.98] transition-all border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
        >
            <LogOut size={20} />
            Se déconnecter
        </button>
      </div>

       <div className="h-10"></div>
       
       {renderAdultModal()}
    </div>
  );
};

// Helper Components
const StatCard = ({ label, value, icon, isRating }: any) => (
    <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-2xl flex-1 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group">
        <span className="text-xl mb-1 group-hover:scale-110 transition-transform">{icon}</span>
        <span className="block text-lg font-black text-gray-800 dark:text-white flex items-center gap-1">
            {value} 
            {isRating && <span className="text-yellow-400 text-xs">★</span>}
        </span>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{label}</span>
    </div>
);

const SettingItem = ({ icon, label, subtitle, rightElement, badge, badgeColor = "bg-lualaba-100 dark:bg-lualaba-900/30 text-lualaba-600 dark:text-lualaba-400", onClick }: any) => (
    <div onClick={onClick} className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors group">
        <div className="flex items-center gap-4">
            <div className="text-gray-400 group-hover:text-lualaba-600 dark:group-hover:text-lualaba-400 transition-colors bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-xl group-hover:bg-lualaba-50 dark:group-hover:bg-gray-700">
                {icon}
            </div>
            <div>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm block group-hover:text-lualaba-700 dark:group-hover:text-lualaba-300 transition-colors">{label}</span>
                {subtitle && <span className="text-[11px] text-gray-400 font-medium">{subtitle}</span>}
            </div>
        </div>
        <div className="flex items-center gap-3">
            {badge && <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${badgeColor}`}>{badge}</span>}
            {rightElement || <ChevronRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:translate-x-1 transition-transform" />}
        </div>
    </div>
);

const Switch = ({ checked, onChange }: any) => (
    <button 
        onClick={(e) => { e.stopPropagation(); onChange(); }}
        className={`w-12 h-7 rounded-full relative transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lualaba-500 ${checked ? 'bg-lualaba-600' : 'bg-gray-200 dark:bg-gray-600'}`}
    >
        <span className="sr-only">Use setting</span>
        <span
            className={`pointer-events-none inline-block w-5 h-5 rounded-full bg-white shadow-md transform ring-0 transition ease-in-out duration-300 absolute top-1 ${checked ? 'translate-x-[22px]' : 'translate-x-1'}`}
        />
    </button>
);

const InputGroup = ({ label, value, onChange, icon: Icon }: any) => (
    <div>
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1 mb-1 block">{label}</label>
        <div className="relative">
            <Icon className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input 
                type="text" 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-lualaba-500 dark:text-white transition-all"
            />
        </div>
    </div>
);