import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Package, Mail, Sparkles, Users, ShoppingBag } from 'lucide-react';
import AdminHeader from '../components/admin/AdminHeader';
import StatsCards from '../components/admin/StatsCards';
import EmailTable from '../components/admin/EmailTable';
import ExportButton from '../components/admin/ExportButton';
import ProductManager from '../components/admin/ProductManager';
import VirtualTryOnManager from '../components/admin/VirtualTryOnManager';
import VirtualTryOnLeads from '../components/admin/VirtualTryOnLeads';
import OrdersManager from '../components/admin/OrdersManager';
import {
  getCurrentUser,
  getEmailSubscriptions,
  getEmailStats,
  searchEmails
} from '../services/supabaseClient';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('emails'); // 'emails', 'orders', 'products', 'virtual-tryon', 'leads'
  const [stats, setStats] = useState({ total: 0, today: 0, week: 0 });
  const [emails, setEmails] = useState([]);
  const [allEmails, setAllEmails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 50;

  const checkAuth = useCallback(async () => {
    const { user, error } = await getCurrentUser();

    if (error || !user) {
      navigate('/admin');
      return;
    }

    loadData();
  }, [navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loadData = async () => {
    setIsLoading(true);

    try {
      // Load stats
      const statsResult = await getEmailStats();
      setStats(statsResult);

      // Load emails
      const emailsResult = await getEmailSubscriptions(currentPage, ITEMS_PER_PAGE);

      if (emailsResult.data) {
        setEmails(emailsResult.data);
        setTotalPages(Math.ceil((emailsResult.count || 0) / ITEMS_PER_PAGE));
      }

      // Load all emails for export
      const allEmailsResult = await getEmailSubscriptions(1, 10000);
      if (allEmailsResult.data) {
        setAllEmails(allEmailsResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadPageData(newPage);
  };

  const loadPageData = async (page) => {
    const emailsResult = await getEmailSubscriptions(page, ITEMS_PER_PAGE);
    if (emailsResult.data) {
      setEmails(emailsResult.data);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);

    if (!term.trim()) {
      // Reset to page 1 if search is cleared
      setCurrentPage(1);
      loadPageData(1);
      return;
    }

    // Search emails
    const searchResult = await searchEmails(term);
    if (searchResult.data) {
      setEmails(searchResult.data);
      setTotalPages(1); // Disable pagination for search results
    }
  };

  const handleLogout = () => {
    navigate('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-esbelta-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-2 shadow-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab('emails')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'emails'
                ? 'bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta text-white shadow-md'
                : 'text-esbelta-chocolate hover:bg-white'
            }`}
          >
            <Mail className="w-5 h-5" />
            <span>Suscripciones</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta text-white shadow-md'
                : 'text-esbelta-chocolate hover:bg-white'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Pedidos</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta text-white shadow-md'
                : 'text-esbelta-chocolate hover:bg-white'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Productos</span>
          </button>
          <button
            onClick={() => setActiveTab('virtual-tryon')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'virtual-tryon'
                ? 'bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta text-white shadow-md'
                : 'text-esbelta-chocolate hover:bg-white'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>Probador Virtual</span>
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'leads'
                ? 'bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta text-white shadow-md'
                : 'text-esbelta-chocolate hover:bg-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Leads Probador</span>
          </button>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Email Management Tab */}
        {activeTab === 'emails' && (
          <div>
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-esbelta-chocolate">
                Suscripciones de Email
              </h2>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-esbelta-sand-light text-esbelta-chocolate font-semibold rounded-xl hover:bg-white transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Actualizar</span>
                </button>

                <ExportButton data={allEmails} />
              </div>
            </div>

            {/* Email Table */}
            <EmailTable
              data={emails}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onSearch={handleSearch}
            />
          </div>
        )}

        {/* Orders Management Tab */}
        {activeTab === 'orders' && (
          <div>
            <OrdersManager />
          </div>
        )}

        {/* Product Management Tab */}
        {activeTab === 'products' && (
          <div>
            <ProductManager />
          </div>
        )}

        {/* Virtual Try-On Management Tab */}
        {activeTab === 'virtual-tryon' && (
          <div>
            <VirtualTryOnManager />
          </div>
        )}

        {/* Virtual Try-On Leads Tab */}
        {activeTab === 'leads' && (
          <div>
            <VirtualTryOnLeads />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;