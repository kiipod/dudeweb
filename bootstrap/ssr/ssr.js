import { computed, createSSRApp, createTextVNode, createVNode, h, mergeProps, nextTick, onBeforeUnmount, onMounted, readonly, resolveDynamicComponent, shallowRef, unref, useId, useSSRContext, useTemplateRef, watch, withCtx } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderSlot, ssrRenderTeleport, ssrRenderVNode } from "vue/server-renderer";
import { Head, Link, createInertiaApp } from "@inertiajs/vue3";
import { renderToString } from "@vue/server-renderer";
import createServer from "@inertiajs/vue3/server";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region resources/js/utils/serviceCloudGeometry.js
var SERVICE_LOGOS = [
	"instagram",
	"facebook",
	"threads",
	"x",
	"linkedin",
	"youtube",
	"telegram",
	"discord",
	"patreon",
	"onlyfans",
	"soundcloud",
	"spotify",
	"openai",
	"anthropic",
	"googlegemini",
	"steam",
	"tiktok",
	"signal",
	"airbnb",
	"bookingdotcom",
	"ubisoft",
	"ea",
	"netflix"
];
var LOGO_FOOTPRINT = 88 / 128;
var FIBONACCI_ANGLE = 2.399963;
function serviceLogoUrl(name, theme) {
	return `/images/hero/services/brands/${name}-${theme}.svg`;
}
function projectServiceLogos({ width, height, time, orbit, staticMotion, rotation }) {
	const minimum = Math.min(width, height);
	const t = staticMotion ? 0 : time;
	const [pitch, yaw] = staticMotion ? [0, 0] : rotation;
	const sinPitch = Math.sin(pitch), cosPitch = Math.cos(pitch);
	const sinYaw = Math.sin(yaw), cosYaw = Math.cos(yaw);
	return SERVICE_LOGOS.map((name, index) => {
		const angle = index * FIBONACCI_ANGLE;
		let x, y, size, opacity;
		if (orbit) {
			const ring = index % 3;
			const direction = ring === 1 ? -1 : 1;
			const phase = angle + t * (.08 + ring * .015) * direction;
			const radius = minimum * (.34 + ring * .18);
			x = width / 2 + Math.cos(phase) * radius;
			y = height / 2 + Math.sin(phase) * radius;
			size = Math.max(44, Math.min(72, width * .12));
			opacity = 1;
		} else {
			const vertical = 1 - 2 * (index + .5) / SERVICE_LOGOS.length;
			const radius = Math.sqrt(1 - vertical * vertical);
			const horizontal = Math.cos(angle) * radius;
			const z = Math.sin(angle) * radius;
			const xx = horizontal * cosYaw + z * sinYaw;
			const zYaw = -horizontal * sinYaw + z * cosYaw;
			const yy = vertical * cosPitch - zYaw * sinPitch;
			const zz = vertical * sinPitch + zYaw * cosPitch;
			const depth = 1 + zz * .24;
			x = width / 2 + xx * minimum * .37 * depth;
			y = height / 2 + yy * minimum * .37 * depth;
			size = minimum * .17 * depth;
			opacity = .38 + .62 * (zz + 1) / 2;
		}
		size *= LOGO_FOOTPRINT;
		return {
			name,
			x: x - size / 2,
			y: y - size / 2,
			size,
			opacity
		};
	});
}
//#endregion
//#region resources/js/utils/serviceCloudRenderer.js
var SVG_NS = "http://www.w3.org/2000/svg";
var sequence = 0;
function loadServiceLogos(theme) {
	return Promise.all(SERVICE_LOGOS.map((name) => new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = () => reject(/* @__PURE__ */ new Error(`Service logo ${name} is unavailable`));
		image.src = serviceLogoUrl(name, theme);
	})));
}
function createServiceCloudRenderer(svg) {
	const id = `service-cloud-${++sequence}`;
	const document = svg.ownerDocument;
	let width = 0;
	let height = 0;
	let disposed = false;
	function element(tag, attributes = {}) {
		const node = document.createElementNS(SVG_NS, tag);
		for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
		return node;
	}
	const defs = element("defs");
	const gradient = element("radialGradient", {
		id: `${id}-fade`,
		gradientUnits: "userSpaceOnUse",
		cx: 0,
		cy: 0,
		r: 1
	});
	for (let index = 0; index <= 32; index++) {
		const progress = index / 32;
		gradient.append(element("stop", {
			offset: (.34 + .36 * progress) / .7,
			"stop-color": "#fff",
			"stop-opacity": .2 + .65 * progress * progress * (3 - 2 * progress)
		}));
	}
	const mask = element("mask", {
		id: `${id}-mask`,
		maskUnits: "userSpaceOnUse",
		"mask-type": "alpha",
		x: 0,
		y: 0
	});
	const coverage = element("rect", { fill: `url(#${id}-fade)` });
	mask.append(coverage);
	defs.append(gradient, mask);
	const group = element("g", { "pointer-events": "none" });
	const images = SERVICE_LOGOS.map((name) => {
		const image = element("image", {
			"data-service": name,
			preserveAspectRatio: "xMidYMid meet"
		});
		group.append(image);
		return image;
	});
	svg.append(defs, group);
	return {
		setTheme(theme) {
			if (disposed) return;
			images.forEach((image, index) => image.setAttribute("href", serviceLogoUrl(SERVICE_LOGOS[index], theme)));
		},
		resize(nextWidth, nextHeight) {
			if (disposed || width === nextWidth && height === nextHeight) return;
			width = nextWidth;
			height = nextHeight;
			svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
			mask.setAttribute("width", width);
			mask.setAttribute("height", height);
			coverage.setAttribute("width", width);
			coverage.setAttribute("height", height);
			gradient.setAttribute("gradientTransform", `translate(${width / 2} ${height / 2}) scale(${width * .72 * .7} ${height * .9 * .7})`);
		},
		draw(scene) {
			if (disposed) return;
			if (scene.orbit) group.setAttribute("mask", `url(#${id}-mask)`);
			else group.removeAttribute("mask");
			projectServiceLogos({
				...scene,
				width,
				height
			}).forEach((logo, index) => {
				const image = images[index];
				image.setAttribute("x", logo.x);
				image.setAttribute("y", logo.y);
				image.setAttribute("width", logo.size);
				image.setAttribute("height", logo.size);
				image.setAttribute("opacity", logo.opacity);
			});
		},
		destroy() {
			if (disposed) return;
			disposed = true;
			defs.remove();
			group.remove();
		}
	};
}
//#endregion
//#region resources/js/composables/useServiceCloud.js
var HOVER_SPEED = 1.2;
var IDLE_SPEED = .105;
var DRAG_SPEED_LIMIT = 2.4;
var RESPONSE_SECONDS = .16;
var INERTIA_SECONDS = .4;
var REST_SPEED = .001;
function useServiceCloud(svgRef, { onUnavailable, createRenderer = createServiceCloudRenderer, loadLogos = loadServiceLogos } = {}) {
	const state = shallowRef("loading");
	const running = shallowRef(false);
	const interactive = shallowRef(false);
	const dragging = shallowRef(false);
	const rotation = [0, 0];
	const velocity = [0, 0];
	const targetVelocity = [0, 0];
	let pointer = null;
	let hovering = false;
	let dirty = false;
	let renderer = null;
	let frame = null;
	let previousTime = null;
	let elapsed = 0;
	let disposed = false;
	let inViewport = true;
	let hasSize = false;
	let logos = null;
	let renderedTheme = null;
	let reducedMotion = null;
	let forcedColors = null;
	let desktop = null;
	let finePointer = null;
	let resizeObserver = null;
	let intersectionObserver = null;
	let themeObserver = null;
	function stop() {
		if (frame !== null) window.cancelAnimationFrame(frame);
		frame = null;
		previousTime = null;
		running.value = false;
	}
	function canAnimate() {
		return renderer && logos && hasSize && inViewport && !document.hidden && !reducedMotion.matches && !forcedColors.matches && !disposed && (!desktop.matches || finePointer.matches);
	}
	function needsFrame() {
		if (!desktop.matches) return true;
		if (dragging.value) return dirty;
		if (!hovering) return true;
		return velocity.some((value) => Math.abs(value) > REST_SPEED) || targetVelocity.some((value) => value !== 0);
	}
	function queue() {
		if (frame !== null || !canAnimate() || !needsFrame()) return;
		running.value = true;
		frame = window.requestAnimationFrame(advance);
	}
	function resetInput() {
		const captured = pointer?.id;
		pointer = null;
		dragging.value = false;
		hovering = false;
		dirty = false;
		velocity.fill(0);
		targetVelocity.fill(0);
		if (captured !== void 0 && svgRef.value?.hasPointerCapture(captured)) svgRef.value.releasePointerCapture(captured);
	}
	function updateHover(event) {
		const bounds = svgRef.value.getBoundingClientRect();
		const clamp = (value) => Math.max(-1, Math.min(1, value));
		const x = clamp((event.clientX - bounds.left) / bounds.width * 2 - 1);
		const y = clamp((event.clientY - bounds.top) / bounds.height * 2 - 1);
		hovering = true;
		targetVelocity[0] = -y * HOVER_SPEED;
		targetVelocity[1] = x * HOVER_SPEED;
	}
	function onPointerMove(event) {
		if (!interactive.value || event.pointerType !== "mouse") return;
		if (!dragging.value) updateHover(event);
		else if (event.pointerId === pointer.id) {
			const bounds = svgRef.value.getBoundingClientRect();
			const scale = Math.PI / Math.min(bounds.width, bounds.height);
			const delta = Math.max(1 / 120, (event.timeStamp - pointer.time) / 1e3);
			[-(event.clientY - pointer.y) * scale, (event.clientX - pointer.x) * scale].forEach((angle, axis) => {
				rotation[axis] = (rotation[axis] + angle) % (Math.PI * 2);
				velocity[axis] = Math.max(-2.4, Math.min(DRAG_SPEED_LIMIT, angle / delta));
			});
			pointer = {
				id: event.pointerId,
				x: event.clientX,
				y: event.clientY,
				time: event.timeStamp
			};
			dirty = true;
		}
		queue();
	}
	function onPointerDown(event) {
		if (!interactive.value || event.pointerType !== "mouse" || event.button !== 0) return;
		event.preventDefault();
		stop();
		velocity.fill(0);
		targetVelocity.fill(0);
		dragging.value = true;
		pointer = {
			id: event.pointerId,
			x: event.clientX,
			y: event.clientY,
			time: event.timeStamp
		};
		svgRef.value.setPointerCapture(event.pointerId);
	}
	function onPointerUp(event) {
		if (!pointer || event.pointerId !== pointer.id) return;
		const captured = pointer.id;
		pointer = null;
		dragging.value = false;
		hovering = false;
		targetVelocity.fill(0);
		if (svgRef.value.hasPointerCapture(captured)) svgRef.value.releasePointerCapture(captured);
		queue();
	}
	function onPointerLeave() {
		if (dragging.value) return;
		hovering = false;
		targetVelocity.fill(0);
		queue();
	}
	function onPointerCancel() {
		if (!dragging.value) return;
		resetInput();
		stop();
		queue();
	}
	function draw() {
		if (!renderer || !logos || disposed || forcedColors.matches) return;
		const bounds = svgRef.value.getBoundingClientRect();
		hasSize = bounds.width > 0 && bounds.height > 0;
		if (!hasSize) return;
		const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
		if (renderedTheme !== theme) {
			renderer.setTheme(theme);
			renderedTheme = theme;
		}
		renderer.resize(bounds.width, bounds.height);
		renderer.draw({
			time: elapsed,
			orbit: !desktop.matches,
			staticMotion: reducedMotion.matches || desktop.matches && !finePointer.matches,
			rotation: [...rotation]
		});
		dirty = false;
	}
	function advance(timestamp) {
		frame = null;
		if (!canAnimate()) {
			draw();
			resetInput();
			interactive.value = false;
			stop();
			return;
		}
		const delta = previousTime === null ? 0 : Math.max(0, Math.min(timestamp - previousTime, 64)) / 1e3;
		if (!desktop.matches) elapsed += delta;
		else if (!dragging.value) for (let axis = 0; axis < 2; axis++) {
			const target = hovering ? targetVelocity[axis] : axis === 1 ? IDLE_SPEED : 0;
			const response = hovering ? RESPONSE_SECONDS : INERTIA_SECONDS;
			velocity[axis] += (target - velocity[axis]) * (1 - Math.exp(-delta / response));
			if (Math.abs(velocity[axis] - target) < REST_SPEED) velocity[axis] = target;
			rotation[axis] = (rotation[axis] + velocity[axis] * delta) % (Math.PI * 2);
		}
		previousTime = timestamp;
		draw();
		if (needsFrame()) frame = window.requestAnimationFrame(advance);
		else stop();
	}
	function refresh() {
		stop();
		resetInput();
		draw();
		interactive.value = Boolean(canAnimate() && desktop.matches && finePointer.matches);
		queue();
	}
	function fail() {
		if (disposed || state.value === "unavailable") return;
		stop();
		resetInput();
		interactive.value = false;
		renderer?.destroy();
		renderer = null;
		state.value = "unavailable";
		onUnavailable?.();
	}
	onMounted(async () => {
		reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
		forcedColors = window.matchMedia("(forced-colors: active)");
		desktop = window.matchMedia("(min-width: 75rem)");
		finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
		reducedMotion.addEventListener("change", refresh);
		forcedColors.addEventListener("change", refresh);
		desktop.addEventListener("change", refresh);
		finePointer.addEventListener("change", refresh);
		document.addEventListener("visibilitychange", refresh);
		window.addEventListener("resize", refresh, { passive: true });
		window.addEventListener("blur", refresh);
		window.addEventListener("scroll", refresh, { passive: true });
		resizeObserver = new ResizeObserver(refresh);
		resizeObserver.observe(svgRef.value);
		intersectionObserver = new IntersectionObserver((entries) => {
			inViewport = entries[0]?.isIntersecting ?? false;
			refresh();
		});
		intersectionObserver.observe(svgRef.value);
		themeObserver = new MutationObserver(refresh);
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"]
		});
		try {
			renderer = createRenderer(svgRef.value);
			const [light, dark] = await Promise.all([loadLogos("light"), loadLogos("dark")]);
			if (disposed) return;
			logos = {
				light,
				dark
			};
			state.value = "ready";
			refresh();
		} catch {
			fail();
		}
	});
	onBeforeUnmount(() => {
		disposed = true;
		stop();
		resetInput();
		reducedMotion?.removeEventListener("change", refresh);
		forcedColors?.removeEventListener("change", refresh);
		desktop?.removeEventListener("change", refresh);
		finePointer?.removeEventListener("change", refresh);
		document.removeEventListener("visibilitychange", refresh);
		window.removeEventListener("resize", refresh);
		window.removeEventListener("blur", refresh);
		window.removeEventListener("scroll", refresh);
		resizeObserver?.disconnect();
		intersectionObserver?.disconnect();
		themeObserver?.disconnect();
		renderer?.destroy();
		renderer = null;
		logos = null;
	});
	return {
		state: readonly(state),
		running: readonly(running),
		interactive: readonly(interactive),
		dragging: readonly(dragging),
		onPointerMove,
		onPointerDown,
		onPointerUp,
		onPointerLeave,
		onPointerCancel
	};
}
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region resources/js/components/public/hero/ServiceLogoCloud.vue
var _sfc_main$16 = {
	__name: "ServiceLogoCloud",
	__ssrInlineRender: true,
	emits: ["unavailable"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const cloud = useTemplateRef("cloud");
		const { state, running, interactive, dragging, onPointerMove, onPointerDown, onPointerUp, onPointerLeave, onPointerCancel } = useServiceCloud(cloud, { onUnavailable: () => emit("unavailable") });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<svg${ssrRenderAttrs(mergeProps({
				ref_key: "cloud",
				ref: cloud,
				"data-state": unref(state),
				"data-running": unref(running),
				"data-interactive": unref(interactive),
				"data-dragging": unref(dragging),
				xmlns: "http://www.w3.org/2000/svg",
				"aria-hidden": "true",
				focusable: "false",
				class: ["service-logo-cloud block", unref(interactive) ? "pointer-events-auto cursor-grab active:cursor-grabbing" : "pointer-events-none"]
			}, _attrs))} data-v-34a8f2bf></svg>`);
		};
	}
};
var _sfc_setup$16 = _sfc_main$16.setup;
_sfc_main$16.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/hero/ServiceLogoCloud.vue");
	return _sfc_setup$16 ? _sfc_setup$16(props, ctx) : void 0;
};
var ServiceLogoCloud_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$16, [["__scopeId", "data-v-34a8f2bf"]]);
//#endregion
//#region resources/js/components/public/hero/ServiceCloudHero.vue
var PRIMARY_ACTION_CLASSES$1 = "inline-flex min-h-13 items-center justify-center rounded-button border border-accent-hover bg-accent px-panel text-hero-action-mobile font-normal text-accent-foreground transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-14 tablet:px-0 tablet:text-hero-action-tablet desktop:min-h-hero-action-wide desktop:px-panel desktop:text-hero-action-wide";
var SECONDARY_ACTION_CLASSES$1 = "inline-flex min-h-13 items-center justify-center rounded-button border border-hero-secondary-border bg-hero-secondary px-panel text-hero-action-mobile font-normal text-hero-secondary-foreground transition-colors duration-200 hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-14 tablet:px-0 tablet:text-hero-action-tablet desktop:min-h-hero-action-wide desktop:px-panel desktop:text-hero-action-wide";
var _sfc_main$15 = {
	__name: "ServiceCloudHero",
	__ssrInlineRender: true,
	emits: ["unavailable"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				class: "service-hero relative h-hero-mobile overflow-hidden bg-background tablet:h-hero-tablet desktop:h-hero-wide",
				"aria-labelledby": "hero-title"
			}, _attrs))} data-v-19ea7e56><div class="service-hero__layout" data-v-19ea7e56>`);
			_push(ssrRenderComponent(ServiceLogoCloud_default, {
				class: "service-hero__cloud",
				onUnavailable: ($event) => emit("unavailable")
			}, null, _parent));
			_push(`<div class="service-hero__content" data-v-19ea7e56><p class="service-hero__eyebrow font-mono font-bold text-hero-eyebrow" data-v-19ea7e56> HEY, DUDE! </p><h1 id="hero-title" class="service-hero__heading font-display text-foreground" data-v-19ea7e56> Любимые сервисы<br data-v-19ea7e56> снова рядом </h1><p class="service-hero__description text-hero-copy" data-v-19ea7e56> dudeweb помогает пользоваться любимыми сервисами для работы, развлечений и общения — просто и без лишних сложностей. </p><div class="service-hero__actions" data-v-19ea7e56>`);
			_push(ssrRenderComponent(unref(Link), {
				href: "/register",
				class: PRIMARY_ACTION_CLASSES$1
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Попробовать бесплатно `);
					else return [createTextVNode(" Попробовать бесплатно ")];
				}),
				_: 1
			}, _parent));
			_push(`<a href="#pricing" class="${ssrRenderClass(SECONDARY_ACTION_CLASSES$1)}" data-v-19ea7e56> Посмотреть тариф </a></div><p class="service-hero__trial font-mono text-hero-meta" data-v-19ea7e56> 3 дня бесплатно · До 5 устройств </p></div></div></section>`);
		};
	}
};
var _sfc_setup$15 = _sfc_main$15.setup;
_sfc_main$15.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/hero/ServiceCloudHero.vue");
	return _sfc_setup$15 ? _sfc_setup$15(props, ctx) : void 0;
};
var ServiceCloudHero_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$15, [["__scopeId", "data-v-19ea7e56"]]);
//#endregion
//#region resources/js/utils/signalOrbitGeometry.js
var SIGNAL_ORBIT_PATH = "M154 10c61-12 132 24 138 82 6 50-37 68-23 119 13 47-47 91-111 77-54-12-70-44-115-64-42-19-49-82-20-130 27-44 69-36 97-69 11-12 22-15 34-15z";
var START = [154, 10];
var CURVES = [
	[
		[215, -2],
		[286, 34],
		[292, 92]
	],
	[
		[298, 142],
		[255, 160],
		[269, 211]
	],
	[
		[282, 258],
		[222, 302],
		[158, 288]
	],
	[
		[104, 276],
		[88, 244],
		[43, 224]
	],
	[
		[1, 205],
		[-6, 142],
		[23, 94]
	],
	[
		[50, 50],
		[92, 58],
		[120, 25]
	],
	[
		[131, 13],
		[142, 10],
		[154, 10]
	]
];
var REST_THRESHOLD = 5e-4;
var EPSILON = 1e-9;
function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}
function cubicValue(start, first, second, end, time) {
	const inverse = 1 - time;
	return inverse ** 3 * start + 3 * inverse ** 2 * time * first + 3 * inverse * time ** 2 * second + time ** 3 * end;
}
function extrema(start, first, second, end) {
	const quadratic = -start + 3 * first - 3 * second + end;
	const linear = 2 * (start - 2 * first + second);
	const constant = first - start;
	if (Math.abs(quadratic) < EPSILON) return Math.abs(linear) < EPSILON ? [] : [-constant / linear];
	const discriminant = linear ** 2 - 4 * quadratic * constant;
	if (discriminant < 0) return [];
	const root = Math.sqrt(discriminant);
	return [(-linear + root) / (2 * quadratic), (-linear - root) / (2 * quadratic)];
}
function boundsOf(start, curves) {
	const axes = [[start[0]], [start[1]]];
	let previous = start;
	for (const [first, second, end] of curves) {
		for (const axis of [0, 1]) {
			axes[axis].push(end[axis]);
			for (const time of extrema(previous[axis], first[axis], second[axis], end[axis])) if (time > 0 && time < 1) axes[axis].push(cubicValue(previous[axis], first[axis], second[axis], end[axis], time));
		}
		previous = end;
	}
	return axes.map((values) => ({
		min: Math.min(...values),
		max: Math.max(...values)
	}));
}
var SOURCE_BOUNDS = boundsOf(START, CURVES);
var MAX_DISPLACEMENT = 48;
var MAX_SQUASH = .2;
/** Bend with pointer momentum and squash across its direction, inside the Pen envelope. */
function deformSignalOrbit({ x = .5, y = .5, dx = 0, dy = 0 } = {}) {
	const impulseX = clamp(dx, -1, 1);
	const impulseY = clamp(dy, -1, 1);
	if (Math.abs(impulseX) < REST_THRESHOLD && Math.abs(impulseY) < REST_THRESHOLD) return SIGNAL_ORBIT_PATH;
	const pointerX = clamp(x, 0, 1);
	const pointerY = clamp(y, 0, 1);
	const energy = Math.min(1, Math.hypot(impulseX, impulseY));
	const horizontal = Math.abs(impulseX) / (Math.abs(impulseX) + Math.abs(impulseY));
	const scales = [1 - MAX_SQUASH * energy * (1 - horizontal), 1 - MAX_SQUASH * energy * horizontal];
	const warp = (point) => {
		const u = (point[0] - SOURCE_BOUNDS[0].min) / (SOURCE_BOUNDS[0].max - SOURCE_BOUNDS[0].min);
		const v = (point[1] - SOURCE_BOUNDS[1].min) / (SOURCE_BOUNDS[1].max - SOURCE_BOUNDS[1].min);
		const distance = (u - pointerX) ** 2 + (v - pointerY) ** 2;
		const influence = .3 + .7 * Math.exp(-distance / .4);
		return [point[0] + impulseX * MAX_DISPLACEMENT * Math.sin(Math.PI * clamp(u, 0, 1)) * influence, point[1] + impulseY * MAX_DISPLACEMENT * Math.sin(Math.PI * clamp(v, 0, 1)) * influence];
	};
	const start = warp(START);
	const curves = CURVES.map((curve) => curve.map(warp));
	const bounds = boundsOf(start, curves);
	const normalize = (point) => point.map((value, axis) => {
		const source = SOURCE_BOUNDS[axis];
		const deformed = bounds[axis];
		const size = (source.max - source.min) * scales[axis];
		const inset = (source.max - source.min - size) / 2;
		const normalized = source.min + inset + (value - deformed.min) * size / (deformed.max - deformed.min);
		return Number(normalized.toFixed(4));
	});
	const command = (point) => normalize(point).join(" ");
	return `M${command(start)}${curves.map((curve) => `C${curve.map(command).join(" ")}`).join("")}z`;
}
//#endregion
//#region resources/js/composables/useSignalOrbitPointer.js
var INTERACTION_QUERY = "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine) and (forced-colors: none)";
var IMPULSE_DISTANCE = 55;
var DECAY_TIME = 200;
var RESPONSE_TIME = 60;
var SETTLE_THRESHOLD = .001;
var SAMPLE_TIMEOUT = 160;
function useSignalOrbitPointer(heroRef, signalRef) {
	const signalPath = shallowRef(SIGNAL_ORBIT_PATH);
	let interactionQuery = null;
	let animationFrame = null;
	let previousFrameTime = null;
	let themeObserver = null;
	let previousPointer = null;
	let pointer = {
		x: .5,
		y: .5
	};
	let target = {
		x: 0,
		y: 0
	};
	let current = {
		x: 0,
		y: 0
	};
	function stopMotion() {
		if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
		animationFrame = null;
		previousFrameTime = null;
		previousPointer = null;
		target = {
			x: 0,
			y: 0
		};
		current = {
			x: 0,
			y: 0
		};
		signalPath.value = SIGNAL_ORBIT_PATH;
	}
	function advance(timestamp) {
		animationFrame = null;
		const elapsed = previousFrameTime === null ? 1e3 / 60 : Math.min(timestamp - previousFrameTime, 64);
		previousFrameTime = timestamp;
		const response = 1 - Math.exp(-elapsed / RESPONSE_TIME);
		const decay = Math.exp(-elapsed / DECAY_TIME);
		current.x += (target.x - current.x) * response;
		current.y += (target.y - current.y) * response;
		target.x *= decay;
		target.y *= decay;
		if (Math.max(Math.abs(current.x), Math.abs(current.y), Math.abs(target.x), Math.abs(target.y)) < SETTLE_THRESHOLD) {
			stopMotion();
			return;
		}
		signalPath.value = deformSignalOrbit({
			...pointer,
			dx: current.x,
			dy: current.y
		});
		animationFrame = window.requestAnimationFrame(advance);
	}
	function queueMotion() {
		if (animationFrame === null) {
			previousFrameTime = null;
			animationFrame = window.requestAnimationFrame(advance);
		}
	}
	function resetPointer() {
		previousPointer = null;
		target = {
			x: 0,
			y: 0
		};
	}
	function onPointerMove(event) {
		if (!interactionQuery?.matches || document.hidden || event.pointerType !== "mouse" || event.buttons !== 0) {
			stopMotion();
			return;
		}
		if (event.target instanceof Element && event.target.closest("a, button, input, select, textarea, [role=\"button\"]")) {
			resetPointer();
			return;
		}
		const hero = heroRef.value;
		const signal = signalRef.value;
		if (!hero || !signal) return;
		const bounds = signal.getBoundingClientRect();
		const sample = {
			x: event.clientX,
			y: event.clientY,
			time: event.timeStamp
		};
		const previous = previousPointer;
		previousPointer = sample;
		if (!previous || sample.time - previous.time > SAMPLE_TIMEOUT || bounds.width === 0 || bounds.height === 0) return;
		pointer = {
			x: Math.min(1, Math.max(0, (sample.x - bounds.left) / bounds.width)),
			y: Math.min(1, Math.max(0, (sample.y - bounds.top) / bounds.height))
		};
		target.x = Math.min(1, Math.max(-1, target.x + (sample.x - previous.x) / IMPULSE_DISTANCE));
		target.y = Math.min(1, Math.max(-1, target.y + (sample.y - previous.y) / IMPULSE_DISTANCE));
		if (target.x !== 0 || target.y !== 0) queueMotion();
	}
	onMounted(() => {
		interactionQuery = window.matchMedia(INTERACTION_QUERY);
		interactionQuery.addEventListener("change", stopMotion);
		window.addEventListener("blur", stopMotion);
		window.addEventListener("resize", stopMotion, { passive: true });
		window.addEventListener("scroll", stopMotion, { passive: true });
		document.addEventListener("visibilitychange", stopMotion);
		themeObserver = new MutationObserver(stopMotion);
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"]
		});
	});
	onBeforeUnmount(() => {
		stopMotion();
		interactionQuery?.removeEventListener("change", stopMotion);
		window.removeEventListener("blur", stopMotion);
		window.removeEventListener("resize", stopMotion);
		window.removeEventListener("scroll", stopMotion);
		document.removeEventListener("visibilitychange", stopMotion);
		themeObserver?.disconnect();
	});
	return {
		signalPath: readonly(signalPath),
		onPointerMove,
		resetPointer
	};
}
//#endregion
//#region resources/js/components/public/hero/SignalOrbitHero.vue
var PRIMARY_ACTION_CLASSES = "inline-flex min-h-13 items-center justify-center rounded-button border border-accent-hover bg-accent px-panel text-hero-action-mobile font-normal text-accent-foreground transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-14 tablet:px-0 tablet:text-hero-action-tablet desktop:min-h-hero-action-wide desktop:px-panel desktop:text-hero-action-wide";
var SECONDARY_ACTION_CLASSES = "inline-flex min-h-13 items-center justify-center rounded-button border border-hero-secondary-border bg-hero-secondary px-panel text-hero-action-mobile font-normal text-hero-secondary-foreground transition-colors duration-200 hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-14 tablet:px-0 tablet:text-hero-action-tablet desktop:min-h-hero-action-wide desktop:px-panel desktop:text-hero-action-wide";
var _sfc_main$14 = {
	__name: "SignalOrbitHero",
	__ssrInlineRender: true,
	setup(__props) {
		const { signalPath, onPointerMove, resetPointer } = useSignalOrbitPointer(useTemplateRef("hero"), useTemplateRef("signal"));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				ref: "hero",
				class: "landing-hero",
				"aria-labelledby": "hero-title"
			}, _attrs))} data-v-e0d90bc5><div class="landing-hero__layout" data-v-e0d90bc5><svg aria-hidden="true" class="landing-hero__signal" viewBox="0 0 300 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" data-v-e0d90bc5><defs data-v-e0d90bc5><linearGradient id="hero-signal-top" x1="0" y1="0" x2="1" y2="0" data-v-e0d90bc5><stop offset="0" stop-color="var(--ui-hero-blob-1)" data-v-e0d90bc5></stop><stop offset="1" stop-color="var(--ui-hero-blob-2)" data-v-e0d90bc5></stop></linearGradient><linearGradient id="hero-signal-bottom" x1="0" y1="0" x2="1" y2="0" data-v-e0d90bc5><stop offset="0" stop-color="var(--ui-hero-blob-3)" data-v-e0d90bc5></stop><stop offset="1" stop-color="var(--ui-hero-blob-4)" data-v-e0d90bc5></stop></linearGradient><linearGradient id="hero-signal-blend" x1="0" y1="0" x2="0" y2="1" data-v-e0d90bc5><stop offset="0" stop-color="white" stop-opacity="0" data-v-e0d90bc5></stop><stop offset="1" stop-color="white" data-v-e0d90bc5></stop></linearGradient><mask id="hero-signal-bottom-mask" maskContentUnits="objectBoundingBox" data-v-e0d90bc5><rect width="1" height="1" fill="url(#hero-signal-blend)" data-v-e0d90bc5></rect></mask></defs><path class="landing-hero__signal-path"${ssrRenderAttr("d", unref(signalPath))} fill="url(#hero-signal-top)" data-v-e0d90bc5></path><path class="landing-hero__signal-path"${ssrRenderAttr("d", unref(signalPath))} fill="url(#hero-signal-bottom)" mask="url(#hero-signal-bottom-mask)" data-v-e0d90bc5></path></svg><div class="landing-hero__content" data-v-e0d90bc5><p class="landing-hero__eyebrow font-mono font-bold text-hero-eyebrow" data-v-e0d90bc5> HEY, DUDE! </p><h1 id="hero-title" class="landing-hero__heading font-display text-foreground" data-v-e0d90bc5> Любимые сервисы<br data-v-e0d90bc5> снова рядом </h1><p class="landing-hero__description text-hero-copy" data-v-e0d90bc5> dudeweb помогает пользоваться любимыми сервисами для работы, развлечений и общения — просто и без лишних сложностей. </p><div class="landing-hero__actions" data-v-e0d90bc5>`);
			_push(ssrRenderComponent(unref(Link), {
				href: "/register",
				class: PRIMARY_ACTION_CLASSES
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Попробовать бесплатно `);
					else return [createTextVNode(" Попробовать бесплатно ")];
				}),
				_: 1
			}, _parent));
			_push(`<a href="#pricing" class="${ssrRenderClass(SECONDARY_ACTION_CLASSES)}" data-v-e0d90bc5> Посмотреть тариф </a></div><p class="landing-hero__trial font-mono text-hero-meta" data-v-e0d90bc5> 3 дня бесплатно · До 5 устройств </p></div></div></section>`);
		};
	}
};
var _sfc_setup$14 = _sfc_main$14.setup;
_sfc_main$14.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/hero/SignalOrbitHero.vue");
	return _sfc_setup$14 ? _sfc_setup$14(props, ctx) : void 0;
};
var SignalOrbitHero_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$14, [["__scopeId", "data-v-e0d90bc5"]]);
//#endregion
//#region resources/js/components/public/LandingHero.vue
var _sfc_main$13 = {
	__name: "LandingHero",
	__ssrInlineRender: true,
	props: { variant: {
		type: String,
		default: "services",
		validator: (value) => ["services", "signal-orbit"].includes(value)
	} },
	setup(__props) {
		const cloudUnavailable = shallowRef(false);
		return (_ctx, _push, _parent, _attrs) => {
			if (__props.variant === "signal-orbit" || cloudUnavailable.value) _push(ssrRenderComponent(SignalOrbitHero_default, _attrs, null, _parent));
			else _push(ssrRenderComponent(ServiceCloudHero_default, mergeProps({ onUnavailable: ($event) => cloudUnavailable.value = true }, _attrs), null, _parent));
		};
	}
};
var _sfc_setup$13 = _sfc_main$13.setup;
_sfc_main$13.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingHero.vue");
	return _sfc_setup$13 ? _sfc_setup$13(props, ctx) : void 0;
};
//#endregion
//#region resources/js/utils/landingIconPaths.js
var LANDING_ICONS = {
	"zap": [{
		"tag": "path",
		"attrs": { "d": "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" }
	}],
	"gauge": [{
		"tag": "path",
		"attrs": { "d": "m12 14 4-4" }
	}, {
		"tag": "path",
		"attrs": { "d": "M3.34 19a10 10 0 1 1 17.32 0" }
	}],
	"monitor-smartphone": [
		{
			"tag": "path",
			"attrs": { "d": "M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8" }
		},
		{
			"tag": "path",
			"attrs": { "d": "M10 19v-3.96 3.15" }
		},
		{
			"tag": "path",
			"attrs": { "d": "M7 19h5" }
		},
		{
			"tag": "rect",
			"attrs": {
				"width": "6",
				"height": "10",
				"x": "16",
				"y": "12",
				"rx": "2"
			}
		}
	],
	"shield-check": [{
		"tag": "path",
		"attrs": { "d": "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }
	}, {
		"tag": "path",
		"attrs": { "d": "m9 12 2 2 4-4" }
	}],
	"infinity": [{
		"tag": "path",
		"attrs": { "d": "M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z" }
	}],
	"heart-handshake": [
		{
			"tag": "path",
			"attrs": { "d": "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" }
		},
		{
			"tag": "path",
			"attrs": { "d": "M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" }
		},
		{
			"tag": "path",
			"attrs": { "d": "m18 15-2-2" }
		},
		{
			"tag": "path",
			"attrs": { "d": "m15 18-2-2" }
		}
	],
	"platform-windows": [{
		"tag": "path",
		"attrs": {
			"d": "M99.69,51.88a12,12,0,0,0-9.84-2.6l-60,10.91A12,12,0,0,0,20,72v36a12,12,0,0,0,12,12H92a12,12,0,0,0,12-12V61.09A12,12,0,0,0,99.69,51.88ZM80,96H44V82l36-6.54ZM215.69,30.79a12,12,0,0,0-9.84-2.6L129.85,42A12,12,0,0,0,120,53.82V108a12,12,0,0,0,12,12h76a12,12,0,0,0,12-12V40A12,12,0,0,0,215.69,30.79ZM196,96H144V63.83l52-9.45ZM92,136H32a12,12,0,0,0-12,12v36a12,12,0,0,0,9.85,11.81l60,10.91A12,12,0,0,0,104,194.91V148A12,12,0,0,0,92,136ZM80,180.53,44,174V160H80ZM208,136H132a12,12,0,0,0-12,12v54.18A12,12,0,0,0,129.85,214l76,13.82A12,12,0,0,0,220,216V148A12,12,0,0,0,208,136Zm-12,65.62-52-9.45V160h52Z",
			"fill": "currentColor",
			"stroke": "none"
		}
	}],
	"platform-apple": [{
		"tag": "path",
		"attrs": {
			"d": "M227,168a12,12,0,0,0-4.21-5.09C207.25,152.22,204,133.68,204,120c0-16.17,12.68-30.6,20.25-37.76a12,12,0,0,0,0-17.43C210.89,52.17,188.81,44,168,44a76.29,76.29,0,0,0-40,11.37,75.59,75.59,0,0,0-93.58,11A78.64,78.64,0,0,0,12,123.51,131,131,0,0,0,53.43,216,43.81,43.81,0,0,0,83.6,228h87.69a43.87,43.87,0,0,0,32.05-13.85,127.63,127.63,0,0,0,18.4-25.39c1.57-2.88,3-5.71,4.14-8.41C227.47,176.67,229.12,172.87,227,168Zm-41.23,29.82A19.78,19.78,0,0,1,171.29,204H83.6a19.85,19.85,0,0,1-13.7-5.42A107.18,107.18,0,0,1,36,122.88,54.49,54.49,0,0,1,51.5,83.28,50.86,50.86,0,0,1,88,68h.72A51.5,51.5,0,0,1,120.48,79.4a12,12,0,0,0,15,0A51.41,51.41,0,0,1,168,68a67.24,67.24,0,0,1,29.88,7.4C186.26,89.66,180,105.13,180,120c0,23.33,7.47,42.89,21.25,56.19A103.3,103.3,0,0,1,185.76,197.81ZM128.75,13A43.83,43.83,0,0,1,142.17,1.51a12,12,0,0,1,11.64,21,19.84,19.84,0,0,0-6.11,5.24A12,12,0,0,1,128.75,13Z",
			"fill": "currentColor",
			"stroke": "none"
		}
	}],
	"platform-linux": [{
		"tag": "path",
		"attrs": {
			"d": "M231.49,217.38a12,12,0,0,1-16.89-1.9C213.19,213.72,180,171.24,180,88A52,52,0,1,0,76,88c0,83.24-33.21,125.72-34.62,127.48A12,12,0,0,1,22.6,200.53C23,200,52,162.06,52,88a76,76,0,1,1,152,0c0,74.19,29.1,112.16,29.4,112.54A12,12,0,0,1,231.49,217.38ZM104,120a16,16,0,1,0-16-16A16,16,0,0,0,104,120Zm64-16a16,16,0,1,0-16,16A16,16,0,0,0,168,104ZM95.26,155l28,12a12,12,0,0,0,9.45,0l28-12A12,12,0,0,0,151.26,133l-23.27,10-23.27-10A12,12,0,0,0,95.26,155ZM128,184a57.12,57.12,0,0,0-38.66,15.15,12,12,0,0,0,16.23,17.69,32.86,32.86,0,0,1,44.85,0,12,12,0,1,0,16.23-17.69A57.1,57.1,0,0,0,128,184Z",
			"fill": "currentColor",
			"stroke": "none"
		}
	}],
	"platform-android": [{
		"tag": "path",
		"attrs": {
			"d": "M180,148a16,16,0,1,1-16-16A16,16,0,0,1,180,148ZM92,132a16,16,0,1,0,16,16A16,16,0,0,0,92,132Zm152,28v24a20,20,0,0,1-20,20H32a20,20,0,0,1-20-20V161.13A117.35,117.35,0,0,1,45.72,78.69L23.51,56.49a12,12,0,0,1,17-17L64.3,63.33A114.35,114.35,0,0,1,127.59,44H128a115.15,115.15,0,0,1,63.89,19.14l23.62-23.63a12,12,0,0,1,17,17l-22,22A115.18,115.18,0,0,1,244,160Zm-24,0a92,92,0,0,0-92.33-92C77.12,68.18,36,110,36,161.13V180H220Z",
			"fill": "currentColor",
			"stroke": "none"
		}
	}]
};
//#endregion
//#region resources/js/components/ui/UiIcon.vue
var _sfc_main$12 = {
	__name: "UiIcon",
	__ssrInlineRender: true,
	props: {
		name: {
			type: String,
			required: true,
			validator: (value) => [
				"arrowUpRight",
				"alertTriangle",
				"check",
				"chevronRight",
				"circleCheck",
				"circleX",
				"clock",
				"copy",
				"creditCard",
				"house",
				"info",
				"loader",
				"logOut",
				"menu",
				"messageCircle",
				"monitor",
				"moon",
				"plug",
				"sun",
				"user",
				"userPlus",
				"x"
			].includes(value) || Object.hasOwn(LANDING_ICONS, value)
		},
		size: {
			type: String,
			default: "md",
			validator: (value) => [
				"feature",
				"platform",
				"lg",
				"md",
				"sm"
			].includes(value)
		}
	},
	setup(__props) {
		const ICONS = {
			...LANDING_ICONS,
			arrowUpRight: [{
				tag: "path",
				attrs: { d: "M7 17 17 7" }
			}, {
				tag: "path",
				attrs: { d: "M7 7h10v10" }
			}],
			alertTriangle: [
				{
					tag: "path",
					attrs: { d: "M21.73 18 13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" }
				},
				{
					tag: "path",
					attrs: { d: "M12 9v4" }
				},
				{
					tag: "path",
					attrs: { d: "M12 17h.01" }
				}
			],
			check: [{
				tag: "path",
				attrs: { d: "m20 6-11 11-5-5" }
			}],
			chevronRight: [{
				tag: "path",
				attrs: { d: "m9 18 6-6-6-6" }
			}],
			circleCheck: [{
				tag: "circle",
				attrs: {
					cx: "12",
					cy: "12",
					r: "10"
				}
			}, {
				tag: "path",
				attrs: { d: "m9 12 2 2 4-4" }
			}],
			circleX: [
				{
					tag: "circle",
					attrs: {
						cx: "12",
						cy: "12",
						r: "10"
					}
				},
				{
					tag: "path",
					attrs: { d: "m15 9-6 6" }
				},
				{
					tag: "path",
					attrs: { d: "m9 9 6 6" }
				}
			],
			clock: [{
				tag: "circle",
				attrs: {
					cx: "12",
					cy: "12",
					r: "10"
				}
			}, {
				tag: "polyline",
				attrs: { points: "12 6 12 12 16 14" }
			}],
			copy: [{
				tag: "rect",
				attrs: {
					width: "14",
					height: "14",
					x: "8",
					y: "8",
					rx: "2",
					ry: "2"
				}
			}, {
				tag: "path",
				attrs: { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }
			}],
			creditCard: [{
				tag: "rect",
				attrs: {
					width: "20",
					height: "14",
					x: "2",
					y: "5",
					rx: "2"
				}
			}, {
				tag: "line",
				attrs: {
					x1: "2",
					x2: "22",
					y1: "10",
					y2: "10"
				}
			}],
			house: [{
				tag: "path",
				attrs: { d: "m3 10 9-7 9 7v9a2 2 0 0 1-2 2h-5v-7h-4v7H5a2 2 0 0 1-2-2Z" }
			}],
			info: [
				{
					tag: "circle",
					attrs: {
						cx: "12",
						cy: "12",
						r: "10"
					}
				},
				{
					tag: "path",
					attrs: { d: "M12 16v-4" }
				},
				{
					tag: "path",
					attrs: { d: "M12 8h.01" }
				}
			],
			loader: [{
				tag: "path",
				attrs: { d: "M21 12a9 9 0 1 1-6.22-8.56" }
			}],
			logOut: [
				{
					tag: "path",
					attrs: { d: "M10 17l5-5-5-5" }
				},
				{
					tag: "path",
					attrs: { d: "M15 12H3" }
				},
				{
					tag: "path",
					attrs: { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" }
				}
			],
			menu: [
				{
					tag: "line",
					attrs: {
						x1: "4",
						x2: "20",
						y1: "6",
						y2: "6"
					}
				},
				{
					tag: "line",
					attrs: {
						x1: "4",
						x2: "20",
						y1: "12",
						y2: "12"
					}
				},
				{
					tag: "line",
					attrs: {
						x1: "4",
						x2: "20",
						y1: "18",
						y2: "18"
					}
				}
			],
			messageCircle: [{
				tag: "path",
				attrs: { d: "M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" }
			}],
			monitor: [
				{
					tag: "rect",
					attrs: {
						width: "20",
						height: "14",
						x: "2",
						y: "3",
						rx: "2"
					}
				},
				{
					tag: "line",
					attrs: {
						x1: "8",
						x2: "16",
						y1: "21",
						y2: "21"
					}
				},
				{
					tag: "line",
					attrs: {
						x1: "12",
						x2: "12",
						y1: "17",
						y2: "21"
					}
				}
			],
			moon: [{
				tag: "path",
				attrs: { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" }
			}],
			plug: [
				{
					tag: "path",
					attrs: { d: "M12 22v-5" }
				},
				{
					tag: "path",
					attrs: { d: "M9 8V2" }
				},
				{
					tag: "path",
					attrs: { d: "M15 8V2" }
				},
				{
					tag: "path",
					attrs: { d: "M6 8h12v3a6 6 0 0 1-12 0Z" }
				}
			],
			sun: [
				{
					tag: "circle",
					attrs: {
						cx: "12",
						cy: "12",
						r: "4"
					}
				},
				{
					tag: "path",
					attrs: { d: "M12 2v2" }
				},
				{
					tag: "path",
					attrs: { d: "M12 20v2" }
				},
				{
					tag: "path",
					attrs: { d: "m4.93 4.93 1.42 1.42" }
				},
				{
					tag: "path",
					attrs: { d: "m17.66 17.66 1.41 1.41" }
				},
				{
					tag: "path",
					attrs: { d: "M2 12h2" }
				},
				{
					tag: "path",
					attrs: { d: "M20 12h2" }
				},
				{
					tag: "path",
					attrs: { d: "m6.34 17.66-1.41 1.41" }
				},
				{
					tag: "path",
					attrs: { d: "m19.07 4.93-1.41 1.41" }
				}
			],
			user: [{
				tag: "path",
				attrs: { d: "M19 21a7 7 0 0 0-14 0" }
			}, {
				tag: "circle",
				attrs: {
					cx: "12",
					cy: "7",
					r: "4"
				}
			}],
			userPlus: [
				{
					tag: "path",
					attrs: { d: "M16 21a6 6 0 0 0-12 0" }
				},
				{
					tag: "circle",
					attrs: {
						cx: "10",
						cy: "7",
						r: "4"
					}
				},
				{
					tag: "line",
					attrs: {
						x1: "19",
						x2: "19",
						y1: "8",
						y2: "14"
					}
				},
				{
					tag: "line",
					attrs: {
						x1: "22",
						x2: "16",
						y1: "11",
						y2: "11"
					}
				}
			],
			x: [{
				tag: "path",
				attrs: { d: "M18 6 6 18" }
			}, {
				tag: "path",
				attrs: { d: "m6 6 12 12" }
			}]
		};
		const SIZE_CLASSES = {
			feature: "size-landing-feature-icon",
			platform: "size-platform-icon",
			lg: "size-6",
			md: "size-5",
			sm: "size-4"
		};
		const props = __props;
		const elements = computed(() => ICONS[props.name] ?? ICONS.info);
		const iconClass = computed(() => [
			"shrink-0",
			SIZE_CLASSES[props.size] ?? SIZE_CLASSES.md,
			props.name === "loader" ? "animate-spin" : ""
		]);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<svg${ssrRenderAttrs(mergeProps({
				class: iconClass.value,
				"aria-hidden": "true",
				fill: "none",
				stroke: "currentColor",
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				"stroke-width": "2",
				viewBox: __props.name.startsWith("platform-") ? "0 0 256 256" : "0 0 24 24",
				xmlns: "http://www.w3.org/2000/svg"
			}, _attrs))}><!--[-->`);
			ssrRenderList(elements.value, (element, index) => {
				ssrRenderVNode(_push, createVNode(resolveDynamicComponent(element.tag), mergeProps({ key: index }, { ref_for: true }, element.attrs), null), _parent);
			});
			_push(`<!--]--></svg>`);
		};
	}
};
var _sfc_setup$12 = _sfc_main$12.setup;
_sfc_main$12.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/UiIcon.vue");
	return _sfc_setup$12 ? _sfc_setup$12(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/public/LandingAdvantages.vue
var _sfc_main$11 = {
	__name: "LandingAdvantages",
	__ssrInlineRender: true,
	props: { deviceLimit: {
		type: Number,
		default: null
	} },
	setup(__props) {
		const props = __props;
		const features = computed(() => [
			{
				icon: "zap",
				title: "Подключился — и погнали",
				copy: "Никаких сложных настроек. Пара простых действий — и любимые сервисы снова под рукой."
			},
			{
				icon: "gauge",
				title: "Скорость без компромиссов",
				copy: "Смотри видео, созванивайся, работай и переключайся между задачами с комфортом."
			},
			{
				icon: "monitor-smartphone",
				title: props.deviceLimit ? `Один доступ. До ${props.deviceLimit} устройств` : "Один доступ для твоих устройств",
				copy: "Пользуйся сервисом на смартфоне, ноутбуке или планшете и делись подпиской с близкими."
			},
			{
				icon: "shield-check",
				title: "Твоё соединение под защитой",
				copy: "Защищённое подключение для работы, общения и повседневных задач."
			},
			{
				icon: "infinity",
				title: "Больше свободы каждый день",
				copy: "Любимые инструменты для творчества, развлечений и общения — в одном подключении."
			},
			{
				icon: "heart-handshake",
				title: "Мы рядом",
				copy: "Возникли вопросы? Поможем разобраться с подключением и использованием сервиса."
			}
		]);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "advantages",
				class: "scroll-mt-public-header bg-landing-section tablet:scroll-mt-public-header-tablet desktop:scroll-mt-public-header-wide",
				"aria-labelledby": "advantages-title"
			}, _attrs))}><div class="mx-auto flex min-h-landing-advantages w-full max-w-landing flex-col gap-landing-stack px-landing-gutter py-landing-section"><div class="mx-auto flex w-full max-w-landing-intro flex-col gap-landing-intro-gap text-center"><h2 id="advantages-title" class="text-landing-heading font-normal tracking-landing-heading break-words"> Всё просто.<br>Всё работает.<br>Всё для тебя. </h2><p class="text-landing-intro text-footer-secondary"> dudeweb создан, чтобы технологии не мешали заниматься тем, что тебе нравится. </p></div><div class="grid grid-cols-1 gap-x-landing-grid-column gap-y-landing-grid-row tablet:grid-cols-2 desktop:grid-cols-3"><!--[-->`);
			ssrRenderList(features.value, (feature) => {
				_push(`<article class="flex min-h-landing-feature flex-col items-start gap-landing-card-gap rounded-landing-card ring-1 ring-landing-card-border ring-inset bg-landing-card p-landing-card"><span class="inline-flex size-landing-feature-tile shrink-0 items-center justify-center rounded-landing-tile ring-1 ring-landing-tile-border ring-inset bg-landing-tile text-accent">`);
				_push(ssrRenderComponent(_sfc_main$12, {
					name: feature.icon,
					size: "feature"
				}, null, _parent));
				_push(`</span><h3 class="text-landing-feature-title font-normal wrap-anywhere">${ssrInterpolate(feature.title)}</h3><p class="text-landing-feature-copy wrap-anywhere text-footer-secondary">${ssrInterpolate(feature.copy)}</p></article>`);
			});
			_push(`<!--]--></div></div></section>`);
		};
	}
};
var _sfc_setup$11 = _sfc_main$11.setup;
_sfc_main$11.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingAdvantages.vue");
	return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/public/LandingPlatforms.vue
var _sfc_main$10 = {
	__name: "LandingPlatforms",
	__ssrInlineRender: true,
	setup(__props) {
		const PLATFORMS = [
			{
				id: "windows",
				label: "Windows",
				icon: "platform-windows",
				color: "text-platform-windows"
			},
			{
				id: "macos",
				label: "macOS",
				icon: "platform-apple",
				color: "text-platform-macos"
			},
			{
				id: "linux",
				label: "Linux",
				icon: "platform-linux",
				color: "text-platform-linux"
			},
			{
				id: "android",
				label: "Android",
				icon: "platform-android",
				color: "text-platform-android"
			},
			{
				id: "ios",
				label: "iOS",
				icon: "platform-apple",
				color: "text-platform-ios"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "devices",
				class: "scroll-mt-public-header tablet:scroll-mt-public-header-tablet desktop:scroll-mt-public-header-wide",
				"aria-labelledby": "platforms-title"
			}, _attrs))}><div class="mx-auto flex min-h-platform-height w-full max-w-landing flex-col gap-platform-stack px-landing-gutter py-platform-section"><div class="mx-auto flex w-full max-w-landing-intro flex-col gap-landing-intro-gap text-center"><h2 id="platforms-title" class="text-platform-heading font-normal tracking-platform-heading">Где ты — там<br>и dudeweb</h2><p class="text-platform-copy text-footer-secondary">Работай с ноутбука, смотри с планшета, общайся со смартфона. Привычные сервисы всегда под рукой.</p></div><ul class="grid grid-cols-2 gap-platform-grid-gap desktop:grid-cols-5"><!--[-->`);
			ssrRenderList(PLATFORMS, (platform) => {
				_push(`<li class="flex min-h-platform-card items-center justify-center gap-platform-card-gap rounded-platform-card bg-landing-platform px-tight text-platform-label font-semibold ring-1 ring-landing-platform-border ring-inset last:col-span-2 desktop:last:col-span-1">`);
				_push(ssrRenderComponent(_sfc_main$12, {
					name: platform.icon,
					class: platform.color,
					size: "platform"
				}, null, _parent));
				_push(`<span class="min-w-0 break-words">${ssrInterpolate(platform.label)}</span></li>`);
			});
			_push(`<!--]--></ul><p class="text-center text-platform-note text-footer-muted">Одно подключение для привычных платформ. Без необходимости разбираться в сложных настройках.</p></div></section>`);
		};
	}
};
var _sfc_setup$10 = _sfc_main$10.setup;
_sfc_main$10.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingPlatforms.vue");
	return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/public/LandingPricing.vue
var _sfc_main$9 = {
	__name: "LandingPricing",
	__ssrInlineRender: true,
	props: {
		plans: {
			type: Array,
			required: true
		},
		state: {
			type: String,
			required: true,
			validator: (value) => [
				"ready",
				"empty",
				"unavailable"
			].includes(value)
		}
	},
	setup(__props) {
		const props = __props;
		const selectedId = shallowRef(null);
		const plan = computed(() => props.plans[0] ?? null);
		const selectedProduct = computed(() => plan.value?.products.find((product) => product.id === selectedId.value) ?? plan.value?.products[0] ?? null);
		const money = new Intl.NumberFormat("ru-RU", {
			style: "currency",
			currency: "RUB",
			minimumFractionDigits: 0,
			maximumFractionDigits: 2
		});
		const periodPrice = computed(() => selectedProduct.value ? money.format(selectedProduct.value.priceMinor / 100) : "");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "pricing",
				class: "scroll-mt-public-header bg-landing-section tablet:scroll-mt-public-header-tablet desktop:scroll-mt-public-header-wide",
				"aria-labelledby": "pricing-title"
			}, _attrs))} data-v-dbb8dd6b><div class="landing-pricing mx-auto grid min-h-pricing-height w-full max-w-landing gap-pricing-grid-gap px-pricing-gutter pt-pricing-top pb-pricing-bottom desktop:items-center" data-v-dbb8dd6b><div class="flex min-w-0 flex-col items-start gap-pricing-story-gap" data-v-dbb8dd6b><p class="font-mono text-landing-eyebrow font-bold tracking-pricing-eyebrow text-accent" data-v-dbb8dd6b>ОДИН ТАРИФ. ВСЁ ПРОСТО.</p><span class="h-pricing-rule-height w-pricing-rule rounded-pricing-rule bg-accent" aria-hidden="true" data-v-dbb8dd6b></span><h2 id="pricing-title" class="max-w-full text-pricing-heading font-bold tracking-pricing-heading break-words" data-v-dbb8dd6b>${ssrInterpolate(plan.value?.name ?? "Безлимитный")}.</h2><p class="text-pricing-copy text-footer-secondary" data-v-dbb8dd6b>Никаких сложных тарифов. Просто выбирай удобный период и пользуйся любимыми сервисами.</p></div><div class="h-px bg-landing-platform-border desktop:h-full desktop:w-px" aria-hidden="true" data-v-dbb8dd6b></div><div class="flex min-w-0 flex-col gap-pricing-stack" data-v-dbb8dd6b>`);
			if (__props.state === "ready" && selectedProduct.value) {
				_push(`<!--[--><div class="flex flex-col items-start gap-tight tablet:flex-row tablet:flex-wrap tablet:items-end tablet:justify-between" data-v-dbb8dd6b><p class="text-pricing-prompt" data-v-dbb8dd6b>Выбери период</p><p class="max-w-full font-mono text-pricing-price font-semibold tracking-pricing-price break-words" aria-live="polite" aria-atomic="true" data-v-dbb8dd6b>${ssrInterpolate(periodPrice.value)} / ${ssrInterpolate(selectedProduct.value.months)} мес.</p></div><fieldset class="min-w-0" data-v-dbb8dd6b><legend class="sr-only" data-v-dbb8dd6b>Период подписки</legend><div class="grid min-h-pricing-selector grid-cols-4 gap-1 rounded-button bg-background p-pricing-selector-inset ring-1 ring-border ring-inset" data-v-dbb8dd6b><!--[-->`);
				ssrRenderList(plan.value.products, (product) => {
					_push(`<label class="${ssrRenderClass([selectedProduct.value.id === product.id ? "border border-accent bg-landing-tile font-bold text-foreground" : "border border-transparent font-medium text-footer-muted hover:text-foreground", "relative flex min-h-0 cursor-pointer items-center justify-center rounded-control-sm py-compact text-center font-mono text-pricing-period wrap-anywhere transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus"])}" data-v-dbb8dd6b><input${ssrIncludeBooleanAttr(selectedProduct.value.id === product.id) ? " checked" : ""}${ssrRenderAttr("value", product.id)} type="radio" name="landing-period" class="sr-only" data-v-dbb8dd6b> ${ssrInterpolate(product.months)} мес. </label>`);
				});
				_push(`<!--]--></div></fieldset><p class="text-pricing-benefits-label text-footer-muted" data-v-dbb8dd6b>В тариф входит</p><ul class="grid gap-x-pricing-benefits-column gap-y-pricing-benefits-row tablet:grid-cols-2" data-v-dbb8dd6b><!--[-->`);
				ssrRenderList(plan.value.advantages, (advantage) => {
					_push(`<li class="flex items-start gap-tight text-pricing-benefit" data-v-dbb8dd6b><span class="inline-flex size-pricing-check shrink-0 items-center justify-center rounded-control-sm border border-landing-tile-border bg-landing-tile text-accent" data-v-dbb8dd6b>`);
					_push(ssrRenderComponent(_sfc_main$12, {
						name: "check",
						size: "md"
					}, null, _parent));
					_push(`</span><span class="self-center" data-v-dbb8dd6b>${ssrInterpolate(advantage)}</span></li>`);
				});
				_push(`<!--]--></ul><div class="flex w-full flex-col items-center gap-2.5 tablet:max-w-pricing-action-width" data-v-dbb8dd6b>`);
				_push(ssrRenderComponent(unref(Link), {
					href: "/register",
					class: "inline-flex min-h-pricing-action w-full items-center justify-center rounded-landing-action ring-1 ring-accent-hover ring-inset bg-accent px-content py-compact text-center text-landing-action font-bold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Выбрать подписку`);
						else return [createTextVNode("Выбрать подписку")];
					}),
					_: 1
				}, _parent));
				_push(`<p class="text-center text-pricing-trial text-footer-muted" data-v-dbb8dd6b>3 дня бесплатно для новых пользователей</p></div><!--]-->`);
			} else _push(`<div role="status" class="flex flex-col items-start gap-content" data-v-dbb8dd6b><p class="text-ui-title" data-v-dbb8dd6b>${ssrInterpolate(__props.state === "unavailable" ? "Не удалось загрузить тариф" : "Тариф временно недоступен")}</p><p class="text-ui-copy text-footer-secondary" data-v-dbb8dd6b>Попробуй зайти позже или напиши нам — поможем разобраться.</p><a href="https://t.me/hey_dude_web" class="inline-flex min-h-12 items-center rounded-button border border-accent px-panel text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus" data-v-dbb8dd6b>Написать в поддержку</a></div>`);
			_push(`</div></div></section>`);
		};
	}
};
var _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingPricing.vue");
	return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
var LandingPricing_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$9, [["__scopeId", "data-v-dbb8dd6b"]]);
//#endregion
//#region resources/js/components/public/LandingFinalMark.vue
var MARK = "M167.36626 44.31375l-24.77251 30.54375 21.1275 0c9.45001 0 17.11127 7.32375 17.11127 17.38125 0 13.22999-11.67752 23.0175-23.42252 23.0175-17.24624 0-32.16374-14.14124-43.2675-24.26624l28.75501-27.23626 0-22.84875c-23.4225 22.44375-52.88625 49.95-68.985 63.31499-5.77125 4.72501-12.38626 7.39125-18.63001 7.39125-12.92625 0-23.52375-10.5975-23.52375-23.32124 0-15.35626 11.475-25.75125 24.30001-25.75125 6.68249 0 13.46625 2.86875 18.22499 7.66126l13.095 13.46624 22.68001-20.8575 0-47.82375c0-8.67375-6.21001-14.985-15.42375-14.985l-17.82001 0 0 32.4675c-5.43375-1.755-11.07001-2.7675-17.44874-2.7675-32.1975 0-59.36626 26.62875-59.36626 59.4675 0 31.05001 24.97501 53.18998 52.1775 53.18998 11.98125 0 24.3-4.89373 33.51375-12.52124l12.48751-10.69874c14.20874 12.99376 33.88501 28.65376 58.55624 28.65376 31.55626 0 56.7-25.54876 56.7-56.025 0-26.66251-20.95874-47.28376-46.06874-47.45251z";
var ACCENT = "M16.97624 19.27126l-14.71501-0.00001c-1.34999 0-2.26123-0.945-2.26123-2.39625l0-14.41125c0-1.45124 0.97874-2.46375 2.26123-2.46375l14.71501 0c1.2825 0 2.32874 0.945 2.32874 2.26125l0 14.61375c0 1.45126-0.94499 2.39626-2.32874 2.39625z";
var _sfc_main$8 = {
	__name: "LandingFinalMark",
	__ssrInlineRender: true,
	setup(__props) {
		const gradientId = useId();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: "landing-final-mark",
				"aria-hidden": "true"
			}, _attrs))} data-v-c2759be7><svg class="landing-final-mark__light" focusable="false" xmlns="http://www.w3.org/2000/svg" data-v-c2759be7><defs data-v-c2759be7><radialGradient${ssrRenderAttr("id", unref(gradientId))} data-v-c2759be7><stop offset="0" stop-color="var(--color-landing-glow-inner)" data-v-c2759be7></stop><stop offset="0.56" stop-color="var(--color-landing-glow-outer)" data-v-c2759be7></stop><stop offset="1" stop-color="transparent" data-v-c2759be7></stop></radialGradient></defs><ellipse class="landing-final-mark__glow"${ssrRenderAttr("fill", `url(#${unref(gradientId)})`)} cx="50%" cy="50%" rx="42%" ry="45%" data-v-c2759be7></ellipse></svg><svg class="landing-final-mark__shape landing-final-mark__far" viewBox="0 0 213.435 147.7913" data-v-c2759be7><path${ssrRenderAttr("d", MARK)} data-v-c2759be7></path></svg><svg class="landing-final-mark__shape landing-final-mark__mid" viewBox="0 0 213.435 147.7913" data-v-c2759be7><path${ssrRenderAttr("d", MARK)} data-v-c2759be7></path></svg><svg class="landing-final-mark__shape landing-final-mark__front" viewBox="0 0 213.435 147.7913" data-v-c2759be7><path${ssrRenderAttr("d", MARK)} data-v-c2759be7></path></svg><svg class="landing-final-mark__accent" viewBox="0 0 19.30498 19.27125" data-v-c2759be7><path${ssrRenderAttr("d", ACCENT)} data-v-c2759be7></path></svg></div>`);
		};
	}
};
var _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingFinalMark.vue");
	return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
var LandingFinalMark_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$8, [["__scopeId", "data-v-c2759be7"]]);
//#endregion
//#region resources/js/components/public/LandingFinalCta.vue
var _sfc_main$7 = {
	__name: "LandingFinalCta",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				class: "mx-auto w-full max-w-landing px-landing-gutter py-final-section",
				"aria-labelledby": "final-title"
			}, _attrs))} data-v-772b610b><div class="landing-final__panel relative min-h-final-panel overflow-hidden rounded-final-panel ring-1 ring-landing-final-border ring-inset bg-linear-to-r from-landing-final-start to-landing-final-end px-final-padding-x py-final-padding-y" data-v-772b610b><div class="relative z-1 flex min-w-0 flex-col items-start gap-final-copy-gap" data-v-772b610b><p class="font-mono text-landing-eyebrow font-bold tracking-final-eyebrow text-accent" data-v-772b610b>ПОПРОБУЙ DUDEWEB</p><h2 id="final-title" class="max-w-full text-final-heading font-bold tracking-final-heading break-words" data-v-772b610b>Ну что, погнали?</h2><p class="text-final-copy text-footer-secondary" data-v-772b610b>Твои любимые сервисы уже ждут. Подключайся и начинай прямо сейчас.</p>`);
			_push(ssrRenderComponent(unref(Link), {
				href: "/register",
				class: "inline-flex min-h-final-action w-full items-center justify-center rounded-landing-action ring-1 ring-accent-hover ring-inset bg-accent px-tight py-compact text-center text-landing-action font-bold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:max-w-final-action-width"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Получить 3 дня бесплатно `);
					else return [createTextVNode(" Получить 3 дня бесплатно ")];
				}),
				_: 1
			}, _parent));
			_push(`<p class="text-final-note text-footer-muted" data-v-772b610b>Начни с пробного доступа, а подписку оформишь позже.</p></div><div class="landing-final__visual pointer-events-none absolute top-2.5 right-2 h-final-visual-height w-final-visual-width opacity-35 tablet:static tablet:w-full tablet:max-w-final-visual-width tablet:opacity-100" aria-hidden="true" data-v-772b610b>`);
			_push(ssrRenderComponent(LandingFinalMark_default, null, null, _parent));
			_push(`</div></div></section>`);
		};
	}
};
var _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingFinalCta.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var LandingFinalCta_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$7, [["__scopeId", "data-v-772b610b"]]);
//#endregion
//#region resources/js/components/brand/BrandLogo.vue
var _sfc_main$6 = {
	__name: "BrandLogo",
	__ssrInlineRender: true,
	props: {
		variant: {
			type: String,
			default: "horizontal",
			validator: (value) => [
				"horizontal",
				"icon",
				"stacked"
			].includes(value)
		},
		scale: {
			type: String,
			default: "default",
			validator: (value) => [
				"default",
				"footer",
				"public"
			].includes(value)
		}
	},
	setup(__props) {
		const CONTAINER_CLASSES = {
			horizontal: "inline-flex items-center gap-logo-gap",
			icon: "inline-flex",
			stacked: "inline-flex flex-col items-center gap-tight"
		};
		const SCALE_CONTAINER_CLASSES = {
			default: "",
			footer: "gap-logo-footer-gap",
			public: "gap-logo-public-gap-tablet desktop:gap-logo-public-gap-wide"
		};
		const MARK_FRAME_CLASSES = {
			default: "inline-flex shrink-0",
			footer: "inline-flex h-logo-footer-frame w-logo-footer shrink-0 items-center justify-center",
			public: {
				horizontal: "inline-flex h-logo-public-frame-tablet w-logo-public-tablet shrink-0 items-center justify-center desktop:h-logo-public-frame-wide desktop:w-logo-public-wide",
				icon: "inline-flex h-logo-public-frame-mobile w-logo-public-mobile shrink-0 items-center justify-center",
				stacked: "inline-flex shrink-0"
			}
		};
		const MARK_CLASSES = {
			default: {
				horizontal: "h-auto w-logo-horizontal",
				icon: "h-auto w-logo-icon",
				stacked: "h-auto w-logo-stacked"
			},
			footer: {
				horizontal: "h-auto w-logo-footer-mark",
				icon: "h-auto w-logo-footer-mark",
				stacked: "h-auto w-logo-stacked"
			},
			public: {
				horizontal: "h-auto w-logo-public-mark-tablet desktop:w-logo-public-mark-wide",
				icon: "h-auto w-logo-public-mark-mobile",
				stacked: "h-auto w-logo-stacked"
			}
		};
		const WORDMARK_CLASSES = {
			default: {
				horizontal: "font-brand text-brand-lockup font-bold tracking-public-brand text-foreground",
				stacked: "font-brand text-brand-stacked font-bold tracking-public-brand text-foreground"
			},
			footer: {
				horizontal: "font-brand text-brand-footer font-bold tracking-public-brand text-foreground tablet:text-brand-footer-tablet desktop:text-brand-footer-wide",
				stacked: "font-brand text-brand-stacked font-bold tracking-public-brand text-foreground"
			},
			public: {
				horizontal: "font-brand text-brand-public-tablet font-bold tracking-public-brand text-foreground desktop:text-brand-public-wide",
				stacked: "font-brand text-brand-stacked font-bold tracking-public-brand text-foreground"
			}
		};
		const props = __props;
		const containerClass = computed(() => [CONTAINER_CLASSES[props.variant] ?? CONTAINER_CLASSES.horizontal, SCALE_CONTAINER_CLASSES[props.scale] ?? SCALE_CONTAINER_CLASSES.default]);
		const markClass = computed(() => MARK_CLASSES[props.scale]?.[props.variant] ?? MARK_CLASSES.default[props.variant] ?? MARK_CLASSES.default.horizontal);
		const markFrameClass = computed(() => {
			if (props.variant === "stacked") return MARK_FRAME_CLASSES.default;
			if (props.scale === "public") return MARK_FRAME_CLASSES.public[props.variant] ?? MARK_FRAME_CLASSES.public.horizontal;
			return MARK_FRAME_CLASSES[props.scale] ?? MARK_FRAME_CLASSES.default;
		});
		const wordmarkClass = computed(() => WORDMARK_CLASSES[props.scale]?.[props.variant] ?? WORDMARK_CLASSES.default[props.variant] ?? WORDMARK_CLASSES.default.horizontal);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<span${ssrRenderAttrs(mergeProps({
				class: containerClass.value,
				"aria-label": "dudeweb",
				role: "img"
			}, _attrs))}><span class="${ssrRenderClass(markFrameClass.value)}"><svg class="${ssrRenderClass(markClass.value)}" aria-hidden="true" viewBox="0 0 213.435 147.7913" xmlns="http://www.w3.org/2000/svg"><path class="fill-logo-primary" d="M167.36626 44.31375l-24.77251 30.54375 21.1275 0c9.45001 0 17.11127 7.32375 17.11127 17.38125 0 13.22999-11.67752 23.0175-23.42252 23.0175-17.24624 0-32.16374-14.14124-43.2675-24.26624l28.75501-27.23626 0-22.84875c-23.4225 22.44375-52.88625 49.95-68.985 63.31499-5.77125 4.72501-12.38626 7.39125-18.63001 7.39125-12.92625 0-23.52375-10.5975-23.52375-23.32124 0-15.35626 11.475-25.75125 24.30001-25.75125 6.68249 0 13.46625 2.86875 18.22499 7.66126l13.095 13.46624 22.68001-20.8575 0-47.82375c0-8.67375-6.21001-14.985-15.42375-14.985l-17.82001 0 0 32.4675c-5.43375-1.755-11.07001-2.7675-17.44874-2.7675-32.1975 0-59.36626 26.62875-59.36626 59.4675 0 31.05001 24.97501 53.18998 52.1775 53.18998 11.98125 0 24.3-4.89373 33.51375-12.52124l12.48751-10.69874c14.20874 12.99376 33.88501 28.65376 58.55624 28.65376 31.55626 0 56.7-25.54876 56.7-56.025 0-26.66251-20.95874-47.28376-46.06874-47.45251z"></path><path class="fill-logo-highlight" d="M16.97624 19.27126l-14.71501-0.00001c-1.34999 0-2.26123-0.945-2.26123-2.39625l0-14.41125c0-1.45124 0.97874-2.46375 2.26123-2.46375l14.71501 0c1.2825 0 2.32874 0.945 2.32874 2.26125l0 14.61375c0 1.45126-0.94499 2.39626-2.32874 2.39625z" transform="translate(144.72 16.74)"></path></svg></span>`);
			if (__props.variant !== "icon") _push(`<span class="${ssrRenderClass(wordmarkClass.value)}">dudeweb</span>`);
			else _push(`<!---->`);
			_push(`</span>`);
		};
	}
};
var _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/brand/BrandLogo.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/brand/BrandLink.vue
var _sfc_main$5 = {
	__name: "BrandLink",
	__ssrInlineRender: true,
	props: {
		href: {
			type: String,
			default: "/"
		},
		variant: {
			type: String,
			default: "horizontal",
			validator: (value) => [
				"horizontal",
				"icon",
				"stacked"
			].includes(value)
		},
		scale: {
			type: String,
			default: "default",
			validator: (value) => [
				"default",
				"footer",
				"public"
			].includes(value)
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(Link), mergeProps({
				href: __props.href,
				"aria-label": "dudeweb — на главную",
				class: "inline-flex rounded-control-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$6, {
						scale: __props.scale,
						variant: __props.variant
					}, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$6, {
						scale: __props.scale,
						variant: __props.variant
					}, null, 8, ["scale", "variant"])];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/brand/BrandLink.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/public/PublicFooter.vue
var LINK_CLASSES = "w-fit rounded-control-sm text-footer-link text-footer-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:text-footer-link-tablet desktop:text-footer-link-wide";
var LABEL_CLASSES = "font-mono text-footer-label font-medium tracking-footer-label text-foreground desktop:text-footer-label-wide";
var _sfc_main$4 = {
	__name: "PublicFooter",
	__ssrInlineRender: true,
	props: {
		loginHref: {
			type: String,
			required: true
		},
		navigationItems: {
			type: Array,
			required: true
		},
		registerHref: {
			type: String,
			required: true
		},
		supportHref: {
			type: String,
			required: true
		}
	},
	setup(__props) {
		const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<footer${ssrRenderAttrs(mergeProps({ class: "border-t border-border bg-public-footer" }, _attrs))}><div class="mx-auto max-w-shell px-shell-gutter pt-section-md pb-panel tablet:px-section-sm desktop:flex desktop:justify-between desktop:px-shell-wide desktop:pt-footer-top-wide desktop:pb-footer-bottom-wide"><div class="desktop:w-footer-brand-wide">`);
			_push(ssrRenderComponent(_sfc_main$5, {
				scale: "footer",
				variant: "horizontal"
			}, null, _parent));
			_push(`<p class="mt-3.5 text-footer-copy text-footer-secondary desktop:mt-footer-brand-gap-wide desktop:text-footer-copy-wide"> Простая подписка, быстрая настройка и поддержка без долгого ожидания. </p></div><div class="mt-panel flex min-w-0 flex-col gap-7 tablet:gap-5 desktop:mt-0 desktop:grid desktop:w-footer-links-wide desktop:grid-cols-[140fr_130fr_246fr] desktop:gap-footer-links-gap-wide wide:grid-cols-[8.75rem_8.125rem_18.75rem]"><nav aria-label="Навигация в подвале" class="flex flex-col gap-tight"><p class="${ssrRenderClass(LABEL_CLASSES)}">НАВИГАЦИЯ</p><!--[-->`);
			ssrRenderList(__props.navigationItems, (item) => {
				_push(`<a${ssrRenderAttr("href", item.href)} class="${ssrRenderClass(LINK_CLASSES)}">${ssrInterpolate(item.label)}</a>`);
			});
			_push(`<!--]--></nav><nav aria-label="Аккаунт" class="flex flex-col gap-tight"><p class="${ssrRenderClass(LABEL_CLASSES)}">АККАУНТ</p>`);
			_push(ssrRenderComponent(unref(Link), {
				href: __props.loginHref,
				class: LINK_CLASSES
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Войти `);
					else return [createTextVNode(" Войти ")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(Link), {
				href: __props.registerHref,
				class: LINK_CLASSES
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Регистрация `);
					else return [createTextVNode(" Регистрация ")];
				}),
				_: 1
			}, _parent));
			_push(`</nav><nav aria-label="Информация" class="flex flex-col gap-tight"><p class="${ssrRenderClass(LABEL_CLASSES)}">ИНФОРМАЦИЯ</p><a${ssrRenderAttr("href", __props.supportHref)} class="${ssrRenderClass(LINK_CLASSES)}" rel="noopener noreferrer" target="_blank"> Поддержка <span class="sr-only">(откроется в новой вкладке)</span></a></nav></div><p class="mt-panel border-t border-border pt-5 font-mono text-footer-meta text-footer-muted desktop:mt-0 desktop:w-footer-meta-wide desktop:border-0 desktop:pt-0 desktop:text-footer-meta-wide"> © ${ssrInterpolate(unref(currentYear))} dudeweb </p></div></footer>`);
		};
	}
};
var _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/PublicFooter.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/public/PublicMobileMenu.vue
var _sfc_main$3 = {
	__name: "PublicMobileMenu",
	__ssrInlineRender: true,
	props: {
		items: {
			type: Array,
			required: true
		},
		loginHref: {
			type: String,
			required: true
		},
		open: Boolean,
		registerHref: {
			type: String,
			required: true
		}
	},
	emits: ["close", "navigate"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const panel = useTemplateRef("panel");
		let previousBodyOverflow = "";
		function getFocusableElements() {
			const headerControls = document.querySelectorAll("[data-public-menu-control]:not([disabled])");
			const panelControls = panel.value?.querySelectorAll("a[href], button:not([disabled])") ?? [];
			return [...headerControls, ...panelControls].filter((element) => !element.hasAttribute("inert"));
		}
		function lockBodyScroll() {
			previousBodyOverflow = document.body.style.overflow;
			document.body.style.overflow = "hidden";
		}
		function unlockBodyScroll() {
			document.body.style.overflow = previousBodyOverflow;
		}
		function requestClose() {
			emit("close");
		}
		function handleNavigation() {
			emit("navigate");
		}
		function handleDocumentKeydown(event) {
			if (!props.open) return;
			if (event.key === "Escape") {
				event.preventDefault();
				requestClose();
				return;
			}
			if (event.key !== "Tab") return;
			const focusableElements = getFocusableElements();
			if (focusableElements.length === 0) {
				event.preventDefault();
				return;
			}
			const firstElement = focusableElements[0];
			const lastElement = focusableElements.at(-1);
			if (event.shiftKey && document.activeElement === firstElement) {
				event.preventDefault();
				lastElement.focus();
			} else if (!event.shiftKey && document.activeElement === lastElement) {
				event.preventDefault();
				firstElement.focus();
			}
		}
		watch(() => props.open, async (isOpen) => {
			if (typeof document === "undefined") return;
			if (!isOpen) {
				unlockBodyScroll();
				return;
			}
			lockBodyScroll();
			await nextTick();
			panel.value?.querySelector("a[href]")?.focus();
		});
		onMounted(() => document.addEventListener("keydown", handleDocumentKeydown));
		onBeforeUnmount(() => {
			document.removeEventListener("keydown", handleDocumentKeydown);
			unlockBodyScroll();
		});
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderTeleport(_push, (_push) => {
				if (__props.open) {
					_push(`<div class="fixed inset-x-0 top-public-header bottom-0 z-30 bg-background/80 px-tight pt-tight backdrop-blur-sm tablet:top-public-header-tablet tablet:flex tablet:items-start tablet:justify-end tablet:px-section-sm desktop:hidden"><nav id="public-mobile-menu" aria-label="Мобильная навигация" aria-modal="true" class="mx-auto flex max-h-[calc(100dvh-var(--spacing-public-header)-var(--spacing-panel))] w-full max-w-none flex-col gap-control overflow-y-auto rounded-panel border border-border bg-surface p-tight tablet:mx-0 tablet:max-h-[calc(100dvh-var(--spacing-public-header-tablet)-var(--spacing-panel))] tablet:max-w-public-menu" role="dialog"><!--[-->`);
					ssrRenderList(__props.items, (item) => {
						_push(`<a${ssrRenderAttr("href", item.href)} class="flex min-h-public-menu-item items-center justify-between rounded-menu-item border border-transparent bg-elevated px-control-inline text-public-menu font-normal text-foreground transition-colors hover:border-border hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-public-menu-item-tablet"><span>${ssrInterpolate(item.label)}</span>`);
						_push(ssrRenderComponent(_sfc_main$12, {
							class: "text-accent",
							name: "arrowUpRight",
							size: "sm"
						}, null, _parent));
						_push(`</a>`);
					});
					_push(`<!--]-->`);
					_push(ssrRenderComponent(unref(Link), {
						href: __props.loginHref,
						class: "flex min-h-public-menu-item items-center justify-between rounded-menu-item border border-transparent bg-elevated px-control-inline text-public-menu font-normal text-foreground transition-colors hover:border-border hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-public-menu-item-tablet",
						onClick: handleNavigation
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<span${_scopeId}>Войти</span>`);
								_push(ssrRenderComponent(_sfc_main$12, {
									class: "text-accent",
									name: "arrowUpRight",
									size: "sm"
								}, null, _parent, _scopeId));
							} else return [createVNode("span", null, "Войти"), createVNode(_sfc_main$12, {
								class: "text-accent",
								name: "arrowUpRight",
								size: "sm"
							})];
						}),
						_: 1
					}, _parent));
					_push(ssrRenderComponent(unref(Link), {
						href: __props.registerHref,
						class: "inline-flex min-h-13 items-center justify-center rounded-control border border-accent-hover bg-accent px-panel text-hero-action-mobile font-normal text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
						onClick: handleNavigation
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(` Попробовать бесплатно `);
							else return [createTextVNode(" Попробовать бесплатно ")];
						}),
						_: 1
					}, _parent));
					_push(`<p class="text-center font-mono text-public-menu-note text-muted"> 3 дня бесплатно · До 5 устройств </p></nav></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
		};
	}
};
var _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/PublicMobileMenu.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
//#endregion
//#region resources/js/composables/useTheme.js
var STORAGE_KEY = "dudeweb-theme";
var THEMES = ["light", "dark"];
var theme = shallowRef("light");
function isTheme(value) {
	return THEMES.includes(value);
}
function persistTheme(preference) {
	try {
		window.localStorage.setItem(STORAGE_KEY, preference);
	} catch {}
}
function applyTheme() {
	document.documentElement.dataset.theme = theme.value;
	document.documentElement.classList.toggle("dark", theme.value === "dark");
	document.documentElement.style.colorScheme = theme.value;
}
function useTheme() {
	function setTheme(preference) {
		if (!isTheme(preference)) return;
		theme.value = preference;
		persistTheme(preference);
		applyTheme();
	}
	return {
		activeTheme: readonly(theme),
		setTheme,
		theme: readonly(theme),
		themes: THEMES
	};
}
//#endregion
//#region resources/js/components/public/PublicHeader.vue
var _sfc_main$2 = {
	__name: "PublicHeader",
	__ssrInlineRender: true,
	props: {
		loginHref: {
			type: String,
			required: true
		},
		navigationItems: {
			type: Array,
			required: true
		},
		registerHref: {
			type: String,
			required: true
		}
	},
	emits: ["menu-state-change"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const THEME_ACTIONS = {
			dark: {
				icon: "moon",
				label: "Тёмная тема. Включить светлую",
				next: "light"
			},
			light: {
				icon: "sun",
				label: "Светлая тема. Включить тёмную",
				next: "dark"
			}
		};
		const isMenuOpen = shallowRef(false);
		const menuTrigger = useTemplateRef("menuTrigger");
		const { setTheme, theme } = useTheme();
		const themeAction = computed(() => THEME_ACTIONS[theme.value] ?? THEME_ACTIONS.light);
		async function closeMenu() {
			if (!isMenuOpen.value) return;
			isMenuOpen.value = false;
			await nextTick();
			menuTrigger.value?.focus();
		}
		watch(isMenuOpen, (value) => emit("menu-state-change", value));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<header${ssrRenderAttrs(mergeProps({ class: "sticky top-0 z-40 h-public-header border-b border-border bg-background/95 backdrop-blur-md tablet:h-public-header-tablet desktop:h-public-header-wide" }, _attrs))}><div class="mx-auto flex h-full max-w-shell items-center px-shell-gutter tablet:px-section-sm desktop:grid desktop:grid-cols-[auto_minmax(0,1fr)_auto] desktop:px-shell-wide"><div class="tablet:hidden">`);
			_push(ssrRenderComponent(_sfc_main$5, {
				scale: "public",
				variant: "icon"
			}, null, _parent));
			_push(`</div><div class="hidden tablet:block desktop:justify-self-start">`);
			_push(ssrRenderComponent(_sfc_main$5, {
				scale: "public",
				variant: "horizontal"
			}, null, _parent));
			_push(`</div><nav aria-label="Основная навигация" class="hidden items-center gap-10 desktop:flex desktop:gap-public-nav-wide desktop:justify-self-center"><!--[-->`);
			ssrRenderList(__props.navigationItems, (item) => {
				_push(`<a${ssrRenderAttr("href", item.href)} class="rounded-control-sm text-public-nav-desktop font-semibold text-secondary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus desktop:text-public-nav-wide">${ssrInterpolate(item.label)}</a>`);
			});
			_push(`<!--]--></nav><div class="ml-auto flex items-center gap-compact tablet:gap-2.5 desktop:ml-0 desktop:gap-public-controls-wide desktop:justify-self-end"><button${ssrRenderAttr("aria-label", themeAction.value.label)} class="inline-flex size-11 items-center justify-center rounded-menu-item border border-border bg-elevated text-secondary transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:size-14 tablet:rounded-card desktop:size-public-control-wide" data-public-menu-control type="button">`);
			_push(ssrRenderComponent(_sfc_main$12, {
				name: themeAction.value.icon,
				size: "sm"
			}, null, _parent));
			_push(`</button>`);
			_push(ssrRenderComponent(unref(Link), {
				href: __props.loginHref,
				class: "inline-flex min-h-11 items-center justify-center rounded-control border border-border bg-elevated px-control-inline text-ui-body font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-14 tablet:rounded-card tablet:px-5 tablet:text-public-control-tablet desktop:min-h-public-control-height-wide desktop:rounded-public-control desktop:px-public-login-inline-wide desktop:text-public-control-wide",
				"data-public-menu-control": "",
				onClick: closeMenu
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Войти `);
					else return [createTextVNode(" Войти ")];
				}),
				_: 1
			}, _parent));
			_push(`<button${ssrRenderAttr("aria-expanded", isMenuOpen.value)}${ssrRenderAttr("aria-label", isMenuOpen.value ? "Закрыть меню" : "Открыть меню")} aria-controls="public-mobile-menu" class="inline-flex size-11 items-center justify-center rounded-control border border-accent-hover bg-accent text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:size-14 tablet:rounded-card desktop:hidden" data-public-menu-control type="button">`);
			_push(ssrRenderComponent(_sfc_main$12, { name: isMenuOpen.value ? "x" : "menu" }, null, _parent));
			_push(`</button>`);
			_push(ssrRenderComponent(unref(Link), {
				href: __props.registerHref,
				class: "hidden min-h-public-control-height-wide items-center justify-center rounded-public-control border border-accent-hover bg-accent px-public-cta-inline-wide text-public-control-wide font-bold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus desktop:inline-flex"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Попробовать бесплатно `);
					else return [createTextVNode(" Попробовать бесплатно ")];
				}),
				_: 1
			}, _parent));
			_push(`</div></div>`);
			_push(ssrRenderComponent(_sfc_main$3, {
				items: __props.navigationItems,
				"login-href": __props.loginHref,
				open: isMenuOpen.value,
				"register-href": __props.registerHref,
				onClose: closeMenu,
				onNavigate: closeMenu
			}, null, _parent));
			_push(`</header>`);
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/PublicHeader.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
//#endregion
//#region resources/js/layouts/PublicLayout.vue
var LOGIN_HREF = "/login";
var REGISTER_HREF = "/register";
var SUPPORT_HREF = "https://t.me/hey_dude_web";
var _sfc_main$1 = {
	__name: "PublicLayout",
	__ssrInlineRender: true,
	setup(__props) {
		const NAVIGATION_ITEMS = [
			{
				label: "Преимущества",
				href: "#advantages"
			},
			{
				label: "Устройства",
				href: "#devices"
			},
			{
				label: "Тариф",
				href: "#pricing"
			}
		];
		const isMenuOpen = shallowRef(false);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen flex-col bg-background text-foreground transition-colors" }, _attrs))}><a href="#main-content" class="fixed -top-16 left-compact z-50 rounded-control bg-accent px-content py-tight font-semibold text-accent-foreground transition-[top] focus:top-compact focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"> К основному содержимому </a>`);
			_push(ssrRenderComponent(_sfc_main$2, {
				"login-href": LOGIN_HREF,
				"navigation-items": NAVIGATION_ITEMS,
				"register-href": REGISTER_HREF,
				onMenuStateChange: ($event) => isMenuOpen.value = $event
			}, null, _parent));
			_push(`<main id="main-content"${ssrIncludeBooleanAttr(isMenuOpen.value) ? " inert" : ""} class="flex-1" tabindex="-1">`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</main>`);
			_push(ssrRenderComponent(_sfc_main$4, {
				inert: isMenuOpen.value,
				"login-href": LOGIN_HREF,
				"navigation-items": NAVIGATION_ITEMS,
				"register-href": REGISTER_HREF,
				"support-href": SUPPORT_HREF
			}, null, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layouts/PublicLayout.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Public/Home.vue
var Home_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main });
var _sfc_main = /*@__PURE__*/ Object.assign({ layout: _sfc_main$1 }, {
	__name: "Home",
	__ssrInlineRender: true,
	props: {
		plans: {
			type: Array,
			required: true
		},
		pricingState: {
			type: String,
			required: true
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Любимые сервисы снова рядом" }, null, _parent));
			_push(`<div>`);
			_push(ssrRenderComponent(_sfc_main$13, null, null, _parent));
			_push(ssrRenderComponent(_sfc_main$11, { "device-limit": __props.plans[0]?.deviceLimit ?? null }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$10, null, null, _parent));
			_push(ssrRenderComponent(LandingPricing_default, {
				plans: __props.plans,
				state: __props.pricingState
			}, null, _parent));
			_push(ssrRenderComponent(LandingFinalCta_default, null, null, _parent));
			_push(`</div><!--]-->`);
		};
	}
});
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Public/Home.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
//#region resources/js/ssr.js
var pages = /* #__PURE__ */ Object.assign({ "./pages/Public/Home.vue": Home_exports });
var renderPage = (page) => createInertiaApp({
	page,
	render: renderToString,
	resolve: (name) => {
		return pages[`./pages/${name}.vue`];
	},
	title: (title) => title ? `${title} - dudeweb` : "dudeweb",
	setup({ App, props, plugin }) {
		return createSSRApp({ render: () => h(App, props) }).use(plugin);
	}
});
createServer(renderPage);
//#endregion
export { renderPage as default };

//# sourceMappingURL=ssr.js.map