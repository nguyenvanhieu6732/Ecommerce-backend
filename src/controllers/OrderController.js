const OrderService = require("../services/OrderService")

const createOrder = async (req, res) => {
    try {
        const { paymentMethod, shippingMethod, itemsPrice,  ShippingPrice, totalPrice, fullName, address, city, phone, orderCode } = req.body
        if (!paymentMethod || !orderCode|| !shippingMethod || !itemsPrice || !ShippingPrice || !totalPrice || !fullName || !address || !city || !phone) {
            return res.status(200).json({
                status: "ERR",
                message: "The input in required"
            })
        }
        const response = await OrderService.createOrder(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getAllOrderDetails = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "The order is required"
            })
        }
        const response = await OrderService.getAllOrderDetails(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: "ERR",
                message: "The order is required"
            })
        }
        const response = await OrderService.getOrderDetails(orderId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const cancelOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id
        const data = req.body
        if (!orderId) {
            return res.status(200).json({
                status: "ERR",
                message: "The order is required"
            })
        }
        const response = await OrderService.cancelOrderDetails(orderId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrderUser = async (req, res) => {
    try {
        const data = await OrderService.getAllOrderUser()
        return res.status(200).json(data)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createOrder,
    getAllOrderDetails,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrderUser
}