import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Beef,
  MapPin,
  Mail,
  Phone,
  Globe,
  Github,
  Twitter,
  Linkedin,
  Shield,
  BookOpen,
  HelpCircle,
  Zap,
} from "lucide-react";

// Props del componente Footer
interface FooterProps {
  className?: string;
  variant?: "full" | "minimal";
}

const Footer: React.FC<FooterProps> = ({
  className = "",
  variant = "full",
}) => {
  // Información de contacto
  const contactInfo = {
    email: "soporte@Bovino_Ujat.com",
    phone: "+52 (442) 123-4567",
    address: "Tabasco, México",
  };

  // Enlaces útiles
  const quickLinks = [
    { title: "Guía de Usuario", href: "/docs/guide", icon: BookOpen },
    { title: "API Documentation", href: "/docs/api", icon: Globe },
    { title: "Centro de Ayuda", href: "/help", icon: HelpCircle },
    { title: "Política de Privacidad", href: "/privacy", icon: Shield },
  ];

  // Enlaces de características
  const featureLinks = [
    { title: "Rastreo de Ganado", href: "/features/tracking", icon: MapPin },
    { title: "Control de Vacunas", href: "/features/vaccines", icon: Zap },
    { title: "Reportes de Salud", href: "/features/health", icon: Heart },
    {
      title: "Gestión de Ubicaciones",
      href: "/features/locations",
      icon: MapPin,
    },
  ];

  // Redes sociales
  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/bovinecare",
      icon: Github,
      color: "hover:text-gray-900",
    },
    {
      name: "Twitter",
      href: "https://twitter.com/bovinecare",
      icon: Twitter,
      color: "hover:text-blue-400",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/bovinecare",
      icon: Linkedin,
      color: "hover:text-blue-600",
    },
  ];

  // Estadísticas del sistema (mock data)
  const systemStats = {
    totalAnimals: 1247,
    vaccinationsThisMonth: 342,
    activeUsers: 156,
    dataPoints: 45678,
  };

  // Versión minimal del footer
  if (variant === "minimal") {
    return (
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`
          bg-white border-t border-gray-200 px-6 py-4
          ${className}
        `}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo y nombre */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Beef className="text-white" size={16} />
            </div>
            <div>
              <span className="font-bold text-gray-900">Bovino_Ujat</span>
              <span className="text-sm text-gray-500 ml-2">v1.0.0</span>
            </div>
          </div>

          {/* Copyright y enlaces */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>© 2025 Bovino_Ujat</span>
            <span>•</span>
            <a
              href="/privacy"
              className="hover:text-gray-700 transition-colors"
            >
              Privacidad
            </a>
            <span>•</span>
            <a href="/terms" className="hover:text-gray-700 transition-colors">
              Términos
            </a>
          </div>
        </div>
      </motion.footer>
    );
  }

  // Versión completa del footer
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`
        bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columna 1: Información de la empresa */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Beef className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900">Bovino_Ujat</h3>
                <p className="text-sm text-gray-600">
                  Gestión Ganadera Inteligente
                </p>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              Sistema integral para el manejo, seguimiento y control de ganado
              bovino con tecnología de geolocalización avanzada.
            </p>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="font-bold text-lg text-blue-600">
                  {systemStats.totalAnimals.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Animales</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="font-bold text-lg text-green-600">
                  {systemStats.vaccinationsThisMonth}
                </div>
                <div className="text-xs text-gray-500">Vacunas/Mes</div>
              </div>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <li key={link.href}>
                    <motion.a
                      whileHover={{ x: 4 }}
                      href={link.href}
                      className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      <IconComponent size={16} />
                      <span>{link.title}</span>
                    </motion.a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Columna 3: Características */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Características</h4>
            <ul className="space-y-3">
              {featureLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <li key={link.href}>
                    <motion.a
                      whileHover={{ x: 4 }}
                      href={link.href}
                      className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      <IconComponent size={16} />
                      <span>{link.title}</span>
                    </motion.a>
                  </li>
                );
              })}
            </ul>

            {/* Indicador de estado del sistema */}
            <div className="pt-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">Sistema Operativo</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Último mantenimiento: 02/07/2025
              </div>
            </div>
          </div>

          {/* Columna 4: Contacto y redes sociales */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Contacto</h4>

            {/* Información de contacto */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail size={16} className="text-blue-500" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {contactInfo.email}
                </a>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone size={16} className="text-green-500" />
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="hover:text-green-600 transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin size={16} className="text-red-500" />
                <span>{contactInfo.address}</span>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="pt-4">
              <h5 className="font-medium text-gray-900 mb-3">Síguenos</h5>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        p-2 bg-white rounded-lg shadow-sm text-gray-600 
                        transition-colors ${social.color}
                      `}
                      title={social.name}
                    >
                      <IconComponent size={18} />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright y versión */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>© 2025 Bovino_Ujat. Todos los derechos reservados.</span>
              <span className="hidden md:inline">•</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                Versión 1.0.0
              </span>
            </div>

            {/* Enlaces legales */}
            <div className="flex items-center gap-4 text-sm">
              <motion.a
                whileHover={{ y: -1 }}
                href="/privacy"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Política de Privacidad
              </motion.a>
              <span className="text-gray-300">|</span>
              <motion.a
                whileHover={{ y: -1 }}
                href="/terms"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Términos de Uso
              </motion.a>
              <span className="text-gray-300">|</span>
              <motion.a
                whileHover={{ y: -1 }}
                href="/cookies"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cookies
              </motion.a>
            </div>

            {/* Mensaje especial */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Hecho con</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
              >
                <Heart size={16} className="text-red-500" fill="currentColor" />
              </motion.div>
              <span>para el campo mexicano</span>
            </div>
          </div>
        </div>

        {/* Información adicional del desarrollador */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Desarrollado para la gestión eficiente de ganado bovino con
              tecnología moderna
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <MapPin size={12} className="text-gray-400" />
              <span className="text-xs text-gray-400">
                Orgullosamente desarrollado en Tabasco, México
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
