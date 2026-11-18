import Candidate from '../models/Candidate.js';

const toClient = (c) => ({
  rollNo: c.rollNo,
  name: c.name,
  branch: c.branch,
  assessment: c.assessment,
  interview: c.interview,
});

// Any logged-in user can read the leaderboard data (same as before: students see the ranking).
export async function listCandidates(_req, res) {
  try {
    const candidates = await Candidate.find().sort({ createdAt: 1 });
    return res.json({ candidates: candidates.map(toClient) });
  } catch (error) {
    console.error('List candidates error:', error);
    return res.status(500).json({ message: 'Unable to fetch Super 50 candidates.' });
  }
}

// Admin: add a candidate or update their scores (upsert by roll number).
export async function saveCandidate(req, res) {
  try {
    const rollNo = String(req.params.rollNo || '').trim();
    const name = String(req.body.name || '').trim();
    const assessment = Number(req.body.assessment);
    const interview = Number(req.body.interview);

    if (!rollNo) return res.status(400).json({ message: 'Roll number is required.' });
    if (!name) return res.status(400).json({ message: 'Student name is required.' });
    if (Number.isNaN(assessment) || assessment < 0 || assessment > 100) {
      return res.status(400).json({ message: 'Assessment score must be between 0 and 100.' });
    }
    if (Number.isNaN(interview) || interview < 0 || interview > 10) {
      return res.status(400).json({ message: 'Interview score must be between 0 and 10.' });
    }

    const candidate = await Candidate.findOneAndUpdate(
      { rollNo },
      { $set: { name, branch: String(req.body.branch || '').trim(), assessment, interview } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    return res.json({ candidate: toClient(candidate) });
  } catch (error) {
    console.error('Save candidate error:', error);
    return res.status(500).json({ message: 'Unable to save candidate.' });
  }
}

export async function deleteCandidate(req, res) {
  try {
    await Candidate.deleteOne({ rollNo: String(req.params.rollNo || '').trim() });
    return res.json({ message: 'Candidate removed.' });
  } catch (error) {
    console.error('Delete candidate error:', error);
    return res.status(500).json({ message: 'Unable to remove candidate.' });
  }
}