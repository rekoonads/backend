<<<<<<< HEAD
import puppeteer from "puppeteer";
=======
import { Builder, By, until } from "selenium-webdriver";
import { Select } from "selenium-webdriver/lib/select.js";
>>>>>>> 8e4a4ece3b4b54a78365141761d77599e50b19b1
import Websitemodel from "../models/Website.js";
import Campaignmodel from "../models/Campaign.js";
import Strategy from "../models/Strategy.js";
import { userModel } from "../models/User.js";

import chrome from "selenium-webdriver/chrome.js";
import firefox from 'selenium-webdriver/firefox.js';

import "dotenv/config";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
<<<<<<< HEAD
  try {
    const url = process.env.REVIVE_URL;
    const username = process.env.REVIVE_USERNAME;
    const password = process.env.REVIVE_PASSWORD;
    const user_data = await userModel.findOne({ userId: userId });
    const campaign_data = await Campaignmodel.findOne({
      campaignId: campaignId,
    });
    const strategy_data = await Strategy.findOne({ strategyId: strategyId });
=======
  try{
      const url = process.env.REVIVE_URL;
      const username = process.env.REVIVE_USERNAME;
      const password = process.env.REVIVE_PASSWORD;
      const user_data = await userModel.findOne({ userId: userId });
      const campaign_data = await Campaignmodel.findOne({ campaignId: campaignId });
      const strategy_data = await Strategy.findOne({ strategyId: strategyId });

      const campaignName = campaign_data.campaignName;
      const campaignBudget = campaign_data.campaignBudget;
      const startDate = campaign_data.startDate;
      const endDate = campaign_data.endDate;
      const user_name = `${user_data.firstName} ${user_data.lastName} ${user_data.email}`;
      const user_email = user_data.email;
      const user_number = user_data.phoneNo || 987654321;
      const video_url = strategy_data.creatives;
      const video_duration = strategy_data.duration || "06";
      const video_name = `${user_name} ${video_url.split("/").pop()}`;
      console.log(campaign_data?.website?.websiteUrl)
      const websites = campaign_data?.website;
      if (!websites || Object.keys(websites).length === 0) {
        throw new Error("Please add a website.");
      }
>>>>>>> 8e4a4ece3b4b54a78365141761d77599e50b19b1

      let options = new chrome.Options();
      options.addArguments(
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage"
      );
      // let options = new firefox.Options();
      // options.addArguments("--headless");

      let driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();
      // let driver = await new Builder()
      // .forBrowser('firefox')
      // .setFirefoxOptions(options)
      // .build();

<<<<<<< HEAD
    try {
      // Navigate to Revive URL
      const browser = await puppeteer.launch({ headless: true });

      const page = await browser.newPage();
      await page.goto(url);

      // Login
      await page.type('input[name="username"]', username);
      await page.type('input[name="password"]', password);
      await page.click("#login");
      // await page.waitForNavigation();

      console.log("Login Successfully");

      // Navigate to advertiser campaigns page
      await page.goto(
        "https://console.revive-adserver.net/advertiser-campaigns.php"
      );

      // Check if advertiser exists
      let found = false;
      try {
        const initialAdvertiserSelector = "li.ent.inlineIcon.iconAdvertiser"; // Selector for the initial li
        await page.waitForSelector(initialAdvertiserSelector); // Wait for the element to be available
        await page.click(initialAdvertiserSelector);

        // const advertiserSelector = "span ul li.inlineIcon.iconAdvertiser";
        // await page.waitForSelector(advertiserSelector);
        // const elements = await page.$$(advertiserSelector);

        const advertiserListSelector =
          ".column.first ul.active li a.inlineIcon.iconAdvertiser";
        await page.waitForSelector(advertiserListSelector); // Wait for the list to appear

        const advertiserElements = await page.$$(advertiserListSelector);

        for (let element of advertiserElements) {
          const title = await page.evaluate(
            (el) => el.getAttribute("title"),
            element
          );

          console.log("Fetched Title: ", title);

          if (title === user_name) {
            console.log(`Found: ${title}`);
            found = true;
            await element.click();
            break;
=======
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
>>>>>>> 8e4a4ece3b4b54a78365141761d77599e50b19b1
          }
        } catch (error) {
          console.log(`Error finding advertiser: ${error}`);
        }
        let banner = false;
        let campaign_found = false;

<<<<<<< HEAD
      if (!found) {
        await page.goto(
          "https://console.revive-adserver.net/advertiser-edit.php"
        );
        await page.click("#clientname"); // Click to focus on the input field
        await page.evaluate(
          () => (document.querySelector("#clientname").value = "")
        );
        await page.type("#clientname", user_name);
        await page.type("#contact", user_number.toString());
        await page.type("#email", user_email);
        await page.click("#submit");
        console.log("Advertiser created Successfully");
      }

      // Handle campaigns
      let campaign_found = false;
      try {
        await page.waitForSelector(".tableWrapper table tbody"); // Wait for the table to load

        const rows = await page.$$(".tableWrapper table tbody tr");

        for (let row of rows) {
          const campaignElement = await row.$(
            "td a.inlineIcon.iconCampaignDisabled"
          ); // Adjust the class name if needed

          if (campaignElement) {
            // Get the text content of the campaign element
            const campaignText = await page.evaluate(
              (el) => el.innerText.trim(),
              campaignElement
            );
            console.log("Campaign text: ", campaignText);

            // Compare with the desired campaign name
            if (campaignText === campaignName) {
              campaign_found = true;
              console.log(`Found campaign: ${campaignText}`);

              // Click on the "Banners" link inside the same row
              await row.$eval("a.inlineIcon.iconBanners", (el) => el.click());
              break;
=======
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
          try{
              await driver.wait(until.elementLocated(By.css('.tableWrapper table tbody')), 10000);
                // const rows = await driver.findElements(By.css('tbody tr'));
                const rows = await driver.findElements(By.css('tbody tr:has(td a.inlineIcon.iconCampaign)'));


                for (let row of rows) {
                  // const campaignElement = await row.findElement(By.css('td a.inlineIcon.iconCampaign'));
                  const campaignElement = await driver.wait(until.elementLocated(By.css('td a.inlineIcon.iconCampaign')), 10000);

                  const campaignText = await campaignElement.getText();   
                  if (campaignText === campaignName) {
                    campaign_found = true;
                    console.log(`Found campaign: ${campaignText}`);
                    const addBannerLink = await row.findElement(By.css('a.inlineIcon.iconBanners'));
                    await addBannerLink.click();

                    await driver.wait(until.elementLocated(By.css('.tableWrapper > tbody > tr')), 5000);
                    const noBannerMessage = await driver.findElements(By.css('.tableMessage'));

                        if (noBannerMessage.length > 0) {
                          banner = true;
                        }else{
                          const addBannerLink = await row.findElement(By.css('a.inlineIcon.iconBannerAdd'));
                        }

                    console.log('Clicked "Add new banner".');
                    break; 
                  }
                }
          }catch(error){
            console.log("error",error);
            return {
              status:"error",
              message:error.message,
>>>>>>> 8e4a4ece3b4b54a78365141761d77599e50b19b1
            }
          }
          await driver.findElement(By.css("a.inlineIcon.iconCampaignAdd")).click();
          await driver.sleep(1000);
        }
        if(!campaign_found){
          await driver.findElement(By.id("campaignname")).clear();
          await driver.findElement(By.id("campaignname")).sendKeys(campaignName);
          await driver.findElement(By.id("priority-e")).click();
          await driver.findElement(By.id("startSet_specific")).click();
          const start_date = await convertDateMode(startDate);
          const end_date = await convertDateMode(endDate);
          driver.sleep(2000);
          // await driver.findElement(By.id("start")).sendKeys(start_date);
          const startElement = await driver.wait(until.elementLocated(By.id("start")),20000);
          await driver.wait(until.elementIsVisible(startElement), 10000);
          await startElement.sendKeys(start_date);
          await driver.findElement(By.id("endSet_specific")).click();
          await driver.findElement(By.id("end")).sendKeys(end_date);
          await driver.findElement(By.id("revenue")).sendKeys(campaignBudget || 100);
          await driver.findElement(By.id("weight")).sendKeys("100");
          await driver.findElement(By.id("submit")).click();
          console.log("Campaign Created Successfully");
          try {
                await driver
                  .wait(until.elementLocated(By.linkText("add a banner")), 10000)
                  .click();
              } catch (error) {
                await driver.get(
                  "https://console.revive-adserver.net/campaign-banners.php"
                );
                await driver.findElement(By.css("a.inlineIcon.iconBannerAdd")).click();
              }
        }

        // Create banner
        if(!banner){
          await driver
              .findElement(By.name("type"))
              .sendKeys("Inline Video Ad (pre/mid/post-roll)");
            await driver.findElement(By.id("description")).sendKeys(video_name);
            await driver.findElement(By.id("vast_video_filename")).sendKeys(video_url);
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
        console.log("website opened")
        let found_site = false;
        const rows = await driver.wait(until.elementsLocated(By.css(".tableWrapper tbody tr")), 10000);
            console.log("row finding",rows);
          for (let row of rows) {
            try {
              console.log("finding website ...");
              // Wait until the row is visible
              await driver.wait(until.elementIsVisible(row), 10000);
          
              const linkElement = await row.findElement(By.css("a.inlineIcon.iconWebsite"));
              const linkUrl = await linkElement.getText();
              console.log("finding website ...",linkUrl);
          
              if (linkUrl === websites?.websiteName) {
                found_site = true;
                await row.findElement(By.css("a.inlineIcon.iconZoneAdd")).click();
                console.log(`Clicked 'Add new zone' for ${websites?.websiteUrl}`);
                break;
              }
            } catch (error) {
              console.log("erroe",error);
              return {
                status: 'error',
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

        const campaignidSelect = await driver.findElement(By.name("campaignid"));

        const optionToSelect = await campaignidSelect.findElement(By.xpath(`//option[contains(text(),'${campaignName} ')]`));

        await optionToSelect.click();
        // const campaignidOptions = await campaignidSelect.findElements(
        //   By.tagName("option")
        // );
        // if (campaignidOptions.length > 0) {
        //   await campaignidOptions[campaignidOptions.length - 1].click();
        // }

        await driver.findElement(By.id("link_submit")).click();
        await driver.findElement(By.linkText("VAST2 Invocation Code")).click();

        const textareaElement = await driver.wait(
          until.elementLocated(By.css("textarea.code-gray")),
          10000
        );
        const textareaValue = await textareaElement.getText();
        console.log("Textarea Value:", textareaValue);

        return {
          status: 'success',
          value: textareaValue,
        };
      } catch (error) {
        console.log("error",error);
        return {
          status: 'error',
          message: error.message,
        };
        
      } finally {
        await driver.quit();
      }
<<<<<<< HEAD
      return "a";
      // Add new campaign if not found
      if (!campaign_found) {
        const addCampaignSelector = "a.inlineIcon.iconCampaignAdd"; // Selector for the "Add new campaign" link

        await page.waitForSelector(addCampaignSelector);
        await page.click(addCampaignSelector);
        const campaignNameInputSelector = "input#campaignname"; // Selector for the input field

        await page.waitForSelector(campaignNameInputSelector);

        await page.evaluate((selector) => {
          document.querySelector(selector).value = ""; // Clears the value
        }, campaignNameInputSelector);

        await page.type(campaignNameInputSelector, campaignName);
        await page.click("#priority-e");

        const start_date = convertDateMode(startDate);
        const end_date = convertDateMode(endDate);

        const specificDateRadioSelector = "#startSet_specific";
        await page.waitForSelector(specificDateRadioSelector, {
          visible: true,
        });

        // Debug: Check if the element is visible and interactable
        const isVisible = await page.evaluate((selector) => {
          const element = document.querySelector(selector);
          return (
            element &&
            window.getComputedStyle(element).display !== "none" &&
            element.offsetWidth > 0 &&
            element.offsetHeight > 0
          );
        }, specificDateRadioSelector);

        if (!isVisible) {
          console.error(
            "Element is not visible or not interactable:",
            specificDateRadioSelector
          );
          return;
        }

        // Click the radio button
        await page.click(specificDateRadioSelector);

        const specificStartDateSpanSelector = "#specificStartDateSpan";
        await page.waitForSelector(specificStartDateSpanSelector, {
          visible: true,
        });

        const startDateInputSelector = "#start";
        await page.waitForSelector(startDateInputSelector);
        await page.evaluate((selector) => {
          document.querySelector(selector).value = ""; // Clear existing value
        }, startDateInputSelector);

        await page.type(startDateInputSelector, start_date);

        await page.click("#startSet_specific");
        await page.type("#start", start_date);
        await page.click("#endSet_specific");
        await page.type("#end", end_date);
        await page.type("#revenue", campaignBudget || "100");
        await page.type("#weight", "100");
        await page.click("#submit");
        console.log("Campaign Created Successfully");
      }

      // Create banner
      await page.select(
        'select[name="type"]',
        "Inline Video Ad (pre/mid/post-roll)"
      );
      await page.type("#description", video_name);
      await page.type("#vast_video_filename", video_url);
      await page.type("#vast_video_type", "MP4");
      await page.type("#vast_video_duration", video_duration);
      await page.type("#vast_video_clickthrough_url", video_url);
      await page.click("#submit");
      console.log("Banner Created Successfully");

      await browser.close();
      return { status: "success", message: "Operation completed successfully" };
    } catch (error) {
      console.log("Error:", error);
      return { status: "error", message: error.message };
    }
  } catch (error) {
    console.log("Error:", error);
    return { status: "error", message: error.message };
=======
    }catch(error){
      console.log("error",error);
        return {
          status: 'error',
          message: error.message,
        };
    }
>>>>>>> 8e4a4ece3b4b54a78365141761d77599e50b19b1
  }

export { openPage };