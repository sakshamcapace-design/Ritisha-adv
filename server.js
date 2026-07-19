const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON data and allow cross-origin requests
app.use(cors());
app.use(express.json());

// API Endpoint to handle bookings
app.post('/api/book', (req, res) => {
    const newAppointment = req.body;
    
    // Add a timestamp to know exactly when the booking was made
    newAppointment.timestamp = new Date().toLocaleString();

    const filePath = path.join(__dirname, 'appointments.json');

    // Read the existing file (if it exists)
    fs.readFile(filePath, 'utf8', (err, data) => {
        let appointments = [];
        
        if (!err && data) {
            try {
                appointments = JSON.parse(data);
            } catch (e) {
                console.error("Error reading existing appointments", e);
            }
        }
        
        // Add the new booking to the list
        appointments.push(newAppointment);

        // Save the updated list back to the file
        fs.writeFile(filePath, JSON.stringify(appointments, null, 4), (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                return res.status(500).json({ message: 'Server error saving booking.' });
            }
            res.status(200).json({ message: 'Booking saved successfully!' });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
