import { Fragment, computed, createBlock, createCommentVNode, createSSRApp, createSlots, createTextVNode, createVNode, h, inject, isRef, mergeModels, mergeProps, nextTick, onBeforeUnmount, onMounted, openBlock, provide, readonly, renderList, resolveDynamicComponent, shallowRef, toDisplayString, toValue, unref, useId, useModel, useSSRContext, useSlots, useTemplateRef, watch, withCtx, withModifiers } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderDynamicModel, ssrRenderList, ssrRenderSlot, ssrRenderStyle, ssrRenderTeleport, ssrRenderVNode } from "vue/server-renderer";
import { Head, Link, createInertiaApp, router, useForm, useHttp, usePage } from "@inertiajs/vue3";
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
//#region resources/js/components/brand/BrandLogo.vue
var _sfc_main$75 = {
	__name: "BrandLogo",
	__ssrInlineRender: true,
	props: {
		variant: {
			type: String,
			default: "horizontal",
			validator: (value) => [
				"horizontal",
				"icon",
				"stacked",
				"wordmark"
			].includes(value)
		},
		scale: {
			type: String,
			default: "default",
			validator: (value) => [
				"default",
				"footer",
				"public",
				"account"
			].includes(value)
		}
	},
	setup(__props) {
		const CONTAINER_CLASSES = {
			horizontal: "inline-flex items-center gap-logo-gap",
			icon: "inline-flex",
			stacked: "inline-flex flex-col items-center gap-tight",
			wordmark: "inline-flex"
		};
		const SCALE_CONTAINER_CLASSES = {
			account: "gap-account-logo-gap",
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
			account: {
				horizontal: "h-auto w-account-logo",
				icon: "h-auto w-account-logo"
			},
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
			account: { horizontal: "font-sans text-interface-brand font-bold tracking-interface-brand text-foreground" },
			default: {
				horizontal: "font-brand text-brand-lockup font-bold tracking-public-brand text-foreground",
				stacked: "font-brand text-brand-stacked font-bold tracking-public-brand text-foreground",
				wordmark: "font-sans text-interface-brand font-bold tracking-interface-brand text-foreground"
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
			}, _attrs))}>`);
			if (__props.variant !== "wordmark") _push(`<span class="${ssrRenderClass(markFrameClass.value)}"><svg class="${ssrRenderClass(markClass.value)}" aria-hidden="true" viewBox="0 0 213.435 147.7913" xmlns="http://www.w3.org/2000/svg"><path class="fill-logo-primary" d="M167.36626 44.31375l-24.77251 30.54375 21.1275 0c9.45001 0 17.11127 7.32375 17.11127 17.38125 0 13.22999-11.67752 23.0175-23.42252 23.0175-17.24624 0-32.16374-14.14124-43.2675-24.26624l28.75501-27.23626 0-22.84875c-23.4225 22.44375-52.88625 49.95-68.985 63.31499-5.77125 4.72501-12.38626 7.39125-18.63001 7.39125-12.92625 0-23.52375-10.5975-23.52375-23.32124 0-15.35626 11.475-25.75125 24.30001-25.75125 6.68249 0 13.46625 2.86875 18.22499 7.66126l13.095 13.46624 22.68001-20.8575 0-47.82375c0-8.67375-6.21001-14.985-15.42375-14.985l-17.82001 0 0 32.4675c-5.43375-1.755-11.07001-2.7675-17.44874-2.7675-32.1975 0-59.36626 26.62875-59.36626 59.4675 0 31.05001 24.97501 53.18998 52.1775 53.18998 11.98125 0 24.3-4.89373 33.51375-12.52124l12.48751-10.69874c14.20874 12.99376 33.88501 28.65376 58.55624 28.65376 31.55626 0 56.7-25.54876 56.7-56.025 0-26.66251-20.95874-47.28376-46.06874-47.45251z"></path><path class="fill-logo-highlight" d="M16.97624 19.27126l-14.71501-0.00001c-1.34999 0-2.26123-0.945-2.26123-2.39625l0-14.41125c0-1.45124 0.97874-2.46375 2.26123-2.46375l14.71501 0c1.2825 0 2.32874 0.945 2.32874 2.26125l0 14.61375c0 1.45126-0.94499 2.39626-2.32874 2.39625z" transform="translate(144.72 16.74)"></path></svg></span>`);
			else _push(`<!---->`);
			if (__props.variant !== "icon") _push(`<span class="${ssrRenderClass(wordmarkClass.value)}">dudeweb</span>`);
			else _push(`<!---->`);
			_push(`</span>`);
		};
	}
};
var _sfc_setup$75 = _sfc_main$75.setup;
_sfc_main$75.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/brand/BrandLogo.vue");
	return _sfc_setup$75 ? _sfc_setup$75(props, ctx) : void 0;
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
var _sfc_main$74 = {
	__name: "UiIcon",
	__ssrInlineRender: true,
	props: {
		name: {
			type: String,
			required: true,
			validator: (value) => [
				"mail",
				"lock",
				"eye",
				"eyeOff",
				"arrowUpRight",
				"arrowLeft",
				"gift",
				"share",
				"send",
				"keyRound",
				"alertTriangle",
				"check",
				"chevronRight",
				"circleCheck",
				"circleX",
				"clock",
				"copy",
				"creditCard",
				"ticket",
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
				"connection",
				"status",
				"lg",
				"md",
				"sm"
			].includes(value)
		}
	},
	setup(__props) {
		const ICONS = {
			keyRound: [{
				tag: "circle",
				attrs: {
					cx: "15.5",
					cy: "8.5",
					r: "5.5"
				}
			}, {
				tag: "path",
				attrs: { d: "m11.6 12.4-8.6 8.6H6v-3h3v-3l2.6-2.6M16 8h.01" }
			}],
			send: [{
				tag: "path",
				attrs: { d: "m22 2-7 20-4-9-9-4L22 2ZM22 2 11 13" }
			}],
			arrowLeft: [{
				tag: "path",
				attrs: { d: "m12 19-7-7 7-7M5 12h14" }
			}],
			gift: [{
				tag: "path",
				attrs: { d: "M12 8v13M3 8h18v4H3zM5 12v9h14v-9M12 8H7.5A2.5 2.5 0 1 1 10 5.5L12 8Zm0 0h4.5A2.5 2.5 0 1 0 14 5.5L12 8Z" }
			}],
			share: [
				{
					tag: "circle",
					attrs: {
						cx: 18,
						cy: 5,
						r: 3
					}
				},
				{
					tag: "circle",
					attrs: {
						cx: 6,
						cy: 12,
						r: 3
					}
				},
				{
					tag: "circle",
					attrs: {
						cx: 18,
						cy: 19,
						r: 3
					}
				},
				{
					tag: "path",
					attrs: { d: "m8.6 10.5 6.8-4m-6.8 7 6.8 4" }
				}
			],
			...LANDING_ICONS,
			mail: [{
				tag: "rect",
				attrs: {
					x: "2",
					y: "4",
					width: "20",
					height: "16",
					rx: "2"
				}
			}, {
				tag: "path",
				attrs: { d: "m22 6-10 7L2 6" }
			}],
			lock: [{
				tag: "rect",
				attrs: {
					x: "3",
					y: "11",
					width: "18",
					height: "11",
					rx: "2"
				}
			}, {
				tag: "path",
				attrs: { d: "M7 11V7a5 5 0 0 1 10 0v4" }
			}],
			eye: [{
				tag: "path",
				attrs: { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" }
			}, {
				tag: "circle",
				attrs: {
					cx: "12",
					cy: "12",
					r: "3"
				}
			}],
			eyeOff: [{
				tag: "path",
				attrs: { d: "m3 3 18 18M10.58 10.58a2 2 0 0 0 2.84 2.84M9.88 5.09A11 11 0 0 1 12 5c7 0 10 7 10 7a16 16 0 0 1-3.17 4.18M6.61 6.61A17 17 0 0 0 2 12s3 7 10 7a11 11 0 0 0 5.39-1.39" }
			}],
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
			ticket: [{
				tag: "path",
				attrs: { d: "M4 5h16a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6V7a2 2 0 0 1 2-2Z" }
			}, {
				tag: "path",
				attrs: { d: "M13 5v2m0 4v2m0 4v2" }
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
			connection: "size-connection-platform-icon",
			lg: "size-6",
			status: "size-auth-status-glyph",
			md: "size-5",
			sm: "size-4"
		};
		const props = __props;
		const elements = computed(() => ICONS[props.name] ?? ICONS.info);
		const iconClass = computed(() => [
			"shrink-0",
			SIZE_CLASSES[props.size] ?? SIZE_CLASSES.md,
			props.name === "loader" ? "animate-spin motion-reduce:animate-none" : ""
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
var _sfc_setup$74 = _sfc_main$74.setup;
_sfc_main$74.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/UiIcon.vue");
	return _sfc_setup$74 ? _sfc_setup$74(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/ui/BaseButton.vue
var BASE_CLASSES = "inline-flex items-center justify-center gap-compact rounded-button border font-sans transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60";
var _sfc_main$73 = {
	__name: "BaseButton",
	__ssrInlineRender: true,
	props: {
		disabled: Boolean,
		fullWidth: Boolean,
		label: {
			type: String,
			default: ""
		},
		loading: Boolean,
		loadingLabel: {
			type: String,
			default: "Загрузка"
		},
		size: {
			type: String,
			default: "md",
			validator: (value) => [
				"icon",
				"copy",
				"md",
				"sm"
			].includes(value)
		},
		type: {
			type: String,
			default: "button",
			validator: (value) => [
				"button",
				"reset",
				"submit"
			].includes(value)
		},
		variant: {
			type: String,
			default: "primary",
			validator: (value) => [
				"accent",
				"danger",
				"ghost",
				"primary",
				"secondary"
			].includes(value)
		}
	},
	emits: ["click"],
	setup(__props, { emit: __emit }) {
		const VARIANT_CLASSES = {
			accent: "border-border bg-elevated text-accent-text hover:bg-surface",
			danger: "border-error/40 bg-transparent text-error hover:bg-error-soft",
			ghost: "border-transparent bg-transparent text-secondary hover:bg-surface hover:text-foreground",
			primary: "border-accent-border bg-accent text-accent-foreground hover:border-accent-border-hover hover:bg-accent-hover",
			secondary: "border-border bg-elevated text-foreground hover:bg-surface"
		};
		const SIZE_CLASSES = {
			icon: "size-interface-header-control shrink-0 p-0",
			copy: "size-interface-copy shrink-0 rounded-interface-copy p-0",
			md: "min-h-interface-control px-interface-inline py-tight text-interface-action font-bold",
			sm: "min-h-10 px-content py-compact text-ui-detail font-semibold"
		};
		const props = __props;
		const buttonClass = computed(() => [
			BASE_CLASSES,
			VARIANT_CLASSES[props.variant] ?? VARIANT_CLASSES.primary,
			SIZE_CLASSES[props.size] ?? SIZE_CLASSES.md,
			props.fullWidth ? "w-full" : ""
		]);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<button${ssrRenderAttrs(mergeProps({
				"aria-busy": __props.loading,
				class: buttonClass.value,
				disabled: __props.disabled || __props.loading,
				type: __props.type
			}, _attrs))}>`);
			if (__props.loading) _push(ssrRenderComponent(_sfc_main$74, {
				name: "loader",
				size: "sm"
			}, null, _parent));
			else _push(`<!---->`);
			if (__props.loading) _push(`<span>${ssrInterpolate(__props.loadingLabel)}</span>`);
			else if (_ctx.$slots.default) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			else _push(`<span>${ssrInterpolate(__props.label)}</span>`);
			_push(`</button>`);
		};
	}
};
var _sfc_setup$73 = _sfc_main$73.setup;
_sfc_main$73.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/BaseButton.vue");
	return _sfc_setup$73 ? _sfc_setup$73(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/account/AccountTopHeader.vue
var _sfc_main$72 = {
	__name: "AccountTopHeader",
	__ssrInlineRender: true,
	props: {
		pageTitle: {
			type: String,
			required: true
		},
		profileHref: {
			type: String,
			default: "/account/profile"
		},
		theme: {
			type: String,
			default: "light",
			validator: (value) => ["dark", "light"].includes(value)
		}
	},
	emits: ["change-theme"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const themeIcon = computed(() => ({
			dark: "moon",
			light: "sun"
		})[props.theme]);
		const themeLabel = computed(() => ({
			dark: "Тёмная тема. Включить светлую",
			light: "Светлая тема. Включить тёмную"
		})[props.theme]);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<header${ssrRenderAttrs(mergeProps({ class: "sticky top-0 z-30 flex min-h-account-header flex-wrap items-center justify-between gap-compact border-b border-border bg-background/95 px-shell-gutter desktop:px-section-md" }, _attrs))}><div class="flex min-w-0 flex-1 flex-wrap items-center gap-tight">`);
			_push(ssrRenderComponent(_sfc_main$75, {
				variant: "wordmark",
				class: "desktop:hidden"
			}, null, _parent));
			_push(`<span aria-hidden="true" class="h-5 w-px bg-border desktop:hidden"></span><span class="min-w-0 flex-1 text-interface-title font-display wrap-anywhere text-secondary desktop:text-foreground">${ssrInterpolate(__props.pageTitle)}</span></div><div class="flex shrink-0 items-center gap-compact">`);
			_push(ssrRenderComponent(_sfc_main$73, {
				"aria-label": themeLabel.value,
				size: "icon",
				variant: "secondary",
				onClick: ($event) => emit("change-theme")
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$74, {
						name: themeIcon.value,
						size: "sm"
					}, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$74, {
						name: themeIcon.value,
						size: "sm"
					}, null, 8, ["name"])];
				}),
				_: 1
			}, _parent));
			if (__props.profileHref) _push(ssrRenderComponent(unref(Link), {
				href: __props.profileHref,
				"aria-label": "Открыть профиль",
				class: "inline-flex size-interface-header-control items-center justify-center rounded-control border border-border bg-elevated text-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$74, { name: "user" }, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$74, { name: "user" })];
				}),
				_: 1
			}, _parent));
			else _push(ssrRenderComponent(_sfc_main$73, {
				"aria-label": "Профиль",
				size: "icon",
				variant: "secondary",
				disabled: ""
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$74, { name: "user" }, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$74, { name: "user" })];
				}),
				_: 1
			}, _parent));
			_push(`</div></header>`);
		};
	}
};
var _sfc_setup$72 = _sfc_main$72.setup;
_sfc_main$72.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/account/AccountTopHeader.vue");
	return _sfc_setup$72 ? _sfc_setup$72(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/brand/BrandLink.vue
var _sfc_main$71 = {
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
				"stacked",
				"wordmark"
			].includes(value)
		},
		scale: {
			type: String,
			default: "default",
			validator: (value) => [
				"default",
				"footer",
				"public",
				"account"
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
					if (_push) _push(ssrRenderComponent(_sfc_main$75, {
						scale: __props.scale,
						variant: __props.variant
					}, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$75, {
						scale: __props.scale,
						variant: __props.variant
					}, null, 8, ["scale", "variant"])];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup$71 = _sfc_main$71.setup;
_sfc_main$71.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/brand/BrandLink.vue");
	return _sfc_setup$71 ? _sfc_setup$71(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/ui/InlineAlert.vue
var _sfc_main$70 = {
	__name: "InlineAlert",
	__ssrInlineRender: true,
	props: {
		message: {
			type: String,
			default: ""
		},
		variant: {
			type: String,
			default: "info",
			validator: (value) => [
				"error",
				"info",
				"success",
				"warning"
			].includes(value)
		}
	},
	setup(__props) {
		const VARIANT_CLASSES = {
			error: "border-error/40 bg-error-soft text-error",
			info: "border-border bg-elevated text-secondary",
			success: "border-success/40 bg-success-soft text-success",
			warning: "border-warning/40 bg-warning-soft text-warning"
		};
		const VARIANT_ICONS = {
			error: "circleX",
			info: "info",
			success: "circleCheck",
			warning: "alertTriangle"
		};
		const props = __props;
		const alertClass = computed(() => ["flex items-start gap-tight rounded-button border p-control-inline text-interface-body", VARIANT_CLASSES[props.variant] ?? VARIANT_CLASSES.info]);
		const icon = computed(() => VARIANT_ICONS[props.variant] ?? VARIANT_ICONS.info);
		const role = computed(() => props.variant === "error" ? "alert" : "status");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: alertClass.value,
				role: role.value
			}, _attrs))}>`);
			_push(ssrRenderComponent(_sfc_main$74, {
				name: icon.value,
				size: "sm"
			}, null, _parent));
			_push(`<div class="min-w-0 flex-1">`);
			if (_ctx.$slots.title) {
				_push(`<p class="font-semibold text-foreground">`);
				ssrRenderSlot(_ctx.$slots, "title", {}, null, _push, _parent);
				_push(`</p>`);
			} else _push(`<!---->`);
			if (_ctx.$slots.default) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			else _push(`<p>${ssrInterpolate(__props.message)}</p>`);
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup$70 = _sfc_main$70.setup;
_sfc_main$70.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/InlineAlert.vue");
	return _sfc_setup$70 ? _sfc_setup$70(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/account/AccountNavLink.vue
var _sfc_main$69 = {
	__name: "AccountNavLink",
	__ssrInlineRender: true,
	props: {
		item: {
			type: Object,
			required: true
		},
		active: Boolean,
		variant: {
			type: String,
			default: "sidebar",
			validator: (value) => [
				"sidebar",
				"bottom",
				"sheet"
			].includes(value)
		}
	},
	emits: ["navigate"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const tag = computed(() => props.item.disabled ? "button" : props.item.external ? "a" : Link);
		const VARIANTS = {
			sidebar: "min-h-account-sidebar-item justify-start gap-tight px-control-inline text-interface-navigation font-semibold",
			bottom: "min-h-14 flex-1 flex-col justify-center gap-control py-control text-interface-bottom-nav font-medium",
			sheet: "min-h-account-sheet-row justify-start gap-tight bg-surface px-control-inline text-interface-body font-medium"
		};
		const classes = computed(() => [
			"flex min-w-0 items-center rounded-control text-left transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60",
			VARIANTS[props.variant],
			props.active ? "bg-accent-soft font-semibold text-accent-text" : "text-secondary",
			!props.item.disabled && !props.active ? "hover:bg-surface hover:text-foreground" : ""
		]);
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderVNode(_push, createVNode(resolveDynamicComponent(tag.value), mergeProps({
				href: __props.item.disabled ? void 0 : __props.item.href,
				type: __props.item.disabled ? "button" : void 0,
				disabled: __props.item.disabled || void 0,
				"aria-disabled": __props.item.disabled || void 0,
				"aria-current": __props.active ? "page" : void 0,
				class: classes.value,
				onClick: ($event) => !__props.item.disabled && emit("navigate", __props.item.key)
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_sfc_main$74, {
							name: __props.item.icon,
							size: __props.variant === "sheet" ? "md" : "sm"
						}, null, _parent, _scopeId));
						_push(`<span class="min-w-0 wrap-anywhere"${_scopeId}>${ssrInterpolate(__props.item.label)}</span>`);
						if (__props.variant === "sheet") _push(ssrRenderComponent(_sfc_main$74, {
							name: "chevronRight",
							size: "sm",
							class: "ml-auto shrink-0 text-muted"
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
					} else return [
						createVNode(_sfc_main$74, {
							name: __props.item.icon,
							size: __props.variant === "sheet" ? "md" : "sm"
						}, null, 8, ["name", "size"]),
						createVNode("span", { class: "min-w-0 wrap-anywhere" }, toDisplayString(__props.item.label), 1),
						__props.variant === "sheet" ? (openBlock(), createBlock(_sfc_main$74, {
							key: 0,
							name: "chevronRight",
							size: "sm",
							class: "ml-auto shrink-0 text-muted"
						})) : createCommentVNode("", true)
					];
				}),
				_: 1
			}), _parent);
		};
	}
};
var _sfc_setup$69 = _sfc_main$69.setup;
_sfc_main$69.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/account/AccountNavLink.vue");
	return _sfc_setup$69 ? _sfc_setup$69(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/account/AccountSidebar.vue
var _sfc_main$68 = {
	__name: "AccountSidebar",
	__ssrInlineRender: true,
	props: {
		activeKey: {
			type: String,
			required: true
		},
		items: {
			type: Array,
			required: true,
			validator: (items) => items.every((item) => typeof item.key === "string" && typeof item.label === "string" && typeof item.href === "string" && typeof item.icon === "string")
		},
		logoutLoading: Boolean,
		logoutError: {
			type: String,
			default: ""
		},
		profileHref: {
			type: String,
			default: "/account/profile"
		}
	},
	emits: ["logout", "navigate"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const ITEM_CLASSES = {
			active: "bg-accent-soft font-semibold text-accent-text",
			default: "bg-transparent font-semibold text-secondary hover:bg-surface hover:text-foreground"
		};
		function itemClass(key) {
			return ["flex min-h-account-sidebar-item items-center gap-tight rounded-control px-control-inline text-interface-navigation transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus", props.activeKey === key ? ITEM_CLASSES.active : ITEM_CLASSES.default];
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<aside${ssrRenderAttrs(mergeProps({ class: "flex h-full w-account-sidebar flex-col justify-between gap-section-sm overflow-y-auto border-r border-border bg-account-sidebar px-sidebar-gutter py-account-sidebar-top" }, _attrs))}><div class="grid shrink-0 gap-section-sm">`);
			_push(ssrRenderComponent(_sfc_main$71, { scale: "account" }, null, _parent));
			_push(`<nav aria-label="Разделы личного кабинета" class="grid gap-control"><!--[-->`);
			ssrRenderList(__props.items, (item) => {
				_push(ssrRenderComponent(_sfc_main$69, {
					key: item.key,
					item,
					active: __props.activeKey === item.key,
					onNavigate: ($event) => emit("navigate", $event)
				}, null, _parent));
			});
			_push(`<!--]--></nav></div><div class="grid shrink-0 gap-control">`);
			if (__props.profileHref) _push(ssrRenderComponent(unref(Link), {
				"aria-current": __props.activeKey === "profile" ? "page" : void 0,
				class: itemClass("profile"),
				href: __props.profileHref
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_sfc_main$74, {
							name: "user",
							size: "sm"
						}, null, _parent, _scopeId));
						_push(` Профиль `);
					} else return [createVNode(_sfc_main$74, {
						name: "user",
						size: "sm"
					}), createTextVNode(" Профиль ")];
				}),
				_: 1
			}, _parent));
			else {
				_push(`<button class="${ssrRenderClass([itemClass("profile"), "cursor-not-allowed opacity-60"])}" type="button" disabled>`);
				_push(ssrRenderComponent(_sfc_main$74, {
					name: "user",
					size: "sm"
				}, null, _parent));
				_push(` Профиль </button>`);
			}
			if (__props.logoutError) _push(ssrRenderComponent(_sfc_main$70, {
				variant: "error",
				message: __props.logoutError
			}, null, _parent));
			else _push(`<!---->`);
			_push(`<button${ssrRenderAttr("aria-busy", __props.logoutLoading)} class="flex min-h-account-sidebar-item items-center gap-tight rounded-control px-control-inline text-interface-navigation font-semibold text-error transition-colors duration-200 motion-reduce:transition-none hover:bg-error-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-60"${ssrIncludeBooleanAttr(__props.logoutLoading) ? " disabled" : ""} type="button">`);
			_push(ssrRenderComponent(_sfc_main$74, {
				name: __props.logoutLoading ? "loader" : "logOut",
				size: "sm"
			}, null, _parent));
			_push(` ${ssrInterpolate(__props.logoutLoading ? "Выходим" : "Выйти")}</button></div></aside>`);
		};
	}
};
var _sfc_setup$68 = _sfc_main$68.setup;
_sfc_main$68.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/account/AccountSidebar.vue");
	return _sfc_setup$68 ? _sfc_setup$68(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/account/AccountBottomNavigation.vue
var _sfc_main$67 = {
	__name: "AccountBottomNavigation",
	__ssrInlineRender: true,
	props: {
		activeKey: {
			type: String,
			required: true
		},
		items: {
			type: Array,
			required: true,
			validator: (items) => items.every((item) => typeof item.key === "string" && typeof item.label === "string" && typeof item.icon === "string" && (typeof item.href === "string" || item.action === true))
		},
		moreOpen: Boolean
	},
	emits: ["navigate", "select-action"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const ITEM_CLASSES = {
			active: "bg-accent-soft font-semibold text-accent-text",
			default: "bg-transparent font-medium text-muted hover:bg-surface hover:text-foreground"
		};
		function itemClass(item) {
			return ["flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-control rounded-button py-control text-interface-bottom-nav transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus", props.activeKey === item.key ? ITEM_CLASSES.active : ITEM_CLASSES.default];
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<nav${ssrRenderAttrs(mergeProps({
				"aria-label": "Навигация личного кабинета",
				class: "flex min-h-account-bottom-nav items-start gap-control border-t border-border bg-surface px-control-inline pt-compact pb-account-nav-bottom"
			}, _attrs))}><!--[-->`);
			ssrRenderList(__props.items, (item) => {
				_push(`<!--[-->`);
				if (item.href) _push(ssrRenderComponent(_sfc_main$69, {
					item,
					active: __props.activeKey === item.key,
					variant: "bottom",
					onNavigate: ($event) => emit("navigate", $event)
				}, null, _parent));
				else {
					_push(`<button${ssrRenderAttr("aria-expanded", __props.moreOpen)} aria-controls="account-more" aria-haspopup="dialog" class="${ssrRenderClass(itemClass(item))}" type="button">`);
					_push(ssrRenderComponent(_sfc_main$74, {
						name: item.icon,
						size: "sm"
					}, null, _parent));
					_push(`<span class="wrap-anywhere">${ssrInterpolate(item.label)}</span></button>`);
				}
				_push(`<!--]-->`);
			});
			_push(`<!--]--></nav>`);
		};
	}
};
var _sfc_setup$67 = _sfc_main$67.setup;
_sfc_main$67.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/account/AccountBottomNavigation.vue");
	return _sfc_setup$67 ? _sfc_setup$67(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/account/MoreNavigationSheet.vue
var _sfc_main$66 = {
	__name: "MoreNavigationSheet",
	__ssrInlineRender: true,
	props: {
		items: {
			type: Array,
			required: true,
			validator: (items) => items.every((item) => typeof item.key === "string" && typeof item.label === "string" && typeof item.href === "string" && typeof item.icon === "string")
		},
		logoutLoading: Boolean,
		logoutError: {
			type: String,
			default: ""
		},
		activeKey: {
			type: String,
			default: ""
		}
	},
	emits: [
		"close",
		"logout",
		"navigate"
	],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "grid w-full gap-account-sheet-content-gap rounded-t-sheet border-t border-border bg-elevated px-shell-gutter pt-account-sheet-top pb-account-sheet-bottom" }, _attrs))}><div aria-hidden="true" class="flex h-account-sheet-handle items-center justify-center"><span class="h-1 w-10 rounded-full bg-muted/60"></span></div><header class="flex min-h-account-sheet-header items-center justify-between"><h2 id="account-more-title" class="text-interface-title font-display text-foreground">Ещё</h2>`);
			_push(ssrRenderComponent(_sfc_main$73, {
				"aria-label": "Закрыть меню",
				size: "icon",
				variant: "secondary",
				disabled: __props.logoutLoading,
				onClick: ($event) => emit("close")
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$74, { name: "x" }, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$74, { name: "x" })];
				}),
				_: 1
			}, _parent));
			_push(`</header><p id="account-more-description" class="sr-only">Дополнительные разделы и выход из аккаунта.</p><nav aria-label="Дополнительные разделы" class="grid gap-account-sheet-menu-gap"><!--[-->`);
			ssrRenderList(__props.items, (item) => {
				_push(ssrRenderComponent(_sfc_main$69, {
					key: item.key,
					item: {
						...item,
						disabled: __props.logoutLoading
					},
					active: __props.activeKey === item.key,
					variant: "sheet",
					onNavigate: ($event) => emit("navigate", $event)
				}, null, _parent));
			});
			_push(`<!--]--></nav>`);
			if (__props.logoutError) _push(ssrRenderComponent(_sfc_main$70, {
				variant: "error",
				message: __props.logoutError
			}, null, _parent));
			else _push(`<!---->`);
			_push(`<button${ssrRenderAttr("aria-busy", __props.logoutLoading)} class="flex min-h-account-sheet-row items-center gap-tight rounded-button border border-error/40 px-control-inline text-interface-body font-semibold text-error transition-colors duration-200 motion-reduce:transition-none hover:bg-error-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-60"${ssrIncludeBooleanAttr(__props.logoutLoading) ? " disabled" : ""} type="button">`);
			_push(ssrRenderComponent(_sfc_main$74, { name: __props.logoutLoading ? "loader" : "logOut" }, null, _parent));
			_push(` ${ssrInterpolate(__props.logoutLoading ? "Выходим" : "Выйти")}</button></section>`);
		};
	}
};
var _sfc_setup$66 = _sfc_main$66.setup;
_sfc_main$66.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/account/MoreNavigationSheet.vue");
	return _sfc_setup$66 ? _sfc_setup$66(props, ctx) : void 0;
};
//#endregion
//#region resources/js/composables/useOverlay.js
var FOCUSABLE = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])";
function useOverlay({ open, panel, busy, close, background = () => [document.getElementById("app")], additionalControls = () => [] }) {
	let restore = null;
	function focusable() {
		return [...additionalControls(), ...panel.value?.querySelectorAll(FOCUSABLE) ?? []].filter((element) => !element.matches(":disabled") && element.tabIndex >= 0 && !element.closest("[inert]") && element.getClientRects().length > 0 && window.getComputedStyle(element).visibility !== "hidden");
	}
	function focusFirst() {
		(focusable().find((element) => panel.value?.contains(element)) ?? panel.value)?.focus();
	}
	function contains(element) {
		return panel.value?.contains(element) || additionalControls().includes(element);
	}
	function keydown(event) {
		if (!toValue(open)) return;
		if (event.key === "Escape") {
			event.preventDefault();
			event.stopPropagation();
			if (!toValue(busy)) close();
			return;
		}
		if (event.key !== "Tab") return;
		const controls = focusable();
		const first = controls[0];
		const last = controls.at(-1);
		if (!first) {
			event.preventDefault();
			panel.value?.focus();
		} else if (!contains(document.activeElement)) {
			event.preventDefault();
			first.focus();
		} else if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}
	function focusin(event) {
		if (toValue(open) && panel.value && !contains(event.target)) focusFirst();
	}
	watch(() => toValue(open), async (isOpen, previous, onCleanup) => {
		if (!isOpen || typeof document === "undefined") return;
		const trigger = document.activeElement;
		const targets = background().filter(Boolean).map((element) => ({
			element,
			wasInert: element.inert
		}));
		const overflow = document.body.style.overflow;
		const paddingRight = document.body.style.paddingRight;
		const scrollbar = window.innerWidth - document.documentElement.clientWidth;
		let cancelled = false;
		targets.forEach(({ element }) => {
			element.inert = true;
		});
		if (scrollbar > 0) {
			const padding = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
			document.body.style.paddingRight = `${padding + scrollbar}px`;
		}
		document.body.style.overflow = "hidden";
		restore = () => {
			cancelled = true;
			targets.forEach(({ element, wasInert }) => {
				element.inert = wasInert;
			});
			document.body.style.overflow = overflow;
			document.body.style.paddingRight = paddingRight;
			if (trigger?.isConnected && !trigger.closest("[inert]") && trigger.getClientRects().length) trigger.focus();
			restore = null;
		};
		onCleanup(() => restore?.());
		await nextTick();
		if (!cancelled) focusFirst();
	}, {
		flush: "post",
		immediate: true
	});
	onMounted(() => {
		document.addEventListener("keydown", keydown, true);
		document.addEventListener("focusin", focusin);
	});
	onBeforeUnmount(() => {
		document.removeEventListener("keydown", keydown, true);
		document.removeEventListener("focusin", focusin);
		restore?.();
	});
}
//#endregion
//#region resources/js/components/ui/BaseOverlay.vue
var _sfc_main$65 = {
	__name: "BaseOverlay",
	__ssrInlineRender: true,
	props: {
		open: Boolean,
		busy: Boolean,
		labelledBy: {
			type: String,
			required: true
		},
		describedBy: {
			type: String,
			required: true
		},
		id: {
			type: String,
			required: true
		},
		topOffset: {
			type: Number,
			default: 0
		},
		variant: {
			type: String,
			default: "sheet",
			validator: (value) => ["sheet", "promo"].includes(value)
		}
	},
	emits: ["close"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const panel = useTemplateRef("panel");
		const mounted = shallowRef(false);
		onMounted(() => {
			mounted.value = true;
		});
		const close = () => {
			if (!props.busy) emit("close");
		};
		useOverlay({
			open: () => props.open,
			panel,
			busy: () => props.busy,
			close
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (mounted.value) ssrRenderTeleport(_push, (_push) => {
				if (__props.open) {
					_push(`<div style="${ssrRenderStyle(__props.topOffset ? { "--account-overlay-top": `${__props.topOffset}px` } : void 0)}" class="${ssrRenderClass(["fixed inset-x-0 top-account-overlay-offset bottom-0 z-50 flex items-end justify-center bg-account-backdrop", __props.variant === "promo" ? "desktop:left-account-sidebar desktop:items-center" : ""])}"><div${ssrRenderAttr("id", __props.id)}${ssrRenderAttr("aria-labelledby", __props.labelledBy)}${ssrRenderAttr("aria-describedby", __props.describedBy)}${ssrRenderAttr("aria-busy", __props.busy)} aria-modal="true" class="${ssrRenderClass(["max-h-account-overlay-available w-full overflow-y-auto rounded-t-sheet bg-elevated outline-none tablet:max-w-account-sheet", __props.variant === "promo" ? "desktop:max-w-promo-dialog desktop:rounded-sheet" : ""])}" role="dialog" tabindex="-1">`);
					ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
					_push(`</div></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			else _push(`<!---->`);
		};
	}
};
var _sfc_setup$65 = _sfc_main$65.setup;
_sfc_main$65.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/BaseOverlay.vue");
	return _sfc_setup$65 ? _sfc_setup$65(props, ctx) : void 0;
};
//#endregion
//#region resources/js/composables/useActionForm.js
function useActionForm(data, { failureMessage = "Не удалось выполнить действие. Попробуй ещё раз." } = {}) {
	const form = useForm(data);
	let pending = false;
	let alive = true;
	function failure(message) {
		if (alive) form.setError("form", message);
		return false;
	}
	function submit(method, url, options = {}) {
		if (!alive || pending || form.processing) return;
		pending = true;
		form.clearErrors("form");
		form.submit(method, url, {
			preserveScroll: true,
			onNetworkError: () => failure("Проверь соединение и попробуй ещё раз."),
			onHttpException: () => failure(failureMessage),
			...options,
			onFinish: (visit) => {
				pending = false;
				options.onFinish?.(visit);
			}
		});
	}
	onBeforeUnmount(() => {
		alive = false;
		form.cancel();
	});
	return {
		form,
		submit
	};
}
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
	const mounted = shallowRef(false);
	const renderedTheme = computed(() => mounted.value ? theme.value : "light");
	onMounted(() => {
		mounted.value = true;
	});
	function setTheme(preference) {
		if (!isTheme(preference)) return;
		theme.value = preference;
		persistTheme(preference);
		applyTheme();
	}
	return {
		activeTheme: renderedTheme,
		setTheme,
		theme: renderedTheme,
		themes: THEMES
	};
}
//#endregion
//#region resources/js/utils/accountNavigation.js
var ACCOUNT_NAVIGATION = [
	{
		key: "dashboard",
		label: "Главная",
		icon: "house",
		href: "/account"
	},
	{
		key: "subscription",
		label: "Подписка",
		icon: "creditCard",
		href: "/account/subscription"
	},
	{
		key: "connection",
		label: "Подключение",
		icon: "plug",
		href: "/account/connection"
	},
	{
		key: "referral",
		label: "Пригласить друга",
		icon: "userPlus",
		href: "/account/referral"
	},
	{
		key: "support",
		label: "Поддержка",
		icon: "messageCircle",
		href: "/account/support"
	},
	{
		key: "profile",
		label: "Профиль",
		icon: "user",
		href: "/account/profile"
	}
];
function activeAccountSection(url) {
	const path = url.split(/[?#]/)[0];
	return ACCOUNT_NAVIGATION.filter((item) => !item.external).findLast((item) => path === item.href || path.startsWith(`${item.href}/`))?.key ?? "dashboard";
}
//#endregion
//#region resources/js/utils/accountChrome.js
var accountChromeKey = Symbol("accountChrome");
//#endregion
//#region resources/js/layouts/AccountLayout.vue
var _sfc_main$64 = {
	__name: "AccountLayout",
	__ssrInlineRender: true,
	props: {
		pageTitle: {
			type: String,
			required: true
		},
		contentSpacing: {
			type: String,
			default: "default",
			validator: (value) => [
				"default",
				"subscription",
				"connection",
				"referralTerms",
				"supportConversation",
				"profile"
			].includes(value)
		}
	},
	setup(__props) {
		const CONTENT_TOP_CLASSES = {
			default: "pt-account-content-top",
			subscription: "pt-subscription-content-top",
			connection: "pt-connection-content-top",
			referralTerms: "pt-referral-terms-top",
			supportConversation: "pt-support-conversation-top",
			profile: "pt-account-content-top"
		};
		const page = usePage();
		const activeKey = computed(() => activeAccountSection(page.url));
		const bottomActiveKey = computed(() => [
			"dashboard",
			"subscription",
			"connection"
		].includes(activeKey.value) ? activeKey.value : "more");
		const sidebarItems = ACCOUNT_NAVIGATION.filter((item) => item.key !== "profile");
		const moreItems = ACCOUNT_NAVIGATION.filter((item) => [
			"referral",
			"support",
			"profile"
		].includes(item.key));
		const bottomItems = [...ACCOUNT_NAVIGATION.slice(0, 3), {
			key: "more",
			label: "Ещё",
			icon: "menu",
			action: true
		}];
		const moreOpen = shallowRef(false);
		const { form: logout, submit: submitLogout } = useActionForm({});
		const { activeTheme, setTheme } = useTheme();
		let desktopQuery;
		let sizeObserver;
		const header = useTemplateRef("header");
		const bottom = useTemplateRef("bottom");
		const headerHeight = shallowRef(0);
		const navHeight = shallowRef(0);
		provide(accountChromeKey, { headerHeight });
		function measureChrome() {
			headerHeight.value = header.value?.$el.getBoundingClientRect().height ?? 0;
			navHeight.value = bottom.value?.getBoundingClientRect().height ?? 0;
		}
		function openMore() {
			measureChrome();
			moreOpen.value = true;
		}
		function closeMore() {
			if (!logout.processing) moreOpen.value = false;
		}
		function resize() {
			if (desktopQuery?.matches) closeMore();
		}
		function leave() {
			if (!logout.processing) submitLogout("delete", "/logout", { onSuccess: () => {
				moreOpen.value = false;
			} });
		}
		watch(() => page.url, closeMore);
		onMounted(() => {
			desktopQuery = window.matchMedia("(min-width: 75rem)");
			desktopQuery.addEventListener("change", resize);
			sizeObserver = new ResizeObserver(measureChrome);
			sizeObserver.observe(header.value.$el);
			sizeObserver.observe(bottom.value);
		});
		onBeforeUnmount(() => {
			desktopQuery?.removeEventListener("change", resize);
			sizeObserver?.disconnect();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				id: "account-shell",
				style: headerHeight.value ? {
					"--account-header-height": `${headerHeight.value}px`,
					"--account-bottom-nav-height": `${navHeight.value}px`
				} : void 0,
				class: "min-h-dvh bg-background text-foreground desktop:pl-account-sidebar"
			}, _attrs))}><a href="#account-content" class="fixed top-0 left-compact z-50 -translate-y-full rounded-control bg-accent px-content py-tight font-semibold text-accent-foreground focus:top-compact focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-focus">К основному содержимому</a><div class="fixed inset-y-0 left-0 hidden desktop:block">`);
			_push(ssrRenderComponent(_sfc_main$68, {
				"active-key": activeKey.value,
				items: unref(sidebarItems),
				"profile-href": "/account/profile",
				"logout-loading": unref(logout).processing,
				"logout-error": unref(logout).errors.form,
				onLogout: leave
			}, null, _parent));
			_push(`</div>`);
			_push(ssrRenderComponent(_sfc_main$72, {
				ref_key: "header",
				ref: header,
				"page-title": __props.pageTitle,
				"profile-href": "/account/profile",
				theme: unref(activeTheme),
				onChangeTheme: ($event) => unref(setTheme)(unref(activeTheme) === "dark" ? "light" : "dark")
			}, null, _parent));
			_push(`<main id="account-content" class="${ssrRenderClass([CONTENT_TOP_CLASSES[__props.contentSpacing], "min-w-0 scroll-mt-account-focus-top px-shell-gutter pb-account-main-bottom tablet:px-section-lg desktop:px-section-md desktop:pb-account-content-bottom [&_*]:scroll-mt-account-focus-top [&_*]:scroll-mb-account-main-bottom desktop:[&_*]:scroll-mb-account-content-bottom"])}" tabindex="-1"><div class="mx-auto w-full tablet:max-w-account-tablet desktop:max-w-account">`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</div></main><div class="fixed inset-x-0 bottom-0 z-20 desktop:hidden">`);
			_push(ssrRenderComponent(_sfc_main$67, {
				"active-key": moreOpen.value ? "more" : bottomActiveKey.value,
				items: bottomItems,
				"more-open": moreOpen.value,
				onSelectAction: openMore
			}, null, _parent));
			_push(`</div>`);
			_push(ssrRenderComponent(_sfc_main$65, {
				id: "account-more",
				open: moreOpen.value,
				busy: unref(logout).processing,
				"top-offset": headerHeight.value,
				"labelled-by": "account-more-title",
				"described-by": "account-more-description",
				onClose: closeMore
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$66, {
						items: unref(moreItems),
						"active-key": activeKey.value,
						"logout-loading": unref(logout).processing,
						"logout-error": unref(logout).errors.form,
						onClose: closeMore,
						onNavigate: closeMore,
						onLogout: leave
					}, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$66, {
						items: unref(moreItems),
						"active-key": activeKey.value,
						"logout-loading": unref(logout).processing,
						"logout-error": unref(logout).errors.form,
						onClose: closeMore,
						onNavigate: closeMore,
						onLogout: leave
					}, null, 8, [
						"items",
						"active-key",
						"logout-loading",
						"logout-error"
					])];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup$64 = _sfc_main$64.setup;
_sfc_main$64.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layouts/AccountLayout.vue");
	return _sfc_setup$64 ? _sfc_setup$64(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/ui/PageHeading.vue
var _sfc_main$63 = {
	__name: "PageHeading",
	__ssrInlineRender: true,
	props: {
		description: {
			type: String,
			default: ""
		},
		title: {
			type: String,
			required: true
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-wrap items-start justify-between gap-content" }, _attrs))}><div class="grid min-w-0 max-w-full grid-cols-1 gap-control"><h1 class="text-interface-heading font-display tracking-interface-heading break-words text-foreground">${ssrInterpolate(__props.title)}</h1>`);
			if (__props.description) _push(`<p class="text-interface-intro text-secondary">${ssrInterpolate(__props.description)}</p>`);
			else _push(`<!---->`);
			_push(`</div>`);
			if (_ctx.$slots.actions) {
				_push(`<div class="flex items-center gap-compact">`);
				ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$63 = _sfc_main$63.setup;
_sfc_main$63.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/PageHeading.vue");
	return _sfc_setup$63 ? _sfc_setup$63(props, ctx) : void 0;
};
//#endregion
//#region resources/js/composables/useCopyableLink.js
function useCopyableLink(value) {
	const status = shallowRef("idle");
	const manual = shallowRef(false);
	const busy = shallowRef(false);
	const feedback = computed(() => status.value === "copied" ? "Ссылка скопирована" : status.value === "error" ? "Не удалось скопировать ссылку. Выдели её и скопируй вручную." : "");
	let resetTimer;
	let alive = true;
	let revision = 0;
	watch(() => toValue(value), () => {
		revision++;
		status.value = "idle";
		manual.value = false;
		clearTimeout(resetTimer);
	}, { flush: "sync" });
	async function copy() {
		if (busy.value || !toValue(value)) return false;
		const attemptedValue = toValue(value);
		const attempt = revision;
		busy.value = true;
		try {
			if (window.isSecureContext && navigator.clipboard?.writeText) await navigator.clipboard.writeText(attemptedValue);
			else {
				const previous = document.activeElement;
				const field = document.createElement("textarea");
				field.value = attemptedValue;
				field.className = "fixed top-0 left-0 h-px w-px opacity-0";
				field.setAttribute("readonly", "");
				document.body.append(field);
				try {
					field.select();
					if (!document.execCommand("copy")) throw new Error("Clipboard unavailable");
				} finally {
					field.remove();
					previous?.focus({ preventScroll: true });
				}
			}
			if (!alive || revision !== attempt) return false;
			manual.value = false;
			status.value = "copied";
			clearTimeout(resetTimer);
			resetTimer = setTimeout(() => {
				status.value = "idle";
			}, 2500);
			return true;
		} catch {
			if (alive && revision === attempt) {
				status.value = "error";
				manual.value = true;
			}
			return false;
		} finally {
			if (alive) busy.value = false;
		}
	}
	onBeforeUnmount(() => {
		alive = false;
		clearTimeout(resetTimer);
	});
	return {
		status: readonly(status),
		manual: readonly(manual),
		busy: readonly(busy),
		feedback,
		copy
	};
}
//#endregion
//#region resources/js/components/ui/CopyableLink.vue
var _sfc_main$62 = {
	__name: "CopyableLink",
	__ssrInlineRender: true,
	props: {
		copyLabel: {
			type: String,
			default: "Скопировать ссылку"
		},
		value: {
			type: String,
			required: true
		},
		displayValue: {
			type: String,
			default: ""
		}
	},
	emits: ["copy-error", "copied"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const manualId = useId();
		const { status, manual, busy, feedback, copy } = useCopyableLink(() => props.value);
		async function copyValue() {
			if (busy.value || !props.value) return;
			const attemptedValue = props.value;
			const copied = await copy();
			if (props.value === attemptedValue) emit(copied ? "copied" : "copy-error");
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "grid min-w-0 grid-cols-1 gap-compact" }, _attrs))}><div class="flex min-h-interface-copy-row min-w-0 items-center gap-tight rounded-button border border-border bg-surface py-control pr-compact pl-interface-inline"><span class="min-w-0 flex-1 truncate font-mono text-interface-body text-secondary">${ssrInterpolate(__props.displayValue || __props.value)}</span>`);
			_push(ssrRenderComponent(_sfc_main$73, {
				"aria-label": unref(status) === "copied" ? "Ссылка скопирована" : __props.copyLabel,
				disabled: !__props.value || unref(busy),
				loading: unref(busy),
				"loading-label": "",
				size: "copy",
				onClick: copyValue
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$74, {
						name: unref(status) === "copied" ? "check" : "copy",
						size: "sm"
					}, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$74, {
						name: unref(status) === "copied" ? "check" : "copy",
						size: "sm"
					}, null, 8, ["name"])];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			if (unref(feedback)) _push(`<p role="status" class="${ssrRenderClass([unref(status) === "error" ? "text-error" : "text-success", "text-interface-body"])}">${ssrInterpolate(unref(feedback))}</p>`);
			else _push(`<!---->`);
			if (unref(manual)) _push(`<div class="grid min-w-0 gap-interface-field-gap"><label${ssrRenderAttr("for", unref(manualId))} class="text-interface-body text-secondary">Ссылка для ручного копирования</label><input${ssrRenderAttr("id", unref(manualId))}${ssrRenderAttr("value", __props.value)} readonly class="min-h-interface-control min-w-0 w-full rounded-button border border-interface-field-border bg-interface-input px-interface-inline font-mono text-interface-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"></div>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$62 = _sfc_main$62.setup;
_sfc_main$62.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/CopyableLink.vue");
	return _sfc_setup$62 ? _sfc_setup$62(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/ui/StatePanel.vue
var _sfc_main$61 = {
	__name: "StatePanel",
	__ssrInlineRender: true,
	props: {
		description: {
			type: String,
			required: true
		},
		state: {
			type: String,
			default: "empty",
			validator: (value) => [
				"empty",
				"loading",
				"serviceError",
				"success"
			].includes(value)
		},
		title: {
			type: String,
			required: true
		}
	},
	setup(__props) {
		const STATE_CONFIG = {
			empty: {
				icon: "info",
				iconClasses: "bg-accent-soft text-accent-text",
				role: "status"
			},
			loading: {
				icon: "loader",
				iconClasses: "bg-elevated text-secondary",
				role: "status"
			},
			serviceError: {
				icon: "alertTriangle",
				iconClasses: "bg-error-soft text-error",
				role: "alert"
			},
			success: {
				icon: "circleCheck",
				iconClasses: "bg-success-soft text-success",
				role: "status"
			}
		};
		const props = __props;
		const config = computed(() => STATE_CONFIG[props.state] ?? STATE_CONFIG.empty);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				"aria-busy": __props.state === "loading",
				role: config.value.role,
				class: "grid justify-items-start gap-content rounded-card border border-border bg-surface p-panel"
			}, _attrs))}><span class="${ssrRenderClass(["inline-flex rounded-menu-item p-compact", config.value.iconClasses])}">`);
			_push(ssrRenderComponent(_sfc_main$74, { name: config.value.icon }, null, _parent));
			_push(`</span><div class="grid gap-control"><h2 class="text-interface-title font-display text-foreground">${ssrInterpolate(__props.title)}</h2><p class="max-w-reading text-interface-body text-secondary">${ssrInterpolate(__props.description)}</p></div>`);
			if (_ctx.$slots.actions) {
				_push(`<div class="flex flex-wrap gap-compact">`);
				ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</section>`);
		};
	}
};
var _sfc_setup$61 = _sfc_main$61.setup;
_sfc_main$61.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/StatePanel.vue");
	return _sfc_setup$61 ? _sfc_setup$61(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/connection/PlatformSelector.vue
var _sfc_main$60 = {
	__name: "PlatformSelector",
	__ssrInlineRender: true,
	props: /*@__PURE__*/ mergeModels({ platforms: {
		type: Array,
		required: true
	} }, {
		"modelValue": {
			type: String,
			default: "windows"
		},
		"modelModifiers": {}
	}),
	emits: ["update:modelValue"],
	setup(__props) {
		const model = useModel(__props, "modelValue");
		const icons = {
			windows: "platform-windows",
			macos: "platform-apple",
			linux: "platform-linux",
			android: "platform-android",
			ios: "platform-apple"
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<fieldset${ssrRenderAttrs(mergeProps({ class: "grid min-w-0 gap-connection-section" }, _attrs))}><legend class="mb-connection-section text-interface-body font-medium text-secondary">Устройство</legend><div class="grid grid-cols-6 gap-compact tablet:grid-cols-5 tablet:gap-connection-section"><!--[-->`);
			ssrRenderList(__props.platforms, (platform, index) => {
				_push(`<label class="${ssrRenderClass([[
					index < 3 ? "col-span-2" : "col-span-3",
					"tablet:col-span-1",
					model.value === platform.id ? "border-accent bg-accent-soft text-accent-text" : "border-border bg-surface text-secondary hover:border-accent"
				], "relative flex min-h-connection-platform min-w-0 cursor-pointer flex-col items-center justify-center gap-compact rounded-button border px-compact py-content text-center text-connection-platform font-semibold focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus"])}"><input${ssrIncludeBooleanAttr(ssrLooseEqual(model.value, platform.id)) ? " checked" : ""}${ssrRenderAttr("value", platform.id)} type="radio" name="connection-platform" class="sr-only">`);
				_push(ssrRenderComponent(_sfc_main$74, {
					name: icons[platform.id],
					size: "connection"
				}, null, _parent));
				_push(`<span class="min-w-0 wrap-anywhere">${ssrInterpolate(platform.label)}</span></label>`);
			});
			_push(`<!--]--></div></fieldset>`);
		};
	}
};
var _sfc_setup$60 = _sfc_main$60.setup;
_sfc_main$60.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/connection/PlatformSelector.vue");
	return _sfc_setup$60 ? _sfc_setup$60(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/connection/ConnectionSteps.vue
var _sfc_main$59 = {
	__name: "ConnectionSteps",
	__ssrInlineRender: true,
	props: { platform: {
		type: Object,
		required: true
	} },
	setup(__props) {
		const props = __props;
		const appName = shallowRef(props.platform.apps[0]?.name ?? "");
		const app = computed(() => props.platform.apps.find((item) => item.name === appName.value));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				"aria-label": "Шаги подключения",
				class: "grid min-w-0 gap-connection-section"
			}, _attrs))}>`);
			if (!__props.platform.available) _push(`<p role="status" class="rounded-button border border-border bg-surface p-connection-step text-interface-body text-secondary">Инструкция для этого устройства пока недоступна. Напиши в поддержку — поможем подключиться.</p>`);
			else {
				_push(`<ol class="grid min-w-0 gap-connection-section"><!--[-->`);
				ssrRenderList(app.value?.steps ?? [], (step, index) => {
					_push(`<li><details class="group min-w-0 rounded-button border border-border bg-surface p-connection-step"><summary class="flex min-w-0 cursor-pointer list-none items-center gap-connection-step-gap rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus [&amp;::-webkit-details-marker]:hidden"><span aria-hidden="true" class="flex size-connection-number shrink-0 items-center justify-center rounded-control bg-accent-soft text-connection-number font-semibold text-accent-text">${ssrInterpolate(index + 1)}</span><span class="grid min-w-0 flex-1 gap-0.5"><span class="text-interface-title font-display wrap-anywhere">${ssrInterpolate(step.title)}</span><span class="text-interface-body wrap-anywhere text-secondary">${ssrInterpolate(step.description)}</span></span>`);
					_push(ssrRenderComponent(_sfc_main$74, {
						name: "chevronRight",
						class: "text-muted transition-transform group-open:rotate-90 motion-reduce:transition-none"
					}, null, _parent));
					_push(`</summary><div class="grid min-w-0 gap-content pt-content text-interface-body wrap-anywhere text-secondary">`);
					if (index === 0) {
						_push(`<label class="grid min-w-0 gap-interface-field-gap"><span class="font-medium text-foreground">Приложение</span><select name="connection-app" class="min-h-interface-control min-w-0 w-full rounded-button border border-interface-field-border bg-interface-input px-interface-inline text-interface-body text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"><!--[-->`);
						ssrRenderList(__props.platform.apps, (item) => {
							_push(`<option${ssrRenderAttr("value", item.name)}${ssrIncludeBooleanAttr(Array.isArray(appName.value) ? ssrLooseContain(appName.value, item.name) : ssrLooseEqual(appName.value, item.name)) ? " selected" : ""}>${ssrInterpolate(item.name)}</option>`);
						});
						_push(`<!--]--></select></label>`);
					} else _push(`<!---->`);
					_push(`<!--[-->`);
					ssrRenderList(step.content, (paragraph, paragraphIndex) => {
						_push(`<p>${ssrInterpolate(paragraph)}</p>`);
					});
					_push(`<!--]-->`);
					if (step.links?.length) {
						_push(`<ul class="grid gap-compact"><!--[-->`);
						ssrRenderList(step.links, (link) => {
							_push(`<li><a${ssrRenderAttr("href", link.url)}${ssrRenderAttr("target", link.external ? "_blank" : void 0)} rel="noopener noreferrer" class="inline-flex min-h-interface-control items-center rounded-control text-accent-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-focus">${ssrInterpolate(link.label)}</a></li>`);
						});
						_push(`<!--]--></ul>`);
					} else _push(`<!---->`);
					_push(`</div></details></li>`);
				});
				_push(`<!--]--></ol>`);
			}
			_push(`</section>`);
		};
	}
};
var _sfc_setup$59 = _sfc_main$59.setup;
_sfc_main$59.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/connection/ConnectionSteps.vue");
	return _sfc_setup$59 ? _sfc_setup$59(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/connection/ConnectionDevices.vue
var _sfc_main$58 = {
	__name: "ConnectionDevices",
	__ssrInlineRender: true,
	props: {
		devices: {
			type: Array,
			required: true
		},
		count: {
			type: Number,
			required: true
		},
		limit: {
			type: Number,
			default: null
		},
		busy: Boolean,
		pendingToken: {
			type: String,
			default: ""
		},
		error: {
			type: String,
			default: ""
		},
		removed: Boolean
	},
	emits: ["remove"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				"aria-labelledby": "connection-devices-title",
				class: "grid min-w-0 gap-connection-section"
			}, _attrs))}><h2 id="connection-devices-title" class="text-interface-title font-display">Твои устройства</h2><p class="text-interface-body text-secondary">Подключено: ${ssrInterpolate(__props.count)}`);
			if (__props.limit !== null) _push(`<!--[--> из ${ssrInterpolate(__props.limit)}<!--]-->`);
			else _push(`<!---->`);
			_push(`</p>`);
			if (__props.removed) _push(`<p role="status" class="text-interface-body text-success">Устройство отключено.</p>`);
			else _push(`<!---->`);
			if (__props.error) _push(`<p role="alert" class="text-interface-body text-error">${ssrInterpolate(__props.error)}</p>`);
			else _push(`<!---->`);
			if (!__props.devices.length) _push(`<p class="text-interface-body text-secondary">Подключённых устройств пока нет.</p>`);
			else {
				_push(`<ul class="grid min-w-0 gap-compact"><!--[-->`);
				ssrRenderList(__props.devices, (device) => {
					_push(`<li class="flex min-w-0 flex-wrap items-center justify-between gap-content rounded-button border border-border bg-surface p-connection-step"><span class="grid min-w-0 gap-control wrap-anywhere"><span class="text-interface-body font-medium">${ssrInterpolate(device.name)}</span><span class="text-interface-body text-secondary">${ssrInterpolate([device.platform, device.osVersion].filter(Boolean).join(" · "))}</span></span>`);
					_push(ssrRenderComponent(_sfc_main$73, {
						"aria-label": `Отключить ${device.name}`,
						disabled: __props.busy,
						loading: __props.busy && __props.pendingToken === device.token,
						"loading-label": "Отключаем",
						size: "sm",
						variant: "danger",
						onClick: ($event) => emit("remove", device.token)
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Отключить`);
							else return [createTextVNode("Отключить")];
						}),
						_: 2
					}, _parent));
					_push(`</li>`);
				});
				_push(`<!--]--></ul>`);
			}
			_push(`</section>`);
		};
	}
};
var _sfc_setup$58 = _sfc_main$58.setup;
_sfc_main$58.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/connection/ConnectionDevices.vue");
	return _sfc_setup$58 ? _sfc_setup$58(props, ctx) : void 0;
};
//#endregion
//#region resources/js/utils/dashboardPresentation.js
var DASHBOARD_STATES = {
	trial: {
		message: "Твои дни с dudeweb начались.",
		action: "Выбрать подписку"
	},
	active: {
		message: "Всё работает. Наслаждайся!",
		action: "Продлить подписку"
	},
	expiring: {
		message: "Подписка скоро закончится.",
		action: "Продлить подписку"
	},
	expired: {
		message: "Подписка закончилась.",
		action: "Возобновить доступ"
	},
	limited: {
		message: "Доступ временно ограничен.",
		action: "Связаться с поддержкой"
	}
};
function daysLabel(days) {
	const mod10 = days % 10;
	const mod100 = days % 100;
	return `${days} ${mod10 === 1 && mod100 !== 11 ? "день" : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? "дня" : "дней"}`;
}
function maskedSubscriptionUrl(url) {
	try {
		return `${new URL(url).host}/…`;
	} catch {
		return "";
	}
}
//#endregion
//#region resources/js/utils/connectionPlatform.js
/** Best-effort default for app instructions; the user can always change it. */
function detectConnectionPlatform(browser) {
	const hint = browser?.userAgentData?.platform?.toLowerCase() ?? "";
	const platform = browser?.platform?.toLowerCase() ?? "";
	const agent = browser?.userAgent?.toLowerCase() ?? "";
	if (/iphone|ipad|ipod/.test(`${agent} ${platform}`) || platform.startsWith("mac") && browser?.maxTouchPoints > 1) return "ios";
	const hints = {
		windows: "windows",
		macos: "macos",
		linux: "linux",
		android: "android",
		ios: "ios"
	};
	if (Object.hasOwn(hints, hint)) return hints[hint];
	if (hint === "chrome os" || /cros/.test(agent)) return null;
	const identity = `${agent} ${platform}`;
	if (/android/.test(identity)) return "android";
	if (/windows|\bwin32\b|\bwin64\b/.test(identity)) return "windows";
	if (/macintosh|macintel|macppc|macos|mac os/.test(identity)) return "macos";
	if (/linux/.test(identity)) return "linux";
	return null;
}
//#endregion
//#region resources/js/composables/useConnection.js
function useConnection() {
	const refreshing = shallowRef(false);
	const refreshError = shallowRef(false);
	const remove = useForm({ device: "" });
	const busy = computed(() => refreshing.value || remove.processing);
	let cancelRefresh;
	function failed() {
		refreshError.value = true;
		return false;
	}
	function retry() {
		if (busy.value) return;
		refreshError.value = false;
		refreshing.value = true;
		router.reload({
			only: [
				"subscriptionUrl",
				"devices",
				"deviceCount",
				"deviceLimit",
				"serviceState",
				"deviceRemoved"
			],
			onCancelToken: (token) => {
				cancelRefresh = token;
			},
			onError: failed,
			onHttpException: failed,
			onNetworkError: failed,
			onFinish: () => {
				refreshing.value = false;
				cancelRefresh = null;
			}
		});
	}
	function revoke(token) {
		if (busy.value) return;
		remove.device = token;
		remove.clearErrors();
		remove.delete("/account/connection/devices", {
			preserveScroll: true,
			onHttpException: () => {
				remove.setError("device", "Не удалось отключить устройство. Обнови список и попробуй снова.");
				return false;
			},
			onNetworkError: () => {
				remove.setError("device", "Проверь соединение и попробуй отключить устройство ещё раз.");
				return false;
			}
		});
	}
	onBeforeUnmount(() => {
		cancelRefresh?.cancel();
		remove.cancel();
	});
	return {
		refreshing,
		refreshError,
		busy,
		remove,
		retry,
		revoke
	};
}
//#endregion
//#region resources/js/components/connection/ConnectionContent.vue
var _sfc_main$57 = {
	__name: "ConnectionContent",
	__ssrInlineRender: true,
	props: {
		subscriptionUrl: {
			type: String,
			default: null
		},
		platforms: {
			type: Array,
			required: true
		},
		devices: {
			type: Array,
			required: true
		},
		deviceCount: {
			type: Number,
			default: null
		},
		deviceLimit: {
			type: Number,
			default: null
		},
		serviceState: {
			type: String,
			required: true
		},
		deviceRemoved: Boolean
	},
	setup(__props) {
		const props = __props;
		const selectedId = shallowRef(props.platforms[0]?.id ?? "windows");
		const selected = computed(() => props.platforms.find((p) => p.id === selectedId.value));
		const { refreshing, refreshError, busy, remove, retry, revoke } = useConnection();
		onMounted(() => {
			const detected = detectConnectionPlatform(navigator);
			if (props.platforms.some((platform) => platform.id === detected)) selectedId.value = detected;
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "grid min-w-0 gap-connection-section" }, _attrs))}>`);
			_push(ssrRenderComponent(_sfc_main$60, {
				modelValue: selectedId.value,
				"onUpdate:modelValue": ($event) => selectedId.value = $event,
				platforms: __props.platforms
			}, null, _parent));
			if (unref(refreshing)) _push(ssrRenderComponent(_sfc_main$61, {
				state: "loading",
				title: "Проверяем подключение…",
				description: "Это займёт несколько секунд."
			}, null, _parent));
			else if (__props.serviceState === "ready" && !unref(refreshError)) {
				_push(`<!--[-->`);
				if (__props.subscriptionUrl) _push(ssrRenderComponent(_sfc_main$62, {
					value: __props.subscriptionUrl,
					"display-value": unref(maskedSubscriptionUrl)(__props.subscriptionUrl)
				}, null, _parent));
				else _push(`<p role="status" class="rounded-button border border-border bg-surface p-connection-step text-interface-body text-secondary">Ссылка подключения сейчас недоступна. Обнови данные или напиши в поддержку.</p>`);
				if (selected.value) _push(ssrRenderComponent(_sfc_main$59, {
					key: selected.value.id,
					platform: selected.value
				}, null, _parent));
				else _push(`<!---->`);
				_push(ssrRenderComponent(unref(Link), {
					href: "/account/support",
					class: "inline-flex min-h-interface-control items-center justify-self-start rounded-control text-interface-body font-semibold text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Нужна помощь`);
						else return [createTextVNode("Нужна помощь")];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_sfc_main$58, {
					devices: __props.devices,
					count: __props.deviceCount ?? 0,
					limit: __props.deviceLimit,
					busy: unref(busy),
					"pending-token": unref(remove).device,
					error: unref(remove).errors.device,
					removed: __props.deviceRemoved,
					onRemove: unref(revoke)
				}, null, _parent));
				_push(`<div class="justify-self-start">`);
				_push(ssrRenderComponent(_sfc_main$73, {
					label: "Обновить данные",
					disabled: unref(busy),
					size: "sm",
					variant: "ghost",
					onClick: unref(retry)
				}, null, _parent));
				_push(`</div><!--]-->`);
			} else _push(ssrRenderComponent(_sfc_main$61, {
				state: "serviceError",
				title: "Не удалось загрузить подключение.",
				description: "Обнови данные. Если ошибка повторится, напиши в поддержку."
			}, {
				actions: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_sfc_main$73, {
							label: "Попробовать снова",
							disabled: unref(busy),
							onClick: unref(retry)
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(Link), {
							href: "/account/support",
							class: "inline-flex min-h-interface-control items-center text-interface-body text-accent-text focus-visible:outline-2 focus-visible:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Нужна помощь`);
								else return [createTextVNode("Нужна помощь")];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [createVNode(_sfc_main$73, {
						label: "Попробовать снова",
						disabled: unref(busy),
						onClick: unref(retry)
					}, null, 8, ["disabled", "onClick"]), createVNode(unref(Link), {
						href: "/account/support",
						class: "inline-flex min-h-interface-control items-center text-interface-body text-accent-text focus-visible:outline-2 focus-visible:outline-focus"
					}, {
						default: withCtx(() => [createTextVNode("Нужна помощь")]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup$57 = _sfc_main$57.setup;
_sfc_main$57.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/connection/ConnectionContent.vue");
	return _sfc_setup$57 ? _sfc_setup$57(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Account/Connection.vue
var Connection_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$56 });
var _sfc_main$56 = {
	__name: "Connection",
	__ssrInlineRender: true,
	props: {
		subscriptionUrl: {
			type: String,
			default: null
		},
		platforms: {
			type: Array,
			required: true
		},
		devices: {
			type: Array,
			required: true
		},
		deviceCount: {
			type: Number,
			default: null
		},
		deviceLimit: {
			type: Number,
			default: null
		},
		serviceState: {
			type: String,
			required: true
		},
		deviceRemoved: Boolean
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Подключение" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$64, {
				"page-title": "Подключение",
				"content-spacing": "connection"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid min-w-0 gap-connection-section"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$63, {
							title: "Подключиться проще, чем кажется.",
							description: "Выбери своё устройство — покажем, что делать дальше."
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$57, {
							"subscription-url": __props.subscriptionUrl,
							platforms: __props.platforms,
							devices: __props.devices,
							"device-count": __props.deviceCount,
							"device-limit": __props.deviceLimit,
							"service-state": __props.serviceState,
							"device-removed": __props.deviceRemoved
						}, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "grid min-w-0 gap-connection-section" }, [createVNode(_sfc_main$63, {
						title: "Подключиться проще, чем кажется.",
						description: "Выбери своё устройство — покажем, что делать дальше."
					}), createVNode(_sfc_main$57, {
						"subscription-url": __props.subscriptionUrl,
						platforms: __props.platforms,
						devices: __props.devices,
						"device-count": __props.deviceCount,
						"device-limit": __props.deviceLimit,
						"service-state": __props.serviceState,
						"device-removed": __props.deviceRemoved
					}, null, 8, [
						"subscription-url",
						"platforms",
						"devices",
						"device-count",
						"device-limit",
						"service-state",
						"device-removed"
					])])];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$56 = _sfc_main$56.setup;
_sfc_main$56.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Connection.vue");
	return _sfc_setup$56 ? _sfc_setup$56(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/ui/StatusBadge.vue
var _sfc_main$55 = {
	__name: "StatusBadge",
	__ssrInlineRender: true,
	props: {
		label: {
			type: String,
			default: ""
		},
		status: {
			type: String,
			default: "active",
			validator: (value) => [
				"active",
				"expired",
				"expiring",
				"limited",
				"loading",
				"serviceError",
				"trial"
			].includes(value)
		}
	},
	setup(__props) {
		const STATUS_CONFIG = {
			active: {
				classes: "border-success/40 bg-success-soft text-success",
				icon: "circleCheck",
				label: "Активна"
			},
			expired: {
				classes: "border-error/40 bg-error-soft text-error",
				icon: "circleX",
				label: "Истекла"
			},
			expiring: {
				classes: "border-warning/40 bg-warning-soft text-warning",
				icon: "clock",
				label: "Скоро истечёт"
			},
			limited: {
				classes: "border-warning/40 bg-warning-soft text-warning",
				icon: "alertTriangle",
				label: "Ограничена"
			},
			loading: {
				classes: "border-border bg-elevated text-secondary",
				icon: "loader",
				label: "Обновляем статус"
			},
			serviceError: {
				classes: "border-error/40 bg-error-soft text-error",
				icon: "circleX",
				label: "Сервис недоступен"
			},
			trial: {
				classes: "border-accent/40 bg-accent-soft text-accent-text",
				icon: "clock",
				label: "Пробный период"
			}
		};
		const props = __props;
		const config = computed(() => STATUS_CONFIG[props.status] ?? STATUS_CONFIG.active);
		const badgeClass = computed(() => ["inline-flex min-h-interface-badge items-center gap-interface-badge-gap rounded-full border px-interface-badge-inline text-interface-meta font-semibold", config.value.classes]);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<span${ssrRenderAttrs(mergeProps({
				class: badgeClass.value,
				role: "status"
			}, _attrs))}>`);
			_push(ssrRenderComponent(_sfc_main$74, {
				name: config.value.icon,
				size: "sm"
			}, null, _parent));
			_push(` ${ssrInterpolate(__props.label || config.value.label)}</span>`);
		};
	}
};
var _sfc_setup$55 = _sfc_main$55.setup;
_sfc_main$55.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/StatusBadge.vue");
	return _sfc_setup$55 ? _sfc_setup$55(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/account/DashboardSubscription.vue
var _sfc_main$54 = {
	__name: "DashboardSubscription",
	__ssrInlineRender: true,
	props: { subscription: {
		type: Object,
		required: true
	} },
	setup(__props) {
		const props = __props;
		const state = computed(() => DASHBOARD_STATES[props.subscription.state]);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				"aria-label": "Твоя подписка",
				class: "grid min-w-0 grid-cols-1 gap-account-card-gap rounded-card border border-interface-input-border bg-surface p-account-card"
			}, _attrs))}><div class="flex flex-wrap items-center justify-between gap-compact"><p class="font-mono text-interface-meta text-secondary">ТВОЯ ПОДПИСКА</p>`);
			_push(ssrRenderComponent(_sfc_main$55, { status: __props.subscription.state }, null, _parent));
			_push(`</div><div class="grid min-w-0 gap-control"><h2 class="text-interface-title font-display wrap-anywhere text-foreground">${ssrInterpolate(__props.subscription.planName)}</h2><p class="${ssrRenderClass(["text-interface-body", ["active", "trial"].includes(__props.subscription.state) ? "text-success" : "text-secondary"])}">${ssrInterpolate(state.value.message)}</p></div><dl class="flex flex-wrap items-start justify-between gap-content text-interface-body"><div class="grid gap-0.5"><dt class="text-secondary">${ssrInterpolate(__props.subscription.state === "expired" ? "Действовала до" : "Действует до")}</dt><dd class="font-semibold"><time${ssrRenderAttr("datetime", __props.subscription.expiresAt)}>${ssrInterpolate(__props.subscription.expiresOn)}</time></dd></div><div class="grid gap-0.5 text-right"><dt class="text-secondary">Осталось</dt><dd class="font-semibold">${ssrInterpolate(unref(daysLabel)(__props.subscription.remainingDays))}</dd></div></dl>`);
			if (__props.subscription.state === "limited") _push(ssrRenderComponent(unref(Link), {
				href: "/account/support",
				class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`${ssrInterpolate(state.value.action)}`);
					else return [createTextVNode(toDisplayString(state.value.action), 1)];
				}),
				_: 1
			}, _parent));
			else _push(ssrRenderComponent(unref(Link), {
				href: "/account/subscription",
				class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`${ssrInterpolate(state.value.action)}`);
					else return [createTextVNode(toDisplayString(state.value.action), 1)];
				}),
				_: 1
			}, _parent));
			_push(`</section>`);
		};
	}
};
var _sfc_setup$54 = _sfc_main$54.setup;
_sfc_main$54.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/account/DashboardSubscription.vue");
	return _sfc_setup$54 ? _sfc_setup$54(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/account/DashboardConnection.vue
var _sfc_main$53 = {
	__name: "DashboardConnection",
	__ssrInlineRender: true,
	props: { url: {
		type: String,
		default: null
	} },
	setup(__props) {
		const props = __props;
		const masked = computed(() => maskedSubscriptionUrl(props.url));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				class: "grid min-w-0 grid-cols-1 gap-account-connection-gap rounded-card border border-border bg-interface-input p-account-connection",
				"aria-labelledby": "dashboard-connection-title"
			}, _attrs))}><div class="flex flex-wrap items-center justify-between gap-compact"><h2 id="dashboard-connection-title" class="text-interface-title font-display">Подключение</h2>`);
			_push(ssrRenderComponent(unref(Link), {
				href: "/account/connection",
				class: "inline-flex min-h-interface-control items-center rounded-control px-control text-interface-body font-semibold text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Как подключиться`);
					else return [createTextVNode("Как подключиться")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			if (__props.url) {
				_push(`<!--[--><p class="text-interface-body text-secondary">Скопируй ссылку для устройства</p>`);
				_push(ssrRenderComponent(_sfc_main$62, {
					value: __props.url,
					"display-value": masked.value
				}, null, _parent));
				_push(`<!--]-->`);
			} else _push(`<p class="py-tight text-interface-body text-secondary">Ссылка подключения сейчас недоступна. <a href="https://t.me/hey_dude_web" class="font-semibold text-accent-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-focus">Написать в поддержку</a></p>`);
			_push(`</section>`);
		};
	}
};
var _sfc_setup$53 = _sfc_main$53.setup;
_sfc_main$53.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/account/DashboardConnection.vue");
	return _sfc_setup$53 ? _sfc_setup$53(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/account/DashboardDevices.vue
var _sfc_main$52 = {
	__name: "DashboardDevices",
	__ssrInlineRender: true,
	props: { summary: {
		type: Object,
		required: true
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				"aria-labelledby": "dashboard-devices-title",
				class: "flex min-h-account-device items-center gap-control-inline rounded-menu-item border border-border bg-interface-input px-account-card py-tight desktop:px-panel"
			}, _attrs))}><span class="flex size-11 shrink-0 items-center justify-center rounded-control bg-accent-soft text-accent-text">`);
			_push(ssrRenderComponent(_sfc_main$74, { name: "monitor" }, null, _parent));
			_push(`</span><div class="grid min-w-0 flex-1 gap-0.5"><h2 id="dashboard-devices-title" class="text-interface-title font-display">Устройства</h2><p class="text-interface-body text-secondary">Подключено: ${ssrInterpolate(__props.summary.count)}`);
			if (__props.summary.limit !== null) _push(`<!--[--> из ${ssrInterpolate(__props.summary.limit)}<!--]-->`);
			else _push(`<!---->`);
			_push(`</p></div>`);
			_push(ssrRenderComponent(_sfc_main$74, {
				name: "chevronRight",
				size: "sm",
				class: "shrink-0 text-muted"
			}, null, _parent));
			_push(`</section>`);
		};
	}
};
var _sfc_setup$52 = _sfc_main$52.setup;
_sfc_main$52.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/account/DashboardDevices.vue");
	return _sfc_setup$52 ? _sfc_setup$52(props, ctx) : void 0;
};
//#endregion
//#region resources/js/composables/useDashboardRefresh.js
function useDashboardRefresh(provisioningRequired) {
	const refreshing = shallowRef(false);
	const refreshError = shallowRef(false);
	const provision = useForm({});
	const busy = computed(() => refreshing.value || provision.processing);
	let cancelRefresh;
	function failedRefresh() {
		refreshError.value = true;
		return false;
	}
	function retry() {
		if (busy.value) return;
		refreshError.value = false;
		if (toValue(provisioningRequired)) {
			provision.clearErrors();
			provision.post("/account/provisioning", {
				onError: failedRefresh,
				onNetworkError: failedRefresh,
				onHttpException: failedRefresh
			});
			return;
		}
		refreshing.value = true;
		router.reload({
			only: [
				"user",
				"subscription",
				"devicesSummary",
				"serviceState",
				"provisioningRequired"
			],
			onCancelToken: (token) => {
				cancelRefresh = token;
			},
			onError: failedRefresh,
			onHttpException: failedRefresh,
			onNetworkError: failedRefresh,
			onFinish: () => {
				refreshing.value = false;
				cancelRefresh = null;
			}
		});
	}
	onBeforeUnmount(() => {
		cancelRefresh?.cancel();
		provision.cancel();
	});
	return {
		busy,
		refreshError: readonly(refreshError),
		provision,
		retry
	};
}
//#endregion
//#region resources/js/pages/Account/Dashboard.vue
var Dashboard_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$51 });
var _sfc_main$51 = {
	__name: "Dashboard",
	__ssrInlineRender: true,
	props: {
		user: {
			type: Object,
			required: true
		},
		subscription: {
			type: Object,
			default: null
		},
		devicesSummary: {
			type: Object,
			default: null
		},
		serviceState: {
			type: String,
			required: true,
			validator: (value) => ["ready", "service_error"].includes(value)
		},
		provisioningRequired: Boolean
	},
	setup(__props) {
		const props = __props;
		const { busy, refreshError, provision, retry } = useDashboardRefresh(() => props.provisioningRequired);
		const heading = computed(() => props.user.displayName ? `Привет, ${props.user.displayName} 👋` : "Привет 👋");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Главная" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$64, { "page-title": "Главная" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid min-w-0 grid-cols-1 gap-account-section"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$63, {
							title: heading.value,
							description: "Всё важное о твоём доступе — здесь."
						}, null, _parent, _scopeId));
						if (unref(busy)) _push(ssrRenderComponent(_sfc_main$61, {
							state: "loading",
							title: "Проверяем данные подписки…",
							description: "Это займёт несколько секунд."
						}, null, _parent, _scopeId));
						else if (__props.serviceState === "ready" && __props.subscription && __props.devicesSummary && !unref(refreshError)) {
							_push(`<!--[-->`);
							_push(ssrRenderComponent(_sfc_main$54, { subscription: __props.subscription }, null, _parent, _scopeId));
							_push(ssrRenderComponent(_sfc_main$53, { url: __props.subscription.url }, null, _parent, _scopeId));
							_push(ssrRenderComponent(_sfc_main$52, { summary: __props.devicesSummary }, null, _parent, _scopeId));
							_push(`<div class="justify-self-start"${_scopeId}>`);
							_push(ssrRenderComponent(_sfc_main$73, {
								label: "Обновить данные",
								size: "sm",
								variant: "ghost",
								onClick: unref(retry)
							}, null, _parent, _scopeId));
							_push(`</div><!--]-->`);
						} else _push(ssrRenderComponent(_sfc_main$61, {
							state: "serviceError",
							title: "Не удалось загрузить данные.",
							description: "Попробуй обновить экран. Если проблема повторится, напиши в поддержку."
						}, {
							actions: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(_sfc_main$73, {
										label: "Попробовать снова",
										disabled: unref(busy),
										onClick: unref(retry)
									}, null, _parent, _scopeId));
									_push(`<a href="https://t.me/hey_dude_web" class="inline-flex min-h-interface-control items-center px-control text-interface-action font-semibold text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"${_scopeId}>Написать в поддержку</a>`);
								} else return [createVNode(_sfc_main$73, {
									label: "Попробовать снова",
									disabled: unref(busy),
									onClick: unref(retry)
								}, null, 8, ["disabled", "onClick"]), createVNode("a", {
									href: "https://t.me/hey_dude_web",
									class: "inline-flex min-h-interface-control items-center px-control text-interface-action font-semibold text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
								}, "Написать в поддержку")];
							}),
							_: 1
						}, _parent, _scopeId));
						if (unref(provision).errors.form) _push(ssrRenderComponent(_sfc_main$70, {
							variant: "error",
							message: unref(provision).errors.form
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
						_push(`</div>`);
					} else return [createVNode("div", { class: "grid min-w-0 grid-cols-1 gap-account-section" }, [
						createVNode(_sfc_main$63, {
							title: heading.value,
							description: "Всё важное о твоём доступе — здесь."
						}, null, 8, ["title"]),
						unref(busy) ? (openBlock(), createBlock(_sfc_main$61, {
							key: 0,
							state: "loading",
							title: "Проверяем данные подписки…",
							description: "Это займёт несколько секунд."
						})) : __props.serviceState === "ready" && __props.subscription && __props.devicesSummary && !unref(refreshError) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
							createVNode(_sfc_main$54, { subscription: __props.subscription }, null, 8, ["subscription"]),
							createVNode(_sfc_main$53, { url: __props.subscription.url }, null, 8, ["url"]),
							createVNode(_sfc_main$52, { summary: __props.devicesSummary }, null, 8, ["summary"]),
							createVNode("div", { class: "justify-self-start" }, [createVNode(_sfc_main$73, {
								label: "Обновить данные",
								size: "sm",
								variant: "ghost",
								onClick: unref(retry)
							}, null, 8, ["onClick"])])
						], 64)) : (openBlock(), createBlock(_sfc_main$61, {
							key: 2,
							state: "serviceError",
							title: "Не удалось загрузить данные.",
							description: "Попробуй обновить экран. Если проблема повторится, напиши в поддержку."
						}, {
							actions: withCtx(() => [createVNode(_sfc_main$73, {
								label: "Попробовать снова",
								disabled: unref(busy),
								onClick: unref(retry)
							}, null, 8, ["disabled", "onClick"]), createVNode("a", {
								href: "https://t.me/hey_dude_web",
								class: "inline-flex min-h-interface-control items-center px-control text-interface-action font-semibold text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
							}, "Написать в поддержку")]),
							_: 1
						})),
						unref(provision).errors.form ? (openBlock(), createBlock(_sfc_main$70, {
							key: 3,
							variant: "error",
							message: unref(provision).errors.form
						}, null, 8, ["message"])) : createCommentVNode("", true)
					])];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$51 = _sfc_main$51.setup;
_sfc_main$51.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Dashboard.vue");
	return _sfc_setup$51 ? _sfc_setup$51(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/shells/PaymentResultShell.vue
var _sfc_main$50 = {
	__name: "PaymentResultShell",
	__ssrInlineRender: true,
	props: {
		description: {
			type: String,
			required: true
		},
		status: {
			type: String,
			required: true,
			validator: (value) => [
				"canceled",
				"pending",
				"succeeded"
			].includes(value)
		},
		title: {
			type: String,
			required: true
		}
	},
	setup(__props) {
		const STATUS_CONFIG = {
			canceled: {
				icon: "circleX",
				iconClasses: "bg-error-soft text-error",
				role: "alert"
			},
			pending: {
				icon: "clock",
				iconClasses: "bg-warning-soft text-warning",
				role: "status"
			},
			succeeded: {
				icon: "circleCheck",
				iconClasses: "bg-success-soft text-success",
				role: "status"
			}
		};
		const props = __props;
		const config = computed(() => STATUS_CONFIG[props.status] ?? STATUS_CONFIG.pending);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-dvh flex-col bg-background text-foreground" }, _attrs))}><header class="flex h-auth-header shrink-0 items-center px-shell-gutter">`);
			_push(ssrRenderComponent(_sfc_main$71, { variant: "wordmark" }, null, _parent));
			_push(`</header><main class="mx-auto flex w-full flex-1 flex-col px-shell-gutter pt-auth-status-top pb-auth-status-bottom tablet:max-w-auth-tablet tablet:px-0 desktop:max-w-auth-desktop"><section${ssrRenderAttr("role", config.value.role)} class="my-auto grid min-w-0 grid-cols-1 justify-items-center gap-auth-group text-center"><span class="${ssrRenderClass(["inline-flex size-auth-status-icon items-center justify-center rounded-auth-status", config.value.iconClasses])}">`);
			_push(ssrRenderComponent(_sfc_main$74, {
				name: config.value.icon,
				size: "status"
			}, null, _parent));
			_push(`</span><div class="grid min-w-0 grid-cols-1 gap-auth-group"><h1 class="text-interface-heading font-display tracking-interface-heading break-words">${ssrInterpolate(__props.title)}</h1><p class="text-interface-body text-secondary">${ssrInterpolate(__props.description)}</p></div>`);
			if (_ctx.$slots.actions) {
				_push(`<div class="grid w-full gap-compact">`);
				ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</section></main></div>`);
		};
	}
};
var _sfc_setup$50 = _sfc_main$50.setup;
_sfc_main$50.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/shells/PaymentResultShell.vue");
	return _sfc_setup$50 ? _sfc_setup$50(props, ctx) : void 0;
};
//#endregion
//#region resources/js/composables/usePaymentStatus.js
function usePaymentStatus(payment) {
	const busy = shallowRef(false);
	const stopped = shallowRef(false);
	const error = shallowRef(false);
	let next;
	let deadline;
	let cancel;
	let disposed = false;
	function stop() {
		clearTimeout(next);
		clearTimeout(deadline);
		stopped.value = true;
	}
	function schedule() {
		if (!disposed && !stopped.value && toValue(payment).status === "pending") next = setTimeout(refresh, 2e3);
	}
	function failed() {
		error.value = true;
		stop();
		return false;
	}
	function refresh() {
		if (disposed || busy.value || toValue(payment).status !== "pending") return;
		busy.value = true;
		error.value = false;
		clearTimeout(next);
		router.reload({
			only: ["payment"],
			onCancelToken: (token) => {
				cancel = token;
			},
			onError: failed,
			onHttpException: failed,
			onNetworkError: failed,
			onFinish: () => {
				busy.value = false;
				cancel = null;
				schedule();
			}
		});
	}
	watch(() => toValue(payment).status, (value) => {
		if (value !== "pending") stop();
	});
	onMounted(() => {
		if (toValue(payment).status !== "pending") return;
		deadline = setTimeout(() => {
			stop();
			cancel?.cancel();
		}, 6e4);
		schedule();
	});
	onBeforeUnmount(() => {
		disposed = true;
		stop();
		cancel?.cancel();
	});
	return {
		busy: readonly(busy),
		stopped: readonly(stopped),
		error: readonly(error),
		refresh
	};
}
//#endregion
//#region resources/js/composables/useWebPayment.js
function useWebPayment() {
	const form = useHttp({
		product_id: null,
		promocode: null
	});
	const redirecting = shallowRef(false);
	let key = null;
	let alive = true;
	function resetAttempt() {
		key = null;
		form.clearErrors();
	}
	async function pay(url = "/payments") {
		if (form.processing || redirecting.value) return;
		key ??= window.crypto.randomUUID?.() ?? Array.from(window.crypto.getRandomValues(/* @__PURE__ */ new Uint32Array(4)), (n) => n.toString(16)).join("-");
		form.clearErrors();
		try {
			await form.post(url, {
				headers: { "Idempotency-Key": key },
				onSuccess: (response) => {
					if (!alive) return;
					const target = new URL(response.confirmation_url);
					if (target.protocol !== "https:" || target.username || target.password) throw new Error("Invalid payment confirmation URL");
					redirecting.value = true;
					window.location.assign(response.confirmation_url);
				},
				onHttpException: (response) => {
					if (response.status === 502) key = null;
				}
			});
		} catch {
			if (alive) form.setError("form", "Не удалось перейти к оплате. Попробуй ещё раз.");
		}
	}
	onBeforeUnmount(() => {
		alive = false;
		form.cancel();
	});
	return {
		form,
		redirecting,
		pay,
		resetAttempt
	};
}
//#endregion
//#region resources/js/pages/Account/Payments/Show.vue
var Show_exports$1 = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$49 });
var _sfc_main$49 = {
	__name: "Show",
	__ssrInlineRender: true,
	props: { payment: {
		type: Object,
		required: true
	} },
	setup(__props) {
		const props = __props;
		const { busy, stopped, error, refresh } = usePaymentStatus(() => props.payment);
		const { form, redirecting, pay } = useWebPayment();
		const state = computed(() => ({
			pending: {
				title: "Ожидаем подтверждение оплаты",
				description: "Обычно это занимает немного времени. Мы обновим статус, когда платёж подтвердится."
			},
			succeeded: {
				title: "Готово, Dude!",
				description: "Оплата прошла успешно. Твоя подписка обновлена."
			},
			canceled: {
				title: "Не получилось оплатить",
				description: props.payment.retryUrl ? "Платёж не завершён. Попробуй ещё раз или выбери другой способ оплаты." : "Платёж отменён. Свяжись с поддержкой, если нужна помощь."
			}
		})[props.payment.status]);
		const errors = computed(() => Object.values(form.errors).filter(Boolean));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: state.value.title }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$50, {
				status: __props.payment.status,
				title: state.value.title,
				description: state.value.description
			}, {
				actions: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (__props.payment.status === "pending" && unref(stopped)) _push(`<p role="status" class="text-interface-body text-secondary"${_scopeId}>${ssrInterpolate(unref(error) ? "Не удалось обновить статус. Проверь соединение и повтори запрос." : "Подтверждение ещё не пришло. Можно проверить статус вручную.")}</p>`);
						else _push(`<!---->`);
						if (__props.payment.status === "pending" && unref(stopped)) _push(ssrRenderComponent(_sfc_main$73, {
							loading: unref(busy),
							"full-width": "",
							onClick: unref(refresh)
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Проверить статус`);
								else return [createTextVNode("Проверить статус")];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
						if (errors.value.length) {
							_push(`<ul role="alert" class="grid gap-control text-interface-body text-error"${_scopeId}><!--[-->`);
							ssrRenderList(errors.value, (message) => {
								_push(`<li${_scopeId}>${ssrInterpolate(message)}</li>`);
							});
							_push(`<!--]--></ul>`);
						} else _push(`<!---->`);
						if (__props.payment.status === "canceled" && __props.payment.retryUrl) _push(ssrRenderComponent(_sfc_main$73, {
							loading: unref(form).processing || unref(redirecting),
							"full-width": "",
							onClick: ($event) => unref(pay)(__props.payment.retryUrl)
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Попробовать снова`);
								else return [createTextVNode("Попробовать снова")];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
						if (__props.payment.status !== "canceled") _push(ssrRenderComponent(unref(Link), {
							href: "/account",
							class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`На главную`);
								else return [createTextVNode("На главную")];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
						if (__props.payment.status === "succeeded") _push(ssrRenderComponent(unref(Link), {
							href: "/account/connection",
							class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-border bg-elevated px-interface-inline py-tight text-interface-action font-bold hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Подключить устройство`);
								else return [createTextVNode("Подключить устройство")];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
						if (__props.payment.status === "canceled") _push(`<a href="https://t.me/hey_dude_web" class="inline-flex min-h-interface-control items-center justify-center rounded-button border border-border bg-elevated px-interface-inline py-tight text-interface-action font-bold hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"${_scopeId}>Связаться с поддержкой</a>`);
						else _push(`<!---->`);
						if (__props.payment.status === "canceled") _push(ssrRenderComponent(unref(Link), {
							href: "/account/subscription",
							class: "text-interface-body text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`К подписке`);
								else return [createTextVNode("К подписке")];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
					} else return [
						__props.payment.status === "pending" && unref(stopped) ? (openBlock(), createBlock("p", {
							key: 0,
							role: "status",
							class: "text-interface-body text-secondary"
						}, toDisplayString(unref(error) ? "Не удалось обновить статус. Проверь соединение и повтори запрос." : "Подтверждение ещё не пришло. Можно проверить статус вручную."), 1)) : createCommentVNode("", true),
						__props.payment.status === "pending" && unref(stopped) ? (openBlock(), createBlock(_sfc_main$73, {
							key: 1,
							loading: unref(busy),
							"full-width": "",
							onClick: unref(refresh)
						}, {
							default: withCtx(() => [createTextVNode("Проверить статус")]),
							_: 1
						}, 8, ["loading", "onClick"])) : createCommentVNode("", true),
						errors.value.length ? (openBlock(), createBlock("ul", {
							key: 2,
							role: "alert",
							class: "grid gap-control text-interface-body text-error"
						}, [(openBlock(true), createBlock(Fragment, null, renderList(errors.value, (message) => {
							return openBlock(), createBlock("li", { key: message }, toDisplayString(message), 1);
						}), 128))])) : createCommentVNode("", true),
						__props.payment.status === "canceled" && __props.payment.retryUrl ? (openBlock(), createBlock(_sfc_main$73, {
							key: 3,
							loading: unref(form).processing || unref(redirecting),
							"full-width": "",
							onClick: ($event) => unref(pay)(__props.payment.retryUrl)
						}, {
							default: withCtx(() => [createTextVNode("Попробовать снова")]),
							_: 1
						}, 8, ["loading", "onClick"])) : createCommentVNode("", true),
						__props.payment.status !== "canceled" ? (openBlock(), createBlock(unref(Link), {
							key: 4,
							href: "/account",
							class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
						}, {
							default: withCtx(() => [createTextVNode("На главную")]),
							_: 1
						})) : createCommentVNode("", true),
						__props.payment.status === "succeeded" ? (openBlock(), createBlock(unref(Link), {
							key: 5,
							href: "/account/connection",
							class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-border bg-elevated px-interface-inline py-tight text-interface-action font-bold hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
						}, {
							default: withCtx(() => [createTextVNode("Подключить устройство")]),
							_: 1
						})) : createCommentVNode("", true),
						__props.payment.status === "canceled" ? (openBlock(), createBlock("a", {
							key: 6,
							href: "https://t.me/hey_dude_web",
							class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-border bg-elevated px-interface-inline py-tight text-interface-action font-bold hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
						}, "Связаться с поддержкой")) : createCommentVNode("", true),
						__props.payment.status === "canceled" ? (openBlock(), createBlock(unref(Link), {
							key: 7,
							href: "/account/subscription",
							class: "text-interface-body text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-focus"
						}, {
							default: withCtx(() => [createTextVNode("К подписке")]),
							_: 1
						})) : createCommentVNode("", true)
					];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$49 = _sfc_main$49.setup;
_sfc_main$49.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Payments/Show.vue");
	return _sfc_setup$49 ? _sfc_setup$49(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/ui/BaseField.vue
var _sfc_main$48 = {
	__name: "BaseField",
	__ssrInlineRender: true,
	props: /*@__PURE__*/ mergeModels({
		variant: {
			type: String,
			default: "default",
			validator: (value) => ["default", "auth"].includes(value)
		},
		icon: {
			type: String,
			default: ""
		},
		spacing: {
			type: String,
			default: "field",
			validator: (value) => [
				"field",
				"reset",
				"sheet"
			].includes(value)
		},
		autocomplete: {
			type: String,
			default: void 0
		},
		disabled: Boolean,
		error: {
			type: String,
			default: ""
		},
		hint: {
			type: String,
			default: ""
		},
		id: {
			type: String,
			required: true
		},
		inputmode: {
			type: String,
			default: void 0
		},
		label: {
			type: String,
			required: true
		},
		maxlength: {
			type: [Number, String],
			default: void 0
		},
		name: {
			type: String,
			default: void 0
		},
		placeholder: {
			type: String,
			default: ""
		},
		readonly: Boolean,
		required: Boolean,
		type: {
			type: String,
			default: "text"
		}
	}, {
		"modelValue": {
			type: [String, Number],
			default: ""
		},
		"modelModifiers": {}
	}),
	emits: ["update:modelValue"],
	setup(__props) {
		const model = useModel(__props, "modelValue");
		const props = __props;
		const slots = useSlots();
		const describedBy = computed(() => {
			if (props.error) return `${props.id}-error`;
			return props.hint ? `${props.id}-hint` : void 0;
		});
		const inputClass = computed(() => [
			"min-h-interface-control w-full rounded-button border px-interface-inline text-interface-body text-foreground outline-none transition-colors duration-200 motion-reduce:transition-none placeholder:text-muted focus:border-focus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60",
			"bg-interface-input",
			props.error ? "border-error" : props.variant === "auth" ? "border-interface-input-border" : "border-interface-field-border",
			props.icon ? "pl-interface-icon-text" : "",
			slots.suffix ? "pr-12" : ""
		]);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["grid min-w-0 grid-cols-1", __props.spacing === "reset" ? "gap-auth-reset-group" : __props.spacing === "sheet" ? "gap-control-inline" : "gap-interface-field-gap"] }, _attrs))}><label${ssrRenderAttr("for", __props.id)} class="${ssrRenderClass([__props.variant === "auth" ? "text-secondary" : "text-foreground", "text-interface-body font-medium"])}">${ssrInterpolate(__props.label)}</label><div class="relative">`);
			if (__props.icon) {
				_push(`<span class="pointer-events-none absolute inset-y-0 left-interface-inline flex items-center text-muted">`);
				_push(ssrRenderComponent(_sfc_main$74, { name: __props.icon }, null, _parent));
				_push(`</span>`);
			} else _push(`<!---->`);
			_push(`<input${ssrRenderAttr("id", __props.id)}${ssrRenderDynamicModel(__props.type, model.value, null)}${ssrRenderAttr("aria-describedby", describedBy.value)}${ssrRenderAttr("aria-invalid", Boolean(__props.error))}${ssrRenderAttr("autocomplete", __props.autocomplete)} class="${ssrRenderClass(inputClass.value)}"${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}${ssrRenderAttr("inputmode", __props.inputmode)}${ssrRenderAttr("maxlength", __props.maxlength)}${ssrRenderAttr("name", __props.name)}${ssrRenderAttr("placeholder", __props.placeholder)}${ssrIncludeBooleanAttr(__props.readonly) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.required) ? " required" : ""}${ssrRenderAttr("type", __props.type)}>`);
			if (_ctx.$slots.suffix) {
				_push(`<span class="${ssrRenderClass([__props.variant === "auth" ? "right-1" : "right-control-inline", "absolute inset-y-0 flex items-center text-muted"])}">`);
				ssrRenderSlot(_ctx.$slots, "suffix", {}, null, _push, _parent);
				_push(`</span>`);
			} else _push(`<!---->`);
			_push(`</div>`);
			if (__props.error) _push(`<p${ssrRenderAttr("id", `${__props.id}-error`)} class="text-interface-body text-error" aria-live="polite">${ssrInterpolate(__props.error)}</p>`);
			else if (__props.hint) _push(`<p${ssrRenderAttr("id", `${__props.id}-hint`)} class="text-interface-body text-muted">${ssrInterpolate(__props.hint)}</p>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$48 = _sfc_main$48.setup;
_sfc_main$48.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/BaseField.vue");
	return _sfc_setup$48 ? _sfc_setup$48(props, ctx) : void 0;
};
//#endregion
//#region resources/js/composables/useProfileForm.js
function useProfileForm(data) {
	return useActionForm(data, { failureMessage: "Не удалось сохранить изменения. Попробуй ещё раз." });
}
//#endregion
//#region resources/js/components/profile/ProfileIdentity.vue
var _sfc_main$47 = {
	__name: "ProfileIdentity",
	__ssrInlineRender: true,
	props: {
		user: {
			type: Object,
			required: true
		},
		telegramConnection: {
			type: Object,
			required: true
		},
		canChangeEmail: Boolean,
		passwordAvailable: Boolean
	},
	setup(__props) {
		const props = __props;
		const editing = shallowRef(false);
		const { form, submit } = useProfileForm({
			first_name: props.user.firstName ?? "",
			last_name: props.user.lastName ?? "",
			email: props.user.email,
			current_password: ""
		});
		const emailChanged = computed(() => form.email.trim().toLowerCase() !== props.user.email);
		watch(() => props.user, (user) => {
			form.defaults({
				first_name: user.firstName ?? "",
				last_name: user.lastName ?? "",
				email: user.email,
				current_password: ""
			});
		});
		function cancel() {
			form.reset();
			form.clearErrors();
			editing.value = false;
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				"aria-labelledby": "profile-account-title",
				class: "grid min-w-0 grid-cols-1 gap-profile-section rounded-profile-card border border-profile-border bg-profile-surface p-profile-card"
			}, _attrs))}><div class="flex flex-wrap items-center justify-between gap-compact"><h2 id="profile-account-title" class="text-interface-title font-display">Аккаунт</h2>`);
			if (!editing.value) _push(ssrRenderComponent(_sfc_main$73, {
				label: "Изменить данные",
				size: "sm",
				variant: "ghost",
				onClick: ($event) => editing.value = true
			}, null, _parent));
			else _push(`<!---->`);
			_push(`</div>`);
			if (!editing.value) {
				_push(`<dl class="grid min-w-0 grid-cols-1 gap-profile-section text-interface-body">`);
				if (__props.user.firstName) _push(`<div class="flex min-w-0 flex-wrap justify-between gap-compact"><dt class="text-secondary">Имя</dt><dd class="min-w-0 wrap-anywhere">${ssrInterpolate(__props.user.firstName)}</dd></div>`);
				else _push(`<!---->`);
				if (__props.user.lastName) _push(`<div class="flex min-w-0 flex-wrap justify-between gap-compact"><dt class="text-secondary">Фамилия</dt><dd class="min-w-0 wrap-anywhere">${ssrInterpolate(__props.user.lastName)}</dd></div>`);
				else _push(`<!---->`);
				_push(`<div class="flex min-w-0 flex-wrap justify-between gap-compact"><dt class="text-secondary">Email</dt><dd class="min-w-0 wrap-anywhere">${ssrInterpolate(__props.user.email)}</dd></div><div class="flex flex-wrap justify-between gap-compact"><dt class="text-secondary">Дата регистрации</dt><dd>`);
				if (__props.user.registeredAt) _push(`<time${ssrRenderAttr("datetime", __props.user.registeredAt)}>${ssrInterpolate(__props.user.registeredLabel)}</time>`);
				else _push(`<span>Не указана</span>`);
				_push(`</dd></div></dl>`);
			} else {
				_push(`<form class="grid min-w-0 grid-cols-1 gap-profile-section"${ssrRenderAttr("aria-busy", unref(form).processing)}>`);
				if (unref(form).errors.form) _push(ssrRenderComponent(_sfc_main$70, {
					variant: "error",
					message: unref(form).errors.form
				}, null, _parent));
				else _push(`<!---->`);
				_push(ssrRenderComponent(_sfc_main$48, {
					id: "profile-first-name",
					modelValue: unref(form).first_name,
					"onUpdate:modelValue": ($event) => unref(form).first_name = $event,
					label: "Имя",
					autocomplete: "given-name",
					maxlength: 255,
					error: unref(form).errors.first_name,
					disabled: unref(form).processing
				}, null, _parent));
				_push(ssrRenderComponent(_sfc_main$48, {
					id: "profile-last-name",
					modelValue: unref(form).last_name,
					"onUpdate:modelValue": ($event) => unref(form).last_name = $event,
					label: "Фамилия",
					autocomplete: "family-name",
					maxlength: 255,
					error: unref(form).errors.last_name,
					disabled: unref(form).processing
				}, null, _parent));
				_push(ssrRenderComponent(_sfc_main$48, {
					id: "profile-email",
					modelValue: unref(form).email,
					"onUpdate:modelValue": ($event) => unref(form).email = $event,
					label: "Email",
					type: "email",
					autocomplete: "email",
					maxlength: 255,
					error: unref(form).errors.email,
					readonly: !__props.canChangeEmail,
					disabled: unref(form).processing,
					required: ""
				}, null, _parent));
				if (!__props.canChangeEmail) _push(`<p class="text-interface-body text-secondary">${ssrInterpolate(__props.passwordAvailable ? "Чтобы изменить email, сначала заверши настройку подключения в личном кабинете." : "Пароль для этого аккаунта не задан. Смена email недоступна.")}</p>`);
				else _push(`<!---->`);
				if (emailChanged.value) {
					_push(`<!--[--><p class="text-interface-body text-secondary">Подтверди новый адрес по ссылке из письма. Остальные сеансы будут завершены.</p>`);
					_push(ssrRenderComponent(_sfc_main$48, {
						id: "profile-email-password",
						modelValue: unref(form).current_password,
						"onUpdate:modelValue": ($event) => unref(form).current_password = $event,
						label: "Текущий пароль для смены email",
						type: "password",
						autocomplete: "current-password",
						error: unref(form).errors.current_password,
						disabled: unref(form).processing,
						required: ""
					}, null, _parent));
					_push(`<!--]-->`);
				} else _push(`<!---->`);
				_push(`<div class="flex flex-wrap gap-compact">`);
				_push(ssrRenderComponent(_sfc_main$73, {
					type: "submit",
					label: "Сохранить данные",
					"loading-label": "Сохраняем…",
					loading: unref(form).processing
				}, null, _parent));
				_push(ssrRenderComponent(_sfc_main$73, {
					label: "Отмена",
					variant: "ghost",
					disabled: unref(form).processing,
					onClick: cancel
				}, null, _parent));
				_push(`</div></form>`);
			}
			if (unref(form).recentlySuccessful) _push(`<p role="status" class="text-interface-body text-success">Данные сохранены</p>`);
			else _push(`<!---->`);
			_push(`<div class="grid min-w-0 gap-control border-t border-border pt-profile-section text-interface-body"><h3 class="font-semibold">Telegram</h3><p class="text-secondary">${ssrInterpolate(__props.telegramConnection.connected ? "Подключён" : "Не подключён")}`);
			if (__props.telegramConnection.connected && __props.telegramConnection.username) _push(`<span class="wrap-anywhere"> · @${ssrInterpolate(__props.telegramConnection.username)}</span>`);
			else _push(`<!---->`);
			_push(`</p></div></section>`);
		};
	}
};
var _sfc_setup$47 = _sfc_main$47.setup;
_sfc_main$47.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/profile/ProfileIdentity.vue");
	return _sfc_setup$47 ? _sfc_setup$47(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/profile/ProfileSecurity.vue
var rowClass = "flex min-h-interface-control w-full min-w-0 items-center gap-tight rounded-button border border-border bg-interface-input px-interface-inline py-compact text-left text-interface-body font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-60";
var _sfc_main$46 = {
	__name: "ProfileSecurity",
	__ssrInlineRender: true,
	props: { passwordAvailable: Boolean },
	setup(__props) {
		const active = shallowRef(null);
		const password = useProfileForm({
			current_password: "",
			password: "",
			password_confirmation: ""
		});
		const sessions = useProfileForm({ current_password: "" });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				"aria-labelledby": "profile-security-title",
				class: "grid min-w-0 grid-cols-1 gap-profile-section"
			}, _attrs))}><h2 id="profile-security-title" class="text-interface-title font-display">Безопасность</h2>`);
			if (!__props.passwordAvailable) _push(`<p class="text-interface-body text-secondary">Пароль для этого аккаунта не задан. Смена пароля и завершение других web-сеансов недоступны.</p>`);
			else {
				_push(`<!--[--><button type="button" class="${ssrRenderClass(rowClass)}"${ssrRenderAttr("aria-expanded", active.value === "password")} aria-controls="profile-password-form"${ssrIncludeBooleanAttr(unref(sessions).form.processing) ? " disabled" : ""}>`);
				_push(ssrRenderComponent(_sfc_main$74, {
					name: "keyRound",
					size: "sm",
					class: "shrink-0 text-accent-text"
				}, null, _parent));
				_push(`<span class="min-w-0 flex-1 wrap-anywhere">Изменить пароль</span>`);
				_push(ssrRenderComponent(_sfc_main$74, {
					name: "chevronRight",
					size: "sm",
					class: "shrink-0 text-muted"
				}, null, _parent));
				_push(`</button>`);
				if (active.value === "password") {
					_push(`<form id="profile-password-form" class="grid min-w-0 grid-cols-1 gap-profile-section"${ssrRenderAttr("aria-busy", unref(password).form.processing)}>`);
					if (unref(password).form.errors.form) _push(ssrRenderComponent(_sfc_main$70, {
						variant: "error",
						message: unref(password).form.errors.form
					}, null, _parent));
					else _push(`<!---->`);
					_push(ssrRenderComponent(_sfc_main$48, {
						id: "profile-current-password",
						modelValue: unref(password).form.current_password,
						"onUpdate:modelValue": ($event) => unref(password).form.current_password = $event,
						type: "password",
						label: "Текущий пароль",
						autocomplete: "current-password",
						disabled: unref(password).form.processing,
						error: unref(password).form.errors.current_password,
						required: ""
					}, null, _parent));
					_push(ssrRenderComponent(_sfc_main$48, {
						id: "profile-new-password",
						modelValue: unref(password).form.password,
						"onUpdate:modelValue": ($event) => unref(password).form.password = $event,
						type: "password",
						label: "Новый пароль",
						autocomplete: "new-password",
						disabled: unref(password).form.processing,
						error: unref(password).form.errors.password,
						required: ""
					}, null, _parent));
					_push(ssrRenderComponent(_sfc_main$48, {
						id: "profile-password-confirmation",
						modelValue: unref(password).form.password_confirmation,
						"onUpdate:modelValue": ($event) => unref(password).form.password_confirmation = $event,
						type: "password",
						label: "Повтори новый пароль",
						autocomplete: "new-password",
						disabled: unref(password).form.processing,
						error: unref(password).form.errors.password_confirmation,
						required: ""
					}, null, _parent));
					_push(`<p class="text-interface-body text-secondary">После смены пароля другие сеансы будут завершены. Этот сеанс останется открытым.</p>`);
					_push(ssrRenderComponent(_sfc_main$73, {
						type: "submit",
						label: "Сохранить пароль",
						"loading-label": "Сохраняем…",
						loading: unref(password).form.processing,
						"full-width": ""
					}, null, _parent));
					if (unref(password).form.recentlySuccessful) _push(`<p role="status" class="text-interface-body text-success">Пароль изменён. Другие сеансы завершены.</p>`);
					else _push(`<!---->`);
					_push(`</form>`);
				} else _push(`<!---->`);
				_push(`<button type="button" class="${ssrRenderClass(rowClass)}"${ssrRenderAttr("aria-expanded", active.value === "sessions")} aria-controls="profile-sessions-form"${ssrIncludeBooleanAttr(unref(password).form.processing) ? " disabled" : ""}>`);
				_push(ssrRenderComponent(_sfc_main$74, {
					name: "logOut",
					size: "sm",
					class: "shrink-0 text-error"
				}, null, _parent));
				_push(`<span class="min-w-0 flex-1 wrap-anywhere">Завершить другие сеансы</span>`);
				_push(ssrRenderComponent(_sfc_main$74, {
					name: "chevronRight",
					size: "sm",
					class: "shrink-0 text-muted"
				}, null, _parent));
				_push(`</button>`);
				if (active.value === "sessions") {
					_push(`<form id="profile-sessions-form" class="grid min-w-0 grid-cols-1 gap-profile-section"${ssrRenderAttr("aria-busy", unref(sessions).form.processing)}>`);
					if (unref(sessions).form.errors.form) _push(ssrRenderComponent(_sfc_main$70, {
						variant: "error",
						message: unref(sessions).form.errors.form
					}, null, _parent));
					else _push(`<!---->`);
					_push(ssrRenderComponent(_sfc_main$48, {
						id: "profile-sessions-password",
						modelValue: unref(sessions).form.current_password,
						"onUpdate:modelValue": ($event) => unref(sessions).form.current_password = $event,
						label: "Текущий пароль для завершения сеансов",
						type: "password",
						autocomplete: "current-password",
						disabled: unref(sessions).form.processing,
						error: unref(sessions).form.errors.current_password,
						required: ""
					}, null, _parent));
					_push(ssrRenderComponent(_sfc_main$73, {
						type: "submit",
						label: "Подтвердить завершение сеансов",
						"loading-label": "Завершаем…",
						loading: unref(sessions).form.processing,
						"full-width": ""
					}, null, _parent));
					if (unref(sessions).form.recentlySuccessful) _push(`<p role="status" class="text-interface-body text-success">Другие сеансы завершены. Этот сеанс остаётся открытым.</p>`);
					else _push(`<!---->`);
					_push(`</form>`);
				} else _push(`<!---->`);
				_push(`<!--]-->`);
			}
			_push(`</section>`);
		};
	}
};
var _sfc_setup$46 = _sfc_main$46.setup;
_sfc_main$46.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/profile/ProfileSecurity.vue");
	return _sfc_setup$46 ? _sfc_setup$46(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/profile/ProfileTheme.vue
var _sfc_main$45 = {
	__name: "ProfileTheme",
	__ssrInlineRender: true,
	setup(__props) {
		const { activeTheme, setTheme } = useTheme();
		const choices = [{
			value: "light",
			label: "Светлая"
		}, {
			value: "dark",
			label: "Тёмная"
		}];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<fieldset${ssrRenderAttrs(mergeProps({ class: "grid min-w-0 grid-cols-1 gap-profile-section" }, _attrs))}><legend class="mb-profile-section text-interface-title font-display">Тема оформления</legend><div class="grid min-h-interface-control min-w-0 grid-cols-2 gap-profile-theme-inset rounded-button border border-border bg-interface-input p-profile-theme-inset"><!--[-->`);
			ssrRenderList(choices, (choice) => {
				_push(`<label class="${ssrRenderClass([unref(activeTheme) === choice.value ? "bg-accent-soft font-semibold text-accent-text" : "font-medium text-secondary hover:bg-accent-soft", "relative flex min-w-0 cursor-pointer items-center justify-center rounded-control px-control py-tight text-interface-meta has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus"])}"><input type="radio" name="profile-theme"${ssrRenderAttr("value", choice.value)}${ssrIncludeBooleanAttr(unref(activeTheme) === choice.value) ? " checked" : ""} class="sr-only"> ${ssrInterpolate(choice.label)}</label>`);
			});
			_push(`<!--]--></div></fieldset>`);
		};
	}
};
var _sfc_setup$45 = _sfc_main$45.setup;
_sfc_main$45.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/profile/ProfileTheme.vue");
	return _sfc_setup$45 ? _sfc_setup$45(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/profile/ProfileLogout.vue
var _sfc_main$44 = {
	__name: "ProfileLogout",
	__ssrInlineRender: true,
	setup(__props) {
		const { form, submit: submitAction } = useActionForm({});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<form${ssrRenderAttrs(mergeProps({
				class: "grid min-w-0 gap-profile-section",
				"aria-busy": unref(form).processing
			}, _attrs))}>`);
			if (unref(form).errors.form) _push(ssrRenderComponent(_sfc_main$70, {
				variant: "error",
				message: unref(form).errors.form
			}, null, _parent));
			else _push(`<!---->`);
			_push(ssrRenderComponent(_sfc_main$73, {
				type: "submit",
				variant: "danger",
				loading: unref(form).processing,
				"loading-label": "Выходим…",
				"full-width": ""
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_sfc_main$74, {
							name: "logOut",
							size: "sm"
						}, null, _parent, _scopeId));
						_push(`<span${_scopeId}>Выйти из аккаунта</span>`);
					} else return [createVNode(_sfc_main$74, {
						name: "logOut",
						size: "sm"
					}), createVNode("span", null, "Выйти из аккаунта")];
				}),
				_: 1
			}, _parent));
			_push(`</form>`);
		};
	}
};
var _sfc_setup$44 = _sfc_main$44.setup;
_sfc_main$44.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/profile/ProfileLogout.vue");
	return _sfc_setup$44 ? _sfc_setup$44(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Account/Profile.vue
var Profile_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$43 });
var _sfc_main$43 = {
	__name: "Profile",
	__ssrInlineRender: true,
	props: {
		user: {
			type: Object,
			required: true
		},
		telegramConnection: {
			type: Object,
			required: true
		},
		securityCapabilities: {
			type: Object,
			required: true
		},
		themePreference: {
			type: Object,
			required: true
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Мой профиль" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$64, {
				"page-title": "Профиль",
				"content-spacing": "profile"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid min-w-0 grid-cols-1 gap-profile-section"${_scopeId}><h1 class="text-interface-heading font-display tracking-interface-heading wrap-anywhere"${_scopeId}>Мой профиль</h1>`);
						_push(ssrRenderComponent(_sfc_main$47, {
							user: __props.user,
							"telegram-connection": __props.telegramConnection,
							"can-change-email": __props.securityCapabilities.changeEmail,
							"password-available": __props.securityCapabilities.password
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$46, { "password-available": __props.securityCapabilities.password }, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$45, null, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$44, null, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "grid min-w-0 grid-cols-1 gap-profile-section" }, [
						createVNode("h1", { class: "text-interface-heading font-display tracking-interface-heading wrap-anywhere" }, "Мой профиль"),
						createVNode(_sfc_main$47, {
							user: __props.user,
							"telegram-connection": __props.telegramConnection,
							"can-change-email": __props.securityCapabilities.changeEmail,
							"password-available": __props.securityCapabilities.password
						}, null, 8, [
							"user",
							"telegram-connection",
							"can-change-email",
							"password-available"
						]),
						createVNode(_sfc_main$46, { "password-available": __props.securityCapabilities.password }, null, 8, ["password-available"]),
						createVNode(_sfc_main$45),
						createVNode(_sfc_main$44)
					])];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$43 = _sfc_main$43.setup;
_sfc_main$43.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Profile.vue");
	return _sfc_setup$43 ? _sfc_setup$43(props, ctx) : void 0;
};
//#endregion
//#region resources/js/composables/useInviteShare.js
function useInviteShare(url) {
	const sharing = shallowRef(false);
	const status = shallowRef("");
	const attemptedUrl = shallowRef(null);
	const copy = useCopyableLink(url);
	const busy = computed(() => sharing.value || copy.busy.value);
	const feedback = computed(() => attemptedUrl.value === toValue(url) ? status.value || copy.feedback.value : "");
	const manual = computed(() => attemptedUrl.value === toValue(url) && copy.manual.value);
	let alive = true;
	async function share() {
		if (busy.value || !toValue(url)) return;
		sharing.value = true;
		attemptedUrl.value = toValue(url);
		status.value = "";
		try {
			if (typeof navigator.share === "function") {
				await navigator.share({
					title: "Приглашение в dudeweb",
					url: toValue(url)
				});
				if (alive) status.value = "Приглашение отправлено";
			} else await copy.copy();
		} catch (error) {
			if (alive && error.name === "AbortError") status.value = "Отправка отменена";
			else if (alive && attemptedUrl.value === toValue(url)) await copy.copy();
		} finally {
			if (alive) sharing.value = false;
		}
	}
	onBeforeUnmount(() => {
		alive = false;
	});
	return {
		busy,
		feedback,
		manual,
		share
	};
}
//#endregion
//#region resources/js/components/referral/ReferralInviteCard.vue
var _sfc_main$42 = {
	__name: "ReferralInviteCard",
	__ssrInlineRender: true,
	props: {
		webInviteUrl: {
			type: String,
			default: null
		},
		telegramInviteUrl: {
			type: String,
			default: null
		}
	},
	setup(__props) {
		const props = __props;
		const channel = shallowRef("web");
		const selectedUrl = computed(() => channel.value === "telegram" ? props.telegramInviteUrl : props.webInviteUrl);
		const displayUrl = computed(() => selectedUrl.value ? `${new URL(selectedUrl.value).host}${channel.value === "web" ? "/invite/…" : "/…"}` : "");
		const { busy, feedback, manual, share } = useInviteShare(selectedUrl);
		const id = useId();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				"aria-labelledby": "referral-link-title",
				class: "grid min-w-0 grid-cols-1 gap-account-connection-gap rounded-card border border-border bg-surface p-account-connection"
			}, _attrs))}><h2 id="referral-link-title" class="text-interface-title font-display">Твоя ссылка для друзей</h2>`);
			if (__props.webInviteUrl || __props.telegramInviteUrl) {
				_push(`<!--[--><label${ssrRenderAttr("for", unref(id))} class="text-interface-body text-secondary">Куда приглашаем</label><select${ssrRenderAttr("id", unref(id))}${ssrIncludeBooleanAttr(unref(busy)) ? " disabled" : ""} class="min-h-interface-control min-w-0 w-full rounded-button border border-interface-field-border bg-interface-input px-interface-inline text-interface-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"><option value="web"${ssrIncludeBooleanAttr(!__props.webInviteUrl) ? " disabled" : ""}${ssrIncludeBooleanAttr(Array.isArray(channel.value) ? ssrLooseContain(channel.value, "web") : ssrLooseEqual(channel.value, "web")) ? " selected" : ""}>На сайт</option><option value="telegram"${ssrIncludeBooleanAttr(!__props.telegramInviteUrl) ? " disabled" : ""}${ssrIncludeBooleanAttr(Array.isArray(channel.value) ? ssrLooseContain(channel.value, "telegram") : ssrLooseEqual(channel.value, "telegram")) ? " selected" : ""}>В Telegram</option></select>`);
				if (selectedUrl.value) _push(ssrRenderComponent(_sfc_main$62, {
					key: selectedUrl.value,
					value: selectedUrl.value,
					"display-value": displayUrl.value,
					"copy-label": "Скопировать приглашение"
				}, null, _parent));
				else _push(`<!---->`);
				_push(ssrRenderComponent(_sfc_main$73, {
					label: "Поделиться",
					variant: "accent",
					disabled: !selectedUrl.value,
					loading: unref(busy),
					"loading-label": "Подготавливаем…",
					"full-width": "",
					onClick: unref(share)
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(ssrRenderComponent(_sfc_main$74, {
								name: "share",
								size: "sm"
							}, null, _parent, _scopeId));
							_push(`<span${_scopeId}>Поделиться</span>`);
						} else return [createVNode(_sfc_main$74, {
							name: "share",
							size: "sm"
						}), createVNode("span", null, "Поделиться")];
					}),
					_: 1
				}, _parent));
				if (unref(feedback)) _push(`<p role="status" class="text-interface-body text-secondary">${ssrInterpolate(unref(feedback))}</p>`);
				else _push(`<!---->`);
				if (unref(manual)) _push(`<div class="grid min-w-0 gap-interface-field-gap"><label${ssrRenderAttr("for", `${unref(id)}-manual`)} class="text-interface-body text-secondary">Приглашение для ручного копирования</label><input${ssrRenderAttr("id", `${unref(id)}-manual`)}${ssrRenderAttr("value", selectedUrl.value)} readonly class="min-h-interface-control min-w-0 w-full rounded-button border border-interface-field-border bg-interface-input px-interface-inline font-mono text-interface-body focus-visible:outline-2 focus-visible:outline-focus"></div>`);
				else _push(`<!---->`);
				if (!__props.telegramInviteUrl) _push(`<p class="text-interface-body text-secondary">Приглашение в Telegram сейчас недоступно. Можно пригласить друга на сайт.</p>`);
				else _push(`<!---->`);
				_push(`<!--]-->`);
			} else _push(`<p role="status" class="text-interface-body text-secondary">Ссылки приглашения пока недоступны. Дождись подключения аккаунта и обнови страницу.</p>`);
			_push(`</section>`);
		};
	}
};
var _sfc_setup$42 = _sfc_main$42.setup;
_sfc_main$42.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/referral/ReferralInviteCard.vue");
	return _sfc_setup$42 ? _sfc_setup$42(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/referral/ReferralMetrics.vue
var _sfc_main$41 = {
	__name: "ReferralMetrics",
	__ssrInlineRender: true,
	props: { metrics: {
		type: Object,
		required: true
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<dl${ssrRenderAttrs(mergeProps({ class: "grid min-w-0 grid-cols-2 gap-referral-stat-gap" }, _attrs))}><div class="grid min-h-referral-stat-height min-w-0 content-center gap-control rounded-card border border-border bg-interface-input p-referral-stat"><dd class="order-first font-mono text-interface-body wrap-anywhere">${ssrInterpolate(__props.metrics.invitedCount)}</dd><dt class="text-interface-body text-secondary wrap-anywhere">Приглашено друзей</dt></div><div class="grid min-h-referral-stat-height min-w-0 content-center gap-control rounded-card border border-border bg-interface-input p-referral-stat"><dd class="order-first font-mono text-interface-body wrap-anywhere">${ssrInterpolate(unref(daysLabel)(__props.metrics.bonusDays))}</dd><dt class="text-interface-body text-secondary wrap-anywhere">Получено бонусов</dt></div></dl>`);
		};
	}
};
var _sfc_setup$41 = _sfc_main$41.setup;
_sfc_main$41.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/referral/ReferralMetrics.vue");
	return _sfc_setup$41 ? _sfc_setup$41(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Account/Referral/Index.vue
var Index_exports$1 = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$40 });
var _sfc_main$40 = {
	__name: "Index",
	__ssrInlineRender: true,
	props: {
		webInviteUrl: {
			type: String,
			default: null
		},
		telegramInviteUrl: {
			type: String,
			default: null
		},
		metrics: {
			type: Object,
			required: true
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Пригласить друга" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$64, { "page-title": "Пригласить друга" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid min-w-0 grid-cols-1 gap-account-section"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$63, {
							title: "Хорошим делятся.",
							description: "Приглашай друзей в dudeweb по своей ссылке и получай бонусы по условиям программы."
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(Link), {
							href: "/account/referral/terms",
							class: "flex min-h-interface-control min-w-0 items-center gap-compact rounded-button border border-border bg-interface-input px-interface-inline py-control text-interface-action font-bold text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(_sfc_main$74, {
										name: "gift",
										size: "sm",
										class: "text-accent-text"
									}, null, _parent, _scopeId));
									_push(`<span class="min-w-0 flex-1"${_scopeId}>Условия партнёрской программы</span>`);
									_push(ssrRenderComponent(_sfc_main$74, {
										name: "chevronRight",
										size: "sm",
										class: "text-accent-text"
									}, null, _parent, _scopeId));
								} else return [
									createVNode(_sfc_main$74, {
										name: "gift",
										size: "sm",
										class: "text-accent-text"
									}),
									createVNode("span", { class: "min-w-0 flex-1" }, "Условия партнёрской программы"),
									createVNode(_sfc_main$74, {
										name: "chevronRight",
										size: "sm",
										class: "text-accent-text"
									})
								];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$42, {
							"web-invite-url": __props.webInviteUrl,
							"telegram-invite-url": __props.telegramInviteUrl
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$41, { metrics: __props.metrics }, null, _parent, _scopeId));
						_push(`<section class="grid min-w-0 grid-cols-1 justify-items-center gap-referral-empty-gap rounded-card border border-border bg-interface-input p-referral-empty text-center" aria-labelledby="referral-state-title"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$74, { name: "userPlus" }, null, _parent, _scopeId));
						_push(`<h2 id="referral-state-title" class="max-w-full text-interface-title font-display wrap-anywhere"${_scopeId}>${ssrInterpolate(__props.metrics.invitedCount === 0 ? "Пока никто не присоединился по твоей ссылке." : "Друзья уже присоединились по твоей ссылке.")}</h2><p class="text-interface-body text-secondary"${_scopeId}>${ssrInterpolate(__props.metrics.invitedCount === 0 ? "Поделись приглашением с друзьями." : "Продолжай делиться приглашением. Начисленные бонусы появятся в статистике.")}</p></section></div>`);
					} else return [createVNode("div", { class: "grid min-w-0 grid-cols-1 gap-account-section" }, [
						createVNode(_sfc_main$63, {
							title: "Хорошим делятся.",
							description: "Приглашай друзей в dudeweb по своей ссылке и получай бонусы по условиям программы."
						}),
						createVNode(unref(Link), {
							href: "/account/referral/terms",
							class: "flex min-h-interface-control min-w-0 items-center gap-compact rounded-button border border-border bg-interface-input px-interface-inline py-control text-interface-action font-bold text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
						}, {
							default: withCtx(() => [
								createVNode(_sfc_main$74, {
									name: "gift",
									size: "sm",
									class: "text-accent-text"
								}),
								createVNode("span", { class: "min-w-0 flex-1" }, "Условия партнёрской программы"),
								createVNode(_sfc_main$74, {
									name: "chevronRight",
									size: "sm",
									class: "text-accent-text"
								})
							]),
							_: 1
						}),
						createVNode(_sfc_main$42, {
							"web-invite-url": __props.webInviteUrl,
							"telegram-invite-url": __props.telegramInviteUrl
						}, null, 8, ["web-invite-url", "telegram-invite-url"]),
						createVNode(_sfc_main$41, { metrics: __props.metrics }, null, 8, ["metrics"]),
						createVNode("section", {
							class: "grid min-w-0 grid-cols-1 justify-items-center gap-referral-empty-gap rounded-card border border-border bg-interface-input p-referral-empty text-center",
							"aria-labelledby": "referral-state-title"
						}, [
							createVNode(_sfc_main$74, { name: "userPlus" }),
							createVNode("h2", {
								id: "referral-state-title",
								class: "max-w-full text-interface-title font-display wrap-anywhere"
							}, toDisplayString(__props.metrics.invitedCount === 0 ? "Пока никто не присоединился по твоей ссылке." : "Друзья уже присоединились по твоей ссылке."), 1),
							createVNode("p", { class: "text-interface-body text-secondary" }, toDisplayString(__props.metrics.invitedCount === 0 ? "Поделись приглашением с друзьями." : "Продолжай делиться приглашением. Начисленные бонусы появятся в статистике."), 1)
						])
					])];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$40 = _sfc_main$40.setup;
_sfc_main$40.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Referral/Index.vue");
	return _sfc_setup$40 ? _sfc_setup$40(props, ctx) : void 0;
};
//#endregion
//#region resources/js/utils/referralPresentation.js
function monthsLabel(value) {
	const mod10 = value % 10;
	const mod100 = value % 100;
	return `${value} ${mod10 === 1 && mod100 !== 11 ? "месяц" : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? "месяца" : "месяцев"}`;
}
//#endregion
//#region resources/js/components/referral/ReferralTermsContent.vue
var _sfc_main$39 = {
	__name: "ReferralTermsContent",
	__ssrInlineRender: true,
	props: {
		friendDiscountPercent: {
			type: Number,
			required: true
		},
		rewardMatrix: {
			type: Array,
			required: true
		}
	},
	setup(__props) {
		const props = __props;
		const steps = computed(() => [
			{
				title: "Пригласи друга",
				description: "Поделись своей реферальной ссылкой."
			},
			{
				title: "Друг оформляет подписку",
				description: `На первую покупку действует бонус ${props.friendDiscountPercent}%.`
			},
			{
				title: "Друг оплачивает подписку",
				description: "Бонус начисляется после каждой оплаты."
			},
			{
				title: "Ты получаешь бонус",
				description: "Количество дней зависит от периода подписки."
			}
		]);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><section aria-labelledby="friend-benefit-title" class="flex min-w-0 items-center gap-referral-step-gap rounded-button border border-border bg-interface-input p-referral-step"><span class="inline-flex size-referral-number shrink-0 items-center justify-center rounded-control bg-accent-soft text-accent-text">`);
			_push(ssrRenderComponent(_sfc_main$74, { name: "gift" }, null, _parent));
			_push(`</span><div class="grid min-w-0 gap-control"><h2 id="friend-benefit-title" class="text-interface-title font-display">Бонус для друга</h2><p class="text-interface-body text-secondary">${ssrInterpolate(__props.friendDiscountPercent)}% на первую покупку подписки</p></div></section><ol aria-label="Как работает программа" class="grid gap-referral-terms"><!--[-->`);
			ssrRenderList(steps.value, (step, index) => {
				_push(`<li class="flex min-w-0 items-center gap-referral-step-gap rounded-button border border-border bg-interface-input p-referral-step"><span aria-hidden="true" class="inline-flex size-referral-number shrink-0 items-center justify-center rounded-control bg-accent-soft font-mono text-interface-body text-accent-text">${ssrInterpolate(index + 1)}</span><div class="grid min-w-0 gap-control"><h2 class="text-interface-title font-display">${ssrInterpolate(step.title)}</h2><p class="text-interface-body text-secondary">${ssrInterpolate(step.description)}</p></div></li>`);
			});
			_push(`<!--]--></ol><section aria-labelledby="reward-matrix-title" class="grid min-w-0 grid-cols-1 gap-referral-terms"><h2 id="reward-matrix-title" class="text-interface-title font-display">Твой бонус</h2><div class="rounded-button border border-border bg-interface-input px-referral-table py-tight"><table class="w-full text-interface-body"><caption class="sr-only">Бонус за оплаченный другом период подписки</caption><tbody><!--[-->`);
			ssrRenderList(__props.rewardMatrix, (row) => {
				_push(`<tr><th scope="row" class="py-referral-table-row pr-tight text-left font-normal text-secondary">Друг оплатил ${ssrInterpolate(unref(monthsLabel)(row.months))}</th><td class="py-referral-table-row text-right text-success wrap-anywhere">+${ssrInterpolate(unref(daysLabel)(row.days))}</td></tr>`);
			});
			_push(`<!--]--></tbody></table></div></section><!--]-->`);
		};
	}
};
var _sfc_setup$39 = _sfc_main$39.setup;
_sfc_main$39.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/referral/ReferralTermsContent.vue");
	return _sfc_setup$39 ? _sfc_setup$39(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Account/Referral/Terms.vue
var Terms_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$38 });
var _sfc_main$38 = {
	__name: "Terms",
	__ssrInlineRender: true,
	props: {
		termsAvailable: Boolean,
		friendDiscountPercent: {
			type: Number,
			default: null
		},
		rewardMatrix: {
			type: Array,
			required: true
		},
		contentVersion: {
			type: String,
			default: null
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Условия программы" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$64, {
				"page-title": "Условия программы",
				"content-spacing": "referralTerms"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid min-w-0 grid-cols-1 gap-referral-terms"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Link), {
							href: "/account/referral",
							class: "inline-flex min-h-10 items-center justify-self-start gap-compact rounded-control text-interface-body font-semibold text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(_sfc_main$74, {
										name: "arrowLeft",
										size: "sm"
									}, null, _parent, _scopeId));
									_push(`Назад к приглашениям`);
								} else return [createVNode(_sfc_main$74, {
									name: "arrowLeft",
									size: "sm"
								}), createTextVNode("Назад к приглашениям")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$63, {
							title: "Партнёрская программа",
							description: "Условия для участия простые."
						}, null, _parent, _scopeId));
						if (__props.termsAvailable) _push(ssrRenderComponent(_sfc_main$39, {
							"friend-discount-percent": __props.friendDiscountPercent,
							"reward-matrix": __props.rewardMatrix
						}, null, _parent, _scopeId));
						else _push(ssrRenderComponent(_sfc_main$61, {
							state: "serviceError",
							title: "Условия программы сейчас недоступны.",
							description: "Попробуй открыть страницу позже или напиши в поддержку."
						}, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "grid min-w-0 grid-cols-1 gap-referral-terms" }, [
						createVNode(unref(Link), {
							href: "/account/referral",
							class: "inline-flex min-h-10 items-center justify-self-start gap-compact rounded-control text-interface-body font-semibold text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
						}, {
							default: withCtx(() => [createVNode(_sfc_main$74, {
								name: "arrowLeft",
								size: "sm"
							}), createTextVNode("Назад к приглашениям")]),
							_: 1
						}),
						createVNode(_sfc_main$63, {
							title: "Партнёрская программа",
							description: "Условия для участия простые."
						}),
						__props.termsAvailable ? (openBlock(), createBlock(_sfc_main$39, {
							key: 0,
							"friend-discount-percent": __props.friendDiscountPercent,
							"reward-matrix": __props.rewardMatrix
						}, null, 8, ["friend-discount-percent", "reward-matrix"])) : (openBlock(), createBlock(_sfc_main$61, {
							key: 1,
							state: "serviceError",
							title: "Условия программы сейчас недоступны.",
							description: "Попробуй открыть страницу позже или напиши в поддержку."
						}))
					])];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$38 = _sfc_main$38.setup;
_sfc_main$38.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Referral/Terms.vue");
	return _sfc_setup$38 ? _sfc_setup$38(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/subscription/SubscriptionOverview.vue
var _sfc_main$37 = {
	__name: "SubscriptionOverview",
	__ssrInlineRender: true,
	props: { subscription: {
		type: Object,
		required: true
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				"aria-label": "Текущая подписка",
				class: "grid min-w-0 gap-subscription-overview rounded-card border border-border bg-surface p-control-inline"
			}, _attrs))}><div class="flex flex-wrap items-center justify-between gap-compact"><h2 class="text-interface-title font-display wrap-anywhere">${ssrInterpolate(__props.subscription.planName)}</h2>`);
			_push(ssrRenderComponent(_sfc_main$55, { status: __props.subscription.state }, null, _parent));
			_push(`</div><dl class="flex flex-wrap justify-between gap-content text-interface-body"><div class="grid gap-0.5"><dt class="text-secondary">${ssrInterpolate(__props.subscription.state === "expired" ? "Действовала до" : "Действует до")}</dt><dd><time${ssrRenderAttr("datetime", __props.subscription.expiresAt)}>${ssrInterpolate(__props.subscription.expiresOn)}</time></dd></div><div class="grid gap-0.5 text-right"><dt class="text-secondary">Осталось</dt><dd>${ssrInterpolate(unref(daysLabel)(__props.subscription.remainingDays))}</dd></div></dl></section>`);
		};
	}
};
var _sfc_setup$37 = _sfc_main$37.setup;
_sfc_main$37.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/subscription/SubscriptionOverview.vue");
	return _sfc_setup$37 ? _sfc_setup$37(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/subscription/PeriodSelector.vue
var _sfc_main$36 = {
	__name: "PeriodSelector",
	__ssrInlineRender: true,
	props: /*@__PURE__*/ mergeModels({
		disabled: Boolean,
		legend: {
			type: String,
			default: "Период подписки"
		},
		loading: Boolean,
		name: {
			type: String,
			default: "subscription-period"
		},
		options: {
			type: Array,
			required: true,
			validator: (options) => options.every((option) => Object.hasOwn(option, "value") && typeof option.label === "string")
		}
	}, {
		"modelValue": {
			type: [String, Number],
			default: ""
		},
		"modelModifiers": {}
	}),
	emits: ["update:modelValue"],
	setup(__props) {
		const model = useModel(__props, "modelValue");
		const props = __props;
		const OPTION_CLASSES = {
			default: "border-border bg-elevated text-secondary hover:border-accent hover:text-foreground",
			disabled: "cursor-not-allowed opacity-50",
			selected: "border-accent-hover bg-accent text-accent-foreground"
		};
		function optionClass(option) {
			if (props.disabled || props.loading || option.disabled) return [OPTION_CLASSES.default, OPTION_CLASSES.disabled];
			return model.value === option.value ? OPTION_CLASSES.selected : OPTION_CLASSES.default;
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<fieldset${ssrRenderAttrs(mergeProps({
				"aria-busy": __props.loading,
				disabled: __props.disabled || __props.loading
			}, _attrs))}><legend class="sr-only">${ssrInterpolate(__props.legend)}</legend><div class="grid grid-cols-2 gap-x-compact gap-y-interface-field-gap"><!--[-->`);
			ssrRenderList(__props.options, (option) => {
				_push(`<label class="${ssrRenderClass(["relative flex min-h-interface-control min-w-0 cursor-pointer items-center justify-center rounded-menu-item border px-tight py-compact text-center text-interface-body font-semibold wrap-anywhere transition-colors duration-200 motion-reduce:transition-none focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus", optionClass(option)])}"><input${ssrIncludeBooleanAttr(ssrLooseEqual(model.value, option.value)) ? " checked" : ""}${ssrIncludeBooleanAttr(__props.disabled || __props.loading || option.disabled) ? " disabled" : ""}${ssrRenderAttr("name", __props.name)}${ssrRenderAttr("value", option.value)} class="sr-only" type="radio"> ${ssrInterpolate(option.label)}</label>`);
			});
			_push(`<!--]--></div></fieldset>`);
		};
	}
};
var _sfc_setup$36 = _sfc_main$36.setup;
_sfc_main$36.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/subscription/PeriodSelector.vue");
	return _sfc_setup$36 ? _sfc_setup$36(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/subscription/SubscriptionSummary.vue
var _sfc_main$35 = {
	__name: "SubscriptionSummary",
	__ssrInlineRender: true,
	props: {
		discount: {
			type: String,
			default: "—"
		},
		period: {
			type: String,
			required: true
		},
		plan: {
			type: String,
			required: true
		},
		total: {
			type: String,
			required: true
		}
	},
	setup(__props) {
		const props = __props;
		const rows = computed(() => [
			{
				label: "Тариф",
				value: props.plan
			},
			{
				label: "Период",
				value: props.period
			},
			{
				label: "Скидка",
				value: props.discount
			}
		]);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<dl${ssrRenderAttrs(mergeProps({ class: "grid gap-compact rounded-card border border-border bg-surface p-control-inline" }, _attrs))}><!--[-->`);
			ssrRenderList(rows.value, (row) => {
				_push(`<div class="flex flex-wrap items-center justify-between gap-compact"><dt class="text-interface-body text-muted">${ssrInterpolate(row.label)}</dt><dd class="min-w-0 text-right text-interface-body font-medium wrap-anywhere text-secondary">${ssrInterpolate(row.value)}</dd></div>`);
			});
			_push(`<!--]--><div class="flex flex-wrap items-center justify-between gap-compact"><dt class="text-interface-body text-muted">К оплате</dt><dd class="min-w-0 text-right text-interface-body font-display wrap-anywhere text-foreground">${ssrInterpolate(__props.total)}</dd></div></dl>`);
		};
	}
};
var _sfc_setup$35 = _sfc_main$35.setup;
_sfc_main$35.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/subscription/SubscriptionSummary.vue");
	return _sfc_setup$35 ? _sfc_setup$35(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/subscription/PromoCodeSheet.vue
var _sfc_main$34 = {
	__name: "PromoCodeSheet",
	__ssrInlineRender: true,
	props: /*@__PURE__*/ mergeModels({
		error: {
			type: String,
			default: ""
		},
		note: {
			type: String,
			default: "Промокоды не суммируются с автоматически применённой скидкой."
		},
		processing: Boolean
	}, {
		"modelValue": {
			type: String,
			default: ""
		},
		"modelModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels(["apply", "close"], ["update:modelValue"]),
	setup(__props, { emit: __emit }) {
		const model = useModel(__props, "modelValue");
		const emit = __emit;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "grid min-h-promo-sheet w-full gap-control-inline rounded-t-sheet border-t border-border bg-elevated px-shell-gutter pt-subscription-section pb-panel desktop:rounded-sheet desktop:border desktop:p-panel" }, _attrs))}><div aria-hidden="true" class="flex h-promo-handle items-center justify-center desktop:hidden"><span class="h-1 w-10 rounded-full bg-muted/60"></span></div><header class="flex min-h-promo-header items-center justify-between gap-content"><div class="grid gap-0.5"><h2 id="promo-title" class="text-interface-title font-display text-foreground">Промокод</h2><p id="promo-description" class="text-interface-body text-secondary">Введи код перед оплатой</p></div>`);
			_push(ssrRenderComponent(_sfc_main$73, {
				"aria-label": "Закрыть промокод",
				disabled: __props.processing,
				size: "icon",
				variant: "secondary",
				onClick: ($event) => emit("close")
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$74, { name: "x" }, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$74, { name: "x" })];
				}),
				_: 1
			}, _parent));
			_push(`</header><form class="grid gap-control-inline">`);
			_push(ssrRenderComponent(_sfc_main$48, {
				id: "promo-code",
				modelValue: model.value,
				"onUpdate:modelValue": ($event) => model.value = $event,
				autocomplete: "off",
				disabled: __props.processing,
				error: __props.error,
				label: "Промокод",
				name: "promocode",
				placeholder: "Введите промокод",
				maxlength: 255,
				required: "",
				spacing: "sheet"
			}, null, _parent));
			_push(ssrRenderComponent(_sfc_main$73, {
				"full-width": "",
				loading: __props.processing,
				"loading-label": "Проверяем",
				type: "submit"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Применить `);
					else return [createTextVNode(" Применить ")];
				}),
				_: 1
			}, _parent));
			_push(`</form><p class="flex gap-compact text-interface-body text-muted">`);
			_push(ssrRenderComponent(_sfc_main$74, {
				name: "info",
				size: "sm"
			}, null, _parent));
			_push(`<span>${ssrInterpolate(__props.note)}</span></p></section>`);
		};
	}
};
var _sfc_setup$34 = _sfc_main$34.setup;
_sfc_main$34.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/subscription/PromoCodeSheet.vue");
	return _sfc_setup$34 ? _sfc_setup$34(props, ctx) : void 0;
};
//#endregion
//#region resources/js/utils/subscriptionPresentation.js
function periodLabel(months) {
	return `${months} ${months === 1 ? "месяц" : months === 3 ? "месяца" : "месяцев"}`;
}
function money(amount, currency = "RUB") {
	return new Intl.NumberFormat("ru-RU", {
		style: "currency",
		currency,
		maximumFractionDigits: amount % 100 ? 2 : 0
	}).format(amount / 100);
}
function discountLabel(discount) {
	if (!discount) return "—";
	return discount.type === "percent" ? `${discount.value}%` : money(discount.value);
}
var PAYMENT_LABELS = {
	pending: "Обрабатывается",
	succeeded: "Оплачен",
	canceled: "Отменён"
};
//#endregion
//#region resources/js/composables/useSubscriptionCheckout.js
function useSubscriptionCheckout(initialCatalogue) {
	const catalogue = shallowRef(toValue(initialCatalogue));
	const productId = shallowRef(catalogue.value.products[0]?.id ?? "");
	const promoOpen = shallowRef(false);
	const promo = useHttp({ promocode: "" });
	const payment = useWebPayment();
	const busy = computed(() => promo.processing || payment.form.processing || payment.redirecting.value);
	const selected = computed(() => catalogue.value.products.find((product) => product.id === productId.value));
	const options = computed(() => [
		1,
		3,
		6,
		12
	].map((months) => {
		const product = catalogue.value.products.find((item) => item.months === months);
		return {
			value: product?.id ?? `unavailable-${months}`,
			label: periodLabel(months),
			disabled: !product
		};
	}));
	let alive = true;
	watch(initialCatalogue, (value) => {
		catalogue.value = value;
		productId.value = value.products.find((p) => p.id === productId.value)?.id ?? value.products[0]?.id ?? "";
	});
	watch(productId, payment.resetAttempt);
	async function applyPromo(remove = false) {
		if (busy.value) return;
		promo.clearErrors();
		const input = promo.promocode;
		if (remove) promo.promocode = null;
		try {
			const result = await promo.post("/account/subscription/promo");
			if (!alive || !result) return;
			catalogue.value = result;
			promo.promocode = result.discount?.code ?? "";
			promoOpen.value = false;
			payment.resetAttempt();
		} catch {
			if (alive) promo.setError("promocode", "Не удалось проверить промокод. Попробуй ещё раз.");
		} finally {
			if (remove && !promo.wasSuccessful) promo.promocode = input;
		}
	}
	async function pay() {
		if (busy.value || !selected.value) return;
		payment.form.product_id = selected.value.id;
		payment.form.promocode = catalogue.value.discount?.code ?? null;
		await payment.pay();
		if (alive && payment.form.errors.promocode) {
			promo.promocode = catalogue.value.discount?.code ?? "";
			promo.setError("promocode", payment.form.errors.promocode);
			promoOpen.value = true;
		}
	}
	onBeforeUnmount(() => {
		alive = false;
		promo.cancel();
	});
	return {
		catalogue,
		productId,
		promoOpen,
		promo,
		payment: payment.form,
		busy,
		selected,
		options,
		applyPromo,
		pay
	};
}
//#endregion
//#region resources/js/components/subscription/SubscriptionCheckout.vue
var _sfc_main$33 = {
	__name: "SubscriptionCheckout",
	__ssrInlineRender: true,
	props: { catalogue: {
		type: Object,
		required: true
	} },
	setup(__props) {
		const props = __props;
		const { headerHeight } = inject(accountChromeKey);
		const { catalogue, productId, promoOpen, promo, payment, busy, selected, options, applyPromo, pay } = useSubscriptionCheckout(() => props.catalogue);
		const summary = computed(() => ({
			plan: catalogue.value.plan?.name ?? "Подписка",
			period: selected.value ? periodLabel(selected.value.months) : "Недоступен",
			discount: discountLabel(catalogue.value.discount),
			total: selected.value ? money(selected.value.amount, selected.value.currency) : "Недоступно"
		}));
		const paymentErrors = computed(() => Object.values(payment.errors).filter(Boolean));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "grid min-w-0 gap-subscription-section" }, _attrs))}><section class="grid gap-subscription-period" aria-labelledby="period-heading"><div class="flex flex-wrap items-center justify-between gap-compact"><h2 id="period-heading" class="text-interface-title font-display">Выбери период</h2>`);
			if (unref(catalogue).plan) _push(`<p class="font-mono text-interface-body text-accent-text">${ssrInterpolate(unref(catalogue).plan.name)}</p>`);
			else _push(`<!---->`);
			_push(`</div>`);
			_push(ssrRenderComponent(_sfc_main$36, {
				modelValue: unref(productId),
				"onUpdate:modelValue": ($event) => isRef(productId) ? productId.value = $event : null,
				disabled: unref(busy),
				options: unref(options)
			}, null, _parent));
			_push(`</section>`);
			_push(ssrRenderComponent(_sfc_main$35, summary.value, null, _parent));
			if (unref(catalogue).discount) {
				_push(`<div role="status" class="grid gap-compact rounded-button border border-success/40 bg-success-soft p-control-inline text-interface-body text-success"><p>${ssrInterpolate(unref(catalogue).discount.automatic ? "Автоматическая скидка" : `Промокод ${unref(catalogue).discount.code} применён`)}: ${ssrInterpolate(summary.value.discount)}</p>`);
				if (!unref(catalogue).discount.automatic) _push(ssrRenderComponent(_sfc_main$73, {
					disabled: unref(busy),
					variant: "ghost",
					onClick: ($event) => unref(applyPromo)(true)
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Убрать промокод`);
						else return [createTextVNode("Убрать промокод")];
					}),
					_: 1
				}, _parent));
				else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`<button type="button"${ssrIncludeBooleanAttr(unref(busy) || !unref(selected) || unref(catalogue).discount?.automatic) ? " disabled" : ""} class="inline-flex min-h-interface-control w-full items-center gap-subscription-section rounded-button border border-border bg-elevated px-interface-inline py-tight text-left text-interface-body font-medium text-foreground hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60">`);
			_push(ssrRenderComponent(_sfc_main$74, {
				name: "ticket",
				size: "sm"
			}, null, _parent));
			_push(` ${ssrInterpolate(unref(catalogue).discount?.code ? "Изменить промокод" : "У меня есть промокод")}</button>`);
			if (unref(promo).errors.promocode && !unref(promoOpen)) _push(`<p role="alert" class="text-interface-body text-error">${ssrInterpolate(unref(promo).errors.promocode)}</p>`);
			else _push(`<!---->`);
			if (paymentErrors.value.length) {
				_push(`<ul role="alert" class="grid gap-control text-interface-body text-error"><!--[-->`);
				ssrRenderList(paymentErrors.value, (error) => {
					_push(`<li>${ssrInterpolate(error)}</li>`);
				});
				_push(`<!--]--></ul>`);
			} else _push(`<!---->`);
			_push(ssrRenderComponent(_sfc_main$73, {
				disabled: !unref(selected) || unref(busy),
				loading: unref(payment).processing,
				"full-width": "",
				"loading-label": "Переходим к оплате",
				onClick: unref(pay)
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Перейти к оплате`);
					else return [createTextVNode("Перейти к оплате")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_sfc_main$65, {
				id: "subscription-promo",
				open: unref(promoOpen),
				busy: unref(promo).processing,
				"top-offset": unref(headerHeight),
				"labelled-by": "promo-title",
				"described-by": "promo-description",
				variant: "promo",
				onClose: ($event) => promoOpen.value = false
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$34, {
						modelValue: unref(promo).promocode,
						"onUpdate:modelValue": ($event) => unref(promo).promocode = $event,
						error: unref(promo).errors.promocode,
						processing: unref(promo).processing,
						onApply: ($event) => unref(applyPromo)(),
						onClose: ($event) => promoOpen.value = false
					}, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$34, {
						modelValue: unref(promo).promocode,
						"onUpdate:modelValue": ($event) => unref(promo).promocode = $event,
						error: unref(promo).errors.promocode,
						processing: unref(promo).processing,
						onApply: ($event) => unref(applyPromo)(),
						onClose: ($event) => promoOpen.value = false
					}, null, 8, [
						"modelValue",
						"onUpdate:modelValue",
						"error",
						"processing",
						"onApply",
						"onClose"
					])];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup$33 = _sfc_main$33.setup;
_sfc_main$33.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/subscription/SubscriptionCheckout.vue");
	return _sfc_setup$33 ? _sfc_setup$33(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/subscription/PaymentHistory.vue
var _sfc_main$32 = {
	__name: "PaymentHistory",
	__ssrInlineRender: true,
	props: { payments: {
		type: Object,
		required: true
	} },
	setup(__props) {
		const date = (value) => value ? new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" }).format(new Date(value)) : "Дата не указана";
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				"aria-labelledby": "payment-history-title",
				class: "grid min-w-0 gap-interface-field-gap"
			}, _attrs))}><h2 id="payment-history-title" class="text-interface-title font-display">История платежей</h2>`);
			if (!__props.payments.data.length) {
				_push(`<p class="flex min-h-interface-control items-center gap-subscription-section rounded-button border border-border bg-surface px-control-inline py-compact text-interface-body text-secondary">`);
				_push(ssrRenderComponent(_sfc_main$74, {
					name: "creditCard",
					size: "sm"
				}, null, _parent));
				_push(` Здесь пока нет платежей. </p>`);
			} else {
				_push(`<ul class="grid min-w-0 gap-compact"><!--[-->`);
				ssrRenderList(__props.payments.data, (payment) => {
					_push(`<li>`);
					_push(ssrRenderComponent(unref(Link), {
						href: payment.url,
						class: "flex flex-wrap items-center justify-between gap-content rounded-button border border-border bg-surface p-control-inline text-interface-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<span class="grid min-w-0 gap-control wrap-anywhere"${_scopeId}><span${_scopeId}>${ssrInterpolate(payment.planName ?? "Подписка")} · ${ssrInterpolate(unref(periodLabel)(payment.months))}</span><time${ssrRenderAttr("datetime", payment.createdAt)} class="text-secondary"${_scopeId}>${ssrInterpolate(date(payment.createdAt))}</time></span><span class="grid gap-control text-right"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(money)(payment.amount, payment.currency))}</span><span class="text-secondary"${_scopeId}>${ssrInterpolate(unref(PAYMENT_LABELS)[payment.status])}</span></span>`);
							else return [createVNode("span", { class: "grid min-w-0 gap-control wrap-anywhere" }, [createVNode("span", null, toDisplayString(payment.planName ?? "Подписка") + " · " + toDisplayString(unref(periodLabel)(payment.months)), 1), createVNode("time", {
								datetime: payment.createdAt,
								class: "text-secondary"
							}, toDisplayString(date(payment.createdAt)), 9, ["datetime"])]), createVNode("span", { class: "grid gap-control text-right" }, [createVNode("span", null, toDisplayString(unref(money)(payment.amount, payment.currency)), 1), createVNode("span", { class: "text-secondary" }, toDisplayString(unref(PAYMENT_LABELS)[payment.status]), 1)])];
						}),
						_: 2
					}, _parent));
					_push(`</li>`);
				});
				_push(`<!--]--></ul>`);
			}
			if (__props.payments.last_page > 1) {
				_push(`<nav aria-label="Страницы истории платежей" class="flex flex-wrap gap-content text-interface-body">`);
				if (__props.payments.prev_page_url) _push(ssrRenderComponent(unref(Link), {
					href: __props.payments.prev_page_url,
					class: "rounded-control text-accent-text focus-visible:outline-2 focus-visible:outline-focus"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Назад`);
						else return [createTextVNode("Назад")];
					}),
					_: 1
				}, _parent));
				else _push(`<!---->`);
				_push(`<span>${ssrInterpolate(__props.payments.current_page)} / ${ssrInterpolate(__props.payments.last_page)}</span>`);
				if (__props.payments.next_page_url) _push(ssrRenderComponent(unref(Link), {
					href: __props.payments.next_page_url,
					class: "rounded-control text-accent-text focus-visible:outline-2 focus-visible:outline-focus"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Дальше`);
						else return [createTextVNode("Дальше")];
					}),
					_: 1
				}, _parent));
				else _push(`<!---->`);
				_push(`</nav>`);
			} else _push(`<!---->`);
			_push(`</section>`);
		};
	}
};
var _sfc_setup$32 = _sfc_main$32.setup;
_sfc_main$32.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/subscription/PaymentHistory.vue");
	return _sfc_setup$32 ? _sfc_setup$32(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Account/Subscription.vue
var Subscription_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$31 });
var _sfc_main$31 = {
	__name: "Subscription",
	__ssrInlineRender: true,
	props: {
		subscription: {
			type: Object,
			default: null
		},
		serviceState: {
			type: String,
			required: true
		},
		catalogue: {
			type: Object,
			required: true
		},
		payments: {
			type: Object,
			required: true
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Подписка" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$64, {
				"page-title": "Подписка",
				"content-spacing": "subscription"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid min-w-0 gap-subscription-section"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$63, {
							title: "Твоя подписка",
							description: "Управляй периодом и продлевай доступ."
						}, null, _parent, _scopeId));
						if (__props.subscription) _push(ssrRenderComponent(_sfc_main$37, { subscription: __props.subscription }, null, _parent, _scopeId));
						else _push(`<p role="alert" class="rounded-card border border-border bg-surface p-control-inline text-interface-body text-secondary"${_scopeId}>Не удалось загрузить текущую подписку. Обнови страницу, чтобы проверить срок доступа.</p>`);
						if (!__props.catalogue.products.length) _push(`<p role="status" class="text-interface-body text-secondary"${_scopeId}>Сейчас нет доступных периодов для оплаты. Попробуй позже.</p>`);
						else _push(`<!---->`);
						_push(ssrRenderComponent(_sfc_main$33, { catalogue: __props.catalogue }, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$32, { payments: __props.payments }, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "grid min-w-0 gap-subscription-section" }, [
						createVNode(_sfc_main$63, {
							title: "Твоя подписка",
							description: "Управляй периодом и продлевай доступ."
						}),
						__props.subscription ? (openBlock(), createBlock(_sfc_main$37, {
							key: 0,
							subscription: __props.subscription
						}, null, 8, ["subscription"])) : (openBlock(), createBlock("p", {
							key: 1,
							role: "alert",
							class: "rounded-card border border-border bg-surface p-control-inline text-interface-body text-secondary"
						}, "Не удалось загрузить текущую подписку. Обнови страницу, чтобы проверить срок доступа.")),
						!__props.catalogue.products.length ? (openBlock(), createBlock("p", {
							key: 2,
							role: "status",
							class: "text-interface-body text-secondary"
						}, "Сейчас нет доступных периодов для оплаты. Попробуй позже.")) : createCommentVNode("", true),
						createVNode(_sfc_main$33, { catalogue: __props.catalogue }, null, 8, ["catalogue"]),
						createVNode(_sfc_main$32, { payments: __props.payments }, null, 8, ["payments"])
					])];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$31 = _sfc_main$31.setup;
_sfc_main$31.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Subscription.vue");
	return _sfc_setup$31 ? _sfc_setup$31(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/support/SupportTicketForm.vue
var _sfc_main$30 = {
	__name: "SupportTicketForm",
	__ssrInlineRender: true,
	props: {
		submissionId: {
			type: String,
			required: true
		},
		subjectMax: {
			type: Number,
			required: true
		},
		bodyMax: {
			type: Number,
			required: true
		}
	},
	setup(__props) {
		const { form, submit: submitAction } = useActionForm({
			subject: "",
			body: "",
			submission_id: __props.submissionId
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<form${ssrRenderAttrs(mergeProps({
				class: "grid min-w-0 grid-cols-1 gap-account-section",
				"aria-busy": unref(form).processing
			}, _attrs))}>`);
			if (unref(form).errors.form) _push(ssrRenderComponent(_sfc_main$70, {
				variant: "error",
				message: unref(form).errors.form
			}, null, _parent));
			else _push(`<!---->`);
			_push(ssrRenderComponent(_sfc_main$48, {
				id: "support-subject",
				modelValue: unref(form).subject,
				"onUpdate:modelValue": ($event) => unref(form).subject = $event,
				label: "Тема обращения",
				placeholder: "Кратко опиши вопрос",
				maxlength: __props.subjectMax,
				disabled: unref(form).processing,
				error: unref(form).errors.subject,
				required: ""
			}, null, _parent));
			_push(`<div class="grid min-w-0 grid-cols-1 gap-interface-field-gap"><label for="support-body" class="text-interface-body font-medium text-secondary">Сообщение</label><textarea id="support-body"${ssrRenderAttr("maxlength", __props.bodyMax)}${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${ssrRenderAttr("aria-invalid", Boolean(unref(form).errors.body))}${ssrRenderAttr("aria-describedby", unref(form).errors.body ? "support-body-error" : void 0)} placeholder="Расскажи подробнее, что произошло…" required class="min-h-support-message min-w-0 w-full resize-y rounded-button border border-interface-field-border bg-interface-input p-interface-inline text-interface-body placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-60">${ssrInterpolate(unref(form).body)}</textarea>`);
			if (unref(form).errors.body) _push(`<p id="support-body-error" role="alert" class="text-interface-body text-error">${ssrInterpolate(unref(form).errors.body)}</p>`);
			else _push(`<!---->`);
			_push(`</div>`);
			_push(ssrRenderComponent(_sfc_main$73, {
				type: "submit",
				label: "Отправить обращение",
				"loading-label": "Отправляем…",
				loading: unref(form).processing,
				"full-width": ""
			}, null, _parent));
			_push(`</form>`);
		};
	}
};
var _sfc_setup$30 = _sfc_main$30.setup;
_sfc_main$30.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/support/SupportTicketForm.vue");
	return _sfc_setup$30 ? _sfc_setup$30(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Account/Support/Create.vue
var Create_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$29 });
var _sfc_main$29 = {
	__name: "Create",
	__ssrInlineRender: true,
	props: {
		submissionId: {
			type: String,
			required: true
		},
		subjectMax: {
			type: Number,
			required: true
		},
		bodyMax: {
			type: Number,
			required: true
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Новое обращение" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$64, { "page-title": "Новое обращение" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid min-w-0 grid-cols-1 gap-account-section"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$63, {
							title: "Напиши нам",
							description: "Опиши ситуацию — ответим в этом обращении."
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$30, {
							"submission-id": __props.submissionId,
							"subject-max": __props.subjectMax,
							"body-max": __props.bodyMax
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(Link), {
							href: "/account/support",
							class: "inline-flex min-h-10 items-center justify-self-start rounded-control text-interface-body text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Назад к обращениям`);
								else return [createTextVNode("Назад к обращениям")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "grid min-w-0 grid-cols-1 gap-account-section" }, [
						createVNode(_sfc_main$63, {
							title: "Напиши нам",
							description: "Опиши ситуацию — ответим в этом обращении."
						}),
						createVNode(_sfc_main$30, {
							"submission-id": __props.submissionId,
							"subject-max": __props.subjectMax,
							"body-max": __props.bodyMax
						}, null, 8, [
							"submission-id",
							"subject-max",
							"body-max"
						]),
						createVNode(unref(Link), {
							href: "/account/support",
							class: "inline-flex min-h-10 items-center justify-self-start rounded-control text-interface-body text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
						}, {
							default: withCtx(() => [createTextVNode("Назад к обращениям")]),
							_: 1
						})
					])];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$29 = _sfc_main$29.setup;
_sfc_main$29.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Support/Create.vue");
	return _sfc_setup$29 ? _sfc_setup$29(props, ctx) : void 0;
};
//#endregion
//#region resources/js/composables/useSupportRead.js
function useSupportRead() {
	const loading = shallowRef(false);
	const failed = shallowRef(false);
	let cancel;
	function failure() {
		failed.value = true;
		return false;
	}
	function reload() {
		if (loading.value) return;
		loading.value = true;
		failed.value = false;
		router.reload({
			only: [
				"tickets",
				"ticket",
				"messages",
				"serviceState",
				"submissionId"
			],
			onCancelToken: (token) => {
				cancel = token;
			},
			onError: failure,
			onHttpException: failure,
			onNetworkError: failure,
			onFinish: () => {
				loading.value = false;
				cancel = null;
			}
		});
	}
	onBeforeUnmount(() => cancel?.cancel());
	return {
		loading,
		failed,
		reload
	};
}
//#endregion
//#region resources/js/components/support/SupportRead.vue
var _sfc_main$28 = {
	__name: "SupportRead",
	__ssrInlineRender: true,
	props: { serviceState: {
		type: String,
		default: "ready"
	} },
	setup(__props) {
		const { loading, failed, reload } = useSupportRead();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			if (unref(loading)) _push(ssrRenderComponent(_sfc_main$61, {
				state: "loading",
				title: "Загружаем обращения…",
				description: "Это займёт несколько секунд."
			}, null, _parent));
			else if (unref(failed) || __props.serviceState === "error") _push(ssrRenderComponent(_sfc_main$61, {
				state: "serviceError",
				title: "Не удалось загрузить поддержку.",
				description: "Попробуй обновить данные."
			}, {
				actions: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$73, {
						label: "Попробовать снова",
						onClick: unref(reload)
					}, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$73, {
						label: "Попробовать снова",
						onClick: unref(reload)
					}, null, 8, ["onClick"])];
				}),
				_: 1
			}, _parent));
			else _push(`<!---->`);
			_push(`<div class="contents" style="${ssrRenderStyle(!unref(loading) && !unref(failed) && __props.serviceState !== "error" ? null : { display: "none" })}">`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(ssrRenderComponent(_sfc_main$73, {
				label: "Обновить данные",
				variant: "ghost",
				size: "sm",
				class: "justify-self-start",
				onClick: unref(reload)
			}, null, _parent));
			_push(`</div><!--]-->`);
		};
	}
};
var _sfc_setup$28 = _sfc_main$28.setup;
_sfc_main$28.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/support/SupportRead.vue");
	return _sfc_setup$28 ? _sfc_setup$28(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/support/SupportPagination.vue
var _sfc_main$27 = {
	__name: "SupportPagination",
	__ssrInlineRender: true,
	props: {
		pagination: {
			type: Object,
			required: true
		},
		label: {
			type: String,
			default: "Страницы обращений"
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			if (__props.pagination.last_page > 1) {
				_push(`<nav${ssrRenderAttrs(mergeProps({
					"aria-label": __props.label,
					class: "flex min-w-0 flex-wrap gap-compact"
				}, _attrs))}><!--[-->`);
				ssrRenderList(__props.pagination.links, (link, index) => {
					_push(`<!--[-->`);
					if (link.url) _push(ssrRenderComponent(unref(Link), {
						href: link.url,
						"aria-current": link.active ? "page" : void 0,
						class: "inline-flex min-h-interface-header-control items-center rounded-control px-control-inline text-interface-body text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(index === 0 ? "Назад" : index === __props.pagination.links.length - 1 ? "Дальше" : link.label)}`);
							else return [createTextVNode(toDisplayString(index === 0 ? "Назад" : index === __props.pagination.links.length - 1 ? "Дальше" : link.label), 1)];
						}),
						_: 2
					}, _parent));
					else _push(`<span aria-disabled="true" class="inline-flex min-h-interface-header-control items-center px-control-inline text-interface-body text-muted">${ssrInterpolate(index === 0 ? "Назад" : index === __props.pagination.links.length - 1 ? "Дальше" : link.label)}</span>`);
					_push(`<!--]-->`);
				});
				_push(`<!--]--></nav>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$27 = _sfc_main$27.setup;
_sfc_main$27.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/support/SupportPagination.vue");
	return _sfc_setup$27 ? _sfc_setup$27(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/support/SupportTicketList.vue
var _sfc_main$26 = {
	__name: "SupportTicketList",
	__ssrInlineRender: true,
	props: { tickets: {
		type: Object,
		required: true
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				class: "grid min-w-0 grid-cols-1 gap-account-section",
				"aria-labelledby": "support-tickets-title"
			}, _attrs))}><h2 id="support-tickets-title" class="text-interface-heading font-display tracking-interface-heading wrap-anywhere">Обращения</h2>`);
			if (!__props.tickets.data.length) _push(ssrRenderComponent(_sfc_main$61, {
				state: "empty",
				title: "Обращений пока нет.",
				description: "Если нужна помощь, создай обращение — ответим здесь."
			}, null, _parent));
			else {
				_push(`<ul class="grid min-w-0 grid-cols-1 gap-support-message-gap"><!--[-->`);
				ssrRenderList(__props.tickets.data, (ticket) => {
					_push(`<li class="min-w-0">`);
					_push(ssrRenderComponent(unref(Link), {
						href: ticket.url,
						class: "grid min-w-0 grid-cols-1 gap-support-message-gap rounded-card border border-border bg-interface-input p-support-ticket hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<div class="flex min-w-0 flex-wrap items-start justify-between gap-compact"${_scopeId}><h3 class="min-w-0 flex-1 text-interface-title font-display wrap-anywhere"${_scopeId}>${ssrInterpolate(ticket.subject)}</h3><span class="${ssrRenderClass([ticket.status === "OPEN" ? "text-accent-text" : "text-secondary", "text-interface-meta"])}"${_scopeId}>${ssrInterpolate(ticket.statusLabel)}</span></div><p class="line-clamp-2 text-interface-body text-secondary wrap-anywhere"${_scopeId}>${ssrInterpolate(ticket.preview)}</p><time${ssrRenderAttr("datetime", ticket.updatedAt)} class="text-interface-body text-muted"${_scopeId}>${ssrInterpolate(ticket.updatedLabel)}</time>`);
							else return [
								createVNode("div", { class: "flex min-w-0 flex-wrap items-start justify-between gap-compact" }, [createVNode("h3", { class: "min-w-0 flex-1 text-interface-title font-display wrap-anywhere" }, toDisplayString(ticket.subject), 1), createVNode("span", { class: ["text-interface-meta", ticket.status === "OPEN" ? "text-accent-text" : "text-secondary"] }, toDisplayString(ticket.statusLabel), 3)]),
								createVNode("p", { class: "line-clamp-2 text-interface-body text-secondary wrap-anywhere" }, toDisplayString(ticket.preview), 1),
								createVNode("time", {
									datetime: ticket.updatedAt,
									class: "text-interface-body text-muted"
								}, toDisplayString(ticket.updatedLabel), 9, ["datetime"])
							];
						}),
						_: 2
					}, _parent));
					_push(`</li>`);
				});
				_push(`<!--]--></ul>`);
			}
			_push(ssrRenderComponent(_sfc_main$27, { pagination: __props.tickets }, null, _parent));
			_push(`</section>`);
		};
	}
};
var _sfc_setup$26 = _sfc_main$26.setup;
_sfc_main$26.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/support/SupportTicketList.vue");
	return _sfc_setup$26 ? _sfc_setup$26(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Account/Support/Index.vue
var Index_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$25 });
var _sfc_main$25 = {
	__name: "Index",
	__ssrInlineRender: true,
	props: {
		tickets: {
			type: Object,
			required: true
		},
		serviceState: {
			type: String,
			default: "ready"
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Поддержка" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$64, { "page-title": "Поддержка" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid min-w-0 grid-cols-1 gap-account-section"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$63, {
							title: "Dude, мы на связи.",
							description: "Расскажи, что случилось, — поможем разобраться."
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(Link), {
							href: "/account/support/create",
							class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Написать в поддержку`);
								else return [createTextVNode("Написать в поддержку")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$28, { "service-state": __props.serviceState }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_sfc_main$26, { tickets: __props.tickets }, null, _parent, _scopeId));
								else return [createVNode(_sfc_main$26, { tickets: __props.tickets }, null, 8, ["tickets"])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "grid min-w-0 grid-cols-1 gap-account-section" }, [
						createVNode(_sfc_main$63, {
							title: "Dude, мы на связи.",
							description: "Расскажи, что случилось, — поможем разобраться."
						}),
						createVNode(unref(Link), {
							href: "/account/support/create",
							class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
						}, {
							default: withCtx(() => [createTextVNode("Написать в поддержку")]),
							_: 1
						}),
						createVNode(_sfc_main$28, { "service-state": __props.serviceState }, {
							default: withCtx(() => [createVNode(_sfc_main$26, { tickets: __props.tickets }, null, 8, ["tickets"])]),
							_: 1
						}, 8, ["service-state"])
					])];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$25 = _sfc_main$25.setup;
_sfc_main$25.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Support/Index.vue");
	return _sfc_setup$25 ? _sfc_setup$25(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/support/SupportReplyForm.vue
var _sfc_main$24 = {
	__name: "SupportReplyForm",
	__ssrInlineRender: true,
	props: {
		replyUrl: {
			type: String,
			required: true
		},
		submissionId: {
			type: String,
			required: true
		},
		bodyMax: {
			type: Number,
			required: true
		}
	},
	setup(__props) {
		const { form, submit: submitAction } = useActionForm({
			body: "",
			submission_id: __props.submissionId
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<form${ssrRenderAttrs(mergeProps({
				id: "support-reply",
				class: "grid min-w-0 grid-cols-1 gap-compact",
				"aria-busy": unref(form).processing
			}, _attrs))}>`);
			if (unref(form).errors.form) _push(ssrRenderComponent(_sfc_main$70, {
				variant: "error",
				message: unref(form).errors.form
			}, null, _parent));
			else _push(`<!---->`);
			_push(`<label for="support-reply-body" class="sr-only">Ответить в обращении</label><div class="flex min-h-interface-copy-row min-w-0 items-center gap-compact rounded-button border border-interface-field-border bg-interface-input py-control pr-compact pl-interface-inline"><textarea id="support-reply-body" rows="1"${ssrRenderAttr("maxlength", __props.bodyMax)}${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${ssrRenderAttr("aria-invalid", Boolean(unref(form).errors.body))}${ssrRenderAttr("aria-describedby", unref(form).errors.body ? "support-reply-error" : void 0)} placeholder="Ответить…" required class="min-h-12 min-w-0 flex-1 resize-y rounded-control bg-transparent py-control text-interface-body placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">${ssrInterpolate(unref(form).body)}</textarea>`);
			_push(ssrRenderComponent(_sfc_main$73, {
				type: "submit",
				size: "copy",
				loading: unref(form).processing,
				"loading-label": "",
				"aria-label": "Отправить ответ"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$74, {
						name: "send",
						size: "sm"
					}, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$74, {
						name: "send",
						size: "sm"
					})];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			if (unref(form).errors.body) _push(`<p id="support-reply-error" role="alert" class="text-interface-body text-error">${ssrInterpolate(unref(form).errors.body)}</p>`);
			else _push(`<!---->`);
			if (unref(form).recentlySuccessful) _push(`<p role="status" class="text-interface-body text-success">Сообщение отправлено</p>`);
			else _push(`<!---->`);
			_push(`</form>`);
		};
	}
};
var _sfc_setup$24 = _sfc_main$24.setup;
_sfc_main$24.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/support/SupportReplyForm.vue");
	return _sfc_setup$24 ? _sfc_setup$24(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/support/SupportConversation.vue
var _sfc_main$23 = {
	__name: "SupportConversation",
	__ssrInlineRender: true,
	props: {
		ticket: {
			type: Object,
			required: true
		},
		messages: {
			type: Object,
			required: true
		},
		submissionId: {
			type: String,
			required: true
		},
		bodyMax: {
			type: Number,
			required: true
		}
	},
	setup(__props) {
		const MESSAGE_CLASSES = {
			customer: "ml-auto bg-support-customer",
			operator: "mr-auto bg-support-operator"
		};
		const AUTHOR_CLASSES = {
			customer: "text-accent-text",
			operator: "text-success"
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><header class="grid min-w-0 grid-cols-1 gap-control"><h1 class="text-interface-title font-display wrap-anywhere">${ssrInterpolate(__props.ticket.subject)}</h1><p class="text-interface-meta text-accent-text">${ssrInterpolate(__props.ticket.statusLabel)} · <time${ssrRenderAttr("datetime", __props.ticket.updatedAt)}>${ssrInterpolate(__props.ticket.updatedLabel)}</time></p></header><ol aria-label="Переписка с поддержкой" class="grid min-w-0 grid-cols-1 gap-support-conversation"><!--[-->`);
			ssrRenderList(__props.messages.data, (message) => {
				_push(`<li class="min-w-0"><article class="${ssrRenderClass([MESSAGE_CLASSES[message.author], "grid w-support-bubble-width min-w-0 grid-cols-1 gap-support-message-gap rounded-card p-support-bubble"])}"><h2 class="${ssrRenderClass([AUTHOR_CLASSES[message.author], "text-interface-body font-semibold"])}">${ssrInterpolate(message.authorLabel)}</h2><p class="whitespace-pre-wrap text-interface-body wrap-anywhere">${ssrInterpolate(message.body)}</p><time${ssrRenderAttr("datetime", message.createdAt)} class="text-interface-meta text-secondary">${ssrInterpolate(message.timeLabel)}</time></article></li>`);
			});
			_push(`<!--]--></ol>`);
			_push(ssrRenderComponent(_sfc_main$27, {
				pagination: __props.messages,
				label: "Страницы переписки"
			}, null, _parent));
			if (__props.ticket.status === "OPEN") _push(ssrRenderComponent(_sfc_main$24, {
				key: __props.ticket.replyUrl,
				"reply-url": __props.ticket.replyUrl,
				"submission-id": __props.submissionId,
				"body-max": __props.bodyMax
			}, null, _parent));
			else {
				_push(`<div role="status" class="grid justify-items-start gap-compact rounded-card border border-border bg-interface-input p-support-ticket"><p class="text-interface-body text-secondary">Обращение закрыто. Если нужна помощь, создай новое.</p>`);
				_push(ssrRenderComponent(unref(Link), {
					href: "/account/support/create",
					class: "min-h-interface-control text-interface-body text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-focus"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Новое обращение`);
						else return [createTextVNode("Новое обращение")];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			}
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$23 = _sfc_main$23.setup;
_sfc_main$23.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/support/SupportConversation.vue");
	return _sfc_setup$23 ? _sfc_setup$23(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Account/Support/Show.vue
var Show_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$22 });
var _sfc_main$22 = {
	__name: "Show",
	__ssrInlineRender: true,
	props: {
		ticket: {
			type: Object,
			default: null
		},
		messages: {
			type: Object,
			required: true
		},
		serviceState: {
			type: String,
			default: "ready"
		},
		submissionId: {
			type: String,
			required: true
		},
		bodyMax: {
			type: Number,
			required: true
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Обращение в поддержку" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$64, {
				"page-title": "Обращение",
				"content-spacing": "supportConversation"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid min-w-0 grid-cols-1 gap-support-conversation"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Link), {
							href: "/account/support",
							class: "inline-flex min-h-10 items-center justify-self-start rounded-control text-interface-body text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Назад к обращениям`);
								else return [createTextVNode("Назад к обращениям")];
							}),
							_: 1
						}, _parent, _scopeId));
						if (!__props.ticket) _push(`<h1 class="text-interface-title font-display"${_scopeId}>Поддержка</h1>`);
						else _push(`<!---->`);
						_push(ssrRenderComponent(_sfc_main$28, { "service-state": __props.serviceState }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									if (__props.ticket) _push(ssrRenderComponent(_sfc_main$23, {
										ticket: __props.ticket,
										messages: __props.messages,
										"submission-id": __props.submissionId,
										"body-max": __props.bodyMax
									}, null, _parent, _scopeId));
									else _push(`<!---->`);
								} else return [__props.ticket ? (openBlock(), createBlock(_sfc_main$23, {
									key: 0,
									ticket: __props.ticket,
									messages: __props.messages,
									"submission-id": __props.submissionId,
									"body-max": __props.bodyMax
								}, null, 8, [
									"ticket",
									"messages",
									"submission-id",
									"body-max"
								])) : createCommentVNode("", true)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "grid min-w-0 grid-cols-1 gap-support-conversation" }, [
						createVNode(unref(Link), {
							href: "/account/support",
							class: "inline-flex min-h-10 items-center justify-self-start rounded-control text-interface-body text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
						}, {
							default: withCtx(() => [createTextVNode("Назад к обращениям")]),
							_: 1
						}),
						!__props.ticket ? (openBlock(), createBlock("h1", {
							key: 0,
							class: "text-interface-title font-display"
						}, "Поддержка")) : createCommentVNode("", true),
						createVNode(_sfc_main$28, { "service-state": __props.serviceState }, {
							default: withCtx(() => [__props.ticket ? (openBlock(), createBlock(_sfc_main$23, {
								key: 0,
								ticket: __props.ticket,
								messages: __props.messages,
								"submission-id": __props.submissionId,
								"body-max": __props.bodyMax
							}, null, 8, [
								"ticket",
								"messages",
								"submission-id",
								"body-max"
							])) : createCommentVNode("", true)]),
							_: 1
						}, 8, ["service-state"])
					])];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$22 = _sfc_main$22.setup;
_sfc_main$22.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Support/Show.vue");
	return _sfc_setup$22 ? _sfc_setup$22(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/shells/AuthShell.vue
var _sfc_main$21 = {
	__name: "AuthShell",
	__ssrInlineRender: true,
	props: {
		title: {
			type: String,
			required: true
		},
		description: {
			type: String,
			default: ""
		},
		variant: {
			type: String,
			default: "login",
			validator: (value) => [
				"login",
				"register",
				"recovery",
				"reset",
				"status"
			].includes(value)
		}
	},
	setup(__props) {
		const props = __props;
		const SPACING = {
			login: "pt-auth-login-top pb-auth-login-bottom",
			register: "pt-auth-register-top pb-auth-register-bottom",
			recovery: "pt-auth-recovery-top pb-auth-login-bottom",
			reset: "pt-auth-reset-top pb-auth-status-bottom",
			status: "pt-auth-status-top pb-auth-status-bottom"
		};
		const spacing = computed(() => SPACING[props.variant]);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-dvh flex-col bg-background text-foreground" }, _attrs))}><header class="${ssrRenderClass([__props.variant === "register" ? "h-auth-register-header" : "h-auth-header", "flex shrink-0 items-center px-shell-gutter"])}">`);
			_push(ssrRenderComponent(_sfc_main$71, { variant: "wordmark" }, null, _parent));
			_push(`</header><main class="${ssrRenderClass([spacing.value, "mx-auto flex w-full flex-1 flex-col px-shell-gutter tablet:max-w-auth-tablet tablet:px-0 desktop:max-w-auth-desktop"])}"><section class="${ssrRenderClass([__props.variant === "register" ? "gap-auth-register-group" : __props.variant === "reset" ? "gap-auth-reset-group" : "gap-auth-group", "my-auto grid min-w-0 grid-cols-1"])}" aria-labelledby="auth-title">`);
			ssrRenderSlot(_ctx.$slots, "status", {}, null, _push, _parent);
			_push(`<header class="${ssrRenderClass([__props.variant === "status" ? "gap-auth-group text-center" : __props.variant === "reset" ? "gap-auth-reset-group" : "gap-control", "grid min-w-0 grid-cols-1"])}"><h1 id="auth-title" class="text-interface-heading font-display tracking-interface-heading break-words">${ssrInterpolate(__props.title)}</h1>`);
			if (__props.description) _push(`<p class="${ssrRenderClass([["status", "reset"].includes(__props.variant) ? "text-interface-body" : "text-interface-intro", "text-secondary"])}">${ssrInterpolate(__props.description)}</p>`);
			else _push(`<!---->`);
			_push(`</header>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			if (_ctx.$slots.footer) {
				_push(`<footer class="text-interface-body text-secondary">`);
				ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push, _parent);
				_push(`</footer>`);
			} else _push(`<!---->`);
			_push(`</section></main></div>`);
		};
	}
};
var _sfc_setup$21 = _sfc_main$21.setup;
_sfc_main$21.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/shells/AuthShell.vue");
	return _sfc_setup$21 ? _sfc_setup$21(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/auth/AuthStatus.vue
var _sfc_main$20 = {
	__name: "AuthStatus",
	__ssrInlineRender: true,
	props: { kind: {
		type: String,
		required: true,
		validator: (value) => ["mail", "password"].includes(value)
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: "mx-auto flex size-auth-status-icon items-center justify-center rounded-auth-status bg-elevated",
				"aria-hidden": "true"
			}, _attrs))}>`);
			_push(ssrRenderComponent(_sfc_main$74, {
				name: __props.kind === "mail" ? "mail" : "shield-check",
				size: "status",
				class: __props.kind === "mail" ? "text-accent-text" : "text-success"
			}, null, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup$20 = _sfc_main$20.setup;
_sfc_main$20.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/auth/AuthStatus.vue");
	return _sfc_setup$20 ? _sfc_setup$20(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Auth/ForgotPassword.vue
var ForgotPassword_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$19 });
var _sfc_main$19 = {
	__name: "ForgotPassword",
	__ssrInlineRender: true,
	props: { linkRequested: {
		type: Boolean,
		default: false
	} },
	setup(__props) {
		const { form, submit: submitAction } = useActionForm({ email: "" });
		function submit() {
			submitAction("post", "/forgot-password");
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Восстановление доступа" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$21, {
				title: __props.linkRequested ? "Проверь почту" : "Восстановим доступ",
				description: __props.linkRequested ? "Запрос принят. Если email связан с аккаунтом, проверь почту и папку «Спам». Если письма нет, попробуй позже или напиши в поддержку." : "Укажи email — отправим ссылку для смены пароля.",
				variant: __props.linkRequested ? "status" : "recovery"
			}, createSlots({
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (!__props.linkRequested) {
							_push(`<form class="grid grid-cols-1 gap-auth-group"${ssrRenderAttr("aria-busy", unref(form).processing)}${_scopeId}>`);
							if (unref(form).errors.form) _push(ssrRenderComponent(_sfc_main$70, {
								variant: "error",
								message: unref(form).errors.form
							}, null, _parent, _scopeId));
							else _push(`<!---->`);
							_push(ssrRenderComponent(_sfc_main$48, {
								id: "email",
								modelValue: unref(form).email,
								"onUpdate:modelValue": ($event) => unref(form).email = $event,
								label: "Email",
								name: "email",
								type: "email",
								autocomplete: "email",
								placeholder: "dude@example.com",
								variant: "auth",
								icon: "mail",
								error: unref(form).errors.email,
								disabled: unref(form).processing,
								required: ""
							}, null, _parent, _scopeId));
							_push(ssrRenderComponent(_sfc_main$73, {
								type: "submit",
								label: "Отправить ссылку",
								"loading-label": "Отправляем…",
								loading: unref(form).processing,
								"full-width": ""
							}, null, _parent, _scopeId));
							_push(`</form>`);
						} else _push(`<!---->`);
						if (__props.linkRequested) _push(ssrRenderComponent(unref(Link), {
							href: "/login",
							class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Вернуться ко входу`);
								else return [createTextVNode("Вернуться ко входу")];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(ssrRenderComponent(unref(Link), {
							href: "/login",
							class: "py-compact text-interface-body font-semibold text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Вернуться ко входу`);
								else return [createTextVNode("Вернуться ко входу")];
							}),
							_: 1
						}, _parent, _scopeId));
						if (__props.linkRequested || unref(form).errors.form) _push(`<a href="https://t.me/hey_dude_web" class="py-compact text-interface-body font-semibold text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-focus"${_scopeId}>Написать в поддержку</a>`);
						else _push(`<!---->`);
					} else return [
						!__props.linkRequested ? (openBlock(), createBlock("form", {
							key: 0,
							class: "grid grid-cols-1 gap-auth-group",
							"aria-busy": unref(form).processing,
							onSubmit: withModifiers(submit, ["prevent"])
						}, [
							unref(form).errors.form ? (openBlock(), createBlock(_sfc_main$70, {
								key: 0,
								variant: "error",
								message: unref(form).errors.form
							}, null, 8, ["message"])) : createCommentVNode("", true),
							createVNode(_sfc_main$48, {
								id: "email",
								modelValue: unref(form).email,
								"onUpdate:modelValue": ($event) => unref(form).email = $event,
								label: "Email",
								name: "email",
								type: "email",
								autocomplete: "email",
								placeholder: "dude@example.com",
								variant: "auth",
								icon: "mail",
								error: unref(form).errors.email,
								disabled: unref(form).processing,
								required: ""
							}, null, 8, [
								"modelValue",
								"onUpdate:modelValue",
								"error",
								"disabled"
							]),
							createVNode(_sfc_main$73, {
								type: "submit",
								label: "Отправить ссылку",
								"loading-label": "Отправляем…",
								loading: unref(form).processing,
								"full-width": ""
							}, null, 8, ["loading"])
						], 40, ["aria-busy"])) : createCommentVNode("", true),
						__props.linkRequested ? (openBlock(), createBlock(unref(Link), {
							key: 1,
							href: "/login",
							class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
						}, {
							default: withCtx(() => [createTextVNode("Вернуться ко входу")]),
							_: 1
						})) : (openBlock(), createBlock(unref(Link), {
							key: 2,
							href: "/login",
							class: "py-compact text-interface-body font-semibold text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-focus"
						}, {
							default: withCtx(() => [createTextVNode("Вернуться ко входу")]),
							_: 1
						})),
						__props.linkRequested || unref(form).errors.form ? (openBlock(), createBlock("a", {
							key: 3,
							href: "https://t.me/hey_dude_web",
							class: "py-compact text-interface-body font-semibold text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-focus"
						}, "Написать в поддержку")) : createCommentVNode("", true)
					];
				}),
				_: 2
			}, [__props.linkRequested ? {
				name: "status",
				fn: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$20, { kind: "mail" }, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$20, { kind: "mail" })];
				}),
				key: "0"
			} : void 0]), _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$19 = _sfc_main$19.setup;
_sfc_main$19.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Auth/ForgotPassword.vue");
	return _sfc_setup$19 ? _sfc_setup$19(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/auth/PasswordField.vue
var _sfc_main$18 = {
	__name: "PasswordField",
	__ssrInlineRender: true,
	props: /*@__PURE__*/ mergeModels({
		id: {
			type: String,
			required: true
		},
		label: {
			type: String,
			default: "Пароль"
		},
		autocomplete: {
			type: String,
			default: "current-password"
		},
		placeholder: {
			type: String,
			default: "Введите пароль"
		},
		error: {
			type: String,
			default: ""
		},
		spacing: {
			type: String,
			default: "field",
			validator: (value) => ["field", "reset"].includes(value)
		},
		disabled: Boolean
	}, {
		"modelValue": {
			type: String,
			default: ""
		},
		"modelModifiers": {}
	}),
	emits: ["update:modelValue"],
	setup(__props) {
		const model = useModel(__props, "modelValue");
		const visible = shallowRef(false);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(_sfc_main$48, mergeProps({
				id: __props.id,
				modelValue: model.value,
				"onUpdate:modelValue": ($event) => model.value = $event,
				name: __props.id,
				label: __props.label,
				autocomplete: __props.autocomplete,
				placeholder: __props.placeholder,
				error: __props.error,
				disabled: __props.disabled,
				type: visible.value ? "text" : "password",
				spacing: __props.spacing,
				variant: "auth",
				icon: "lock",
				required: ""
			}, _attrs), {
				suffix: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<button type="button"${ssrRenderAttr("aria-label", visible.value ? "Скрыть пароль" : "Показать пароль")}${ssrRenderAttr("aria-controls", __props.id)}${ssrRenderAttr("aria-pressed", visible.value)}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""} class="inline-flex size-11 items-center justify-center rounded-control-sm hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-60"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$74, { name: visible.value ? "eyeOff" : "eye" }, null, _parent, _scopeId));
						_push(`</button>`);
					} else return [createVNode("button", {
						type: "button",
						"aria-label": visible.value ? "Скрыть пароль" : "Показать пароль",
						"aria-controls": __props.id,
						"aria-pressed": visible.value,
						disabled: __props.disabled,
						class: "inline-flex size-11 items-center justify-center rounded-control-sm hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-60",
						onClick: ($event) => !__props.disabled && (visible.value = !visible.value)
					}, [createVNode(_sfc_main$74, { name: visible.value ? "eyeOff" : "eye" }, null, 8, ["name"])], 8, [
						"aria-label",
						"aria-controls",
						"aria-pressed",
						"disabled",
						"onClick"
					])];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup$18 = _sfc_main$18.setup;
_sfc_main$18.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/auth/PasswordField.vue");
	return _sfc_setup$18 ? _sfc_setup$18(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Auth/Login.vue
var Login_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$17 });
var _sfc_main$17 = {
	__name: "Login",
	__ssrInlineRender: true,
	props: { passwordChanged: {
		type: Boolean,
		default: false
	} },
	setup(__props) {
		const { form, submit: submitAction } = useActionForm({
			email: "",
			password: ""
		});
		function submit() {
			submitAction("post", "/login", { onFinish: () => form.reset("password") });
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Вход" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$21, {
				title: __props.passwordChanged ? "Пароль изменён" : "С возвращением, Dude.",
				description: __props.passwordChanged ? "Теперь можно войти в аккаунт с новым паролем." : "Войди в аккаунт, чтобы управлять подпиской и подключениями.",
				variant: __props.passwordChanged ? "status" : "login"
			}, createSlots({
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (__props.passwordChanged) _push(ssrRenderComponent(unref(Link), {
							href: "/login",
							class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline text-interface-action font-bold text-accent-foreground hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Войти`);
								else return [createTextVNode("Войти")];
							}),
							_: 1
						}, _parent, _scopeId));
						else {
							_push(`<form class="grid grid-cols-1 gap-auth-group"${ssrRenderAttr("aria-busy", unref(form).processing)}${_scopeId}>`);
							if (unref(form).errors.form) _push(ssrRenderComponent(_sfc_main$70, {
								variant: "error",
								message: unref(form).errors.form
							}, null, _parent, _scopeId));
							else _push(`<!---->`);
							_push(ssrRenderComponent(_sfc_main$48, {
								id: "email",
								modelValue: unref(form).email,
								"onUpdate:modelValue": ($event) => unref(form).email = $event,
								label: "Email",
								name: "email",
								type: "email",
								autocomplete: "email",
								placeholder: "dude@example.com",
								variant: "auth",
								icon: "mail",
								error: unref(form).errors.email,
								disabled: unref(form).processing,
								required: ""
							}, null, _parent, _scopeId));
							_push(ssrRenderComponent(_sfc_main$18, {
								id: "password",
								modelValue: unref(form).password,
								"onUpdate:modelValue": ($event) => unref(form).password = $event,
								error: unref(form).errors.password,
								disabled: unref(form).processing
							}, null, _parent, _scopeId));
							_push(ssrRenderComponent(_sfc_main$73, {
								type: "submit",
								label: "Войти",
								"loading-label": "Входим…",
								loading: unref(form).processing,
								"full-width": ""
							}, null, _parent, _scopeId));
							_push(`<nav class="flex flex-wrap justify-between gap-tight text-interface-body font-normal text-accent-text" aria-label="Доступ к аккаунту"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Link), {
								href: "/forgot-password",
								class: "py-compact hover:underline focus-visible:outline-2 focus-visible:outline-focus"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`Забыли пароль?`);
									else return [createTextVNode("Забыли пароль?")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(ssrRenderComponent(unref(Link), {
								href: "/register",
								class: "py-compact hover:underline focus-visible:outline-2 focus-visible:outline-focus"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`Создать аккаунт`);
									else return [createTextVNode("Создать аккаунт")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</nav></form>`);
						}
					} else return [__props.passwordChanged ? (openBlock(), createBlock(unref(Link), {
						key: 0,
						href: "/login",
						class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline text-interface-action font-bold text-accent-foreground hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-focus"
					}, {
						default: withCtx(() => [createTextVNode("Войти")]),
						_: 1
					})) : (openBlock(), createBlock("form", {
						key: 1,
						class: "grid grid-cols-1 gap-auth-group",
						"aria-busy": unref(form).processing,
						onSubmit: withModifiers(submit, ["prevent"])
					}, [
						unref(form).errors.form ? (openBlock(), createBlock(_sfc_main$70, {
							key: 0,
							variant: "error",
							message: unref(form).errors.form
						}, null, 8, ["message"])) : createCommentVNode("", true),
						createVNode(_sfc_main$48, {
							id: "email",
							modelValue: unref(form).email,
							"onUpdate:modelValue": ($event) => unref(form).email = $event,
							label: "Email",
							name: "email",
							type: "email",
							autocomplete: "email",
							placeholder: "dude@example.com",
							variant: "auth",
							icon: "mail",
							error: unref(form).errors.email,
							disabled: unref(form).processing,
							required: ""
						}, null, 8, [
							"modelValue",
							"onUpdate:modelValue",
							"error",
							"disabled"
						]),
						createVNode(_sfc_main$18, {
							id: "password",
							modelValue: unref(form).password,
							"onUpdate:modelValue": ($event) => unref(form).password = $event,
							error: unref(form).errors.password,
							disabled: unref(form).processing
						}, null, 8, [
							"modelValue",
							"onUpdate:modelValue",
							"error",
							"disabled"
						]),
						createVNode(_sfc_main$73, {
							type: "submit",
							label: "Войти",
							"loading-label": "Входим…",
							loading: unref(form).processing,
							"full-width": ""
						}, null, 8, ["loading"]),
						createVNode("nav", {
							class: "flex flex-wrap justify-between gap-tight text-interface-body font-normal text-accent-text",
							"aria-label": "Доступ к аккаунту"
						}, [createVNode(unref(Link), {
							href: "/forgot-password",
							class: "py-compact hover:underline focus-visible:outline-2 focus-visible:outline-focus"
						}, {
							default: withCtx(() => [createTextVNode("Забыли пароль?")]),
							_: 1
						}), createVNode(unref(Link), {
							href: "/register",
							class: "py-compact hover:underline focus-visible:outline-2 focus-visible:outline-focus"
						}, {
							default: withCtx(() => [createTextVNode("Создать аккаунт")]),
							_: 1
						})])
					], 40, ["aria-busy"]))];
				}),
				_: 2
			}, [__props.passwordChanged ? {
				name: "status",
				fn: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$20, { kind: "password" }, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$20, { kind: "password" })];
				}),
				key: "0"
			} : void 0]), _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$17 = _sfc_main$17.setup;
_sfc_main$17.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Auth/Login.vue");
	return _sfc_setup$17 ? _sfc_setup$17(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Auth/Register.vue
var Register_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$16 });
var _sfc_main$16 = {
	__name: "Register",
	__ssrInlineRender: true,
	setup(__props) {
		const { form, submit: submitAction } = useActionForm({
			email: "",
			password: "",
			password_confirmation: ""
		});
		function submit() {
			submitAction("post", "/register", { onFinish: () => form.reset("password", "password_confirmation") });
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Регистрация" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$21, {
				title: "Привет, Dude!",
				description: "Создай аккаунт и подтверди email, чтобы получить бесплатный доступ.",
				variant: "register"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<form class="grid grid-cols-1 gap-auth-register-group"${ssrRenderAttr("aria-busy", unref(form).processing)}${_scopeId}>`);
						if (unref(form).errors.form) _push(ssrRenderComponent(_sfc_main$70, {
							variant: "error",
							message: unref(form).errors.form
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
						_push(ssrRenderComponent(_sfc_main$48, {
							id: "email",
							modelValue: unref(form).email,
							"onUpdate:modelValue": ($event) => unref(form).email = $event,
							label: "Email",
							name: "email",
							type: "email",
							autocomplete: "email",
							placeholder: "dude@example.com",
							variant: "auth",
							icon: "mail",
							error: unref(form).errors.email,
							disabled: unref(form).processing,
							required: ""
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$18, {
							id: "password",
							modelValue: unref(form).password,
							"onUpdate:modelValue": ($event) => unref(form).password = $event,
							autocomplete: "new-password",
							placeholder: "Не менее 8 символов",
							error: unref(form).errors.password,
							disabled: unref(form).processing
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$18, {
							id: "password_confirmation",
							modelValue: unref(form).password_confirmation,
							"onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
							label: "Повторите пароль",
							autocomplete: "new-password",
							placeholder: "Введите пароль ещё раз",
							error: unref(form).errors.password_confirmation,
							disabled: unref(form).processing
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$73, {
							type: "submit",
							label: "Создать аккаунт",
							"loading-label": "Создаём аккаунт…",
							loading: unref(form).processing,
							"full-width": ""
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(Link), {
							href: "/login",
							class: "py-compact text-interface-body font-normal text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Уже есть аккаунт? Войти`);
								else return [createTextVNode("Уже есть аккаунт? Войти")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</form>`);
					} else return [createVNode("form", {
						class: "grid grid-cols-1 gap-auth-register-group",
						"aria-busy": unref(form).processing,
						onSubmit: withModifiers(submit, ["prevent"])
					}, [
						unref(form).errors.form ? (openBlock(), createBlock(_sfc_main$70, {
							key: 0,
							variant: "error",
							message: unref(form).errors.form
						}, null, 8, ["message"])) : createCommentVNode("", true),
						createVNode(_sfc_main$48, {
							id: "email",
							modelValue: unref(form).email,
							"onUpdate:modelValue": ($event) => unref(form).email = $event,
							label: "Email",
							name: "email",
							type: "email",
							autocomplete: "email",
							placeholder: "dude@example.com",
							variant: "auth",
							icon: "mail",
							error: unref(form).errors.email,
							disabled: unref(form).processing,
							required: ""
						}, null, 8, [
							"modelValue",
							"onUpdate:modelValue",
							"error",
							"disabled"
						]),
						createVNode(_sfc_main$18, {
							id: "password",
							modelValue: unref(form).password,
							"onUpdate:modelValue": ($event) => unref(form).password = $event,
							autocomplete: "new-password",
							placeholder: "Не менее 8 символов",
							error: unref(form).errors.password,
							disabled: unref(form).processing
						}, null, 8, [
							"modelValue",
							"onUpdate:modelValue",
							"error",
							"disabled"
						]),
						createVNode(_sfc_main$18, {
							id: "password_confirmation",
							modelValue: unref(form).password_confirmation,
							"onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
							label: "Повторите пароль",
							autocomplete: "new-password",
							placeholder: "Введите пароль ещё раз",
							error: unref(form).errors.password_confirmation,
							disabled: unref(form).processing
						}, null, 8, [
							"modelValue",
							"onUpdate:modelValue",
							"error",
							"disabled"
						]),
						createVNode(_sfc_main$73, {
							type: "submit",
							label: "Создать аккаунт",
							"loading-label": "Создаём аккаунт…",
							loading: unref(form).processing,
							"full-width": ""
						}, null, 8, ["loading"]),
						createVNode(unref(Link), {
							href: "/login",
							class: "py-compact text-interface-body font-normal text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-focus"
						}, {
							default: withCtx(() => [createTextVNode("Уже есть аккаунт? Войти")]),
							_: 1
						})
					], 40, ["aria-busy"])];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$16 = _sfc_main$16.setup;
_sfc_main$16.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Auth/Register.vue");
	return _sfc_setup$16 ? _sfc_setup$16(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Auth/ResetPassword.vue
var ResetPassword_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$15 });
var _sfc_main$15 = {
	__name: "ResetPassword",
	__ssrInlineRender: true,
	props: {
		token: {
			type: String,
			required: true
		},
		email: {
			type: String,
			default: ""
		}
	},
	setup(__props) {
		const props = __props;
		const { form, submit: submitAction } = useActionForm({
			token: props.token,
			email: props.email,
			password: "",
			password_confirmation: ""
		});
		function submit() {
			submitAction("post", "/reset-password", { onFinish: () => form.reset("password", "password_confirmation") });
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Новый пароль" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$21, {
				title: "Новый пароль",
				description: "Придумай новый пароль — не менее 8 символов.",
				variant: "reset"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<form class="grid grid-cols-1 gap-auth-reset-group"${ssrRenderAttr("aria-busy", unref(form).processing)}${_scopeId}>`);
						if (unref(form).errors.form) _push(ssrRenderComponent(_sfc_main$70, {
							variant: "error",
							message: unref(form).errors.form
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
						if (!props.email) _push(ssrRenderComponent(_sfc_main$48, {
							id: "email",
							modelValue: unref(form).email,
							"onUpdate:modelValue": ($event) => unref(form).email = $event,
							label: "Email",
							name: "email",
							type: "email",
							autocomplete: "email",
							variant: "auth",
							icon: "mail",
							error: unref(form).errors.email,
							disabled: unref(form).processing,
							required: ""
						}, null, _parent, _scopeId));
						else if (unref(form).errors.email) _push(ssrRenderComponent(_sfc_main$70, {
							variant: "error",
							message: unref(form).errors.email
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
						if (unref(form).errors.token) _push(ssrRenderComponent(_sfc_main$70, {
							variant: "error",
							message: unref(form).errors.token
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
						_push(ssrRenderComponent(_sfc_main$18, {
							id: "password",
							modelValue: unref(form).password,
							"onUpdate:modelValue": ($event) => unref(form).password = $event,
							label: "Новый пароль",
							autocomplete: "new-password",
							spacing: "reset",
							error: unref(form).errors.password,
							disabled: unref(form).processing
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$18, {
							id: "password_confirmation",
							modelValue: unref(form).password_confirmation,
							"onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
							label: "Повторите пароль",
							autocomplete: "new-password",
							spacing: "reset",
							error: unref(form).errors.password_confirmation,
							disabled: unref(form).processing
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$73, {
							type: "submit",
							label: "Сохранить пароль",
							"loading-label": "Сохраняем…",
							loading: unref(form).processing,
							"full-width": ""
						}, null, _parent, _scopeId));
						if (unref(form).errors.email || unref(form).errors.token) _push(ssrRenderComponent(unref(Link), {
							href: "/forgot-password",
							class: "py-compact text-interface-body font-semibold text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Запросить новую ссылку`);
								else return [createTextVNode("Запросить новую ссылку")];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
						_push(`</form>`);
					} else return [createVNode("form", {
						class: "grid grid-cols-1 gap-auth-reset-group",
						"aria-busy": unref(form).processing,
						onSubmit: withModifiers(submit, ["prevent"])
					}, [
						unref(form).errors.form ? (openBlock(), createBlock(_sfc_main$70, {
							key: 0,
							variant: "error",
							message: unref(form).errors.form
						}, null, 8, ["message"])) : createCommentVNode("", true),
						!props.email ? (openBlock(), createBlock(_sfc_main$48, {
							key: 1,
							id: "email",
							modelValue: unref(form).email,
							"onUpdate:modelValue": ($event) => unref(form).email = $event,
							label: "Email",
							name: "email",
							type: "email",
							autocomplete: "email",
							variant: "auth",
							icon: "mail",
							error: unref(form).errors.email,
							disabled: unref(form).processing,
							required: ""
						}, null, 8, [
							"modelValue",
							"onUpdate:modelValue",
							"error",
							"disabled"
						])) : unref(form).errors.email ? (openBlock(), createBlock(_sfc_main$70, {
							key: 2,
							variant: "error",
							message: unref(form).errors.email
						}, null, 8, ["message"])) : createCommentVNode("", true),
						unref(form).errors.token ? (openBlock(), createBlock(_sfc_main$70, {
							key: 3,
							variant: "error",
							message: unref(form).errors.token
						}, null, 8, ["message"])) : createCommentVNode("", true),
						createVNode(_sfc_main$18, {
							id: "password",
							modelValue: unref(form).password,
							"onUpdate:modelValue": ($event) => unref(form).password = $event,
							label: "Новый пароль",
							autocomplete: "new-password",
							spacing: "reset",
							error: unref(form).errors.password,
							disabled: unref(form).processing
						}, null, 8, [
							"modelValue",
							"onUpdate:modelValue",
							"error",
							"disabled"
						]),
						createVNode(_sfc_main$18, {
							id: "password_confirmation",
							modelValue: unref(form).password_confirmation,
							"onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
							label: "Повторите пароль",
							autocomplete: "new-password",
							spacing: "reset",
							error: unref(form).errors.password_confirmation,
							disabled: unref(form).processing
						}, null, 8, [
							"modelValue",
							"onUpdate:modelValue",
							"error",
							"disabled"
						]),
						createVNode(_sfc_main$73, {
							type: "submit",
							label: "Сохранить пароль",
							"loading-label": "Сохраняем…",
							loading: unref(form).processing,
							"full-width": ""
						}, null, 8, ["loading"]),
						unref(form).errors.email || unref(form).errors.token ? (openBlock(), createBlock(unref(Link), {
							key: 4,
							href: "/forgot-password",
							class: "py-compact text-interface-body font-semibold text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-focus"
						}, {
							default: withCtx(() => [createTextVNode("Запросить новую ссылку")]),
							_: 1
						})) : createCommentVNode("", true)
					], 40, ["aria-busy"])];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$15 = _sfc_main$15.setup;
_sfc_main$15.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Auth/ResetPassword.vue");
	return _sfc_setup$15 ? _sfc_setup$15(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Auth/VerifyEmail.vue
var VerifyEmail_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$14 });
var _sfc_main$14 = {
	__name: "VerifyEmail",
	__ssrInlineRender: true,
	props: {
		email: {
			type: String,
			required: true
		},
		existingAccount: Boolean,
		status: {
			type: String,
			default: null
		},
		errors: {
			type: Object,
			default: () => ({})
		}
	},
	setup(__props) {
		const props = __props;
		const { form: resend, submit: submitResend } = useActionForm({});
		const { form: logout, submit: submitLogout } = useActionForm({});
		const busy = computed(() => resend.processing || logout.processing);
		const description = computed(() => props.existingAccount ? "Подтверди новый адрес, чтобы продолжить пользоваться личным кабинетом. Если письма нет, проверь папку «Спам» или отправь его ещё раз." : "Открой ссылку в письме, чтобы получить бесплатный доступ к dudeweb. Если письма нет, проверь папку «Спам» или отправь его ещё раз.");
		function sendVerification() {
			if (!busy.value) submitResend("post", "/email/verification-notification");
		}
		function leave() {
			if (!busy.value) submitLogout("delete", "/logout");
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Подтверждение email" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$21, {
				title: "Подтверди email",
				description: description.value,
				variant: "status"
			}, {
				status: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$20, { kind: "mail" }, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$20, { kind: "mail" })];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<p class="text-center text-interface-body text-foreground wrap-anywhere"${_scopeId}>${ssrInterpolate(__props.email)}</p>`);
						if (unref(resend).errors.form || unref(logout).errors.form || __props.errors.form) _push(ssrRenderComponent(_sfc_main$70, {
							variant: "error",
							message: unref(resend).errors.form || unref(logout).errors.form || __props.errors.form
						}, null, _parent, _scopeId));
						else if (__props.status === "verification-link-sent") _push(ssrRenderComponent(_sfc_main$70, {
							variant: "success",
							message: "Письмо отправлено. Проверь почту."
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
						_push(`<form class="grid grid-cols-1 gap-auth-group"${ssrRenderAttr("aria-busy", unref(resend).processing)}${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$73, {
							type: "submit",
							label: "Отправить письмо ещё раз",
							"loading-label": "Отправляем…",
							loading: unref(resend).processing,
							disabled: busy.value,
							"full-width": ""
						}, null, _parent, _scopeId));
						_push(`</form>`);
						_push(ssrRenderComponent(_sfc_main$73, {
							variant: "secondary",
							label: "Выйти",
							"loading-label": "Выходим…",
							loading: unref(logout).processing,
							disabled: busy.value,
							"full-width": "",
							onClick: leave
						}, null, _parent, _scopeId));
						_push(`<a href="https://t.me/hey_dude_web" class="py-compact text-interface-body font-semibold text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-focus"${_scopeId}>Написать в поддержку</a>`);
					} else return [
						createVNode("p", { class: "text-center text-interface-body text-foreground wrap-anywhere" }, toDisplayString(__props.email), 1),
						unref(resend).errors.form || unref(logout).errors.form || __props.errors.form ? (openBlock(), createBlock(_sfc_main$70, {
							key: 0,
							variant: "error",
							message: unref(resend).errors.form || unref(logout).errors.form || __props.errors.form
						}, null, 8, ["message"])) : __props.status === "verification-link-sent" ? (openBlock(), createBlock(_sfc_main$70, {
							key: 1,
							variant: "success",
							message: "Письмо отправлено. Проверь почту."
						})) : createCommentVNode("", true),
						createVNode("form", {
							class: "grid grid-cols-1 gap-auth-group",
							"aria-busy": unref(resend).processing,
							onSubmit: withModifiers(sendVerification, ["prevent"])
						}, [createVNode(_sfc_main$73, {
							type: "submit",
							label: "Отправить письмо ещё раз",
							"loading-label": "Отправляем…",
							loading: unref(resend).processing,
							disabled: busy.value,
							"full-width": ""
						}, null, 8, ["loading", "disabled"])], 40, ["aria-busy"]),
						createVNode(_sfc_main$73, {
							variant: "secondary",
							label: "Выйти",
							"loading-label": "Выходим…",
							loading: unref(logout).processing,
							disabled: busy.value,
							"full-width": "",
							onClick: leave
						}, null, 8, ["loading", "disabled"]),
						createVNode("a", {
							href: "https://t.me/hey_dude_web",
							class: "py-compact text-interface-body font-semibold text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-focus"
						}, "Написать в поддержку")
					];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$14 = _sfc_main$14.setup;
_sfc_main$14.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Auth/VerifyEmail.vue");
	return _sfc_setup$14 ? _sfc_setup$14(props, ctx) : void 0;
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
var _sfc_main$13 = {
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
var _sfc_setup$13 = _sfc_main$13.setup;
_sfc_main$13.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/hero/ServiceLogoCloud.vue");
	return _sfc_setup$13 ? _sfc_setup$13(props, ctx) : void 0;
};
var ServiceLogoCloud_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$13, [["__scopeId", "data-v-34a8f2bf"]]);
//#endregion
//#region resources/js/components/public/hero/ServiceCloudHero.vue
var PRIMARY_ACTION_CLASSES$1 = "inline-flex min-h-13 items-center justify-center rounded-button border border-accent-hover bg-accent px-panel text-hero-action-mobile font-normal text-accent-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-14 tablet:px-0 tablet:text-hero-action-tablet desktop:min-h-hero-action-wide desktop:px-panel desktop:text-hero-action-wide";
var SECONDARY_ACTION_CLASSES$1 = "inline-flex min-h-13 items-center justify-center rounded-button border border-hero-secondary-border bg-hero-secondary px-panel text-hero-action-mobile font-normal text-hero-secondary-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-14 tablet:px-0 tablet:text-hero-action-tablet desktop:min-h-hero-action-wide desktop:px-panel desktop:text-hero-action-wide";
var _sfc_main$12 = {
	__name: "ServiceCloudHero",
	__ssrInlineRender: true,
	emits: ["unavailable"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				class: "service-hero relative min-h-hero-mobile overflow-hidden bg-background tablet:min-h-hero-tablet desktop:h-hero-wide desktop:min-h-0",
				"aria-labelledby": "hero-title"
			}, _attrs))} data-v-450dbe99><div class="service-hero__layout" data-v-450dbe99>`);
			_push(ssrRenderComponent(ServiceLogoCloud_default, {
				class: "service-hero__cloud",
				onUnavailable: ($event) => emit("unavailable")
			}, null, _parent));
			_push(`<div class="service-hero__content" data-v-450dbe99><p class="service-hero__eyebrow font-mono font-bold text-hero-eyebrow" data-v-450dbe99> HEY, DUDE! </p><h1 id="hero-title" class="service-hero__heading font-display break-words text-foreground" data-v-450dbe99> Любимые сервисы<br data-v-450dbe99> снова рядом </h1><p class="service-hero__description text-hero-copy" data-v-450dbe99> dudeweb помогает пользоваться любимыми сервисами для работы, развлечений и общения — просто и без лишних сложностей. </p><div class="service-hero__actions" data-v-450dbe99>`);
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
			_push(`<a href="#pricing" class="${ssrRenderClass(SECONDARY_ACTION_CLASSES$1)}" data-v-450dbe99> Посмотреть тариф </a></div><p class="service-hero__trial font-mono text-hero-meta" data-v-450dbe99> 3 дня бесплатно · До 5 устройств </p></div></div></section>`);
		};
	}
};
var _sfc_setup$12 = _sfc_main$12.setup;
_sfc_main$12.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/hero/ServiceCloudHero.vue");
	return _sfc_setup$12 ? _sfc_setup$12(props, ctx) : void 0;
};
var ServiceCloudHero_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$12, [["__scopeId", "data-v-450dbe99"]]);
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
var PRIMARY_ACTION_CLASSES = "inline-flex min-h-13 items-center justify-center rounded-button border border-accent-hover bg-accent px-panel text-hero-action-mobile font-normal text-accent-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-14 tablet:px-0 tablet:text-hero-action-tablet desktop:min-h-hero-action-wide desktop:px-panel desktop:text-hero-action-wide";
var SECONDARY_ACTION_CLASSES = "inline-flex min-h-13 items-center justify-center rounded-button border border-hero-secondary-border bg-hero-secondary px-panel text-hero-action-mobile font-normal text-hero-secondary-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-14 tablet:px-0 tablet:text-hero-action-tablet desktop:min-h-hero-action-wide desktop:px-panel desktop:text-hero-action-wide";
var _sfc_main$11 = {
	__name: "SignalOrbitHero",
	__ssrInlineRender: true,
	setup(__props) {
		const { signalPath, onPointerMove, resetPointer } = useSignalOrbitPointer(useTemplateRef("hero"), useTemplateRef("signal"));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				ref: "hero",
				class: "landing-hero",
				"aria-labelledby": "hero-title"
			}, _attrs))} data-v-0102d944><div class="landing-hero__layout" data-v-0102d944><svg aria-hidden="true" class="landing-hero__signal" viewBox="0 0 300 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" data-v-0102d944><defs data-v-0102d944><linearGradient id="hero-signal-top" x1="0" y1="0" x2="1" y2="0" data-v-0102d944><stop offset="0" stop-color="var(--ui-hero-blob-1)" data-v-0102d944></stop><stop offset="1" stop-color="var(--ui-hero-blob-2)" data-v-0102d944></stop></linearGradient><linearGradient id="hero-signal-bottom" x1="0" y1="0" x2="1" y2="0" data-v-0102d944><stop offset="0" stop-color="var(--ui-hero-blob-3)" data-v-0102d944></stop><stop offset="1" stop-color="var(--ui-hero-blob-4)" data-v-0102d944></stop></linearGradient><linearGradient id="hero-signal-blend" x1="0" y1="0" x2="0" y2="1" data-v-0102d944><stop offset="0" stop-color="white" stop-opacity="0" data-v-0102d944></stop><stop offset="1" stop-color="white" data-v-0102d944></stop></linearGradient><mask id="hero-signal-bottom-mask" maskContentUnits="objectBoundingBox" data-v-0102d944><rect width="1" height="1" fill="url(#hero-signal-blend)" data-v-0102d944></rect></mask></defs><path class="landing-hero__signal-path"${ssrRenderAttr("d", unref(signalPath))} fill="url(#hero-signal-top)" data-v-0102d944></path><path class="landing-hero__signal-path"${ssrRenderAttr("d", unref(signalPath))} fill="url(#hero-signal-bottom)" mask="url(#hero-signal-bottom-mask)" data-v-0102d944></path></svg><div class="landing-hero__content" data-v-0102d944><p class="landing-hero__eyebrow font-mono font-bold text-hero-eyebrow" data-v-0102d944> HEY, DUDE! </p><h1 id="hero-title" class="landing-hero__heading font-display break-words text-foreground" data-v-0102d944> Любимые сервисы<br data-v-0102d944> снова рядом </h1><p class="landing-hero__description text-hero-copy" data-v-0102d944> dudeweb помогает пользоваться любимыми сервисами для работы, развлечений и общения — просто и без лишних сложностей. </p><div class="landing-hero__actions" data-v-0102d944>`);
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
			_push(`<a href="#pricing" class="${ssrRenderClass(SECONDARY_ACTION_CLASSES)}" data-v-0102d944> Посмотреть тариф </a></div><p class="landing-hero__trial font-mono text-hero-meta" data-v-0102d944> 3 дня бесплатно · До 5 устройств </p></div></div></section>`);
		};
	}
};
var _sfc_setup$11 = _sfc_main$11.setup;
_sfc_main$11.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/hero/SignalOrbitHero.vue");
	return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
var SignalOrbitHero_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$11, [["__scopeId", "data-v-0102d944"]]);
//#endregion
//#region resources/js/components/public/LandingHero.vue
var _sfc_main$10 = {
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
var _sfc_setup$10 = _sfc_main$10.setup;
_sfc_main$10.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingHero.vue");
	return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/public/LandingAdvantages.vue
var _sfc_main$9 = {
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
				_push(`<article class="flex min-h-landing-feature flex-col items-start gap-landing-card-gap rounded-landing-card ring-1 ring-landing-card-border ring-inset bg-landing-card p-landing-card"><span class="inline-flex size-landing-feature-tile shrink-0 items-center justify-center rounded-landing-tile ring-1 ring-landing-tile-border ring-inset bg-landing-tile text-accent-text">`);
				_push(ssrRenderComponent(_sfc_main$74, {
					name: feature.icon,
					size: "feature"
				}, null, _parent));
				_push(`</span><h3 class="text-landing-feature-title font-normal wrap-anywhere">${ssrInterpolate(feature.title)}</h3><p class="text-landing-feature-copy wrap-anywhere text-footer-secondary">${ssrInterpolate(feature.copy)}</p></article>`);
			});
			_push(`<!--]--></div></div></section>`);
		};
	}
};
var _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingAdvantages.vue");
	return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/public/LandingPlatforms.vue
var _sfc_main$8 = {
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
				_push(ssrRenderComponent(_sfc_main$74, {
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
var _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingPlatforms.vue");
	return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/public/LandingPricing.vue
var _sfc_main$7 = {
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
			}, _attrs))} data-v-c048f8e3><div class="landing-pricing mx-auto grid min-h-pricing-height w-full max-w-landing gap-pricing-grid-gap px-pricing-gutter pt-pricing-top pb-pricing-bottom desktop:items-center" data-v-c048f8e3><div class="flex min-w-0 flex-col items-start gap-pricing-story-gap" data-v-c048f8e3><p class="font-mono text-landing-eyebrow font-bold tracking-pricing-eyebrow text-accent-text" data-v-c048f8e3>ОДИН ТАРИФ. ВСЁ ПРОСТО.</p><span class="h-pricing-rule-height w-pricing-rule rounded-pricing-rule bg-accent" aria-hidden="true" data-v-c048f8e3></span><h2 id="pricing-title" class="max-w-full text-pricing-heading font-bold tracking-pricing-heading break-words" data-v-c048f8e3>${ssrInterpolate(plan.value?.name ?? "Безлимитный")}.</h2><p class="text-pricing-copy text-footer-secondary" data-v-c048f8e3>Никаких сложных тарифов. Просто выбирай удобный период и пользуйся любимыми сервисами.</p></div><div class="h-px bg-landing-platform-border desktop:h-full desktop:w-px" aria-hidden="true" data-v-c048f8e3></div><div class="flex min-w-0 flex-col gap-pricing-stack" data-v-c048f8e3>`);
			if (__props.state === "ready" && selectedProduct.value) {
				_push(`<!--[--><div class="flex flex-col items-start gap-tight tablet:flex-row tablet:flex-wrap tablet:items-end tablet:justify-between" data-v-c048f8e3><p class="text-pricing-prompt" data-v-c048f8e3>Выбери период</p><p class="max-w-full font-mono text-pricing-price font-semibold tracking-pricing-price break-words" aria-live="polite" aria-atomic="true" data-v-c048f8e3>${ssrInterpolate(periodPrice.value)} / ${ssrInterpolate(selectedProduct.value.months)} мес.</p></div><fieldset class="min-w-0" data-v-c048f8e3><legend class="sr-only" data-v-c048f8e3>Период подписки</legend><div class="grid min-h-pricing-selector grid-cols-4 gap-1 rounded-button bg-background p-pricing-selector-inset ring-1 ring-border ring-inset" data-v-c048f8e3><!--[-->`);
				ssrRenderList(plan.value.products, (product) => {
					_push(`<label class="${ssrRenderClass([selectedProduct.value.id === product.id ? "border border-accent bg-landing-tile font-bold text-foreground" : "border border-transparent font-medium text-footer-muted hover:text-foreground", "relative flex min-h-0 cursor-pointer items-center justify-center rounded-control-sm py-compact text-center font-mono text-pricing-period wrap-anywhere transition-colors duration-200 motion-reduce:transition-none focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus"])}" data-v-c048f8e3><input${ssrIncludeBooleanAttr(selectedProduct.value.id === product.id) ? " checked" : ""}${ssrRenderAttr("value", product.id)} type="radio" name="landing-period" class="sr-only" data-v-c048f8e3> ${ssrInterpolate(product.months)} мес. </label>`);
				});
				_push(`<!--]--></div></fieldset><p class="text-pricing-benefits-label text-footer-muted" data-v-c048f8e3>В тариф входит</p><ul class="grid gap-x-pricing-benefits-column gap-y-pricing-benefits-row tablet:grid-cols-2" data-v-c048f8e3><!--[-->`);
				ssrRenderList(plan.value.advantages, (advantage) => {
					_push(`<li class="flex items-start gap-tight text-pricing-benefit" data-v-c048f8e3><span class="inline-flex size-pricing-check shrink-0 items-center justify-center rounded-control-sm border border-landing-tile-border bg-landing-tile text-accent-text" data-v-c048f8e3>`);
					_push(ssrRenderComponent(_sfc_main$74, {
						name: "check",
						size: "md"
					}, null, _parent));
					_push(`</span><span class="self-center" data-v-c048f8e3>${ssrInterpolate(advantage)}</span></li>`);
				});
				_push(`<!--]--></ul><div class="flex w-full flex-col items-center gap-2.5 tablet:max-w-pricing-action-width" data-v-c048f8e3>`);
				_push(ssrRenderComponent(unref(Link), {
					href: "/register",
					class: "inline-flex min-h-pricing-action w-full items-center justify-center rounded-landing-action ring-1 ring-accent-hover ring-inset bg-accent px-content py-compact text-center text-landing-action font-bold text-accent-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Выбрать подписку`);
						else return [createTextVNode("Выбрать подписку")];
					}),
					_: 1
				}, _parent));
				_push(`<p class="text-center text-pricing-trial text-footer-muted" data-v-c048f8e3>3 дня бесплатно для новых пользователей</p></div><!--]-->`);
			} else _push(`<div role="status" class="flex flex-col items-start gap-content" data-v-c048f8e3><p class="text-ui-title" data-v-c048f8e3>${ssrInterpolate(__props.state === "unavailable" ? "Не удалось загрузить тариф" : "Тариф временно недоступен")}</p><p class="text-ui-copy text-footer-secondary" data-v-c048f8e3>Попробуй зайти позже или напиши нам — поможем разобраться.</p><a href="https://t.me/hey_dude_web" class="inline-flex min-h-12 items-center rounded-button border border-accent px-panel text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus" data-v-c048f8e3>Написать в поддержку</a></div>`);
			_push(`</div></div></section>`);
		};
	}
};
var _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingPricing.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var LandingPricing_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$7, [["__scopeId", "data-v-c048f8e3"]]);
//#endregion
//#region resources/js/components/public/LandingFinalMark.vue
var MARK = "M167.36626 44.31375l-24.77251 30.54375 21.1275 0c9.45001 0 17.11127 7.32375 17.11127 17.38125 0 13.22999-11.67752 23.0175-23.42252 23.0175-17.24624 0-32.16374-14.14124-43.2675-24.26624l28.75501-27.23626 0-22.84875c-23.4225 22.44375-52.88625 49.95-68.985 63.31499-5.77125 4.72501-12.38626 7.39125-18.63001 7.39125-12.92625 0-23.52375-10.5975-23.52375-23.32124 0-15.35626 11.475-25.75125 24.30001-25.75125 6.68249 0 13.46625 2.86875 18.22499 7.66126l13.095 13.46624 22.68001-20.8575 0-47.82375c0-8.67375-6.21001-14.985-15.42375-14.985l-17.82001 0 0 32.4675c-5.43375-1.755-11.07001-2.7675-17.44874-2.7675-32.1975 0-59.36626 26.62875-59.36626 59.4675 0 31.05001 24.97501 53.18998 52.1775 53.18998 11.98125 0 24.3-4.89373 33.51375-12.52124l12.48751-10.69874c14.20874 12.99376 33.88501 28.65376 58.55624 28.65376 31.55626 0 56.7-25.54876 56.7-56.025 0-26.66251-20.95874-47.28376-46.06874-47.45251z";
var ACCENT = "M16.97624 19.27126l-14.71501-0.00001c-1.34999 0-2.26123-0.945-2.26123-2.39625l0-14.41125c0-1.45124 0.97874-2.46375 2.26123-2.46375l14.71501 0c1.2825 0 2.32874 0.945 2.32874 2.26125l0 14.61375c0 1.45126-0.94499 2.39626-2.32874 2.39625z";
var _sfc_main$6 = {
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
var _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingFinalMark.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var LandingFinalMark_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$6, [["__scopeId", "data-v-c2759be7"]]);
//#endregion
//#region resources/js/components/public/LandingFinalCta.vue
var _sfc_main$5 = {
	__name: "LandingFinalCta",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				class: "mx-auto w-full max-w-landing px-landing-gutter py-final-section",
				"aria-labelledby": "final-title"
			}, _attrs))} data-v-4e417ae2><div class="landing-final__panel relative min-h-final-panel overflow-hidden rounded-final-panel ring-1 ring-landing-final-border ring-inset bg-linear-to-r from-landing-final-start to-landing-final-end px-final-padding-x py-final-padding-y" data-v-4e417ae2><div class="relative z-1 flex min-w-0 flex-col items-start gap-final-copy-gap" data-v-4e417ae2><p class="font-mono text-landing-eyebrow font-bold tracking-final-eyebrow text-accent-text" data-v-4e417ae2>ПОПРОБУЙ DUDEWEB</p><h2 id="final-title" class="max-w-full text-final-heading font-bold tracking-final-heading break-words" data-v-4e417ae2>Ну что, погнали?</h2><p class="text-final-copy text-footer-secondary" data-v-4e417ae2>Твои любимые сервисы уже ждут. Подключайся и начинай прямо сейчас.</p>`);
			_push(ssrRenderComponent(unref(Link), {
				href: "/register",
				class: "inline-flex min-h-final-action w-full items-center justify-center rounded-landing-action ring-1 ring-accent-hover ring-inset bg-accent px-tight py-compact text-center text-landing-action font-bold text-accent-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:max-w-final-action-width"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Получить 3 дня бесплатно `);
					else return [createTextVNode(" Получить 3 дня бесплатно ")];
				}),
				_: 1
			}, _parent));
			_push(`<p class="text-final-note text-footer-muted" data-v-4e417ae2>Начни с пробного доступа, а подписку оформишь позже.</p></div><div class="landing-final__visual pointer-events-none absolute top-2.5 right-2 h-final-visual-height w-final-visual-width opacity-35 tablet:static tablet:w-full tablet:max-w-final-visual-width tablet:opacity-100" aria-hidden="true" data-v-4e417ae2>`);
			_push(ssrRenderComponent(LandingFinalMark_default, null, null, _parent));
			_push(`</div></div></section>`);
		};
	}
};
var _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingFinalCta.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var LandingFinalCta_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$5, [["__scopeId", "data-v-4e417ae2"]]);
//#endregion
//#region resources/js/components/public/PublicFooter.vue
var LINK_CLASSES = "w-fit rounded-control-sm text-footer-link text-footer-secondary transition-colors duration-200 motion-reduce:transition-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:text-footer-link-tablet desktop:text-footer-link-wide";
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
			_push(ssrRenderComponent(_sfc_main$71, {
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
		const mounted = shallowRef(false);
		onMounted(() => {
			mounted.value = true;
		});
		useOverlay({
			open: () => props.open,
			panel,
			close: () => emit("close"),
			background: () => [...document.querySelectorAll("[data-public-menu-background]")],
			additionalControls: () => [...document.querySelectorAll("[data-public-menu-control]")]
		});
		function handleNavigation() {
			emit("navigate");
		}
		return (_ctx, _push, _parent, _attrs) => {
			if (mounted.value) ssrRenderTeleport(_push, (_push) => {
				if (__props.open) {
					_push(`<div class="fixed inset-x-0 top-public-header bottom-0 z-30 bg-background/80 px-tight pt-tight backdrop-blur-sm tablet:top-public-header-tablet tablet:flex tablet:items-start tablet:justify-end tablet:px-section-sm desktop:hidden"><nav id="public-mobile-menu" aria-labelledby="public-menu-title" aria-describedby="public-menu-description" tabindex="-1" aria-modal="true" class="mx-auto flex max-h-[calc(100dvh-var(--spacing-public-header)-var(--spacing-panel))] w-full max-w-none flex-col gap-control overflow-y-auto rounded-panel border border-border bg-surface p-tight tablet:mx-0 tablet:max-h-[calc(100dvh-var(--spacing-public-header-tablet)-var(--spacing-panel))] tablet:max-w-public-menu" role="dialog"><h2 id="public-menu-title" class="sr-only">Мобильная навигация</h2><p id="public-menu-description" class="sr-only">Разделы сайта, вход и создание аккаунта. Escape закрывает меню.</p><!--[-->`);
					ssrRenderList(__props.items, (item) => {
						_push(`<a${ssrRenderAttr("href", item.href)} class="flex min-h-public-menu-item items-center justify-between rounded-menu-item border border-transparent bg-elevated px-control-inline text-public-menu font-normal text-foreground transition-colors duration-200 motion-reduce:transition-none hover:border-border hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-public-menu-item-tablet"><span>${ssrInterpolate(item.label)}</span>`);
						_push(ssrRenderComponent(_sfc_main$74, {
							class: "text-accent-text",
							name: "arrowUpRight",
							size: "sm"
						}, null, _parent));
						_push(`</a>`);
					});
					_push(`<!--]-->`);
					_push(ssrRenderComponent(unref(Link), {
						href: __props.loginHref,
						class: "flex min-h-public-menu-item items-center justify-between rounded-menu-item border border-transparent bg-elevated px-control-inline text-public-menu font-normal text-foreground transition-colors duration-200 motion-reduce:transition-none hover:border-border hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-public-menu-item-tablet",
						onClick: handleNavigation
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<span${_scopeId}>Войти</span>`);
								_push(ssrRenderComponent(_sfc_main$74, {
									class: "text-accent-text",
									name: "arrowUpRight",
									size: "sm"
								}, null, _parent, _scopeId));
							} else return [createVNode("span", null, "Войти"), createVNode(_sfc_main$74, {
								class: "text-accent-text",
								name: "arrowUpRight",
								size: "sm"
							})];
						}),
						_: 1
					}, _parent));
					_push(ssrRenderComponent(unref(Link), {
						href: __props.registerHref,
						class: "inline-flex min-h-13 items-center justify-center rounded-control border border-accent-hover bg-accent px-panel text-hero-action-mobile font-normal text-accent-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
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
			else _push(`<!---->`);
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
		let desktopQuery;
		const { setTheme, theme } = useTheme();
		const themeAction = computed(() => THEME_ACTIONS[theme.value] ?? THEME_ACTIONS.light);
		function closeMenu() {
			if (!isMenuOpen.value) return;
			isMenuOpen.value = false;
		}
		function closeOnDesktop() {
			if (desktopQuery.matches) closeMenu();
		}
		onMounted(() => {
			desktopQuery = window.matchMedia("(min-width: 75rem)");
			desktopQuery.addEventListener("change", closeOnDesktop);
		});
		onBeforeUnmount(() => desktopQuery?.removeEventListener("change", closeOnDesktop));
		watch(isMenuOpen, (value) => emit("menu-state-change", value));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<header${ssrRenderAttrs(mergeProps({ class: "sticky top-0 z-40 h-public-header border-b border-border bg-background/95 backdrop-blur-md tablet:h-public-header-tablet desktop:h-public-header-wide" }, _attrs))}><div class="mx-auto flex h-full max-w-shell items-center px-shell-gutter tablet:px-section-sm desktop:grid desktop:grid-cols-[auto_minmax(0,1fr)_auto] desktop:px-shell-wide"><div data-public-menu-background class="tablet:hidden">`);
			_push(ssrRenderComponent(_sfc_main$71, {
				scale: "public",
				variant: "icon"
			}, null, _parent));
			_push(`</div><div data-public-menu-background class="hidden tablet:block desktop:justify-self-start">`);
			_push(ssrRenderComponent(_sfc_main$71, {
				scale: "public",
				variant: "horizontal"
			}, null, _parent));
			_push(`</div><nav aria-label="Основная навигация" class="hidden items-center gap-10 desktop:flex desktop:gap-public-nav-wide desktop:justify-self-center"><!--[-->`);
			ssrRenderList(__props.navigationItems, (item) => {
				_push(`<a${ssrRenderAttr("href", item.href)} class="rounded-control-sm text-public-nav-desktop font-semibold text-secondary transition-colors duration-200 motion-reduce:transition-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus desktop:text-public-nav-wide">${ssrInterpolate(item.label)}</a>`);
			});
			_push(`<!--]--></nav><div class="ml-auto flex items-center gap-compact tablet:gap-2.5 desktop:ml-0 desktop:gap-public-controls-wide desktop:justify-self-end"><button${ssrRenderAttr("aria-label", themeAction.value.label)} class="inline-flex size-11 items-center justify-center rounded-menu-item border border-border bg-elevated text-secondary transition-colors duration-200 motion-reduce:transition-none hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:size-14 tablet:rounded-card desktop:size-public-control-wide" data-public-menu-control type="button">`);
			_push(ssrRenderComponent(_sfc_main$74, {
				name: themeAction.value.icon,
				size: "sm"
			}, null, _parent));
			_push(`</button>`);
			_push(ssrRenderComponent(unref(Link), {
				href: __props.loginHref,
				class: "inline-flex min-h-11 items-center justify-center rounded-control border border-border bg-elevated px-control-inline text-ui-body font-semibold text-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:min-h-14 tablet:rounded-card tablet:px-5 tablet:text-public-control-tablet desktop:min-h-public-control-height-wide desktop:rounded-public-control desktop:px-public-login-inline-wide desktop:text-public-control-wide",
				"data-public-menu-control": "",
				onClick: closeMenu
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Войти `);
					else return [createTextVNode(" Войти ")];
				}),
				_: 1
			}, _parent));
			_push(`<button${ssrRenderAttr("aria-expanded", isMenuOpen.value)}${ssrRenderAttr("aria-label", isMenuOpen.value ? "Закрыть меню" : "Открыть меню")} aria-controls="public-mobile-menu" class="inline-flex size-11 items-center justify-center rounded-control border border-accent-hover bg-accent text-accent-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus tablet:size-14 tablet:rounded-card desktop:hidden" data-public-menu-control type="button">`);
			_push(ssrRenderComponent(_sfc_main$74, { name: isMenuOpen.value ? "x" : "menu" }, null, _parent));
			_push(`</button>`);
			_push(ssrRenderComponent(unref(Link), {
				href: __props.registerHref,
				class: "hidden min-h-public-control-height-wide items-center justify-center rounded-public-control border border-accent-hover bg-accent px-public-cta-inline-wide text-public-control-wide font-bold text-accent-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus desktop:inline-flex"
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
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200 motion-reduce:transition-none" }, _attrs))}><a href="#main-content" data-public-menu-background class="fixed top-0 -translate-y-full left-compact z-50 rounded-control bg-accent px-content py-tight font-semibold text-accent-foreground transition-transform duration-200 motion-reduce:transition-none focus:top-compact focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"> К основному содержимому </a>`);
			_push(ssrRenderComponent(_sfc_main$2, {
				"login-href": LOGIN_HREF,
				"navigation-items": NAVIGATION_ITEMS,
				"register-href": REGISTER_HREF
			}, null, _parent));
			_push(`<main id="main-content" data-public-menu-background class="flex-1" tabindex="-1">`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</main>`);
			_push(ssrRenderComponent(_sfc_main$4, {
				"data-public-menu-background": "",
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
			_push(ssrRenderComponent(_sfc_main$10, null, null, _parent));
			_push(ssrRenderComponent(_sfc_main$9, { "device-limit": __props.plans[0]?.deviceLimit ?? null }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$8, null, null, _parent));
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
var pages = /* #__PURE__ */ Object.assign({
	"./pages/Account/Connection.vue": Connection_exports,
	"./pages/Account/Dashboard.vue": Dashboard_exports,
	"./pages/Account/Payments/Show.vue": Show_exports$1,
	"./pages/Account/Profile.vue": Profile_exports,
	"./pages/Account/Referral/Index.vue": Index_exports$1,
	"./pages/Account/Referral/Terms.vue": Terms_exports,
	"./pages/Account/Subscription.vue": Subscription_exports,
	"./pages/Account/Support/Create.vue": Create_exports,
	"./pages/Account/Support/Index.vue": Index_exports,
	"./pages/Account/Support/Show.vue": Show_exports,
	"./pages/Auth/ForgotPassword.vue": ForgotPassword_exports,
	"./pages/Auth/Login.vue": Login_exports,
	"./pages/Auth/Register.vue": Register_exports,
	"./pages/Auth/ResetPassword.vue": ResetPassword_exports,
	"./pages/Auth/VerifyEmail.vue": VerifyEmail_exports,
	"./pages/Public/Home.vue": Home_exports
});
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