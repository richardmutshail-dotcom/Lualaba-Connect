import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Music2, Plus, Play, X, Send, Download, Link as LinkIcon, Check, Volume2, VolumeX } from 'lucide-react';

// --- MOCK DATA ---

const initialVideos = [
  {
    id: 1,
    username: 'LualabaTourisme',
    desc: 'Découvrez les chutes de Musompo ! 🌊🇨🇩 #Lualaba #Nature #RDC',
    song: 'Fally Ipupa - Amore',
    likes: 12000,
    comments: 450,
    shares: 2100,
    videoUrl: 'https://videos.pexels.com/video-files/3571264/3571264-hd_1080_1920_30fps.mp4', // Waterfall
    isLiked: false,
    isFollowed: false,
    commentsList: [
        { id: 1, user: 'Jean Marc', text: 'Magnifique endroit ! 😍', time: '2m' },
        { id: 2, user: 'Sarah K.', text: 'C\'est où exactement ?', time: '10m' }
    ]
  },
  {
    id: 2,
    username: 'KolweziVibes',
    desc: 'Ambiance au marché ce matin 🔥 Les prix sont bons !',
    song: 'Son original - KolweziVibes',
    likes: 8500,
    comments: 120,
    shares: 500,
    videoUrl: 'https://videos.pexels.com/video-files/2882772/2882772-hd_1080_1920_30fps.mp4', // Market/Workers vibe
    isLiked: false,
    isFollowed: true,
    commentsList: [
        { id: 1, user: 'Papa Paul', text: 'On arrive !', time: '1h' }
    ]
  },
  {
    id: 3,
    username: 'MineurDuFutur',
    desc: 'Sécurité avant tout à la mine KCC 👷🏾‍♂️⚙️',
    song: 'Dadju - Ambassadeur',
    likes: 25000,
    comments: 1200,
    shares: 5000,
    videoUrl: 'https://videos.pexels.com/video-files/5849605/5849605-hd_1080_1920_30fps.mp4', // Construction/Industrial
    isLiked: false,
    isFollowed: false,
    commentsList: []
  }
];

export const VideoFeedModule: React.FC = () => {
  const [videos, setVideos] = useState(initialVideos);
  const [activeTab, setActiveTab] = useState('foryou'); // 'following' | 'foryou'
  
  // Interaction States
  const [commentModalVideoId, setCommentModalVideoId] = useState<number | null>(null);
  const [shareModalVideoId, setShareModalVideoId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  
  // Double Tap Heart Animation State
  const [tempHeart, setTempHeart] = useState<{id: number, x: number, y: number} | null>(null);
  const lastTapRef = useRef<number>(0);

  // Simulation of Download
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // --- LOGIC HANDLERS ---

  const handleLike = (id: number) => {
    setVideos(prev => prev.map(v => {
      if (v.id === id) {
        return { 
            ...v, 
            isLiked: !v.isLiked, 
            likes: v.isLiked ? v.likes - 1 : v.likes + 1 
        };
      }
      return v;
    }));
  };

  const handleFollow = (id: number) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, isFollowed: true } : v));
  };

  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent, videoId: number) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    
    if (now - lastTapRef.current < DOUBLE_PRESS_DELAY) {
        // Double Tap Detected
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        // Show heart animation
        setTempHeart({ id: Date.now(), x: clientX, y: clientY });
        setTimeout(() => setTempHeart(null), 800); // Remove after animation

        // Ensure video is liked if not already
        const video = videos.find(v => v.id === videoId);
        if (video && !video.isLiked) {
            handleLike(videoId);
        }
    }
    lastTapRef.current = now;
  };

  const handlePostComment = () => {
    if (!newComment.trim() || !commentModalVideoId) return;
    
    setVideos(prev => prev.map(v => {
        if (v.id === commentModalVideoId) {
            return {
                ...v,
                comments: v.comments + 1,
                commentsList: [
                    ...v.commentsList, 
                    { id: Date.now(), user: 'Moi', text: newComment, time: 'À l\'instant' }
                ]
            };
        }
        return v;
    }));
    setNewComment('');
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    // Simulate download progress
    const interval = setInterval(() => {
        setDownloadProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                setTimeout(() => setIsDownloading(false), 500);
                return 100;
            }
            return prev + 10;
        });
    }, 200);
  };

  const toggleMute = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMuted(!isMuted);
  };

  // --- SUB-COMPONENTS (Modals) ---

  const renderCommentsModal = () => {
    if (!commentModalVideoId) return null;
    const activeVideo = videos.find(v => v.id === commentModalVideoId);
    if (!activeVideo) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end animate-fade-in">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCommentModalVideoId(null)}></div>
            <div className="bg-white dark:bg-gray-900 w-full h-[60vh] rounded-t-3xl relative z-10 flex flex-col shadow-2xl animate-slide-up">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
                    <span className="font-bold text-sm">Commentaires ({activeVideo.comments})</span>
                    <button onClick={() => setCommentModalVideoId(null)}><X size={20} /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {activeVideo.commentsList.length === 0 ? (
                        <div className="text-center text-gray-500 text-sm mt-10">Soyez le premier à commenter !</div>
                    ) : (
                        activeVideo.commentsList.map(comment => (
                            <div key={comment.id} className="flex gap-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400">{comment.user} <span className="font-normal opacity-50 ml-1">· {comment.time}</span></p>
                                    <p className="text-sm text-gray-900 dark:text-white leading-tight mt-0.5">{comment.text}</p>
                                </div>
                                <Heart size={14} className="text-gray-400" />
                            </div>
                        ))
                    )}
                </div>

                <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 flex items-center">
                        <input 
                            type="text" 
                            placeholder="Ajouter un commentaire..." 
                            className="bg-transparent w-full text-sm outline-none"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                        />
                    </div>
                    <button 
                        onClick={handlePostComment}
                        className={`p-2 rounded-full transition-colors ${newComment.trim() ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-400'}`}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
  };

  const renderShareModal = () => {
    if (!shareModalVideoId) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-end animate-fade-in">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShareModalVideoId(null)}></div>
            <div className="bg-white dark:bg-gray-900 w-full rounded-t-3xl relative z-10 p-5 shadow-2xl animate-slide-up text-gray-900 dark:text-white">
                <h3 className="font-bold text-center mb-6">Partager vers</h3>
                
                {/* Apps Row */}
                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 mb-2 justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                            <MessageCircle size={24} />
                        </div>
                        <span className="text-xs">WhatsApp</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                            <Send size={24} />
                        </div>
                        <span className="text-xs">Telegram</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                            <MessageCircle size={24} />
                        </div>
                        <span className="text-xs">SMS</span>
                    </div>
                </div>

                {/* Actions Row */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    <button 
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({title: 'Lualaba Connect', url: window.location.href});
                            } else {
                                setShareModalVideoId(null);
                            }
                        }}
                        className="flex flex-col items-center gap-2 min-w-[70px]"
                    >
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-white cursor-pointer active:scale-95 transition-transform">
                            <LinkIcon size={20} />
                        </div>
                        <span className="text-xs">Copier lien</span>
                    </button>

                    <button 
                        onClick={handleDownload}
                        className="flex flex-col items-center gap-2 min-w-[70px]"
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform ${isDownloading ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white'}`}>
                            {isDownloading ? (
                                <span className="text-xs font-bold">{downloadProgress}%</span>
                            ) : (
                                <Download size={20} />
                            )}
                        </div>
                        <span className="text-xs">{isDownloading ? 'En cours...' : 'Enregistrer'}</span>
                    </button>
                </div>

                <button onClick={() => setShareModalVideoId(null)} className="w-full bg-gray-100 dark:bg-gray-800 py-3 rounded-xl font-bold mt-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    Annuler
                </button>
            </div>
        </div>
    );
  };

  return (
    <div className="h-full bg-black text-white relative overflow-y-scroll snap-y snap-mandatory no-scrollbar pb-20 select-none">
      
      {/* Top Overlay Tabs */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-center items-center gap-4 pt-10 text-shadow">
         <span 
            onClick={() => setActiveTab('following')}
            className={`font-bold cursor-pointer transition-colors ${activeTab === 'following' ? 'text-white border-b-2 border-white pb-1' : 'text-white/60 hover:text-white'}`}
         >
            Abonnements
         </span>
         <span 
            onClick={() => setActiveTab('foryou')}
            className={`font-bold cursor-pointer transition-colors ${activeTab === 'foryou' ? 'text-white border-b-2 border-white pb-1' : 'text-white/60 hover:text-white'}`}
         >
            Pour toi
         </span>
      </div>

      {/* Temp Heart Animation */}
      {tempHeart && (
        <div 
            className="fixed z-50 pointer-events-none animate-ping" 
            style={{ left: tempHeart.x - 40, top: tempHeart.y - 40 }}
        >
            <Heart size={80} className="fill-red-500 text-red-500 drop-shadow-2xl" />
        </div>
      )}

      {/* Videos List */}
      {videos.map((video) => (
        <div 
            key={video.id} 
            className="w-full h-full snap-start relative flex items-center justify-center bg-black"
            onClick={(e) => handleDoubleTap(e, video.id)}
        >
           {/* Video Element */}
           <video
              src={video.videoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              loop
              muted={isMuted}
              autoPlay
              playsInline
           />

           {/* Video Overlay Gradient */}
           <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none"></div>

           {/* Right Sidebar Actions */}
           <div 
             className="absolute bottom-24 right-2 z-20 flex flex-col items-center gap-6"
             onClick={(e) => e.stopPropagation()} // Prevent double tap trigger on buttons
           >
              {/* Avatar & Follow */}
              <div className="relative mb-2">
                 <div className="w-12 h-12 rounded-full bg-white p-0.5 overflow-hidden border-2 border-white cursor-pointer hover:scale-105 transition-transform">
                    <img src={`https://picsum.photos/100/100?random=${video.id}`} className="w-full h-full object-cover rounded-full" />
                 </div>
                 {!video.isFollowed && (
                     <div 
                        onClick={() => handleFollow(video.id)}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 rounded-full p-0.5 cursor-pointer hover:scale-110 transition-transform"
                     >
                        <Plus size={12} className="text-white" strokeWidth={4} />
                     </div>
                 )}
                 {video.isFollowed && (
                     <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full p-0.5 animate-fade-in">
                        <Check size={12} className="text-red-500" strokeWidth={4} />
                     </div>
                 )}
              </div>

              {/* Likes */}
              <div className="flex flex-col items-center gap-1">
                 <Heart 
                    size={32} 
                    onClick={() => handleLike(video.id)}
                    className={`drop-shadow-lg cursor-pointer active:scale-90 transition-transform ${video.isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                 />
                 <span className="text-xs font-bold drop-shadow-md">{video.likes.toLocaleString()}</span>
              </div>

              {/* Comments */}
              <div className="flex flex-col items-center gap-1">
                 <MessageCircle 
                    size={32} 
                    onClick={() => setCommentModalVideoId(video.id)}
                    className="text-white drop-shadow-lg cursor-pointer active:scale-90 transition-transform" 
                 />
                 <span className="text-xs font-bold drop-shadow-md">{video.comments.toLocaleString()}</span>
              </div>

              {/* Shares */}
              <div className="flex flex-col items-center gap-1">
                 <Share2 
                    size={32} 
                    onClick={() => setShareModalVideoId(video.id)}
                    className="text-white drop-shadow-lg cursor-pointer active:scale-90 transition-transform" 
                 />
                 <span className="text-xs font-bold drop-shadow-md">{video.shares.toLocaleString()}</span>
              </div>

              {/* Mute Button (Custom addition) */}
              <div className="flex flex-col items-center gap-1 mt-2">
                 <button onClick={toggleMute} className="bg-black/40 p-2 rounded-full backdrop-blur-sm">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                 </button>
              </div>

              {/* Spinning Vinyl */}
              <div className="animate-[spin_5s_linear_infinite] mt-2">
                 <div className="w-10 h-10 rounded-full bg-gray-900 border-[6px] border-gray-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://picsum.photos/100/100?random=${video.id}`} className="w-full h-full object-cover opacity-70" />
                 </div>
              </div>
           </div>

           {/* Bottom Info */}
           <div className="absolute bottom-24 left-4 z-20 max-w-[75%] pointer-events-none">
              <h3 className="font-bold text-lg mb-2 shadow-black drop-shadow-md">@{video.username}</h3>
              <p className="text-sm mb-3 leading-snug drop-shadow-md">
                  {video.desc}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium">
                 <Music2 size={14} />
                 <div className="w-40 overflow-hidden whitespace-nowrap">
                   <span className="animate-marquee inline-block">{video.song} &nbsp; • &nbsp; {video.song}</span>
                 </div>
              </div>
           </div>
        </div>
      ))}

      {renderCommentsModal()}
      {renderShareModal()}
    </div>
  );
};