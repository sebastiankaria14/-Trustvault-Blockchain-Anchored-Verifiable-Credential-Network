import { Router } from 'express';
import multer from 'multer';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getVerificationCenterStatus,
  uploadVerificationDocument
} from '../controllers/verificationCenterController.js';
import {
  authenticate,
  authorizeUserType,
  requireActiveAccount
} from '../middleware/auth.js';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../uploads/verification-docs');

if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname || '');
    const safeExtension = extension ? extension.toLowerCase() : '';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExtension}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only PDF, JPG, PNG, and WEBP are allowed.'));
  }

  return cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter
});

router.use(authenticate);
router.use(authorizeUserType('user', 'institution', 'verifier'));
router.use(requireActiveAccount());

router.get('/status', getVerificationCenterStatus);
router.post('/documents', upload.single('file'), uploadVerificationDocument);

export default router;
