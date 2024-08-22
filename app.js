import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fileUpload from 'express-fileupload';
import { fileTypeFromBlob } from 'file-type';


// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Amanasthana@09',
//   database: 'rites'
// });

// connection.query('SELECT 1', (err, results) => {
//   if (err) {
//       console.error('Database query error:', err);
//       process.exit(1); // Exit process with failure
//   }
//   console.log('Database query successful:', results);
// });
// connection.connect((err) => {
//     if (err) {
//         console.error('Database connection error:', err);
//         process.exit(1); // Exit process with failure
//     }
//     console.log('Connected to database');
// });

function getFileExtension(mimeType) {
  const extensions = {
    'application/pdf': 'pdf',
    'image/jpeg': 'jpeg',
    'text/plain': 'txt',
    'image/png': 'png'
  };

  return extensions[mimeType] || 'unknown';
}
dotenv.config();
const app = express();
const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());

const port = process.env.PORT || 5000;

// Database setup
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Amanasthana@09',
  database: 'rites',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Endpoint to get folders and documents
app.post('/api/getData', async (req, res) => {
  try {
    const { menu_name } = req.body;
    const sqlGetFolders = 'SELECT * FROM folders WHERE menu_name = ?  AND hide=0';
    const sqlGetDocuments = `
      SELECT id, name, icon, folder_name, menu_name, hide
      FROM documents 
      WHERE (menu_name = ? OR folder_name IN (SELECT name FROM folders WHERE menu_name = ?)) AND hide=0
    `;

    const [folders] = await db.query(sqlGetFolders, [menu_name]);
    const [documents] = await db.query(sqlGetDocuments, [menu_name, menu_name]);

    res.json({ folders, documents });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: 'Database error' });
  }
});

// Endpoint to add a document or folder
app.post('/api/postDocument', async (req, res) => {
  try {
    const { file_type, name, menu, folder_name } = req.body;

    if (!file_type || !name || !menu) {
      return res.status(400).json({ message: 'File type, name, and menu are required' });
    }

    if (file_type === 'Document') {
      if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'A document file is required' });
      }

      const file = req.files.file;

      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({ message: 'Invalid file type. Only PDF, JPEG, and PNG files are allowed.' });
      }

      const query = 'INSERT INTO documents (file_type, name, menu_name, folder_name, file) VALUES (?,?,?,?,?)';
      await db.query(query, [file_type, name, menu, folder_name, file.data]);

      res.json({ message: 'File uploaded and document data inserted successfully', document: { file_type, name, menu, folder_name } });
    } else if (file_type === 'Folder') {
      const query = 'INSERT INTO folders (name, menu_name) VALUES (?,?)';
      await db.query(query, [name, menu]);

      res.json({ message: 'Folder created successfully', folder: { name, menu } });
    } else {
      res.status(400).json({ message: 'Invalid file type' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to update a document or folder
app.patch('/api/:menu/:folder', async (req, res) => {
  try {
    const { menu, folder } = req.params;
    const { hide } = req.body;

    if (hide === undefined) {
      return res.status(400).json({ message: 'Hide status is required' });
    }
    
   // Update folder
   const folderQuery = 'UPDATE folders SET hide =? WHERE name =? AND menu_name =?';
   await db.query(folderQuery, [hide, folder, menu]);

    const query = 'UPDATE documents SET hide =? WHERE menu_name =? AND name =?';
    await db.query(query, [hide, menu, folder]);

    res.json({ message: 'Document or folder updated successfully' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Endpoint to unarchive documents and folders
app.patch('/api/unarchive', async (req, res) => {
  try {
    const { folderIds, documentIds } = req.body;

    if (!folderIds || !documentIds) {
      return res.status(400).json({ message: 'Folder IDs and document IDs are required' });
    }

    if (folderIds.length > 0) {
      // Unarchive folders
      const folderQuery = 'UPDATE folders SET hide = 0 WHERE id IN (?)';
      await db.query(folderQuery, [folderIds]);
    }

    if (documentIds.length > 0) {
      // Unarchive documents
      const documentQuery = 'UPDATE documents SET hide = 0 WHERE id IN (?)';
      await db.query(documentQuery, [documentIds]);
    }

    res.json({ message: 'Files unarchived successfully' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



// Endpoint to serve a document by ID
app.get('/api/document/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const query = 'SELECT * FROM documents WHERE id = ?';
    const [results] = await db.query(query, [docId]);

    if (results.length > 0) {
      const document = results[0];
      const fileBuffer = document.file; // Ensure this is a Buffer

      if (!Buffer.isBuffer(fileBuffer)) {
        console.error('Expected a Buffer but received:', fileBuffer);
        return res.status(500).send('Internal Server Error');
      }

      // Convert Buffer to Blob
      const blob = new Blob([fileBuffer]);

      // Detect MIME type from Blob
      const type = await fileTypeFromBlob(blob);

      if (type && type.mime) {
        const ext = getFileExtension(type.mime);
        res.setHeader('Content-Type', type.mime);
        res.send(fileBuffer);
      } else {
        // Handle plain text specifically if not detected by file-type
        res.setHeader('Content-Type', 'text/plain');
        res.send(fileBuffer);
      }
    } else {
      res.status(404).send('Document not found');
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Server error');
  }
});

// Endpoint to get all folders
app.get('/api/folders', async (req, res) => {
  try {
    const query = 'SELECT * FROM folders';
    const [results] = await db.query(query);
    res.send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching folders' });
  }
});
// Endpoint to get all documents
app.get('/api/documents', async (req, res) => {
  try {
    const query = 'SELECT id, name, menu_name, folder_name, hide FROM documents';
    const [results] = await db.query(query);
    res.send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching documents' });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the Server
app.listen(4000, () => {
  console.log(`App is running on port: http://localhost:${port}`);
});



