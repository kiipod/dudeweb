<script setup>
defineProps({ kind: { type: String, required: true } })

const STREAMS = [
    'M-40 25C100 25 110 120 240 120S390 70 520 70',
    'M-40 45C100 45 110 125 240 125S390 90 520 90',
    'M-40 65C100 65 110 130 240 130S390 110 520 110',
    'M-40 85C100 85 110 135 240 135S390 130 520 130',
    'M-40 105C100 105 110 140 240 140S390 150 520 150',
    'M-40 125C100 125 110 145 240 145S390 170 520 170',
]
</script>

<template>
    <div class="feature-scene pointer-events-none relative flex h-advantage-art shrink-0 items-center justify-center overflow-hidden text-accent-text" :data-scene="kind" aria-hidden="true">
        <svg class="feature-scene__svg h-full w-full overflow-visible" viewBox="0 0 480 240" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" focusable="false">
            <template v-if="kind === 'zap'">
                <g class="motion-breathe" opacity=".25"><path v-for="path in STREAMS" :key="path" :d="path" /></g>
                <path class="motion-stream" :d="STREAMS[2]" stroke-width="2.5" stroke-dasharray="28 420" />
                <g class="motion-float">
                    <rect x="100" y="89" width="280" height="64" rx="32" class="scene-surface" />
                    <circle class="motion-pulse" cx="137" cy="121" r="7" fill="currentColor" stroke="none" />
                    <text x="160" y="128" class="scene-label">dudeweb</text>
                    <path class="motion-nudge" d="M330 121H350M343 114L350 121L343 128" />
                </g>
            </template>
            <template v-else-if="kind === 'gauge'">
                <g opacity=".14"><path d="M30 65H450M30 110H450M30 155H450M30 200H450" /></g>
                <path class="motion-stream" d="M-20 65H500" stroke-dasharray="90 310" />
                <path class="motion-stream motion-reverse" d="M-20 110H500" stroke-dasharray="140 260" stroke-width="3" />
                <path class="motion-stream" d="M-20 155H500" stroke-dasharray="60 340" />
                <g class="motion-float"><rect x="145" y="80" width="190" height="68" rx="14" class="scene-surface" /><path d="M166 125L182 109L197 116L216 97L231 104L253 89L272 100L306 85" stroke-width="2.5" /></g>
            </template>
            <template v-else-if="kind === 'monitor-smartphone'">
                <path class="motion-stream" d="M52 146C130 146 140 65 240 65S350 146 430 146" stroke-dasharray="14 22" opacity=".3" />
                <g class="motion-float"><rect x="112" y="55" width="220" height="128" rx="12" class="scene-surface" /><path d="M112 81H332M206 183V198M178 198H262" opacity=".4" /><circle cx="130" cy="69" r="2" fill="currentColor" /><circle cx="140" cy="69" r="2" fill="currentColor" opacity=".4" /><path class="motion-scan" d="M140 110H300M140 126H270M140 142H286" stroke-width="5" opacity=".35" /></g>
                <g class="motion-float motion-reverse"><rect x="300" y="112" width="62" height="100" rx="12" class="scene-surface" /><path d="M323 198H339M319 158L328 167L345 148" /></g>
            </template>
            <template v-else-if="kind === 'shield-check'">
                <g class="motion-orbit"><ellipse cx="240" cy="120" rx="112" ry="50" transform="rotate(-30 240 120)" opacity=".25" /><ellipse cx="240" cy="120" rx="112" ry="50" transform="rotate(30 240 120)" opacity=".25" /><circle cx="142" cy="66" r="5" fill="currentColor" /></g>
                <g class="motion-breathe"><rect x="207" y="105" width="66" height="56" rx="12" class="scene-surface" /><path d="M221 105V88A19 19 0 0 1 259 88V105" stroke-width="3" /><path d="M230 132L238 140L253 123" stroke-width="3" /></g>
            </template>
            <template v-else-if="kind === 'infinity'">
                <g class="motion-orbit"><ellipse cx="240" cy="120" rx="158" ry="62" opacity=".22" /><circle cx="82" cy="120" r="5" fill="currentColor" /><circle cx="398" cy="120" r="4" fill="currentColor" opacity=".4" /></g>
                <g class="motion-float"><rect x="95" y="75" width="115" height="40" rx="20" class="scene-surface" /><text x="152" y="100" class="scene-tag">Видео</text><rect x="255" y="124" width="126" height="40" rx="20" class="scene-surface" /><text x="318" y="149" class="scene-tag">Музыка</text><rect x="183" y="29" width="115" height="40" rx="20" class="scene-surface" /><text x="240" y="54" class="scene-tag">Работа</text></g>
            </template>
            <template v-else>
                <g opacity=".18"><path v-for="path in STREAMS" :key="path" :d="path" /></g>
                <g class="motion-float"><rect x="70" y="52" width="244" height="61" rx="18" class="scene-surface" /><path d="M97 76H260M97 89H211" opacity=".25" stroke-width="5" /></g>
                <g class="motion-float motion-reverse"><rect x="160" y="130" width="245" height="62" rx="18" class="scene-surface" /><g class="motion-pulse" fill="currentColor" stroke="none"><circle cx="194" cy="161" r="4" /><circle cx="212" cy="161" r="4" /><circle cx="230" cy="161" r="4" /></g><path d="M354 158L362 166L377 148" stroke-width="2.5" /></g>
            </template>
        </svg>
    </div>
</template>

<style scoped>
.feature-scene { --scene-duration: var(--advantage-idle-duration); }
.feature-scene__svg { max-width: var(--container-advantage-art); }
.scene-surface { fill: var(--color-landing-card); stroke: var(--color-accent-border); }
.scene-label, .scene-tag { fill: currentColor; stroke: none; font-family: var(--font-sans); }
.scene-label { font-size: 21px; font-weight: 500; }
.scene-tag { font-size: 18px; text-anchor: middle; }
.motion-float { animation: scene-float var(--scene-duration) ease-in-out infinite; }
.motion-stream { animation: scene-stream var(--scene-duration) linear infinite; }
.motion-pulse { animation: scene-pulse var(--scene-duration) ease-in-out infinite; }
.motion-breathe { animation: scene-breathe var(--scene-duration) ease-in-out infinite; transform-origin: 240px 120px; }
.motion-orbit { animation: scene-orbit calc(var(--scene-duration) * 3) linear infinite; transform-origin: 240px 120px; }
.motion-scan { animation: scene-scan var(--scene-duration) ease-in-out infinite; }
.motion-nudge { animation: scene-nudge var(--scene-duration) ease-in-out infinite; }
.motion-reverse { animation-direction: reverse; }
[data-active="true"] .feature-scene { --scene-duration: var(--advantage-active-duration); }
[data-motion-running="false"] .feature-scene :is(g, path, circle) { animation-play-state: paused; }
@media (width < 48rem) {
    .feature-scene:not([data-scene="zap"]):not([data-scene="shield-check"]) .feature-scene__svg { width: var(--advantage-mobile-art-width); max-width: none; flex-shrink: 0; }
}
@media (width >= 48rem) {
    .feature-scene[data-scene="heart-handshake"] { width: 50%; height: var(--spacing-advantage-banner); }
}
@media (prefers-reduced-motion: reduce), (forced-colors: active) {
    .feature-scene :is(g, path, circle) { animation: none; }
}
@keyframes scene-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes scene-stream { to { stroke-dashoffset: -440; } }
@keyframes scene-pulse { 0%, 100% { opacity: .4; } 50% { opacity: 1; } }
@keyframes scene-breathe { 0%, 100% { transform: scale(.97); opacity: .4; } 50% { transform: scale(1); opacity: .8; } }
@keyframes scene-orbit { to { transform: rotate(360deg); } }
@keyframes scene-scan { 0%, 100% { opacity: .2; } 50% { opacity: .7; } }
@keyframes scene-nudge { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(5px); } }
</style>
