const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt=require('bcryptjs');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Serve static files
app.use(express.json()); 

// MongoDB connection

    mongoose.connect('mongodb+srv://deepcoders0:ewGQpK7TFo40ITVN@deepviber03.vlc9q.mongodb.net/studentdb')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// User schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    login_id:{
        type:String,
        default: '1',
    }
});

const SignIn = mongoose.model('SignIn', userSchema,'SignIn');

// Route to handle user login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide both username and password.' });
        
    }
    const faculty = await SignIn.findOne({ username });
        if(faculty){
            return res.status(400).json({ message: 'Username Already Taken!', signin: false });
        }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newFaculty = new SignIn({ username, password:hashedPassword });

        await newFaculty.save();
        return res.status(200).json({ message:'successfully Signed In' ,signin: true });
    } catch (error) {
       return res.status(500).json({ message: 'Sorry ,YOU ARE NOT SIGNED IN.', error });
    }
});
app.use(express.static(path.join(__dirname, 'public')));
// Start server

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
