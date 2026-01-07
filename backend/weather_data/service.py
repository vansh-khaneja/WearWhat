"""
Weather Service
Handles weather API integration with weatherapi.com
Utility functions for internal use only.
"""

import os
import httpx
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

# Weather API configuration
WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1"
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")


async def get_weather_forecast(latitude: float, longitude: float, days: int = 3) -> Optional[Dict[str, Any]]:
    """
    Get weather forecast from weatherapi.com

    Args:
        latitude: Latitude coordinate
        longitude: Longitude coordinate
        days: Number of days to forecast (default: 3)

    Returns:
        Weather forecast data as dict or None if request fails
    """
    try:
        # Construct API URL
        url = f"{WEATHER_API_BASE_URL}/forecast.json"
        params = {
            "key": WEATHER_API_KEY,
            "q": f"{latitude},{longitude}",
            "days": days
        }

        # Make API request
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()

            # Parse response
            data = response.json()

            # Extract simplified forecast data
            location = data.get("location", {})
            current = data.get("current", {})
            forecast_data = data.get("forecast", {}).get("forecastday", [])

            # Convert to simplified format
            forecast_summaries = []
            for forecast_day in forecast_data:
                summary = {
                    "date": forecast_day.get("date"),
                    "avg_temp_c": forecast_day.get("day", {}).get("avgtemp_c"),
                    "condition_text": forecast_day.get("day", {}).get("condition", {}).get("text"),
                    "condition_icon": forecast_day.get("day", {}).get("condition", {}).get("icon"),
                    "region": location.get("region"),
                    "country": location.get("country")
                }
                forecast_summaries.append(summary)

            return {
                "location": location,
                "current": current,
                "forecast": forecast_summaries
            }

    except httpx.HTTPError as e:
        print(f"HTTP error while fetching weather data: {e}")
        return None
    except Exception as e:
        print(f"Error fetching weather data: {e}")
        return None


