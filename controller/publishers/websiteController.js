import Publisher from "../../models/Publisher.js";
import PublisherWebsite from "../../models/PublisherWebsite.js";

export const addPublisherWebsite = async (req, res) => {
  try {
    const { publisherId } = req.params;
    const { name, url } = req.body;

    console.log("Request params:", { publisherId });
    console.log("Request body:", { name, url });

    // First, find the existing publisher by createdBy field (which contains the Clerk user ID)
    const publisher = await Publisher.findOne({ createdBy: publisherId });
    console.log("Publisher found:", publisher);

    if (!publisher) {
      console.log("No publisher found with createdBy:", publisherId);
      return res.status(404).json({
        message: "Publisher not found",
        details: "No publisher account found for this user",
      });
    }

    // Create new website document using the MongoDB _id
    const website = new PublisherWebsite({
      name,
      url,
      publisherId: publisher.publisherId,
      status: "Pending Review",
    });

    await website.save();
    console.log("Website saved successfully:", website);

    res.status(201).json({
      message: "Website added successfully",
      website,
    });
  } catch (error) {
    console.error("Error adding publisher website:", error);
    res.status(500).json({
      message: "Error adding publisher website",
      error: error.message,
    });
  }
};

export const getPublisherWebsites = async (req, res) => {
  try {
    const { publisherId } = req.params;

    // Find publisher first to get the correct publisherId
    const publisher = await Publisher.findOne({ createdBy: publisherId });

    if (!publisher) {
      return res.status(404).json({
        message: "Publisher not found",
        details: "No publisher account found for this user",
      });
    }

    const websites = await PublisherWebsite.find({
      publisherId: publisher.publisherId,
    });

    res.status(200).json(websites);
  } catch (error) {
    console.error("Error getting publisher websites:", error);
    res.status(500).json({
      message: "Error getting publisher websites",
      error: error.message,
    });
  }
};
