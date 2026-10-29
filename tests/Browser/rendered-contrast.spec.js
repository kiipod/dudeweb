import { expect, test } from '@playwright/test'
import { writeFile } from 'node:fs/promises'
import { projectServiceLogos } from '../../resources/js/utils/serviceCloudGeometry.js'
import { penFixture, penFrames } from './helpers/penVerification.js'
import { inspectRenderedTextContrast } from './helpers/renderedContrast.js'

for (const theme of ['light', 'dark']) for (const width of [360, 390, 768, 1440, 2560]) {
    for (const variant of ['services', 'signal-orbit']) {
        test(`painted text backgrounds ${variant} ${width} ${theme}`, async ({ page, request }, info) => {
            await page.setViewportSize({ width, height: width === 2560 ? 1440 : 1080 })
            await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
            if (variant === 'signal-orbit') await page.route('**/images/hero/services/brands/*.svg', route => route.abort('failed'))
            await penFixture(page, request, penFrames.find(frame => frame.id === 'OidTs'))
            const hero = page.locator(variant === 'services' ? '.service-hero' : '.landing-hero')
            const scenes = []
            if (variant === 'services') {
                const cloud = page.locator('.service-logo-cloud')
                await expect(cloud).toHaveAttribute('data-state', 'ready')
                // Sample exact production projection at fixed poses while the
                // runtime stays paused. This does not claim native motion smoke.
                const bounds = await cloud.boundingBox()
                for (const time of [0, 15, 30, 60]) {
                    const logos = projectServiceLogos({ width: bounds.width, height: bounds.height, time, orbit: width < 1200, staticMotion: false, rotation: [time * .03, time * .105] })
                    await cloud.locator('image').evaluateAll((images, logos) => {
                        images.forEach((image, index) => {
                            const logo = logos[index]
                            for (const [attribute, value] of Object.entries({ x: logo.x, y: logo.y, width: logo.size, height: logo.size, opacity: logo.opacity })) image.setAttribute(attribute, value)
                        })
                    }, logos)
                    const path = info.outputPath(`hero-pose-${time}.png`)
                    await hero.screenshot({ path, scale: 'css' })
                    scenes.push({ time, rows: await inspectRenderedTextContrast(page, hero) })
                }
            } else {
                await expect(page.locator('.landing-hero__signal')).toBeVisible()
                scenes.push({ time: 0, rows: await inspectRenderedTextContrast(page, hero) })
            }
            if (variant === 'services') scenes.push({ section: 'final-cta', rows: await inspectRenderedTextContrast(page, page.locator('.landing-final__panel')) })
            await writeFile(info.outputPath('painted-background-contrast.json'), JSON.stringify(scenes, null, 2))
            await info.attach('painted-background-contrast', { path: info.outputPath('painted-background-contrast.json'), contentType: 'application/json' })
            for (const scene of scenes) {
                expect(scene.rows.length).toBe(scene.section === 'final-cta' ? 5 : 6)
                expect(scene.rows.every(row => row.samples > 0)).toBe(true)
                expect(scene.rows.every(row => row.opacity === 1), 'Opacity groups require a separate compositing review').toBe(true)
                expect(scene.rows.filter(row => row.backgroundMethod === 'solid-text-outline').length).toBe(scene.section === 'final-cta' ? 0 : 4)
                expect(scene.rows.filter(row => row.minimum < row.required).map(({ label, minimum, required }) => ({ label, minimum, required })), `${variant} ${width} ${theme}, pose ${scene.time ?? scene.section}`).toEqual([])
            }
        })
    }
}
