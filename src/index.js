const express = require('express');
const cron = require('node-cron');
const { listDatasets } = require('./controllers/dataset.controller');
const { prometheusMiddleware, metricsEndpoint } = require('./controllers/prometheus.controller');
const { runBatchJob } = require('./controllers/batch.controller');
const { IST_OPTIONS } = require('./constants/constants');
const app = express();
const port = process.env.PORT || 8000;

// Middleware to parse JSON in the request body
app.use(express.json());

// Prometheus middleware
app.use(prometheusMiddleware);

// Endpoint to expose Prometheus metrics
app.get('/metrics', metricsEndpoint);

cron.schedule('* * * * *', async () => {
  try {
    const currentTimestamp = new Date().toLocaleString('en-IN', IST_OPTIONS);
    console.log('Cron job started at:', currentTimestamp);

    // Dataset listing
    console.log('Starting dataset listing...');
    const datasets = await listDatasets();
    console.log('Dataset listing completed. Datasets:', datasets);

    for (const datasetName of datasets) {
      // Run batch job for each dataset
      console.log(`Running batch job for dataset: ${datasetName}`);
      await runBatchJob(datasetName);
    }

    console.log('Cron job completed at:', new Date().toLocaleString('en-IN', IST_OPTIONS));
  } catch (error) {
    console.error('Error in cron job:', error.message);
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
