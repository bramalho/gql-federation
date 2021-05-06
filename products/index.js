const {ApolloServer, gql} = require("apollo-server");
const {applyMiddleware} = require("graphql-middleware");
const {buildFederatedSchema} = require("@apollo/federation");
const {permissions} = require("./permissions");

const products = require("../data/products.json");

const port = 4002;

const typeDefs = gql`
    type Product @key(fields: "id") {
        id: ID!
        sku: String!
        name: String!
        price: Int!
        status: Status!
    }

    enum Status {
        WAITING
        PUBLISHED
        REMOVED
    }

    extend type Query {
        product(id: ID!): Product!
        products(status: Status): [Product!]!
    }

    extend type Mutation {
        updateProductStatus(id: ID!, status: Status!): Product!
    }
`;

const resolvers = {
    Query: {
        product(parent, {id}) {
            return products.find(product => product.id === id);
        },
        products(parent, {status}) {
            if (!status) {
                return products;
            }
            return products.filter(product => product.status === status);
        }
    },
    Mutation: {
        updateProductStatus(parent, {id, status}) {
            let updatedProduct = products.find(product => id === product.id);
            updatedProduct.status = status;
            return updatedProduct;
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
    console.log(`📦 Product service running at ${url}`);
});
