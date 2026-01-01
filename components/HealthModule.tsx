import React, { useState, useRef, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, Tooltip, YAxis } from 'recharts';
import { 
  Activity, Pill, Stethoscope, Camera, Send, X, AlertCircle, 
  Calendar, MapPin, FileText, MessageSquare, ChevronRight, 
  Thermometer, User, Clock, Star, ShieldCheck, HeartPulse, ArrowLeft, CheckCircle,
  Phone, Plus, Droplets, Zap, Shield, Ambulance, Cross, Search, FileDigit, QrCode, Lock, ChevronDown, Download, Wifi,
  LayoutGrid, Hospital, FileBarChart, MessageCircle as ChatIcon, Video, Lightbulb, Map as MapIcon,
  Navigation, Info, Share2, Ruler, Weight, Droplet, AlertTriangle, Syringe, Heart, FileCheck,
  Apple, Brain, Moon, Dumbbell, Type
} from 'lucide-react';
import { checkSymptoms, analyzeMedication } from '../services/geminiService';

// --- MOCK DATA & TYPES ---

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  available: boolean;
  image: string;
  isOnline?: boolean;
}

interface Hospital {
    id: number;
    name: string;
    type: 'Hôpital' | 'Clinique' | 'Centre de Santé';
    category: 'Public' | 'Privé';
    address: string;
    image: string;
    rating: number;
    reviews: number;
    isOpen24: boolean;
    phone: string;
    services: string[];
    description: string;
    coords: { lat: number, lng: number };
}

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed';
  location: string;
}

interface HealthDoc {
  id: number;
  title: string;
  date: string;
  type: 'lab' | 'prescription' | 'cert';
  doctor: string;
}

const mockHospitals: Hospital[] = [
    {
        id: 1,
        name: 'Hôpital Général Mwangeji',
        type: 'Hôpital',
        category: 'Public',
        address: 'Av. Kasa-Vubu, Manika, Kolwezi',
        image: 'https://picsum.photos/400/300?random=hosp1',
        rating: 4.2,
        reviews: 85,
        isOpen24: true,
        phone: '+243999999999',
        services: ['Urgences', 'Pédiatrie', 'Maternité', 'Chirurgie', 'Interne'],
        description: "L'Hôpital Général de Référence de Mwangeji est le principal établissement public de Kolwezi. Il dispose d'un service d'urgence ouvert 24h/24 et d'une équipe de spécialistes.",
        coords: { lat: -10.72, lng: 25.47 }
    },
    {
        id: 2,
        name: 'Hôpital du Personnel (HPK)',
        type: 'Hôpital',
        category: 'Privé',
        address: 'Q. Biashara, Kolwezi',
        image: 'https://picsum.photos/400/300?random=hosp2',
        rating: 4.8,
        reviews: 120,
        isOpen24: true,
        phone: '+243888888888',
        services: ['Cardiologie', 'Radiologie', 'Laboratoire', 'Dentisterie', 'Urgences'],
        description: "Établissement moderne offrant des soins de haute qualité. Équipements de pointe pour l'imagerie médicale et la chirurgie spécialisée.",
        coords: { lat: -10.71, lng: 25.46 }
    },
    {
        id: 3,
        name: 'Clinique Manika',
        type: 'Clinique',
        category: 'Privé',
        address: 'Av. Laurent Désiré Kabila',
        image: 'https://picsum.photos/400/300?random=hosp3',
        rating: 4.5,
        reviews: 45,
        isOpen24: true,
        phone: '+243777777777',
        services: ['Maternité', 'Pédiatrie', 'Echographie', 'Consultation'],
        description: "Clinique privée réputée pour son service de maternité et ses soins pédiatriques personnalisés.",
        coords: { lat: -10.73, lng: 25.48 }
    },
    {
        id: 4,
        name: 'Centre de Santé Wewa',
        type: 'Centre de Santé',
        category: 'Privé',
        address: 'Route Likasi, Joli Site',
        image: 'https://picsum.photos/400/300?random=hosp4',
        rating: 4.0,
        reviews: 22,
        isOpen24: false,
        phone: '+243666666666',
        services: ['Soins Infirmiers', 'Laboratoire', 'Pharmacie'],
        description: "Centre de santé de proximité pour les soins primaires et le suivi médical courant.",
        coords: { lat: -10.70, lng: 25.45 }
    }
];

const mockDoctors: Doctor[] = [
  { id: 'd1', name: 'Dr. Kabange N.', specialty: 'Généraliste', location: 'Clinique Manika', rating: 4.8, available: true, image: 'https://picsum.photos/150/150?random=d1', isOnline: true },
  { id: 'd2', name: 'Dr. Sarah M.', specialty: 'Pédiatre', location: 'Hôpital Mwangeji', rating: 4.9, available: true, image: 'https://picsum.photos/150/150?random=d2', isOnline: false },
  { id: 'd3', name: 'Dr. Ilunga P.', specialty: 'Cardiologue', location: 'HPK', rating: 4.7, available: false, image: 'https://picsum.photos/150/150?random=d3', isOnline: true },
  { id: 'd4', name: 'Dr. Mwayuma', specialty: 'Dentiste', location: 'Centre Ville', rating: 4.6, available: true, image: 'https://picsum.photos/150/150?random=d4', isOnline: false },
  { id: 'd5', name: 'Dr. Patrick K.', specialty: 'Ophtalmologue', location: 'Lunettes pour Tous', rating: 4.9, available: true, image: 'https://picsum.photos/150/150?random=d5', isOnline: true },
];

const initialAppointments: Appointment[] = [
  // Uncomment to see appointment state
  // { id: '1', doctorName: 'Dr. Kabange N.', specialty: 'Généraliste', date: 'Demain', time: '14:30', status: 'upcoming', location: 'Clinique Manika' },
];

const mockDocuments: HealthDoc[] = [
    { id: 1, title: 'Analyse Sanguine', date: '12 Juin 2024', type: 'lab', doctor: 'Dr. Kabange' },
    { id: 2, title: 'Prescription Palu', date: '10 Mai 2024', type: 'prescription', doctor: 'Dr. Sarah M.' },
    { id: 3, title: 'Certificat Aptitude', date: '02 Jan 2024', type: 'cert', doctor: 'Dr. Ilunga' },
];

const mockChatHistory = [
    { id: 1, sender: 'doctor', text: 'Bonjour M. Kasongo, comment vous sentez-vous après le traitement ?', time: '10:30' },
    { id: 2, sender: 'me', text: 'Bonjour Docteur. La fièvre a baissé, merci.', time: '10:32' },
    { id: 3, sender: 'doctor', text: 'Parfait. Continuez le traitement jusqu\'à la fin de la boite.', time: '10:33' },
];

const mockMedicalResults = [
    {
        id: 1,
        testName: 'Goutte Épaisse (Paludisme)',
        hospital: 'HÔPITAL SENDWE',
        date: '2024-03-01',
        status: 'Disponible',
        value: 'Négatif',
        isNormal: true
    },
    {
        id: 2,
        testName: 'Glycémie à jeun',
        hospital: 'CLINIQUE UNIVERSITAIRE',
        date: '2024-02-15',
        status: 'Disponible',
        value: '95 mg/dL (Normal)',
        isNormal: true,
        isWarning: true
    }
];

const patientProfile = {
  name: 'Amani K.',
  id: 'LUB-8923-MED',
  bloodGroup: 'O+',
  weight: '72kg',
  height: '178cm',
  allergies: ['Pénicilline', 'Arachides'],
  history: [
    { title: 'Appendicectomie', date: '2015' },
    { title: 'Fracture Tibia', date: '2018' }
  ],
  treatments: [
    { name: 'Vitamine D', dosage: '1x par jour (Matin)' },
    { name: 'Paracétamol (si besoin)', dosage: '1x par jour (Matin)' }
  ],
  emergencyContacts: [
    { relation: 'PÈRE', name: 'Papa Simon', phone: '+243 990 000 111' },
    { relation: 'SOEUR', name: 'Marie K.', phone: '+243 810 222 333' }
  ]
};

// Health Tips Data
const healthTips = [
    { 
        id: 1,
        category: 'Nutrition', 
        title: 'Mangez Coloré', 
        text: 'Ajoutez des fruits et légumes de couleurs différentes à chaque repas pour un maximum de vitamines.', 
        icon: Apple, 
        color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400', 
        border: 'border-green-200 dark:border-green-800' 
    },
    { 
        id: 2,
        category: 'Mental', 
        title: 'Pause Respiratoire', 
        text: 'Prenez 5 minutes pour respirer profondément. Inspirez 4s, bloquez 4s, expirez 4s.', 
        icon: Brain, 
        color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400', 
        border: 'border-purple-200 dark:border-purple-800' 
    },
    { 
        id: 3,
        category: 'Hydratation', 
        title: 'L\'eau avant tout', 
        text: 'Buvez un grand verre d\'eau au réveil pour réactiver votre métabolisme après la nuit.', 
        icon: Droplets, 
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', 
        border: 'border-blue-200 dark:border-blue-800' 
    },
    { 
        id: 4,
        category: 'Sommeil', 
        title: 'Écrans Off', 
        text: 'Évitez les écrans 1h avant de dormir pour améliorer la qualité de votre sommeil.', 
        icon: Moon, 
        color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400', 
        border: 'border-indigo-200 dark:border-indigo-800' 
    },
    { 
        id: 5,
        category: 'Activité', 
        title: 'Bougez un peu', 
        text: '30 minutes de marche rapide par jour suffisent pour entretenir votre cœur.', 
        icon: Dumbbell, 
        color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400', 
        border: 'border-orange-200 dark:border-orange-800' 
    },
];

type HealthView = 'dashboard' | 'symptoms' | 'pill-id' | 'directory' | 'agenda' | 'folder' | 'pro-chat' | 'pharmacy' | 'insurance' | 'sos' | 'results';

interface HealthModuleProps {
  onBack?: () => void;
  setTabBarVisible?: (visible: boolean) => void;
}

export const HealthModule: React.FC<HealthModuleProps> = ({ onBack, setTabBarVisible }) => {
  const [currentView, setCurrentView] = useState<HealthView>('dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  
  // AI States
  const [symptomInput, setSymptomInput] = useState('');
  const [pillNameInput, setPillNameInput] = useState(''); // New input state
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Booking State
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | Hospital | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Hospital Directory State
  const [hospitalFilter, setHospitalFilter] = useState('Tous');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [hospitalSearch, setHospitalSearch] = useState('');

  // Folder State
  const [folderTab, setFolderTab] = useState<'resume' | 'soins' | 'urgence'>('resume');

  // Chat State
  const [activeChat, setActiveChat] = useState<Doctor | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState(mockChatHistory);
  const [docFilter, setDocFilter] = useState('Tous');

  // Tip Carousel State
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Insurance State
  const [flipCard, setFlipCard] = useState(false);

  // Control Tab Bar Visibility based on Hospital Detail View
  useEffect(() => {
    if (setTabBarVisible) {
        setTabBarVisible(!selectedHospital);
    }
    return () => {
        if (setTabBarVisible) setTabBarVisible(true);
    };
  }, [selectedHospital, setTabBarVisible]);

  // Auto-rotate Health Tips
  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 6000); // Rotate every 6 seconds
    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS ---
  const handleSymptomCheck = async () => {
    if (!symptomInput.trim()) return;
    setIsLoading(true);
    setAiResponse(null);
    const result = await checkSymptoms(symptomInput);
    setAiResponse(result);
    setIsLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePillIdentify = async () => {
    if (!selectedImage && !pillNameInput.trim()) return;
    setIsLoading(true);
    const result = await analyzeMedication(selectedImage, pillNameInput);
    setAiResponse(result);
    setIsLoading(false);
  };

  const resetAI = () => {
    setAiResponse(null);
    setSymptomInput('');
    setPillNameInput('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const navigateTo = (view: HealthView) => {
    if (view === 'symptoms' || view === 'pill-id') resetAI();
    setCurrentView(view);
  };

  const handleBack = () => {
    if (selectedHospital) {
        setSelectedHospital(null);
        return;
    }
    if (activeChat) {
        setActiveChat(null);
        return;
    }
    if (currentView === 'dashboard') {
        if (onBack) onBack();
    } else {
        setCurrentView('dashboard');
    }
  };

  const confirmBooking = () => {
    if (bookingDoctor && selectedDate && selectedTime) {
      const newAppt: Appointment = {
        id: Date.now().toString(),
        doctorName: bookingDoctor.name,
        specialty: 'name' in bookingDoctor && 'specialty' in bookingDoctor ? bookingDoctor.specialty : 'Consultation',
        date: new Date(selectedDate).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'}),
        time: selectedTime,
        status: 'upcoming',
        location: 'location' in bookingDoctor ? bookingDoctor.location : bookingDoctor.address
      };
      setAppointments([newAppt, ...appointments]);
      setBookingDoctor(null);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigateTo('agenda');
      }, 2000);
    }
  };

  const sendDoctorMessage = () => {
      if(!chatMessage.trim()) return;
      const newMsg = { id: Date.now(), sender: 'me', text: chatMessage, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
      setChatMessages([...chatMessages, newMsg]);
      setChatMessage('');
      
      // Fake Reply
      setTimeout(() => {
          const reply = { id: Date.now()+1, sender: 'doctor', text: "Bien reçu. Je vérifie votre dossier.", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
          setChatMessages(prev => [...prev, reply]);
      }, 2000);
  };

  // --- SUB-COMPONENTS ---

  const Header = ({ title, showProfile = false }: { title: string, showProfile?: boolean }) => {
    const canGoBack = currentView !== 'dashboard';
    const isHospitalDetail = currentView === 'directory' && selectedHospital;
    
    // Hide standard header if showing dashboard or specific views that have their own
    if (currentView === 'dashboard' || currentView === 'folder' || isHospitalDetail) {
        if (currentView === 'dashboard') {
            return (
                <div className="bg-white dark:bg-gray-900 px-4 pt-6 pb-2 sticky top-0 z-20">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Espace Santé</h1>
                            <p className="text-sm text-gray-500 font-medium">Prenez soin de vous, Amani</p>
                        </div>
                        <button 
                            onClick={() => navigateTo('sos')}
                            className="bg-red-50 dark:bg-red-900/20 p-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors shadow-sm"
                        >
                            <Ambulance size={28} />
                        </button>
                    </div>
                    
                    {/* Navigation Pills */}
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                        {[
                            { id: 'dashboard', label: 'Accueil', icon: LayoutGrid },
                            { id: 'agenda', label: 'Agenda', icon: Calendar },
                            { id: 'pharmacy', label: 'Pharmacie', icon: Pill },
                            { id: 'directory', label: 'Hôpitaux', icon: Hospital },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => navigateTo(tab.id as HealthView)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                                    currentView === tab.id 
                                        ? 'bg-[#0f172a] text-white border-[#0f172a] dark:bg-white dark:text-gray-900' 
                                        : 'bg-white text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    }

    // Standard Header for sub-pages
    return (
      <div className={`px-4 pt-6 pb-4 sticky top-0 z-20 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 transition-colors ${currentView === 'directory' ? 'bg-[#10b981] text-white border-none' : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white'}`}>
        <button onClick={handleBack} className={`p-2 rounded-full transition-colors -ml-2 ${currentView === 'directory' ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            <ArrowLeft size={24} className="currentColor" />
        </button>
        <h2 className="text-xl font-bold">{title}</h2>
        {title === 'SOS Urgence' && <Ambulance className="ml-auto text-red-500 animate-pulse" size={24} />}
      </div>
    );
  };

  const BookingModal = () => {
    if (!bookingDoctor) return null;
    return (
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
        <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-slide-up">
           <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Prendre Rendez-vous</h3>
                <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">{bookingDoctor.name}</p>
              </div>
              <button onClick={() => setBookingDoctor(null)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500"><X size={20}/></button>
           </div>
           
           <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Date</label>
                <input 
                  type="date" 
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-sm outline-none dark:text-white"
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Heure</label>
                <div className="grid grid-cols-4 gap-2">
                  {['09:00', '10:00', '11:30', '14:00', '15:30', '16:00'].map(time => (
                    <button 
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${selectedTime === time ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
           </div>

           <button 
             onClick={confirmBooking}
             disabled={!selectedDate || !selectedTime}
             className="w-full bg-[#0f172a] text-white py-3.5 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:shadow-none hover:opacity-90 transition-colors"
           >
             Confirmer le RDV
           </button>
        </div>
      </div>
    );
  };

  const SuccessModal = () => {
    if (!showSuccessModal) return null;
    return (
       <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-white dark:bg-gray-800 px-8 py-6 rounded-3xl shadow-2xl flex flex-col items-center animate-slide-up border border-teal-100 dark:border-teal-900">
             <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} />
             </div>
             <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">RDV Confirmé !</h3>
             <p className="text-gray-500 dark:text-gray-400 text-sm">Ajouté à votre agenda.</p>
          </div>
       </div>
    );
  };

  // --- RENDER VIEWS ---

  const renderDashboard = () => (
    <div className="space-y-6 px-4 pb-28 pt-2 animate-fade-in">
      
      {/* 2. Mon Agenda Section */}
      <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Mon Agenda</h3>
          {appointments.filter(a => a.status === 'upcoming').length > 0 ? (
              appointments.filter(a => a.status === 'upcoming').map(app => (
                <div key={app.id} onClick={() => navigateTo('agenda')} className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 items-center">
                    <div className="flex flex-col items-center justify-center px-3 border-r border-gray-100 dark:border-gray-700">
                        <span className="text-xl font-black text-teal-600">{app.date.split(' ')[0]}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{app.date.split(' ')[1]}</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{app.doctorName}</h4>
                        <p className="text-xs text-gray-500">{app.specialty} • {app.time}</p>
                    </div>
                </div>
              ))
          ) : (
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl p-6 text-center">
                  <p className="text-gray-400 text-sm font-medium mb-4">Aucun rendez-vous prévu.</p>
                  <button 
                    onClick={() => navigateTo('directory')}
                    className="bg-[#0f172a] dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:opacity-90 transition-opacity"
                  >
                      Trouver un médecin
                  </button>
              </div>
          )}
      </div>

      {/* 3. Services Rapides Grid */}
      <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Services Rapides</h3>
          <div className="grid grid-cols-2 gap-3">
              {[
                  { label: 'Hôpitaux', icon: Hospital, color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400', action: 'directory' },
                  { label: 'Ma Fiche', icon: FileText, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', action: 'folder' },
              ].map((svc) => (
                  <button 
                    key={svc.label}
                    onClick={() => navigateTo(svc.action as HealthView)}
                    className="flex flex-col items-center gap-2 group"
                  >
                      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-transform group-active:scale-95 ${svc.color}`}>
                          <svc.icon size={24} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{svc.label}</span>
                  </button>
              ))}
          </div>
      </div>

      {/* 4. Conseil du Jour (Auto-Rotating Carousel) */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="absolute top-0 left-0 h-1 bg-gray-100 dark:bg-gray-700 w-full">
              <div 
                  key={currentTipIndex} // Reset animation on change
                  className={`h-full ${healthTips[currentTipIndex].color.split(' ')[0]} transition-all duration-[6000ms] ease-linear w-full origin-left animate-[progress_6s_linear]`}
                  style={{ width: '100%' }}
              ></div>
          </div>
          
          <div className="p-5 flex items-start gap-4">
              <div className={`p-3 rounded-2xl ${healthTips[currentTipIndex].color} ${healthTips[currentTipIndex].border} border-2 shrink-0 transition-colors duration-500`}>
                  {React.createElement(healthTips[currentTipIndex].icon, { size: 28 })}
              </div>
              <div className="flex-1 min-h-[80px] flex flex-col justify-center animate-fade-in">
                  <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">{healthTips[currentTipIndex].title}</h4>
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider bg-gray-50 dark:bg-gray-700 px-2 py-0.5 rounded-md">
                          {healthTips[currentTipIndex].category}
                      </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {healthTips[currentTipIndex].text}
                  </p>
              </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-1.5 pb-4">
              {healthTips.map((_, idx) => (
                  <button 
                      key={idx} 
                      onClick={() => setCurrentTipIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentTipIndex ? `w-6 ${healthTips[idx].color.split(' ')[0].replace('bg-', 'bg-')}` : 'w-1.5 bg-gray-200 dark:bg-gray-700'}`}
                  />
              ))}
          </div>
          
          <style>{`
            @keyframes progress {
                from { width: 0%; }
                to { width: 100%; }
            }
          `}</style>
      </div>

    </div>
  );

  const renderResults = () => (
      <div className="p-4 space-y-6 animate-slide-left relative z-10 pb-28">
          <div className="space-y-4">
              {mockMedicalResults.map(result => (
                  <div key={result.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                          <div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{result.testName}</h3>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">{result.hospital}</p>
                          </div>
                          {result.status === 'Disponible' && (
                              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                                  {result.status}
                              </span>
                          )}
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-2xl flex justify-between items-center mb-6 mt-4">
                          <div>
                              <p className="text-xs text-gray-400 mb-1">Résultat</p>
                              <div className="flex items-center gap-2">
                                  {result.isNormal ? (
                                      <CheckCircle size={18} className="text-green-500" />
                                  ) : (
                                      <AlertTriangle size={18} className="text-yellow-500" />
                                  )}
                                  <span className={`font-bold text-sm ${result.isWarning ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>
                                      {result.value}
                                  </span>
                              </div>
                          </div>
                          <span className="text-xs text-gray-400">{result.date}</span>
                      </div>

                      <button className="w-full border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <Download size={18} /> Télécharger le PDF
                      </button>
                  </div>
              ))}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl flex gap-3 items-start border border-blue-100 dark:border-blue-900/30">
              <AlertCircle size={24} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                  Les résultats affichés ici sont à titre indicatif. Veuillez toujours consulter votre médecin pour une interprétation correcte.
              </p>
          </div>
      </div>
  );

  const renderFolder = () => (
      <div className="flex flex-col h-full bg-[#10b981] pt-6 relative animate-slide-left">
          {/* Header Green Section */}
          <div className="px-6 pb-8">
              <div className="flex justify-between items-center mb-6 text-white">
                  <button onClick={() => setCurrentView('dashboard')} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors -ml-2">
                      <ArrowLeft size={24} />
                  </button>
                  <h2 className="text-xl font-bold">Dossier Médical</h2>
                  <div className="w-10"></div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
                          <img src="https://picsum.photos/200/200?random=user" className="w-full h-full object-cover" alt="User" />
                      </div>
                  </div>
                  <div className="text-white">
                      <h3 className="text-xl font-bold">{patientProfile.name}</h3>
                      <p className="text-sm opacity-90 mb-1">ID: {patientProfile.id}</p>
                      <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{patientProfile.bloodGroup}</span>
                  </div>
              </div>
          </div>

          {/* White Sheet */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-t-[2.5rem] p-6 overflow-y-auto custom-scrollbar relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
              {/* Tabs */}
              <div className="flex p-1.5 bg-white dark:bg-gray-800 rounded-2xl mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  {['resume', 'soins', 'urgence'].map((tab) => (
                      <button 
                          key={tab}
                          onClick={() => setFolderTab(tab as any)}
                          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                              folderTab === tab 
                                  ? 'bg-[#d1fae5] text-[#059669] shadow-sm' 
                                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500'
                          }`}
                      >
                          {tab === 'resume' ? 'Résumé' : tab === 'soins' ? 'Soins' : 'Urgence'}
                      </button>
                  ))}
              </div>

              {folderTab === 'resume' && (
                  <div className="space-y-6 animate-fade-in pb-20">
                      {/* Vitals */}
                      <div className="flex gap-4">
                          <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-2 text-red-500">
                                  <Droplet size={20} fill="currentColor" />
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Sang</span>
                              <span className="text-xl font-black text-gray-900 dark:text-white">{patientProfile.bloodGroup}</span>
                          </div>
                          <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2 text-blue-500">
                                  <Weight size={20} />
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Poids</span>
                              <span className="text-xl font-black text-gray-900 dark:text-white">
                                  {patientProfile.weight.replace('kg', '')}<span className="text-sm">kg</span>
                              </span>
                          </div>
                          <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-2 text-teal-500">
                                  <Ruler size={20} />
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Taille</span>
                              <span className="text-xl font-black text-gray-900 dark:text-white">
                                  {patientProfile.height.replace('cm', '')}<span className="text-sm">cm</span>
                              </span>
                          </div>
                      </div>

                      {/* Allergies */}
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-2 mb-4">
                              <AlertTriangle size={20} className="text-orange-500" />
                              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Allergies & Intolérances</h3>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                              {patientProfile.allergies.map(allergy => (
                                  <span key={allergy} className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-xl font-bold text-sm border border-orange-100 dark:border-orange-900/30">
                                      {allergy}
                                  </span>
                              ))}
                          </div>
                      </div>

                      {/* History */}
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-2 mb-4">
                              <FileText size={20} className="text-purple-500" />
                              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Antécédents Médicaux</h3>
                          </div>
                          <div className="space-y-3">
                              {patientProfile.history.map((item, idx) => (
                                  <div key={idx} className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-2xl flex items-center gap-3">
                                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                      <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">{item.title} <span className="text-gray-400">({item.date})</span></span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              )}

              {folderTab === 'soins' && (
                  <div className="space-y-6 animate-fade-in pb-20">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-2 mb-6">
                              <Pill size={20} className="text-blue-500" />
                              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Traitements en cours</h3>
                          </div>
                          <div className="space-y-4">
                              {patientProfile.treatments.map((t, idx) => (
                                  <div key={idx} className="pl-4 border-l-4 border-blue-500">
                                      <h4 className="font-bold text-gray-900 dark:text-white text-base">{t.name}</h4>
                                      <div className="flex items-center gap-2 mt-1 text-gray-500 dark:text-gray-400 text-xs">
                                          <Clock size={12} />
                                          <span>{t.dosage}</span>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <button className="w-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                          <Plus size={20} /> Ajouter un traitement
                      </button>
                  </div>
              )}

              {folderTab === 'urgence' && (
                  <div className="space-y-4 animate-fade-in pb-20">
                      {patientProfile.emergencyContacts.map((contact, idx) => (
                          <div key={idx} className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                              <div>
                                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">{contact.relation}</span>
                                  <h4 className="font-bold text-gray-900 dark:text-white text-lg mt-0.5">{contact.name}</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{contact.phone}</p>
                              </div>
                              <a href={`tel:${contact.phone}`} className="bg-red-100 dark:bg-red-900/30 text-red-500 p-3 rounded-2xl hover:bg-red-200 transition-colors">
                                  <Phone size={24} />
                              </a>
                          </div>
                      ))}
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-3xl border border-yellow-100 dark:border-yellow-900/50 text-center mt-6">
                          <p className="text-yellow-800 dark:text-yellow-200 text-xs font-medium leading-relaxed">
                              Ces contacts seront affichés sur votre écran de verrouillage en cas d'urgence si vous activez le widget.
                          </p>
                      </div>
                  </div>
              )}
          </div>
      </div>
  );

  const renderDirectory = () => (
    <div className="p-4 space-y-4 animate-slide-left relative z-10">
       {/* Filter Pills */}
       <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {['Tous', 'Hôpital', 'Clinique', 'Centre de Santé', 'Pharmacie'].map(filter => (
             <button 
               key={filter}
               onClick={() => setHospitalFilter(filter)}
               className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                 hospitalFilter === filter 
                   ? 'bg-[#10b981] text-white shadow-md' 
                   : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700'
               }`}
             >
               {filter}
             </button>
          ))}
       </div>

       {/* Search Bar */}
       <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un établissement..." 
            value={hospitalSearch}
            onChange={(e) => setHospitalSearch(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 pl-12 pr-4 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 outline-none text-sm text-gray-800 dark:text-white"
          />
       </div>

       {/* Hospital List */}
       <div className="space-y-4">
          {mockHospitals
            .filter(h => (hospitalFilter === 'Tous' || h.type === hospitalFilter) && h.name.toLowerCase().includes(hospitalSearch.toLowerCase()))
            .map(hospital => (
              <div 
                key={hospital.id} 
                onClick={() => setSelectedHospital(hospital)}
                className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer active:scale-[0.98] transition-transform"
              >
                 <div className="h-32 bg-gray-200 rounded-2xl mb-4 overflow-hidden relative">
                    <img src={hospital.image} className="w-full h-full object-cover" alt={hospital.name} />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-gray-800 flex items-center gap-1">
                       <Star size={10} className="text-yellow-500 fill-current" /> {hospital.rating}
                    </div>
                    {hospital.isOpen24 && (
                        <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold">
                            Ouvert 24h/24
                        </div>
                    )}
                 </div>
                 
                 <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight">{hospital.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                           <MapPin size={12} /> {hospital.address}
                        </p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                       <ChevronRight size={16} className="text-gray-500 dark:text-gray-300" />
                    </div>
                 </div>

                 <div className="flex gap-2 flex-wrap">
                    {hospital.services.slice(0, 3).map(svc => (
                        <span key={svc} className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md font-medium">
                            {svc}
                        </span>
                    ))}
                    {hospital.services.length > 3 && (
                        <span className="text-[10px] bg-gray-50 dark:bg-gray-700 text-gray-500 px-2 py-1 rounded-md font-medium">
                            +{hospital.services.length - 3}
                        </span>
                    )}
                 </div>
              </div>
          ))}
       </div>
    </div>
  );

  const renderHospitalDetail = () => {
      if (!selectedHospital) return null;
      return (
          <div className="flex flex-col h-full bg-white dark:bg-gray-900 animate-slide-left relative z-20">
              {/* Header Image Area */}
              <div className="h-64 relative">
                  <img src={selectedHospital.image} className="w-full h-full object-cover" alt={selectedHospital.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  {/* Top Bar (Absolute) */}
                  <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center pt-8">
                      <button onClick={() => setSelectedHospital(null)} className="p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition-colors">
                          <ArrowLeft size={24} />
                      </button>
                      <div className="flex gap-3">
                          <button className="p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition-colors">
                              <Share2 size={24} />
                          </button>
                          <button className="p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition-colors">
                              <Heart size={24} />
                          </button>
                      </div>
                  </div>

                  {/* Title Area */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex justify-between items-end">
                          <div>
                              <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded mb-2 inline-block">
                                  {selectedHospital.type} • {selectedHospital.category}
                              </span>
                              <h2 className="text-2xl font-black text-white leading-tight mb-1">{selectedHospital.name}</h2>
                              <div className="flex items-center gap-2 text-gray-300 text-xs">
                                  <Star size={12} className="text-yellow-400 fill-current" /> 
                                  <span className="font-bold text-white">{selectedHospital.rating}</span> 
                                  <span>({selectedHospital.reviews} avis)</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Content Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-gray-900 rounded-t-[2rem] -mt-6 relative z-10">
                  {/* Actions Row */}
                  <div className="flex gap-4">
                      <a href={`tel:${selectedHospital.phone}`} className="flex-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm border border-green-100 dark:border-green-900/30">
                          <Phone size={18} /> Appeler
                      </a>
                      <button className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm border border-blue-100 dark:border-blue-900/30">
                          <Navigation size={18} /> Itinéraire
                      </button>
                  </div>

                  {/* Description */}
                  <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">À propos</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                          {selectedHospital.description}
                      </p>
                  </div>

                  {/* Services */}
                  <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-3">Services Disponibles</h3>
                      <div className="flex flex-wrap gap-2">
                          {selectedHospital.services.map(svc => (
                              <span key={svc} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold">
                                  {svc}
                              </span>
                          ))}
                      </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl flex items-center gap-3">
                          <div className="bg-white dark:bg-gray-700 p-2 rounded-full text-gray-500 dark:text-gray-300">
                              <Clock size={20} />
                          </div>
                          <div>
                              <span className="text-[10px] text-gray-400 font-bold uppercase block">Horaires</span>
                              <span className="text-xs font-bold text-gray-900 dark:text-white">{selectedHospital.isOpen24 ? '24h/24 - 7j/7' : '08:00 - 18:00'}</span>
                          </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl flex items-center gap-3">
                          <div className="bg-white dark:bg-gray-700 p-2 rounded-full text-gray-500 dark:text-gray-300">
                              <MapIcon size={20} />
                          </div>
                          <div>
                              <span className="text-[10px] text-gray-400 font-bold uppercase block">Distance</span>
                              <span className="text-xs font-bold text-gray-900 dark:text-white">2.4 km</span>
                          </div>
                      </div>
                  </div>

                  {/* Booking Button */}
                  <button 
                      onClick={() => { setBookingDoctor(selectedHospital); setShowSuccessModal(false); }}
                      className="w-full bg-[#0f172a] text-white py-4 rounded-xl font-bold shadow-lg shadow-gray-200 dark:shadow-none flex items-center justify-center gap-2"
                  >
                      <Calendar size={18} /> Prendre Rendez-vous
                  </button>
              </div>
          </div>
      );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 pb-28 transition-colors duration-300 relative">
      <Header 
        title={
            currentView === 'dashboard' ? 'Espace Santé' : 
            currentView === 'symptoms' ? 'Dr. Lualaba IA' :
            currentView === 'pill-id' ? 'Scan Médicament' :
            currentView === 'directory' ? 'Hôpitaux' :
            currentView === 'pharmacy' ? 'Pharmacies de Garde' :
            currentView === 'agenda' ? 'Mon Agenda' :
            currentView === 'folder' ? 'Dossier Médical' : 
            currentView === 'pro-chat' ? 'Médecins en Ligne' : 
            currentView === 'insurance' ? 'Ma Carte' : 
            currentView === 'results' ? 'Résultats d\'examens' : 'SOS Urgence'
        } 
        showProfile={currentView === 'dashboard'} 
      />
      
      {BookingModal()}
      {SuccessModal()}

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        
        {currentView === 'dashboard' && renderDashboard()}
        
        {/* Render Directory View (Replaces generic doctor directory) */}
        {currentView === 'directory' && !selectedHospital && renderDirectory()}
        {currentView === 'directory' && selectedHospital && renderHospitalDetail()}

        {/* Render Folder View (Replaces generic folder) */}
        {currentView === 'folder' && renderFolder()}

        {/* Render Results View */}
        {currentView === 'results' && renderResults()}

        {/* Render Pro Chat View */}
        {currentView === 'pro-chat' && (
            <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-slide-left relative z-10">
                {!activeChat ? (
                    <>
                        {/* Header Section */}
                        <div className="px-4 py-4 bg-white dark:bg-gray-800 shadow-sm z-10 sticky top-0">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Médecins en ligne</h2>
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                {['Tous', 'Généraliste', 'Pédiatre', 'Dentiste', 'Cardiologue', 'Ophtalmologue'].map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setDocFilter(cat)}
                                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${docFilter === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* List */}
                        <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar flex-1 pb-24">
                            {mockDoctors.filter(d => docFilter === 'Tous' || d.specialty === docFilter).map(doc => (
                                <div key={doc.id} onClick={() => setActiveChat(doc)} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 cursor-pointer active:scale-[0.98] transition-transform">
                                    <div className="relative">
                                        <img src={doc.image} className="w-14 h-14 rounded-full object-cover bg-gray-200" alt={doc.name} />
                                        {doc.isOnline && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{doc.name}</h3>
                                            <div className="flex items-center gap-1 text-xs font-bold text-yellow-500"><Star size={12} fill="currentColor"/> {doc.rating}</div>
                                        </div>
                                        <p className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase mb-0.5">{doc.specialty}</p>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1"><MapPin size={10} /> {doc.location}</p>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <button className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors">
                                            <MessageSquare size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    // Chat View
                    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setActiveChat(null)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><ArrowLeft size={20} /></button>
                                <div className="relative">
                                    <img src={activeChat.image} className="w-10 h-10 rounded-full object-cover bg-gray-200" alt={activeChat.name} />
                                    {activeChat.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{activeChat.name}</h4>
                                    <span className="text-[10px] text-blue-500 font-bold uppercase">{activeChat.specialty}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"><Phone size={18} /></button>
                                <button className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"><Video size={18} /></button>
                            </div>
                        </div>
                        
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#0b1120]">
                            <div className="text-center text-xs text-gray-400 my-4 font-medium">Aujourd'hui</div>
                            {chatMessages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'me' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-none border border-gray-100 dark:border-gray-700'}`}>
                                        <p>{msg.text}</p>
                                        <span className={`text-[9px] block text-right mt-1 font-medium ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>{msg.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 pb-6">
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><Plus size={24}/></button>
                            <input 
                                type="text" 
                                className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-3 text-sm outline-none dark:text-white placeholder-gray-500" 
                                placeholder="Écrivez votre message..."
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendDoctorMessage()}
                            />
                            <button onClick={sendDoctorMessage} className="p-3 bg-blue-600 rounded-full text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-transform hover:bg-blue-700">
                                <Send size={20} className="ml-0.5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )}

        {currentView === 'symptoms' && (
          <div className="p-4 space-y-4 animate-slide-left relative z-10">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
               <div className="flex items-start gap-4 mb-4">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full">
                     <Stethoscope size={24} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-900 dark:text-white text-lg">Bonjour, Bienvenu.</h3>
                     <p className="text-gray-500 dark:text-gray-400 text-sm">Je suis votre assistant médical virtuel. Décrivez vos symptômes pour une orientation.</p>
                  </div>
               </div>
               
               <textarea
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder="Ex: J'ai mal à la tête et de la fièvre depuis ce matin..."
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none outline-none text-gray-800 dark:text-white resize-none min-h-[120px] focus:ring-2 focus:ring-indigo-500/20"
               />
               
               <div className="flex justify-end mt-4">
                  <button
                    onClick={handleSymptomCheck}
                    disabled={isLoading || !symptomInput}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all disabled:opacity-50"
                  >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={18} />}
                    Analyser
                  </button>
               </div>
            </div>

            {aiResponse && (
              <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-3xl shadow-sm border border-indigo-100 dark:border-indigo-900 animate-fade-in">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                  Diagnostic Suggeré
                </h4>
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {aiResponse}
                </div>
                <div className="mt-6 pt-4 border-t border-indigo-100 dark:border-gray-700 flex items-center justify-between">
                   <span className="text-xs text-gray-400 italic">Ceci n'est pas un avis médical officiel.</span>
                   <button onClick={() => navigateTo('directory')} className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-200 transition-colors">
                     Trouver un médecin
                   </button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'pill-id' && (
          <div className="p-4 space-y-4 animate-slide-left relative z-10">
            {/* Input Options Container */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
               <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4 text-center">Identifier un médicament</h3>
               
               {/* 1. Text Input */}
               <div className="relative mb-6">
                  <Type className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Nom du médicament (ex: Paracétamol)" 
                    value={pillNameInput}
                    onChange={(e) => setPillNameInput(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-800 dark:text-white text-sm"
                  />
               </div>

               {/* Separator */}
               <div className="flex items-center gap-4 mb-6">
                  <div className="h-[1px] bg-gray-200 dark:bg-gray-700 flex-1"></div>
                  <span className="text-xs font-bold text-gray-400 uppercase">OU</span>
                  <div className="h-[1px] bg-gray-200 dark:bg-gray-700 flex-1"></div>
               </div>

               {/* 2. Image Upload Box */}
               <div 
                  className={`border-2 border-dashed rounded-2xl h-40 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition-all ${selectedImage ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 bg-gray-50 dark:bg-gray-700/30'}`}
                  onClick={() => fileInputRef.current?.click()}
               >
                  {selectedImage ? (
                    <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 dark:text-gray-500 group-hover:text-purple-500 transition-colors">
                      <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-2 shadow-sm">
                         <Camera size={24} />
                      </div>
                      <span className="text-xs font-bold">Prendre une photo</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
               </div>

               {/* Action Button */}
               <button
                  onClick={handlePillIdentify}
                  disabled={isLoading || (!selectedImage && !pillNameInput)}
                  className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 mt-6 disabled:opacity-50 hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20"
               >
                  {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search size={18} />}
                  Analyser
               </button>
            </div>

             {aiResponse && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border-l-4 border-purple-500 animate-fade-in">
                <h4 className="font-bold text-gray-800 dark:text-white mb-3 text-lg flex items-center gap-2">
                    <Pill size={20} className="text-purple-500" /> Résultat de l'analyse
                </h4>
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {aiResponse}
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'pharmacy' && (
            <div className="p-4 space-y-4 animate-slide-left relative z-10">
                <div className="bg-green-600 text-white p-5 rounded-3xl shadow-lg flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg">Pharmacies de Garde</h3>
                        <p className="text-green-100 text-xs">Ouvertes 24h/24 ce week-end</p>
                    </div>
                    <Cross size={32} className="opacity-80" />
                </div>

                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
                                <Cross size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white">Pharmacie du Peuple</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Av. Kasa-Vubu, No 45</p>
                                <span className="text-[10px] text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded mt-1 inline-block">Ouvert • 1.2km</span>
                            </div>
                            <button className="bg-gray-100 dark:bg-gray-700 p-2.5 rounded-full text-gray-600 dark:text-white">
                                <Phone size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {currentView === 'agenda' && (
          <div className="p-4 space-y-4 animate-slide-left relative z-10">
             <h3 className="font-bold text-gray-800 dark:text-gray-200 px-2">À venir</h3>
             {appointments.filter(a => a.status === 'upcoming').map(app => (
               <div key={app.id} className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none border-l-4 border-teal-500 flex gap-4 items-center animate-slide-up">
                  <div className="flex flex-col items-center justify-center px-2 border-r border-gray-100 dark:border-gray-700 pr-4">
                     <span className="text-2xl font-black text-gray-800 dark:text-white">{app.date.split(' ')[0]}</span>
                     <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">{app.date.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between items-center mb-1">
                       <span className="bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full">{app.time}</span>
                       <span className="text-gray-400 dark:text-gray-500 text-xs font-medium">{app.specialty}</span>
                     </div>
                     <h4 className="font-bold text-gray-900 dark:text-white text-lg">{app.doctorName}</h4>
                     <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                       <MapPin size={10} /> {app.location}
                     </p>
                  </div>
               </div>
             ))}
             {appointments.filter(a => a.status === 'upcoming').length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                    <Calendar size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-400 text-sm">Aucun rendez-vous à venir.</p>
                    <button onClick={() => navigateTo('directory')} className="mt-4 text-teal-600 font-bold text-sm">Prendre RDV</button>
                </div>
             )}
          </div>
        )}

        {currentView === 'pro-chat' && (
            <div className="flex flex-col h-full bg-white dark:bg-gray-900 animate-slide-left relative z-10 rounded-t-[2rem] overflow-hidden">
                {!activeChat ? (
                    <div className="p-4">
                        <h3 className="font-bold text-gray-800 dark:text-white mb-4 px-2">Discussions Récentes</h3>
                        <div className="space-y-2">
                            {/* Pro Chat mock data removed for brevity, assuming standard chat interface */}
                            <p className="text-gray-500 text-sm text-center py-4">Chargement des médecins...</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-[70vh]">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-white dark:bg-gray-900">
                            <button onClick={() => setActiveChat(null)}><ArrowLeft size={20} className="text-gray-600 dark:text-white" /></button>
                            <img src={activeChat.image} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{activeChat.name}</h4>
                                <span className="text-[10px] text-green-500 font-bold">En ligne</span>
                            </div>
                        </div>
                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-black/20">
                            {chatMessages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.sender === 'me' ? 'bg-teal-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-none shadow-sm'}`}>
                                        <p>{msg.text}</p>
                                        <span className="text-[9px] opacity-70 block text-right mt-1">{msg.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Chat Input */}
                        <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                            <input 
                                type="text" 
                                className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 text-sm outline-none dark:text-white" 
                                placeholder="Écrivez votre message..."
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendDoctorMessage()}
                            />
                            <button onClick={sendDoctorMessage} className="p-2 bg-teal-600 rounded-full text-white"><Send size={18} /></button>
                        </div>
                    </div>
                )}
            </div>
        )}

        {currentView === 'insurance' && (
            <div className="p-6 animate-slide-left relative z-10 flex flex-col items-center">
                <div 
                    className={`relative w-full max-w-sm h-56 transition-transform duration-700 preserve-3d cursor-pointer ${flipCard ? 'rotate-y-180' : ''}`}
                    onClick={() => setFlipCard(!flipCard)}
                    style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
                >
                    {/* Front */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl flex flex-col justify-between border border-slate-700 backface-hidden ${flipCard ? 'hidden' : ''}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-white font-bold tracking-wider">LUALABA SANTE</h3>
                                <p className="text-[10px] text-slate-400 uppercase">Carte Premium</p>
                            </div>
                            <ShieldCheck className="text-teal-400" size={32} />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-10 bg-yellow-500/20 rounded-md border border-yellow-500/50 flex items-center justify-center">
                                <div className="w-8 h-6 border-2 border-yellow-500/50 rounded-sm"></div>
                            </div>
                            <Wifi className="text-white rotate-90" size={24} />
                        </div>
                        <div className="flex justify-between items-end text-white">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase">Assuré</p>
                                <p className="font-mono text-sm tracking-widest">BIENVENU KASONGO</p>
                            </div>
                            <p className="font-mono text-sm">EXP 12/25</p>
                        </div>
                    </div>

                    {/* Back */}
                    <div className={`absolute inset-0 bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 backface-hidden rotate-y-180 ${!flipCard ? 'hidden' : ''} transform rotate-180`}>
                        <div className="w-full h-12 bg-black mt-6"></div>
                        <div className="p-4 mt-2">
                            <div className="bg-white h-8 w-3/4 flex items-center justify-end px-2 font-mono text-sm mb-2">
                                883 129
                            </div>
                            <p className="text-[9px] text-slate-400 leading-tight">
                                Cette carte est la propriété de Lualaba Santé. En cas de perte, veuillez contacter le service client au +243 999 000 000. Couverture : Hospitalisation, Soins dentaires, Optique.
                            </p>
                            <div className="flex justify-center mt-4">
                                <QrCode size={48} className="text-white" />
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-gray-500 text-xs mt-6 text-center">Touchez la carte pour voir le verso.</p>
            </div>
        )}

        {currentView === 'sos' && (
            <div className="p-6 animate-slide-left relative z-10 flex flex-col items-center justify-center h-[60vh]">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20 delay-150"></div>
                    <button className="w-40 h-40 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex flex-col items-center justify-center shadow-[0_10px_40px_rgba(220,38,38,0.5)] border-4 border-red-500 relative z-10 active:scale-95 transition-transform">
                        <Phone size={48} className="text-white mb-2" />
                        <span className="text-white font-black text-2xl tracking-widest">SOS</span>
                    </button>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-2">Urgence Médicale</h3>
                <p className="text-gray-500 text-center text-sm max-w-xs mb-8">Votre position sera envoyée aux services de secours les plus proches.</p>
                
                <div className="w-full max-w-xs space-y-3">
                    <button className="w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:scale-[1.02] transition-transform">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Ambulance size={24} /></div>
                        <div className="text-left">
                            <h4 className="font-bold text-gray-900 dark:text-white">Ambulance Privée</h4>
                            <p className="text-xs text-gray-500">Arrivée estimée: 12 min</p>
                        </div>
                    </button>
                    <button className="w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:scale-[1.02] transition-transform">
                        <div className="bg-green-100 p-2 rounded-lg text-green-600"><Phone size={24} /></div>
                        <div className="text-left">
                            <h4 className="font-bold text-gray-900 dark:text-white">Médecin de garde</h4>
                            <p className="text-xs text-gray-500">Consultation téléphonique</p>
                        </div>
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};