const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const { amount } = req.body;
        
        const orderData = {
            order_id: `order_${Date.now()}`,
            order_amount: amount || 99, // Default ₹99
            order_currency: "INR",
            customer_details: {
                customer_id: "test_customer_" + Math.random().toString(36).substr(2, 9),
                customer_name: "Test User",
                customer_email: "test@example.com",
                customer_phone: "9999999999"
            },
            order_meta: {
                return_url: "https://innovativetest.vercel.app/thank-you"
            }
        };

        const response = await axios.post(
            "https://api.cashfree.com/pg/orders", // Production API
            orderData,
            {
                headers: {
                    "x-client-id": process.env.CASHFREE_APP_ID,
                    "x-client-secret": process.env.CASHFREE_SECRET_KEY,
                    "x-api-version": "2022-09-01"
                }
            }
        );

        res.json({
            paymentSessionId: response.data.payment_session_id
        });

    } catch (error) {
        console.error("Cashfree error:", error.response?.data || error.message);
        res.status(500).json({ error: "Payment setup failed" });
    }
};