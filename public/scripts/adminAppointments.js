const adminContainer = document.getElementById("admin-content-wrapper");
const adminParent = document.getElementsByClassName("admin-container")[0];
const logOutLink = document.getElementById("sidebar-logout");

const approveBtn = document.getElementById("approved-appointments");
const declineBtn = document.getElementById("declined-appointments");

const sidebarLinks = document.getElementsByClassName("sidebar-link");

// Fetch all the appointments of respective health center
async function getAdminAppointments() {
  const userRes = await fetch(`/users/${localStorage.getItem("user")}`);
  const userData = await userRes.json();

  const adminRes = await fetch(
    `/admin/appointments?health_center=${userData.user.healthCenter}`,
    {
      headers: {
        "Content-Type": "application/json",
        admin: localStorage.getItem("user"),
      },
    }
  );
  const adminAppointments = await adminRes.json();
  return adminAppointments;
}

// Fetch Approved Appointments
async function getAdminApprovedAppointments() {
  const userRes = await fetch(`/users/${localStorage.getItem("user")}`);
  const userData = await userRes.json();

  const adminRes = await fetch(
    `/admin/appointments?health_center=${userData.user.healthCenter}&only_approved_appointments=true`,
    {
      headers: {
        "Content-Type": "application/json",
        admin: localStorage.getItem("user"),
      },
    }
  );
  const adminAppointments = await adminRes.json();
  return adminAppointments;
}

// Fetch Approved Appointments
async function getAdminDeclinedAppointments() {
  const userRes = await fetch(`/users/${localStorage.getItem("user")}`);
  const userData = await userRes.json();

  const adminRes = await fetch(
    `/admin/appointments?health_center=${userData.user.healthCenter}&only_declined_appointments=true`,
    {
      headers: {
        "Content-Type": "application/json",
        admin: localStorage.getItem("user"),
      },
    }
  );
  const adminAppointments = await adminRes.json();
  return adminAppointments;
}

// Show all appointments
(async () => {
  const adminAppointments = await getAdminAppointments();

  adminAppointments?.forEach((appointment) => {
    const contentBlock = document.createElement("div");
    contentBlock.classList.add("appointment-content");

    const patientName = document.createElement("h4");
    patientName.textContent = appointment?.fullName;
    contentBlock.append(patientName);

    const ailment = document.createElement("p");
    ailment.textContent = appointment?.address;
    contentBlock.append(ailment);

    contentBlock.addEventListener("click", () => {
      showAdminModal(
        patientName.textContent,
        ailment.textContent,
        "APPROVE",
        appointment?.id
      );
    });

    adminContainer?.append(contentBlock);
  });
})();

// Show only approved appointments
if (approveBtn !== null) {
  approveBtn.addEventListener("click", async () => {
    try {
      Array.from(sidebarLinks).forEach((link) => {
        if (link.getAttribute("id") === "approved-link") {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });

      adminContainer.remove();
      const container = document.createElement("div");
      container.classList.add("content-wrapper");
      container.setAttribute("id", "admin-content-wrapper");

      const approvedAppointments = await getAdminApprovedAppointments();
      if (approvedAppointments?.length === 0) return;

      approvedAppointments.forEach((appointment) => {
        const contentBlock = document.createElement("div");
        contentBlock.classList.add("appointment-content");

        const patientName = document.createElement("h4");
        patientName.textContent = appointment?.fullName;
        contentBlock.append(patientName);

        const ailment = document.createElement("p");
        ailment.textContent = appointment?.address;
        contentBlock.append(ailment);

        container.append(contentBlock);
      });

      adminParent.append(container);
    } catch (err) {
      console.error(err);
    }
  });
}

// Show only approved appointments
if (declineBtn !== null) {
  declineBtn.addEventListener("click", async () => {
    try {
      adminContainer.remove();

      Array.from(sidebarLinks).forEach((link) => {
        if (link.getAttribute("id") === "declined-link") {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });

      const container = document.createElement("div");
      container.classList.add("content-wrapper");
      container.setAttribute("id", "admin-content-wrapper");

      const declinedAppointments = await getAdminDeclinedAppointments();
      if (declinedAppointments?.length === 0) return;

      declinedAppointments.forEach((appointment) => {
        const contentBlock = document.createElement("div");
        contentBlock.classList.add("appointment-content");

        const patientName = document.createElement("h4");
        patientName.textContent = appointment?.fullName;
        contentBlock.append(patientName);

        const ailment = document.createElement("p");
        ailment.textContent = appointment?.address;
        contentBlock.append(ailment);

        container.append(contentBlock);
      });

      adminParent.append(container);
    } catch (err) {
      console.error(err);
    }
  });
}

// Log out Admin
logOutLink &&
  logOutLink.addEventListener("click", () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");
    location.pathname = "/signIn";
  });
