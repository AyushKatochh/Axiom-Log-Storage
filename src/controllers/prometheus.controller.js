const prometheus = require('prom-client');

// Create a Prometheus counter metric
const requestsCounter = new prometheus.Counter({
  name: 'app_requests_total',
  help: 'Total number of requests to the application',
});

// Middleware to increment the counter for each request
const prometheusMiddleware = (req, res, next) => {
  requestsCounter.inc();
  next();
};

// Endpoint to expose Prometheus metrics
const metricsEndpoint = async (req, res) => {
  try {
    // Collect metrics and ensure they are in string format
    const metricsString = await prometheus.register.metrics();

    // Set content type and send the metrics string
    res.set('Content-Type', prometheus.register.contentType);
    res.end(metricsString);
  } catch (error) {
    console.error('Error collecting Prometheus metrics:', error);
    // Handle errors gracefully and send an appropriate HTTP status code
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  prometheusMiddleware,
  metricsEndpoint,
};
