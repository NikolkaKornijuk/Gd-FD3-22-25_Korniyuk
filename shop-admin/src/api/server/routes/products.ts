import { Router } from "express";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const productsCol = collection(db, "products");
    const snapshot = await getDocs(productsCol);
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, price, description, quantity } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }
    console.log(req.body);
    const docRef = await addDoc(collection(db, "products"), {
      name,
      price: Number(price),
      description: description || "",
      quantity: Number(quantity),
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, quantity } = req.body;

    await updateDoc(doc(db, "products", id), {
      ...(name && { name }),
      ...(price && { price: Number(price) }),
      ...(description && { description }),
      ...(quantity && { quantity: Number(quantity) }),
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDoc(doc(db, "products", id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
