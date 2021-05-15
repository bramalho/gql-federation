# GQL Federation

```bash
npm install

cd gateway && npm install && cd ../
cd users && npm install && cd ../
cd products && npm install && cd ../
cd stock && npm install && cd ../

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
    stock {
      quantity
      warehouse
    }
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
    stock {
      quantity
      warehouse
    }
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
    stock {
      quantity
      warehouse
    }
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

## Update Product Quantity

```gql
mutation {
  updateProductQuantity(id: 1, quantity: 100) {
    quantity
    warehouse
  }
}
```

_Requires `Authorization` Header_
