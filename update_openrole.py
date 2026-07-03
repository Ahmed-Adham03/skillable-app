import re
import json

file_path = r'C:\Users\hyrhf\Desktop\skillable-app-main (3)\skillable-app-main\src\pages\OpenRoleDetailPage.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if 'useTranslation' not in content:
    content = content.replace('import { getAuthToken } from \'../auth/session\';', 'import { getAuthToken } from \'../auth/session\';\nimport { useTranslation } from \'react-i18next\';')

# Add hook
if 'const { t } = useTranslation();' not in content:
    content = content.replace('export default function OpenRoleDetailPage({ theme, themeMode, role, API_BASE, currentUser }) {', 'export default function OpenRoleDetailPage({ theme, themeMode, role, API_BASE, currentUser }) {\n  const { t } = useTranslation();')

# Replace strings
replacements = {
    "'Loading applicants...'": "t('openRoleDetails.loadingApplicants')",
    "'Unable to load applicants.'": "t('openRoleDetails.unableToLoadApplicants')",
    ">Select an open role to see the application pipeline.</p>": ">{t('openRoleDetails.selectRole')}</p>",
    ">Browse open roles</button>": ">{t('openRoleDetails.browseRoles')}</button>",
    "> Back to Open Roles</button>": "> {t('openRoleDetails.backToRoles')}</button>",
    ">Open employer role</div>": ">{t('openRoleDetails.openEmployerRole')}</div>",
    ">Role details</h2>": ">{t('openRoleDetails.roleDetails')}</h2>",
    "label=\"Location\"": "label={t('openRoleDetails.location')}",
    "label=\"Duration\"": "label={t('openRoleDetails.duration')}",
    "label=\"Level\"": "label={t('openRoleDetails.level')}",
    "label=\"Work type\"": "label={t('openRoleDetails.workType')}",
    "'Open level'": "t('openRoleDetails.openLevel')",
    "'Open role'": "t('openRoleDetails.openRole')",
    "'Egypt'": "t('openRoleDetails.location')",
    "'Not specified'": "t('openRoleDetails.notSpecified')",
    ">Salary: ": ">{t('openRoleDetails.salary')}: ",
    ">Skills requested</h2>": ">{t('openRoleDetails.skillsRequested')}</h2>",
    ">No skills were listed by the poster.</p>": ">{t('openRoleDetails.noSkills')}</p>",
    ">Application pipeline</h2>": ">{t('openRoleDetails.pipeline')}</h2>",
    "title=\"Review the role\"": "title={t('openRoleDetails.reviewRole')}",
    "body=\"Read the role details and compare the work setup with your accessibility needs.\"": "body={t('openRoleDetails.reviewRoleBody')}",
    "title=\"Prepare your CV\"": "title={t('openRoleDetails.prepareCV')}",
    "body=\"Use Skillable CV Generator or your existing CV, focusing on skills that match this role.\"": "body={t('openRoleDetails.prepareCVBody')}",
    "title=\"Contact the employer\"": "title={t('openRoleDetails.contactEmployer')}",
    "body=\"Send your CV and ask clear questions about location, schedule, accessibility, and onboarding.\"": "body={t('openRoleDetails.contactEmployerBody')}",
    "title=\"Interview and accommodations\"": "title={t('openRoleDetails.interview')}",
    "body=\"Discuss what helps you work well, such as flexible hours, accessible transport, screen reader support, or quieter work areas.\"": "body={t('openRoleDetails.interviewBody')}",
    ">Ready to apply?</h2>": ">{t('openRoleDetails.readyToApply')}</h2>",
    "'This is a live open role, not a learning path. Send your info so the recruiter can contact you if there is a fit.'": "t('openRoleDetails.applyLive')",
    "'You can browse this role now. Sign in or create an account to apply and share your contact information with the recruiter.'": "t('openRoleDetails.applyLocked')",
    "> Apply / contact</button>": "> {t('openRoleDetails.applyContact')}</button>",
    "> Apply locked</button>": "> {t('openRoleDetails.lockedApplyBtn')}</button>",
    ">Sign in</button>": ">{t('openRoleDetails.signIn')}</button>",
    "> Sign up</button>": "> {t('openRoleDetails.signUp')}</button>",
    ">Applicants</h3>": ">{t('openRoleDetails.applicants')}</h3>",
    ">Visible only to the recruiter who posted this role.</p>": ">{t('openRoleDetails.visibleToRecruiter')}</p>",
    ">No applications yet.</p>": ">{t('openRoleDetails.noApplications')}</p>",
    ">Access: ": ">{t('openRoleDetails.access')}: ",
    ">CV: ": ">CV: ", 
    ">Before applying</h3>": ">{t('openRoleDetails.beforeApplying')}</h3>",
    ">Check that the role is still open.</ChecklistItem>": ">{t('openRoleDetails.checkOpen')}</ChecklistItem>",
    ">Ask about accessibility and transport before committing.</ChecklistItem>": ">{t('openRoleDetails.askAccess')}</ChecklistItem>",
    ">Do not share payment or private documents unless you trust the employer.</ChecklistItem>": ">{t('openRoleDetails.noPayment')}</ChecklistItem>",
    ">Shared by</h3>": ">{t('openRoleDetails.sharedBy')}</h3>",
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done updating OpenRoleDetailPage.js')
