import csv
from collections import deque
from pathlib import Path
from typing import Optional, List
from urllib.parse import quote_plus

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
try:
    import networkx as nx
except ImportError:  # pragma: no cover - local fallback when dependency is unavailable
    nx = None

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "jobs.csv"

# ---------------------------------------------------------------------------
# Skill synonym map
# Keys: any lowercase variant a user might type
# Values: the canonical skill name used in jobs.csv
# ---------------------------------------------------------------------------
SKILL_SYNONYMS: dict[str, str] = {
    # JavaScript
    "js":                        "JavaScript",
    "java script":               "JavaScript",
    "es6":                       "JavaScript",
    "es2015":                    "JavaScript",
    "ecmascript":                "JavaScript",
    "vanilla js":                "JavaScript",
    "vanilla javascript":        "JavaScript",
    # TypeScript
    "ts":                        "TypeScript",
    # Python
    "py":                        "Python",
    "python3":                   "Python",
    "python 3":                  "Python",
    "python2":                   "Python",
    # React
    "reactjs":                   "React",
    "react.js":                  "React",
    "react js":                  "React",
    "react native":              "React",       # close enough for matching
    # Node.js
    "nodejs":                    "Node.js",
    "node js":                   "Node.js",
    "node":                      "Node.js",
    # HTML
    "html5":                     "HTML",
    "hypertext markup":          "HTML",
    # CSS
    "css3":                      "CSS",
    "cascading style sheets":    "CSS",
    "stylesheets":               "CSS",
    # SQL
    "structured query language": "SQL",
    "sequel":                    "SQL",
    "t-sql":                     "SQL",
    "plsql":                     "SQL",
    "pl/sql":                    "SQL",
    # Git
    "git/github":                "Git",
    "github":                    "Git",
    "gitlab":                    "Git",
    "version control":           "Git",
    # REST APIs
    "rest api":                  "REST APIs",
    "restful api":               "REST APIs",
    "restful apis":              "REST APIs",
    "rest":                      "REST APIs",
    "api development":           "REST APIs",
    "api design":                "REST APIs",
    # Machine Learning
    "ml":                        "Machine Learning",
    "deep learning":             "Machine Learning",
    "neural networks":           "Machine Learning",
    # Data Analysis
    "data analytics":            "Data Analysis",
    "analytics":                 "Data Analysis",
    "data analyst":              "Data Analysis",
    # Data Visualisation
    "data visualization":        "Data Visualisation",
    "data viz":                  "Data Visualisation",
    "dataviz":                   "Data Visualisation",
    # Excel
    "microsoft excel":           "Excel",
    "ms excel":                  "Excel",
    "spreadsheets":              "Excel",
    "google sheets":             "Excel",       # close enough
    # Power BI
    "powerbi":                   "Power BI",
    "power-bi":                  "Power BI",
    "microsoft power bi":        "Power BI",
    # AWS
    "amazon web services":       "AWS",
    "amazon aws":                "AWS",
    # Azure
    "microsoft azure":           "Azure",
    # GCP
    "google cloud":              "GCP",
    "google cloud platform":     "GCP",
    # Docker
    "docker containers":         "Docker",
    "containerisation":          "Docker",
    "containerization":          "Docker",
    # Kubernetes
    "k8s":                       "Kubernetes",
    "container orchestration":   "Kubernetes",
    # CI/CD
    "ci cd":                     "CI/CD",
    "continuous integration":    "CI/CD",
    "continuous deployment":     "CI/CD",
    # Linux
    "unix":                      "Linux",
    "bash":                      "Linux",
    "shell scripting":           "Linux",
    # Figma
    "figma design":              "Figma",
    # UI/UX umbrella
    "ui/ux":                     "UI/UX",
    "ui ux":                     "UI/UX",
    "ux/ui":                     "UI/UX",
    "uiux":                      "UI/UX",
    "ui ux design":              "UI/UX",
    "ux ui design":              "UI/UX",
    "user experience design":    "UI/UX",
    "user interface and user experience": "UI/UX",
    "ux design":                 "UI/UX",
    # UX Research
    "user research":             "UX Research",
    "usability research":        "UX Research",
    "ux testing":                "UX Research",
    "ux audit":                  "UX Audits",
    "ux auditing":               "UX Audits",
    "ux writing":                "UX Writing",
    "content design":            "UX Writing",
    "usability test":            "Usability Testing",
    "prototype design":          "Prototyping",
    "prototype building":        "Prototyping",
    "wireframes":                "Wireframing",
    # UI Design
    "user interface design":     "UI Design",
    "interface design":          "UI Design",
    # SEO
    "search engine optimization":  "SEO",
    "search engine optimisation":  "SEO",
    "on-page seo":               "SEO",
    "technical seo":             "SEO",
    # CRM
    "crm tools":                 "CRM",
    "crm software":              "CRM",
    "salesforce":                "CRM",
    "hubspot":                   "CRM",
    # Copywriting
    "copy writing":              "Copywriting",
    "ad copy":                   "Copywriting",
    # Video Editing
    "video edit":                "Video Editing",
    "film editing":              "Video Editing",
    # After Effects
    "adobe after effects":       "After Effects",
    "ae":                        "After Effects",
    # Photoshop
    "adobe photoshop":           "Photoshop",
    "ps":                        "Photoshop",
    # Premiere Pro
    "adobe premiere":            "Premiere Pro",
    "premiere":                  "Premiere Pro",
    # Adobe Illustrator
    "adobe illustrator":         "Illustrator",
    # Colour Theory
    "color theory":              "Colour Theory",
    "colour":                    "Colour Theory",
    "color":                     "Colour Theory",
    # Typography
    "type design":               "Typography",
    "typeface":                  "Typography",
    # Networking
    "networking basics":         "Networking",
    "computer networking":       "Networking",
    "network administration":    "Networking",
    # Typing Accuracy
    "typing":                    "Typing Accuracy",
    "touch typing":              "Typing Accuracy",
    "wpm":                       "Typing Accuracy",
    # Written Communication
    "written communications":    "Written Communication",
    "writing skills":            "Written Communication",
    # Communication
    "communications":            "Communication",
    "verbal communication":      "Communication",
    # Project Management
    "project management":        "Project Management",
    "pm":                        "Project Management",
    "pmp":                       "Project Management",
    # Agile
    "agile methodology":         "Agile",
    "agile development":         "Agile",
    # Scrum
    "scrum methodology":         "Scrum",
    "scrum master":              "Scrum",
    # WordPress
    "wordpress cms":             "WordPress",
    "wp":                        "WordPress",
    # Shopify
    "shopify platform":          "Shopify",
    # Organisation
    "organization":              "Organisation",
    "organizational skills":     "Organisation",
    # Attention to Detail
    "detail oriented":           "Attention to Detail",
    "detail-oriented":           "Attention to Detail",
    # Problem Solving
    "problem-solving":           "Problem Solving",
    "analytical thinking":       "Problem Solving",
    "critical thinking":         "Problem Solving",
    # Research
    "desk research":             "Research",
    "online research":           "Research",
    # Documentation
    "technical documentation":   "Documentation",
    "docs":                      "Documentation",
    # Testing
    "software testing":          "Manual Testing",
    "qa":                        "Manual Testing",
    "quality assurance":         "Manual Testing",
    # Data Entry
    "data input":                "Data Entry",
    "data processing":           "Data Entry",
    # Reporting
    "report writing":            "Reporting",
    "dashboards":                "Reporting",
    # Audio Editing
    "audio tools":               "Audio Editing",
    "sound editing":             "Audio Editing",
    "music editing":             "Audio Editing",
    # Animation
    "character animation":       "Animation",
    "2d animation":              "Animation",
    # Character Design
    "character drawing":         "Character Design",
    "character art":             "Character Design",
    # Storyboarding
    "story boarding":            "Storyboarding",
    "story board":               "Storyboarding",
    # Machine Learning Engineering
    "mlops":                     "MLOps",
    "ml ops":                    "MLOps",
    # Security
    "cybersecurity":             "Security",
    "information security":      "Security",
    "infosec":                   "Security",
    "network security":          "Security",
    # Broad skill umbrellas
    "web dev":                   "Web Development",
    "web development":           "Web Development",
    "frontend":                  "Frontend Development",
    "front end":                 "Frontend Development",
    "front-end":                 "Frontend Development",
    "backend":                   "Backend Development",
    "back end":                  "Backend Development",
    "back-end":                  "Backend Development",
    "data science":              "Data Science",
    "data scientist":            "Data Science",
    "devops":                    "DevOps",
    "dev ops":                   "DevOps",
    "cloud":                     "Cloud Computing",
    "cloud engineering":         "Cloud Computing",
    "digital marketing":         "Digital Marketing",
    "content writing":           "Content Writing",
    "customer support":          "Customer Support",
    "help desk":                 "Customer Support",
    "accessibility":             "Accessibility",
    "a11y":                      "Accessibility",
    "graphic design":            "Graphic Design",
    "video production":          "Video Production",
    "elearning":                 "E-learning",
    "e-learning":                "E-learning",
}


# Reverse index: lowercase canonical → proper-cased canonical
# Built once from SKILL_SYNONYMS values so any canonical form typed in wrong
# case is still corrected (e.g. "python" → "Python", "REACT" → "React")
_CANONICAL_LOWER: dict[str, str] = {v.lower(): v for v in SKILL_SYNONYMS.values()}


def normalize_skill(raw: str) -> str:
    """Return the canonical skill name for a user-supplied skill string."""
    cleaned = raw.strip()
    if not cleaned:
        return cleaned
    lookup = cleaned.lower()
    # 1. Direct synonym hit
    if lookup in SKILL_SYNONYMS:
        return SKILL_SYNONYMS[lookup]
    # 2. Matches a canonical name but in wrong case (e.g. "python", "REACT")
    if lookup in _CANONICAL_LOWER:
        return _CANONICAL_LOWER[lookup]
    # 3. Return as-is (unknown skill — keep user's casing)
    return cleaned


def normalize_skills(skills: List[str]) -> List[str]:
    """Normalize a list of user skills, deduplicate, and drop empties."""
    seen = set()
    result = []
    for s in skills:
        norm = normalize_skill(s)
        key  = norm.lower()
        if norm and key not in seen:
            seen.add(key)
            result.append(norm)
    return result


SKILL_GRAPH_EDGES: list[tuple[str, str]] = [
    ("React", "JavaScript"),
    ("Next.js", "React"),
    ("Vue.js", "JavaScript"),
    ("TypeScript", "JavaScript"),
    ("Node.js", "JavaScript"),
    ("Express", "Node.js"),
    ("Django", "Python"),
    ("Flask", "Python"),
    ("FastAPI", "Python"),
    ("Pandas", "Python"),
    ("NumPy", "Python"),
    ("scikit-learn", "Machine Learning"),
    ("PyTorch", "Machine Learning"),
    ("TensorFlow", "Machine Learning"),
    ("MLOps", "Machine Learning"),
    ("Kubernetes", "Docker"),
    ("Terraform", "Infrastructure as Code"),
    ("React Native", "React"),
    ("UI/UX", "UI Design"),
    ("UI/UX", "UX Research"),
    ("UI/UX", "Wireframing"),
    ("UI/UX", "Prototyping"),
    ("UI/UX", "Usability Testing"),
    ("UI/UX", "UX Writing"),
    ("UI/UX", "UX Audits"),
    ("UI/UX", "Figma"),
    ("UI Design", "UI/UX"),
    ("UX Research", "UI/UX"),
    ("Wireframing", "UI/UX"),
    ("Prototyping", "UI/UX"),
    ("Usability Testing", "UX Research"),
    ("UX Audits", "UX Research"),
    ("UX Writing", "UI/UX"),
    ("Figma", "UI Design"),
    ("Figma", "UI/UX"),
    ("UI Design", "Figma"),
    ("Prototyping", "Figma"),
    ("Wireframing", "UI Design"),
    ("UX Research", "Usability Testing"),
    ("After Effects", "Motion Graphics"),
    ("Premiere Pro", "Video Editing"),
    ("DaVinci Resolve", "Video Editing"),
    ("Power BI", "Data Visualisation"),
    ("Tableau", "Data Visualisation"),
    ("SQL", "Data Analysis"),
    ("Web Development", "HTML"),
    ("Web Development", "CSS"),
    ("Web Development", "JavaScript"),
    ("Web Development", "REST APIs"),
    ("Web Development", "Git"),
    ("Web Development", "React"),
    ("Web Development", "Node.js"),
    ("Frontend Development", "HTML"),
    ("Frontend Development", "CSS"),
    ("Frontend Development", "JavaScript"),
    ("Frontend Development", "React"),
    ("Frontend Development", "Responsive Design"),
    ("Frontend Development", "UI Design"),
    ("Backend Development", "Python"),
    ("Backend Development", "Node.js"),
    ("Backend Development", "REST APIs"),
    ("Backend Development", "SQL"),
    ("Backend Development", "Database Design"),
    ("Data Science", "Python"),
    ("Data Science", "SQL"),
    ("Data Science", "Statistics"),
    ("Data Science", "Machine Learning"),
    ("Data Science", "Pandas"),
    ("Data Science", "NumPy"),
    ("Data Science", "scikit-learn"),
    ("Data Science", "Data Analysis"),
    ("Data Science", "Data Visualisation"),
    ("Data Analysis", "SQL"),
    ("Data Analysis", "Excel"),
    ("Data Analysis", "Spreadsheets"),
    ("Data Analysis", "Power BI"),
    ("Data Analysis", "Tableau"),
    ("Data Analysis", "Reporting"),
    ("Data Analysis", "Data Visualisation"),
    ("DevOps", "Docker"),
    ("DevOps", "Kubernetes"),
    ("DevOps", "CI/CD"),
    ("DevOps", "Linux"),
    ("DevOps", "Terraform"),
    ("DevOps", "Infrastructure as Code"),
    ("DevOps", "AWS"),
    ("DevOps", "Azure"),
    ("DevOps", "GCP"),
    ("Cloud Computing", "AWS"),
    ("Cloud Computing", "Azure"),
    ("Cloud Computing", "GCP"),
    ("Cloud Computing", "Docker"),
    ("Cloud Computing", "Kubernetes"),
    ("Cloud Computing", "Terraform"),
    ("Security", "Network Security"),
    ("Security", "SIEM"),
    ("Security", "Vulnerability Assessment"),
    ("Security", "Incident Response"),
    ("Security", "Threat Analysis"),
    ("Digital Marketing", "SEO"),
    ("Digital Marketing", "Google Analytics"),
    ("Digital Marketing", "Google Ads"),
    ("Digital Marketing", "Meta Ads"),
    ("Digital Marketing", "Content Planning"),
    ("Digital Marketing", "A/B Testing"),
    ("Content Writing", "Writing"),
    ("Content Writing", "Copywriting"),
    ("Content Writing", "SEO"),
    ("Content Writing", "Proofreading"),
    ("Content Writing", "Editing"),
    ("Customer Support", "Customer Service"),
    ("Customer Support", "Communication"),
    ("Customer Support", "Empathy"),
    ("Customer Support", "Zendesk"),
    ("Customer Support", "Freshdesk"),
    ("Project Management", "Agile"),
    ("Project Management", "Scrum"),
    ("Project Management", "Jira"),
    ("Project Management", "Trello"),
    ("Project Management", "Asana"),
    ("Project Management", "Stakeholder Management"),
    ("Accessibility", "WCAG"),
    ("Accessibility", "ARIA"),
    ("Accessibility", "Screen readers"),
    ("Accessibility", "NVDA"),
    ("Accessibility", "JAWS"),
    ("Accessibility", "Axe DevTools"),
    ("Accessibility", "Assistive Technology"),
    ("Graphic Design", "Photoshop"),
    ("Graphic Design", "Illustrator"),
    ("Graphic Design", "Canva"),
    ("Graphic Design", "Typography"),
    ("Graphic Design", "Colour Theory"),
    ("Graphic Design", "Brand Design"),
    ("Graphic Design", "Layout"),
    ("Graphic Design", "Visual Design"),
    ("Video Production", "Video Editing"),
    ("Video Production", "Premiere Pro"),
    ("Video Production", "DaVinci Resolve"),
    ("Video Production", "After Effects"),
    ("Video Production", "Audio Editing"),
    ("E-learning", "Instructional Design"),
    ("E-learning", "Curriculum Design"),
    ("E-learning", "LMS Administration"),
    ("E-learning", "SCORM"),
    ("E-learning", "Articulate Storyline"),
]


for _src, _dst in SKILL_GRAPH_EDGES:
    _CANONICAL_LOWER.setdefault(_src.lower(), _src)
    _CANONICAL_LOWER.setdefault(_dst.lower(), _dst)


class SimpleDiGraph:
    def __init__(self) -> None:
        self.adjacency: dict[str, set[str]] = {}

    def add_edge(self, src: str, dst: str) -> None:
        self.adjacency.setdefault(src, set()).add(dst)
        self.adjacency.setdefault(dst, set())

    def __contains__(self, node: str) -> bool:
        return node in self.adjacency

    def neighbors(self, node: str) -> set[str]:
        return self.adjacency.get(node, set())


def build_skill_graph():
    graph = nx.DiGraph() if nx is not None else SimpleDiGraph()
    for src, dst in SKILL_GRAPH_EDGES:
        graph.add_edge(normalize_skill(src), normalize_skill(dst))
    return graph


SKILL_GRAPH = build_skill_graph()


def skill_graph_lengths(graph, source: str, cutoff: int) -> dict[str, int]:
    if nx is not None and not isinstance(graph, SimpleDiGraph):
        return nx.single_source_shortest_path_length(graph, source, cutoff=cutoff)

    visited = {source: 0}
    queue = deque([(source, 0)])
    while queue:
        node, depth = queue.popleft()
        if depth >= cutoff:
            continue
        for neighbor in graph.neighbors(node):
            if neighbor in visited:
                continue
            visited[neighbor] = depth + 1
            queue.append((neighbor, depth + 1))
    return visited

# ---------------------------------------------------------------------------
# Level mappings
# ---------------------------------------------------------------------------

# User impairment levels (from profile page)
USER_LEVELS = {
    "no issues": 0,
    "no issues / n/a": 0,
    "n/a": 0,
    "mild": 1,
    "moderate": 2,
    "significant": 3,
    "requires support": 4,
}

# Job accommodation levels (from CSV)
JOB_LEVELS = {
    "no issues / n/a": 0,   # dimension not applicable — zero barrier
    "n/a": 0,
    "no issues": 0,
    "mild": 1,
    "moderate": 2,
    "significant": 3,
    "requires support": 4,
}

DIMENSION_LABELS = {
    "mobility": "Mobility",
    "vision":   "Vision",
    "hearing":  "Hearing",
    "cognitive": "Cognitive load",
}

EXPERIENCE_RANK = {"Entry": 0, "Mid": 1, "Senior": 2}

# ---------------------------------------------------------------------------
# Score weights — must sum to 100
# ---------------------------------------------------------------------------
W_ACCESSIBILITY = 55   # 4 dimensions × up to 13.75 each
W_SKILLS        = 28   # skill overlap with required skills
W_EXPERIENCE    = 10   # experience level match
W_CONTEXT       =  7   # remote-work + disability context bonuses


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------

class MatchRequest(BaseModel):
    mobility:         Optional[str] = None
    vision:           Optional[str] = None
    hearing:          Optional[str] = None
    cognitive:        Optional[str] = None
    skills:           List[str]     = []
    experience_level: Optional[str] = None
    top_n:            int           = 6


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(title="Skillable Matching API v2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _norm_user(value: Optional[str]) -> Optional[int]:
    if not value:
        return None
    return USER_LEVELS.get(value.strip().lower())


def _norm_job(value: Optional[str]) -> Optional[int]:
    if not value:
        return None
    return JOB_LEVELS.get(value.strip().lower())


def load_jobs():
    jobs = []
    with DATA_PATH.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            jobs.append(row)
    return jobs


def build_video_items(jobtitle: str, roadmap: list, raw_videos: str) -> list:
    parsed = []
    if raw_videos:
        for idx, entry in enumerate(raw_videos.split(";")):
            token = entry.strip()
            if not token:
                continue
            if "|" in token:
                title, url = token.split("|", 1)
                parsed.append({
                    "title": title.strip() or (roadmap[idx] if idx < len(roadmap) else f"Step {idx + 1}"),
                    "url":   url.strip(),
                })
            else:
                parsed.append({
                    "title": roadmap[idx] if idx < len(roadmap) else f"Step {idx + 1}",
                    "url":   token,
                })

    if len(parsed) < len(roadmap):
        for i in range(len(parsed), len(roadmap)):
            checkpoint = roadmap[i]
            query = quote_plus(f"{jobtitle} {checkpoint} tutorial")
            parsed.append({
                "title": checkpoint,
                "url":   f"https://www.youtube.com/results?search_query={query}",
            })

    return parsed[: len(roadmap)] if roadmap else parsed


def passes_hard_constraints(job: dict, user_levels: dict) -> tuple[bool, Optional[str]]:
    for key in ["mobility", "vision", "hearing", "cognitive"]:
        user_level = user_levels.get(key)
        job_level = _norm_job(job.get(key))

        if user_level is None or job_level is None:
            continue

        if job_level == 0 and user_level >= 3:
            return False, f"{key} hard constraint failed"

        gap = job_level - user_level
        if gap >= 3:
            return False, f"{key} accommodation gap too large"

        if gap > 3:
            return False, f"{key} accommodation gap exceeded"

    return True, None


def _build_user_skill_credits(user_skills: List[str]) -> dict[str, float]:
    direct_skills = normalize_skills(user_skills)
    credits: dict[str, float] = {skill.lower(): 1.0 for skill in direct_skills}
    depth_credit = {1: 0.60, 2: 0.35}

    for skill in direct_skills:
        if skill not in SKILL_GRAPH:
            continue
        for target, depth in skill_graph_lengths(SKILL_GRAPH, skill, cutoff=2).items():
            if depth == 0:
                continue
            lowered = target.lower()
            credits[lowered] = max(credits.get(lowered, 0.0), depth_credit.get(depth, 0.0))

    return credits


# ---------------------------------------------------------------------------
# Scoring: accessibility (55 pts total, 13.75 per dimension)
# ---------------------------------------------------------------------------

_DIM_MAX = W_ACCESSIBILITY / 4   # 13.75 per dimension


def _score_dimension(user_level: int, job_level: int, key: str) -> tuple[float, str]:
    label = DIMENSION_LABELS[key]

    # Job marks this dimension as "not applicable" — no barrier whatsoever
    if job_level == 0:
        return _DIM_MAX, f"{label}: not a barrier for this role"

    # Compatible — job accommodates the user's need
    if job_level <= user_level:
        slack = user_level - job_level
        if slack >= 2:
            return _DIM_MAX,        f"{label}: excellent accommodation for your needs"
        elif slack == 1:
            return _DIM_MAX * 0.92, f"{label}: good accommodation for your needs"
        else:
            return _DIM_MAX * 0.82, f"{label}: exact match for your needs"

    # Incompatible — job demands more than user's current level
    gap = job_level - user_level
    if gap == 1:
        return _DIM_MAX * 0.42, f"{label}: slight mismatch — may need some adaptation"
    elif gap == 2:
        return _DIM_MAX * 0.14, f"{label}: significant challenge — external accommodation may be needed"
    else:
        return 0.0,             f"{label}: role requirements exceed your current comfort level in this area"


def _score_accessibility(user_levels: dict, job: dict) -> tuple[float, list, dict]:
    total  = 0.0
    reasons = []
    breakdown = {}

    for key in ["mobility", "vision", "hearing", "cognitive"]:
        u = user_levels.get(key)
        j = _norm_job(job.get(key))

        if u is None or j is None:
            pts    = _DIM_MAX * 0.6        # neutral — no data for this dimension
            reason = f"{DIMENSION_LABELS[key]}: no profile data — treated as neutral"
        else:
            pts, reason = _score_dimension(u, j, key)

        total += pts
        reasons.append(reason)
        breakdown[key] = {
            "score": round(pts, 2),
            "max":   round(_DIM_MAX, 2),
            "label": reason,
        }

    return total, reasons, breakdown


# ---------------------------------------------------------------------------
# Scoring: skills (28 pts)
# ---------------------------------------------------------------------------

def _score_skills(user_skills: List[str], raw_job_skills: str) -> tuple[float, list, list, list, float]:
    job_skills_norm = normalize_skills([s for s in raw_job_skills.split(";") if s.strip()])
    job_skills = {s.lower() for s in job_skills_norm}
    canonical_map = {s.lower(): s for s in job_skills_norm}

    if not job_skills:
        return W_SKILLS * 0.5, [], [], [], 0.5

    if not user_skills:
        missing_display = sorted(canonical_map.get(k, k.title()) for k in job_skills)
        return W_SKILLS * 0.45, [], missing_display, [], 0.0

    direct_user_skills = normalize_skills(user_skills)
    direct_user_keys = {skill.lower() for skill in direct_user_skills}
    user_credits = _build_user_skill_credits(user_skills)

    universe = set(job_skills) | set(user_credits.keys())
    numerator = 0.0
    denominator = 0.0
    for skill in universe:
        user_weight = user_credits.get(skill, 0.0)
        job_weight = 1.0 if skill in job_skills else 0.0
        numerator += min(user_weight, job_weight)
        denominator += max(user_weight, job_weight)

    ratio = (numerator / denominator) if denominator else 0.0
    bonus = W_SKILLS * 0.10 if ratio >= 0.7 else 0.0
    pts = min(W_SKILLS, ratio * W_SKILLS + bonus)

    direct_overlap_keys = direct_user_keys & job_skills
    inferred_overlap_keys = {
        skill for skill in job_skills
        if skill not in direct_user_keys and user_credits.get(skill, 0.0) > 0.0
    }
    missing_keys = {
        skill for skill in job_skills
        if user_credits.get(skill, 0.0) <= 0.0
    }

    overlap_display = sorted(canonical_map.get(k, k.title()) for k in direct_overlap_keys)
    inferred_display = sorted(canonical_map.get(k, k.title()) for k in inferred_overlap_keys)
    missing_display = sorted(canonical_map.get(k, k.title()) for k in missing_keys)

    return pts, overlap_display, missing_display, inferred_display, ratio


# ---------------------------------------------------------------------------
# Scoring: experience level (10 pts)
# ---------------------------------------------------------------------------

def _score_experience(user_exp: Optional[str], job_exp: Optional[str]) -> tuple[float, str]:
    u = EXPERIENCE_RANK.get(user_exp or "", 1)   # default: mid
    j = EXPERIENCE_RANK.get(job_exp  or "", 1)

    diff = u - j   # positive = overqualified, negative = underqualified

    if diff == 0:
        return W_EXPERIENCE,        "Experience level is a strong match"
    elif diff == 1:
        return W_EXPERIENCE * 0.80, "Slightly overqualified — still a great fit"
    elif diff >= 2:
        return W_EXPERIENCE * 0.65, "Overqualified — senior talent brings added value"
    elif diff == -1:
        return W_EXPERIENCE * 0.50, "You may benefit from building a little more experience for this role"
    else:
        return W_EXPERIENCE * 0.15, "This role requires significantly more experience than your current level"


# ---------------------------------------------------------------------------
# Scoring: context bonuses (7 pts)
# ---------------------------------------------------------------------------

def _score_context(job: dict, user_levels: dict) -> tuple[float, list]:
    pts     = 0.0
    reasons = []
    job_type = (job.get("job_type") or "").lower()
    is_remote = "remote" in job_type

    mobility_level = user_levels.get("mobility") or 0
    hearing_level  = user_levels.get("hearing")  or 0
    vision_level   = user_levels.get("vision")   or 0

    if is_remote and mobility_level >= 2:
        pts += W_CONTEXT * 0.80
        reasons.append("Fully remote role — ideal for your mobility needs")
    elif is_remote and mobility_level == 1:
        pts += W_CONTEXT * 0.50
        reasons.append("Remote role — convenient for your mobility level")

    if is_remote and hearing_level >= 2:
        pts += W_CONTEXT * 0.30
        reasons.append("Text-based remote work — well-suited for hearing challenges")

    if vision_level >= 2:
        job_cat = (job.get("category") or "").lower()
        if job_cat not in ("design", "creative"):
            pts += W_CONTEXT * 0.30
            reasons.append("Non-visual role — accessible with screen reader tools")

    return min(pts, float(W_CONTEXT)), reasons


RULE_PRIORITY = {"high": 0, "medium": 1, "low": 2}


def build_why_matched(job: dict, user_levels: dict, skill_ratio: float, experience_exact: bool) -> list[str]:
    job_type = (job.get("job_type") or "").lower()
    category = (job.get("category") or "").lower()
    growth = (job.get("growth_potential") or "").lower()
    cognitive_level = _norm_job(job.get("cognitive"))

    facts = {
        "is_remote": "remote" in job_type,
        "mobility_level": user_levels.get("mobility"),
        "hearing_level": user_levels.get("hearing"),
        "vision_level": user_levels.get("vision"),
        "cognitive_level": user_levels.get("cognitive"),
        "job_cognitive_level": cognitive_level,
        "is_non_design": category not in ("design", "creative"),
        "experience_exact": experience_exact,
        "skill_ratio": skill_ratio,
        "growth_potential": growth,
    }

    rules = [
        {
            "condition": lambda f: f["is_remote"] and (f["mobility_level"] or 0) >= 2,
            "message": "Fully remote - eliminates commute barriers for your mobility needs",
            "weight": "high",
        },
        {
            "condition": lambda f: f["is_remote"] and (f["hearing_level"] or 0) >= 2,
            "message": "Text-based async work - ideal for hearing-related needs",
            "weight": "high",
        },
        {
            "condition": lambda f: (f["vision_level"] or 0) >= 2 and f["is_non_design"],
            "message": "Non-visual role - compatible with screen reader tools",
            "weight": "high",
        },
        {
            "condition": lambda f: (f["cognitive_level"] or 0) >= 2 and (f["job_cognitive_level"] or 99) <= 1,
            "message": "Low cognitive load role - structured and predictable work",
            "weight": "high",
        },
        {
            "condition": lambda f: f["experience_exact"],
            "message": "Experience level is a strong fit",
            "weight": "medium",
        },
        {
            "condition": lambda f: f["skill_ratio"] >= 0.70,
            "message": "Strong skill alignment - you already have most of what this role needs",
            "weight": "high",
        },
        {
            "condition": lambda f: f["skill_ratio"] < 0.30,
            "message": "Skill gap detected - consider the learning roadmap before applying",
            "weight": "medium",
        },
        {
            "condition": lambda f: "senior" in f["growth_potential"] or "lead" in f["growth_potential"],
            "message": "Clear growth path available in this field",
            "weight": "low",
        },
    ]

    matched = []
    for rule in rules:
        if rule["condition"](facts):
            matched.append(rule)

    matched.sort(key=lambda rule: RULE_PRIORITY[rule["weight"]])
    return [rule["message"] for rule in matched[:5]]


# ---------------------------------------------------------------------------
# Master scorer
# ---------------------------------------------------------------------------

def compute_match(job: dict, user_levels: dict, user_skills: List[str], user_exp: Optional[str]) -> dict:
    a_pts, _, a_breakdown = _score_accessibility(user_levels, job)
    s_pts, overlap, missing, inferred_overlap, skill_ratio = _score_skills(user_skills, job.get("skills") or "")
    e_pts, e_reason = _score_experience(user_exp, job.get("experience_level"))
    c_pts, _ = _score_context(job, user_levels)

    raw_total = a_pts + s_pts + e_pts + c_pts
    percent   = min(100, max(0, int(round(raw_total))))

    if percent >= 85:   tier = "Excellent"
    elif percent >= 70: tier = "Good"
    elif percent >= 50: tier = "Fair"
    else:               tier = "Low"

    experience_exact = e_reason == "Experience level is a strong match"
    why = build_why_matched(job, user_levels, skill_ratio, experience_exact)

    return {
        "match_score":        round(raw_total, 2),
        "match_percentage":   percent,
        "compatibility_tier": tier,
        "why_matched":        why,
        "skill_overlap":      overlap,
        "inferred_overlap":   inferred_overlap,
        "missing_skills":     missing,
        "score_breakdown": {
            "accessibility": round(a_pts, 1),
            "skills":        round(s_pts, 1),
            "experience":    round(e_pts, 1),
            "context":       round(c_pts, 1),
            "breakdown_by_dimension": a_breakdown,
        },
    }


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/jobs")
def list_jobs():
    return load_jobs()


@app.post("/match")
def match_jobs(payload: MatchRequest):
    jobs = load_jobs()

    # Normalise user skills before any matching
    user_skills = normalize_skills(payload.skills)

    user_levels = {
        "mobility":  _norm_user(payload.mobility),
        "vision":    _norm_user(payload.vision),
        "hearing":   _norm_user(payload.hearing),
        "cognitive": _norm_user(payload.cognitive),
    }

    results = []
    for job in jobs:
        passes, _ = passes_hard_constraints(job, user_levels)
        if not passes:
            continue

        match = compute_match(job, user_levels, user_skills, payload.experience_level)

        roadmap = [s.strip() for s in (job.get("roadmap") or "").split(";") if s.strip()]
        videos  = build_video_items(job.get("jobtitle") or "Skill", roadmap, job.get("videos") or "")
        sources = [s.strip() for s in (job.get("sources") or "").split(";") if s.strip()]
        skills  = [s.strip() for s in (job.get("skills")  or "").split(";") if s.strip()]
        tools   = [s.strip() for s in (job.get("tools")   or "").split(";") if s.strip()]

        results.append({
            # ── Job identity ──
            "jobtitle":         job.get("jobtitle"),
            "category":         job.get("category"),
            "experience_level": job.get("experience_level"),
            "job_type":         job.get("job_type"),
            "salary_range":     job.get("salary_range"),
            # ── Content ──
            "summary":          job.get("summary"),
            "details":          job.get("details"),
            "growth_potential": job.get("growth_potential"),
            "why_accessible":   job.get("why_accessible"),
            "location":         job.get("location"),
            "learning_resource":job.get("learning_resource"),
            "skills":           skills,
            "tools":            tools,
            "roadmap":          roadmap,
            "videos":           videos,
            "sources":          sources,
            # ── Accessibility requirements ──
            "needs": {
                "mobility":  job.get("mobility"),
                "vision":    job.get("vision"),
                "hearing":   job.get("hearing"),
                "cognitive": job.get("cognitive"),
            },
            # ── Match data ──
            **match,
        })

    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results[: payload.top_n]
