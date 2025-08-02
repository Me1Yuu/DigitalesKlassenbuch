function updateClockAndDate() {
  const clock = document.getElementById("time");
  const date = document.getElementById("date");

  const now = new Date();
  const timeString = now.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateString = now.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  clock.textContent = timeString;
  date.textContent = dateString;
}

setInterval(updateClockAndDate, 1000);
updateClockAndDate();

document.addEventListener("DOMContentLoaded", function() {
  const toggleBtn = document.getElementById("darkmode-option");
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
});



//local storage hinzufügen, damiit es beim reload auch im darkmode erhalten bleibt//

