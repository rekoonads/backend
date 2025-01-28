import Publisher from "../../models/Publisher.js";

export const createPublisher = async (req, res) => {
  try {
    const { publisherId, publisherName, email } = req.body;

    if (!publisherId || !publisherName || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let publisher = await Publisher.findOne({ createdBy: publisherId });

    if (publisher) {
      // If publisher exists, update the details
      publisher.publisherName = publisherName;
      publisher.email = email;
      await publisher.save();
    } else {
      // If publisher doesn't exist, create a new one
      publisher = new Publisher({
        publisherId,
        publisherName,
        email,
        createdBy: publisherId,
        status: "Pending",
      });
      await publisher.save();
    }

    res
      .status(200)
      .json({ message: "Publisher created/updated successfully", publisher });
  } catch (error) {
    console.error("Error creating/updating publisher:", error);
    res
      .status(500)
      .json({
        message: "Error creating/updating publisher",
        error: error.message,
      });
  }
};
