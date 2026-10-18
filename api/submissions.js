import {
  createToolSubmission,
  createGuideSubmission,
  readSubmissionsAsync,
  updateSubmissionStatusAsync,
  publishSubmissionToCatalogAsync,
  readPublishedAdditionsAsync,
  isAuthorized,
} from '../server/submissionsStore.js';

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
        return res.status(result.status || (result.success ? 200 : 400)).json(result);
      }

      // Public submission
      const body = req.body || {};
      const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';

      if (body.type === 'guide') {
        const result = await createGuideSubmission(body, clientIp);
        return res.status(result.status).json(result);
      } else {
        // Default to tool
        const result = await createToolSubmission(body, clientIp);
        return res.status(result.status).json(result);
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

      const body = req.body || {};
      const result = await updateSubmissionStatusAsync(id, body, req.headers);
      return res.status(result.status).json(result);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API Error in /api/submissions:', err);
    return res.status(500).json({ error: 'Internal server error processing submission.' });
  }
}
