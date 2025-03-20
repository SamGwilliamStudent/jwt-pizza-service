# 🍕 jwt-pizza-service

![Coverage badge](https://badge.cs329.click/badge/SamGwilliamStudent/jwtpizzaservicecoverage?label=Coverage&value=$coverage%25&color=$color)

Backend service for making JWT pizzas. This service tracks users and franchises and orders pizzas. All order requests are passed to the JWT Pizza Factory where the pizzas are made.

JWTs are used for authentication objects.

## Deployment

In order for the server to work correctly it must be configured by providing a `config.js` file.

```js
export default {
	jwtSecret: 'your-cryptographically-generated-secret-here',
	db: {
		connection: {
			host: 'localhost',
			user: 'root',
			password: 'your-secure-database-password-here',
			database: 'pizza',
			connectTimeout: 60000,
		},
		listPerPage: 10,
	},
	factory: {
		url: 'https://pizza-factory.cs329.click',
		apiKey: 'your-factory-issued-api-key-here',
	},
};
```

## Endpoints

You can get the documentation for all endpoints by making the following request.

```sh
curl localhost:3000/api/docs
```

## Development notes

Install the required packages.

```sh
npm install express jsonwebtoken mysql2 bcrypt
```

Nodemon is assumed to be installed globally so that you can have hot reloading when debugging.

```sh
npm -g install nodemon
```

# HTTP Request Monitoring in Grafana Cloud

This repository contains a sample Grafana dashboard configuration for monitoring HTTP requests in your application. The dashboard provides visualizations for:

1. Total HTTP requests per minute
2. HTTP requests broken down by method (GET, PUT, POST, DELETE) per minute

## How to Use This Dashboard

### Option 1: Import the JSON Configuration

1. Log in to your Grafana Cloud account
2. Navigate to Dashboards
3. Click the "Import" button
4. Either upload the `http_requests_dashboard.json` file or paste its contents into the JSON field
5. Update the data source variable "${DS_PROMETHEUS}" to match your actual data source
6. Click "Import"

### Option 2: Create Panels Manually

If you prefer to create the panels manually or need to adapt them to your specific metrics:

#### Panel 1: Total HTTP Requests / Minute

1. Add a new panel
2. Set the title to "Total HTTP Requests / Minute"
3. Choose a Graph visualization
4. Configure a query based on your data source:
   - For Prometheus: `sum(rate(http_requests_total[1m]))`
   - For Loki: `sum by() (rate({job="your-app"} | json | __error__="" [1m]))`
   - For other data sources: adapt accordingly

#### Panel 2: HTTP Requests by Method / Minute

1. Add a new panel
2. Set the title to "HTTP Requests by Method / Minute"
3. Choose a Graph visualization
4. Configure multiple queries based on your data source:
   - For Prometheus:
     - GET: `sum(rate(http_requests_total{method="GET"}[1m]))`
     - PUT: `sum(rate(http_requests_total{method="PUT"}[1m]))`
     - POST: `sum(rate(http_requests_total{method="POST"}[1m]))`
     - DELETE: `sum(rate(http_requests_total{method="DELETE"}[1m]))`
   - For other data sources: adapt accordingly

## Metric Collection

To use this dashboard, your application must expose HTTP request metrics. Here are some ways to collect these metrics:

### For Node.js Applications

```javascript
const promClient = require('prom-client');
const httpRequestsTotal = new promClient.Counter({
	name: 'http_requests_total',
	help: 'Total number of HTTP requests',
	labelNames: ['method', 'path', 'status']
});

// In your request handler
app.use((req, res, next) => {
	res.on('finish', () => {
		httpRequestsTotal.inc({
			method: req.method,
			path: req.route ? req.route.path : req.path,
			status: res.statusCode
		});
	});
	next();
});
```

### For Python Applications

```python
from prometheus_client import Counter
http_requests_total = Counter('http_requests_total', 'Total HTTP requests', ['method', 'path', 'status'])

// In your request handler (Flask example)
@app.after_request
def after_request(response):
	http_requests_total.labels(
		method=request.method,
		path=request.path,
		status=response.status_code
	).inc()
	return response
```

## Customizing the Dashboard

You can customize the dashboard by:

1. Adding more panels for specific endpoints
2. Adding alerts for high request rates
3. Breaking down requests by status code
4. Showing percentiles for request durations

## Troubleshooting

If your metrics are not showing up:

1. Verify that your application is correctly exposing the metrics
2. Check the metric names in your query match your actual metric names
3. Ensure your data source is correctly configured
4. Verify proper access and permissions to the metrics
