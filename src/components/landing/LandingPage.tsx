import { useEffect, useRef, useState, type RefObject } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  LayoutTemplate,
  FileDown,
  GripVertical,
  Save,
  Keyboard,
  ArrowRight,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import "./landing.css";

function useInView<T extends HTMLElement>(
  threshold = 0.15,
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Writing",
    description:
      "Let AI help you craft compelling bullet points and summaries that stand out to recruiters.",
  },
  {
    icon: LayoutTemplate,
    title: "Templates",
    description:
      "Choose from professionally designed templates that pass ATS screening systems.",
  },
  {
    icon: FileDown,
    title: "PDF Export",
    description:
      "Download your resume as a polished PDF ready to send to employers instantly.",
  },
  {
    icon: GripVertical,
    title: "Drag & Drop",
    description:
      "Rearrange sections effortlessly with intuitive drag-and-drop editing controls.",
  },
  {
    icon: Save,
    title: "Autosave",
    description:
      "Never lose your work — every change is saved automatically in real time.",
  },
  {
    icon: Keyboard,
    title: "Keyboard Shortcuts",
    description:
      "Speed through your resume with power-user keyboard shortcuts for every action.",
  },
] as const;

const STEPS = [
  {
    number: "1",
    title: "Pick a template",
    description:
      "Choose from our collection of ATS-friendly, professional templates.",
  },
  {
    number: "2",
    title: "Fill in your details",
    description:
      "Add your experience, skills, and education with AI-powered suggestions.",
  },
  {
    number: "3",
    title: "Download & apply",
    description: "Export a pixel-perfect PDF and start landing interviews.",
  },
] as const;

function CrayonCircle({
  className,
  animate,
}: {
  className?: string;
  animate?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 340 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {/*
        Single continuous stroke: starts tight at top-left ("gets"),
        expands wider on the right ("hired"), loops back and
        overshoots past the start so the lines criss-cross.
      */}
      <path
        d="M 60 42
           C 52 28, 38 16, 60 10
           C 88 2, 130 -2, 190 4
           C 250 8, 310 18, 326 40
           C 338 56, 330 78, 300 90
           C 264 102, 200 108, 130 100
           C 68 94, 20 80, 14 58
           C 10 42, 28 28, 58 24
           C 82 20, 110 22, 128 28"
        stroke="#f47067"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
        strokeDasharray="920"
        strokeDashoffset={animate ? "0" : "920"}
        style={{ transition: "stroke-dashoffset 1.1s ease-out 0.5s" }}
      />
    </svg>
  );
}

function Star({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      style={{
        animation: `landing-twinkle 3s ease-in-out ${delay}s infinite`,
      }}
    >
      <path
        d="M12 2 L14 9 L21 9 L15.5 13.5 L17.5 21 L12 16.5 L6.5 21 L8.5 13.5 L3 9 L10 9 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="currentColor"
      />
    </svg>
  );
}

const STEP_DURATION = 3000;

const SKETCHY_CIRCLES = [
  "M 30 4 C 14 5, 3 14, 4 30 C 5 46, 16 58, 32 58 C 48 57, 59 46, 58 30 C 57 14, 46 4, 30 4",
  "M 32 3 C 16 2, 2 13, 3 30 C 4 47, 15 59, 31 59 C 47 58, 58 47, 59 31 C 60 15, 48 3, 32 3",
  "M 29 5 C 12 7, 4 16, 5 31 C 6 46, 17 57, 33 57 C 49 56, 58 45, 57 29 C 56 13, 45 4, 29 5",
];

const SKETCHY_CONNECTORS = [
  "M 2 12 C 14 6, 30 16, 46 10 C 54 7, 60 9, 68 11",
  "M 2 12 C 16 8, 32 18, 48 10 C 56 6, 62 10, 68 12",
];

function StepsSection() {
  const [stepsRef, stepsVisible] = useInView<HTMLDivElement>(0.1);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!stepsVisible) return;
    const id = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, STEP_DURATION);
    return () => clearInterval(id);
  }, [stepsVisible]);

  return (
    <section className="relative px-6 py-20">
      <div className="landing-pattern-cross pointer-events-none absolute inset-0 text-indigo-600/4 dark:text-indigo-400/6" />
      <div ref={stepsRef} className="relative mx-auto max-w-4xl">
        <div
          className="text-center"
          style={{
            opacity: stepsVisible ? 1 : 0,
            transform: stepsVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2
            className="text-3xl font-bold text-gray-900 dark:text-gray-100"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Three simple steps
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            From blank page to polished resume in minutes.
          </p>
        </div>

        <div className="mt-14 flex flex-col items-center gap-10 sm:flex-row sm:items-start">
          {STEPS.map((step, index) => {
            const isActive = stepsVisible && activeStep === index;
            const isPast = stepsVisible && activeStep > index;
            const reached = isActive || isPast;

            return (
              <>
                <div
                  key={step.number}
                  className="flex flex-1 items-start gap-4 sm:flex-col sm:items-center sm:text-center"
                  style={{
                    opacity: stepsVisible ? 1 : 0,
                    transform: stepsVisible
                      ? "translateY(0)"
                      : "translateY(24px)",
                    transition: `opacity 0.5s ease-out ${0.15 + index * 0.2}s, transform 0.5s ease-out ${0.15 + index * 0.2}s`,
                  }}
                >
                  <div
                    className="relative shrink-0 h-16 w-16"
                    style={{
                      transform: isActive ? "scale(1.1)" : "scale(1)",
                      transition: "transform 0.4s ease-out",
                    }}
                  >
                    <svg
                      viewBox="0 0 62 62"
                      className="absolute inset-0 h-full w-full"
                      aria-hidden="true"
                    >
                      {/* crayon-style scribbled fill — uneven radial patches */}
                      <ellipse
                        cx="31"
                        cy="31"
                        rx="22"
                        ry="20"
                        className={`transition-all duration-500 ${
                          reached
                            ? "fill-indigo-500/80 dark:fill-indigo-400/80"
                            : "fill-indigo-100/60 dark:fill-indigo-900/40"
                        }`}
                      />
                      <ellipse
                        cx="28"
                        cy="29"
                        rx="18"
                        ry="16"
                        className={`transition-all duration-500 ${
                          reached
                            ? "fill-indigo-600/50 dark:fill-indigo-500/50"
                            : "fill-indigo-100/30 dark:fill-indigo-900/20"
                        }`}
                      />
                      <ellipse
                        cx="34"
                        cy="33"
                        rx="15"
                        ry="13"
                        className={`transition-all duration-500 ${
                          reached
                            ? "fill-indigo-500/40 dark:fill-indigo-400/40"
                            : "fill-indigo-50/40 dark:fill-indigo-950/30"
                        }`}
                      />
                      {/* wobbly hand-drawn outline */}
                      <path
                        d={SKETCHY_CIRCLES[index]}
                        fill="none"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        className={`transition-all duration-500 ${
                          reached
                            ? "stroke-indigo-700 dark:stroke-indigo-300"
                            : "stroke-indigo-300 dark:stroke-indigo-700"
                        }`}
                      />
                    </svg>
                    <span
                      className={`absolute inset-0 flex items-center justify-center text-2xl font-bold transition-colors duration-500 ${
                        reached
                          ? "text-white dark:text-gray-900"
                          : "text-indigo-600 dark:text-indigo-400"
                      }`}
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      {step.number}
                    </span>
                  </div>

                  <div
                    className="sm:mt-4 transition-opacity duration-500"
                    style={{ opacity: reached ? 1 : 0.45 }}
                  >
                    <h3
                      className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>

                {index < STEPS.length - 1 && (
                  <svg
                    viewBox="0 0 70 24"
                    className="hidden h-6 w-20 shrink-0 sm:mt-5 sm:block"
                    aria-hidden="true"
                  >
                    <path
                      d={SKETCHY_CONNECTORS[index]}
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className={`transition-all duration-500 ${
                        isPast
                          ? "stroke-indigo-500 dark:stroke-indigo-400"
                          : "stroke-gray-300 dark:stroke-gray-600"
                      }`}
                    />
                    <path
                      d="M 62 6 L 70 11.5 L 62 17"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-all duration-500 ${
                        isPast
                          ? "stroke-indigo-500 dark:stroke-indigo-400"
                          : "stroke-gray-300 dark:stroke-gray-600"
                      }`}
                    />
                  </svg>
                )}
              </>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function LandingPage() {
  const [heroRef, heroVisible] = useInView<HTMLDivElement>(0.1);
  const [featuresRef, featuresVisible] = useInView<HTMLDivElement>(0.1);
  const [ctaRef, ctaVisible] = useInView<HTMLDivElement>(0.15);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 dark:bg-indigo-500">
              <FileText className="h-4.5 w-4.5 text-white dark:text-gray-900" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Resume Builder
            </span>
          </Link>
          <ThemeToggle size="sm" />
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-20 pt-24 sm:pb-28 sm:pt-32">
        <div className="landing-pattern-diagonal pointer-events-none absolute inset-0 text-gray-900/3 dark:text-white/3" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Star
            className="absolute left-[10%] top-16 h-5 w-5 text-amber-400 dark:text-amber-300"
            delay={0}
          />
          <Star
            className="absolute right-[15%] top-28 h-4 w-4 text-indigo-400 dark:text-indigo-300"
            delay={1}
          />
          <Star
            className="absolute bottom-20 left-[20%] h-3 w-3 text-pink-400 dark:text-pink-300"
            delay={2}
          />
          <Star
            className="absolute right-[8%] bottom-32 h-3.5 w-3.5 text-amber-300 dark:text-amber-400"
            delay={1.5}
          />
          <Star
            className="absolute left-[35%] top-10 h-3 w-3 text-indigo-300 dark:text-indigo-500"
            delay={0.5}
          />
        </div>

        <div
          ref={heroRef}
          className="mx-auto max-w-3xl text-center"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <h1
            className="text-5xl leading-tight font-bold text-gray-900 sm:text-6xl sm:leading-tight dark:text-gray-100"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Build a resume that{" "}
            <span className="relative inline-block px-2 py-1">
              <span className="relative z-10 text-indigo-600 dark:text-indigo-400">
                gets you hired
              </span>
              <CrayonCircle
                className="absolute -left-4 -top-3 -right-4 -bottom-3 h-[calc(100%+24px)] w-[calc(100%+24px)] dark:brightness-125 dark:saturate-150"
                animate={heroVisible}
              />
            </span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-400"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(16px)",
              transition:
                "opacity 0.7s ease-out 0.2s, transform 0.7s ease-out 0.2s",
            }}
          >
            Create stunning, ATS-friendly resumes in minutes — not hours.
            AI-powered writing, beautiful templates, and one-click PDF export.
          </p>
          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(16px)",
              transition:
                "opacity 0.7s ease-out 0.4s, transform 0.7s ease-out 0.4s",
            }}
          >
            <Link to="/signup">
              <Button
                size="lg"
                className="group/btn gap-2 cursor-pointer text-base"
              >
                Get Started — it's free
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white px-6 py-20 dark:bg-gray-900/50">
        <div ref={featuresRef} className="mx-auto max-w-6xl">
          <div
            className="text-center"
            style={{
              opacity: featuresVisible ? 1 : 0,
              transform: featuresVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
            }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Everything you need
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Powerful features wrapped in a simple, delightful experience.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="group rounded-xl border-2 border-dashed border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-gray-700 dark:hover:border-indigo-600"
                style={{
                  opacity: featuresVisible ? 1 : 0,
                  transform: featuresVisible
                    ? "translateY(0)"
                    : "translateY(30px)",
                  transition: `opacity 0.5s ease-out ${0.15 + i * 0.1}s, transform 0.5s ease-out ${0.15 + i * 0.1}s`,
                }}
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950 dark:text-indigo-400 dark:group-hover:bg-indigo-500 dark:group-hover:text-gray-900">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <StepsSection />

      {/* CTA */}
      <section className="bg-indigo-600 px-6 py-20 dark:bg-indigo-700">
        <div
          ref={ctaRef}
          className="mx-auto max-w-2xl text-center"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible
              ? "translateY(0) scale(1)"
              : "translateY(20px) scale(0.97)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2
            className="text-3xl font-bold text-white sm:text-4xl"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Ready to build your resume?
          </h2>
          <p className="mt-4 text-indigo-100">
            Join thousands of job seekers who landed their dream role with a
            resume built here.
          </p>
          <Link to="/signup" className="mt-8 inline-block">
            <Button
              size="lg"
              variant="secondary"
              className="group/cta gap-2 cursor-pointer text-base font-semibold transition-shadow duration-300 hover:shadow-xl"
            >
              Get Started — it's free
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1.5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
