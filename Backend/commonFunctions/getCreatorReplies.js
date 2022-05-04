import { By } from "selenium-webdriver";

async function getCreatorReplies(driver, j) {
  let creatorCommentReplyName = await driver.findElement(
    By.xpath(
      `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[${j}]/div[2]/div/div[1]/a/span[1]`
    )
  );

  let creatorCommentReplyNameText =
    await creatorCommentReplyName.getText();

  let creatorCommentReplyContent = await driver.findElement(
    By.xpath(
      `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[${j}]/div[2]/div/div[1]/p[1]/span`
    )
  );
  let creatorCommentReplyContentText =
    await creatorCommentReplyContent.getText();

  let creatorCommentReplyTime = await driver.findElement(
    By.xpath(
      `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[${j}]/div[2]/div/div[1]/p[2]/span[1]`
    )
  );
  let creatorCommentReplyTimeText =
    await creatorCommentReplyTime.getText();

  let creatorCommentRepliesObj = {
    creatorCommentName: creatorCommentReplyNameText,
    creatorCommentReplyContent: creatorCommentReplyContentText,
    creatorCommentReplyTime: creatorCommentReplyTimeText,
  };

  return creatorCommentRepliesObj;
}

export default getCreatorReplies;
