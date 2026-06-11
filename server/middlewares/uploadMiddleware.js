import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import mongoose from 'mongoose';

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  const allowedExtensions = ['.pdf', '.docx'];

  if (allowedExtensions.includes(ext)) {
    return cb(null, true);
  }

  cb(new Error('Only .pdf & .docx files are allowed'), false);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    (async () => {
      try {
        const recruiterId = req.user.recruiterId;

        const candidateId = new mongoose.Types.ObjectId();
        req.candidateId = candidateId;

        const uploadDir = path.join(
          'uploads',
          'resumes',
          recruiterId.toString(),
          candidateId.toString(),
        );

        await fs.mkdir(uploadDir, { recursive: true });

        cb(null, uploadDir);
      } catch (error) {
        cb(error);
      }
    })();
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `resume${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,  // 5 MB
  },
});

export default upload;
