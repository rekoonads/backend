import Publishermodel from "../../models/Publisher.js";
import PublisherWebsite from "../../models/PublisherWebsite.js";

const deletePublisher = async (req, res) => {
  try {
    const { publisherId } = req.params;

    // Delete the publisher
    const deletedPublisher = await Publishermodel.findOneAndDelete({
      publisherId,
    });

    if (!deletedPublisher) {
      return res.status(404).json({ message: "Publisher not found" });
    }

    // Delete all associated websites
    await PublisherWebsite.deleteMany({ publisherId });

    res
      .status(200)
      .json({
        message: "Publisher and associated websites deleted successfully",
      });
  } catch (error) {
    console.error("Error deleting publisher:", error);
    res
      .status(500)
      .json({ message: "Error deleting publisher", error: error.message });
  }
};

export default deletePublisher;
