import { LogOut, Mail } from 'lucide-react';
import { signOut } from '../../services/supabaseClient';

const AdminHeader = ({ onLogout }) => {
  const handleLogout = async () => {
    await signOut();
    if (onLogout) onLogout();
  };

  return (
    <header className="bg-gradient-to-r from-esbelta-chocolate to-esbelta-terracotta-dark shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
              <Mail className="w-6 h-6 text-esbelta-terracotta" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Esbelta Admin</h1>
              <p className="text-sm text-esbelta-cream">Panel de Suscripciones</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;