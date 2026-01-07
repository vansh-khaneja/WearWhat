from pydantic import BaseModel
from typing import List, Optional, Dict


class DailyPlan(BaseModel):
    """Model for a daily plan with date and outfit IDs"""
    date: str  # ISO format date (YYYY-MM-DD)
    day: str  # Monday, Tuesday, etc.
    image_url: Optional[str] = None  # Composite image URL
    outfit_ids: List[str]  # Array of outfit IDs for the day


class WeeklyPlan(BaseModel):
    """Model for a complete weekly plan"""
    plan_id: str
    wardrobe_id: str
    created_at: str  # ISO format datetime
    week_start: str  # ISO format date (YYYY-MM-DD)
    daily_plans: Dict[str, DailyPlan]  # day1, day2, etc. as keys


class PlanWeekRequest(BaseModel):
    """Request model for weekly planning"""
    temperature: Optional[float] = None


class CreateWeeklyPlanResponse(BaseModel):
    """Response model for creating weekly plan"""
    result: bool
    message: str = "Weekly plan created successfully"


class GetWeeklyPlanResponse(BaseModel):
    """Response model for getting weekly plans"""
    weekly_plans: List[WeeklyPlan]
