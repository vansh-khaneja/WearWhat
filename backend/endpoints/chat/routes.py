"""
Chat Routes
FastAPI routes for AI-powered outfit chat conversations.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from endpoints.chat.models import ChatRequest, ChatResponse
import openai
from dotenv import load_dotenv
import os
import random
from auth.deps import require_user

load_dotenv()

router = APIRouter(
    prefix="/chat",
    tags=["chat"],
    dependencies=[Depends(require_user)],
)


@router.post("/outfit-chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def outfit_chat_endpoint(request: ChatRequest, user=Depends(require_user)):
    """
    Chat about outfits and fashion with AI assistance.
    """

    openai_api_key = os.getenv('OPENAI_API_KEY')
    if not openai_api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OpenAI API key not configured"
        )

    try:
        # Initialize OpenAI client
        client = openai.OpenAI(api_key=openai_api_key)

        # Create system prompt for fashion/outfit advice
        system_prompt = """
        You are a fashion stylist and outfit advisor. Help users with:
        - Outfit suggestions and combinations
        - Fashion advice and trends
        - Clothing recommendations based on occasions
        - Color coordination and style tips
        - Wardrobe organization and planning

        Be helpful, creative, and provide practical fashion advice.
        Keep responses conversational but informative.
        """

        # Prepare messages for OpenAI
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": request.message}
        ]

        # Add context if provided
        if request.context:
            context_str = f"Additional context: {request.context}"
            messages.insert(1, {"role": "system", "content": context_str})

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=500,
            temperature=request.temperature or 0.7,
        )

        ai_response = response.choices[0].message.content.strip()

        # Randomly include images (40% chance for demo)
        image_urls = None
        if random.random() < 0.4:  # 40% chance
            # Randomly choose 1-3 images
            num_images = random.randint(1, 3)
            image_urls = ["https://res.cloudinary.com/dnkrqpuqk/image/upload/v1767724850/tmp4o4i45wv_dig5uw.jpg"] * num_images

        return ChatResponse(
            response=ai_response,
            image_urls=image_urls,
            result=True,
            message="Chat response generated successfully"
        )

    except openai.OpenAIError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OpenAI API error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat processing error: {str(e)}"
        )
