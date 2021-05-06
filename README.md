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
