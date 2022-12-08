import {ApolloServer} from "apollo-server-express";
import express from "express";
import {modeConfigurations, sessionOptions, corsOptions, UPDATE_CONTROLLERS_DATA} from "./config";
import session from "express-session"
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import https from "https";
import fs from "fs";
import {WebSocketServer} from "ws";
import {useServer} from "graphql-ws/lib/use/ws";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { pubSub } from "./pubSub";

export const USER_SECRET = process.env.USER_SECRET;

global.controllerConnections = [];

export default async function startApolloServer(schema) {
    dotenv.config();
    const cfg = modeConfigurations[process.env.NODE_ENV];

    const app = express();
    let httpServer;

    if (cfg.ssl) {
        httpServer = https.createServer(
            {
                key: fs.readFileSync(`/etc/ssl/private/apache-selfsigned.key`),
                cert: fs.readFileSync(`/etc/ssl/certs/apache-selfsigned.crt`)
            },
            app,
        );
    } else {
        httpServer = http.createServer(app);
    }

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });
    const serverCleanup = useServer({ schema }, wsServer);

    const server = new ApolloServer({
        schema,
        cache: "bounded",
        context: ({req, res})=>{
            return { req, res, pubSub }
        },
        playground: {
            settings: {
                "request.credentials" : "include"
            }
        },
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    await server.start();

    app.use(session(sessionOptions(USER_SECRET, session)));
    app.use(cors(corsOptions));

    server.applyMiddleware({
        app,
        cors: false
    });

    await new Promise(
        (resolve) => httpServer.listen({ port: cfg.port },
            ()=>{
                console.log("******************************************************************************")
                console.log(`🚀 Server ready at http${(cfg.ssl)? "s" : "" }://${cfg.hostname}:${cfg.port}${server.graphqlPath}`);
                console.log(`🚀 Subscription endpoint ready at ws://${cfg.hostname}:${cfg.port}/graphql`);
                console.log("******************************************************************************")
            }
        ));
}