import puppeteer from 'puppeteer';
import Websitemodel from "../models/Website.js";
import Campaignmodel from "../models/Campaign.js";
import Strategy from "../models/Strategy.js";
import { userModel } from "../models/User.js";

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
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

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

    const websites = campaign_data?.website;

    try {
      // Navigate to Revive URL
      await page.goto(url);

      // Login
      await page.type('input[name="username"]', username);
      await page.type('input[name="password"]', password);
      await page.click('#login');
      await page.waitForNavigation();

      console.log("Login Successfully");

      // Navigate to advertiser campaigns page
      await page.goto("https://console.revive-adserver.net/advertiser-campaigns.php");

      // Check if advertiser exists
      let found = false;
      try {
        const advertiserSelector = "span ul li.inlineIcon.iconAdvertiser";
        await page.waitForSelector(advertiserSelector);
        const elements = await page.$$(advertiserSelector);

        for (let element of elements) {
          const title = await page.evaluate(el => el.getAttribute('title'), element);
          if (title === user_name) {
            found = true;
            console.log(`Found ${user_name}`);
            await element.click();
            break;
          }
        }
      } catch (error) {
        console.log(`Error finding advertiser: ${error}`);
      }

      // Add new advertiser if not found
      if (!found) {
        await page.goto("https://console.revive-adserver.net/advertiser-edit.php");
        await page.type('#clientname', user_name);
        await page.type('#contact', user_number.toString());
        await page.type('#email', user_email);
        await page.click('#submit');
        console.log("Advertiser created Successfully");
      }

      // Handle campaigns
      let campaign_found = false;
      try {
        await page.waitForSelector('.tableWrapper table tbody');
        const rows = await page.$$('.tableWrapper table tbody tr:has(td a.inlineIcon.iconCampaign)');

        for (let row of rows) {
          const campaignElement = await row.$('td a.inlineIcon.iconCampaign');
          const campaignText = await page.evaluate(el => el.innerText, campaignElement);

          if (campaignText === campaignName) {
            campaign_found = true;
            console.log(`Found campaign: ${campaignText}`);
            await row.$eval('a.inlineIcon.iconBanners', el => el.click());
            break;
          }
        }
      } catch (error) {
        console.log("Error handling campaigns:", error);
        return { status: "error", message: error.message };
      }

      // Add new campaign if not found
      if (!campaign_found) {
        await page.type('#campaignname', campaignName);
        await page.click('#priority-e');
        await page.click('#startSet_specific');
        const start_date = convertDateMode(startDate);
        const end_date = convertDateMode(endDate);
        await page.type('#start', start_date);
        await page.click('#endSet_specific');
        await page.type('#end', end_date);
        await page.type('#revenue', campaignBudget || "100");
        await page.type('#weight', "100");
        await page.click('#submit');
        console.log("Campaign Created Successfully");
      }

      // Create banner
      await page.select('select[name="type"]', "Inline Video Ad (pre/mid/post-roll)");
      await page.type('#description', video_name);
      await page.type('#vast_video_filename', video_url);
      await page.type('#vast_video_type', "MP4");
      await page.type('#vast_video_duration', video_duration);
      await page.type('#vast_video_clickthrough_url', video_url);
      await page.click('#submit');
      console.log("Banner Created Successfully");

      await browser.close();
      return { status: 'success', message: 'Operation completed successfully' };

    } catch (error) {
      console.log("Error:", error);
      return { status: 'error', message: error.message };
    }
  } catch (error) {
    console.log("Error:", error);
    return { status: 'error', message: error.message };
  }
};

export { openPage };
