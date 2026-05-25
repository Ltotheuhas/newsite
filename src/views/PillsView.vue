<template>
    <section class="test-data">
        <p v-if="loading" class="message">Loading JSON...</p>
        <p v-else-if="error" class="message error">{{ error }}</p>

        <div v-else class="session-grid">
            <article v-for="session in sessions" :key="session.id" class="session-card">
                <header class="session-card__header">
                    <div>
                        <h3>{{ session.participantCode }}</h3>
                        <p>{{ formatDate(session.baselineTimestamp) }}</p>
                    </div>
                </header>

                <section class="answer-section">
                    <h4>Baseline state</h4>

                    <div class="metrics-grid">
                        <InfoBox label="Mood" :value="formatValue(session.baseline?.answers?.currentMood)" />

                        <MetricBar label="Happiness" :value="session.baseline?.answers?.currentHappiness" :max="10" />

                        <MetricBar label="Calmness" :value="session.baseline?.answers?.currentCalmness" :max="10" />

                        <MetricBar label="Mental clarity" :value="session.baseline?.answers?.currentMentalClarity"
                            :max="10" />

                        <MetricBar label="Wakefulness" :value="session.baseline?.answers?.currentWakefulness"
                            :max="10" />

                        <MetricBar label="Sociability" :value="session.baseline?.answers?.currentSociability"
                            :max="10" />

                        <MetricBar label="Connection" :value="session.baseline?.answers?.currentConnection" :max="10" />

                        <MetricBar label="Sound intensity" :value="session.baseline?.answers?.currentSoundIntensity"
                            :max="10" />

                        <MetricBar label="Visual intensity" :value="session.baseline?.answers?.currentVisualIntensity"
                            :max="10" />

                        <InfoBox label="Body state" :value="formatList(session.baseline?.answers?.currentBodyState)" />

                        <InfoBox label="Touch" :value="formatValue(session.baseline?.answers?.currentTouchComfort)" />
                    </div>
                </section>

                <section v-for="followup in session.followups" :key="followup.id"
                    class="answer-section followup-section">
                    <h4>
                        Follow-up
                        <span>{{ formatElapsed(followup.minutesSinceBaseline) }} after baseline</span>
                    </h4>

                    <div class="metrics-grid">
                        <MetricBar label="Effect intensity" :value="followup.answers?.effectIntensity" :max="10" />

                        <MetricBar label="Happiness" :value="followup.answers?.happinessNow" :max="10" />

                        <MetricBar label="Connection" :value="followup.answers?.connectionNow" :max="10" />

                        <MetricBar label="Need to talk" :value="followup.answers?.talkingNeedNow" :max="10" />

                        <MetricBar label="Sound / music intensity" :value="followup.answers?.musicSoundIntensityNow"
                            :max="10" />

                        <MetricBar label="Visual intensity" :value="followup.answers?.visualIntensityNow" :max="10" />

                        <MetricBar label="Movement need" :value="followup.answers?.movementNeedNow" :max="10" />

                        <MetricBar label="Hallucinations" :value="followup.answers?.hallucinationIntensity" :max="10" />

                        <InfoBox label="Mood" :value="formatValue(followup.answers?.moodNow)" />

                        <InfoBox label="Perceived state" :value="formatValue(followup.answers?.feltAltered)" />

                        <InfoBox label="Perceived effects" :value="formatList(followup.answers?.noticedEffects)"
                            class="double-info" />
                    </div>
                </section>
            </article>
        </div>
    </section>
</template>

<script setup>
import { defineComponent, h, onMounted, ref } from "vue";

const DATA_URL = "/data/sessions.json";

const sessions = ref([]);
const loading = ref(false);
const error = ref("");

async function loadSessions() {
    loading.value = true;
    error.value = "";

    try {
        const response = await fetch(DATA_URL, {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("JSON file could not be loaded");
        }

        sessions.value = await response.json();
    } catch (err) {
        console.error(err);
        error.value = "Could not load sessions.json";
    } finally {
        loading.value = false;
    }
}

function formatDate(value) {
    if (!value) return "-";
    return new Date(value).toLocaleString();
}

function formatElapsed(totalMinutes) {
    const minutes = Number(totalMinutes);

    if (!Number.isFinite(minutes)) return "-";

    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;

    if (hours === 0) return `${rest} minutes`;
    if (rest === 0) return `${hours} hour${hours === 1 ? "" : "s"}`;

    return `${hours} hour${hours === 1 ? "" : "s"} ${rest} minutes`;
}

function formatValue(value) {
    if (value === undefined || value === null || value === "") return "-";

    return String(value)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatList(value) {
    if (!Array.isArray(value) || value.length === 0) return "-";

    return value.map((item) => formatValue(item)).join(", ");
}

const MetricBar = defineComponent({
    props: {
        label: {
            type: String,
            required: true,
        },
        value: {
            type: [Number, String],
            default: null,
        },
        max: {
            type: Number,
            default: 10,
        },
    },
    setup(props) {
        return () => {
            const numericValue = Number(props.value);
            const hasValue = Number.isFinite(numericValue);
            const safeValue = hasValue ? numericValue : 0;
            const percentage = Math.max(
                0,
                Math.min(100, (safeValue / props.max) * 100)
            );

            return h("div", { class: "data-box metric" }, [
                h("div", { class: "data-line" }, [
                    h("span", { class: "data-label" }, `${props.label}: `),
                    h("strong", { class: "data-value" }, hasValue ? String(safeValue) : "-"),
                ]),
                h("div", { class: "metric__track" }, [
                    h("div", {
                        class: "metric__fill",
                        style: { width: `${percentage}%` },
                    }),
                ]),
            ]);
        };
    },
});

const InfoBox = defineComponent({
    props: {
        label: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            default: "-",
        },
    },
    setup(props) {
        return () =>
            h("div", { class: "data-box info-box" }, [
                h("div", { class: "data-line" }, [
                    h("span", { class: "data-label" }, `${props.label}: `),
                    h("strong", { class: "data-value" }, props.value || "-"),
                ]),
            ]);
    },
});

onMounted(loadSessions);
</script>

<style scoped>
.test-data {
    max-width: 1180px;
    margin: 0 auto;
    padding: 2rem;
    font-family: Arial, Helvetica, sans-serif;
    color: #e8e8e8;
}

.test-data__header {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    align-items: flex-start;
    margin-bottom: 2rem;
    border-bottom: 1px solid currentColor;
    padding-bottom: 1rem;
}

.test-data__header h2 {
    margin: 0;
    font-size: 2.2rem;
}

.test-data__header p {
    margin: 0.35rem 0 0;
    opacity: 0.75;
}

button {
    border: 1px solid currentColor;
    background: transparent;
    color: inherit;
    padding: 0.6rem 1rem;
    font: inherit;
    cursor: pointer;
}

button:active {
    background: currentColor;
    color: black;
}

.message {
    border: 1px solid currentColor;
    padding: 1rem;
}

.error {
    font-weight: bold;
}

.session-grid {
    display: grid;
    gap: 2rem;
}

.session-card {
    border: 1px solid currentColor;
    padding: 1.5rem;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(4px);
}

.session-card__header {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    align-items: flex-start;
    margin-bottom: 1.5rem;
}

.session-card__header h3 {
    margin: 0;
    font-size: 1.6rem;
    letter-spacing: 0.04em;
}

.session-card__header p {
    margin: 0.35rem 0 0;
    opacity: 0.75;
}

.followup-count {
    border: 1px solid currentColor;
    min-width: 110px;
    padding: 0.75rem;
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
}

.followup-count span {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.8rem;
    font-weight: normal;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.answer-section {
    border-top: 1px solid currentColor;
    padding-top: 1.25rem;
    margin-top: 1.25rem;
}

.answer-section h4 {
    margin: 0 0 1rem;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.answer-section h4 span {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.9rem;
    font-weight: normal;
    text-transform: none;
    letter-spacing: 0;
    opacity: 0.75;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.25rem;
}

.data-box {
    border: 1px solid currentColor;
    padding: 0.85rem;
    min-height: 82px;
}

.data-line {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.35rem;
    align-items: baseline;
}

.data-label {
    opacity: 0.78;
}

.data-value {
    min-width: 0;
    text-align: left;
    overflow-wrap: anywhere;
}

.metric__track {
    height: 12px;
    border: 1px solid currentColor;
    margin-top: 0.75rem;
}

.metric__fill {
    height: 100%;
    background: currentColor;
}

.double-info {
    grid-column: span 2;
    min-height: 82px;
}

@media (max-width: 800px) {
    .metrics-grid {
        grid-template-columns: 1fr;
    }

    .session-card__header,
    .test-data__header {
        flex-direction: column;
    }

    .double-info {
        grid-column: auto;
    }
}
</style>