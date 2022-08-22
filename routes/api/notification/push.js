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
        imageUrl: `${process.env.APP_URL}/logo.ico`
    };

    models.user_notification_token.findAll()
        .then(items => {
            if (!items || items.length <= 0) {
                return;
            }
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

                    // Remove tokens that failed
                    models.user_notification_token.destroy({
                        where: {
                            token: {[Op.in]: failedTokens}
                        }
                    })
                }
            });
        })
}

module.exports = {
    sendOrderPush
}
