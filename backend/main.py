from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File
from pypdf import PdfReader
import io

app = FastAPI(title="ResuMatch 2.0 API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://resumatch-1wwb.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to ResuMatch 2.0 API 🚀"
    }

def calculate_ats_score(resume_text):
    text = resume_text.lower()

    # 1. Resume Structure (25 points)
    sections = [
        "education",
        "skills",
        "experience",
        "projects",
        "certifications"
    ]

    section_count = sum(
        1 for section in sections if section in text
    )

    structure_score = min(section_count * 5, 25)

    # 2. Technical Skills (25 points)
    technical_skills = [
        "python",
        "sql",
        "machine learning",
        "deep learning",
        "tensorflow",
        "pytorch",
        "java",
        "data analysis",
        "power bi",
        "excel"
    ]


    skill_count = sum(
        1 for skill in technical_skills if skill in text
    )

    skills_score = min(skill_count * 2.5, 25)
    missing_keywords = [
        skill for skill in technical_skills
        if skill not in text
    ]


    # 3. Keywords (25 points)
    keywords = [
        "developed",
        "implemented",
        "analyzed",
        "optimized",
        "designed",
        "deployed",
        "project",
        "team",
        "problem solving",
        "communication"
    ]

    keyword_count = sum(
        1 for keyword in keywords if keyword in text
    )

    keywords_score = min(keyword_count * 2.5, 25)

    # 4. Projects and Experience (25 points)
    project_experience_score = 0

    if "project" in text:
        project_experience_score += 12.5

    if "experience" in text or "internship" in text:
        project_experience_score += 12.5

    # Overall Score
    overall_score = round(
        structure_score
        + skills_score
        + keywords_score
        + project_experience_score
    )

    return {
        "overall_score": min(overall_score, 100),
        "structure_score": structure_score,
        "skills_score": skills_score,
        "keywords_score": keywords_score,
        "project_experience_score": project_experience_score,
        "missing_keywords": missing_keywords
    }
@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    if file.content_type != "application/pdf":
        return {
            "error": "Please upload a PDF file."
        }

    file_content = await file.read()

    pdf_reader = PdfReader(io.BytesIO(file_content))

    resume_text = ""

    for page in pdf_reader.pages:
        resume_text += page.extract_text() or ""

    ats_result = calculate_ats_score(resume_text)

    return {
        "filename": file.filename,
        "message": "Resume uploaded successfully!",
        "resume_text": resume_text,
        "ats_score": ats_result["overall_score"],
        "breakdown": {
            "structure": ats_result["structure_score"],
            "skills": ats_result["skills_score"],
            "keywords": ats_result["keywords_score"],
            "projects_experience": ats_result["project_experience_score"]
        },
        "missing_keywords": ats_result["missing_keywords"]
    }
class JobDescription(BaseModel):
    description: str


@app.post("/analyze-job-description")
async def analyze_job_description(job: JobDescription):

    job_text = job.description.lower()
    role_skills = {
        "data scientist": [
            "python", "sql", "machine learning",
            "statistics", "data analysis"
        ],

        "data analyst": [
            "sql", "excel", "power bi",
            "python", "data analysis"
        ],

        "ai/ml engineer": [
            "python", "machine learning",
            "deep learning", "tensorflow", "pytorch"
        ],

        "machine learning engineer": [
            "python", "machine learning",
            "deep learning", "tensorflow", "pytorch"
        ],

        "data engineer": [
            "python", "sql", "spark",
            "etl", "data engineering"
        ],

        "software engineer": [
            "python", "java", "sql",
            "data structures", "algorithms"
        ],

        "python developer": [
            "python", "sql", "django",
            "flask", "api"
        ],

        "java developer": [
            "java", "sql", "oops",
            "spring", "data structures"
        ],

        "frontend developer": [
            "html", "css", "javascript",
            "react", "typescript"
        ],

        "backend developer": [
            "python", "java", "sql",
            "api", "database"
        ],

        "full stack developer": [
            "html", "css", "javascript",
            "react", "node.js", "sql"
        ],

        "web developer": [
            "html", "css", "javascript",
            "react", "sql"
        ],

        "cloud engineer": [
            "aws", "azure", "cloud computing",
            "linux", "docker"
        ],

        "devops engineer": [
            "docker", "kubernetes", "linux",
            "jenkins", "aws"
        ],

        "cybersecurity analyst": [
            "cybersecurity", "network security",
            "linux", "python", "ethical hacking"
        ],

        "business analyst": [
            "sql", "excel", "power bi",
            "data analysis", "communication"
        ],

        "product manager": [
            "product management", "market research",
            "communication", "analytics", "leadership"
        ],

        "ui ux designer": [
            "figma", "ui design", "ux design",
            "user research", "prototyping"
        ],

        "mobile app developer": [
            "java", "kotlin", "flutter",
            "android", "api"
        ],

        "research scientist": [
            "python", "statistics", "machine learning",
            "research", "data analysis"
        ]
    }
    technical_skills = [
        "python", "sql", "machine learning",
        "deep learning", "tensorflow", "pytorch",
        "java", "data analysis", "power bi", "excel",
        "statistics", "spark", "etl", "data engineering",
        "data structures", "algorithms", "django", "flask",
        "api", "oops", "spring", "html", "css",
        "javascript", "react", "typescript", "node.js",
        "aws", "azure", "cloud computing", "linux", "docker",
        "kubernetes", "jenkins", "cybersecurity",
        "network security", "ethical hacking", "communication",
        "figma", "ui design", "ux design", "user research",
        "prototyping", "kotlin", "flutter", "android",
        "leadership", "research", "analytics"
    ]

    required_skills = []

    # Check if a known role is mentioned
    for role, skills in role_skills.items():
        if role in job_text:
            required_skills.extend(skills)

    # Also detect skills directly mentioned in the job description
    for skill in technical_skills:
        if skill in job_text:
            required_skills.append(skill)

    # Remove duplicates
    required_skills = list(set(required_skills))


    # Add skills based on detected job role
    for role, skills in role_skills.items():
        if role in job_text:
            required_skills.extend(skills)

    # Remove duplicate skills
    required_skills = list(dict.fromkeys(required_skills))


    return {
        "message": "Job description analyzed successfully!",
        "required_skills": required_skills
    }
class MatchRequest(BaseModel):
    resume_text: str
    job_description: str

@app.post("/match-resume")
async def match_resume(request: MatchRequest):

    resume_text = request.resume_text.lower()
    job_text = request.job_description.lower()

    role_skills = {
        "data scientist": [
            "python", "sql", "machine learning",
            "statistics", "data analysis"
        ],
        "data analyst": [
            "python", "sql", "excel",
            "power bi", "data analysis"
        ],
        "ai/ml engineer": [
            "python", "machine learning",
            "deep learning", "tensorflow", "pytorch"
        ],
        "python developer": [
            "python", "sql", "django", "flask", "api"
        ],
        "software engineer": [
            "python", "java", "sql",
            "data structures", "algorithms"
        ],
        "frontend developer": [
            "html", "css", "javascript", "react"
        ],
        "backend developer": [
            "python", "java", "sql", "api", "database"
        ],
        "data engineer": [
            "python", "sql", "spark", "etl"
        ]
    }

    technical_skills = [
        "python", "sql", "machine learning",
        "deep learning", "tensorflow", "pytorch",
        "java", "data analysis", "power bi",
        "excel", "statistics", "django", "flask",
        "api", "html", "css", "javascript",
        "react", "spark", "etl", "database"
    ]

    required_skills = []

    # Detect skills from job role
    for role, skills in role_skills.items():
        if role in job_text:
            required_skills.extend(skills)

    # Detect skills directly mentioned
    for skill in technical_skills:
        if skill in job_text:
            required_skills.append(skill)

    # Remove duplicate skills
    required_skills = list(set(required_skills))

    matching_skills = [
        skill for skill in required_skills
        if skill in resume_text
    ]

    missing_skills = [
        skill for skill in required_skills
        if skill not in resume_text
    ]

    if required_skills:
        match_percentage = round(
            (len(matching_skills) / len(required_skills)) * 100
        )
    else:
        match_percentage = 0

    return {
        "match_percentage": match_percentage,
        "matching_skills": matching_skills,
        "missing_skills": missing_skills
    }
class ResumeRecommendationRequest(BaseModel):
    resume_text: str


@app.post("/resume-recommendations")
async def resume_recommendations(
    request: ResumeRecommendationRequest
):
    resume_text = request.resume_text.lower()

    recommendations = []

    # Technical skills
    technical_skills = [
        "python", "sql", "machine learning",
        "deep learning", "tensorflow", "pytorch",
        "data analysis", "power bi", "excel"
    ]

    missing_skills = [
        skill for skill in technical_skills
        if skill not in resume_text
    ]

    if missing_skills:
        recommendations.append({
            "category": "Technical Skills",
            "title": "Improve your technical skills",
            "description": (
                "Consider adding relevant skills such as: "
                + ", ".join(missing_skills[:5])
            )
        })

    # Projects
    if "project" not in resume_text:
        recommendations.append({
            "category": "Projects",
            "title": "Add practical projects",
            "description": (
                "Include 2–3 relevant projects with "
                "technologies, responsibilities, and outcomes."
            )
        })

    # Experience
    if "experience" not in resume_text and "internship" not in resume_text:
        recommendations.append({
            "category": "Experience",
            "title": "Highlight your experience",
            "description": (
                "Add internships, practical experience, "
                "freelance work, or relevant achievements."
            )
        })

    # Action verbs
    action_verbs = [
        "developed", "implemented", "designed",
        "analyzed", "optimized", "deployed"
    ]

    if not any(verb in resume_text for verb in action_verbs):
        recommendations.append({
            "category": "Keywords",
            "title": "Use stronger action verbs",
            "description": (
                "Start bullet points with words such as "
                "Developed, Implemented, Designed, and Optimized."
            )
        })

    # Resume sections
    sections = ["education", "skills", "projects"]

    missing_sections = [
        section for section in sections
        if section not in resume_text
    ]

    if missing_sections:
        recommendations.append({
            "category": "Structure",
            "title": "Improve resume structure",
            "description": (
                "Check whether your resume includes: "
                + ", ".join(missing_sections)
            )
        })

    return {
        "message": "Recommendations generated successfully!",
        "recommendations": recommendations
    }
class ResumeImprovementRequest(BaseModel):
    resume_text: str

@app.post("/improve-resume")
def improve_resume(request: ResumeImprovementRequest):
    resume_text = request.resume_text
    weak_phrases = {
        "worked on": "Developed and implemented",
        "helped": "Contributed to",
        "made": "Designed and developed",
        "responsible for": "Managed and executed",
        "used": "Utilized and implemented",
        "did": "Executed and completed",
        "participated in": "Actively contributed to",
        "involved in": "Collaborated on",
        "tasked with": "Led and executed",
        "handled": "Managed and optimized",
        "learned": "Applied knowledge of",
        "knowledge of": "Proficient in",
        "familiar with": "Experienced in",
        "worked with": "Utilized and integrated",
        "created": "Designed and developed"
    }
    improvements = []

    for weak_phrase, strong_phrase in weak_phrases.items():
        if weak_phrase in resume_text.lower():
                improvements.append({
                    "original_phrase": weak_phrase,
                    "suggested_phrase": strong_phrase,
                    "message": (
                        f"Consider replacing '{weak_phrase}' "
                        f"with '{strong_phrase}' "
                        "to make your resume more impactful."
                    )
                })
        if not improvements:
            improvements.append({
                "original_phrase": "General Resume Review",
                "suggested_phrase": "Add measurable achievements",
                "message": (
                    "Consider adding numbers, results, and measurable "
                    "impact to your project and experience descriptions."
                )
            })
        return {
            "message": "Resume improvement analysis completed!",
            "improvements": improvements
        }
class BulletRewriteRequest(BaseModel):
    bullet_point: str
@app.post("/rewrite-bullet")
def rewrite_bullet(request: BulletRewriteRequest):

    bullet = request.bullet_point.strip()

    if not bullet:
        return {
            "message": "Please enter a bullet point.",
            "rewritten_bullet": ""
        }

    replacements = {
        "worked on": "Developed and implemented",
        "used": "Utilized",
        "made": "Designed and developed",
        "helped": "Contributed to",
        "responsible for": "Managed and executed"
    }

    rewritten = bullet

    for old, new in replacements.items():
        rewritten = rewritten.replace(old, new)
        rewritten = rewritten.replace(old.capitalize(), new)

    return {
        "message": "Bullet point rewritten successfully!",
        "original_bullet": bullet,
        "rewritten_bullet": rewritten
    }
class JobRoleRequest(BaseModel):
    resume_text: str


@app.post("/recommend-job-roles")
def recommend_job_roles(request: JobRoleRequest):

    resume_text = request.resume_text.lower()

    role_skills = {
        "Python Developer": [
            "python", "oops", "sql", "api"
        ],
        "Data Analyst": [
            "python", "sql", "excel", "power bi", "statistics"
        ],
        "Data Scientist": [
            "python", "machine learning", "statistics",
            "pandas", "numpy", "sql"
        ],
        "AI/ML Engineer": [
            "python", "machine learning", "deep learning",
            "tensorflow", "pytorch", "numpy"
        ],
        "Computer Vision Engineer": [
            "python", "opencv", "yolo", "deep learning",
            "computer vision"
        ]
    }

    recommendations = []

    for role, skills in role_skills.items():

        matched_skills = [
            skill for skill in skills
            if skill in resume_text
        ]

        match_percentage = round(
            (len(matched_skills) / len(skills)) * 100
        )

        if match_percentage >= 40:
            recommendations.append({
                "role": role,
                "match_percentage": match_percentage,
                "matched_skills": matched_skills
            })

    recommendations.sort(
        key=lambda x: x["match_percentage"],
        reverse=True
    )

    return {
        "message": "Job role recommendations generated!",
        "recommendations": recommendations
    }
