<script setup>
defineProps({ kind: { type: String, required: true } })
</script>

<template>
    <div class="flex h-advantage-scene items-center justify-center overflow-hidden rounded-panel bg-accent-soft text-accent-text" aria-hidden="true">
        <svg class="h-full w-full" viewBox="0 0 320 160" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M24 40H296M24 80H296M24 120H296M80 16V144M160 16V144M240 16V144" stroke-opacity=".08" />
            <template v-if="kind === 'zap'">
                <rect x="88" y="54" width="144" height="52" rx="26" fill="currentColor" fill-opacity=".08" />
                <path class="scene-trace" d="M40 80H88M232 80H280" stroke-dasharray="5 7" />
                <g class="scene-switch"><circle cx="116" cy="80" r="20" fill="currentColor" fill-opacity=".18" /><path d="M119 67L108 82H119L113 94L126 77H115Z" /></g>
            </template>
            <template v-else-if="kind === 'gauge'">
                <path d="M80 120A80 80 0 0 1 240 120" stroke-opacity=".2" stroke-width="8" />
                <path class="scene-trace" d="M80 120A80 80 0 0 1 240 120" pathLength="100" stroke-dasharray="70 100" stroke-width="8" />
                <g class="scene-needle"><path d="M160 120L205 61" stroke-width="4" /><circle cx="160" cy="120" r="7" fill="currentColor" /></g>
                <path d="M102 114H112M124 63L130 72M196 63L190 72M218 114H208" />
            </template>
            <template v-else-if="kind === 'monitor-smartphone'">
                <g class="scene-device"><rect x="75" y="32" width="144" height="88" rx="8" /><path d="M147 120V134M123 134H171" /><path d="M127 76L141 90L168 63" stroke-width="3" /></g>
                <g class="scene-float"><rect x="205" y="65" width="42" height="72" rx="8" fill="var(--color-accent-soft)" /><path d="M220 126H232M217 96L224 103L237 89" /></g>
            </template>
            <template v-else-if="kind === 'shield-check'">
                <circle class="scene-ring" cx="160" cy="80" r="61" stroke-opacity=".2" stroke-dasharray="4 8" />
                <path d="M160 31L200 47V80C200 104 183 121 160 131C137 121 120 104 120 80V47Z" fill="currentColor" fill-opacity=".08" />
                <path class="scene-check" d="M141 79L154 92L180 65" stroke-width="4" />
            </template>
            <template v-else-if="kind === 'infinity'">
                <path d="M160 80C109 6 52 52 80 95C105 133 142 97 160 80C211 6 268 52 240 95C215 133 178 97 160 80Z" stroke-opacity=".18" stroke-width="12" />
                <path class="scene-flow" d="M160 80C109 6 52 52 80 95C105 133 142 97 160 80C211 6 268 52 240 95C215 133 178 97 160 80Z" pathLength="100" stroke-dasharray="18 82" stroke-width="4" />
            </template>
            <template v-else>
                <path d="M84 40H204A12 12 0 0 1 216 52V94A12 12 0 0 1 204 106H125L100 124V106H84A12 12 0 0 1 72 94V52A12 12 0 0 1 84 40Z" fill="currentColor" fill-opacity=".06" />
                <g class="scene-dots" fill="currentColor" stroke="none"><circle cx="116" cy="74" r="5" /><circle cx="144" cy="74" r="5" /><circle cx="172" cy="74" r="5" /></g>
                <g class="scene-float"><circle cx="224" cy="108" r="25" fill="var(--color-accent-soft)" /><path d="M213 108L221 116L235 101" stroke-width="3" /></g>
            </template>
        </svg>
    </div>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
    [data-playing="true"] .scene-switch { animation: switch-on var(--advantage-play-duration) ease both; }
    [data-playing="true"] .scene-needle { transform-origin: 160px 120px; animation: needle var(--advantage-play-duration) ease both; }
    [data-playing="true"] .scene-float,
    [data-playing="true"] .scene-device { animation: float-up var(--advantage-play-duration) ease both; }
    [data-playing="true"] .scene-ring { transform-origin: 160px 80px; animation: orbit var(--advantage-play-duration) ease both; }
    [data-playing="true"] .scene-check { animation: check-in var(--advantage-play-duration) ease both; }
    [data-playing="true"] .scene-flow,
    [data-playing="true"] .scene-trace { animation: flow var(--advantage-play-duration) ease both; }
    [data-playing="true"] .scene-dots { animation: dots var(--advantage-play-duration) ease both; }
}
@keyframes switch-on { 35%, 70% { transform: translateX(88px); } }
@keyframes needle { 35% { transform: rotate(24deg); } 65% { transform: rotate(-10deg); } }
@keyframes float-up { 40% { transform: translateY(-8px); } 70% { transform: translateY(2px); } }
@keyframes orbit { to { transform: rotate(120deg); } }
@keyframes check-in { 30% { opacity: .2; } 65% { opacity: 1; stroke-width: 6; } }
@keyframes flow { to { stroke-dashoffset: -100; } }
@keyframes dots { 30%, 70% { transform: translateY(-6px); opacity: .4; } 50% { transform: translateY(0); opacity: 1; } }
</style>
