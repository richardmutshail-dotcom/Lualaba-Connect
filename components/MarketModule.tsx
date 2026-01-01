import React, { useState } from 'react';
import { 
  ShoppingBag, MapPin, Search, Star, Filter, Heart, 
  ArrowLeft, MessageCircle, Share2, Plus, Store, CheckCircle, 
  ShoppingCart, Trash2, ChevronRight, Tag, Camera, X, Upload,
  Truck, Package, CreditCard, Banknote, Loader2, Send
} from 'lucide-react';
import { Product, Seller } from '../types';

// --- MOCK DATA ---

const mockSellers: Record<string, Seller> = {
  's1': { id: 's1', name: 'Maman Tina Bio', avatar: 'https://picsum.photos/100/100?random=80', isVerified: true, rating: 4.8, joinedDate: '2023' },
  's2': { id: 's2', name: 'Lualaba Tech', avatar: 'https://picsum.photos/100/100?random=81', isVerified: true, rating: 4.5, joinedDate: '2024' },
  's3': { id: 's3', name: 'Service Express', avatar: 'https://picsum.photos/100/100?random=82', isVerified: false, rating: 4.0, joinedDate: '2024' },
  'me': { id: 'me', name: 'Moi', avatar: 'https://picsum.photos/100/100?random=user', isVerified: true, rating: 5.0, joinedDate: '2024' },
};

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Sac de Maïs Farine (25kg)',
    category: 'Food',
    price: 45000,
    currency: 'FC',
    images: ['https://picsum.photos/400/400?random=1', 'https://picsum.photos/400/400?random=101'],
    description: 'Farine de maïs première qualité, production locale Manika. Idéal pour le fufu. Livraison possible centre-ville.',
    location: 'Marché Manika',
    distance: '1.2 km',
    seller: mockSellers['s1'],
    condition: 'New',
    stock: 50,
    likes: 12
  },
  {
    id: '2',
    name: 'Kit Solaire 100W Complet',
    category: 'Tech',
    price: 150,
    currency: 'USD',
    images: ['https://picsum.photos/400/400?random=2', 'https://picsum.photos/400/400?random=102'],
    description: 'Panneau 100W + Batterie Gel 100Ah + Convertisseur. Parfait pour l\'éclairage et charger les téléphones. Garantie 6 mois.',
    location: 'Centre Ville',
    distance: '3.5 km',
    seller: mockSellers['s2'],
    condition: 'New',
    stock: 5,
    likes: 45
  },
  {
    id: '3',
    name: 'Dépannage Plomberie Urgence',
    category: 'Service',
    price: 20,
    currency: 'USD',
    images: ['https://picsum.photos/400/400?random=3'],
    description: 'Plombier qualifié disponible 24/7 sur Kolwezi et environs. Fuites, débouchage, installation.',
    location: 'Kasulo',
    distance: '0.8 km',
    seller: mockSellers['s3'],
    condition: 'New',
    stock: 1,
    likes: 8
  },
  {
    id: '4',
    name: 'Tomates Fraîches (Le Panier)',
    category: 'Food',
    price: 5000,
    currency: 'FC',
    images: ['https://picsum.photos/400/400?random=4'],
    description: 'Tomates bio cultivées à Mutoshi. Prix pour un petit panier. Très rouges et juteuses.',
    location: 'Mutoshi',
    distance: '5.0 km',
    seller: mockSellers['s1'],
    condition: 'New',
    stock: 20,
    likes: 3
  },
  {
    id: '5',
    name: 'iPhone 12 Pro 128GB',
    category: 'Tech',
    price: 450,
    currency: 'USD',
    images: ['https://picsum.photos/400/400?random=5'],
    description: 'iPhone 12 Pro seconde main, état impeccable. Batterie 89%. Vendu avec chargeur.',
    location: 'Golf',
    distance: '2.1 km',
    seller: mockSellers['s2'],
    condition: 'Used',
    stock: 1,
    likes: 22
  },
];

type MarketView = 'browse' | 'detail' | 'cart' | 'seller';

interface CartItem extends Product {
  quantity: number;
}

export const MarketModule: React.FC = () => {
  const [view, setView] = useState<MarketView>('browse');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Selling State
  const [showSellModal, setShowSellModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'Other',
    price: 0,
    currency: 'USD',
    description: '',
    location: 'Kolwezi',
    condition: 'Used',
    images: []
  });

  // Cart & Checkout State
  const [deliveryMode, setDeliveryMode] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'airtel' | 'orange' | 'mpesa' | 'cash'>('cash');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // --- LOGIC ---

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const getCartTotal = () => {
    // Delivery Fees
    const deliveryFeeUSD = deliveryMode === 'delivery' ? 5 : 0;
    const deliveryFeeFC = deliveryMode === 'delivery' ? 12500 : 0;

    const subTotalUSD = cart.filter(i => i.currency === 'USD').reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subTotalFC = cart.filter(i => i.currency === 'FC').reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return { 
        subTotalUSD, 
        subTotalFC, 
        totalUSD: subTotalUSD > 0 ? subTotalUSD + deliveryFeeUSD : 0, 
        totalFC: subTotalFC > 0 ? subTotalFC + deliveryFeeFC : 0,
        deliveryFeeUSD,
        deliveryFeeFC
    };
  };

  const handleContactSeller = (seller: Seller) => {
      // Simulate opening a chat
      alert(`Discussion ouverte avec ${seller.name} concernant votre commande.`);
  };

  const handleCheckout = () => {
      setIsOrdering(true);
      setTimeout(() => {
          setIsOrdering(false);
          setOrderSuccess(true);
          setTimeout(() => {
              setOrderSuccess(false);
              setCart([]);
              setView('browse');
          }, 3000);
      }, 2000);
  };

  const handlePublishProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    
    const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name!,
        category: newProduct.category as any,
        price: Number(newProduct.price),
        currency: newProduct.currency as any,
        images: newProduct.images?.length ? newProduct.images : [`https://picsum.photos/400/400?random=${Date.now()}`],
        description: newProduct.description || 'Aucune description',
        location: newProduct.location || 'Kolwezi',
        distance: '0.1 km',
        seller: mockSellers['me'],
        condition: newProduct.condition as any,
        stock: 1,
        likes: 0
    };
    
    setProducts([product, ...products]);
    setShowSellModal(false);
    setNewProduct({
        name: '',
        category: 'Other',
        price: 0,
        currency: 'USD',
        description: '',
        location: 'Kolwezi',
        condition: 'Used',
        images: []
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (categoryFilter === 'All' || p.category === categoryFilter)
  );

  // --- SUB-COMPONENTS ---

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div 
      onClick={() => { setSelectedProduct(product); setView('detail'); }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col cursor-pointer active:scale-[0.98] transition-transform group"
    >
      <div className="h-40 bg-gray-200 relative overflow-hidden">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
           <MapPin size={10} /> {product.distance}
        </div>
        {product.condition === 'Used' && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            Occasion
          </div>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-medium text-gray-800 dark:text-gray-100 text-sm line-clamp-2 leading-snug mb-1">{product.name}</h3>
        <div className="flex justify-between items-end mt-auto">
          <div className="flex flex-col">
             <span className="text-xs text-gray-400 dark:text-gray-500 line-through decoration-red-400 opacity-0 h-0"></span>
             <span className="font-bold text-lg text-lualaba-600 dark:text-lualaba-400">
                {product.price} <span className="text-xs font-normal">{product.currency}</span>
             </span>
          </div>
          <button className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-lualaba-100 dark:hover:bg-lualaba-900/30 hover:text-lualaba-600 transition-colors">
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const SellModal = () => (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-slide-up max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Vendre un article</h3>
                  <button onClick={() => setShowSellModal(false)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <X size={20} className="text-gray-600 dark:text-gray-300" />
                  </button>
              </div>

              <div className="space-y-4">
                  {/* Image Upload Mock */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl h-32 flex flex-col items-center justify-center text-gray-400 hover:border-lualaba-500 hover:text-lualaba-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-700/50">
                      <Camera size={32} className="mb-2"/>
                      <span className="text-xs font-bold">Ajouter des photos</span>
                  </div>

                  <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Titre</label>
                      <input 
                        type="text" 
                        value={newProduct.name} 
                        onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-sm border border-gray-200 dark:border-gray-600 outline-none focus:border-lualaba-500 dark:text-white"
                        placeholder="Qu'est-ce que vous vendez ?"
                      />
                  </div>

                  <div className="flex gap-3">
                      <div className="flex-1">
                          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Prix</label>
                          <input 
                            type="number" 
                            value={newProduct.price || ''} 
                            onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                            className="w-full bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-sm border border-gray-200 dark:border-gray-600 outline-none focus:border-lualaba-500 dark:text-white"
                            placeholder="0.00"
                          />
                      </div>
                      <div className="w-24">
                          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Devise</label>
                          <select 
                            value={newProduct.currency}
                            onChange={e => setNewProduct({...newProduct, currency: e.target.value as any})}
                            className="w-full bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-sm border border-gray-200 dark:border-gray-600 outline-none dark:text-white appearance-none font-bold"
                          >
                              <option value="USD">USD</option>
                              <option value="FC">FC</option>
                          </select>
                      </div>
                  </div>

                  <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Catégorie</label>
                      <select 
                         value={newProduct.category}
                         onChange={e => setNewProduct({...newProduct, category: e.target.value as any})}
                         className="w-full bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-sm border border-gray-200 dark:border-gray-600 outline-none dark:text-white"
                      >
                          {['Food', 'Tech', 'Service', 'Home', 'Fashion', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                  </div>

                  <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description</label>
                      <textarea 
                        value={newProduct.description}
                        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-sm border border-gray-200 dark:border-gray-600 outline-none focus:border-lualaba-500 dark:text-white resize-none"
                        rows={3}
                        placeholder="Détails, état, livraison..."
                      />
                  </div>

                  <button 
                    onClick={handlePublishProduct}
                    disabled={!newProduct.name || !newProduct.price}
                    className="w-full bg-lualaba-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-lualaba-600/30 disabled:opacity-50 disabled:shadow-none hover:bg-lualaba-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                      <Store size={18} /> Publier l'annonce
                  </button>
              </div>
          </div>
      </div>
  );

  // --- RENDER VIEWS ---

  const renderBrowse = () => (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 pb-28">
       {/* Sticky Header */}
      <div className="bg-lualaba-600 dark:bg-gray-800 px-4 pt-4 pb-4 shadow-lg rounded-b-[2rem] sticky top-0 z-20 transition-colors">
        <div className="flex justify-between items-center mb-4 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Store size={24} /> Market Pro
          </h2>
          <div className="flex gap-3">
             <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm cursor-pointer relative" onClick={() => setView('cart')}>
                <ShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
             </div>
             <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <Filter size={20} />
             </div>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Rechercher à Kolwezi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-gray-700 dark:text-white text-gray-800 shadow-lg shadow-lualaba-700/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Categories Rail */}
        <div className="px-4 py-4 overflow-x-auto no-scrollbar flex gap-2">
          {['All', 'Food', 'Tech', 'Service', 'Home', 'Fashion', 'Other'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                categoryFilter === cat 
                  ? 'bg-lualaba-600 text-white shadow-md shadow-lualaba-500/30' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {cat === 'All' ? 'Tout' : cat}
            </button>
          ))}
        </div>

        {/* Promo Banner */}
        <div className="px-4 mb-4">
           <div className="bg-gradient-to-r from-malachite-600 to-teal-500 rounded-2xl p-4 text-white shadow-md flex justify-between items-center relative overflow-hidden">
              <div className="relative z-10">
                 <span className="bg-white/20 text-xs font-bold px-2 py-0.5 rounded backdrop-blur-sm">Promo Locale</span>
                 <h3 className="font-bold text-lg mt-1">Vendez vos produits !</h3>
                 <p className="text-xs opacity-90 mb-2">0% de commission ce mois-ci.</p>
                 <button onClick={() => setShowSellModal(true)} className="bg-white text-teal-700 text-xs font-bold px-3 py-1.5 rounded-lg">Créer une annonce</button>
              </div>
              <Store size={80} className="absolute -right-4 -bottom-4 opacity-20 rotate-12" />
           </div>
        </div>

        {/* Products Grid */}
        <div className="px-4 grid grid-cols-2 gap-4 pb-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Sell FAB */}
        <div className="fixed bottom-24 right-5 z-20">
           <button 
             onClick={() => setShowSellModal(true)}
             className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-4 rounded-full shadow-xl flex items-center gap-2 hover:scale-105 transition-transform font-bold"
            >
              <Plus size={20} /> <span className="hidden sm:inline">Vendre</span>
           </button>
        </div>
      </div>
    </div>
  );

  const renderDetail = () => {
    if (!selectedProduct) return null;
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 pb-28 animate-slide-left z-30">
        {/* Top Nav */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 pointer-events-none">
           <button onClick={() => setView('browse')} className="pointer-events-auto bg-white/80 dark:bg-black/50 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-800">
             <ArrowLeft size={24} className="text-gray-800 dark:text-white" />
           </button>
           <div className="flex gap-2 pointer-events-auto">
             <button className="bg-white/80 dark:bg-black/50 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-800">
               <Share2 size={24} className="text-gray-800 dark:text-white" />
             </button>
             <button className="bg-white/80 dark:bg-black/50 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-800">
               <Heart size={24} className="text-gray-800 dark:text-white" />
             </button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
           {/* Image Gallery */}
           <div className="h-[45vh] bg-gray-100 relative">
              <img src={selectedProduct.images[0]} className="w-full h-full object-cover" alt={selectedProduct.name} />
              <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-md">
                 1 / {selectedProduct.images.length}
              </div>
           </div>

           <div className="p-5 -mt-6 bg-white dark:bg-gray-900 rounded-t-[2rem] relative z-0 transition-colors">
              {/* Header Info */}
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-1">{selectedProduct.name}</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                       <MapPin size={14} /> {selectedProduct.location} ({selectedProduct.distance})
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="text-2xl font-bold text-lualaba-600 dark:text-lualaba-400">
                       {selectedProduct.price} <span className="text-sm">{selectedProduct.currency}</span>
                    </div>
                    {selectedProduct.stock > 0 ? (
                       <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">En stock</span>
                    ) : (
                       <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Rupture</span>
                    )}
                 </div>
              </div>

              {/* Seller Card */}
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl flex items-center gap-3 mb-6 border border-gray-100 dark:border-gray-700">
                 <div className="relative">
                    <img src={selectedProduct.seller.avatar} alt="Seller" className="w-12 h-12 rounded-full object-cover" />
                    {selectedProduct.seller.isVerified && (
                      <CheckCircle size={14} className="text-blue-500 absolute -bottom-1 -right-1 bg-white rounded-full" fill="white" />
                    )}
                 </div>
                 <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{selectedProduct.seller.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                       <Star size={10} className="text-yellow-400" fill="currentColor"/> {selectedProduct.seller.rating} • Sur Market depuis {selectedProduct.seller.joinedDate}
                    </div>
                 </div>
                 <button className="bg-white dark:bg-gray-700 p-2 rounded-lg text-gray-600 dark:text-gray-300 shadow-sm">
                    <ChevronRight size={20} />
                 </button>
              </div>

              {/* Description */}
              <div className="mb-8">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-2">Description</h3>
                 <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {selectedProduct.description}
                 </p>
                 
                 <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded-full border border-gray-200 dark:border-gray-700">
                      Condition: {selectedProduct.condition === 'New' ? 'Neuf' : 'Occasion'}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded-full border border-gray-200 dark:border-gray-700">
                      Catégorie: {selectedProduct.category}
                    </span>
                 </div>
              </div>
           </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="absolute bottom-20 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex gap-3">
           <button 
             onClick={() => handleContactSeller(selectedProduct.seller)}
             className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
           >
              <MessageCircle size={20} /> Discuter
           </button>
           <button 
             onClick={() => { addToCart(selectedProduct); setView('cart'); }}
             className="flex-[2] bg-lualaba-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-lualaba-600/30 hover:bg-lualaba-700 transition-colors"
           >
              <ShoppingBag size={20} /> Ajouter au panier
           </button>
        </div>
      </div>
    );
  };

  const renderCart = () => {
    const { totalUSD, totalFC, subTotalUSD, subTotalFC, deliveryFeeUSD, deliveryFeeFC } = getCartTotal();

    if (orderSuccess) {
        return (
            <div className="flex flex-col h-full bg-white dark:bg-gray-900 pb-28 animate-slide-up items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Commande Reçue !</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    Votre commande a été transmise aux vendeurs. Vous recevrez une notification de confirmation.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl w-full max-w-xs mb-8 border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Moyen de paiement</span>
                        <span className="font-bold dark:text-white capitalize">{paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Mode</span>
                        <span className="font-bold dark:text-white capitalize">{deliveryMode === 'pickup' ? 'Retrait' : 'Livraison'}</span>
                    </div>
                </div>
                <button 
                    onClick={() => { setOrderSuccess(false); setCart([]); setView('browse'); }}
                    className="bg-lualaba-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-lualaba-600/30"
                >
                    Continuer mes achats
                </button>
            </div>
        );
    }

    return (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 pb-28 animate-slide-left z-30">
         <div className="bg-white dark:bg-gray-800 p-4 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 flex items-center gap-3 z-10">
             <button onClick={() => setView('browse')} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
               <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
             </button>
             <h2 className="font-bold text-lg text-gray-800 dark:text-white">Mon Panier ({cart.length})</h2>
         </div>

         <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
                 <ShoppingCart size={48} className="mb-4 opacity-50" />
                 <p>Votre panier est vide.</p>
                 <button onClick={() => setView('browse')} className="mt-4 text-lualaba-600 dark:text-lualaba-400 font-bold">Retourner au marché</button>
              </div>
            ) : (
              <div className="space-y-6">
                 {/* CART ITEMS */}
                 <div className="space-y-4">
                    {cart.map(item => (
                    <div key={item.id} className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex gap-3">
                            <img src={item.images[0]} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-gray-800 dark:text-white text-sm line-clamp-1">{item.name}</h4>
                                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                                    <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center mt-auto">
                                    <span className="font-bold text-lualaba-600 dark:text-lualaba-400">
                                    {item.price * item.quantity} {item.currency}
                                    </span>
                                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-lg px-2 py-1">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-600 dark:text-gray-300 font-bold">-</button>
                                    <span className="text-xs font-bold text-gray-800 dark:text-white w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-600 dark:text-gray-300 font-bold">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Chat Button Row */}
                        <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                            <button 
                                onClick={() => handleContactSeller(item.seller)}
                                className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 hover:text-lualaba-600 transition-colors"
                            >
                                <MessageCircle size={14} /> Discuter avec {item.seller.name.split(' ')[0]}
                            </button>
                        </div>
                    </div>
                    ))}
                 </div>

                 {/* DELIVERY & PAYMENT SECTION */}
                 <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    
                    {/* Delivery Toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl mb-6">
                        <button 
                            onClick={() => setDeliveryMode('pickup')}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${deliveryMode === 'pickup' ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            <Store size={14} /> Retrait
                        </button>
                        <button 
                            onClick={() => setDeliveryMode('delivery')}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${deliveryMode === 'delivery' ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            <Truck size={14} /> Livraison (+5$)
                        </button>
                    </div>

                    {/* Address Input (If Delivery) */}
                    {deliveryMode === 'delivery' && (
                        <div className="mb-6 animate-fade-in">
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Adresse de livraison</label>
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-3">
                                <MapPin size={18} className="text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Ex: Q. Joli Site, Av. des Sports, No 12"
                                    className="bg-transparent w-full outline-none text-sm text-gray-900 dark:text-white"
                                    value={deliveryAddress}
                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Payment Methods */}
                    <div className="mb-6">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Moyen de paiement</label>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { id: 'airtel', label: 'Airtel', color: 'bg-red-500 text-white', icon: null },
                                { id: 'orange', label: 'Orange', color: 'bg-orange-500 text-white', icon: null },
                                { id: 'mpesa', label: 'M-Pesa', color: 'bg-green-600 text-white', icon: null },
                                { id: 'cash', label: 'Cash', color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white', icon: <Banknote size={16} /> }
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id as any)}
                                    className={`h-12 rounded-xl flex flex-col items-center justify-center text-[10px] font-bold border-2 transition-all ${paymentMethod === method.id ? 'border-lualaba-500 scale-105' : 'border-transparent opacity-80 hover:opacity-100'} ${method.color}`}
                                >
                                    {method.icon}
                                    <span>{method.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-500 dark:text-gray-400">
                            <span>Sous-total</span>
                            <span>{subTotalUSD > 0 ? `${subTotalUSD}$` : ''} {subTotalFC > 0 ? `${subTotalFC} FC` : ''}</span>
                        </div>
                        {deliveryMode === 'delivery' && (
                            <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                <span>Frais de livraison</span>
                                <span>{deliveryFeeUSD}$ / {deliveryFeeFC} FC</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-black text-gray-900 dark:text-white pt-2">
                            <span>Total</span>
                            <span>{totalUSD > 0 ? `${totalUSD}$` : ''} {totalFC > 0 ? `${totalFC} FC` : ''}</span>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <button 
                        onClick={handleCheckout}
                        disabled={isOrdering || (deliveryMode === 'delivery' && !deliveryAddress)}
                        className="w-full bg-lualaba-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-lualaba-600/30 hover:bg-lualaba-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:shadow-none"
                    >
                        {isOrdering ? <Loader2 size={20} className="animate-spin" /> : (
                            <>
                                {paymentMethod === 'cash' ? 'Commander (Paiement à la livraison)' : `Payer avec ${paymentMethod}`}
                            </>
                        )}
                    </button>
                 </div>
              </div>
            )}
         </div>
      </div>
    );
  };

  return (
    <div className="h-full relative transition-colors duration-300">
      {view === 'browse' && renderBrowse()}
      {view === 'detail' && renderDetail()}
      {view === 'cart' && renderCart()}
      {showSellModal && SellModal()}
    </div>
  );
};