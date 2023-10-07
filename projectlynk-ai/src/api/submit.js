export default async (req, res) => {
    if (req.method === 'POST') {
      const bio = req.body.bio;
      // TODO: Process the bio and fetch matching projects
      res.status(200).json({ success: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });  // Only allow POST
    }
  };