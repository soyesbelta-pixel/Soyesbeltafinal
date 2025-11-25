/**
 * Pre-carga de variables de entorno
 * Este archivo se ejecuta ANTES que index.js para garantizar que dotenv se cargue primero
 */
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

console.log('🔐 Variables de entorno cargadas');
console.log('   RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Definido ✅' : 'UNDEFINED ❌');
