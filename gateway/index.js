const {ApolloGateway, RemoteGraphQLDataSource} = require("@apollo/gateway");
const {ApolloServer} = require("apollo-server-express");
const express = require("express");
const expressJwt = require("express-jwt");

const port = 4000;
const app = express();

app.use(
    expressJwt({
        secret: "THIS_IS_MY_SECRET",
        algorithms: ["HS256"],
        credentialsRequired: false
    })
);

const gateway = new ApolloGateway({
    serviceList: [
        {name: "users", url: "http://localhost:4001"},
        {name: "products", url: "http://localhost:4002"}
    ],
    buildService({name, url}) {
        return new RemoteGraphQLDataSource({
            url,
            willSendRequest({request, context}) {
                request.http.headers.set(
                    "user",
                    context.user ? JSON.stringify(context.user) : null
                );
            }
        });
    }
});

const server = new ApolloServer({
    gateway,
    subscriptions: false,
    context: ({req}) => {
        const user = req.user || null;
        return {user};
    }
});

server.applyMiddleware({app});

app.listen({port}, () =>
    console.log(`🚀 Server running at http://localhost:${port}${server.graphqlPath}`)
);
