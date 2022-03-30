import { Builder, By, until } from "selenium-webdriver";
import csv from "csvtojson";
import axiosInstance from "./axiosInstance.js";
import { v4 as uuidv4 } from "uuid";
import { unfurl } from "unfurl.js";

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

async function getFpyData() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://www.tiktok.com/");
    for (let i = 1; i <= 1; i++) {
      let numLikes = await driver
        .findElement(
          By.xpath(
            `/html/body/div[2]/div[2]/div[2]/div[1]/div[${i}]/div/div[2]/div[2]/button[1]/strong`
          )
        )
        .getText();
      let numComments = await driver
        .findElement(
          By.xpath(
            `/html/body/div[2]/div[2]/div[2]/div[1]/div[${i}]/div/div[2]/div[2]/button[2]/strong`
          )
        )
        .getText();
      let numShares = await driver
        .findElement(
          By.xpath(
            `/html/body/div[2]/div[2]/div[2]/div[1]/div[${i}]/div/div[2]/div[2]/button[3]/strong`
          )
        )
        .getText();
      let userId = await driver
        .findElement(
          By.xpath(
            `/html/body/div[2]/div[2]/div[2]/div[1]/div[${i}]/div/div[1]/div[1]/a[2]/h3`
          )
        )
        .getText();
      fypList.push({
        numLikes: numLikes,
        numComments: numComments,
        numShares: numShares,
        userId: userId,
      });
      console.log(fypList, fypList.length, "fypList");
    }
  } catch {
    console.log("catch");
  }
}

// unable to locate element of tiktok video
async function getPostData() {
  let driver = await new Builder().forBrowser("chrome").build();
  // go to search option
  await driver.get(
    "https://www.tiktok.com/search?q=ukraine&t=1648057576148"
  );

  console.log("1");

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
   *
   *
   *
   */

  async function getIndivData() {
    console.log("hha ran");
    for (let i = 1; i < 5; i++) {
      console.log(i + "i");

      // declare new identifier for each new post
      let uniqueId = uuidv4();

      let postThumbnail = await driver.wait(
        until.elementLocated(
          By.xpath(
            `//*[@id="app"]/div[2]/div[2]/div[2]/div[1]/div/div[${
              i + 1
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
      console.log(numOfCommentsNumber + "numof comments");

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

      // To-Do re write function for date
      // get m,h,d
      // let timeFormat = postUserDateText.charAt(
      //   postUserDateText.length - 5
      // );

      // let postURL = await driver.getCurrentUrl();

      // function convertToDate() {}
      const getIndivPostData = [];
      const postUserDataObject = {
        uniqueId: uniqueId,
        user: postUserNameText,
        caption: postUserContentText,
        likes: postUserLikesNumber,
        numComments: numOfCommentsNumber,
        // To-do change to calculate date
        time: postUserDateText,
      };
      getIndivPostData.push(postUserDataObject);

      if (numOfCommentsNumber != 0) {
        //Math.floor(numOfCommentsNumber * 0.8)
        for (let j = 1; j < 5; j++) {
          console.log(j, " j loop");
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
          console.log("userCommentname ran");

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
          console.log(userCommentsTimeText, "tiometext");
          console.log(userCommentsNameText, "nametext");

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
          try {
            userCommentReplyExist = await driver.findElement(
              By.xpath(
                `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[${j}]/div[2]/div[1]/p`
              )
            );
            console.log(
              await userCommentReplyExist.getText(),
              "usecommmm"
            );
            // click on the user replies to comment
            await userCommentReplyExist.click();
          } catch {
            userCommentReplyExist = null;
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
                });
              } else {
                //do nothing
              }
            }
          } else {
            console.log("No replies to comment");
          }

          getIndivPostData.push(commentObj);
          console.log(commentObj, "comment obj");
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

  // let postThumbnail = await driver.findElement(
  //   By.xpath(
  //     `//*[@id="app"]/div[2]/div[2]/div[2]/div[1]/div/div[${
  //       i + 1
  //     }]/div[1]/div/div/a`
  //   )
  // );
  // console.log("2");
  // console.log(postThumbnail, "tagname");
  // postThumbnail.click();

  // // get comments on post after solving captcha

  // for (i = 1; i < 10; i++) {
  //   let userCommentsName = await driver.wait(
  //     until.elementLocated(
  //       By.xpath(
  //         `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[${i}]/div[1]/div[1]/a/span`,

  //         1000
  //       )
  //     )
  //   );

  //   let userCommentsContent = await driver.wait(
  //     until.elementLocated(
  //       By.xpath(
  //         `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[${i}]/div[1]/div[1]/a/span`,

  //         1000
  //       )
  //     )
  //   );

  //   let userCommentsTime = await driver.wait(
  //     until.elementLocated(
  //       By.xpath(
  //         `//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[2]/div[3]/div[${i}]/div[1]/div[1]/p[2]/span[1]`,

  //         1000
  //       )
  //     )
  //   );

  //   console.log(await userCommentsName.getText(), "comments");
  //   console.log(await userCommentsContent.getText(), "comments");
  //   console.log(await userCommentsTime.getText(), "comments");
  // }

  // click on back button to continue with other post
  // let postBackButton = await driver.wait(
  //   until.elementLocated(
  //     By.xpath(
  //       '//*[@id="app"]/div[2]/div[2]/div[2]/div[3]/div[1]/button[1]'
  //     )
  //   )
  // );

  // postBackButton.click();

  // let postThumbnail2 = await driver.findElement(
  //   By.xpath(
  //     `//*[@id="app"]/div[2]/div[2]/div[2]/div[1]/div/div[3]/div[1]/div/div/a`
  //   ) //*[@id="app"]/div[2]/div[2]/div[2]/div[1]/div/div[3]/div[1]/div/div/a/
  // );
  // console.log("2");
  // console.log(postThumbnail2, "tagname");
  // postThumbnail2.click();
  // console.log("done");
}
// fyp data only able to get the first 8 elements for fyp post as 9th onwards need to load
// getFpyData();
getPostData();

export default getPostData;
