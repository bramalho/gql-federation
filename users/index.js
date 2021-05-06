const {ApolloServer, gql} = require("apollo-server");
const {applyMiddleware} = require("graphql-middleware");
const {buildFederatedSchema} = require("@apollo/federation");
const {permissions} = require("./permissions");

const jwt = require("jsonwebtoken");
const users = require("../data/users.json");

const port = 4001;

const typeDefs = gql`
    type User @key(fields: "id") {
        id: ID!
        name: String
    }

    extend type Query {
        user(id: ID!): User
        users: [User]
    }

    extend type Mutation {
        login(email: String!, password: String!): String
    }
`;

const resolvers = {
    User: {
        __resolveReference(object) {
            return users.find(user => user.id === object.id);
        }
    },
    Query: {
        user(parent, {id}) {
            return users.find(user => user.id === id);
        },
        users() {
            return users;
        }
    },
    Mutation: {
        login(parent, {email, password}) {
            const {id, permissions, roles} = users.find(
                user => user.email === email && user.password === password
            );
            return jwt.sign(
                {"http://localhost/graphql": {roles, permissions}},
                "THIS_IS_MY_SECRET",
                {algorithm: "HS256", subject: id, expiresIn: "1d"}
            );
        }
    }
};

const server = new ApolloServer({
    schema: applyMiddleware(
        buildFederatedSchema([{typeDefs, resolvers}]),
        permissions
    ),
    context: ({req}) => {
        const user = req.headers.user ? JSON.parse(req.headers.user) : null;
        return {user};
    }
});

server.listen(port).then(({url}) => {
    console.log(`🔐 User service running at ${url}`);
});
