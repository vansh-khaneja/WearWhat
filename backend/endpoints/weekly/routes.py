"""
Weekly Planning Routes
FastAPI routes for weekly outfit planning.
"""

import os
import tempfile
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Depends
from uuid import uuid4

from endpoints.weekly.models import PlanWeekRequest, CreateWeeklyPlanResponse, GetWeeklyPlanResponse, DailyPlan, WeeklyPlan
from weekly_planner import generate_weekly_plan
from mongodb_uploader import get_items, upload_weekly_plan, get_weekly_plan
from auth.deps import require_user

router = APIRouter(
    prefix="/weekly",
    tags=["weekly"],
    dependencies=[Depends(require_user)],
)


@router.put("/create-plan", response_model=CreateWeeklyPlanResponse, status_code=status.HTTP_200_OK)
async def create_weekly_plan_endpoint(request: PlanWeekRequest, user=Depends(require_user)):
    """
    Create a weekly outfit plan for the authenticated user.
    """

    # Get all outfits for the user
    items = get_items(user["user_id"])

    all_outfits = []
    for item in items:
        outfit = {
            "outfit_id": item.get("item_id", ""),
            "wardrobe_id": item.get("wardrobe_id", ""),
            "image_url": item.get("image_url", ""),
            "tags": item.get("tags", {})
        }
        all_outfits.append(outfit)

    if not all_outfits:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No outfits found in wardrobe. Please add some outfits first."
        )

    # Generate weekly plan using the planner service
    try:
        daily_plans = generate_weekly_plan(all_outfits, user["user_id"])
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    # Create weekly plan
    now = datetime.now(timezone.utc)
    today = now.date()
    plan_id = str(uuid4())
    weekly_plan = WeeklyPlan(
        plan_id=plan_id,
        wardrobe_id=user["user_id"],
        created_at=now.isoformat(),
        week_start=today.isoformat(),
        daily_plans=daily_plans
    )

    # Save to MongoDB
    plan_doc = weekly_plan.dict()
    upload_weekly_plan(plan_doc)

    return CreateWeeklyPlanResponse(
        result=True,
        message="Weekly plan created successfully"
    )


@router.get("/plan", response_model=GetWeeklyPlanResponse, status_code=status.HTTP_200_OK)
async def get_weekly_plan_endpoint(user=Depends(require_user)):
    """
    Get the weekly plan for the authenticated user.
    Returns at most one weekly plan since only one exists per wardrobe.
    """

    plan_data = get_weekly_plan(user["user_id"])
    weekly_plans = []

    if plan_data:
        # Convert the daily_plans dict back to the expected format
        daily_plans_dict = {}
        for key, daily_plan_data in plan_data.get("daily_plans", {}).items():
            daily_plans_dict[key] = DailyPlan(**daily_plan_data)

        weekly_plan = WeeklyPlan(
            plan_id=plan_data.get("plan_id", ""),
            wardrobe_id=plan_data.get("wardrobe_id", ""),
            created_at=plan_data.get("created_at", ""),
            week_start=plan_data.get("week_start", ""),
            daily_plans=daily_plans_dict
        )
        weekly_plans.append(weekly_plan)

    return GetWeeklyPlanResponse(weekly_plans=weekly_plans)
