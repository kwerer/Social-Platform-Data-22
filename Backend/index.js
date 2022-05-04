import { Builder, By, until } from "selenium-webdriver";
import axiosInstance from "./axiosInstance.js";
import { v4 as uuidv4 } from "uuid";
import convertToDate from "./commonFunctions/convertToDate.js";
import getCookies from "./commonFunctions/getCookies.js";
import getThumbnailPost from "./commonFunctions/getThumbnailPost.js";
import getUserPostData from "./commonFunctions/getUserPostData.js";
import getPostComments from "./commonFunctions/getPostComments.js";

let totalPostsData = [];

const webUrl = "https://www.tiktok.com/search?q=ukraine&t=1649481109188";

async function getPostData(webUrl) {
  let driver = await new Builder().forBrowser("chrome").build();
  // go to search option
  await driver.get(webUrl);

  // get the cookies for the indiv website
  const cookies = await getCookies("indivPostCookies.csv");
  for (const i of cookies) {
    // add cookies to web driver
    await driver.manage().addCookie(i);
  }

  // refresh browser
  await driver.navigate().refresh();

  // click post data
  async function getIndivData() {
    for (let i = 1; i < 9; i++) {
      // declare new identifier for each new post
      let uniqueId = uuidv4();
      console.log(i + " iteration of individual post");

      // get post thumbnail
      getThumbnailPost(driver, i);

      // get user post data
      let userObj = await getUserPostData(driver);
      console.log(userObj);

      // add user post to object
      const getIndivPostData = [];
      const postUserDataObject = {
        uniqueId: uniqueId,
        user: userObj.username,
        caption: userObj.postUserContentText,
        likes: userObj.postUserLikesNumber,
        numComments: userObj.numOfCommentsNumber,
        date: convertToDate(userObj.postUserDateText),
      };
      console.log(postUserDataObject, "user data object");
      getIndivPostData.push(postUserDataObject);

      // call this loop if there are comments for this user post
      if (userObj.numOfCommentsNumber > 0) {
        for (let j = 1; j < userObj.numOfCommentsNumber - 1; j++) {
          // check if there are comments
          try {
            await driver.findElement(
              By.xpath(
                `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[${j}]/div[1]/div[1]/a/span`
              )
            );
          } catch {
            continue;
          }

          let userCommentsObj = await getPostComments(driver, j);
          console.log(userCommentsObj, "user comments obj");

          // create obj to add details of comments
          const commentObj = {
            uniqueId: uniqueId,
            time: convertToDate(userCommentsObj.userCommentsTime),
            user: userCommentsObj.userCommentsName,
            content: userCommentsObj.userCommentsContent,
            replies: [],
          };

          // check if comment has replies, get the comments if needed
          let userCommentReplyExist;
          // check if creator reply exist for each comment
          let creatorCommentReply;
          try {
            userCommentReplyExist = await driver.findElement(
              By.xpath(
                `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[${j}]/div[2]/div[1]/p`
              )
            );

            // click on the user replies to comment
            await userCommentReplyExist.click();
          } catch {
            userCommentReplyExist = null;
          }

          try {
            creatorCommentReply = await driver.findElement(
              By.xpath(
                `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[${j}]/div[2]/div`
              )
            );
          } catch {
            creatorCommentReply = null;
          }

          // get creator comment details
          if (creatorCommentReply != null) {
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

            commentObj.replies.push({
              username: creatorCommentReplyNameText,
              content: creatorCommentReplyContentText,
              time: convertToDate(creatorCommentReplyTimeText),
              creator: true,
            });
          }
          let userCommentRepliesName;
          if (userCommentReplyExist != null) {
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
                console.log(userCommentRepliesTime, "timeeee");

                let userCommentRepliesTimeText =
                  await userCommentRepliesTime.getText();

                commentObj.replies.push({
                  username: userCommentRepliesNameText,
                  content: userCommentRepliesContentText,
                  time: userCommentRepliesTimeText,
                  creator: false,
                });
              }
            }
          } else {
            console.log("No replies to comment");
          }

          getIndivPostData.push(commentObj);

          axiosInstance
            .post("/sendTiktokDataComments", { commentObj })
            .then(function (res) {
              console.log(res);
            })
            .catch(function (err) {
              console.log(err);
            });
        }
      } else {
        console.log("element not found");
      }

      totalPostsData.push(getIndivPostData);
      // click on back button to continue with other post
      let postBackButton = await driver.wait(
        until.elementLocated(
          By.xpath(
            '//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[1]/button[1]'
          ),
          5000
        )
      );
      axiosInstance
        .post("/sendTiktokDataPost", { postUserDataObject })
        .then(function (res) {
          console.log(res);
        })
        .catch(function (err) {
          console.log(err);
        });
      // wait
      console.log(postBackButton, "here is the back button");
      if (postBackButton != null) {
        try {
          await postBackButton.click();
        } catch (e) {
          console.log(e, "error here");
        }
      } else {
        await driver.manage().setTimeouts({ implicit: 2000 });
        await postBackButton.click();
      }
    } // end of i loop
  }
  getIndivData();
}
// fyp data only able to get the first 8 elements for fyp post as 9th onwards need to load
// getFpyData();
getPostData(webUrl);

export { getPostData, webUrl };
