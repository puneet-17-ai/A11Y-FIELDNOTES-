(() => {
  "use strict";

  const backdrop = document.querySelector("#modal-backdrop");
  const modal = document.querySelector("#demo-modal");
  const openButtons = [document.querySelector("#open-modal"), document.querySelector("#open-modal-secondary")];
  const closeButton = document.querySelector(".close-modal");
  const form = document.querySelector("#subscribe-form");
  const emailInput = document.querySelector("#email");
  const emailError = document.querySelector("#email-error");
  const successMessage = document.querySelector("#success-message");
  const liveAnnouncer = document.querySelector("#live-announcer");
  let previouslyFocusedElement = null;

  function openModal() {
    if (!backdrop || !modal) return;
    previouslyFocusedElement = document.activeElement;
    backdrop.hidden = false;
    document.body.style.overflow = "hidden";
    emailError.hidden = true;
    emailInput.removeAttribute("aria-invalid");
    window.requestAnimationFrame(() => emailInput.focus());
  }

  function closeModal() {
    if (!backdrop || backdrop.hidden) return;
    backdrop.hidden = true;
    document.body.style.overflow = "";
    if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === "function") {
      previouslyFocusedElement.focus();
    }
  }

  function showError(message) {
    emailError.textContent = message;
    emailError.hidden = false;
    emailInput.setAttribute("aria-invalid", "true");
    emailInput.focus();
    liveAnnouncer.textContent = message;
  }

  openButtons.forEach((button) => {
    if (button) button.addEventListener("click", openModal);
  });
  closeButton.addEventListener("click", closeModal);

  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (backdrop.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
    }
    // Keep keyboard focus within the modal while it is open.
    if (event.key === "Tab") {
      const focusable = modal.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  emailInput.addEventListener("input", () => {
    emailInput.removeAttribute("aria-invalid");
    emailError.hidden = true;
    liveAnnouncer.textContent = "";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    if (!email) {
      showError("Please enter your email address.");
      return;
    }
    if (!validEmail) {
      showError("Enter a valid email address, such as you@example.com.");
      return;
    }

    form.hidden = true;
    successMessage.hidden = false;
    liveAnnouncer.textContent = "Subscription demo completed successfully.";
  });
})();
