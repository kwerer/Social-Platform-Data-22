import { By } from "selenium-webdriver";

async function getUserReplies(driver) {
  let userCommentRepliesName;

  for (let k = 1; k < 50; k++) {
    try {
      userCommentRepliesName = await driver.findElement(
        By.xpath(
          `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[1]/div[2]/div[${k}]/div[1]/a/span`
        )
      );
    } catch {
      userCommentRepliesName = null;
      // break for loop
      k = 50;
    }

    if (userCommentRepliesName != null) {
      // add j to stop it from running when max comments is reached
      j++;
      // get username of user who commented
      let userCommentRepliesNameText =
        await userCommentRepliesName.getText();
      // find reply content
      let userCommentRepliesContent = await driver.findElement(
        By.xpath(
          `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[1]/div[2]/div[${k}]/div[1]/p[1]/span`
        )
      );

      let userCommentRepliesContentText =
        await userCommentRepliesContent.getText();

      let userCommentRepliesTime = await driver.findElement(
        By.xpath(
          `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[1]/div[2]/div[${k}]/div[1]/p[2]/span[1]`
        )
      );

      let userCommentRepliesTimeText =
        await userCommentRepliesTime.getText();

      let userCommentRepliesObj = {
        userCommentRepliesName: userCommentRepliesNameText,
        userCommentRepliesContent: userCommentRepliesContentText,
        userCommentRepliesTime: userCommentRepliesTimeText,
      };

      return userCommentRepliesObj;
    }
  }
}

export default getUserReplies;
