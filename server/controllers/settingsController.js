import Setting from '../models/Setting.js';

export const DEFAULT_SETTINGS = {
  autoScreening: true,
  autoSlot: true,
  autoSelect: true,
  autoPayment: true,
  autoEscalation: true,
  autoCloseHiring: true,
  slaHours: 48,
  selectionThreshold: 7,
  cohortSize: 50,
  weightAssessment: 60,
  weightInterview: 40,
};

export async function getSettingsValues() {
  const doc = await Setting.findOne({ key: 'global' });
  return { ...DEFAULT_SETTINGS, ...(doc?.values || {}) };
}

export async function getSettings(_req, res) {
  try {
    return res.json({ settings: await getSettingsValues() });
  } catch (error) {
    console.error('Get settings error:', error);
    return res.status(500).json({ message: 'Unable to fetch settings.' });
  }
}

export async function updateSettings(req, res) {
  try {
    const patch = {};
    for (const [key, def] of Object.entries(DEFAULT_SETTINGS)) {
      if (req.body[key] === undefined) continue;
      if (typeof def === 'boolean') {
        patch[`values.${key}`] = Boolean(req.body[key]);
      } else {
        const n = Number(req.body[key]);
        if (Number.isNaN(n) || n < 0) return res.status(400).json({ message: `Invalid value for ${key}.` });
        patch[`values.${key}`] = n;
      }
    }
    if (Object.keys(patch).length === 0) return res.status(400).json({ message: 'No valid settings provided.' });
    await Setting.findOneAndUpdate({ key: 'global' }, { $set: patch }, { upsert: true });
    return res.json({ settings: await getSettingsValues() });
  } catch (error) {
    console.error('Update settings error:', error);
    return res.status(500).json({ message: 'Unable to update settings.' });
  }
}