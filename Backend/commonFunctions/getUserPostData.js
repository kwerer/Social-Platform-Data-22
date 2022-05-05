import { By, until } from "selenium-webdriver";

async function getUserPostData(driver) {
  // check if there are comments available
  let numOfComments = await driver.wait(
    until.elementLocated(
      By.xpath(
        '//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[2]/div[2]/div[1]/div[1]/button[2]/strong'
      )
    )
  );

  let numOfCommentsNumber = await numOfComments.getText();

  let postUserName = await driver.wait(
    until.elementLocated(
      By.xpath(
        '//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[1]/a[2]/span[1]'
      )
    )
  );
  let postUserNameText = await postUserName.getText();

  let postUserLikes = await driver.wait(
    until.elementLocated(
      By.xpath(
        '//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[2]/div[2]/div[1]/div[1]/button[1]/strong'
      )
    )
  );
  let postUserLikesNumber = await postUserLikes.getText();
  // get user post content
  let postUserContent = await driver.wait(
    until.elementLocated(
      By.xpath(
        '//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[2]/div[1]'
      )
    )
  );

  let postUserContentText = await postUserContent.getText();

  let postUserDate = await driver.wait(
    until.elementLocated(
      By.xpath(
        '//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[1]/a[2]/span[2]/span[2]'
      )
    )
  );

  let postUserDateText = await postUserDate.getText();

  let userObj = {
    username: postUserNameText,
    postUserLikesNumber: parseInt(postUserLikesNumber),
    postUserDateText: postUserDateText,
    postUserContentText: postUserContentText,
    numOfCommentsNumber: parseInt(numOfCommentsNumber),
  };
  return userObj;
}

export default getUserPostData;
