
from typing import Literal
from pydantic import BaseModel, Field


class CommitteeRole(BaseModel):
    name: str
    responsibilities: list[str] = Field(default_factory=list)
    required_skills: list[str] = Field(default_factory=list)
    capacity: int = Field(default=1, ge=1)


class RecruitmentStage(BaseModel):
    name: str
    description: str


class CommitteeProfile(BaseModel):
    name: str
    category: Literal[
        "Core Committee",
        "Technical",
        "Non-Technical",
        "Sports",
        "Cultural",
        "Other"
    ]
    description: str
    objectives: list[str] = Field(default_factory=list)
    roles: list[CommitteeRole] = Field(default_factory=list)
    suggested_activities: list[str] = Field(default_factory=list)
    recruitment_stages: list[RecruitmentStage] = Field(
        default_factory=list
    )


class RecruitmentAssessment(BaseModel):
    candidate_summary: str
    eligibility_status: Literal[
        "eligible",
        "not_eligible",
        "needs_review"
    ]
    eligibility_reasons: list[str] = Field(default_factory=list)
    missing_information: list[str] = Field(default_factory=list)
    strengths: list[str] = Field(default_factory=list)
    clarification_areas: list[str] = Field(default_factory=list)
    interview_questions: list[str] = Field(default_factory=list)
    assessment_rubric: list[str] = Field(default_factory=list)
    final_decision: Literal["pending"] = "pending"


class GrievanceAssessment(BaseModel):
    summary: str
    suggested_category: str
    suggested_urgency: Literal[
        "low",
        "medium",
        "high",
        "urgent"
    ]
    clarification_questions: list[str] = Field(default_factory=list)
    recommended_actions: list[str] = Field(default_factory=list)
    acknowledgement_response: str
    privacy_considerations: list[str] = Field(default_factory=list)
    safety_concerns: list[str] = Field(default_factory=list)
    requires_human_review: bool = True

class EventTask(BaseModel):
    task: str
    suggested_deadline: str
    responsible_role: str


class EventPlan(BaseModel):
    event_name: str
    description: str
    objectives: list[str] = Field(default_factory=list)
    agenda: list[str] = Field(default_factory=list)
    preparation_timeline: list[str] = Field(default_factory=list)
    tasks: list[EventTask] = Field(default_factory=list)
    resource_requirements: list[str] = Field(default_factory=list)
    potential_risks: list[str] = Field(default_factory=list)
    backup_plans: list[str] = Field(default_factory=list)
    promotional_content: str
    registration_fields: list[str] = Field(default_factory=list)
    post_event_tasks: list[str] = Field(default_factory=list)


class AdminRecommendation(BaseModel):
    recommendation: str
    reason: str
    suggested_action: str
    priority: Literal["low", "medium", "high"]


class AdminAssistantResponse(BaseModel):
    request_summary: str
    recommendations: list[AdminRecommendation] = Field(
        default_factory=list
    )
    repetitive_tasks: list[str] = Field(default_factory=list)
    automation_opportunities: list[str] = Field(default_factory=list)
    workflow_improvements: list[str] = Field(default_factory=list)
    missing_information: list[str] = Field(default_factory=list)
    potential_risks: list[str] = Field(default_factory=list)
    requires_admin_action: bool = True
