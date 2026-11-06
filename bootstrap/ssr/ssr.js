import { Fragment, computed, createBlock, createCommentVNode, createSSRApp, createSlots, createTextVNode, createVNode, h, inject, isRef, mergeModels, mergeProps, nextTick, onBeforeUnmount, onMounted, openBlock, provide, readonly, ref, renderList, renderSlot, resolveDynamicComponent, shallowRef, toDisplayString, toValue, unref, useId, useModel, useSSRContext, useSlots, useTemplateRef, watch, withCtx, withModifiers } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseEqual, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderDynamicModel, ssrRenderList, ssrRenderSlot, ssrRenderStyle, ssrRenderTeleport, ssrRenderVNode } from "vue/server-renderer";
import { Head, Link, createInertiaApp, router, useForm, useHttp, usePage } from "@inertiajs/vue3";
import { useDocumentVisibility, useElementBounding, useElementVisibility, useEventListener, useMediaQuery, useMutationObserver, usePreferredReducedMotion, useRafFn, useResizeObserver, useTimeoutFn, useWindowSize } from "@vueuse/core";
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
var _sfc_main$102 = {
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
var _sfc_setup$102 = _sfc_main$102.setup;
_sfc_main$102.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/brand/BrandLogo.vue");
	return _sfc_setup$102 ? _sfc_setup$102(props, ctx) : void 0;
};
//#endregion
//#region resources/js/utils/landingIconPaths.js
var LANDING_ICONS = {
	"message-circle": [{
		"tag": "path",
		"attrs": { "d": "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" }
	}],
	"file-text": [
		{
			"tag": "path",
			"attrs": { "d": "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }
		},
		{
			"tag": "path",
			"attrs": { "d": "M14 2v4a2 2 0 0 0 2 2h4" }
		},
		{
			"tag": "path",
			"attrs": { "d": "M10 9H8" }
		},
		{
			"tag": "path",
			"attrs": { "d": "M16 13H8" }
		},
		{
			"tag": "path",
			"attrs": { "d": "M16 17H8" }
		}
	],
	"users": [
		{
			"tag": "path",
			"attrs": { "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }
		},
		{
			"tag": "circle",
			"attrs": {
				"cx": "9",
				"cy": "7",
				"r": "4"
			}
		},
		{
			"tag": "path",
			"attrs": { "d": "M22 21v-2a4 4 0 0 0-3-3.87" }
		},
		{
			"tag": "path",
			"attrs": { "d": "M16 3.13a4 4 0 0 1 0 7.75" }
		}
	],
	"ticket-percent": [
		{
			"tag": "path",
			"attrs": { "d": "M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" }
		},
		{
			"tag": "path",
			"attrs": { "d": "M9 9h.01" }
		},
		{
			"tag": "path",
			"attrs": { "d": "m15 9-6 6" }
		},
		{
			"tag": "path",
			"attrs": { "d": "M15 15h.01" }
		}
	],
	"receipt": [
		{
			"tag": "path",
			"attrs": { "d": "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" }
		},
		{
			"tag": "path",
			"attrs": { "d": "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" }
		},
		{
			"tag": "path",
			"attrs": { "d": "M12 17.5v-11" }
		}
	],
	"log-out": [
		{
			"tag": "path",
			"attrs": { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }
		},
		{
			"tag": "polyline",
			"attrs": { "points": "16 17 21 12 16 7" }
		},
		{
			"tag": "line",
			"attrs": {
				"x1": "21",
				"x2": "9",
				"y1": "12",
				"y2": "12"
			}
		}
	],
	"mail-check": [
		{
			tag: "path",
			attrs: { d: "M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" }
		},
		{
			tag: "path",
			attrs: { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }
		},
		{
			tag: "path",
			attrs: { d: "m16 19 2 2 4-4" }
		}
	],
	"clock-3": [{
		tag: "circle",
		attrs: {
			cx: "12",
			cy: "12",
			r: "10"
		}
	}, {
		tag: "polyline",
		attrs: { points: "12 6 12 12 16.5 12" }
	}],
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
var _sfc_main$101 = {
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
				"refreshCw",
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
				"supportChevron",
				"detail",
				"accountHeader",
				"profileAction",
				"referralShare",
				"sidebar",
				"accountMeta",
				"copy",
				"badge",
				"authVisibility",
				"authResetVisibility",
				"publicTheme",
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
			refreshCw: [{
				tag: "path",
				attrs: { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5" }
			}],
			logOut: LANDING_ICONS["log-out"],
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
			messageCircle: LANDING_ICONS["message-circle"],
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
			accountHeader: "size-account-header-icon",
			detail: "size-interface-detail-icon",
			supportChevron: "size-support-chevron",
			profileAction: "size-profile-action-icon",
			referralShare: "size-referral-share-icon",
			sidebar: "size-account-sidebar-icon",
			accountMeta: "size-account-meta-icon",
			copy: "size-interface-copy-icon",
			badge: "size-interface-badge-icon",
			authVisibility: "size-auth-visibility-icon",
			authResetVisibility: "size-auth-reset-visibility-icon",
			publicTheme: "size-public-theme-icon",
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
var _sfc_setup$101 = _sfc_main$101.setup;
_sfc_main$101.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/UiIcon.vue");
	return _sfc_setup$101 ? _sfc_setup$101(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/ui/BaseButton.vue
var BASE_CLASSES = "inline-flex cursor-pointer items-center justify-center border font-sans transition-colors duration-200 motion-reduce:transition-none outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60";
var _sfc_main$100 = {
	__name: "BaseButton",
	__ssrInlineRender: true,
	props: {
		disabled: Boolean,
		fullWidth: Boolean,
		href: {
			type: String,
			default: null
		},
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
				"overlayClose",
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
				"accountLogout",
				"overlayClose",
				"accountChrome",
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
			accountLogout: "border-account-logout-border bg-transparent text-error hover:bg-error-soft",
			overlayClose: "border-transparent bg-account-overlay-close text-foreground hover:bg-surface",
			accountChrome: "border-account-chrome-border bg-account-chrome text-secondary hover:bg-surface hover:text-foreground",
			accent: "border-border bg-elevated text-accent-text hover:bg-surface",
			danger: "border-error/40 bg-transparent text-error hover:bg-error-soft",
			ghost: "border-transparent bg-transparent text-secondary hover:bg-surface hover:text-foreground",
			primary: "border-accent-border bg-accent text-accent-foreground hover:border-accent-border-hover hover:bg-accent-hover",
			secondary: "border-border bg-elevated text-foreground hover:bg-surface"
		};
		const SIZE_CLASSES = {
			overlayClose: "h-account-overlay-close-height w-account-overlay-close-width shrink-0 p-0",
			icon: "size-interface-header-control shrink-0 p-0",
			copy: "size-interface-copy shrink-0 rounded-interface-copy p-0",
			md: "min-h-interface-control px-interface-inline py-tight text-interface-action font-bold",
			sm: "min-h-10 px-content py-compact text-ui-detail font-semibold"
		};
		const props = __props;
		const emit = __emit;
		const buttonClass = computed(() => [
			BASE_CLASSES,
			props.variant === "accountLogout" ? "gap-tight" : "gap-compact",
			["accountChrome", "overlayClose"].includes(props.variant) ? "rounded-control" : props.size === "copy" ? "" : "rounded-button",
			VARIANT_CLASSES[props.variant] ?? VARIANT_CLASSES.primary,
			SIZE_CLASSES[props.size] ?? SIZE_CLASSES.md,
			props.fullWidth ? "w-full" : "",
			props.href && (props.disabled || props.loading) ? "pointer-events-none cursor-not-allowed opacity-60" : ""
		]);
		function handleClick(event) {
			if (props.disabled || props.loading) {
				event.preventDefault();
				return;
			}
			emit("click", event);
		}
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.href ? "a" : "button"), mergeProps({
				"aria-busy": __props.loading,
				"aria-disabled": __props.href && (__props.disabled || __props.loading) ? true : void 0,
				class: buttonClass.value,
				disabled: __props.href ? void 0 : __props.disabled || __props.loading,
				href: __props.disabled || __props.loading ? void 0 : __props.href,
				tabindex: __props.href && (__props.disabled || __props.loading) ? -1 : void 0,
				type: __props.href ? void 0 : __props.type,
				onClick: handleClick
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (__props.loading) _push(ssrRenderComponent(_sfc_main$101, {
							name: "loader",
							size: "sm"
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
						if (__props.loading) _push(`<span${_scopeId}>${ssrInterpolate(__props.loadingLabel)}</span>`);
						else if (_ctx.$slots.default) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
						else _push(`<span${_scopeId}>${ssrInterpolate(__props.label)}</span>`);
					} else return [__props.loading ? (openBlock(), createBlock(_sfc_main$101, {
						key: 0,
						name: "loader",
						size: "sm"
					})) : createCommentVNode("", true), __props.loading ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(__props.loadingLabel), 1)) : _ctx.$slots.default ? renderSlot(_ctx.$slots, "default", {}, void 0, void 0, 2) : (openBlock(), createBlock("span", { key: 3 }, toDisplayString(__props.label), 1))];
				}),
				_: 3
			}), _parent);
		};
	}
};
var _sfc_setup$100 = _sfc_main$100.setup;
_sfc_main$100.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/BaseButton.vue");
	return _sfc_setup$100 ? _sfc_setup$100(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/account/AccountTopHeader.vue
var _sfc_main$99 = {
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
			_push(ssrRenderComponent(_sfc_main$102, {
				variant: "wordmark",
				class: "desktop:hidden"
			}, null, _parent));
			_push(`<span aria-hidden="true" class="h-5 w-px bg-border desktop:hidden"></span><span class="min-w-0 flex-1 text-interface-title font-display wrap-anywhere text-secondary desktop:text-foreground">${ssrInterpolate(__props.pageTitle)}</span></div><div class="flex shrink-0 items-center gap-compact">`);
			_push(ssrRenderComponent(_sfc_main$100, {
				"aria-label": themeLabel.value,
				size: "icon",
				variant: "accountChrome",
				onClick: ($event) => emit("change-theme")
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$101, {
						name: themeIcon.value,
						size: "accountHeader"
					}, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$101, {
						name: themeIcon.value,
						size: "accountHeader"
					}, null, 8, ["name"])];
				}),
				_: 1
			}, _parent));
			if (__props.profileHref) _push(ssrRenderComponent(unref(Link), {
				href: __props.profileHref,
				"aria-label": "Открыть профиль",
				class: "inline-flex size-interface-header-control items-center justify-center rounded-control border border-account-chrome-border bg-account-chrome text-secondary transition-colors duration-200 motion-reduce:transition-none hover:bg-surface hover:text-foreground outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$101, {
						name: "user",
						size: "accountHeader"
					}, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$101, {
						name: "user",
						size: "accountHeader"
					})];
				}),
				_: 1
			}, _parent));
			else _push(ssrRenderComponent(_sfc_main$100, {
				"aria-label": "Профиль",
				size: "icon",
				variant: "accountChrome",
				disabled: ""
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$101, {
						name: "user",
						size: "accountHeader"
					}, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$101, {
						name: "user",
						size: "accountHeader"
					})];
				}),
				_: 1
			}, _parent));
			_push(`</div></header>`);
		};
	}
};
var _sfc_setup$99 = _sfc_main$99.setup;
_sfc_main$99.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/account/AccountTopHeader.vue");
	return _sfc_setup$99 ? _sfc_setup$99(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/brand/BrandLink.vue
var _sfc_main$98 = {
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
				class: "inline-flex rounded-control-sm outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$102, {
						scale: __props.scale,
						variant: __props.variant
					}, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$102, {
						scale: __props.scale,
						variant: __props.variant
					}, null, 8, ["scale", "variant"])];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup$98 = _sfc_main$98.setup;
_sfc_main$98.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/brand/BrandLink.vue");
	return _sfc_setup$98 ? _sfc_setup$98(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/ui/InlineAlert.vue
var _sfc_main$97 = {
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
			_push(ssrRenderComponent(_sfc_main$101, {
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
var _sfc_setup$97 = _sfc_main$97.setup;
_sfc_main$97.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/InlineAlert.vue");
	return _sfc_setup$97 ? _sfc_setup$97(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/account/AccountNavLink.vue
var _sfc_main$96 = {
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
			bottom: "min-h-14 flex-1 flex-col justify-center gap-account-nav-gap py-control text-interface-bottom-nav font-medium",
			sheet: "min-h-account-sheet-row justify-start gap-tight bg-account-sheet-item px-control-inline text-interface-body font-medium"
		};
		const classes = computed(() => [
			"flex min-w-0 items-center text-left transition-colors duration-200 motion-reduce:transition-none outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus disabled:cursor-not-allowed disabled:opacity-60",
			props.variant === "sheet" ? "rounded-button" : "rounded-control",
			VARIANTS[props.variant],
			props.active ? "bg-accent-soft font-semibold text-accent-text" : props.variant === "sheet" ? "text-foreground" : props.variant === "bottom" ? "text-muted" : "text-secondary",
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
						_push(ssrRenderComponent(_sfc_main$101, {
							name: __props.item.icon,
							size: __props.variant === "sidebar" ? "sidebar" : "md",
							class: __props.variant === "sheet" ? "text-accent-text" : !__props.active ? "text-muted" : ""
						}, null, _parent, _scopeId));
						_push(`<span class="min-w-0 wrap-anywhere"${_scopeId}>${ssrInterpolate(__props.item.label)}</span>`);
						if (__props.variant === "sheet") _push(ssrRenderComponent(_sfc_main$101, {
							name: "chevronRight",
							size: "detail",
							class: "ml-auto shrink-0 text-muted"
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
					} else return [
						createVNode(_sfc_main$101, {
							name: __props.item.icon,
							size: __props.variant === "sidebar" ? "sidebar" : "md",
							class: __props.variant === "sheet" ? "text-accent-text" : !__props.active ? "text-muted" : ""
						}, null, 8, [
							"name",
							"size",
							"class"
						]),
						createVNode("span", { class: "min-w-0 wrap-anywhere" }, toDisplayString(__props.item.label), 1),
						__props.variant === "sheet" ? (openBlock(), createBlock(_sfc_main$101, {
							key: 0,
							name: "chevronRight",
							size: "detail",
							class: "ml-auto shrink-0 text-muted"
						})) : createCommentVNode("", true)
					];
				}),
				_: 1
			}), _parent);
		};
	}
};
var _sfc_setup$96 = _sfc_main$96.setup;
_sfc_main$96.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/account/AccountNavLink.vue");
	return _sfc_setup$96 ? _sfc_setup$96(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/account/AccountSidebar.vue
var _sfc_main$95 = {
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
			return ["flex min-h-account-sidebar-item items-center gap-tight rounded-control px-control-inline text-interface-navigation transition-colors duration-200 motion-reduce:transition-none outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus", props.activeKey === key ? ITEM_CLASSES.active : ITEM_CLASSES.default];
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<aside${ssrRenderAttrs(mergeProps({ class: "flex h-full w-account-sidebar flex-col justify-between gap-section-sm overflow-y-auto border-r border-border bg-account-sidebar px-sidebar-gutter py-account-sidebar-top" }, _attrs))}><div class="grid shrink-0 gap-section-sm">`);
			_push(ssrRenderComponent(_sfc_main$98, { scale: "account" }, null, _parent));
			_push(`<nav aria-label="Разделы личного кабинета" class="grid gap-control"><!--[-->`);
			ssrRenderList(__props.items, (item) => {
				_push(ssrRenderComponent(_sfc_main$96, {
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
						_push(ssrRenderComponent(_sfc_main$101, {
							name: "user",
							size: "accountMeta",
							class: __props.activeKey === "profile" ? "" : "text-muted"
						}, null, _parent, _scopeId));
						_push(` Профиль `);
					} else return [createVNode(_sfc_main$101, {
						name: "user",
						size: "accountMeta",
						class: __props.activeKey === "profile" ? "" : "text-muted"
					}, null, 8, ["class"]), createTextVNode(" Профиль ")];
				}),
				_: 1
			}, _parent));
			else {
				_push(`<button class="${ssrRenderClass([itemClass("profile"), "cursor-not-allowed opacity-60"])}" type="button" disabled>`);
				_push(ssrRenderComponent(_sfc_main$101, {
					name: "user",
					size: "accountMeta",
					class: __props.activeKey === "profile" ? "" : "text-muted"
				}, null, _parent));
				_push(` Профиль </button>`);
			}
			if (__props.logoutError) _push(ssrRenderComponent(_sfc_main$97, {
				variant: "error",
				message: __props.logoutError
			}, null, _parent));
			else _push(`<!---->`);
			_push(`<button${ssrRenderAttr("aria-busy", __props.logoutLoading)} class="flex min-h-account-sidebar-item cursor-pointer items-center gap-tight rounded-control px-control-inline text-interface-navigation font-semibold text-error transition-colors duration-200 motion-reduce:transition-none hover:bg-error-soft outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60"${ssrIncludeBooleanAttr(__props.logoutLoading) ? " disabled" : ""} type="button">`);
			_push(ssrRenderComponent(_sfc_main$101, {
				name: __props.logoutLoading ? "loader" : "logOut",
				size: "accountMeta"
			}, null, _parent));
			_push(` ${ssrInterpolate(__props.logoutLoading ? "Выходим" : "Выйти")}</button></div></aside>`);
		};
	}
};
var _sfc_setup$95 = _sfc_main$95.setup;
_sfc_main$95.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/account/AccountSidebar.vue");
	return _sfc_setup$95 ? _sfc_setup$95(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/account/AccountBottomNavigation.vue
var _sfc_main$94 = {
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
			return ["flex min-h-14 min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-account-nav-gap rounded-button py-control text-interface-bottom-nav transition-colors duration-200 motion-reduce:transition-none outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus", props.activeKey === item.key ? ITEM_CLASSES.active : ITEM_CLASSES.default];
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<nav${ssrRenderAttrs(mergeProps({
				"aria-label": "Навигация личного кабинета",
				class: "flex min-h-account-bottom-nav items-start gap-control border-t border-border bg-surface px-control-inline pt-compact pb-account-nav-bottom"
			}, _attrs))}><!--[-->`);
			ssrRenderList(__props.items, (item) => {
				_push(`<!--[-->`);
				if (item.href) _push(ssrRenderComponent(_sfc_main$96, {
					item,
					active: __props.activeKey === item.key,
					variant: "bottom",
					onNavigate: ($event) => emit("navigate", $event)
				}, null, _parent));
				else {
					_push(`<button${ssrRenderAttr("aria-expanded", __props.moreOpen)} aria-controls="account-more" aria-haspopup="dialog" class="${ssrRenderClass(itemClass(item))}" type="button">`);
					_push(ssrRenderComponent(_sfc_main$101, {
						name: item.icon,
						size: "md"
					}, null, _parent));
					_push(`<span class="wrap-anywhere">${ssrInterpolate(item.label)}</span></button>`);
				}
				_push(`<!--]-->`);
			});
			_push(`<!--]--></nav>`);
		};
	}
};
var _sfc_setup$94 = _sfc_main$94.setup;
_sfc_main$94.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/account/AccountBottomNavigation.vue");
	return _sfc_setup$94 ? _sfc_setup$94(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/account/MoreNavigationSheet.vue
var _sfc_main$93 = {
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
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "grid w-full gap-account-sheet-content-gap rounded-t-sheet border-t border-account-overlay-border bg-elevated px-shell-gutter pt-account-sheet-top pb-account-sheet-bottom" }, _attrs))}><div aria-hidden="true" class="flex h-account-sheet-handle items-center justify-center"><span class="h-1 w-10 rounded-full bg-account-sheet-handle"></span></div><header class="flex min-h-account-sheet-header items-center justify-between"><h2 id="account-more-title" class="text-interface-title font-display text-foreground">Ещё</h2>`);
			_push(ssrRenderComponent(_sfc_main$100, {
				"aria-label": "Закрыть меню",
				size: "overlayClose",
				variant: "overlayClose",
				disabled: __props.logoutLoading,
				onClick: ($event) => emit("close")
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$101, { name: "x" }, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$101, { name: "x" })];
				}),
				_: 1
			}, _parent));
			_push(`</header><p id="account-more-description" class="sr-only">Дополнительные разделы и выход из аккаунта.</p><nav aria-label="Дополнительные разделы" class="grid gap-account-sheet-menu-gap"><!--[-->`);
			ssrRenderList(__props.items, (item) => {
				_push(ssrRenderComponent(_sfc_main$96, {
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
			if (__props.logoutError) _push(ssrRenderComponent(_sfc_main$97, {
				variant: "error",
				message: __props.logoutError
			}, null, _parent));
			else _push(`<!---->`);
			_push(`<button${ssrRenderAttr("aria-busy", __props.logoutLoading)} class="flex min-h-account-sheet-row cursor-pointer items-center gap-tight rounded-button border border-account-logout-border px-control-inline text-interface-body font-semibold text-error transition-colors duration-200 motion-reduce:transition-none hover:bg-error-soft outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60"${ssrIncludeBooleanAttr(__props.logoutLoading) ? " disabled" : ""} type="button">`);
			_push(ssrRenderComponent(_sfc_main$101, { name: __props.logoutLoading ? "loader" : "logOut" }, null, _parent));
			_push(` ${ssrInterpolate(__props.logoutLoading ? "Выходим" : "Выйти")}</button></section>`);
		};
	}
};
var _sfc_setup$93 = _sfc_main$93.setup;
_sfc_main$93.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/account/MoreNavigationSheet.vue");
	return _sfc_setup$93 ? _sfc_setup$93(props, ctx) : void 0;
};
//#endregion
//#region resources/js/composables/useOverlay.js
var FOCUSABLE = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])";
function useOverlay({ open, panel, busy, close, initialFocus = null, background = () => [document.getElementById("app")], additionalControls = () => [] }) {
	let restore = null;
	function focusable() {
		return [...additionalControls(), ...panel.value?.querySelectorAll(FOCUSABLE) ?? []].filter((element) => !element.matches(":disabled") && element.tabIndex >= 0 && !element.closest("[inert]") && element.getClientRects().length > 0 && window.getComputedStyle(element).visibility !== "hidden");
	}
	function focusFirst() {
		const controls = focusable();
		const preferred = toValue(initialFocus);
		(controls.includes(preferred) ? preferred : controls.find((element) => panel.value?.contains(element)) ?? panel.value)?.focus();
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
	const doc = typeof document === "undefined" ? void 0 : document;
	const stopKeydown = useEventListener(doc, "keydown", keydown, true);
	const stopFocusin = useEventListener(doc, "focusin", focusin);
	onBeforeUnmount(() => {
		stopKeydown();
		stopFocusin();
		restore?.();
	});
}
//#endregion
//#region resources/js/composables/useSwipeDismiss.js
var DISTANCE = 64;
var DIRECTION_RATIO = 1.25;
var EDITABLE$1 = "input, textarea, select, [contenteditable]:not([contenteditable=\"false\"])";
function useSwipeDismiss({ panel, open, busy = false, close }) {
	let gesture = null;
	function reset() {
		gesture = null;
	}
	function available() {
		return toValue(open) && !toValue(busy) && window.matchMedia("(width < 75rem)").matches;
	}
	function scrolled(target) {
		for (let element = target; element; element = element.parentElement) {
			if (element.scrollTop > 0 && element.scrollHeight > element.clientHeight) return true;
			if (element === panel.value) break;
		}
		return false;
	}
	function start(event) {
		reset();
		const target = event.target;
		if (!available() || event.touches.length !== 1 || target.closest(EDITABLE$1) || scrolled(target)) return;
		const touch = event.touches[0];
		gesture = {
			id: touch.identifier,
			x: touch.clientX,
			y: touch.clientY
		};
	}
	function move(event) {
		if (!gesture) return;
		if (!available() || event.touches.length !== 1) return reset();
		const touch = [...event.touches].find((touch) => touch.identifier === gesture.id);
		if (!touch) return reset();
		const dx = Math.abs(touch.clientX - gesture.x);
		const dy = touch.clientY - gesture.y;
		if (dy < -8 || dx > 8 && dx > Math.abs(dy)) return reset();
		if (dy > 0 && dy > dx * DIRECTION_RATIO && event.cancelable) event.preventDefault();
	}
	function end(event) {
		const previous = gesture;
		reset();
		if (!previous || !available() || event.touches.length) return;
		const touch = [...event.changedTouches].find((touch) => touch.identifier === previous.id);
		if (!touch) return;
		const dx = Math.abs(touch.clientX - previous.x);
		const dy = touch.clientY - previous.y;
		if (dy < DISTANCE || dy <= dx * DIRECTION_RATIO) return;
		if (event.cancelable) event.preventDefault();
		close();
	}
	watch([() => toValue(open), () => toValue(busy)], reset);
	watch(panel, (element, previous, onCleanup) => {
		reset();
		if (!element) return;
		element.addEventListener("touchstart", start, { passive: true });
		element.addEventListener("touchmove", move, { passive: false });
		element.addEventListener("touchend", end, { passive: false });
		element.addEventListener("touchcancel", reset, { passive: true });
		onCleanup(() => {
			element.removeEventListener("touchstart", start);
			element.removeEventListener("touchmove", move);
			element.removeEventListener("touchend", end);
			element.removeEventListener("touchcancel", reset);
			reset();
		});
	}, { flush: "post" });
}
//#endregion
//#region resources/js/components/ui/BaseOverlay.vue
var _sfc_main$92 = {
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
		},
		initialFocus: {
			type: String,
			default: ""
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
			close,
			initialFocus: () => props.initialFocus ? panel.value?.querySelector(props.initialFocus) : null
		});
		useSwipeDismiss({
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
var _sfc_setup$92 = _sfc_main$92.setup;
_sfc_main$92.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/BaseOverlay.vue");
	return _sfc_setup$92 ? _sfc_setup$92(props, ctx) : void 0;
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
var _sfc_main$91 = {
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
		const desktop = useMediaQuery("(min-width: 75rem)");
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
		function leave() {
			if (!logout.processing) submitLogout("delete", "/logout", { onSuccess: () => {
				moreOpen.value = false;
			} });
		}
		watch(() => page.url, closeMore);
		watch(desktop, (matches) => {
			if (matches) closeMore();
		});
		useResizeObserver([header, bottom], measureChrome);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				id: "account-shell",
				style: headerHeight.value ? {
					"--account-header-height": `${headerHeight.value}px`,
					"--account-bottom-nav-height": `${navHeight.value}px`
				} : void 0,
				class: "min-h-dvh bg-background text-foreground desktop:pl-account-sidebar"
			}, _attrs))}><a href="#account-content" class="fixed top-0 left-compact z-50 -translate-y-full rounded-control bg-accent px-content py-tight font-semibold text-accent-foreground focus:top-compact focus:translate-y-0 outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus">К основному содержимому</a><div class="fixed inset-y-0 left-0 hidden desktop:block">`);
			_push(ssrRenderComponent(_sfc_main$95, {
				"active-key": activeKey.value,
				items: unref(sidebarItems),
				"profile-href": "/account/profile",
				"logout-loading": unref(logout).processing,
				"logout-error": unref(logout).errors.form,
				onLogout: leave
			}, null, _parent));
			_push(`</div>`);
			_push(ssrRenderComponent(_sfc_main$99, {
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
			_push(ssrRenderComponent(_sfc_main$94, {
				"active-key": moreOpen.value ? "more" : bottomActiveKey.value,
				items: bottomItems,
				"more-open": moreOpen.value,
				onSelectAction: openMore
			}, null, _parent));
			_push(`</div>`);
			_push(ssrRenderComponent(_sfc_main$92, {
				id: "account-more",
				open: moreOpen.value,
				busy: unref(logout).processing,
				"top-offset": headerHeight.value,
				"labelled-by": "account-more-title",
				"described-by": "account-more-description",
				onClose: closeMore
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$93, {
						items: unref(moreItems),
						"active-key": activeKey.value,
						"logout-loading": unref(logout).processing,
						"logout-error": unref(logout).errors.form,
						onClose: closeMore,
						onNavigate: closeMore,
						onLogout: leave
					}, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$93, {
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
var _sfc_setup$91 = _sfc_main$91.setup;
_sfc_main$91.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layouts/AccountLayout.vue");
	return _sfc_setup$91 ? _sfc_setup$91(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/ui/PageHeading.vue
var _sfc_main$90 = {
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
		},
		variant: {
			type: String,
			default: "default",
			validator: (value) => ["default", "compact"].includes(value)
		}
	},
	setup(__props) {
		const TITLE_CLASSES = {
			default: "text-interface-heading tracking-interface-heading",
			compact: "text-interface-title"
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "grid min-w-0 grid-cols-1 gap-control" }, _attrs))}><div class="flex min-w-0 items-start justify-between gap-content tablet:items-end"><h1 class="${ssrRenderClass([TITLE_CLASSES[__props.variant], "min-w-0 flex-1 font-display break-words text-foreground"])}">${ssrInterpolate(__props.title)}</h1>`);
			if (_ctx.$slots.actions) {
				_push(`<div class="flex shrink-0 items-center gap-compact">`);
				ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
			ssrRenderSlot(_ctx.$slots, "description", {}, () => {
				if (__props.description) _push(`<p class="text-interface-intro text-secondary">${ssrInterpolate(__props.description)}</p>`);
				else _push(`<!---->`);
			}, _push, _parent);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$90 = _sfc_main$90.setup;
_sfc_main$90.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/PageHeading.vue");
	return _sfc_setup$90 ? _sfc_setup$90(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/ui/PageRefreshButton.vue
var _sfc_main$89 = {
	__name: "PageRefreshButton",
	__ssrInlineRender: true,
	props: {
		disabled: Boolean,
		loading: Boolean
	},
	emits: ["click"],
	setup(__props, { emit: __emit }) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<button${ssrRenderAttrs(mergeProps({
				type: "button",
				"aria-label": "Обновить данные",
				"aria-busy": __props.loading,
				disabled: __props.disabled || __props.loading,
				title: __props.loading ? "Обновляем данные…" : "Обновить данные",
				class: "inline-flex h-interface-header-control w-interface-header-control shrink-0 cursor-pointer items-center justify-center gap-compact rounded-control border border-accent-border bg-accent-soft font-sans text-interface-body font-semibold text-accent-text transition-colors duration-200 hover:border-accent-border-hover hover:bg-surface outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none tablet:w-auto tablet:px-content"
			}, _attrs))}>`);
			_push(ssrRenderComponent(_sfc_main$101, { name: __props.loading ? "loader" : "refreshCw" }, null, _parent));
			_push(`<span class="hidden tablet:inline">${ssrInterpolate(__props.loading ? "Обновляем данные…" : "Обновить данные")}</span></button>`);
		};
	}
};
var _sfc_setup$89 = _sfc_main$89.setup;
_sfc_main$89.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/PageRefreshButton.vue");
	return _sfc_setup$89 ? _sfc_setup$89(props, ctx) : void 0;
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
var _sfc_main$88 = {
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
		variant: {
			type: String,
			default: "subscription",
			validator: (value) => ["subscription", "referral"].includes(value)
		}
	},
	emits: ["copy-error", "copied"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const ROW_CLASSES = {
			subscription: "gap-interface-copy-gap rounded-button border-interface-field-border bg-interface-copy",
			referral: "gap-compact rounded-control border-interface-field-border bg-interface-input"
		};
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "grid min-w-0 grid-cols-1 gap-compact" }, _attrs))}><div class="${ssrRenderClass([ROW_CLASSES[__props.variant], "flex min-h-interface-copy-row min-w-0 items-center border pr-compact pl-interface-inline"])}"><input${ssrRenderAttr("value", __props.value)}${ssrRenderAttr("aria-label", __props.variant === "referral" ? "Ссылка приглашения" : "Ссылка подключения")} readonly spellcheck="false" class="min-h-interface-control min-w-0 flex-1 bg-transparent font-mono text-interface-body text-secondary outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus">`);
			_push(ssrRenderComponent(_sfc_main$100, {
				"aria-label": unref(status) === "copied" ? "Ссылка скопирована" : __props.copyLabel,
				disabled: !__props.value || unref(busy),
				loading: unref(busy),
				"loading-label": "",
				size: "copy",
				onClick: copyValue
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$101, {
						name: unref(status) === "copied" ? "check" : "copy",
						size: "copy"
					}, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$101, {
						name: unref(status) === "copied" ? "check" : "copy",
						size: "copy"
					}, null, 8, ["name"])];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			if (unref(feedback)) _push(`<p role="status" class="${ssrRenderClass([unref(status) === "error" ? "text-error" : "text-success", "text-interface-body"])}">${ssrInterpolate(unref(feedback))}</p>`);
			else _push(`<!---->`);
			if (unref(manual)) _push(`<div class="grid min-w-0 gap-interface-field-gap"><label${ssrRenderAttr("for", unref(manualId))} class="text-interface-body text-secondary">Ссылка для ручного копирования</label><input${ssrRenderAttr("id", unref(manualId))}${ssrRenderAttr("value", __props.value)} readonly class="min-h-interface-control min-w-0 w-full rounded-button border border-interface-field-border bg-interface-input px-interface-inline font-mono text-interface-body outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"></div>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$88 = _sfc_main$88.setup;
_sfc_main$88.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/CopyableLink.vue");
	return _sfc_setup$88 ? _sfc_setup$88(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/ui/StatePanel.vue
var _sfc_main$87 = {
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
			_push(ssrRenderComponent(_sfc_main$101, { name: config.value.icon }, null, _parent));
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
var _sfc_setup$87 = _sfc_main$87.setup;
_sfc_main$87.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/StatePanel.vue");
	return _sfc_setup$87 ? _sfc_setup$87(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/connection/PlatformSelector.vue
var _sfc_main$86 = {
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
			_push(`<fieldset${ssrRenderAttrs(mergeProps({ class: "grid min-w-0 gap-connection-section" }, _attrs))}><legend class="mb-connection-section text-interface-body font-semibold text-foreground">Устройство</legend><div class="grid grid-cols-6 gap-compact tablet:grid-cols-5 tablet:gap-connection-section"><!--[-->`);
			ssrRenderList(__props.platforms, (platform, index) => {
				_push(`<label class="${ssrRenderClass([[
					index < 3 ? "col-span-2" : "col-span-3",
					"tablet:col-span-1",
					model.value === platform.id ? "border-accent bg-accent-soft text-accent-text" : "border-border bg-surface text-secondary hover:border-accent"
				], "relative flex min-h-connection-platform min-w-0 cursor-pointer flex-col items-center justify-center gap-compact rounded-button border px-compact py-content text-center text-connection-platform font-semibold outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"])}"><input${ssrIncludeBooleanAttr(ssrLooseEqual(model.value, platform.id)) ? " checked" : ""}${ssrRenderAttr("value", platform.id)} type="radio" name="connection-platform" class="sr-only">`);
				_push(ssrRenderComponent(_sfc_main$101, {
					name: icons[platform.id],
					size: "connection"
				}, null, _parent));
				_push(`<span class="min-w-0 wrap-anywhere">${ssrInterpolate(platform.label)}</span></label>`);
			});
			_push(`<!--]--></div></fieldset>`);
		};
	}
};
var _sfc_setup$86 = _sfc_main$86.setup;
_sfc_main$86.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/connection/PlatformSelector.vue");
	return _sfc_setup$86 ? _sfc_setup$86(props, ctx) : void 0;
};
//#endregion
//#region resources/js/composables/useSelect.js
function useSelect({ trigger, panel, options, disabled, value, update }) {
	const open = shallowRef(false);
	const active = shallowRef(-1);
	const position = shallowRef({});
	let search = "";
	let searchedAt = 0;
	let anchor = null;
	const enabled = () => toValue(options).map((option, index) => option.disabled ? -1 : index).filter((index) => index >= 0);
	function close() {
		open.value = false;
		search = "";
	}
	function place() {
		const box = trigger.value.getBoundingClientRect();
		anchor = {
			top: box.top,
			left: box.left
		};
		const style = getComputedStyle(trigger.value);
		const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
		const inset = parseFloat(style.getPropertyValue("--spacing-compact")) * rem;
		const maximum = parseFloat(style.getPropertyValue("--spacing-select-menu")) * rem;
		const viewport = window.visualViewport;
		const leftEdge = viewport?.offsetLeft ?? 0;
		const topEdge = viewport?.offsetTop ?? 0;
		const width = viewport?.width ?? window.innerWidth;
		const height = viewport?.height ?? window.innerHeight;
		const desired = Math.min(panel.value?.scrollHeight ?? maximum, maximum);
		const below = Math.max(0, topEdge + height - box.bottom - inset * 2);
		const above = Math.max(0, box.top - topEdge - inset * 2);
		const upwards = below < desired && above > below;
		const available = Math.min(upwards ? above : below, maximum);
		const popupWidth = Math.max(0, Math.min(box.width, width - inset * 2));
		position.value = {
			"--ui-select-left": `${Math.max(leftEdge + inset, Math.min(box.left, leftEdge + width - popupWidth - inset))}px`,
			"--ui-select-top": `${upwards ? box.top - inset - Math.min(desired, available) : box.bottom + inset}px`,
			"--ui-select-width": `${popupWidth}px`,
			"--ui-select-available": `${available}px`,
			"--ui-select-font-size": style.fontSize,
			"--ui-select-line-height": style.lineHeight
		};
	}
	async function show() {
		if (toValue(disabled) || !enabled().length) return;
		active.value = toValue(options).findIndex((option) => option.value === toValue(value) && !option.disabled);
		if (active.value < 0) active.value = enabled()[0];
		place();
		open.value = true;
		await nextTick();
		if (open.value && trigger.value?.isConnected) {
			place();
			reveal();
		}
	}
	function reveal() {
		nextTick(() => panel.value?.children[active.value]?.scrollIntoView({ block: "nearest" }));
	}
	function choose(index = active.value, restoreFocus = true) {
		const option = toValue(options)[index];
		if (toValue(disabled) || !option || option.disabled) return;
		update(option.value);
		close();
		if (restoreFocus) nextTick(() => trigger.value?.focus({ preventScroll: true }));
	}
	function toggle() {
		if (open.value) close();
		else show();
	}
	function move(delta) {
		const indexes = enabled();
		const index = Math.max(0, indexes.indexOf(active.value));
		active.value = indexes[Math.max(0, Math.min(indexes.length - 1, index + delta))];
		reveal();
	}
	function keydown(event) {
		if (toValue(disabled) || event.ctrlKey || event.metaKey) return;
		if (event.key === "Escape") {
			if (open.value) {
				event.preventDefault();
				event.stopPropagation();
				close();
			}
			return;
		}
		if (event.key === "Tab") {
			if (open.value) choose(active.value, false);
			return;
		}
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			if (open.value) choose();
			else show();
			return;
		}
		if ([
			"ArrowDown",
			"ArrowUp",
			"Home",
			"End",
			"PageDown",
			"PageUp"
		].includes(event.key)) {
			event.preventDefault();
			const wasOpen = open.value;
			if (!wasOpen) show();
			if (event.altKey && event.key === "ArrowUp" && wasOpen) choose();
			else if (event.key === "Home" || !wasOpen && event.key === "ArrowUp") active.value = enabled()[0];
			else if (event.key === "End") active.value = enabled().at(-1);
			else if (wasOpen && !event.altKey) move(event.key.startsWith("Page") ? event.key === "PageDown" ? 10 : -10 : event.key === "ArrowDown" ? 1 : -1);
			reveal();
			return;
		}
		if (event.key.length === 1 && !event.altKey) {
			event.preventDefault();
			if (!open.value) show();
			const character = event.key.toLocaleLowerCase("ru");
			search = Date.now() - searchedAt > 700 ? character : search + character;
			searchedAt = Date.now();
			const repeated = [...search].every((letter) => letter === character);
			const query = repeated ? character : search;
			const indexes = enabled();
			const start = repeated ? indexes.indexOf(active.value) + 1 : 0;
			const match = [...indexes.slice(start), ...indexes.slice(0, start)].find((index) => toValue(options)[index].label.toLocaleLowerCase("ru").startsWith(query));
			if (match !== void 0) {
				active.value = match;
				reveal();
			}
		}
	}
	function outside(event) {
		if (open.value && !trigger.value?.contains(event.target) && !panel.value?.contains(event.target)) close();
	}
	function focus(event) {
		if (open.value && !trigger.value?.contains(event.target) && !panel.value?.contains(event.target)) choose(active.value, false);
	}
	function scroll(event) {
		if (!open.value || panel.value?.contains(event.target)) return;
		const box = trigger.value?.getBoundingClientRect();
		if (!box || box.top !== anchor?.top || box.left !== anchor?.left) close();
	}
	watch(() => [toValue(disabled), toValue(options)], close, { deep: true });
	const doc = typeof document === "undefined" ? void 0 : document;
	const viewport = typeof window === "undefined" ? void 0 : window.visualViewport;
	useEventListener(doc, "pointerdown", outside, true);
	useEventListener(doc, "focusin", focus);
	useEventListener("resize", close);
	useEventListener("scroll", scroll, true);
	useEventListener(viewport, "resize", close);
	onBeforeUnmount(close);
	return {
		open,
		active,
		position,
		toggle,
		keydown,
		choose
	};
}
//#endregion
//#region resources/js/components/ui/BaseSelect.vue
var _sfc_main$85 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "BaseSelect",
	__ssrInlineRender: true,
	props: /*@__PURE__*/ mergeModels({
		disabled: Boolean,
		id: {
			type: String,
			default: void 0
		},
		name: {
			type: String,
			default: void 0
		},
		options: {
			type: Array,
			required: true
		}
	}, {
		"modelValue": {
			type: [String, Number],
			required: true
		},
		"modelModifiers": {}
	}),
	emits: ["update:modelValue"],
	setup(__props) {
		const props = __props;
		const model = useModel(__props, "modelValue");
		const generatedId = useId();
		const triggerId = computed(() => props.id ?? generatedId);
		const listId = computed(() => `${triggerId.value}-options`);
		const trigger = useTemplateRef("trigger");
		const panel = useTemplateRef("panel");
		const selected = computed(() => props.options.find((option) => option.value === model.value));
		const { open, active, position, toggle, keydown, choose } = useSelect({
			trigger,
			panel,
			options: () => props.options,
			disabled: () => props.disabled,
			value: () => model.value,
			update: (value) => {
				model.value = value;
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<span${ssrRenderAttrs(mergeProps({ class: "relative block min-w-0" }, _attrs))}>`);
			if (__props.name) _push(`<input type="hidden"${ssrRenderAttr("name", __props.name)}${ssrRenderAttr("value", model.value)}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}>`);
			else _push(`<!---->`);
			_push(`<button${ssrRenderAttrs(mergeProps({
				id: triggerId.value,
				ref_key: "trigger",
				ref: trigger
			}, _ctx.$attrs, {
				type: "button",
				role: "combobox",
				"aria-haspopup": "listbox",
				"aria-controls": listId.value,
				"aria-expanded": unref(open),
				"aria-activedescendant": unref(open) && unref(active) >= 0 ? `${listId.value}-${unref(active)}` : void 0,
				disabled: __props.disabled,
				class: "flex min-h-interface-control min-w-0 w-full cursor-pointer items-center justify-between gap-compact rounded-button border border-interface-field-border bg-interface-input px-interface-inline py-compact text-left text-interface-body text-foreground outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus disabled:cursor-not-allowed disabled:opacity-60"
			}))}><span class="min-w-0 flex-1 wrap-anywhere">${ssrInterpolate(selected.value?.label)}</span>`);
			_push(ssrRenderComponent(_sfc_main$101, {
				name: "chevronRight",
				class: ["text-secondary", unref(open) ? "-rotate-90" : "rotate-90"]
			}, null, _parent));
			_push(`</button>`);
			if (unref(open)) ssrRenderTeleport(_push, (_push) => {
				_push(`<ul${ssrRenderAttr("id", listId.value)} role="listbox"${ssrRenderAttr("aria-labelledby", _ctx.$attrs["aria-labelledby"] ?? triggerId.value)} style="${ssrRenderStyle(unref(position))}" class="fixed top-select-top left-select-left z-select max-h-select-available w-select-width overflow-y-auto overscroll-contain rounded-button border border-interface-field-border bg-interface-input p-control font-sans text-select-option text-foreground shadow-lg"><!--[-->`);
				ssrRenderList(__props.options, (option, index) => {
					_push(`<li${ssrRenderAttr("id", `${listId.value}-${index}`)} role="option"${ssrRenderAttr("aria-selected", option.value === model.value)}${ssrRenderAttr("aria-disabled", option.disabled || void 0)} class="${ssrRenderClass([option.disabled ? "cursor-not-allowed text-muted forced-colors:text-select-disabled" : [
						"cursor-pointer",
						unref(active) === index ? "bg-accent-soft text-accent-text forced-colors:bg-select-active forced-colors:text-select-active-foreground" : "hover:bg-surface",
						option.value === model.value ? "font-semibold" : ""
					], "flex min-h-interface-control items-center gap-compact rounded-control px-interface-inline py-compact wrap-anywhere"])}"><span class="min-w-0 flex-1">${ssrInterpolate(option.label)}</span>`);
					if (option.value === model.value) _push(ssrRenderComponent(_sfc_main$101, { name: "check" }, null, _parent));
					else _push(`<!---->`);
					_push(`</li>`);
				});
				_push(`<!--]--></ul>`);
			}, "body", false, _parent);
			else _push(`<!---->`);
			_push(`</span>`);
		};
	}
});
var _sfc_setup$85 = _sfc_main$85.setup;
_sfc_main$85.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/BaseSelect.vue");
	return _sfc_setup$85 ? _sfc_setup$85(props, ctx) : void 0;
};
//#endregion
//#region resources/js/utils/connectionDownload.js
function connectionDownloadNote(link, platform) {
	let pathname = "";
	try {
		pathname = new URL(link.url).pathname;
	} catch {}
	const source = `${link.label} ${pathname}`;
	const architecture = /\b(?:arm64|aarch64)\b/i.test(source) ? "arm64" : /\b(?:amd64|x64|x86_64)\b/i.test(source) ? "amd64" : "";
	if (platform === "linux") {
		const format = source.match(/\.(deb|rpm|arch)\b/i)?.[0].toLowerCase() ?? (/\bAppImage\b/i.test(source) ? "AppImage" : /\.pkg\.tar\./i.test(pathname) ? ".arch" : "");
		if (format) {
			const linuxArchitecture = architecture === "amd64" ? "x64" : architecture;
			return linuxArchitecture ? `${format} (${linuxArchitecture})` : format;
		}
	}
	return architecture || link.label.replace(/^(?:Скачать|Открыть в)\s+/i, "");
}
//#endregion
//#region resources/js/components/connection/ConnectionSteps.vue
var _sfc_main$84 = {
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
		const appOptions = computed(() => props.platform.apps.map((item) => ({
			value: item.name,
			label: item.name
		})));
		const selectId = useId();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				"aria-labelledby": "connection-instructions-title",
				class: "grid min-w-0 gap-connection-section"
			}, _attrs))}><h2 id="connection-instructions-title" class="text-interface-body font-semibold">Инструкция для подключения</h2>`);
			if (!__props.platform.available) _push(`<p role="status" class="rounded-button border border-border bg-surface p-connection-step text-interface-body text-secondary">Инструкция для этого устройства пока недоступна. Напиши в поддержку — поможем подключиться.</p>`);
			else {
				_push(`<ol class="grid min-w-0 gap-connection-section"><!--[-->`);
				ssrRenderList(app.value?.steps ?? [], (step, index) => {
					_push(`<li><details class="group min-w-0 rounded-button border border-border bg-interface-input p-connection-step"><summary class="flex min-w-0 cursor-pointer list-none items-center gap-connection-step-gap rounded-control outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus [&amp;::-webkit-details-marker]:hidden"><span aria-hidden="true" class="flex size-connection-number shrink-0 items-center justify-center rounded-control bg-accent-soft text-account-step-number font-step-number text-accent-text">${ssrInterpolate(index + 1)}</span><span class="grid min-w-0 flex-1 gap-0.5"><span class="text-interface-title font-display wrap-anywhere">${ssrInterpolate(step.title)}</span><span class="text-interface-body wrap-anywhere text-secondary">${ssrInterpolate(step.description)}</span></span>`);
					_push(ssrRenderComponent(_sfc_main$101, {
						name: "chevronRight",
						class: "text-muted transition-transform group-open:rotate-90 motion-reduce:transition-none"
					}, null, _parent));
					_push(`</summary><div class="grid min-w-0 gap-content pt-content text-interface-body wrap-anywhere text-secondary">`);
					if (index === 0) {
						_push(`<div class="grid min-w-0 gap-interface-field-gap"><label${ssrRenderAttr("id", `${unref(selectId)}-label`)}${ssrRenderAttr("for", unref(selectId))} class="font-medium text-foreground">Приложение</label>`);
						_push(ssrRenderComponent(_sfc_main$85, {
							id: unref(selectId),
							modelValue: appName.value,
							"onUpdate:modelValue": ($event) => appName.value = $event,
							"aria-labelledby": `${unref(selectId)}-label`,
							name: "connection-app",
							options: appOptions.value
						}, null, _parent));
						_push(`</div>`);
					} else _push(`<!---->`);
					_push(`<!--[-->`);
					ssrRenderList(step.content, (paragraph, paragraphIndex) => {
						_push(`<p>${ssrInterpolate(paragraph)}</p>`);
					});
					_push(`<!--]-->`);
					if (step.links?.length) {
						_push(`<ul class="flex flex-wrap gap-compact"><!--[-->`);
						ssrRenderList(step.links, (link) => {
							_push(`<li class="min-w-0 w-full md:w-auto">`);
							_push(ssrRenderComponent(_sfc_main$100, {
								href: link.url,
								target: link.external ? "_blank" : void 0,
								rel: "noopener noreferrer",
								class: "min-w-0 max-w-full text-center wrap-anywhere",
								"full-width": ""
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) {
										_push(`<span class="grid min-w-0 gap-0.5"${_scopeId}><span${_scopeId}>${ssrInterpolate(index === 0 ? "Скачать" : link.label)}</span>`);
										if (index === 0 && step.links.length > 1) _push(`<span class="text-interface-meta font-normal"${_scopeId}>${ssrInterpolate(unref(connectionDownloadNote)(link, __props.platform.id))}</span>`);
										else _push(`<!---->`);
										_push(`</span>`);
									} else return [createVNode("span", { class: "grid min-w-0 gap-0.5" }, [createVNode("span", null, toDisplayString(index === 0 ? "Скачать" : link.label), 1), index === 0 && step.links.length > 1 ? (openBlock(), createBlock("span", {
										key: 0,
										class: "text-interface-meta font-normal"
									}, toDisplayString(unref(connectionDownloadNote)(link, __props.platform.id)), 1)) : createCommentVNode("", true)])];
								}),
								_: 2
							}, _parent));
							_push(`</li>`);
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
var _sfc_setup$84 = _sfc_main$84.setup;
_sfc_main$84.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/connection/ConnectionSteps.vue");
	return _sfc_setup$84 ? _sfc_setup$84(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/connection/ConnectionDevices.vue
var _sfc_main$83 = {
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
					_push(ssrRenderComponent(_sfc_main$100, {
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
var _sfc_setup$83 = _sfc_main$83.setup;
_sfc_main$83.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/connection/ConnectionDevices.vue");
	return _sfc_setup$83 ? _sfc_setup$83(props, ctx) : void 0;
};
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
var _sfc_main$82 = {
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
			_push(`<!--[-->`);
			ssrRenderSlot(_ctx.$slots, "heading", {
				busy: unref(busy),
				refreshing: unref(refreshing),
				refresh: unref(retry)
			}, null, _push, _parent);
			_push(`<div class="grid min-w-0 gap-account-section">`);
			_push(ssrRenderComponent(_sfc_main$86, {
				modelValue: selectedId.value,
				"onUpdate:modelValue": ($event) => selectedId.value = $event,
				platforms: __props.platforms
			}, null, _parent));
			if (unref(refreshing)) _push(ssrRenderComponent(_sfc_main$87, {
				state: "loading",
				title: "Проверяем подключение…",
				description: "Это займёт несколько секунд."
			}, null, _parent));
			else if (__props.serviceState === "ready" && !unref(refreshError)) {
				_push(`<!--[--><section aria-labelledby="connection-link-title" class="grid min-w-0 gap-connection-section"><h2 id="connection-link-title" class="text-interface-body font-semibold">Ваша ссылка для подключения</h2>`);
				if (__props.subscriptionUrl) _push(ssrRenderComponent(_sfc_main$88, { value: __props.subscriptionUrl }, null, _parent));
				else _push(`<p role="status" class="rounded-button border border-border bg-surface p-connection-step text-interface-body text-secondary">Ссылка подключения сейчас недоступна. Обнови данные или напиши в поддержку.</p>`);
				_push(`</section>`);
				if (selected.value) _push(ssrRenderComponent(_sfc_main$84, {
					key: selected.value.id,
					platform: selected.value
				}, null, _parent));
				else _push(`<!---->`);
				_push(ssrRenderComponent(unref(Link), {
					href: "/account/support",
					class: "inline-flex min-h-interface-control items-center justify-self-start rounded-control text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Нужна помощь`);
						else return [createTextVNode("Нужна помощь")];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_sfc_main$83, {
					devices: __props.devices,
					count: __props.deviceCount ?? 0,
					limit: __props.deviceLimit,
					busy: unref(busy),
					"pending-token": unref(remove).device,
					error: unref(remove).errors.device,
					removed: __props.deviceRemoved,
					onRemove: unref(revoke)
				}, null, _parent));
				_push(`<!--]-->`);
			} else _push(ssrRenderComponent(_sfc_main$87, {
				state: "serviceError",
				title: "Не удалось загрузить подключение.",
				description: "Обнови данные. Если ошибка повторится, напиши в поддержку."
			}, {
				actions: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_sfc_main$100, {
							label: "Попробовать снова",
							disabled: unref(busy),
							onClick: unref(retry)
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(Link), {
							href: "/account/support",
							class: "inline-flex min-h-interface-control items-center text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Нужна помощь`);
								else return [createTextVNode("Нужна помощь")];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [createVNode(_sfc_main$100, {
						label: "Попробовать снова",
						disabled: unref(busy),
						onClick: unref(retry)
					}, null, 8, ["disabled", "onClick"]), createVNode(unref(Link), {
						href: "/account/support",
						class: "inline-flex min-h-interface-control items-center text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
					}, {
						default: withCtx(() => [createTextVNode("Нужна помощь")]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(`</div><!--]-->`);
		};
	}
};
var _sfc_setup$82 = _sfc_main$82.setup;
_sfc_main$82.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/connection/ConnectionContent.vue");
	return _sfc_setup$82 ? _sfc_setup$82(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Account/Connection.vue
var Connection_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$81 });
var _sfc_main$81 = {
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
			_push(ssrRenderComponent(_sfc_main$91, {
				"page-title": "Подключение",
				"content-spacing": "connection"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid min-w-0 gap-account-section"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$82, {
							"subscription-url": __props.subscriptionUrl,
							platforms: __props.platforms,
							devices: __props.devices,
							"device-count": __props.deviceCount,
							"device-limit": __props.deviceLimit,
							"service-state": __props.serviceState,
							"device-removed": __props.deviceRemoved
						}, {
							heading: withCtx(({ busy, refreshing, refresh }, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_sfc_main$90, {
									title: "Подключиться проще, чем кажется.",
									description: "Выбери своё устройство — покажем, что делать дальше."
								}, {
									actions: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_sfc_main$89, {
											disabled: busy,
											loading: refreshing,
											onClick: refresh
										}, null, _parent, _scopeId));
										else return [createVNode(_sfc_main$89, {
											disabled: busy,
											loading: refreshing,
											onClick: refresh
										}, null, 8, [
											"disabled",
											"loading",
											"onClick"
										])];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [createVNode(_sfc_main$90, {
									title: "Подключиться проще, чем кажется.",
									description: "Выбери своё устройство — покажем, что делать дальше."
								}, {
									actions: withCtx(() => [createVNode(_sfc_main$89, {
										disabled: busy,
										loading: refreshing,
										onClick: refresh
									}, null, 8, [
										"disabled",
										"loading",
										"onClick"
									])]),
									_: 2
								}, 1024)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "grid min-w-0 gap-account-section" }, [createVNode(_sfc_main$82, {
						"subscription-url": __props.subscriptionUrl,
						platforms: __props.platforms,
						devices: __props.devices,
						"device-count": __props.deviceCount,
						"device-limit": __props.deviceLimit,
						"service-state": __props.serviceState,
						"device-removed": __props.deviceRemoved
					}, {
						heading: withCtx(({ busy, refreshing, refresh }) => [createVNode(_sfc_main$90, {
							title: "Подключиться проще, чем кажется.",
							description: "Выбери своё устройство — покажем, что делать дальше."
						}, {
							actions: withCtx(() => [createVNode(_sfc_main$89, {
								disabled: busy,
								loading: refreshing,
								onClick: refresh
							}, null, 8, [
								"disabled",
								"loading",
								"onClick"
							])]),
							_: 2
						}, 1024)]),
						_: 1
					}, 8, [
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
var _sfc_setup$81 = _sfc_main$81.setup;
_sfc_main$81.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Connection.vue");
	return _sfc_setup$81 ? _sfc_setup$81(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/ui/StatusBadge.vue
var _sfc_main$80 = {
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
			_push(ssrRenderComponent(_sfc_main$101, {
				name: config.value.icon,
				size: "badge"
			}, null, _parent));
			_push(` ${ssrInterpolate(__props.label || config.value.label)}</span>`);
		};
	}
};
var _sfc_setup$80 = _sfc_main$80.setup;
_sfc_main$80.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/StatusBadge.vue");
	return _sfc_setup$80 ? _sfc_setup$80(props, ctx) : void 0;
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
//#endregion
//#region resources/js/components/account/DashboardSubscription.vue
var _sfc_main$79 = {
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
				class: "grid min-w-0 grid-cols-1 gap-account-card-gap rounded-panel border border-account-card-border bg-surface p-account-card"
			}, _attrs))}><div class="flex flex-wrap items-center justify-between gap-compact"><p class="font-mono text-interface-meta text-secondary">ТВОЯ ПОДПИСКА</p>`);
			_push(ssrRenderComponent(_sfc_main$80, { status: __props.subscription.state }, null, _parent));
			_push(`</div><div class="grid min-w-0 gap-control"><h2 class="text-interface-title font-display wrap-anywhere text-foreground">${ssrInterpolate(__props.subscription.planName)}</h2><p class="${ssrRenderClass(["text-interface-body", ["active", "trial"].includes(__props.subscription.state) ? "text-success" : "text-secondary"])}">${ssrInterpolate(state.value.message)}</p></div><dl class="flex flex-wrap items-start justify-between gap-content text-interface-body"><div class="grid gap-0.5"><dt class="text-secondary">${ssrInterpolate(__props.subscription.state === "expired" ? "Действовала до" : "Действует до")}</dt><dd class="font-semibold"><time${ssrRenderAttr("datetime", __props.subscription.expiresAt)}>${ssrInterpolate(__props.subscription.expiresOn)}</time></dd></div><div class="grid gap-0.5 text-right"><dt class="text-secondary">Осталось</dt><dd class="font-semibold">${ssrInterpolate(unref(daysLabel)(__props.subscription.remainingDays))}</dd></div></dl>`);
			if (__props.subscription.state === "limited") _push(ssrRenderComponent(unref(Link), {
				href: "/account/support",
				class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`${ssrInterpolate(state.value.action)}`);
					else return [createTextVNode(toDisplayString(state.value.action), 1)];
				}),
				_: 1
			}, _parent));
			else _push(ssrRenderComponent(unref(Link), {
				href: "/account/subscription",
				class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
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
var _sfc_setup$79 = _sfc_main$79.setup;
_sfc_main$79.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/account/DashboardSubscription.vue");
	return _sfc_setup$79 ? _sfc_setup$79(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/account/DashboardConnection.vue
var _sfc_main$78 = {
	__name: "DashboardConnection",
	__ssrInlineRender: true,
	props: { url: {
		type: String,
		default: null
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				class: "grid min-w-0 grid-cols-1 gap-account-connection-gap rounded-panel border border-border bg-interface-input p-account-connection",
				"aria-labelledby": "dashboard-connection-title"
			}, _attrs))}><div class="flex flex-wrap items-center justify-between gap-compact"><h2 id="dashboard-connection-title" class="text-interface-title font-display">Подключение</h2>`);
			_push(ssrRenderComponent(unref(Link), {
				href: "/account/connection",
				class: "inline-flex min-h-interface-control items-center rounded-control px-control text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
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
				_push(ssrRenderComponent(_sfc_main$88, { value: __props.url }, null, _parent));
				_push(`<!--]-->`);
			} else _push(`<p class="py-tight text-interface-body text-secondary">Ссылка подключения сейчас недоступна. <a href="https://t.me/hey_dude_web" class="font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus">Написать в поддержку</a></p>`);
			_push(`</section>`);
		};
	}
};
var _sfc_setup$78 = _sfc_main$78.setup;
_sfc_main$78.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/account/DashboardConnection.vue");
	return _sfc_setup$78 ? _sfc_setup$78(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/account/DashboardDevices.vue
var _sfc_main$77 = {
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
				class: "flex min-h-account-device items-center gap-control-inline rounded-card border border-border bg-interface-input px-account-card desktop:px-panel"
			}, _attrs))}><span class="flex size-11 shrink-0 items-center justify-center rounded-control bg-accent-soft text-accent-text">`);
			_push(ssrRenderComponent(_sfc_main$101, { name: "monitor-smartphone" }, null, _parent));
			_push(`</span><div class="grid min-w-0 flex-1 gap-0.5"><h2 id="dashboard-devices-title" class="text-interface-title font-display">Устройства</h2><p class="text-interface-body text-secondary">Подключено: ${ssrInterpolate(__props.summary.count)}`);
			if (__props.summary.limit !== null) _push(`<!--[--> из ${ssrInterpolate(__props.summary.limit)}<!--]-->`);
			else _push(`<!---->`);
			_push(`</p></div>`);
			_push(ssrRenderComponent(_sfc_main$101, {
				name: "chevronRight",
				size: "md",
				class: "shrink-0 text-muted"
			}, null, _parent));
			_push(`</section>`);
		};
	}
};
var _sfc_setup$77 = _sfc_main$77.setup;
_sfc_main$77.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/account/DashboardDevices.vue");
	return _sfc_setup$77 ? _sfc_setup$77(props, ctx) : void 0;
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
var Dashboard_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$76 });
var _sfc_main$76 = {
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
			_push(ssrRenderComponent(_sfc_main$91, { "page-title": "Главная" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid min-w-0 grid-cols-1 gap-account-section"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$90, {
							title: heading.value,
							description: "Всё важное о твоём доступе — здесь."
						}, {
							actions: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_sfc_main$89, {
									loading: unref(busy),
									onClick: unref(retry)
								}, null, _parent, _scopeId));
								else return [createVNode(_sfc_main$89, {
									loading: unref(busy),
									onClick: unref(retry)
								}, null, 8, ["loading", "onClick"])];
							}),
							_: 1
						}, _parent, _scopeId));
						if (unref(busy)) _push(ssrRenderComponent(_sfc_main$87, {
							state: "loading",
							title: "Проверяем данные подписки…",
							description: "Это займёт несколько секунд."
						}, null, _parent, _scopeId));
						else if (__props.serviceState === "ready" && __props.subscription && __props.devicesSummary && !unref(refreshError)) {
							_push(`<!--[-->`);
							_push(ssrRenderComponent(_sfc_main$79, { subscription: __props.subscription }, null, _parent, _scopeId));
							_push(ssrRenderComponent(_sfc_main$78, { url: __props.subscription.url }, null, _parent, _scopeId));
							_push(ssrRenderComponent(_sfc_main$77, { summary: __props.devicesSummary }, null, _parent, _scopeId));
							_push(`<!--]-->`);
						} else _push(ssrRenderComponent(_sfc_main$87, {
							state: "serviceError",
							title: "Не удалось загрузить данные.",
							description: "Попробуй обновить экран. Если проблема повторится, напиши в поддержку."
						}, {
							actions: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(_sfc_main$100, {
										label: "Попробовать снова",
										disabled: unref(busy),
										onClick: unref(retry)
									}, null, _parent, _scopeId));
									_push(`<a href="https://t.me/hey_dude_web" class="inline-flex min-h-interface-control items-center px-control text-interface-action font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"${_scopeId}>Написать в поддержку</a>`);
								} else return [createVNode(_sfc_main$100, {
									label: "Попробовать снова",
									disabled: unref(busy),
									onClick: unref(retry)
								}, null, 8, ["disabled", "onClick"]), createVNode("a", {
									href: "https://t.me/hey_dude_web",
									class: "inline-flex min-h-interface-control items-center px-control text-interface-action font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
								}, "Написать в поддержку")];
							}),
							_: 1
						}, _parent, _scopeId));
						if (unref(provision).errors.form) _push(ssrRenderComponent(_sfc_main$97, {
							variant: "error",
							message: unref(provision).errors.form
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
						_push(`</div>`);
					} else return [createVNode("div", { class: "grid min-w-0 grid-cols-1 gap-account-section" }, [
						createVNode(_sfc_main$90, {
							title: heading.value,
							description: "Всё важное о твоём доступе — здесь."
						}, {
							actions: withCtx(() => [createVNode(_sfc_main$89, {
								loading: unref(busy),
								onClick: unref(retry)
							}, null, 8, ["loading", "onClick"])]),
							_: 1
						}, 8, ["title"]),
						unref(busy) ? (openBlock(), createBlock(_sfc_main$87, {
							key: 0,
							state: "loading",
							title: "Проверяем данные подписки…",
							description: "Это займёт несколько секунд."
						})) : __props.serviceState === "ready" && __props.subscription && __props.devicesSummary && !unref(refreshError) ? (openBlock(), createBlock(Fragment, { key: 1 }, [
							createVNode(_sfc_main$79, { subscription: __props.subscription }, null, 8, ["subscription"]),
							createVNode(_sfc_main$78, { url: __props.subscription.url }, null, 8, ["url"]),
							createVNode(_sfc_main$77, { summary: __props.devicesSummary }, null, 8, ["summary"])
						], 64)) : (openBlock(), createBlock(_sfc_main$87, {
							key: 2,
							state: "serviceError",
							title: "Не удалось загрузить данные.",
							description: "Попробуй обновить экран. Если проблема повторится, напиши в поддержку."
						}, {
							actions: withCtx(() => [createVNode(_sfc_main$100, {
								label: "Попробовать снова",
								disabled: unref(busy),
								onClick: unref(retry)
							}, null, 8, ["disabled", "onClick"]), createVNode("a", {
								href: "https://t.me/hey_dude_web",
								class: "inline-flex min-h-interface-control items-center px-control text-interface-action font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
							}, "Написать в поддержку")]),
							_: 1
						})),
						unref(provision).errors.form ? (openBlock(), createBlock(_sfc_main$97, {
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
var _sfc_setup$76 = _sfc_main$76.setup;
_sfc_main$76.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Dashboard.vue");
	return _sfc_setup$76 ? _sfc_setup$76(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/shells/PaymentResultShell.vue
var _sfc_main$75 = {
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
				iconClasses: "bg-status-icon-error text-error",
				role: "alert"
			},
			pending: {
				icon: "clock-3",
				iconClasses: "bg-status-icon-pending text-warning",
				role: "status"
			},
			succeeded: {
				icon: "circleCheck",
				iconClasses: "bg-status-icon-background text-status-icon-success",
				role: "status"
			}
		};
		const props = __props;
		const config = computed(() => STATUS_CONFIG[props.status] ?? STATUS_CONFIG.pending);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-dvh flex-col bg-background text-foreground" }, _attrs))}><header class="flex h-auth-header shrink-0 items-center px-shell-gutter">`);
			_push(ssrRenderComponent(_sfc_main$98, { variant: "wordmark" }, null, _parent));
			_push(`</header><main class="mx-auto flex w-full flex-1 flex-col px-shell-gutter pt-auth-status-top pb-auth-status-bottom tablet:max-w-auth-tablet tablet:px-0 desktop:max-w-auth-desktop"><section${ssrRenderAttr("role", config.value.role)} class="my-auto grid min-w-0 grid-cols-1 justify-items-center gap-auth-group text-center"><span class="${ssrRenderClass(["inline-flex size-auth-status-icon items-center justify-center rounded-auth-status", config.value.iconClasses])}">`);
			_push(ssrRenderComponent(_sfc_main$101, {
				name: config.value.icon,
				size: "status"
			}, null, _parent));
			_push(`</span><div class="grid min-w-0 grid-cols-1 gap-auth-group"><h1 class="text-interface-heading font-display tracking-interface-heading break-words">${ssrInterpolate(__props.title)}</h1><p class="text-interface-body text-secondary">${ssrInterpolate(__props.description)}</p></div>`);
			if (_ctx.$slots.actions) {
				_push(`<div class="grid w-full gap-auth-group">`);
				ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</section></main></div>`);
		};
	}
};
var _sfc_setup$75 = _sfc_main$75.setup;
_sfc_main$75.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/shells/PaymentResultShell.vue");
	return _sfc_setup$75 ? _sfc_setup$75(props, ctx) : void 0;
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
var Show_exports$1 = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$74 });
var _sfc_main$74 = {
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
			_push(ssrRenderComponent(_sfc_main$75, {
				status: __props.payment.status,
				title: state.value.title,
				description: state.value.description
			}, {
				actions: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (__props.payment.status === "pending" && unref(stopped)) _push(`<p role="status" class="text-interface-body text-secondary"${_scopeId}>${ssrInterpolate(unref(error) ? "Не удалось обновить статус. Проверь соединение и повтори запрос." : "Подтверждение ещё не пришло. Можно проверить статус вручную.")}</p>`);
						else _push(`<!---->`);
						if (__props.payment.status === "pending" && unref(stopped)) _push(ssrRenderComponent(_sfc_main$100, {
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
						if (__props.payment.status === "canceled" && __props.payment.retryUrl) _push(ssrRenderComponent(_sfc_main$100, {
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
							class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
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
							class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-status-secondary-border bg-status-secondary px-interface-inline text-interface-action font-bold hover:bg-surface outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Подключить устройство`);
								else return [createTextVNode("Подключить устройство")];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
						if (__props.payment.status === "canceled") _push(`<a href="https://t.me/hey_dude_web" class="inline-flex min-h-interface-control items-center justify-center rounded-button border border-status-secondary-border bg-status-secondary px-interface-inline text-interface-action font-bold hover:bg-surface outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"${_scopeId}>Связаться с поддержкой</a>`);
						else _push(`<!---->`);
						if (__props.payment.status === "canceled") _push(ssrRenderComponent(unref(Link), {
							href: "/account/subscription",
							class: "text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
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
						__props.payment.status === "pending" && unref(stopped) ? (openBlock(), createBlock(_sfc_main$100, {
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
						__props.payment.status === "canceled" && __props.payment.retryUrl ? (openBlock(), createBlock(_sfc_main$100, {
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
							class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
						}, {
							default: withCtx(() => [createTextVNode("На главную")]),
							_: 1
						})) : createCommentVNode("", true),
						__props.payment.status === "succeeded" ? (openBlock(), createBlock(unref(Link), {
							key: 5,
							href: "/account/connection",
							class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-status-secondary-border bg-status-secondary px-interface-inline text-interface-action font-bold hover:bg-surface outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
						}, {
							default: withCtx(() => [createTextVNode("Подключить устройство")]),
							_: 1
						})) : createCommentVNode("", true),
						__props.payment.status === "canceled" ? (openBlock(), createBlock("a", {
							key: 6,
							href: "https://t.me/hey_dude_web",
							class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-status-secondary-border bg-status-secondary px-interface-inline text-interface-action font-bold hover:bg-surface outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
						}, "Связаться с поддержкой")) : createCommentVNode("", true),
						__props.payment.status === "canceled" ? (openBlock(), createBlock(unref(Link), {
							key: 7,
							href: "/account/subscription",
							class: "text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
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
var _sfc_setup$74 = _sfc_main$74.setup;
_sfc_main$74.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Payments/Show.vue");
	return _sfc_setup$74 ? _sfc_setup$74(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/ui/BaseField.vue
var _sfc_main$73 = {
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
			"min-h-interface-control w-full rounded-button border px-interface-inline text-interface-body text-foreground outline-none transition-colors duration-200 motion-reduce:transition-none placeholder:text-muted keyboard-focus:border-focus keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus disabled:cursor-not-allowed disabled:opacity-60",
			"bg-interface-input",
			props.error ? "border-error" : props.variant === "auth" ? "border-interface-input-border" : "border-interface-field-border",
			props.icon ? "pl-interface-icon-text" : "",
			slots.suffix ? "pr-12" : ""
		]);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["grid min-w-0 grid-cols-1", __props.spacing === "reset" ? "gap-auth-reset-group" : __props.spacing === "sheet" ? "gap-control-inline" : "gap-interface-field-gap"] }, _attrs))}><label${ssrRenderAttr("for", __props.id)} class="${ssrRenderClass([__props.variant === "auth" ? "text-secondary" : "text-foreground", "text-interface-body font-medium"])}">${ssrInterpolate(__props.label)}</label><div class="relative">`);
			if (__props.icon) {
				_push(`<span class="pointer-events-none absolute inset-y-0 left-interface-inline flex items-center text-muted">`);
				_push(ssrRenderComponent(_sfc_main$101, { name: __props.icon }, null, _parent));
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
var _sfc_setup$73 = _sfc_main$73.setup;
_sfc_main$73.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/BaseField.vue");
	return _sfc_setup$73 ? _sfc_setup$73(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/profile/ProfileTelegram.vue
var _sfc_main$72 = {
	__name: "ProfileTelegram",
	__ssrInlineRender: true,
	props: { connection: {
		type: Object,
		required: true
	} },
	setup(__props) {
		const props = __props;
		const { form, submit } = useActionForm({ link_id: null });
		const refreshing = shallowRef(false);
		const refreshError = shallowRef(null);
		let cancelRefresh;
		const link = computed(() => props.connection.link);
		const pending = computed(() => ["pending", "awaiting_telegram"].includes(link.value?.state));
		const applying = computed(() => [
			"applying",
			"remote_applied",
			"local_applied"
		].includes(link.value?.state));
		const ready = computed(() => link.value?.state === "ready");
		const busy = computed(() => form.processing || refreshing.value);
		const error = computed(() => form.errors.telegram || form.errors.form || refreshError.value);
		function start() {
			refreshError.value = null;
			submit("post", "/account/profile/telegram");
		}
		function confirm() {
			refreshError.value = null;
			form.link_id = link.value.id;
			submit("post", "/account/profile/telegram/confirm");
		}
		function cancel() {
			refreshError.value = null;
			form.link_id = link.value.id;
			submit("delete", "/account/profile/telegram");
		}
		function refresh() {
			if (busy.value || !pending.value && !ready.value && !applying.value) return;
			refreshing.value = true;
			refreshError.value = null;
			const failed = () => {
				refreshError.value = "Не удалось проверить привязку. Попробуй ещё раз.";
				return false;
			};
			router.reload({
				only: ["telegramConnection", "securityCapabilities"],
				onCancelToken: (token) => {
					cancelRefresh = token;
				},
				onError: failed,
				onNetworkError: failed,
				onHttpException: failed,
				onFinish: () => {
					refreshing.value = false;
					cancelRefresh = null;
				}
			});
		}
		useEventListener("focus", refresh);
		onBeforeUnmount(() => cancelRefresh?.cancel());
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				"aria-labelledby": "profile-telegram-title",
				class: "grid min-w-0 gap-control border-t border-border pt-profile-section text-interface-body",
				"aria-busy": busy.value
			}, _attrs))}><div class="flex min-w-0 flex-wrap items-center justify-between gap-compact"><div class="grid min-w-0 gap-control"><h3 id="profile-telegram-title" class="font-semibold">Telegram</h3><p class="text-secondary">${ssrInterpolate(__props.connection.connected ? "Подключён" : "Не подключён")}`);
			if (__props.connection.connected && __props.connection.username) _push(`<span class="wrap-anywhere"> · @${ssrInterpolate(__props.connection.username)}</span>`);
			else _push(`<!---->`);
			_push(`</p></div>`);
			if (!__props.connection.connected && !pending.value && !ready.value && !applying.value) _push(ssrRenderComponent(_sfc_main$100, {
				label: "Привязать",
				size: "sm",
				variant: "accent",
				disabled: !__props.connection.available,
				loading: unref(form).processing,
				"loading-label": "Открываем…",
				onClick: start
			}, null, _parent));
			else _push(`<!---->`);
			_push(`</div>`);
			if (error.value) _push(ssrRenderComponent(_sfc_main$97, {
				variant: "error",
				message: error.value
			}, null, _parent));
			else _push(`<!---->`);
			if (link.value?.state === "complete") _push(`<p role="status" class="text-success">Telegram привязан. Аккаунт и подписка доступны в боте.</p>`);
			else if (pending.value) {
				_push(`<!--[--><p class="text-secondary">Подтверди привязку в личном чате с ботом, затем вернись сюда. Ссылка действует 10 минут.</p><div class="flex flex-wrap gap-compact">`);
				_push(ssrRenderComponent(_sfc_main$100, {
					label: "Проверить привязку",
					size: "sm",
					variant: "accent",
					loading: refreshing.value,
					disabled: unref(form).processing,
					onClick: refresh
				}, null, _parent));
				_push(ssrRenderComponent(_sfc_main$100, {
					label: "Отменить привязку",
					size: "sm",
					variant: "ghost",
					disabled: busy.value,
					onClick: cancel
				}, null, _parent));
				_push(`</div><!--]-->`);
			} else if (ready.value) {
				_push(`<!--[--><p class="text-secondary wrap-anywhere">Telegram${ssrInterpolate(link.value.username ? ` @${link.value.username}` : "")} подтверждён. При объединении сохраним ссылку более раннего аккаунта и сложим оставшееся оплаченное время. Пробные периоды не складываются.</p>`);
				if (!link.value.canConfirm) _push(`<p class="text-secondary">Заверши привязку в браузере, где она началась, или отмени её и запроси новую ссылку.</p>`);
				else _push(`<!---->`);
				_push(`<div class="flex flex-wrap gap-compact">`);
				_push(ssrRenderComponent(_sfc_main$100, {
					label: "Завершить привязку",
					size: "sm",
					disabled: !link.value.canConfirm || refreshing.value,
					loading: unref(form).processing,
					"loading-label": "Объединяем…",
					onClick: confirm
				}, null, _parent));
				_push(ssrRenderComponent(_sfc_main$100, {
					label: "Отменить привязку",
					size: "sm",
					variant: "ghost",
					disabled: busy.value,
					onClick: cancel
				}, null, _parent));
				_push(`</div><!--]-->`);
			} else if (applying.value) {
				_push(`<!--[--><p role="status" class="text-secondary">Завершаем объединение аккаунтов. Изменения профиля и подписки станут доступны после завершения.</p>`);
				if (link.value.failed && !error.value) _push(`<p class="text-error">Не удалось завершить привязку. Повтори сохранённый этап.</p>`);
				else _push(`<!---->`);
				_push(ssrRenderComponent(_sfc_main$100, {
					label: "Повторить завершение привязки",
					size: "sm",
					loading: unref(form).processing,
					disabled: refreshing.value,
					"loading-label": "Объединяем…",
					onClick: confirm
				}, null, _parent));
				_push(`<!--]-->`);
			} else if (link.value?.state === "expired") _push(`<p role="status" class="text-secondary">Ссылка привязки устарела. Нажми «Привязать», чтобы получить новую.</p>`);
			else if (link.value?.state === "cancelled") _push(`<p role="status" class="text-secondary">Привязка отменена.</p>`);
			else if (!__props.connection.connected && !__props.connection.available) _push(`<p class="text-secondary">Привязка Telegram временно недоступна.</p>`);
			else _push(`<!---->`);
			_push(`</section>`);
		};
	}
};
var _sfc_setup$72 = _sfc_main$72.setup;
_sfc_main$72.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/profile/ProfileTelegram.vue");
	return _sfc_setup$72 ? _sfc_setup$72(props, ctx) : void 0;
};
//#endregion
//#region resources/js/composables/useProfileForm.js
function useProfileForm(data) {
	return useActionForm(data, { failureMessage: "Не удалось сохранить изменения. Попробуй ещё раз." });
}
//#endregion
//#region resources/js/composables/useInitialFormFocus.js
var EDITABLE = "input:not([type=\"hidden\"]):not([type=\"radio\"]):not([type=\"checkbox\"]), textarea";
function useInitialFormFocus(formRef, { enabled = true, preventScroll = true } = {}) {
	watch([formRef, () => toValue(enabled)], async ([form, active], previous, onCleanup) => {
		if (!form || !active) return;
		let cancelled = false;
		onCleanup(() => {
			cancelled = true;
		});
		await nextTick();
		if (cancelled) return;
		[...form.querySelectorAll(EDITABLE)].find((element) => !element.matches(":disabled, [readonly]") && !element.closest("[inert]") && element.getClientRects().length > 0 && window.getComputedStyle(element).visibility === "visible")?.focus({ preventScroll });
	}, { flush: "post" });
}
//#endregion
//#region resources/js/components/profile/ProfileIdentity.vue
var _sfc_main$71 = {
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
		passwordAvailable: Boolean,
		locked: Boolean
	},
	setup(__props) {
		const props = __props;
		const editing = shallowRef(false);
		useInitialFormFocus(useTemplateRef("identityForm"), { preventScroll: false });
		const { form, submit } = useProfileForm({
			username: props.user.username ?? "",
			email: props.user.email,
			current_password: ""
		});
		const emailChanged = computed(() => form.email.trim().toLowerCase() !== props.user.email);
		watch(() => props.user, (user) => {
			form.defaults({
				username: user.username ?? "",
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
			if (!editing.value) _push(ssrRenderComponent(_sfc_main$100, {
				label: "Изменить данные",
				size: "sm",
				variant: "accent",
				disabled: __props.locked,
				onClick: ($event) => editing.value = true
			}, null, _parent));
			else _push(`<!---->`);
			_push(`</div>`);
			if (!editing.value) {
				_push(`<dl class="grid min-w-0 grid-cols-1 gap-profile-section text-interface-body"><div class="flex min-w-0 flex-wrap justify-between gap-compact"><dt class="text-secondary">Username</dt><dd class="min-w-0 wrap-anywhere">${ssrInterpolate(__props.user.username || "Не задан")}</dd></div><div class="flex min-w-0 flex-wrap justify-between gap-compact"><dt class="text-secondary">Email</dt><dd class="min-w-0 wrap-anywhere">${ssrInterpolate(__props.user.email)}</dd></div><div class="flex flex-wrap justify-between gap-compact"><dt class="text-secondary">Дата регистрации</dt><dd>`);
				if (__props.user.registeredAt) _push(`<time${ssrRenderAttr("datetime", __props.user.registeredAt)}>${ssrInterpolate(__props.user.registeredLabel)}</time>`);
				else _push(`<span>Не указана</span>`);
				_push(`</dd></div></dl>`);
			} else {
				_push(`<form class="grid min-w-0 grid-cols-1 gap-profile-section"${ssrRenderAttr("aria-busy", unref(form).processing)}>`);
				if (unref(form).errors.form) _push(ssrRenderComponent(_sfc_main$97, {
					variant: "error",
					message: unref(form).errors.form
				}, null, _parent));
				else _push(`<!---->`);
				_push(ssrRenderComponent(_sfc_main$73, {
					id: "profile-username",
					modelValue: unref(form).username,
					"onUpdate:modelValue": ($event) => unref(form).username = $event,
					label: "Username",
					autocomplete: "nickname",
					maxlength: 32,
					hint: "От 3 до 32 символов: латинские буквы, цифры и знак подчёркивания.",
					error: unref(form).errors.username,
					disabled: __props.locked || unref(form).processing
				}, null, _parent));
				_push(ssrRenderComponent(_sfc_main$73, {
					id: "profile-email",
					modelValue: unref(form).email,
					"onUpdate:modelValue": ($event) => unref(form).email = $event,
					label: "Email",
					type: "email",
					autocomplete: "email",
					maxlength: 255,
					error: unref(form).errors.email,
					readonly: !__props.canChangeEmail,
					disabled: __props.locked || unref(form).processing,
					required: ""
				}, null, _parent));
				if (!__props.canChangeEmail) _push(`<p class="text-interface-body text-secondary">${ssrInterpolate(__props.passwordAvailable ? "Чтобы изменить email, сначала заверши настройку подключения в личном кабинете." : "Пароль для этого аккаунта не задан. Смена email недоступна.")}</p>`);
				else _push(`<!---->`);
				if (emailChanged.value) {
					_push(`<!--[--><p class="text-interface-body text-secondary">Подтверди новый адрес по ссылке из письма. Остальные сеансы будут завершены.</p>`);
					_push(ssrRenderComponent(_sfc_main$73, {
						id: "profile-email-password",
						modelValue: unref(form).current_password,
						"onUpdate:modelValue": ($event) => unref(form).current_password = $event,
						label: "Текущий пароль для смены email",
						type: "password",
						autocomplete: "current-password",
						error: unref(form).errors.current_password,
						disabled: __props.locked || unref(form).processing,
						required: ""
					}, null, _parent));
					_push(`<!--]-->`);
				} else _push(`<!---->`);
				_push(`<div class="flex flex-wrap gap-compact">`);
				_push(ssrRenderComponent(_sfc_main$100, {
					type: "submit",
					label: "Сохранить данные",
					"loading-label": "Сохраняем…",
					loading: unref(form).processing,
					disabled: __props.locked
				}, null, _parent));
				_push(ssrRenderComponent(_sfc_main$100, {
					label: "Отмена",
					variant: "ghost",
					disabled: __props.locked || unref(form).processing,
					onClick: cancel
				}, null, _parent));
				_push(`</div></form>`);
			}
			if (unref(form).recentlySuccessful) _push(`<p role="status" class="text-interface-body text-success">Данные сохранены</p>`);
			else _push(`<!---->`);
			_push(ssrRenderComponent(_sfc_main$72, { connection: __props.telegramConnection }, null, _parent));
			_push(`</section>`);
		};
	}
};
var _sfc_setup$71 = _sfc_main$71.setup;
_sfc_main$71.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/profile/ProfileIdentity.vue");
	return _sfc_setup$71 ? _sfc_setup$71(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/profile/ProfileSecurity.vue
var rowClass = "flex min-h-interface-control w-full min-w-0 cursor-pointer items-center gap-tight rounded-button border border-border bg-interface-input px-interface-inline py-compact text-left text-interface-body font-medium outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus disabled:cursor-not-allowed disabled:opacity-60";
var _sfc_main$70 = {
	__name: "ProfileSecurity",
	__ssrInlineRender: true,
	props: {
		passwordAvailable: Boolean,
		disabled: Boolean
	},
	setup(__props) {
		const active = shallowRef(null);
		const password = useProfileForm({
			current_password: "",
			password: "",
			password_confirmation: ""
		});
		const sessions = useProfileForm({});
		useInitialFormFocus(useTemplateRef("passwordForm"), { preventScroll: false });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				"aria-labelledby": "profile-security-title",
				class: "grid min-w-0 grid-cols-1 gap-account-group"
			}, _attrs))}><h2 id="profile-security-title" class="text-interface-title font-display">Безопасность</h2>`);
			if (!__props.passwordAvailable) _push(`<p class="text-interface-body text-secondary">Пароль для этого аккаунта не задан. Смена пароля недоступна.</p>`);
			else {
				_push(`<!--[--><button type="button" class="${ssrRenderClass(rowClass)}"${ssrRenderAttr("aria-expanded", active.value === "password")} aria-controls="profile-password-form"${ssrIncludeBooleanAttr(__props.disabled || unref(sessions).form.processing) ? " disabled" : ""}>`);
				_push(ssrRenderComponent(_sfc_main$101, {
					name: "keyRound",
					size: "profileAction",
					class: "shrink-0 text-accent-text"
				}, null, _parent));
				_push(`<span class="min-w-0 flex-1 wrap-anywhere">Изменить пароль</span>`);
				_push(ssrRenderComponent(_sfc_main$101, {
					name: "chevronRight",
					size: "profileAction",
					class: ["shrink-0 text-muted transition-transform duration-200 motion-reduce:transition-none", { "rotate-90": active.value === "password" }]
				}, null, _parent));
				_push(`</button>`);
				if (active.value === "password") {
					_push(`<form id="profile-password-form" class="grid min-w-0 grid-cols-1 gap-profile-section"${ssrRenderAttr("aria-busy", unref(password).form.processing)}>`);
					if (unref(password).form.errors.form) _push(ssrRenderComponent(_sfc_main$97, {
						variant: "error",
						message: unref(password).form.errors.form
					}, null, _parent));
					else _push(`<!---->`);
					_push(ssrRenderComponent(_sfc_main$73, {
						id: "profile-current-password",
						modelValue: unref(password).form.current_password,
						"onUpdate:modelValue": ($event) => unref(password).form.current_password = $event,
						type: "password",
						label: "Текущий пароль",
						autocomplete: "current-password",
						disabled: __props.disabled || unref(password).form.processing,
						error: unref(password).form.errors.current_password,
						required: ""
					}, null, _parent));
					_push(ssrRenderComponent(_sfc_main$73, {
						id: "profile-new-password",
						modelValue: unref(password).form.password,
						"onUpdate:modelValue": ($event) => unref(password).form.password = $event,
						type: "password",
						label: "Новый пароль",
						autocomplete: "new-password",
						disabled: __props.disabled || unref(password).form.processing,
						error: unref(password).form.errors.password,
						required: ""
					}, null, _parent));
					_push(ssrRenderComponent(_sfc_main$73, {
						id: "profile-password-confirmation",
						modelValue: unref(password).form.password_confirmation,
						"onUpdate:modelValue": ($event) => unref(password).form.password_confirmation = $event,
						type: "password",
						label: "Повтори новый пароль",
						autocomplete: "new-password",
						disabled: __props.disabled || unref(password).form.processing,
						error: unref(password).form.errors.password_confirmation,
						required: ""
					}, null, _parent));
					_push(`<p class="text-interface-body text-secondary">После смены пароля другие сеансы будут завершены. Этот сеанс останется открытым.</p>`);
					_push(ssrRenderComponent(_sfc_main$100, {
						type: "submit",
						label: "Сохранить пароль",
						"loading-label": "Сохраняем…",
						loading: unref(password).form.processing,
						disabled: __props.disabled,
						"full-width": ""
					}, null, _parent));
					if (unref(password).form.recentlySuccessful) _push(`<p role="status" class="text-interface-body text-success">Пароль изменён. Другие сеансы завершены.</p>`);
					else _push(`<!---->`);
					_push(`</form>`);
				} else _push(`<!---->`);
				_push(`<!--]-->`);
			}
			_push(`<button type="button" class="${ssrRenderClass(rowClass)}"${ssrRenderAttr("aria-busy", unref(sessions).form.processing)}${ssrIncludeBooleanAttr(__props.disabled || unref(password).form.processing || unref(sessions).form.processing) ? " disabled" : ""}>`);
			_push(ssrRenderComponent(_sfc_main$101, {
				name: unref(sessions).form.processing ? "loader" : "logOut",
				size: "profileAction",
				class: "shrink-0 text-error"
			}, null, _parent));
			_push(`<span class="min-w-0 flex-1 wrap-anywhere">Завершить другие сеансы</span></button>`);
			if (unref(sessions).form.errors.form) _push(ssrRenderComponent(_sfc_main$97, {
				variant: "error",
				message: unref(sessions).form.errors.form
			}, null, _parent));
			else _push(`<!---->`);
			if (unref(sessions).form.recentlySuccessful) _push(`<p role="status" class="text-interface-body text-success">Другие сеансы завершены. Этот сеанс остаётся открытым.</p>`);
			else _push(`<!---->`);
			_push(`</section>`);
		};
	}
};
var _sfc_setup$70 = _sfc_main$70.setup;
_sfc_main$70.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/profile/ProfileSecurity.vue");
	return _sfc_setup$70 ? _sfc_setup$70(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/profile/ProfileTheme.vue
var _sfc_main$69 = {
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
			_push(`<fieldset${ssrRenderAttrs(mergeProps({ class: "grid min-w-0 grid-cols-1 gap-profile-section" }, _attrs))}><legend class="mb-account-group text-interface-title font-display">Тема оформления</legend><div class="grid min-h-interface-control min-w-0 grid-cols-2 gap-profile-theme-inset rounded-button border border-border bg-interface-input p-profile-theme-inset"><!--[-->`);
			ssrRenderList(choices, (choice) => {
				_push(`<label class="${ssrRenderClass([unref(activeTheme) === choice.value ? "border-accent bg-accent-soft font-semibold text-accent-text" : "border-transparent font-medium text-secondary hover:bg-accent-soft", "relative flex min-w-0 cursor-pointer items-center justify-center rounded-control border px-control py-tight text-interface-meta outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"])}"><input type="radio" name="profile-theme"${ssrRenderAttr("value", choice.value)}${ssrIncludeBooleanAttr(unref(activeTheme) === choice.value) ? " checked" : ""} class="sr-only"> ${ssrInterpolate(choice.label)}</label>`);
			});
			_push(`<!--]--></div></fieldset>`);
		};
	}
};
var _sfc_setup$69 = _sfc_main$69.setup;
_sfc_main$69.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/profile/ProfileTheme.vue");
	return _sfc_setup$69 ? _sfc_setup$69(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/profile/ProfileLogout.vue
var _sfc_main$68 = {
	__name: "ProfileLogout",
	__ssrInlineRender: true,
	setup(__props) {
		const { form, submit: submitAction } = useActionForm({});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<form${ssrRenderAttrs(mergeProps({
				class: "grid min-w-0 gap-profile-section",
				"aria-busy": unref(form).processing
			}, _attrs))}>`);
			if (unref(form).errors.form) _push(ssrRenderComponent(_sfc_main$97, {
				variant: "error",
				message: unref(form).errors.form
			}, null, _parent));
			else _push(`<!---->`);
			_push(ssrRenderComponent(_sfc_main$100, {
				type: "submit",
				variant: "accountLogout",
				loading: unref(form).processing,
				"loading-label": "Выходим…",
				"full-width": ""
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_sfc_main$101, {
							name: "logOut",
							size: "profileAction"
						}, null, _parent, _scopeId));
						_push(`<span${_scopeId}>Выйти из аккаунта</span>`);
					} else return [createVNode(_sfc_main$101, {
						name: "logOut",
						size: "profileAction"
					}), createVNode("span", null, "Выйти из аккаунта")];
				}),
				_: 1
			}, _parent));
			_push(`</form>`);
		};
	}
};
var _sfc_setup$68 = _sfc_main$68.setup;
_sfc_main$68.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/profile/ProfileLogout.vue");
	return _sfc_setup$68 ? _sfc_setup$68(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Account/Profile.vue
var Profile_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$67 });
var _sfc_main$67 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
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
		}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Мой профиль" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$91, {
				"page-title": "Профиль",
				"content-spacing": "profile"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid min-w-0 grid-cols-1 gap-account-section"${_scopeId}><h1 class="text-interface-heading font-display tracking-interface-heading wrap-anywhere"${_scopeId}>Мой профиль</h1>`);
						_push(ssrRenderComponent(_sfc_main$71, {
							user: __props.user,
							"telegram-connection": __props.telegramConnection,
							"can-change-email": __props.securityCapabilities.changeEmail,
							"password-available": __props.securityCapabilities.password,
							locked: __props.securityCapabilities.merging
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$70, {
							"password-available": __props.securityCapabilities.password,
							disabled: __props.securityCapabilities.merging
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$69, null, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$68, null, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "grid min-w-0 grid-cols-1 gap-account-section" }, [
						createVNode("h1", { class: "text-interface-heading font-display tracking-interface-heading wrap-anywhere" }, "Мой профиль"),
						createVNode(_sfc_main$71, {
							user: __props.user,
							"telegram-connection": __props.telegramConnection,
							"can-change-email": __props.securityCapabilities.changeEmail,
							"password-available": __props.securityCapabilities.password,
							locked: __props.securityCapabilities.merging
						}, null, 8, [
							"user",
							"telegram-connection",
							"can-change-email",
							"password-available",
							"locked"
						]),
						createVNode(_sfc_main$70, {
							"password-available": __props.securityCapabilities.password,
							disabled: __props.securityCapabilities.merging
						}, null, 8, ["password-available", "disabled"]),
						createVNode(_sfc_main$69),
						createVNode(_sfc_main$68)
					])];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
});
var _sfc_setup$67 = _sfc_main$67.setup;
_sfc_main$67.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Profile.vue");
	return _sfc_setup$67 ? _sfc_setup$67(props, ctx) : void 0;
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
var _sfc_main$66 = {
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
		const channels = computed(() => [{
			value: "web",
			label: "На сайт",
			disabled: !props.webInviteUrl
		}, {
			value: "telegram",
			label: "В Telegram",
			disabled: !props.telegramInviteUrl
		}]);
		const { busy, feedback, manual, share } = useInviteShare(selectedUrl);
		const id = useId();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				"aria-labelledby": "referral-link-title",
				class: "grid min-w-0 grid-cols-1 gap-account-connection-gap rounded-panel border border-account-card-border bg-surface p-account-connection"
			}, _attrs))}><h2 id="referral-link-title" class="text-interface-title font-display">Твоя ссылка для друзей</h2>`);
			if (__props.webInviteUrl || __props.telegramInviteUrl) {
				_push(`<!--[--><label${ssrRenderAttr("id", `${unref(id)}-label`)}${ssrRenderAttr("for", unref(id))} class="text-interface-body text-secondary">Куда приглашаем</label>`);
				_push(ssrRenderComponent(_sfc_main$85, {
					id: unref(id),
					modelValue: channel.value,
					"onUpdate:modelValue": ($event) => channel.value = $event,
					"aria-labelledby": `${unref(id)}-label`,
					disabled: unref(busy),
					options: channels.value
				}, null, _parent));
				if (selectedUrl.value) _push(ssrRenderComponent(_sfc_main$88, {
					key: selectedUrl.value,
					value: selectedUrl.value,
					variant: "referral",
					"copy-label": "Скопировать приглашение"
				}, null, _parent));
				else _push(`<!---->`);
				_push(ssrRenderComponent(_sfc_main$100, {
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
							_push(ssrRenderComponent(_sfc_main$101, {
								name: "share",
								size: "referralShare"
							}, null, _parent, _scopeId));
							_push(`<span${_scopeId}>Поделиться</span>`);
						} else return [createVNode(_sfc_main$101, {
							name: "share",
							size: "referralShare"
						}), createVNode("span", null, "Поделиться")];
					}),
					_: 1
				}, _parent));
				if (unref(feedback)) _push(`<p role="status" class="text-interface-body text-secondary">${ssrInterpolate(unref(feedback))}</p>`);
				else _push(`<!---->`);
				if (unref(manual)) _push(`<div class="grid min-w-0 gap-interface-field-gap"><label${ssrRenderAttr("for", `${unref(id)}-manual`)} class="text-interface-body text-secondary">Приглашение для ручного копирования</label><input${ssrRenderAttr("id", `${unref(id)}-manual`)}${ssrRenderAttr("value", selectedUrl.value)} readonly class="min-h-interface-control min-w-0 w-full rounded-button border border-interface-field-border bg-interface-input px-interface-inline font-mono text-interface-body outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"></div>`);
				else _push(`<!---->`);
				if (!__props.telegramInviteUrl) _push(`<p class="text-interface-body text-secondary">Приглашение в Telegram сейчас недоступно. Можно пригласить друга на сайт.</p>`);
				else _push(`<!---->`);
				_push(`<!--]-->`);
			} else _push(`<p role="status" class="text-interface-body text-secondary">Ссылки приглашения пока недоступны. Дождись подключения аккаунта и обнови страницу.</p>`);
			_push(`</section>`);
		};
	}
};
var _sfc_setup$66 = _sfc_main$66.setup;
_sfc_main$66.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/referral/ReferralInviteCard.vue");
	return _sfc_setup$66 ? _sfc_setup$66(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/referral/ReferralMetrics.vue
var _sfc_main$65 = {
	__name: "ReferralMetrics",
	__ssrInlineRender: true,
	props: { metrics: {
		type: Object,
		required: true
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<dl${ssrRenderAttrs(mergeProps({ class: "grid min-w-0 grid-cols-2 gap-referral-stat-gap" }, _attrs))}><div class="grid min-h-referral-stat-height min-w-0 content-center gap-control rounded-referral-stat border border-border bg-interface-input p-referral-stat"><dd class="order-first font-mono text-interface-body wrap-anywhere">${ssrInterpolate(__props.metrics.invitedCount)}</dd><dt class="text-interface-body text-secondary wrap-anywhere">Приглашено друзей</dt></div><div class="grid min-h-referral-stat-height min-w-0 content-center gap-control rounded-referral-stat border border-border bg-interface-input p-referral-stat"><dd class="order-first font-mono text-interface-body wrap-anywhere">${ssrInterpolate(unref(daysLabel)(__props.metrics.bonusDays))}</dd><dt class="text-interface-body text-secondary wrap-anywhere">Получено бонусов</dt></div></dl>`);
		};
	}
};
var _sfc_setup$65 = _sfc_main$65.setup;
_sfc_main$65.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/referral/ReferralMetrics.vue");
	return _sfc_setup$65 ? _sfc_setup$65(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Account/Referral/Index.vue
var Index_exports$1 = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$64 });
var _sfc_main$64 = {
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
			_push(ssrRenderComponent(_sfc_main$91, { "page-title": "Пригласить друга" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid min-w-0 grid-cols-1 gap-account-section"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$90, {
							title: "Хорошим делятся.",
							description: "Приглашай друзей в dudeweb по своей ссылке и получай бонусы по условиям программы."
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(Link), {
							href: "/account/referral/terms",
							class: "flex min-h-interface-control min-w-0 items-center gap-compact rounded-button border border-border bg-interface-input px-interface-inline py-control text-interface-action font-bold text-foreground outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(_sfc_main$101, {
										name: "file-text",
										size: "detail",
										class: "text-accent-text"
									}, null, _parent, _scopeId));
									_push(`<span class="min-w-0 flex-1"${_scopeId}>Условия партнёрской программы</span>`);
									_push(ssrRenderComponent(_sfc_main$101, {
										name: "chevronRight",
										size: "detail",
										class: "text-muted"
									}, null, _parent, _scopeId));
								} else return [
									createVNode(_sfc_main$101, {
										name: "file-text",
										size: "detail",
										class: "text-accent-text"
									}),
									createVNode("span", { class: "min-w-0 flex-1" }, "Условия партнёрской программы"),
									createVNode(_sfc_main$101, {
										name: "chevronRight",
										size: "detail",
										class: "text-muted"
									})
								];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$66, {
							"web-invite-url": __props.webInviteUrl,
							"telegram-invite-url": __props.telegramInviteUrl
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$65, { metrics: __props.metrics }, null, _parent, _scopeId));
						_push(`<section class="grid min-w-0 grid-cols-1 justify-items-center gap-referral-empty-gap rounded-card border border-border bg-interface-input p-referral-empty text-center" aria-labelledby="referral-state-title"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$101, {
							name: "users",
							size: "lg",
							class: "text-muted"
						}, null, _parent, _scopeId));
						_push(`<h2 id="referral-state-title" class="max-w-full text-interface-title font-display wrap-anywhere"${_scopeId}>${ssrInterpolate(__props.metrics.invitedCount === 0 ? "Пока никто не присоединился по твоей ссылке." : "Друзья уже присоединились по твоей ссылке.")}</h2><p class="text-interface-body text-secondary"${_scopeId}>${ssrInterpolate(__props.metrics.invitedCount === 0 ? "Поделись приглашением с друзьями." : "Продолжай делиться приглашением. Начисленные бонусы появятся в статистике.")}</p></section></div>`);
					} else return [createVNode("div", { class: "grid min-w-0 grid-cols-1 gap-account-section" }, [
						createVNode(_sfc_main$90, {
							title: "Хорошим делятся.",
							description: "Приглашай друзей в dudeweb по своей ссылке и получай бонусы по условиям программы."
						}),
						createVNode(unref(Link), {
							href: "/account/referral/terms",
							class: "flex min-h-interface-control min-w-0 items-center gap-compact rounded-button border border-border bg-interface-input px-interface-inline py-control text-interface-action font-bold text-foreground outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
						}, {
							default: withCtx(() => [
								createVNode(_sfc_main$101, {
									name: "file-text",
									size: "detail",
									class: "text-accent-text"
								}),
								createVNode("span", { class: "min-w-0 flex-1" }, "Условия партнёрской программы"),
								createVNode(_sfc_main$101, {
									name: "chevronRight",
									size: "detail",
									class: "text-muted"
								})
							]),
							_: 1
						}),
						createVNode(_sfc_main$66, {
							"web-invite-url": __props.webInviteUrl,
							"telegram-invite-url": __props.telegramInviteUrl
						}, null, 8, ["web-invite-url", "telegram-invite-url"]),
						createVNode(_sfc_main$65, { metrics: __props.metrics }, null, 8, ["metrics"]),
						createVNode("section", {
							class: "grid min-w-0 grid-cols-1 justify-items-center gap-referral-empty-gap rounded-card border border-border bg-interface-input p-referral-empty text-center",
							"aria-labelledby": "referral-state-title"
						}, [
							createVNode(_sfc_main$101, {
								name: "users",
								size: "lg",
								class: "text-muted"
							}),
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
var _sfc_setup$64 = _sfc_main$64.setup;
_sfc_main$64.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Referral/Index.vue");
	return _sfc_setup$64 ? _sfc_setup$64(props, ctx) : void 0;
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
var _sfc_main$63 = {
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
			_push(ssrRenderComponent(_sfc_main$101, { name: "gift" }, null, _parent));
			_push(`</span><div class="grid min-w-0 gap-control"><h2 id="friend-benefit-title" class="text-interface-title font-display">Бонус для друга</h2><p class="text-interface-body text-secondary">${ssrInterpolate(__props.friendDiscountPercent)}% на первую покупку подписки</p></div></section><ol aria-label="Как работает программа" class="grid gap-account-group"><!--[-->`);
			ssrRenderList(steps.value, (step, index) => {
				_push(`<li class="flex min-w-0 items-center gap-referral-step-gap rounded-button border border-border bg-interface-input p-referral-step"><span aria-hidden="true" class="inline-flex size-referral-number shrink-0 items-center justify-center rounded-control bg-accent-soft font-sans text-account-step-number font-step-number text-accent-text">${ssrInterpolate(index + 1)}</span><div class="grid min-w-0 gap-control"><h2 class="text-interface-title font-display">${ssrInterpolate(step.title)}</h2><p class="text-interface-body text-secondary">${ssrInterpolate(step.description)}</p></div></li>`);
			});
			_push(`<!--]--></ol><section aria-labelledby="reward-matrix-title" class="grid min-w-0 grid-cols-1 gap-account-group"><h2 id="reward-matrix-title" class="text-interface-title font-display">Твой бонус</h2><div class="rounded-button border border-border bg-interface-input px-referral-table py-tight"><table class="w-full text-interface-body"><caption class="sr-only">Бонус за оплаченный другом период подписки</caption><tbody><!--[-->`);
			ssrRenderList(__props.rewardMatrix, (row) => {
				_push(`<tr><th scope="row" class="py-referral-table-row pr-tight text-left font-normal text-secondary">Друг оплатил ${ssrInterpolate(unref(monthsLabel)(row.months))}</th><td class="py-referral-table-row text-right text-success wrap-anywhere">+${ssrInterpolate(unref(daysLabel)(row.days))}</td></tr>`);
			});
			_push(`<!--]--></tbody></table></div></section><!--]-->`);
		};
	}
};
var _sfc_setup$63 = _sfc_main$63.setup;
_sfc_main$63.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/referral/ReferralTermsContent.vue");
	return _sfc_setup$63 ? _sfc_setup$63(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Account/Referral/Terms.vue
var Terms_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$62 });
var _sfc_main$62 = {
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
			_push(ssrRenderComponent(_sfc_main$91, {
				"page-title": "Условия программы",
				"content-spacing": "referralTerms"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid min-w-0 grid-cols-1 gap-account-section"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Link), {
							href: "/account/referral",
							class: "inline-flex min-h-10 items-center justify-self-start gap-compact rounded-control text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(_sfc_main$101, {
										name: "arrowLeft",
										size: "sm"
									}, null, _parent, _scopeId));
									_push(`Назад к приглашениям`);
								} else return [createVNode(_sfc_main$101, {
									name: "arrowLeft",
									size: "sm"
								}), createTextVNode("Назад к приглашениям")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$90, {
							title: "Партнёрская программа",
							description: "Условия для участия простые."
						}, null, _parent, _scopeId));
						if (__props.termsAvailable) _push(ssrRenderComponent(_sfc_main$63, {
							"friend-discount-percent": __props.friendDiscountPercent,
							"reward-matrix": __props.rewardMatrix
						}, null, _parent, _scopeId));
						else _push(ssrRenderComponent(_sfc_main$87, {
							state: "serviceError",
							title: "Условия программы сейчас недоступны.",
							description: "Попробуй открыть страницу позже или напиши в поддержку."
						}, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "grid min-w-0 grid-cols-1 gap-account-section" }, [
						createVNode(unref(Link), {
							href: "/account/referral",
							class: "inline-flex min-h-10 items-center justify-self-start gap-compact rounded-control text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
						}, {
							default: withCtx(() => [createVNode(_sfc_main$101, {
								name: "arrowLeft",
								size: "sm"
							}), createTextVNode("Назад к приглашениям")]),
							_: 1
						}),
						createVNode(_sfc_main$90, {
							title: "Партнёрская программа",
							description: "Условия для участия простые."
						}),
						__props.termsAvailable ? (openBlock(), createBlock(_sfc_main$63, {
							key: 0,
							"friend-discount-percent": __props.friendDiscountPercent,
							"reward-matrix": __props.rewardMatrix
						}, null, 8, ["friend-discount-percent", "reward-matrix"])) : (openBlock(), createBlock(_sfc_main$87, {
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
var _sfc_setup$62 = _sfc_main$62.setup;
_sfc_main$62.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Referral/Terms.vue");
	return _sfc_setup$62 ? _sfc_setup$62(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/subscription/SubscriptionOverview.vue
var _sfc_main$61 = {
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
				class: "grid min-w-0 gap-subscription-overview rounded-subscription-overview border border-account-card-border bg-surface p-control-inline"
			}, _attrs))}><div class="flex flex-wrap items-center justify-between gap-compact"><h2 class="text-interface-title font-display wrap-anywhere">${ssrInterpolate(__props.subscription.planName)}</h2>`);
			_push(ssrRenderComponent(_sfc_main$80, { status: __props.subscription.state }, null, _parent));
			_push(`</div><dl class="flex flex-wrap justify-between gap-content text-interface-body"><div class="grid gap-0.5"><dt class="text-secondary">${ssrInterpolate(__props.subscription.state === "expired" ? "Действовала до" : "Действует до")}</dt><dd><time${ssrRenderAttr("datetime", __props.subscription.expiresAt)}>${ssrInterpolate(__props.subscription.expiresOn)}</time></dd></div><div class="grid gap-0.5 text-right"><dt class="text-secondary">Осталось</dt><dd>${ssrInterpolate(unref(daysLabel)(__props.subscription.remainingDays))}</dd></div></dl></section>`);
		};
	}
};
var _sfc_setup$61 = _sfc_main$61.setup;
_sfc_main$61.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/subscription/SubscriptionOverview.vue");
	return _sfc_setup$61 ? _sfc_setup$61(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/subscription/PeriodSelector.vue
var _sfc_main$60 = {
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
				_push(`<label class="${ssrRenderClass(["relative flex min-h-interface-control min-w-0 cursor-pointer items-center justify-center rounded-menu-item border px-tight py-compact text-center text-interface-body font-semibold wrap-anywhere transition-colors duration-200 motion-reduce:transition-none outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus", optionClass(option)])}"><input${ssrIncludeBooleanAttr(ssrLooseEqual(model.value, option.value)) ? " checked" : ""}${ssrIncludeBooleanAttr(__props.disabled || __props.loading || option.disabled) ? " disabled" : ""}${ssrRenderAttr("name", __props.name)}${ssrRenderAttr("value", option.value)} class="sr-only" type="radio"> ${ssrInterpolate(option.label)}</label>`);
			});
			_push(`<!--]--></div></fieldset>`);
		};
	}
};
var _sfc_setup$60 = _sfc_main$60.setup;
_sfc_main$60.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/subscription/PeriodSelector.vue");
	return _sfc_setup$60 ? _sfc_setup$60(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/subscription/SubscriptionSummary.vue
var _sfc_main$59 = {
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
			_push(`<dl${ssrRenderAttrs(mergeProps({ class: "grid gap-compact rounded-card border border-border bg-interface-input p-control-inline" }, _attrs))}><!--[-->`);
			ssrRenderList(rows.value, (row) => {
				_push(`<div class="flex flex-wrap items-center justify-between gap-compact"><dt class="text-interface-body text-muted">${ssrInterpolate(row.label)}</dt><dd class="min-w-0 text-right text-interface-body font-medium wrap-anywhere text-secondary">${ssrInterpolate(row.value)}</dd></div>`);
			});
			_push(`<!--]--><div class="flex flex-wrap items-center justify-between gap-compact"><dt class="text-interface-body text-muted">К оплате</dt><dd class="min-w-0 text-right text-interface-body font-display wrap-anywhere text-foreground">${ssrInterpolate(__props.total)}</dd></div></dl>`);
		};
	}
};
var _sfc_setup$59 = _sfc_main$59.setup;
_sfc_main$59.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/subscription/SubscriptionSummary.vue");
	return _sfc_setup$59 ? _sfc_setup$59(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/subscription/PromoCodeSheet.vue
var _sfc_main$58 = {
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
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "grid min-h-promo-sheet w-full gap-control-inline rounded-t-sheet border-t border-account-overlay-border bg-elevated px-shell-gutter pt-subscription-section pb-panel desktop:rounded-sheet desktop:border desktop:p-panel" }, _attrs))}><div aria-hidden="true" class="flex h-promo-handle items-center justify-center desktop:hidden"><span class="h-1 w-10 rounded-full bg-account-sheet-handle"></span></div><header class="flex min-h-promo-header items-center justify-between gap-content"><div class="grid gap-0.5"><h2 id="promo-title" class="text-interface-title font-display text-foreground">Промокод</h2><p id="promo-description" class="text-interface-body text-secondary">Введи код перед оплатой</p></div>`);
			_push(ssrRenderComponent(_sfc_main$100, {
				"aria-label": "Закрыть промокод",
				disabled: __props.processing,
				size: "overlayClose",
				variant: "overlayClose",
				onClick: ($event) => emit("close")
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$101, { name: "x" }, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$101, { name: "x" })];
				}),
				_: 1
			}, _parent));
			_push(`</header><form class="grid gap-control-inline">`);
			_push(ssrRenderComponent(_sfc_main$73, {
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
			_push(ssrRenderComponent(_sfc_main$100, {
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
			_push(ssrRenderComponent(_sfc_main$101, {
				name: "info",
				size: "sm"
			}, null, _parent));
			_push(`<span>${ssrInterpolate(__props.note)}</span></p></section>`);
		};
	}
};
var _sfc_setup$58 = _sfc_main$58.setup;
_sfc_main$58.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/subscription/PromoCodeSheet.vue");
	return _sfc_setup$58 ? _sfc_setup$58(props, ctx) : void 0;
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
var _sfc_main$57 = {
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "grid min-w-0 gap-account-group" }, _attrs))}><section class="grid gap-account-group" aria-labelledby="period-heading"><div class="flex flex-wrap items-center justify-between gap-compact"><h2 id="period-heading" class="text-interface-title font-display">Выбери период</h2>`);
			if (unref(catalogue).plan) _push(`<p class="font-mono text-interface-body text-accent-text">${ssrInterpolate(unref(catalogue).plan.name)}</p>`);
			else _push(`<!---->`);
			_push(`</div>`);
			_push(ssrRenderComponent(_sfc_main$60, {
				modelValue: unref(productId),
				"onUpdate:modelValue": ($event) => isRef(productId) ? productId.value = $event : null,
				disabled: unref(busy),
				options: unref(options)
			}, null, _parent));
			_push(`</section>`);
			_push(ssrRenderComponent(_sfc_main$59, summary.value, null, _parent));
			if (unref(catalogue).discount) {
				_push(`<div role="status" class="grid gap-compact rounded-button border border-success/40 bg-success-soft p-control-inline text-interface-body text-success"><p>${ssrInterpolate(unref(catalogue).discount.automatic ? "Автоматическая скидка" : `Промокод ${unref(catalogue).discount.code} применён`)}: ${ssrInterpolate(summary.value.discount)}</p>`);
				if (!unref(catalogue).discount.automatic) _push(ssrRenderComponent(_sfc_main$100, {
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
			_push(`<button type="button"${ssrIncludeBooleanAttr(unref(busy) || !unref(selected) || unref(catalogue).discount?.automatic) ? " disabled" : ""} class="inline-flex min-h-interface-control w-full cursor-pointer items-center gap-subscription-section rounded-button border border-border bg-interface-input px-interface-inline py-tight text-left text-interface-body font-medium text-foreground hover:bg-surface outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus disabled:cursor-not-allowed disabled:opacity-60">`);
			_push(ssrRenderComponent(_sfc_main$101, {
				name: "ticket-percent",
				size: "detail",
				class: "text-accent-text"
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
			_push(ssrRenderComponent(_sfc_main$100, {
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
			_push(ssrRenderComponent(_sfc_main$92, {
				id: "subscription-promo",
				open: unref(promoOpen),
				busy: unref(promo).processing,
				"top-offset": unref(headerHeight),
				"labelled-by": "promo-title",
				"described-by": "promo-description",
				"initial-focus": "#promo-code",
				variant: "promo",
				onClose: ($event) => promoOpen.value = false
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$58, {
						modelValue: unref(promo).promocode,
						"onUpdate:modelValue": ($event) => unref(promo).promocode = $event,
						error: unref(promo).errors.promocode,
						processing: unref(promo).processing,
						onApply: ($event) => unref(applyPromo)(),
						onClose: ($event) => promoOpen.value = false
					}, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$58, {
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
var _sfc_setup$57 = _sfc_main$57.setup;
_sfc_main$57.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/subscription/SubscriptionCheckout.vue");
	return _sfc_setup$57 ? _sfc_setup$57(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/subscription/PaymentHistory.vue
var _sfc_main$56 = {
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
				class: "grid min-w-0 gap-account-group"
			}, _attrs))}><h2 id="payment-history-title" class="text-interface-title font-display">История платежей</h2>`);
			if (!__props.payments.data.length) {
				_push(`<p class="flex min-h-interface-control items-center gap-subscription-section rounded-button border border-border bg-interface-input px-control-inline py-compact text-interface-body text-secondary">`);
				_push(ssrRenderComponent(_sfc_main$101, {
					name: "receipt",
					size: "detail",
					class: "text-muted"
				}, null, _parent));
				_push(` Здесь пока нет платежей. </p>`);
			} else {
				_push(`<ul class="grid min-w-0 gap-account-group"><!--[-->`);
				ssrRenderList(__props.payments.data, (payment) => {
					_push(`<li>`);
					_push(ssrRenderComponent(unref(Link), {
						href: payment.url,
						class: "flex flex-wrap items-center justify-between gap-content rounded-button border border-border bg-interface-input p-control-inline text-interface-body outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
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
					class: "rounded-control font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
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
					class: "rounded-control font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
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
var _sfc_setup$56 = _sfc_main$56.setup;
_sfc_main$56.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/subscription/PaymentHistory.vue");
	return _sfc_setup$56 ? _sfc_setup$56(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Account/Subscription.vue
var Subscription_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$55 });
var _sfc_main$55 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "Subscription",
	__ssrInlineRender: true,
	props: {
		subscription: {
			type: Object,
			default: null
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
			_push(ssrRenderComponent(_sfc_main$91, {
				"page-title": "Подписка",
				"content-spacing": "subscription"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid min-w-0 gap-account-section"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$90, {
							title: "Твоя подписка",
							description: "Управляй периодом и продлевай доступ."
						}, null, _parent, _scopeId));
						if (__props.subscription) _push(ssrRenderComponent(_sfc_main$61, { subscription: __props.subscription }, null, _parent, _scopeId));
						else _push(`<p role="alert" class="rounded-card border border-border bg-surface p-control-inline text-interface-body text-secondary"${_scopeId}>Не удалось загрузить текущую подписку. Обнови страницу, чтобы проверить срок доступа.</p>`);
						if (!__props.catalogue.products.length) _push(`<p role="status" class="text-interface-body text-secondary"${_scopeId}>Сейчас нет доступных периодов для оплаты. Попробуй позже.</p>`);
						else _push(`<!---->`);
						_push(ssrRenderComponent(_sfc_main$57, { catalogue: __props.catalogue }, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$56, { payments: __props.payments }, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "grid min-w-0 gap-account-section" }, [
						createVNode(_sfc_main$90, {
							title: "Твоя подписка",
							description: "Управляй периодом и продлевай доступ."
						}),
						__props.subscription ? (openBlock(), createBlock(_sfc_main$61, {
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
						createVNode(_sfc_main$57, { catalogue: __props.catalogue }, null, 8, ["catalogue"]),
						createVNode(_sfc_main$56, { payments: __props.payments }, null, 8, ["payments"])
					])];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
});
var _sfc_setup$55 = _sfc_main$55.setup;
_sfc_main$55.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Subscription.vue");
	return _sfc_setup$55 ? _sfc_setup$55(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/support/SupportTicketForm.vue
var _sfc_main$54 = {
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
		useInitialFormFocus(useTemplateRef("ticketForm"), { preventScroll: false });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<form${ssrRenderAttrs(mergeProps({
				ref: "ticketForm",
				class: "grid min-w-0 grid-cols-1 gap-account-group",
				"aria-busy": unref(form).processing
			}, _attrs))}>`);
			if (unref(form).errors.form) _push(ssrRenderComponent(_sfc_main$97, {
				variant: "error",
				message: unref(form).errors.form
			}, null, _parent));
			else _push(`<!---->`);
			_push(ssrRenderComponent(_sfc_main$73, {
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
			_push(`<div class="grid min-w-0 grid-cols-1 gap-interface-field-gap"><label for="support-body" class="text-interface-body font-medium text-secondary">Сообщение</label><textarea id="support-body"${ssrRenderAttr("maxlength", __props.bodyMax)}${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${ssrRenderAttr("aria-invalid", Boolean(unref(form).errors.body))}${ssrRenderAttr("aria-describedby", unref(form).errors.body ? "support-body-error" : void 0)} placeholder="Расскажи подробнее, что произошло…" required class="min-h-support-message min-w-0 w-full resize-y rounded-button border border-interface-field-border bg-interface-input p-interface-inline text-interface-body placeholder:text-muted outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus disabled:opacity-60">${ssrInterpolate(unref(form).body)}</textarea>`);
			if (unref(form).errors.body) _push(`<p id="support-body-error" role="alert" class="text-interface-body text-error">${ssrInterpolate(unref(form).errors.body)}</p>`);
			else _push(`<!---->`);
			_push(`</div>`);
			_push(ssrRenderComponent(_sfc_main$100, {
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
var _sfc_setup$54 = _sfc_main$54.setup;
_sfc_main$54.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/support/SupportTicketForm.vue");
	return _sfc_setup$54 ? _sfc_setup$54(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Account/Support/Create.vue
var Create_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$53 });
var _sfc_main$53 = {
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
			_push(ssrRenderComponent(_sfc_main$91, { "page-title": "Новое обращение" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid min-w-0 grid-cols-1 gap-account-section"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$90, {
							title: "Напиши нам",
							description: "Опиши ситуацию — ответим в этом обращении."
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$54, {
							"submission-id": __props.submissionId,
							"subject-max": __props.subjectMax,
							"body-max": __props.bodyMax
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(Link), {
							href: "/account/support",
							class: "inline-flex min-h-10 items-center justify-self-start rounded-control text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Назад к обращениям`);
								else return [createTextVNode("Назад к обращениям")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "grid min-w-0 grid-cols-1 gap-account-section" }, [
						createVNode(_sfc_main$90, {
							title: "Напиши нам",
							description: "Опиши ситуацию — ответим в этом обращении."
						}),
						createVNode(_sfc_main$54, {
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
							class: "inline-flex min-h-10 items-center justify-self-start rounded-control text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
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
var _sfc_setup$53 = _sfc_main$53.setup;
_sfc_main$53.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Support/Create.vue");
	return _sfc_setup$53 ? _sfc_setup$53(props, ctx) : void 0;
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
var _sfc_main$52 = {
	__name: "SupportRead",
	__ssrInlineRender: true,
	props: { serviceState: {
		type: String,
		default: "ready"
	} },
	setup(__props) {
		const props = __props;
		const { loading, failed, reload } = useSupportRead();
		const visible = computed(() => !loading.value && !failed.value && props.serviceState !== "error");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			ssrRenderSlot(_ctx.$slots, "heading", {
				loading: unref(loading),
				reload: unref(reload)
			}, null, _push, _parent);
			if (unref(loading)) _push(ssrRenderComponent(_sfc_main$87, {
				state: "loading",
				title: "Загружаем обращения…",
				description: "Это займёт несколько секунд."
			}, null, _parent));
			else if (unref(failed) || __props.serviceState === "error") _push(ssrRenderComponent(_sfc_main$87, {
				state: "serviceError",
				title: "Не удалось загрузить поддержку.",
				description: "Попробуй обновить данные."
			}, {
				actions: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$100, {
						label: "Попробовать снова",
						onClick: unref(reload)
					}, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$100, {
						label: "Попробовать снова",
						onClick: unref(reload)
					}, null, 8, ["onClick"])];
				}),
				_: 1
			}, _parent));
			else _push(`<!---->`);
			_push(`<div class="contents" style="${ssrRenderStyle(visible.value ? null : { display: "none" })}">`);
			ssrRenderSlot(_ctx.$slots, "default", { visible: visible.value }, null, _push, _parent);
			_push(`</div><!--]-->`);
		};
	}
};
var _sfc_setup$52 = _sfc_main$52.setup;
_sfc_main$52.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/support/SupportRead.vue");
	return _sfc_setup$52 ? _sfc_setup$52(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/support/SupportPagination.vue
var _sfc_main$51 = {
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
						class: "inline-flex min-h-interface-header-control items-center rounded-control px-control-inline text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
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
var _sfc_setup$51 = _sfc_main$51.setup;
_sfc_main$51.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/support/SupportPagination.vue");
	return _sfc_setup$51 ? _sfc_setup$51(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/support/SupportTicketList.vue
var _sfc_main$50 = {
	__name: "SupportTicketList",
	__ssrInlineRender: true,
	props: { tickets: {
		type: Object,
		required: true
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				class: "grid min-w-0 grid-cols-1 gap-account-group",
				"aria-labelledby": "support-tickets-title"
			}, _attrs))}><h2 id="support-tickets-title" class="text-interface-heading font-display tracking-interface-heading wrap-anywhere">Обращения</h2>`);
			if (!__props.tickets.data.length) _push(ssrRenderComponent(_sfc_main$87, {
				state: "empty",
				title: "Обращений пока нет.",
				description: "Если нужна помощь, создай обращение — ответим здесь."
			}, null, _parent));
			else {
				_push(`<ul class="grid min-w-0 grid-cols-1 gap-account-group"><!--[-->`);
				ssrRenderList(__props.tickets.data, (ticket) => {
					_push(`<li class="min-w-0">`);
					_push(ssrRenderComponent(unref(Link), {
						href: ticket.url,
						class: "grid min-w-0 grid-cols-1 gap-support-message-gap rounded-card border border-border bg-interface-input p-support-ticket outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex min-w-0 flex-wrap items-start justify-between gap-tight"${_scopeId}><h3 class="min-w-0 flex-1 text-interface-title font-display wrap-anywhere"${_scopeId}>${ssrInterpolate(ticket.subject)}</h3><span class="${ssrRenderClass([ticket.status === "OPEN" ? "bg-support-status text-accent-text" : "bg-surface text-secondary", "inline-flex min-h-support-status items-center justify-center rounded-support-status px-support-status-inline text-interface-meta"])}"${_scopeId}>${ssrInterpolate(ticket.statusLabel)}</span></div><p class="line-clamp-2 text-interface-body text-secondary wrap-anywhere"${_scopeId}>${ssrInterpolate(ticket.preview)}</p><div class="flex min-w-0 items-start justify-between gap-compact"${_scopeId}><time${ssrRenderAttr("datetime", ticket.updatedAt)} class="text-interface-body text-muted"${_scopeId}>${ssrInterpolate(ticket.updatedLabel)}</time>`);
								_push(ssrRenderComponent(_sfc_main$101, {
									name: "chevronRight",
									size: "supportChevron",
									class: "text-muted"
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [
								createVNode("div", { class: "flex min-w-0 flex-wrap items-start justify-between gap-tight" }, [createVNode("h3", { class: "min-w-0 flex-1 text-interface-title font-display wrap-anywhere" }, toDisplayString(ticket.subject), 1), createVNode("span", { class: ["inline-flex min-h-support-status items-center justify-center rounded-support-status px-support-status-inline text-interface-meta", ticket.status === "OPEN" ? "bg-support-status text-accent-text" : "bg-surface text-secondary"] }, toDisplayString(ticket.statusLabel), 3)]),
								createVNode("p", { class: "line-clamp-2 text-interface-body text-secondary wrap-anywhere" }, toDisplayString(ticket.preview), 1),
								createVNode("div", { class: "flex min-w-0 items-start justify-between gap-compact" }, [createVNode("time", {
									datetime: ticket.updatedAt,
									class: "text-interface-body text-muted"
								}, toDisplayString(ticket.updatedLabel), 9, ["datetime"]), createVNode(_sfc_main$101, {
									name: "chevronRight",
									size: "supportChevron",
									class: "text-muted"
								})])
							];
						}),
						_: 2
					}, _parent));
					_push(`</li>`);
				});
				_push(`<!--]--></ul>`);
			}
			_push(ssrRenderComponent(_sfc_main$51, { pagination: __props.tickets }, null, _parent));
			_push(`</section>`);
		};
	}
};
var _sfc_setup$50 = _sfc_main$50.setup;
_sfc_main$50.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/support/SupportTicketList.vue");
	return _sfc_setup$50 ? _sfc_setup$50(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Account/Support/Index.vue
var Index_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$49 });
var _sfc_main$49 = {
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
			_push(ssrRenderComponent(_sfc_main$91, { "page-title": "Поддержка" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid min-w-0 grid-cols-1 gap-account-section"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$52, { "service-state": __props.serviceState }, {
							heading: withCtx(({ loading, reload }, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(_sfc_main$90, {
										title: "Dude, мы на связи.",
										description: "Расскажи, что случилось, — поможем разобраться."
									}, {
										actions: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(ssrRenderComponent(_sfc_main$89, {
												loading,
												onClick: reload
											}, null, _parent, _scopeId));
											else return [createVNode(_sfc_main$89, {
												loading,
												onClick: reload
											}, null, 8, ["loading", "onClick"])];
										}),
										_: 2
									}, _parent, _scopeId));
									_push(ssrRenderComponent(unref(Link), {
										href: "/account/support/create",
										class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(`Написать в поддержку`);
											else return [createTextVNode("Написать в поддержку")];
										}),
										_: 2
									}, _parent, _scopeId));
								} else return [createVNode(_sfc_main$90, {
									title: "Dude, мы на связи.",
									description: "Расскажи, что случилось, — поможем разобраться."
								}, {
									actions: withCtx(() => [createVNode(_sfc_main$89, {
										loading,
										onClick: reload
									}, null, 8, ["loading", "onClick"])]),
									_: 2
								}, 1024), createVNode(unref(Link), {
									href: "/account/support/create",
									class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
								}, {
									default: withCtx(() => [createTextVNode("Написать в поддержку")]),
									_: 1
								})];
							}),
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_sfc_main$50, { tickets: __props.tickets }, null, _parent, _scopeId));
								else return [createVNode(_sfc_main$50, { tickets: __props.tickets }, null, 8, ["tickets"])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "grid min-w-0 grid-cols-1 gap-account-section" }, [createVNode(_sfc_main$52, { "service-state": __props.serviceState }, {
						heading: withCtx(({ loading, reload }) => [createVNode(_sfc_main$90, {
							title: "Dude, мы на связи.",
							description: "Расскажи, что случилось, — поможем разобраться."
						}, {
							actions: withCtx(() => [createVNode(_sfc_main$89, {
								loading,
								onClick: reload
							}, null, 8, ["loading", "onClick"])]),
							_: 2
						}, 1024), createVNode(unref(Link), {
							href: "/account/support/create",
							class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
						}, {
							default: withCtx(() => [createTextVNode("Написать в поддержку")]),
							_: 1
						})]),
						default: withCtx(() => [createVNode(_sfc_main$50, { tickets: __props.tickets }, null, 8, ["tickets"])]),
						_: 1
					}, 8, ["service-state"])])];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Support/Index.vue");
	return _sfc_setup$49 ? _sfc_setup$49(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/support/SupportReplyForm.vue
var _sfc_main$48 = {
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
		},
		visible: {
			type: Boolean,
			default: true
		}
	},
	setup(__props) {
		const props = __props;
		const { form, submit: submitAction } = useActionForm({
			body: "",
			submission_id: props.submissionId
		});
		useInitialFormFocus(useTemplateRef("replyForm"), {
			enabled: () => props.visible,
			preventScroll: false
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<form${ssrRenderAttrs(mergeProps({
				id: "support-reply",
				ref: "replyForm",
				class: "grid min-w-0 grid-cols-1 gap-compact",
				"aria-busy": unref(form).processing
			}, _attrs))}>`);
			if (unref(form).errors.form) _push(ssrRenderComponent(_sfc_main$97, {
				variant: "error",
				message: unref(form).errors.form
			}, null, _parent));
			else _push(`<!---->`);
			_push(`<label for="support-reply-body" class="sr-only">Ответить в обращении</label><div class="flex min-h-interface-copy-row min-w-0 items-center gap-compact rounded-button border border-interface-field-border bg-interface-input py-control pr-compact pl-interface-inline"><textarea id="support-reply-body" rows="1"${ssrRenderAttr("maxlength", __props.bodyMax)}${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${ssrRenderAttr("aria-invalid", Boolean(unref(form).errors.body))}${ssrRenderAttr("aria-describedby", unref(form).errors.body ? "support-reply-error" : void 0)} placeholder="Ответить…" required class="min-h-12 min-w-0 flex-1 resize-y rounded-control bg-transparent py-control text-interface-body placeholder:text-muted outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus">${ssrInterpolate(unref(form).body)}</textarea>`);
			_push(ssrRenderComponent(_sfc_main$100, {
				type: "submit",
				size: "copy",
				loading: unref(form).processing,
				"loading-label": "",
				"aria-label": "Отправить ответ"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$101, {
						name: "send",
						size: "sm"
					}, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$101, {
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
var _sfc_setup$48 = _sfc_main$48.setup;
_sfc_main$48.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/support/SupportReplyForm.vue");
	return _sfc_setup$48 ? _sfc_setup$48(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/support/SupportConversation.vue
var _sfc_main$47 = {
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
		},
		visible: {
			type: Boolean,
			default: true
		}
	},
	setup(__props) {
		const MESSAGE_CLASSES = {
			customer: "ml-auto border-support-customer-border bg-support-customer",
			operator: "mr-auto border-border bg-support-operator"
		};
		const AUTHOR_CLASSES = {
			customer: "text-accent-text",
			operator: "text-success"
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><ol aria-label="Переписка с поддержкой" class="grid min-w-0 grid-cols-1 gap-support-conversation"><!--[-->`);
			ssrRenderList(__props.messages.data, (message) => {
				_push(`<li class="min-w-0"><article class="${ssrRenderClass([MESSAGE_CLASSES[message.author], "grid w-support-bubble-width min-w-0 grid-cols-1 gap-support-message-gap rounded-card border p-support-bubble"])}"><h2 class="${ssrRenderClass([AUTHOR_CLASSES[message.author], "text-interface-body font-semibold"])}">${ssrInterpolate(message.authorLabel)}</h2><p class="whitespace-pre-wrap text-interface-body wrap-anywhere">${ssrInterpolate(message.body)}</p><time${ssrRenderAttr("datetime", message.createdAt)} class="text-interface-meta text-secondary">${ssrInterpolate(message.timeLabel)}</time></article></li>`);
			});
			_push(`<!--]--></ol>`);
			_push(ssrRenderComponent(_sfc_main$51, {
				pagination: __props.messages,
				label: "Страницы переписки"
			}, null, _parent));
			if (__props.ticket.status === "OPEN") _push(ssrRenderComponent(_sfc_main$48, {
				key: __props.ticket.replyUrl,
				visible: __props.visible,
				"reply-url": __props.ticket.replyUrl,
				"submission-id": __props.submissionId,
				"body-max": __props.bodyMax
			}, null, _parent));
			else {
				_push(`<div role="status" class="grid justify-items-start gap-compact rounded-card border border-border bg-interface-input p-support-ticket"><p class="text-interface-body text-secondary">Обращение закрыто. Если нужна помощь, создай новое.</p>`);
				_push(ssrRenderComponent(unref(Link), {
					href: "/account/support/create",
					class: "min-h-interface-control text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
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
var _sfc_setup$47 = _sfc_main$47.setup;
_sfc_main$47.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/support/SupportConversation.vue");
	return _sfc_setup$47 ? _sfc_setup$47(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Account/Support/Show.vue
var Show_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$46 });
var _sfc_main$46 = {
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
			_push(ssrRenderComponent(_sfc_main$91, {
				"page-title": "Обращение",
				"content-spacing": "supportConversation"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid min-w-0 grid-cols-1 gap-account-section"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Link), {
							href: "/account/support",
							class: "inline-flex min-h-10 items-center justify-self-start rounded-control text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Назад к обращениям`);
								else return [createTextVNode("Назад к обращениям")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$52, { "service-state": __props.serviceState }, {
							heading: withCtx(({ loading, reload }, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(_sfc_main$90, {
									title: __props.ticket?.subject ?? "Поддержка",
									variant: "compact"
								}, createSlots({
									actions: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(ssrRenderComponent(_sfc_main$89, {
											loading,
											onClick: reload
										}, null, _parent, _scopeId));
										else return [createVNode(_sfc_main$89, {
											loading,
											onClick: reload
										}, null, 8, ["loading", "onClick"])];
									}),
									_: 2
								}, [__props.ticket ? {
									name: "description",
									fn: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`<p class="text-interface-meta text-accent-text"${_scopeId}>${ssrInterpolate(__props.ticket.statusLabel)} · <time${ssrRenderAttr("datetime", __props.ticket.updatedAt)}${_scopeId}>${ssrInterpolate(__props.ticket.updatedLabel)}</time></p>`);
										else return [createVNode("p", { class: "text-interface-meta text-accent-text" }, [createTextVNode(toDisplayString(__props.ticket.statusLabel) + " · ", 1), createVNode("time", { datetime: __props.ticket.updatedAt }, toDisplayString(__props.ticket.updatedLabel), 9, ["datetime"])])];
									}),
									key: "0"
								} : void 0]), _parent, _scopeId));
								else return [createVNode(_sfc_main$90, {
									title: __props.ticket?.subject ?? "Поддержка",
									variant: "compact"
								}, createSlots({
									actions: withCtx(() => [createVNode(_sfc_main$89, {
										loading,
										onClick: reload
									}, null, 8, ["loading", "onClick"])]),
									_: 2
								}, [__props.ticket ? {
									name: "description",
									fn: withCtx(() => [createVNode("p", { class: "text-interface-meta text-accent-text" }, [createTextVNode(toDisplayString(__props.ticket.statusLabel) + " · ", 1), createVNode("time", { datetime: __props.ticket.updatedAt }, toDisplayString(__props.ticket.updatedLabel), 9, ["datetime"])])]),
									key: "0"
								} : void 0]), 1032, ["title"])];
							}),
							default: withCtx(({ visible }, _push, _parent, _scopeId) => {
								if (_push) {
									if (__props.ticket) _push(ssrRenderComponent(_sfc_main$47, {
										visible,
										ticket: __props.ticket,
										messages: __props.messages,
										"submission-id": __props.submissionId,
										"body-max": __props.bodyMax
									}, null, _parent, _scopeId));
									else _push(`<!---->`);
								} else return [__props.ticket ? (openBlock(), createBlock(_sfc_main$47, {
									key: 0,
									visible,
									ticket: __props.ticket,
									messages: __props.messages,
									"submission-id": __props.submissionId,
									"body-max": __props.bodyMax
								}, null, 8, [
									"visible",
									"ticket",
									"messages",
									"submission-id",
									"body-max"
								])) : createCommentVNode("", true)];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "grid min-w-0 grid-cols-1 gap-account-section" }, [createVNode(unref(Link), {
						href: "/account/support",
						class: "inline-flex min-h-10 items-center justify-self-start rounded-control text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
					}, {
						default: withCtx(() => [createTextVNode("Назад к обращениям")]),
						_: 1
					}), createVNode(_sfc_main$52, { "service-state": __props.serviceState }, {
						heading: withCtx(({ loading, reload }) => [createVNode(_sfc_main$90, {
							title: __props.ticket?.subject ?? "Поддержка",
							variant: "compact"
						}, createSlots({
							actions: withCtx(() => [createVNode(_sfc_main$89, {
								loading,
								onClick: reload
							}, null, 8, ["loading", "onClick"])]),
							_: 2
						}, [__props.ticket ? {
							name: "description",
							fn: withCtx(() => [createVNode("p", { class: "text-interface-meta text-accent-text" }, [createTextVNode(toDisplayString(__props.ticket.statusLabel) + " · ", 1), createVNode("time", { datetime: __props.ticket.updatedAt }, toDisplayString(__props.ticket.updatedLabel), 9, ["datetime"])])]),
							key: "0"
						} : void 0]), 1032, ["title"])]),
						default: withCtx(({ visible }) => [__props.ticket ? (openBlock(), createBlock(_sfc_main$47, {
							key: 0,
							visible,
							ticket: __props.ticket,
							messages: __props.messages,
							"submission-id": __props.submissionId,
							"body-max": __props.bodyMax
						}, null, 8, [
							"visible",
							"ticket",
							"messages",
							"submission-id",
							"body-max"
						])) : createCommentVNode("", true)]),
						_: 1
					}, 8, ["service-state"])])];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$46 = _sfc_main$46.setup;
_sfc_main$46.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Account/Support/Show.vue");
	return _sfc_setup$46 ? _sfc_setup$46(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/shells/AuthShell.vue
var _sfc_main$45 = {
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
			_push(ssrRenderComponent(_sfc_main$98, { variant: "wordmark" }, null, _parent));
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
var _sfc_setup$45 = _sfc_main$45.setup;
_sfc_main$45.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/shells/AuthShell.vue");
	return _sfc_setup$45 ? _sfc_setup$45(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/auth/AuthStatus.vue
var _sfc_main$44 = {
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
				class: "mx-auto flex size-auth-status-icon items-center justify-center rounded-auth-status bg-status-icon-background",
				"aria-hidden": "true"
			}, _attrs))}>`);
			_push(ssrRenderComponent(_sfc_main$101, {
				name: __props.kind === "mail" ? "mail-check" : "shield-check",
				size: "status",
				class: __props.kind === "mail" ? "text-status-icon-accent" : "text-status-icon-success"
			}, null, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup$44 = _sfc_main$44.setup;
_sfc_main$44.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/auth/AuthStatus.vue");
	return _sfc_setup$44 ? _sfc_setup$44(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Auth/ForgotPassword.vue
var ForgotPassword_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$43 });
var _sfc_main$43 = {
	__name: "ForgotPassword",
	__ssrInlineRender: true,
	props: { linkRequested: {
		type: Boolean,
		default: false
	} },
	setup(__props) {
		const { form, submit: submitAction } = useActionForm({ email: "" });
		useInitialFormFocus(useTemplateRef("authForm"));
		function submit() {
			submitAction("post", "/forgot-password");
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Восстановление доступа" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$45, {
				title: __props.linkRequested ? "Проверь почту" : "Восстановим доступ",
				description: __props.linkRequested ? "Запрос принят. Если email связан с аккаунтом, проверь почту и папку «Спам». Если письма нет, попробуй позже или напиши в поддержку." : "Укажи email — отправим ссылку для смены пароля.",
				variant: __props.linkRequested ? "status" : "recovery"
			}, createSlots({
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (!__props.linkRequested) {
							_push(`<form class="grid grid-cols-1 gap-auth-group"${ssrRenderAttr("aria-busy", unref(form).processing)}${_scopeId}>`);
							if (unref(form).errors.form) _push(ssrRenderComponent(_sfc_main$97, {
								variant: "error",
								message: unref(form).errors.form
							}, null, _parent, _scopeId));
							else _push(`<!---->`);
							_push(ssrRenderComponent(_sfc_main$73, {
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
							_push(ssrRenderComponent(_sfc_main$100, {
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
							class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Вернуться ко входу`);
								else return [createTextVNode("Вернуться ко входу")];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(ssrRenderComponent(unref(Link), {
							href: "/login",
							class: "py-compact text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Вернуться ко входу`);
								else return [createTextVNode("Вернуться ко входу")];
							}),
							_: 1
						}, _parent, _scopeId));
						if (__props.linkRequested || unref(form).errors.form) _push(`<a href="https://t.me/hey_dude_web" class="py-compact text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"${_scopeId}>Написать в поддержку</a>`);
						else _push(`<!---->`);
					} else return [
						!__props.linkRequested ? (openBlock(), createBlock("form", {
							key: 0,
							ref: "authForm",
							class: "grid grid-cols-1 gap-auth-group",
							"aria-busy": unref(form).processing,
							onSubmit: withModifiers(submit, ["prevent"])
						}, [
							unref(form).errors.form ? (openBlock(), createBlock(_sfc_main$97, {
								key: 0,
								variant: "error",
								message: unref(form).errors.form
							}, null, 8, ["message"])) : createCommentVNode("", true),
							createVNode(_sfc_main$73, {
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
							createVNode(_sfc_main$100, {
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
							class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline py-tight text-interface-action font-bold text-accent-foreground hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
						}, {
							default: withCtx(() => [createTextVNode("Вернуться ко входу")]),
							_: 1
						})) : (openBlock(), createBlock(unref(Link), {
							key: 2,
							href: "/login",
							class: "py-compact text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
						}, {
							default: withCtx(() => [createTextVNode("Вернуться ко входу")]),
							_: 1
						})),
						__props.linkRequested || unref(form).errors.form ? (openBlock(), createBlock("a", {
							key: 3,
							href: "https://t.me/hey_dude_web",
							class: "py-compact text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
						}, "Написать в поддержку")) : createCommentVNode("", true)
					];
				}),
				_: 2
			}, [__props.linkRequested ? {
				name: "status",
				fn: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$44, { kind: "mail" }, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$44, { kind: "mail" })];
				}),
				key: "0"
			} : void 0]), _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$43 = _sfc_main$43.setup;
_sfc_main$43.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Auth/ForgotPassword.vue");
	return _sfc_setup$43 ? _sfc_setup$43(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/auth/PasswordField.vue
var _sfc_main$42 = {
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
			_push(ssrRenderComponent(_sfc_main$73, mergeProps({
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
						_push(`<button type="button"${ssrRenderAttr("aria-label", visible.value ? "Скрыть пароль" : "Показать пароль")}${ssrRenderAttr("aria-controls", __props.id)}${ssrRenderAttr("aria-pressed", visible.value)}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""} class="inline-flex size-11 cursor-pointer items-center justify-center rounded-control-sm hover:bg-accent-soft outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus disabled:cursor-not-allowed disabled:opacity-60"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$101, {
							name: visible.value ? "eyeOff" : "eye",
							size: __props.spacing === "reset" ? "authResetVisibility" : "authVisibility"
						}, null, _parent, _scopeId));
						_push(`</button>`);
					} else return [createVNode("button", {
						type: "button",
						"aria-label": visible.value ? "Скрыть пароль" : "Показать пароль",
						"aria-controls": __props.id,
						"aria-pressed": visible.value,
						disabled: __props.disabled,
						class: "inline-flex size-11 cursor-pointer items-center justify-center rounded-control-sm hover:bg-accent-soft outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus disabled:cursor-not-allowed disabled:opacity-60",
						onClick: ($event) => !__props.disabled && (visible.value = !visible.value)
					}, [createVNode(_sfc_main$101, {
						name: visible.value ? "eyeOff" : "eye",
						size: __props.spacing === "reset" ? "authResetVisibility" : "authVisibility"
					}, null, 8, ["name", "size"])], 8, [
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
var _sfc_setup$42 = _sfc_main$42.setup;
_sfc_main$42.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/auth/PasswordField.vue");
	return _sfc_setup$42 ? _sfc_setup$42(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Auth/Login.vue
var Login_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$41 });
var _sfc_main$41 = {
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
		useInitialFormFocus(useTemplateRef("authForm"));
		function submit() {
			submitAction("post", "/login", { onFinish: () => form.reset("password") });
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Вход" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$45, {
				title: __props.passwordChanged ? "Пароль изменён" : "С возвращением, Dude.",
				description: __props.passwordChanged ? "Теперь можно войти в аккаунт с новым паролем." : "Войди в аккаунт, чтобы управлять подпиской и подключениями.",
				variant: __props.passwordChanged ? "status" : "login"
			}, createSlots({
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (__props.passwordChanged) _push(ssrRenderComponent(unref(Link), {
							href: "/login",
							class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline text-interface-action font-bold text-accent-foreground hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Войти`);
								else return [createTextVNode("Войти")];
							}),
							_: 1
						}, _parent, _scopeId));
						else {
							_push(`<form class="grid grid-cols-1 gap-auth-group"${ssrRenderAttr("aria-busy", unref(form).processing)}${_scopeId}>`);
							if (unref(form).errors.form) _push(ssrRenderComponent(_sfc_main$97, {
								variant: "error",
								message: unref(form).errors.form
							}, null, _parent, _scopeId));
							else _push(`<!---->`);
							_push(ssrRenderComponent(_sfc_main$73, {
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
							_push(ssrRenderComponent(_sfc_main$42, {
								id: "password",
								modelValue: unref(form).password,
								"onUpdate:modelValue": ($event) => unref(form).password = $event,
								error: unref(form).errors.password,
								disabled: unref(form).processing
							}, null, _parent, _scopeId));
							_push(ssrRenderComponent(_sfc_main$100, {
								type: "submit",
								label: "Войти",
								"loading-label": "Входим…",
								loading: unref(form).processing,
								"full-width": ""
							}, null, _parent, _scopeId));
							_push(`<nav class="flex flex-wrap justify-between gap-tight text-interface-body text-accent-text" aria-label="Доступ к аккаунту"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Link), {
								href: "/forgot-password",
								class: "py-compact font-bold no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`Забыли пароль?`);
									else return [createTextVNode("Забыли пароль?")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(ssrRenderComponent(unref(Link), {
								href: "/register",
								class: "py-compact font-bold no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
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
						class: "inline-flex min-h-interface-control items-center justify-center rounded-button border border-accent-hover bg-accent px-interface-inline text-interface-action font-bold text-accent-foreground hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
					}, {
						default: withCtx(() => [createTextVNode("Войти")]),
						_: 1
					})) : (openBlock(), createBlock("form", {
						key: 1,
						ref: "authForm",
						class: "grid grid-cols-1 gap-auth-group",
						"aria-busy": unref(form).processing,
						onSubmit: withModifiers(submit, ["prevent"])
					}, [
						unref(form).errors.form ? (openBlock(), createBlock(_sfc_main$97, {
							key: 0,
							variant: "error",
							message: unref(form).errors.form
						}, null, 8, ["message"])) : createCommentVNode("", true),
						createVNode(_sfc_main$73, {
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
						createVNode(_sfc_main$42, {
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
						createVNode(_sfc_main$100, {
							type: "submit",
							label: "Войти",
							"loading-label": "Входим…",
							loading: unref(form).processing,
							"full-width": ""
						}, null, 8, ["loading"]),
						createVNode("nav", {
							class: "flex flex-wrap justify-between gap-tight text-interface-body text-accent-text",
							"aria-label": "Доступ к аккаунту"
						}, [createVNode(unref(Link), {
							href: "/forgot-password",
							class: "py-compact font-bold no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
						}, {
							default: withCtx(() => [createTextVNode("Забыли пароль?")]),
							_: 1
						}), createVNode(unref(Link), {
							href: "/register",
							class: "py-compact font-bold no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
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
					if (_push) _push(ssrRenderComponent(_sfc_main$44, { kind: "password" }, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$44, { kind: "password" })];
				}),
				key: "0"
			} : void 0]), _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$41 = _sfc_main$41.setup;
_sfc_main$41.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Auth/Login.vue");
	return _sfc_setup$41 ? _sfc_setup$41(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Auth/Register.vue
var Register_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$40 });
var _sfc_main$40 = {
	__name: "Register",
	__ssrInlineRender: true,
	setup(__props) {
		const { form, submit: submitAction } = useActionForm({
			email: "",
			password: "",
			password_confirmation: ""
		});
		useInitialFormFocus(useTemplateRef("authForm"));
		function submit() {
			submitAction("post", "/register", { onFinish: () => form.reset("password", "password_confirmation") });
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Регистрация" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$45, {
				title: "Привет, Dude!",
				description: "Создай аккаунт и подтверди email, чтобы получить бесплатный доступ.",
				variant: "register"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<form class="grid grid-cols-1 gap-auth-register-group"${ssrRenderAttr("aria-busy", unref(form).processing)}${_scopeId}>`);
						if (unref(form).errors.form) _push(ssrRenderComponent(_sfc_main$97, {
							variant: "error",
							message: unref(form).errors.form
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
						_push(ssrRenderComponent(_sfc_main$73, {
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
						_push(ssrRenderComponent(_sfc_main$42, {
							id: "password",
							modelValue: unref(form).password,
							"onUpdate:modelValue": ($event) => unref(form).password = $event,
							autocomplete: "new-password",
							placeholder: "Не менее 8 символов",
							error: unref(form).errors.password,
							disabled: unref(form).processing
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$42, {
							id: "password_confirmation",
							modelValue: unref(form).password_confirmation,
							"onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
							label: "Повторите пароль",
							autocomplete: "new-password",
							placeholder: "Введите пароль ещё раз",
							error: unref(form).errors.password_confirmation,
							disabled: unref(form).processing
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$100, {
							type: "submit",
							label: "Создать аккаунт",
							"loading-label": "Создаём аккаунт…",
							loading: unref(form).processing,
							"full-width": ""
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(Link), {
							href: "/login",
							class: "py-compact text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Уже есть аккаунт? Войти`);
								else return [createTextVNode("Уже есть аккаунт? Войти")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</form>`);
					} else return [createVNode("form", {
						ref: "authForm",
						class: "grid grid-cols-1 gap-auth-register-group",
						"aria-busy": unref(form).processing,
						onSubmit: withModifiers(submit, ["prevent"])
					}, [
						unref(form).errors.form ? (openBlock(), createBlock(_sfc_main$97, {
							key: 0,
							variant: "error",
							message: unref(form).errors.form
						}, null, 8, ["message"])) : createCommentVNode("", true),
						createVNode(_sfc_main$73, {
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
						createVNode(_sfc_main$42, {
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
						createVNode(_sfc_main$42, {
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
						createVNode(_sfc_main$100, {
							type: "submit",
							label: "Создать аккаунт",
							"loading-label": "Создаём аккаунт…",
							loading: unref(form).processing,
							"full-width": ""
						}, null, 8, ["loading"]),
						createVNode(unref(Link), {
							href: "/login",
							class: "py-compact text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
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
var _sfc_setup$40 = _sfc_main$40.setup;
_sfc_main$40.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Auth/Register.vue");
	return _sfc_setup$40 ? _sfc_setup$40(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Auth/ResetPassword.vue
var ResetPassword_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$39 });
var _sfc_main$39 = {
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
		useInitialFormFocus(useTemplateRef("authForm"));
		function submit() {
			submitAction("post", "/reset-password", { onFinish: () => form.reset("password", "password_confirmation") });
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Новый пароль" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$45, {
				title: "Новый пароль",
				description: "Придумай новый пароль — не менее 8 символов.",
				variant: "reset"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<form class="grid grid-cols-1 gap-auth-reset-group"${ssrRenderAttr("aria-busy", unref(form).processing)}${_scopeId}>`);
						if (unref(form).errors.form) _push(ssrRenderComponent(_sfc_main$97, {
							variant: "error",
							message: unref(form).errors.form
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
						if (!props.email) _push(ssrRenderComponent(_sfc_main$73, {
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
						else if (unref(form).errors.email) _push(ssrRenderComponent(_sfc_main$97, {
							variant: "error",
							message: unref(form).errors.email
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
						if (unref(form).errors.token) _push(ssrRenderComponent(_sfc_main$97, {
							variant: "error",
							message: unref(form).errors.token
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
						_push(ssrRenderComponent(_sfc_main$42, {
							id: "password",
							modelValue: unref(form).password,
							"onUpdate:modelValue": ($event) => unref(form).password = $event,
							label: "Новый пароль",
							autocomplete: "new-password",
							spacing: "reset",
							error: unref(form).errors.password,
							disabled: unref(form).processing
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$42, {
							id: "password_confirmation",
							modelValue: unref(form).password_confirmation,
							"onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
							label: "Повторите пароль",
							autocomplete: "new-password",
							spacing: "reset",
							error: unref(form).errors.password_confirmation,
							disabled: unref(form).processing
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$100, {
							type: "submit",
							label: "Сохранить пароль",
							"loading-label": "Сохраняем…",
							loading: unref(form).processing,
							"full-width": ""
						}, null, _parent, _scopeId));
						if (unref(form).errors.email || unref(form).errors.token) _push(ssrRenderComponent(unref(Link), {
							href: "/forgot-password",
							class: "py-compact text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
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
						ref: "authForm",
						class: "grid grid-cols-1 gap-auth-reset-group",
						"aria-busy": unref(form).processing,
						onSubmit: withModifiers(submit, ["prevent"])
					}, [
						unref(form).errors.form ? (openBlock(), createBlock(_sfc_main$97, {
							key: 0,
							variant: "error",
							message: unref(form).errors.form
						}, null, 8, ["message"])) : createCommentVNode("", true),
						!props.email ? (openBlock(), createBlock(_sfc_main$73, {
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
						])) : unref(form).errors.email ? (openBlock(), createBlock(_sfc_main$97, {
							key: 2,
							variant: "error",
							message: unref(form).errors.email
						}, null, 8, ["message"])) : createCommentVNode("", true),
						unref(form).errors.token ? (openBlock(), createBlock(_sfc_main$97, {
							key: 3,
							variant: "error",
							message: unref(form).errors.token
						}, null, 8, ["message"])) : createCommentVNode("", true),
						createVNode(_sfc_main$42, {
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
						createVNode(_sfc_main$42, {
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
						createVNode(_sfc_main$100, {
							type: "submit",
							label: "Сохранить пароль",
							"loading-label": "Сохраняем…",
							loading: unref(form).processing,
							"full-width": ""
						}, null, 8, ["loading"]),
						unref(form).errors.email || unref(form).errors.token ? (openBlock(), createBlock(unref(Link), {
							key: 4,
							href: "/forgot-password",
							class: "py-compact text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
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
var _sfc_setup$39 = _sfc_main$39.setup;
_sfc_main$39.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Auth/ResetPassword.vue");
	return _sfc_setup$39 ? _sfc_setup$39(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Auth/VerifyEmail.vue
var VerifyEmail_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$38 });
var _sfc_main$38 = {
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
			_push(ssrRenderComponent(_sfc_main$45, {
				title: "Подтверди email",
				description: description.value,
				variant: "status"
			}, {
				status: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$44, { kind: "mail" }, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$44, { kind: "mail" })];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<p class="text-center text-interface-body text-foreground wrap-anywhere"${_scopeId}>${ssrInterpolate(__props.email)}</p>`);
						if (unref(resend).errors.form || unref(logout).errors.form || __props.errors.form) _push(ssrRenderComponent(_sfc_main$97, {
							variant: "error",
							message: unref(resend).errors.form || unref(logout).errors.form || __props.errors.form
						}, null, _parent, _scopeId));
						else if (__props.status === "verification-link-sent") _push(ssrRenderComponent(_sfc_main$97, {
							variant: "success",
							message: "Письмо отправлено. Проверь почту."
						}, null, _parent, _scopeId));
						else _push(`<!---->`);
						_push(`<form class="grid grid-cols-1 gap-auth-group"${ssrRenderAttr("aria-busy", unref(resend).processing)}${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$100, {
							type: "submit",
							label: "Отправить письмо ещё раз",
							"loading-label": "Отправляем…",
							loading: unref(resend).processing,
							disabled: busy.value,
							"full-width": ""
						}, null, _parent, _scopeId));
						_push(`</form>`);
						_push(ssrRenderComponent(_sfc_main$100, {
							variant: "secondary",
							label: "Выйти",
							"loading-label": "Выходим…",
							loading: unref(logout).processing,
							disabled: busy.value,
							"full-width": "",
							onClick: leave
						}, null, _parent, _scopeId));
						_push(`<a href="https://t.me/hey_dude_web" class="py-compact text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"${_scopeId}>Написать в поддержку</a>`);
					} else return [
						createVNode("p", { class: "text-center text-interface-body text-foreground wrap-anywhere" }, toDisplayString(__props.email), 1),
						unref(resend).errors.form || unref(logout).errors.form || __props.errors.form ? (openBlock(), createBlock(_sfc_main$97, {
							key: 0,
							variant: "error",
							message: unref(resend).errors.form || unref(logout).errors.form || __props.errors.form
						}, null, 8, ["message"])) : __props.status === "verification-link-sent" ? (openBlock(), createBlock(_sfc_main$97, {
							key: 1,
							variant: "success",
							message: "Письмо отправлено. Проверь почту."
						})) : createCommentVNode("", true),
						createVNode("form", {
							class: "grid grid-cols-1 gap-auth-group",
							"aria-busy": unref(resend).processing,
							onSubmit: withModifiers(sendVerification, ["prevent"])
						}, [createVNode(_sfc_main$100, {
							type: "submit",
							label: "Отправить письмо ещё раз",
							"loading-label": "Отправляем…",
							loading: unref(resend).processing,
							disabled: busy.value,
							"full-width": ""
						}, null, 8, ["loading", "disabled"])], 40, ["aria-busy"]),
						createVNode(_sfc_main$100, {
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
							class: "py-compact text-interface-body font-bold text-accent-text no-underline outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-focus"
						}, "Написать в поддержку")
					];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Auth/VerifyEmail.vue");
	return _sfc_setup$38 ? _sfc_setup$38(props, ctx) : void 0;
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
var _sfc_main$37 = {
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
var _sfc_setup$37 = _sfc_main$37.setup;
_sfc_main$37.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/hero/ServiceLogoCloud.vue");
	return _sfc_setup$37 ? _sfc_setup$37(props, ctx) : void 0;
};
var ServiceLogoCloud_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$37, [["__scopeId", "data-v-34a8f2bf"]]);
//#endregion
//#region resources/js/components/public/hero/ServiceCloudHero.vue
var PRIMARY_ACTION_CLASSES$1 = "inline-flex min-h-13 items-center justify-center rounded-button border border-accent-hover bg-accent px-panel text-hero-action-mobile font-normal text-accent-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus tablet:min-h-14 tablet:px-0 tablet:text-hero-action-tablet desktop:min-h-hero-action-wide desktop:px-panel desktop:text-hero-action-wide";
var SECONDARY_ACTION_CLASSES$1 = "inline-flex min-h-13 items-center justify-center rounded-button border border-hero-secondary-border bg-hero-secondary px-panel text-hero-action-mobile font-normal text-hero-secondary-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-soft outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus tablet:min-h-14 tablet:px-0 tablet:text-hero-action-tablet desktop:min-h-hero-action-wide desktop:px-panel desktop:text-hero-action-wide";
var _sfc_main$36 = {
	__name: "ServiceCloudHero",
	__ssrInlineRender: true,
	emits: ["unavailable"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				class: "service-hero relative min-h-hero-mobile overflow-hidden bg-background tablet:min-h-hero-tablet desktop:h-hero-wide desktop:min-h-0",
				"aria-labelledby": "hero-title"
			}, _attrs))} data-v-d98a412f><div class="service-hero__layout" data-v-d98a412f>`);
			_push(ssrRenderComponent(ServiceLogoCloud_default, {
				class: "service-hero__cloud",
				onUnavailable: ($event) => emit("unavailable")
			}, null, _parent));
			_push(`<div class="service-hero__content" data-v-d98a412f><p class="service-hero__eyebrow font-mono font-bold text-hero-eyebrow text-hero-contrast" data-v-d98a412f> HEY, DUDE! </p><h1 id="hero-title" class="service-hero__heading font-display break-words text-foreground text-hero-contrast" data-v-d98a412f> Любимые сервисы<br data-v-d98a412f> снова рядом </h1><p class="service-hero__description text-hero-copy text-hero-contrast" data-v-d98a412f> dudeweb помогает пользоваться любимыми сервисами для работы, развлечений и общения — просто и без лишних сложностей. </p><div class="service-hero__actions" data-v-d98a412f>`);
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
			_push(`<a href="#pricing" class="${ssrRenderClass(SECONDARY_ACTION_CLASSES$1)}" data-v-d98a412f> Посмотреть тариф </a></div><p class="service-hero__trial font-mono text-hero-meta text-hero-contrast" data-v-d98a412f> 3 дня бесплатно · До 5 устройств </p></div></div></section>`);
		};
	}
};
var _sfc_setup$36 = _sfc_main$36.setup;
_sfc_main$36.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/hero/ServiceCloudHero.vue");
	return _sfc_setup$36 ? _sfc_setup$36(props, ctx) : void 0;
};
var ServiceCloudHero_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$36, [["__scopeId", "data-v-d98a412f"]]);
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
var PRIMARY_ACTION_CLASSES = "inline-flex min-h-13 items-center justify-center rounded-button border border-accent-hover bg-accent px-panel text-hero-action-mobile font-normal text-accent-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus tablet:min-h-14 tablet:px-0 tablet:text-hero-action-tablet desktop:min-h-hero-action-wide desktop:px-panel desktop:text-hero-action-wide";
var SECONDARY_ACTION_CLASSES = "inline-flex min-h-13 items-center justify-center rounded-button border border-hero-secondary-border bg-hero-secondary px-panel text-hero-action-mobile font-normal text-hero-secondary-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-soft outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus tablet:min-h-14 tablet:px-0 tablet:text-hero-action-tablet desktop:min-h-hero-action-wide desktop:px-panel desktop:text-hero-action-wide";
var _sfc_main$35 = {
	__name: "SignalOrbitHero",
	__ssrInlineRender: true,
	setup(__props) {
		const { signalPath, onPointerMove, resetPointer } = useSignalOrbitPointer(useTemplateRef("hero"), useTemplateRef("signal"));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				ref: "hero",
				class: "landing-hero",
				"aria-labelledby": "hero-title"
			}, _attrs))} data-v-be66ceba><div class="landing-hero__layout" data-v-be66ceba><svg aria-hidden="true" class="landing-hero__signal" viewBox="0 0 300 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" data-v-be66ceba><defs data-v-be66ceba><linearGradient id="hero-signal-top" x1="0" y1="0" x2="1" y2="0" data-v-be66ceba><stop offset="0" stop-color="var(--ui-hero-blob-1)" data-v-be66ceba></stop><stop offset="1" stop-color="var(--ui-hero-blob-2)" data-v-be66ceba></stop></linearGradient><linearGradient id="hero-signal-bottom" x1="0" y1="0" x2="1" y2="0" data-v-be66ceba><stop offset="0" stop-color="var(--ui-hero-blob-3)" data-v-be66ceba></stop><stop offset="1" stop-color="var(--ui-hero-blob-4)" data-v-be66ceba></stop></linearGradient><linearGradient id="hero-signal-blend" x1="0" y1="0" x2="0" y2="1" data-v-be66ceba><stop offset="0" stop-color="white" stop-opacity="0" data-v-be66ceba></stop><stop offset="1" stop-color="white" data-v-be66ceba></stop></linearGradient><mask id="hero-signal-bottom-mask" maskContentUnits="objectBoundingBox" data-v-be66ceba><rect width="1" height="1" fill="url(#hero-signal-blend)" data-v-be66ceba></rect></mask></defs><path class="landing-hero__signal-path"${ssrRenderAttr("d", unref(signalPath))} fill="url(#hero-signal-top)" data-v-be66ceba></path><path class="landing-hero__signal-path"${ssrRenderAttr("d", unref(signalPath))} fill="url(#hero-signal-bottom)" mask="url(#hero-signal-bottom-mask)" data-v-be66ceba></path></svg><div class="landing-hero__content" data-v-be66ceba><p class="landing-hero__eyebrow font-mono font-bold text-hero-eyebrow text-hero-contrast" data-v-be66ceba> HEY, DUDE! </p><h1 id="hero-title" class="landing-hero__heading font-display break-words text-foreground text-hero-contrast" data-v-be66ceba> Любимые сервисы<br data-v-be66ceba> снова рядом </h1><p class="landing-hero__description text-hero-copy text-hero-contrast" data-v-be66ceba> dudeweb помогает пользоваться любимыми сервисами для работы, развлечений и общения — просто и без лишних сложностей. </p><div class="landing-hero__actions" data-v-be66ceba>`);
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
			_push(`<a href="#pricing" class="${ssrRenderClass(SECONDARY_ACTION_CLASSES)}" data-v-be66ceba> Посмотреть тариф </a></div><p class="landing-hero__trial font-mono text-hero-meta text-hero-contrast" data-v-be66ceba> 3 дня бесплатно · До 5 устройств </p></div></div></section>`);
		};
	}
};
var _sfc_setup$35 = _sfc_main$35.setup;
_sfc_main$35.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/hero/SignalOrbitHero.vue");
	return _sfc_setup$35 ? _sfc_setup$35(props, ctx) : void 0;
};
var SignalOrbitHero_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$35, [["__scopeId", "data-v-be66ceba"]]);
//#endregion
//#region resources/js/components/public/LandingHero.vue
var _sfc_main$34 = {
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
var _sfc_setup$34 = _sfc_main$34.setup;
_sfc_main$34.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingHero.vue");
	return _sfc_setup$34 ? _sfc_setup$34(props, ctx) : void 0;
};
//#endregion
//#region resources/js/composables/useAdvantageMotion.js
function useAdvantageMotion(target) {
	const inViewport = useElementVisibility(target, { threshold: .05 });
	const visibility = useDocumentVisibility();
	const preference = usePreferredReducedMotion();
	const forcedColors = useMediaQuery("(forced-colors: active)");
	const hovering = shallowRef(false);
	const playing = shallowRef(false);
	const { start } = useTimeoutFn(() => {
		playing.value = false;
	}, 1800, { immediate: false });
	const running = computed(() => inViewport.value && visibility.value === "visible" && preference.value === "no-preference" && !forcedColors.value);
	const active = computed(() => hovering.value || playing.value);
	function play() {
		playing.value = true;
		start();
	}
	function enter(event) {
		if (event.pointerType === "mouse") hovering.value = true;
	}
	function leave() {
		hovering.value = false;
	}
	return {
		running,
		active,
		playing: readonly(playing),
		play,
		enter,
		leave
	};
}
//#endregion
//#region resources/js/components/public/LandingFeatureScene.vue
var _sfc_main$33 = {
	__name: "LandingFeatureScene",
	__ssrInlineRender: true,
	props: { kind: {
		type: String,
		required: true
	} },
	setup(__props) {
		const STREAMS = [
			"M-40 25C100 25 110 120 240 120S390 70 520 70",
			"M-40 45C100 45 110 125 240 125S390 90 520 90",
			"M-40 65C100 65 110 130 240 130S390 110 520 110",
			"M-40 85C100 85 110 135 240 135S390 130 520 130",
			"M-40 105C100 105 110 140 240 140S390 150 520 150",
			"M-40 125C100 125 110 145 240 145S390 170 520 170"
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: "feature-scene pointer-events-none relative flex h-advantage-art shrink-0 items-center justify-center overflow-hidden text-accent-text",
				"data-scene": __props.kind,
				"aria-hidden": "true"
			}, _attrs))} data-v-73e09e94><svg class="feature-scene__svg h-full w-full overflow-visible" viewBox="0 0 480 240" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" focusable="false" data-v-73e09e94>`);
			if (__props.kind === "zap") {
				_push(`<!--[--><g class="motion-breathe" opacity=".25" data-v-73e09e94><!--[-->`);
				ssrRenderList(STREAMS, (path) => {
					_push(`<path${ssrRenderAttr("d", path)} data-v-73e09e94></path>`);
				});
				_push(`<!--]--></g><path class="motion-stream"${ssrRenderAttr("d", STREAMS[2])} stroke-width="2.5" stroke-dasharray="28 420" data-v-73e09e94></path><g class="motion-float" data-v-73e09e94><rect x="100" y="89" width="280" height="64" rx="32" class="scene-surface" data-v-73e09e94></rect><circle class="motion-pulse" cx="137" cy="121" r="7" fill="currentColor" stroke="none" data-v-73e09e94></circle><text x="160" y="128" class="scene-label" data-v-73e09e94>dudeweb</text><path class="motion-nudge" d="M330 121H350M343 114L350 121L343 128" data-v-73e09e94></path></g><!--]-->`);
			} else if (__props.kind === "gauge") _push(`<!--[--><g opacity=".14" data-v-73e09e94><path d="M30 65H450M30 110H450M30 155H450M30 200H450" data-v-73e09e94></path></g><path class="motion-stream" d="M-20 65H500" stroke-dasharray="90 310" data-v-73e09e94></path><path class="motion-stream motion-reverse" d="M-20 110H500" stroke-dasharray="140 260" stroke-width="3" data-v-73e09e94></path><path class="motion-stream" d="M-20 155H500" stroke-dasharray="60 340" data-v-73e09e94></path><g class="motion-float" data-v-73e09e94><rect x="145" y="80" width="190" height="68" rx="14" class="scene-surface" data-v-73e09e94></rect><path d="M166 125L182 109L197 116L216 97L231 104L253 89L272 100L306 85" stroke-width="2.5" data-v-73e09e94></path></g><!--]-->`);
			else if (__props.kind === "monitor-smartphone") _push(`<!--[--><path class="motion-stream" d="M52 146C130 146 140 65 240 65S350 146 430 146" stroke-dasharray="14 22" opacity=".3" data-v-73e09e94></path><g class="motion-float" data-v-73e09e94><rect x="112" y="55" width="220" height="128" rx="12" class="scene-surface" data-v-73e09e94></rect><path d="M112 81H332M206 183V198M178 198H262" opacity=".4" data-v-73e09e94></path><circle cx="130" cy="69" r="2" fill="currentColor" data-v-73e09e94></circle><circle cx="140" cy="69" r="2" fill="currentColor" opacity=".4" data-v-73e09e94></circle><path class="motion-scan" d="M140 110H300M140 126H270M140 142H286" stroke-width="5" opacity=".35" data-v-73e09e94></path></g><g class="motion-float motion-reverse" data-v-73e09e94><rect x="300" y="112" width="62" height="100" rx="12" class="scene-surface" data-v-73e09e94></rect><path d="M323 198H339M319 158L328 167L345 148" data-v-73e09e94></path></g><!--]-->`);
			else if (__props.kind === "shield-check") _push(`<!--[--><g class="motion-orbit" data-v-73e09e94><ellipse cx="240" cy="120" rx="112" ry="50" transform="rotate(-30 240 120)" opacity=".25" data-v-73e09e94></ellipse><ellipse cx="240" cy="120" rx="112" ry="50" transform="rotate(30 240 120)" opacity=".25" data-v-73e09e94></ellipse><circle cx="142" cy="66" r="5" fill="currentColor" data-v-73e09e94></circle></g><g class="motion-breathe" data-v-73e09e94><rect x="207" y="105" width="66" height="56" rx="12" class="scene-surface" data-v-73e09e94></rect><path d="M221 105V88A19 19 0 0 1 259 88V105" stroke-width="3" data-v-73e09e94></path><path d="M230 132L238 140L253 123" stroke-width="3" data-v-73e09e94></path></g><!--]-->`);
			else if (__props.kind === "infinity") _push(`<!--[--><g class="motion-orbit" data-v-73e09e94><ellipse cx="240" cy="120" rx="158" ry="62" opacity=".22" data-v-73e09e94></ellipse><circle cx="82" cy="120" r="5" fill="currentColor" data-v-73e09e94></circle><circle cx="398" cy="120" r="4" fill="currentColor" opacity=".4" data-v-73e09e94></circle></g><g class="motion-float" data-v-73e09e94><rect x="95" y="75" width="115" height="40" rx="20" class="scene-surface" data-v-73e09e94></rect><text x="152" y="100" class="scene-tag" data-v-73e09e94>Видео</text><rect x="255" y="124" width="126" height="40" rx="20" class="scene-surface" data-v-73e09e94></rect><text x="318" y="149" class="scene-tag" data-v-73e09e94>Музыка</text><rect x="183" y="29" width="115" height="40" rx="20" class="scene-surface" data-v-73e09e94></rect><text x="240" y="54" class="scene-tag" data-v-73e09e94>Работа</text></g><!--]-->`);
			else {
				_push(`<!--[--><g opacity=".18" data-v-73e09e94><!--[-->`);
				ssrRenderList(STREAMS, (path) => {
					_push(`<path${ssrRenderAttr("d", path)} data-v-73e09e94></path>`);
				});
				_push(`<!--]--></g><g class="motion-float" data-v-73e09e94><rect x="70" y="52" width="244" height="61" rx="18" class="scene-surface" data-v-73e09e94></rect><path d="M97 76H260M97 89H211" opacity=".25" stroke-width="5" data-v-73e09e94></path></g><g class="motion-float motion-reverse" data-v-73e09e94><rect x="160" y="130" width="245" height="62" rx="18" class="scene-surface" data-v-73e09e94></rect><g class="motion-pulse" fill="currentColor" stroke="none" data-v-73e09e94><circle cx="194" cy="161" r="4" data-v-73e09e94></circle><circle cx="212" cy="161" r="4" data-v-73e09e94></circle><circle cx="230" cy="161" r="4" data-v-73e09e94></circle></g><path d="M354 158L362 166L377 148" stroke-width="2.5" data-v-73e09e94></path></g><!--]-->`);
			}
			_push(`</svg></div>`);
		};
	}
};
var _sfc_setup$33 = _sfc_main$33.setup;
_sfc_main$33.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingFeatureScene.vue");
	return _sfc_setup$33 ? _sfc_setup$33(props, ctx) : void 0;
};
var LandingFeatureScene_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$33, [["__scopeId", "data-v-73e09e94"]]);
//#endregion
//#region resources/js/components/public/LandingAdvantageCard.vue
var _sfc_main$32 = {
	__name: "LandingAdvantageCard",
	__ssrInlineRender: true,
	props: { feature: {
		type: Object,
		required: true
	} },
	setup(__props) {
		const { running, active, playing, play, enter, leave } = useAdvantageMotion(useTemplateRef("card"));
		const SIZES = {
			zap: "col-span-2 min-h-advantage-lead desktop:col-span-4",
			gauge: "min-h-advantage-compact desktop:col-span-2",
			"monitor-smartphone": "min-h-advantage-compact desktop:col-span-2",
			"shield-check": "col-span-2 min-h-advantage-protection tablet:col-span-1 desktop:col-span-2",
			infinity: "min-h-advantage-compact desktop:col-span-2",
			"heart-handshake": "min-h-advantage-compact tablet:col-span-2 tablet:min-h-advantage-banner desktop:col-span-6"
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<article${ssrRenderAttrs(mergeProps({
				ref: "card",
				class: ["advantage-card relative isolate flex min-w-0 flex-col overflow-hidden rounded-sheet border border-landing-card-border bg-landing-card", SIZES[__props.feature.icon]],
				"data-feature": __props.feature.icon,
				"data-active": unref(active),
				"data-playing": unref(playing),
				"data-motion-running": unref(running)
			}, _attrs))} data-v-962c7070>`);
			_push(ssrRenderComponent(LandingFeatureScene_default, { kind: __props.feature.icon }, null, _parent));
			_push(`<div class="advantage-card__copy relative z-1 mt-auto flex flex-col gap-3 p-4 tablet:p-6 desktop:p-8" data-v-962c7070><h3 class="text-ui-title font-medium wrap-anywhere tablet:text-landing-feature-title" data-v-962c7070>${ssrInterpolate(__props.feature.title)}</h3><p class="text-ui-body wrap-anywhere text-footer-secondary tablet:text-landing-feature-copy" data-v-962c7070>${ssrInterpolate(__props.feature.copy)}</p></div><button type="button" class="absolute inset-0 z-2 cursor-pointer rounded-sheet focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-focus"${ssrRenderAttr("aria-label", `Оживить иллюстрацию: ${__props.feature.title}`)} data-v-962c7070></button></article>`);
		};
	}
};
var _sfc_setup$32 = _sfc_main$32.setup;
_sfc_main$32.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingAdvantageCard.vue");
	return _sfc_setup$32 ? _sfc_setup$32(props, ctx) : void 0;
};
var LandingAdvantageCard_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$32, [["__scopeId", "data-v-962c7070"]]);
//#endregion
//#region resources/js/components/public/LandingAdvantages.vue
var _sfc_main$31 = {
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
			}, _attrs))}><div class="mx-auto flex w-full max-w-landing flex-col gap-landing-stack px-landing-gutter py-landing-section"><div class="mx-auto flex w-full max-w-landing-intro flex-col gap-landing-intro-gap text-left tablet:text-center"><h2 id="advantages-title" class="text-landing-heading font-normal tracking-landing-heading break-words"> Всё просто.<br>Всё работает.<br>Всё для тебя. </h2><p class="text-landing-intro text-footer-secondary"> dudeweb создан, чтобы технологии не мешали заниматься тем, что тебе нравится. </p></div><div class="advantage-grid grid w-full grid-cols-2 gap-3 tablet:gap-4 desktop:grid-cols-6"><!--[-->`);
			ssrRenderList(features.value, (feature) => {
				_push(ssrRenderComponent(LandingAdvantageCard_default, {
					key: feature.icon,
					feature
				}, null, _parent));
			});
			_push(`<!--]--></div></div></section>`);
		};
	}
};
var _sfc_setup$31 = _sfc_main$31.setup;
_sfc_main$31.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingAdvantages.vue");
	return _sfc_setup$31 ? _sfc_setup$31(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/public/LandingPlatforms.vue
var _sfc_main$30 = {
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
			}, _attrs))}><div class="mx-auto flex min-h-platform-height w-full max-w-landing flex-col gap-platform-stack px-landing-gutter py-platform-section"><div class="mx-auto flex w-full max-w-landing-intro flex-col gap-landing-intro-gap text-left tablet:text-center"><h2 id="platforms-title" class="text-platform-heading font-normal tracking-platform-heading">Где ты — там<br>и dudeweb</h2><p class="text-platform-copy text-footer-secondary">Работай с ноутбука, смотри с планшета, общайся со смартфона. Привычные сервисы всегда под рукой.</p></div><ul class="grid grid-cols-2 gap-platform-grid-gap desktop:grid-cols-5"><!--[-->`);
			ssrRenderList(PLATFORMS, (platform) => {
				_push(`<li class="flex min-h-platform-card items-center justify-center gap-platform-card-gap rounded-platform-card bg-landing-platform px-tight text-platform-label font-semibold ring-1 ring-landing-platform-border ring-inset last:col-span-2 desktop:last:col-span-1">`);
				_push(ssrRenderComponent(_sfc_main$101, {
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
var _sfc_setup$30 = _sfc_main$30.setup;
_sfc_main$30.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingPlatforms.vue");
	return _sfc_setup$30 ? _sfc_setup$30(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/public/LandingPricing.vue
var _sfc_main$29 = {
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
			}, _attrs))} data-v-359f2f26><div class="landing-pricing mx-auto grid min-h-pricing-height w-full max-w-landing gap-pricing-grid-gap px-pricing-gutter pt-pricing-top pb-pricing-bottom desktop:items-center" data-v-359f2f26><div class="flex min-w-0 flex-col items-start gap-pricing-story-gap" data-v-359f2f26><p class="font-mono text-landing-eyebrow font-bold tracking-pricing-eyebrow text-pricing-eyebrow" data-v-359f2f26>ОДИН ТАРИФ. ВСЁ ПРОСТО.</p><span class="h-pricing-rule-height w-pricing-rule rounded-pricing-rule bg-accent" aria-hidden="true" data-v-359f2f26></span><h2 id="pricing-title" class="max-w-full text-pricing-heading font-bold tracking-pricing-heading break-words" data-v-359f2f26>${ssrInterpolate(plan.value?.name ?? "Безлимитный")}.</h2><p class="text-pricing-copy text-footer-secondary" data-v-359f2f26>Никаких сложных тарифов. Просто выбирай удобный период и пользуйся любимыми сервисами.</p></div><div class="h-px bg-landing-platform-border desktop:h-full desktop:w-px" aria-hidden="true" data-v-359f2f26></div><div class="flex min-w-0 flex-col gap-pricing-stack" data-v-359f2f26>`);
			if (__props.state === "ready" && selectedProduct.value) {
				_push(`<!--[--><div class="flex flex-col items-start gap-pricing-header-gap tablet:flex-row tablet:flex-wrap tablet:items-end tablet:justify-between" data-v-359f2f26><p class="text-pricing-prompt" data-v-359f2f26>Выбери период</p><p class="max-w-full font-mono text-pricing-price font-semibold tracking-pricing-price break-words" aria-live="polite" aria-atomic="true" data-v-359f2f26>${ssrInterpolate(periodPrice.value)} / ${ssrInterpolate(selectedProduct.value.months)} мес.</p></div><fieldset class="min-w-0" data-v-359f2f26><legend class="sr-only" data-v-359f2f26>Период подписки</legend><div class="grid min-h-pricing-selector grid-cols-4 gap-1 rounded-button bg-pricing-selector p-pricing-selector-inset ring-1 ring-pricing-selector-border ring-inset" data-v-359f2f26><!--[-->`);
				ssrRenderList(plan.value.products, (product) => {
					_push(`<label class="${ssrRenderClass([selectedProduct.value.id === product.id ? "border border-accent bg-pricing-selected font-bold text-foreground" : "border border-transparent font-medium text-footer-muted hover:text-foreground", "relative flex min-h-0 cursor-pointer items-center justify-center rounded-control-sm py-compact text-center font-mono text-pricing-period wrap-anywhere transition-colors duration-200 motion-reduce:transition-none outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"])}" data-v-359f2f26><input${ssrIncludeBooleanAttr(selectedProduct.value.id === product.id) ? " checked" : ""}${ssrRenderAttr("value", product.id)} type="radio" name="landing-period" class="sr-only" data-v-359f2f26> ${ssrInterpolate(product.months)} мес. </label>`);
				});
				_push(`<!--]--></div></fieldset><p class="text-pricing-benefits-label text-footer-muted" data-v-359f2f26>В тариф входит</p><ul class="grid gap-x-pricing-benefits-column gap-y-pricing-benefits-row tablet:grid-cols-2" data-v-359f2f26><!--[-->`);
				ssrRenderList(plan.value.advantages, (advantage) => {
					_push(`<li class="flex items-start gap-tight text-pricing-benefit" data-v-359f2f26><span class="inline-flex size-pricing-check shrink-0 items-center justify-center rounded-control-sm border border-landing-tile-border bg-landing-tile text-accent-text" data-v-359f2f26>`);
					_push(ssrRenderComponent(_sfc_main$101, {
						name: "check",
						size: "md"
					}, null, _parent));
					_push(`</span><span class="self-center" data-v-359f2f26>${ssrInterpolate(advantage)}</span></li>`);
				});
				_push(`<!--]--></ul><div class="flex w-full flex-col items-center gap-pricing-actions-gap tablet:max-w-pricing-action-width" data-v-359f2f26>`);
				_push(ssrRenderComponent(unref(Link), {
					href: "/register",
					class: "inline-flex min-h-pricing-action w-full items-center justify-center rounded-landing-action ring-1 ring-accent-hover ring-inset bg-accent px-content py-compact text-center text-landing-action font-bold text-accent-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Выбрать подписку`);
						else return [createTextVNode("Выбрать подписку")];
					}),
					_: 1
				}, _parent));
				_push(`<p class="text-center text-pricing-trial text-footer-muted" data-v-359f2f26>3 дня бесплатно для новых пользователей</p></div><!--]-->`);
			} else _push(`<div role="status" class="flex flex-col items-start gap-content" data-v-359f2f26><p class="text-ui-title" data-v-359f2f26>${ssrInterpolate(__props.state === "unavailable" ? "Не удалось загрузить тариф" : "Тариф временно недоступен")}</p><p class="text-ui-copy text-footer-secondary" data-v-359f2f26>Попробуй зайти позже или напиши нам — поможем разобраться.</p><a href="https://t.me/hey_dude_web" class="inline-flex min-h-12 items-center rounded-button border border-accent px-panel text-accent-text outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus" data-v-359f2f26>Написать в поддержку</a></div>`);
			_push(`</div></div></section>`);
		};
	}
};
var _sfc_setup$29 = _sfc_main$29.setup;
_sfc_main$29.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingPricing.vue");
	return _sfc_setup$29 ? _sfc_setup$29(props, ctx) : void 0;
};
var LandingPricing_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$29, [["__scopeId", "data-v-359f2f26"]]);
//#endregion
//#region resources/js/components/public/LandingFinalMark.vue
var MARK = "M167.36626 44.31375l-24.77251 30.54375 21.1275 0c9.45001 0 17.11127 7.32375 17.11127 17.38125 0 13.22999-11.67752 23.0175-23.42252 23.0175-17.24624 0-32.16374-14.14124-43.2675-24.26624l28.75501-27.23626 0-22.84875c-23.4225 22.44375-52.88625 49.95-68.985 63.31499-5.77125 4.72501-12.38626 7.39125-18.63001 7.39125-12.92625 0-23.52375-10.5975-23.52375-23.32124 0-15.35626 11.475-25.75125 24.30001-25.75125 6.68249 0 13.46625 2.86875 18.22499 7.66126l13.095 13.46624 22.68001-20.8575 0-47.82375c0-8.67375-6.21001-14.985-15.42375-14.985l-17.82001 0 0 32.4675c-5.43375-1.755-11.07001-2.7675-17.44874-2.7675-32.1975 0-59.36626 26.62875-59.36626 59.4675 0 31.05001 24.97501 53.18998 52.1775 53.18998 11.98125 0 24.3-4.89373 33.51375-12.52124l12.48751-10.69874c14.20874 12.99376 33.88501 28.65376 58.55624 28.65376 31.55626 0 56.7-25.54876 56.7-56.025 0-26.66251-20.95874-47.28376-46.06874-47.45251z";
var ACCENT = "M16.97624 19.27126l-14.71501-0.00001c-1.34999 0-2.26123-0.945-2.26123-2.39625l0-14.41125c0-1.45124 0.97874-2.46375 2.26123-2.46375l14.71501 0c1.2825 0 2.32874 0.945 2.32874 2.26125l0 14.61375c0 1.45126-0.94499 2.39626-2.32874 2.39625z";
var _sfc_main$28 = {
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
var _sfc_setup$28 = _sfc_main$28.setup;
_sfc_main$28.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingFinalMark.vue");
	return _sfc_setup$28 ? _sfc_setup$28(props, ctx) : void 0;
};
var LandingFinalMark_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$28, [["__scopeId", "data-v-c2759be7"]]);
//#endregion
//#region resources/js/components/public/LandingFinalCta.vue
var _sfc_main$27 = {
	__name: "LandingFinalCta",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				class: "mx-auto w-full max-w-landing px-landing-gutter py-final-section",
				"aria-labelledby": "final-title"
			}, _attrs))} data-v-11647be9><div class="landing-final__panel relative min-h-final-panel overflow-hidden rounded-final-panel ring-1 ring-landing-final-border ring-inset bg-linear-to-l from-landing-final-start to-landing-final-end px-final-padding-x py-final-padding-y" data-v-11647be9><div class="relative z-1 flex min-w-0 flex-col items-start gap-final-copy-gap" data-v-11647be9><p class="font-mono text-landing-eyebrow font-bold tracking-final-eyebrow text-final-eyebrow" data-v-11647be9>ПОПРОБУЙ DUDEWEB</p><h2 id="final-title" class="max-w-full text-final-heading font-bold tracking-final-heading break-words" data-v-11647be9>Ну что, погнали?</h2><p class="text-final-copy text-footer-secondary" data-v-11647be9>Твои любимые сервисы уже ждут. Подключайся и начинай прямо сейчас.</p>`);
			_push(ssrRenderComponent(unref(Link), {
				href: "/register",
				class: "inline-flex min-h-final-action w-full items-center justify-center rounded-landing-action ring-1 ring-accent-hover ring-inset bg-accent px-tight py-compact text-center text-landing-action font-bold text-accent-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus tablet:max-w-final-action-width"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Получить 3 дня бесплатно `);
					else return [createTextVNode(" Получить 3 дня бесплатно ")];
				}),
				_: 1
			}, _parent));
			_push(`<p class="text-final-note text-footer-muted" data-v-11647be9>Начни с пробного доступа, а подписку оформишь позже.</p></div><div class="landing-final__visual pointer-events-none absolute top-2.5 right-2 h-final-visual-height w-final-visual-width opacity-35 tablet:static tablet:w-full tablet:max-w-final-visual-width tablet:opacity-100" aria-hidden="true" data-v-11647be9>`);
			_push(ssrRenderComponent(LandingFinalMark_default, null, null, _parent));
			_push(`</div></div></section>`);
		};
	}
};
var _sfc_setup$27 = _sfc_main$27.setup;
_sfc_main$27.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingFinalCta.vue");
	return _sfc_setup$27 ? _sfc_setup$27(props, ctx) : void 0;
};
var LandingFinalCta_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$27, [["__scopeId", "data-v-11647be9"]]);
//#endregion
//#region resources/js/components/public/LandingSectionDivider.vue
var _sfc_main$26 = {
	__name: "LandingSectionDivider",
	__ssrInlineRender: true,
	props: { profile: {
		type: String,
		required: true,
		validator: (value) => [
			"rise",
			"fall",
			"ridge",
			"shallow"
		].includes(value)
	} },
	setup(__props) {
		const PROFILES = {
			rise: {
				colors: "bg-background text-landing-section",
				edge: "M0 88L1440 12V100H0Z",
				accent: "M0 58L980 36L1440 12L0 88Z"
			},
			fall: {
				colors: "bg-landing-section text-background",
				edge: "M0 8L1440 82V100H0Z",
				accent: "M0 8L1440 48V82Z"
			},
			ridge: {
				colors: "bg-background text-landing-section",
				edge: "M0 80L520 24L1440 58V100H0Z",
				accent: "M0 48L520 24L0 80Z"
			},
			shallow: {
				colors: "bg-landing-section text-background",
				edge: "M0 24L1440 72V100H0Z",
				accent: "M0 24L960 40L1440 72Z"
			}
		};
		const props = __props;
		const shape = computed(() => PROFILES[props.profile] ?? PROFILES.rise);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: ["pointer-events-none relative -my-px h-landing-divider w-full overflow-hidden select-none", shape.value.colors],
				"data-section-divider": __props.profile,
				"aria-hidden": "true"
			}, _attrs))}><svg class="block h-full w-full" viewBox="0 0 1440 100" preserveAspectRatio="none" focusable="false"><path${ssrRenderAttr("d", shape.value.edge)} fill="currentColor"></path><path${ssrRenderAttr("d", shape.value.accent)} class="fill-accent/15"></path></svg></div>`);
		};
	}
};
var _sfc_setup$26 = _sfc_main$26.setup;
_sfc_main$26.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/LandingSectionDivider.vue");
	return _sfc_setup$26 ? _sfc_setup$26(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/public/PublicFooter.vue
var LINK_CLASSES$1 = "w-fit rounded-control-sm text-footer-link text-footer-secondary transition-colors duration-200 motion-reduce:transition-none hover:text-foreground outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus tablet:text-footer-link-tablet desktop:text-footer-link-wide";
var LABEL_CLASSES = "font-mono text-footer-label font-medium tracking-footer-label text-foreground desktop:text-footer-label-wide";
var _sfc_main$25 = {
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
			_push(ssrRenderComponent(_sfc_main$98, {
				scale: "footer",
				variant: "horizontal"
			}, null, _parent));
			_push(`<p class="mt-3.5 text-footer-copy text-footer-secondary desktop:mt-footer-brand-gap-wide desktop:text-footer-copy-wide"> Простая подписка, быстрая настройка и поддержка без долгого ожидания. </p></div><div class="mt-panel flex min-w-0 flex-col gap-7 tablet:gap-5 desktop:mt-0 desktop:grid desktop:w-footer-links-wide desktop:grid-cols-[140fr_130fr_246fr] desktop:gap-footer-links-gap-wide wide:grid-cols-[8.75rem_8.125rem_18.75rem]"><nav aria-label="Навигация в подвале" class="flex flex-col gap-tight"><p class="${ssrRenderClass(LABEL_CLASSES)}">НАВИГАЦИЯ</p><!--[-->`);
			ssrRenderList(__props.navigationItems, (item) => {
				_push(`<a${ssrRenderAttr("href", item.href)} class="${ssrRenderClass(LINK_CLASSES$1)}">${ssrInterpolate(item.label)}</a>`);
			});
			_push(`<!--]--></nav><nav aria-label="Аккаунт" class="flex flex-col gap-tight"><p class="${ssrRenderClass(LABEL_CLASSES)}">АККАУНТ</p>`);
			_push(ssrRenderComponent(unref(Link), {
				href: __props.loginHref,
				class: LINK_CLASSES$1
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Войти `);
					else return [createTextVNode(" Войти ")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(Link), {
				href: __props.registerHref,
				class: LINK_CLASSES$1
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Регистрация `);
					else return [createTextVNode(" Регистрация ")];
				}),
				_: 1
			}, _parent));
			_push(`</nav><nav aria-label="Информация" class="flex flex-col gap-tight"><p class="${ssrRenderClass(LABEL_CLASSES)}">ИНФОРМАЦИЯ</p><a${ssrRenderAttr("href", __props.supportHref)} class="${ssrRenderClass(LINK_CLASSES$1)}" rel="noopener noreferrer" target="_blank"> Поддержка <span class="sr-only">(откроется в новой вкладке)</span></a></nav></div><p class="mt-panel border-t border-border pt-5 font-mono text-footer-meta text-footer-muted desktop:mt-0 desktop:w-footer-meta-wide desktop:border-0 desktop:pt-0 desktop:text-footer-meta-wide"> © ${ssrInterpolate(unref(currentYear))} dudeweb </p></div></footer>`);
		};
	}
};
var _sfc_setup$25 = _sfc_main$25.setup;
_sfc_main$25.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/PublicFooter.vue");
	return _sfc_setup$25 ? _sfc_setup$25(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/public/PublicMobileMenu.vue
var _sfc_main$24 = {
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
		function requestClose() {
			emit("close");
		}
		function handleNavigation() {
			emit("navigate");
		}
		useSwipeDismiss({
			open: () => props.open,
			panel,
			close: requestClose
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (mounted.value) ssrRenderTeleport(_push, (_push) => {
				if (__props.open) {
					_push(`<div class="fixed inset-x-0 top-public-header bottom-0 z-30 bg-background/80 px-tight pt-tight backdrop-blur-sm tablet:top-public-header-tablet tablet:flex tablet:items-start tablet:justify-end tablet:px-section-sm desktop:hidden"><nav id="public-mobile-menu" aria-labelledby="public-menu-title" aria-describedby="public-menu-description" tabindex="-1" aria-modal="true" class="mx-auto flex max-h-[calc(100dvh-var(--spacing-public-header)-var(--spacing-panel))] w-full max-w-none flex-col gap-public-menu-gap overflow-y-auto rounded-panel border border-public-menu-border bg-public-menu-panel p-tight shadow-public-menu tablet:mx-0 tablet:max-h-[calc(100dvh-var(--spacing-public-header-tablet)-var(--spacing-panel))] tablet:max-w-public-menu" role="dialog"><h2 id="public-menu-title" class="sr-only">Мобильная навигация</h2><p id="public-menu-description" class="sr-only">Разделы сайта, вход и создание аккаунта. Escape закрывает меню.</p><!--[-->`);
					ssrRenderList(__props.items, (item) => {
						_push(`<a${ssrRenderAttr("href", item.href)} class="flex min-h-public-menu-item items-center justify-between rounded-menu-item border border-public-menu-item-border bg-public-menu-item px-control-inline text-public-menu font-normal text-foreground transition-colors duration-200 motion-reduce:transition-none hover:border-public-menu-item-hover-border hover:bg-public-menu-item-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus tablet:min-h-public-menu-item-tablet"><span>${ssrInterpolate(item.label)}</span>`);
						_push(ssrRenderComponent(_sfc_main$101, {
							class: "text-public-menu-arrow",
							name: "arrowUpRight",
							size: "sm"
						}, null, _parent));
						_push(`</a>`);
					});
					_push(`<!--]-->`);
					_push(ssrRenderComponent(unref(Link), {
						href: __props.loginHref,
						class: "flex min-h-public-menu-item items-center justify-between rounded-menu-item border border-public-menu-item-border bg-public-menu-item px-control-inline text-public-menu font-normal text-foreground transition-colors duration-200 motion-reduce:transition-none hover:border-public-menu-item-hover-border hover:bg-public-menu-item-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus tablet:min-h-public-menu-item-tablet",
						onClick: handleNavigation
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<span${_scopeId}>Войти</span>`);
								_push(ssrRenderComponent(_sfc_main$101, {
									class: "text-public-menu-arrow",
									name: "arrowUpRight",
									size: "sm"
								}, null, _parent, _scopeId));
							} else return [createVNode("span", null, "Войти"), createVNode(_sfc_main$101, {
								class: "text-public-menu-arrow",
								name: "arrowUpRight",
								size: "sm"
							})];
						}),
						_: 1
					}, _parent));
					_push(ssrRenderComponent(unref(Link), {
						href: __props.registerHref,
						class: "inline-flex min-h-13 items-center justify-center rounded-control border border-accent-border bg-accent px-panel text-hero-action-mobile font-normal text-accent-foreground transition-colors duration-200 motion-reduce:transition-none hover:border-accent-border-hover hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus",
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
var _sfc_setup$24 = _sfc_main$24.setup;
_sfc_main$24.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/PublicMobileMenu.vue");
	return _sfc_setup$24 ? _sfc_setup$24(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/public/PublicHeader.vue
var _sfc_main$23 = {
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
		const desktop = useMediaQuery("(min-width: 75rem)");
		const { setTheme, theme } = useTheme();
		const themeAction = computed(() => THEME_ACTIONS[theme.value] ?? THEME_ACTIONS.light);
		function closeMenu() {
			if (!isMenuOpen.value) return;
			isMenuOpen.value = false;
		}
		watch(desktop, (matches) => {
			if (matches) closeMenu();
		});
		watch(isMenuOpen, (value) => emit("menu-state-change", value));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<header${ssrRenderAttrs(mergeProps({ class: "sticky top-0 z-40 h-public-header border-b border-border bg-background/95 backdrop-blur-md tablet:h-public-header-tablet desktop:h-public-header-wide" }, _attrs))}><div class="mx-auto flex h-full max-w-shell items-center px-shell-gutter tablet:px-section-sm desktop:grid desktop:grid-cols-[auto_minmax(0,1fr)_auto] desktop:px-shell-wide"><div data-public-menu-background class="tablet:hidden">`);
			_push(ssrRenderComponent(_sfc_main$98, {
				scale: "public",
				variant: "icon"
			}, null, _parent));
			_push(`</div><div data-public-menu-background class="hidden tablet:block desktop:justify-self-start">`);
			_push(ssrRenderComponent(_sfc_main$98, {
				scale: "public",
				variant: "horizontal"
			}, null, _parent));
			_push(`</div><nav aria-label="Основная навигация" class="hidden items-center gap-10 desktop:flex desktop:gap-public-nav-wide desktop:justify-self-center"><!--[-->`);
			ssrRenderList(__props.navigationItems, (item) => {
				_push(`<a${ssrRenderAttr("href", item.href)} class="rounded-control-sm text-public-nav-desktop font-semibold text-secondary transition-colors duration-200 motion-reduce:transition-none hover:text-foreground outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus desktop:text-public-nav-wide">${ssrInterpolate(item.label)}</a>`);
			});
			_push(`<!--]--></nav><div class="ml-auto flex items-center gap-compact tablet:gap-2.5 desktop:ml-0 desktop:gap-public-controls-wide desktop:justify-self-end"><button${ssrRenderAttr("aria-label", themeAction.value.label)} class="inline-flex size-11 cursor-pointer items-center justify-center rounded-menu-item border border-public-theme-border bg-public-theme text-secondary transition-colors duration-200 motion-reduce:transition-none hover:bg-surface hover:text-foreground outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus tablet:size-14 tablet:rounded-card desktop:size-public-control-wide" data-public-menu-control type="button">`);
			_push(ssrRenderComponent(_sfc_main$101, {
				name: themeAction.value.icon,
				size: "publicTheme",
				class: "text-public-theme-icon"
			}, null, _parent));
			_push(`</button>`);
			_push(ssrRenderComponent(unref(Link), {
				href: __props.loginHref,
				class: "inline-flex min-h-11 items-center justify-center rounded-control border border-public-login-border bg-public-login px-control-inline text-ui-body font-semibold text-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-surface outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus tablet:min-h-14 tablet:rounded-card tablet:px-5 tablet:text-public-control-tablet desktop:min-h-public-control-height-wide desktop:rounded-public-control desktop:px-public-login-inline-wide desktop:text-public-control-wide",
				"data-public-menu-control": "",
				onClick: closeMenu
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Войти `);
					else return [createTextVNode(" Войти ")];
				}),
				_: 1
			}, _parent));
			_push(`<button${ssrRenderAttr("aria-expanded", isMenuOpen.value)}${ssrRenderAttr("aria-label", isMenuOpen.value ? "Закрыть меню" : "Открыть меню")} aria-controls="public-mobile-menu" class="inline-flex size-11 cursor-pointer items-center justify-center rounded-control border border-accent-hover bg-accent text-accent-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus tablet:size-14 tablet:rounded-card desktop:hidden" data-public-menu-control type="button">`);
			_push(ssrRenderComponent(_sfc_main$101, { name: isMenuOpen.value ? "x" : "menu" }, null, _parent));
			_push(`</button>`);
			_push(ssrRenderComponent(unref(Link), {
				href: __props.registerHref,
				class: "hidden min-h-public-control-height-wide items-center justify-center rounded-public-control border border-accent-hover bg-accent px-public-cta-inline-wide text-public-control-wide font-bold text-accent-foreground transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus desktop:inline-flex"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Попробовать бесплатно `);
					else return [createTextVNode(" Попробовать бесплатно ")];
				}),
				_: 1
			}, _parent));
			_push(`</div></div>`);
			_push(ssrRenderComponent(_sfc_main$24, {
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
var _sfc_setup$23 = _sfc_main$23.setup;
_sfc_main$23.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/public/PublicHeader.vue");
	return _sfc_setup$23 ? _sfc_setup$23(props, ctx) : void 0;
};
//#endregion
//#region resources/js/layouts/PublicLayout.vue
var LOGIN_HREF = "/login";
var REGISTER_HREF = "/register";
var SUPPORT_HREF = "https://t.me/hey_dude_web";
var _sfc_main$22 = {
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200 motion-reduce:transition-none" }, _attrs))}><a href="#main-content" data-public-menu-background class="fixed top-0 -translate-y-full left-compact z-50 rounded-control bg-accent px-content py-tight font-semibold text-accent-foreground transition-transform duration-200 motion-reduce:transition-none focus:top-compact focus:translate-y-0 outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-2 keyboard-focus:outline-focus"> К основному содержимому </a>`);
			_push(ssrRenderComponent(_sfc_main$23, {
				"login-href": LOGIN_HREF,
				"navigation-items": NAVIGATION_ITEMS,
				"register-href": REGISTER_HREF
			}, null, _parent));
			_push(`<main id="main-content" data-public-menu-background class="flex-1" tabindex="-1">`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</main>`);
			_push(ssrRenderComponent(_sfc_main$25, {
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
var _sfc_setup$22 = _sfc_main$22.setup;
_sfc_main$22.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layouts/PublicLayout.vue");
	return _sfc_setup$22 ? _sfc_setup$22(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/Public/Home.vue
var Home_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main$21 });
var _sfc_main$21 = /*@__PURE__*/ Object.assign({ layout: _sfc_main$22 }, {
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
			_push(ssrRenderComponent(_sfc_main$34, null, null, _parent));
			_push(ssrRenderComponent(_sfc_main$26, { profile: "rise" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$31, { "device-limit": __props.plans[0]?.deviceLimit ?? null }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$26, { profile: "fall" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$30, null, null, _parent));
			_push(ssrRenderComponent(_sfc_main$26, { profile: "ridge" }, null, _parent));
			_push(ssrRenderComponent(LandingPricing_default, {
				plans: __props.plans,
				state: __props.pricingState
			}, null, _parent));
			_push(ssrRenderComponent(_sfc_main$26, { profile: "shallow" }, null, _parent));
			_push(ssrRenderComponent(LandingFinalCta_default, null, null, _parent));
			_push(`</div><!--]-->`);
		};
	}
});
var _sfc_setup$21 = _sfc_main$21.setup;
_sfc_main$21.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Public/Home.vue");
	return _sfc_setup$21 ? _sfc_setup$21(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/landing-v2/LandingV2Action.vue
var _sfc_main$20 = {
	__name: "LandingV2Action",
	__ssrInlineRender: true,
	props: {
		href: {
			type: String,
			required: true
		},
		variant: {
			type: String,
			default: "trial",
			validator: (value) => [
				"login",
				"trial",
				"menuTrial",
				"heroTrial",
				"subscription"
			].includes(value)
		}
	},
	setup(__props) {
		const VARIANTS = {
			login: "h-v2-header-control rounded-v2-header-action border-v2-control-border bg-v2-surface px-v2-login-inline text-v2-header-control font-semibold text-v2-login-ink hover:bg-v2-surface-hover active:bg-v2-surface-hover",
			trial: "h-v2-header-control rounded-v2-header-action border-v2-brand bg-v2-brand px-v2-trial-inline text-v2-header-control font-bold text-v2-ink hover:border-v2-brand-hover hover:bg-v2-brand-hover active:border-v2-brand-pressed active:bg-v2-brand-pressed",
			menuTrial: "h-12 w-full rounded-v2-subscription-action border-v2-brand bg-v2-brand text-v2-menu-action font-medium text-v2-ink hover:border-v2-brand-hover hover:bg-v2-brand-hover active:border-v2-brand-pressed active:bg-v2-brand-pressed",
			heroTrial: "h-v2-hero-control w-full rounded-v2-hero-control border-v2-brand bg-v2-brand px-v2-trial-inline text-v2-hero-control font-v2-hero-action text-v2-ink hover:border-v2-brand-hover hover:bg-v2-brand-hover active:border-v2-brand-pressed active:bg-v2-brand-pressed md:w-v2-hero-support v2-desktop:w-full",
			subscription: "h-v2-subscription-action w-full rounded-v2-subscription-action border-v2-brand bg-v2-brand px-v2-trial-inline text-v2-subscription-action font-medium text-v2-ink hover:border-v2-brand-hover hover:bg-v2-brand-hover active:border-v2-brand-pressed active:bg-v2-brand-pressed"
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(Link), mergeProps({
				href: __props.href,
				class: [VARIANTS[__props.variant] ?? VARIANTS.trial, "inline-flex shrink-0 items-center justify-center border whitespace-nowrap transition-colors duration-(--v2-duration-control) motion-reduce:transition-none outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-(--spacing-v2-focus-offset) keyboard-focus:outline-v2-focus"]
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default")];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup$20 = _sfc_main$20.setup;
_sfc_main$20.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/landing-v2/LandingV2Action.vue");
	return _sfc_setup$20 ? _sfc_setup$20(props, ctx) : void 0;
};
//#endregion
//#region resources/js/data/landingV2Navigation.js
var LANDING_V2_NAVIGATION = [
	{
		label: "Преимущества",
		href: "#advantages"
	},
	{
		label: "Устройства",
		href: "#devices"
	},
	{
		label: "Тарифы",
		href: "#pricing"
	}
];
var LANDING_V2_LOGIN = "/login";
var LANDING_V2_TRIAL = "/register";
var LANDING_V2_SUPPORT = "https://t.me/hey_dude_web";
//#endregion
//#region resources/js/components/landing-v2/LandingV2NavLinks.vue
var _sfc_main$19 = {
	__name: "LandingV2NavLinks",
	__ssrInlineRender: true,
	props: {
		activeHash: {
			type: String,
			default: ""
		},
		variant: {
			type: String,
			default: "desktop",
			validator: (value) => ["desktop", "menu"].includes(value)
		}
	},
	emits: ["navigate"],
	setup(__props, { emit: __emit }) {
		const VARIANTS = {
			desktop: "text-v2-nav text-v2-ink",
			menu: "text-v2-menu tracking-v2-menu text-v2-menu-ink"
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			ssrRenderList(unref(LANDING_V2_NAVIGATION), (item) => {
				_push(`<a${ssrRenderAttr("href", item.href)}${ssrRenderAttr("aria-current", __props.activeHash === item.href ? "location" : null)}${ssrRenderAttr("data-v2-menu-link", __props.variant === "menu" ? "" : null)} class="${ssrRenderClass([VARIANTS[__props.variant] ?? VARIANTS.desktop, "font-normal underline-offset-4 transition-colors duration-(--v2-duration-control) motion-reduce:transition-none hover:text-v2-focus hover:underline active:text-v2-focus aria-[current=location]:text-v2-focus aria-[current=location]:underline outline-none keyboard-focus:underline keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-(--spacing-v2-focus-offset) keyboard-focus:outline-v2-focus"])}">${ssrInterpolate(item.label)}</a>`);
			});
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$19 = _sfc_main$19.setup;
_sfc_main$19.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/landing-v2/LandingV2NavLinks.vue");
	return _sfc_setup$19 ? _sfc_setup$19(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/landing-v2/LandingV2HeaderBar.vue
var _sfc_main$18 = {
	__name: "LandingV2HeaderBar",
	__ssrInlineRender: true,
	props: {
		activeHash: {
			type: String,
			default: ""
		},
		menuOpen: Boolean
	},
	emits: ["toggle-menu", "navigate"],
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "relative h-v2-header shrink-0 px-v2-gutter after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-v2-section-border" }, _attrs))}><div class="mx-auto flex h-full max-w-v2-content items-center justify-between">`);
			_push(ssrRenderComponent(unref(Link), {
				href: "/landing",
				"aria-label": "dudeweb — главная",
				class: "flex shrink-0 items-center gap-v2-brand-gap outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-(--spacing-v2-focus-offset) keyboard-focus:outline-v2-focus",
				onClick: ($event) => _ctx.$emit("navigate")
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<img src="/landing-v2/brand/mark.svg" alt="" width="44" height="36" class="h-v2-mark-height w-v2-mark-width shrink-0"${_scopeId}><span class="text-v2-wordmark font-semibold tracking-v2-brand"${_scopeId}>dudeweb</span>`);
					else return [createVNode("img", {
						src: "/landing-v2/brand/mark.svg",
						alt: "",
						width: "44",
						height: "36",
						class: "h-v2-mark-height w-v2-mark-width shrink-0"
					}), createVNode("span", { class: "text-v2-wordmark font-semibold tracking-v2-brand" }, "dudeweb")];
				}),
				_: 1
			}, _parent));
			_push(`<nav aria-label="Основная навигация" class="hidden items-center gap-v2-nav v2-desktop:flex">`);
			_push(ssrRenderComponent(_sfc_main$19, { "active-hash": __props.activeHash }, null, _parent));
			_push(`</nav><div class="flex items-center gap-v2-header-controls">`);
			_push(ssrRenderComponent(_sfc_main$20, {
				href: unref(LANDING_V2_LOGIN),
				variant: "login",
				onClick: ($event) => _ctx.$emit("navigate")
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Войти`);
					else return [createTextVNode("Войти")];
				}),
				_: 1
			}, _parent));
			_push(`<button type="button"${ssrRenderAttr("aria-label", __props.menuOpen ? "Закрыть меню" : "Открыть меню")}${ssrRenderAttr("aria-expanded", __props.menuOpen)} aria-controls="landing-v2-menu" class="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-menu-item border border-v2-control-border bg-v2-surface text-v2-ink transition-colors duration-(--v2-duration-control) motion-reduce:transition-none hover:bg-v2-surface-hover active:bg-v2-surface-hover outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-(--spacing-v2-focus-offset) keyboard-focus:outline-v2-focus v2-desktop:hidden"><span class="size-v2-menu-icon [&amp;_svg]:size-full">`);
			_push(ssrRenderComponent(_sfc_main$101, { name: __props.menuOpen ? "x" : "menu" }, null, _parent));
			_push(`</span></button><div class="hidden tablet:block">`);
			_push(ssrRenderComponent(_sfc_main$20, {
				href: unref(LANDING_V2_TRIAL),
				onClick: ($event) => _ctx.$emit("navigate")
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Попробовать бесплатно `);
					else return [createTextVNode(" Попробовать бесплатно ")];
				}),
				_: 1
			}, _parent));
			_push(`</div></div></div></div>`);
		};
	}
};
var _sfc_setup$18 = _sfc_main$18.setup;
_sfc_main$18.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/landing-v2/LandingV2HeaderBar.vue");
	return _sfc_setup$18 ? _sfc_setup$18(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/landing-v2/LandingV2MobileMenu.vue
var _sfc_main$17 = {
	__name: "LandingV2MobileMenu",
	__ssrInlineRender: true,
	props: {
		activeHash: {
			type: String,
			default: ""
		},
		open: Boolean
	},
	emits: ["close", "navigate"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const panel = useTemplateRef("panel");
		useOverlay({
			open: () => props.open,
			panel,
			close: () => emit("close"),
			initialFocus: () => panel.value?.querySelector("[data-v2-menu-link]"),
			background: () => [...document.querySelectorAll("[data-v2-menu-background]")]
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (__props.open) {
				_push(`<div${ssrRenderAttrs(mergeProps({
					id: "landing-v2-menu",
					ref_key: "panel",
					ref: panel,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "landing-v2-menu-title",
					tabindex: "-1",
					class: "fixed inset-0 z-50 flex h-dvh flex-col overflow-y-auto overscroll-contain bg-v2-page v2-desktop:hidden"
				}, _attrs))} data-v-9f20b2ed><h2 id="landing-v2-menu-title" class="sr-only" data-v-9f20b2ed>Навигация по сайту</h2>`);
				_push(ssrRenderComponent(_sfc_main$18, {
					"active-hash": __props.activeHash,
					"menu-open": "",
					onToggleMenu: ($event) => _ctx.$emit("close"),
					onNavigate: ($event) => _ctx.$emit("close")
				}, null, _parent));
				_push(`<div class="flex flex-1 flex-col px-v2-gutter pt-v2-menu-top pb-v2-menu-bottom" data-v-9f20b2ed><div class="mx-auto flex w-full max-w-v2-content flex-1 flex-col justify-between gap-v2-menu-top" data-v-9f20b2ed><nav aria-label="Разделы лендинга" class="flex flex-col gap-6" data-v-9f20b2ed>`);
				_push(ssrRenderComponent(_sfc_main$19, {
					"active-hash": __props.activeHash,
					variant: "menu",
					onNavigate: (href) => _ctx.$emit("navigate", href)
				}, null, _parent));
				_push(`</nav>`);
				_push(ssrRenderComponent(_sfc_main$20, {
					href: unref(LANDING_V2_TRIAL),
					variant: "menuTrial",
					onClick: ($event) => _ctx.$emit("close")
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(` Попробовать бесплатно `);
						else return [createTextVNode(" Попробовать бесплатно ")];
					}),
					_: 1
				}, _parent));
				_push(`</div></div></div>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup$17 = _sfc_main$17.setup;
_sfc_main$17.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/landing-v2/LandingV2MobileMenu.vue");
	return _sfc_setup$17 ? _sfc_setup$17(props, ctx) : void 0;
};
var LandingV2MobileMenu_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$17, [["__scopeId", "data-v-9f20b2ed"]]);
//#endregion
//#region resources/js/components/landing-v2/LandingV2Header.vue
var _sfc_main$16 = {
	__name: "LandingV2Header",
	__ssrInlineRender: true,
	setup(__props) {
		const open = shallowRef(false);
		const activeHash = shallowRef("");
		const header = useTemplateRef("header");
		const desktop = useMediaQuery("(min-width: 90rem)");
		function closeMenu() {
			open.value = false;
		}
		function syncHash() {
			activeHash.value = window.location.hash;
		}
		async function navigate(href) {
			closeMenu();
			await nextTick();
			window.location.hash = href;
			const target = document.getElementById(href.slice(1));
			target?.focus({ preventScroll: true });
			target?.scrollIntoView();
			syncHash();
		}
		onMounted(syncHash);
		useEventListener("hashchange", syncHash);
		watch(desktop, async (matches) => {
			if (!matches || !open.value) return;
			closeMenu();
			await nextTick();
			header.value?.querySelector("a")?.focus({ preventScroll: true });
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><header data-v2-menu-background class="shrink-0 bg-v2-page">`);
			_push(ssrRenderComponent(_sfc_main$18, {
				"active-hash": activeHash.value,
				onToggleMenu: ($event) => open.value = true
			}, null, _parent));
			_push(`</header>`);
			_push(ssrRenderComponent(LandingV2MobileMenu_default, {
				"active-hash": activeHash.value,
				open: open.value,
				onClose: closeMenu,
				onNavigate: navigate
			}, null, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$16 = _sfc_main$16.setup;
_sfc_main$16.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/landing-v2/LandingV2Header.vue");
	return _sfc_setup$16 ? _sfc_setup$16(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/landing-v2/LandingV2BenefitIcon.vue
var _sfc_main$15 = {
	__name: "LandingV2BenefitIcon",
	__ssrInlineRender: true,
	props: { name: {
		type: String,
		required: true
	} },
	setup(__props) {
		const ICONS = {
			"plug-zap": [{
				tag: "path",
				attrs: { d: "M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z" }
			}, {
				tag: "path",
				attrs: { d: "m2 22 3-3M7.5 13.5 10 11M10.5 16.5 13 14M18 3l-4 4h6l-4 4" }
			}],
			"layout-grid": [
				{
					tag: "rect",
					attrs: {
						width: 7,
						height: 7,
						x: 3,
						y: 3,
						rx: 1
					}
				},
				{
					tag: "rect",
					attrs: {
						width: 7,
						height: 7,
						x: 14,
						y: 3,
						rx: 1
					}
				},
				{
					tag: "rect",
					attrs: {
						width: 7,
						height: 7,
						x: 14,
						y: 14,
						rx: 1
					}
				},
				{
					tag: "rect",
					attrs: {
						width: 7,
						height: 7,
						x: 3,
						y: 14,
						rx: 1
					}
				}
			],
			headphones: [{
				tag: "path",
				attrs: { d: "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" }
			}]
		};
		const props = __props;
		const elements = computed(() => ICONS[props.name] ?? LANDING_ICONS[props.name]);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<svg${ssrRenderAttrs(mergeProps({
				"aria-hidden": "true",
				class: "size-v2-compact-icon shrink-0 text-v2-compact-icon",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "2",
				"stroke-linecap": "round",
				"stroke-linejoin": "round"
			}, _attrs))}><!--[-->`);
			ssrRenderList(elements.value, (element, index) => {
				ssrRenderVNode(_push, createVNode(resolveDynamicComponent(element.tag), mergeProps({ key: index }, { ref_for: true }, element.attrs), null), _parent);
			});
			_push(`<!--]--></svg>`);
		};
	}
};
var _sfc_setup$15 = _sfc_main$15.setup;
_sfc_main$15.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/landing-v2/LandingV2BenefitIcon.vue");
	return _sfc_setup$15 ? _sfc_setup$15(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/landing-v2/LandingV2BenefitCard.vue
var _sfc_main$14 = {
	__name: "LandingV2BenefitCard",
	__ssrInlineRender: true,
	props: {
		benefit: {
			type: Object,
			required: true
		},
		index: {
			type: Number,
			required: true
		},
		active: {
			type: Boolean,
			default: false
		},
		running: {
			type: Boolean,
			default: false
		}
	},
	emits: { select: (index) => Number.isInteger(index) && index >= 0 && index < 6 },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<article${ssrRenderAttrs(mergeProps({
				class: "v2-benefit relative min-w-0 bg-v2-surface",
				"data-active": __props.active,
				"data-v2-benefit": ""
			}, _attrs))} data-v-a286bf75><div${ssrRenderAttr("id", `v2-benefit-copy-${__props.index}`)} class="v2-benefit-full flex h-full min-w-0 flex-col gap-v2-face-gap pt-v2-face-top pr-v2-face-inline pb-v2-face-bottom pl-v2-face-inline" data-v-a286bf75><div class="flex items-center gap-2 border-b border-v2-benefit-rule pb-v2-face-label-bottom" data-v-a286bf75><span class="font-mono text-v2-panel-number text-v2-benefit-number" data-v-a286bf75>${ssrInterpolate(String(__props.index + 1).padStart(2, "0"))}</span><span class="text-v2-panel-label font-medium" data-v-a286bf75>${ssrInterpolate(__props.benefit.label)}</span></div><div class="v2-benefit-copy grid content-start gap-v2-face-copy-gap" data-v-a286bf75><h2 class="text-v2-benefit-title font-medium tracking-v2-benefit" data-v-a286bf75>${ssrInterpolate(__props.benefit.title)}</h2><p class="text-v2-benefit-copy text-v2-benefit-copy-ink" data-v-a286bf75>${ssrInterpolate(__props.benefit.description)}</p></div><img${ssrRenderAttr("src", `/landing-v2/illustrations/${__props.benefit.image}.png`)} alt="" width="890" height="546" class="min-h-0 w-full flex-1 object-contain" draggable="false" data-v-a286bf75></div><div class="v2-benefit-compact absolute inset-0 flex flex-col pt-v2-compact-top pr-v2-compact-inline pb-v2-compact-bottom pl-v2-compact-inline" aria-hidden="true" data-v-a286bf75><div class="v2-compact-label flex items-center gap-2 border-b border-v2-benefit-rule pb-v2-compact-rule" data-v-a286bf75><span class="font-mono text-v2-compact-number text-v2-benefit-number" data-v-a286bf75>${ssrInterpolate(String(__props.index + 1).padStart(2, "0"))}</span><span class="text-v2-compact-label font-medium text-v2-compact-label-ink" data-v-a286bf75>${ssrInterpolate(__props.benefit.label)}</span></div><div class="flex min-h-0 flex-1 flex-col items-center justify-center gap-v2-compact-gap" data-v-a286bf75>`);
			_push(ssrRenderComponent(_sfc_main$15, { name: __props.benefit.icon }, null, _parent));
			_push(`<span class="w-full text-center text-v2-compact font-medium text-v2-compact-ink" data-v-a286bf75>${ssrInterpolate(__props.benefit.title)}</span></div></div><button type="button"${ssrRenderAttr("aria-label", __props.benefit.title)}${ssrRenderAttr("aria-expanded", __props.active)}${ssrRenderAttr("aria-controls", `v2-benefit-copy-${__props.index}`)} class="v2-benefit-select absolute inset-0 w-full cursor-pointer rounded-v2-panel outline-none keyboard-focus:outline-2 keyboard-focus:-outline-offset-2 keyboard-focus:outline-v2-focus" data-v2-benefit-select data-v-a286bf75></button>`);
			if (__props.active) _push(`<span class="v2-benefit-progress absolute right-0 bottom-0 left-0 h-0.5 origin-left bg-v2-brand"${ssrRenderAttr("data-running", __props.running)} aria-hidden="true" data-v-a286bf75></span>`);
			else _push(`<!---->`);
			_push(`</article>`);
		};
	}
};
var _sfc_setup$14 = _sfc_main$14.setup;
_sfc_main$14.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/landing-v2/LandingV2BenefitCard.vue");
	return _sfc_setup$14 ? _sfc_setup$14(props, ctx) : void 0;
};
var LandingV2BenefitCard_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$14, [["__scopeId", "data-v-a286bf75"]]);
//#endregion
//#region resources/js/composables/useLandingV2Benefits.js
function useLandingV2Benefits(track, stage, count) {
	const mounted = shallowRef(false);
	const active = shallowRef(0);
	const paused = shallowRef(false);
	const hovering = shallowRef(false);
	const inert = shallowRef(false);
	const desktop = useMediaQuery("(min-width: 768px)");
	const reduced = usePreferredReducedMotion();
	const forcedColors = useMediaQuery("(forced-colors: active)");
	const tallViewport = useMediaQuery("(min-height: 680px)");
	const visibility = useDocumentVisibility();
	const inViewport = useElementVisibility(stage, { threshold: .05 });
	const main = computed(() => track.value?.closest("main"));
	useMutationObserver(main, () => {
		inert.value = Boolean(main.value?.inert);
	}, {
		attributes: true,
		attributeFilter: ["inert"]
	});
	const running = computed(() => mounted.value && desktop.value && !paused.value && !hovering.value && !inert.value && reduced.value !== "reduce" && !forcedColors.value && visibility.value === "visible" && inViewport.value);
	const timer = useTimeoutFn(() => {
		active.value = (active.value + 1) % count;
		timer.start();
	}, 5e3, { immediate: false });
	watch(running, (value) => {
		timer.stop();
		if (value) timer.start();
	});
	onMounted(() => {
		mounted.value = true;
	});
	const stackEnabled = computed(() => !desktop.value && tallViewport.value && reduced.value !== "reduce" && !forcedColors.value);
	const { top, height } = useElementBounding(() => stackEnabled.value ? track.value : null);
	const { height: stageHeight } = useElementBounding(() => stackEnabled.value ? stage.value : null, { windowScroll: false });
	const { height: viewportHeight } = useWindowSize({ initialHeight: 620 });
	const progress = computed(() => {
		if (!mounted.value || !height.value || !stageHeight.value) return 0;
		return Math.max(0, Math.min(count - 1, (-top.value + 16) / Math.max(1, height.value - Math.max(stageHeight.value, viewportHeight.value)) * (count - 1)));
	});
	const layers = computed(() => {
		const whole = Math.floor(progress.value);
		const fraction = Math.max(0, Math.min(1, (progress.value - whole - .8) / .2));
		const visual = whole + fraction * fraction * (3 - 2 * fraction);
		return Array.from({ length: count }, (_, index) => ({
			"--v2-order": index,
			"--v2-arrival": Math.max(0, Math.min(1, visual - index + 1)),
			"--v2-age": Math.max(0, Math.min(count - 1, visual - index))
		}));
	});
	function select(index) {
		paused.value = true;
		active.value = index;
	}
	function enter(event) {
		if (event.pointerType === "mouse") hovering.value = true;
	}
	function leave() {
		hovering.value = false;
	}
	function pause() {
		paused.value = true;
	}
	return {
		active: readonly(active),
		running,
		layers,
		select,
		enter,
		leave,
		pause
	};
}
//#endregion
//#region resources/js/data/landingV2Benefits.js
var LANDING_V2_BENEFITS = [
	{
		label: "Старт",
		title: "Подключился — и погнали",
		description: "Никаких сложных настроек. Пара простых действий — и любимые сервисы снова под рукой.",
		icon: "plug-zap",
		image: "connection"
	},
	{
		label: "Скорость",
		title: "Скорость без компромиссов",
		description: "Смотри видео, созванивайся, работай и переключайся между задачами с комфортом.",
		icon: "zap",
		image: "speed"
	},
	{
		label: "Устройства",
		title: "Один доступ. До 5 устройств",
		description: "Пользуйся сервисом на смартфоне, ноутбуке или планшете и делись подпиской с близкими.",
		icon: "monitor-smartphone",
		image: "devices"
	},
	{
		label: "Защита",
		title: "Твоё соединение под защитой",
		description: "Защищённое подключение для работы, общения и повседневных задач.",
		icon: "shield-check",
		image: "protection"
	},
	{
		label: "Свобода",
		title: "Больше свободы каждый день",
		description: "Любимые инструменты для творчества, развлечений и общения — в одном подключении.",
		icon: "layout-grid",
		image: "freedom"
	},
	{
		label: "Поддержка",
		title: "Мы рядом",
		description: "Возникли вопросы? Поможем разобраться с подключением и использованием сервиса.",
		icon: "headphones",
		image: "support"
	}
];
//#endregion
//#region resources/js/components/landing-v2/LandingV2Benefits.vue
var _sfc_main$13 = {
	__name: "LandingV2Benefits",
	__ssrInlineRender: true,
	setup(__props) {
		const track = useTemplateRef("track");
		const { active, running, layers, select, enter, leave, pause } = useLandingV2Benefits(track, useTemplateRef("stage"), LANDING_V2_BENEFITS.length);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				id: "advantages",
				ref_key: "track",
				ref: track,
				class: "v2-benefits relative min-w-0 outline-none",
				tabindex: "-1",
				"aria-label": "Преимущества dudeweb",
				"data-v2-benefits": ""
			}, _attrs))} data-v-e6383288><div class="v2-benefits-stage" data-v-e6383288><div class="v2-benefits-field" data-v-e6383288><!--[-->`);
			ssrRenderList(unref(LANDING_V2_BENEFITS), (benefit, index) => {
				_push(ssrRenderComponent(LandingV2BenefitCard_default, {
					key: benefit.label,
					benefit,
					index,
					active: unref(active) === index,
					running: unref(running),
					style: unref(layers)[index],
					onSelect: unref(select)
				}, null, _parent));
			});
			_push(`<!--]--></div></div></div>`);
		};
	}
};
var _sfc_setup$13 = _sfc_main$13.setup;
_sfc_main$13.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/landing-v2/LandingV2Benefits.vue");
	return _sfc_setup$13 ? _sfc_setup$13(props, ctx) : void 0;
};
var LandingV2Benefits_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$13, [["__scopeId", "data-v-e6383288"]]);
//#endregion
//#region resources/js/components/landing-v2/LandingV2Section.vue
var _sfc_main$12 = {
	__name: "LandingV2Section",
	__ssrInlineRender: true,
	props: { variant: {
		type: String,
		default: "hero",
		validator: (value) => [
			"hero",
			"platforms",
			"connection",
			"news",
			"subscription",
			"footer"
		].includes(value)
	} },
	setup(__props) {
		const SECTION_CLASSES = {
			hero: "pt-v2-hero-top pb-v2-hero-bottom",
			platforms: "pt-v2-platforms-top pb-v2-platforms-bottom",
			connection: "pt-v2-connection-top pb-v2-connection-bottom",
			news: "pt-v2-news-top pb-v2-news-bottom",
			subscription: "pt-v2-subscription-top pb-v2-subscription-bottom",
			footer: "pt-v2-footer-top pb-v2-footer-bottom"
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: ["px-v2-gutter", SECTION_CLASSES[__props.variant] ?? SECTION_CLASSES.hero] }, _attrs))}><div class="mx-auto grid w-full max-w-v2-content min-w-0 grid-cols-1 gap-v2-stack">`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</div></section>`);
		};
	}
};
var _sfc_setup$12 = _sfc_main$12.setup;
_sfc_main$12.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/landing-v2/LandingV2Section.vue");
	return _sfc_setup$12 ? _sfc_setup$12(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/landing-v2/LandingV2Hero.vue
var _sfc_main$11 = {
	__name: "LandingV2Hero",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(_sfc_main$12, mergeProps({
				"aria-labelledby": "landing-v2-title",
				"data-v2-hero": ""
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="v2-hero-intro grid gap-3" data-v-5b871ed8${_scopeId}><div class="v2-hero-row grid min-w-0 gap-6" data-v-5b871ed8${_scopeId}><div class="grid min-w-0 gap-v2-title-gap" data-v-5b871ed8${_scopeId}><p class="flex items-center gap-4 font-mono text-v2-eyebrow tracking-v2-greeting text-v2-greeting" data-v-5b871ed8${_scopeId}><span aria-hidden="true" class="h-px w-v2-greeting-rule shrink-0 bg-v2-rule" data-v-5b871ed8${_scopeId}></span> Hey, Dude! </p><h1 id="landing-v2-title" class="text-v2-hero font-medium tracking-v2-hero" data-v-5b871ed8${_scopeId}><span class="block" data-v-5b871ed8${_scopeId}>Любимые сервисы${ssrInterpolate(" ")}</span><span class="block text-v2-hero-accent" data-v-5b871ed8${_scopeId}>снова рядом.</span></h1></div><div class="v2-hero-support flex min-w-0 flex-col gap-5" data-v-5b871ed8${_scopeId}><p class="max-w-v2-hero-copy text-v2-body text-v2-hero-copy" data-v-5b871ed8${_scopeId}> dudeweb помогает пользоваться любимыми сервисами для работы, развлечений и общения — просто и без лишних сложностей. </p>`);
						_push(ssrRenderComponent(_sfc_main$20, {
							href: unref(LANDING_V2_TRIAL),
							variant: "heroTrial",
							"data-v2-hero-cta": ""
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Попробовать бесплатно `);
								else return [createTextVNode(" Попробовать бесплатно ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></div><p class="v2-hero-trial text-v2-trial text-v2-hero-copy" data-v-5b871ed8${_scopeId}>3 дня бесплатно · До 5 устройств</p></div>`);
						_push(ssrRenderComponent(LandingV2Benefits_default, null, null, _parent, _scopeId));
					} else return [createVNode("div", { class: "v2-hero-intro grid gap-3" }, [createVNode("div", { class: "v2-hero-row grid min-w-0 gap-6" }, [createVNode("div", { class: "grid min-w-0 gap-v2-title-gap" }, [createVNode("p", { class: "flex items-center gap-4 font-mono text-v2-eyebrow tracking-v2-greeting text-v2-greeting" }, [createVNode("span", {
						"aria-hidden": "true",
						class: "h-px w-v2-greeting-rule shrink-0 bg-v2-rule"
					}), createTextVNode(" Hey, Dude! ")]), createVNode("h1", {
						id: "landing-v2-title",
						class: "text-v2-hero font-medium tracking-v2-hero"
					}, [createVNode("span", { class: "block" }, "Любимые сервисы" + toDisplayString(" ")), createVNode("span", { class: "block text-v2-hero-accent" }, "снова рядом.")])]), createVNode("div", { class: "v2-hero-support flex min-w-0 flex-col gap-5" }, [createVNode("p", { class: "max-w-v2-hero-copy text-v2-body text-v2-hero-copy" }, " dudeweb помогает пользоваться любимыми сервисами для работы, развлечений и общения — просто и без лишних сложностей. "), createVNode(_sfc_main$20, {
						href: unref(LANDING_V2_TRIAL),
						variant: "heroTrial",
						"data-v2-hero-cta": ""
					}, {
						default: withCtx(() => [createTextVNode(" Попробовать бесплатно ")]),
						_: 1
					}, 8, ["href"])])]), createVNode("p", { class: "v2-hero-trial text-v2-trial text-v2-hero-copy" }, "3 дня бесплатно · До 5 устройств")]), createVNode(LandingV2Benefits_default)];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup$11 = _sfc_main$11.setup;
_sfc_main$11.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/landing-v2/LandingV2Hero.vue");
	return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
var LandingV2Hero_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$11, [["__scopeId", "data-v-5b871ed8"]]);
//#endregion
//#region resources/js/components/landing-v2/LandingV2Platforms.vue
var _sfc_main$10 = {
	__name: "LandingV2Platforms",
	__ssrInlineRender: true,
	setup(__props) {
		const PLATFORMS = [
			{
				label: "Windows",
				icon: "platform-windows"
			},
			{
				label: "macOS",
				icon: "platform-apple"
			},
			{
				label: "Linux",
				icon: "platform-linux"
			},
			{
				label: "Android",
				icon: "platform-android"
			},
			{
				label: "iOS",
				icon: "platform-apple"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(_sfc_main$12, mergeProps({
				id: "devices",
				variant: "platforms",
				"aria-labelledby": "v2-platforms-title",
				tabindex: "-1",
				class: "outline-none",
				"data-v2-platforms": ""
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="overflow-clip rounded-v2-panel ring-1 ring-v2-border ring-inset" data-v2-platform-table data-v-f231977c${_scopeId}><ul class="grid h-v2-platform-row grid-cols-5 divide-x divide-v2-border border-b border-v2-border" aria-label="Поддерживаемые платформы" data-v2-platform-row data-v-f231977c${_scopeId}><!--[-->`);
						ssrRenderList(PLATFORMS, (platform) => {
							_push(`<li class="v2-platform-cell flex min-w-0 flex-col items-center justify-center gap-v2-platform-cell py-3 md:flex-row" data-v-f231977c${_scopeId}>`);
							_push(ssrRenderComponent(_sfc_main$101, {
								name: platform.icon,
								class: "v2-platform-icon text-v2-platform-glyph"
							}, null, _parent, _scopeId));
							_push(`<span class="v2-platform-label w-v2-platform-label text-center text-v2-platform-label font-semibold md:text-left" data-v-f231977c${_scopeId}>${ssrInterpolate(platform.label)}</span></li>`);
						});
						_push(`<!--]--></ul><div class="v2-platform-information grid min-w-0 items-center" data-v-f231977c${_scopeId}><div class="v2-platform-facts min-w-0" data-v-f231977c${_scopeId}><dl class="grid min-h-v2-platform-facts grid-cols-2 divide-x divide-v2-border border-b border-v2-border" data-v2-platform-facts data-v-f231977c${_scopeId}><div class="flex min-w-0 flex-col items-center justify-center gap-2 p-v2-platform-fact-pad text-center" data-v-f231977c${_scopeId}><dt class="order-2 w-full text-v2-platform-explanation text-v2-secondary" data-v-f231977c${_scopeId}>устройств одновременно</dt><dd class="whitespace-nowrap text-v2-platform-limit font-medium tracking-v2-platform text-v2-platform-ink" data-v-f231977c${_scopeId}>До 5</dd></div><div class="flex min-w-0 flex-col items-center justify-center gap-2 p-v2-platform-fact-pad text-center" data-v-f231977c${_scopeId}><dt class="order-2 w-full text-v2-platform-explanation text-v2-secondary" data-v-f231977c${_scopeId}>для привычных платформ</dt><dd class="whitespace-nowrap text-v2-platform-access font-medium tracking-v2-platform text-v2-platform-ink" data-v-f231977c${_scopeId}>Один доступ</dd></div></dl><p class="min-h-v2-platform-setup px-v2-platform-setup-inline py-v2-platform-setup-block text-v2-platform-setup text-v2-secondary" data-v2-platform-setup data-v-f231977c${_scopeId}> Одно подключение для привычных платформ. Без необходимости разбираться в сложных настройках. </p></div><div class="grid min-w-0 gap-5 p-v2-platform-story text-center" data-v2-platform-story data-v-f231977c${_scopeId}><div class="flex min-w-0 items-center justify-center gap-4" data-v-f231977c${_scopeId}><span aria-hidden="true" class="h-v2-content-marker-height w-v2-content-marker-width shrink-0 bg-v2-brand" data-v-f231977c${_scopeId}></span><h2 id="v2-platforms-title" class="v2-platform-heading min-w-0 flex-1 text-v2-platform-heading font-medium tracking-v2-platform-heading v2-desktop:flex-none" data-v-f231977c${_scopeId}> Где ты — там${ssrInterpolate(" ")}<br class="v2-desktop:hidden" data-v-f231977c${_scopeId}>и dudeweb </h2></div><p class="text-v2-platform-story text-v2-secondary" data-v-f231977c${_scopeId}>Работай с ноутбука, смотри с планшета, общайся со смартфона. Привычные сервисы всегда под рукой.</p></div></div></div>`);
					} else return [createVNode("div", {
						class: "overflow-clip rounded-v2-panel ring-1 ring-v2-border ring-inset",
						"data-v2-platform-table": ""
					}, [createVNode("ul", {
						class: "grid h-v2-platform-row grid-cols-5 divide-x divide-v2-border border-b border-v2-border",
						"aria-label": "Поддерживаемые платформы",
						"data-v2-platform-row": ""
					}, [(openBlock(), createBlock(Fragment, null, renderList(PLATFORMS, (platform) => {
						return createVNode("li", {
							key: platform.label,
							class: "v2-platform-cell flex min-w-0 flex-col items-center justify-center gap-v2-platform-cell py-3 md:flex-row"
						}, [createVNode(_sfc_main$101, {
							name: platform.icon,
							class: "v2-platform-icon text-v2-platform-glyph"
						}, null, 8, ["name"]), createVNode("span", { class: "v2-platform-label w-v2-platform-label text-center text-v2-platform-label font-semibold md:text-left" }, toDisplayString(platform.label), 1)]);
					}), 64))]), createVNode("div", { class: "v2-platform-information grid min-w-0 items-center" }, [createVNode("div", { class: "v2-platform-facts min-w-0" }, [createVNode("dl", {
						class: "grid min-h-v2-platform-facts grid-cols-2 divide-x divide-v2-border border-b border-v2-border",
						"data-v2-platform-facts": ""
					}, [createVNode("div", { class: "flex min-w-0 flex-col items-center justify-center gap-2 p-v2-platform-fact-pad text-center" }, [createVNode("dt", { class: "order-2 w-full text-v2-platform-explanation text-v2-secondary" }, "устройств одновременно"), createVNode("dd", { class: "whitespace-nowrap text-v2-platform-limit font-medium tracking-v2-platform text-v2-platform-ink" }, "До 5")]), createVNode("div", { class: "flex min-w-0 flex-col items-center justify-center gap-2 p-v2-platform-fact-pad text-center" }, [createVNode("dt", { class: "order-2 w-full text-v2-platform-explanation text-v2-secondary" }, "для привычных платформ"), createVNode("dd", { class: "whitespace-nowrap text-v2-platform-access font-medium tracking-v2-platform text-v2-platform-ink" }, "Один доступ")])]), createVNode("p", {
						class: "min-h-v2-platform-setup px-v2-platform-setup-inline py-v2-platform-setup-block text-v2-platform-setup text-v2-secondary",
						"data-v2-platform-setup": ""
					}, " Одно подключение для привычных платформ. Без необходимости разбираться в сложных настройках. ")]), createVNode("div", {
						class: "grid min-w-0 gap-5 p-v2-platform-story text-center",
						"data-v2-platform-story": ""
					}, [createVNode("div", { class: "flex min-w-0 items-center justify-center gap-4" }, [createVNode("span", {
						"aria-hidden": "true",
						class: "h-v2-content-marker-height w-v2-content-marker-width shrink-0 bg-v2-brand"
					}), createVNode("h2", {
						id: "v2-platforms-title",
						class: "v2-platform-heading min-w-0 flex-1 text-v2-platform-heading font-medium tracking-v2-platform-heading v2-desktop:flex-none"
					}, [
						createTextVNode(" Где ты — там" + toDisplayString(" ")),
						createVNode("br", { class: "v2-desktop:hidden" }),
						createTextVNode("и dudeweb ")
					])]), createVNode("p", { class: "text-v2-platform-story text-v2-secondary" }, "Работай с ноутбука, смотри с планшета, общайся со смартфона. Привычные сервисы всегда под рукой.")])])])];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup$10 = _sfc_main$10.setup;
_sfc_main$10.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/landing-v2/LandingV2Platforms.vue");
	return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
var LandingV2Platforms_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$10, [["__scopeId", "data-v-f231977c"]]);
var LANDING_V2_SIGNAL_NODES = [
	[
		"instagram",
		80,
		52
	],
	[
		"facebook",
		144,
		74
	],
	[
		"threads",
		260,
		62
	],
	[
		"x",
		316,
		110
	],
	[
		"linkedin",
		40,
		140
	],
	[
		"youtube",
		110,
		156
	],
	[
		"telegram",
		198,
		132
	],
	[
		"discord",
		276,
		174
	],
	[
		"patreon",
		64,
		232
	],
	[
		"onlyfans",
		144,
		226
	],
	[
		"soundcloud",
		224,
		246
	],
	[
		"spotify",
		304,
		214
	],
	[
		"openai",
		36,
		320
	],
	[
		"anthropic",
		112,
		310
	],
	[
		"googlegemini",
		188,
		334
	],
	[
		"steam",
		270,
		298
	],
	[
		"tiktok",
		330,
		350
	],
	[
		"signal",
		64,
		406
	],
	[
		"airbnb",
		140,
		388
	],
	[
		"bookingdotcom",
		218,
		424
	],
	[
		"ubisoft",
		300,
		402
	],
	[
		"ea",
		112,
		466
	],
	[
		"netflix",
		252,
		478
	]
].map(([name, x, y], index) => {
	const start = x + 18;
	const endY = 260 + (index % 5 - 2) * 1.1;
	return {
		name,
		x,
		y,
		index,
		period: 7 + index * 1.37 % 6,
		phaseOffset: index * 1.91,
		route: `M ${start} ${y} C ${(start + (584 - start) / 3).toFixed(3)} ${y} ${(start + (584 - start) * 2 / 3).toFixed(3)} ${endY} 584 ${endY}`,
		pulseX: start + index * 79 % (584 - start)
	};
});
function smoothstep(min, max, value) {
	const fraction = Math.max(0, Math.min(1, (value - min) / (max - min)));
	return fraction * fraction * (3 - 2 * fraction);
}
function signalPresence(node, time) {
	const phase = (time + node.phaseOffset) % node.period;
	return .9 * smoothstep(0, 1.1, phase) * (1 - smoothstep(node.period * .65, node.period * .85, phase));
}
function signalPulseX(node, time) {
	const start = node.x + 18;
	return start + (time * 54 + node.index * 79) % (584 - start);
}
function signalWavePulseX(index, time) {
	return 584 + (time * 66 + index * 93) % 760;
}
function signalWavePath(index, time) {
	return Array.from({ length: 117 }, (_, step) => {
		const x = 584 + step * 6;
		const y = 260 + (index - 2) * 3.5 + Math.sin((x - 584) * .018 - time * .65 + index * .22) * 5.5 * smoothstep(584, 720, x);
		return `${step ? "L" : "M"}${x} ${y.toFixed(3)}`;
	}).join(" ");
}
function signalRing(index, time) {
	const phase = (time * .065 + index / 3) % 1;
	return {
		radius: 30 + phase * 140,
		opacity: (1 - phase) * .34
	};
}
var LANDING_V2_SIGNAL_WAVES = Array.from({ length: 5 }, (_, index) => ({
	index,
	pulseX: signalWavePulseX(index, 0),
	path: signalWavePath(index, 0)
}));
var LANDING_V2_SIGNAL_RINGS = Array.from({ length: 3 }, (_, index) => ({
	index,
	...signalRing(index, 0)
}));
//#endregion
//#region resources/js/composables/useLandingV2SignalMotion.js
function useLandingV2SignalMotion(target) {
	const mounted = shallowRef(false);
	const inert = shallowRef(false);
	const inViewport = useElementVisibility(target, { threshold: .01 });
	const visibility = useDocumentVisibility();
	const reduced = usePreferredReducedMotion();
	const forcedColors = useMediaQuery("(forced-colors: active)");
	const main = computed(() => target.value?.closest("main"));
	const staticMode = computed(() => reduced.value === "reduce" || forcedColors.value);
	const running = computed(() => mounted.value && inViewport.value && visibility.value === "visible" && !inert.value && !staticMode.value);
	const state = computed(() => !mounted.value || staticMode.value ? "static" : running.value ? "running" : "paused");
	let elapsed = 0;
	let elements;
	useMutationObserver(main, () => {
		inert.value = Boolean(main.value?.inert);
	}, {
		attributes: true,
		attributeFilter: ["inert"]
	});
	function moveGradient(gradient, center, halfWidth) {
		gradient.setAttribute("x1", (center - halfWidth).toFixed(3));
		gradient.setAttribute("x2", (center + halfWidth).toFixed(3));
	}
	function render(time, isStatic = false) {
		elements.pairs.forEach((pair, index) => {
			const node = LANDING_V2_SIGNAL_NODES[index];
			pair.setAttribute("opacity", isStatic ? "0.82" : signalPresence(node, time).toFixed(5));
			moveGradient(elements.incoming[index], signalPulseX(node, time), 36);
		});
		elements.waves.forEach((wave, index) => {
			const path = signalWavePath(index, time);
			wave.forEach((element) => element.setAttribute("d", path));
			moveGradient(elements.outgoing[index], signalWavePulseX(index, time), 56);
		});
		elements.rings.forEach((element, index) => {
			const ring = signalRing(index, time);
			element.setAttribute("r", ring.radius.toFixed(3));
			element.setAttribute("opacity", ring.opacity.toFixed(5));
		});
	}
	const { pause, resume } = useRafFn(({ delta }) => {
		elapsed += delta / 1e3;
		render(elapsed);
	}, {
		immediate: false,
		fpsLimit: 30
	});
	watch([running, staticMode], ([enabled, isStatic]) => {
		pause();
		if (!elements) return;
		if (isStatic) {
			elapsed = 0;
			render(0, true);
		} else if (enabled) {
			render(elapsed);
			resume();
		}
	}, { flush: "post" });
	onMounted(() => {
		const root = target.value;
		elements = {
			pairs: [...root.querySelectorAll("[data-v2-signal-pair]")],
			incoming: [...root.querySelectorAll("[data-v2-signal-incoming]")],
			outgoing: [...root.querySelectorAll("[data-v2-signal-outgoing]")],
			waves: [...root.querySelectorAll("[data-v2-signal-wave]")].map((group) => [...group.querySelectorAll("path")]),
			rings: [...root.querySelectorAll("[data-v2-signal-ring]")]
		};
		inert.value = Boolean(main.value?.inert);
		mounted.value = true;
	});
	return { state };
}
//#endregion
//#region resources/js/components/landing-v2/LandingV2Signal.vue
var _sfc_main$9 = {
	__name: "LandingV2Signal",
	__ssrInlineRender: true,
	setup(__props) {
		const { state } = useLandingV2SignalMotion(useTemplateRef("signal"));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				ref: "signal",
				class: "v2-signal relative min-w-0 overflow-clip",
				"aria-hidden": "true",
				"data-v2-signal": "",
				"data-state": unref(state)
			}, _attrs))} data-v-21e8fb97><svg class="v2-signal-art absolute top-0 left-0 h-full max-w-none" viewBox="0 0 1280 520" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-21e8fb97><defs data-v-21e8fb97><pattern id="v2-signal-grid" width="24" height="24" patternUnits="userSpaceOnUse" data-v-21e8fb97><path d="M24 0H0V24" class="v2-signal-grid" data-v-21e8fb97></path></pattern><linearGradient id="v2-signal-grid-x" x1="0" y1="0" x2="590" y2="0" gradientUnits="userSpaceOnUse" data-v-21e8fb97><stop offset="0.5085" stop-color="white" data-v-21e8fb97></stop><stop offset="1" stop-color="white" stop-opacity="0" data-v-21e8fb97></stop></linearGradient><linearGradient id="v2-signal-grid-y" x1="0" y1="0" x2="0" y2="520" gradientUnits="userSpaceOnUse" data-v-21e8fb97><stop stop-color="white" stop-opacity="0" data-v-21e8fb97></stop><stop offset="0.1058" stop-color="white" data-v-21e8fb97></stop><stop offset="0.8462" stop-color="white" data-v-21e8fb97></stop><stop offset="1" stop-color="white" stop-opacity="0" data-v-21e8fb97></stop></linearGradient><mask id="v2-signal-grid-vertical" data-v-21e8fb97><rect width="590" height="520" fill="url(#v2-signal-grid-y)" data-v-21e8fb97></rect></mask><mask id="v2-signal-grid-fade" data-v-21e8fb97><rect width="590" height="520" fill="url(#v2-signal-grid-x)" mask="url(#v2-signal-grid-vertical)" data-v-21e8fb97></rect></mask><linearGradient id="v2-signal-ring-fade" x1="582" y1="0" x2="704" y2="0" gradientUnits="userSpaceOnUse" data-v-21e8fb97><stop stop-color="white" stop-opacity="0" data-v-21e8fb97></stop><stop offset="0.0984" stop-color="white" data-v-21e8fb97></stop><stop offset="0.6393" stop-color="white" data-v-21e8fb97></stop><stop offset="1" stop-color="white" stop-opacity="0" data-v-21e8fb97></stop></linearGradient><mask id="v2-signal-rings" data-v-21e8fb97><rect x="582" width="122" height="520" fill="url(#v2-signal-ring-fade)" data-v-21e8fb97></rect></mask><!--[-->`);
			ssrRenderList(unref(LANDING_V2_SIGNAL_NODES), (node) => {
				_push(`<linearGradient${ssrRenderAttr("id", `v2-signal-pulse-${node.name}`)}${ssrRenderAttr("x1", node.pulseX - 36)}${ssrRenderAttr("x2", node.pulseX + 36)} y1="0" y2="0" gradientUnits="userSpaceOnUse" data-v2-signal-incoming data-v-21e8fb97><stop class="v2-signal-pulse-color" stop-opacity="0" data-v-21e8fb97></stop><stop offset="0.5" class="v2-signal-pulse-color" stop-opacity="0.7" data-v-21e8fb97></stop><stop offset="1" class="v2-signal-pulse-color" stop-opacity="0" data-v-21e8fb97></stop></linearGradient>`);
			});
			_push(`<!--]--><!--[-->`);
			ssrRenderList(unref(LANDING_V2_SIGNAL_WAVES), (wave) => {
				_push(`<linearGradient${ssrRenderAttr("id", `v2-signal-wave-pulse-${wave.index}`)}${ssrRenderAttr("x1", wave.pulseX - 56)}${ssrRenderAttr("x2", wave.pulseX + 56)} y1="0" y2="0" gradientUnits="userSpaceOnUse" data-v2-signal-outgoing data-v-21e8fb97><stop class="v2-signal-pulse-color" stop-opacity="0" data-v-21e8fb97></stop><stop offset="0.5" class="v2-signal-pulse-color" stop-opacity="0.7" data-v-21e8fb97></stop><stop offset="1" class="v2-signal-pulse-color" stop-opacity="0" data-v-21e8fb97></stop></linearGradient>`);
			});
			_push(`<!--]--></defs><rect width="590" height="520" fill="url(#v2-signal-grid)" mask="url(#v2-signal-grid-fade)" data-v-21e8fb97></rect><!--[-->`);
			ssrRenderList(unref(LANDING_V2_SIGNAL_NODES), (node) => {
				_push(`<g opacity="0.82" class="v2-signal-pair"${ssrRenderAttr("data-v2-signal-pair", node.name)} data-v-21e8fb97><path${ssrRenderAttr("d", node.route)} class="v2-signal-route" data-v2-signal-route data-v-21e8fb97></path><path${ssrRenderAttr("d", node.route)}${ssrRenderAttr("stroke", `url(#v2-signal-pulse-${node.name})`)} stroke-width="1.5" data-v-21e8fb97></path><rect${ssrRenderAttr("x", node.x - 18)}${ssrRenderAttr("y", node.y - 18)} width="36" height="36" rx="5" class="v2-signal-node" data-v-21e8fb97></rect><image${ssrRenderAttr("href", `/landing-v2/brands/${node.name}.png`)}${ssrRenderAttr("x", node.x - 10)}${ssrRenderAttr("y", node.y - 10)} width="20" height="20" data-v-21e8fb97></image></g>`);
			});
			_push(`<!--]--><!--[-->`);
			ssrRenderList(unref(LANDING_V2_SIGNAL_WAVES), (wave) => {
				_push(`<g data-v2-signal-wave data-v-21e8fb97><path${ssrRenderAttr("d", wave.path)} class="v2-signal-wave" data-v-21e8fb97></path><path${ssrRenderAttr("d", wave.path)}${ssrRenderAttr("stroke", `url(#v2-signal-wave-pulse-${wave.index})`)} stroke-width="1.64" data-v-21e8fb97></path></g>`);
			});
			_push(`<!--]--><g mask="url(#v2-signal-rings)" data-v-21e8fb97><!--[-->`);
			ssrRenderList(unref(LANDING_V2_SIGNAL_RINGS), (ring) => {
				_push(`<circle cx="584" cy="260"${ssrRenderAttr("r", ring.radius)}${ssrRenderAttr("opacity", ring.opacity)} class="v2-signal-ring" data-v2-signal-ring data-v-21e8fb97></circle>`);
			});
			_push(`<!--]--></g></svg><div class="v2-signal-origin absolute flex items-center justify-center bg-v2-page shadow-v2-origin ring-1 ring-v2-signal-origin ring-inset" data-v2-signal-origin data-v-21e8fb97><img src="/landing-v2/brand/mark.svg" alt="" width="44" height="36" class="v2-signal-mark" data-v-21e8fb97></div><span class="v2-signal-caption absolute flex items-center justify-center bg-v2-page text-center text-v2-signal-caption font-medium text-v2-signal-caption-ink" data-v-21e8fb97>dudeweb</span></div>`);
		};
	}
};
var _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/landing-v2/LandingV2Signal.vue");
	return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
var LandingV2Signal_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$9, [["__scopeId", "data-v-21e8fb97"]]);
//#endregion
//#region resources/js/components/landing-v2/LandingV2Connection.vue
var _sfc_main$8 = {
	__name: "LandingV2Connection",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(_sfc_main$12, mergeProps({
				variant: "connection",
				"aria-labelledby": "v2-connection-title",
				"data-v2-connection": ""
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="v2-connection-composition relative grid min-w-0 gap-7" data-v-e0595acd${_scopeId}><div class="v2-connection-intro grid min-w-0 gap-5" data-v2-connection-intro data-v-e0595acd${_scopeId}><div class="v2-connection-heading flex min-w-0 items-start gap-v2-connection-marker-gap" data-v-e0595acd${_scopeId}><span aria-hidden="true" class="v2-connection-marker mt-v2-connection-marker-top h-v2-connection-marker-height w-v2-content-marker-width shrink-0 bg-v2-brand" data-v-e0595acd${_scopeId}></span><h2 id="v2-connection-title" class="min-w-0 text-v2-connection-heading font-medium tracking-v2-connection" data-v-e0595acd${_scopeId}> Одно подключение.${ssrInterpolate(" ")}<br data-v-e0595acd${_scopeId}>Больше свободы. </h2></div><p class="v2-connection-copy text-v2-body text-v2-secondary" data-v2-connection-copy data-v-e0595acd${_scopeId}> Любимые инструменты для творчества, развлечений и общения — в одном подключении. </p></div>`);
						_push(ssrRenderComponent(LandingV2Signal_default, null, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "v2-connection-composition relative grid min-w-0 gap-7" }, [createVNode("div", {
						class: "v2-connection-intro grid min-w-0 gap-5",
						"data-v2-connection-intro": ""
					}, [createVNode("div", { class: "v2-connection-heading flex min-w-0 items-start gap-v2-connection-marker-gap" }, [createVNode("span", {
						"aria-hidden": "true",
						class: "v2-connection-marker mt-v2-connection-marker-top h-v2-connection-marker-height w-v2-content-marker-width shrink-0 bg-v2-brand"
					}), createVNode("h2", {
						id: "v2-connection-title",
						class: "min-w-0 text-v2-connection-heading font-medium tracking-v2-connection"
					}, [
						createTextVNode(" Одно подключение." + toDisplayString(" ")),
						createVNode("br"),
						createTextVNode("Больше свободы. ")
					])]), createVNode("p", {
						class: "v2-connection-copy text-v2-body text-v2-secondary",
						"data-v2-connection-copy": ""
					}, " Любимые инструменты для творчества, развлечений и общения — в одном подключении. ")]), createVNode(LandingV2Signal_default)])];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/landing-v2/LandingV2Connection.vue");
	return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
var LandingV2Connection_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$8, [["__scopeId", "data-v-e0595acd"]]);
//#endregion
//#region resources/js/components/landing-v2/LandingV2NewsCard.vue
var _sfc_main$7 = {
	__name: "LandingV2NewsCard",
	__ssrInlineRender: true,
	props: { item: {
		type: Object,
		required: true
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<article${ssrRenderAttrs(mergeProps({
				"aria-labelledby": `v2-news-${__props.item.id}-title`,
				class: "v2-news-card grid min-w-0 content-start gap-v2-news-card",
				"data-v2-news-card": __props.item.id
			}, _attrs))} data-v-f9556deb><img${ssrRenderAttr("src", __props.item.cover)} alt="" width="1024" height="1024" class="v2-news-cover block w-full rounded-v2-news-cover border border-v2-cover-border object-cover" data-v2-news-cover data-v-f9556deb><div class="grid min-w-0 gap-v2-news-card" data-v2-news-copy data-v-f9556deb><div class="flex flex-wrap items-center gap-3 text-v2-news-meta" data-v2-news-metadata data-v-f9556deb><span class="rounded-v2-tag bg-v2-tag-surface px-v2-news-tag-inline py-v2-news-tag-block font-medium text-v2-tag-text" data-v2-news-category data-v-f9556deb>${ssrInterpolate(__props.item.category)}</span><time${ssrRenderAttr("datetime", __props.item.date)} class="whitespace-nowrap text-v2-date" data-v-f9556deb>${ssrInterpolate(__props.item.dateLabel)}</time></div><h3${ssrRenderAttr("id", `v2-news-${__props.item.id}-title`)} class="text-v2-story-title font-medium tracking-v2-story whitespace-pre-line text-v2-story-ink" data-v-f9556deb>${ssrInterpolate(__props.item.title)}</h3></div></article>`);
		};
	}
};
var _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/landing-v2/LandingV2NewsCard.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var LandingV2NewsCard_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$7, [["__scopeId", "data-v-f9556deb"]]);
//#endregion
//#region resources/js/data/landingV2News.js
var LANDING_V2_NEWS = [
	{
		id: "netherlands",
		category: "Локации",
		title: "Новая локация —\nНидерланды",
		date: "2026-11-04",
		dateLabel: "4 ноября 2026",
		cover: "/landing-v2/images/netherlands.jpg"
	},
	{
		id: "maintenance",
		category: "Обслуживание",
		title: "Техническое обслуживание\nсерверов",
		date: "2026-11-02",
		dateLabel: "2 ноября 2026",
		cover: "/landing-v2/images/maintenance.jpg"
	},
	{
		id: "service-restored",
		category: "Статус",
		title: "Сервис снова\nработает",
		date: "2026-11-03",
		dateLabel: "3 ноября 2026",
		cover: "/landing-v2/images/service-restored.jpg"
	}
];
//#endregion
//#region resources/js/components/landing-v2/LandingV2News.vue
var _sfc_main$6 = {
	__name: "LandingV2News",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(_sfc_main$12, mergeProps({
				variant: "news",
				"aria-labelledby": "v2-news-title",
				"data-v2-news": ""
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div data-v2-news-grid${_scopeId}><div class="flex flex-wrap items-center justify-between gap-2 px-v2-news-heading-inline py-v2-news-heading-block shadow-v2-news-rule md:gap-4" data-v2-news-heading${_scopeId}><div class="flex shrink-0 items-center gap-v2-news-marker"${_scopeId}><span class="h-v2-content-marker-height w-v2-content-marker-width shrink-0 bg-v2-brand" aria-hidden="true"${_scopeId}></span><h2 id="v2-news-title" class="text-v2-section-heading font-medium tracking-v2-section text-v2-heading"${_scopeId}>Новости сервиса</h2></div><span class="inline-flex h-v2-news-all-height shrink-0 items-center justify-center gap-v2-news-all rounded-v2-panel bg-v2-brand px-v2-news-all-inline text-v2-news-all font-medium text-v2-ink" data-v2-news-all${_scopeId}> Все новости <svg class="size-v2-news-arrow shrink-0" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${_scopeId}><path d="M5 12h14m-6-6 6 6-6 6"${_scopeId}></path></svg></span></div><div class="grid min-w-0 items-start gap-v2-news-grid px-v2-news-list-inline pt-v2-news-list-top pb-v2-news-list-bottom v2-tablet-wide:grid-cols-3" data-v2-news-list${_scopeId}><!--[-->`);
						ssrRenderList(unref(LANDING_V2_NEWS), (item) => {
							_push(ssrRenderComponent(LandingV2NewsCard_default, {
								key: item.id,
								item
							}, null, _parent, _scopeId));
						});
						_push(`<!--]--></div></div>`);
					} else return [createVNode("div", { "data-v2-news-grid": "" }, [createVNode("div", {
						class: "flex flex-wrap items-center justify-between gap-2 px-v2-news-heading-inline py-v2-news-heading-block shadow-v2-news-rule md:gap-4",
						"data-v2-news-heading": ""
					}, [createVNode("div", { class: "flex shrink-0 items-center gap-v2-news-marker" }, [createVNode("span", {
						class: "h-v2-content-marker-height w-v2-content-marker-width shrink-0 bg-v2-brand",
						"aria-hidden": "true"
					}), createVNode("h2", {
						id: "v2-news-title",
						class: "text-v2-section-heading font-medium tracking-v2-section text-v2-heading"
					}, "Новости сервиса")]), createVNode("span", {
						class: "inline-flex h-v2-news-all-height shrink-0 items-center justify-center gap-v2-news-all rounded-v2-panel bg-v2-brand px-v2-news-all-inline text-v2-news-all font-medium text-v2-ink",
						"data-v2-news-all": ""
					}, [createTextVNode(" Все новости "), (openBlock(), createBlock("svg", {
						class: "size-v2-news-arrow shrink-0",
						"aria-hidden": "true",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						"stroke-linecap": "round",
						"stroke-linejoin": "round"
					}, [createVNode("path", { d: "M5 12h14m-6-6 6 6-6 6" })]))])]), createVNode("div", {
						class: "grid min-w-0 items-start gap-v2-news-grid px-v2-news-list-inline pt-v2-news-list-top pb-v2-news-list-bottom v2-tablet-wide:grid-cols-3",
						"data-v2-news-list": ""
					}, [(openBlock(true), createBlock(Fragment, null, renderList(unref(LANDING_V2_NEWS), (item) => {
						return openBlock(), createBlock(LandingV2NewsCard_default, {
							key: item.id,
							item
						}, null, 8, ["item"]);
					}), 128))])])];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/landing-v2/LandingV2News.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/landing-v2/LandingV2PeriodSelector.vue
var _sfc_main$5 = {
	__name: "LandingV2PeriodSelector",
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
		const periods = [
			{
				months: 1,
				label: "1 месяц"
			},
			{
				months: 3,
				label: "3 месяца"
			},
			{
				months: 6,
				label: "6 месяцев"
			},
			{
				months: 12,
				label: "12 месяцев"
			}
		];
		const selectedMonths = ref(null);
		const plan = computed(() => props.plans[0] ?? null);
		const products = computed(() => props.state === "ready" ? plan.value?.products ?? [] : []);
		const selected = computed(() => products.value.find((product) => product.months === selectedMonths.value) ?? products.value[0] ?? null);
		const options = computed(() => periods.map((period) => ({
			...period,
			available: products.value.some((product) => product.months === period.months)
		})));
		const selectedLabel = computed(() => periods.find((period) => period.months === selected.value?.months)?.label ?? "—");
		const money = new Intl.NumberFormat("ru-RU", {
			style: "currency",
			currency: "RUB",
			minimumFractionDigits: 0,
			maximumFractionDigits: 2
		});
		const monthlyPrice = computed(() => selected.value ? money.format(selected.value.priceMinor / 100 / selected.value.months) : "— ₽");
		const total = computed(() => selected.value ? money.format(selected.value.priceMinor / 100) : "— ₽");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				"data-v2-period-selector": "",
				class: "flex min-w-0 flex-col gap-v2-subscription-condition v2-desktop:pt-v2-subscription-selector-top"
			}, _attrs))} data-v-6fbc489e><div class="border border-v2-control-border" data-v-6fbc489e><fieldset class="min-w-0 border-b border-v2-control-border" data-v-6fbc489e><legend class="sr-only" data-v-6fbc489e>Период подписки</legend><div class="grid h-v2-subscription-tabs grid-cols-4" data-v-6fbc489e><!--[-->`);
			ssrRenderList(options.value, (option) => {
				_push(`<label class="${ssrRenderClass([option.available ? "cursor-pointer hover:text-v2-ink" : "cursor-default", "v2-period-option relative flex min-w-0 items-center justify-center font-mono text-v2-subscription-tab text-v2-subscription-muted"])}" data-v-6fbc489e><input${ssrIncludeBooleanAttr(selected.value?.months === option.months) ? " checked" : ""}${ssrIncludeBooleanAttr(!option.available) ? " disabled" : ""}${ssrRenderAttr("value", option.months)} type="radio" name="v2-subscription-period" class="peer sr-only" data-v-6fbc489e><span class="peer-checked:font-medium peer-checked:text-v2-subscription-selected" data-v-6fbc489e>${ssrInterpolate(option.label)}</span>`);
				if (!option.available) _push(`<span class="sr-only" data-v-6fbc489e> — недоступен</span>`);
				else _push(`<!---->`);
				_push(`<span class="v2-period-underline pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-v2-brand transition-transform duration-(--v2-duration-period) peer-checked:scale-x-100 motion-reduce:transition-none" aria-hidden="true" data-v-6fbc489e></span></label>`);
			});
			_push(`<!--]--></div></fieldset><div data-v2-price-panel class="flex min-w-0 flex-col gap-v2-subscription-panel bg-v2-price-surface p-v2-subscription-panel-inset" data-v-6fbc489e><p class="text-v2-subscription-plan font-medium text-v2-subscription-plan-ink" data-v-6fbc489e>${ssrInterpolate(plan.value?.name ?? "Безлимитный")}</p><div data-v2-price-row class="flex min-w-0 items-end gap-2.5" aria-live="polite" aria-atomic="true" data-v-6fbc489e><span class="v2-price-stack grid min-w-0 text-v2-subscription-price font-medium tracking-v2-subscription-price text-v2-subscription-price-ink" data-v-6fbc489e><span data-v2-monthly-price class="col-start-1 row-start-1 whitespace-nowrap" data-v-6fbc489e>${ssrInterpolate(monthlyPrice.value)}</span></span><span class="shrink-0 text-v2-subscription-unit text-v2-subscription-muted" data-v-6fbc489e>/ мес.</span></div><dl class="grid gap-4" aria-live="polite" aria-atomic="true" data-v-6fbc489e><div class="flex min-w-0 items-center justify-between gap-2" data-v-6fbc489e><dt class="text-v2-subscription-label text-v2-subscription-muted" data-v-6fbc489e>Период</dt><dd data-v2-period-summary class="text-v2-subscription-value font-medium text-v2-subscription-value-ink" data-v-6fbc489e>${ssrInterpolate(selectedLabel.value)}</dd></div><div class="flex min-w-0 items-center justify-between gap-2" data-v-6fbc489e><dt class="text-v2-subscription-label text-v2-subscription-muted" data-v-6fbc489e>Итого к оплате</dt><dd data-v2-total class="text-v2-subscription-value font-medium whitespace-nowrap text-v2-subscription-value-ink" data-v-6fbc489e>${ssrInterpolate(total.value)}</dd></div></dl><div class="h-px bg-v2-divider" aria-hidden="true" data-v-6fbc489e></div>`);
			if (selected.value) _push(ssrRenderComponent(_sfc_main$20, {
				href: unref(LANDING_V2_TRIAL),
				variant: "subscription"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Выбрать подписку`);
					else return [createTextVNode("Выбрать подписку")];
				}),
				_: 1
			}, _parent));
			else _push(`<div role="status" class="flex flex-col items-start gap-3 text-v2-subscription-point-copy text-v2-subscription-muted" data-v-6fbc489e><p data-v-6fbc489e>${ssrInterpolate(__props.state === "unavailable" ? "Не удалось загрузить тариф" : "Тариф временно недоступен")}</p><p data-v-6fbc489e>Попробуй зайти позже или напиши нам — поможем разобраться.</p><a${ssrRenderAttr("href", unref(LANDING_V2_SUPPORT))} class="inline-flex min-h-11 items-center text-v2-focus underline underline-offset-4 outline-none keyboard-focus:outline-2 keyboard-focus:outline-offset-2 keyboard-focus:outline-v2-focus" data-v-6fbc489e>Написать в поддержку</a></div>`);
			_push(`</div></div><p class="text-v2-subscription-condition text-v2-subscription-muted" data-v-6fbc489e>3 дня бесплатно для новых пользователей</p></div>`);
		};
	}
};
var _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/landing-v2/LandingV2PeriodSelector.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var LandingV2PeriodSelector_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$5, [["__scopeId", "data-v-6fbc489e"]]);
//#endregion
//#region resources/js/components/landing-v2/LandingV2Subscription.vue
var _sfc_main$4 = {
	__name: "LandingV2Subscription",
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
		const points = computed(() => [
			{
				title: "Безлимитный трафик",
				body: "Любимые сервисы для работы, развлечений и общения."
			},
			{
				title: `До ${props.plans[0]?.deviceLimit > 0 ? props.plans[0].deviceLimit : 5} устройств`,
				body: "Смартфон, ноутбук и планшет — в одном доступе."
			},
			{
				title: "Все популярные платформы",
				body: "Windows, macOS, Linux, Android и iOS."
			},
			{
				title: "Защищённое подключение",
				body: "Для работы, общения и повседневных задач."
			}
		]);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(_sfc_main$12, mergeProps({
				id: "pricing",
				variant: "subscription",
				"data-v2-subscription": "",
				"aria-labelledby": "v2-subscription-title",
				tabindex: "-1",
				class: "border-t border-v2-section-border outline-none"
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div data-v2-subscription-grid class="grid min-w-0 gap-10 v2-desktop:grid-cols-2 v2-desktop:gap-v2-split-gap"${_scopeId}><div data-v2-subscription-intro class="flex min-w-0 flex-col gap-v2-subscription-story"${_scopeId}><p class="flex items-center gap-4 font-mono text-v2-subscription-eyebrow tracking-v2-subscription-eyebrow text-v2-subscription-eyebrow-ink"${_scopeId}><span class="h-px w-v2-subscription-rule shrink-0 bg-v2-rule" aria-hidden="true"${_scopeId}></span>ПОДПИСКА DUDEWEB </p><h2 id="v2-subscription-title" class="text-v2-final-heading font-medium tracking-v2-final"${_scopeId}> Ну что,<br${_scopeId}><span class="text-v2-hero-accent"${_scopeId}>погнали?</span></h2><p class="text-v2-subscription-copy text-v2-subscription-copy-ink"${_scopeId}>Никаких сложных тарифов. Просто выбирай удобный период и пользуйся любимыми сервисами.</p><ul class="grid grid-cols-2 gap-x-v2-subscription-points-inline gap-y-v2-subscription-points-block pt-3"${_scopeId}><!--[-->`);
						ssrRenderList(points.value, (point) => {
							_push(`<li class="flex min-w-0 flex-col gap-2"${_scopeId}><h3 class="text-v2-subscription-point font-medium text-v2-subscription-point-ink"${_scopeId}>${ssrInterpolate(point.title)}</h3><p class="text-v2-subscription-point-copy text-v2-subscription-muted"${_scopeId}>${ssrInterpolate(point.body)}</p></li>`);
						});
						_push(`<!--]--></ul></div>`);
						_push(ssrRenderComponent(LandingV2PeriodSelector_default, {
							plans: __props.plans,
							state: __props.state
						}, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", {
						"data-v2-subscription-grid": "",
						class: "grid min-w-0 gap-10 v2-desktop:grid-cols-2 v2-desktop:gap-v2-split-gap"
					}, [createVNode("div", {
						"data-v2-subscription-intro": "",
						class: "flex min-w-0 flex-col gap-v2-subscription-story"
					}, [
						createVNode("p", { class: "flex items-center gap-4 font-mono text-v2-subscription-eyebrow tracking-v2-subscription-eyebrow text-v2-subscription-eyebrow-ink" }, [createVNode("span", {
							class: "h-px w-v2-subscription-rule shrink-0 bg-v2-rule",
							"aria-hidden": "true"
						}), createTextVNode("ПОДПИСКА DUDEWEB ")]),
						createVNode("h2", {
							id: "v2-subscription-title",
							class: "text-v2-final-heading font-medium tracking-v2-final"
						}, [
							createTextVNode(" Ну что,"),
							createVNode("br"),
							createVNode("span", { class: "text-v2-hero-accent" }, "погнали?")
						]),
						createVNode("p", { class: "text-v2-subscription-copy text-v2-subscription-copy-ink" }, "Никаких сложных тарифов. Просто выбирай удобный период и пользуйся любимыми сервисами."),
						createVNode("ul", { class: "grid grid-cols-2 gap-x-v2-subscription-points-inline gap-y-v2-subscription-points-block pt-3" }, [(openBlock(true), createBlock(Fragment, null, renderList(points.value, (point) => {
							return openBlock(), createBlock("li", {
								key: point.body,
								class: "flex min-w-0 flex-col gap-2"
							}, [createVNode("h3", { class: "text-v2-subscription-point font-medium text-v2-subscription-point-ink" }, toDisplayString(point.title), 1), createVNode("p", { class: "text-v2-subscription-point-copy text-v2-subscription-muted" }, toDisplayString(point.body), 1)]);
						}), 128))])
					]), createVNode(LandingV2PeriodSelector_default, {
						plans: __props.plans,
						state: __props.state
					}, null, 8, ["plans", "state"])])];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/landing-v2/LandingV2Subscription.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
//#endregion
//#region resources/js/composables/useLandingV2Wordmark.js
var LANDING_V2_WORDMARK = {
	width: 1996,
	height: 476.7254159117114,
	radius: 260,
	offsetX: 14,
	offsetY: 11
};
function useLandingV2Wordmark(target) {
	const pointer = shallowRef(null);
	const fineDesktop = useMediaQuery("(width > 64rem) and (hover: hover) and (pointer: fine)");
	const reducedMotion = usePreferredReducedMotion();
	const forcedColors = useMediaQuery("(forced-colors: active)");
	const visibility = useDocumentVisibility();
	const allowed = computed(() => fineDesktop.value && reducedMotion.value !== "reduce" && !forcedColors.value && visibility.value === "visible");
	const glow = computed(() => allowed.value ? pointer.value : null);
	function reset() {
		pointer.value = null;
	}
	function move(event) {
		if (!allowed.value || event.pointerType !== "mouse") return;
		const bounds = event.currentTarget.getBoundingClientRect();
		if (!bounds.width || !bounds.height) return;
		const x = event.clientX - bounds.left;
		const y = event.clientY - bounds.top;
		const boundary = Math.max(0, Math.min(x, bounds.width - x, y, bounds.height - y));
		const fade = Math.min(1, boundary / 36);
		const scale = LANDING_V2_WORDMARK.width / bounds.width;
		pointer.value = {
			x: x * scale,
			y: y * scale,
			radius: LANDING_V2_WORDMARK.radius * scale,
			dx: (x / bounds.width - .5) * 2 * LANDING_V2_WORDMARK.offsetX * scale,
			dy: (y / bounds.height - .5) * 2 * LANDING_V2_WORDMARK.offsetY * scale,
			opacity: fade * fade * (3 - 2 * fade)
		};
	}
	useEventListener(target, "pointermove", move, { passive: true });
	useEventListener(target, ["pointerleave", "pointercancel"], reset, { passive: true });
	useEventListener("scroll", reset, { passive: true });
	useEventListener("resize", reset, { passive: true });
	watch(allowed, reset);
	return { glow };
}
//#endregion
//#region resources/js/components/landing-v2/LandingV2Wordmark.vue
var _sfc_main$3 = {
	__name: "LandingV2Wordmark",
	__ssrInlineRender: true,
	setup(__props) {
		const { glow } = useLandingV2Wordmark(useTemplateRef("wordmark"));
		const shapeId = `v2-wordmark-${useId().replaceAll(":", "")}`;
		const maskId = `${shapeId}-mask`;
		const gradientId = `${shapeId}-gradient`;
		const echoes = [
			{
				factor: .7,
				opacity: .26,
				color: "var(--color-v2-wordmark-echo-one)",
				width: "var(--v2-wordmark-echo-one)"
			},
			{
				factor: 1.35,
				opacity: .18,
				color: "var(--color-v2-wordmark-echo-two)",
				width: "var(--v2-wordmark-echo-two)"
			},
			{
				factor: 2,
				opacity: .1,
				color: "var(--color-v2-wordmark-echo-three)",
				width: "var(--v2-wordmark-echo-three)"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				"data-v2-wordmark": "",
				class: "px-0.5 py-1.5"
			}, _attrs))} data-v-923b5140><svg${ssrRenderAttr("viewBox", `0 0 ${unref(LANDING_V2_WORDMARK).width} ${unref(LANDING_V2_WORDMARK).height}`)} role="img" aria-label="dudeweb" class="v2-wordmark block h-auto w-full overflow-visible text-v2-brand" data-v-923b5140><defs data-v-923b5140><text${ssrRenderAttr("id", shapeId)} x="0"${ssrRenderAttr("y", unref(LANDING_V2_WORDMARK).height / 2)} dominant-baseline="central" vector-effect="non-scaling-stroke" class="v2-wordmark-text" data-v-923b5140>dudeweb</text><radialGradient${ssrRenderAttr("id", gradientId)} gradientUnits="userSpaceOnUse"${ssrRenderAttr("cx", unref(glow)?.x ?? 0)}${ssrRenderAttr("cy", unref(glow)?.y ?? 0)}${ssrRenderAttr("r", unref(glow)?.radius ?? 1)} data-v-923b5140><stop offset="0" stop-color="white" data-v-923b5140></stop><stop offset="0.25" stop-color="white" stop-opacity="0.63" data-v-923b5140></stop><stop offset="0.5" stop-color="white" stop-opacity="0.33" data-v-923b5140></stop><stop offset="0.75" stop-color="white" stop-opacity="0.11" data-v-923b5140></stop><stop offset="1" stop-color="white" stop-opacity="0" data-v-923b5140></stop></radialGradient><mask${ssrRenderAttr("id", maskId)} maskUnits="userSpaceOnUse" x="0" y="0"${ssrRenderAttr("width", unref(LANDING_V2_WORDMARK).width)}${ssrRenderAttr("height", unref(LANDING_V2_WORDMARK).height)} data-v-923b5140><rect${ssrRenderAttr("width", unref(LANDING_V2_WORDMARK).width)}${ssrRenderAttr("height", unref(LANDING_V2_WORDMARK).height)}${ssrRenderAttr("fill", `url(#${gradientId})`)} data-v-923b5140></rect></mask></defs><use${ssrRenderAttr("href", `#${shapeId}`)} fill="none" stroke="currentColor" class="v2-wordmark-base" data-v-923b5140></use>`);
			if (unref(glow)) {
				_push(`<g data-v2-wordmark-glow${ssrRenderAttr("mask", `url(#${maskId})`)}${ssrRenderAttr("opacity", unref(glow).opacity)} fill="none" class="pointer-events-none" data-v-923b5140><use${ssrRenderAttr("href", `#${shapeId}`)} stroke="currentColor"${ssrRenderAttr("stroke-width", "var(--v2-wordmark-halo)")} opacity="0.045" data-v-923b5140></use><!--[-->`);
				ssrRenderList(echoes, (echo) => {
					_push(`<use${ssrRenderAttr("href", `#${shapeId}`)}${ssrRenderAttr("transform", `translate(${unref(glow).dx * echo.factor} ${unref(glow).dy * echo.factor})`)}${ssrRenderAttr("stroke", echo.color)}${ssrRenderAttr("stroke-width", echo.width)}${ssrRenderAttr("opacity", echo.opacity)} data-v-923b5140></use>`);
				});
				_push(`<!--]--></g>`);
			} else _push(`<!---->`);
			_push(`</svg></div>`);
		};
	}
};
var _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/landing-v2/LandingV2Wordmark.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var LandingV2Wordmark_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$3, [["__scopeId", "data-v-923b5140"]]);
//#endregion
//#region resources/js/components/landing-v2/LandingV2Footer.vue
var LINK_CLASSES = "w-fit text-v2-footer-link text-v2-secondary underline-offset-4 transition-colors duration-(--v2-duration-control) motion-reduce:transition-none hover:text-v2-focus hover:underline outline-none keyboard-focus:underline keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-(--spacing-v2-focus-offset) keyboard-focus:outline-v2-focus";
var _sfc_main$2 = {
	__name: "LandingV2Footer",
	__ssrInlineRender: true,
	setup(__props) {
		const groups = [
			{
				label: "Навигация",
				items: LANDING_V2_NAVIGATION
			},
			{
				label: "Аккаунт",
				items: [{
					label: "Войти",
					href: LANDING_V2_LOGIN,
					inertia: true
				}, {
					label: "Регистрация",
					href: LANDING_V2_TRIAL,
					inertia: true
				}]
			},
			{
				label: "Информация",
				items: [
					{
						label: "Поддержка",
						href: LANDING_V2_SUPPORT,
						external: true
					},
					{ label: "Пользовательское соглашение" },
					{ label: "Политика конфиденциальности" }
				]
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<footer${ssrRenderAttrs(mergeProps({
				"data-v2-footer": "",
				"data-v2-menu-background": "",
				class: "border-t border-v2-section-border px-v2-gutter pt-v2-footer-top pb-v2-footer-bottom"
			}, _attrs))}><div class="mx-auto flex w-full max-w-v2-content min-w-0 flex-col gap-v2-footer-stack"><div class="flex min-w-0 items-center">`);
			_push(ssrRenderComponent(unref(Link), {
				href: "/landing",
				"aria-label": "dudeweb — главная",
				class: "inline-flex w-fit items-center gap-3 outline-none keyboard-focus:outline-2 keyboard-focus:outline-solid keyboard-focus:outline-offset-(--spacing-v2-focus-offset) keyboard-focus:outline-v2-focus"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<img src="/landing-v2/brand/mark.svg" alt="" width="44" height="36" class="h-v2-mark-height w-v2-mark-width shrink-0"${_scopeId}><span class="text-v2-footer-brand font-medium tracking-v2-footer-brand text-v2-login-ink"${_scopeId}>dudeweb</span>`);
					else return [createVNode("img", {
						src: "/landing-v2/brand/mark.svg",
						alt: "",
						width: "44",
						height: "36",
						class: "h-v2-mark-height w-v2-mark-width shrink-0"
					}), createVNode("span", { class: "text-v2-footer-brand font-medium tracking-v2-footer-brand text-v2-login-ink" }, "dudeweb")];
				}),
				_: 1
			}, _parent));
			_push(`</div><div data-v2-footer-links class="grid min-w-0 grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-3 md:gap-v2-footer-links"><!--[-->`);
			ssrRenderList(groups, (group) => {
				_push(`<nav${ssrRenderAttr("aria-label", `${group.label} в подвале`)} data-v2-footer-group class="flex min-w-0 flex-col gap-3.5 last:col-span-2 md:last:col-span-1"><p class="text-v2-footer-label font-medium text-v2-focus">${ssrInterpolate(group.label)}</p><!--[-->`);
				ssrRenderList(group.items, (item) => {
					_push(`<!--[-->`);
					if (!item.href) _push(`<span class="text-v2-footer-link text-v2-secondary">${ssrInterpolate(item.label)}</span>`);
					else if (item.inertia) _push(ssrRenderComponent(unref(Link), {
						href: item.href,
						class: LINK_CLASSES
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(item.label)}`);
							else return [createTextVNode(toDisplayString(item.label), 1)];
						}),
						_: 2
					}, _parent));
					else {
						_push(`<a${ssrRenderAttr("href", item.href)} class="${ssrRenderClass(LINK_CLASSES)}"${ssrRenderAttr("target", item.external ? "_blank" : void 0)}${ssrRenderAttr("rel", item.external ? "noopener noreferrer" : void 0)}>${ssrInterpolate(item.label)}`);
						if (item.external) _push(`<span class="sr-only"> (откроется в новой вкладке)</span>`);
						else _push(`<!---->`);
						_push(`</a>`);
					}
					_push(`<!--]-->`);
				});
				_push(`<!--]--></nav>`);
			});
			_push(`<!--]--></div>`);
			_push(ssrRenderComponent(LandingV2Wordmark_default, null, null, _parent));
			_push(`<div data-v2-footer-legal class="flex min-w-0 flex-col gap-3 border-t border-v2-divider pt-v2-footer-legal md:flex-row md:items-center md:gap-v2-footer-legal-gap"><p class="min-w-0 text-v2-footer-copy text-v2-secondary md:w-v2-footer-description">Простая подписка, быстрая настройка и поддержка без долгого ожидания.</p><p class="text-right text-v2-footer-meta whitespace-nowrap text-v2-secondary md:flex-1">© 20— dudeweb</p></div></div></footer>`);
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/landing-v2/LandingV2Footer.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
//#endregion
//#region resources/js/layouts/LandingV2Layout.vue
var _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	_push(`<div${ssrRenderAttrs(mergeProps({
		"data-landing-v2": "",
		class: "flex min-h-screen flex-col bg-v2-page font-sans text-v2-body font-normal text-v2-ink scheme-light"
	}, _attrs))}>`);
	ssrRenderSlot(_ctx.$slots, "header", {}, null, _push, _parent);
	_push(`<main id="landing-v2-content" data-v2-menu-background class="min-w-0 flex-1" tabindex="-1">`);
	ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
	_push(`</main>`);
	ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push, _parent);
	_push(`</div>`);
}
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layouts/LandingV2Layout.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var LandingV2Layout_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
//#endregion
//#region resources/js/pages/Public/LandingV2.vue
var LandingV2_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main });
var _sfc_main = /*@__PURE__*/ Object.assign({ layout: (h, page) => h(LandingV2Layout_default, null, {
	header: () => h(_sfc_main$16),
	default: () => page,
	footer: () => h(_sfc_main$2)
}) }, {
	__name: "LandingV2",
	__ssrInlineRender: true,
	props: {
		plans: {
			type: Array,
			required: true
		},
		pricingState: {
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
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Любимые сервисы снова рядом" }, null, _parent));
			_push(ssrRenderComponent(LandingV2Hero_default, null, null, _parent));
			_push(ssrRenderComponent(LandingV2Platforms_default, null, null, _parent));
			_push(ssrRenderComponent(LandingV2Connection_default, null, null, _parent));
			_push(ssrRenderComponent(_sfc_main$6, null, null, _parent));
			_push(ssrRenderComponent(_sfc_main$4, {
				plans: __props.plans,
				state: __props.pricingState
			}, null, _parent));
			_push(`<!--]-->`);
		};
	}
});
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Public/LandingV2.vue");
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
	"./pages/Public/Home.vue": Home_exports,
	"./pages/Public/LandingV2.vue": LandingV2_exports
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
createServer(renderPage, {
	host: "127.0.0.1",
	port: Number(process.env.INERTIA_SSR_PORT || 13714)
});
//#endregion
export { renderPage as default };

//# sourceMappingURL=ssr.js.map