import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto(f"file:///app/index.html")

        # Open Threat Hunter
        await page.click("text=Threat Hunter")
        await page.click("text=Start Mission")

        # Wait for processes to spawn
        await page.wait_for_selector("#process-list-body tr")

        # Check initial threats
        threat_count = await page.inner_text("#threats-remaining")
        print(f"Initial active threats: {threat_count}")

        # Terminate threats
        while True:
            rows = await page.query_selector_all("#process-list-body tr")
            terminated_any = False
            for row in rows:
                # We don't know which is threat easily from UI without looking at games.js
                # But we can try terminating all and see if we win
                btn = await row.query_selector("button")
                if btn:
                    await btn.click()
                    terminated_any = True
                    # Check if victory
                    if await page.is_visible("#hunter-victory:not(.hidden)"):
                        print("Victory screen detected!")
                        await page.screenshot(path="hunter_victory.png")
                        return
            if not terminated_any:
                break
            await asyncio.sleep(0.5)

        await browser.close()

asyncio.run(run())
