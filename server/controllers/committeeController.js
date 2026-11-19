
// // import { randomUUID } from 'crypto';
// // import Committee from '../models/Committee.js';
// // import Application from '../models/Application.js';
// // import { isCommitteeOwner, isCommitteeManager, OWNER_MESSAGE } from '../middleware/committeeAccess.js';
// // import Admin from '../models/Admin.js';
// // // Get all committees
// // export async function getCommittees(req, res) {
// //   try {
// //    const committees = await Committee.find().populate('createdBy', 'email name').sort({ createdAt: -1 });
// //         const isAdmin = req.user?.role === 'admin';
// //     return res.json({
// //       committees: committees.map((c) => {
// //         const o = c.toObject();
// //         if (!isAdmin) delete o.collaborators;
// //         return o;
// //       }),
// //     });
// //   } catch (error) {
// //     return res.status(500).json({ message: 'Unable to fetch committees.' });
// //   }
// // }

// // // Get one committee
// // export async function getCommittee(req, res) {
// //   try {
// //     const committee = await Committee.findOne({ id: req.params.id }).populate('createdBy', 'email name');
// //     if (!committee) {
// //       return res.status(404).json({ message: 'Committee not found.' });
// //     }

// //     return res.json({ committee });
// //   } catch (error) {
// //     return res.status(500).json({ message: 'Unable to fetch committee.' });
// //   }
// // }

// // // Create committee
// // export async function createCommittee(req, res) {
// //   try {
// //     const {
// //       name, tag, lead, role, deadline,
// //       minCgpa, requiredBranch, vacancies,
// //       hiringOpen, description
// //     } = req.body;

// //     if (!name?.trim()) {
// //       return res.status(400).json({ message: 'Committee name is required.' });
// //     }

// //     const committee = await Committee.create({
// //       id: randomUUID(),
// //       name: name.trim(),
// //       tag, lead, role, deadline,
// //       minCgpa, requiredBranch, vacancies,
// //       hiringOpen, description,
// //       createdBy: req.user._id
// //     });

// //     return res.status(201).json({
// //       message: 'Committee created successfully.',
// //       committee
// //     });
// //   } catch (error) {
// //     console.error('Create committee error:', error);
// //     return res.status(500).json({ message: 'Unable to create committee.' });
// //   }
// // }

// // // Update committee

// // export async function updateCommittee(req, res) {
// //   try {
// //     const allowedFields = [
// //       'name',
// //       'tag',
// //       'lead',
// //       'role',
// //       'deadline',
// //       'minCgpa',
// //       'requiredBranch',
// //       'vacancies',
// //       'hiringOpen',
// //       'description'
// //     ];

// //     const updates = {};

// //     for (const field of allowedFields) {
// //       if (req.body[field] !== undefined) {
// //         updates[field] = req.body[field];
// //       }
// //     }

// //     if (Object.keys(updates).length === 0) {
// //       return res.status(400).json({
// //         message: 'No valid fields provided for update.'
// //       });
// //     }
// //     const existing = await Committee.findOne({ id: req.params.id });
// //     if (!existing) return res.status(404).json({ message: 'Committee not found.' });
// //     if (!isCommitteeManager(existing, req.user)) return res.status(403).json({ message: OWNER_MESSAGE });
// //     const committee = await Committee.findOneAndUpdate(
// //       { id: req.params.id },
// //       { $set: updates },
// //       { new: true, runValidators: true }
// //     );

// //     if (!committee) {
// //       return res.status(404).json({
// //         message: 'Committee not found.'
// //       });
// //     }

// //     return res.json({
// //       message: 'Committee updated successfully.',
// //       committee
// //     });
// //   } catch (error) {
// //     console.error('Update committee error:', error);
// //     return res.status(500).json({
// //       message: 'Unable to update committee.'
// //     });
// //   }
// // }


// // // Delete committee
// // export async function deleteCommittee(req, res) {
// //   try {
// //         const existing = await Committee.findOne({ id: req.params.id });
// //     if (!existing) return res.status(404).json({ message: 'Committee not found.' });
// //     if (!isCommitteeOwner(existing, req.user)) return res.status(403).json({ message: OWNER_MESSAGE });
// //     const committee = await Committee.findOneAndDelete({ id: req.params.id });

// //     if (!committee) {
// //       return res.status(404).json({ message: 'Committee not found.' });
// //     }
// //         await Application.deleteMany({ committeeId: req.params.id });

// //     return res.json({ message: 'Committee deleted successfully.' });
// //   } catch (error) {
// //     return res.status(500).json({ message: 'Unable to delete committee.' });
// //   }
// // }
// // const isOwner = (c, u) => String(c.createdBy) === String(u._id);

// // // Lead invites another registered admin
// // export async function inviteCollaborator(req, res) {
// //   try {
// //     const committee = await Committee.findOne({ id: req.params.id });
// //     if (!committee) return res.status(404).json({ message: 'Committee not found.' });
// //     if (!isOwner(committee, req.user)) {
// //       return res.status(403).json({ message: 'Only the committee lead can invite co-admins.' });
// //     }
// //     const email = String(req.body.email || '').trim().toLowerCase();
// //     if (!email) return res.status(400).json({ message: 'Email is required.' });
// //     if (email === req.user.email) return res.status(400).json({ message: 'You are already the lead.' });

// //     const admin = await Admin.findOne({ email });
// //     if (!admin) {
// //       return res.status(404).json({ message: 'No admin account with this email. Ask them to sign up as an admin first.' });
// //     }
// //     if (committee.collaborators.some((c) => c.email === email)) {
// //       return res.status(409).json({ message: 'This admin is already invited.' });
// //     }
// //     committee.collaborators.push({ email, name: admin.name, status: 'Pending', invitedBy: req.user.name });
// //     await committee.save();
// //     return res.status(201).json({ committee });
// //   } catch (error) {
// //     console.error('Invite error:', error);
// //     return res.status(500).json({ message: 'Unable to send invite.' });
// //   }
// // }

// // // Lead removes anyone; a co-admin can remove themselves
// // export async function removeCollaborator(req, res) {
// //   try {
// //     const committee = await Committee.findOne({ id: req.params.id });
// //     if (!committee) return res.status(404).json({ message: 'Committee not found.' });
// //     const email = decodeURIComponent(req.params.email).toLowerCase();
// //     if (!isOwner(committee, req.user) && email !== req.user.email) {
// //       return res.status(403).json({ message: 'You cannot remove this co-admin.' });
// //     }
// //     committee.collaborators = committee.collaborators.filter((c) => c.email !== email);
// //     await committee.save();
// //     return res.json({ committee });
// //   } catch (error) {
// //     return res.status(500).json({ message: 'Unable to remove co-admin.' });
// //   }
// // }

// // // Invited admin accepts or rejects (only their own invite)
// // export async function respondToInvite(req, res) {
// //   try {
// //     const committee = await Committee.findOne({ id: req.params.id });
// //     if (!committee) return res.status(404).json({ message: 'Committee not found.' });
// //     const invite = committee.collaborators.find((c) => c.email === req.user.email && c.status === 'Pending');
// //     if (!invite) return res.status(404).json({ message: 'No pending invite for you on this committee.' });
// //     if (req.body.accept) {
// //       invite.status = 'Accepted';
// //       invite.name = req.user.name;
// //     } else {
// //       committee.collaborators = committee.collaborators.filter((c) => c !== invite);
// //     }
// //     await committee.save();
// //     return res.json({ committee });
// //   } catch (error) {
// //     return res.status(500).json({ message: 'Unable to respond to invite.' });
// //   }
// // }

// import { randomUUID } from 'crypto';
// import Committee from '../models/Committee.js';
// import Application from '../models/Application.js';
// import { isCommitteeOwner, isCommitteeManager, OWNER_MESSAGE } from '../middleware/committeeAccess.js';
// import Admin from '../models/Admin.js';
// import User from '../models/User.js';
// // Get all committees
// export async function getCommittees(req, res) {
//   try {
//    const committees = await Committee.find().populate('createdBy', 'email name').sort({ createdAt: -1 });
//         const isAdmin = req.user?.role === 'admin';
//     return res.json({
//       committees: committees.map((c) => {
//         const o = c.toObject();
//         if (!isAdmin) delete o.collaborators;
//         return o;
//       }),
//     });
//   } catch (error) {
//     return res.status(500).json({ message: 'Unable to fetch committees.' });
//   }
// }

// // Get one committee
// export async function getCommittee(req, res) {
//   try {
//     const committee = await Committee.findOne({ id: req.params.id }).populate('createdBy', 'email name');
//     if (!committee) {
//       return res.status(404).json({ message: 'Committee not found.' });
//     }

//     return res.json({ committee });
//   } catch (error) {
//     return res.status(500).json({ message: 'Unable to fetch committee.' });
//   }
// }

// // Create committee
// export async function createCommittee(req, res) {
//   try {
//     const {
//       name, tag, lead, role, deadline,
//       minCgpa, requiredBranch, vacancies,
//       hiringOpen, description
//     } = req.body;

//     if (!name?.trim()) {
//       return res.status(400).json({ message: 'Committee name is required.' });
//     }

//     const committee = await Committee.create({
//       id: randomUUID(),
//       name: name.trim(),
//       tag, lead, role, deadline,
//       minCgpa, requiredBranch, vacancies,
//       hiringOpen, description,
//       createdBy: req.user._id
//     });

//     return res.status(201).json({
//       message: 'Committee created successfully.',
//       committee
//     });
//   } catch (error) {
//     console.error('Create committee error:', error);
//     return res.status(500).json({ message: 'Unable to create committee.' });
//   }
// }

// // Update committee

// export async function updateCommittee(req, res) {
//   try {
//     const allowedFields = [
//       'name',
//       'tag',
//       'lead',
//       'role',
//       'deadline',
//       'minCgpa',
//       'requiredBranch',
//       'vacancies',
//       'hiringOpen',
//       'description'
//     ];

//     const updates = {};

//     for (const field of allowedFields) {
//       if (req.body[field] !== undefined) {
//         updates[field] = req.body[field];
//       }
//     }

//     if (Object.keys(updates).length === 0) {
//       return res.status(400).json({
//         message: 'No valid fields provided for update.'
//       });
//     }
//     const existing = await Committee.findOne({ id: req.params.id });
//     if (!existing) return res.status(404).json({ message: 'Committee not found.' });
//     if (!isCommitteeManager(existing, req.user)) return res.status(403).json({ message: OWNER_MESSAGE });
//     const committee = await Committee.findOneAndUpdate(
//       { id: req.params.id },
//       { $set: updates },
//       { new: true, runValidators: true }
//     );

//     if (!committee) {
//       return res.status(404).json({
//         message: 'Committee not found.'
//       });
//     }

//     return res.json({
//       message: 'Committee updated successfully.',
//       committee
//     });
//   } catch (error) {
//     console.error('Update committee error:', error);
//     return res.status(500).json({
//       message: 'Unable to update committee.'
//     });
//   }
// }


// // Delete committee
// export async function deleteCommittee(req, res) {
//   try {
//         const existing = await Committee.findOne({ id: req.params.id });
//     if (!existing) return res.status(404).json({ message: 'Committee not found.' });
//     if (!isCommitteeOwner(existing, req.user)) return res.status(403).json({ message: OWNER_MESSAGE });
//     const committee = await Committee.findOneAndDelete({ id: req.params.id });

//     if (!committee) {
//       return res.status(404).json({ message: 'Committee not found.' });
//     }
//         await Application.deleteMany({ committeeId: req.params.id });

//     return res.json({ message: 'Committee deleted successfully.' });
//   } catch (error) {
//     return res.status(500).json({ message: 'Unable to delete committee.' });
//   }
// }
// const isOwner = (c, u) => String(c.createdBy) === String(u._id);

// // Shared check: the email must belong to a registered faculty/admin account.
// // Returns { admin } on success or { status, message } on failure.
// async function findInvitableAdmin(rawEmail, currentUser) {
//   const email = String(rawEmail || '').trim().toLowerCase();
//   if (!email) return { status: 400, message: 'Email is required.' };
//   if (email === currentUser.email) return { status: 400, message: 'You are already the lead.' };

//   const admin = await Admin.findOne({ email });
//   if (admin) return { admin };

//   const isStudent = await User.exists({ email });
//   return {
//     status: 404,
//     message: isStudent
//       ? 'This email belongs to a student account. Only faculty/admin accounts can be added.'
//       : 'This email does not exist.',
//   };
// }

// // Pre-check used by the UI before an email is added to the invite list
// export async function lookupCollaborator(req, res) {
//   try {
//     const result = await findInvitableAdmin(req.query.email, req.user);
//     if (!result.admin) return res.status(result.status).json({ message: result.message });
//     return res.json({ email: result.admin.email, name: result.admin.name });
//   } catch (error) {
//     console.error('Lookup collaborator error:', error);
//     return res.status(500).json({ message: 'Unable to verify email.' });
//   }
// }

// // Lead invites another registered admin
// export async function inviteCollaborator(req, res) {
//   try {
//     const committee = await Committee.findOne({ id: req.params.id });
//     if (!committee) return res.status(404).json({ message: 'Committee not found.' });
//     if (!isOwner(committee, req.user)) {
//       return res.status(403).json({ message: 'Only the committee lead can invite co-admins.' });
//     }
//     const result = await findInvitableAdmin(req.body.email, req.user);
//     if (!result.admin) return res.status(result.status).json({ message: result.message });
//     const admin = result.admin;
//     const email = admin.email;
//     if (committee.collaborators.some((c) => c.email === email)) {
//       return res.status(409).json({ message: 'This admin is already invited.' });
//     }
//     committee.collaborators.push({ email, name: admin.name, status: 'Pending', invitedBy: req.user.name });
//     await committee.save();
//     return res.status(201).json({ committee });
//   } catch (error) {
//     console.error('Invite error:', error);
//     return res.status(500).json({ message: 'Unable to send invite.' });
//   }
// }

// // Lead removes anyone; a co-admin can remove themselves
// export async function removeCollaborator(req, res) {
//   try {
//     const committee = await Committee.findOne({ id: req.params.id });
//     if (!committee) return res.status(404).json({ message: 'Committee not found.' });
//     const email = decodeURIComponent(req.params.email).toLowerCase();
//     if (!isOwner(committee, req.user) && email !== req.user.email) {
//       return res.status(403).json({ message: 'You cannot remove this co-admin.' });
//     }
//     committee.collaborators = committee.collaborators.filter((c) => c.email !== email);
//     await committee.save();
//     return res.json({ committee });
//   } catch (error) {
//     return res.status(500).json({ message: 'Unable to remove co-admin.' });
//   }
// }

// // Invited admin accepts or rejects (only their own invite)
// export async function respondToInvite(req, res) {
//   try {
//     const committee = await Committee.findOne({ id: req.params.id });
//     if (!committee) return res.status(404).json({ message: 'Committee not found.' });
//     const invite = committee.collaborators.find((c) => c.email === req.user.email && c.status === 'Pending');
//     if (!invite) return res.status(404).json({ message: 'No pending invite for you on this committee.' });
//     if (req.body.accept) {
//       invite.status = 'Accepted';
//       invite.name = req.user.name;
//     } else {
//       committee.collaborators = committee.collaborators.filter((c) => c !== invite);
//     }
//     await committee.save();
//     return res.json({ committee });
//   } catch (error) {
//     return res.status(500).json({ message: 'Unable to respond to invite.' });
//   }
// }

import { randomUUID } from 'crypto';
import Committee from '../models/Committee.js';
import Application from '../models/Application.js';
import { isCommitteeOwner, isCommitteeManager, OWNER_MESSAGE } from '../middleware/committeeAccess.js';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import { notify, adminAudience } from './notificationController.js';
// Get all committees
export async function getCommittees(req, res) {
  try {
   const committees = await Committee.find().populate('createdBy', 'email name').sort({ createdAt: -1 });
        const isAdmin = req.user?.role === 'admin';
    return res.json({
      committees: committees.map((c) => {
        const o = c.toObject();
        if (!isAdmin) delete o.collaborators;
        return o;
      }),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch committees.' });
  }
}

// Get one committee
export async function getCommittee(req, res) {
  try {
    const committee = await Committee.findOne({ id: req.params.id }).populate('createdBy', 'email name');
    if (!committee) {
      return res.status(404).json({ message: 'Committee not found.' });
    }

    return res.json({ committee });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch committee.' });
  }
}

// Create committee
export async function createCommittee(req, res) {
  try {
    const {
      name, tag, lead, role, deadline,
      minCgpa, requiredBranch, vacancies,
      hiringOpen, description
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: 'Committee name is required.' });
    }

    const committee = await Committee.create({
      id: randomUUID(),
      name: name.trim(),
      tag, lead, role, deadline,
      minCgpa, requiredBranch, vacancies,
      hiringOpen, description,
      createdBy: req.user._id
    });

    return res.status(201).json({
      message: 'Committee created successfully.',
      committee
    });
  } catch (error) {
    console.error('Create committee error:', error);
    return res.status(500).json({ message: 'Unable to create committee.' });
  }
}

// Update committee

export async function updateCommittee(req, res) {
  try {
    const allowedFields = [
      'name',
      'tag',
      'lead',
      'role',
      'deadline',
      'minCgpa',
      'requiredBranch',
      'vacancies',
      'hiringOpen',
      'description'
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: 'No valid fields provided for update.'
      });
    }
    const existing = await Committee.findOne({ id: req.params.id });
    if (!existing) return res.status(404).json({ message: 'Committee not found.' });
    if (!isCommitteeManager(existing, req.user)) return res.status(403).json({ message: OWNER_MESSAGE });
    const committee = await Committee.findOneAndUpdate(
      { id: req.params.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!committee) {
      return res.status(404).json({
        message: 'Committee not found.'
      });
    }

    return res.json({
      message: 'Committee updated successfully.',
      committee
    });
  } catch (error) {
    console.error('Update committee error:', error);
    return res.status(500).json({
      message: 'Unable to update committee.'
    });
  }
}


// Delete committee
export async function deleteCommittee(req, res) {
  try {
        const existing = await Committee.findOne({ id: req.params.id });
    if (!existing) return res.status(404).json({ message: 'Committee not found.' });
    if (!isCommitteeOwner(existing, req.user)) return res.status(403).json({ message: OWNER_MESSAGE });
    const committee = await Committee.findOneAndDelete({ id: req.params.id });

    if (!committee) {
      return res.status(404).json({ message: 'Committee not found.' });
    }
        await Application.deleteMany({ committeeId: req.params.id });

    return res.json({ message: 'Committee deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete committee.' });
  }
}
const isOwner = (c, u) => String(c.createdBy) === String(u._id);

// Shared check: the email must belong to a registered faculty/admin account.
// Returns { admin } on success or { status, message } on failure.
async function findInvitableAdmin(rawEmail, currentUser) {
  const email = String(rawEmail || '').trim().toLowerCase();
  if (!email) return { status: 400, message: 'Email is required.' };
  if (email === currentUser.email) return { status: 400, message: 'You are already the lead.' };

  const admin = await Admin.findOne({ email });
  if (admin) return { admin };

  const isStudent = await User.exists({ email });
  return {
    status: 404,
    message: isStudent
      ? 'This email belongs to a student account. Only faculty/admin accounts can be added.'
      : 'This email does not exist.',
  };
}

// Pre-check used by the UI before an email is added to the invite list
export async function lookupCollaborator(req, res) {
  try {
    const result = await findInvitableAdmin(req.query.email, req.user);
    if (!result.admin) return res.status(result.status).json({ message: result.message });
    return res.json({ email: result.admin.email, name: result.admin.name });
  } catch (error) {
    console.error('Lookup collaborator error:', error);
    return res.status(500).json({ message: 'Unable to verify email.' });
  }
}

// Lead invites another registered admin
export async function inviteCollaborator(req, res) {
  try {
    const committee = await Committee.findOne({ id: req.params.id });
    if (!committee) return res.status(404).json({ message: 'Committee not found.' });
    if (!isOwner(committee, req.user)) {
      return res.status(403).json({ message: 'Only the committee lead can invite co-admins.' });
    }
    const result = await findInvitableAdmin(req.body.email, req.user);
    if (!result.admin) return res.status(result.status).json({ message: result.message });
    const admin = result.admin;
    const email = admin.email;
    if (committee.collaborators.some((c) => c.email === email)) {
      return res.status(409).json({ message: 'This admin is already invited.' });
    }
    committee.collaborators.push({ email, name: admin.name, status: 'Pending', invitedBy: req.user.name });
    await committee.save();

    // Tell the invited admin (shows in their bell + Committees tab with Accept/Reject)
    await notify(
      adminAudience(email),
      `${req.user.name} invited you to join ${committee.name} as a co-admin. Open Committees to accept or reject.`,
      'info'
    );
    return res.status(201).json({ committee });
  } catch (error) {
    console.error('Invite error:', error);
    return res.status(500).json({ message: 'Unable to send invite.' });
  }
}

// Lead removes anyone; a co-admin can remove themselves
export async function removeCollaborator(req, res) {
  try {
    const committee = await Committee.findOne({ id: req.params.id });
    if (!committee) return res.status(404).json({ message: 'Committee not found.' });
    const email = decodeURIComponent(req.params.email).toLowerCase();
    if (!isOwner(committee, req.user) && email !== req.user.email) {
      return res.status(403).json({ message: 'You cannot remove this co-admin.' });
    }
    committee.collaborators = committee.collaborators.filter((c) => c.email !== email);
    await committee.save();
    return res.json({ committee });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to remove co-admin.' });
  }
}

// Invited admin accepts or rejects (only their own invite)
export async function respondToInvite(req, res) {
  try {
    const committee = await Committee.findOne({ id: req.params.id });
    if (!committee) return res.status(404).json({ message: 'Committee not found.' });
    const invite = committee.collaborators.find((c) => c.email === req.user.email && c.status === 'Pending');
    if (!invite) return res.status(404).json({ message: 'No pending invite for you on this committee.' });
    if (req.body.accept) {
      invite.status = 'Accepted';
      invite.name = req.user.name;
    } else {
      committee.collaborators = committee.collaborators.filter((c) => c !== invite);
    }
    await committee.save();

    // Let the lead know what the invited admin decided
    try {
      const lead = await Admin.findById(committee.createdBy).select('email');
      if (lead?.email) {
        await notify(
          adminAudience(lead.email),
          `${req.user.name} ${req.body.accept ? 'accepted' : 'rejected'} your invite to ${committee.name}.`,
          req.body.accept ? 'good' : 'warn'
        );
      }
    } catch (e) {
      console.error('Invite response notify error:', e.message);
    }
    return res.json({ committee });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to respond to invite.' });
  }
}