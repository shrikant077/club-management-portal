const { Signup, Login, Listevent, Addevent, Updateevent, Deletevent, Findevent, Availableslot, Changepassword } = require("../controllers/AuthController");
const {userVerification} = require("../middlewares/AuthMiddleware");

const express = require("express");
const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post('/',userVerification);
router.post('/hostevents', Addevent);
router.get('/events', Listevent);
router.get('/available/:date/:venue', Availableslot);
router.get('/find/:id', Findevent);
router.patch('/update/:id', Updateevent);
router.patch('/changepassword', Changepassword);
router.delete('/:id', Deletevent);

module.exports = router;