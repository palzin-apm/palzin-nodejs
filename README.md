# Real-Time monitoring package using Palzin Monitor


Palzin Monitor offers real-time performance monitoring capabilities that allow you to effectively monitor and analyze the performance of your applications. With Palzin Monitor Nodejs, you can capture and track all requests without the need for any code modifications. This feature enables you to gain valuable insights into the impact of your methods, database statements, and external requests on the overall user experience.

## Install
Install the latest version via npm:

```
npm install @palzin-apm/palzin-nodejs --save
```

## Configure the Ingestion Key

You need an Ingestion Key to create an Palzin instance. You can obtain a key creating a new project in your [dashboard](https://palzin.app).

If you use `dotenv` you can configure the Ingestion Key in your environment file:

```
PALZIN_APM_INGESTION_KEY=[ingestion key]
PALZIN_APM_URL=[your url]
```

## Integrate in your code

Palzin must be initialized before you require any other modules - i.e. before, `express`, `http`, `mysql`, etc.

```javascript
/*
 * Initialize Palzin with the Ingestion Key.
 */
const palzin = require('@palzin-apm/palzin-nodejs')({
  ingestionKey: 'xxxxxxxxxxxxx',
  url: 'your url',  
})

const app = require('express')()

/*
 * Attach the middleware to monitor HTTP requests fulfillment.
 */
app.use(palzin.expressMiddleware())


app.get('/', function (req, res) {
    return res.send('Home Page!')
})

app.get('/posts/:id', function (req, res) {
    return res.send('Single Post Details!')
})

app.listen(3006)
```

Palzin Monitor (APM) will monitor your code execution in real time, alerting you if something goes wrong.


## Official documentation

**[Go to the official documentation](https://palzin.app/guides/nodejs-introduction)**

## LICENSE

This package is licensed under the [MIT](LICENSE) license.
