const {and, or, rule, shield} = require("graphql-shield");

function getPermissions(user) {
    if (user && user["http://localhost/graphql"]) {
        return user["http://localhost/graphql"].permissions;
    }
    return [];
}

const canReadProducts = rule()((parent, args, {user}) => {
    const userPermissions = getPermissions(user);
    return userPermissions.includes("read:products");
});

const canWriteProducts = rule()((parent, args, {user}) => {
    const userPermissions = getPermissions(user);
    return userPermissions.includes("write:products");
});

const permissions = shield({
    Mutation: {
        updateProductQuantity: canWriteProducts
    }
});

module.exports = {permissions};
