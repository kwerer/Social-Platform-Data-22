import { By, until } from "selenium-webdriver";
import axiosInstance from "./axiosInstance.js";

async function getUserAccountDetails(driver, i) {
  let userAccountDetailsButton = await driver.findElement(
    By.xpath(
      `//*[@id="app"]/div[2]/div[2]/div[2]/div[1]/div/div[${i}]/div[2]/div/div[2]/a/div/p`
    )
  );

  await userAccountDetailsButton.click();

  // user account name
  let userAccountTitle = await driver.wait(
    until.elementLocated(
      By.xpath(`//*[@id="app"]/div[2]/div[2]/div/div[1]/div[1]/div[2]/h2`),
      5000
    )
  );

  let userAccountTitleText = await userAccountTitle.getText();
  console.log(userAccountTitleText);

  // user account subtitle
  let userAccountSubtitle = await driver.wait(
    until.elementLocated(
      By.xpath(`//*[@id="app"]/div[2]/div[2]/div/div[1]/div[1]/div[2]/h1`),
      5000
    )
  );

  let userAccountSubtitleText = await userAccountSubtitle.getText();
  console.log(userAccountSubtitleText);

  // user's following
  let userAccountFollowing = await driver.wait(
    until.elementLocated(
      By.xpath(
        `//*[@id="app"]/div[2]/div[2]/div/div[1]/h2[1]/div[1]/strong`
      ),
      5000
    )
  );

  let userAccountFollowingText = await userAccountFollowing.getText();
  console.log(userAccountFollowingText);

  // user's followers
  let userAccountFollowers = await driver.wait(
    until.elementLocated(
      By.xpath(
        `//*[@id="app"]/div[2]/div[2]/div/div[1]/h2[1]/div[2]/strong`
      ),
      5000
    )
  );

  let userAccountFollowersText = await userAccountFollowers.getText();
  console.log(userAccountFollowersText);

  // user's likes
  let userAccountLikes = await driver.wait(
    until.elementLocated(
      By.xpath(
        `//*[@id="app"]/div[2]/div[2]/div/div[1]/h2[1]/div[3]/strong`
      ),
      5000
    )
  );

  let userAccountLikesText = await userAccountLikes.getText();
  console.log(userAccountLikesText);

  // user's bio
  let userAccountBio = await driver.wait(
    until.elementLocated(
      By.xpath(`//*[@id="app"]/div[2]/div[2]/div/div[1]/h2[2]`),
      5000
    )
  );

  let userAccountBioText = await userAccountBio.getText();
  console.log(userAccountBioText, "this is the text");

  let userVideosArray = [];
  for (let a = 1; a < 10000; a++) {
    console.log("valeu of a is : ", a);
    let userAccountVideo = await driver.wait(
      until.elementLocated(
        By.xpath(
          `//*[@id="app"]/div[2]/div[2]/div/div[2]/div[2]/div/div[${a}]/div[1]/div/div/a/div/div[1]/div/video`
        ),
        5000
      )
    );
    // need to know how to scoll this
    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      userAccountVideo
    );
    let userAccountVideoText = await userAccountVideo.getAttribute("src");
    console.log(userAccountVideoText, "this is the video href");

    if (userAccountVideoText != null) {
      console.log("stuck in if");
      userVideosArray.push(userAccountVideoText);
      console.log("stuck in if 2");
    } else {
      console.log("stuck in else");
      a = 10001;
    }
  }
  //*[@id="app"]/div[2]/div[2]/div/div[2]/div[2]/div/div[1]/div[1]/div/div/a
  //*[@id="app"]/div[2]/div[2]/div/div[2]/div[2]/div/div[2]/div[1]/div/div/a

  let userAccountObj = {
    userAccountName: userAccountTitleText,
    userAccountSubtitle: userAccountSubtitleText,
    userAccountFollowing: parseInt(userAccountFollowingText),
    userAccountFollowers: parseInt(userAccountFollowersText),
    userAccountBio: userAccountBioText,
  };
  axiosInstance
    .post("/sendUserAccountDetails", { userAccountObj })
    .then(function (res) {
      console.log(res);
    })
    .catch(function (err) {
      console.log(err);
    });

  await driver.navigate().back();
}

export default getUserAccountDetails;
