export const ROLES = {
  JOB_SEEKER: 'job_seeker',
  JOB_POSTER: 'job_poster',
};

export function normalizeRole(role) {
  return role === ROLES.JOB_POSTER ? ROLES.JOB_POSTER : ROLES.JOB_SEEKER;
}

export function canPostJobs(user) {
  return normalizeRole(user?.role) === ROLES.JOB_POSTER;
}
