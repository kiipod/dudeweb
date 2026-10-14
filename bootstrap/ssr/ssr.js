import { computed, createSSRApp, createVNode, h, mergeProps, unref, useSSRContext, withCtx } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderSlot } from "vue/server-renderer";
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
//#region resources/js/components/brand/BrandLogo.vue
var _sfc_main$2 = {
	__name: "BrandLogo",
	__ssrInlineRender: true,
	props: { variant: {
		type: String,
		default: "horizontal",
		validator: (value) => [
			"horizontal",
			"icon",
			"stacked"
		].includes(value)
	} },
	setup(__props) {
		const CONTAINER_CLASSES = {
			horizontal: "inline-flex items-center gap-logo-gap",
			icon: "inline-flex",
			stacked: "inline-flex flex-col items-center gap-tight"
		};
		const MARK_CLASSES = {
			horizontal: "h-auto w-logo-horizontal",
			icon: "h-auto w-logo-icon",
			stacked: "h-auto w-logo-stacked"
		};
		const WORDMARK_CLASSES = {
			horizontal: "font-sans text-brand-lockup font-bold tracking-brand text-foreground",
			stacked: "font-sans text-brand-stacked font-bold tracking-brand text-foreground"
		};
		const props = __props;
		const containerClass = computed(() => CONTAINER_CLASSES[props.variant] ?? CONTAINER_CLASSES.horizontal);
		const markClass = computed(() => MARK_CLASSES[props.variant] ?? MARK_CLASSES.horizontal);
		const wordmarkClass = computed(() => WORDMARK_CLASSES[props.variant] ?? WORDMARK_CLASSES.horizontal);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<span${ssrRenderAttrs(mergeProps({
				class: containerClass.value,
				"aria-label": "dudeweb",
				role: "img"
			}, _attrs))}><svg class="${ssrRenderClass(markClass.value)}" aria-hidden="true" viewBox="0 0 213.435 147.7913" xmlns="http://www.w3.org/2000/svg"><path class="fill-logo-primary" d="M167.36626 44.31375l-24.77251 30.54375 21.1275 0c9.45001 0 17.11127 7.32375 17.11127 17.38125 0 13.22999-11.67752 23.0175-23.42252 23.0175-17.24624 0-32.16374-14.14124-43.2675-24.26624l28.75501-27.23626 0-22.84875c-23.4225 22.44375-52.88625 49.95-68.985 63.31499-5.77125 4.72501-12.38626 7.39125-18.63001 7.39125-12.92625 0-23.52375-10.5975-23.52375-23.32124 0-15.35626 11.475-25.75125 24.30001-25.75125 6.68249 0 13.46625 2.86875 18.22499 7.66126l13.095 13.46624 22.68001-20.8575 0-47.82375c0-8.67375-6.21001-14.985-15.42375-14.985l-17.82001 0 0 32.4675c-5.43375-1.755-11.07001-2.7675-17.44874-2.7675-32.1975 0-59.36626 26.62875-59.36626 59.4675 0 31.05001 24.97501 53.18998 52.1775 53.18998 11.98125 0 24.3-4.89373 33.51375-12.52124l12.48751-10.69874c14.20874 12.99376 33.88501 28.65376 58.55624 28.65376 31.55626 0 56.7-25.54876 56.7-56.025 0-26.66251-20.95874-47.28376-46.06874-47.45251z"></path><path class="fill-logo-highlight" d="M16.97624 19.27126l-14.71501-0.00001c-1.34999 0-2.26123-0.945-2.26123-2.39625l0-14.41125c0-1.45124 0.97874-2.46375 2.26123-2.46375l14.71501 0c1.2825 0 2.32874 0.945 2.32874 2.26125l0 14.61375c0 1.45126-0.94499 2.39626-2.32874 2.39625z" transform="translate(144.72 16.74)"></path></svg>`);
			if (__props.variant !== "icon") _push(`<span class="${ssrRenderClass(wordmarkClass.value)}">dudeweb</span>`);
			else _push(`<!---->`);
			_push(`</span>`);
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/brand/BrandLogo.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
//#endregion
//#region resources/js/layouts/AppLayout.vue
var _sfc_main$1 = {
	__name: "AppLayout",
	__ssrInlineRender: true,
	setup(__props) {
		const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background text-foreground transition-colors" }, _attrs))}><header class="border-b border-border bg-background/90 backdrop-blur"><div class="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">`);
			_push(ssrRenderComponent(unref(Link), {
				href: "/",
				"aria-label": "dudeweb — на главную"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$2, { variant: "horizontal" }, null, _parent, _scopeId));
					else return [createVNode(_sfc_main$2, { variant: "horizontal" })];
				}),
				_: 1
			}, _parent));
			_push(`<nav aria-label="Primary" class="hidden items-center gap-6 text-sm text-secondary md:flex"><a class="transition-colors hover:text-foreground" href="#features"> Features </a><a class="transition-colors hover:text-foreground" href="#cta"> Get started </a></nav><div class="ml-auto flex items-center gap-2"><a href="#cta" class="hidden rounded-control-sm px-4 py-2 text-sm font-semibold text-secondary transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:inline-flex"> Sign in </a><a href="#cta" class="inline-flex rounded-control-sm bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"> Get started </a></div></div></header>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`<footer class="border-t border-border"><div class="mx-auto max-w-6xl px-4 py-8"><p class="text-sm text-muted"> © ${ssrInterpolate(unref(currentYear))} dudeweb. All rights reserved. </p></div></footer></div>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layouts/AppLayout.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region resources/js/pages/App.vue
var App_exports = /* @__PURE__ */ __exportAll({ default: () => _sfc_main });
var _sfc_main = /*@__PURE__*/ Object.assign({ layout: _sfc_main$1 }, {
	__name: "App",
	__ssrInlineRender: true,
	setup(__props) {
		const features = [
			{
				marker: "01",
				title: "Laravel Backend",
				description: "Powerful routing, Eloquent ORM, queues, events."
			},
			{
				marker: "02",
				title: "Inertia.js",
				description: "Server-side routing without building a full API."
			},
			{
				marker: "03",
				title: "Vue 3",
				description: "Reactive UI with Composition API and all modern Vue 3 features."
			},
			{
				marker: "04",
				title: "Tailwind CSS v4",
				description: "Utility-first CSS framework with CSS-first configuration."
			},
			{
				marker: "05",
				title: "Vite",
				description: "Lightning-fast HMR and optimized production builds."
			},
			{
				marker: "06",
				title: "SSR ready",
				description: "A server-rendering entrypoint for fast initial responses."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Home" }, null, _parent));
			_push(`<main><section class="relative py-24 sm:py-32" aria-labelledby="hero-title"><div class="mx-auto max-w-4xl px-4 text-center"><span class="mb-6 inline-flex rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent"> New release </span><h1 id="hero-title" class="text-5xl font-bold tracking-tight sm:text-7xl"> Build faster with<br><span class="text-accent">Laravel &amp; Vue</span></h1><p class="mx-auto mt-6 max-w-2xl text-lg text-secondary"> A modern stack combining Laravel, Inertia.js, Vue 3 and Tailwind CSS — everything you need to ship focused web applications. </p><div class="mt-10 flex flex-wrap items-center justify-center gap-4"><a href="#features" class="rounded-button bg-accent px-5 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"> Get started </a><a href="#features" class="rounded-button bg-elevated px-5 py-3 font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"> Learn more <span aria-hidden="true">→</span></a></div></div></section><section id="features" class="py-16 sm:py-24" aria-labelledby="features-title"><div class="mx-auto max-w-6xl px-4"><div class="mb-12 text-center"><h2 id="features-title" class="text-3xl font-bold">Everything you need</h2><p class="mt-4 text-lg text-secondary"> Built on proven technologies. Ready for production. </p></div><div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
			ssrRenderList(features, (feature) => {
				_push(`<article class="rounded-panel border border-border bg-surface p-6"><div class="flex items-start gap-4"><span class="inline-flex size-10 shrink-0 items-center justify-center rounded-control-sm bg-accent-soft font-mono text-sm font-semibold text-accent">${ssrInterpolate(feature.marker)}</span><div><h3 class="font-semibold">${ssrInterpolate(feature.title)}</h3><p class="mt-1 text-sm leading-6 text-secondary">${ssrInterpolate(feature.description)}</p></div></div></article>`);
			});
			_push(`<!--]--></div></div></section><section id="cta" class="py-16" aria-labelledby="cta-title"><div class="mx-auto max-w-2xl px-4 text-center"><div class="rounded-dialog border border-border bg-elevated p-8"><h2 id="cta-title" class="text-2xl font-bold">Ready to get started?</h2><p class="mt-3 text-secondary"> Start building your next project today. </p><div class="mt-6 flex flex-wrap justify-center gap-3"><a href="#features" class="rounded-button bg-accent px-5 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"> Start for free </a><a href="#features" class="rounded-button px-5 py-3 font-semibold text-secondary transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"> View stack </a></div></div></div></section></main><!--]-->`);
		};
	}
});
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/App.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
//#region resources/js/ssr.js
var pages = /* #__PURE__ */ Object.assign({ "./pages/App.vue": App_exports });
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