const express = require("express");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const User = require("./public/models/user");
const Product = require('./public/models/product');
const bodyParser = require("body-parser");
const crypto = require("crypto");
const secretKey = crypto.randomBytes(64).toString("hex");

const app = express();
app.use(bodyParser.json());
const port = 3000;

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

mongoose
  .connect("mongodb+srv://admin:admin123@cluster0.yxoxahr.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    const newUser = new User({
      username,
      password,
      email,
    });

    const savedUser = await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    if (password !== user.password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      orders: user.orders,
    };
    res.status(200).json({ message: "User logged in successfully", user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/check-auth-status", (req, res) => {
  const isAuthenticated = req.session.user;

  const isUser = req.session.user !== undefined;

  res.json({ isAuthenticated, isUser });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).json({ message: "Logout failed" });
    } else {
      res.json({ message: "Logout successful" });
    }
  });
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/product', async (req, res) => {
  try {
      const productName = req.query.name;
      const product = await Product.findOne({ name: productName });

      if (!product) {
          return res.status(404).json({ error: 'Product not found' });
      }

      const userId = req.session.user._id;
      const orderDetails = {
        product: product.name,
        quantity: 1,
        price: product.price,
        imageUrl: product.imageUrl,
        status: product.status,
    };
    await User.findByIdAndUpdate(
      userId,
      { $push: { orders: orderDetails } },
      { new: true }
  );
      res.json(product);
  } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user-orders', async (req, res) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const formattedOrders = user.orders.map(order => ({
      product: order.product,
      quantity: order.quantity,
      price: order.price,
      imageUrl: order.imageUrl,
      status: order.status,
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/cancel-order', async (req, res) => {
  try {
    const { orderName } = req.body;

    const user = await User.findOne({ username: req.session.user.username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const orderIndex = user.orders.findIndex(order => order.product === orderName);

    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }

    user.orders.splice(orderIndex, 1);
    await user.save();

    res.json({ message: 'Order canceled successfully' });
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
async function updateDeliveryStatusForAllOrders() {
  try {
    const users = await User.find();

    for (const user of users) {
      for (const order of user.orders) {
        switch (order.status) {
          case 'Pending':
            order.status = 'Order Confirmed';
            break;
          case 'Order Confirmed':
            order.status = 'Dispatched';
            break;
          case 'Dispatched':
            order.status = 'Delivered';
            break;
        }
      }

      await user.save();
    }
  } catch (error) {
    console.error('Error updating delivery status:', error);
  }
}

setInterval(() => {
  updateDeliveryStatusForAllOrders();
}, 10000);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
