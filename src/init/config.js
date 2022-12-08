import dotenv from "dotenv"

dotenv.config();

export const modeConfigurations = {
    production: { ssl: true, port: 4000, hostname: 'm.fresh-da.ru' },
    development: { ssl: false, port: 4000, hostname: 'localhost' },
};

export const EXP_DATE = () => Math.floor(new Date().getTime() / 1000) + (8*60 * 60);
export const SALT_ROUND = 11;
export const UPDATE_CONTROLLERS_DATA = process.env.UPDATE_CONTROLLERS_DATA;
const MAX_AGE = 1000*60*60*8
export const sessionOptions = (secret,session)=> {
    const MemoryStore = require('memorystore')(session)
    return {
        name: 'qid',
        key: 'token',
        secret: secret,
        resave: false,
        rolling: true,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: MAX_AGE
        },
        store: new MemoryStore({
            checkPeriod: MAX_AGE
        }),
    }
}

export const corsOptions = {
        origin: ["https://studio.apollographql.com", "http://localhost:3000",
            "http://192.168.250.231:3000", "http://192.168.250.231:4000", "https://modbus-graphql.vercel.app"],
        credentials: true,
    }