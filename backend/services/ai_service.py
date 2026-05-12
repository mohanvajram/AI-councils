import asyncio
from typing import Optional
from openai import AsyncOpenAI
import google.generativeai as genai
from anthropic import AsyncAnthropic
from config import get_settings

SYSTEM_PROMPT = (
    "You are participating in a multi-AI panel discussion. "
    "Give a clear, distinct perspective in 2-3 sentences. Be direct and insightful."
)

SYNTHESIS_PROMPT = (
    "You are a neutral synthesis engine. Given multiple AI perspectives on a question, "
    "produce a balanced, actionable final answer in 3-4 sentences that captures the best insights from all views."
)


def _build_user_msg(question: str, prior: list[dict]) -> str:
    if not prior:
        return f'Topic: "{question}"\n\nGive your perspective.'
    context = "\n".join(f"{r['ai_name']}: {r['content']}" for r in prior)
    return f'Topic: "{question}"\n\nPrior perspectives:\n{context}\n\nNow give YOUR distinct take.'


async def call_openai(question: str, prior: list[dict], api_key: str) -> str:
    client = AsyncOpenAI(api_key=api_key)
    resp = await client.chat.completions.create(
        model="gpt-4o",
        max_tokens=300,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": _build_user_msg(question, prior)},
        ],
    )
    return resp.choices[0].message.content.strip()


async def call_gemini(question: str, prior: list[dict], api_key: str) -> str:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash-latest")
    prompt = SYSTEM_PROMPT + "\n\n" + _build_user_msg(question, prior)
    resp = await asyncio.to_thread(model.generate_content, prompt)
    return resp.text.strip()


async def call_claude(question: str, prior: list[dict], api_key: str) -> str:
    client = AsyncAnthropic(api_key=api_key)
    resp = await client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=300,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": _build_user_msg(question, prior)}],
    )
    return resp.content[0].text.strip()


async def synthesize(question: str, responses: list[dict], api_key: str) -> str:
    all_views = "\n\n".join(f"{r['ai_name']}: {r['content']}" for r in responses)
    client = AsyncAnthropic(api_key=api_key)
    resp = await client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=400,
        system=SYNTHESIS_PROMPT,
        messages=[{"role": "user", "content": f'Question: "{question}"\n\nPerspectives:\n{all_views}'}],
    )
    return resp.content[0].text.strip()
