// Departamentos y ciudades principales de Colombia
export const colombianLocations = {
  Antioquia: ['Medellín', 'Envigado', 'Itagüí', 'Bello', 'Rionegro', 'Sabaneta', 'La Estrella', 'Caldas'],
  Cundinamarca: ['Bogotá', 'Soacha', 'Chía', 'Zipaquirá', 'Facatativá', 'Mosquera', 'Funza', 'Madrid'],
  'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Cartago', 'Jamundí', 'Yumbo'],
  Atlántico: ['Barranquilla', 'Soledad', 'Malambo', 'Puerto Colombia', 'Galapa', 'Sabanalarga'],
  Bolívar: ['Cartagena', 'Magangué', 'Turbaco', 'Arjona', 'El Carmen de Bolívar'],
  Santander: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'San Gil', 'Barrancabermeja'],
  Risaralda: ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia'],
  Caldas: ['Manizales', 'Villamaría', 'La Dorada', 'Chinchiná', 'Riosucio'],
  Tolima: ['Ibagué', 'Espinal', 'Honda', 'Melgar', 'Chaparral'],
  'Norte de Santander': ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario', 'Los Patios'],
  Córdoba: ['Montería', 'Cereté', 'Lorica', 'Sahagún', 'Montelíbano'],
  Huila: ['Neiva', 'Pitalito', 'Garzón', 'La Plata', 'Campoalegre'],
  Cauca: ['Popayán', 'Santander de Quilichao', 'Puerto Tejada', 'Patía'],
  Quindío: ['Armenia', 'Calarcá', 'La Tebaida', 'Montenegro', 'Circasia'],
  Meta: ['Villavicencio', 'Acacías', 'Granada', 'Puerto López'],
  Nariño: ['Pasto', 'Tumaco', 'Ipiales', 'Túquerres'],
  Magdalena: ['Santa Marta', 'Ciénaga', 'Fundación', 'Plato'],
  Boyacá: ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Paipa'],
  Cesar: ['Valledupar', 'Aguachica', 'Bosconia', 'Chiriguaná'],
  Sucre: ['Sincelejo', 'Corozal', 'Sampués', 'San Marcos'],
};

// Obtener lista de departamentos
export const getDepartments = () => {
  return Object.keys(colombianLocations).sort();
};

// Obtener ciudades de un departamento
export const getCitiesByDepartment = (department) => {
  return colombianLocations[department] || [];
};

// Verificar si una ciudad es Medellín (legacy - mantener por compatibilidad)
export const isMedellinCity = (city) => {
  return city === 'Medellín';
};

// Verificar si una ciudad pertenece a Antioquia (para pago contra entrega)
export const isAntioquiaCity = (city, department) => {
  if (department) {
    return department === 'Antioquia';
  }
  const antioquiaCities = colombianLocations['Antioquia'] || [];
  return antioquiaCities.includes(city);
};

// Costos de envío
export const SHIPPING_COSTS = {
  ANTIOQUIA_CONTRA_ENTREGA: 10000,
  MEDELLIN_CONTRA_ENTREGA: 10000,
  OTRAS_CIUDADES: 18000,
};
