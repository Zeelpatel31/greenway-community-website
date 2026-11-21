
const API_URL = "https://ulaw-computing.github.io/home/module_resources/web-technologies/greenway/api.json";

let allEvents = [];

async function loadEvents() {
    const container = document.getElementById("event-list");
    const homeContainer = document.getElementById("home-events");
    const status = document.getElementById("event-status");

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load event data.");
        }

        allEvents = await response.json();

        if (status) {
            status.textContent = `${allEvents.length} events loaded successfully.`;
        }

        displayEvents(allEvents, container);
        displayEvents(allEvents.slice(0, 3), homeContainer);

    } catch (error) {
        if (status) {
            status.textContent = "Events could not be loaded. Please try again later.";
        }

        if (container) {
            container.textContent = "Event information is temporarily unavailable.";
        }

        if (homeContainer) {
            homeContainer.textContent = "Please visit again later for event updates.";
        }

        console.error(error);
    }
}

function displayEvents(events, container) {
    if (!container) return;

    container.replaceChildren();

    if (events.length === 0) {
        container.textContent = "No events found in this category.";
        return;
    }

    events.forEach(event => {
        const card = document.createElement("article");
        card.className = "event-card";

        const title = document.createElement("h3");
        title.textContent = event.title;

        const category = document.createElement("p");
        category.textContent = `Category: ${event.category}`;

        const date = document.createElement("p");
        date.textContent = `Date: ${event.date}`;

        const duration = document.createElement("p");
        duration.textContent = `Duration: ${event.duration_hours} hours`;

        const spaces = document.createElement("p");
        spaces.className = "spaces";
        spaces.textContent = `Spaces available: ${event.spaces_available}`;

        const description = document.createElement("p");
        description.textContent = event.description;

        const family = document.createElement("p");
        family.textContent = `Family friendly: ${event.family_friendly ? "Yes" : "No"}`;

        const interestLink = document.createElement("a");
        interestLink.className = "button";
        interestLink.textContent = "Register Interest";
        interestLink.href =
            "mailto:hello@greenway-community-trust.example?subject=" +
            encodeURIComponent("Interest in " + event.title);

        card.append(
            title, category, date, duration,
            spaces, description, family, interestLink
        );

        container.appendChild(card);
    });
}

function filterEvents() {
    const filter = document.getElementById("category-filter");
    if (!filter) return;

    const selected = filter.value;

    const filtered = selected === "All"
        ? allEvents
        : allEvents.filter(event => event.category === selected);

    displayEvents(filtered, document.getElementById("event-list"));
}

const volunteerForm = document.getElementById("volunteer-form");

if (volunteerForm) {
    volunteerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        if (!volunteerForm.checkValidity()) {
            volunteerForm.reportValidity();
            return;
        }

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const eventChoice = document.getElementById("event-choice").value;

        const subject = encodeURIComponent("Volunteer Interest - " + eventChoice);
        const body = encodeURIComponent(
            `Hello Greenway Community Trust,

I am interested in volunteering.

Name: ${name}
Email: ${email}
Event: ${eventChoice}

Please contact me with further information.

Thank you.`
        );

        document.getElementById("form-message").textContent =
            "Your email application will open with your volunteer enquiry.";

        window.location.href =
            `mailto:hello@greenway-community-trust.example?subject=${subject}&body=${body}`;
    });
}

document.addEventListener("DOMContentLoaded", loadEvents);
