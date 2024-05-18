const User = require("../models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");
const Records = require("../models/RecordModel");
// const moment = require('moment');

module.exports.Signup = async (req, res, next) => {
    try {
        const { ename, email, password, createdAt } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "User already exists" });
        }

        // const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
        const user = await User.create({ ename, email, password, createdAt });

        const token = createSecretToken(user._id);

        res.cookie("token", token, {
            httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not accessible via JavaScript
            secure: true, // Ensures the cookie is sent only over HTTPS
            sameSite: 'None', // Required for cross-site cookies
        });
        res.status(201).json({ message: "User signed in successfully", success: "true", user });
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: 'Incorrect password or email' });
        }
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.json({ message: 'Incorrect password or email' });
        }

        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not accessible via JavaScript
            secure: true, // Ensures the cookie is sent only over HTTPS
            sameSite: 'None', // Required for cross-site cookies
        });
        res.status(201).json({ message: "User logged in successfully", success: true });
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports.Listevent = async (req, res) => {
    try {
        const events = await Records.find({});
        res.status(200).send(events);
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error
        });
    }
}

module.exports.Changepassword = async (req, res, next) => {
    try {
        const { email, currpassword, newpassword, confirmpassword } = req.body;
        if (!email || !currpassword || !newpassword || !confirmpassword) {
            return res.json({ message: "All fields are required", success: false });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: 'User not found', success: false });
        }
        const auth = await bcrypt.compare(currpassword, user.password);
        if (!auth) {
            return res.json({ message: 'Incorrect current password', success: false });
        }
        if (newpassword !== confirmpassword) {
            return res.json({ message: 'New password and confirm password do not match', success: false });
        }
        // const hashedPassword = await bcrypt.hash(newpassword, 10);
        user.password = newpassword;
        await user.save();
        res.json({ message: 'Password changed successfully', success: true });
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.Availableslot = async (req, res) => {
    try {
        const date = req.params.date;
        const venue = req.params.venue;

        const bookedTimeSlots = await Records.aggregate([
            { $match: { date, venue } },
            { $group: { _id: "$timeslot" } }
        ]).exec(); // Use .exec() to execute the aggregation

        const bookedSlots = bookedTimeSlots.map(slot => slot._id);

        const allTimeSlots = ["10 AM - 12 PM", "12:30 PM - 1:30 PM", "2 PM -  4 PM", "4 PM - 6 PM"];
        const availableTimeSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

        res.status(200).send(availableTimeSlots);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving available time slots");
    }
}

module.exports.Addevent = async (req, res) => {
    try {
        const { eventname, club, venue, date, timeslot } = req.body;
        // const formattedDate = moment(date, "YYYY-MM-DD hh:mm A").format("YYYY-MM-DDTHH:mm");
        const event = await Records.create({ eventname, club, venue, date, timeslot });
        res.status(201).json({
            message: "Record Added Successfully",
            success: true,
            event
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error
        });
    }
}

module.exports.Findevent = async (req, res) => {
    let event = await Records.findById(req.params.id);
    if (!event) {
        return res.status(404).send("Not Found");
    }
    res.send(event);
}

module.exports.Updateevent = async (req, res) => {
    const { eventname, club, venue, date, timeslot } = req.body;

    const updateEvent = {
        eventname: eventname,
        club: club,
        venue: venue,
        date: date,
        timeslot: timeslot
    };
    // if (eventname) { updateEvent.eventname = eventname };
    // if (club) { updateEvent.club = club };
    // if (venue) { updateEvent.venue = venue };
    // if (date) { updateEvent.date = date };


    let event = await Records.findById(req.params.id);
    if (!event) {
        return res.status(404).send("Not Found");
    }

    event = await Records.findByIdAndUpdate(req.params.id, { $set: updateEvent }, { new: true })
    res.send(event);
}

module.exports.Deletevent = async (req, res) => {
    try {
        let event = await Records.findById(req.params.id);
        if (!event) {
            return res.status(404).send("Not Found");
        }

        event = await Records.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: 'Event deleted Successfully',
            data: {
                event
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}

// module.exports = Signup;