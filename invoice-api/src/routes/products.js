import express from "express";
import { productsStorage } from "../utils/jsonStorage.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET all products
router.get("/", auth, (req, res) => {
  try {
    const products = productsStorage.getAll();
    res.json(products);
  } catch (error) {
    console.error("Erreur GET /products:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET single product by ID
router.get("/:id", auth, (req, res) => {
  try {
    const { id } = req.params;
    const product = productsStorage.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }
    res.json(product);
  } catch (error) {
    console.error("Erreur GET /products/:id:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// CREATE product
router.post("/", auth, (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Le nom et le prix sont requis" });
    }

    const product = productsStorage.create({
      name,
      description,
      price: parseFloat(price),
      userId: req.user.userId
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Erreur POST /products:", error);
    res.status(500).json({ error: "Erreur lors de la création" });
  }
});

// UPDATE product
router.put("/:id", auth, (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const updatedProduct = productsStorage.update(id, {
      name,
      description,
      price: price ? parseFloat(price) : undefined
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Erreur PUT /products/:id:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE product
router.delete("/:id", auth, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = productsStorage.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    res.json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error("Erreur DELETE /products/:id:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;