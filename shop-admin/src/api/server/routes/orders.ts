import { Router } from "express";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const ordersCol = collection(db, "orders");
    const snapshot = await getDocs(ordersCol);
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString(),
    }));
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { productId, quantity, customerName, customerEmail, status } =
      req.body;

    if (!productId || !quantity || !customerName || !customerEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const docRef = await addDoc(collection(db, "orders"), {
      productId,
      quantity: Number(quantity),
      customerName,
      customerEmail,
      status: status || "pending",
      createdAt: Timestamp.now(),
      updatedAt: null,
    });

    res.status(201).json({ id: docRef.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(doc(db, "orders", id), updateData);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDoc(doc(db, "orders", id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
