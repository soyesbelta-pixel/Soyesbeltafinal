import { motion } from 'framer-motion';
import { Droplets, Sun, Wind, Thermometer, Clock, AlertCircle, CheckCircle, XCircle, Sparkles, Heart } from 'lucide-react';

const CareGuide = () => {
  const careSteps = [
    {
      icon: Droplets,
      title: "Lavado Correcto",
      description: "Lava a mano con agua fría y jabón neutro",
      do: ["Usa agua fría (máx 30°C)", "Jabón neutro sin blanqueador", "Lava después de cada uso"],
      dont: ["No usar agua caliente", "No usar suavizante", "No dejar en remojo"]
    },
    {
      icon: Wind,
      title: "Secado Adecuado",
      description: "Seca a la sombra en lugar ventilado",
      do: ["Extiende en superficie plana", "Seca a la sombra", "Lugar ventilado"],
      dont: ["No usar secadora", "No exponer al sol directo", "No planchar"]
    },
    {
      icon: Clock,
      title: "Frecuencia de Uso",
      description: "Alterna entre 2 fajas para mayor durabilidad",
      do: ["Usa máximo 8 horas diarias", "Alterna entre 2 fajas", "Descansa tu piel"],
      dont: ["No usar para dormir", "No usar más de 8 horas", "No usar si irrita"]
    },
    {
      icon: Thermometer,
      title: "Almacenamiento",
      description: "Guarda en lugar fresco y seco",
      do: ["Lugar fresco y seco", "Dobla sin presionar", "Guarda limpia y seca"],
      dont: ["No guardar húmeda", "No en lugares calientes", "No con objetos pesados encima"]
    }
  ];

  const maintenance = [
    {
      frequency: "Diario",
      tasks: [
        "Lavar después de cada uso",
        "Secar completamente antes de guardar",
        "Revisar costuras y elásticos"
      ],
      color: "from-esbelta-terracotta to-esbelta-terracotta-dark"
    },
    {
      frequency: "Semanal",
      tasks: [
        "Inspección profunda de la prenda",
        "Verificar elasticidad",
        "Rotar entre diferentes fajas"
      ],
      color: "from-esbelta-sand to-esbelta-sand-dark"
    },
    {
      frequency: "Mensual",
      tasks: [
        "Lavado profundo con productos especiales",
        "Evaluación del ajuste y compresión",
        "Considerar reemplazo si es necesario"
      ],
      color: "from-esbelta-chocolate to-esbelta-chocolate-dark"
    }
  ];

  const lifespan = [
    { condition: "Uso diario con cuidado óptimo", duration: "12-18 meses", percentage: 95 },
    { condition: "Uso frecuente (4-5 días/semana)", duration: "8-12 meses", percentage: 75 },
    { condition: "Uso ocasional (2-3 días/semana)", duration: "18-24 meses", percentage: 100 },
    { condition: "Uso intensivo sin rotación", duration: "4-6 meses", percentage: 40 }
  ];

  return (
    <section id="cuidados" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-esbelta-chocolate mb-4">
            Cuidados y Mantenimiento
          </h2>
          <p className="text-esbelta-chocolate-light max-w-2xl mx-auto">
            Aprende a cuidar tu faja para mantenerla como nueva y extender su vida útil
          </p>
        </div>

        {/* Care Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {careSteps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-esbelta-terracotta to-esbelta-chocolate flex items-center justify-center mb-4`}>
                <step.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="font-bold text-esbelta-chocolate mb-2">{step.title}</h3>
              <p className="text-sm text-esbelta-chocolate-light mb-4">{step.description}</p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-esbelta-sand mb-2">✓ Recomendado</p>
                  {step.do.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1">
                      <CheckCircle className="w-3 h-3 text-esbelta-sand mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-esbelta-chocolate-light">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-esbelta-terracotta mb-2">✗ Evitar</p>
                  {step.dont.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1">
                      <XCircle className="w-3 h-3 text-esbelta-terracotta mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-esbelta-chocolate-light">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Maintenance Schedule */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-esbelta-chocolate mb-6 text-center">
            Programa de Mantenimiento
          </h3>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {maintenance.map((schedule, index) => (
              <div
                key={index}
                className="relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${schedule.color} opacity-5 rounded-2xl`} />
                <div className="relative p-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${schedule.color} text-white text-sm font-bold mb-4`}>
                    <Clock className="w-4 h-4" />
                    {schedule.frequency}
                  </div>
                  
                  <ul className="space-y-3">
                    {schedule.tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Sparkles className="w-4 h-4 text-esbelta-terracotta flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-esbelta-chocolate-light">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Lifespan */}
        <div className="bg-white rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-esbelta-chocolate mb-6 text-center">
            Vida Útil Estimada
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {lifespan.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-esbelta-chocolate">{item.condition}</span>
                  <span className="font-bold text-esbelta-terracotta">{item.duration}</span>
                </div>
                
                <div className="relative h-3 bg-esbelta-sand-light rounded-full overflow-hidden">
                  <div
                    style={{ width: `${item.percentage}%` }}
                    className={`absolute left-0 top-0 h-full bg-gradient-to-r ${
                      item.percentage > 75 ? 'from-esbelta-sand to-esbelta-sand-dark' :
                      item.percentage > 50 ? 'from-esbelta-terracotta to-esbelta-terracotta-dark' :
                      'from-esbelta-sand to-esbelta-sand-dark'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Alert */}
        <div className="mt-8 bg-gradient-to-r from-esbelta-terracotta/10 to-esbelta-sand/10 rounded-2xl p-6 border border-esbelta-terracotta/20">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-esbelta-terracotta flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-esbelta-chocolate mb-2">
                Consejo Profesional
              </h4>
              <p className="text-sm text-esbelta-chocolate-light">
                Tener 2 o más fajas te permite alternar su uso, dándole tiempo a cada prenda para recuperar 
                su forma y elasticidad. Esto puede duplicar la vida útil de tus fajas y mantener 
                un nivel óptimo de compresión constantemente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareGuide;