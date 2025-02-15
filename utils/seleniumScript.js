import { Builder, By, until } from "selenium-webdriver";
import { Select } from "selenium-webdriver/lib/select.js";
import Websitemodel from "../models/Website.js";
import Campaignmodel from "../models/Campaign.js";
import Strategy from "../models/Strategy.js";
import { userModel } from "../models/User.js";

import chrome from "selenium-webdriver/chrome.js";
import firefox from "selenium-webdriver/firefox.js";

import "dotenv/config";

function convertDateMode(dateString) {
  let inputDate = dateString ? dateString : new Date();
  let dateObj = new Date(inputDate);
  let options = { day: "2-digit", month: "long", year: "numeric" };
  let formattedDate = dateObj.toLocaleDateString("en-GB", options);
  console.log(formattedDate);
  return formattedDate;
}

function getWebsitesByUserId(userId) {
  return Websitemodel.find({ createdBy: userId }).exec();
}

const openPage = async (userId, campaignId, strategyId) => {
  try {
    const url = process.env.REVIVE_URL;
    const username = process.env.REVIVE_USERNAME;
    const password = process.env.REVIVE_PASSWORD;
    const user_data = await userModel.findOne({ userId: userId });
    const campaign_data = await Campaignmodel.findOne({
      campaignId: campaignId,
    });
    const strategy_data = await Strategy.findOne({ strategyId: strategyId });

    const campaignName = campaign_data.campaignName;
    const campaignBudget = campaign_data.campaignBudget;
    const startDate = campaign_data.startDate;
    const endDate = campaign_data.endDate;
    const user_name = `${user_data.firstName} ${user_data.lastName} ${user_data.email}`;
    const user_email = user_data.email;
    const user_number = user_data.phoneNo || 987654321;
    const video_url = strategy_data.creatives;
    const websites = campaign_data?.website;
    const video_duration = strategy_data.duration || "06";
    const video_name = `${user_name} ${video_url.split("/").pop()}`;
    console.log(campaign_data?.website?.websiteUrl);
    const zone_name = websites?.websiteUrl + " " + campaignName;
    if (!websites || Object.keys(websites).length === 0) {
      throw new Error("Please add a website.");
    }

    let options = new chrome.Options();
    options.addArguments();

    let driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    try {
      await driver.get(url);

      // Login
      await driver
        .wait(until.elementLocated(By.name("username")), 10000)
        .sendKeys(username);
      await driver
        .wait(until.elementLocated(By.name("password")), 10000)
        .sendKeys(password);
      await driver.wait(until.elementLocated(By.id("login")), 10000).click();
      console.log("Login Successfully");

      // Navigate to advertiser campaigns page
      await driver.get(
        "https://console.revive-adserver.net/advertiser-campaigns.php"
      );

      let found = false;
      try {
        let spanElement = await driver.findElement(
          By.css("span ul li.inlineIcon.iconAdvertiser")
        );
        await spanElement.click();
        let activeUl = await driver.wait(
          until.elementLocated(By.css("ul.active")),
          10000
        );
        let liElements = await activeUl.findElements(By.css("li"));

        for (let li of liElements) {
          let aElement = await li.findElement(
            By.css("a.inlineIcon.iconAdvertiser")
          );
          let title = await aElement.getAttribute("title");
          if (title === user_name) {
            found = true;
            console.log(`Found ${user_name}`);
            await aElement.click();
            break;
          }
        }
      } catch (error) {
        console.log(`Error finding advertiser: ${error}`);
      }

      let banner = false;
      let campaign_found = false;

      if (!found) {
        await driver.get(
          "https://console.revive-adserver.net/advertiser-edit.php"
        );
        await driver.findElement(By.id("clientname")).clear();
        await driver.findElement(By.id("clientname")).sendKeys(user_name);
        await driver.findElement(By.id("contact")).sendKeys(user_number);
        await driver.findElement(By.id("email")).sendKeys(user_email);
        await driver.findElement(By.id("submit")).click();
        console.log("Advertiser created Successfully");

        await driver
          .wait(until.elementLocated(By.linkText("add a campaign")), 10000)
          .click();
        await driver.sleep(1000);
      } else {
        try {
          await driver.wait(
            until.elementLocated(By.css(".tableWrapper table tbody")),
            10000
          );
          const rows = await driver.findElements(By.css("tbody tr"));

          for (let row of rows) {
            try {
              let campaignElement;

              try {
                campaignElement = await row.findElement(
                  By.css("td a.inlineIcon.iconCampaignDisabled")
                );
              } catch (e) {
                campaignElement = await row.findElement(
                  By.css("td a.inlineIcon.iconCampaign")
                );
              }

              const campaignText = await campaignElement.getText();
              console.log(
                "campaign text:",
                campaignText,
                "my text:",
                campaignName
              );

              if (campaignText === campaignName) {
                campaign_found = true;
                console.log(`Found campaign: ${campaignText}`);

                const addBannerLink = await row.findElement(
                  By.css("a.inlineIcon.iconBanners")
                );
                await addBannerLink.click();

                const noBannerMessage = await driver.findElements(
                  By.css(".tableMessage")
                );

                if (noBannerMessage.length > 0) {
                  const addNewBannerLink = await row.findElement(
                    By.css("a.inlineIcon.iconBannerAdd")
                  );
                  await addNewBannerLink.click();
                  console.log('Clicked "Banners" or "Add new banner".');
                } else {
                  banner = true;
                  console.log("found banner on this campaign");
                }
                break;
              }
            } catch (e) {
              // Handle the case where campaignElement or other elements don't exist in the row
              // console.log("Error processing row:", e.message);
            }
          }
        } catch (error) {
          console.log("error", error);
          return {
            status: "error",
            message: error.message,
          };
        }
      }

      if (!campaign_found) {
        try {
          await driver
            .findElement(By.css("a.inlineIcon.iconCampaignAdd"))
            .click();
          await driver.sleep(1000);
          await driver.findElement(By.id("campaignname")).clear();
          await driver
            .findElement(By.id("campaignname"))
            .sendKeys(campaignName);
          await driver.findElement(By.id("priority-e")).click();
          await driver.findElement(By.id("startSet_specific")).click();
          const start_date = await convertDateMode(startDate);
          const end_date = await convertDateMode(endDate);
          driver.sleep(2000);
          const startElement = await driver.wait(
            until.elementLocated(By.id("start")),
            20000
          );
          await driver.wait(until.elementIsVisible(startElement), 10000);

          await startElement.sendKeys(start_date);
          await driver.findElement(By.id("endSet_specific")).click();
          await driver.findElement(By.id("end")).sendKeys(end_date);
          await driver
            .findElement(By.id("revenue"))
            .sendKeys(campaignBudget || 100);
          await driver.findElement(By.id("weight")).sendKeys("100");
          await driver.findElement(By.id("submit")).click();
          console.log("Campaign Created Successfully");
          try {
            await driver
              .wait(until.elementLocated(By.linkText("add a banner")), 10000)
              .click();
          } catch (error) {
            console.log("error :- ", error);
            await driver.get(
              "https://console.revive-adserver.net/campaign-banners.php"
            );
            await driver
              .findElement(By.css("a.inlineIcon.iconBannerAdd"))
              .click();
          }
        } catch (error) {
          console.log("error :- ", error);
        }
      }

      // Create banner
      if (!banner) {
        await driver
          .findElement(By.name("type"))
          .sendKeys("Inline Video Ad (pre/mid/post-roll)");
        await driver.findElement(By.id("description")).sendKeys(video_name);
        await driver
          .findElement(By.id("vast_video_filename"))
          .sendKeys(video_url);
        await driver.findElement(By.id("vast_video_type")).sendKeys("MP4");
        await driver
          .findElement(By.id("vast_video_duration"))
          .sendKeys(video_duration);
        await driver
          .findElement(By.id("vast_video_clickthrough_url"))
          .sendKeys(video_url);
        await driver.findElement(By.id("submit")).click();
        console.log("Banner Created Successfully");
      }

      await driver.get("https://console.revive-adserver.net/website-index.php");
      console.log("website opened");
      let found_site = false;
      let found_zone = false;
      const rows = await driver.wait(
        until.elementsLocated(By.css(".tableWrapper tbody tr")),
        10000
      );
      console.log("row finding", rows);
      for (let row of rows) {
        try {
          await driver.wait(until.elementIsVisible(row), 10000);

          const linkElement = await row.findElement(
            By.css("a.inlineIcon.iconWebsite")
          );
          const linkUrl = await linkElement.getText();
          console.log("finding website ...", linkUrl);

          if (linkUrl === websites?.websiteName) {
            found_site = true;
            await row.findElement(By.css("a.inlineIcon.iconZones")).click();
            const noBannerMessage = await driver.findElements(
              By.css(".tableMessage")
            );

            if (noBannerMessage.length > 0) {
              await row.findElement(By.css("a.inlineIcon.iconZoneAdd")).click();
              console.log(`Clicked 'Add new zone' for ${websites?.websiteUrl}`);
            } else {
              await driver.wait(
                until.elementLocated(By.css(".tableWrapper")),
                10000
              );

              const table = await driver.findElement(
                By.css(".tableWrapper table")
              );

              await driver.wait(
                until.elementLocated(By.css(".tableWrapper table tbody tr")),
                10000
              );
              const rows = await table.findElements(By.css("tbody tr"));
              for (let row of rows) {
                try {
                  const zoneLink = await row.findElement(
                    By.css("td a.inlineIcon")
                  );

                  const zoneText = await zoneLink.getText();
                  console.log("zone text:", zoneText);

                  if (zoneText === zone_name) {
                    found_zone = true;
                    console.log(`Found zone: ${zoneText}`);

                    const invocationCodeLink = await row.findElement(
                      By.css("a.inlineIcon.iconZoneInvocation")
                    );
                    await invocationCodeLink.click();

                    console.log('Clicked "Invocation Code".');
                    break;
                  }
                } catch (e) {
                  console.log("Error processing row:", e.message);
                }
              }
              if (!found_zone) {
                await driver.wait(
                  until.elementLocated(By.css("a.inlineIcon.iconZoneAdd")),
                  10000
                );
                const addNewZoneLink = await driver.findElement(
                  By.css("a.inlineIcon.iconZoneAdd")
                );
                await addNewZoneLink.click();
              }
            }

            break;
          }
        } catch (error) {
          console.log("error", error);
          return {
            status: "error",
            message: error.message,
          };
        }
      }

      if (!found_site) {
        await driver.findElement(By.css("a.inlineIcon.iconWebsiteAdd")).click();
        await driver.findElement(By.id("name")).sendKeys(websites?.websiteName);
        await driver
          .findElement(By.id("website"))
          .sendKeys(websites?.websiteUrl);
        await driver
          .findElement(By.id("contact"))
          .sendKeys(websites?.websiteContact || "0987654321");
        await driver
          .findElement(By.id("email"))
          .sendKeys(websites?.websiteEmail);
        await driver.findElement(By.id("save")).click();
        console.log("Website Created Successfully");
        await driver
          .wait(until.elementLocated(By.linkText("add a zone")), 10000)
          .click();
      }
      if (!found_zone) {
        const inputField = await driver.findElement(By.id("zonename"));
        await inputField.clear();
        await inputField.sendKeys(zone_name);
        await driver.findElement(By.id("delivery-vi")).click();
        await driver.findElement(By.id("submit")).click();
        console.log("Zone Created Successfully");
        const elements = await driver.findElements(
          By.css("a.inlineIcon.iconZoneLinked")
        );
        if (elements.length > 0) {
          await elements[elements.length - 1].click();
        }

        const dropdownElement = await driver.findElement(By.name("clientid"));
        const select = new Select(dropdownElement);
        await select.selectByVisibleText(user_name);
        await driver.sleep(2000);

        const campaignidSelect = await driver.findElement(
          By.name("campaignid")
        );

        const optionToSelect = await campaignidSelect.findElement(
          By.xpath(`//option[contains(text(),'${campaignName} ')]`)
        );

        await optionToSelect.click();

        await driver.findElement(By.id("link_submit")).click();
        await driver.findElement(By.linkText("VAST2 Invocation Code")).click();
      }

      const textareaElement = await driver.wait(
        until.elementLocated(By.css("textarea.code-gray")),
        10000
      );
      const textareaValue = await textareaElement.getText();
      console.log("Textarea Value:", textareaValue);

      return {
        status: "success",
        value: textareaValue,
      };
    } catch (error) {
      console.log("error", error);
      return {
        status: "error",
        message: error.message,
      };
    } finally {
      await driver.quit();
    }
  } catch (error) {
    console.log("error", error);
    return {
      status: "error",
      message: error.message,
    };
  }
};

export { openPage };
