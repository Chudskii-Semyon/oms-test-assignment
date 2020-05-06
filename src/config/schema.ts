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
};
