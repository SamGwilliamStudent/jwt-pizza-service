const os = require('os');
const config = require('./config');

let activeUsers = 0;

let successfulAuthenticationAttempts = 0;
let unsuccessfulAuthenticationAttempts = 0;

let pizzaFailure = 0;
let pizzaSuccess = 0;

let revenue = 0;

const requestsByMethod = {
	GET: 0,
	POST: 0,
	PUT: 0,
	DELETE: 0,
	TOTAL: 0,
};

function trackRequest() {
	return (req, res, next) => {
		const startTime = process.hrtime();

		const reqMethod = req.method.toUpperCase();
		if (requestsByMethod[reqMethod] !== undefined) {
			requestsByMethod[reqMethod]++;
		}
		requestsByMethod.TOTAL++;

		res.on('finish', () => {
			const [seconds, nanoseconds] = process.hrtime(startTime);
			const latencyMs = seconds * 1000 + nanoseconds / 1e6;

			sendMetricToGrafanaFloat('request_latency', latencyMs);
		});

		next();
	};
}

function addActiveUser() {
	activeUsers++;
}

function removeActiveUser() {
	if (activeUsers > 0) {
		activeUsers--;
	}
}

function addSuccessfulAuthenticationAttempt() {
	successfulAuthenticationAttempts++;
}

function addUnsuccessfulAuthenticationAttempt() {
	unsuccessfulAuthenticationAttempts++;
}

function addRevenue(price) {
	revenue += price;
	console.log(`Revenue updated: ${revenue}`);
}

function addPizzaSuccess(count) {
	pizzaSuccess += count;
}

function addPizzaFailure() {
	pizzaFailure++;
}

function getCpuUsagePercentage() {
	const cpuUsage = os.loadavg()[0] / os.cpus().length;
	return (cpuUsage * 100).toFixed(2);
}

function getMemoryUsagePercentage() {
	const totalMemory = os.totalmem();
	const freeMemory = os.freemem();
	const usedMemory = totalMemory - freeMemory;
	return ((usedMemory / totalMemory) * 100).toFixed(2);
}

function sendMetricToGrafana(metricName, metricValue, attributes) {
	attributes = { ...attributes, source: config.metrics.source };

	const metric = {
		resourceMetrics: [
			{
				scopeMetrics: [
					{
						metrics: [
							{
								name: metricName,
								unit: '1',
								sum: {
									dataPoints: [
										{
											asInt: metricValue,
											timeUnixNano: Date.now() * 1000000,
											attributes: [],
										},
									],
									aggregationTemporality:
										'AGGREGATION_TEMPORALITY_CUMULATIVE',
									isMonotonic: true,
								},
							},
						],
					},
				],
			},
		],
	};

	Object.keys(attributes).forEach((key) => {
		metric.resourceMetrics[0].scopeMetrics[0].metrics[0].sum.dataPoints[0].attributes.push(
			{
				key: key,
				value: { stringValue: attributes[key] },
			}
		);
	});

	fetch(`${config.metrics.url}`, {
		method: 'POST',
		body: JSON.stringify(metric),
		headers: {
			Authorization: `Bearer ${config.metrics.apiKey}`,
			'Content-Type': 'application/json',
		},
	})
		.then((response) => {
			if (!response.ok) {
				console.log(response);
				console.error('Failed to push metrics data to Grafana');
			} else {
				// console.log(`Pushed ${metricName}`);
			}
		})
		.catch((error) => {
			console.error('Error pushing metrics:', error);
		});
}

function sendMetricToGrafanaFloat(metricName, metricValue, attributes = {}) {
	attributes = { ...attributes, source: config.metrics.source };

	const metric = {
		resourceMetrics: [
			{
				scopeMetrics: [
					{
						metrics: [
							{
								name: metricName,
								unit: '1',
								sum: {
									dataPoints: [
										{
											asDouble: metricValue, // Use asDouble instead of asInt
											timeUnixNano: Date.now() * 1000000,
											attributes: [],
										},
									],
									aggregationTemporality:
										'AGGREGATION_TEMPORALITY_CUMULATIVE',
									isMonotonic: true,
								},
							},
						],
					},
				],
			},
		],
	};

	Object.keys(attributes).forEach((key) => {
		metric.resourceMetrics[0].scopeMetrics[0].metrics[0].sum.dataPoints[0].attributes.push(
			{
				key: key,
				value: { stringValue: attributes[key] },
			}
		);
	});

	fetch(`${config.metrics.url}`, {
		method: 'POST',
		body: JSON.stringify(metric),
		headers: {
			Authorization: `Bearer ${config.metrics.apiKey}`,
			'Content-Type': 'application/json',
		},
	})
		.then((response) => {
			if (!response.ok) {
				console.error('Failed to push float metric to Grafana', response);
			}
		})
		.catch((error) => {
			console.error('Error pushing float metrics:', error);
		});
}

function sendMetricsPeriodically(period = 10000) {
	setInterval(() => {
		try {
			// Send request metrics
			Object.keys(requestsByMethod).forEach((method) => {
				sendMetricToGrafana('http_requests', requestsByMethod[method], {
					method,
				});
			});

			// Reset counts after sending
			Object.keys(requestsByMethod).forEach((method) => {
				requestsByMethod[method] = 0;
			});

			// Send system metrics
			// console.log('sending system metrics');
			sendMetricToGrafana('cpu_usage', parseInt(getCpuUsagePercentage()));
			sendMetricToGrafana('memory_usage', parseInt(getMemoryUsagePercentage()));

			// Send Active Users
			sendMetricToGrafana('activeUsers', activeUsers);
			activeUsers = 0;

			// Send Auth Attempts
			sendMetricToGrafana('auth', unsuccessfulAuthenticationAttempts, {
				status: 'failure',
			});
			unsuccessfulAuthenticationAttempts = 0;

			sendMetricToGrafana('auth', successfulAuthenticationAttempts, {
				status: 'success',
			});
			successfulAuthenticationAttempts = 0;

			// Send Pizza Metrics
			sendMetricToGrafana('orders', pizzaSuccess, { status: 'success' });
			pizzaSuccess = 0;

			sendMetricToGrafana('orders', pizzaFailure, { status: 'failure' });
			pizzaFailure = 0;

			// Send Revenue Metrics
			// console.log(`Sending Revenue ${revenue}`);
			sendMetricToGrafanaFloat('revenue', revenue);
			revenue = 0;
		} catch (error) {
			console.error('Error sending metrics:', error);
		}
	}, period);
}

sendMetricsPeriodically();

module.exports = {
	trackRequest,
	addActiveUser,
	removeActiveUser,
	addSuccessfulAuthenticationAttempt,
	addUnsuccessfulAuthenticationAttempt,
	addPizzaFailure,
	addPizzaSuccess,
	addRevenue,
	sendMetricToGrafanaFloat,
};
