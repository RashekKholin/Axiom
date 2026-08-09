"use strict";
console.log("Axiom app.js loaded.");
document.addEventListener("DOMContentLoaded", function () {
    console.log("Axiom DOM loaded.");
    const buttons = document.querySelectorAll(".nav-button");
    console.log("Navigation buttons found:", buttons.length);
    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            const labelElement = button.querySelector(".nav-label");
            if (!labelElement) {
                alert("Axiom found the button, but could not find its label.");
                return;
            }
            const screen = labelElement.textContent.trim();
            alert("Axiom navigation is working!\n\nYou tapped: " + screen);
        });
    });
    const quickActions = document.querySelectorAll(".action-button");
    console.log(
        "Quick action buttons found:",
        quickActions.length
    );
    quickActions.forEach(function (button) {
        button.addEventListener("click", function () {
            const title = button.querySelector("strong");
            if (!title) {
                alert("Axiom found the button, but could not find its title.");
                return;
            }
            alert(
                "Axiom is working!\n\nYou tapped: " +
                title.textContent.trim()
            );
        });
    });
    const primaryButton =
        document.querySelector(".primary-button");
    if (primaryButton) {
        primaryButton.addEventListener("click", function () {
            alert("Axiom is working!\n\nStart Studying was tapped.");
        });
    }
    console.log("Axiom event listeners initialized.");
});