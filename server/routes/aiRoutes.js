
import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

const AI_SERVICE_URL = (
  process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000'
).replace(/\/$/, '');

router.use(requireAuth, requireRole('admin'));

router.use(async (req, res) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);

  try {
    const targetPath = req.path === '/health' ? '/health' : req.originalUrl;

    const options = {
      method: req.method,
      headers: {
        Accept: req.get('accept') || 'application/json',
      },
      signal: controller.signal,
    };

    if (!['GET', 'HEAD'].includes(req.method)) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(req.body ?? {});
    }

    const response = await fetch(
      `${AI_SERVICE_URL}${targetPath}`,
      options
    );

    const responseBody = await response.text();

    res.status(response.status);

    const contentType = response.headers.get('content-type');
    if (contentType) res.set('Content-Type', contentType);

    return res.send(responseBody);
  } catch (error) {
    console.error('AI service error:', error.message);

    return res.status(error.name === 'AbortError' ? 504 : 502)
      .json({
        message: error.name === 'AbortError'
          ? 'AI service request timed out.'
          : 'Unable to connect to Python AI service.',
      });
  } finally {
    clearTimeout(timeout);
  }
});

export default router;
