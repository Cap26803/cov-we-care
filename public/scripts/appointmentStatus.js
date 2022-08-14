const userHome = document.getElementById("user-home");

if (userHome !== null) {
  const appointmentStatusBtn = document.getElementById("appointment-status");

  appointmentStatusBtn.addEventListener("click", async () => {
    const userAppointments = await getUserAppointments();

    const latestAppointment = userAppointments?.appointments[0];
    if (!latestAppointment) {
      showAppointmentStatusModal("Oops!", "No appointments found!");
      return;
    }

    let status = "is pending";
    let message = "Under Process";

    if (latestAppointment?.isApproved) {
      status = "has been approved";
      message = "Congrats!!!";
    } else if (latestAppointment?.isDeclined) {
      status = "has been declined";
      message = "Sorry for inconvenience!!";
    }

    showAppointmentStatusModal(
      `${message}`,
      `Your appointment in ${latestAppointment?.healthCenter} ${status}!`
    );
  });
}

async function getUserAppointments() {
  const res = await fetch("/api/data/appointments", {
    headers: {
      "Content-Type": "application/json",
      user: localStorage.getItem("user"),
    },
  });

  const data = await res.json();
  return data;
}
