const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5173; 

// MongoDB connection
mongoose.connect('mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Define a schema and model for uploaded files
const fileSchema = new mongoose.Schema({
    filename: String,
    path: String,
    originalname: String,
    mimetype: String,
    size: Number,
    uploadDate: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve static files (like HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Save file information to MongoDB
    const newFile = new File({
        filename: req.file.filename,
        path: req.file.path,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
    });

    try {
        await newFile.save();
        res.send('File uploaded and saved to database successfully!');
    } catch (err) {
        res.status(500).send('Failed to save file information to database.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
