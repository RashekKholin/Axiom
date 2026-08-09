"use strict";

const App = {
    state: {
        currentScreen: "home"
    },

    init() {
        console.log("Axiom initialized.");

        this.setupNavigation();
        this.setupHomeButtons();
    },

    setupNavigation() {
        const navigationButtons =
            document.querySelectorAll(".nav-button");

        navigationButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const label =
                    button.querySelector(".nav-label");

                if (!label) return;

                const screen =
                    label.textContent.trim().toLowerCase();

                this.navigate(screen);
            });
        });
    },

    setupHomeButtons() {
        const actionButtons =
            document.querySelectorAll(".action-button");

        actionButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const title =
                    button.querySelector("strong");

                if (!title) return;

                const action =
                    title.textContent.trim();

                if (action === "Add Material") {
                    this.navigate("add");
                }

                if (action === "Flashcards") {
                    this.navigate("study");
                }

                if (action === "Practice") {
                    this.navigate("study");
                }

                if (action === "Mixed Review") {
                    this.navigate("study");
                }
            });
        });

        const startButton =
            document.querySelector(".primary-button");

        if (startButton) {
            startButton.addEventListener("click", () => {
                this.navigate("study");
            });
        }

        const settingsButton =
            document.querySelector(".settings-button");

        if (settingsButton) {
            settingsButton.addEventListener("click", () => {
                this.navigate("settings");
            });
        }
    },

    navigate(screen) {
        this.state.currentScreen = screen;

        this.updateNavigation(screen);

        if (screen === "home") {
            this.showHome();
            return;
        }

        if (screen === "add") {
            this.showAdd();
            return;
        }

        if (screen === "study") {
            this.showStudy();
            return;
        }

        if (screen === "progress") {
            this.showProgress();
            return;
        }

        if (screen === "settings") {
            this.showSettings();
        }
    },

    updateNavigation(activeScreen) {
        const buttons =
            document.querySelectorAll(".nav-button");

        buttons.forEach((button) => {
            const label =
                button.querySelector(".nav-label");

            if (!label) return;

            const screen =
                label.textContent.trim().toLowerCase();

            button.classList.toggle(
                "active",
                screen === activeScreen
            );
        });
    },

    getMain() {
        return document.querySelector("main");
    },

    showHome() {
        window.location.reload();
    },

    showAdd() {
        const main = this.getMain();

        if (!main) return;

        main.innerHTML = `
            <section class="app-screen">

                <div class="screen-header">
                    <div>
                        <p class="screen-eyebrow">CREATE</p>
                        <h1>Add Material</h1>
                    </div>
                </div>

                <form id="material-form">

                    <div class="form-section">

                        <label for="material-type">
                            Material Type
                        </label>

                        <select id="material-type" required>
                            <option value="flashcard">
                                Flashcard
                            </option>

                            <option value="question">
                                Practice Question
                            </option>

                            <option value="note">
                                Note
                            </option>

                            <option value="formula">
                                Formula
                            </option>
                        </select>

                    </div>

                    <div class="form-section">

                        <label for="subject">
                            Subject
                        </label>

                        <input
                            id="subject"
                            type="text"
                            placeholder="e.g. Biology"
                            required
                        >

                    </div>

                    <div class="form-section">

                        <label for="topic">
                            Topic
                        </label>

                        <input
                            id="topic"
                            type="text"
                            placeholder="e.g. Cell Biology"
                            required
                        >

                    </div>

                    <div class="form-row">

                        <div class="form-section">
                            <label for="difficulty">
                                Difficulty
                            </label>

                            <select id="difficulty">
                                <option value="1">
                                    1 — Easy
                                </option>

                                <option value="2" selected>
                                    2 — Moderate
                                </option>

                                <option value="3">
                                    3 — Hard
                                </option>

                                <option value="4">
                                    4 — Very Hard
                                </option>

                                <option value="5">
                                    5 — Expert
                                </option>
                            </select>
                        </div>

                        <div class="form-section">
                            <label for="tags">
                                Tags
                            </label>

                            <input
                                id="tags"
                                type="text"
                                placeholder="cells, biology"
                            >
                        </div>

                    </div>

                    <div class="form-section">

                        <label for="front">
                            Question / Front
                        </label>

                        <textarea
                            id="front"
                            rows="5"
                            placeholder="What do you want to remember?"
                            required
                        ></textarea>

                    </div>

                    <div class="form-section">

                        <label for="back">
                            Answer / Back
                        </label>

                        <textarea
                            id="back"
                            rows="5"
                            placeholder="Enter the answer..."
                            required
                        ></textarea>

                    </div>

                    <div
                        class="form-section"
                        id="explanation-section"
                    >

                        <label for="explanation">
                            Explanation
                        </label>

                        <textarea
                            id="explanation"
                            rows="4"
                            placeholder="Optional explanation..."
                        ></textarea>

                    </div>

                    <button
                        type="submit"
                        class="primary-button"
                    >
                        Save Material
                    </button>

                </form>

            </section>
        `;

        this.addFormStyles();
        this.setupMaterialForm();
    },

    setupMaterialForm() {
        const form =
            document.querySelector("#material-form");

        if (!form) return;

        const type =
            document.querySelector("#material-type");

        const explanation =
            document.querySelector("#explanation-section");

        const updateFields = () => {
            if (type.value === "question") {
                explanation.style.display = "block";
            } else {
                explanation.style.display = "none";
            }
        };

        type.addEventListener("change", updateFields);

        updateFields();

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            try {
                const materialType = type.value;

                const subject =
                    document.querySelector("#subject")
                        .value
                        .trim();

                const topic =
                    document.querySelector("#topic")
                        .value
                        .trim();

                const front =
                    document.querySelector("#front")
                        .value
                        .trim();

                const back =
                    document.querySelector("#back")
                        .value
                        .trim();

                const difficulty =
                    Number(
                        document.querySelector("#difficulty")
                            .value
                    );

                const tags =
                    document.querySelector("#tags")
                        .value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean);

                const explanationText =
                    document.querySelector("#explanation")
                        .value
                        .trim();

                const subjectId =
                    await this.findOrCreateSubject(subject);

                const topicId =
                    await this.findOrCreateTopic(
                        subjectId,
                        topic
                    );

                const material = {
                    subjectId,
                    topicId,

                    type: materialType,

                    front,
                    back,

                    explanation:
                        materialType === "question"
                            ? explanationText
                            : "",

                    difficulty,

                    tags,

                    createdAt:
                        new Date().toISOString(),

                    updatedAt:
                        new Date().toISOString(),

                    studyData: {
                        timesStudied: 0,
                        correct: 0,
                        incorrect: 0,
                        mastery: 0,
                        lastStudied: null,
                        nextReview: null
                    }
                };

                await addItem(
                    STORES.materials,
                    material
                );

                alert("Material saved successfully.");

                form.reset();

                type.value = "flashcard";
                document.querySelector("#difficulty").value = "2";

                updateFields();

            } catch (error) {
                console.error(
                    "Could not save material:",
                    error
                );

                alert(
                    "Axiom couldn't save this material. Check the console for details."
                );
            }
        });
    },

    async findOrCreateSubject(name) {
        const subjects =
            await getAllItems(STORES.subjects);

        const existing =
            subjects.find(
                (subject) =>
                    subject.name.toLowerCase() ===
                    name.toLowerCase()
            );

        if (existing) {
            return existing.id;
        }

        const subject = {
            id: generateId(),
            name,
            createdAt:
                new Date().toISOString()
        };

        await addItem(
            STORES.subjects,
            subject
        );

        return subject.id;
    },

    async findOrCreateTopic(subjectId, name) {
        const topics =
            await getAllItems(STORES.topics);

        const existing =
            topics.find(
                (topic) =>
                    topic.subjectId === subjectId &&
                    topic.name.toLowerCase() ===
                    name.toLowerCase()
            );

        if (existing) {
            return existing.id;
        }

        const topic = {
            id: generateId(),
            subjectId,
            name,
            createdAt:
                new Date().toISOString()
        };

        await addItem(
            STORES.topics,
            topic
        );

        return topic.id;
    },

    showStudy() {
        const main = this.getMain();

        if (!main) return;

        main.innerHTML = `
            <section class="app-screen">

                <p class="screen-eyebrow">STUDY</p>

                <h1>Study</h1>

                <div class="empty-state">
                    <div class="empty-state-icon">▣</div>

                    <h2>Your study sessions will appear here.</h2>

                    <p>
                        Add some material first, then Axiom
                        will be ready to help you study it.
                    </p>

                    <button
                        class="primary-button"
                        id="go-add"
                    >
                        Add Material
                    </button>
                </div>

            </section>
        `;

        document
            .querySelector("#go-add")
            ?.addEventListener("click", () => {
                this.navigate("add");
            });

        this.addFormStyles();
    },

    async showProgress() {
        const main = this.getMain();

        if (!main) return;

        const materials =
            await getAllItems(STORES.materials);

        const subjects =
            await getAllItems(STORES.subjects);

        main.innerHTML = `
            <section class="app-screen">

                <p class="screen-eyebrow">YOUR DATA</p>

                <h1>Progress</h1>

                <div class="stats-grid">

                    <div class="stat-card">
                        <strong>${materials.length}</strong>
                        <span>Materials</span>
                    </div>

                    <div class="stat-card">
                        <strong>${subjects.length}</strong>
                        <span>Subjects</span>
                    </div>

                </div>

                <div class="empty-state">

                    <h2>Progress tracking is next.</h2>

                    <p>
                        Axiom is ready to start recording
                        your study history.
                    </p>

                </div>

            </section>
        `;

        this.addFormStyles();
    },

    showSettings() {
        const main = this.getMain();

        if (!main) return;

        main.innerHTML = `
            <section class="app-screen">

                <p class="screen-eyebrow">AXIOM</p>

                <h1>Settings</h1>

                <div class="settings-card">
                    <strong>Local Storage</strong>

                    <p>
                        Your study data is currently stored
                        locally on this device.
                    </p>
                </div>

                <div class="settings-card">
                    <strong>Version</strong>

                    <p>Axiom MVP</p>
                </div>

            </section>
        `;

        this.addFormStyles();
    },

    addFormStyles() {
        if (document.querySelector("#axiom-app-styles")) {
            return;
        }

        const style =
            document.createElement("style");

        style.id = "axiom-app-styles";

        style.textContent = `
            .app-screen {
                padding-top: 12px;
            }

            .screen-eyebrow {
                margin: 0 0 6px;
                color: #777b86;
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 1.5px;
            }

            .app-screen h1 {
                margin: 0 0 28px;
                font-size: 34px;
                letter-spacing: -1px;
            }

            .form-section {
                margin-bottom: 18px;
            }

            .form-section label {
                display: block;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 600;
                color: #d9dae0;
            }

            .form-section input,
            .form-section select,
            .form-section textarea {
                width: 100%;
                border: 1px solid #292c34;
                border-radius: 14px;
                background: #17191f;
                color: #f5f5f7;
                padding: 14px;
                font: inherit;
                outline: none;
            }

            .form-section input,
            .form-section select {
                min-height: 50px;
            }

            .form-section textarea {
                resize: vertical;
                line-height: 1.45;
            }

            .form-section input:focus,
            .form-section select:focus,
            .form-section textarea:focus {
                border-color: #6f7480;
            }

            .form-section input::placeholder,
            .form-section textarea::placeholder {
                color: #666a74;
            }

            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
            }

            .empty-state {
                margin-top: 20px;
                padding: 28px 20px;
                background: #17191f;
                border-radius: 20px;
                text-align: center;
            }

            .empty-state h2 {
                margin: 0 0 10px;
                font-size: 19px;
            }

            .empty-state p {
                margin: 0 0 22px;
                color: #8d9099;
                line-height: 1.5;
            }

            .empty-state-icon {
                font-size: 32px;
                margin-bottom: 16px;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 18px;
            }

            .stat-card {
                background: #17191f;
                border-radius: 18px;
                padding: 20px;
            }

            .stat-card strong {
                display: block;
                font-size: 30px;
                margin-bottom: 4px;
            }

            .stat-card span {
                color: #858994;
                font-size: 13px;
            }

            .settings-card {
                background: #17191f;
                border-radius: 18px;
                padding: 18px;
                margin-bottom: 12px;
            }

            .settings-card strong {
                display: block;
                margin-bottom: 7px;
            }

            .settings-card p {
                margin: 0;
                color: #858994;
                line-height: 1.5;
            }

            @media (max-width: 420px) {
                .form-row {
                    grid-template-columns: 1fr;
                    gap: 0;
                }
            }
        `;

        document.head.appendChild(style);
    }
};

document.addEventListener(
    "DOMContentLoaded",
    () => App.init()
);