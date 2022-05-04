import { By, until } from "selenium-webdriver";

async function getPostComments(driver, j) {
  let userCommentsName = await driver.wait(
    until.elementLocated(
      By.xpath(
        `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[${j}]/div[1]/div[1]/a/span`,
        1000
      )
    )
  );

  let userCommentsNameText = await userCommentsName.getText();

  // scroll the browser until we get the name
  // ensures that browser driver is able to get the element located
  await driver.executeScript(
    "arguments[0].scrollIntoView(true);",
    userCommentsName
  );

  let userCommentsContent = await driver.wait(
    until.elementLocated(
      By.xpath(
        `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[${j}]/div[1]/div[1]/p[1]/span`,

        1000
      )
    )
  );
  let userCommentsContentText = await userCommentsContent.getText();

  let userCommentsTime = await driver.wait(
    until.elementLocated(
      By.xpath(
        `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[${j}]/div[1]/div[1]/p[2]/span[1]`,

        1000
      )
    )
  );

  let userCommentsTimeText = await userCommentsTime.getText();

  let userCommentsObj = {
    userCommentsName: userCommentsNameText,
    userCommentsContent: userCommentsContentText,
    userCommentsTime: userCommentsTimeText,
  };

  return userCommentsObj;
}

export default getPostComments;
