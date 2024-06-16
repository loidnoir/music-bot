import puppeteer from 'puppeteer';

export default async function (prompt: string) {
	const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disabled-setupid-sandbox"] })
	const page = await browser.newPage()

	try {
		await page.goto('https://genius.com', { waitUntil: 'networkidle0' })
		await page.screenshot({ path: 'screen.png' });

		await page.waitForSelector('input[name="q"]')
		await page.type('input[name="q"]', prompt)
		await page.keyboard.press('Enter')

		await page.waitForNavigation({ waitUntil: 'networkidle0' })

		await page.waitForSelector('mini-song-card')
		const firstResultSelector = 'mini-song-card > a'
		await page.click(firstResultSelector)

		await page.waitForSelector('div[data-lyrics-container="true"]', {
			visible: true,
		})

		const lyricsContainerSelector = 'div[data-lyrics-container="true"]'

		const lyricsContent = await page.$$eval(lyricsContainerSelector, (lc) => {
			let result = ''
			lc.forEach((lyricsContainer) => {
				const walker = document.createTreeWalker(
					lyricsContainer,
					NodeFilter.SHOW_ALL,
				)

				let node

				while ((node = walker.nextNode())) {
					if (node.nodeType == Node.ELEMENT_NODE) {
						const element = node as HTMLElement
						if (element.tagName.toLowerCase() == 'br') {
							result += '\n'
						}
					} else if (node.nodeType === Node.TEXT_NODE) {
						result += node.textContent?.trim() ?? ''
					}
				}

				result += '\n'
			})
			return result
		})

		return lyricsContent
	} catch (error) {
		console.error('Error:', error)
	} finally {
		await browser.close()
	}
}
