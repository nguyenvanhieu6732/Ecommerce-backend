const UserRouter = require("./UserRouter")
const ProductRouter = require("./ProductRouter")
const CheckOutRouter = require("./CheckOutRouter")
const OrderRouter = require("./OrderRouter")

const routes = (app) => {
    app.use("/api/user", UserRouter)
    app.use("/api/product", ProductRouter)
    app.use("/api/checkout", CheckOutRouter)
    app.use("/api/order", OrderRouter)
}

module.exports = routes