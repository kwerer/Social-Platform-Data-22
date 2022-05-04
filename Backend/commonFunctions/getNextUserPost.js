import { By, until } from "selenium-webdriver";

async function getNextUserPost(driver) {
  let getMorePostButton;
  try {
    getMorePostButton = await driver.wait(
      until.elementLocated(
        By.xpath(`//*[@id="app"]/div[2]/div[2]/div[2]/div[2]/button`)
      )
    );
    console.log("next button");

    if (getMorePostButton.isDisplayed()) {
      await getMorePostButton.click();
    }
  } catch {
    console.log("Click more button not there");
  }
}

export default getNextUserPost;
