import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import { signIn } from '../services/supabaseClient';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        setError('Email o contraseña incorrectos');
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        // Login successful
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error al iniciar sesión');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-esbelta-terracotta opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-esbelta-chocolate opacity-5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative h-40 bg-gradient-to-br from-esbelta-terracotta via-esbelta-terracotta-dark to-esbelta-chocolate overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-24 h-24 bg-white rounded-full blur-2xl" />
              <div className="absolute bottom-4 right-4 w-32 h-32 bg-white rounded-full blur-3xl" />
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-white mb-3"
              >
                <Sparkles className="w-12 h-12" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white">Esbelta Admin</h1>
              <p className="text-esbelta-cream text-sm mt-1">Panel de Administración</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-esbelta-chocolate mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-esbelta-sand" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@esbelta.com"
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-esbelta-sand-light rounded-xl focus:outline-none focus:ring-2 focus:ring-esbelta-terracotta focus:border-esbelta-terracotta transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-esbelta-chocolate mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-esbelta-sand" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-esbelta-sand-light rounded-xl focus:outline-none focus:ring-2 focus:ring-esbelta-terracotta focus:border-esbelta-terracotta transition-all"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-esbelta-terracotta to-esbelta-terracotta-dark text-white font-bold py-4 rounded-xl hover:from-esbelta-terracotta-dark hover:to-esbelta-chocolate transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <LogIn className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-esbelta-chocolate-light mt-6">
          Panel exclusivo para administradores de Esbelta
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;