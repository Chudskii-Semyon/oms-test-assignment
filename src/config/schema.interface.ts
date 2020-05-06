export interface IConfigSchema {
    port: number;
    discount: {
        percent: number,
        numberOfMonths: number,
    };
}
