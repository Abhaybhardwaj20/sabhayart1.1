import Order from '../models/Order.js';
import Painting from '../models/Painting.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { validateOrder } from '../utils/validations/index.js';

// @desc    Create order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const errors = validateOrder(req.body);
    if (errors.length > 0) throw ApiError.badRequest('Validation failed', errors);

    const { orderItems, shippingAddress, paymentMethod = 'COD', notes } = req.body;

    // Validate paintings and calculate prices
    let itemsPrice = 0;
    const validatedItems = [];

    for (const item of orderItems) {
      const painting = await Painting.findById(item.painting);
      if (!painting) throw ApiError.notFound(`Painting not found: ${item.painting}`);
      if (!painting.isAvailable) throw ApiError.badRequest(`${painting.title} is no longer available`);
      if (painting.stock < item.quantity) throw ApiError.badRequest(`Insufficient stock for ${painting.title}`);

      validatedItems.push({
        painting: painting._id,
        title: painting.title,
        image: painting.images[0]?.url || '',
        price: painting.price,
        quantity: item.quantity,
      });

      itemsPrice += painting.price * item.quantity;
    }

    const shippingPrice = itemsPrice > 5000 ? 0 : 199;
    const taxPrice = Math.round(itemsPrice * 0.18); // 18% GST
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const order = await Order.create({
      user: req.user._id,
      orderItems: validatedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      notes,
    });

    // Update stock
    for (const item of validatedItems) {
      await Painting.findByIdAndUpdate(item.painting, {
        $inc: { stock: -item.quantity, sold: item.quantity },
      });
    }

    const populatedOrder = await Order.findById(order._id).populate('user', 'name email');
    ApiResponse.created(res, { order: populatedOrder }, 'Order placed successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id }).sort('-createdAt').skip(skip).limit(limit),
      Order.countDocuments({ user: req.user._id }),
    ]);

    ApiResponse.success(res, {
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) throw ApiError.notFound('Order not found');

    // Allow only owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw ApiError.forbidden('Not authorized to view this order');
    }

    ApiResponse.success(res, { order });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark order as paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw ApiError.notFound('Order not found');
    if (order.isPaid) throw ApiError.badRequest('Order is already paid');

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer?.email_address,
    };
    order.orderStatus = 'Processing';

    const updatedOrder = await order.save();
    ApiResponse.success(res, { order: updatedOrder }, 'Payment successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw ApiError.notFound('Order not found');
    if (order.user.toString() !== req.user._id.toString()) throw ApiError.forbidden('Not authorized');
    if (['Shipped', 'Delivered'].includes(order.orderStatus)) {
      throw ApiError.badRequest('Cannot cancel order that has been shipped or delivered');
    }

    order.orderStatus = 'Cancelled';

    // Restore stock
    for (const item of order.orderItems) {
      await Painting.findByIdAndUpdate(item.painting, {
        $inc: { stock: item.quantity, sold: -item.quantity },
      });
    }

    await order.save();
    ApiResponse.success(res, { order }, 'Order cancelled successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    const query = status ? { orderStatus: status } : {};

    const [orders, total] = await Promise.all([
      Order.find(query).sort('-createdAt').skip(skip).limit(limit).populate('user', 'name email'),
      Order.countDocuments(query),
    ]);

    ApiResponse.success(res, {
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(orderStatus)) throw ApiError.badRequest('Invalid order status');

    const order = await Order.findById(req.params.id);
    if (!order) throw ApiError.notFound('Order not found');

    order.orderStatus = orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (orderStatus === 'Delivered') order.deliveredAt = Date.now();

    await order.save();
    ApiResponse.success(res, { order }, 'Order status updated');
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats (Admin)
// @route   GET /api/orders/stats
// @access  Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalOrders, totalRevenue, pendingOrders, paintings] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Order.countDocuments({ orderStatus: 'Pending' }),
      Painting.countDocuments(),
    ]);

    ApiResponse.success(res, {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      totalPaintings: paintings,
    });
  } catch (error) {
    next(error);
  }
};