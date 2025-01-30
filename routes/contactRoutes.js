const express = require("express");
const Contact = require("../models/Contact");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SECRET = "Akash@$123";

// Middleware to authenticate
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token after "Bearer"
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Create Contact
router.post("/contacts", authenticate, async (req, res) => {
  try {
    const { name, email, phone, address, country } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const contact = new Contact({
      userId: req.user.userId,
      name,
      email,
      phone,
      address,
      country,
    });
    await contact.save();

    res.status(201).json({ message: "Contact created successfully", contact });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get All Contacts
router.get("/contacts", authenticate, async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user.userId });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Search Contacts
router.get("/contacts/search", authenticate, async (req, res) => {
  try {
    const { name, email, phone } = req.query;
    const criteria = { userId: req.user.userId };
    if (name) criteria.name = new RegExp(name, "i");
    if (email) criteria.email = new RegExp(email, "i");
    if (phone) criteria.phone = new RegExp(phone, "i");

    const contacts = await Contact.find(criteria);
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
