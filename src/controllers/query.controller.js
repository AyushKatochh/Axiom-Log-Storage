const { axiom } = require('../utils/utils');
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function executeQuery(datasetNames) {
  const datasets = Array.isArray(datasetNames) ? datasetNames : datasetNames.split(',').map(dataset => dataset.trim());

  try {
    const aplQuery = `["${datasets.join('","')}"]`;

    const res = await axiom.query(aplQuery);

    if (!res.matches || res.matches.length === 0) {
      console.warn(`No matches found for datasets ${datasets.join(', ')}`);
      return [[], null];
    }

    const matchedData = res.matches.map((matched) => matched.data);

    try {
      // Use upsert query to add bulk queries
      await Promise.all(
        matchedData.map(async (data) => {
          const log = await prisma.logs.upsert({
            where: { id: uuidv4() || data.id },
            update: { message: JSON.stringify(data), timestamp: new Date().toISOString() },
            create: {
              id: uuidv4(),
              message: JSON.stringify(data),
              timestamp: new Date().toISOString(),
              datasetName: datasets.join(', '), // Add the datasetName field here
            },
          });
          console.log(`Log with id ${log.id}, message ${log.message}, and timestamp ${log.timestamp} upserted successfully for datasets ${datasets.join(', ')}.`);
        })
      );

      console.log(`Data saved in the Neon database for datasets ${datasets.join(', ')} using upsert query.`);
    } catch (error) {
      console.error(`Error saving data for datasets ${datasets.join(', ')}:`, error);
      throw new Error(`Failed to save data in the database for datasets ${datasets.join(', ')}`);
    }

    return [matchedData, null];
  } catch (error) {
    console.error(`Error in executing query for datasets ${datasets.join(', ')}:`, error);
    throw new Error(`Failed to execute query for datasets ${datasets.join(', ')}`);
  }
}

module.exports = {
  executeQuery,
};


module.exports = {
  executeQuery,
};
