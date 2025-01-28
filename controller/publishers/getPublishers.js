import Publishermodel from "../../models/Publisher.js";
import PublisherWebsite from "../../models/PublisherWebsite.js";

export default async (req, res) => {
  try {
    console.log("Fetching publishers...");

    // Check if there are any websites in the database
    const websiteCount = await PublisherWebsite.countDocuments();
    console.log("Total websites in database:", websiteCount);

    // Find a sample website to check its structure
    const sampleWebsite = await PublisherWebsite.findOne();
    console.log("Sample website:", JSON.stringify(sampleWebsite, null, 2));

    const publishers = await Publishermodel.aggregate([
      {
        $lookup: {
          from: PublisherWebsite.collection.name,
          localField: "publisherId",
          foreignField: "publisherId",
          as: "websites",
        },
      },
      {
        $project: {
          _id: 1,
          publisherId: 1,
          publisherName: 1,
          status: 1,
          websites: {
            $map: {
              input: "$websites",
              as: "website",
              in: {
                websiteId: "$$website._id",
                name: "$$website.name",
                url: "$$website.url",
                status: "$$website.status",
              },
            },
          },
        },
      },
    ]);

    console.log("Publishers fetched:", JSON.stringify(publishers, null, 2));

    const publishersWithWebsites = publishers.filter(
      (p) => p.websites.length > 0
    );
    console.log("Publishers with websites:", publishersWithWebsites.length);

    res.status(200).json(publishers);
  } catch (error) {
    console.error("Error fetching publishers:", error);
    res
      .status(500)
      .json({ message: "Error fetching publishers", error: error.message });
  }
};
