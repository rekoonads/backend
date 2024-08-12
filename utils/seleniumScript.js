
import { Builder, By, until } from "selenium-webdriver";
import { Select } from 'selenium-webdriver/lib/select.js';
import Websitemodel from "../models/Website.js";
import Campaignmodel from "../models/Campaign.js";
import Strategy from "../models/Strategy.js";
import { userModel } from '../models/User.js';

import chrome from "selenium-webdriver/chrome.js";

import "dotenv/config";
// import chrome from 'selenium-webdriver/chrome';

function convertDateMode(dateString) {
  let inputDate = dateString ? dateString : new Date();
  let dateObj = new Date(inputDate);
  let options = { day: "2-digit", month: "long", year: "numeric" };
  let formattedDate = dateObj.toLocaleDateString("en-GB", options);
  return formattedDate;
}

function getWebsitesByUserId(userId) {
  return Websitemodel.find({ createdBy: userId }).exec();
}

const openPage = async (userId, campaignId, strategyId) => {
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
  const user_id = user_data.userId;
  const user_name = `${user_data.firstName} ${user_data.lastName}`;
  const user_email = user_data.email;
  const user_number = user_data.phoneNo || 987654321;
  const video_url = strategy_data.creatives;
  const video_duration = strategy_data.duration || '06';

  const video_name = `${user_name} ${video_url.split('/').pop()}`;
  

  let options = new chrome.Options();
  // let driver = await new Builder().forBrowser('MicrosoftEdge').build();

  options.addArguments('--headless');
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    await driver.get(url);

    // Wait for the username input field to be present and enter the username
    let usernameField = await driver.wait(
      until.elementLocated(By.name("username")),
      10000
    );
    await usernameField.sendKeys(username);

    // Wait for the password input field to be present and enter the password
    let passwordField = await driver.wait(
      until.elementLocated(By.name("password")),
      10000
    );
    await passwordField.sendKeys(password);

    // Find and click the login button
    let loginButton = await driver.wait(
      until.elementLocated(By.id("login")),
      10000
    );
    await driver.wait(until.elementIsEnabled(loginButton), 10000);
    await loginButton.click();
    await console.log("Login Succesfully");


    await driver.get("https://console.revive-adserver.net/advertiser-campaigns.php");

    let spanElement = await driver.findElement(By.css('span ul li.inlineIcon.iconAdvertiser'));
    await spanElement.click();
    let activeUl = await driver.wait(until.elementLocated(By.css('ul.active')), 10000);

    // Get all <li> elements inside the active <ul>
    let liElements = await activeUl.findElements(By.css('li'));

    // Extract title values and check for "Shibu Gope"
    let found = false;
    for (let li of liElements) {
        let aElement = await li.findElement(By.css('a.inlineIcon.iconAdvertiser'));
        let title = await aElement.getAttribute('title');

        if (title === user_name) {
            found = true;
            console.log(`Found ${user_name}`);
            aElement.click();
            break;
        }
    }
    if(!found){
      await driver.get("https://console.revive-adserver.net/advertiser-edit.php");

   
        await driver.findElement(By.id("clientname")).clear();
        await driver.findElement(By.id("clientname")).sendKeys(user_name);
        await driver.findElement(By.id("contact")).sendKeys(user_number?user_number:"123456789");
        await driver.findElement(By.id("email")).sendKeys(user_email);

        // Find the submit button and click it
        await driver.findElement(By.id("submit")).click();

        await console.log("Advertiser created Succesfully"); 
       
        let linkElement = await driver.wait(until.elementLocated(By.linkText('add a campaign')), 10000);

        await linkElement.click();
    }else{
      await driver.sleep(1000);
      await driver.findElement(By.css("a.inlineIcon.iconCampaignAdd")).click();
    }

    await driver.sleep(1000);
    let campaignNameInput = await driver.findElement(By.id("campaignname"));
    await campaignNameInput.clear();
    await campaignNameInput.sendKeys(campaignName);
    // Click on the first radio button
    await driver.findElement(By.id("priority-e")).click();
    await driver.sleep(1000);
    // Click on the second radio button
    await driver.findElement(By.id("startSet_specific")).click();

    // Enter a value in the start date input field
    await driver.findElement(By.id("start")).sendKeys(convertDateMode(startDate));

    // Click on the third radio button
    await driver.findElement(By.id("endSet_specific")).click();

    // Enter a value in the end date input field
    // await driver.findElement(By.id("end")).sendKeys('17 August 2024');
    await driver.findElement(By.id("end")).sendKeys(convertDateMode(endDate));

    // Enter a value in the revenue input field
    await driver.findElement(By.id("revenue")).sendKeys(campaignBudget?campaignBudget:100);

    await driver.findElement(By.id("weight")).clear();
    await driver.findElement(By.id("weight")).sendKeys("100");

    // Click the submit button
    await driver.findElement(By.id("submit")).click();

    await console.log("Campaign Created Succesfully");
    try {
       let linkElement = await driver.wait(until.elementLocated(By.linkText('add a banner')), 10000);
       await linkElement.click();
    } catch (error) {
      await driver.get(
      "https://console.revive-adserver.net/campaign-banners.php");
       await driver.sleep(1000);
      await driver.findElement(By.css("a.inlineIcon.iconBannerAdd")).click();

      // Wait for the new page to load
     
    }
   
    await driver.sleep(1000);

    

    // Select "Inline Video Ad (pre/mid/post-roll)" from the dropdown
    let selectElement = await driver.findElement(By.name("type"));
    await selectElement.sendKeys("Inline Video Ad (pre/mid/post-roll)");

    // Wait for the form to submit and reload
    await driver.sleep(1000);

    // Fill out the form
    await driver.findElement(By.id("description")).sendKeys(video_name);

    await driver
      .findElement(By.id("vast_video_filename"))
      .sendKeys(video_url);

    let vastVideoTypeSelect = await driver.findElement(
      By.id("vast_video_type")
    );
    await vastVideoTypeSelect.sendKeys("MP4");

    await driver.findElement(By.id("vast_video_duration")).sendKeys(video_duration);

    await driver
      .findElement(By.id("vast_video_clickthrough_url"))
      .sendKeys(video_url);

    // Submit the form
    await driver.findElement(By.id("submit")).click();
    await console.log("Banner Created Succesfully");

    await driver.get("https://console.revive-adserver.net//website-index.php");

    const website = await getWebsitesByUserId(user_id);
    
    await driver.sleep(1000);
    // for (let site of websites) {
      const websiteName = website[0].websiteName;
      const websiteContact = website[0].websiteContact||'0987654321';
      const websiteEmail = website[0].websiteEmail;
      const websitelink = website[0].websiteUrl;
      
      const rows = await driver.findElements(By.css('tbody tr'));
        let found_site = false;
        for (let row of rows) {
          try {
              // Wait for the link element to be present
              const linkElement = await row.findElement(By.css('a.inlineIcon.iconWebsite'));
              await driver.wait(until.elementIsVisible(linkElement), 5000);
      
              const linkUrl = await linkElement.getText();
      
              if (linkUrl === websiteName) {
                  found_site = true;
                  const addNewZoneLink = await row.findElement(By.css('a.inlineIcon.iconZoneAdd'));
                  await driver.wait(until.elementIsVisible(addNewZoneLink), 5000);
                  await addNewZoneLink.click();
                  console.log(`Clicked 'Add new zone' for ${websiteUrl}`);
                  break;
              }
          } catch (error) {
              
          }
      }
    // }
   

    if (!found_site) {
        await driver.findElement(By.css("a.inlineIcon.iconWebsiteAdd")).click();
        await driver.findElement(By.id("name")).sendKeys(websiteName);
        await driver 
          .findElement(By.id("website"))
          .sendKeys(websitelink);
        
        await driver.findElement(By.id("contact")).sendKeys(websiteContact);
        await driver.findElement(By.id("email")).sendKeys(websiteEmail);
        await driver.findElement(By.id("save")).click();

        await console.log("Website Created Succesfully");
        let zone = await driver.wait(until.elementLocated(By.linkText('add a zone')), 10000);
         await zone.click();
    }
    
    // await driver.get("https://console.revive-adserver.net/affiliate-zones.php");
    // await driver.findElement(By.css("a.inlineIcon.iconZoneAdd")).click();
    await driver.sleep(1000);
    // const zone_ele = await driver.findElement(By.id("zonename"));
    // const zone_name =await zone_ele.getAttribute('value');

    await driver.findElement(By.id("delivery-vi")).click();
    await driver.findElement(By.id("submit")).click();
    await driver.sleep(1000);

    // Click the last element with class 'inlineIcon iconZoneLinked'
    const elements = await driver.findElements(
      By.css("a.inlineIcon.iconZoneLinked")
    );
    if (elements.length > 0) {
      await elements[elements.length - 1].click();
    }
    // Select the last option from the 'clientid' dropdown
    // let clientidSelect = await driver.findElement(By.name("clientid"));
    
    // let clientidOptions = await clientidSelect.findElements(
    //   By.tagName("option")
    // );
    // if (clientidOptions.length > 0) {
    //   await clientidOptions[clientidOptions.length - 1].click();
    // }
    let dropdownElement = await driver.wait(until.elementLocated(By.name('clientid')), 10000);

    // Create a Select instance
    let select = new Select(dropdownElement);

    // Select the option by visible text
    await select.selectByVisibleText(user_name); 

    // Wait for the form to submit and reload (if necessary)
    await driver.sleep(2000);
 
    // Select the last option from the 'campaignid' dropdown
    let campaignidSelect = await driver.findElement(By.name("campaignid"));
    let campaignidOptions = await campaignidSelect.findElements(
      By.tagName("option")
    );
    if (campaignidOptions.length > 0) {
      await campaignidOptions[campaignidOptions.length - 1].click();
    }

    // Wait for the form to update based on the selection (if necessary)
    await driver.sleep(1000);

    // Click the submit image button
    await driver.findElement(By.id("link_submit")).click();
    await driver.sleep(1000);

    await driver.findElement(By.linkText("VAST2 Invocation Code")).click();

    await driver.sleep(1000);

    let textareaElement = await driver.wait(
      until.elementLocated(By.css("textarea.code-gray")),
      10000
    );
    let textareaValue = await textareaElement.getText();
    console.log("Textarea Value:", textareaValue);

    return textareaValue;
  } finally {
    await driver.quit();
  }
}

export { openPage };

