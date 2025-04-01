import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import productsRoutes from "./routes/products";
import ordersRoutes from "./routes/orders";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
