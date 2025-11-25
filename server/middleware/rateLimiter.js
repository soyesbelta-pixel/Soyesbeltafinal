// Simple in-memory rate limiter
class RateLimiter {
  constructor(maxRequests = 20, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map(); // ip -> [{timestamp}]
  }

  middleware() {
    return (req, res, next) => {
      const ip = req.ip || req.connection.remoteAddress;
      const now = Date.now();

      // Inicializar o limpiar requests antiguos
      if (!this.requests.has(ip)) {
        this.requests.set(ip, []);
      }

      const userRequests = this.requests.get(ip);
      const recentRequests = userRequests.filter(
        timestamp => now - timestamp < this.windowMs
      );

      // Verificar límite
      if (recentRequests.length >= this.maxRequests) {
        return res.status(429).json({
          error: 'Too many requests',
          message: 'Por favor espera un momento antes de enviar más mensajes',
          retryAfter: Math.ceil(this.windowMs / 1000)
        });
      }

      // Agregar request actual
      recentRequests.push(now);
      this.requests.set(ip, recentRequests);

      next();
    };
  }

  // Limpiar memoria periódicamente
  startCleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [ip, requests] of this.requests.entries()) {
        const recentRequests = requests.filter(
          timestamp => now - timestamp < this.windowMs
        );
        if (recentRequests.length === 0) {
          this.requests.delete(ip);
        } else {
          this.requests.set(ip, recentRequests);
        }
      }
    }, this.windowMs);
  }
}

export default RateLimiter;
