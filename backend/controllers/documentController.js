const Document = require('../models/Document');

exports.uploadDocument = async (req, res) => {
  console.log("hello");
  try {
    const { title, description } = req.body; 
    const fileBuffer = req.file.buffer; 
    const fileType = req.file.mimetype;
    const tenantId = req.user.id;
    console.log(tenantId);
    const newDocument = new Document({
      tenant:tenantId, 
      title,
      description,
      file: fileBuffer,
      fileType,
    });
    console.log(newDocument);

    const doc=await newDocument.save();
    console.log(doc);
    res.status(201).json(doc);
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Failed to upload document.', error });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find();
    console.log(documents);
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Failed to fetch documents.', error });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }
    res.status(200).json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: 'Failed to fetch document.', error });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }
    res.set('Content-Type', document.fileType);
    res.send(document.file); // Send the file as binary
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({ message: 'Failed to download document.', error });
  }
};
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    await Document.findByIdAndDelete(req.params.id); // Use findByIdAndDelete to remove the document
    res.status(200).json({ message: 'Document deleted successfully.' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Failed to delete document.', error });
  }
};
