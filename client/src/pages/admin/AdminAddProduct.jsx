import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminSidebar from '../../components/AdminSidebar';
import { useSettings } from '../../context/SettingsContext';
import api from '../../api';
import toast from 'react-hot-toast';
import ImageCropperModal from '../../components/ImageCropperModal';
import { useNavigate, useParams } from 'react-router-dom';
import { Sparkles, Package, IndianRupee, Tag, Layers, Users, Box, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

const AdminAddProduct = () => {
  const { settings } = useSettings();
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountedPrice: '',
    category: '',
    subcategory: '',
    gender: 'women',
    sizes: [],
    stock: '',
    is360View: false,
    isFeatured: false,
    isTrending: false,
    isBestSeller: false,
    discountPercent: '',
    hasDiscount: false,
  });
  const [images, setImages] = useState([]);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await api.get('/api/categories');
        setCategories(catRes.data);

        if (isEdit) {
          const prodRes = await api.get(`/api/products/${id}`);
          const p = prodRes.data;
          setFormData({
            name: p.name,
            description: p.description,
            price: p.price.toString(),
            discountedPrice: p.discountedPrice?.toString() || '',
            category: p.category,
            subcategory: p.subcategory,
            gender: p.gender,
            sizes: p.sizes,
            stock: p.stock.toString(),
            is360View: p.is360View,
            isFeatured: p.isFeatured,
            isTrending: p.isTrending || false,
            isBestSeller: p.isBestSeller || false,
            hasDiscount: !!p.discountedPrice,
            discountPercent: p.discountedPrice ? Math.round((1 - p.discountedPrice / p.price) * 100).toString() : '',
          });
          // Note: Images are handled separately since they are URLs in edit mode
        }
      } catch (error) {
        toast.error('Failed to fetch data');
      }
    };

    fetchData();
  }, [id, isEdit]);

  useEffect(() => {
    if (formData.hasDiscount && formData.price && formData.discountPercent) {
      const price = parseFloat(formData.price);
      const percent = parseFloat(formData.discountPercent);
      if (!isNaN(price) && !isNaN(percent)) {
        const discounted = Math.round(price * (1 - percent / 100));
        setFormData(prev => ({ ...prev, discountedPrice: discounted.toString() }));
      }
    } else if (!formData.hasDiscount) {
      setFormData(prev => ({ ...prev, discountedPrice: '' }));
    }
  }, [formData.price, formData.discountPercent, formData.hasDiscount]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageToCrop(reader.result);
        setShowCropper(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedFile) => {
    setImages([...images, croppedFile]);
    setActivePreviewIndex(images.length);
    setShowCropper(false);
    setImageToCrop(null);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    if (activePreviewIndex >= images.length - 1) {
      setActivePreviewIndex(Math.max(0, images.length - 2));
    }
  };

  const handleAddSize = (size) => {
    if (size.trim() && !formData.sizes.includes(size.trim())) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, size.trim()],
      });
    }
  };

  const handleRemoveSize = (index) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('discountedPrice', formData.discountedPrice);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('subcategory', formData.subcategory);
      formDataToSend.append('gender', formData.gender);
      
      const finalSizes = formData.sizes.length > 0 ? formData.sizes : ['One Size'];
      
      formDataToSend.append('sizes', JSON.stringify(finalSizes));
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('is360View', formData.is360View);
      formDataToSend.append('isFeatured', formData.isFeatured);
      formDataToSend.append('isTrending', formData.isTrending);
      formDataToSend.append('isBestSeller', formData.isBestSeller);

      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      if (isEdit) {
        await api.put(`/api/products/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated successfully');
      } else {
        await api.post('/api/products', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product created successfully');
      }

      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const subcategories = categories.find((c) => c.name === formData.category && (c.gender === formData.gender || c.gender === 'unisex'))?.subcategories || [];

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Edit' : 'Add'} Product - {settings?.storeName || 'Zee Cart'} Admin</title>
      </Helmet>
      <div className="flex bg-warm-white min-h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8 overflow-y-auto">
          {showCropper && (
            <ImageCropperModal
              image={imageToCrop}
              onCropComplete={handleCropComplete}
              onCancel={() => setShowCropper(false)}
            />
          )}

          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-serif font-black text-navy mb-2">{isEdit ? 'Edit' : 'Add New'} Product</h1>
              <p className="text-navy/40 text-xs font-bold uppercase tracking-widest">Premium Inventory Management</p>
            </div>
            <div className="flex items-center gap-3 bg-card-bg px-6 py-3 rounded-full shadow-premium border border-border">
              <Sparkles size={18} className="text-terracotta animate-pulse" />
              <span className="text-xs font-black text-navy uppercase tracking-widest">Builder Mode Active</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
              {/* Basic Info */}
              <div className="bg-card-bg p-8 rounded-2xl shadow-premium border border-border space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Package size={20} className="text-terracotta" />
                  <h3 className="text-sm font-black text-navy uppercase tracking-widest">Basic Information</h3>
                </div>
                
                <input
                  type="text"
                  placeholder="Product Name (e.g. Premium Silk Scarf)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-warm-white px-6 py-4 rounded-xl text-navy border border-border focus:outline-none focus:border-terracotta transition-premium font-bold"
                  required
                />

                <textarea
                  placeholder="Detailed Product Description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-warm-white px-6 py-4 rounded-xl text-navy border border-border focus:outline-none focus:border-terracotta transition-premium font-medium min-h-[200px]"
                  required
                />
              </div>

              {/* Pricing & Inventory */}
              <div className="bg-card-bg p-8 rounded-2xl shadow-premium border border-border space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <IndianRupee size={20} className="text-terracotta" />
                    <h3 className="text-sm font-black text-navy uppercase tracking-widest">Pricing & Inventory</h3>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.hasDiscount}
                      onChange={(e) => setFormData({ ...formData, hasDiscount: e.target.checked })}
                      className="w-5 h-5 accent-terracotta rounded"
                    />
                    <span className="text-[10px] font-black text-navy/60 uppercase tracking-widest group-hover:text-navy transition-colors">Apply Promotion</span>
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-navy/40 uppercase tracking-widest mb-2 ml-1">Price (₹)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-warm-white px-6 py-4 rounded-xl text-navy border border-border focus:outline-none focus:border-terracotta transition-premium font-bold"
                      required
                    />
                  </div>
                  
                  {formData.hasDiscount && (
                    <>
                      <div>
                        <label className="block text-[10px] font-black text-navy/40 uppercase tracking-widest mb-2 ml-1">Discount %</label>
                        <input
                          type="number"
                          placeholder="20"
                          value={formData.discountPercent}
                          onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                          className="w-full bg-warm-white px-6 py-4 rounded-xl text-navy border border-border focus:outline-none focus:border-terracotta transition-premium font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-navy/40 uppercase tracking-widest mb-2 ml-1">Final Price</label>
                        <div className="w-full bg-navy-fixed text-white px-6 py-4 rounded-xl font-bold border border-navy-fixed flex items-center justify-between">
                          <span>₹</span>
                          <span>{formData.discountedPrice || '0'}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black text-navy/40 uppercase tracking-widest mb-2 ml-1">Available Stock</label>
                  <div className="flex items-center gap-4">
                    <Box size={20} className="text-navy/20" />
                    <input
                      type="number"
                      placeholder="e.g. 50"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full bg-warm-white px-6 py-4 rounded-xl text-navy border border-border focus:outline-none focus:border-terracotta transition-premium font-bold"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Categories & Classification */}
              <div className="bg-card-bg p-8 rounded-2xl shadow-premium border border-border space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Tag size={20} className="text-terracotta" />
                  <h3 className="text-sm font-black text-navy uppercase tracking-widest">Classification</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-navy/40 uppercase tracking-widest mb-2 ml-1">Target Audience</label>
                    <div className="flex gap-2">
                      {['women', 'men', 'unisex'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: g, category: '', subcategory: '' })}
                          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-premium ${formData.gender === g ? 'bg-navy-fixed text-white border-navy-fixed shadow-lg' : 'bg-warm-white text-navy/60 border-border hover:border-navy-fixed'}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-navy/40 uppercase tracking-widest mb-2 ml-1">Collection / Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                      className="w-full bg-warm-white px-6 py-3 rounded-xl text-navy border border-border focus:outline-none focus:border-terracotta transition-premium font-bold text-xs uppercase tracking-widest appearance-none"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories
                        .filter((c) => c.gender === formData.gender || c.gender === 'unisex')
                        .map((cat) => (
                          <option key={cat._id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-navy/40 uppercase tracking-widest mb-2 ml-1">Sub-classification</label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full bg-warm-white px-6 py-3 rounded-xl text-navy border border-border focus:outline-none focus:border-terracotta transition-premium font-bold text-xs uppercase tracking-widest appearance-none"
                    required
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sizes */}
              <div className="bg-card-bg p-8 rounded-2xl shadow-premium border border-border space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Layers size={20} className="text-terracotta" />
                  <h3 className="text-sm font-black text-navy uppercase tracking-widest">Available Sizes <span className="text-[10px] text-navy/40 lowercase tracking-normal">(Optional)</span></h3>
                </div>
                    
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="Enter size (e.g. S, M, XL)"
                        id="sizeInput"
                        className="flex-1 bg-warm-white px-6 py-4 rounded-xl text-navy border border-border focus:outline-none focus:border-terracotta transition-premium font-bold"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSize(e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('sizeInput');
                          handleAddSize(input.value);
                          input.value = '';
                        }}
                        className="bg-navy-fixed text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-terracotta transition-premium"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {formData.sizes.map((size, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-navy-fixed text-white px-4 py-2 rounded-lg group">
                          <span className="text-xs font-black uppercase tracking-widest">{size}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSize(idx)}
                            className="text-white/40 hover:text-white transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

              {/* Visual Assets */}
              <div className="bg-card-bg p-8 rounded-2xl shadow-premium border border-border space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <ImageIcon size={20} className="text-terracotta" />
                  <h3 className="text-sm font-black text-navy uppercase tracking-widest">Visual Assets</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center group hover:border-terracotta transition-premium bg-warm-white/50 cursor-pointer relative overflow-hidden">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={images.length >= 5}
                      className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="w-12 h-12 bg-card-bg rounded-full flex items-center justify-center shadow-premium mb-4 group-hover:scale-110 transition-transform">
                      <ImageIcon className="text-terracotta" />
                    </div>
                    <p className="text-xs font-black text-navy uppercase tracking-widest mb-1">Upload Product Photos</p>
                    <p className="text-[8px] text-navy/30 uppercase tracking-widest">JPG, PNG or WebP • Max 5MB • Up to 5 images</p>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-4 cursor-pointer p-4 bg-warm-white rounded-xl border border-border hover:border-terracotta transition-premium">
                      <input
                        type="checkbox"
                        checked={formData.is360View}
                        onChange={(e) => setFormData({ ...formData, is360View: e.target.checked })}
                        className="w-6 h-6 accent-terracotta"
                      />
                      <div>
                        <p className="text-[10px] font-black text-navy uppercase tracking-widest">Enable 360° Viewing</p>
                        <p className="text-[8px] text-navy/40 uppercase tracking-widest">Interactive experience for users</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-4 cursor-pointer p-4 bg-warm-white rounded-xl border border-border hover:border-terracotta transition-premium">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-6 h-6 accent-terracotta"
                      />
                      <div>
                        <p className="text-[10px] font-black text-navy uppercase tracking-widest">Set as Featured</p>
                        <p className="text-[8px] text-navy/40 uppercase tracking-widest">Highlight in main slider</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 cursor-pointer p-4 bg-warm-white rounded-xl border border-border hover:border-navy-fixed transition-premium">
                      <input
                        type="checkbox"
                        checked={formData.isTrending}
                        onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                        className="w-6 h-6 accent-navy"
                      />
                      <div>
                        <p className="text-[10px] font-black text-navy uppercase tracking-widest">Mark as Trending</p>
                        <p className="text-[8px] text-navy/40 uppercase tracking-widest">Show in "Trending Now" section</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 cursor-pointer p-4 bg-warm-white rounded-xl border border-border hover:border-navy-fixed transition-premium">
                      <input
                        type="checkbox"
                        checked={formData.isBestSeller}
                        onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                        className="w-6 h-6 accent-navy"
                      />
                      <div>
                        <p className="text-[10px] font-black text-navy uppercase tracking-widest">Mark as Best Seller</p>
                        <p className="text-[8px] text-navy/40 uppercase tracking-widest">Show in "Most Sold" section</p>
                      </div>
                    </label>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-5 gap-4 pt-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-product group">
                        <img
                          src={URL.createObjectURL(img)}
                          alt=""
                          className="w-full h-full object-cover rounded-xl border border-border shadow-premium"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <div className="absolute inset-0 bg-navy-fixed/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-navy-fixed text-white rounded-2xl font-black uppercase tracking-[0.3em] hover:bg-terracotta transition-premium shadow-2xl disabled:opacity-50 flex items-center justify-center gap-4 text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    {isEdit ? 'Finalize Changes' : 'Initialize Product'}
                  </>
                )}
              </button>
            </form>

            {/* Live Preview Gallery */}
            <div className="hidden lg:block">
              <div className="sticky top-8 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <h2 className="text-[10px] font-black text-navy uppercase tracking-[0.4em]">Live Gallery Preview</h2>
                </div>
                
                <div className="w-full">
                  <div className="bg-card-bg rounded-3xl overflow-hidden border border-border shadow-2xl scale-[0.98] hover:scale-100 transition-premium">
                    <div className="aspect-product relative bg-warm-white flex items-center justify-center overflow-hidden">
                      {images.length > 0 ? (
                        <img
                          src={URL.createObjectURL(images[activePreviewIndex] || images[0])}
                          alt=""
                          className="w-full h-full object-cover transition-all duration-700"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-4 text-navy/10">
                          <ImageIcon size={64} strokeWidth={1} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Asset Required</span>
                        </div>
                      )}
                      
                      {formData.hasDiscount && formData.discountPercent && (
                        <div className="absolute top-6 left-6 bg-terracotta text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-sm shadow-premium">
                          {formData.discountPercent}% OFF
                        </div>
                      )}
                    </div>

                    <div className="p-8 space-y-4">
                      <div className="flex justify-between items-start">
                        <p className="text-[8px] font-black text-navy/30 uppercase tracking-[0.2em]">
                          {formData.category || 'Collection Name'}
                        </p>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-1 rounded-full bg-terracotta" />)}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-serif font-black text-navy line-clamp-2 leading-tight">
                        {formData.name || 'Your Curated Masterpiece'}
                      </h3>
                      
                      <div className="flex items-baseline gap-3 pt-2">
                        <span className="text-xl font-black text-navy">
                          ₹{(formData.hasDiscount ? formData.discountedPrice : formData.price) || '0'}
                        </span>
                        {formData.hasDiscount && formData.price && (
                          <span className="text-xs text-navy/20 line-through font-bold">
                            ₹{formData.price}
                          </span>
                        )}
                      </div>

                      <div className="pt-4 flex gap-2">
                        {images.map((img, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setActivePreviewIndex(i)}
                            className={`w-10 h-12 rounded-lg border-2 transition-premium overflow-hidden shrink-0 ${
                              i === activePreviewIndex ? 'border-terracotta scale-105' : 'border-transparent opacity-40'
                            }`}
                          >
                            <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-6 bg-navy-fixed rounded-2xl text-white/60 space-y-3">
                    <div className="flex items-center gap-3">
                      <Sparkles size={14} className="text-terracotta" />
                      <p className="text-[8px] font-black uppercase tracking-widest text-white">Editorial Insight</p>
                    </div>
                    <p className="text-[9px] leading-relaxed font-medium">
                      High-resolution photography and detailed descriptions significantly increase conversion rates. Ensure your assets reflect the premium nature of the brand.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAddProduct;
