import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto(f"file:///app/index.html")

        # Take a screenshot of the dashboard
        await page.set_viewport_size({"width": 1280, "height": 800})
        await page.screenshot(path="dashboard_board.png")
        print("Dashboard screenshot saved.")

        # Check for corkboard background
        bg = await page.evaluate("window.getComputedStyle(document.getElementById('dashboard')).backgroundColor")
        print(f"Dashboard background color: {bg}")

        await browser.close()

asyncio.run(run())
