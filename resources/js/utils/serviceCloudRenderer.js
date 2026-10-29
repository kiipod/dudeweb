import { SERVICE_LOGOS, projectServiceLogos, serviceLogoUrl } from './serviceCloudGeometry.js'

const SVG_NS = 'http://www.w3.org/2000/svg'
let sequence = 0

export function loadServiceLogos(theme) {
    return Promise.all(SERVICE_LOGOS.map(name => new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = () => reject(new Error(`Service logo ${name} is unavailable`))
        image.src = serviceLogoUrl(name, theme)
    })))
}

export function createServiceCloudRenderer(svg) {
    const id = `service-cloud-${++sequence}`
    const document = svg.ownerDocument
    let width = 0
    let height = 0
    let disposed = false

    function element(tag, attributes = {}) {
        const node = document.createElementNS(SVG_NS, tag)
        for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value)
        return node
    }

    const defs = element('defs')
    const gradient = element('radialGradient', {
        id: `${id}-fade`, gradientUnits: 'userSpaceOnUse', cx: 0, cy: 0, r: 1,
    })
    // Approximate the Pen shader's smoothstep with a piecewise linear gradient.
    for (let index = 0; index <= 32; index++) {
        const progress = index / 32
        gradient.append(element('stop', {
            offset: (0.34 + 0.36 * progress) / 0.70,
            'stop-color': '#fff',
            'stop-opacity': 0.20 + 0.65 * progress * progress * (3 - 2 * progress),
        }))
    }
    const mask = element('mask', {
        id: `${id}-mask`, maskUnits: 'userSpaceOnUse', 'mask-type': 'alpha', x: 0, y: 0,
    })
    const coverage = element('rect', { fill: `url(#${id}-fade)` })
    mask.append(coverage)
    defs.append(gradient, mask)
    const group = element('g', { 'pointer-events': 'none' })
    const images = SERVICE_LOGOS.map(name => {
        const image = element('image', { 'data-service': name, preserveAspectRatio: 'xMidYMid meet' })
        group.append(image)
        return image
    })
    svg.append(defs, group)

    return {
        setTheme(theme) {
            if (disposed) return
            images.forEach((image, index) => image.setAttribute('href', serviceLogoUrl(SERVICE_LOGOS[index], theme)))
        },
        resize(nextWidth, nextHeight) {
            if (disposed || (width === nextWidth && height === nextHeight)) return
            width = nextWidth
            height = nextHeight
            svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
            mask.setAttribute('width', width)
            mask.setAttribute('height', height)
            coverage.setAttribute('width', width)
            coverage.setAttribute('height', height)
            gradient.setAttribute('gradientTransform', `translate(${width / 2} ${height / 2}) scale(${width * 0.72 * 0.70} ${height * 0.90 * 0.70})`)
        },
        draw(scene) {
            if (disposed) return
            if (scene.orbit) group.setAttribute('mask', `url(#${id}-mask)`)
            else group.removeAttribute('mask')
            projectServiceLogos({ ...scene, width, height }).forEach((logo, index) => {
                const image = images[index]
                image.setAttribute('x', logo.x)
                image.setAttribute('y', logo.y)
                image.setAttribute('width', logo.size)
                image.setAttribute('height', logo.size)
                image.setAttribute('opacity', logo.opacity)
            })
        },
        destroy() {
            if (disposed) return
            disposed = true
            defs.remove()
            group.remove()
        },
    }
}
