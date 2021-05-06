# GQL Federation

```bash
npm install

cd gateway && npm install && cd ../
cd users && npm install && cd ../

npm run server
```

## Login

```gql
mutation {
  login(email: "admin@app.dev", password: "admin")
}
```

## Get Users

```gql
query {
  users {
    id
    name
  }
}
```

Headers:

```json
{
  "Authorization": "Bearer YOUR_TOKEN"
}
```

## Get User

```gql
query {
  user (id: 2) {
    id
    name
  }
}
```

_Requires `Authorization` Header_

## Get Products

```gql
query {
  products {
    id
    sku
    name
    price
    status
  }
}
```

or

```gql
query {
  products(status: PUBLISHED) {
    id
    sku
    name
    price
    status
  }
}
```

_Requires `Authorization` Header_

## Get Product

```gql
query {
  product(id: 1) {
    id
    sku
    name
    price
    status
  }
}
```

_Requires `Authorization` Header_

## Update Product Status

```gql
mutation {
  updateProductStatus(id: 1, status: REMOVED) {
    id
    sku
    name
    price
    status
  }
}
```

_Requires `Authorization` Header_
