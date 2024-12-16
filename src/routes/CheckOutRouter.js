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
        vnp_ReturnUrl: "http://localhost:3000/checkout/vnpay_return",
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
    // vnp_Params['vnp_ExpireDate'] = expireDate;
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
    console.log("vnp_Params 1:", vnp_Params);
    console.log("signData 1:", signData);
    console.log("signed 1:", signed);
    res.json({ paymentUrl: vnpUrl });
});


router.get('/vnpay_return', function (req, res, next) {
    var vnp_Params = req.query;

    var secureHash = vnp_Params['vnp_SecureHash'];

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

    vnp_Params = sortObject(vnp_Params);

    var env = {
        vnp_TmnCode: "WNXF53ET",
        vnp_HashSecret: "SVE5NMOWSBFBA3JH7M8ZQCR0L0QZMEZN",
        vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
        vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
        vnp_ReturnUrl: "http://localhost:3000/checkout/vnpay_return",
    };
    var tmnCode = env.vnp_TmnCode
    var secretKey = env.vnp_HashSecret

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    console.log("vnp_Params:", vnp_Params);
    console.log("signData:", signData);
    console.log("signed:", signed);
    if (secureHash === signed) {
        // Trả về kết quả thành công
        res.json({ success: true, responseCode: vnp_Params['vnp_ResponseCode'] });
    } else {
        // Trả về lỗi chữ ký không hợp lệ
        res.json({ success: false, responseCode: '97' });
    }
});
module.exports = router;