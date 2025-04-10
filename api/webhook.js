const crypto = require('crypto');

module.exports = async (req, res) => {
    // Handle test event
    if (req.body?.type === "TEST") {
        return res.status(200).json({ status: "OK" });
    }

    // Verify signature
    const signature = req.headers['x-cf-signature'];
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
        .createHmac('sha256', process.env.CASHFREE_SECRET_KEY)
        .update(body)
        .digest('base64');

    if (signature !== expectedSignature) {
        return res.status(401).json({ error: "Invalid signature" });
    }

    // Payment success logic
    console.log("Payment succeeded:", req.body.order_id);
    res.status(200).end();
};