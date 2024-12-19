const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const {orderCode, orderItems, paymentMethod, shippingMethod, itemsPrice, ShippingPrice, totalPrice, fullName, address, city, phone, user, isPaid } = newOrder
        try {
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate({
                    _id: order.product,
                    countInStock: { $gte: order.amount }
                },
                    {
                        $inc: { countInStock: -order.amount, selled: +order.amount },
                    },
                    { new: true }
                )
                if (productData) {
                    return {
                        status: 'OK',
                        message: 'SUCCESS',
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const result = await Promise.all(promises)
            const newData = result && result.filter((item) => item.id)
            if (newData.length) {
                const arrId = []
                newData.forEach((item) => {
                    newData.push(item.id)
                })
                resolve({
                    status: "ERR",
                    message: `San pham voi id ${arrId.join(", ")} khong du hang`
                })
            } else {
                const createdOrder = await Order.create({
                    orderCode,
                    orderItems,
                    shippingAddress: {
                        fullName,
                        address,
                        city,
                        phone
                    },
                    paymentMethod,
                    shippingMethod,
                    itemsPrice,
                    ShippingPrice,
                    totalPrice,
                    user: user,
                    isPaid
                })
                if (createOrder) {
                    resolve({
                        status: 'OK',
                        message: 'ERR',
                    })
                }
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id
            })
            if (order === null) {
                resolve({
                    status: 'OK',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'Success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({
                _id: id
            })
            if (order === null) {
                resolve({
                    status: 'OK',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'Success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}
const cancelOrderDetails = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = []
            const promises = data.map(async (order) => {
                const productData = await Product.findOneAndUpdate({
                    _id: order.product,
                    selled: { $gte: order.amount }
                },
                    {
                        $inc: { countInStock: +order.amount, selled: -order.amount },
                    },
                    { new: true }
                )
                if (productData) {
                    order = await Order.findByIdAndDelete(id)
                    if (order === null) {
                        resolve({
                            status: 'ERR',
                            message: 'The order is not defined'
                        })
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const result = await Promise.all(promises)
            const newData = result && result.filter((item) => item)
            if (newData.length) {
                resolve({
                    status: "ERR",
                    message: `San pham voi id ${newData.join(", ")} khong ton tai`
                })
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: order

            })
        } catch (e) {
            reject(e)
        }
    })
}
const getAllOrderUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrderUser = await Order.find()
            resolve({
                status: 'OK',
                message: 'Success',
                data: allOrderUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createOrder,
    getAllOrderDetails,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrderUser
}