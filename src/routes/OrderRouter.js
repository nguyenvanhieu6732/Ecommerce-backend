const express = require("express")
const router = express.Router()
const OrderController = require('../controllers/OrderController')
const { authUserMiddleware, authMiddleware } = require("../middleware/authMiddleware")

router.post('/create', authUserMiddleware, OrderController.createOrder)
router.get('/get-all-order/:id', authUserMiddleware, OrderController.getAllOrderDetails)
router.get('/get-details-order/:id', authUserMiddleware, OrderController.getOrderDetails)
router.get('/get-all-order-user', authMiddleware, OrderController.getAllOrderUser)
router.delete('/cancel-order/:id', OrderController.cancelOrderDetails)

module.exports = router