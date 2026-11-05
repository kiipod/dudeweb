// Owner-approved bento redesign supersedes only the earlier advantage-card geometry.
// Keep all other Pen roles and their assertions unchanged until the new design is synced.
export function advantageDesign(frame, shell) {
    const layout = shell.roles.find(role => role.kind === 'advantages-layout')
    const horizontal = typeof layout.padding === 'number' ? layout.padding : layout.padding[1]
    const content = layout.width - horizontal * 2
    const columns = frame.width < 1200 ? 2 : 6
    const gap = frame.width < 768 ? 12 : 16
    const spans = frame.width < 768 ? [2, 1, 1, 2, 1, 1] : frame.width < 1200 ? [2, 1, 1, 1, 1, 2] : [4, 2, 2, 2, 2, 6]
    return spans.map((span, index) => {
        const width = (content - (columns - 1) * gap) / columns * span + (span - 1) * gap
        return {
            width,
            height: index === 0 ? Math.min(448, Math.max(320, frame.width * .32)) : index === 3 ? 288 : index === 5 && frame.width >= 768 ? 304 : 352,
            scene: { width: index === 5 && frame.width >= 768 ? (width - 2) / 2 : width - 2,
                height: index === 5 && frame.width >= 768 ? 304 : Math.min(240, Math.max(136, frame.width * .2)) },
        }
    })
}

export function advantageRoles(frame, source) {
    if (frame.component !== 'Public/Home') return source.roles
    const designs = advantageDesign(frame, source)
    let card = 0, scene = 0
    return source.roles.map(role => {
        if (role.kind === 'feature') return { ...role, ...designs[card++], heightMode: 'minimum' }
        if (role.kind === 'feature-scene') return { ...role, ...designs[scene++].scene, radius: 0, fill: '#00000000' }
        return role
    })
}
