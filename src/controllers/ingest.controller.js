const v8 = require('v8');
const { axiom } = require('../utils/utils');

require('dotenv').config();

let storedLogs = [];
let currentId = 1;

async function logToAxiom(datasetName, level, messages) {
  try {
    const serializedHeap = v8.serialize();
    const heapSizeMB = serializedHeap.length / (1024 * 1024);
    console.log('Heap Size:', heapSizeMB, 'MB');

    // Extract only the 'message' property from each log entry
    const logMessages = messages.map(entry => entry.message);

    // Ingest logs to Axiom with only 'message' property
    await axiom.ingest(datasetName, logMessages);
    return [/* return any results you want to expose */, null];
  } catch (error) {
    console.error('Error ingesting logs to Axiom:', error);
    throw new Error('Failed to ingest logs to Axiom');
  }
}

async function ingestDataToAxiom(datasetName, data, totalLogCount, startTimeIndex, lastTimeIndex, batchSize = 1000) {
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    try {
      const filteredBatch = batch.filter(entry => entry.timestamp > lastTimeIndex);

      if (filteredBatch.length > 0) {
        await logToAxiom(datasetName, 'logs', filteredBatch);
        console.log(`Batch ${i / batchSize + 1} ingested successfully.`);

        storedLogs = storedLogs.concat(filteredBatch);
        lastTimeIndex = storedLogs[storedLogs.length - 1].timestamp;
      }
    } catch (error) {
      console.error('Error ingesting batch:', error);
      throw new Error('Failed to ingest data in batches');
    }
  }

  totalLogCount += data.length;
  startTimeIndex = data[0].timestamp;

  return [/* return any results you want to expose */, null];
}

const info = (message) => {
  console.log(`INFO: ${message}`);
};

const error = (message) => {
  console.error(`ERROR: ${message}`);
};

module.exports = { axiom, info, error, logToAxiom, ingestDataToAxiom };
