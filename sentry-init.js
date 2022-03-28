const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");

function setupSentry(app) {
    if (process.env.NODE_ENV !== "production") {
        return;
    }
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [
            // enable HTTP calls tracing
            new Sentry.Integrations.Http({ tracing: true }),
            // enable Express.js middleware tracing
            new Tracing.Integrations.Express({ app }),
        ],

        tracesSampleRate: 1.0,
    });

    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
}

function setupSentryErrorHandlers(app) {
    if (process.env.NODE_ENV !== "production") {
        return;
    }

    app.use(
        Sentry.Handlers.errorHandler({
            shouldHandleError(error) {
                return error.status === 404 || error.status >= 500;
            },
        })
    );
}

module.exports = {
    setupSentry,
    setupSentryErrorHandlers
}
