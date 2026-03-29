import express from "express";
import { usersStorage } from "../utils/jsonStorage.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET company information for current user
router.get("/", auth, (req, res) => {
  try {
    const user = usersStorage.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      company: user.company || {
        name: "",
        address: "",
        phone: ""
      }
    });
  } catch (error) {
    console.error("Erreur GET /company:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// UPDATE company information
router.put("/", auth, (req, res) => {
  try {
    const { name, address, phone } = req.body;

    // Backend validation - reject empty required fields
    if (!name?.trim() || !address?.trim() || !phone?.trim()) {
      return res.status(400).json({
        error: 'All company fields (name, address, phone) are required'
      });
    }

    const userId = req.user.userId;

    const company = {
      name: name.trim(),
      address: address.trim(),
      phone: phone.trim()
    };

    const updatedUser = usersStorage.update(userId, { company });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      message: "Company information updated successfully",
      company: updatedUser.company
    });
  } catch (error) {
    console.error("Erreur PUT /company:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
