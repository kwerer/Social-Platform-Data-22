import { Builder, By, until } from "selenium-webdriver";
import csv from "csvtojson";
import axiosInstance from "./axiosInstance.js";
import { v4 as uuidv4 } from "uuid";

let fypList = [];
let totalPostsData = [];

// function to get cookie data
async function getCookies(filename) {
  const cookies = await csv().fromFile(filename);
  for (const cookie of cookies) {
    fypList.push(cookie);
  }
  return fypList;
}

// unable to locate element of tiktok video
async function getPostData() {
  let driver = await new Builder().forBrowser("chrome").build();
  // go to search option
  await driver.get(
    "https://www.tiktok.com/search?q=lailok&t=1648658017211"
  );

  // get the cookies for the indiv website
  const cookies = await getCookies("indivPostCookies.csv");
  for (const i of cookies) {
    // add cookies to web driver
    await driver.manage().addCookie(i);
  }

  // refresh browser
  await driver.navigate().refresh();
  // wait for the browser to refresh
  await driver.manage().setTimeouts({ implicit: 5000 });

  // click post data
  /*
   *
   * @params:
   *  xPathPost: get the xpath of the post
   *
   *
   *
   *
   */

  async function getIndivData() {
    for (let i = 1; i < 9; i++) {
      // declare new identifier for each new post
      let uniqueId = uuidv4();
      console.log(i + "11111");

      let postThumbnail = await driver.wait(
        until.elementLocated(
          By.xpath(
            `//*[@id="app"]/div[2]/div[2]/div[2]/div[1]/div/div[${
              i + 2
            }]/div[1]/div/div/a`
          ),
          5000
        )
      );
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        postThumbnail
      );
      await postThumbnail.click();
      await driver.manage().setTimeouts({ implicit: 7000 });
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

      function convertToDate(postDate) {
        // for creator comments
        let creatorSplitTime = postDate.split("-");
        let splitTime = postDate.split(" ");
        let splatTime = splitTime[0].split("");
        // time units
        let timeUnit = splatTime[splatTime.length - 1];
        // get the number for time
        let timeNumber = splitTime[0].substring(0, splitTime.length - 1);
        // calculate the time stamp in seconds
        let timeAfterUploadInSeconds;
        const d = new Date();
        let currentSeconds = d.getTime();

        if (timeUnit == "h") {
          timeAfterUploadInSeconds = timeNumber * 3600;
        } else if (timeUnit == "d") {
          timeAfterUploadInSeconds = timeNumber * 86400;
        } else if (timeUnit == "m") {
          timeAfterUploadInSeconds = timeNumber * 60;
        } else if (creatorSplitTime.length == 2) {
          return new Date(
            `${creatorSplitTime[0]}-${creatorSplitTime[1]}-${d.getFullYear}`
          );
        } else {
          return new Date(postDate).toLocaleString();
        }

        let uploadTime = currentSeconds - timeAfterUploadInSeconds;
        let uploadTimeFormatted = new Date(uploadTime);

        return uploadTimeFormatted.toLocaleString(); // return date
      }
      const getIndivPostData = [];
      const postUserDataObject = {
        uniqueId: uniqueId,
        user: postUserNameText,
        caption: postUserContentText,
        likes: postUserLikesNumber,
        numComments: numOfCommentsNumber,
        date: convertToDate(postUserDateText),
      };
      getIndivPostData.push(postUserDataObject);

      if (numOfCommentsNumber != 0) {
        for (let j = 1; j < numOfCommentsNumber - 1; j++) {
          try {
            await driver.findElement(
              By.xpath(
                `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[${j}]/div[1]/div[1]/a/span`
              )
            );
          } catch {
            break;
          }
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
          let userCommentsContentText =
            await userCommentsContent.getText();

          let userCommentsTime = await driver.wait(
            until.elementLocated(
              By.xpath(
                `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[${j}]/div[1]/div[1]/p[2]/span[1]`,

                1000
              )
            )
          );

          let userCommentsTimeText = await userCommentsTime.getText();

          // create obj to add details of comments
          const commentObj = {
            uniqueId: uniqueId,
            time: userCommentsTimeText,
            user: userCommentsNameText,
            content: userCommentsContentText,
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
      await postBackButton.click();
    } // end of i loop
  }
  getIndivData();
}
// fyp data only able to get the first 8 elements for fyp post as 9th onwards need to load
// getFpyData();
getPostData();

export default getPostData;
