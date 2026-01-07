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


async def get_today_weather(latitude: float, longitude: float) -> Optional[Dict[str, Any]]:
    """
    Get today's current weather from weatherapi.com

    Args:
        latitude: Latitude coordinate
        longitude: Longitude coordinate

    Returns:
        Today's weather data as dict or None if request fails
    """
    try:
        # Construct API URL for current weather
        url = f"{WEATHER_API_BASE_URL}/current.json"
        params = {
            "key": WEATHER_API_KEY,
            "q": f"{latitude},{longitude}"
        }

        # Make API request
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()

            # Parse response
            data = response.json()

            # Extract location and current weather data
            location = data.get("location", {})
            current = data.get("current", {})

            # Return simplified format for today's weather
            return {
                "location": location,
                "current": current,
                "today": {
                    "temp_c": current.get("temp_c"),
                    "temp_f": current.get("temp_f"),
                    "condition_text": current.get("condition", {}).get("text"),
                    "condition_icon": current.get("condition", {}).get("icon"),
                    "region": location.get("region"),
                    "country": location.get("country"),
                    "last_updated": current.get("last_updated")
                }
            }

    except httpx.HTTPError as e:
        print(f"HTTP error while fetching today's weather: {e}")
        return None
    except Exception as e:
        print(f"Error fetching today's weather: {e}")
        return None


