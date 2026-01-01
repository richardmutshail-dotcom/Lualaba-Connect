import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Heart, MessageCircle, Share2, 
  MoreHorizontal, CheckCircle, Bell, Filter, Edit3, Image as ImageIcon, Send, X, BellOff, Camera
} from 'lucide-react';

interface FeedModuleProps {
  onBack: () => void;
}

// Extended Mock Data for the full feed
const initialFeedData = [
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
  },
  {
    id: 4,
    type: 'news',
    author: 'Radio Okapi',
    avatar: 'https://picsum.photos/50/50?random=okapi',
    time: 'Il y a 5h',
    content: 'Sport : Le TP Mazembe affronte ce week-end le Saint Éloi Lupopo dans un derby qui s\'annonce électrique au stade Kibassa Maliba.',
    image: 'https://picsum.photos/500/300?random=stade',
    likes: 840,
    comments: 210,
    isVerified: true,
    isLiked: false
  },
  {
    id: 5,
    type: 'user',
    author: 'Jeunes Entrepreneurs Lualaba',
    avatar: 'https://picsum.photos/50/50?random=young',
    time: 'Il y a 6h',
    content: 'Nous organisons une formation gratuite sur l\'entrepreneuriat numérique ce samedi à la salle Hewa Bora. Inscrivez-vous ! 💻🚀',
    likes: 89,
    comments: 34,
    isVerified: false,
    isLiked: false
  },
  {
    id: 6,
    type: 'alert',
    author: 'Météo Lualaba',
    avatar: 'https://picsum.photos/50/50?random=weather',
    time: 'Il y a 1h',
    content: '⛈️ Alerte Orage : De fortes pluies sont attendues en fin d\'après-midi sur Kolwezi. Prudence sur les routes.',
    likes: 112,
    comments: 5,
    isVerified: true,
    isLiked: false
  }
];

export const FeedModule: React.FC<FeedModuleProps> = ({ onBack }) => {
  const [feed, setFeed] = useState(initialFeedData);
  const [activeFilter, setActiveFilter] = useState<'all' | 'news' | 'user' | 'alert'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Interaction States
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [commentModalPostId, setCommentModalPostId] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Posting State
  const [showPostModal, setShowPostModal] = useState(false);
  const [postContent, setPostContent] = useState('');

  // --- HANDLERS ---

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleLike = (id: number) => {
    setFeed(prev => prev.map(post => {
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

  const handleShare = async (post: any) => {
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
      showToast("Lien copié dans le presse-papier !");
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    showToast(notificationsEnabled ? "Notifications désactivées" : "Notifications activées");
  };

  const handleOpenComments = (id: number) => {
    setCommentModalPostId(id);
  };

  const handleSubmitComment = () => {
    if (!commentInput.trim() || !commentModalPostId) return;
    
    // Update local state to simulate adding a comment
    setFeed(prev => prev.map(post => {
      if (post.id === commentModalPostId) {
        return { ...post, comments: post.comments + 1 };
      }
      return post;
    }));

    setCommentInput('');
    setCommentModalPostId(null);
    showToast("Commentaire ajouté !");
  };

  const handleCreatePost = () => {
    if (!postContent.trim()) return;
    
    const newPost = {
        id: Date.now(),
        type: 'user',
        author: 'Vous',
        avatar: 'https://picsum.photos/50/50?random=user',
        time: 'À l\'instant',
        content: postContent,
        likes: 0,
        comments: 0,
        isVerified: false,
        isLiked: false
    };
    
    setFeed([newPost, ...feed]);
    setPostContent('');
    setShowPostModal(false);
    showToast("Publication envoyée !");
  };

  const filteredFeed = feed.filter(post => {
    const matchesFilter = activeFilter === 'all' || post.type === activeFilter;
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // --- SUB-COMPONENTS ---
  const PostModal = () => (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative animate-slide-up">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Créer une publication</h3>
                  <button onClick={() => setShowPostModal(false)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <X size={20} className="text-gray-600 dark:text-gray-300" />
                  </button>
              </div>
              
              <div className="flex gap-3 mb-4">
                 <img src="https://picsum.photos/50/50?random=user" className="w-10 h-10 rounded-full object-cover" alt="User" />
                 <div className="flex-1">
                     <p className="font-bold text-gray-900 dark:text-white text-sm">Vous</p>
                     <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 w-fit px-2 py-0.5 rounded-full mt-0.5">
                         <span>Public</span>
                     </div>
                 </div>
              </div>

              <textarea 
                 value={postContent}
                 onChange={(e) => setPostContent(e.target.value)}
                 placeholder="Quoi de neuf ?"
                 className="w-full h-32 bg-transparent text-lg text-gray-900 dark:text-white placeholder-gray-400 outline-none resize-none mb-4"
                 autoFocus
              />

              <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-4">
                  <div className="flex gap-2 text-gray-500 dark:text-gray-400">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><ImageIcon size={20} /></button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><Camera size={20} /></button>
                  </div>
                  <button 
                     onClick={handleCreatePost}
                     disabled={!postContent.trim()}
                     className="bg-lualaba-600 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-lualaba-600/30 disabled:opacity-50 disabled:shadow-none hover:bg-lualaba-700 transition-all"
                  >
                     Publier
                  </button>
              </div>
          </div>
      </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-y-auto custom-scrollbar transition-colors duration-300 relative">
      
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold animate-fade-in flex items-center gap-2">
           <CheckCircle size={16} className="text-green-400" /> {toast}
        </div>
      )}

      {/* POST MODAL */}
      {showPostModal && PostModal()}

      {/* COMMENT MODAL */}
      {commentModalPostId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
           <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl p-4 shadow-2xl animate-slide-up">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                 <h3 className="font-bold text-gray-900 dark:text-white">Commentaires</h3>
                 <button onClick={() => setCommentModalPostId(null)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <X size={20} className="text-gray-500" />
                 </button>
              </div>
              
              <div className="max-h-60 overflow-y-auto mb-4 space-y-3">
                 {/* Fake comments for demo */}
                 <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                    <div className="bg-gray-100 dark:bg-gray-700/50 p-2 rounded-xl rounded-tl-none">
                       <p className="text-xs font-bold text-gray-900 dark:text-white">Jean K.</p>
                       <p className="text-sm text-gray-700 dark:text-gray-300">Super initiative ! 👏</p>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                    <div className="bg-gray-100 dark:bg-gray-700/50 p-2 rounded-xl rounded-tl-none">
                       <p className="text-xs font-bold text-gray-900 dark:text-white">Sarah M.</p>
                       <p className="text-sm text-gray-700 dark:text-gray-300">C'est exactement ce qu'il fallait.</p>
                    </div>
                 </div>
              </div>

              <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={commentInput}
                   onChange={(e) => setCommentInput(e.target.value)}
                   placeholder="Écrivez votre commentaire..."
                   className="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-lualaba-500 outline-none text-gray-800 dark:text-white"
                   autoFocus
                 />
                 <button 
                    onClick={handleSubmitComment}
                    disabled={!commentInput.trim()}
                    className="bg-lualaba-600 text-white p-3 rounded-xl hover:bg-lualaba-700 disabled:opacity-50 transition-colors"
                 >
                    <Send size={20} />
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 px-4 pt-4 pb-4 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-4">
           <button 
             onClick={onBack}
             className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
           >
             <ArrowLeft size={24} className="text-gray-800 dark:text-white" />
           </button>
           <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fil d'actualité</h2>
           <div className="ml-auto flex gap-2">
              <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                 <Search size={20} />
              </button>
              <button 
                onClick={toggleNotifications}
                className={`p-2 rounded-full transition-colors ${notificationsEnabled ? 'bg-lualaba-50 dark:bg-lualaba-900/20 text-lualaba-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}
              >
                 {notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
              </button>
           </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
           {[
             { id: 'all', label: 'Tout' },
             { id: 'news', label: 'Infos Officielles' },
             { id: 'user', label: 'Communauté' },
             { id: 'alert', label: 'Alertes' },
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveFilter(tab.id as any)}
               className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                 activeFilter === tab.id 
                   ? 'bg-lualaba-600 text-white shadow-md' 
                   : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
               }`}
             >
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      {/* Post Composer Teaser */}
      <div onClick={() => setShowPostModal(true)} className="px-4 py-4 bg-white dark:bg-gray-800 mb-2 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 cursor-pointer">
         <img src="https://picsum.photos/200/200?random=user" className="w-10 h-10 rounded-full" alt="Me" />
         <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors pointer-events-none">
            Quoi de neuf à Kolwezi ?
         </div>
         <button className="p-2 text-lualaba-600 dark:text-lualaba-400 hover:bg-lualaba-50 dark:hover:bg-lualaba-900/10 rounded-full">
            <ImageIcon size={24} />
         </button>
      </div>

      {/* Feed Content */}
      <div className="px-4 pb-24 space-y-4 pt-2">
         {filteredFeed.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up">
               {/* Post Header */}
               <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                     <img src={post.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-600" alt={post.author} />
                     <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1">
                           {post.author}
                           {post.isVerified && <CheckCircle size={12} className="text-blue-500 fill-blue-500 text-white" />}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                           <span>{post.time}</span>
                           {post.type === 'alert' && (
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-bold uppercase text-[9px]">Alerte</span>
                           )}
                           {post.type === 'news' && (
                              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase text-[9px]">Info</span>
                           )}
                        </div>
                     </div>
                  </div>
                  <button className="text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full"><MoreHorizontal size={20} /></button>
               </div>
               
               {/* Content */}
               <p className="text-sm text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">
                  {post.content}
               </p>
               
               {/* Image */}
               {post.image && (
                  <div className="rounded-xl overflow-hidden mb-3 border border-gray-100 dark:border-gray-700">
                     <img src={post.image} className="w-full h-auto object-cover max-h-72" alt="Post" />
                  </div>
               )}
               
               {/* Actions */}
               <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-700/50">
                  <div className="flex items-center gap-6">
                     <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-bold transition-colors group ${post.isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'}`}
                     >
                        <Heart size={20} className={`transition-transform group-hover:scale-110 ${post.isLiked ? 'fill-current' : ''}`} /> 
                        <span>{post.likes}</span>
                     </button>
                     <button 
                        onClick={() => handleOpenComments(post.id)}
                        className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs font-bold hover:text-blue-500 transition-colors group"
                     >
                        <MessageCircle size={20} className="group-hover:scale-110 transition-transform" /> 
                        <span>{post.comments}</span>
                     </button>
                  </div>
                  <button 
                     onClick={() => handleShare(post)}
                     className="text-gray-400 hover:text-lualaba-600 transition-colors hover:bg-lualaba-50 dark:hover:bg-lualaba-900/20 p-2 rounded-full"
                  >
                     <Share2 size={20} />
                  </button>
               </div>
            </div>
         ))}

         {filteredFeed.length === 0 && (
            <div className="py-12 text-center text-gray-400 dark:text-gray-500">
               <p>Aucune publication trouvée dans cette catégorie.</p>
            </div>
         )}
      </div>

      {/* FAB Post Button */}
      <button 
        onClick={() => setShowPostModal(true)}
        className="fixed bottom-6 right-6 z-30 bg-lualaba-600 text-white p-4 rounded-full shadow-lg shadow-lualaba-600/40 hover:scale-105 active:scale-95 transition-transform"
      >
         <Edit3 size={24} />
      </button>

    </div>
  );
};