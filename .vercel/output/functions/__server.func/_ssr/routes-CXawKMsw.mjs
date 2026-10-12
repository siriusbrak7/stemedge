import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Battery, D as Activity, E as ArrowLeft, S as BookOpen, T as ArrowUpDown, _ as Compass, a as SlidersVertical, b as ChevronRight, c as Play, d as Lightbulb, f as Layers, g as Gauge, h as GraduationCap, i as Sparkles, l as Pause, m as Hand, n as Waves, o as Ruler, p as Info, r as TriangleAlert, s as RotateCcw, t as Zap, u as Magnet, v as CircleX, w as Atom, x as ChevronDown, y as CircleCheck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CXawKMsw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Cambridge IGCSE 3 significant figures, SI units, g = 9.8 N/kg. */
var G_N_PER_KG = 9.8;
function format3SF(value) {
	if (!Number.isFinite(value)) return "—";
	if (value === 0) return "0.00";
	const decimals = Math.max(0, 2 - Math.floor(Math.log10(Math.abs(value))));
	if (decimals > 5) return value.toExponential(2);
	return Number(value.toPrecision(3)).toFixed(Math.min(decimals, 3));
}
function isWithinTolerance(student, expected, tolerancePct) {
	if (!Number.isFinite(student) || !Number.isFinite(expected)) return false;
	const tol = Math.max(Math.abs(expected) * (tolerancePct / 100), 1e-9);
	return Math.abs(student - expected) <= tol;
}
function parseStudentNumber(raw) {
	const cleaned = raw.trim().replace(/,/g, "");
	if (!cleaned) return null;
	const n = Number(cleaned);
	return Number.isFinite(n) ? n : null;
}
function markText(raw, q) {
	const normalised = raw.trim().toLowerCase().replace(/[^a-z0-9.×x+-]/g, "");
	return (q.acceptedText ?? []).some((a) => {
		const target = a.toLowerCase().replace(/[^a-z0-9.×x+-]/g, "");
		return normalised === target || normalised.includes(target);
	});
}
function ExamPlayer({ title, paperLabel, questions, onExit }) {
	const [index, setIndex] = (0, import_react.useState)(0);
	const [input, setInput] = (0, import_react.useState)("");
	const [mark, setMark] = (0, import_react.useState)("idle");
	const [scores, setScores] = (0, import_react.useState)([]);
	const [summary, setSummary] = (0, import_react.useState)(false);
	const q = questions[index];
	const last = index === questions.length - 1;
	const maxMarks = (0, import_react.useMemo)(() => questions.reduce((s, item) => s + item.marks, 0), [questions]);
	const earned = questions.reduce((s, item, i) => scores[i] === "correct" ? s + item.marks : s, 0);
	if (!q) return null;
	function submit() {
		if (mark !== "idle") return;
		const trimmed = input.trim();
		if (!trimmed) return;
		let ok = false;
		if (q.kind === "text") ok = markText(trimmed, q);
		else {
			const n = parseStudentNumber(trimmed);
			ok = n !== null && isWithinTolerance(n, q.expected, q.tolerancePct);
		}
		const nextMark = ok ? "correct" : "wrong";
		setMark(nextMark);
		setScores((prev) => {
			const copy = [...prev];
			copy[index] = nextMark;
			return copy;
		});
	}
	function next() {
		if (last) {
			setSummary(true);
			return;
		}
		setIndex((i) => i + 1);
		setInput("");
		setMark("idle");
	}
	function restart() {
		setIndex(0);
		setInput("");
		setMark("idle");
		setScores([]);
		setSummary(false);
	}
	if (summary) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-2xl flex-col items-center gap-6 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-12 w-12 text-accent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-extrabold text-ink",
					children: "Paper complete"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-ink-muted",
					children: paperLabel
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-5xl font-extrabold text-accent",
					children: [
						earned,
						" / ",
						maxMarks
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-mono text-sm text-ink-faint",
					children: "marks"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap justify-center gap-2",
				children: questions.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs font-bold ${scores[i] === "correct" ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300" : "border-rose-500/40 bg-rose-500/15 text-rose-300"}`,
					children: item.number
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: restart,
					className: "flex items-center gap-2 rounded-xl border border-border-subtle bg-surface px-4 py-2 text-sm font-semibold text-ink-muted hover:border-accent/40 hover:text-accent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), "Retry paper"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onExit,
					className: "flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-bold text-accent-fg hover:bg-amber-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to explore"]
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-3xl flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1.5 flex-1 overflow-hidden rounded-full bg-muted-bg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-accent transition-[width] duration-200",
							style: { width: `${(index + 1) / questions.length * 100}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "shrink-0 font-mono text-xs text-ink-muted",
						children: [
							"Q",
							index + 1,
							" of ",
							questions.length
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "shrink-0 font-mono text-xs font-bold text-accent",
						children: [
							earned,
							" / ",
							maxMarks,
							" marks"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3 border-b border-border-faint pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] text-ink-faint",
							children: q.paperRef ?? paperLabel
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 text-base font-bold text-ink",
							children: title
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-xs font-bold text-accent",
							children: [
								"[",
								q.marks,
								" ",
								q.marks === 1 ? "mark" : "marks",
								"]"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 font-bold text-sm text-accent",
							children: q.number
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium leading-relaxed text-ink",
							children: q.prompt
						})]
					}),
					q.contextLines && q.contextLines.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border-faint bg-inset p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-faint",
							children: "Given"
						}), q.contextLines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-ink-muted",
							children: line
						}, line))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: q.kind === "text" ? "text" : "number",
							step: "any",
							value: input,
							disabled: mark !== "idle",
							onChange: (e) => setInput(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter" && mark === "idle") submit();
								if (e.key === "Enter" && mark !== "idle") next();
							},
							placeholder: q.kind === "text" ? "Type your answer…" : "Enter value (3 s.f.)",
							className: "min-h-11 flex-1 rounded-xl border border-border-subtle bg-inset px-3 py-2.5 font-mono text-sm text-ink placeholder:text-ink-faint focus:border-accent/50 focus:outline-none disabled:opacity-60"
						}), q.kind === "numeric" && q.unit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 rounded-xl border border-border-subtle bg-inset px-3 py-2.5 font-mono text-xs font-bold text-accent",
							children: q.unit
						})]
					}),
					mark === "idle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: submit,
						disabled: !input.trim(),
						className: "self-start rounded-xl bg-accent px-5 py-2 text-sm font-bold text-accent-fg transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40",
						children: "Check answer"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex flex-col gap-3 rounded-xl border p-4 ${mark === "correct" ? "border-emerald-500/30 bg-emerald-500/10" : "border-rose-500/30 bg-rose-500/10"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									mark === "correct" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 shrink-0 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-5 w-5 shrink-0 text-rose-400" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-sm font-bold ${mark === "correct" ? "text-emerald-300" : "text-rose-300"}`,
										children: mark === "correct" ? `Full marks [${q.marks}/${q.marks}]` : `0/${q.marks} — see mark scheme`
									}),
									mark !== "correct" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto font-mono text-xs text-ink-muted",
										children: q.kind === "text" ? `Expected: ${q.acceptedText?.[0] ?? q.working.answer}` : `Correct: ${format3SF(q.expected)} ${q.unit}`
									})
								]
							}),
							mark === "wrong" && q.misconception && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-4 w-4 shrink-0 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold",
									children: "Examiner note: "
								}), q.misconception] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border-faint bg-inset p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-accent",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-3.5 w-3.5" }), "Mark scheme"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-2 md:grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchemeCell, {
											label: "1. Formula (C1)",
											value: q.working.equation
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchemeCell, {
											label: "2. Substitution (C1)",
											value: q.working.substitution
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchemeCell, {
											label: "3. Answer (A1)",
											value: q.working.answer,
											accent: true
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: next,
								className: "self-start flex items-center gap-2 rounded-xl bg-accent px-5 py-2 text-sm font-bold text-accent-fg hover:bg-amber-400",
								children: last ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-4 w-4" }), "View results"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Next question", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })] })
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onExit,
				className: "self-start flex items-center gap-1.5 font-mono text-xs text-ink-faint hover:text-ink-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), "Return to explore"]
			})
		]
	});
}
function SchemeCell({ label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border-faint bg-surface p-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1 block font-mono text-[10px] uppercase text-ink-faint",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `font-mono text-xs font-semibold ${accent ? "text-emerald-300" : "text-ink"}`,
			children: value
		})]
	});
}
function SimHeader({ title, syllabus, simNumber, mode, onMode, examLabel, exploreLabel = "Explore", onBackToHome }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3 border-b border-border-faint pb-3 sm:flex-row sm:items-center sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [onBackToHome && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onBackToHome,
				className: "flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface px-2.5 py-1.5 text-xs font-semibold text-ink-muted transition-colors hover:bg-muted-bg hover:text-accent",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), "Directory"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xs font-bold uppercase tracking-wider text-accent",
						children: ["Sim ", simNumber]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-ink-faint",
						children: "·"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-ink-muted",
						children: syllabus
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-extrabold tracking-tight text-ink sm:text-xl",
				children: title
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center self-start rounded-xl border border-border-subtle bg-surface p-1 sm:self-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onMode("explore"),
				className: `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${mode === "explore" ? "bg-accent text-accent-fg" : "text-ink-muted hover:text-ink"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "h-3.5 w-3.5" }), exploreLabel]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onMode("exam"),
				className: `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${mode === "exam" ? "bg-accent text-accent-fg" : "text-ink-muted hover:text-ink"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-3.5 w-3.5" }), examLabel]
			})]
		})]
	});
}
var REST_SPEED = .03;
var MOTION_TASKS = [
	{
		id: 1,
		title: "Newton 1 — coast",
		prompt: "Tap Nudge, then match the two forces (and set friction to 0). The trolley should keep a steady velocity. Balanced forces do not mean ‘stopped’."
	},
	{
		id: 2,
		title: "Newton 2 — slope",
		prompt: "Make the right force larger than the left. The v–t graph should be a straight slope. Gradient of v–t equals acceleration."
	},
	{
		id: 3,
		title: "Mass halves a",
		prompt: "Keep the same resultant force and double the mass. Acceleration should drop to half. Check a = F / m on the readouts."
	},
	{
		id: 4,
		title: "Friction opposes",
		prompt: "Add friction. It always acts against the motion (or cancels a small pull when the trolley is at rest). Resultant = applied − friction."
	}
];
var FORCES_PRESETS = [
	{
		name: "Balanced (rest)",
		description: "Equal forces, at rest — F_res = 0, a = 0",
		leftN: 6,
		rightN: 6,
		frictionN: 0,
		massKg: 2,
		velocity: 0,
		position: 2
	},
	{
		name: "Coasting",
		description: "F_res = 0 but already moving — Newton 1",
		leftN: 5,
		rightN: 5,
		frictionN: 0,
		massKg: 2,
		velocity: 2.5,
		position: 2
	},
	{
		name: "Unbalanced",
		description: "6 N resultant, 2.0 kg → a = 3.0 m/s²",
		leftN: 4,
		rightN: 10,
		frictionN: 0,
		massKg: 2,
		velocity: 0,
		position: 1
	},
	{
		name: "Heavy trolley",
		description: "Same 6 N on 4.0 kg → a = 1.5 m/s²",
		leftN: 4,
		rightN: 10,
		frictionN: 0,
		massKg: 4,
		velocity: 0,
		position: 1
	},
	{
		name: "With friction",
		description: "8 N pull against 3 N friction, 2.0 kg → a = 2.5 m/s²",
		leftN: 0,
		rightN: 8,
		frictionN: 3,
		massKg: 2,
		velocity: 0,
		position: 1
	}
];
function getInitialForcesState() {
	return {
		leftN: 4,
		rightN: 10,
		frictionN: 0,
		massKg: 2,
		running: false
	};
}
function computeForces(state, velocity) {
	const appliedN = state.rightN - state.leftN;
	const atRest = Math.abs(velocity) < REST_SPEED;
	let frictionSignedN = 0;
	let heldAtRest = false;
	if (atRest) {
		if (Math.abs(appliedN) <= state.frictionN + 1e-9) {
			frictionSignedN = -appliedN;
			heldAtRest = state.frictionN > 0 && Math.abs(appliedN) > 1e-9;
		} else frictionSignedN = -Math.sign(appliedN || 1) * state.frictionN;
	} else frictionSignedN = -Math.sign(velocity) * state.frictionN;
	const resultantN = appliedN + frictionSignedN;
	const acceleration = heldAtRest || atRest && Math.abs(resultantN) < 1e-9 ? 0 : state.massKg > 0 ? resultantN / state.massKg : 0;
	return {
		appliedN,
		frictionSignedN,
		resultantN,
		acceleration,
		newton: Math.abs(resultantN) < .05 ? "first" : "second",
		heldAtRest,
		formulaLine: `F_res = (${formatForce(state.rightN)}) − (${formatForce(state.leftN)}) − (${formatForce(Math.abs(frictionSignedN))}) = ${formatForce(resultantN)} N`
	};
}
function formatForce(n) {
	return Math.abs(n) < .001 ? "0" : n.toFixed(1);
}
function stepMotion(position, velocity, acceleration, dt) {
	let v = velocity + acceleration * dt;
	let s = position + v * dt;
	let hitEnd = null;
	if (s <= 0) {
		s = 0;
		v = 0;
		hitEnd = "min";
	} else if (s >= 16) {
		s = 16;
		v = 0;
		hitEnd = "max";
	}
	if (Math.abs(v) < .03 && Math.abs(acceleration) < 1e-6) v = 0;
	return {
		position: s,
		velocity: v,
		hitEnd
	};
}
function evaluateMotionTasks(args) {
	return {
		1: args.running && Math.abs(args.resultantN) < .08 && Math.abs(args.velocity) > .4,
		2: args.running && Math.abs(args.acceleration) > .4 && args.timeS > .6 && args.frictionN < .05,
		3: args.massKg >= 3.9 && Math.abs(args.resultantN) > .5,
		4: args.frictionN >= 1.5 && Math.abs(args.resultantN) > .2
	};
}
function generateForcesExamQuestions() {
	return [
		{
			id: "f1",
			number: 1,
			marks: 2,
			paperRef: "0625/41 · Resultant force",
			prompt: "A trolley is pulled 10 N to the right and 4.0 N to the left. Calculate the resultant force.",
			contextLines: ["F_right = 10 N", "F_left = 4.0 N"],
			kind: "numeric",
			expected: 6,
			unit: "N",
			tolerancePct: 2,
			working: {
				equation: "F_res = F_right − F_left",
				substitution: "10 − 4.0 = 6.0",
				answer: "6.00 N (to the right)"
			},
			misconception: "Do not add the forces. Resultant is the vector difference."
		},
		{
			id: "f2",
			number: 2,
			marks: 2,
			paperRef: "0625/41 · Newton’s 2nd law",
			prompt: "The trolley in Q1 has mass 2.0 kg. Calculate its acceleration.",
			contextLines: ["F_res = 6.0 N", "m = 2.0 kg"],
			kind: "numeric",
			expected: 3,
			unit: "m/s²",
			tolerancePct: 2,
			working: {
				equation: "a = F / m",
				substitution: "6.0 / 2.0 = 3.0",
				answer: "3.00 m/s²"
			},
			misconception: "Use the resultant force, not one of the applied forces."
		},
		{
			id: "f3",
			number: 3,
			marks: 1,
			paperRef: "0625/41 · Newton’s 1st law",
			prompt: "The two forces on a trolley are equal and opposite. The trolley is already moving. It will…",
			kind: "text",
			expected: 0,
			unit: "",
			acceptedText: [
				"constant speed",
				"constant velocity",
				"steady speed",
				"uniform velocity",
				"keep moving",
				"continue at constant"
			],
			tolerancePct: 0,
			working: {
				equation: "F_res = 0 ⇒ a = 0",
				substitution: "Velocity does not change",
				answer: "continue at constant velocity"
			},
			misconception: "Zero resultant force does not mean the object must be at rest."
		},
		{
			id: "f4",
			number: 4,
			marks: 2,
			paperRef: "0625/41 · v–t graph",
			prompt: "A v–t graph is a straight line from 0 to 6.0 m/s in 2.0 s. Calculate the acceleration.",
			contextLines: ["Δv = 6.0 m/s", "Δt = 2.0 s"],
			kind: "numeric",
			expected: 3,
			unit: "m/s²",
			tolerancePct: 2,
			working: {
				equation: "a = gradient = Δv / Δt",
				substitution: "6.0 / 2.0 = 3.0",
				answer: "3.00 m/s²"
			},
			misconception: "Gradient of a v–t graph is acceleration, not speed."
		},
		{
			id: "f5",
			number: 5,
			marks: 2,
			paperRef: "0625/41 · Area under v–t",
			prompt: "A trolley travels at a constant 4.0 m/s for 3.0 s. Calculate the displacement from the area under the v–t graph.",
			kind: "numeric",
			expected: 12,
			unit: "m",
			tolerancePct: 2,
			working: {
				equation: "displacement = area under v–t = v × t",
				substitution: "4.0 × 3.0 = 12",
				answer: "12.0 m"
			},
			misconception: "Area under v–t is displacement, not the gradient."
		},
		{
			id: "f6",
			number: 6,
			marks: 2,
			paperRef: "0625/41 · Friction",
			prompt: "A 2.0 kg trolley is pulled by 8.0 N. Friction is 3.0 N. Calculate the acceleration.",
			contextLines: [
				"F_pull = 8.0 N",
				"F_friction = 3.0 N",
				"m = 2.0 kg"
			],
			kind: "numeric",
			expected: 2.5,
			unit: "m/s²",
			tolerancePct: 2,
			working: {
				equation: "F_res = 8.0 − 3.0 ; a = F_res / m",
				substitution: "5.0 / 2.0 = 2.5",
				answer: "2.50 m/s²"
			},
			misconception: "Friction opposes motion, so subtract it from the pull before using F = ma."
		}
	];
}
var VW$5 = 640;
var VH$5 = 280;
var GROUND_Y = 188;
var PX_PER_M$1 = 48;
var TROLLEY_W = 72;
var TROLLEY_H = 40;
function arrowLen(newtons) {
	return Math.min(18 + Math.abs(newtons) * 6.5, 110);
}
function ForcesCanvas({ state, derived, positionM, velocity, hitEnd }) {
	const cam = positionM * PX_PER_M$1 - VW$5 / 2 + 40;
	const trolleyX = positionM * PX_PER_M$1 - cam;
	const worldToScreen = (m) => m * PX_PER_M$1 - cam;
	const ticks = [];
	for (let m = 0; m <= 16; m += 1) ticks.push(m);
	const leftLen = arrowLen(state.leftN);
	const rightLen = arrowLen(state.rightN);
	const fricLen = arrowLen(Math.abs(derived.frictionSignedN));
	const resLen = arrowLen(Math.abs(derived.resultantN));
	const resRight = derived.resultantN >= 0;
	const fricRight = derived.frictionSignedN >= 0;
	const movingRight = velocity > .05;
	const movingLeft = velocity < -.05;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-xl border border-border-faint bg-[#0A0C10]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: `0 0 ${VW$5} ${VH$5}`,
			className: "h-auto w-full",
			"aria-label": "Trolley on a metre track",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: VW$5,
					height: VH$5,
					fill: "#0A0C10"
				}),
				ticks.map((m) => {
					const x = worldToScreen(m);
					if (x < -20 || x > 660) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: x,
						y1: GROUND_Y,
						x2: x,
						y2: 198,
						stroke: "#334155"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
						x,
						y: 212,
						textAnchor: "middle",
						fill: "#475569",
						fontSize: "9",
						fontFamily: "monospace",
						children: [m, " m"]
					})] }, m);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: -40,
					y1: GROUND_Y,
					x2: 680,
					y2: GROUND_Y,
					stroke: "#334155",
					strokeWidth: "5"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: worldToScreen(0) - 6,
					y1: 152,
					x2: worldToScreen(0) - 6,
					y2: GROUND_Y,
					stroke: "#64748B",
					strokeWidth: "4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: worldToScreen(16) + 6,
					y1: 152,
					x2: worldToScreen(16) + 6,
					y2: GROUND_Y,
					stroke: "#64748B",
					strokeWidth: "4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					transform: `translate(${trolleyX}, ${GROUND_Y})`,
					children: [
						(movingRight || movingLeft) && [
							18,
							34,
							50
						].map((dx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: movingRight ? -36 - dx : TROLLEY_W / 2 + dx,
							y1: -14,
							x2: movingRight ? -36 - dx - 10 : TROLLEY_W / 2 + dx + 10,
							y2: -14,
							stroke: "#F59E0B",
							strokeWidth: "2",
							opacity: .35
						}, dx)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: -36,
							y: -48,
							width: TROLLEY_W,
							height: TROLLEY_H,
							rx: "6",
							fill: "#1E2433",
							stroke: "#F59E0B",
							strokeWidth: "2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: -22,
							cy: -8,
							r: "8",
							fill: "#0F121A",
							stroke: "#94A3B8",
							strokeWidth: "2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: 22,
							cy: -8,
							r: "8",
							fill: "#0F121A",
							stroke: "#94A3B8",
							strokeWidth: "2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
							x: "0",
							y: -24,
							textAnchor: "middle",
							fill: "#F8FAFC",
							fontSize: "11",
							fontFamily: "monospace",
							fontWeight: "700",
							children: [format3SF(state.massKg), " kg"]
						}),
						state.rightN > .05 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: TROLLEY_W / 2,
								y1: -28,
								x2: TROLLEY_W / 2 + rightLen,
								y2: -28,
								stroke: "#F59E0B",
								strokeWidth: "3.2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
								points: `${TROLLEY_W / 2 + rightLen + 8},-28 ${TROLLEY_W / 2 + rightLen - 4},-34 ${TROLLEY_W / 2 + rightLen - 4},-22`,
								fill: "#F59E0B"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
								x: TROLLEY_W / 2 + rightLen / 2,
								y: -36,
								textAnchor: "middle",
								fill: "#FCD34D",
								fontSize: "10",
								fontFamily: "monospace",
								children: [format3SF(state.rightN), " N"]
							})
						] }),
						state.leftN > .05 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: -36,
								y1: -28,
								x2: -36 - leftLen,
								y2: -28,
								stroke: "#38BDF8",
								strokeWidth: "3.2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
								points: `${-36 - leftLen - 8},-28 ${-36 - leftLen + 4},-34 ${-36 - leftLen + 4},-22`,
								fill: "#38BDF8"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
								x: -36 - leftLen / 2,
								y: -36,
								textAnchor: "middle",
								fill: "#7DD3FC",
								fontSize: "10",
								fontFamily: "monospace",
								children: [format3SF(state.leftN), " N"]
							})
						] }),
						Math.abs(derived.frictionSignedN) > .05 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [fricRight ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: TROLLEY_W / 2,
							y1: -8,
							x2: TROLLEY_W / 2 + fricLen,
							y2: -8,
							stroke: "#F87171",
							strokeWidth: "2.4"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
							points: `${TROLLEY_W / 2 + fricLen + 7},-8 ${TROLLEY_W / 2 + fricLen - 3},-13 ${TROLLEY_W / 2 + fricLen - 3},-3`,
							fill: "#F87171"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: -36,
							y1: -8,
							x2: -36 - fricLen,
							y2: -8,
							stroke: "#F87171",
							strokeWidth: "2.4"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
							points: `${-36 - fricLen - 7},-8 ${-36 - fricLen + 3},-13 ${-36 - fricLen + 3},-3`,
							fill: "#F87171"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
							x: fricRight ? TROLLEY_W / 2 + fricLen / 2 : -36 - fricLen / 2,
							y: 6,
							textAnchor: "middle",
							fill: "#FCA5A5",
							fontSize: "9",
							fontFamily: "monospace",
							children: [
								"friction ",
								format3SF(Math.abs(derived.frictionSignedN)),
								" N"
							]
						})] })
					]
				}),
				Math.abs(derived.resultantN) > .05 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					transform: `translate(${trolleyX}, 236)`,
					children: [resRight ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: 0,
						y1: 0,
						x2: resLen,
						y2: 0,
						stroke: "#FBBF24",
						strokeWidth: "3.4"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
						points: `${resLen + 9},0 ${resLen - 4},-7 ${resLen - 4},7`,
						fill: "#FBBF24"
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: 0,
						y1: 0,
						x2: -resLen,
						y2: 0,
						stroke: "#FBBF24",
						strokeWidth: "3.4"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
						points: `${-resLen - 9},0 ${-resLen + 4},-7 ${-resLen + 4},7`,
						fill: "#FBBF24"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
						x: 0,
						y: -10,
						textAnchor: "middle",
						fill: "#FCD34D",
						fontSize: "10",
						fontFamily: "monospace",
						fontWeight: "700",
						children: [
							"F_res ",
							format3SF(derived.resultantN),
							" N"
						]
					})]
				}),
				Math.abs(derived.resultantN) <= .05 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: trolleyX,
					y: 240,
					textAnchor: "middle",
					fill: "#64748B",
					fontSize: "11",
					fontFamily: "monospace",
					children: "F_res = 0  ·  Newton 1"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
					x: "16",
					y: "22",
					fill: "#94A3B8",
					fontSize: "11",
					fontFamily: "monospace",
					children: [
						"s = ",
						format3SF(positionM),
						" m   v = ",
						format3SF(velocity),
						" m/s   a = ",
						format3SF(derived.acceleration),
						" m/s²"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "16",
					y: "40",
					fill: "#64748B",
					fontSize: "10",
					fontFamily: "monospace",
					children: derived.newton === "first" ? "Newton 1 — constant velocity" : "Newton 2 — F = ma"
				}),
				hitEnd && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: 624,
					y: "22",
					textAnchor: "end",
					fill: "#F87171",
					fontSize: "11",
					fontFamily: "monospace",
					children: "End of bench — reverse the force or reset"
				})
			]
		})
	});
}
var GW = 520;
var GH = 168;
var PAD_L = 44;
var PAD_T = 18;
function mapX(t, tMax) {
	return PAD_L + t / Math.max(tMax, .001) * 460;
}
function mapY(val, lo, hi) {
	const span = hi - lo || 1;
	return PAD_T + (1 - (val - lo) / span) * 122;
}
function Graph({ title, ylabel, samples, pick, accent, zeroLine, footer }) {
	const tMax = Math.max(4, samples[samples.length - 1]?.t ?? 1);
	const values = samples.map(pick);
	const rawMin = Math.min(0, ...values);
	const rawMax = Math.max(.01, ...values);
	const pad = Math.max(.4, (rawMax - rawMin) * .12);
	const lo = rawMin - (zeroLine ? 0 : 0) - (rawMin < 0 ? pad : 0);
	const hi = rawMax + pad;
	const pts = samples.map((s) => `${mapX(s.t, tMax).toFixed(1)},${mapY(pick(s), lo, hi).toFixed(1)}`).join(" ");
	const y0 = mapY(0, lo, hi);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border-subtle bg-surface p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1 flex items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs font-bold uppercase tracking-widest text-accent",
				children: title
			}), footer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[10px] text-ink-faint",
				children: footer
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: `0 0 ${GW} ${GH}`,
			className: "h-auto w-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: GW,
					height: GH,
					fill: "#0E1017",
					rx: "8"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: PAD_L,
					y1: PAD_T,
					x2: PAD_L,
					y2: 140,
					stroke: "#334155"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: PAD_L,
					y1: 140,
					x2: 504,
					y2: 140,
					stroke: "#334155"
				}),
				zeroLine && y0 > PAD_T && y0 < 140 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: PAD_L,
					y1: y0,
					x2: 504,
					y2: y0,
					stroke: "#1F2432"
				}),
				pts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
					fill: "none",
					stroke: accent,
					strokeWidth: "2",
					strokeLinejoin: "round",
					points: pts
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: 8,
					y: 14,
					fill: "#64748B",
					fontSize: "9",
					fontFamily: "monospace",
					children: ylabel
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: 512,
					y: 160,
					textAnchor: "end",
					fill: "#64748B",
					fontSize: "9",
					fontFamily: "monospace",
					children: "t (s)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: 38,
					y: 22,
					textAnchor: "end",
					fill: "#64748B",
					fontSize: "8",
					fontFamily: "monospace",
					children: format3SF(hi)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: 38,
					y: 140,
					textAnchor: "end",
					fill: "#64748B",
					fontSize: "8",
					fontFamily: "monospace",
					children: format3SF(lo)
				})
			]
		})]
	});
}
function ForcesGraphs({ samples, acceleration }) {
	const t = samples[samples.length - 1]?.t ?? 0;
	const window = samples.filter((s) => s.t >= t - 1);
	let measuredA = acceleration;
	if (window.length >= 2) {
		const a = window[0];
		const b = window[window.length - 1];
		const dt = b.t - a.t;
		if (dt > .2) measuredA = (b.v - a.v) / dt;
	}
	const area = samples.length >= 2 ? samples.slice(1).reduce((sum, s, i) => sum + (samples[i].v + s.v) / 2 * (s.t - samples[i].t), 0) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-3 md:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Graph, {
			title: "Velocity–time",
			ylabel: "v (m/s)",
			samples,
			pick: (s) => s.v,
			accent: "#F59E0B",
			zeroLine: true,
			footer: `gradient ≈ ${format3SF(measuredA)} m/s²  (= a)`
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Graph, {
			title: "Displacement–time",
			ylabel: "s (m)",
			samples,
			pick: (s) => s.s,
			accent: "#38BDF8",
			footer: `area under v–t ≈ ${format3SF(area)} m`
		})]
	});
}
function ResultantForcesSim({ onBackToHome }) {
	const [mode, setMode] = (0, import_react.useState)("explore");
	const [state, setState] = (0, import_react.useState)(getInitialForcesState);
	const [taskId, setTaskId] = (0, import_react.useState)(1);
	const [position, setPosition] = (0, import_react.useState)(1.2);
	const [velocity, setVelocity] = (0, import_react.useState)(0);
	const [samples, setSamples] = (0, import_react.useState)([{
		t: 0,
		v: 0,
		s: 1.2
	}]);
	const [hitEnd, setHitEnd] = (0, import_react.useState)(null);
	const timeRef = (0, import_react.useRef)(0);
	const vRef = (0, import_react.useRef)(0);
	const sRef = (0, import_react.useRef)(1.2);
	const sampleAcc = (0, import_react.useRef)(0);
	const stateRef = (0, import_react.useRef)(state);
	stateRef.current = state;
	const derived = computeForces(state, velocity);
	const tasksDone = evaluateMotionTasks({
		resultantN: derived.resultantN,
		acceleration: derived.acceleration,
		velocity,
		massKg: state.massKg,
		frictionN: state.frictionN,
		running: state.running,
		timeS: samples[samples.length - 1]?.t ?? 0
	});
	const currentTask = MOTION_TASKS.find((t) => t.id === taskId) ?? MOTION_TASKS[0];
	(0, import_react.useEffect)(() => {
		let frame = 0;
		let last = performance.now();
		const loop = (now) => {
			const dt = Math.min((now - last) / 1e3, .05);
			last = now;
			const st = stateRef.current;
			if (st.running) {
				const inst = computeForces(st, vRef.current);
				const next = stepMotion(sRef.current, vRef.current, inst.acceleration, dt);
				vRef.current = next.velocity;
				sRef.current = next.position;
				timeRef.current += dt;
				sampleAcc.current += dt;
				setVelocity(next.velocity);
				setPosition(next.position);
				setHitEnd(next.hitEnd);
				if (next.hitEnd) setState((prev) => ({
					...prev,
					running: false
				}));
				if (sampleAcc.current >= .05) {
					sampleAcc.current = 0;
					const t = timeRef.current;
					const v = next.velocity;
					const s = next.position;
					setSamples((prev) => {
						const row = [...prev, {
							t,
							v,
							s
						}];
						return row.length > 240 ? row.slice(-240) : row;
					});
				}
			}
			frame = requestAnimationFrame(loop);
		};
		frame = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(frame);
	}, []);
	function hardReset(next) {
		const merged = {
			...getInitialForcesState(),
			...next,
			running: false
		};
		const v0 = next?.velocity ?? 0;
		const s0 = next?.position ?? 1.2;
		setState(merged);
		setVelocity(v0);
		setPosition(s0);
		setSamples([{
			t: 0,
			v: v0,
			s: s0
		}]);
		setHitEnd(null);
		timeRef.current = 0;
		vRef.current = v0;
		sRef.current = s0;
		sampleAcc.current = 0;
	}
	function applyPreset(p) {
		hardReset({
			leftN: p.leftN,
			rightN: p.rightN,
			frictionN: p.frictionN,
			massKg: p.massKg,
			velocity: p.velocity,
			position: p.position
		});
	}
	function nudge() {
		const v = vRef.current + 2;
		vRef.current = v;
		setVelocity(v);
		if (!state.running) setState((s) => ({
			...s,
			running: true
		}));
	}
	if (mode === "exam") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimHeader, {
			title: "Resultant Forces & Motion",
			syllabus: "Syllabus 1.5.1 · F = ma",
			simNumber: "#01",
			mode,
			onMode: setMode,
			examLabel: "Exam mode (6 questions)",
			onBackToHome
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExamPlayer, {
			title: "Forces, Newton’s laws and graphs",
			paperLabel: "Cambridge IGCSE 0625 · Paper 4",
			questions: generateForcesExamQuestions(),
			onExit: () => setMode("explore")
		})]
	});
	const coach = !state.running ? "Press Run, or Nudge to give the trolley +2 m/s. Force arrows sit on the trolley and scale with size." : derived.newton === "first" ? "F_res is zero, so a = 0. Velocity holds whatever value it already has (Newton 1)." : `Unbalanced: a = ${format3SF(derived.acceleration)} m/s². The v–t graph should be a straight slope of that gradient.`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimHeader, {
				title: "Resultant Forces & Motion",
				syllabus: "Syllabus 1.5.1 · F = ma",
				simNumber: "#01",
				mode,
				onMode: setMode,
				examLabel: "Exam mode (6 questions)",
				onBackToHome
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2.5 rounded-xl border border-border-subtle bg-surface p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1.5 overflow-x-auto",
							children: MOTION_TASKS.map((t) => {
								const done = tasksDone[t.id];
								const selected = t.id === currentTask.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setTaskId(t.id),
									className: `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${selected ? "bg-accent text-accent-fg" : "border border-border-subtle bg-muted-bg text-ink-muted"}`,
									children: [
										done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: `h-3.5 w-3.5 ${selected ? "text-accent-fg" : "text-emerald-400"}` }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-slate-500" }),
										"Task ",
										t.id
									]
								}, t.id);
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: FORCES_PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								title: p.description,
								onClick: () => applyPreset(p),
								className: "rounded-lg border border-border-subtle px-2.5 py-1.5 font-mono text-[10px] text-ink-muted hover:text-accent",
								children: p.name
							}, p.name))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[11px] font-bold uppercase tracking-wider text-accent",
						children: [
							"Task ",
							currentTask.id,
							": ",
							currentTask.title
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-medium leading-relaxed text-ink",
						children: currentTask.prompt
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 rounded-lg border border-border-faint bg-inset p-2 text-xs text-ink-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "mt-0.5 h-4 w-4 shrink-0 text-accent" }), coach]
					}),
					tasksDone[currentTask.id] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-2 text-xs text-emerald-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0" }),
							"Verified. ",
							currentTask.id === 1 && "Coasting with F_res = 0 is Newton’s first law.",
							currentTask.id === 2 && "Gradient of a straight v–t graph is a.",
							currentTask.id === 3 && "Same F, larger m, smaller a.",
							currentTask.id === 4 && "Friction is a force: include it in F_res before F = ma."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-3.5 lg:grid-cols-[3fr_2fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForcesCanvas, {
						state,
						derived,
						positionM: position,
						velocity,
						hitEnd
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForcesGraphs, {
						samples,
						acceleration: derived.acceleration
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {
									label: "Resultant F",
									value: `${format3SF(derived.resultantN)} N`,
									hint: derived.newton === "first" ? "balanced" : derived.resultantN > 0 ? "to the right" : "to the left",
									highlight: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {
									label: "Acceleration",
									value: `${format3SF(derived.acceleration)} m/s²`,
									hint: "a = F_res / m"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {
									label: "Velocity",
									value: `${format3SF(velocity)} m/s`,
									hint: "gradient of s–t"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {
									label: "Displacement",
									value: `${format3SF(position)} m`,
									hint: "area under v–t"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border-subtle bg-surface p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-faint",
									children: derived.formulaLine
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider$3, {
									label: "Force left",
									value: state.leftN,
									min: 0,
									max: 20,
									step: .5,
									unit: "N",
									onChange: (leftN) => setState((s) => ({
										...s,
										leftN
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider$3, {
									label: "Force right",
									value: state.rightN,
									min: 0,
									max: 20,
									step: .5,
									unit: "N",
									onChange: (rightN) => setState((s) => ({
										...s,
										rightN
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider$3, {
									label: "Friction",
									value: state.frictionN,
									min: 0,
									max: 10,
									step: .5,
									unit: "N",
									onChange: (frictionN) => setState((s) => ({
										...s,
										frictionN
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider$3, {
									label: "Mass",
									value: state.massKg,
									min: .5,
									max: 5,
									step: .1,
									unit: "kg",
									onChange: (massKg) => setState((s) => ({
										...s,
										massKg
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setState((s) => ({
												...s,
												running: !s.running
											})),
											className: "flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-accent px-3 text-xs font-bold text-accent-fg",
											children: [state.running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3.5 w-3.5" }), state.running ? "Pause" : "Run"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: nudge,
											className: "flex min-h-11 items-center gap-1 rounded-lg border border-border-subtle px-3 text-xs font-semibold text-ink-muted hover:text-accent",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5" }), "Nudge +2 m/s"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => hardReset(),
											className: "flex min-h-11 items-center gap-1 rounded-lg border border-border-subtle px-3 text-xs text-ink-muted hover:text-accent",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), "Reset"]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border-faint bg-muted-bg p-3 text-[11px] leading-relaxed text-ink-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] font-bold uppercase tracking-wider text-accent",
								children: "Cambridge notes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-1.5 list-disc space-y-1 pl-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Gradient of a v–t graph is acceleration." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Area under a v–t graph is displacement." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "F = 0 means constant velocity — including already moving." })
								]
							})]
						})
					]
				})]
			})
		]
	});
}
function Readout({ label, value, hint, highlight }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-xl border p-3 ${highlight ? "border-accent/30 bg-accent/10" : "border-border-subtle bg-surface"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-faint",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-mono text-lg font-bold tabular-nums text-accent",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-[10px] text-ink-faint",
				children: hint
			})
		]
	});
}
function Slider$3({ label, value, min, max, step, unit, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "mt-2 flex flex-col gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex justify-between font-mono text-xs text-ink-muted",
			children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-bold tabular-nums text-amber-300",
				children: [
					format3SF(value),
					" ",
					unit
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min,
			max,
			step,
			value,
			onChange: (e) => onChange(parseFloat(e.target.value)),
			className: "h-1.5 w-full cursor-pointer accent-amber-400"
		})]
	});
}
var SNAP_M = .01;
var MASS_BANK_KG = [
	.1,
	.2,
	.5,
	1,
	2
];
var MOMENT_TASKS = [
	{
		id: 1,
		title: "Equal arms",
		prompt: "Hang equal masses at equal distances from the pivot. Clockwise moments should equal anticlockwise — the rule sits level."
	},
	{
		id: 2,
		title: "Unequal masses",
		prompt: "Put 2.0 kg at 20 cm left of the pivot. Place 1.0 kg so it balances. Heavier mass needs the shorter perpendicular distance."
	},
	{
		id: 3,
		title: "Weight of the rule",
		prompt: "Turn on the rule’s own weight. Move the pivot off-centre. The rule’s weight acts at 50 cm (centre of gravity). Balance with one mass."
	},
	{
		id: 4,
		title: "Unknown mass",
		prompt: "Load the ‘mystery’ preset. Use the principle of moments to find the hidden mass, then type your answer."
	}
];
function getInitialMomentsState() {
	return {
		pivotM: .5,
		ruleMassKg: .12,
		includeRule: false,
		loads: [{
			id: "L",
			massKg: 2,
			posM: .2
		}, {
			id: "R",
			massKg: 2,
			posM: .8
		}]
	};
}
function snapPos(posM) {
	return Math.round(Math.max(0, Math.min(1, posM)) / SNAP_M) * SNAP_M;
}
function computeMoments(s) {
	const terms = [];
	const push = (id, label, massKg, posM) => {
		const weightN = massKg * G_N_PER_KG;
		const armM = posM - s.pivotM;
		const momentNm = weightN * Math.abs(armM);
		const sense = Math.abs(armM) < 5e-4 ? "none" : armM > 0 ? "cw" : "acw";
		terms.push({
			id,
			label,
			weightN,
			posM,
			armM: Math.abs(armM),
			momentNm,
			sense
		});
	};
	if (s.includeRule && s.ruleMassKg > 0) push("rule", "rule (C.o.G.)", s.ruleMassKg, .5);
	s.loads.forEach((load) => {
		const label = load.hidden ? "?" : `${load.massKg.toFixed(2)} kg`;
		push(load.id, label, load.massKg, load.posM);
	});
	const cw = terms.filter((t) => t.sense === "cw").reduce((a, t) => a + t.momentNm, 0);
	const acw = terms.filter((t) => t.sense === "acw").reduce((a, t) => a + t.momentNm, 0);
	const net = cw - acw;
	const balanced = Math.abs(net) < .08;
	return {
		terms,
		cw,
		acw,
		net,
		balanced,
		formulaLine: balanced ? "Σ clockwise = Σ anticlockwise  →  equilibrium" : `Σ CW ${cw.toFixed(2)} N m  ≠  Σ ACW ${acw.toFixed(2)} N m`
	};
}
function evaluateMomentTasks(s, d, mysterySolved) {
	const left = s.loads.filter((l) => l.posM < s.pivotM - .005);
	const right = s.loads.filter((l) => l.posM > s.pivotM + .005);
	return {
		1: d.balanced && left.length === 1 && right.length === 1 && Math.abs(left[0].massKg - right[0].massKg) < .05 && Math.abs(Math.abs(left[0].posM - s.pivotM) - Math.abs(right[0].posM - s.pivotM)) < .02,
		2: d.balanced && s.loads.some((l) => Math.abs(l.massKg - 2) < .05 && Math.abs(l.posM - (s.pivotM - .2)) < .03) && s.loads.some((l) => Math.abs(l.massKg - 1) < .05 && Math.abs(l.posM - (s.pivotM + .4)) < .04),
		3: s.includeRule && d.balanced && Math.abs(s.pivotM - .5) > .08 && s.loads.length >= 1,
		4: mysterySolved
	};
}
function mysteryPreset() {
	return {
		pivotM: .5,
		ruleMassKg: .12,
		includeRule: false,
		loads: [{
			id: "known",
			massKg: 2,
			posM: .2
		}, {
			id: "mystery",
			massKg: 1.5,
			posM: .9,
			hidden: true
		}]
	};
}
function getInitialAngleState() {
	return {
		forceN: 12,
		lengthM: .4,
		angleDeg: 90
	};
}
function computeAngleMoment(s) {
	const rad = s.angleDeg * Math.PI / 180;
	const sin = Math.sin(rad);
	const dPerp = s.lengthM * sin;
	return {
		sin,
		dPerp,
		momentNm: s.forceN * dPerp
	};
}
function generateMomentsExamQuestions() {
	return [
		{
			id: "m1",
			number: 1,
			marks: 2,
			paperRef: "0625/42 · Moment of a force",
			prompt: "A 3.0 N force acts 0.40 m from a pivot, perpendicular to the beam. Calculate the moment.",
			contextLines: ["F = 3.0 N", "d = 0.40 m"],
			kind: "numeric",
			expected: 1.2,
			unit: "N m",
			tolerancePct: 2,
			working: {
				equation: "moment = F × d",
				substitution: "3.0 × 0.40 = 1.20",
				answer: "1.20 N m"
			},
			misconception: "d must be the perpendicular distance from the pivot to the line of action."
		},
		{
			id: "m2",
			number: 2,
			marks: 2,
			paperRef: "0625/42 · Principle of moments",
			prompt: "A 2.0 kg mass sits 0.30 m to the left of a pivot. What mass, 0.20 m to the right, balances the beam? g = 9.8 N/kg.",
			kind: "numeric",
			expected: 3,
			unit: "kg",
			tolerancePct: 3,
			working: {
				equation: "m1 g d1 = m2 g d2  →  m2 = m1 d1 / d2",
				substitution: "2.0 × 0.30 / 0.20 = 3.0",
				answer: "3.00 kg"
			},
			misconception: "g cancels. You can use masses × distances if both weights are mg."
		},
		{
			id: "m3",
			number: 3,
			marks: 2,
			paperRef: "0625/42 · Weight of a uniform rule",
			prompt: "A uniform metre rule of weight 1.2 N is pivoted at the 40 cm mark. Where (from the 0 cm end) must a 0.80 N load sit to balance? The rule’s weight acts at 50 cm.",
			contextLines: [
				"Pivot = 0.40 m",
				"W_rule = 1.2 N at 0.50 m",
				"W_load = 0.80 N"
			],
			kind: "numeric",
			expected: .25,
			unit: "m",
			tolerancePct: 4,
			working: {
				equation: "1.2 × (0.50 − 0.40) = 0.80 × (0.40 − x)",
				substitution: "0.12 = 0.80(0.40 − x) → x = 0.25",
				answer: "0.250 m (the 25 cm mark)"
			},
			misconception: "The rule’s own weight still produces a moment unless the pivot is at 50 cm."
		},
		{
			id: "m4",
			number: 4,
			marks: 2,
			paperRef: "0625/42 · Perpendicular distance",
			prompt: "A 10 N force acts at 0.50 m from a pivot, at 30° to the beam. Calculate the moment. moment = F × L × sinθ",
			contextLines: [
				"F = 10 N",
				"L = 0.50 m",
				"θ = 30°"
			],
			kind: "numeric",
			expected: 2.5,
			unit: "N m",
			tolerancePct: 3,
			working: {
				equation: "moment = F L sinθ",
				substitution: "10 × 0.50 × sin 30° = 5.0 × 0.50 = 2.50",
				answer: "2.50 N m"
			},
			misconception: "Do not use L itself unless the force is perpendicular (sin 90° = 1)."
		},
		{
			id: "m5",
			number: 5,
			marks: 1,
			paperRef: "0625/42 · Unit",
			prompt: "The SI unit of moment of a force is…",
			kind: "text",
			expected: 0,
			unit: "",
			acceptedText: [
				"n m",
				"newton metre",
				"nm",
				"n.m",
				"newton meter",
				"n·m"
			],
			tolerancePct: 0,
			working: {
				equation: "moment = F × d",
				substitution: "N × m",
				answer: "N m (newton metre)"
			}
		},
		{
			id: "m6",
			number: 6,
			marks: 2,
			paperRef: "0625/42 · Unknown mass",
			prompt: "A 2.0 kg mass at 0.20 m left of a pivot balances an unknown mass at 0.40 m to the right. Find the unknown mass.",
			contextLines: ["2.0 kg at 0.20 m ACW", "? kg at 0.40 m CW"],
			kind: "numeric",
			expected: 1,
			unit: "kg",
			tolerancePct: 3,
			working: {
				equation: "2.0 × 0.20 = m × 0.40",
				substitution: "m = 0.40 / 0.40 = 1.0",
				answer: "1.00 kg"
			}
		}
	];
}
var VW$4 = 560;
var VH$4 = 280;
var PX = 80;
var PY = 200;
var SCALE = 320;
function AngleForceCanvas({ state }) {
	const { dPerp, momentNm, sin } = computeAngleMoment(state);
	const ax = PX + state.lengthM * SCALE;
	const ay = PY;
	const rad = state.angleDeg * Math.PI / 180;
	const ux = Math.cos(rad);
	const uy = -Math.sin(rad);
	const fLen = 52 + state.forceN * 2.4;
	const fx = ax + ux * fLen;
	const fy = ay + uy * fLen;
	const t = (PX - ax) * ux + 0 * uy;
	const footX = ax + t * ux;
	const footY = ay + t * uy;
	const loX = ax - ux * 90;
	const loY = ay - uy * 90;
	const hiX = ax + ux * (fLen + 36);
	const hiY = ay + uy * (fLen + 36);
	const nearlyPerp = state.angleDeg >= 75;
	const dimY = 234;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-xl border border-border-faint bg-[#0A0C10]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: `0 0 ${VW$4} ${VH$4}`,
			className: "h-auto w-full",
			"aria-label": "Force at an angle to a pivoted beam",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: VW$4,
					height: VH$4,
					fill: "#0A0C10"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "16",
					y: "22",
					fill: "#94A3B8",
					fontSize: "11",
					fontFamily: "monospace",
					children: "moment = F × d_perp = F × L × sinθ"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
					x: "16",
					y: "42",
					fill: "#FCD34D",
					fontSize: "12",
					fontFamily: "monospace",
					fontWeight: "700",
					children: [
						format3SF(state.forceN),
						" × ",
						format3SF(dPerp),
						" = ",
						format3SF(momentNm),
						" N m"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
					points: `${PX},${PY} 66,240 94,240`,
					fill: "#64748B"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: 54,
					y: 240,
					width: "52",
					height: "8",
					rx: "2",
					fill: "#334155"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: PX,
					y1: PY,
					x2: ax,
					y2: ay,
					stroke: "#F59E0B",
					strokeWidth: "8",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: PX,
					cy: PY,
					r: "5",
					fill: "#E2E8F0"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: loX,
					y1: loY,
					x2: hiX,
					y2: hiY,
					stroke: "#38BDF8",
					strokeWidth: "1.5",
					strokeDasharray: "5 4",
					opacity: "0.7"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: ax,
					y1: ay,
					x2: fx,
					y2: fy,
					stroke: "#38BDF8",
					strokeWidth: "3.2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
					points: arrowHead(ax, ay, fx, fy),
					fill: "#38BDF8"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
					x: Math.min(470, fx + 8),
					y: Math.max(18, fy),
					fill: "#7DD3FC",
					fontSize: "11",
					fontFamily: "monospace",
					children: [
						"F = ",
						format3SF(state.forceN),
						" N"
					]
				}),
				nearlyPerp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: PX,
						y1: dimY,
						x2: ax,
						y2: dimY,
						stroke: "#34D399",
						strokeWidth: "2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: PX,
						y1: 229,
						x2: PX,
						y2: 239,
						stroke: "#34D399"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: ax,
						y1: 229,
						x2: ax,
						y2: 239,
						stroke: "#34D399"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
						x: (PX + ax) / 2,
						y: 250,
						textAnchor: "middle",
						fill: "#6EE7B7",
						fontSize: "10",
						fontFamily: "monospace",
						children: [
							"d_perp = L = ",
							format3SF(dPerp),
							" m"
						]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: PX,
						y1: PY,
						x2: footX,
						y2: footY,
						stroke: "#34D399",
						strokeWidth: "2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: footX,
						cy: footY,
						r: "3",
						fill: "#34D399"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
						x: (PX + footX) / 2 + 12,
						y: (PY + footY) / 2 - 4,
						fill: "#6EE7B7",
						fontSize: "10",
						fontFamily: "monospace",
						children: [
							"d_perp = ",
							format3SF(dPerp),
							" m"
						]
					})
				] }),
				state.angleDeg > 8 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
					x: ax - 10,
					y: 184,
					textAnchor: "end",
					fill: "#CBD5E1",
					fontSize: "11",
					fontFamily: "monospace",
					children: [
						"θ = ",
						format3SF(state.angleDeg),
						"°"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
					x: (PX + ax) / 2,
					y: 218,
					textAnchor: "middle",
					fill: "#64748B",
					fontSize: "9",
					fontFamily: "monospace",
					children: [
						"L = ",
						format3SF(state.lengthM),
						" m"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
					x: "16",
					y: 268,
					fill: "#64748B",
					fontSize: "10",
					fontFamily: "monospace",
					children: ["Dashed line = line of action. Green = perpendicular distance from the pivot. sinθ = ", format3SF(sin)]
				})
			]
		})
	});
}
function arrowHead(x1, y1, x2, y2) {
	const angle = Math.atan2(y2 - y1, x2 - x1);
	const s = 10;
	const a1 = angle + Math.PI * .82;
	const a2 = angle - Math.PI * .82;
	return `${x2},${y2} ${x2 + Math.cos(a1) * s},${y2 + Math.sin(a1) * s} ${x2 + Math.cos(a2) * s},${y2 + Math.sin(a2) * s}`;
}
var VW$3 = 640;
var VH$3 = 300;
var RULE_X0 = 48;
var RULE_Y = 148;
var PX_PER_M = 544;
function toSvg(svg, clientX, clientY) {
	const pt = svg.createSVGPoint();
	pt.x = clientX;
	pt.y = clientY;
	const ctm = svg.getScreenCTM();
	if (!ctm) return {
		x: 0,
		y: 0
	};
	const p = pt.matrixTransform(ctm.inverse());
	return {
		x: p.x,
		y: p.y
	};
}
function xOf(posM) {
	return RULE_X0 + posM * PX_PER_M;
}
function MetreRuleCanvas({ state, derived, onChange }) {
	const svgRef = (0, import_react.useRef)(null);
	const [drag, setDrag] = (0, import_react.useState)(null);
	const tilt = derived.balanced ? 0 : Math.max(-16, Math.min(16, derived.net * 1.1));
	const pivotX = xOf(state.pivotM);
	function posFromX(x) {
		return snapPos((x - RULE_X0) / PX_PER_M);
	}
	function onPointerDownLoad(e, id) {
		svgRef.current?.setPointerCapture(e.pointerId);
		setDrag({
			kind: "load",
			id
		});
	}
	function onPointerDownPivot(e) {
		svgRef.current?.setPointerCapture(e.pointerId);
		setDrag({ kind: "pivot" });
	}
	function onPointerDownBank(e, massKg) {
		svgRef.current?.setPointerCapture(e.pointerId);
		setDrag({
			kind: "bank",
			massKg
		});
	}
	function onPointerMove(e) {
		if (!drag || !svgRef.current) return;
		const p = toSvg(svgRef.current, e.clientX, e.clientY);
		const posM = posFromX(p.x);
		if (drag.kind === "pivot") onChange({
			...state,
			pivotM: Math.max(.1, Math.min(.9, posM))
		});
		else if (drag.kind === "load" && drag.id) {
			const onBeam = p.y > 70 && p.y < 230;
			onChange({
				...state,
				loads: onBeam ? state.loads.map((l) => l.id === drag.id ? {
					...l,
					posM
				} : l) : state.loads
			});
		}
	}
	function onPointerUp(e) {
		if (!drag || !svgRef.current) {
			setDrag(null);
			return;
		}
		const p = toSvg(svgRef.current, e.clientX, e.clientY);
		const posM = posFromX(p.x);
		const onBeam = p.y > 70 && p.y < 210 && p.x >= 40 && p.x <= 600;
		if (drag.kind === "bank" && drag.massKg != null && onBeam) onChange({
			...state,
			loads: [...state.loads, {
				id: `m${Date.now()}`,
				massKg: drag.massKg,
				posM
			}]
		});
		else if (drag.kind === "load" && drag.id && !onBeam) onChange({
			...state,
			loads: state.loads.filter((l) => l.id !== drag.id)
		});
		setDrag(null);
	}
	const ticks = Array.from({ length: 11 }, (_, i) => i / 10);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-xl border border-border-faint bg-[#0A0C10]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			ref: svgRef,
			viewBox: `0 0 ${VW$3} ${VH$3}`,
			className: "h-auto w-full touch-none",
			onPointerMove,
			onPointerUp,
			onPointerCancel: () => setDrag(null),
			"aria-label": "Metre rule on a knife-edge pivot",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: VW$3,
					height: VH$3,
					fill: "#0A0C10"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "16",
					y: "22",
					fill: "#94A3B8",
					fontSize: "11",
					fontFamily: "monospace",
					children: "Drag masses onto the rule · drag the fulcrum · drag a mass off to remove"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: 624,
					y: "22",
					textAnchor: "end",
					fill: derived.balanced ? "#34D399" : "#F59E0B",
					fontSize: "12",
					fontFamily: "monospace",
					fontWeight: "700",
					children: derived.balanced ? "EQUILIBRIUM" : "UNBALANCED"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
					points: `${pivotX},154 ${pivotX - 16},228 ${pivotX + 16},228`,
					fill: "#64748B"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: pivotX - 28,
					y: "228",
					width: "56",
					height: "8",
					rx: "2",
					fill: "#334155"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
					x: pivotX,
					y: "252",
					textAnchor: "middle",
					fill: "#94A3B8",
					fontSize: "10",
					fontFamily: "monospace",
					children: [
						"pivot ",
						Math.round(state.pivotM * 100),
						" cm"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: pivotX - 10,
					y: "150",
					width: "20",
					height: "80",
					fill: "transparent",
					className: "cursor-ew-resize",
					onPointerDown: onPointerDownPivot
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					transform: `rotate(${tilt} ${pivotX} ${RULE_Y})`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: RULE_X0,
							y: 141,
							width: 544,
							height: "14",
							rx: "2",
							fill: "#B45309"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: RULE_X0,
							y: 141,
							width: 544,
							height: "6",
							fill: "#F59E0B",
							opacity: "0.35"
						}),
						ticks.map((m) => {
							const x = xOf(m);
							const major = Number.isInteger(m * 10);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: x,
								y1: 141,
								x2: x,
								y2: RULE_Y + (major ? 10 : 5),
								stroke: "#0B0D12",
								strokeWidth: "1"
							}), major && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x,
								y: 172,
								textAnchor: "middle",
								fill: "#FCD34D",
								fontSize: "9",
								fontFamily: "monospace",
								children: Math.round(m * 100)
							})] }, m);
						}),
						state.includeRule && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
							points: `${xOf(.5)},134 ${xOf(.5) - 7},122 ${xOf(.5) + 7},122`,
							fill: "#34D399"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
							x: xOf(.5),
							y: 118,
							textAnchor: "middle",
							fill: "#6EE7B7",
							fontSize: "9",
							fontFamily: "monospace",
							children: [
								"C.o.G. ",
								format3SF(state.ruleMassKg * 9.8),
								" N"
							]
						})] }),
						state.loads.map((load) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MassBlock, {
							load,
							onPointerDown: (ev) => onPointerDownLoad(ev, load.id)
						}, load.id)),
						derived.terms.filter((t) => t.sense !== "none" && t.id !== "rule").map((t) => {
							const x1 = pivotX;
							const x2 = xOf(t.posM);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								opacity: "0.85",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1,
									y1: 184,
									x2,
									y2: 184,
									stroke: "#64748B",
									strokeDasharray: "4 3"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
									x: (x1 + x2) / 2,
									y: 198,
									textAnchor: "middle",
									fill: "#94A3B8",
									fontSize: "9",
									fontFamily: "monospace",
									children: [
										"d = ",
										format3SF(t.armM),
										" m · ",
										t.sense.toUpperCase(),
										" ",
										format3SF(t.momentNm),
										" N m"
									]
								})]
							}, `arm-${t.id}`);
						})
					]
				}),
				MASS_BANK_KG.map((m, i) => {
					const x = 70 + i * 70;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						className: "cursor-grab",
						onPointerDown: (e) => onPointerDownBank(e, m),
						transform: `translate(${x}, 272)`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "-24",
							y: "-16",
							width: "48",
							height: "22",
							rx: "4",
							fill: "#1E2433",
							stroke: "#F59E0B"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
							x: "0",
							y: "-1",
							textAnchor: "middle",
							fill: "#FCD34D",
							fontSize: "10",
							fontFamily: "monospace",
							fontWeight: "700",
							children: [m, " kg"]
						})]
					}, m);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "16",
					y: "276",
					fill: "#64748B",
					fontSize: "9",
					fontFamily: "monospace",
					children: "tray"
				})
			]
		})
	});
}
function MassBlock({ load, onPointerDown }) {
	const x = xOf(load.posM);
	const h = 18 + load.massKg * 10;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		className: "cursor-grab",
		onPointerDown,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x,
				y1: 141,
				x2: x,
				y2: 133,
				stroke: "#94A3B8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: x - 18,
				y: 133 - h,
				width: "36",
				height: h,
				rx: "4",
				fill: "#1E2433",
				stroke: load.hidden ? "#A78BFA" : "#38BDF8",
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x,
				y: 133 - h / 2 + 4,
				textAnchor: "middle",
				fill: load.hidden ? "#DDD6FE" : "#E0F2FE",
				fontSize: "10",
				fontFamily: "monospace",
				fontWeight: "700",
				children: load.hidden ? "?" : `${format3SF(load.massKg)} kg`
			})
		]
	});
}
function MomentsSim({ onBackToHome }) {
	const [mode, setMode] = (0, import_react.useState)("explore");
	const [lab, setLab] = (0, import_react.useState)("rule");
	const [state, setState] = (0, import_react.useState)(getInitialMomentsState);
	const [angle, setAngle] = (0, import_react.useState)(getInitialAngleState);
	const [taskId, setTaskId] = (0, import_react.useState)(1);
	const [guess, setGuess] = (0, import_react.useState)("");
	const [mysterySolved, setMysterySolved] = (0, import_react.useState)(false);
	const [guessMsg, setGuessMsg] = (0, import_react.useState)(null);
	const derived = (0, import_react.useMemo)(() => computeMoments(state), [state]);
	const angleD = (0, import_react.useMemo)(() => computeAngleMoment(angle), [angle]);
	const tasksDone = evaluateMomentTasks(state, derived, mysterySolved);
	const currentTask = MOMENT_TASKS.find((t) => t.id === taskId) ?? MOMENT_TASKS[0];
	const hidden = state.loads.find((l) => l.hidden);
	function resetRule() {
		setState(getInitialMomentsState());
		setGuess("");
		setMysterySolved(false);
		setGuessMsg(null);
	}
	function checkMystery() {
		if (!hidden) {
			setGuessMsg("Load the mystery preset first.");
			return;
		}
		const n = Number(guess);
		if (!Number.isFinite(n)) {
			setGuessMsg("Enter a mass in kg.");
			return;
		}
		if (isWithinTolerance(n, hidden.massKg, 4)) {
			setMysterySolved(true);
			setGuessMsg(`Yes — the hidden mass is ${format3SF(hidden.massKg)} kg.`);
			setState((s) => ({
				...s,
				loads: s.loads.map((l) => l.hidden ? {
					...l,
					hidden: false
				} : l)
			}));
		} else setGuessMsg("Not yet. Use m1 d1 = m2 d2, with distances from the pivot.");
	}
	if (mode === "exam") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimHeader, {
			title: "Principle of Moments",
			syllabus: "Syllabus 1.5.2 · moment = F × d",
			simNumber: "#02",
			mode,
			onMode: setMode,
			examLabel: "Exam mode (6 questions)",
			onBackToHome
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExamPlayer, {
			title: "Moments, equilibrium and perpendicular distance",
			paperLabel: "Cambridge IGCSE 0625 · Paper 4",
			questions: generateMomentsExamQuestions(),
			onExit: () => setMode("explore")
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimHeader, {
				title: "Principle of Moments",
				syllabus: "Syllabus 1.5.2 · moment = F × d_perp",
				simNumber: "#02",
				mode,
				onMode: setMode,
				examLabel: "Exam mode (6 questions)",
				onBackToHome
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setLab("rule"),
					className: `rounded-lg px-3 py-1.5 text-xs font-semibold ${lab === "rule" ? "bg-accent text-accent-fg" : "border border-border-subtle text-ink-muted"}`,
					children: "Metre-rule lab"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setLab("angle"),
					className: `rounded-lg px-3 py-1.5 text-xs font-semibold ${lab === "angle" ? "bg-accent text-accent-fg" : "border border-border-subtle text-ink-muted"}`,
					children: "Force at an angle"
				})]
			}),
			lab === "rule" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2.5 rounded-xl border border-border-subtle bg-surface p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1.5 overflow-x-auto",
							children: MOMENT_TASKS.map((t) => {
								const done = tasksDone[t.id];
								const selected = t.id === currentTask.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setTaskId(t.id),
									className: `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${selected ? "bg-accent text-accent-fg" : "border border-border-subtle bg-muted-bg text-ink-muted"}`,
									children: [
										done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: `h-3.5 w-3.5 ${selected ? "text-accent-fg" : "text-emerald-400"}` }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-slate-500" }),
										"Task ",
										t.id
									]
								}, t.id);
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setState(getInitialMomentsState());
										setGuessMsg(null);
										setMysterySolved(false);
									},
									className: "rounded-lg border border-border-subtle px-2.5 py-1.5 font-mono text-[10px] text-ink-muted hover:text-accent",
									children: "Equal masses"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setState({
											pivotM: .5,
											ruleMassKg: .12,
											includeRule: false,
											loads: [{
												id: "h",
												massKg: 2,
												posM: .3
											}, {
												id: "l",
												massKg: 1,
												posM: .7
											}]
										});
										setTaskId(2);
									},
									className: "rounded-lg border border-border-subtle px-2.5 py-1.5 font-mono text-[10px] text-ink-muted hover:text-accent",
									children: "2 kg vs 1 kg"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setState(mysteryPreset());
										setGuess("");
										setMysterySolved(false);
										setGuessMsg(null);
										setTaskId(4);
									},
									className: "rounded-lg border border-border-subtle px-2.5 py-1.5 font-mono text-[10px] text-ink-muted hover:text-accent",
									children: "Mystery mass"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[11px] font-bold uppercase tracking-wider text-accent",
						children: [
							"Task ",
							currentTask.id,
							": ",
							currentTask.title
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-medium leading-relaxed text-ink",
						children: currentTask.prompt
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 rounded-lg border border-border-faint bg-inset p-2 text-xs text-ink-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "mt-0.5 h-4 w-4 shrink-0 text-accent" }), derived.balanced ? "The rule is in equilibrium: clockwise moments equal anticlockwise moments." : "Drag a mass along the rule, or move the pivot, until the two moment totals match."]
					}),
					tasksDone[currentTask.id] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-2 text-xs text-emerald-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0" }),
							"Verified. ",
							currentTask.id === 1 && "Equal masses at equal arms is the simplest case of the principle.",
							currentTask.id === 2 && "2.0 × 0.20 m = 1.0 × 0.40 m.",
							currentTask.id === 3 && "A uniform rule’s weight acts at its centre — the 50 cm mark.",
							currentTask.id === 4 && "Unknown mass from m1 d1 = m2 d2. That is Paper 6."
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-3.5 lg:grid-cols-[3fr_2fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetreRuleCanvas, {
						state,
						derived,
						onChange: setState
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto rounded-xl border border-border-subtle bg-surface",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[28rem] text-left font-mono text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-[10px] tracking-wider text-ink-faint",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-border-faint",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "Load"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "Weight / N"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "d⊥ / m"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "Moment / N m"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "Sense"
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: derived.terms.map((t) => {
								const mysteryRow = t.label === "?";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-border-faint",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-1.5 text-ink",
											children: t.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-1.5 tabular-nums text-ink-muted",
											children: mysteryRow ? "?" : format3SF(t.weightN)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-1.5 tabular-nums text-ink-muted",
											children: format3SF(t.armM)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-1.5 tabular-nums text-accent",
											children: mysteryRow ? "?" : format3SF(t.momentNm)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-1.5 uppercase text-ink-muted",
											children: t.sense === "none" ? "—" : t.sense
										})
									]
								}, t.id);
							}) })]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `rounded-xl border p-3 ${derived.balanced ? "border-emerald-500/40 bg-emerald-500/10" : "border-border-subtle bg-surface"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-faint",
									children: "Principle of moments"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-mono text-sm text-ink",
									children: derived.formulaLine
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
										label: "Σ ACW",
										value: `${format3SF(derived.acw)} N m`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
										label: "Σ CW",
										value: `${format3SF(derived.cw)} N m`
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 font-mono text-xs text-ink-muted",
									children: [
										"net (CW − ACW) = ",
										format3SF(derived.net),
										" N m"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border-subtle bg-surface p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center justify-between gap-2 text-sm text-ink",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Include weight of the rule" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: state.includeRule,
										onChange: (e) => setState((s) => ({
											...s,
											includeRule: e.target.checked
										})),
										className: "h-4 w-4 accent-amber-400"
									})]
								}),
								state.includeRule && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider$2, {
									label: "Rule mass (uniform, acts at 50 cm)",
									value: state.ruleMassKg,
									min: .05,
									max: .4,
									step: .01,
									unit: "kg",
									onChange: (ruleMassKg) => setState((s) => ({
										...s,
										ruleMassKg
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: resetRule,
									className: "mt-3 flex min-h-11 items-center gap-1 text-xs text-ink-muted hover:text-accent",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), "Reset rule"]
								})
							]
						}),
						hidden && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border-subtle bg-surface p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[10px] font-bold uppercase tracking-wider text-accent",
									children: "Find the mystery mass"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-ink-muted",
									children: "m₁d₁ = m₂d₂. Distances are from the pivot, not from the 0 cm end."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: guess,
										onChange: (e) => setGuess(e.target.value),
										placeholder: "mass in kg",
										className: "min-h-11 flex-1 rounded-lg border border-border-subtle bg-inset px-3 font-mono text-sm text-ink"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: checkMystery,
										className: "rounded-lg bg-accent px-3 text-xs font-bold text-accent-fg",
										children: "Check"
									})]
								}),
								guessMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-ink-muted",
									children: guessMsg
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border-faint bg-muted-bg p-3 text-[11px] leading-relaxed text-ink-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] font-bold uppercase tracking-wider text-accent",
								children: "Cambridge notes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-1.5 list-disc space-y-1 pl-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "moment = force × perpendicular distance from the pivot." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A uniform rule’s weight acts at its centre of gravity (50 cm)." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Equilibrium needs ΣF = 0 and Σ moments = 0." })
								]
							})]
						})
					]
				})]
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-3.5 lg:grid-cols-[3fr_2fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AngleForceCanvas, { state: angle }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-accent/30 bg-accent/10 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] uppercase tracking-wider text-ink-faint",
								children: "Moment"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 font-mono text-lg font-bold text-accent",
								children: [format3SF(angleD.momentNm), " N m"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 font-mono text-xs text-ink-muted",
								children: [
									"d_perp = L sinθ = ",
									format3SF(angle.lengthM),
									" × sin ",
									format3SF(angle.angleDeg),
									"° = ",
									format3SF(angleD.dPerp),
									" m"
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border-subtle bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider$2, {
								label: "Force F",
								value: angle.forceN,
								min: 1,
								max: 25,
								step: .5,
								unit: "N",
								onChange: (forceN) => setAngle((s) => ({
									...s,
									forceN
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider$2, {
								label: "Distance to force L",
								value: angle.lengthM,
								min: .1,
								max: .8,
								step: .01,
								unit: "m",
								onChange: (lengthM) => setAngle((s) => ({
									...s,
									lengthM
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider$2, {
								label: "Angle to the beam θ",
								value: angle.angleDeg,
								min: 0,
								max: 90,
								step: 1,
								unit: "°",
								onChange: (angleDeg) => setAngle((s) => ({
									...s,
									angleDeg
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs leading-relaxed text-ink-muted",
								children: "At 90° the force is perpendicular and d_perp = L (maximum moment). At 0° the force acts along the beam and the moment is zero."
							})
						]
					})]
				})]
			})
		]
	});
}
function Mini({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-inset px-2.5 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-[10px] uppercase text-ink-faint",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-sm font-bold tabular-nums text-accent",
			children: value
		})]
	});
}
function Slider$2({ label, value, min, max, step, unit, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "mt-2 flex flex-col gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex justify-between font-mono text-xs text-ink-muted",
			children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-bold tabular-nums text-amber-300",
				children: [
					format3SF(value),
					" ",
					unit
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min,
			max,
			step,
			value,
			onChange: (e) => onChange(parseFloat(e.target.value)),
			className: "h-1.5 w-full cursor-pointer accent-amber-400"
		})]
	});
}
function getInitialFloatingState() {
	return {
		objectDensity: 700,
		liquidDensity: 1e3,
		volumeM3: .002
	};
}
function computeFloating(s) {
	const weight = s.objectDensity * s.volumeM3 * G_N_PER_KG;
	const sinks = s.objectDensity > s.liquidDensity + 1;
	const fraction = sinks ? 1 : Math.min(1, s.objectDensity / s.liquidDensity);
	const displaced = s.volumeM3 * fraction;
	const upthrust = s.liquidDensity * displaced * G_N_PER_KG;
	const floats = s.objectDensity < s.liquidDensity - 1;
	return {
		weight,
		upthrust,
		fraction,
		displaced,
		floats,
		sinks,
		suspends: !floats && !sinks
	};
}
function generateFloatingExamQuestions() {
	return [
		{
			id: "fl1",
			number: 1,
			marks: 2,
			paperRef: "0625/41 · Density",
			prompt: "A block has mass 0.24 kg and volume 2.0 × 10⁻⁴ m³. Calculate its density.",
			kind: "numeric",
			expected: 1200,
			unit: "kg/m³",
			tolerancePct: 2,
			working: {
				equation: "ρ = m / V",
				substitution: "0.24 / 2.0×10⁻⁴ = 1200",
				answer: "1200 kg/m³"
			}
		},
		{
			id: "fl2",
			number: 2,
			marks: 2,
			paperRef: "0625/41 · Archimedes",
			prompt: "An object of volume 0.0020 m³ is fully immersed in water (ρ = 1000 kg/m³). Calculate the upthrust. g = 9.8 N/kg.",
			kind: "numeric",
			expected: 19.6,
			unit: "N",
			tolerancePct: 2,
			working: {
				equation: "U = ρ V g",
				substitution: "1000 × 0.0020 × 9.8 = 19.6",
				answer: "19.6 N"
			},
			misconception: "Upthrust equals the weight of the displaced liquid, not the object’s weight."
		},
		{
			id: "fl3",
			number: 3,
			marks: 2,
			paperRef: "0625/41",
			prompt: "A wooden cube of density 700 kg/m³ floats in water (1000 kg/m³). What fraction of its volume is submerged?",
			kind: "numeric",
			expected: .7,
			unit: "",
			tolerancePct: 2,
			working: {
				equation: "V_sub / V = ρ_object / ρ_liquid",
				substitution: "700 / 1000 = 0.70",
				answer: "0.700 (70%)"
			}
		},
		{
			id: "fl4",
			number: 4,
			marks: 1,
			paperRef: "0625/41",
			prompt: "An object denser than the liquid will…",
			kind: "text",
			expected: 0,
			unit: "",
			acceptedText: ["sink", "sinks"],
			tolerancePct: 0,
			working: {
				equation: "W > U_max when ρ_object > ρ_liquid",
				substitution: "Net force downward",
				answer: "sink"
			}
		}
	];
}
function FloatingSim({ onBackToHome }) {
	const [mode, setMode] = (0, import_react.useState)("explore");
	const [state, setState] = (0, import_react.useState)(getInitialFloatingState);
	const d = computeFloating(state);
	const waterY = 150;
	const blockH = 70;
	const top = waterY - (blockH - d.fraction * blockH);
	if (mode === "exam") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimHeader, {
			title: "Floating & Sinking",
			syllabus: "Syllabus 1.5.3",
			simNumber: "#03",
			mode,
			onMode: setMode,
			examLabel: "Exam mode",
			onBackToHome
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExamPlayer, {
			title: "Density and Archimedes",
			paperLabel: "Cambridge IGCSE 0625 · Paper 4",
			questions: generateFloatingExamQuestions(),
			onExit: () => setMode("explore")
		})]
	});
	const status = d.sinks ? "Sinks" : d.suspends ? "Suspended" : "Floats";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimHeader, {
			title: "Floating & Sinking",
			syllabus: "Syllabus 1.5.3 · Archimedes",
			simNumber: "#03",
			mode,
			onMode: setMode,
			examLabel: "Exam mode (4 questions)",
			onBackToHome
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-3.5 lg:grid-cols-[3fr_2fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl border border-border-faint bg-inset",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 560 280",
					className: "h-auto w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							width: "560",
							height: "280",
							fill: "#0A0C10"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "80",
							y: waterY,
							width: "400",
							height: "110",
							fill: "#0C4A6E",
							opacity: "0.55"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "80",
							y1: waterY,
							x2: "480",
							y2: waterY,
							stroke: "#38BDF8",
							strokeWidth: "2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "80",
							y: "150",
							width: "8",
							height: "110",
							fill: "#1E293B"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "472",
							y: "150",
							width: "8",
							height: "110",
							fill: "#1E293B"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "80",
							y: "252",
							width: "400",
							height: "8",
							fill: "#1E293B"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "240",
							y: top,
							width: "80",
							height: blockH,
							rx: "4",
							fill: "#1E2433",
							stroke: "#F59E0B",
							strokeWidth: "2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
							x: "280",
							y: top + 40,
							textAnchor: "middle",
							fill: "#F8FAFC",
							fontSize: "11",
							fontFamily: "monospace",
							children: [format3SF(state.objectDensity), " kg/m³"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
							x: "20",
							y: "28",
							fill: "#94A3B8",
							fontSize: "11",
							fontFamily: "monospace",
							children: [
								status,
								" · ",
								format3SF(d.fraction * 100),
								"% submerged"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
							x: "90",
							y: "172",
							fill: "#7DD3FC",
							fontSize: "10",
							fontFamily: "monospace",
							children: [
								"liquid ",
								format3SF(state.liquidDensity),
								" kg/m³"
							]
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-accent/30 bg-accent/10 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase text-ink-faint",
						children: "Weight vs upthrust"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-mono text-sm text-ink",
						children: [
							"W = ",
							format3SF(d.weight),
							" N · U = ",
							format3SF(d.upthrust),
							" N"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border-subtle bg-surface p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider$1, {
							label: "Object density",
							value: state.objectDensity,
							min: 200,
							max: 2e3,
							step: 10,
							unit: "kg/m³",
							onChange: (objectDensity) => setState((s) => ({
								...s,
								objectDensity
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider$1, {
							label: "Liquid density",
							value: state.liquidDensity,
							min: 600,
							max: 1400,
							step: 10,
							unit: "kg/m³",
							onChange: (liquidDensity) => setState((s) => ({
								...s,
								liquidDensity
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider$1, {
							label: "Volume",
							value: state.volumeM3,
							min: 5e-4,
							max: .005,
							step: 1e-4,
							unit: "m³",
							onChange: (volumeM3) => setState((s) => ({
								...s,
								volumeM3
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs leading-relaxed text-ink-muted",
							children: "Floats when object density is less than liquid density — then V_sub/V equals ρ_object/ρ_liquid. Sinks when weight exceeds maximum upthrust."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setState(getInitialFloatingState()),
							className: "mt-2 flex items-center gap-1 text-xs text-ink-muted hover:text-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Reset"]
						})
					]
				})]
			})]
		})]
	});
}
function Slider$1({ label, value, min, max, step, unit, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "mt-2 flex flex-col gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex justify-between font-mono text-xs text-ink-muted",
			children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-bold text-amber-300",
				children: [
					format3SF(value),
					" ",
					unit
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min,
			max,
			step,
			value,
			onChange: (e) => onChange(parseFloat(e.target.value)),
			className: "h-1.5 w-full accent-amber-400"
		})]
	});
}
function collectLoads(state) {
	const out = [];
	for (const sec of state.sections) {
		if (sec.type === "series" && sec.component.kind !== "ammeter") out.push(sec.component);
		if (sec.type === "parallel") for (const b of sec.branches) out.push(...b.filter((c) => c.kind !== "ammeter"));
	}
	return out;
}
function CircuitReadouts({ evaluation, state, samples }) {
	const loads = collectLoads(state);
	const badge = (() => {
		switch (evaluation.topology) {
			case "Series (closed)": return "border-emerald-500/40 bg-emerald-950/50 text-emerald-300";
			case "Parallel (closed)": return "border-cyan-500/40 bg-cyan-950/50 text-cyan-300";
			case "Mixed (closed)": return "border-indigo-500/40 bg-indigo-950/50 text-indigo-300";
			case "Short circuit": return "border-rose-500/40 bg-rose-950/50 text-rose-300";
			case "Switch open": return "border-amber-500/40 bg-amber-950/40 text-amber-200";
			default: return "border-border-subtle bg-muted-bg text-ink-muted";
		}
	})();
	const iText = !Number.isFinite(evaluation.totalCurrent) ? "∞" : format3SF(evaluation.totalCurrent);
	const rText = evaluation.totalResistance === Infinity ? "∞" : format3SF(evaluation.totalResistance);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
						label: "e.m.f. E",
						value: format3SF(evaluation.cellEmf),
						unit: "V",
						hint: "Cell (chemical)",
						accent: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
						label: "Terminal p.d.",
						value: format3SF(evaluation.terminalV),
						unit: "V",
						hint: evaluation.internalR > .001 ? "E − Ir" : "Ideal cell, r = 0"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
						label: "Current I",
						value: iText,
						unit: "A",
						hint: "Leaves + terminal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
						label: "R (load + r)",
						value: rText,
						unit: "Ω",
						hint: "Equivalent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
						label: "Ammeter",
						value: evaluation.ammeterReading === null ? "—" : !Number.isFinite(evaluation.ammeterReading) ? "∞" : format3SF(evaluation.ammeterReading),
						unit: "A",
						hint: "Must be in series"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
						label: "Voltmeter",
						value: evaluation.voltmeterReading === null ? "—" : format3SF(evaluation.voltmeterReading),
						unit: "V",
						hint: evaluation.voltmeterWhere
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `rounded-xl border px-3 py-2 text-xs font-semibold ${badge}`,
				children: [evaluation.topology, evaluation.isClosed && Number.isFinite(evaluation.powerW) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-2 font-mono font-normal text-ink-muted",
					children: [
						"P = IV = ",
						format3SF(evaluation.powerW),
						" W"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border-subtle bg-surface p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-ink",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5 text-accent" }), "Ohm’s law  V = I × R"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[11px] text-ink-faint",
							children: "3 s.f."
						})]
					}),
					loads.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-2 text-xs italic text-ink-muted",
						children: "No load yet — tap 10 Ω, 20 Ω or the lamp."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[20rem] text-left text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border-subtle font-mono text-[10px] text-ink-faint",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1 pr-2 font-medium",
										children: "Component"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1 pr-2 font-medium",
										children: "R / Ω"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1 pr-2 font-medium",
										children: "I / A"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1 pr-2 font-medium",
										children: "V = IR"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1 font-medium",
										children: "P / W"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loads.map((r) => {
								const data = evaluation.resistorCurrents[r.id];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-border-faint text-ink",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-1.5 pr-2 font-medium",
											children: r.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-1.5 pr-2 font-mono text-cyan-300",
											children: format3SF(r.value)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-1.5 pr-2 font-mono",
											children: format3SF(data?.current ?? 0)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-1.5 pr-2 font-mono font-semibold text-amber-300",
											children: format3SF(data?.voltage ?? 0)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-1.5 font-mono text-ink-muted",
											children: format3SF(data?.power ?? 0)
										})
									]
								}, r.id);
							}) })]
						})
					}),
					evaluation.isClosed && evaluation.seriesResistorCount >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-[11px] text-emerald-300",
						children: [
							"Series check: ΣV = ",
							format3SF(evaluation.voltagesSum),
							" V  (terminal ",
							format3SF(evaluation.terminalV),
							" V)"
						]
					}),
					evaluation.steps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-1 font-mono text-[11px] text-ink-muted",
						children: evaluation.steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["· ", s] }, s))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VIGraph, { samples }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1.5 rounded-xl border border-border-faint bg-muted-bg p-3 text-xs text-ink-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-accent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" }), "Cambridge exam rules"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "list-disc space-y-1 pl-4 text-[11px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-ink",
							children: "Ammeter"
						}), " — series only. Ideal resistance 0 Ω."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-ink",
							children: "Voltmeter"
						}), " — parallel only. Ideal resistance infinite."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-ink",
							children: "Series"
						}), " — same current. p.d.s add to the terminal voltage."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-ink",
							children: "Parallel"
						}), " — same p.d. Branch currents add."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-ink",
							children: "Open switch"
						}), " — I = 0. Voltmeter across the cell still reads E."] })
					]
				})]
			})
		]
	});
}
function VIGraph({ samples }) {
	const W = 320;
	const H = 140;
	const pl = 36;
	const pt = 14;
	const vMax = Math.max(6, ...samples.map((s) => s.v), 1);
	const iMax = Math.max(.6, ...samples.map((s) => s.i), .1);
	const x = (v) => pl + v / vMax * 274;
	const y = (i) => 116 - i / iMax * 102;
	const pts = samples.map((s) => `${x(s.v).toFixed(1)},${y(s.i).toFixed(1)}`).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border-subtle bg-surface p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs font-bold uppercase tracking-widest text-accent",
				children: "V–I graph (Ohm’s law)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-[10px] text-ink-faint",
				children: "Drag the cell e.m.f. A metallic resistor is a straight line through the origin."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: `0 0 ${W} ${H}`,
				className: "mt-2 h-auto w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						width: W,
						height: H,
						fill: "#0E1017",
						rx: "8"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: pl,
						y1: pt,
						x2: pl,
						y2: 116,
						stroke: "#334155"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: pl,
						y1: 116,
						x2: 310,
						y2: 116,
						stroke: "#334155"
					}),
					pts && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
						fill: "none",
						stroke: "#F59E0B",
						strokeWidth: "2",
						points: pts
					}),
					samples.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: x(s.v),
						cy: y(s.i),
						r: "2.4",
						fill: "#FBBF24"
					}, `${s.v}-${idx}`)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: 8,
						y: 12,
						fill: "#64748B",
						fontSize: "8",
						fontFamily: "monospace",
						children: "I / A"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: 312,
						y: 134,
						textAnchor: "end",
						fill: "#64748B",
						fontSize: "8",
						fontFamily: "monospace",
						children: "V / V"
					})
				]
			})
		]
	});
}
function Meter({ label, value, unit, hint, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col rounded-xl border border-border-subtle bg-surface p-2.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[10px] uppercase tracking-wider text-ink-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex items-baseline gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `font-mono text-xl font-bold tabular-nums ${accent ? "text-accent" : "text-ink"}`,
					children: value
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs text-ink-faint",
					children: unit
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 text-[10px] text-ink-faint",
				children: hint
			})
		]
	});
}
var PARTS = [
	{
		type: "resistor_10",
		badge: "10 Ω",
		label: "Resistor",
		hint: "Tap to add in series"
	},
	{
		type: "resistor_20",
		badge: "20 Ω",
		label: "Resistor",
		hint: "Tap to add in series"
	},
	{
		type: "lamp",
		badge: "12 Ω",
		label: "Lamp",
		hint: "Glows with current"
	},
	{
		type: "ammeter",
		badge: "A",
		label: "Ammeter",
		hint: "Series · 0 Ω"
	}
];
function ComponentTray({ selected, cellEmf, internalR, onSelectVoltmeter, onAdd, onEmf, onInternalR }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2 rounded-xl border border-border-subtle bg-surface p-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs font-bold uppercase tracking-wider text-ink-muted",
				children: "Component tray"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] text-ink-faint",
				children: selected === "voltmeter" ? "Now clip V on the schematic" : "Tap a part to add it"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col justify-center rounded-lg border border-accent/40 bg-accent/10 p-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex items-center justify-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Battery, { className: "h-3.5 w-3.5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-bold text-ink",
								children: [
									"Cell ",
									format3SF(cellEmf),
									" V"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 1.5,
							max: 12,
							step: .5,
							value: cellEmf,
							onChange: (e) => onEmf(parseFloat(e.target.value)),
							className: "h-1.5 w-full cursor-pointer accent-amber-400",
							"aria-label": "Cell e.m.f."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-1 flex flex-col gap-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[9px] text-ink-faint",
								children: [
									"internal r ",
									format3SF(internalR),
									" Ω"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: 2,
								step: .1,
								value: internalR,
								onChange: (e) => onInternalR(parseFloat(e.target.value)),
								className: "h-1.5 w-full cursor-pointer accent-rose-400",
								"aria-label": "Internal resistance"
							})]
						})
					]
				}),
				PARTS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onAdd(item.type),
					className: "flex min-h-11 flex-col items-center justify-center rounded-lg border border-border-subtle bg-muted-bg p-2 text-center hover:border-accent hover:text-accent",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-bold text-ink",
							children: item.badge
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-semibold text-ink-muted",
							children: item.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] text-ink-faint",
							children: item.hint
						})
					]
				}, item.type)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onSelectVoltmeter,
					className: `flex min-h-11 flex-col items-center justify-center rounded-lg border p-2 text-center ${selected === "voltmeter" ? "border-accent bg-accent/20 ring-2 ring-accent/30" : "border-sky-500/40 bg-muted-bg hover:border-accent"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "mb-0.5 h-4 w-4 text-sky-300" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-bold text-ink",
							children: "V"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-semibold text-ink-muted",
							children: "Voltmeter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] text-ink-faint",
							children: "Clip in parallel"
						})
					]
				})
			]
		})]
	});
}
var VW$2 = 680;
var VH$2 = 360;
var TOP = 78;
var BOT = 278;
var LEFT = 108;
var RIGHT = 620;
var CELL_X = 54;
function layout(sections) {
	const widths = sections.map((s) => s.type === "parallel" ? 150 : 108);
	const gap = 16;
	const total = widths.reduce((a, b) => a + b, 0) + gap * Math.max(0, sections.length - 1);
	let x = LEFT + Math.max(0, (512 - total) / 2);
	return sections.map((section, i) => {
		const w = widths[i];
		const laid = {
			section,
			x,
			w
		};
		x += w + gap;
		return laid;
	});
}
function wire(live) {
	return live ? "#F59E0B" : "#475569";
}
function ResistorSymbol({ x, y, label, live, voltage }) {
	const ohms = label.includes("20") ? "20 Ω" : "10 Ω";
	const tag = label.split(" · ")[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x - 48,
			y1: y,
			x2: x - 24,
			y2: y,
			stroke: wire(live),
			strokeWidth: "2.2"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x + 24,
			y1: y,
			x2: x + 48,
			y2: y,
			stroke: wire(live),
			strokeWidth: "2.2"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x,
			y: y - 16,
			textAnchor: "middle",
			fill: "#94A3B8",
			fontSize: "9",
			fontFamily: "monospace",
			children: tag
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: x - 24,
			y: y - 12,
			width: "48",
			height: "24",
			rx: "3",
			fill: "#182030",
			stroke: ohms === "20 Ω" ? "#818CF8" : "#22D3EE",
			strokeWidth: "1.8"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x,
			y: y + 4,
			textAnchor: "middle",
			fill: "#F1F5F9",
			fontSize: "11",
			fontFamily: "monospace",
			fontWeight: "700",
			children: ohms
		}),
		voltage !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
			x,
			y: y + 28,
			textAnchor: "middle",
			fill: "#FCD34D",
			fontSize: "9",
			fontFamily: "monospace",
			children: [format3SF(voltage), " V"]
		})
	] });
}
function LampSymbol({ x, y, label, live, current, voltage }) {
	const glow = live ? Math.min(1, Math.abs(current) / .5) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x - 48,
			y1: y,
			x2: x - 18,
			y2: y,
			stroke: wire(live),
			strokeWidth: "2.2"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x + 18,
			y1: y,
			x2: x + 48,
			y2: y,
			stroke: wire(live),
			strokeWidth: "2.2"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: x,
			cy: y,
			r: "16",
			fill: `rgba(251, 191, 36, ${.12 + glow * .55})`,
			stroke: "#F59E0B",
			strokeWidth: "2"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x - 8,
			y1: y - 8,
			x2: x + 8,
			y2: y + 8,
			stroke: "#FCD34D",
			strokeWidth: "1.6"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x + 8,
			y1: y - 8,
			x2: x - 8,
			y2: y + 8,
			stroke: "#FCD34D",
			strokeWidth: "1.6"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x,
			y: y - 22,
			textAnchor: "middle",
			fill: "#FCD34D",
			fontSize: "9",
			fontFamily: "monospace",
			children: label
		}),
		voltage !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
			x,
			y: y + 30,
			textAnchor: "middle",
			fill: "#FCD34D",
			fontSize: "9",
			fontFamily: "monospace",
			children: [format3SF(voltage), " V"]
		})
	] });
}
function AmmeterSymbol({ x, y, reading, live }) {
	const text = reading === null ? "—" : !Number.isFinite(reading) ? "∞" : `${format3SF(reading)} A`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x - 48,
			y1: y,
			x2: x - 18,
			y2: y,
			stroke: wire(live),
			strokeWidth: "2.2"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x + 18,
			y1: y,
			x2: x + 48,
			y2: y,
			stroke: wire(live),
			strokeWidth: "2.2"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: x,
			cy: y,
			r: "18",
			fill: "#12241F",
			stroke: "#10B981",
			strokeWidth: "2"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x,
			y: y + 5,
			textAnchor: "middle",
			fill: "#34D399",
			fontSize: "14",
			fontWeight: "800",
			children: "A"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: x - 28,
			y: y + 20,
			width: "56",
			height: "14",
			rx: "3",
			fill: "#06120E",
			stroke: "#059669",
			strokeWidth: "0.8"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x,
			y: y + 30.5,
			textAnchor: "middle",
			fill: "#34D399",
			fontSize: "9",
			fontFamily: "monospace",
			fontWeight: "700",
			children: text
		})
	] });
}
function EmptySlot({ x, y, label, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		className: active ? "animate-slot-pulse" : void 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: x - 44,
			y: y - 18,
			width: "88",
			height: "36",
			rx: "6",
			fill: "#10141F",
			stroke: active ? "#F59E0B" : "#334155",
			strokeDasharray: "4 3",
			strokeWidth: "1.4"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x,
			y: y + 4,
			textAnchor: "middle",
			fill: active ? "#FBBF24" : "#64748B",
			fontSize: "9",
			fontFamily: "monospace",
			children: label
		})]
	});
}
function SchematicCanvas({ state, evaluation, selected, onPlaceSeries, onPlaceBranch, onRemove, onSplitParallel, onClipVoltmeter, onToggleSwitch }) {
	const laid = layout(state.sections);
	const live = evaluation.isClosed;
	const placingPath = selected === "resistor_10" || selected === "resistor_20" || selected === "ammeter" || selected === "lamp";
	const placingV = selected === "voltmeter";
	const flowId = (0, import_react.useId)();
	const loopD = `M ${CELL_X} ${TOP} L ${RIGHT} ${TOP} L ${RIGHT} ${BOT} L ${CELL_X} ${BOT}`;
	function renderComp(c, x, y) {
		const i = evaluation.componentCurrent[c.id] ?? 0;
		const isLive = live && Math.abs(i) > .001;
		const seriesOwner = state.sections.find((s) => s.type === "series" && s.component.id === c.id);
		const v = evaluation.resistorCurrents[c.id]?.voltage ?? null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
			c.kind === "ammeter" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmmeterSymbol, {
				x,
				y,
				reading: evaluation.componentCurrent[c.id] ?? evaluation.ammeterReading,
				live: isLive
			}) : c.kind === "lamp" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LampSymbol, {
				x,
				y,
				label: c.label,
				live: isLive,
				current: i,
				voltage: isLive ? v : 0
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResistorSymbol, {
				x,
				y,
				label: c.label,
				live: isLive,
				voltage: isLive ? v : live ? 0 : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				className: "cursor-pointer",
				onClick: (e) => {
					e.stopPropagation();
					onRemove(c.id);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: x + 28,
					y: y - 28,
					width: "18",
					height: "18",
					rx: "4",
					fill: "#1E2333",
					stroke: "#64748B"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: x + 37,
					y: y - 15,
					textAnchor: "middle",
					fill: "#94A3B8",
					fontSize: "12",
					className: "pointer-events-none",
					children: "×"
				})]
			}),
			placingV && c.kind !== "ammeter" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				className: "cursor-pointer",
				onClick: (e) => {
					e.stopPropagation();
					onClipVoltmeter(c.id);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: x - 32,
					y: y + 16,
					width: "64",
					height: "18",
					rx: "4",
					fill: "#082F49",
					stroke: "#38BDF8"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x,
					y: y + 28,
					textAnchor: "middle",
					fill: "#7DD3FC",
					fontSize: "9",
					fontFamily: "monospace",
					children: "clip V here"
				})]
			}),
			c.kind !== "ammeter" && seriesOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				className: "cursor-pointer",
				onClick: (e) => {
					e.stopPropagation();
					onSplitParallel(seriesOwner.id);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: x - 40,
					y: y - 48,
					width: "80",
					height: "16",
					rx: "4",
					fill: "#1E1B4B",
					stroke: "#818CF8"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x,
					y: y - 37,
					textAnchor: "middle",
					fill: "#C4B5FD",
					fontSize: "8",
					fontFamily: "monospace",
					children: "add in parallel"
				})]
			})
		] }, c.id);
	}
	const vTarget = state.voltmeterAcross;
	let vLead = null;
	if (vTarget === "supply") vLead = {
		x1: 72,
		x2: 100,
		y: TOP
	};
	else if (vTarget) for (const item of laid) {
		if (item.section.type === "series" && item.section.component.id === vTarget) vLead = {
			x1: item.x + 10,
			x2: item.x + item.w - 10,
			y: TOP
		};
		if (item.section.type === "parallel") item.section.branches.forEach((branch, bi) => {
			const cy = bi === 0 ? TOP : 134;
			const cx = item.x + item.w / 2;
			if (branch[0]?.id === vTarget) vLead = {
				x1: cx - 24,
				x2: cx + 24,
				y: cy
			};
		});
	}
	const trailingX = laid.length ? laid[laid.length - 1].x + laid[laid.length - 1].w + 58 : 364;
	const switchX = 200;
	const switchOpen = !state.switchClosed;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-xl border border-border-subtle bg-inset shadow-inner",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-2 border-b border-border-faint bg-canvas-elevated px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2.5 w-2.5 rounded-full ${live ? "bg-accent" : "bg-slate-600"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs font-bold uppercase tracking-wide text-ink",
					children: "Cambridge schematic"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[11px] text-ink-faint",
				children: placingV ? "Clip the voltmeter across the cell or a load" : placingPath ? "Tap a dashed branch slot, or just tap a part in the tray to add it" : "Tap a part in the tray to add it to the loop"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: `0 0 ${VW$2} ${VH$2}`,
				className: "h-auto w-full min-w-[560px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
						id: `${flowId}-grid`,
						width: "20",
						height: "20",
						patternUnits: "userSpaceOnUse",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M 20 0 L 0 0 0 20",
							fill: "none",
							stroke: "#171C2B",
							strokeWidth: "0.8"
						})
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						width: VW$2,
						height: VH$2,
						fill: `url(#${flowId}-grid)`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: loopD,
						fill: "none",
						stroke: live ? "#F59E0B" : "#334155",
						strokeWidth: "2.4",
						strokeLinecap: "round",
						className: live ? "animate-current-dash" : void 0,
						style: live ? { strokeDasharray: "10 8" } : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: CELL_X,
							y1: TOP,
							x2: CELL_X,
							y2: 118,
							stroke: "#F59E0B",
							strokeWidth: "2.2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: 38,
							y1: 126,
							x2: 70,
							y2: 126,
							stroke: "#F59E0B",
							strokeWidth: "2.4"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: 47,
							y1: 146,
							x2: 61,
							y2: 146,
							stroke: "#F59E0B",
							strokeWidth: "6"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: CELL_X,
							y1: 154,
							x2: CELL_X,
							y2: BOT,
							stroke: "#F59E0B",
							strokeWidth: "2.2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: 30,
							y: 130,
							fill: "#FBBF24",
							fontSize: "12",
							fontWeight: "700",
							children: "+"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: 30,
							y: 154,
							fill: "#94A3B8",
							fontSize: "12",
							fontWeight: "700",
							children: "−"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
							x: CELL_X,
							y: 176,
							textAnchor: "middle",
							fill: "#F8FAFC",
							fontSize: "10",
							fontFamily: "monospace",
							fontWeight: "700",
							children: [format3SF(state.cellEmf), " V"]
						}),
						state.internalR > .001 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
							x: CELL_X,
							y: 190,
							textAnchor: "middle",
							fill: "#F87171",
							fontSize: "9",
							fontFamily: "monospace",
							children: [
								"r = ",
								format3SF(state.internalR),
								" Ω"
							]
						}),
						placingV && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
							className: "cursor-pointer",
							onClick: () => onClipVoltmeter("supply"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: 22,
								y: 198,
								width: "64",
								height: "18",
								rx: "4",
								fill: "#082F49",
								stroke: "#38BDF8"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: CELL_X,
								y: 210,
								textAnchor: "middle",
								fill: "#7DD3FC",
								fontSize: "8",
								fontFamily: "monospace",
								children: "clip V (cell)"
							})]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						className: "cursor-pointer",
						onClick: onToggleSwitch,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: 172,
								y1: BOT,
								x2: 190,
								y2: BOT,
								stroke: live || !switchOpen ? "#F59E0B" : "#475569",
								strokeWidth: "2.4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: 190,
								y1: BOT,
								x2: switchOpen ? 208 : 214,
								y2: switchOpen ? 262 : BOT,
								stroke: "#E2E8F0",
								strokeWidth: "2.6",
								strokeLinecap: "round"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: 214,
								y1: BOT,
								x2: 232,
								y2: BOT,
								stroke: live || !switchOpen ? "#F59E0B" : "#475569",
								strokeWidth: "2.4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: 190,
								cy: BOT,
								r: "3.5",
								fill: "#F8FAFC"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: 214,
								cy: BOT,
								r: "3.5",
								fill: "#F8FAFC"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: 164,
								y: 286,
								width: "72",
								height: "18",
								rx: "4",
								fill: "#141722",
								stroke: "#F59E0B"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: switchX,
								y: 299,
								textAnchor: "middle",
								fill: "#FCD34D",
								fontSize: "9",
								fontFamily: "monospace",
								fontWeight: "700",
								children: switchOpen ? "switch OPEN" : "switch CLOSED"
							})
						]
					}),
					live && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
						points: `602,70 ${RIGHT},${TOP} 602,86`,
						fill: "#FCD34D"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: 612,
						y: 64,
						textAnchor: "end",
						fill: "#FCD34D",
						fontSize: "9",
						fontFamily: "monospace",
						children: "conventional I"
					})] }),
					laid.map((item) => {
						if (item.section.type === "series") {
							const cx = item.x + item.w / 2;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", { children: renderComp(item.section.component, cx, TOP) }, item.section.id);
						}
						const cx = item.x + item.w / 2;
						const [b0, b1] = item.section.branches;
						const y2 = 136;
						const i0 = evaluation.branchCurrents[`${item.section.id}:0`];
						const i1 = evaluation.branchCurrents[`${item.section.id}:1`];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: item.x,
								y1: TOP,
								x2: item.x,
								y2,
								stroke: wire(live),
								strokeWidth: "2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: item.x + item.w,
								y1: TOP,
								x2: item.x + item.w,
								y2,
								stroke: wire(live),
								strokeWidth: "2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: item.x,
								y1: y2,
								x2: item.x + item.w,
								y2,
								stroke: wire(live),
								strokeWidth: "2"
							}),
							Number.isFinite(i0) && live && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
								x: item.x - 4,
								y: 106,
								textAnchor: "end",
								fill: "#FCD34D",
								fontSize: "8",
								fontFamily: "monospace",
								children: [format3SF(i0), " A"]
							}),
							Number.isFinite(i1) && live && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
								x: item.x - 4,
								y: 130,
								textAnchor: "end",
								fill: "#FCD34D",
								fontSize: "8",
								fontFamily: "monospace",
								children: [format3SF(i1), " A"]
							}),
							b0[0] ? renderComp(b0[0], cx, TOP) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
								className: "cursor-pointer",
								onClick: (e) => {
									e.stopPropagation();
									onPlaceBranch(item.section.id, 0);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySlot, {
									x: cx,
									y: TOP,
									label: "branch 1 — tap a part",
									active: true
								})
							}),
							b1[0] ? renderComp(b1[0], cx, y2) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
								className: "cursor-pointer",
								onClick: (e) => {
									e.stopPropagation();
									onPlaceBranch(item.section.id, 1);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySlot, {
									x: cx,
									y: y2,
									label: "branch 2 — tap a part",
									active: true
								})
							})
						] }, item.section.id);
					}),
					state.sections.length < 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
						className: "cursor-pointer",
						onClick: (e) => {
							e.stopPropagation();
							onPlaceSeries();
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySlot, {
							x: trailingX,
							y: TOP,
							label: state.sections.length === 0 ? "tap to add 10 Ω" : placingPath ? "place here" : "tap tray to add",
							active: placingPath
						})
					}),
					state.sections.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: VW$2 / 2,
						y: 56,
						textAnchor: "middle",
						fill: "#64748B",
						fontSize: "11",
						fontFamily: "monospace",
						children: "Empty loop — tap 10 Ω in the tray. Cell is already on the left. Switch is on the bottom rail."
					}),
					vLead && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: vLead.x1,
							y1: vLead.y,
							x2: vLead.x1,
							y2: 230,
							stroke: "#38BDF8",
							strokeWidth: "1.4",
							strokeDasharray: "3 3"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: vLead.x2,
							y1: vLead.y,
							x2: vLead.x2,
							y2: 230,
							stroke: "#38BDF8",
							strokeWidth: "1.4",
							strokeDasharray: "3 3"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: vLead.x1,
							y1: 230,
							x2: vLead.x2,
							y2: 230,
							stroke: "#38BDF8",
							strokeWidth: "1.4",
							strokeDasharray: "3 3"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: (vLead.x1 + vLead.x2) / 2,
							cy: 230,
							r: "16",
							fill: "#0F2133",
							stroke: "#0EA5E9",
							strokeWidth: "2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: (vLead.x1 + vLead.x2) / 2,
							y: 235,
							textAnchor: "middle",
							fill: "#38BDF8",
							fontSize: "13",
							fontWeight: "800",
							children: "V"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: (vLead.x1 + vLead.x2) / 2,
							y: 252,
							textAnchor: "middle",
							fill: "#7DD3FC",
							fontSize: "9",
							fontFamily: "monospace",
							fontWeight: "700",
							children: evaluation.voltmeterReading !== null ? `${format3SF(evaluation.voltmeterReading)} V` : "—"
						})
					] }),
					evaluation.isShort && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: VW$2 / 2,
						y: 32,
						textAnchor: "middle",
						fill: "#F87171",
						fontSize: "12",
						fontFamily: "monospace",
						fontWeight: "700",
						children: "SHORT CIRCUIT — current theoretically huge. Add a load."
					})
				]
			})
		})]
	});
}
function TaskHeader({ current, tasks, evaluation, onSelect, onReset, onLoadSeries, onLoadParallel }) {
	const complete = current.id === 1 && evaluation.task1Complete || current.id === 2 && evaluation.task2Complete || current.id === 3 && evaluation.task3Complete || current.id === 4 && evaluation.task4Complete;
	const note = evaluation.taskNotes[current.id];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2.5 rounded-xl border border-border-subtle bg-surface p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5 overflow-x-auto",
					children: tasks.map((t) => {
						const done = t.id === 1 && evaluation.task1Complete || t.id === 2 && evaluation.task2Complete || t.id === 3 && evaluation.task3Complete || t.id === 4 && evaluation.task4Complete;
						const selected = t.id === current.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onSelect(t.id),
							className: `flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${selected ? "bg-accent text-accent-fg" : "border border-border-subtle bg-muted-bg text-ink-muted"}`,
							children: [
								done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: `h-3.5 w-3.5 ${selected ? "text-accent-fg" : "text-emerald-400"}` }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-slate-500" }),
								"Task ",
								t.id
							]
						}, t.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onLoadSeries,
							className: "min-h-11 rounded-lg border border-border-subtle px-2.5 py-1.5 text-xs font-semibold text-ink-muted hover:text-accent",
							children: "Series example"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onLoadParallel,
							className: "min-h-11 rounded-lg border border-border-subtle px-2.5 py-1.5 text-xs font-semibold text-ink-muted hover:text-accent",
							children: "Parallel example"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onReset,
							className: "flex min-h-11 items-center gap-1 rounded-lg border border-border-subtle px-2.5 py-1.5 text-xs font-semibold text-ink-muted hover:text-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Reset"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-[11px] font-bold uppercase tracking-wider text-accent",
					children: [
						"Task ",
						current.id,
						": ",
						current.title
					]
				}), complete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-950/70 px-2 py-0.5 text-[11px] font-bold text-emerald-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Verified"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm font-medium leading-relaxed text-ink",
				children: current.prompt
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2 rounded-lg border border-border-faint bg-inset p-2 text-xs text-ink-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "mt-0.5 h-4 w-4 shrink-0 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: evaluation.coach })]
			}),
			complete && note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-2 text-xs text-emerald-300",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Cambridge note: " }), note] })]
			}),
			evaluation.ammeterHint && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-950/40 p-2 text-xs text-amber-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-4 w-4 shrink-0 text-amber-400" }), evaluation.ammeterHint]
			}),
			evaluation.voltmeterHint && current.id >= 3 && !evaluation.task3Complete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2 rounded-lg border border-sky-500/40 bg-sky-950/40 p-2 text-xs text-sky-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "mt-0.5 h-4 w-4 shrink-0 text-sky-400" }), evaluation.voltmeterHint]
			})
		]
	});
}
var GUIDED_TASKS = [
	{
		id: 1,
		title: "Close a series loop",
		prompt: "Tap the 10 Ω resistor in the tray — it drops onto the loop. Keep the switch closed. Check I = V / R for the whole circuit.",
		goal: "Closed series circuit with at least one load."
	},
	{
		id: 2,
		title: "Two resistors in series",
		prompt: "Add the 20 Ω as well. Current is the same through both. The p.d.s add to the terminal voltage. Read V on each resistor.",
		goal: "Two loads in series, switch closed."
	},
	{
		id: 3,
		title: "Place the meters",
		prompt: "Add the ammeter (it must sit in the loop — series). Then tap the voltmeter and clip it across a resistor. Voltmeters never go in the chain.",
		goal: "Ammeter in series and voltmeter across a load."
	},
	{
		id: 4,
		title: "Two resistors in parallel",
		prompt: "On a resistor, tap “add in parallel”, then add the other resistor on the new branch. Combined R is smaller than either branch. Currents add.",
		goal: "Two resistor branches in parallel, circuit closed."
	}
];
function makeId(prefix) {
	return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}
function componentFromTray(type, serial = 1) {
	if (type === "ammeter") return {
		id: makeId("A"),
		kind: "ammeter",
		value: 0,
		label: "Ammeter"
	};
	if (type === "lamp") return {
		id: makeId("L"),
		kind: "lamp",
		value: 12,
		label: `L${serial} · 12 Ω`
	};
	if (type === "resistor_20") return {
		id: makeId("R"),
		kind: "resistor",
		value: 20,
		label: `R${serial} · 20 Ω`
	};
	return {
		id: makeId("R"),
		kind: "resistor",
		value: 10,
		label: `R${serial} · 10 Ω`
	};
}
function getInitialCircuitState() {
	return {
		cellEmf: 6,
		internalR: 0,
		switchClosed: true,
		sections: [],
		voltmeterAcross: null
	};
}
function loadSeriesDemo() {
	const r1 = componentFromTray("resistor_10", 1);
	const r2 = componentFromTray("resistor_20", 2);
	const a = componentFromTray("ammeter");
	return {
		cellEmf: 6,
		internalR: 0,
		switchClosed: true,
		sections: [
			{
				id: makeId("s"),
				type: "series",
				component: a
			},
			{
				id: makeId("s"),
				type: "series",
				component: r1
			},
			{
				id: makeId("s"),
				type: "series",
				component: r2
			}
		],
		voltmeterAcross: r2.id
	};
}
function loadParallelDemo() {
	const r1 = componentFromTray("resistor_10", 1);
	const r2 = componentFromTray("resistor_20", 2);
	const a = componentFromTray("ammeter");
	return {
		cellEmf: 6,
		internalR: 0,
		switchClosed: true,
		sections: [{
			id: makeId("s"),
			type: "series",
			component: a
		}, {
			id: makeId("p"),
			type: "parallel",
			branches: [[r1], [r2]]
		}],
		voltmeterAcross: "supply"
	};
}
function isLoad(c) {
	return c.kind === "resistor" || c.kind === "lamp";
}
function resistanceOf(c) {
	return c.kind === "ammeter" ? 0 : c.value;
}
function branchResistance(branch) {
	if (branch.length === 0) return Infinity;
	return branch.reduce((sum, c) => sum + resistanceOf(c), 0);
}
function sectionResistance(section) {
	if (section.type === "series") return resistanceOf(section.component);
	const parts = [branchResistance(section.branches[0]), branchResistance(section.branches[1])].filter((r) => Number.isFinite(r));
	if (parts.length === 0) return Infinity;
	return 1 / parts.reduce((s, r) => s + 1 / Math.max(r, 1e-12), 0);
}
function hasLoad(state) {
	return state.sections.some((sec) => {
		if (sec.type === "series") return isLoad(sec.component);
		return sec.branches.some((b) => b.some(isLoad));
	});
}
function countSeriesLoads(state) {
	return state.sections.filter((s) => s.type === "series" && isLoad(s.component)).length;
}
function hasSeriesAmmeter(state) {
	return state.sections.some((sec) => sec.type === "series" && sec.component.kind === "ammeter");
}
function parallelLoadPair(state) {
	return state.sections.some((sec) => {
		if (sec.type !== "parallel") return false;
		return sec.branches[0].some(isLoad) && sec.branches[1].some(isLoad);
	});
}
function allComponents(state) {
	const list = [];
	for (const sec of state.sections) if (sec.type === "series") list.push(sec.component);
	else list.push(...sec.branches[0], ...sec.branches[1]);
	return list;
}
function loadResistanceOf(state) {
	if (state.sections.length === 0) return Infinity;
	let rTot = 0;
	for (const sec of state.sections) {
		const r = sectionResistance(sec);
		if (!Number.isFinite(r)) return Infinity;
		rTot += r;
	}
	return rTot;
}
function evaluateCircuit(state) {
	const empty = state.sections.length === 0;
	const loadsPresent = hasLoad(state);
	const rLoad = loadResistanceOf(state);
	const steps = [];
	if (!empty) for (const sec of state.sections) {
		const r = sectionResistance(sec);
		if (sec.type === "series") {
			if (isLoad(sec.component)) steps.push(`Series: ${sec.component.label} adds ${format3SF(r)} Ω`);
		} else {
			const r1 = branchResistance(sec.branches[0]);
			const r2 = branchResistance(sec.branches[1]);
			steps.push(`Parallel: 1/R = 1/${Number.isFinite(r1) ? format3SF(r1) : "∞"} + 1/${Number.isFinite(r2) ? format3SF(r2) : "∞"} → R = ${format3SF(r)} Ω`);
		}
	}
	const switchOpen = !state.switchClosed;
	const isShort = state.switchClosed && !empty && !loadsPresent;
	const rInternal = Math.max(0, state.internalR);
	const rTotalIfClosed = (Number.isFinite(rLoad) ? rLoad : 0) + rInternal;
	const isClosed = state.switchClosed && loadsPresent && Number.isFinite(rLoad) && rLoad > .001;
	let totalCurrent = 0;
	if (switchOpen) totalCurrent = 0;
	else if (isShort) totalCurrent = rInternal > .001 ? state.cellEmf / rInternal : Infinity;
	else if (isClosed) totalCurrent = state.cellEmf / rTotalIfClosed;
	const terminalV = switchOpen ? state.cellEmf : isShort ? rInternal > .001 ? 0 : 0 : isClosed ? state.cellEmf - totalCurrent * rInternal : 0;
	if (isClosed) {
		steps.push(`I = E / (R + r) = ${format3SF(state.cellEmf)} / (${format3SF(rLoad)} + ${format3SF(rInternal)}) = ${format3SF(totalCurrent)} A`);
		if (rInternal > .001) steps.push(`Terminal p.d. V = E − Ir = ${format3SF(state.cellEmf)} − ${format3SF(totalCurrent)}×${format3SF(rInternal)} = ${format3SF(terminalV)} V`);
	}
	const resistorCurrents = {};
	const componentCurrent = {};
	const branchCurrents = {};
	let voltagesSum = 0;
	if (isClosed) for (const sec of state.sections) if (sec.type === "series") {
		const i = totalCurrent;
		componentCurrent[sec.component.id] = i;
		if (isLoad(sec.component)) {
			const v = i * sec.component.value;
			voltagesSum += v;
			resistorCurrents[sec.component.id] = {
				current: i,
				voltage: v,
				power: i * v
			};
		}
	} else {
		const rSec = sectionResistance(sec);
		const vSec = totalCurrent * rSec;
		voltagesSum += Number.isFinite(vSec) ? vSec : 0;
		sec.branches.forEach((branch, idx) => {
			const rB = branchResistance(branch);
			const iB = Number.isFinite(rB) && rB > 0 ? vSec / rB : rB === 0 ? totalCurrent : 0;
			branchCurrents[`${sec.id}:${idx}`] = iB;
			for (const c of branch) {
				componentCurrent[c.id] = iB;
				if (isLoad(c)) resistorCurrents[c.id] = {
					current: iB,
					voltage: iB * c.value,
					power: iB * iB * c.value
				};
			}
		});
	}
	let ammeterReading = null;
	for (const c of allComponents(state)) if (c.kind === "ammeter") {
		if (switchOpen) ammeterReading = 0;
		else if (isShort) ammeterReading = totalCurrent;
		else ammeterReading = componentCurrent[c.id] ?? 0;
		break;
	}
	let voltmeterReading = null;
	let voltmeterWhere = "not clipped";
	if (state.voltmeterAcross === "supply") {
		voltmeterWhere = "cell terminals";
		voltmeterReading = terminalV;
	} else if (state.voltmeterAcross) {
		const target = allComponents(state).find((c) => c.id === state.voltmeterAcross);
		if (target && isLoad(target)) {
			voltmeterWhere = target.label;
			voltmeterReading = isClosed ? resistorCurrents[target.id]?.voltage ?? 0 : 0;
		} else if (target?.kind === "ammeter") {
			voltmeterWhere = "ammeter (≈ 0 Ω)";
			voltmeterReading = 0;
		}
	}
	const hasParallel = state.sections.some((s) => s.type === "parallel");
	const seriesLoadN = countSeriesLoads(state);
	const hasSeriesLoad = seriesLoadN >= 1;
	let topology;
	if (switchOpen) topology = "Switch open";
	else if (empty) topology = "Incomplete / open";
	else if (isShort) topology = "Short circuit";
	else if (!isClosed) topology = "Incomplete / open";
	else if (hasParallel && hasSeriesLoad) topology = "Mixed (closed)";
	else if (hasParallel) topology = "Parallel (closed)";
	else topology = "Series (closed)";
	const task1 = isClosed;
	const task2 = isClosed && !hasParallel && seriesLoadN >= 2;
	const task3 = isClosed && hasSeriesAmmeter(state) && state.voltmeterAcross !== null && state.voltmeterAcross !== "supply" && Boolean(resistorCurrents[state.voltmeterAcross]);
	const task4 = isClosed && parallelLoadPair(state);
	let coach;
	if (empty && switchOpen) coach = "Close the switch, then tap a 10 Ω resistor in the tray. It will appear on the loop.";
	else if (empty) coach = "Tap the 10 Ω resistor in the tray — it drops onto the top rail. The cell is already in the loop.";
	else if (switchOpen) coach = "Switch is open, so I = 0. A voltmeter across the cell still reads the e.m.f. Across a resistor it reads 0.";
	else if (isShort) coach = "There is no load — this is a short circuit. Current would be huge (limited only by internal resistance). Add a resistor or lamp.";
	else if (!isClosed) coach = "The conducting path is incomplete. Add a resistor to each open branch.";
	else if (!task2 && !task4) coach = `Loop closed. I = ${format3SF(totalCurrent)} A. Add a second resistor in series, or put one in parallel.`;
	else if (ammeterReading === null) coach = "Insert the ammeter in the loop (series). An ideal ammeter is 0 Ω, so the current must not change.";
	else if (!task3) coach = "Ammeter is in series. Tap V, then clip it across a resistor (not the cell) to see V = IR.";
	else if (!task4) coach = "Meters are placed. On a resistor, tap “add in parallel”, then add the 20 Ω on the new branch.";
	else coach = "Lab goals complete. Drag the e.m.f. slider — a metallic resistor gives a straight V–I line through the origin.";
	const ammeterHint = hasParallel ? hasSeriesAmmeter(state) ? null : "An ammeter on one branch only reads that branch. For I_tot, place it on the top rail before the split." : null;
	const voltmeterHint = state.voltmeterAcross === null ? "A voltmeter is a high-resistance probe. Tap V, then clip it across the cell or a resistor." : null;
	const powerW = isClosed && Number.isFinite(totalCurrent) ? terminalV * totalCurrent : 0;
	return {
		cellEmf: state.cellEmf,
		internalR: rInternal,
		terminalV,
		totalCurrent,
		totalResistance: switchOpen || empty ? Infinity : isShort ? rInternal : rTotalIfClosed,
		loadResistance: rLoad,
		powerW,
		ammeterReading,
		voltmeterReading,
		voltmeterWhere,
		topology,
		isClosed,
		isShort,
		switchClosed: state.switchClosed,
		resistorCurrents,
		branchCurrents,
		componentCurrent,
		seriesResistorCount: seriesLoadN,
		parallelResistorPair: parallelLoadPair(state),
		voltagesSum,
		task1Complete: task1,
		task2Complete: task2,
		task3Complete: task3,
		task4Complete: task4,
		taskNotes: {
			1: "I = V/R holds for the whole series loop. Conventional current leaves the positive terminal.",
			2: "Series: I is the same through every component. p.d.s add: V1 + V2 = V_terminal.",
			3: "Ammeter in series (≈ 0 Ω). Voltmeter in parallel (≈ infinite Ω). Swapping them wrecks the circuit.",
			4: "Parallel: each branch has the same p.d. Currents add. Combined R is smaller than the smallest branch."
		},
		coach,
		ammeterHint,
		voltmeterHint,
		steps
	};
}
function generateCircuitsExamQuestions() {
	return [
		{
			id: "c1",
			number: 1,
			marks: 2,
			paperRef: "0625/41 · Ohm’s law",
			prompt: "A 6.0 V cell is connected to a 10 Ω resistor. The switch is closed. Calculate the current.",
			contextLines: ["E = 6.0 V", "R = 10 Ω"],
			kind: "numeric",
			expected: .6,
			unit: "A",
			tolerancePct: 2,
			working: {
				equation: "I = V / R",
				substitution: "6.0 / 10 = 0.60",
				answer: "0.600 A"
			},
			misconception: "Current is not 6 × 10. Rearrange V = IR to I = V/R."
		},
		{
			id: "c2",
			number: 2,
			marks: 2,
			paperRef: "0625/41 · Series",
			prompt: "Two resistors, 10 Ω and 20 Ω, are in series with a 6.0 V cell. Calculate the current.",
			kind: "numeric",
			expected: .2,
			unit: "A",
			tolerancePct: 2,
			working: {
				equation: "R_tot = R1 + R2 ; I = V / R_tot",
				substitution: "30 Ω ; 6.0 / 30 = 0.20",
				answer: "0.200 A"
			},
			misconception: "In series you add resistances, you do not add currents."
		},
		{
			id: "c3",
			number: 3,
			marks: 2,
			paperRef: "0625/41 · Series p.d.",
			prompt: "Using the circuit in Q2, calculate the p.d. across the 20 Ω resistor.",
			kind: "numeric",
			expected: 4,
			unit: "V",
			tolerancePct: 2,
			working: {
				equation: "V = IR",
				substitution: "0.20 × 20 = 4.0",
				answer: "4.00 V"
			},
			misconception: "p.d. splits in series in proportion to resistance — not equally."
		},
		{
			id: "c4",
			number: 4,
			marks: 2,
			paperRef: "0625/41 · Parallel",
			prompt: "A 10 Ω and a 20 Ω resistor are in parallel. Calculate the combined resistance.",
			kind: "numeric",
			expected: 6.67,
			unit: "Ω",
			tolerancePct: 2.5,
			working: {
				equation: "1/R = 1/R1 + 1/R2",
				substitution: "1/10 + 1/20 = 0.15 → R = 6.67",
				answer: "6.67 Ω"
			},
			misconception: "Combined parallel resistance is smaller than the smallest branch."
		},
		{
			id: "c5",
			number: 5,
			marks: 2,
			paperRef: "0625/41 · Open switch",
			prompt: "A voltmeter is connected across the terminals of a 6.0 V cell. The switch in the loop is open. What does the voltmeter read?",
			contextLines: ["E = 6.0 V", "switch open → I = 0"],
			kind: "numeric",
			expected: 6,
			unit: "V",
			tolerancePct: 2,
			working: {
				equation: "I = 0 so Ir = 0 ; V_terminal = E",
				substitution: "V = 6.0",
				answer: "6.00 V"
			},
			misconception: "An open switch does not make the cell’s e.m.f. vanish. Current is zero; the voltmeter across the cell still reads E."
		},
		{
			id: "c6",
			number: 6,
			marks: 1,
			paperRef: "0625/41 · Meters",
			prompt: "An ammeter must be connected in…",
			kind: "text",
			expected: 0,
			unit: "",
			acceptedText: ["series"],
			tolerancePct: 0,
			working: {
				equation: "Ammeter resistance ≈ 0 Ω",
				substitution: "Whole current must pass through it",
				answer: "series"
			},
			misconception: "A voltmeter goes in parallel; an ammeter in series. Swapping them shorts or opens the circuit."
		},
		{
			id: "c7",
			number: 7,
			marks: 2,
			paperRef: "0625/41 · Power",
			prompt: "A 6.0 V cell supplies 0.60 A to a resistor. Calculate the power transferred in the resistor.",
			contextLines: ["V = 6.0 V", "I = 0.60 A"],
			kind: "numeric",
			expected: 3.6,
			unit: "W",
			tolerancePct: 2,
			working: {
				equation: "P = IV",
				substitution: "0.60 × 6.0 = 3.6",
				answer: "3.60 W"
			},
			misconception: "Power is IV (or I²R or V²/R), not I/V."
		},
		{
			id: "c8",
			number: 8,
			marks: 2,
			paperRef: "0625/41 · Parallel current",
			prompt: "A 10 Ω and a 20 Ω resistor in parallel are connected to 6.0 V. Calculate the current in the 10 Ω branch.",
			kind: "numeric",
			expected: .6,
			unit: "A",
			tolerancePct: 2,
			working: {
				equation: "I = V / R  (same V on each branch)",
				substitution: "6.0 / 10 = 0.60",
				answer: "0.600 A"
			},
			misconception: "In parallel the p.d. is the same; current is not."
		}
	];
}
function findEmptyBranch(state) {
	for (const sec of state.sections) {
		if (sec.type !== "parallel") continue;
		if (sec.branches[0].length === 0) return {
			id: sec.id,
			index: 0
		};
		if (sec.branches[1].length === 0) return {
			id: sec.id,
			index: 1
		};
	}
	return null;
}
function CircuitsSim({ onBackToHome }) {
	const [mode, setMode] = (0, import_react.useState)("explore");
	const [taskId, setTaskId] = (0, import_react.useState)(1);
	const [state, setState] = (0, import_react.useState)(getInitialCircuitState);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [samples, setSamples] = (0, import_react.useState)([]);
	const serial = (0, import_react.useRef)(1);
	const evaluation = (0, import_react.useMemo)(() => evaluateCircuit(state), [state]);
	const currentTask = GUIDED_TASKS.find((t) => t.id === taskId) ?? GUIDED_TASKS[0];
	(0, import_react.useEffect)(() => {
		setSamples([]);
	}, [
		state.sections,
		state.internalR,
		state.switchClosed
	]);
	(0, import_react.useEffect)(() => {
		if (!evaluation.isClosed || !Number.isFinite(evaluation.totalCurrent)) return;
		const v = evaluation.terminalV;
		const i = evaluation.totalCurrent;
		setSamples((prev) => {
			const last = prev[prev.length - 1];
			if (last && Math.abs(last.v - v) < .05 && Math.abs(last.i - i) < .005) return prev;
			const next = [...prev, {
				v,
				i
			}];
			return next.length > 24 ? next.slice(-24) : next;
		});
	}, [
		evaluation.isClosed,
		evaluation.terminalV,
		evaluation.totalCurrent
	]);
	function nextSerial() {
		const n = serial.current;
		serial.current += 1;
		return n;
	}
	function placeComponent(comp) {
		setState((prev) => {
			const empty = findEmptyBranch(prev);
			if (empty) return {
				...prev,
				sections: prev.sections.map((sec) => {
					if (sec.id !== empty.id || sec.type !== "parallel") return sec;
					const branches = [[...sec.branches[0]], [...sec.branches[1]]];
					branches[empty.index] = [comp];
					return {
						...sec,
						branches
					};
				})
			};
			if (prev.sections.length >= 4) return prev;
			return {
				...prev,
				sections: [...prev.sections, {
					id: makeId("s"),
					type: "series",
					component: comp
				}]
			};
		});
		setSelected(null);
	}
	function onAdd(type) {
		placeComponent(componentFromTray(type, nextSerial()));
	}
	function onPlaceSeries() {
		if (selected === "voltmeter") return;
		placeComponent(componentFromTray(selected ?? "resistor_10", nextSerial()));
	}
	function onPlaceBranch(sectionId, branchIndex) {
		if (selected === "voltmeter" || selected === null) return;
		const comp = componentFromTray(selected, nextSerial());
		setState((prev) => ({
			...prev,
			sections: prev.sections.map((sec) => {
				if (sec.id !== sectionId || sec.type !== "parallel") return sec;
				const branches = [[...sec.branches[0]], [...sec.branches[1]]];
				branches[branchIndex] = [comp];
				return {
					...sec,
					branches
				};
			})
		}));
		setSelected(null);
	}
	function onRemove(componentId) {
		setState((prev) => {
			const sections = prev.sections.flatMap((sec) => {
				if (sec.type === "series") return sec.component.id === componentId ? [] : [sec];
				const b0 = sec.branches[0].filter((c) => c.id !== componentId);
				const b1 = sec.branches[1].filter((c) => c.id !== componentId);
				if (b0.length === 0 && b1.length === 0) return [];
				if (b0.length === 1 && b1.length === 0) return [{
					id: makeId("s"),
					type: "series",
					component: b0[0]
				}];
				if (b1.length === 1 && b0.length === 0) return [{
					id: makeId("s"),
					type: "series",
					component: b1[0]
				}];
				return [{
					...sec,
					branches: [b0, b1]
				}];
			});
			const voltmeterAcross = prev.voltmeterAcross === componentId ? null : prev.voltmeterAcross;
			return {
				...prev,
				sections,
				voltmeterAcross
			};
		});
	}
	function onSplitParallel(sectionId) {
		setState((prev) => ({
			...prev,
			sections: prev.sections.map((sec) => {
				if (sec.id !== sectionId || sec.type !== "series" || sec.component.kind === "ammeter") return sec;
				return {
					id: makeId("p"),
					type: "parallel",
					branches: [[sec.component], []]
				};
			})
		}));
	}
	function onClipVoltmeter(target) {
		setState((prev) => ({
			...prev,
			voltmeterAcross: target
		}));
		setSelected(null);
	}
	function hardReset(next) {
		serial.current = 1;
		setState(next ?? getInitialCircuitState());
		setSelected(null);
		setSamples([]);
	}
	if (mode === "exam") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimHeader, {
			title: "Electrical Circuits & Ohm’s Law",
			syllabus: "Syllabus 4.2 · V = IR",
			simNumber: "#04",
			mode,
			onMode: setMode,
			exploreLabel: "Guided lab",
			examLabel: "Paper 4 exam",
			onBackToHome
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExamPlayer, {
			title: "Electrical circuits & Ohm’s law",
			paperLabel: "Cambridge IGCSE 0625 · Paper 4",
			questions: generateCircuitsExamQuestions(),
			onExit: () => setMode("explore")
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimHeader, {
				title: "Electrical Circuits & Ohm’s Law",
				syllabus: "Syllabus 4.2 · V = IR",
				simNumber: "#04",
				mode,
				onMode: setMode,
				exploreLabel: "Guided lab (4 tasks)",
				examLabel: "Paper 4 exam (8 questions)",
				onBackToHome
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskHeader, {
				current: currentTask,
				tasks: GUIDED_TASKS,
				evaluation,
				onSelect: setTaskId,
				onReset: () => hardReset(),
				onLoadSeries: () => {
					hardReset(loadSeriesDemo());
					setTaskId(3);
				},
				onLoadParallel: () => {
					hardReset(loadParallelDemo());
					setTaskId(4);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-3 lg:grid-cols-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 lg:col-span-7",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchematicCanvas, {
						state,
						evaluation,
						selected,
						onPlaceSeries,
						onPlaceBranch,
						onRemove,
						onSplitParallel,
						onClipVoltmeter,
						onToggleSwitch: () => setState((s) => ({
							...s,
							switchClosed: !s.switchClosed
						}))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComponentTray, {
						selected,
						cellEmf: state.cellEmf,
						internalR: state.internalR,
						onSelectVoltmeter: () => setSelected((s) => s === "voltmeter" ? null : "voltmeter"),
						onAdd,
						onEmf: (cellEmf) => setState((s) => ({
							...s,
							cellEmf
						})),
						onInternalR: (internalR) => setState((s) => ({
							...s,
							internalR
						}))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircuitReadouts, {
						evaluation,
						state,
						samples
					})
				})]
			})
		]
	});
}
function getInitialRefractionState() {
	return {
		n2: 1.5,
		incidenceDeg: 35,
		denserToRarer: false
	};
}
function computeRefraction(s) {
	const nAir = 1;
	const nFrom = s.denserToRarer ? s.n2 : nAir;
	const nTo = s.denserToRarer ? nAir : s.n2;
	const i = s.incidenceDeg * Math.PI / 180;
	const critical = nFrom > nTo ? Math.asin(nTo / nFrom) * 180 / Math.PI : null;
	const product = nFrom * Math.sin(i);
	const tir = critical !== null && s.incidenceDeg > critical + 1e-6;
	let rDeg = null;
	if (!tir) {
		const arg = product / nTo;
		if (arg <= 1) rDeg = Math.asin(arg) * 180 / Math.PI;
	}
	return {
		nFrom,
		nTo,
		critical,
		tir,
		rDeg,
		sinI: Math.sin(i),
		n: s.n2
	};
}
function generateRefractionExamQuestions() {
	return [
		{
			id: "r1",
			number: 1,
			marks: 2,
			paperRef: "0625/43 · Snell’s law",
			prompt: "A ray in air (n = 1.00) hits glass at 40° and refracts at 25°. Calculate n of the glass.",
			kind: "numeric",
			expected: 1.52,
			unit: "",
			tolerancePct: 2.5,
			working: {
				equation: "n = sin i / sin r",
				substitution: "sin 40° / sin 25° = 1.52",
				answer: "1.52"
			},
			misconception: "Do not divide the angles. Use sines."
		},
		{
			id: "r2",
			number: 2,
			marks: 2,
			paperRef: "0625/43 · Critical angle",
			prompt: "Glass of n = 1.50 meets air. Calculate the critical angle.",
			kind: "numeric",
			expected: 41.8,
			unit: "°",
			tolerancePct: 2,
			working: {
				equation: "sin c = 1 / n",
				substitution: "c = sin⁻¹(1/1.50) = 41.8°",
				answer: "41.8°"
			}
		},
		{
			id: "r3",
			number: 3,
			marks: 1,
			paperRef: "0625/43",
			prompt: "TIR can only happen when light is travelling from…",
			kind: "text",
			expected: 0,
			unit: "",
			acceptedText: [
				"denser to rarer",
				"optically denser",
				"glass to air",
				"water to air"
			],
			tolerancePct: 0,
			working: {
				equation: "n1 > n2 and i > c",
				substitution: "Towards the normal is the opposite case",
				answer: "optically denser to rarer (e.g. glass → air)"
			}
		},
		{
			id: "r4",
			number: 4,
			marks: 2,
			paperRef: "0625/43",
			prompt: "Light in water (n = 1.33) is incident at 30° on a water–air surface. Calculate the angle of refraction in air.",
			kind: "numeric",
			expected: 41.7,
			unit: "°",
			tolerancePct: 3,
			working: {
				equation: "n1 sin i = n2 sin r",
				substitution: "1.33 sin 30° = 1.00 sin r → r = 41.7°",
				answer: "41.7°"
			}
		}
	];
}
function RefractionSim({ onBackToHome }) {
	const [mode, setMode] = (0, import_react.useState)("explore");
	const [state, setState] = (0, import_react.useState)(getInitialRefractionState);
	const d = computeRefraction(state);
	if (mode === "exam") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimHeader, {
			title: "Light & Refraction",
			syllabus: "Syllabus 3.2.3",
			simNumber: "#05",
			mode,
			onMode: setMode,
			examLabel: "Exam mode",
			onBackToHome
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExamPlayer, {
			title: "Snell’s law and TIR",
			paperLabel: "Cambridge IGCSE 0625 · Paper 4",
			questions: generateRefractionExamQuestions(),
			onExit: () => setMode("explore")
		})]
	});
	const cx = 280;
	const cy = 150;
	const len = 130;
	const iRad = state.incidenceDeg * Math.PI / 180;
	const fromBelow = state.denserToRarer;
	const incX = cx - Math.sin(iRad) * len;
	const incY = fromBelow ? cy + Math.cos(iRad) * len : cy - Math.cos(iRad) * len;
	const rRad = d.rDeg !== null ? d.rDeg * Math.PI / 180 : iRad;
	const outX = d.tir ? cx + Math.sin(iRad) * len : cx + Math.sin(rRad) * len;
	const outY = d.tir ? fromBelow ? cy + Math.cos(iRad) * len : cy - Math.cos(iRad) * len : fromBelow ? cy - Math.cos(rRad) * len : cy + Math.cos(rRad) * len;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimHeader, {
			title: "Light & Refraction",
			syllabus: "Syllabus 3.2.3 · Snell’s law",
			simNumber: "#05",
			mode,
			onMode: setMode,
			examLabel: "Exam mode (4 questions)",
			onBackToHome
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-3.5 lg:grid-cols-[3fr_2fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl border border-border-faint bg-inset",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 560 300",
					className: "h-auto w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							width: "560",
							height: "300",
							fill: "#0A0C10"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "0",
							y: fromBelow ? 0 : cy,
							width: "560",
							height: fromBelow ? cy : 150,
							fill: "#0E1A2E"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "0",
							y: fromBelow ? cy : 0,
							width: "560",
							height: fromBelow ? 150 : cy,
							fill: "#0A1220"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "40",
							y1: cy,
							x2: "520",
							y2: cy,
							stroke: "#64748B",
							strokeWidth: "1.5"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: cx,
							y1: "20",
							x2: cx,
							y2: "280",
							stroke: "#334155",
							strokeDasharray: "4 4"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: incX,
							y1: incY,
							x2: cx,
							y2: cy,
							stroke: "#FBBF24",
							strokeWidth: "2.5"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: cx,
							y1: cy,
							x2: outX,
							y2: outY,
							stroke: d.tir ? "#38BDF8" : "#F59E0B",
							strokeWidth: "2.5"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
							x: "20",
							y: "24",
							fill: "#94A3B8",
							fontSize: "11",
							fontFamily: "monospace",
							children: [
								"i = ",
								format3SF(state.incidenceDeg),
								"° ·",
								" ",
								d.tir ? "TIR" : `r = ${d.rDeg !== null ? format3SF(d.rDeg) : "—"}°`,
								d.critical ? ` · c = ${format3SF(d.critical)}°` : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
							x: "20",
							y: fromBelow ? 44 : 174,
							fill: "#7DD3FC",
							fontSize: "10",
							fontFamily: "monospace",
							children: ["n = ", format3SF(fromBelow ? d.nFrom : d.nTo)]
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border-subtle bg-surface p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs text-ink-muted",
						children: ["n₁ sin i = n₂ sin r · n = ", format3SF(state.n2)]
					}), d.tir && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 rounded-lg border border-sky-500/30 bg-sky-500/10 p-2 text-xs text-sky-200",
						children: "Total internal reflection — i is greater than the critical angle."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border-subtle bg-surface p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							label: "Angle of incidence",
							value: state.incidenceDeg,
							min: 0,
							max: 85,
							step: 1,
							unit: "°",
							onChange: (incidenceDeg) => setState((s) => ({
								...s,
								incidenceDeg
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							label: "Refractive index n₂",
							value: state.n2,
							min: 1.2,
							max: 1.8,
							step: .01,
							unit: "",
							onChange: (n2) => setState((s) => ({
								...s,
								n2
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setState((s) => ({
								...s,
								denserToRarer: !s.denserToRarer
							})),
							className: "mt-3 w-full rounded-lg border border-border-subtle py-2 text-xs font-semibold text-ink-muted hover:text-accent",
							children: ["Direction: ", state.denserToRarer ? "denser → rarer (can TIR)" : "air → denser"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setState(getInitialRefractionState()),
							className: "mt-2 flex items-center gap-1 text-xs text-ink-muted hover:text-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Reset"]
						})
					]
				})]
			})]
		})]
	});
}
function Slider({ label, value, min, max, step, unit, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "mt-2 flex flex-col gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex justify-between font-mono text-xs text-ink-muted",
			children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-bold text-amber-300",
				children: [
					format3SF(value),
					" ",
					unit
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min,
			max,
			step,
			value,
			onChange: (e) => onChange(parseFloat(e.target.value)),
			className: "h-1.5 w-full accent-amber-400"
		})]
	});
}
var ELECTROMAGNETISM_PRESETS = [
	{
		name: "Lab wire",
		description: "Typical school bench: 2.0 A in 0.05 T over 0.50 m",
		currentA: 2,
		bFieldT: .05,
		lengthM: .5
	},
	{
		name: "Strong magnet",
		description: "0.20 T field, modest current",
		currentA: 3,
		bFieldT: .2,
		lengthM: .4
	},
	{
		name: "Reverse I",
		description: "Negative current — force flips",
		currentA: -4,
		bFieldT: .1,
		lengthM: .8
	},
	{
		name: "Zero current",
		description: "No I → no force",
		currentA: 0,
		bFieldT: .1,
		lengthM: 1
	}
];
function getInitialElectromagnetismState() {
	return {
		currentA: 4,
		bFieldT: .1,
		lengthM: .5,
		bIntoPage: true,
		subMode: "motor"
	};
}
function computeElectromagnetism(state) {
	const bSign = state.bIntoPage ? 1 : -1;
	const forceN = state.bFieldT * state.currentA * state.lengthM * bSign;
	const forceMagnitudeN = Math.abs(forceN);
	const directionSign = Math.abs(forceN) < 1e-6 ? 0 : forceN > 0 ? 1 : -1;
	return {
		forceN,
		forceMagnitudeN,
		directionSign,
		directionLabel: directionSign === 0 ? "No force" : directionSign > 0 ? "Upwards" : "Downwards",
		currentOutOfPage: state.currentA > 0,
		formulaLine: `F = BIL = ${format3SF(state.bFieldT)} × ${format3SF(state.currentA)} × ${format3SF(state.lengthM)} = ${format3SF(forceN)} N`
	};
}
function generateElectromagnetismExamQuestions() {
	return [
		{
			id: "e1",
			number: 1,
			marks: 2,
			paperRef: "0625/42 · Motor effect",
			prompt: "A wire of length 0.50 m carries a current of 4.0 A in a magnetic field of flux density 0.20 T. The field is perpendicular to the wire. Calculate the force on the wire.",
			contextLines: [
				"B = 0.20 T",
				"I = 4.0 A",
				"L = 0.50 m"
			],
			kind: "numeric",
			expected: .4,
			unit: "N",
			tolerancePct: 2,
			working: {
				equation: "F = B I L",
				substitution: "0.20 × 4.0 × 0.50 = 0.40",
				answer: "0.400 N"
			},
			misconception: "Do not forget L is the length in the field, in metres not centimetres."
		},
		{
			id: "e2",
			number: 2,
			marks: 2,
			paperRef: "0625/42 · Rearrange F = BIL",
			prompt: "The force on a 0.80 m wire carrying 5.0 A is 0.20 N. Calculate B.",
			kind: "numeric",
			expected: .05,
			unit: "T",
			tolerancePct: 2,
			working: {
				equation: "B = F / (I L)",
				substitution: "0.20 / (5.0 × 0.80) = 0.050",
				answer: "0.0500 T"
			}
		},
		{
			id: "e3",
			number: 3,
			marks: 1,
			paperRef: "0625/42 · Fleming",
			prompt: "B is into the page and conventional current is to the right. Using Fleming’s left-hand rule, the force on the wire is…",
			kind: "text",
			expected: 0,
			unit: "",
			acceptedText: [
				"up",
				"upwards",
				"upward"
			],
			tolerancePct: 0,
			working: {
				equation: "First finger B, second finger I, thumb F",
				substitution: "B into page, I right → thumb up",
				answer: "upwards"
			},
			misconception: "Left hand for the motor effect. The right hand is the generator (dynamo) rule."
		},
		{
			id: "e4",
			number: 4,
			marks: 1,
			paperRef: "0625/42",
			prompt: "If the current in Q3 is reversed, the force is…",
			kind: "text",
			expected: 0,
			unit: "",
			acceptedText: [
				"down",
				"downwards",
				"downward"
			],
			tolerancePct: 0,
			working: {
				equation: "Reverse I → reverse F",
				substitution: "Thumb now points down",
				answer: "downwards"
			}
		},
		{
			id: "e5",
			number: 5,
			marks: 2,
			paperRef: "0625/42 · Field around a wire",
			prompt: "Looking at a wire so that conventional current comes out of the page, the magnetic field circles are…",
			kind: "text",
			expected: 0,
			unit: "",
			acceptedText: [
				"anticlockwise",
				"counterclockwise",
				"counter-clockwise"
			],
			tolerancePct: 0,
			working: {
				equation: "Right-hand grip rule",
				substitution: "Thumb out of page → fingers curl anticlockwise",
				answer: "anticlockwise"
			},
			misconception: "Do not use Fleming’s left-hand rule for the field around a single wire — that is the grip / corkscrew rule."
		},
		{
			id: "e6",
			number: 6,
			marks: 2,
			paperRef: "0625/42",
			prompt: "A wire in a 0.10 T field carries no current. The force on the wire is…",
			kind: "numeric",
			expected: 0,
			unit: "N",
			tolerancePct: 1,
			working: {
				equation: "F = BIL",
				substitution: "I = 0 → F = 0",
				answer: "0 N"
			}
		}
	];
}
function ElectromagnetismControls({ state, onChangeCurrentA, onChangeBFieldT, onChangeLengthM, onToggleBDir, onApplyPreset, onReset }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3 rounded-xl border border-border-subtle bg-surface p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border-faint pb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "h-3.5 w-3.5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs font-bold uppercase tracking-widest text-accent",
						children: "Controls"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onReset,
					className: "flex items-center gap-1 rounded-lg border border-border-faint bg-canvas-elevated px-2 py-1 font-mono text-[10px] text-ink-muted hover:text-accent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" }), " Reset"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
				label: "Current",
				symbol: "I",
				value: state.currentA,
				min: -10,
				max: 10,
				step: .1,
				unit: "A",
				onChange: onChangeCurrentA,
				bipolar: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
				label: "Magnetic flux density",
				symbol: "B",
				value: state.bFieldT,
				min: .01,
				max: .2,
				step: .01,
				unit: "T",
				onChange: onChangeBFieldT
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
				label: "Length in the field",
				symbol: "L",
				value: state.lengthM,
				min: .1,
				max: 2,
				step: .05,
				unit: "m",
				onChange: onChangeLengthM
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onToggleBDir,
				className: "rounded-lg border border-border-subtle bg-inset px-3 py-2 text-left text-xs font-semibold text-ink-muted hover:text-accent",
				children: [
					"B direction: ",
					state.bIntoPage ? "into the page (×)" : "out of the page (⊙)",
					" — tap to reverse"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-faint",
				children: "Real-world presets"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: ELECTROMAGNETISM_PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					title: p.description,
					onClick: () => onApplyPreset(p),
					className: "rounded-lg border border-border-faint bg-canvas-elevated px-2.5 py-1 font-mono text-[10px] text-ink-muted hover:border-accent/40 hover:text-amber-300",
					children: p.name
				}, p.name))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border-faint bg-canvas-elevated p-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1.5 flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hand, { className: "h-3.5 w-3.5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] font-bold uppercase tracking-wider text-accent",
						children: "Fleming’s left-hand rule"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hint, {
							color: "text-blue-400",
							title: "Index → B",
							sub: "field"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hint, {
							color: "text-emerald-400",
							title: "Middle → I",
							sub: "current"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hint, {
							color: "text-amber-300",
							title: "Thumb → F",
							sub: "force"
						})
					]
				})]
			})
		]
	});
}
function Hint({ color, title, sub }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center rounded-lg border border-border-faint bg-surface p-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `font-mono text-[9px] ${color}`,
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-[9px] text-ink-faint",
			children: sub
		})]
	});
}
function SliderRow({ label, symbol, value, min, max, step, unit, onChange, bipolar }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-xs text-ink-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-accent",
							children: symbol
						}),
						" — ",
						label
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-xs font-bold tabular-nums text-amber-300",
					children: [
						format3SF(value),
						" ",
						unit
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "range",
				min,
				max,
				step,
				value,
				onChange: (e) => onChange(parseFloat(e.target.value)),
				className: "h-1.5 w-full accent-amber-400"
			}),
			bipolar && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between font-mono text-[9px] text-ink-faint",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [min, " A"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"+",
						max,
						" A"
					] })
				]
			})
		]
	});
}
function ElectromagnetismReadouts({ state, calculated }) {
	const none = Math.abs(state.currentA) < .001;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2.5 rounded-xl border border-border-subtle bg-surface p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 border-b border-border-faint pb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3.5 w-3.5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs font-bold uppercase tracking-widest text-accent",
					children: "Live readouts"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				icon: Zap,
				label: "Force  F = BIL",
				value: none ? "0" : format3SF(calculated.forceMagnitudeN),
				unit: "N",
				highlight: !none
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				icon: ArrowUpDown,
				label: "Force direction",
				value: calculated.directionLabel,
				unit: "",
				accent: none ? "text-ink-faint" : calculated.directionSign > 0 ? "text-amber-300" : "text-blue-300"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				icon: Magnet,
				label: "Flux density B",
				value: format3SF(state.bFieldT),
				unit: "T"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				icon: Zap,
				label: "Current I",
				value: format3SF(state.currentA),
				unit: "A",
				accent: state.currentA >= 0 ? "text-amber-300" : "text-blue-300"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				icon: Ruler,
				label: "Length in field L",
				value: format3SF(state.lengthM),
				unit: "m"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-border-faint bg-canvas-elevated px-2.5 py-1.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] text-ink-faint",
					children: calculated.formulaLine
				})
			})
		]
	});
}
function Card({ icon: Icon, label, value, unit, highlight, accent = "text-amber-300" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-center gap-3 rounded-xl border p-3 ${highlight ? "border-accent/30 bg-accent/10" : "border-border-faint bg-canvas-elevated"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${highlight ? "bg-accent/20 text-accent" : "bg-surface text-ink-muted"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-faint",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: `mt-0.5 font-mono text-lg font-bold leading-none ${accent}`,
				children: [
					value,
					" ",
					unit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-ink-faint",
						children: unit
					})
				]
			})]
		})]
	});
}
function FlemingPanel({ state, calculated }) {
	const iRight = state.currentA >= 0;
	const bInto = state.bIntoPage;
	const fUp = calculated.directionSign >= 0 || calculated.directionSign === 0 && iRight && bInto;
	const noF = calculated.directionSign === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-xl border border-border-faint bg-[#0A0C10]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 640 360",
			className: "h-auto w-full",
			"aria-label": "Fleming's left-hand rule",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "24",
					y: "32",
					fill: "#F59E0B",
					fontSize: "13",
					fontFamily: "monospace",
					fontWeight: "700",
					children: "FLEMING’S LEFT-HAND RULE — motor effect"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "24",
					y: "52",
					fill: "#64748B",
					fontSize: "11",
					fontFamily: "monospace",
					children: "First finger = B · Second finger = I · Thumb = F"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "250",
					cy: "210",
					rx: "70",
					ry: "88",
					fill: "#1E2433",
					stroke: "#94A3B8",
					strokeWidth: "2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "250",
					y: "216",
					textAnchor: "middle",
					fill: "#64748B",
					fontSize: "12",
					fontFamily: "monospace",
					children: "LEFT"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "250",
					y: "232",
					textAnchor: "middle",
					fill: "#64748B",
					fontSize: "12",
					fontFamily: "monospace",
					children: "HAND"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "250",
						y1: "130",
						x2: "250",
						y2: "70",
						stroke: "#60A5FA",
						strokeWidth: "8",
						strokeLinecap: "round"
					}),
					bInto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
						points: "250,58 242,76 258,76",
						fill: "#60A5FA"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
						points: "250,70 242,52 258,52",
						fill: "#60A5FA"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
						x: "268",
						y: "78",
						fill: "#60A5FA",
						fontSize: "13",
						fontFamily: "monospace",
						fontWeight: "700",
						children: ["B ", bInto ? "into page" : "out of page"]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "318",
						y1: "210",
						x2: iRight ? 430 : 140,
						y2: "210",
						stroke: "#34D399",
						strokeWidth: "8",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
						points: iRight ? "444,210 428,202 428,218" : "126,210 142,202 142,218",
						fill: "#34D399"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
						x: iRight ? 360 : 148,
						y: "198",
						fill: "#34D399",
						fontSize: "13",
						fontFamily: "monospace",
						fontWeight: "700",
						children: ["I ", iRight ? "→" : "←"]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					opacity: noF ? .35 : 1,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "198",
							y1: "160",
							x2: fUp ? 140 : 140,
							y2: fUp ? 92 : 292,
							stroke: "#FBBF24",
							strokeWidth: "8",
							strokeLinecap: "round"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
							points: fUp ? "132,78 124,98 148,94" : "132,306 124,286 148,290",
							fill: "#FBBF24"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
							x: "86",
							y: fUp ? 90 : 300,
							fill: "#FBBF24",
							fontSize: "13",
							fontFamily: "monospace",
							fontWeight: "700",
							children: ["F ", noF ? "(none)" : fUp ? "up" : "down"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "400",
					y: "70",
					width: "220",
					height: "210",
					rx: "12",
					fill: "#0E1119",
					stroke: "#1F2432"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "416",
					y: "98",
					fill: "#94A3B8",
					fontSize: "11",
					fontFamily: "monospace",
					fontWeight: "700",
					children: "Live mapping"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
					x: "416",
					y: "128",
					fill: "#60A5FA",
					fontSize: "12",
					fontFamily: "monospace",
					children: ["B · ", bInto ? "into the page" : "out of the page"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
					x: "416",
					y: "156",
					fill: "#34D399",
					fontSize: "12",
					fontFamily: "monospace",
					children: ["I · ", Math.abs(state.currentA) < .001 ? "zero" : iRight ? "to the right" : "to the left"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
					x: "416",
					y: "184",
					fill: "#FBBF24",
					fontSize: "12",
					fontFamily: "monospace",
					children: ["F · ", calculated.directionLabel]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "416",
					y: "220",
					fill: "#64748B",
					fontSize: "10",
					fontFamily: "monospace",
					children: "Reverse I or reverse B"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "416",
					y: "236",
					fill: "#64748B",
					fontSize: "10",
					fontFamily: "monospace",
					children: "and the force reverses."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "416",
					y: "260",
					fill: "#475569",
					fontSize: "10",
					fontFamily: "monospace",
					children: "Right hand = generator rule."
				})
			]
		})
	});
}
var VW$1 = 640;
var VH$1 = 360;
var CX = 320;
var CY = 168;
var RADII = [
	36,
	62,
	92,
	124,
	158
];
function MagneticFieldCanvas({ state }) {
	const { currentA } = state;
	const none = Math.abs(currentA) < .001;
	const out = currentA > 0;
	const opacity = Math.min(Math.abs(currentA) / 10, 1);
	const stroke = out ? "#60A5FA" : "#F59E0B";
	const compasses = [
		0,
		45,
		90,
		135,
		180,
		225,
		270,
		315
	].map((deg) => {
		const th = deg * Math.PI / 180;
		const r = 118;
		return {
			x: CX + r * Math.cos(th),
			y: CY + r * Math.sin(th),
			tangent: out ? th + Math.PI / 2 : th - Math.PI / 2,
			deg
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-xl border border-border-faint bg-[#0A0C10]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: `0 0 ${VW$1} ${VH$1}`,
			className: "h-auto w-full",
			"aria-label": "Magnetic field around a wire",
			children: [
				[
					70,
					140,
					210,
					280
				].map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: 0,
					y1: y,
					x2: VW$1,
					y2: y,
					stroke: "#131825"
				}, y)),
				!none && RADII.map((r, i) => {
					const op = opacity * Math.max(.2, 1 - i * .14);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
						opacity: op,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: CX,
							cy: CY,
							r,
							fill: "none",
							stroke,
							strokeWidth: i === 0 ? 2.2 : 1.5,
							className: "animate-current-dash",
							style: { strokeDasharray: "8 10" }
						})
					}, r);
				}),
				!none && compasses.map((c) => {
					const dx = Math.cos(c.tangent) * 14;
					const dy = Math.sin(c.tangent) * 14;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						transform: `translate(${c.x},${c.y})`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								r: "11",
								fill: "#0E1119",
								stroke: "#334155"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: -dx,
								y1: -dy,
								x2: dx,
								y2: dy,
								stroke: "#F87171",
								strokeWidth: "2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: dx * .7,
								cy: dy * .7,
								r: "2.2",
								fill: "#FCA5A5"
							})
						]
					}, c.deg);
				}),
				none && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: CX,
					y: 112,
					textAnchor: "middle",
					fill: "#4B5563",
					fontSize: "13",
					fontFamily: "monospace",
					children: "No current → no magnetic field"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: CX,
					cy: CY,
					r: "20",
					fill: "#1E2433",
					stroke: none ? "#334155" : stroke,
					strokeWidth: "2.6"
				}),
				!none && out && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: CX,
					cy: CY,
					r: "5.5",
					fill: "#93C5FD"
				}),
				!none && !out && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: 311,
					y1: 159,
					x2: 329,
					y2: 177,
					stroke: "#FCD34D",
					strokeWidth: "2.5"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: 329,
					y1: 159,
					x2: 311,
					y2: 177,
					stroke: "#FCD34D",
					strokeWidth: "2.5"
				})] }),
				none && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: 312,
					y1: CY,
					x2: 328,
					y2: CY,
					stroke: "#374151",
					strokeWidth: "2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: CX,
					y: 206,
					textAnchor: "middle",
					fill: "#94A3B8",
					fontSize: "11",
					fontFamily: "monospace",
					children: none ? "Wire (I = 0)" : out ? `I out of page ⊙  ${format3SF(Math.abs(currentA))} A` : `I into page ⊗  ${format3SF(Math.abs(currentA))} A`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: 16,
					y: 298,
					width: 300,
					height: 46,
					rx: "8",
					fill: "#0E1119",
					stroke: "#1F2432"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: 28,
					y: 318,
					fill: "#94A3B8",
					fontSize: "10",
					fontFamily: "monospace",
					fontWeight: "700",
					children: "RIGHT-HAND GRIP RULE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
					x: 28,
					y: 334,
					fill: "#64748B",
					fontSize: "10",
					fontFamily: "monospace",
					children: ["Thumb → I ; fingers curl → B ", out ? "(anticlockwise)" : "(clockwise)"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: 622,
					y: 24,
					textAnchor: "end",
					fill: "#64748B",
					fontSize: "11",
					fontFamily: "monospace",
					children: "Field ∝ |I| / r"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: 622,
					y: 40,
					textAnchor: "end",
					fill: "#475569",
					fontSize: "10",
					fontFamily: "monospace",
					children: "Red compass needle follows B"
				})
			]
		})
	});
}
var VW = 640;
var VH = 360;
var WIRE_Y = 180;
var MAX_F = 4;
var MAX_DEF = 48;
function MotorEffectCanvas({ state, calculated }) {
	const { currentA, bFieldT, lengthM, bIntoPage } = state;
	const { forceMagnitudeN, directionSign, directionLabel } = calculated;
	const noForce = Math.abs(currentA) < .001 || forceMagnitudeN < 1e-6;
	const wireY = WIRE_Y - directionSign * Math.min(forceMagnitudeN / MAX_F * MAX_DEF, MAX_DEF);
	const fieldHalf = 70 + lengthM / 2 * 90;
	const left = VW / 2 - fieldHalf;
	const right = VW / 2 + fieldHalf;
	const bCount = Math.max(3, Math.round(3 + bFieldT * 20));
	const tipY = wireY - directionSign * Math.min(18 + forceMagnitudeN * 28, 90);
	const strokeB = bIntoPage ? "#64748B" : "#60A5FA";
	const xs = [];
	for (let i = 0; i < bCount; i++) xs.push(left + 18 + i * (right - left - 36) / Math.max(bCount - 1, 1));
	const ys = [
		70,
		118,
		242,
		290
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-xl border border-border-faint bg-[#0A0C10]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: `0 0 ${VW} ${VH}`,
			className: "h-auto w-full",
			"aria-label": "Motor effect",
			children: [
				[
					80,
					160,
					240,
					320
				].map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: 0,
					y1: y,
					x2: VW,
					y2: y,
					stroke: "#131825"
				}, y)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: left,
					y: 48,
					width: right - left,
					height: 264,
					rx: "10",
					fill: bIntoPage ? "#0F121A" : "#0B1524",
					stroke: "#1F2432"
				}),
				xs.map((x) => ys.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
					transform: `translate(${x},${y})`,
					opacity: .45 + bFieldT,
					children: bIntoPage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: -5,
						y1: -5,
						x2: 5,
						y2: 5,
						stroke: strokeB,
						strokeWidth: "1.6"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: 5,
						y1: -5,
						x2: -5,
						y2: 5,
						stroke: strokeB,
						strokeWidth: "1.6"
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						r: "6",
						fill: "none",
						stroke: strokeB,
						strokeWidth: "1.4"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						r: "2",
						fill: "#93C5FD"
					})] })
				}, `${x}-${y}`))),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
					x: left + 8,
					y: 40,
					fill: "#94A3B8",
					fontSize: "11",
					fontFamily: "monospace",
					children: [
						"B ",
						bIntoPage ? "into page (×)" : "out of page (⊙)",
						" = ",
						format3SF(bFieldT),
						" T"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: left,
					y1: 318,
					x2: right,
					y2: 318,
					stroke: "#F59E0B",
					strokeWidth: "1.2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: left,
					y1: 312,
					x2: left,
					y2: 324,
					stroke: "#F59E0B"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: right,
					y1: 312,
					x2: right,
					y2: 324,
					stroke: "#F59E0B"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
					x: VW / 2,
					y: 334,
					textAnchor: "middle",
					fill: "#FBBF24",
					fontSize: "11",
					fontFamily: "monospace",
					children: [
						"L in the field = ",
						format3SF(lengthM),
						" m"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: 36,
					y1: WIRE_Y,
					x2: 604,
					y2: WIRE_Y,
					stroke: "#2A3042",
					strokeDasharray: "5 4"
				}),
				!noForce && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: VW / 2,
						y1: wireY,
						x2: VW / 2,
						y2: tipY,
						stroke: "#F59E0B",
						strokeWidth: "3.2",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
						points: directionSign >= 0 ? `${VW / 2},${tipY - 2} ${VW / 2 - 8},${tipY + 12} 328,${tipY + 12}` : `${VW / 2},${tipY + 2} ${VW / 2 - 8},${tipY - 12} 328,${tipY - 12}`,
						fill: "#F59E0B"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
						x: 334,
						y: tipY + (directionSign >= 0 ? 4 : -4),
						fill: "#FCD34D",
						fontSize: "13",
						fontFamily: "monospace",
						fontWeight: "700",
						children: [
							"F = ",
							format3SF(forceMagnitudeN),
							" N"
						]
					})
				] }),
				noForce && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: VW / 2,
					y: 144,
					textAnchor: "middle",
					fill: "#4B5563",
					fontSize: "13",
					fontFamily: "monospace",
					children: "F = BIL = 0"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: 28,
					y1: wireY,
					x2: 612,
					y2: wireY,
					stroke: "#92400E",
					strokeWidth: "10",
					opacity: "0.28"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: 28,
					y1: wireY,
					x2: 612,
					y2: wireY,
					stroke: "#B45309",
					strokeWidth: "4",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: left,
					y1: wireY,
					x2: right,
					y2: wireY,
					stroke: "#F59E0B",
					strokeWidth: "6",
					strokeLinecap: "round"
				}),
				currentA > .05 && [
					170,
					260,
					350,
					440
				].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
					points: `${x + 11},${wireY} ${x - 3},${wireY - 6} ${x - 3},${wireY + 6}`,
					fill: "#FCD34D"
				}, x)),
				currentA < -.05 && [
					440,
					350,
					260,
					170
				].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
					points: `${x - 11},${wireY} ${x + 3},${wireY - 6} ${x + 3},${wireY + 6}`,
					fill: "#93C5FD"
				}, x)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: 18,
					y: wireY - 14,
					width: "16",
					height: "28",
					rx: "4",
					fill: "#1E2433",
					stroke: "#475569"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: 606,
					y: wireY - 14,
					width: "16",
					height: "28",
					rx: "4",
					fill: "#1E2433",
					stroke: "#475569"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
					x: currentA >= 0 ? 544 : 48,
					y: wireY - 14,
					fill: currentA >= 0 ? "#FCD34D" : "#93C5FD",
					fontSize: "11",
					fontFamily: "monospace",
					children: [
						currentA >= 0 ? "I →" : "← I",
						" ",
						format3SF(currentA),
						" A"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
					x: 622,
					y: 24,
					textAnchor: "end",
					fill: noForce ? "#4B5563" : directionSign > 0 ? "#FCD34D" : "#93C5FD",
					fontSize: "13",
					fontFamily: "monospace",
					fontWeight: "700",
					children: ["Force: ", directionLabel]
				})
			]
		})
	});
}
function ElectromagnetismSim({ onBackToHome }) {
	const [mode, setMode] = (0, import_react.useState)("explore");
	const [state, setState] = (0, import_react.useState)(getInitialElectromagnetismState);
	const calculated = computeElectromagnetism(state);
	const setSub = (0, import_react.useCallback)((subMode) => {
		setState((p) => ({
			...p,
			subMode
		}));
	}, []);
	if (mode === "exam") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimHeader, {
			title: "Electromagnetism",
			syllabus: "Syllabus 4.5",
			simNumber: "#06",
			mode,
			onMode: setMode,
			examLabel: "Exam mode (6 questions)",
			onBackToHome
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExamPlayer, {
			title: "Electromagnetism & motor effect",
			paperLabel: "Cambridge IGCSE 0625 · Paper 4",
			questions: generateElectromagnetismExamQuestions(),
			onExit: () => setMode("explore")
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimHeader, {
			title: "Electromagnetism",
			syllabus: "Syllabus 4.5 · F = BIL",
			simNumber: "#06",
			mode,
			onMode: setMode,
			examLabel: "Exam mode (6 questions)",
			onBackToHome
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[3fr_2fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1 self-start rounded-lg border border-border-subtle bg-canvas-elevated p-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubBtn, {
								active: state.subMode === "motor",
								onClick: () => setSub("motor"),
								icon: Zap,
								label: "Motor effect"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubBtn, {
								active: state.subMode === "field",
								onClick: () => setSub("field"),
								icon: Waves,
								label: "Field around a wire"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubBtn, {
								active: state.subMode === "fleming",
								onClick: () => setSub("fleming"),
								icon: Magnet,
								label: "Fleming’s rule"
							})
						]
					}),
					state.subMode === "motor" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotorEffectCanvas, {
						state,
						calculated
					}),
					state.subMode === "field" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MagneticFieldCanvas, {
						state,
						calculated
					}),
					state.subMode === "fleming" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlemingPanel, {
						state,
						calculated
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] text-ink-faint",
						children: "Drag current through zero and watch the force reverse. Length L is the highlighted span inside the field region — that is the L in F = BIL."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ElectromagnetismReadouts, {
					state,
					calculated
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ElectromagnetismControls, {
					state,
					calculated,
					onChangeCurrentA: (currentA) => setState((p) => ({
						...p,
						currentA
					})),
					onChangeBFieldT: (bFieldT) => setState((p) => ({
						...p,
						bFieldT
					})),
					onChangeLengthM: (lengthM) => setState((p) => ({
						...p,
						lengthM
					})),
					onToggleBDir: () => setState((p) => ({
						...p,
						bIntoPage: !p.bIntoPage
					})),
					onApplyPreset: (preset) => setState((p) => ({
						...p,
						currentA: preset.currentA,
						bFieldT: preset.bFieldT,
						lengthM: preset.lengthM
					})),
					onReset: () => setState(getInitialElectromagnetismState())
				})]
			})]
		})]
	});
}
function SubBtn({ active, onClick, icon: Icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold ${active ? "border border-accent/30 bg-surface text-amber-300" : "text-ink-faint hover:text-ink"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }), label]
	});
}
var SIM_LIST = [
	{
		id: "forces",
		view: "forces_sim",
		num: "01",
		title: "Resultant Forces & Motion",
		desc: "Forces on a block, resultant force, Newton's 2nd law (F = ma), and a live velocity–time graph.",
		tags: [
			"Syllabus 1.5.1",
			"Paper 4 & 6",
			"Interactive v–t graph"
		],
		icon: Zap
	},
	{
		id: "moments",
		view: "moments_sim",
		num: "02",
		title: "Principle of Moments",
		desc: "Drag masses on a metre rule, include the rule’s own weight, and see moment = F × d_perp.",
		tags: [
			"Syllabus 1.5.2",
			"Equilibrium",
			"Beam balance"
		],
		icon: Layers
	},
	{
		id: "floating",
		view: "floating_sim",
		num: "03",
		title: "Floating & Sinking",
		desc: "Density, Archimedes’ principle, upthrust, and the fraction of a body that sits below the waterline.",
		tags: [
			"Syllabus 1.5.3",
			"Upthrust",
			"Density"
		],
		icon: Waves
	},
	{
		id: "circuits",
		view: "circuits_sim",
		num: "04",
		title: "Electrical Circuits",
		desc: "Build series and parallel loops, place A and V correctly, and see Ohm’s law as a straight V–I line.",
		tags: [
			"Syllabus 4.2",
			"V = IR",
			"Guided lab"
		],
		icon: Atom
	},
	{
		id: "refraction",
		view: "refraction_sim",
		num: "05",
		title: "Light & Refraction",
		desc: "Snell’s law, refractive index n = sin i / sin r, and total internal reflection with critical angle.",
		tags: [
			"Syllabus 3.2.3",
			"Snell’s law",
			"Ray optics"
		],
		icon: Sparkles
	},
	{
		id: "electromagnetism",
		view: "electromagnetism_sim",
		num: "06",
		title: "Electromagnetism",
		desc: "Field around a current-carrying wire, motor effect, Fleming’s left-hand rule, and F = BIL.",
		tags: [
			"Syllabus 4.5",
			"Motor effect",
			"F = BIL"
		],
		icon: Magnet
	}
];
var SIM_SHORT_NAMES = {
	home: "Simulations directory",
	forces_sim: "Resultant Forces",
	moments_sim: "Principle of Moments",
	floating_sim: "Floating & Sinking",
	circuits_sim: "Electrical Circuits",
	refraction_sim: "Light & Refraction",
	electromagnetism_sim: "Electromagnetism"
};
function App() {
	const [currentView, setCurrentView] = (0, import_react.useState)("home");
	const [dropdownOpen, setDropdownOpen] = (0, import_react.useState)(false);
	const dropdownRef = (0, import_react.useRef)(null);
	const chipRef = (0, import_react.useRef)(null);
	const itemRefs = (0, import_react.useRef)([]);
	(0, import_react.useEffect)(() => {
		function handlePointerDown(e) {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
		}
		document.addEventListener("pointerdown", handlePointerDown);
		return () => document.removeEventListener("pointerdown", handlePointerDown);
	}, []);
	const handleChipKeyDown = (0, import_react.useCallback)((e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			setDropdownOpen((prev) => !prev);
		}
		if (e.key === "Escape") setDropdownOpen(false);
	}, []);
	const isOnSim = currentView !== "home";
	const chipLabel = isOnSim ? `Current: ${SIM_SHORT_NAMES[currentView]}` : "Select simulation";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col overflow-x-hidden bg-canvas text-ink selection:bg-accent/20 selection:text-amber-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-50 flex items-center justify-between border-b border-border-faint bg-canvas-elevated/90 px-4 py-3 backdrop-blur-md sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setCurrentView("home"),
					className: "group flex items-center gap-2.5 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-base font-extrabold text-accent-fg shadow-sm transition-transform group-hover:scale-105",
						children: "S"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base font-extrabold tracking-tight text-ink transition-colors group-hover:text-accent",
								children: "STEMEdge"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded border border-accent/20 bg-chip px-2 py-0.5 font-mono text-[10px] uppercase text-amber-300",
								children: "Cambridge IGCSE"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden font-sans text-[11px] text-ink-muted sm:inline",
							children: "Physics 0625 Interactive Laboratory"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					ref: dropdownRef,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setCurrentView("home"),
						className: `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${currentView === "home" ? "border border-border-subtle bg-chip text-amber-300" : "text-ink-muted hover:bg-muted-bg hover:text-ink"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-3.5 w-3.5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Simulations directory"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sm:hidden",
								children: "Directory"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							ref: chipRef,
							type: "button",
							"aria-haspopup": "listbox",
							"aria-expanded": dropdownOpen,
							onClick: () => setDropdownOpen((prev) => !prev),
							onKeyDown: handleChipKeyDown,
							className: `flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${isOnSim ? "border-amber-400 bg-accent text-accent-fg hover:bg-amber-400" : "border-border-subtle bg-muted-bg text-ink-muted hover:bg-surface"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "h-3.5 w-3.5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "max-w-[160px] truncate",
									children: chipLabel
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-3.5 w-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}` })
							]
						}), dropdownOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							role: "listbox",
							"aria-label": "Select a simulation",
							className: "absolute right-0 top-full z-50 mt-1.5 w-64 overflow-hidden rounded-xl border border-border-subtle bg-canvas-elevated shadow-2xl",
							children: SIM_LIST.map((sim, idx) => {
								const IconComp = sim.icon;
								const isActive = currentView === sim.view;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									ref: (el) => {
										itemRefs.current[idx] = el;
									},
									type: "button",
									role: "option",
									"aria-selected": isActive,
									onClick: () => {
										setCurrentView(sim.view);
										setDropdownOpen(false);
									},
									className: `flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-xs font-medium transition-colors ${isActive ? "border-l-2 border-accent bg-accent/15 text-amber-300" : "border-l-2 border-transparent text-ink-muted hover:bg-muted-bg hover:text-ink"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${isActive ? "bg-accent/20 text-accent" : "bg-muted-bg text-ink-faint"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComp, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block truncate font-semibold leading-none",
											children: [
												sim.num,
												" — ",
												sim.title
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-0.5 block font-mono text-[9px] text-ink-faint",
											children: sim.tags[0]
										})]
									})]
								}, sim.id);
							})
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-3 sm:px-6 sm:py-3.5",
				children: currentView === "forces_sim" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultantForcesSim, { onBackToHome: () => setCurrentView("home") }) : currentView === "moments_sim" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MomentsSim, { onBackToHome: () => setCurrentView("home") }) : currentView === "floating_sim" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingSim, { onBackToHome: () => setCurrentView("home") }) : currentView === "circuits_sim" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircuitsSim, { onBackToHome: () => setCurrentView("home") }) : currentView === "refraction_sim" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefractionSim, { onBackToHome: () => setCurrentView("home") }) : currentView === "electromagnetism_sim" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ElectromagnetismSim, { onBackToHome: () => setCurrentView("home") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Directory, { onOpen: setCurrentView })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "flex flex-col items-center justify-between gap-2 border-t border-border-faint bg-canvas-elevated px-6 py-3 font-mono text-xs text-ink-faint sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "STEMEdge · Cambridge IGCSE Physics (0625)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "SI units · 3 significant figures · g = 9.8 N/kg" })]
			})
		]
	});
}
function Directory({ onOpen }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col justify-between gap-4 rounded-2xl border border-border-subtle bg-surface p-6 sm:flex-row sm:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex max-w-2xl flex-col gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs font-bold uppercase tracking-widest text-accent",
								children: "Cambridge IGCSE (0625)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-ink-faint",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-ink-muted",
								children: "Exam papers 4 & 6 prep"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-extrabold tracking-tight text-ink sm:text-2xl",
						children: "Six interactive Cambridge physics simulations"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-ink-muted",
						children: "Live physical feedback, graphs that update with the apparatus, and structured Paper 4 calculations with SI units and 3 s.f. mark schemes."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 flex-col items-start gap-2 sm:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onOpen("forces_sim"),
					className: "flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-accent-fg shadow-md transition-colors hover:bg-amber-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4" }), "Launch simulation #1"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[11px] text-ink-faint",
					children: "g = 9.8 N/kg · SI units"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
			children: SIM_LIST.map((sim) => {
				const IconComponent = sim.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onOpen(sim.view),
					className: "flex flex-col justify-between rounded-xl border border-accent/40 bg-surface p-5 text-left transition-colors hover:border-accent/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs font-bold text-ink-faint",
									children: sim.num
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded border border-accent/30 bg-accent/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-300",
									children: "Explore + exam"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-bold text-ink",
									children: sim.title
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-relaxed text-ink-muted",
								children: sim.desc
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-between border-t border-border-faint pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: sim.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded border border-border-faint bg-canvas-elevated px-1.5 py-0.5 font-mono text-[10px] text-ink-muted",
								children: tag
							}, tag))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 text-xs font-semibold text-accent",
							children: ["Open", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })]
						})]
					})]
				}, sim.id);
			})
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {});
}
//#endregion
export { Home as component };
