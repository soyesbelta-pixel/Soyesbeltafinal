import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide splash after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Call onComplete after fade out animation
      setTimeout(() => onComplete(), 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Handle click to skip
  const handleClick = () => {
    setIsVisible(false);
    setTimeout(() => onComplete(), 300);
  };

  // CSS styles exactly as in loading.css
  const styles = {
    splash: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #F5EFE7 0%, #F5EFE7 40%, #C9B7A5 70%, #7D9A86 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      transition: 'opacity 0.5s ease-out',
      overflow: 'hidden',
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? 'auto' : 'none',
      cursor: 'pointer'
    },
    splashContainer: {
      textAlign: 'center',
      position: 'relative',
      zIndex: 10
    },
    splashLogo: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '3.5rem',
      fontWeight: 800,
      letterSpacing: '-0.03em',
      color: '#3B2F2F',
      marginBottom: '10px',
      animation: 'fadeInScale 1s ease-out',
      position: 'relative'
    },
    splashTagline: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '0.9rem',
      fontWeight: 400,
      letterSpacing: '0.15em',
      color: '#7D9A86',
      textTransform: 'uppercase',
      animation: 'fadeInUp 1s ease-out 0.3s both',
      marginBottom: '40px'
    },
    loadingContainer: {
      position: 'relative',
      width: '200px',
      height: '60px',
      margin: '0 auto'
    },
    loadingSilhouette: {
      position: 'relative',
      width: '60px',
      height: '60px',
      margin: '0 auto',
      animation: 'morphShape 3s ease-in-out infinite'
    },
    loadingSilhouetteBefore: {
      content: "''",
      position: 'absolute',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #D27C5A, #7D9A86)',
      animation: 'morphTop 3s ease-in-out infinite'
    },
    loadingSilhouetteAfter: {
      content: "''",
      position: 'absolute',
      width: '60px',
      height: '60px',
      top: '20px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #D27C5A, #7D9A86)',
      animation: 'morphBottom 3s ease-in-out infinite'
    },
    loadingBar: {
      position: 'absolute',
      bottom: '-20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '120px',
      height: '2px',
      background: 'rgba(201, 183, 165, 0.2)',
      borderRadius: '2px',
      overflow: 'hidden'
    },
    loadingProgress: {
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      width: '30%',
      background: 'linear-gradient(90deg, transparent, #D27C5A, transparent)',
      animation: 'loading 1.5s ease-in-out infinite'
    },
    splashFeatures: {
      position: 'absolute',
      bottom: '60px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '30px',
      animation: 'fadeInUp 1s ease-out 0.6s both'
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '0.75rem',
      color: '#7D9A86',
      fontWeight: 500
    },
    featureIcon: {
      width: '16px',
      height: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    decorativeCircle: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(210, 124, 90, 0.1), transparent)',
      animation: 'floatBubble 6s ease-in-out infinite'
    },
    circle1: {
      width: '200px',
      height: '200px',
      top: '-100px',
      left: '-100px',
      animationDelay: '0s'
    },
    circle2: {
      width: '150px',
      height: '150px',
      bottom: '-75px',
      right: '-75px',
      animationDelay: '2s'
    },
    circle3: {
      width: '100px',
      height: '100px',
      top: '50%',
      right: '10%',
      animationDelay: '4s'
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes morphTop {
          0%, 100% {
            border-radius: 50% 50% 50% 50%;
            transform: scale(1) translateY(0);
          }
          33% {
            border-radius: 50% 50% 20% 20%;
            transform: scale(0.8, 1.2) translateY(-5px);
          }
          66% {
            border-radius: 50% 50% 40% 40%;
            transform: scale(1.1, 0.9) translateY(0);
          }
        }

        @keyframes morphBottom {
          0%, 100% {
            border-radius: 50% 50% 50% 50%;
            transform: scale(1);
          }
          33% {
            border-radius: 20% 20% 50% 50%;
            transform: scale(0.9, 1.1);
          }
          66% {
            border-radius: 40% 40% 50% 50%;
            transform: scale(1.1, 0.8);
          }
        }

        @keyframes morphShape {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(180deg);
          }
        }

        @keyframes loading {
          0% {
            left: -40%;
          }
          100% {
            left: 100%;
          }
        }

        @keyframes floatBubble {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
            opacity: 0.5;
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
            opacity: 0.3;
          }
        }

        @media (max-width: 640px) {
          .splash-logo {
            font-size: 2.5rem !important;
          }
          .splash-features {
            flex-direction: column !important;
            gap: 15px !important;
          }
        }
      `}</style>

      <div id="splash" style={styles.splash} onClick={handleClick}>
        {/* Decorative Elements */}
        <div style={{...styles.decorativeCircle, ...styles.circle1}}></div>
        <div style={{...styles.decorativeCircle, ...styles.circle2}}></div>
        <div style={{...styles.decorativeCircle, ...styles.circle3}}></div>

        {/* Main Content */}
        <div style={styles.splashContainer}>
          <h1 className="splash-logo" style={styles.splashLogo}>Esbelta</h1>
          <p style={styles.splashTagline}>Fajas Colombianas Premium</p>

          <div style={styles.loadingContainer}>
            <div style={styles.loadingSilhouette}>
              <div style={styles.loadingSilhouetteBefore}></div>
              <div style={styles.loadingSilhouetteAfter}></div>
            </div>
            <div style={styles.loadingBar}>
              <div style={styles.loadingProgress}></div>
            </div>
          </div>

          <div className="splash-features" style={styles.splashFeatures}>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✨</span>
              <span>Calidad Premium</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>🛡️</span>
              <span>Garantía 30 días</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>🚚</span>
              <span>Envío Gratis</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SplashScreen;