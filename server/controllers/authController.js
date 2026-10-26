import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

function issueToken(account) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured.');
  return jwt.sign({ sub: account._id.toString(), role: account.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
}
function publicUser(account) {
  return { id: account._id, name: account.name, email: account.email,
    rollNo: account.rollNo || account.adminId || '', adminId: account.adminId || account.rollNo || '',
    role: account.role };
}
export async function signup(req, res) {
  try {
    const { name, email, password, rollNo = '', role = 'student', adminSetupKey } = req.body;
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must contain at least 8 characters.' });
    const normalizedEmail = email.trim().toLowerCase();
    const requestedRole = role === 'admin' ? 'admin' : 'student';
    if (requestedRole === 'admin' && (!process.env.ADMIN_SETUP_KEY || adminSetupKey !== process.env.ADMIN_SETUP_KEY))
      return res.status(403).json({ message: 'Admin setup key is missing or incorrect.' });
    const [studentExists, adminExists] = await Promise.all([User.exists({ email: normalizedEmail }), Admin.exists({ email: normalizedEmail })]);
    if (studentExists || adminExists) return res.status(409).json({ message: 'An account with this email already exists.' });
    const passwordHash = await bcrypt.hash(password, 12);
    const account = requestedRole === 'admin'
      ? await Admin.create({ name: name.trim(), email: normalizedEmail, passwordHash, adminId: String(rollNo).trim(), department: 'Campus Administration', role: 'admin' })
      : await User.create({ name: name.trim(), email: normalizedEmail, passwordHash, rollNo: String(rollNo).trim(), role: 'student' });
    return res.status(201).json({ message: 'Account created successfully.', token: issueToken(account), user: publicUser(account) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' });
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Unable to create account. Check server configuration and MongoDB connection.' });
  }
}
export async function login(req, res) {
  try {
    const { email, password, role = 'student' } = req.body;
    if (!email?.trim() || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const normalizedEmail = email.trim().toLowerCase();
    const account = role === 'admin'
      ? await Admin.findOne({ email: normalizedEmail }).select('+passwordHash')
      : await User.findOne({ email: normalizedEmail }).select('+passwordHash');
    if (!account || !(await bcrypt.compare(password, account.passwordHash)))
      return res.status(401).json({ message: 'Invalid email or password for the selected account type.' });
    return res.json({ message: 'Login successful.', token: issueToken(account), user: publicUser(account) });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Unable to sign in. Check server configuration and MongoDB connection.' });
  }
}
