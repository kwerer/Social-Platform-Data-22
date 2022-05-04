import { By, until } from "selenium-webdriver";

async function getThumbnailPost(driver, i) {
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
  console.log("here is after postThumbnail");
  await driver.executeScript(
    "arguments[0].scrollIntoView(true);",
    postThumbnail
  );
  await postThumbnail.click();
  console.log("no problemo");
}

export default getThumbnailPost;
