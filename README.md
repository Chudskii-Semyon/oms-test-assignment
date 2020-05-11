# OMS test assignment

### Prerequisites


* Create postgresql database with name: **oms**, user: **oms-admin**, password: **123456**.
> you can change this in .env
* In the root folder create .env and copy all content of .env.example to this file


### Installing
```
yarn
```
```
yarn build
```
```
yarn typeorm:run
```
```
yarn seed:run
```
```
yarn start:dev
```

### Api documentation
You can use Swagger doc (recommend) which you can access by [localhost:3000/api](localhost:3000/api) or insomnia collection `api-collection.json` file in root folder
> All employees have password **123456**

### Coverage
To run unit tests with coverage:
```
yarn test:cov
```


