export const schema = {
    port: {
        format: 'port',
        default: 300,
        env: 'PORT',
    },
    discount: {
        percent: {
            format: Number,
            default: 50,
            env: 'DISCOUNT_PERCENT',
        },
        numberOfMonths: {
            format: Number,
            default: 1,
            env: 'DISCOUNT_NUMBER_OF_MONTH',
        },
    },

    auth: {
        secret: {
            format: String,
            default: 'secret',
            env: 'AUTH_TOKEN_SECRET',
        },
        expirationTimeSeconds: {
            format: Number,
            default: 60 * 60,
            env: 'AUTH_TOKEN_EXPIRATION_TIME_SECONDS',
        },
    },
};
