import { Builder, By, until } from "selenium-webdriver";
import axiosInstance from "./commonFunctions/axiosInstance.js";
import { v4 as uuidv4 } from "uuid";
import convertToDate from "./commonFunctions/convertToDate.js";
import getCookies from "./commonFunctions/getCookies.js";
import getThumbnailPost from "./commonFunctions/getThumbnailPost.js";
import getUserPostData from "./commonFunctions/getUserPostData.js";
import getPostComments from "./commonFunctions/getPostComments.js";
import getCreatorReplies from "./commonFunctions/getCreatorReplies.js";
import getUserReplies from "./commonFunctions/getUserReplies.js";
import getUserAccountDetails from "./commonFunctions/getUserAccountDetails.js";
import pkg from "firebase-admin";
const { firestore } = pkg;

let totalPostsData = [];

const webUrl = "https://www.tiktok.com/search?q=kwerer&t=1651730983260";

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
    for (let i = 1; i < 13; i++) {
      // declare new identifier for each new post
      let uniqueId = uuidv4();
      console.log(i + " iteration of individual post");

      // <-----------get post content----------->
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
        date: firestore.Timestamp.fromDate(
          convertToDate(userObj.postUserDateText)
        ).toDate(),
      };
      console.log(postUserDataObject, "user data object");
      getIndivPostData.push(postUserDataObject);

      // call this loop if there are comments for this user post
      console.log(
        userObj.numOfCommentsNumber,
        "number of comments in numbers"
      );
      if (userObj.numOfCommentsNumber > 0) {
        for (let j = 1; j < userObj.numOfCommentsNumber - 1; j++) {
          console.log(j + "jth iteration");
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

          // check if creator reply exist for each comment
          let creatorCommentReply = null;
          // get replies from creator
          try {
            // creator replies are present without needing to click
            // check if there is a reply from creator
            creatorCommentReply = await driver.findElement(
              By.xpath(
                `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[${j}]/div[2]/div`
              )
            );

            let creatorCommentRepliesObj = await getCreatorReplies(
              driver,
              j
            );
            // push creator comments into commentObj.replies array
            commentObj.replies.push({
              username: creatorCommentRepliesObj.creatorCommentName,
              content: creatorCommentRepliesObj.creatorCommentReplyContent,
              time: convertToDate(
                creatorCommentRepliesObj.creatorCommentReplyTime
              ),
              creator: true,
            });
          } catch {
            console.log("No Creator Replies");
          }

          // check if comment has replies, get the comments if needed
          let userCommentReplyExist = null;

          try {
            userCommentReplyExist = await driver.findElement(
              By.xpath(
                `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[${j}]/div[2]/div[1]/p`
              )
            );
            if (userCommentReplyExist != null) {
              // click on the user replies to comment
              await userCommentReplyExist.click();

              // get user comment replies
              let userCommentRepliesObj = getUserReplies(driver);

              commentObj.replies.push({
                username: userCommentRepliesObj.userCommentRepliesName,
                content: userCommentRepliesObj.userCommentRepliesContent,
                time: convertToDate(
                  userCommentRepliesObj.userCommentRepliesTime
                ),
                creator: false,
              });
            } else {
              console.log("No User Comments");
            }
          } catch {
            userCommentReplyExist = null;
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
      // <-----------get post content----------->

      // <-----------get user account details----------->
      await getUserAccountDetails(driver, i);
    } // end of i loop
  }
  getIndivData(driver);
}

getPostData(webUrl);

export { getPostData, webUrl };
