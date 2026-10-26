import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function issueToken(user) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
}
function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, rollNo: user.rollNo, role: user.role };
}

export async function signup(req, res) {
  try {
    const { name, email, password, rollNo = '' } = req.body;
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must contain at least 8 characters.' });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const passwordHash = await bcrypt.hash(password, 12);
    // Public signup always creates a student. Admins must be provisioned privately in the database.
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash, rollNo: String(rollNo).trim(), role: 'student' });
    return res.status(201).json({ token: issueToken(user), user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' });
    console.error('Signup error:', error.message);
    return res.status(500).json({ message: 'Unable to create account right now.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password, role = 'student' } = req.body;
    if (!email?.trim() || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Invalid email or password.' });
    if (!['student', 'admin'].includes(role) || user.role !== role) return res.status(403).json({ message: `This account is not registered as ${role}. Choose the correct login option.` });
    return res.json({ token: issueToken(user), user: publicUser(user) });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Unable to sign in right now.' });
  }
}
