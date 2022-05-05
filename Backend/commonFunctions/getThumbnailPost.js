import { By, until } from "selenium-webdriver";

async function getThumbnailPost(driver, i) {
  // click on the videos tab
  let videoTab = await driver.findElement(
    By.xpath(`//*[@id="tabs-0-tab-search_video"]`)
  );

  await videoTab.click();
  // check if the 1  or 2 is available
  let postThumbnail = await driver.wait(
    until.elementLocated(
      By.xpath(
        `//*[@id="app"]/div[2]/div[2]/div[2]/div[1]/div/div[${i}]/div[1]/div/div/a`
      ),
      5000
    )
  );
  console.log("here is after postThumbnail");
  await driver.executeScript(
    "arguments[0].scrollIntoView(true);",
    postThumbnail
  );
  await postThumbnail.click();
  console.log("no problemo");
}

export default getThumbnailPost;
