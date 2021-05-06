const {and, or, rule, shield} = require("graphql-shield");

function getPermissions(user) {
    if (user && user["http://localhost/graphql"]) {
        return user["http://localhost/graphql"].permissions;
    }
    return [];
}

const isAuthenticated = rule()((parent, args, {user}) => {
    return user !== null;
});

const canReadAnyUser = rule()((parent, args, {user}) => {
    const userPermissions = getPermissions(user);
    return userPermissions.includes("read:any_user");
});

const canReadOwnUser = rule()((parent, args, {user}) => {
    const userPermissions = getPermissions(user);
    return userPermissions.includes("read:own_user");
});

const isReadingOwnUser = rule()((parent, {id}, {user}) => {
    return user && user.sub === id;
});

const permissions = shield({
    Query: {
        user: or(and(canReadOwnUser, isReadingOwnUser), canReadAnyUser),
        users: canReadAnyUser
    }
});

module.exports = {permissions};
