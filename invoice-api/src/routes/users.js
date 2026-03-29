import express from "express";
import bcrypt from "bcryptjs";
import { usersStorage } from "../utils/jsonStorage.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET current user profile
router.get("/profile", auth, (req, res) => {
  try {
    const user = usersStorage.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Remove password from response
    const { password, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    console.error("Erreur GET /users/profile:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// UPDATE user profile
router.put("/profile", auth, (req, res) => {
  try {
    const { name, email, company } = req.body;

    // Backend validation
    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({
        error: 'Name and email are required'
      });
    }

    const userId = req.user.userId;

    // Get current user to merge company data
    const currentUser = usersStorage.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Merge company name with existing company object
    const updatedCompany = {
      ...currentUser.company,
      name: company?.trim() || currentUser.company?.name || ""
    };

    const updatedUser = usersStorage.update(userId, {
      name,
      email,
      company: updatedCompany
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Remove password from response
    const { password, ...userProfile } = updatedUser;
    res.json(userProfile);
  } catch (error) {
    console.error("Erreur PUT /users/profile:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// UPDATE user password
router.put("/password", auth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'New password must be at least 6 characters long'
      });
    }

    // Get current user
    const currentUser = usersStorage.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = bcrypt.compareSync(currentPassword, currentUser.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

    // Update password
    const updatedUser = usersStorage.update(userId, {
      password: hashedNewPassword
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error("Erreur PUT /users/password:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;