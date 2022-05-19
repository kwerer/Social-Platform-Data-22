import csv from "csvtojson";

let fypList = [];

async function getCookies(filename, driver) {
  const cookies = await csv().fromFile(filename);
  for (const i of cookies) {
    // add cookies to web driver
    await driver.manage().addCookie(i);
  }

  // refresh browser
  await driver.navigate().refresh();
}

export default getCookies;
