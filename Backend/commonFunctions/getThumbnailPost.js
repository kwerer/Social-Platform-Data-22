import { By, until } from "selenium-webdriver";

function getThumbnailPost(driver, i) {
  let postThumbnail = driver.wait(
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
  driver.executeScript(
    "arguments[0].scrollIntoView(true);",
    postThumbnail
  );
  postThumbnail.click();
  console.log("no problemo");
}

export default getThumbnailPost;
