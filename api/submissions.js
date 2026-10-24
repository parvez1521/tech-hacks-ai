import {
  createToolSubmission,
  createGuideSubmission,
  readSubmissionsAsync,
  updateSubmissionStatusAsync,
  publishSubmissionToCatalogAsync,
  readPublishedAdditionsAsync,
  isAuthorized,
} from '../server/submissionsStore.js';
import { getSafeApiFailure, logSanitizedApiError, safeApiOperationResult } from '../server/apiErrorHandling.js';

function readJsonBody(req) {
  if (req.bodyParseError) return null;
  try {
    const rawBody = req.body;
    if (rawBody === undefined || rawBody === null || rawBody === '') return {};
    const body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
    if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
    return body;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  const method = req.method;
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const action = url.searchParams.get('action');
  const id = url.searchParams.get('id');

  // Set standard JSON headers
  res.setHeader('Content-Type', 'application/json');

  try {
    // 1. GET /api/submissions?action=published -> Public published additions
    if (method === 'GET' && action === 'published') {
      const published = await readPublishedAdditionsAsync();
      return res.status(200).json(published);
    }

    // 2. GET /api/submissions -> Admin moderation queue
    if (method === 'GET') {
      if (!isAuthorized(req.headers)) {
        return res.status(401).json({ error: 'Unauthorized. Moderator access token required.' });
      }

      const all = await readSubmissionsAsync();
      const statusFilter = url.searchParams.get('status');
      const typeFilter = url.searchParams.get('type');
      const searchQuery = url.searchParams.get('q');

      let filtered = all;
      if (statusFilter && statusFilter !== 'all') {
        filtered = filtered.filter((s) => s.status === statusFilter);
      }
      if (typeFilter && typeFilter !== 'all') {
        filtered = filtered.filter((s) => s.type === typeFilter);
      }
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter((s) => {
          const name = s.toolData?.name || s.guideData?.title || '';
          const desc = s.toolData?.description || s.guideData?.summary || '';
          const submitter = s.toolData?.submitterName || s.guideData?.authorName || '';
          return (
            name.toLowerCase().includes(q) ||
            desc.toLowerCase().includes(q) ||
            submitter.toLowerCase().includes(q)
          );
        });
      }

      return res.status(200).json({ submissions: filtered });
    }

    // 3. POST /api/submissions (or with action=publish)
    if (method === 'POST') {
      // Check publish action
      if (action === 'publish' && id) {
        if (!isAuthorized(req.headers)) {
          return res.status(401).json({ error: 'Unauthorized. Moderator access token required.' });
        }
        const result = await publishSubmissionToCatalogAsync(id, req.headers);
        const response = safeApiOperationResult(result);
        return res.status(response.status).json(response.body);
      }

      // Public submission
      const body = readJsonBody(req);
      if (!body) return res.status(400).json({ error: 'InvalidRequest', message: 'Request body must be a valid JSON object.' });
      const forwarded = req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for'];
      const clientIp = String(forwarded || req.socket?.remoteAddress || '127.0.0.1').split(',')[0].trim();

      if (body.type === 'guide') {
        const result = await createGuideSubmission(body, clientIp);
        const response = safeApiOperationResult(result);
        return res.status(response.status).json(response.body);
      } else {
        // Default to tool
        const result = await createToolSubmission(body, clientIp);
        const response = safeApiOperationResult(result);
        return res.status(response.status).json(response.body);
      }
    }

    // 4. PATCH /api/submissions?id=... -> Moderator update
    if (method === 'PATCH') {
      if (!id) {
        return res.status(400).json({ error: 'Submission ID is required.' });
      }
      if (!isAuthorized(req.headers)) {
        return res.status(401).json({ error: 'Unauthorized. Moderator access token required.' });
      }

      const body = readJsonBody(req);
      if (!body) return res.status(400).json({ error: 'InvalidRequest', message: 'Request body must be a valid JSON object.' });
      const result = await updateSubmissionStatusAsync(id, body, req.headers);
      const response = safeApiOperationResult(result);
      return res.status(response.status).json(response.body);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    logSanitizedApiError('/api/submissions', err, req);
    const failure = getSafeApiFailure(err);
    return res.status(failure.status).json(failure.body);
  }
}
