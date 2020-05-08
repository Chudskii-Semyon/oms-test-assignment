export interface IConfigSchema {
    port: number;
    discount: {
        percent: number,
        numberOfMonths: number,
    };
    auth: {
        secret: string,
        expirationTimeSeconds: number,
    },
}
