const App = {
    state: {
        currentScreen: "home"
    },
    init() {
        this.setupNavigation();
        this.setupButtons();
    },
    setupNavigation() {
        const navigationButtons = document.querySelectorAll(
            ".nav-button"
        );
        navigationButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const label = button
                    .querySelector(".nav-label")
                    ?.textContent
                    .toLowerCase();
                if (!label) {
                    return;
                }
                this.navigate(label);
            });
        });
    },
    setupButtons() {
        const addMaterialButton = document.querySelector(
            ".action-button:last-child"
        );
        if (addMaterialButton) {
            addMaterialButton.addEventListener("click", () => {
                this.navigate("add");
            });
        }
        const startStudyingButton = document.querySelector(
            ".primary-button"
        );
        if (startStudyingButton) {
            startStudyingButton.addEventListener("click", () => {
                this.navigate("study");
            });
        }
    },
    navigate(screen) {
        this.state.currentScreen = screen;
        console.log(`Axiom navigation: ${screen}`);
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
            return;
        }
    },
    showHome() {
        this.updateNavigation("home");
    },
    showAdd() {
        this.updateNavigation("add");
        alert("The Add Material screen is coming next.");
    },
    showStudy() {
        this.updateNavigation("study");
        alert("The Study screen is coming next.");
    },
    showProgress() {
        this.updateNavigation("progress");
        alert("The Progress screen is coming next.");
    },
    showSettings() {
        this.updateNavigation("settings");
        alert("Settings are coming next.");
    },
    updateNavigation(activeScreen) {
        const buttons = document.querySelectorAll(
            ".nav-button"
        );
        buttons.forEach((button) => {
            const label = button
                .querySelector(".nav-label")
                ?.textContent
                .toLowerCase();
            button.classList.toggle(
                "active",
                label === activeScreen
            );
        });
    }
};
document.addEventListener("DOMContentLoaded", () => {
    App.init();
});
