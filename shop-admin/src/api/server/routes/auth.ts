import { Router } from "express";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  UserCredential,
} from "firebase/auth";
import { AuthError } from "firebase/auth";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    res.status(201).json({
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
    });
  } catch (error: unknown) {
    const authError = error as AuthError;
    let errorMessage = "Registration failed";

    switch (authError.code) {
      case "auth/email-already-in-use":
        errorMessage = "Email already in use";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email address";
        break;
      case "auth/weak-password":
        errorMessage = "Password is too weak";
        break;
    }

    res.status(400).json({ error: errorMessage });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    res.json({
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
    });
  } catch (error: unknown) {
    const authError = error as AuthError;
    let errorMessage = "Login failed";

    switch (authError.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        errorMessage = "Invalid email or password";
        break;
      case "auth/user-disabled":
        errorMessage = "Account disabled";
        break;
    }

    res.status(401).json({ error: errorMessage });
  }
});

router.post("/logout", async (req, res) => {
  try {
    await signOut(auth);
    res.json({ success: true });
  } catch (error: unknown) {
    res.status(500).json({ error: "Logout failed" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    await sendPasswordResetEmail(auth, email);
    res.json({ success: true, message: "Password reset email sent" });
  } catch (error: unknown) {
    const authError = error as AuthError;
    res.status(400).json({
      error:
        authError.code === "auth/user-not-found"
          ? "User not found"
          : "Failed to send reset email",
    });
  }
});

export default router;
