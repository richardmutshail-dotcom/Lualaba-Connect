import React, { useState } from 'react';
import { 
  ArrowLeft, Search, FileText, Briefcase, Megaphone, 
  MapPin, Clock, X, CheckCircle, Plus, Tag, Image as ImageIcon, Send
} from 'lucide-react';

interface JobsModuleProps {
  onBack: () => void;
}

// Interfaces
interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  date: string;
  isUrgent: boolean;
}

interface Ad {
  id: number;
  title: string;
  category: string;
  price: string;
  location: string;
  date: string;
  seller: string;
}

// Initial Mock Data
const initialJobs: Job[] = [
  { id: 1, title: 'Vendeuse Boutique', company: 'LUBUM MODE', location: 'Centre-Ville', type: 'Temps plein', salary: '250$', date: 'Hier', isUrgent: false },
  { id: 2, title: 'Chauffeur Privé', company: 'PARTICULIER', location: 'Golf', type: 'Temps partiel', salary: '150$', date: "Aujourd'hui", isUrgent: true },
  { id: 3, title: 'Comptable', company: 'MINING CORP', location: 'Route Likasi', type: 'CDI', salary: '800$', date: 'Il y a 2j', isUrgent: false }
];

const initialAds: Ad[] = [
  { id: 1, title: 'Parcelle 20x20', category: 'Immobilier', price: '15,000$', location: 'Joli Site', date: 'Hier', seller: 'Papa Jean' },
  { id: 2, title: 'Toyota IST', category: 'Véhicule', price: '4,500$', location: 'Mutoshi', date: "Aujourd'hui", seller: 'Auto Deal' },
];

export const JobsModule: React.FC<JobsModuleProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'ads'>('jobs');
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [ads, setAds] = useState<Ad[]>(initialAds);
  
  // Modals State
  const [modalType, setModalType] = useState<'cv' | 'postJob' | 'postAd' | 'apply' | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Form States
  const [newJob, setNewJob] = useState({ title: '', company: '', salary: '', location: '' });
  const [newAd, setNewAd] = useState({ title: '', price: '', category: '', location: '' });
  const [cvData, setCvData] = useState({ name: '', phone: '', skills: '' });

  // Helpers
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handlePostJob = () => {
    if (!newJob.title || !newJob.company) return;
    const job: Job = {
        id: Date.now(),
        title: newJob.title,
        company: newJob.company,
        location: newJob.location || 'Kolwezi',
        salary: newJob.salary || 'À discuter',
        type: 'Temps plein',
        date: "A l'instant",
        isUrgent: true
    };
    setJobs([job, ...jobs]);
    setModalType(null);
    setNewJob({ title: '', company: '', salary: '', location: '' });
    showToast("Offre d'emploi publiée avec succès !");
    setActiveTab('jobs');
  };

  const handlePostAd = () => {
    if (!newAd.title || !newAd.price) return;
    const ad: Ad = {
        id: Date.now(),
        title: newAd.title,
        price: newAd.price,
        category: newAd.category || 'Divers',
        location: newAd.location || 'Kolwezi',
        date: "A l'instant",
        seller: 'Moi'
    };
    setAds([ad, ...ads]);
    setModalType(null);
    setNewAd({ title: '', price: '', category: '', location: '' });
    showToast("Petite annonce publiée !");
    setActiveTab('ads');
  };

  const handleSendCV = () => {
    setModalType(null);
    showToast("CV Express généré et envoyé aux recruteurs !");
  };

  const handleApply = () => {
    setModalType(null);
    showToast(`Candidature envoyée chez ${selectedJob?.company}`);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-y-auto custom-scrollbar transition-colors duration-300 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl z-50 flex items-center gap-2 animate-fade-in">
            <CheckCircle size={18} className="text-green-400" />
            <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      {/* Header Section (Purple) */}
      <div className="bg-[#8b5cf6] dark:bg-[#6d28d9] px-4 pt-4 pb-8 rounded-b-[2.5rem] shadow-lg relative z-10 transition-colors">
        <div className="flex items-center gap-3 mb-6 text-white">
           <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
             <ArrowLeft size={24} />
           </button>
           <h2 className="text-xl font-bold">Emploi & Annonce</h2>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
           <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
           <input 
             type="text" 
             placeholder={activeTab === 'jobs' ? "Job, terrain, vente..." : "Chercher une annonce..."}
             className="w-full bg-white text-gray-800 placeholder-gray-400 pl-11 pr-4 py-3.5 rounded-2xl outline-none shadow-sm text-sm"
           />
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-3 gap-3 mb-2">
            <ActionButton icon={FileText} label="CV Express" onClick={() => setModalType('cv')} />
            <ActionButton icon={Briefcase} label="Déposer Job" onClick={() => setModalType('postJob')} />
            <ActionButton icon={Megaphone} label="Publier Annonce" onClick={() => setModalType('postAd')} />
        </div>
      </div>

      <div className="px-4 -mt-4 pb-24 space-y-6 relative z-20">
        
        {/* Toggle Switch */}
        <div className="bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 flex relative">
            <button onClick={() => setActiveTab('jobs')} className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all z-10 ${activeTab === 'jobs' ? 'text-white' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'}`}>
                Offres d'emploi
            </button>
            <button onClick={() => setActiveTab('ads')} className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all z-10 ${activeTab === 'ads' ? 'text-white' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'}`}>
                Petites Annonces
            </button>
            <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#0F172A] dark:bg-white rounded-full transition-all duration-300 ease-out ${activeTab === 'jobs' ? 'left-1.5' : 'left-[calc(50%+3px)]'}`}></div>
             <style>{`.dark button.text-white { color: #000 !important; }`}</style>
        </div>

        {/* Content Lists */}
        <div className="space-y-4 min-h-[300px]">
            {activeTab === 'jobs' ? (
                jobs.length > 0 ? jobs.map(job => (
                    <JobCard key={job.id} job={job} onApply={() => { setSelectedJob(job); setModalType('apply'); }} />
                )) : <EmptyState message="Aucune offre d'emploi pour le moment." />
            ) : (
                ads.length > 0 ? ads.map(ad => (
                    <AdCard key={ad.id} ad={ad} />
                )) : <EmptyState message="Aucune petite annonce pour le moment." />
            )}
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* 1. CV Express Modal */}
      {modalType === 'cv' && (
        <Modal title="CV Express" onClose={() => setModalType(null)}>
           <div className="space-y-4">
              <p className="text-sm text-gray-500">Créez un mini-profil visible par tous les recruteurs locaux.</p>
              <Input label="Nom Complet" value={cvData.name} onChange={v => setCvData({...cvData, name: v})} />
              <Input label="Téléphone" value={cvData.phone} onChange={v => setCvData({...cvData, phone: v})} />
              <div>
                 <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Compétences / Métier</label>
                 <textarea 
                    className="w-full bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-sm border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-[#8b5cf6]"
                    rows={3}
                    placeholder="Ex: Maçonnerie, Vente, Informatique..."
                    value={cvData.skills}
                    onChange={e => setCvData({...cvData, skills: e.target.value})}
                 />
              </div>
              <PrimaryButton onClick={handleSendCV} label="Diffuser mon CV" />
           </div>
        </Modal>
      )}

      {/* 2. Post Job Modal */}
      {modalType === 'postJob' && (
        <Modal title="Déposer une Offre" onClose={() => setModalType(null)}>
           <div className="space-y-4">
              <Input label="Titre du poste" placeholder="Ex: Chauffeur" value={newJob.title} onChange={v => setNewJob({...newJob, title: v})} />
              <Input label="Entreprise" placeholder="Ex: Mining SARL" value={newJob.company} onChange={v => setNewJob({...newJob, company: v})} />
              <div className="flex gap-3">
                 <div className="flex-1"><Input label="Salaire" placeholder="Ex: 500$" value={newJob.salary} onChange={v => setNewJob({...newJob, salary: v})} /></div>
                 <div className="flex-1"><Input label="Lieu" placeholder="Ex: Kolwezi" value={newJob.location} onChange={v => setNewJob({...newJob, location: v})} /></div>
              </div>
              <PrimaryButton onClick={handlePostJob} label="Publier l'offre" />
           </div>
        </Modal>
      )}

      {/* 3. Post Ad Modal */}
      {modalType === 'postAd' && (
        <Modal title="Publier une Annonce" onClose={() => setModalType(null)}>
           <div className="space-y-4">
              <Input label="Titre / Objet" placeholder="Ex: Parcelle à vendre" value={newAd.title} onChange={v => setNewAd({...newAd, title: v})} />
              <div className="flex gap-3">
                 <div className="flex-1"><Input label="Prix" placeholder="Ex: 50$" value={newAd.price} onChange={v => setNewAd({...newAd, price: v})} /></div>
                 <div className="flex-1"><Input label="Catégorie" placeholder="Immo, Auto..." value={newAd.category} onChange={v => setNewAd({...newAd, category: v})} /></div>
              </div>
              <Input label="Lieu" placeholder="Ex: Mutoshi" value={newAd.location} onChange={v => setNewAd({...newAd, location: v})} />
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <ImageIcon size={24} className="mb-1"/>
                  <span className="text-xs">Ajouter une photo</span>
              </div>
              
              <PrimaryButton onClick={handlePostAd} label="Publier l'annonce" />
           </div>
        </Modal>
      )}

      {/* 4. Apply Modal */}
      {modalType === 'apply' && selectedJob && (
         <Modal title={`Postuler : ${selectedJob.title}`} onClose={() => setModalType(null)}>
            <div className="text-center space-y-4">
               <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center text-gray-500 dark:text-gray-300">
                  <Briefcase size={32} />
               </div>
               <p className="text-sm text-gray-600 dark:text-gray-300">
                  Vous êtes sur le point d'envoyer votre profil Lualaba Connect à <strong>{selectedJob.company}</strong>.
               </p>
               <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-left text-sm border border-gray-100 dark:border-gray-600">
                  <p><strong>Inclus :</strong> Votre nom, téléphone et dernier CV Express.</p>
               </div>
               <PrimaryButton onClick={handleApply} label="Confirmer et Envoyer" icon={Send} />
            </div>
         </Modal>
      )}

    </div>
  );
};

// --- Sub Components ---

const ActionButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
    <button onClick={onClick} className="bg-[#7c3aed] dark:bg-[#5b21b6] p-3 rounded-2xl flex flex-col items-center justify-center gap-2 text-white hover:bg-[#6d28d9] transition-colors border border-white/10 shadow-sm active:scale-95">
        <Icon size={22} strokeWidth={2} />
        <span className="text-[10px] font-bold text-center leading-tight">{label}</span>
    </button>
);

const JobCard: React.FC<{ job: Job, onApply: () => void }> = ({ job, onApply }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up">
        <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{job.title}</h3>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${job.isUrgent ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'}`}>
                {job.date}
            </span>
        </div>
        
        <p className="text-[#7c3aed] dark:text-[#a78bfa] text-xs font-bold uppercase mb-3 tracking-wide flex items-center gap-1">
            <Briefcase size={12} /> {job.company}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{job.type}</span>
            </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
            <span className="font-black text-xl text-gray-900 dark:text-white">
                {job.salary}
            </span>
            <button onClick={onApply} className="bg-[#0F172A] dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-transform active:scale-95">
                Postuler
            </button>
        </div>
    </div>
);

const AdCard: React.FC<{ ad: Ad }> = ({ ad }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up flex gap-3">
        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-xl shrink-0 relative overflow-hidden">
             <img src={`https://picsum.photos/150/150?random=${ad.id + 100}`} className="w-full h-full object-cover" alt="Ad" />
             <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                 {ad.category}
             </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2">{ad.title}</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1"><MapPin size={10} /> {ad.location}</p>
            </div>
            <div className="flex justify-between items-end mt-2">
                <span className="font-black text-lg text-lualaba-600 dark:text-lualaba-400">{ad.price}</span>
                <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                    <Megaphone size={16} />
                </button>
            </div>
        </div>
    </div>
);

const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
        <Tag size={48} className="mb-4 opacity-50" />
        <p className="text-sm">{message}</p>
    </div>
);

const Modal = ({ title, onClose, children }: { title: string, onClose: () => void, children?: React.ReactNode }) => (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-slide-up">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <X size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
            </div>
            {children}
        </div>
    </div>
);

const Input = ({ label, placeholder, value, onChange }: any) => (
    <div>
        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{label}</label>
        <input 
            type="text" 
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-sm border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-[#8b5cf6] dark:text-white transition-all"
        />
    </div>
);

const PrimaryButton = ({ onClick, label, icon: Icon }: any) => (
    <button 
        onClick={onClick}
        className="w-full bg-[#8b5cf6] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:bg-[#7c3aed] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
    >
        {Icon && <Icon size={18} />}
        {label}
    </button>
);