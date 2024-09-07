import puppeteer from "puppeteer";
import Websitemodel from "../models/Website.js";
import Campaignmodel from "../models/Campaign.js";
import Strategy from "../models/Strategy.js";
import { userModel } from "../models/User.js";

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
    const video_duration = strategy_data.duration || "06";
    const video_name = `${user_name} ${video_url.split("/").pop()}`;

    const websites = campaign_data?.website;

    try {
      // Navigate to Revive URL
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

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
          }
        }
      } catch (error) {
        console.log(`Error finding advertiser: ${error}`);
      }

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
            }
          }
        }
      } catch (error) {
        console.log("Error handling campaigns:", error);
        return { status: "error", message: error.message };
      }
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
  }
};

export { openPage };
