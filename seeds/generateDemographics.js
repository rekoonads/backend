// seeds/generateDemographics.js
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import Demographics from "../models/Demographics.js";
import "dotenv/config";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const generateDemographics = (count = 100) => {
  return Array.from({ length: count }, () => ({
    name: faker.person.fullName(),
    age: faker.number.int({ min: 18, max: 100 }),
    gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
    email: faker.internet.email(),
    location: {
      country: faker.location.country(),
      city: faker.location.city(),
      state: faker.location.state(),
    },
    interests: Array.from(
      { length: faker.number.int({ min: 1, max: 5 }) },
      () => faker.commerce.department()
    ),
    occupation: faker.person.jobTitle(),
    education: faker.helpers.arrayElement([
      "High School",
      "Bachelor",
      "Master",
      "PhD",
      "Other",
    ]),
    income_bracket: faker.helpers.arrayElement([
      "0-25k",
      "25k-50k",
      "50k-75k",
      "75k-100k",
      "100k+",
    ]),
    marital_status: faker.helpers.arrayElement([
      "Single",
      "Married",
      "Divorced",
      "Widowed",
    ]),
  }));
};

async function seedDemographics() {
  try {
    await connectDB();

    // Clear existing data (optional)
    await Demographics.deleteMany({});
    console.log("Existing demographics data cleared");

    // Generate new data
    const demographicsData = generateDemographics(1000);

    // Insert data
    await Demographics.insertMany(demographicsData);
    console.log("Demographics data seeded successfully!");
  } catch (error) {
    console.error("Error seeding demographics data:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

// Run the seeding function
seedDemographics();
