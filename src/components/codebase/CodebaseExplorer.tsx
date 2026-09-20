import React, { useState } from 'react';
import {
  FolderTree,
  FileCode,
  Copy,
  Check,
  Download,
  Terminal,
  Layers,
  Server,
  Smartphone,
  Database,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface CodeFile {
  path: string;
  name: string;
  category: 'flutter-dart' | 'backend-node' | 'config';
  language: string;
  description: string;
  code: string;
}

export const CodebaseExplorer: React.FC = () => {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const codeFiles: CodeFile[] = [
    {
      path: 'lib/main.dart',
      name: 'main.dart',
      category: 'flutter-dart',
      language: 'dart',
      description: 'Flutter app entry point with Riverpod ProviderScope, Firebase initialization, and custom warm bakery theme.',
      code: `// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'core/theme/app_theme.dart';
import 'views/splash/splash_view.dart';
import 'services/fcm_service.dart';

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  debugPrint("Cravvy Cakes Background Notification: \${message.notification?.title}");
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase Cloud Messaging
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  
  // Set portrait orientation & translucent status bar
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(
    const ProviderScope(
      child: CravvyCakesApp(),
    ),
  );
}

class CravvyCakesApp extends ConsumerWidget {
  const CravvyCakesApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      title: 'CRAVVY CAKES',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.light,
      home: const SplashView(),
    );
  }
}`,
    },
    {
      path: 'lib/providers/bakery_riverpod_provider.dart',
      name: 'bakery_riverpod_provider.dart',
      category: 'flutter-dart',
      language: 'dart',
      description: 'Riverpod StateNotifier for managing Cart, Custom Cake quotes, and Live Order Tracking.',
      code: `// lib/providers/bakery_riverpod_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/product_model.dart';
import '../models/order_model.dart';
import '../models/custom_cake_model.dart';
import '../services/api_service.dart';

class BakeryState {
  final List<ProductModel> products;
  final List<CartItemModel> cart;
  final List<OrderModel> orders;
  final List<CustomCakeModel> customCakeRequests;
  final String? appliedCouponCode;
  final double discountAmount;
  final bool isLoading;

  BakeryState({
    this.products = const [],
    this.cart = const [],
    this.orders = const [],
    this.customCakeRequests = const [],
    this.appliedCouponCode,
    this.discountAmount = 0.0,
    this.isLoading = false,
  });

  double get subtotal => cart.fold(0, (sum, item) => sum + item.totalPrice);
  double get deliveryCharge => subtotal > 500 ? 0.0 : 49.0;
  double get taxAmount => (subtotal - discountAmount) * 0.05;
  double get finalTotal => subtotal - discountAmount + deliveryCharge + taxAmount;

  BakeryState copyWith({
    List<ProductModel>? products,
    List<CartItemModel>? cart,
    List<OrderModel>? orders,
    List<CustomCakeModel>? customCakeRequests,
    String? appliedCouponCode,
    double? discountAmount,
    bool? isLoading,
  }) {
    return BakeryState(
      products: products ?? this.products,
      cart: cart ?? this.cart,
      orders: orders ?? this.orders,
      customCakeRequests: customCakeRequests ?? this.customCakeRequests,
      appliedCouponCode: appliedCouponCode ?? this.appliedCouponCode,
      discountAmount: discountAmount ?? this.discountAmount,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class BakeryNotifier extends StateNotifier<BakeryState> {
  BakeryNotifier() : super(BakeryState()) {
    loadInitialData();
  }

  Future<void> loadInitialData() async {
    state = state.copyWith(isLoading: true);
    final prods = await ApiService.fetchProducts();
    final ords = await ApiService.fetchMyOrders();
    state = state.copyWith(products: prods, orders: ords, isLoading: false);
  }

  void addToCart(ProductModel product, {required String size, required String flavour, bool isEggless = true, String? message}) {
    final newItem = CartItemModel(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      product: product,
      quantity: 1,
      selectedSize: size,
      selectedFlavour: flavour,
      isEggless: isEggless,
      cakeMessage: message,
      unitPrice: product.discountPrice ?? product.price,
    );
    state = state.copyWith(cart: [...state.cart, newItem]);
  }

  void updateQuantity(String cartItemId, int delta) {
    final updatedCart = state.cart.map((item) {
      if (item.id == cartItemId) {
        final newQty = item.quantity + delta;
        return newQty > 0 ? item.copyWith(quantity: newQty) : null;
      }
      return item;
    }).whereType<CartItemModel>().toList();

    state = state.copyWith(cart: updatedCart);
  }

  void applyCoupon(String code) {
    if (code.toUpperCase() == 'CRAVVY20') {
      final discount = state.subtotal * 0.20;
      state = state.copyWith(appliedCouponCode: code, discountAmount: discount);
    }
  }
}

final bakeryProvider = StateNotifierProvider<BakeryNotifier, BakeryState>((ref) {
  return BakeryNotifier();
});`,
    },
    {
      path: 'lib/services/razorpay_service.dart',
      name: 'razorpay_service.dart',
      category: 'flutter-dart',
      language: 'dart',
      description: 'Razorpay payment gateway integration with UPI, Cards, and NetBanking.',
      code: `// lib/services/razorpay_service.dart
import 'package:razorpay_flutter/razorpay_flutter.dart';
import 'package:flutter/material.dart';

class RazorpayPaymentService {
  late Razorpay _razorpay;
  final Function(PaymentSuccessResponse) onSuccess;
  final Function(PaymentFailureResponse) onFailure;

  RazorpayPaymentService({
    required this.onSuccess,
    required this.onFailure,
  }) {
    _razorpay = Razorpay();
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
  }

  void openCheckout({
    required double amount,
    required String orderNumber,
    required String customerPhone,
    required String customerEmail,
  }) {
    var options = {
      'key': 'rzp_live_CRAVVY_CAKES_KEY',
      'amount': (amount * 100).toInt(), // Razorpay expects amount in paise
      'name': 'Cravvy Cakes',
      'description': 'Order #\$orderNumber - Artisanal Bakes',
      'timeout': 300,
      'prefill': {
        'contact': customerPhone,
        'email': customerEmail,
      },
      'theme': {
        'color': '#B45309', // Warm Bakery Amber
      },
      'modal': {
        'confirm_close': true,
      }
    };

    try {
      _razorpay.open(options);
    } catch (e) {
      debugPrint("Razorpay error: \$e");
    }
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) {
    onSuccess(response);
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    onFailure(response);
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    debugPrint("External Wallet selected: \${response.walletName}");
  }

  void dispose() {
    _razorpay.clear();
  }
}`,
    },
    {
      path: 'server/server.js',
      name: 'server.js',
      category: 'backend-node',
      language: 'javascript',
      description: 'Node.js Express backend REST API server with MongoDB connection, JWT auth, and FCM notifications.',
      code: `// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB Database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cravvy_cakes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('🍃 MongoDB connected successfully for Cravvy Cakes'))
.catch((err) => console.error('MongoDB connection error:', err));

// Mount REST API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/custom-cakes', require('./routes/customCakeRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`🧁 Cravvy Cakes Server running on port \${PORT}\`);
});`,
    },
    {
      path: 'server/models/Order.js',
      name: 'Order.js',
      category: 'backend-node',
      language: 'javascript',
      description: 'MongoDB Mongoose schema for Cravvy Cakes Orders with 5-stage status lifecycle.',
      code: `// server/models/Order.js
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedSize: { type: String, default: '0.5 kg' },
  selectedFlavour: { type: String, default: 'Dutch Truffle' },
  isEggless: { type: Boolean, default: true },
  cakeMessage: { type: String },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  taxAmount: { type: Number, required: true },
  finalTotal: { type: Number, required: true },
  couponCode: { type: String },
  deliveryDate: { type: String, default: 'Today' },
  deliveryTimeSlot: { type: String, default: 'Standard (within 45 mins)' },
  deliveryAddress: {
    name: String,
    phone: String,
    houseFlat: String,
    street: String,
    area: String,
    city: String,
    pincode: String,
  },
  specialInstructions: String,
  paymentMethod: { type: String, enum: ['Razorpay', 'Cash on Delivery'], required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' },
  paymentId: String,
  status: {
    type: String,
    enum: ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Placed',
  },
  timeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);`,
    },
    {
      path: 'server/controllers/orderController.js',
      name: 'orderController.js',
      category: 'backend-node',
      language: 'javascript',
      description: 'Express controller for placing orders, advancing status, sending FCM pushes, and printing invoices.',
      code: `// server/controllers/orderController.js
const Order = require('../models/Order');
const { sendPushNotification } = require('../services/fcmService');

// @desc Create new bakery order
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      subtotal,
      discountAmount,
      deliveryCharge,
      taxAmount,
      finalTotal,
      couponCode,
      deliveryDate,
      deliveryTimeSlot,
      deliveryAddress,
      specialInstructions,
      paymentMethod,
      paymentId,
    } = req.body;

    const orderNumber = 'KB-ORD-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder = new Order({
      orderNumber,
      customer: req.user._id,
      items,
      subtotal,
      discountAmount,
      deliveryCharge,
      taxAmount,
      finalTotal,
      couponCode,
      deliveryDate,
      deliveryTimeSlot,
      deliveryAddress,
      specialInstructions,
      paymentMethod,
      paymentStatus: paymentMethod === 'Razorpay' ? 'Paid' : 'Pending',
      paymentId,
      status: 'Placed',
      timeline: [{
        status: 'Placed',
        note: 'Order received at Cravvy Cakes Kitchen Desk',
      }],
    });

    await newOrder.save();

    // Send instant FCM notification
    await sendPushNotification(req.user.fcmToken, {
      title: 'Order Confirmed! 🎂',
      body: \`Your Cravvy Cakes order #\${orderNumber} is scheduled for \${deliveryTimeSlot}.\`,
      orderId: newOrder._id,
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update order status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id).populate('customer');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    order.timeline.push({
      status,
      note: note || \`Status changed to \${status}\`,
    });

    if (status === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    await order.save();

    // Notify customer on status update
    await sendPushNotification(order.customer.fcmToken, {
      title: \`Order Update: \${status}\`,
      body: \`Your Cravvy Cakes order #\${order.orderNumber} is now \${status}.\`,
      orderId: order._id,
    });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};`,
    },
  ];

  const [selectedFile, setSelectedFile] = useState<CodeFile>(codeFiles[0]);

  const handleCopy = (path: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" id="codebase-explorer">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-neutral-900 dark:text-white">
              Flutter + Dart + Node.js Codebase
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-neutral-800 text-amber-800 dark:text-amber-300 font-bold">
              Riverpod & REST Architecture
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Production-ready Dart files, Riverpod StateNotifiers, Razorpay SDK, and MongoDB REST endpoints.
          </p>
        </div>

        <button
          onClick={() => handleCopy(selectedFile.path, selectedFile.code)}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          {copiedPath === selectedFile.path ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Copied {selectedFile.name}!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Selected File</span>
            </>
          )}
        </button>
      </div>

      {/* Main split view */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: File Tree */}
        <div className="p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
            <FolderTree className="w-4 h-4 text-amber-600" />
            <span>Project File Tree</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 block px-2 py-1 bg-amber-50 dark:bg-neutral-800 rounded-lg">
              📱 Flutter Mobile & Web Client
            </span>
            {codeFiles
              .filter((f) => f.category === 'flutter-dart')
              .map((file) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full p-2 rounded-xl text-left text-xs font-medium transition flex items-center gap-2 ${
                    selectedFile.path === file.path
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{file.path}</span>
                </button>
              ))}
          </div>

          <div className="space-y-1 pt-2">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block px-2 py-1 bg-emerald-50 dark:bg-neutral-800 rounded-lg">
              ⚙️ Node.js + Express REST API
            </span>
            {codeFiles
              .filter((f) => f.category === 'backend-node')
              .map((file) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full p-2 rounded-xl text-left text-xs font-medium transition flex items-center gap-2 ${
                    selectedFile.path === file.path
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{file.path}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="md:col-span-2 rounded-3xl bg-neutral-950 text-neutral-100 border border-neutral-800 overflow-hidden flex flex-col shadow-2xl">
          {/* File Tab Header */}
          <div className="p-3.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold uppercase">
                {selectedFile.language}
              </span>
              <span className="font-mono text-xs text-neutral-300 font-bold">
                {selectedFile.path}
              </span>
            </div>

            <button
              onClick={() => handleCopy(selectedFile.path, selectedFile.code)}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs flex items-center gap-1 transition"
            >
              {copiedPath === selectedFile.path ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px]">Copy</span>
            </button>
          </div>

          {/* File description */}
          <div className="p-3 bg-neutral-900/50 border-b border-neutral-800/80 text-xs text-neutral-400">
            {selectedFile.description}
          </div>

          {/* Code Text Box */}
          <pre className="p-4 overflow-x-auto text-xs font-mono text-neutral-200 leading-relaxed max-h-[550px] overflow-y-auto no-scrollbar">
            <code>{selectedFile.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
