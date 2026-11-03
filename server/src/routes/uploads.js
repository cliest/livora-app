import { createRouter } from '../lib/router.js';
import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { requireAdmin } from '../lib/auth.js';

export const uploadsRouter = createRouter();

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
// Our own wording for multer's limit errors — its messages are written for
// developers ("Unexpected field"), not for clinic staff.
const MULTER_MESSAGES = {
  LIMIT_FILE_SIZE: 'That image is too large. Please choose one under 5 MB.',
  LIMIT_FILE_COUNT: 'Please upload one image at a time.',
  LIMIT_UNEXPECTED_FILE: 'Please upload one image at a time.',
};

uploadsRouter.post('/', requireAdmin, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(422).json({ ok: false, error: MULTER_MESSAGES[err.code] || 'That file could not be uploaded.' });
    }
    if (err) return next(err);
    if (!req.file) return res.status(422).json({ ok: false, error: 'Only JPG, PNG or WebP images are accepted.' });
    res.status(201).json({ ok: true, url: `/uploads/${req.file.filename}` });
  });
});
