const { ingestDataToAxiom } = require('./ingest.controller');
const { executeQuery } = require('./query.controller');
const { IST_OPTIONS, BATCH_SIZE, TOTAL_BATCHES, TOTAL_LOG_COUNT, START_TIME_INDEX, LAST_TIME_INDEX } = require('../constants/constants');

const generateLogEntry = (index) => {
  const currentDate = new Date();
  const istTimestamp = currentDate.toLocaleString('en-IN', IST_OPTIONS);

  return {
    level: 'info',
    message: `Log entry ${index}`,
    timestamp: istTimestamp,
  };
};

let totalLogCount = TOTAL_LOG_COUNT;
let startTimeIndex = START_TIME_INDEX;
let lastTimeIndex = LAST_TIME_INDEX;

const runBatchJob = async (datasetName) => {
  let currentIndex = 0;

  for (let batchIndex = 0; batchIndex < TOTAL_BATCHES; batchIndex++) {
    // Generate log entries for the current batch
    const data = Array.from({ length: BATCH_SIZE }, (_, index) => {
      const entryIndex = currentIndex + index + 1;
      return generateLogEntry(entryIndex);
    });

    // Ingest data to Axiom
    console.log(`Starting batch ingestion ${batchIndex + 1}...`);
    await ingestDataToAxiom(datasetName, data, totalLogCount, startTimeIndex, lastTimeIndex);
    console.log(`Batch ingestion ${batchIndex + 1} completed.`);

    // Execute Query
    console.log(`Starting query for batch ${batchIndex + 1}...`);
    const queryResults = await executeQuery(datasetName);
    console.log(`Query for batch ${batchIndex + 1} completed. Query results:`, queryResults);

    // Update currentIndex for the next batch
    currentIndex += BATCH_SIZE;
  }

  return [/* return any results you want to expose */, null];
};

module.exports = {
  runBatchJob,
};
