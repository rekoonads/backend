import AudiencePriorityQueues from '../PriorityQ/audiencePriorityQueues.js';

export default async (req, res) => {
    const contentType = "Arts & Entertainment"||req.query.type;
  
    if (!contentType) {
      return res.status(400).json({ error: 'Missing content type parameter' });
    }
  
    try {
      const topAdvertiser = await AudiencePriorityQueues.getTopAdvertiserByAudiencemedia(contentType);
  
      if (topAdvertiser) {
        console.log(topAdvertiser);
        res.json(topAdvertiser);
      } else {
        res.status(404).json({ message: `No ads found for content type: ${contentType}` });
      }
    } catch (err) {
      console.error('Error getting top advertiser:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
