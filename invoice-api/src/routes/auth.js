import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { usersStorage } from '../utils/jsonStorage.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    console.log('🔍 Register request received:', { name: req.body.name, email: req.body.email, company: req.body.company, phone: req.body.phone, address: req.body.address });
    const { name, email, password, company, phone, address, plan } = req.body;

    // Validation
    if (!name || !email || !password) {
      console.log('❌ Register validation failed: missing fields');
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = usersStorage.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: 'Email already exists'
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur avec les informations de l'entreprise
    const userData = {
      name,
      email,
      password: hashedPassword,
      plan: plan || 'starter',
      company: {
        name: company || '',
        phone: phone || '',
        address: address || ''
      }
    };

    console.log('🔍 Creating user with data:', { ...userData, password: '[HIDDEN]' });

    const user = usersStorage.create(userData);

    console.log('✅ User created:', { id: user.id, name: user.name, email: user.email, hasCompany: !!user.company });

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data without password
    const { password: _, ...userResponseData } = user;

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: userResponseData,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Failed to create account'
    });
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Trouver l'utilisateur
    const user = usersStorage.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data without password
    const { password: _, ...userResponseData } = user;

    console.log('🔍 LOGIN API RESPONSE - user:', {
      id: userResponseData.id,
      name: userResponseData.name,
      email: userResponseData.email,
      company: userResponseData.company ? 'EXISTS' : 'MISSING',
      hasCompanyData: !!userResponseData.company
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponseData,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Failed to login'
    });
  }
});

// Route pour récupérer les informations de l'utilisateur connecté
router.get('/me', auth, (req, res) => {
  try {
    const user = usersStorage.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Remove password from response
    const { password, ...userProfile } = user;
    res.json({
      success: true,
      user: userProfile
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user information'
    });
  }
});

export default router;