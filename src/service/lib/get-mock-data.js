'use strict';

const fs = require(`fs`).promises;

const {FILE_NAME} = require(`../../constants`);

let data = [];

const getMockData = async () => {
  if (data.length > 0) {
    return data;
  }

  try {
    const fileContent = await fs.readFile(FILE_NAME);

    data = JSON.parse(fileContent);
  } catch (err) {
    console.log(err);

    return (err);
  }

  return data;
};

module.exports = getMockData;
