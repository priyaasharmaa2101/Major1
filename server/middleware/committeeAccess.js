export const OWNER_MESSAGE = 'Only the admin who created this committee can manage it.';

/** True only when `user` is the admin who created `committee`. */
export function isCommitteeOwner(committee, user) {
  if (!committee || !committee.createdBy || !user) return false;
  const ownerId = committee.createdBy._id || committee.createdBy;
  return String(ownerId) === String(user._id);
}
/** Owner OR an accepted co-admin. */
export function isCommitteeManager(committee, user) {
  if (isCommitteeOwner(committee, user)) return true;
  return Boolean(
    user &&
      committee?.collaborators?.some(
        (x) => x.status === 'Accepted' && x.email === user.email
      )
  );
}