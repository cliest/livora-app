import { Router } from 'express';
import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { requireAdmin } from '../lib/auth.js';

export const uploadsRouter = Router();

const UPLOADS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../uploads');

const EXT_BY_MIME = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}${EXT_BY_MIME[file.mimetype]}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => cb(null, Object.hasOwn(EXT_BY_MIME, file.mimetype)),
});

// POST /api/admin/uploads — admin only, used by the dashboard for team
// member and testimonial photos. Stores to server/uploads and returns the
// public URL it's served back at (see express.static in src/index.js).
uploadsRouter.post('/', requireAdmin, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(422).json({ ok: false, error: 'Upload failed: ' + err.message });
    }
    if (err) return res.status(500).json({ ok: false, error: 'Upload failed.' });
    if (!req.file) return res.status(422).json({ ok: false, error: 'Only JPG, PNG or WebP images are accepted.' });
    res.status(201).json({ ok: true, url: `/uploads/${req.file.filename}` });
  });
});
