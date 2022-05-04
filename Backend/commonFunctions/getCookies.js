import csv from "csvtojson";

let fypList = [];

async function getCookies(filename) {
  const cookies = await csv().fromFile(filename);
  for (const cookie of cookies) {
    fypList.push(cookie);
  }
  return fypList;
}

export default getCookies;
