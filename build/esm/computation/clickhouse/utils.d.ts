export interface ICHConfig {
    protocol: string;
    host: string;
    port: number;
    path: string;
}
export declare const CLICKHOUSE_CONFIG: ICHConfig;
export declare function getCHConfig(): ICHConfig;
export declare function setCHConfig(config: ICHConfig): void;
export declare class CHUtils {
    config: ICHConfig;
    constructor(config?: ICHConfig);
    getCHConfig(): ICHConfig;
    setCHConfig(config: ICHConfig): void;
    query(sql: string): Promise<string>;
    queryw(sql: string): Promise<string>;
}
