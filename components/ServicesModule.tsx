import React, { useState } from 'react';
import { 
  ArrowLeft, Search, User, ChevronRight, 
  Sparkles, Utensils, Wallet, Car, Wrench, 
  GraduationCap, Music, Landmark, Briefcase, ChevronRight as ChevronRightIcon,
  MapPin, Clock, CreditCard, Star, Phone, CheckCircle, Flame, Droplets, Wifi, Bike,
  ShieldCheck, Shield, Baby, Shirt, ChefHat, Truck, Coffee, Pizza,
  Scan, History, Monitor, Smartphone, Zap, X, ChevronDown, Loader2,
  Key, Fuel, BatteryCharging, Gauge, Calendar, BookOpen, Video, PlayCircle, Users,
  Music2, Gift, Camera, FileText, Download, HelpCircle, File, Play, Award, BarChart, Globe
} from 'lucide-react';

interface ServicesModuleProps {
  onBack: () => void;
}

type ServiceView = 'catalog' | 'ride' | 'food' | 'bills' | 'cleaning' | 'learning' | 'events' | 'administration' | 'repair' | 'generic';
type BillType = 'water_elec' | 'internet' | 'tv' | 'school' | 'credit' | null;
type MobilityView = 'home' | 'booking' | 'rental' | 'buy';

// Mock Data for Cleaning Providers
const mockProviders = [
  {
    id: 1,
    name: 'Maman Sifa',
    role: 'FEMME DE MÉNAGE',
    price: '10$ / jour',
    rating: 4.9,
    reviews: 42,
    location: 'Kolwezi, Centre',
    description: "Expérimentée dans l'entretien complet de maison. Cuisine locale excellente et repassage soigné.",
    image: 'https://picsum.photos/150/150?random=sifa',
    verified: true,
    category: 'Ménage'
  },
  {
    id: 2,
    name: 'Sarah K.',
    role: 'NOUNOU CERTIFIÉE',
    price: '150$ / mois',
    rating: 5.0,
    reviews: 15,
    location: 'Q. Joli Site',
    description: "Patiente et douce. Formation premiers secours pédiatriques. Disponible pour garde de nuit.",
    image: 'https://picsum.photos/150/150?random=sarah',
    verified: true,
    category: 'Babysitting'
  },
  {
    id: 3,
    name: 'Papa Jean',
    role: 'JARDINIER & VIGILE',
    price: '15$ / jour',
    rating: 4.7,
    reviews: 28,
    location: 'Manika',
    description: "Entretien pelouse, taille de haies et surveillance de nuit. Honnête et ponctuel.",
    image: 'https://picsum.photos/150/150?random=jean',
    verified: false,
    category: 'Jardinage'
  }
];

// Mock Data for Restaurants (Resto & Fast-Food)
const mockRestaurants = [
  {
    id: 1,
    name: 'Le Boucher',
    type: 'RESTAURANT',
    category: 'Restaurants',
    location: 'Golf, Lubumbashi',
    tags: ['Steak Frites', 'Poulet Mayo'],
    image: 'https://picsum.photos/400/250?random=meat',
    rating: 4.5,
    time: '30-45 min',
    isOpen: true
  },
  {
    id: 2,
    name: 'Burger Kingda',
    type: 'FAST-FOOD',
    category: 'Fast-Food',
    location: 'Centre-Ville',
    tags: ['Cheese Burger', 'Chicken Burger'],
    image: 'https://picsum.photos/400/250?random=burger',
    rating: 4.2,
    time: '15-25 min',
    isOpen: true
  },
  {
    id: 3,
    name: 'Pizza Express',
    type: 'FOOD TRUCK',
    category: 'Food Truck',
    location: 'Carrefour Manika',
    tags: ['Pizza Reine', 'Tacos'],
    image: 'https://picsum.photos/400/250?random=pizza',
    rating: 4.8,
    time: '20 min',
    isOpen: false
  },
  {
    id: 4,
    name: 'Chez Maman Maguy',
    type: 'LOCAL',
    category: 'Restaurants',
    location: 'Kasulo',
    tags: ['Fufu', 'Samoussa', 'Brochettes'],
    image: 'https://picsum.photos/400/250?random=local',
    rating: 4.9,
    time: '45 min',
    isOpen: true
  }
];

// Mock Data for Courses
const mockCourses = [
  {
    id: 1,
    title: 'Initiation à l\'Informatique',
    instructor: 'Lualaba Digital',
    category: 'Tech',
    duration: '4 semaines',
    price: 'Gratuit',
    rating: 4.8,
    students: 1240,
    image: 'https://picsum.photos/400/250?random=tech',
    level: 'Débutant',
    progress: 65 // Simulated progress
  },
  {
    id: 2,
    title: 'Anglais des Affaires',
    instructor: 'Sarah Miller',
    category: 'Langues',
    duration: '2 mois',
    price: '20$',
    rating: 4.9,
    students: 850,
    image: 'https://picsum.photos/400/250?random=english',
    level: 'Intermédiaire',
    progress: 0
  },
  {
    id: 3,
    title: 'Gestion de Projet Minier',
    instructor: 'Expert Mines RDC',
    category: 'Pro',
    duration: '3 mois',
    price: '150$',
    rating: 4.7,
    students: 320,
    image: 'https://picsum.photos/400/250?random=mine',
    level: 'Avancé',
    progress: 10
  },
  {
    id: 4,
    title: 'Maths : Préparation Exétat',
    instructor: 'Prof. Ilunga',
    category: 'Scolaire',
    duration: '1 mois',
    price: '10$',
    rating: 4.6,
    students: 2100,
    image: 'https://picsum.photos/400/250?random=math',
    level: 'Débutant',
    progress: 0
  },
  {
    id: 5,
    title: 'Design Graphique & UI',
    instructor: 'Creative Lab',
    category: 'Tech',
    duration: '6 semaines',
    price: '45$',
    rating: 4.9,
    students: 540,
    image: 'https://picsum.photos/400/250?random=design',
    level: 'Intermédiaire',
    progress: 0
  }
];

// Mock Data for Event Providers
const mockEventProviders = [
  {
    id: 1,
    name: 'LarogaEvent',
    category: 'Agences',
    role: 'AGENCE ÉVÉNEMENTIEL',
    description: 'Organisation mariage, conférence, concert. Service clé en main.',
    price: 'Sur devis',
    rating: 4.9,
    image: 'https://picsum.photos/150/150?random=event1'
  },
  {
    id: 2,
    name: "Beraca's Valley",
    category: 'Traiteur',
    role: 'SERVICE TRAITEUR',
    description: 'Buffet, cocktail, dîner de gala. Cuisine raffinée locale et internationale.',
    price: 'À partir de 20$/pers',
    rating: 4.8,
    image: 'https://picsum.photos/150/150?random=event2'
  },
  {
    id: 3,
    name: 'DJ Spilulu',
    category: 'Booking/DJ',
    role: 'BOOKING ARTISTE / DJ',
    description: 'Animation musicale, Afro-House, Mix live pour soirées privées.',
    price: 'Sur devis',
    rating: 5.0,
    image: 'https://picsum.photos/150/150?random=event3'
  },
  {
    id: 4,
    name: 'Deco Rêve',
    category: 'Décoration',
    role: 'DÉCORATION & FLEURS',
    description: 'Transformation de salles, décorations florales, éclairage d\'ambiance.',
    price: 'Pack dès 500$',
    rating: 4.6,
    image: 'https://picsum.photos/150/150?random=event4'
  }
];

export const ServicesModule: React.FC<ServicesModuleProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<ServiceView>('catalog');
  const [toast, setToast] = useState<string | null>(null);
  const [genericTitle, setGenericTitle] = useState('');
  
  // Filters State
  const [cleaningFilter, setCleaningFilter] = useState('Tout');
  const [foodFilter, setFoodFilter] = useState('Tout');
  const [foodSearch, setFoodSearch] = useState('');
  const [learningFilter, setLearningFilter] = useState('Tout');
  const [eventFilter, setEventFilter] = useState('Tous');

  // Bills State
  const [selectedBillType, setSelectedBillType] = useState<BillType>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Bill Payment Form State
  const [provider, setProvider] = useState<string>('option1');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'airtel' | 'orange' | 'mpesa' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Mobility State
  const [mobilityView, setMobilityView] = useState<MobilityView>('home');
  const [selectedRide, setSelectedRide] = useState<'moto' | 'taxi' | 'vip' | null>(null);
  const [searchingDriver, setSearchingDriver] = useState(false);

  // --- HELPERS ---
  const handleBack = () => {
    if (currentView === 'catalog') {
      onBack();
    } else if (currentView === 'ride' && mobilityView !== 'home') {
      setMobilityView('home');
    } else {
      setCurrentView('catalog');
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const openGeneric = (title: string) => {
    setGenericTitle(title);
    setCurrentView('generic');
  };

  const handlePayment = () => {
    setPaymentProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
        setPaymentProcessing(false);
        setPaymentSuccess(true);
        // Close modal after success
        setTimeout(() => {
            setPaymentSuccess(false);
            setSelectedBillType(null);
            // Reset form
            setProvider('option1');
            setAmount('');
            setPaymentMethod(null);
            setPhoneNumber('');
        }, 2500);
    }, 2000);
  };

  const handleBookRide = () => {
     if(!selectedRide) {
         showToast("Veuillez sélectionner un type de véhicule");
         return;
     }
     setSearchingDriver(true);
     setTimeout(() => {
         setSearchingDriver(false);
         showToast("Chauffeur trouvé ! Arrivée dans 5 min.");
         setMobilityView('home');
     }, 3000);
  };

  const renderRide = () => {
    if (mobilityView === 'home') {
      return (
        <div className="animate-slide-left space-y-6 pb-20">
           {/* Header Text */}
           <div className="px-2">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">Où allez-vous ?</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Transport, Location, Achat & Services.</p>
           </div>

           {/* Commander une course (Big Card) */}
           <div 
             onClick={() => setMobilityView('booking')}
             className="bg-[#1e293b] dark:bg-black rounded-[2rem] p-6 flex items-center justify-between text-white shadow-xl cursor-pointer active:scale-[0.98] transition-transform"
           >
              <div className="flex items-center gap-5">
                 <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md">
                    <Car size={32} />
                 </div>
                 <div>
                    <h3 className="font-bold text-xl leading-tight">Commander une<br/>course</h3>
                    <p className="text-gray-400 text-xs mt-1">Taxi, Moto, VIP, Bus</p>
                 </div>
              </div>
              <div className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors">
                 <ChevronRight size={20} />
              </div>
           </div>

           {/* Grid: Louer & Acheter */}
           <div className="grid grid-cols-2 gap-4 px-1">
              <div 
                onClick={() => setMobilityView('rental')}
                className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
              >
                 <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                    <Key size={24} />
                 </div>
                 <h3 className="font-bold text-gray-900 dark:text-white text-lg">Louer</h3>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-snug">Véhicules avec ou sans chauffeur</p>
              </div>

              <div 
                onClick={() => setMobilityView('buy')}
                className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
              >
                 <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-4">
                    <Wallet size={24} />
                 </div>
                 <h3 className="font-bold text-gray-900 dark:text-white text-lg">Acheter</h3>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-snug">Vente auto neuves et occasions</p>
              </div>
           </div>

           {/* Services Plus List */}
           <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Services Plus</h3>
              <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-2 shadow-sm border border-gray-100 dark:border-gray-700">
                 <div className="flex items-center gap-4 p-4 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors cursor-pointer" onClick={() => showToast('Bornes bientôt disponibles')}>
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center">
                       <BatteryCharging size={24} />
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold text-gray-900 dark:text-white">LuboCar Charge</h4>
                       <p className="text-xs text-gray-500 dark:text-gray-400">Bornes de recharge EV</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors cursor-pointer" onClick={() => openGeneric("Garages & Stations")}>
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl flex items-center justify-center">
                       <Wrench size={24} />
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold text-gray-900 dark:text-white">LubumMap Auto</h4>
                       <p className="text-xs text-gray-500 dark:text-gray-400">Garages & Stations</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      );
    }

    if (mobilityView === 'booking') {
      return (
        <div className="animate-slide-up h-full flex flex-col -mt-4 relative">
           {searchingDriver && (
               <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-fade-in rounded-3xl">
                   <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mb-6 relative">
                       <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-ping"></div>
                       <Car size={32} />
                   </div>
                   <h3 className="text-xl font-bold mb-2">Recherche en cours...</h3>
                   <p className="text-sm text-gray-300">Nous contactons les chauffeurs à proximité.</p>
               </div>
           )}

           {/* Map Area */}
           <div className="flex-1 bg-gray-200 dark:bg-gray-800 relative overflow-hidden rounded-3xl border-4 border-white dark:border-gray-700 shadow-inner">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#4b5563 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                 <div className="w-32 h-32 bg-indigo-500/10 rounded-full animate-ping absolute"></div>
                 <div className="w-4 h-4 bg-indigo-600 border-2 border-white rounded-full shadow-lg relative z-10"></div>
                 <div className="bg-white dark:bg-gray-900 px-3 py-1 rounded-full shadow-md mt-2 text-xs font-bold whitespace-nowrap">
                    Ma position
                 </div>
              </div>
              <button onClick={() => setMobilityView('home')} className="absolute top-4 left-4 bg-white dark:bg-gray-900 p-3 rounded-full shadow-lg z-20">
                <ArrowLeft size={20} className="text-gray-800 dark:text-white" />
              </button>
           </div>
           {/* Booking Panel */}
           <div className="bg-white dark:bg-gray-900 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] -mt-6 relative z-10 p-6 pb-24">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
              <div className="space-y-4 mb-6">
                 <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0"></div>
                    <input type="text" placeholder="D'où partez-vous ?" className="bg-transparent w-full outline-none text-sm font-bold text-gray-800 dark:text-white" defaultValue="Ma position actuelle" />
                 </div>
                 <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                    <div className="w-2 h-2 bg-orange-500 rounded-full shrink-0"></div>
                    <input type="text" placeholder="Où allez-vous ?" className="bg-transparent w-full outline-none text-sm font-bold text-gray-800 dark:text-white" autoFocus />
                 </div>
              </div>
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Choisir un véhicule</h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                 {['moto', 'taxi', 'vip'].map(type => (
                    <div key={type} onClick={() => setSelectedRide(type as any)} className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 cursor-pointer transition-all ${selectedRide === type ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-100 dark:border-gray-800'}`}>
                        {type === 'moto' && <Bike size={28} className={selectedRide === 'moto' ? 'text-indigo-600' : 'text-gray-400'} />}
                        {type === 'taxi' && <Car size={28} className={selectedRide === 'taxi' ? 'text-indigo-600' : 'text-gray-400'} />}
                        {type === 'vip' && <ShieldCheck size={28} className={selectedRide === 'vip' ? 'text-indigo-600' : 'text-gray-400'} />}
                        <span className="text-xs font-bold capitalize">{type}</span>
                        <span className="text-[10px] text-gray-500">{type === 'moto' ? '1500 FC' : type === 'taxi' ? '5000 FC' : '10$'}</span>
                    </div>
                 ))}
              </div>
              <button 
                  onClick={handleBookRide} 
                  disabled={searchingDriver}
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 active:scale-[0.98] transition-transform"
              >
                  Commander maintenant
              </button>
           </div>
        </div>
      );
    }

    if (mobilityView === 'rental') {
       return (
         <div className="animate-slide-left space-y-4 pb-20">
            <div className="flex items-center gap-2 px-2 mb-2">
               <button onClick={() => setMobilityView('home')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><ArrowLeft size={20}/></button>
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Location</h2>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl mx-2 flex gap-3 items-center">
               <Calendar size={24} className="text-blue-600" />
               <div className="flex-1">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase">Dates de location</p>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">24 Juin - 27 Juin</p>
               </div>
               <ChevronDown size={20} className="text-blue-400" />
            </div>
            <div className="space-y-4 px-2">
               {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4">
                     <div className="w-24 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden relative">
                        <img src={`https://picsum.photos/200/200?random=car${i}`} className="w-full h-full object-cover" alt="Car" />
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start">
                           <h3 className="font-bold text-gray-900 dark:text-white">Toyota Prado</h3>
                           <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">Dispo</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">Automatique • Diesel • 5 places</p>
                        <div className="flex justify-between items-end">
                           <span className="text-lg font-black text-blue-600">80$ <span className="text-xs font-normal text-gray-400">/jour</span></span>
                           <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold">Réserver</button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
       );
    }

    if (mobilityView === 'buy') {
       return (
         <div className="animate-slide-left space-y-4 pb-20">
            <div className="flex items-center gap-2 px-2 mb-2">
               <button onClick={() => setMobilityView('home')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><ArrowLeft size={20}/></button>
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Vente Auto</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-2">
               {['Tout', 'Toyota', 'Mercedes', 'Nissan', 'Hyundai'].map(b => (
                  <button key={b} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-bold whitespace-nowrap">{b}</button>
               ))}
            </div>
            <div className="grid grid-cols-2 gap-3 px-2">
               {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-700">
                     <div className="h-32 bg-gray-100 rounded-xl mb-3 overflow-hidden relative">
                        <img src={`https://picsum.photos/300/300?random=sell${i}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-md">2018</span>
                     </div>
                     <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">Mercedes C300</h3>
                     <p className="text-xs text-gray-500 mb-2">45,000 km</p>
                     <div className="flex justify-between items-center">
                        <span className="font-black text-green-600">12,500$</span>
                        <div className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-full"><ChevronRight size={14} /></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
       );
    }
    return null;
  };

  const renderEvents = () => (
    <div className="animate-slide-left space-y-4">
       {/* HEADER PINK */}
       <div className="-mt-6 mx-[-16px] bg-[#E11D48] px-4 pb-8 pt-4 rounded-b-[2.5rem] shadow-lg mb-6">
          <div className="bg-[#FDA4AF]/20 border border-white/20 rounded-2xl p-4 text-white flex items-center gap-4 mt-2">
             <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                <Music2 size={28} />
             </div>
             <div>
                <h3 className="font-bold text-lg leading-tight">Organisez vos événements</h3>
                <p className="text-xs text-pink-100 opacity-90 leading-snug">Trouvez les meilleurs prestataires pour vos mariages, anniversaires et conférences.</p>
             </div>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-6">
             {[
                { id: 'Tous', icon: null },
                { id: 'Agences', icon: Calendar },
                { id: 'Booking/DJ', icon: User },
                { id: 'Décoration', icon: Gift },
                { id: 'Traiteur', icon: Utensils }
             ].map((cat) => (
               <button
                  key={cat.id}
                  onClick={() => setEventFilter(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                     eventFilter === cat.id ? 'bg-[#0F172A] text-white shadow-md' : 'bg-white/90 text-gray-600'
                  }`}
               >
                  {cat.icon && <cat.icon size={14} />}
                  {cat.id}
               </button>
             ))}
          </div>
       </div>
       <div className="space-y-4 px-2 pb-20">
          {mockEventProviders.filter(p => eventFilter === 'Tous' || p.category === eventFilter).map((provider) => (
                <div key={provider.id} className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 animate-slide-up">
                   <div className="w-24 h-24 bg-gray-200 rounded-2xl relative overflow-hidden shrink-0">
                      <img src={provider.image} className="w-full h-full object-cover" alt={provider.name} />
                      <div className="absolute inset-0 bg-black/10"></div>
                   </div>
                   <div className="flex-1 flex flex-col justify-between">
                      <div>
                         <div className="flex justify-between items-start">
                            <span className="bg-[#E11D48] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1 inline-block">{provider.category.toUpperCase()}</span>
                            <div className="flex items-center gap-1 text-xs font-bold text-orange-400"><Star size={12} fill="currentColor" /> {provider.rating}</div>
                         </div>
                         <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight">{provider.name}</h3>
                         <p className="text-[#E11D48] text-[10px] font-bold uppercase tracking-wide mb-1">{provider.role}</p>
                         <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{provider.description}</p>
                      </div>
                      <div className="flex justify-between items-end mt-3">
                         <span className="text-xs font-bold text-gray-900 dark:text-white">{provider.price}</span>
                         <button onClick={() => showToast(`Demande de devis envoyée à ${provider.name}`)} className="flex items-center gap-1.5 bg-pink-50 dark:bg-pink-900/20 text-[#E11D48] dark:text-pink-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-pink-100 transition-colors"><Phone size={12} /> Réserver</button>
                      </div>
                   </div>
                </div>
             ))}
       </div>
    </div>
  );

  const renderAdministration = () => (
    <div className="animate-slide-left space-y-6 pb-24">
       <div className="-mt-6 mx-[-16px] bg-[#1e293b] px-4 pt-4 pb-8 rounded-b-[2.5rem] shadow-lg">
          <div className="bg-[#856848] rounded-2xl p-4 text-white flex gap-4 shadow-md mt-2 border border-white/10">
             <div className="bg-white/20 p-2.5 h-fit rounded-xl backdrop-blur-sm"><Landmark size={28} /></div>
             <div>
                <h3 className="font-bold text-lg leading-tight mb-1">Info Mairie</h3>
                <p className="text-xs opacity-90 leading-relaxed font-medium">La campagne de paiement de la taxe parcellaire se termine le 31 mars.</p>
             </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
             <div onClick={() => showToast("Mes dossiers: Aucun dossier")} className="bg-[#334155] p-3 rounded-2xl flex flex-col items-center justify-center gap-2 text-white shadow-md cursor-pointer hover:bg-[#475569] transition-colors border border-white/5 active:scale-95">
                <div className="relative"><Clock size={22} className="text-blue-300" /><span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#334155]"></span></div>
                <span className="text-[10px] font-bold text-center">Mes Dossiers</span>
             </div>
             <div onClick={() => showToast("Coffre-fort ouvert")} className="bg-[#334155] p-3 rounded-2xl flex flex-col items-center justify-center gap-2 text-white shadow-md cursor-pointer hover:bg-[#475569] transition-colors border border-white/5 active:scale-95">
                <Shield size={22} className="text-blue-300" /><span className="text-[10px] font-bold text-center">Coffre-fort</span>
             </div>
             <div onClick={() => showToast("Centre d'assistance contacté")} className="bg-[#334155] p-3 rounded-2xl flex flex-col items-center justify-center gap-2 text-white shadow-md cursor-pointer hover:bg-[#475569] transition-colors border border-white/5 active:scale-95">
                <HelpCircle size={22} className="text-blue-300" /><span className="text-[10px] font-bold text-center">Assistance</span>
             </div>
          </div>
       </div>
       <div className="px-4 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2"><FileText size={20} className="text-slate-600 dark:text-slate-400" /> Guides & Procédures</h3>
                <span className="text-xs text-gray-400 font-bold cursor-pointer">Voir tout</span>
             </div>
             <div className="space-y-4">
                <div onClick={() => showToast("Guide Passeport ouvert")} className="flex items-center gap-4 p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 rounded-2xl transition-colors">
                   <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-blue-600 dark:text-blue-400"><FileText size={20} /></div>
                   <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">Obtenir son Passeport</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Étapes, coûts et délais</p>
                   </div>
                   <ChevronRight size={18} className="text-gray-300" />
                </div>
                <div onClick={() => showToast("Guide Entreprise ouvert")} className="flex items-center gap-4 p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 rounded-2xl transition-colors">
                   <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl text-green-600 dark:text-green-400"><Briefcase size={20} /></div>
                   <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">Créer une Entreprise</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Guichet unique, RCCM</p>
                   </div>
                   <ChevronRight size={18} className="text-gray-300" />
                </div>
             </div>
          </div>
          <div className="bg-[#1e293b] rounded-[2.5rem] p-6 text-white text-center shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
             <h3 className="font-bold text-lg mb-2 relative z-10">Besoin d'un RDV ?</h3>
             <p className="text-slate-300 text-xs mb-6 relative z-10 px-4">Évitez la file d'attente à la mairie ou au service de l'urbanisme.</p>
             <button onClick={() => showToast("Module de rendez-vous bientôt disponible")} className="w-full bg-white text-[#1e293b] py-3.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors relative z-10">Prendre Rendez-vous</button>
          </div>
       </div>
    </div>
  );

  const renderFood = () => (
    <div className="animate-slide-left space-y-4">
       <div className="-mt-6 mx-[-16px] bg-[#EA580C] px-6 pb-6 pt-2 rounded-b-[2.5rem] shadow-lg mb-6">
          <div className="relative mb-6 mt-2">
             <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
             <input type="text" placeholder="Rechercher..." value={foodSearch} onChange={(e) => setFoodSearch(e.target.value)} className="w-full bg-white text-gray-800 placeholder-gray-400 pl-12 pr-4 py-3 rounded-2xl outline-none shadow-sm font-medium" />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
             {[{ id: 'Tout', icon: null }, { id: 'Restaurants', icon: Utensils }, { id: 'Fast-Food', icon: Coffee }, { id: 'Food Truck', icon: Truck }, { id: 'Local', icon: Flame }].map((cat) => (
               <button key={cat.id} onClick={() => setFoodFilter(cat.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${foodFilter === cat.id ? 'bg-white text-[#EA580C] shadow-md' : 'bg-[#C2410C] text-white/90 border border-[#9A3412]'}`}>
                  {cat.icon && <cat.icon size={14} />} {cat.id}
               </button>
             ))}
          </div>
       </div>
       <div className="space-y-4 px-2">
          {mockRestaurants.filter(r => (foodFilter === 'Tout' || r.category === foodFilter) && r.name.toLowerCase().includes(foodSearch.toLowerCase())).map((resto) => (
                <div key={resto.id} className="bg-white dark:bg-gray-800 rounded-[20px] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group cursor-pointer hover:shadow-md transition-all active:scale-[0.98]" onClick={() => showToast(`Menu de ${resto.name} ouvert`)}>
                   <div className="h-32 bg-gray-200 relative overflow-hidden">
                      <img src={resto.image} alt={resto.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/50 to-transparent"></div>
                      <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-[10px] font-bold uppercase backdrop-blur-md ${resto.isOpen ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>{resto.isOpen ? 'Ouvert' : 'Fermé'}</div>
                      <div className="absolute top-3 right-3 flex gap-2">
                         <div className="bg-white/90 dark:bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold"><Star size={10} className="text-yellow-500" fill="currentColor" /> {resto.rating}</div>
                         <div className="bg-white/90 dark:bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold"><Clock size={10} className="text-gray-500 dark:text-gray-300" /> {resto.time}</div>
                      </div>
                   </div>
                   <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                         <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{resto.name}</h3>
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{resto.type}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium"><MapPin size={12} className="text-[#EA580C]" /> {resto.location}</div>
                      <div className="flex flex-wrap gap-2">
                         {resto.tags.map(tag => (
                            <span key={tag} className="px-2.5 py-1 bg-orange-50 dark:bg-orange-900/20 text-[#EA580C] dark:text-orange-400 text-xs font-bold rounded-lg border border-orange-100 dark:border-orange-900/30">{tag}</span>
                         ))}
                      </div>
                   </div>
                </div>
             ))}
       </div>
    </div>
  );

  const renderLearning = () => {
    // Check for active course (mock)
    const activeCourse = mockCourses.find(c => c.progress && c.progress > 0);

    return (
      <div className="animate-slide-left space-y-6 pb-28 pt-2">
         {/* HEADER SECTION */}
         <div className="px-4">
            <div className="flex justify-between items-center mb-4">
               <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">Académie Numérique</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Développez vos compétences.</p>
               </div>
               <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                  <Search size={20} className="text-gray-600 dark:text-gray-300" />
               </div>
            </div>

            {/* CONTINUE LEARNING CARD */}
            {activeCourse && (
               <div className="bg-[#0F172A] rounded-[2rem] p-5 text-white shadow-xl shadow-gray-200 dark:shadow-none relative overflow-hidden group cursor-pointer hover:scale-[1.01] transition-transform">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  
                  <div className="flex justify-between items-start relative z-10 mb-4">
                     <div>
                        <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded backdrop-blur-md uppercase tracking-wider">En cours</span>
                        <h3 className="font-bold text-lg mt-2 leading-tight w-3/4">{activeCourse.title}</h3>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                        <Play size={16} fill="white" />
                     </div>
                  </div>

                  <div className="relative z-10">
                     <div className="flex justify-between text-xs text-gray-300 mb-1">
                        <span>Progression</span>
                        <span className="font-bold text-emerald-400">{activeCourse.progress}%</span>
                     </div>
                     <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                           className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out"
                           style={{ width: `${activeCourse.progress}%` }}
                        ></div>
                     </div>
                     <button className="mt-4 w-full py-2.5 bg-white text-[#0F172A] rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors">
                        Reprendre le cours
                     </button>
                  </div>
               </div>
            )}
         </div>

         {/* CATEGORIES GRID */}
         <div className="px-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Explorer par catégorie</h3>
            <div className="grid grid-cols-2 gap-3">
               {[
                  { name: 'Tech & Code', icon: Monitor, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
                  { name: 'Business', icon: BarChart, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
                  { name: 'Langues', icon: Globe, color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
                  { name: 'Design', icon: Zap, color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' },
               ].map((cat) => (
                  <div key={cat.name} className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 ${cat.color} bg-opacity-50`}>
                     <cat.icon size={24} />
                     <span className="text-xs font-bold">{cat.name}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
    );
  };

  const renderCleaning = () => (
     <div className="animate-slide-left space-y-4 px-2">
        {mockProviders.map((provider) => (
           <div key={provider.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4">
               <img src={provider.image} className="w-16 h-16 rounded-xl object-cover bg-gray-200" alt={provider.name} />
               <div className="flex-1">
                   <div className="flex justify-between items-start">
                       <h4 className="font-bold text-gray-900 dark:text-white">{provider.name}</h4>
                       <span className="flex items-center gap-1 text-xs font-bold text-yellow-500"><Star size={10} fill="currentColor"/> {provider.rating}</span>
                   </div>
                   <p className="text-xs font-bold text-lualaba-600 dark:text-lualaba-400 uppercase mb-1">{provider.role}</p>
                   <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{provider.description}</p>
                   <div className="mt-2 flex justify-between items-center">
                       <span className="font-bold text-sm text-gray-900 dark:text-white">{provider.price}</span>
                       <button onClick={() => showToast(`Contact avec ${provider.name} établi`)} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold">Contacter</button>
                   </div>
               </div>
           </div>
        ))}
     </div>
  );

  const renderBills = () => (
    <div className="animate-slide-left space-y-6 px-4">
        {/* Basic bill payment UI */}
        <div className="grid grid-cols-2 gap-4">
             {[
                 { id: 'water_elec', label: 'Eau & Élec', icon: Droplets, color: 'bg-blue-500' },
                 { id: 'internet', label: 'Internet', icon: Wifi, color: 'bg-indigo-500' },
                 { id: 'tv', label: 'Canal+', icon: Monitor, color: 'bg-green-500' },
                 { id: 'school', label: 'Frais Scolaires', icon: GraduationCap, color: 'bg-orange-500' },
             ].map((bill: any) => (
                 <button key={bill.id} onClick={() => setSelectedBillType(bill.id)} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-3 hover:scale-[1.02] transition-transform">
                     <div className={`w-12 h-12 rounded-xl ${bill.color} text-white flex items-center justify-center shadow-lg shadow-${bill.color}/30`}>
                         <bill.icon size={24} />
                     </div>
                     <span className="font-bold text-gray-800 dark:text-white">{bill.label}</span>
                 </button>
             ))}
        </div>
        {/* Payment Modal/Form if selected */}
        {selectedBillType && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg dark:text-white">Paiement</h3>
                    <button onClick={() => setSelectedBillType(null)}><X size={20} className="text-gray-400" /></button>
                </div>
                {!paymentSuccess ? (
                    <div className="space-y-4">
                        <input type="text" placeholder="Numéro de compteur / Carte" className="w-full bg-gray-50 dark:bg-gray-700 p-3 rounded-xl outline-none dark:text-white" />
                        <input type="number" placeholder="Montant (USD)" className="w-full bg-gray-50 dark:bg-gray-700 p-3 rounded-xl outline-none dark:text-white" value={amount} onChange={e => setAmount(e.target.value)} />
                        <button 
                            onClick={handlePayment} 
                            disabled={paymentProcessing}
                            className="w-full bg-lualaba-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                            {paymentProcessing ? <Loader2 size={20} className="animate-spin" /> : 'Payer maintenant'}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-6 text-green-500">
                        <CheckCircle size={48} className="mb-2" />
                        <span className="font-bold">Paiement Réussi !</span>
                    </div>
                )}
            </div>
        )}
    </div>
  );

  const renderGeneric = () => (
    <div className="p-8 text-center text-gray-400 dark:text-gray-500 flex flex-col items-center">
        <Wrench size={48} className="mb-4 opacity-50" />
        <h3 className="font-bold text-lg text-gray-600 dark:text-gray-300 mb-2">{genericTitle}</h3>
        <p>Ce service sera bientôt disponible sur Lualaba Connect.</p>
    </div>
  );

  const renderCatalog = () => (
    <div className="grid grid-cols-2 gap-4 px-4 pb-20 animate-slide-up">
        {[
            { id: 'ride', label: 'Mobilité', icon: Car, color: 'bg-blue-500', desc: 'Taxi, Moto, Location' },
            { id: 'food', label: 'Resto', icon: Utensils, color: 'bg-orange-500', desc: 'Livraison repas' },
            { id: 'cleaning', label: 'Ménage', icon: Sparkles, color: 'bg-teal-500', desc: 'Nettoyage, Aide' },
            { id: 'bills', label: 'Factures', icon: Wallet, color: 'bg-green-500', desc: 'Eau, Élec, TV' },
            { id: 'learning', label: 'Formation', icon: GraduationCap, color: 'bg-purple-500', desc: 'Cours en ligne' },
            { id: 'events', label: 'Évents', icon: Music, color: 'bg-pink-500', desc: 'Billets, Org.' },
            { id: 'administration', label: 'Mairie', icon: Landmark, color: 'bg-slate-500', desc: 'Docs, Taxes' },
            { id: 'repair', label: 'Réparation', icon: Wrench, color: 'bg-red-500', desc: 'Plomberie, Auto', action: () => openGeneric('Réparation & Dépannage') },
        ].map((service: any) => (
            <div 
                key={service.id} 
                onClick={() => service.action ? service.action() : setCurrentView(service.id)}
                className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all active:scale-[0.98] group"
            >
                <div className={`w-10 h-10 ${service.color} rounded-xl flex items-center justify-center text-white mb-3 shadow-lg shadow-${service.color}/20 group-hover:scale-110 transition-transform`}>
                    <service.icon size={20} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">{service.label}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{service.desc}</p>
            </div>
        ))}
    </div>
  );

  // Main Return
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-y-auto custom-scrollbar transition-colors duration-300 relative">
      <div className="bg-white dark:bg-gray-800 px-4 pt-4 pb-4 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-20 flex items-center gap-3">
         <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <ArrowLeft size={24} className="text-gray-800 dark:text-white" />
         </button>
         <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {currentView === 'catalog' ? 'Services' : 
             currentView === 'ride' ? 'Mobilité' :
             currentView === 'food' ? 'Restauration' :
             currentView === 'learning' ? 'Formation' :
             currentView === 'events' ? 'Événements' :
             currentView === 'administration' ? 'Administration' :
             currentView === 'cleaning' ? 'Ménage & Aide' :
             currentView === 'bills' ? 'Factures' : genericTitle}
         </h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pt-4">
         {currentView === 'catalog' && renderCatalog()}
         {currentView === 'ride' && renderRide()}
         {currentView === 'food' && renderFood()}
         {currentView === 'events' && renderEvents()}
         {currentView === 'learning' && renderLearning()}
         {currentView === 'administration' && renderAdministration()}
         {currentView === 'cleaning' && renderCleaning()}
         {currentView === 'bills' && renderBills()}
         {currentView === 'generic' && renderGeneric()}
      </div>
    </div>
  );
};