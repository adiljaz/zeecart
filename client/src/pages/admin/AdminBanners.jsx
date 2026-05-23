import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminSidebar from '../../components/AdminSidebar';
import { useSettings } from '../../context/SettingsContext';
import api from '../../api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Image as ImageIcon, Save, X, ExternalLink, Upload, AlertCircle, Scissors, Check } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { getCroppedFile } from '../../utils/cropImage';

const AdminBanners = () => {
  const { settings } = useSettings();
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    ctaText: 'Shop Now',
    link: '/products',
    area: 'hero',
    isActive: true
  });

  // Cropping State
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data } = await api.get('/api/banners/admin');
      setBanners(data);
    } catch (error) {
      toast.error('Failed to load banners');
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:image')) return url;
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://zeecart-backend.onrender.com' : 'http://localhost:5000');
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${path}`;
  };

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData(banner);
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        image: '',
        ctaText: 'Shop Now',
        link: '/products',
        area: 'hero',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageToCrop(reader.result);
      setIsCropping(true);
    });
    reader.readAsDataURL(file);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    try {
      setIsUploading(true);
      const croppedFile = await getCroppedFile(imageToCrop, croppedAreaPixels);
      
      const uploadData = new FormData();
      uploadData.append('images', croppedFile);

      const { data } = await api.post('/api/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFormData({ ...formData, image: data.files[0].url });
      toast.success('Image cropped and uploaded');
      setIsCropping(false);
      setImageToCrop(null);
    } catch (error) {
      console.error(error);
      toast.error('Cropping or upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error('Please upload a banner image');
      return;
    }

    try {
      if (editingBanner) {
        await api.put(`/api/banners/${editingBanner._id}`, formData);
        toast.success('Banner updated successfully');
      } else {
        await api.post('/api/banners', formData);
        toast.success('Banner created successfully');
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch (error) {
      toast.error('Failed to save banner');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      await api.delete(`/api/banners/${id}`);
      toast.success('Banner deleted');
      fetchBanners();
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  const bannerAreas = [
    { value: 'hero', label: 'Main Hero Carousel', ratio: '21:9', size: '2000x850' },
    { value: 'kids', label: 'Kids Fashion Section', ratio: '1:1', size: '1000x1000' },
    { value: 'men', label: 'Men Fashion Section', ratio: '4:5', size: '800x1000' },
    { value: 'women', label: 'Women Fashion Section', ratio: '4:5', size: '800x1000' },
    { value: 'category-strip', label: 'Category Strip', ratio: '32:1', size: '1600x50' },
    { value: 'highlight', label: 'Collection Spotlight', ratio: '16:9', size: '1600x900' }
  ];

  const currentAreaInfo = bannerAreas.find(a => a.value === formData.area);

  const getAspect = () => {
    if (!currentAreaInfo) return 16 / 9;
    const [w, h] = currentAreaInfo.ratio.split(':').map(Number);
    return w / h;
  };

  return (
    <>
      <Helmet>
        <title>Banner Management - {settings?.storeName || 'Zee Cart'} Admin</title>
      </Helmet>
      <div className="flex bg-warm-white min-h-screen">
        <AdminSidebar />
        <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-x-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 w-full pt-20 md:pt-0">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-black text-navy mb-2">Visual Merchandising</h1>
              <p className="text-navy/40 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Dynamic Banners & Hero Assets</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="w-full md:w-auto justify-center px-8 py-4 bg-navy-fixed text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-terracotta transition-premium shadow-2xl"
            >
              <Plus size={16} /> Create New Banner
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-navy/10 border-t-terracotta rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {banners.map((banner) => (
                <motion.div
                  layout
                  key={banner._id}
                  className="bg-card-bg rounded-3xl overflow-hidden shadow-premium border border-border group"
                >
                  <div className="aspect-[21/9] relative overflow-hidden bg-gray-100">
                    <img 
                      src={getImageUrl(banner.image)} 
                      alt={banner.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000';
                      }}
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => handleOpenModal(banner)} className="p-2 bg-card-bg/90 backdrop-blur shadow-lg rounded-full text-navy hover:text-terracotta border border-border transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(banner._id)} className="p-2 bg-card-bg/90 backdrop-blur shadow-lg rounded-full text-navy hover:text-red-500 border border-border transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-navy-fixed text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                        {banner.area}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-serif font-black text-navy mb-1">{banner.title}</h3>
                    <p className="text-xs text-navy/40 font-bold mb-4">{banner.subtitle || 'No subtitle provided'}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${banner.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-navy/60">{banner.isActive ? 'Active' : 'Draft'}</span>
                      </div>
                      <a href={banner.link} target="_blank" rel="noopener noreferrer" className="text-navy hover:text-terracotta transition-colors">
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-navy-fixed/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-card-bg rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 md:p-10 lg:p-12">
                <div className="flex justify-between items-center mb-8 md:mb-10">
                  <h2 className="text-3xl font-serif font-black text-navy">{editingBanner ? 'Refine Banner' : 'New Aesthetic Banner'}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-navy/20 hover:text-navy transition-colors">
                    <X size={28} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40 ml-4">Title</label>
                      <input
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-warm-white px-6 py-4 rounded-2xl border border-border focus:outline-none focus:border-navy transition-premium font-bold text-sm"
                        placeholder="e.g., Summer Collection"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40 ml-4">Subtitle</label>
                      <input
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full bg-warm-white px-6 py-4 rounded-2xl border border-border focus:outline-none focus:border-navy transition-premium font-bold text-sm"
                        placeholder="e.g., Elegance in every thread"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40 ml-4">Banner Asset</label>
                    <div className="relative group">
                      <input
                        type="file"
                        id="banner-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <label 
                        htmlFor="banner-upload"
                        className="flex flex-col items-center justify-center w-full aspect-[21/9] bg-warm-white rounded-[2rem] border-2 border-dashed border-border group-hover:border-navy transition-colors cursor-pointer overflow-hidden relative"
                      >
                        {formData.image ? (
                          <>
                            <img 
                              src={getImageUrl(formData.image)} 
                              className="w-full h-full object-cover" 
                              alt="Preview" 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000';
                              }}
                            />
                            <div className="absolute inset-0 bg-navy-fixed/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Upload className="text-white" size={32} />
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-4 text-navy/40">
                            <Upload size={40} strokeWidth={1} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Click to upload asset</span>
                          </div>
                        )}
                        {isUploading && (
                          <div className="absolute inset-0 bg-card-bg/80 backdrop-blur-sm flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-navy/10 border-t-terracotta rounded-full animate-spin" />
                          </div>
                        )}
                      </label>
                    </div>
                    
                    {currentAreaInfo && (
                      <div className="flex items-center gap-3 px-6 py-3 bg-navy-fixed/5 rounded-2xl">
                        <AlertCircle size={14} className="text-navy/40" />
                        <p className="text-[8px] font-black uppercase tracking-widest text-navy/60">
                          Recommended for <span className="text-navy">{currentAreaInfo.label}</span>: 
                          <span className="ml-2 bg-card-bg px-2 py-1 rounded-md text-terracotta">{currentAreaInfo.ratio} Ratio</span>
                          <span className="ml-2 bg-card-bg px-2 py-1 rounded-md">{currentAreaInfo.size}px</span>
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40 ml-4">Display Area</label>
                      <select
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full bg-warm-white px-6 py-4 rounded-2xl border border-border focus:outline-none focus:border-navy transition-premium font-bold text-sm appearance-none"
                      >
                        {bannerAreas.map(area => (
                          <option key={area.value} value={area.value}>{area.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40 ml-4">Target Link</label>
                      <input
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        className="w-full bg-warm-white px-6 py-4 rounded-2xl border border-border focus:outline-none focus:border-navy transition-premium font-bold text-sm"
                        placeholder="/products?gender=men"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4 py-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded accent-navy"
                    />
                    <label htmlFor="isActive" className="text-[10px] font-black uppercase tracking-widest text-navy">Make Banner Active Immediately</label>
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading}
                    className={`w-full py-5 ${isUploading ? 'bg-navy-fixed/50 cursor-not-allowed' : 'bg-navy-fixed hover:bg-terracotta'} text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl transition-premium shadow-2xl mt-4 flex items-center justify-center gap-3`}
                  >
                    <Save size={18} /> {editingBanner ? 'Update Asset' : 'Deploy Banner'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cropping Modal */}
      <AnimatePresence>
        {isCropping && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 lg:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-navy-fixed/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-5xl bg-card-bg rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-[85vh]"
            >
              <div className="p-8 border-b border-border flex justify-between items-center bg-card-bg z-10">
                <div>
                  <h2 className="text-2xl font-serif font-black text-navy flex items-center gap-3">
                    <Scissors size={24} className="text-terracotta" />
                    Crop Banner Asset
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy/40 mt-1">
                    Aligning for {currentAreaInfo?.label} ({currentAreaInfo?.ratio})
                  </p>
                </div>
                <button 
                  onClick={() => { setIsCropping(false); setImageToCrop(null); }}
                  className="p-3 bg-warm-white rounded-full text-navy hover:text-terracotta transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 relative bg-navy-fixed/5">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={getAspect()}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              <div className="p-8 bg-card-bg border-t border-border z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <span className="text-[10px] font-black uppercase tracking-widest text-navy/40">Zoom Level</span>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(e.target.value)}
                    className="flex-1 md:w-64 h-1.5 bg-navy-fixed/5 rounded-lg appearance-none cursor-pointer accent-navy"
                  />
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <button
                    onClick={() => { setIsCropping(false); setImageToCrop(null); }}
                    className="flex-1 md:px-8 py-4 border border-border text-navy text-[10px] font-black uppercase tracking-widest hover:bg-navy-fixed/5 transition-premium rounded-2xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCropSave}
                    disabled={isUploading}
                    className="flex-[2] md:px-12 py-4 bg-navy-fixed text-white text-[10px] font-black uppercase tracking-widest hover:bg-terracotta transition-premium rounded-2xl shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Check size={18} />
                    )}
                    Apply & Upload
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminBanners;
