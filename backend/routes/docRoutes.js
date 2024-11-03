const express = require('express');
const multer = require('multer');
const {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  downloadDocument,
  deleteDocument
} = require('../controllers/documentController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', verifyToken, upload.single('file'), uploadDocument);
router.get('/', verifyToken, getAllDocuments);
router.get('/:id', verifyToken, getDocumentById);
router.get('/download/:id', verifyToken, downloadDocument);
router.delete('/:id', verifyToken, deleteDocument);


module.exports = router;
