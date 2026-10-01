const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[data-section]");

const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarOverlay = document.getElementById("sidebar-overlay");

const apodDateInput =
    document.getElementById("apod-date-input");




const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};


const updateDateLabel = () => {

    if (!apodDateInput) {
        return;
    }

    const selectedDate =
        apodDateInput.value;

    if (!selectedDate) {
        return;
    }

    const date =
        new Date(`${selectedDate}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return;
    }

    const formattedDate =
        date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        );


    const dateWrapper =
        apodDateInput.closest(
            ".date-input-wrapper"
        );


    if (dateWrapper) {

        dateWrapper.dataset.date =
            formattedDate;

    }

};




const showSection = (sectionId) => {

    sections.forEach((section) => {

        const isActive =
            section.dataset.section === sectionId;

        section.classList.toggle(
            "hidden",
            !isActive
        );

    });


    navLinks.forEach((link) => {

        const isActive =
            link.dataset.section === sectionId;

        link.classList.toggle(
            "active",
            isActive
        );

    });


    closeSidebar();

};




const toggleSidebar = () => {

    if (!sidebar) {
        return;
    }

    sidebar.classList.toggle(
        "sidebar-open"
    );


    if (sidebarOverlay) {

        sidebarOverlay.classList.toggle(
            "active"
        );

    }

};


const closeSidebar = () => {

    if (sidebar) {

        sidebar.classList.remove(
            "sidebar-open"
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.classList.remove(
            "active"
        );

    }

};




navLinks.forEach((link) => {

    link.addEventListener(
        "click",
        () => {

            const sectionId =
                link.dataset.section;

            if (sectionId) {

                showSection(
                    sectionId
                );

            }

        }
    );

});




if (sidebarToggle) {

    sidebarToggle.addEventListener(
        "click",
        toggleSidebar
    );

}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );

}




const today =
    getTodayDate();


if (apodDateInput) {

    apodDateInput.max =
        today;

    apodDateInput.value =
        today;


    apodDateInput.addEventListener(
        "change",
        updateDateLabel
    );

}




showSection(
    "today-in-space"
);

updateDateLabel();