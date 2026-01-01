import React, { useState } from 'react';
import { 
  ArrowLeft, Thermometer, Share2, Bookmark, 
  Lightbulb, ShieldAlert, Smartphone, Droplets, 
  Sun, ChevronRight, HardHat, Battery
} from 'lucide-react';

interface AdviceModuleProps {
  onBack: () => void;
}

interface Tip {
  id: number;
  category: 'Santé' | 'Sécurité' | 'Tech' | 'Vie Pratique';
  title: string;
  content: string;
  icon: any;
  color: string;
  isFeatured?: boolean;
}

const mockTips: Tip[] = [
  {
    id: 1,
    category: 'Santé',
    title: 'Pic de chaleur prévu',
    content: "Aujourd'hui, la température ressentie atteindra 32°C. Buvez au moins 2L d'eau, évitez l'exposition directe entre 12h et 15h, et portez des vêtements légers.",
    icon: Thermometer,
    color: 'bg-teal-500',
    isFeatured: true
  },
  {
    id: 2,
    category: 'Sécurité',
    title: 'Poussière sur la route',
    content: "La route vers Musompo est très poussiéreuse en ce moment. Si vous circulez à moto, le port du masque et des lunettes est vivement recommandé pour éviter les infections respiratoires.",
    icon: HardHat,
    color: 'bg-orange-500'
  },
  {
    id: 3,
    category: 'Tech',
    title: 'Économiser sa batterie',
    content: "En zone de faible réseau (H+), votre téléphone consomme 2x plus. Basculez en mode 'Économie d'énergie' ou forcez la 3G si la 4G est instable.",
    icon: Battery,
    color: 'bg-blue-500'
  },
  {
    id: 4,
    category: 'Vie Pratique',
    title: 'Coupures d\'eau',
    content: "Des travaux sont signalés sur le réseau REGIDESO quartier Joli Site. Pensez à faire des réserves d'eau pour les 24h à venir.",
    icon: Droplets,
    color: 'bg-blue-400'
  }
];

export const AdviceModule: React.FC<AdviceModuleProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Tout');
  const [savedTips, setSavedTips] = useState<number[]>([]);

  const toggleSave = (id: number) => {
    if (savedTips.includes(id)) {
      setSavedTips(savedTips.filter(tid => tid !== id));
    } else {
      setSavedTips([...savedTips, id]);
    }
  };

  const filteredTips = activeCategory === 'Tout' 
    ? mockTips.filter(t => !t.isFeatured) 
    : mockTips.filter(t => t.category === activeCategory);

  const featuredTip = mockTips.find(t => t.isFeatured);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-y-auto custom-scrollbar transition-colors duration-300">
      
      {/* Header Teal Section */}
      <div className="bg-teal-600 dark:bg-teal-800 px-4 pt-4 pb-8 rounded-b-[2.5rem] shadow-lg relative z-10 transition-colors">
        <div className="flex items-center gap-3 mb-6">
           <button 
             onClick={onBack}
             className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
           >
             <ArrowLeft size={24} />
           </button>
           <h2 className="text-xl font-bold text-white">Conseils Utiles</h2>
        </div>

        {/* Featured Tip Card */}
        {featuredTip && (
           <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-xl animate-slide-up relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 dark:bg-teal-900/50 rounded-full -mr-10 -mt-10 opacity-50"></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                 <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${featuredTip.color} text-white`}>
                       <featuredTip.icon size={24} />
                    </div>
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-lg">Conseil du Jour</span>
                 </div>
                 <button className="text-gray-400 hover:text-teal-600 dark:hover:text-teal-400">
                    <Share2 size={20} />
                 </button>
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 leading-tight">{featuredTip.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                 {featuredTip.content}
              </p>

              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                 <Sun size={14} className="text-orange-400" /> Aujourd'hui • Météo
              </div>
           </div>
        )}
      </div>

      <div className="px-4 -mt-4 pb-24 space-y-6 relative z-20">
         
         {/* Categories */}
         <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
            {['Tout', 'Santé', 'Sécurité', 'Tech', 'Vie Pratique'].map(cat => (
               <button 
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                   activeCategory === cat 
                     ? 'bg-teal-600 text-white shadow-md' 
                     : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700'
                 }`}
               >
                 {cat}
               </button>
            ))}
         </div>

         {/* Tip List */}
         <div className="space-y-4">
            {filteredTips.map(tip => (
               <div key={tip.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${tip.color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center shrink-0`}>
                     <tip.icon size={24} className={tip.color.replace('bg-', 'text-')} />
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{tip.category}</span>
                        <button onClick={() => toggleSave(tip.id)}>
                           <Bookmark size={18} className={savedTips.includes(tip.id) ? "fill-teal-500 text-teal-500" : "text-gray-300 hover:text-gray-500"} />
                        </button>
                     </div>
                     <h4 className="font-bold text-gray-900 dark:text-white mb-1">{tip.title}</h4>
                     <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                        {tip.content}
                     </p>
                  </div>
               </div>
            ))}
            
            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg shadow-teal-500/20">
               <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                     <Lightbulb size={24} />
                  </div>
                  <div>
                     <h4 className="font-bold text-sm">Vous avez une astuce ?</h4>
                     <p className="text-xs opacity-90">Partagez-la avec la communauté</p>
                  </div>
               </div>
               <button className="bg-white text-teal-600 px-4 py-2 rounded-lg text-xs font-bold shadow-sm">
                  Proposer
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
