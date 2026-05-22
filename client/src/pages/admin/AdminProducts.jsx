import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminSidebar from '../../components/AdminSidebar';
import { useSettings } from '../../context/SettingsContext';
import api from '../../api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';
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
      <div className="flex bg-warm-white min-h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-serif font-black text-navy mb-2">Products</h1>
              <p className="text-navy/40 text-xs font-bold uppercase tracking-widest">Manage Your Inventory</p>
            </div>
            <Link
              to="/admin/products/add"
              className="bg-navy-fixed text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-terracotta transition-premium shadow-2xl shadow-navy/20"
            >
              + Initialize Product
            </Link>
          </div>


          {/* Products Table */}
          <div className="bg-card-bg rounded-3xl overflow-hidden shadow-premium border border-border">
            {loading ? (
              <div className="p-20 text-center">
                <div className="w-10 h-10 border-4 border-navy/10 border-t-terracotta rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">Fetching Inventory...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="p-20 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">No products discovered</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-navy-fixed text-white">
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Asset</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Product Name</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Category</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Price</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Stock</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Status</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-warm-white transition-colors group">
                        <td className="px-8 py-4">
                          <div className="w-16 h-20 bg-warm-white rounded-lg overflow-hidden border border-border group-hover:border-terracotta transition-premium">
                            {product.images?.[0]?.url ? (
                              <img 
                                src={getImageUrl(product.images[0].url)} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-navy/5">
                                <span className="text-[8px] font-black text-navy/20 uppercase">No Image</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <p className="text-sm font-bold text-navy">{product.name}</p>
                          <p className="text-[10px] text-navy/40 font-bold uppercase tracking-widest">{product.subcategory}</p>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-[10px] font-black text-navy/60 uppercase tracking-widest">{product.category}</span>
                        </td>
                        <td className="px-8 py-4">
                          <p className="text-sm font-black text-navy">₹{product.price}</p>
                          {product.discountedPrice && (
                            <p className="text-[10px] text-terracotta font-black">₹{product.discountedPrice}</p>
                          )}
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm font-bold text-navy">{product.stock}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex flex-col gap-1">
                            {product.isFeatured && (
                              <span className="text-[8px] font-black bg-terracotta/10 text-terracotta px-2 py-0.5 rounded-full w-fit uppercase">Featured</span>
                            )}
                            {product.isTrending && (
                              <span className="text-[8px] font-black bg-navy/10 text-navy px-2 py-0.5 rounded-full w-fit uppercase tracking-tighter">Trending</span>
                            )}
                            {product.isBestSeller && (
                              <span className="text-[8px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded-full w-fit uppercase tracking-tighter">Bestseller</span>
                            )}
                            {product.is360View && (
                              <span className="text-[8px] font-black bg-navy/10 text-navy px-2 py-0.5 rounded-full w-fit uppercase">360°</span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-4">
                            <Link to={`/admin/products/edit/${product._id}`} className="text-navy/40 hover:text-navy transition-colors">
                              <span className="text-[10px] font-black uppercase tracking-widest underline underline-offset-4">Edit</span>
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <span className="text-[10px] font-black uppercase tracking-widest underline underline-offset-4">Scrap</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
