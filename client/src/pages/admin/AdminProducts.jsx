import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminSidebar from '../../components/AdminSidebar';
import { useSettings } from '../../context/SettingsContext';
import api from '../../api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';
import { Edit2, Trash2, Image as ImageIcon, Package } from 'lucide-react';

const AdminProducts = () => {
  const { settings } = useSettings();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/products?page=${currentPage}&limit=20&sort=newest`);
        setProducts(response.data.products);
        setTotalPages(response.data.pages);
      } catch (error) {
        toast.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/api/products/${productId}`);
      setProducts(products.filter((p) => p._id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products;

  return (
    <>
      <Helmet>
        <title>Products - {settings?.storeName || 'Zee Cart'} Admin</title>
      </Helmet>
      <div className="flex bg-warm-white min-h-screen w-full max-w-full overflow-x-hidden">
        <AdminSidebar />
        <div className="flex-1 min-w-0 p-4 md:p-8 overflow-x-hidden w-full max-w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 pt-20 md:pt-0">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-black text-navy mb-2">Products</h1>
              <p className="text-navy/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">Manage Your Inventory</p>
            </div>
            <Link
              to="/admin/products/add"
              className="w-full sm:w-auto text-center bg-navy-fixed text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-terracotta transition-premium shadow-2xl shadow-navy/20"
            >
              + Initialize Product
            </Link>
          </div>


          {/* Products Table - Mobile First Scroll Architecture */}
          <div className="bg-card-bg rounded-3xl shadow-premium border border-border w-full overflow-hidden">
            <div className="w-full overflow-x-auto no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="min-w-[1000px]">
              {loading ? (
                <div className="p-20 text-center">
                  <div className="w-10 h-10 border-4 border-navy/10 border-t-terracotta rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">Fetching Inventory...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="p-20 text-center">
                  <Package size={48} strokeWidth={1} className="mx-auto text-navy/20 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">No products discovered</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-navy-fixed text-white">
                      <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Asset</th>
                      <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Product Name</th>
                      <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Category</th>
                      <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Price</th>
                      <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Stock</th>
                      <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Visibility</th>
                      <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-warm-white transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-16 h-20 bg-warm-white rounded-lg overflow-hidden border border-border group-hover:border-terracotta transition-premium">
                            {product.images?.[0]?.url ? (
                              <img 
                                src={getImageUrl(product.images[0].url)} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-navy/5 gap-2">
                                <ImageIcon size={16} className="text-navy/20" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-bold text-navy mb-1">{product.name}</p>
                          <p className="text-[9px] text-navy/40 font-black uppercase tracking-widest">{product.subcategory || 'General'}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-block px-3 py-1 bg-navy/5 rounded-md text-[10px] font-black text-navy/60 uppercase tracking-widest border border-navy/10">{product.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            {product.discountedPrice ? (
                              <>
                                <span className="text-sm font-black text-terracotta">₹{product.discountedPrice}</span>
                                <span className="text-[10px] text-navy/30 font-bold line-through">₹{product.price}</span>
                              </>
                            ) : (
                              <span className="text-sm font-black text-navy">₹{product.price}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {product.stock > 10 ? (
                              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            ) : product.stock > 0 ? (
                              <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                            )}
                            <span className="text-sm font-bold text-navy">{product.stock} <span className="text-[9px] text-navy/40 uppercase tracking-widest ml-1">Units</span></span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-2 max-w-[150px]">
                            {product.isFeatured && (
                              <span className="text-[8px] font-black bg-terracotta/10 text-terracotta px-2 py-1 rounded-md uppercase tracking-wider">Featured</span>
                            )}
                            {product.isTrending && (
                              <span className="text-[8px] font-black bg-navy/10 text-navy px-2 py-1 rounded-md uppercase tracking-wider">Trending</span>
                            )}
                            {product.isBestSeller && (
                              <span className="text-[8px] font-black bg-green-100 text-green-700 px-2 py-1 rounded-md uppercase tracking-wider">Bestseller</span>
                            )}
                            {!product.isFeatured && !product.isTrending && !product.isBestSeller && (
                              <span className="text-[8px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded-md uppercase tracking-wider">Standard</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-3">
                            <Link 
                              to={`/admin/products/edit/${product._id}`} 
                              className="p-2 text-navy/40 hover:text-navy hover:bg-navy/5 rounded-lg transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 size={16} />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 size={16} />
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-8 mt-12">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-navy hover:bg-navy-fixed hover:text-white transition-premium disabled:opacity-20"
              >
                ←
              </button>
              <span className="text-[10px] font-black text-navy uppercase tracking-[0.3em]">
                Collection {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-navy hover:bg-navy-fixed hover:text-white transition-premium disabled:opacity-20"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminProducts;
