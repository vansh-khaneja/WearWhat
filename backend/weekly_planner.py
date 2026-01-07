"""
Weekly Planner Module
Handles the business logic for generating weekly outfit plans with random selection and composite image creation.
"""

import random
import tempfile
import os
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any
from endpoints.weekly.models import DailyPlan

from image_composer import create_composite_image
from cloudinary_uploader import upload_image
from weather_data.service import get_weather_forecast
from auth.user_db import get_user_location


def generate_weekly_plan(outfits: List[Dict[str, Any]], user_id: str) -> Dict[str, DailyPlan]:
    """
    Generate a weekly plan with random outfit selections, composite images, and weather data.

    Args:
        outfits: List of outfit dictionaries with outfit_id, wardrobe_id, image_url, tags
        user_id: User ID to fetch location and weather data

    Returns:
        Dictionary mapping day keys (day1, day2, etc.) to DailyPlan objects
    """
    if not outfits:
        raise ValueError("No outfits provided for weekly plan generation")

    # Get user's location for weather data
    user_location = get_user_location(user_id)
    weather_data = None

    if user_location:
        # Get weather forecast for the user's location
        weather_data = get_weather_forecast(
            latitude=user_location["latitude"],
            longitude=user_location["longitude"],
            days=3
        )

    # Generate daily plans for the next 3 days
    now = datetime.now(timezone.utc)
    today = now.date()
    daily_plans = {}

    for i in range(3):
        current_date = today + timedelta(days=i)
        day_name = current_date.strftime("%A")  # Monday, Tuesday, etc.

        # Select random outfits for the day (3-5 outfits)
        num_outfits = min(random.randint(3, 5), len(outfits))
        selected_outfits = random.sample(outfits, num_outfits)

        # Create composite image for the day
        composite_image_url = _create_composite_image_for_outfits(selected_outfits)

        # Get weather data for this day if available
        temperature = None
        condition = None
        condition_icon = None

        if weather_data and weather_data.get("forecast") and len(weather_data["forecast"]) > i:
            day_weather = weather_data["forecast"][i]
            temperature = day_weather.get("avg_temp_c")
            condition = day_weather.get("condition_text")
            condition_icon = day_weather.get("condition_icon")

        # Create daily plan
        day_key = f"day{i+1}"
        daily_plans[day_key] = DailyPlan(
            date=current_date.isoformat(),
            day=day_name,
            image_url=composite_image_url,
            outfit_ids=[outfit["outfit_id"] for outfit in selected_outfits],
            temperature=temperature,
            condition=condition,
            condition_icon=condition_icon
        )

    return daily_plans


def _create_composite_image_for_outfits(outfits: List[Dict[str, Any]]) -> str:
    """
    Create a composite image from outfit image URLs.

    Args:
        outfits: List of outfit dictionaries

    Returns:
        URL of the uploaded composite image, or None if creation failed
    """
    composite_image_url = None

    try:
        image_urls = [outfit["image_url"] for outfit in outfits if outfit.get("image_url")]

        if image_urls:
            composite_image = create_composite_image(image_urls, layout="grid")

            temp_file_path = None
            try:
                with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                    temp_file_path = temp_file.name
                    composite_image.save(temp_file_path, 'JPEG', quality=95)

                composite_image_url, _ = upload_image(temp_file_path)
            finally:
                if temp_file_path and os.path.exists(temp_file_path):
                    try:
                        os.remove(temp_file_path)
                    except Exception:
                        pass
    except Exception as e:
        print(f"Warning: Failed to create composite image: {str(e)}")
        composite_image_url = None

    return composite_image_url
