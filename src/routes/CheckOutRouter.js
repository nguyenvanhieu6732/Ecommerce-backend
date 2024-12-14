const express = require("express")
const router = express.Router()
const moment = require('moment');

router.post('/create_payment_url', function (req, res, next) {
    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var env = {
        vnp_TmnCode: "WNXF53ET",
        vnp_HashSecret: "SVE5NMOWSBFBA3JH7M8ZQCR0L0QZMEZN",
        vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
        vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
        vnp_ReturnUrl: "http://localhost:3000/cart/vnpay_return",
    };

    var tmnCode = env.vnp_TmnCode;
    var secretKey = env.vnp_HashSecret
    var vnpUrl = env.vnp_Url
    var returnUrl = env.vnp_ReturnUrl
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    let expireDate = moment(date).add(5, 'minutes').format('YYYYMMDDHHmmss');
    let orderId = moment(date).format('DDHHmmss');
    var amount = req.body.amount;
    var bankCode = req.body.bankCode;

    var orderInfo = req.body.orderDescription;
    var orderType = req.body.orderType;
    var locale = req.body.language;
    if (locale === null || locale === '' || locale == undefined) {
        locale = 'vn';
    }
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_ExpireDate'] = expireDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    function sortObject(obj) {
        var sorted = {};
        var str = [];
        var key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }

    vnp_Params = sortObject(vnp_Params);

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.json({ paymentUrl: vnpUrl });
});


router.get('/vnpay_return', (req, res) => {
    try {
        let vnp_Params = req.query;
        const secretKey = "SVE5NMOWSBFBA3JH7M8ZQCR0L0QZMEZN"; // Secret key từ VNPay

        // Lấy secureHash từ VNPay
        const secureHash = vnp_Params['vnp_SecureHash'];

        // Loại bỏ các tham số không cần thiết
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        function sortObject(obj) {
            var sorted = {};
            var str = [];
            var key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    str.push(encodeURIComponent(key));
                }
            }
            str.sort();
            for (key = 0; key < str.length; key++) {
                sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
            }
            return sorted;
        }
        // Sắp xếp tham số
        vnp_Params = sortObject(vnp_Params);

        // Tạo chuỗi signData
        const querystring = require('qs');
        const signData = querystring.stringify(vnp_Params, { encode: false });

        console.log("vnp_Params sorted:", vnp_Params);
        console.log("signData:", signData);

        // Tạo chữ ký SHA512
        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        console.log("signed:", signed);
        console.log("secureHash from VNPay:", secureHash);

        // So sánh chữ ký
        if (secureHash === signed) {
            // Trả về kết quả thành công
            res.json({ success: true, responseCode: vnp_Params['vnp_ResponseCode'] });
        } else {
            // Trả về lỗi chữ ký không hợp lệ
            res.json({ success: false, responseCode: '97' });
        }
    } catch (error) {
        console.error("Error in vnpay_return:", error);
        res.status(500).json({ success: false, responseCode: '99' });
    }
});
module.exports = router;