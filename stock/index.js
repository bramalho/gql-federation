const {ApolloServer, gql} = require("apollo-server");
const {applyMiddleware} = require("graphql-middleware");
const {buildFederatedSchema} = require("@apollo/federation");
const {permissions} = require("./permissions");

const products = require("../data/products.json");

const port = 4003;

const typeDefs = gql`
    type Stock {
        quantity: Int
        warehouse: String
    }

    extend type Product @key(fields: "id") {
        id: ID! @external
        stock: Stock!
    }

    enum StockStatus {
        AVAILABLE
        NOT_AVAILABLE
    }

    extend type Mutation {
        updateProductQuantity(id: ID!, quantity: Int!): Stock!
    }
`;

const resolvers = {
    Mutation: {
        updateProductQuantity(parent, {id, quantity}) {
            let updatedProduct = products.find(product => id === product.id);
            updatedProduct.quantity = quantity;
            return updatedProduct;
        }
    },
    Product: {
        stock(product) {
            return products.find(p => p.id === product.id);
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
    console.log(`🏭 Stock service running at ${url}`);
});
