import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminSidebar from '../../components/AdminSidebar';
import { useSettings } from '../../context/SettingsContext';
import api from '../../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Edit3, Trash2, Plus, Info, Layers } from 'lucide-react';

const AdminCategories = () => {
  const { settings } = useSettings();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'men',
    subcategories: '',
    requiresSize: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (cat) => {
    setIsEdit(true);
    setCurrentId(cat._id);
    setFormData({
      name: cat.name,
      gender: cat.gender,
      subcategories: cat.subcategories.join(', '),
      requiresSize: cat.requiresSize,
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setIsEdit(false);
    setCurrentId(null);
    setFormData({ name: '', gender: 'men', subcategories: '', requiresSize: false });
    setIsModalOpen(true);
  };

  const builtInCategories = ['Ornaments', 'Watches', 'Dresses', 'Clothing', 'Shoes', 'Kids Wear', 'Toys'];

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (builtInCategories.includes(categoryName)) {
      toast.error('This is a built-in category and cannot be deleted.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this category? All products in this category may be affected.')) return;
    try {
      await api.delete(`/api/categories/${categoryId}`);
      setCategories(categories.filter((c) => c._id !== categoryId));
      toast.success('Category purged successfully');
    } catch (error) {
      toast.error('Failed to purge category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        subcategories: formData.subcategories.split(',').map(s => s.trim()).filter(s => s)
      };

      if (isEdit) {
        const response = await api.put(`/api/categories/${currentId}`, payload);
        setCategories(categories.map(c => c._id === currentId ? response.data.category : c));
        toast.success('Category updated successfully');
      } else {
        const response = await api.post('/api/categories', payload);
        setCategories([...categories, response.data.category]);
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Categories - {settings?.storeName || 'Zee Cart'} Admin</title>
      </Helmet>
      <div className="flex bg-warm-white min-h-screen">
        <AdminSidebar />
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 pt-20 md:pt-0">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Layers className="text-terracotta" size={24} />
                <h1 className="text-3xl md:text-4xl font-serif font-black text-navy">Category Hub</h1>
              </div>
              <p className="text-navy/40 text-[10px] font-black uppercase tracking-[0.4em]">Structure Your Global Inventory</p>
            </div>
            <button 
              onClick={openCreateModal}
              className="w-full sm:w-auto justify-center bg-navy-fixed text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-terracotta transition-premium shadow-2xl shadow-navy/20 flex items-center gap-3"
            >
              <Plus size={18} /> Initialize Category
            </button>
          </div>

          {/* Categories Table - Mobile First Scroll Architecture */}
          <div className="w-[calc(100vw-2rem)] md:w-full overflow-x-auto pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="bg-card-bg rounded-[2.5rem] overflow-hidden shadow-premium border border-border min-w-[800px]">
              {loading ? (
                <div className="p-40 text-center">
                  <div className="w-12 h-12 border-4 border-navy/5 border-t-terracotta rounded-full animate-spin mx-auto mb-6" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-navy/20">Syncing Taxonomy...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="p-40 text-center">
                  <Info size={48} className="mx-auto text-navy/5 mb-6" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-navy/20">No taxonomies defined</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-navy-fixed text-white">
                      <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em]">Identity</th>
                      <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em]">Classification</th>
                      <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em]">Sub-taxons</th>
                      <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em]">Sizing</th>
                      <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em]">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {categories.map((category) => (
                      <tr key={category._id} className="hover:bg-warm-white transition-colors group">
                        <td className="px-10 py-6">
                          <span className="text-sm font-black text-navy uppercase tracking-widest">{category.name}</span>
                        </td>
                        <td className="px-10 py-6">
                          <span className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em]">{category.gender}</span>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex flex-wrap gap-2">
                            {category.subcategories.map((sub, idx) => (
                              <span key={idx} className="bg-navy/5 px-3 py-1.5 rounded-lg text-[9px] font-black text-navy uppercase tracking-widest border border-navy/5">
                                {sub}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className={`w-fit px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${category.requiresSize ? 'bg-green-100 text-green-700' : 'bg-navy/5 text-navy/40'}`}>
                            {category.requiresSize ? 'Required' : 'None'}
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-6">
                            <button
                              onClick={() => openEditModal(category)}
                              className="text-navy/40 hover:text-navy transition-colors flex items-center gap-2"
                            >
                              <Edit3 size={14} />
                              <span className="text-[9px] font-black uppercase tracking-widest underline underline-offset-4">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category._id, category.name)}
                              className="text-red-400 hover:text-red-600 transition-colors flex items-center gap-2"
                            >
                              <Trash2 size={14} />
                              <span className="text-[9px] font-black uppercase tracking-widest underline underline-offset-4">Purge</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-navy-fixed/80 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-card-bg rounded-[2rem] md:rounded-[3rem] w-full max-w-xl p-6 md:p-12 shadow-2xl border border-white/20 relative overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="absolute top-0 left-0 w-full h-3 bg-terracotta" />
            
            <div className="flex justify-between items-center mb-8 md:mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-black text-navy">{isEdit ? 'Refine Category' : 'New Category'}</h2>
                <p className="text-[10px] uppercase tracking-[0.4em] text-navy/30 font-black mt-2">Architecture Configuration</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-full bg-warm-white flex items-center justify-center text-navy/20 hover:text-red-500 hover:bg-red-50 transition-premium">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-navy/40 ml-1">Identity Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isEdit && builtInCategories.includes(formData.name)}
                    placeholder="e.g. Premium Tech"
                    className={`w-full px-6 py-5 rounded-2xl text-navy border focus:outline-none transition-premium font-bold text-sm ${isEdit && builtInCategories.includes(formData.name) ? 'bg-navy/5 border-border cursor-not-allowed text-navy/40' : 'bg-warm-white border-border focus:border-navy'}`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-navy/40 ml-1">Classification</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-warm-white px-6 py-5 rounded-2xl text-navy border border-border focus:outline-none focus:border-navy transition-premium font-black uppercase tracking-widest text-xs cursor-pointer appearance-none"
                  >
                    <option value="men">Men Only</option>
                    <option value="women">Women Only</option>
                    <option value="unisex">Unisex / Universal</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-navy/40 ml-1">Sub-taxons (Comma Separated)</label>
                <textarea
                  value={formData.subcategories}
                  onChange={(e) => setFormData({ ...formData, subcategories: e.target.value })}
                  placeholder="Casual, Formal, Smart, Digital..."
                  rows="3"
                  className="w-full bg-warm-white px-6 py-5 rounded-2xl text-navy border border-border focus:outline-none focus:border-navy transition-premium font-bold text-sm resize-none"
                />
              </div>

              <div className="flex items-center gap-5 p-6 bg-warm-white rounded-2xl border border-border cursor-pointer group hover:border-navy transition-premium">
                <input
                  type="checkbox"
                  id="requiresSize"
                  checked={formData.requiresSize}
                  onChange={(e) => setFormData({ ...formData, requiresSize: e.target.checked })}
                  className="w-7 h-7 accent-navy cursor-pointer"
                />
                <label htmlFor="requiresSize" className="cursor-pointer">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-navy">Enable Dimensional Attributes</p>
                  <p className="text-[8px] text-navy/30 uppercase tracking-[0.2em] font-bold">Require size selection during purchase flow</p>
                </label>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-navy-fixed text-white py-6 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-terracotta transition-premium shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : isEdit ? 'Update Architecture' : 'Initialize Category'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AdminCategories;
