const { axiom } = require('../utils/utils');

const listDatasets = async () => {
  try {
    const res = await axiom.datasets.list();
    const datasetNames = res.map(ds => ds.name);
    return [datasetNames, null];
  } catch (error) {
    console.error('Error listing datasets:', error.message);
    return [null, error];
  }
};

module.exports = { listDatasets };
