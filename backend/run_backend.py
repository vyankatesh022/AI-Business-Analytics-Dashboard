import sys
import asyncio

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

import uvicorn

if __name__ == "__main__":
    # loop="none" prevents uvicorn from overriding our event loop policy
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, loop="none", env_file=".env")
