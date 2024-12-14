const OrderService = require("../services/OrderService")

const createOrder = async (req, res) => {
    try {
        const { paymentMethod, itemsPrice, ShippingPrice, totalPrice, fullName, address, city, phone } = req.body
        if (!paymentMethod || !itemsPrice || !ShippingPrice || !totalPrice || !fullName || !address || !city || !phone) {
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
const getOrderDetails = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "The userId is required"
            })
        }
        const response = await OrderService.getOrderDetails(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createOrder,
    getOrderDetails
}