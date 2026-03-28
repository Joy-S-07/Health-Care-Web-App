/**
 * Flask proxy routes
 * Forwards /api/flask/* requests to the Flask backend
 * Uses native fetch instead of http-proxy-middleware to avoid
 * the deprecated util._extend API issue.
 */

const FLASK_URL = process.env.FLASK_URL || 'http://localhost:5000';

function setupFlaskProxy(app) {
  // Catch-all: proxy every request under /api/flask/* to Flask
  app.all('/api/flask/*', async (req, res) => {
    // Strip the /api/flask prefix to get the Flask path
    const flaskPath = req.originalUrl.replace(/^\/api\/flask/, '') || '/';
    const targetUrl = `${FLASK_URL}${flaskPath}`;

    console.log(`[Flask Proxy] ${req.method} ${req.originalUrl} → ${targetUrl}`);

    try {
      const fetchOptions = {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Forward body for POST/PUT/PATCH
      if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
        fetchOptions.body = JSON.stringify(req.body);
      }

      const response = await fetch(targetUrl, fetchOptions);
      const data = await response.json();

      res.status(response.status).json(data);
    } catch (err) {
      console.error('Flask proxy error:', err.message);
      res.status(502).json({
        message: 'Flask service is unavailable. Make sure the Flask server is running (python flask_app/app.py).',
      });
    }
  });
}

module.exports = setupFlaskProxy;
