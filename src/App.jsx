import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Leaf,
  ArrowRight,
  ArrowLeft,
  Star,
  Menu,
  X,
  UserRound,
  Sparkles,
  Trophy,
  CheckCircle2,
  Sprout,
  Sun,
  Moon,
  Heart,
  Clock,
  ShieldCheck,
  RotateCcw,
  Compass,
  HelpCircle,
  FileText,
  Mail,
  Lock,
  MessageSquare
} from "lucide-react";
import "./styles.css";

const STORAGE_KEY = "ayurome-game-progress-v5";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const initialData = {
  avatar: "Female",
  name: "",
  age: "",
  phone: "",
  email: "",
  wellnessNotes: "",
  welcomeName: "Explorer",
  goal: "General Wellness",
  profileComplete: false,
  quizComplete: false,
  rollOnUnlocked: false,
  level3Complete: false,
  answers: {},
  dosha: "Vata",
  routine: [],
  moods: [],
};

const frequencyOptions = [
  { label: "A. Always", detail: "Daily / severe", points: 4 },
  { label: "B. Often", detail: "3–4 times per week / moderate", points: 3 },
  { label: "C. Sometimes", detail: "1–2 times per week / mild", points: 2 },
  { label: "D. Rarely", detail: "Occasional / minimal impact", points: 1 },
  { label: "E. Never", detail: "Absence of symptom", points: 0 },
];

const questions = [
  { id: 1, question: "I experience sudden waves of nervousness or internal trembling when faced with unexpected deadlines or stress.", dosha: "Vata", clinicalMapping: "Vata Anisthitatva & Chittadravata (Charaka Sutra 20)" },
  { id: 2, question: "When things do not go as planned or people are inefficient, I experience a sharp surge of mental frustration or impatience.", dosha: "Pitta", clinicalMapping: "Pitta Krodha & Amarsa (Charaka Sharira 4)" },
  { id: 3, question: "When I encounter heavy stress or emotional burden, I tend to emotionally withdraw, shut down, or isolate myself.", dosha: "Kapha", clinicalMapping: "Kapha Vishamada & Avarana (Sushruta Sharira 4)" },
  { id: 4, question: "My mind feels constantly on overdrive, making it difficult to switch off and relax at the end of the day.", dosha: "Vata", clinicalMapping: "Manovaha Srotas Chalatva" },
  { id: 5, question: "Under stress, I become overly critical, sharp-tongued, or intolerant of delays caused by colleagues or family members.", dosha: "Pitta", clinicalMapping: "Teekshna & Krodha Dominance" },
  { id: 6, question: "Stress makes me feel mentally weighed down, foggy, and sluggish, robbing me of my initiative to start tasks.", dosha: "Kapha", clinicalMapping: "Tamas & Guruta Impact" },
  { id: 7, question: "Under anxiety, my thoughts jump rapidly from one issue to another without finding a clear resolution.", dosha: "Vata", clinicalMapping: "Anavasthitatva (Cognitive Instability)" },
  { id: 8, question: "My stress manifests physically as facial heat, jaw-clenching, tight shoulders, or burning/strained eyes.", dosha: "Pitta", clinicalMapping: "Pitta Daha & Santapa" },
  { id: 9, question: "Under intense emotional pressure, I respond with extreme detachment, procrastination, or heavy fatigue rather than panic.", dosha: "Kapha", clinicalMapping: "Dhairya/Manda Deficit" },
  { id: 10, question: "When anxious or stressed, I experience light, broken sleep or wake up feeling unrefreshed with racing thoughts.", dosha: "Vata", clinicalMapping: "Vataja Nidra Nasha" },
  { id: 11, question: "I push myself so hard to achieve perfection and meet targets under pressure that I experience sudden emotional burnout.", dosha: "Pitta", clinicalMapping: "Pitta Burnout & Exhaustion" },
  { id: 12, question: "When overwhelmed, I feel a strong physical resistance to moving or taking action, preferring to stay inert.", dosha: "Kapha", clinicalMapping: "Kaphaja Ksma / Alasya" },
  { id: 13, question: "During high-stress phases, I notice physical signs like twitching eyelids, dry skin/lips, or sudden coldness in extremities.", dosha: "Vata", clinicalMapping: "Vata Rukshata & Spandana" },
  { id: 14, question: "High pressure or unresolved anger quickly affects my digestion, causing acidity, heartburn, or hyper-acidity flares.", dosha: "Pitta", clinicalMapping: "Agni Vaitathya & Amlapitta" },
  { id: 15, question: "When faced with conflict, I tend to suppress my emotions and hold onto quiet resentment or emotional heaviness long-term.", dosha: "Kapha", clinicalMapping: "Sthirata & Mental Retention" },
  { id: 16, question: "I feel deeply unsettled by unexpected changes in daily routine, sudden travel, or noisy, unstructured environments.", dosha: "Vata", clinicalMapping: "Vayu Sensitivity" },
  { id: 17, question: "Even during downtime or weekends, I find it extremely hard to stop thinking about work goals, targets, or pending tasks.", dosha: "Pitta", clinicalMapping: "Ekagrata / Excessive Work Drive" },
  { id: 18, question: "Under prolonged stress, my body feels physically heavy, bloated, or prone to excessive daytime sleepiness.", dosha: "Kapha", clinicalMapping: "Slakshnata & Gaurava" },
  { id: 19, question: "I frequently feel unexplainable apprehension, dread, or fear about what might go wrong in future scenarios.", dosha: "Vata", clinicalMapping: "Vata Visada & Anxiety" },
  { id: 20, question: "When under pressure, I become fiercely competitive and feel an intense need to stay in absolute control of the situation.", dosha: "Pitta", clinicalMapping: "Tejas & Control Drive" },
  { id: 21, question: "In stressful times, I seek comfort in heavy eating, passive screen consumption, or sleeping extra hours to escape load.", dosha: "Kapha", clinicalMapping: "Kaphaja Comfort Seeking" },
  { id: 22, question: "Stress significantly impairs my concentration, making me indecisive and second-guessing simple daily choices.", dosha: "Vata", clinicalMapping: "Asthira Dhi (Cognitive Instability)" },
  { id: 23, question: "I get easily irritated when my daily schedule, quiet work environment, or personal standards are disrupted.", dosha: "Pitta", clinicalMapping: "Pittaja Irritability / Amarsha" },
  { id: 24, question: "When facing complex challenges, my decision-making process becomes exceedingly slow because I feel mentally clouded.", dosha: "Kapha", clinicalMapping: "Snigdha & Manda Guna" },
  { id: 25, question: "High mental stress quickly drains my stamina, leaving me feeling physically and emotionally depleted all of a sudden.", dosha: "Vata", clinicalMapping: "Vataja Fatigue / Shrama" },
  { id: 26, question: "During intense workload or pressure, I feel excessive body warmth, hot flushes, or increased sweating in palms/feet.", dosha: "Pitta", clinicalMapping: "Pitta Ushna & Sveda" },
  { id: 27, question: "I struggle to break out of comfort zones or existing routines when new workplace demands or changes arise.", dosha: "Kapha", clinicalMapping: "Dhriti Manda & Inertia" },
  { id: 28, question: "Anxiety or emotional stress causes rapid heart beats (palpitations) or a fluttering sensation in my chest.", dosha: "Vata", clinicalMapping: "Hrdrava / Chittadravata" },
  { id: 29, question: "I get frustrated easily when people around me fail to meet my standards of speed, efficiency, or accuracy.", dosha: "Pitta", clinicalMapping: "Perfectionism & Intolerance" },
  { id: 30, question: "When stressed, I experience a deep feeling of emotional inertia, feeling stuck or unable to bounce back quickly.", dosha: "Kapha", clinicalMapping: "Kaphaja Vishada & Depression" },
];

const doshaDetails = {
  Vata: {
    subtitle: "The Creative Explorer",
    element: "Air + Space",
    tags: ["Creative", "Flexible", "Energetic"],
    description: "Your answers lean toward Vata, traditionally associated with movement, creativity and change.",
    suggestion: "Explore grounding activities, regular rest and gentle daily routines.",
    rollOn: "Vata Guardian",
    benefits: [
      "Ease anxiety and overthinking",
      "Soothe hyperactivity",
      "Promote focus and mental clarity",
    ],
    notes: ["Sweet Orange", "Lavender", "Frankincense"],
    ingredients: [
      "Carrier oil: Sweet Almond",
      "Essential oils: Sweet Orange, Lavender & Frankincense",
      "Herbal extract: Jatamansi",
    ],
    directions: "Roll onto wrists, temples, neck or pulse points. Inhale gently for a few breaths. Follow the final product label for frequency and application guidance.",
    manufacturing: ["Mfg: Oct 2026", "Best before: 12 months", "Storage: Store in a cool, dry place away from direct sunlight"],
    image: "/images/Vata.png"
  },
  Pitta: {
    subtitle: "The Focused Achiever",
    element: "Fire + Water",
    tags: ["Focused", "Determined", "Passionate"],
    description: "Your answers lean toward Pitta, traditionally associated with focus, transformation and drive.",
    suggestion: "Explore balanced routines, refreshing breaks and time to unwind.",
    rollOn: "Pitta Balance",
    benefits: [
      "Cooling relief for stress and anger",
      "Enhances calmness and mental clarity",
      "Relieves mental burnout",
    ],
    notes: ["Lavender", "Sandalwood", "Blue Lotus"],
    ingredients: [
      "Carrier oil: Jojoba",
      "Essential oils: Lavender, Sandalwood & Blue Lotus",
      "Herbal extract: None",
    ],
    directions: "Roll onto wrists, temples, neck or pulse points. Inhale gently for a few breaths. Follow the final product label for frequency and application guidance.",
    manufacturing: ["Mfg: Oct 2026", "Best before: 12 months", "Storage: Store in a cool, dry place away from direct sunlight"],
    image: "/images/Pitta.png"
  },
  Kapha: {
    subtitle: "The Steady Guardian",
    element: "Water + Earth",
    tags: ["Calm", "Stable", "Grounded"],
    description: "Your answers lean toward Kapha, traditionally associated with steadiness and stability.",
    suggestion: "Explore enjoyable movement, variety and energising daily routines.",
    rollOn: "Kapha Uplift",
    benefits: [
      "Combats mental lethargy",
      "Sharpens focus and mental alertness",
      "Lifts low mood and sluggishness",
    ],
    notes: ["Lemon", "Peppermint", "Rosemary"],
    ingredients: [
      "Carrier oil: Jojoba",
      "Essential oils: Lemon, Peppermint & Rosemary",
      "Herbal extract: Tulsi",
    ],
    directions: "Roll onto wrists, temples, neck or pulse points. Inhale gently for a few breaths. Follow the final product label for frequency and application guidance.",
    manufacturing: ["Mfg: Oct 2026", "Best before: 12 months", "Storage: Store in a cool, dry place away from direct sunlight"],
    image: "/images/Kapha.png"
  },
};

const avatarImages = {
  Female: "/images/avatar-female.png",
  Male: "/images/avatar-male.png",
  "Non-binary": "/images/avatar-nonbinary.png",
  Custom: "/images/avatar-custom.png",
};

const journeySteps = [
  { label: "Discover", sub: "Learn about yourself", icon: Compass },
  { label: "Quiz", sub: "Answer 30 questions", icon: MessageSquare },
  { label: "Reveal", sub: "Find your Dosha", icon: Sparkles },
  { label: "Roll-On", sub: "Get your blend", icon: ShieldCheck },
  { label: "Wellness Plan", sub: "Build daily habits", icon: Sprout },
];

function loadSavedData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...initialData, ...JSON.parse(saved) } : initialData;
  } catch {
    return initialData;
  }
}
export default function App() {
  const [data, setData] = useState(loadSavedData);
  const [screen, setScreen] = useState("home");
  const [activeNav, setActiveNav] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [avatar, setAvatar] = useState(data.avatar || "Female");
  const [name, setName] = useState(data.name || "");
  const [age, setAge] = useState(data.age || "");
  const [phone, setPhone] = useState(data.phone || "");
  const [email, setEmail] = useState(data.email || "");
  const [wellnessNotes, setWellnessNotes] = useState(data.wellnessNotes || "");
  const [welcomeName, setWelcomeName] = useState(data.welcomeName || "Explorer");
  const [goal, setGoal] = useState(data.goal || "General Wellness");
  const [answers, setAnswers] = useState(data.answers || {});
  const [quizNotes, setQuizNotes] = useState(data.quizNotes || {});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedMood, setSelectedMood] = useState("");
  const [moodNote, setMoodNote] = useState("");
  const [bottleRotation, setBottleRotation] = useState(0);
  const [dragStart, setDragStart] = useState(null);
  const [routineChecks, setRoutineChecks] = useState(data.routine || []);
  const [supabaseUserId, setSupabaseUserId] = useState(null);
  const [backendStatus, setBackendStatus] = useState(
    supabase ? "connecting" : "not-configured"
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Browser storage fallback
    }
  }, [data]);

  useEffect(() => {
    let active = true;

    async function connectSupabase() {
      if (!supabase) return;

      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        let user = sessionData.session?.user;

        if (!user) {
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) throw error;
          user = data.user;
        }

        if (user) {
          const [
            profileRes,
            progressRes,
            quizRes,
            moodsRes,
            routineRes
          ] = await Promise.all([
            supabase
              .from("profiles")
              .select("*")
              .eq("user_id", user.id)
              .maybeSingle(),

            supabase
              .from("user_progress")
              .select("*")
              .eq("user_id", user.id)
              .maybeSingle(),

            supabase
              .from("quiz_attempts")
              .select("*")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })
              .limit(1),

            supabase
              .from("mood_entries")
              .select("mood,note,created_at")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })
              .limit(100),

            supabase
              .from("routine_progress")
              .select("completed_items")
              .eq("user_id", user.id)
              .maybeSingle(),
          ]);

          const failed = [
            profileRes,
            progressRes,
            quizRes,
            moodsRes,
            routineRes
          ].find((r) => r.error);

          if (failed?.error) throw failed.error;

          const profile = profileRes.data || {};
          const progress = progressRes.data || {};
          const latestQuiz = quizRes.data?.[0];

          const savedAnswers = {};

          if (latestQuiz?.answers) {
            Object.entries(latestQuiz.answers).forEach(([number, answer]) => {
              const found = frequencyOptions.findIndex(
                (option) => option.label === answer.option
              );

              if (found >= 0) {
                savedAnswers[Number(number) - 1] = found;
              }
            });
          }

          const restored = {
            avatar: profile.avatar || initialData.avatar,
            name: profile.full_name || "",
            age: profile.age ? String(profile.age) : "",
            phone: profile.phone || "",
            email: profile.email || "",
            wellnessNotes: profile.wellness_notes || "",
            welcomeName: profile.welcome_name || "Explorer",
            goal: profile.wellness_goal || "General Wellness",
            profileComplete: !!progress.profile_complete,
            quizComplete: !!progress.quiz_complete,
            rollOnUnlocked: !!progress.roll_on_unlocked,
            level3Complete: !!progress.level3_complete,
            dosha: latestQuiz?.primary_dosha || "Vata",
            doshaScores: latestQuiz?.scores || null,
            dualDoshas: latestQuiz?.dual_doshas || [],
            answers: savedAnswers,
            quizNotes: latestQuiz?.reflections || {},
            moods: (moodsRes.data || []).map((m) => ({
              mood: m.mood,
              note: m.note || "",
              date: m.created_at
            })),
            routine: routineRes.data?.completed_items || [],
          };

          if (active) {
            updateData(restored);
            setAvatar(restored.avatar);
            setName(restored.name);
            setAge(restored.age);
            setPhone(restored.phone);
            setEmail(restored.email);
            setWellnessNotes(restored.wellnessNotes);
            setWelcomeName(restored.welcomeName);
            setGoal(restored.goal);
            setAnswers(restored.answers);
            setQuizNotes(restored.quizNotes);
            setRoutineChecks(restored.routine);
            setSupabaseUserId(user.id);
            setBackendStatus("connected");
          }
        } else if (active) {
          setBackendStatus("error");
        }
      } catch (error) {
        console.error("AyuRome Supabase connection:", error);

        if (active) {
          setBackendStatus("error");
        }
      }
    }

    connectSupabase();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [screen]);

  function updateData(changes) {
    setData((current) => ({
      ...current,
      ...changes
    }));
  }

  async function saveProgressToSupabase(changes = {}) {
    if (!supabase || !supabaseUserId) return;

    const next = {
      ...data,
      ...changes
    };

    const { error } = await supabase
      .from("user_progress")
      .upsert(
        {
          user_id: supabaseUserId,
          profile_complete: !!next.profileComplete,
          quiz_complete: !!next.quizComplete,
          roll_on_unlocked: !!next.rollOnUnlocked,
          level3_complete: !!next.level3Complete,
          stars: [
            next.profileComplete,
            next.quizComplete,
            next.level3Complete
          ].filter(Boolean).length,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) {
      console.error("Could not save AyuRome progress:", error);
      setBackendStatus("error");
    }
  }

  function goHome() {
    setMenuOpen(false);
    setProfileMenuOpen(false);
    setScreen("home");
  }

  function scrollToDoshas() {
    setMenuOpen(false);

    if (screen !== "home") {
      setScreen("home");

      window.setTimeout(() => {
        document.getElementById("dosha-cards")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 120);
    } else {
      document.getElementById("dosha-cards")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  function beginJourney() {
    setMenuOpen(false);

    if (!data.profileComplete) {
      setAvatar(data.avatar || "Female");
      setScreen("avatar");
    } else if (!data.quizComplete) {
      setAnswers(data.answers || {});
      setQuizNotes(data.quizNotes || {});
      setQuestionIndex(0);
      setScreen("quiz");
    } else if (!data.level3Complete) {
      setScreen(data.rollOnUnlocked ? "rollOn" : "result");
    } else {
      setScreen("wellness");
    }
  }

  async function saveProfile(event) {
    event.preventDefault();

    if (!avatar || !name.trim() || !age) return;

    const profileChanges = {
      avatar,
      name: name.trim(),
      age: String(age),
      phone,
      email,
      wellnessNotes: wellnessNotes.trim(),
      welcomeName,
      goal,
      profileComplete: true
    };

    updateData(profileChanges);

    if (supabase && supabaseUserId) {
      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            user_id: supabaseUserId,
            full_name: profileChanges.name,
            age: Number(age),
            phone: phone || null,
            email: email || null,
            avatar,
            wellness_notes: profileChanges.wellnessNotes,
            welcome_name: welcomeName,
            wellness_goal: goal,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (error) {
        console.error(error);
        setBackendStatus("error");

        alert(
          "Profile saved in this browser, but Supabase save failed. Check your Supabase setup and SQL policies."
        );
      } else {
        setBackendStatus("connected");
      }
    }

    await saveProgressToSupabase(profileChanges);
    setScreen("level1");
  }

  function chooseAnswer(optionIndex) {
    setAnswers((current) => ({
      ...current,
      [questionIndex]: optionIndex,
    }));
  }

  async function finishQuiz() {
    if (answers[questionIndex] === undefined) return;

    const scores = {
      Vata: 0,
      Pitta: 0,
      Kapha: 0
    };

    questions.forEach((question, index) => {
      const selected = answers[index];

      if (selected !== undefined) {
        scores[question.dosha] += frequencyOptions[selected].points;
      }
    });

    const ranked = Object.entries(scores).sort(
      (a, b) => b[1] - a[1]
    );

    const result = ranked[0][0];

    const dualDoshas = ranked
      .slice(1)
      .filter(([, score]) => ranked[0][1] - score <= 3)
      .map(([dosha]) => dosha);

    const changes = {
      answers,
      quizNotes,
      dosha: result,
      doshaScores: scores,
      dualDoshas,
      quizComplete: true,
      rollOnUnlocked: true
    };

    updateData(changes);

    if (supabase && supabaseUserId) {
      const { error } = await supabase
        .from("quiz_attempts")
        .insert({
          user_id: supabaseUserId,

          answers: Object.fromEntries(
            Object.entries(answers).map(([idx, value]) => [
              String(Number(idx) + 1),
              {
                option: frequencyOptions[value].label,
                points: frequencyOptions[value].points
              }
            ])
          ),

          reflections: quizNotes,
          scores,
          primary_dosha: result,
          dual_doshas: dualDoshas,
          questionnaire_version: "ayurome-tridosha-30-v1",
        });

      if (error) {
        console.error(error);
        setBackendStatus("error");

        alert(
          "Your result is calculated, but Supabase could not save this assessment. Check the SQL setup."
        );
      }
    }

    await saveProgressToSupabase(changes);
    setScreen("result");
  }

  function nextQuestion() {
    if (answers[questionIndex] === undefined) return;

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((current) => current + 1);
    } else {
      finishQuiz();
    }
  }

  async function completeLevel3() {
    updateData({ level3Complete: true });

    await saveProgressToSupabase({
      level3Complete: true
    });

    setScreen("level3");
  }

  function startBottleDrag(event) {
    setDragStart({
      x: event.clientX,
      rotation: bottleRotation
    });

    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function moveBottle(event) {
    if (dragStart) {
      setBottleRotation(
        dragStart.rotation + (event.clientX - dragStart.x) * 0.75
      );
    }
  }

  function stopBottleDrag() {
    setDragStart(null);
  }

  async function saveMood() {
    if (!selectedMood) return;

    const entry = {
      mood: selectedMood,
      note: moodNote.trim(),
      date: new Date().toISOString()
    };

    updateData({
      moods: [...(data.moods || []), entry]
    });

    if (supabase && supabaseUserId) {
      const { error } = await supabase
        .from("mood_entries")
        .insert({
          user_id: supabaseUserId,
          mood: selectedMood,
          note: moodNote.trim()
        });

      if (error) {
        console.error(error);
        setBackendStatus("error");
        alert("Mood saved locally, but the Supabase save failed.");
      }
    }

    setSelectedMood("");
    setMoodNote("");
  }

  function resetJourney() {
    localStorage.removeItem(STORAGE_KEY);

    setData({ ...initialData });
    setAvatar("Female");
    setName("");
    setAge("");
    setPhone("");
    setEmail("");
    setWellnessNotes("");
    setWelcomeName("Explorer");
    setGoal("General Wellness");
    setAnswers({});
    setQuizNotes({});
    setQuestionIndex(0);
    setRoutineChecks([]);
    setSelectedMood("");
    setScreen("home");
    setMenuOpen(false);
  }

  const roadmapComplete = [
    Boolean(data.profileComplete),
    Boolean(data.quizComplete),
    Boolean(data.quizComplete),
    Boolean(data.rollOnUnlocked),
    Boolean(data.level3Complete),
  ];

  const currentDosha = doshaDetails[data.dosha] || doshaDetails.Vata;

  return (
    <div className={`ayurome-app theme-${(data.dosha || "Vata").toLowerCase()} screen-${screen}`}>
      <div className="app-background" />
      <div className="app-background-overlay" />

      {backendStatus !== "connected" && (
        <div className={`backend-status backend-${backendStatus}`}>
          {backendStatus === "not-configured"
            ? "Supabase not configured · local saving active"
            : backendStatus === "connecting"
            ? "Connecting to Supabase…"
            : "Supabase connection needs attention · local saving active"}
        </div>
      )}

      {/* Luxury Glass Header */}
      <header className="journey-header">
        <button className="wordmark" onClick={goHome} type="button">
          <Leaf size={24} strokeWidth={1.75} />
          <span>AYUROME</span>
        </button>

        <nav className="desktop-nav" aria-label="Main navigation">
          <button
            type="button"
            className={activeNav === "Home" ? "active" : ""}
            onClick={() => {
              setActiveNav("Home");
              goHome();
            }}
          >
            Home
          </button>

          <button
            type="button"
            className={activeNav === "Discover" ? "active" : ""}
            onClick={() => {
              setActiveNav("Discover");
              scrollToDoshas();
            }}
          >
            Discover
          </button>

          <button
            type="button"
            className={activeNav === "Wellness" ? "active" : ""}
            onClick={() => {
              setActiveNav("Wellness");

              if (data.level3Complete) {
                setScreen("wellness");
              } else {
                setScreen("home");
                document.querySelector(".home-journey-intro")?.scrollIntoView({
                  behavior: "smooth"
                });
              }
            }}
          >
            Wellness
          </button>

          <button
            type="button"
            className={activeNav === "Shop" ? "active" : ""}
            onClick={() => {
              setActiveNav("Shop");
              setScreen("shop");
            }}
          >
            Shop
          </button>

          <button
            type="button"
            className={activeNav === "About" ? "active" : ""}
            onClick={() => {
              setActiveNav("About");
              document.querySelector(".journey-footer")?.scrollIntoView({
                behavior: "smooth"
              });
            }}
          >
            About
          </button>
        </nav>

        <div className="header-actions">
          <button className="begin-button" onClick={beginJourney} type="button">
            {data.profileComplete ? "Continue Quest" : "Begin Within"}
            <ArrowRight size={15} />
          </button>

          <div className="profile-menu-wrap">
            <button
              className="profile-icon-button"
              type="button"
              aria-label="Profile"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <UserRound size={18} />
            </button>

            {profileMenuOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-heading">
                  <strong>{data.name || "Guest User"}</strong>
                  <span>{data.welcomeName || "Ayurvedic Explorer"}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    setScreen("profileView");
                  }}
                >
                  <UserRound size={15} /> View Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    setScreen("profile");
                  }}
                >
                  <RotateCcw size={15} /> Edit Profile
                </button>

                <button
                  type="button"
                  className="logout-option"
                  onClick={resetJourney}
                >
                  <ArrowLeft size={15} /> Reset Demo Progress
                </button>
              </div>
            )}
          </div>

          <button
            className="menu-toggle"
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="header-level-stars" aria-label="Level completion progress">
          {[data.profileComplete, data.quizComplete, data.level3Complete].map(
            (complete, index) => (
              <span
                className={complete ? "earned" : ""}
                key={index}
                title={`Level ${index + 1}${complete ? " complete" : " not complete"}`}
              >
                <Star size={16} fill={complete ? "currentColor" : "none"} />
              </span>
            )
          )}
        </div>

        {menuOpen && (
          <nav className="journey-menu" aria-label="Mobile navigation">
            <button
              type="button"
              className={activeNav === "Home" ? "active" : ""}
              onClick={() => {
                setActiveNav("Home");
                goHome();
              }}
            >
              Home
            </button>

            <button
              type="button"
              className={activeNav === "Discover" ? "active" : ""}
              onClick={() => {
                setActiveNav("Discover");
                scrollToDoshas();
              }}
            >
              Discover
            </button>

            <button
              type="button"
              className={activeNav === "Wellness" ? "active" : ""}
              onClick={() => {
                setMenuOpen(false);
                setActiveNav("Wellness");

                if (data.level3Complete) {
                  setScreen("wellness");
                } else {
                  setScreen("home");
                  document.querySelector(".home-journey-intro")?.scrollIntoView({
                    behavior: "smooth"
                  });
                }
              }}
            >
              Wellness
            </button>

            <button
              type="button"
              className={activeNav === "Shop" ? "active" : ""}
              onClick={() => {
                setMenuOpen(false);
                setActiveNav("Shop");
                setScreen("shop");
              }}
            >
              Shop
            </button>

            <button
              type="button"
              className={activeNav === "About" ? "active" : ""}
              onClick={() => {
                setMenuOpen(false);
                setActiveNav("About");
                document.querySelector(".journey-footer")?.scrollIntoView({
                  behavior: "smooth"
                });
              }}
            >
              About
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setScreen("profileView");
              }}
            >
              Profile
            </button>

            <button type="button" onClick={resetJourney}>
              Reset Progress
            </button>
          </nav>
        )}
      </header>
      {/* Main View Area */}
      <main className="journey-main">
        {screen === "home" && (
          <section className="screen home-screen">
            <p className="mini-kicker home-kicker">
              YOUR JOURNEY TO INNER HARMONY
            </p>

            <h1 className="home-welcome-title">
              Welcome to
              <em>AyuRome</em>
            </h1>

            <div className="home-ornament" aria-hidden="true">
              <span />
              <Leaf size={25} />
              <span />
            </div>

            <h2 className="home-tagline">
              Discover the rhythm within.
            </h2>

            <p className="screen-subtitle home-description">
              Explore the wisdom of Ayurveda and begin a journey
              <br className="desktop-break" />
              toward balance, awareness, and well-being.
            </p>

            <div className="home-doshas" id="dosha-cards">
              {Object.keys(doshaDetails).map((key, index) => {
                const item = doshaDetails[key];

                const symbols = {
                  Vata: "〰",
                  Pitta: "♨",
                  Kapha: "❋"
                };

                const qualities = {
                  Vata: "Movement · Creativity · Lightness",
                  Pitta: "Transformation · Energy · Focus",
                  Kapha: "Stability · Strength · Balance",
                };

                return (
                  <article
                    className={`home-dosha home-${key.toLowerCase()}`}
                    key={key}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setActiveNav("Discover");
                      updateData({ dosha: key });
                      setScreen("doshaPreview");
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        updateData({ dosha: key });
                        setScreen("doshaPreview");
                      }
                    }}
                  >
                    <div
                      className="dosha-card-bg"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />

                    <div className="home-dosha-shade" />

                    <span className="home-dosha-number">
                      0{index + 1}
                    </span>

                    <span className="home-dosha-symbol" aria-hidden="true">
                      {symbols[key]}
                    </span>

                    <div className="home-dosha-copy">
                      <small className="dosha-element">
                        {item.element.toUpperCase()}
                      </small>

                      <h2>{key}</h2>
                      <p>{qualities[key]}</p>

                      <div className="dosha-bars" aria-hidden="true">
                        {[0, 1, 2, 3, 4].map((bar) => (
                          <i key={bar} />
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="dosha-card-action"
                      aria-label={`Explore ${key}`}
                      onClick={() => {
                        setActiveNav("Discover");
                        updateData({ dosha: key });
                        setScreen("doshaPreview");
                      }}
                    >
                      <ArrowRight size={17} />
                    </button>
                  </article>
                );
              })}
            </div>

            <button
              className="primary-button home-cta"
              onClick={beginJourney}
            >
              Start Your Quest <ArrowRight size={19} />
            </button>

            <button
              className="home-scroll-cue"
              type="button"
              onClick={scrollToDoshas}
            >
              <span className="scroll-line" />
              SCROLL TO EXPLORE
              <Leaf size={17} />
            </button>

            <section
              className="home-journey-intro"
              aria-labelledby="home-journey-title"
            >
              <div className="home-journey-heading">
                <span className="home-journey-mark">
                  <Leaf size={25} />
                </span>

                <div>
                  <p className="mini-kicker">
                    A SIMPLE PATH TO BALANCE
                  </p>

                  <h2 id="home-journey-title">
                    Your Ayurvedic Journey
                  </h2>

                  <p>
                    Three thoughtful steps. One more mindful you.
                  </p>
                </div>
              </div>

              <div className="home-journey-steps">
                <article>
                  <span>01</span>
                  <div>
                    <strong>Discover Yourself</strong>
                    <p>
                      Share your profile details and wellness goals.
                    </p>
                  </div>
                </article>

                <article>
                  <span>02</span>
                  <div>
                    <strong>Understand Your Dosha</strong>
                    <p>
                      Complete a 30-question assessment to explore
                      your stress-response Dosha profile.
                    </p>
                  </div>
                </article>

                <article>
                  <span>03</span>
                  <div>
                    <strong>Find Your Blend</strong>
                    <p>
                      Explore a Dosha-inspired roll-on and simple
                      wellness habits.
                    </p>
                  </div>
                </article>
              </div>

              <p className="home-note">
                AyuRome is an educational wellness experience inspired
                by Ayurveda. It is not a medical diagnosis or a
                substitute for professional advice.
              </p>
            </section>
          </section>
        )}

        {screen === "doshaPreview" && (
          <section className="screen dosha-preview-screen">
            <BackButton onClick={goHome} />

            <p className="mini-kicker">MEET YOUR DOSHA</p>

            <h1>
              {data.dosha} · {currentDosha.element}
            </h1>

            <div className="dosha-preview-layout">
              <img
                src={currentDosha.image}
                alt={`${data.dosha} elemental artwork`}
              />

              <div>
                <h2>{currentDosha.subtitle}</h2>
                <p>{currentDosha.description}</p>
                <p>{currentDosha.suggestion}</p>

                <div className="dosha-tag-row">
                  {currentDosha.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <button
                  className="primary-button"
                  onClick={() => {
                    updateData({ rollOnUnlocked: true });
                    setBottleRotation(0);
                    setScreen("rollOn");
                  }}
                >
                  View {data.dosha} Roll-On
                  <ArrowRight size={18} />
                </button>

                <button
                  className="secondary-button"
                  onClick={beginJourney}
                >
                  Take the Dosha Quiz
                </button>
              </div>
            </div>
          </section>
        )}

        {screen === "shop" && (
          <section className="screen shop-screen">
            <p className="mini-kicker">
              THE AYUROME COLLECTION
            </p>

            <h1>Explore Your Roll-Ons</h1>

            <p className="screen-subtitle">
              Choose a Dosha blend to view its bottle, fragrance notes
              and ingredient list.
            </p>

            <div className="shop-product-grid">
              {Object.keys(doshaDetails).map((key) => (
                <button
                  className={`shop-product-card shop-${key.toLowerCase()}`}
                  key={key}
                  onClick={() => {
                    setActiveNav("Shop");
                    updateData({
                      dosha: key,
                      rollOnUnlocked: true
                    });
                    setBottleRotation(0);
                    setScreen("rollOn");
                  }}
                >
                  <img
                    src={`/images/rollon-${key.toLowerCase()}.png`}
                    alt={`${key} AyuRome roll-on bottle`}
                  />

                  <span>{key}</span>
                  <small>{doshaDetails[key].rollOn}</small>

                  <strong>
                    View Blend <ArrowRight size={15} />
                  </strong>
                </button>
              ))}
            </div>
          </section>
        )}

        {screen === "avatar" && (
          <section className="screen form-screen">
            <BackButton onClick={goHome} />

            <p className="mini-kicker">
              LEVEL 1 · STEP 1
            </p>

            <h1>Choose Your Avatar</h1>

            <p className="screen-subtitle">
              Pick a character that feels like you!
            </p>

            <div className="avatar-options">
              {["Female", "Male", "Non-binary", "Custom"].map((option) => (
                <button
                  type="button"
                  key={option}
                  className={`avatar-option ${
                    avatar === option ? "selected" : ""
                  }`}
                  onClick={() => setAvatar(option)}
                >
                  <div
                    className={`avatar-illustration ${option
                      .toLowerCase()
                      .replace(" ", "-")}-avatar`}
                  >
                    <img
                      src={avatarImages[option]}
                      alt={`${option} anime avatar`}
                    />
                  </div>

                  <strong>{option}</strong>

                  {avatar === option && (
                    <CheckCircle2
                      className="selected-check"
                      size={18}
                    />
                  )}
                </button>
              ))}
            </div>

            <button
              className="primary-button"
              disabled={!avatar}
              onClick={() => setScreen("profile")}
            >
              Next <ArrowRight size={18} />
            </button>
          </section>
        )}

        {screen === "profile" && (
          <section className="screen form-screen">
            <BackButton onClick={() => setScreen("avatar")} />

            <p className="mini-kicker">
              LEVEL 1 · STEP 2
            </p>

            <h1>Tell Us About You</h1>

            <p className="screen-subtitle">
              Help us personalize your Ayurvedic journey
            </p>

            <form className="profile-form" onSubmit={saveProfile}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Your age"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 Enter phone number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label>
                  Anything you'd like us to keep in mind?
                  <span className="optional-label">Optional</span>
                </label>

                <textarea
                  rows="3"
                  value={wellnessNotes}
                  onChange={(e) => setWellnessNotes(e.target.value)}
                  placeholder="Share your preferences or wellness priorities..."
                />
              </div>

              <div className="form-group">
                <label>Choose your wellness goal</label>

                <div className="goal-options">
                  {[
                    "Reduce Stress",
                    "Better Sleep",
                    "More Energy",
                    "Better Focus",
                    "General Wellness"
                  ].map((g) => (
                    <button
                      type="button"
                      key={g}
                      className={`goal-chip ${
                        goal === g ? "selected" : ""
                      }`}
                      onClick={() => setGoal(g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Choose your welcome name</label>

                <div className="welcome-options">
                  {[
                    "Your Name",
                    "Friend",
                    "Explorer",
                    "Soul",
                    "AyuBuddy"
                  ].map((wn) => (
                    <button
                      type="button"
                      key={wn}
                      className={`chip ${
                        welcomeName === wn ? "selected" : ""
                      }`}
                      onClick={() => setWelcomeName(wn)}
                    >
                      {wn}
                    </button>
                  ))}
                </div>
              </div>

              <button className="primary-button" type="submit">
                Continue <ArrowRight size={18} />
              </button>
            </form>
          </section>
        )}
        {screen === "profileView" && (
          <section className="screen form-screen">
            <BackButton onClick={goHome} />

            <p className="mini-kicker">YOUR AYUROME PROFILE</p>

            <h1>Edit Profile</h1>

            <p className="screen-subtitle">
              Update your information anytime
            </p>

            <div className="profile-view-card">
              <div className="profile-avatar-large">
                <img
                  src={avatarImages[data.avatar] || avatarImages.Female}
                  alt={`${data.avatar || "Selected"} anime avatar`}
                />

                <button
                  type="button"
                  className="change-avatar-btn"
                  onClick={() => setScreen("avatar")}
                >
                  Change Avatar
                </button>
              </div>

              <div className="profile-details-grid">
                <div>
                  <small>Name</small>
                  <strong>{data.name || "Not specified"}</strong>
                </div>

                <div>
                  <small>Age</small>
                  <strong>
                    {data.age ? `${data.age} years` : "Not specified"}
                  </strong>
                </div>

                <div>
                  <small>Phone</small>
                  <strong>{data.phone || "Not specified"}</strong>
                </div>

                <div>
                  <small>Email</small>
                  <strong>{data.email || "Not specified"}</strong>
                </div>

                <div>
                  <small>Wellness goal</small>
                  <strong>{data.goal}</strong>
                </div>

                <div>
                  <small>Welcome name</small>
                  <strong>{data.welcomeName || "Explorer"}</strong>
                </div>

                <div className="profile-note-detail">
                  <small>Your note</small>
                  <strong>
                    {data.wellnessNotes || "No additional preferences shared"}
                  </strong>
                </div>
              </div>

              <button
                className="primary-button"
                onClick={() => setScreen("profile")}
              >
                Edit Details <ArrowRight size={16} />
              </button>
            </div>
          </section>
        )}

        {screen === "level1" && (
          <section className="screen completion-screen">
            <LevelBadge level="1" label="DISCOVERY" />

            <p className="mini-kicker">
              FIRST MILESTONE UNLOCKED
            </p>

            <h1>Level 1 Complete!</h1>

            <p className="screen-subtitle">
              Your profile is saved, {data.name}. Your journey is ready
              for the next step.
            </p>

            <button
              className="primary-button"
              onClick={() => {
                setQuestionIndex(0);
                setAnswers(data.answers || {});
                setScreen("quiz");
              }}
            >
              Continue to Level 2 <ArrowRight size={18} />
            </button>
          </section>
        )}

        {screen === "quiz" && (
          <section className="screen quiz-screen">
            <BackButton onClick={goHome} />

            <p className="mini-kicker">
              LEVEL 2 · DOSHA DISCOVERY
            </p>

            <h1>Discover Your Dosha</h1>

            <p className="screen-subtitle">
              Think about your experiences over the past 30 days.
              Select one frequency for each statement.
            </p>

            <p className="assessment-note">
              This is a self-reflection wellness questionnaire, not a
              medical diagnosis or a substitute for clinical care.
            </p>

            <div className="quiz-progress-row">
              <span>
                QUESTION {questionIndex + 1} OF {questions.length}
              </span>

              <span>
                {Math.round(
                  ((questionIndex + 1) / questions.length) * 100
                )}%
              </span>
            </div>

            <div className="progress-track">
              <span
                style={{
                  width: `${
                    ((questionIndex + 1) / questions.length) * 100
                  }%`
                }}
              />
            </div>

            <div className="question-card">
              <div
                className={`question-dosha-tag question-${questions[
                  questionIndex
                ].dosha.toLowerCase()}`}
              >
                {questions[questionIndex].dosha.toUpperCase()} PROFILE
              </div>

              <h2>{questions[questionIndex].question}</h2>

              <p className="clinical-mapping">
                Clinical mapping: {questions[questionIndex].clinicalMapping}
              </p>

              <div className="answer-options frequency-answer-options">
                {frequencyOptions.map((option, index) => (
                  <button
                    type="button"
                    key={option.label}
                    className={`answer-option ${
                      answers[questionIndex] === index ? "selected" : ""
                    }`}
                    onClick={() => chooseAnswer(index)}
                  >
                    <span className="answer-letter">
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span className="answer-text">
                      <strong>{option.label}</strong>
                      <small>
                        {option.detail} · {option.points} points
                      </small>
                    </span>

                    {answers[questionIndex] === index && (
                      <CheckCircle2 size={18} />
                    )}
                  </button>
                ))}
              </div>

              <label className="quiz-reflection">
                <span>
                  Anything else you'd like to share?
                  <small>Optional</small>
                </span>

                <textarea
                  rows="2"
                  value={quizNotes[questionIndex] || ""}
                  onChange={(event) =>
                    setQuizNotes((current) => ({
                      ...current,
                      [questionIndex]: event.target.value
                    }))
                  }
                  placeholder="Add a little context about your answer..."
                />
              </label>
            </div>

            <button
              className="primary-button"
              disabled={answers[questionIndex] === undefined}
              onClick={nextQuestion}
            >
              {questionIndex === questions.length - 1
                ? "Reveal My Dosha"
                : "Next Question"}

              <ArrowRight size={18} />
            </button>
          </section>
        )}

        {screen === "result" && data.quizComplete && (
          <section className="screen result-screen">
            <div className="result-emblem">
              <Sparkles size={24} />
              <span>YOUR DOSHA</span>
              <strong>{data.dosha}</strong>
              <small>{currentDosha.element}</small>
            </div>

            <p className="mini-kicker">
              LEVEL 2 · DISCOVERY COMPLETE
            </p>

            <h1>You found your rhythm.</h1>

            <h2 className="result-subtitle">
              {currentDosha.subtitle}
            </h2>

            <p className="result-copy">
              {currentDosha.description}
            </p>

            <p className="result-copy">
              {currentDosha.suggestion}
            </p>

            {data.dualDoshas?.length > 0 && (
              <p className="result-copy dual-result-note">
                Your scores also indicate a dual-dominant profile:{" "}
                {data.dualDoshas.join(" + ")} (within 3 points of the
                highest score).
              </p>
            )}

            {data.doshaScores && (
              <div className="dosha-score-grid">
                {Object.entries(data.doshaScores).map(([dosha, score]) => (
                  <div key={dosha}>
                    <span>{dosha}</span>
                    <strong>{score}/40</strong>
                  </div>
                ))}
              </div>
            )}

            <button
              className="primary-button"
              onClick={() => setScreen("rollOn")}
            >
              Unlock Level 3 Roll-On <ArrowRight size={18} />
            </button>
          </section>
        )}

        {screen === "rollOn" && data.rollOnUnlocked && (
          <section className="screen rollon-screen">
            <div className="rollon-showcase">
              <div
                className="rollon-product-stage"
                onPointerDown={startBottleDrag}
                onPointerMove={moveBottle}
                onPointerUp={stopBottleDrag}
                onPointerCancel={stopBottleDrag}
                onLostPointerCapture={stopBottleDrag}
                role="img"
                aria-label={`${data.dosha} roll-on bottle. Drag left or right to rotate.`}
              >
                <img
                  className="rollon-product-image"
                  src={`/images/rollon-${data.dosha.toLowerCase()}.png`}
                  alt={`${data.dosha} AyuRome personalized herbal therapeutic roll-on bottle`}
                  draggable="false"
                  style={{
                    transform: `perspective(900px) rotateY(${bottleRotation}deg) rotateX(1deg)`
                  }}
                />

                <span className="bottle-stage-glow" />
              </div>

              <div className="bottle-controls">
                <button
                  type="button"
                  onClick={() =>
                    setBottleRotation((value) => value - 25)
                  }
                >
                  ↶ Rotate left
                </button>

                <span>Drag bottle to rotate</span>

                <button
                  type="button"
                  onClick={() =>
                    setBottleRotation((value) => value + 25)
                  }
                >
                  Rotate right ↷
                </button>
              </div>
            </div>

            <p className="mini-kicker">
              LEVEL 3 · PERSONALIZED WELLNESS
            </p>

            <h1>Your {currentDosha.rollOn}</h1>

            <p className="screen-subtitle">
              A result-inspired roll-on concept for your {data.dosha} journey.
            </p>

            <div
              className={`product-info-grid product-info-${data.dosha.toLowerCase()}`}
            >
              <article className="product-info-card product-benefits-card">
                <span className="product-card-kicker">
                  THE BLEND AT A GLANCE
                </span>

                <h3>Key Benefits</h3>

                {currentDosha.benefits.map((benefit) => (
                  <p key={benefit}>
                    <span className="info-check">✦</span>
                    {benefit}
                  </p>
                ))}
              </article>

              <article className="product-info-card">
                <span className="product-card-kicker">
                  BOTANICAL FORMULA
                </span>

                <h3>Ingredients</h3>

                {currentDosha.ingredients.map((ing) => (
                  <p key={ing}>
                    <span className="info-check">✦</span>
                    {ing}
                  </p>
                ))}

                <div className="fragrance-note-row">
                  {currentDosha.notes.map((note) => (
                    <span key={note}>{note}</span>
                  ))}
                </div>
              </article>

              <article className="product-info-card product-directions-card">
                <span className="product-card-kicker">
                  A MINDFUL RITUAL
                </span>

                <h3>Directions to Use</h3>
                <p>{currentDosha.directions}</p>
              </article>

              <article className="product-info-card product-manufacturing-card">
                <span className="product-card-kicker">
                  PRODUCT CARE
                </span>

                <h3>Manufacturing Information</h3>

                {currentDosha.manufacturing.map((item) => (
                  <p key={item}>
                    <span className="info-check">✦</span>
                    {item}
                  </p>
                ))}

                <p className="product-purity-note">
                  Made with essential oils · No artificial fragrance
                </p>
              </article>
            </div>

            <p className="product-concept-note">
              AyuRome educational product concept. Benefits are
              traditional/wellness-oriented descriptions, not medical
              claims. Check the final product label, dilution and allergy
              guidance before use; patch-test first and avoid eyes or
              irritated skin.
            </p>

            <button
              className="primary-button"
              onClick={completeLevel3}
            >
              Complete Level 3 <Trophy size={18} />
            </button>
          </section>
        )}

        {screen === "level3" && data.level3Complete && (
          <section className="screen completion-screen">
            <LevelBadge level="3" label="WELLNESS" />

            <p className="mini-kicker">
              THIRD MILESTONE UNLOCKED
            </p>

            <h1>Level 3 Complete!</h1>

            <p className="screen-subtitle">
              Your roll-on reveal is complete. You have completed all
              three levels.
            </p>

            <button
              className="primary-button"
              onClick={() => setScreen("wellness")}
            >
              Explore Wellness Journey <ArrowRight size={18} />
            </button>
          </section>
        )}

        {screen === "wellness" && data.level3Complete && (
          <section className="screen wellness-screen">
            <p className="mini-kicker">
              YOUR PERSONALIZED WELLNESS PATH
            </p>

            <h1>Your Wellness Journey</h1>

            <p className="screen-subtitle">
              Small, mindful steps to help you build a routine that works
              for you.
            </p>

            <div className="wellness-cards">
              <WellnessCard
                icon={<Sprout />}
                title="Diet & Nourishment"
                text="Explore balanced meals and mindful eating habits."
                onClick={() => setScreen("routine")}
              />

              <WellnessCard
                icon={<Sun />}
                title="Yoga & Movement"
                text="Make space for gentle movement and regular breaks."
                onClick={() => setScreen("routine")}
              />

              <WellnessCard
                icon={<Clock />}
                title="Daily Routine"
                text="Create a morning and evening rhythm that works for you."
                onClick={() => setScreen("routine")}
              />

              <WellnessCard
                icon={<Heart />}
                title="Mood Tracker"
                text="Record how you feel and reflect on your week."
                onClick={() => setScreen("mood")}
              />
            </div>

            <button
              className="primary-button"
              onClick={() => setScreen("routine")}
            >
              Open Routine Guide <ArrowRight size={18} />
            </button>
          </section>
        )}

        {screen === "routine" && (
          <section className="screen routine-screen">
            <BackButton onClick={() => setScreen("wellness")} />

            <p className="mini-kicker">
              YOUR DAILY WELLNESS GUIDE
            </p>

            <h1>Apply & Routine Guide</h1>

            <p className="screen-subtitle">
              Build your own checklist for mindful daily habits.
            </p>

            <div className="routine-list">
              {[
                "Read the roll-on label and follow its directions.",
                "Check ingredients and allergy warnings before use.",
                "Follow your chosen morning wellness routine.",
                "Make time for gentle movement or relaxation.",
                "Reflect on your day and prepare for restful sleep.",
              ].map((item, index) => (
                <label className="routine-item" key={item}>
                  <input
                    type="checkbox"
                    checked={routineChecks.includes(index)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...routineChecks, index]
                        : routineChecks.filter((v) => v !== index);

                      setRoutineChecks(next);
                      updateData({ routine: next });

                      if (supabase && supabaseUserId) {
                        supabase
                          .from("routine_progress")
                          .upsert(
                            {
                              user_id: supabaseUserId,
                              completed_items: next,
                              updated_at: new Date().toISOString()
                            },
                            { onConflict: "user_id" }
                          )
                          .then(({ error }) => {
                            if (error) {
                              console.error(error);
                              setBackendStatus("error");
                            }
                          });
                      }
                    }}
                  />

                  <span>{item}</span>
                </label>
              ))}
            </div>

            <button
              className="primary-button"
              onClick={() => setScreen("mood")}
            >
              Continue to Mood Tracker <ArrowRight size={18} />
            </button>
          </section>
        )}

        {screen === "mood" && (
          <section className="screen mood-screen">
            <BackButton onClick={() => setScreen("wellness")} />

            <p className="mini-kicker">
              A MOMENT FOR YOURSELF
            </p>

            <h1>How are you feeling today?</h1>

            <div className="mood-options">
              {[
                ["Great", "😄"],
                ["Good", "🙂"],
                ["Okay", "😐"],
                ["Low", "😔"],
                ["Stressed", "😣"]
              ].map(([m, emoji]) => (
                <button
                  key={m}
                  type="button"
                  className={`mood-option ${
                    selectedMood === m ? "selected" : ""
                  }`}
                  onClick={() => setSelectedMood(m)}
                >
                  <span>{emoji}</span>
                  <strong>{m}</strong>
                </button>
              ))}
            </div>

            <label className="mood-reflection">
              <span>
                Add a note about your day
                <small>Optional</small>
              </span>

              <textarea
                rows="3"
                value={moodNote}
                onChange={(event) => setMoodNote(event.target.value)}
                placeholder="What is on your mind today?"
              />
            </label>

            <button
              className="primary-button"
              disabled={!selectedMood}
              onClick={saveMood}
            >
              Save Mood <CheckCircle2 size={18} />
            </button>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="journey-footer">
        <div className="footer-main">
          <div className="footer-about">
            <button
              className="footer-logo"
              onClick={goHome}
              type="button"
            >
              <Leaf size={22} /> AYUROME
            </button>

            <p className="footer-tagline">
              Find Your Balance. Follow Your Nature.
            </p>

            <p className="footer-description">
              A mindful journey inspired by Ayurveda. Discover your
              Dosha, explore natural living, and build mindful routines.
            </p>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>
            <button type="button" onClick={goHome}>Home</button>
            <button type="button" onClick={scrollToDoshas}>Discover Doshas</button>
            <button type="button" onClick={() => setScreen("wellness")}>Wellness Journey</button>
            <button type="button" onClick={() => setScreen("shop")}>Shop</button>
          </div>

          <div className="footer-column">
            <h3>Your Journey</h3>
            <button type="button" onClick={beginJourney}>Start Your Quest</button>
            <button type="button" onClick={() => setScreen("profileView")}>Your Profile</button>
            <button type="button" onClick={() => setScreen("wellness")}>Your Wellness Plan</button>
          </div>

          <div className="footer-column">
            <h3>Support</h3>
            <button type="button">Privacy Policy</button>
            <button type="button">Terms of Service</button>
            <button type="button">Contact Us</button>
            <button type="button">FAQs</button>
          </div>

          <div className="footer-quote-box">
            <Leaf size={24} />
            <p>"Small steps, mindful living."</p>
            <small>
              Let each day be an opportunity to reconnect with yourself.
            </small>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} AyuRome. All rights reserved.
          </span>

          <span>
            Inspired by the wisdom of Ayurveda · For educational wellness exploration
          </span>
        </div>
      </footer>
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      className="back-button"
      type="button"
      onClick={onClick}
    >
      <ArrowLeft size={16} /> Back
    </button>
  );
}

function LevelBadge({ level, label }) {
  return (
    <div className="completion-badge">
      <Trophy size={36} />
      <span>LEVEL</span>
      <strong>{level}</strong>
      <small>{label}</small>
    </div>
  );
}

function WellnessCard({ icon, title, text, onClick }) {
  return (
    <button
      type="button"
      className="wellness-card"
      onClick={onClick}
    >
      <span className="wellness-card-icon">{icon}</span>
      <strong>{title}</strong>
      <p>{text}</p>
      <span className="wellness-card-link">
        Explore <ArrowRight size={13} />
      </span>
    </button>
  );
}