import Publishermodel from "../../models/Publisher.js";
import PublisherWebsite from "../../models/PublisherWebsite.js";
import { sendEmail } from "../../utils/emailService.js";

const updatePublisherStatus = async (req, res) => {
  try {
    const { publisherId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Update publisher status
    const updatedPublisher = await Publishermodel.findOneAndUpdate(
      { publisherId },
      { status },
      { new: true }
    ).lean();

    if (!updatedPublisher) {
      return res.status(404).json({ message: "Publisher not found" });
    }

    console.log(
      "Updated Publisher:",
      JSON.stringify(updatedPublisher, null, 2)
    );

    // If publisher status is set to "Published", update all associated websites to "Active"
    if (status === "Published") {
      await PublisherWebsite.updateMany({ publisherId }, { status: "Active" });

      // Send approval email
      if (updatedPublisher.email) {
        try {
          console.log("Attempting to send email to:", updatedPublisher.email);
          const emailInfo = await sendEmail(
            updatedPublisher.email,
            updatedPublisher.publisherName
          );
          console.log("Email sent successfully:", emailInfo);
        } catch (emailError) {
          console.error("Failed to send approval email:", emailError);
        }
      } else {
        console.error("Publisher email is undefined");
      }
    }

    // Fetch updated websites
    const updatedWebsites = await PublisherWebsite.find({ publisherId });

    res
      .status(200)
      .json({ publisher: updatedPublisher, websites: updatedWebsites });
  } catch (error) {
    console.error("Error updating publisher status:", error);
    res.status(500).json({
      message: "Error updating publisher status",
      error: error.message,
    });
  }
};

export default updatePublisherStatus;
