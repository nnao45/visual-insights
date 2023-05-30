var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
export const CLICKHOUSE_CONFIG = {
    protocol: 'http',
    host: 'localhost',
    port: 8123,
    path: ''
};
export function getCHConfig() {
    return CLICKHOUSE_CONFIG;
}
export function setCHConfig(config) {
    Object.keys(config).forEach(k => {
        CLICKHOUSE_CONFIG[k] = config[k];
    });
}
export class CHUtils {
    constructor(config) {
        this.config = config || {
            protocol: 'http',
            host: 'localhost',
            port: 8123,
            path: ''
        };
    }
    getCHConfig() {
        return this.config;
    }
    setCHConfig(config) {
        Object.keys(config).forEach(k => {
            this.config[k] = config[k];
        });
    }
    query(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const config = this.config;
                const res = yield axios(`${config.protocol}://${config.host}:${config.port}${config.path}?query=${sql}`);
                return res.data;
            }
            catch (error) {
                throw new Error(`[SQL Error] ${sql}.\n${error.toString()}`);
            }
        });
    }
    queryw(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const config = this.config;
                const res = yield axios({
                    url: `${config.protocol}://${config.host}:${config.port}${config.path}`,
                    method: 'post',
                    params: {
                        query: sql
                    }
                });
                return res.data;
            }
            catch (error) {
                throw new Error(`[SQL Error] ${sql}.\n${error.toString()}`);
            }
        });
    }
}
