const calendarGrid = document.getElementById("calendar-grid");
const monthYear = document.getElementById("month-year");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const eventModal = document.getElementById("event-modal");
const closeModal = document.getElementById("close-modal");
const selectedDate = document.getElementById("selected-date");
const eventTitleInput = document.getElementById("event-title");
const saveEventBtn = document.getElementById("save-event");

let currentDate = new Date();
let events = JSON.parse(localStorage.getItem("calendarEvents")) || {};

function renderCalendar() {
  calendarGrid.innerHTML = "";
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  monthYear.textContent = `${monthNames[month]} ${year}`;

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    calendarGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= lastDate; day++) {
    const dayCell = document.createElement("div");
    const dateKey = `${year}-${month + 1}-${day}`;
    dayCell.textContent = day;

    if (events[dateKey]) {
      dayCell.classList.add("event-day");
    }

    dayCell.addEventListener("click", () => openModal(dateKey));
    calendarGrid.appendChild(dayCell);
  }
}

function openModal(dateKey) {
  selectedDate.textContent = `Evento para ${dateKey}`;
  const existing = events[dateKey];
  eventTitleInput.value =
    typeof existing === "object" ? existing.title : existing || "";
  eventModal.classList.remove("hidden");

  saveEventBtn.onclick = () => {
    const title = eventTitleInput.value.trim();
    if (title) {
      events[dateKey] = { title, completed: false };
    } else {
      delete events[dateKey];
    }
    localStorage.setItem("calendarEvents", JSON.stringify(events));
    eventModal.classList.add("hidden");
    renderCalendar();
    renderEventList();
  };
}

closeModal.addEventListener("click", () => {
  eventModal.classList.add("hidden");
});

prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

function renderEventList() {
  const eventList = document.getElementById("event-list");
  eventList.innerHTML = "";

  const sortedKeys = Object.keys(events).sort();

  sortedKeys.forEach((dateKey) => {
    const eventItem = document.createElement("div");
    const eventData = events[dateKey];
    const title =
      typeof eventData === "object" && eventData !== null
        ? eventData.title
        : eventData;

    eventItem.className = "event-item";
    if (eventData.completed) {
      eventItem.classList.add("completed");
    }

    eventItem.innerHTML = `
      <strong>${dateKey}</strong>: ${title || "(sem título)"}
      <div class="event-actions">
        <button onclick="toggleComplete('${dateKey}')">✔️</button>
        <button onclick="deleteEvent('${dateKey}')">🗑️</button>
      </div>
    `;

    eventList.appendChild(eventItem);
  });
}

function toggleComplete(dateKey) {
  if (events[dateKey]) {
    if (typeof events[dateKey] === "object") {
      events[dateKey].completed = !events[dateKey].completed;
    } else {
      events[dateKey] = { title: events[dateKey], completed: true };
    }
    localStorage.setItem("calendarEvents", JSON.stringify(events));
    renderCalendar();
    renderEventList();
  }
}

function deleteEvent(dateKey) {
  delete events[dateKey];
  localStorage.setItem("calendarEvents", JSON.stringify(events));
  renderCalendar();
  renderEventList();
}

renderCalendar();
renderEventList();
