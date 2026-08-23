import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  ArrowUp,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  DemoPanel,
  DemoPanelFooter,
  DemoPanelHeader,
  DemoSetting,
  DemoStepDetail,
} from "@/components/demo/DemoPanel";
import {
  DemoShell,
  DemoStage,
} from "@/components/demo/DemoShell";
import { DemoStepList } from "@/components/demo/DemoStepList";
import { Button, IconButton } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import "./interaction-anatomy-lab.css";

const LESSON_ORDER = ["stage", "shell", "view", "state", "events", "motion"] as const;
const SAMPLE_PROMPT = "Why does the sky turn orange at sunset?";
const SAMPLE_ANSWER =
  "At sunset, sunlight travels through more atmosphere. Blue light scatters away, while red and orange light keeps traveling toward your eyes.";

type Phase = "idle" | "drafting" | "thinking" | "answered";
type LessonKey = (typeof LESSON_ORDER)[number];
type LessonTarget = "stage" | "shell" | "view" | "state" | "events" | "motion";
type Message = { role: "user" | "assistant"; text: string };
type CalloutPosition = "top-start" | "top-end" | "middle-start" | "bottom-start" | "bottom-end";

type Lesson = {
  label: string;
  title: string;
  text: string;
  target: LessonTarget;
  targetTitle: string;
  calloutText: string;
  callout: CalloutPosition;
  phase: Phase;
  pad: number;
  texture: { x: number; y: number };
};

const LESSONS: Record<LessonKey, Lesson> = {
  stage: {
    label: "Demo area",
    title: "The demo area keeps the example contained.",
    text: "It gives the phone and its annotation one clear boundary.",
    target: "stage",
    targetTitle: "Demo area",
    calloutText: "Contains the complete example.",
    callout: "top-end",
    phase: "idle",
    pad: -12,
    texture: { x: -6, y: -5 },
  },
  shell: {
    label: "Device",
    title: "The device frame creates one surface.",
    text: "It keeps the screen and controls inside the phone shape.",
    target: "shell",
    targetTitle: "Device frame",
    calloutText: "Keeps screen content inside the phone.",
    callout: "top-start",
    phase: "idle",
    pad: 5,
    texture: { x: 1, y: -6 },
  },
  view: {
    label: "Screen",
    title: "The screen renders the conversation.",
    text: "Messages, empty states and controls are ordinary interface elements.",
    target: "view",
    targetTitle: "Chat screen",
    calloutText: "Renders the current conversation.",
    callout: "middle-start",
    phase: "answered",
    pad: 4,
    texture: { x: 6, y: -4 },
  },
  state: {
    label: "State",
    title: "State remembers what is happening.",
    text: "It keeps the draft, messages and current response together so the screen can update.",
    target: "state",
    targetTitle: "Interface state",
    calloutText: "Keeps the interface in sync.",
    callout: "top-end",
    phase: "thinking",
    pad: 5,
    texture: { x: -4, y: 2 },
  },
  events: {
    label: "Input",
    title: "Input turns intent into an action.",
    text: "Typing updates the draft; sending moves the interface to its next state.",
    target: "events",
    targetTitle: "Message field",
    calloutText: "Turns typed text into a message.",
    callout: "bottom-start",
    phase: "drafting",
    pad: 5,
    texture: { x: 1, y: 6 },
  },
  motion: {
    label: "Feedback",
    title: "Feedback makes waiting understandable.",
    text: "The thinking indicator appears while the reply is prepared.",
    target: "motion",
    targetTitle: "Reply feedback",
    calloutText: "Shows that a response is in progress.",
    callout: "bottom-end",
    phase: "thinking",
    pad: 7,
    texture: { x: 6, y: 5 },
  },
};

const LESSON_ITEMS = LESSON_ORDER.map((value) => ({
  value,
  label: LESSONS[value].label,
}));

function presetForPhase(phase: Phase): { draft: string; messages: Message[] } {
  if (phase === "drafting") return { draft: SAMPLE_PROMPT, messages: [] };
  if (phase === "thinking") {
    return { draft: "", messages: [{ role: "user", text: SAMPLE_PROMPT }] };
  }
  if (phase === "answered") {
    return {
      draft: "",
      messages: [
        { role: "user", text: SAMPLE_PROMPT },
        { role: "assistant", text: SAMPLE_ANSWER },
      ],
    };
  }
  return { draft: "", messages: [] };
}

function replyFor(prompt: string) {
  const normalized = prompt.toLowerCase();
  if (normalized.includes("sunset") || normalized.includes("sky turn orange")) {
    return SAMPLE_ANSWER;
  }
  if (normalized.includes("gravity")) {
    return "Gravity is the pull between objects with mass. Earth is so large that its pull keeps us on the ground and the Moon in orbit.";
  }
  return "This prototype uses a prepared reply. A real chatbot would send your message to an AI model and show its answer here.";
}

type AnnotationGeometry = {
  stageWidth: number;
  stageHeight: number;
  ring: { x: number; y: number; width: number; height: number };
  radius: string;
  callout: { x: number; y: number };
  path: string;
  dot: { x: number; y: number };
};

export default function InteractionAnatomyLab() {
  const stageRef = useRef<HTMLDivElement>(null);
  const calloutRef = useRef<HTMLDivElement>(null);
  const chatViewRef = useRef<HTMLDivElement>(null);
  const responseTimer = useRef<number | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeLesson, setActiveLesson] = useState<LessonKey>("stage");
  const [annotationsVisible, setAnnotationsVisible] = useState(true);
  const [annotation, setAnnotation] = useState<AnnotationGeometry | null>(null);

  const clearResponseTimer = useCallback(() => {
    if (responseTimer.current !== null) window.clearTimeout(responseTimer.current);
    responseTimer.current = null;
  }, []);

  const applyPreset = useCallback(
    (nextPhase: Phase) => {
      clearResponseTimer();
      const preset = presetForPhase(nextPhase);
      setPhase(nextPhase);
      setDraft(preset.draft);
      setMessages(preset.messages);
    },
    [clearResponseTimer],
  );

  const resetDemo = useCallback(() => {
    applyPreset("idle");
  }, [applyPreset]);

  useEffect(() => {
    return () => clearResponseTimer();
  }, [clearResponseTimer]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (chatViewRef.current) chatViewRef.current.scrollTop = chatViewRef.current.scrollHeight;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages, phase]);

  useLayoutEffect(() => {
    if (!annotationsVisible) return;
    const stage = stageRef.current;
    const callout = calloutRef.current;
    if (!stage || !callout) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const lesson = LESSONS[activeLesson];
      const target =
        lesson.target === "stage"
          ? stage
          : stage.querySelector<HTMLElement>(`[data-lab-target="${lesson.target}"]`);
      if (!target) return;

      const stageRect = stage.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      if (!targetRect.width || !targetRect.height) return;
      const targetRadius = window.getComputedStyle(target).borderRadius;

      const ring = {
        x: targetRect.left - stageRect.left - lesson.pad,
        y: targetRect.top - stageRect.top - lesson.pad,
        width: targetRect.width + lesson.pad * 2,
        height: targetRect.height + lesson.pad * 2,
      };
      const boxWidth = Math.min(callout.offsetWidth || 180, stageRect.width - 32);
      const boxHeight = callout.offsetHeight || 88;
      const inset = Math.min(32, stageRect.width * 0.05);
      const points: Record<CalloutPosition, { x: number; y: number }> = {
        "top-start": { x: inset, y: 88 },
        "top-end": { x: stageRect.width - boxWidth - inset, y: 80 },
        "middle-start": { x: inset, y: stageRect.height * 0.42 },
        "bottom-start": { x: inset, y: stageRect.height - boxHeight - 104 },
        "bottom-end": {
          x: stageRect.width - boxWidth - inset,
          y: stageRect.height - boxHeight - 112,
        },
      };
      const point = points[lesson.callout];
      const center = { x: point.x + boxWidth / 2, y: point.y + boxHeight / 2 };
      const ringEnd = { x: ring.x + ring.width, y: ring.y + ring.height };
      const dot = {
        x: center.x < ring.x ? ring.x : center.x > ringEnd.x ? ringEnd.x : center.x,
        y: center.y < ring.y ? ring.y : center.y > ringEnd.y ? ringEnd.y : center.y,
      };
      const start = {
        x: dot.x < center.x ? point.x : point.x + boxWidth,
        y: center.y,
      };
      const c1 = start.x + (dot.x - start.x) * 0.42;
      const c2 = start.x + (dot.x - start.x) * 0.76;

      setAnnotation({
        stageWidth: stageRect.width,
        stageHeight: stageRect.height,
        ring,
        radius:
          targetRadius && targetRadius !== "0px"
            ? targetRadius
            : "var(--radius-control)",
        callout: point,
        path: `M ${start.x} ${start.y} C ${c1} ${start.y}, ${c2} ${dot.y}, ${dot.x} ${dot.y}`,
        dot,
      });
    };
    const queueMeasure = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };

    queueMeasure();
    const observer = new ResizeObserver(queueMeasure);
    observer.observe(stage);
    observer.observe(callout);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [activeLesson, annotationsVisible, messages.length, phase]);

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    const prompt = draft.trim();
    if (!prompt || phase === "thinking") return;
    clearResponseTimer();
    setMessages((current) => [...current, { role: "user", text: prompt }]);
    setDraft("");
    setPhase("thinking");
    responseTimer.current = window.setTimeout(() => {
      setMessages((current) => [...current, { role: "assistant", text: replyFor(prompt) }]);
      setPhase("answered");
      responseTimer.current = null;
    }, 950);
  };

  const handleDraft = (value: string) => {
    setDraft(value);
    if (phase !== "thinking") {
      setPhase(value ? "drafting" : messages.length ? "answered" : "idle");
    }
  };

  const selectLesson = (key: LessonKey) => {
    setActiveLesson(key);
    applyPreset(LESSONS[key].phase);
  };

  const lessonIndex = LESSON_ORDER.indexOf(activeLesson);
  const lesson = LESSONS[activeLesson];
  const nextLesson = LESSON_ORDER[(lessonIndex + 1) % LESSON_ORDER.length];
  const previousLesson = lessonIndex > 0 ? LESSON_ORDER[lessonIndex - 1] : null;
  const textureTransform = `translate3d(${lesson.texture.x}%, ${lesson.texture.y}%, 0) scale(1.08)`;

  return (
    <DemoShell
      className="interaction-anatomy"
      aria-label="Interactive interface anatomy lab"
    >
      <DemoStage
        className="interaction-anatomy__stage"
        ref={stageRef}
        data-lab-target="stage"
      >
        <div
          className="interaction-anatomy__texture"
          style={{ transform: textureTransform }}
          aria-hidden="true"
        />

        <div className="interaction-anatomy__phone-wrap">
          <article
            className="interaction-anatomy__phone"
            data-lab-target="shell"
            aria-label="Interactive assistant phone demo"
          >
            <div className="interaction-anatomy__phone-view" data-lab-target="state">
              <header className="interaction-anatomy__app-bar">
                <strong>Assistant</strong>
                <Button
                  className="interaction-anatomy__reset-button"
                  variant="secondary"
                  onClick={resetDemo}
                >
                  <RotateCcw aria-hidden="true" />
                  Reset
                </Button>
              </header>

              <div
                className="interaction-anatomy__chat"
                ref={chatViewRef}
                data-lab-target="view"
              >
                {messages.length === 0 && phase !== "thinking" && (
                  <div className="interaction-anatomy__empty-state">
                    <Sparkles aria-hidden="true" />
                    <strong>What can I help with?</strong>
                    <p>Type a message to see the interface respond.</p>
                  </div>
                )}
                <div className="interaction-anatomy__messages">
                  {messages.map((message, index) => (
                    <div
                      className={`interaction-anatomy__message interaction-anatomy__message--${message.role}`}
                      key={`${message.role}-${index}-${message.text}`}
                    >
                      {message.role === "assistant" && <span>Assistant</span>}
                      {message.text}
                    </div>
                  ))}
                </div>
                {phase === "thinking" && (
                  <div
                    className="interaction-anatomy__thinking"
                    data-lab-target="motion"
                    aria-label="Assistant is thinking"
                  >
                    <i /><i /><i />
                  </div>
                )}
              </div>

              <div className="interaction-anatomy__composer-shell">
                <form
                  className="interaction-anatomy__composer"
                  data-lab-target="events"
                  onSubmit={sendMessage}
                >
                  <input
                    type="text"
                    autoComplete="off"
                    aria-label="Message Assistant"
                    placeholder={phase === "thinking" ? "Assistant is thinking" : "Ask about sunsets…"}
                    value={draft}
                    disabled={phase === "thinking"}
                    onChange={(event) => handleDraft(event.target.value)}
                  />
                  <IconButton
                    className="interaction-anatomy__send-button"
                    label="Send message"
                    type="submit"
                    variant="primary"
                    disabled={phase === "thinking" || !draft.trim()}
                  >
                    <ArrowUp aria-hidden="true" />
                  </IconButton>
                </form>
              </div>
            </div>
            <div className="interaction-anatomy__home-indicator" aria-hidden="true" />
          </article>
        </div>

        <div
          className="interaction-anatomy__annotation"
          data-visible={annotationsVisible}
          aria-hidden="true"
        >
          {annotation && (
            <>
              <div
                className="interaction-anatomy__focus-ring"
                style={{
                  insetInlineStart: annotation.ring.x,
                  top: annotation.ring.y,
                  width: annotation.ring.width,
                  height: annotation.ring.height,
                  borderRadius: annotation.radius,
                }}
              />
              <svg
                className="interaction-anatomy__connector"
                viewBox={`0 0 ${annotation.stageWidth} ${annotation.stageHeight}`}
                preserveAspectRatio="none"
              >
                <path d={annotation.path} />
                <circle cx={annotation.dot.x} cy={annotation.dot.y} r="4" />
              </svg>
            </>
          )}
          <div
            className="interaction-anatomy__callout"
            ref={calloutRef}
            style={annotation ? { insetInlineStart: annotation.callout.x, top: annotation.callout.y } : undefined}
          >
            <strong>{lesson.targetTitle}</strong>
            <span>{lesson.calloutText}</span>
          </div>
        </div>
      </DemoStage>

      <DemoPanel
        className="interaction-anatomy__guide"
        aria-label="Explore the interface"
      >
        <DemoPanelHeader
          title="Explore the interface"
          description="Choose a part to see what it does. The phone updates to show it in context."
          current={lessonIndex + 1}
          total={LESSON_ORDER.length}
        />

        <DemoStepList
          label="Interface parts"
          value={activeLesson}
          items={LESSON_ITEMS}
          detailId="interaction-anatomy-step-detail"
          onValueChange={selectLesson}
        />

        <DemoStepDetail
          id="interaction-anatomy-step-detail"
          title={lesson.title}
        >
          {lesson.text}
        </DemoStepDetail>

        <DemoSetting
          label="Show highlight"
          htmlFor="interaction-anatomy-highlight"
          control={
            <Switch
              id="interaction-anatomy-highlight"
              checked={annotationsVisible}
              onCheckedChange={setAnnotationsVisible}
            />
          }
        />

        <DemoPanelFooter>
          <Button
            variant="quiet"
            disabled={!previousLesson}
            onClick={() => previousLesson && selectLesson(previousLesson)}
          >
            Previous
          </Button>
          <Button variant="secondary" onClick={() => selectLesson(nextLesson)}>
            {lessonIndex === LESSON_ORDER.length - 1
              ? "Start again"
              : `Next: ${LESSONS[nextLesson].label}`}
          </Button>
        </DemoPanelFooter>
      </DemoPanel>
    </DemoShell>
  );
}
