const models = require("../../../database/models");
const {initializeApp, applicationDefault} = require("firebase-admin/app");
const {getMessaging} = require("firebase-admin/messaging");
const {Op} = require("sequelize");

initializeApp({
    credential: applicationDefault()
});

function sendOrderPush() {
    const data = {
        title: 'Capulus order',
        body: 'A new order was received',
        imageUrl: '/logo.ico'
    };

    models.user_notification_token.findAll()
        .then(items => {
            if (items) {
                const tokens = items.map(item => item.token);

                getMessaging().sendMulticast({
                    notification: data,
                    tokens: tokens
                }).then((response) => {
                    if (response.failureCount > 0) {
                        const failedTokens = [];
                        response.responses.forEach((resp, idx) => {
                            if (!resp.success) {
                                failedTokens.push(tokens[idx]);
                            }
                        });

                        models.user_notification_token.destroy({
                            where: {
                                token: {[Op.in]: failedTokens}
                            }
                        })
                    }
                });
            }
        })
}

module.exports = {
    sendOrderPush
}
