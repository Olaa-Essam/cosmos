(() => {


    const NASA_API_KEY = "DEMO_KEY";
    const NASA_APOD_URL = "https://api.nasa.gov/planetary/apod";

    const apodDateInput = document.getElementById("apod-date-input");
    const loadDateBtn = document.getElementById("load-date-btn");
    const todayApodBtn = document.getElementById("today-apod-btn");

    const apodImageContainer =
        document.getElementById("apod-image-container");

    const apodLoading =
        document.getElementById("apod-loading");

    const apodTitle =
        document.getElementById("apod-title");

    const apodDateDetail =
        document.getElementById("apod-date-detail");

    const apodExplanation =
        document.getElementById("apod-explanation");

    const apodCopyright =
        document.getElementById("apod-copyright");

    const apodDateInfo =
        document.getElementById("apod-date-info-text");

    const apodMediaType =
        document.getElementById("apod-media-type");


    const getTodayDate = () => {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };


    const formatDate = (date) => {
        if (!date) {
            return "Date unavailable";
        }

        const parsedDate = new Date(`${date}T00:00:00`);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date unavailable";
        }

        return parsedDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };


    const showApodLoading = () => {
        if (apodLoading) {
            apodLoading.classList.remove("hidden");
        }
    };


    const hideApodLoading = () => {
        if (apodLoading) {
            apodLoading.classList.add("hidden");
        }
    };


    const updateAPODInfo = (data) => {
        if (apodTitle) {
            apodTitle.textContent =
                data.title || "Astronomy Picture of the Day";
        }

        if (apodDateDetail) {
            apodDateDetail.innerHTML = `
                <i class="fa-regular fa-calendar"></i>
                ${formatDate(data.date)}
            `;
        }

        if (apodExplanation) {
            apodExplanation.textContent =
                data.explanation || "No explanation available.";
        }

        if (apodDateInfo) {
            apodDateInfo.textContent =
                formatDate(data.date);
        }

        if (apodCopyright) {
            if (data.copyright) {
                apodCopyright.textContent =
                    `© ${data.copyright}`;

                apodCopyright.classList.remove("hidden");
            } else {
                apodCopyright.classList.add("hidden");
            }
        }

        if (apodMediaType) {
            apodMediaType.innerHTML = `
                <i class="fa-solid fa-${data.media_type === "image" ? "image" : "video"}"></i>
                ${data.media_type === "image" ? "Image" : "Video"}
            `;
        }
    };


    const showAPODError = (message) => {
        if (!apodImageContainer) {
            return;
        }

        apodImageContainer.innerHTML = `
            <div class="apod-error">
                <i class="fa-solid fa-triangle-exclamation"></i>

                <h3>Unable to load space data</h3>

                <p>${message}</p>
            </div>
        `;
    };


    const loadAPOD = async (date = getTodayDate()) => {
        if (!apodImageContainer) {
            return;
        }

        showApodLoading();

        try {
            const response = await fetch(
                `${NASA_APOD_URL}?api_key=${NASA_API_KEY}&date=${date}`
            );

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(
                    data.error?.message ||
                    "NASA API request failed."
                );
            }

            if (!data.date) {
                throw new Error(
                    "NASA did not return valid data."
                );
            }

            updateAPODInfo(data);



            if (data.media_type === "image") {
                apodImageContainer.innerHTML = `
                    <img
                        id="apod-image"
                        src="${data.url}"
                        alt="${data.title || "NASA Astronomy Picture"}"
                    >

                    <a
                        id="apod-fullscreen"
                        class="fullscreen-btn"
                        href="${data.hdurl || data.url}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i class="fa-solid fa-expand"></i>
                        View Full Resolution
                    </a>
                `;

                const image =
                    document.getElementById("apod-image");

                if (image) {
                    image.addEventListener(
                        "load",
                        hideApodLoading
                    );

                    image.addEventListener(
                        "error",
                        hideApodLoading
                    );
                }
            }


            

            else if (data.media_type === "video") {
                apodImageContainer.innerHTML = `
                    <iframe
                        class="apod-video"
                        src="${data.url}"
                        title="${data.title || "NASA APOD Video"}"
                        allowfullscreen
                    ></iframe>
                `;

                hideApodLoading();
            }


            if (apodDateInput) {
                apodDateInput.value = data.date;
            }

        } catch (error) {
            console.error(
                "NASA APOD Error:",
                error
            );

            hideApodLoading();

            showAPODError(
                "We couldn't connect to NASA right now. Please try again later."
            );
        }
    };


    if (loadDateBtn) {
        loadDateBtn.addEventListener("click", () => {
            const selectedDate =
                apodDateInput?.value;

            if (!selectedDate) {
                return;
            }

            loadAPOD(selectedDate);
        });
    }


    if (todayApodBtn) {
        todayApodBtn.addEventListener("click", () => {
            const today = getTodayDate();

            if (apodDateInput) {
                apodDateInput.value = today;
            }

            loadAPOD(today);
        });
    }


    const apodToday = getTodayDate();

    if (apodDateInput) {
        apodDateInput.max = apodToday;
        apodDateInput.value = apodToday;
    }

    loadAPOD(apodToday);





    const LAUNCHES_API_URL =
        "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10&mode=detailed";


    const launchesGrid =
        document.getElementById("launches-grid");

    const launchesCount =
        document.getElementById("launches-count");

    const launchesCountMobile =
        document.getElementById("launches-count-mobile");

    const featuredLaunch =
        document.getElementById("featured-launch");


    const formatLaunchDate = (date) => {
        if (!date) {
            return "Date unavailable";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date unavailable";
        }

        return parsedDate.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        );
    };


    const formatLaunchTime = (date) => {
        if (!date) {
            return "Time unavailable";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Time unavailable";
        }

        return parsedDate.toLocaleTimeString(
            "en-US",
            {
                hour: "numeric",
                minute: "2-digit",
            }
        );
    };


    const getLaunchAgency = (launch) => {
        return (
            launch.launch_service_provider?.name ||
            "Unknown Agency"
        );
    };


    const getLaunchLocation = (launch) => {
        return (
            launch.pad?.location?.name ||
            "Location unavailable"
        );
    };


    const getLaunchImage = (launch) => {
        return (
            launch.image_url ||
            "https://images.unsplash.com/photo-1517976547714-720226b864c1?auto=format&fit=crop&w=1200&q=80"
        );
    };


    const getLaunchStatus = (launch) => {
        return (
            launch.status?.name ||
            "Upcoming"
        );
    };


    const renderFeaturedLaunch = (launch) => {
        if (!featuredLaunch) {
            return;
        }

        featuredLaunch.innerHTML = `
            <div class="featured-launch-image">
                <img
                    src="${getLaunchImage(launch)}"
                    alt="${launch.name || "Space Launch"}"
                >
            </div>

            <div class="featured-launch-content">

                <span class="launch-badge">
                    ${getLaunchStatus(launch)}
                </span>

                <h2>
                    ${launch.name || "Unnamed Launch"}
                </h2>

                <p class="launch-provider">
                    <i class="fa-solid fa-building"></i>
                    ${getLaunchAgency(launch)}
                </p>

                <p class="featured-launch-description">
                    ${
                        launch.mission?.description ||
                        "No mission description is available for this launch."
                    }
                </p>

                <div class="launch-info-grid">

                    <div class="launch-info-item">
                        <i class="fa-regular fa-calendar"></i>

                        <div>
                            <span>Date</span>
                            <strong>
                                ${formatLaunchDate(launch.net)}
                            </strong>
                        </div>
                    </div>


                    <div class="launch-info-item">
                        <i class="fa-regular fa-clock"></i>

                        <div>
                            <span>Time</span>
                            <strong>
                                ${formatLaunchTime(launch.net)}
                            </strong>
                        </div>
                    </div>


                    <div class="launch-info-item">
                        <i class="fa-solid fa-location-dot"></i>

                        <div>
                            <span>Location</span>
                            <strong>
                                ${getLaunchLocation(launch)}
                            </strong>
                        </div>
                    </div>


                    <div class="launch-info-item">
                        <i class="fa-solid fa-rocket"></i>

                        <div>
                            <span>Rocket</span>
                            <strong>
                                ${
                                    launch.rocket?.configuration?.full_name ||
                                    "Unknown Rocket"
                                }
                            </strong>
                        </div>
                    </div>

                </div>
            </div>
        `;
    };


    const renderLaunchCard = (launch) => {
        return `
            <article class="launch-card">

                <div class="launch-card-image">

                    <img
                        src="${getLaunchImage(launch)}"
                        alt="${launch.name || "Space Launch"}"
                    >

                    <span class="launch-status">
                        ${getLaunchStatus(launch)}
                    </span>

                </div>


                <div class="launch-card-content">

                    <p class="launch-card-provider">
                        ${getLaunchAgency(launch)}
                    </p>

                    <h3>
                        ${launch.name || "Unnamed Launch"}
                    </h3>


                    <div class="launch-card-info">

                        <div>
                            <i class="fa-regular fa-calendar"></i>
                            <span>
                                ${formatLaunchDate(launch.net)}
                            </span>
                        </div>

                        <div>
                            <i class="fa-regular fa-clock"></i>
                            <span>
                                ${formatLaunchTime(launch.net)}
                            </span>
                        </div>

                        <div>
                            <i class="fa-solid fa-location-dot"></i>
                            <span>
                                ${getLaunchLocation(launch)}
                            </span>
                        </div>

                    </div>


                    <div class="launch-card-footer">

                        <span>
                            ${launch.mission?.type || "Space Mission"}
                        </span>

                        ${
                            launch.webcast_live
                                ? `
                                    <span class="live-badge">
                                        <i class="fa-solid fa-circle"></i>
                                        Live
                                    </span>
                                `
                                : ""
                        }

                    </div>

                </div>

            </article>
        `;
    };


    const showLaunchesLoading = () => {
        if (!launchesGrid) {
            return;
        }

        launchesGrid.innerHTML = `
            <div class="launches-loading">

                <i class="fa-solid fa-spinner fa-spin"></i>

                <p>
                    Loading upcoming launches...
                </p>

            </div>
        `;
    };


    const showLaunchesError = () => {
        if (!launchesGrid) {
            return;
        }

        launchesGrid.innerHTML = `
            <div class="launches-error">

                <i class="fa-solid fa-rocket"></i>

                <h3>
                    Unable to load launches
                </h3>

                <p>
                    We couldn't get the upcoming launches right now.
                    Please try again later.
                </p>

            </div>
        `;
    };


    const loadLaunches = async () => {
        if (!launchesGrid) {
            return;
        }

        showLaunchesLoading();

        try {
            const response =
                await fetch(LAUNCHES_API_URL);

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch launches."
                );
            }

            const data =
                await response.json();

            const launches =
                data.results || [];


            if (!launches.length) {
                showLaunchesError();
                return;
            }


            const totalLaunches =
                launches.length;


            if (launchesCount) {
                launchesCount.textContent =
                    `${totalLaunches} Launches`;
            }


            if (launchesCountMobile) {
                launchesCountMobile.textContent =
                    `${totalLaunches} launches`;
            }


            renderFeaturedLaunch(
                launches[0]
            );


  
            launchesGrid.innerHTML =
                launches
                    .slice(1)
                    .map(renderLaunchCard)
                    .join("");

        } catch (error) {
            console.error(
                "Launches Error:",
                error
            );

            showLaunchesError();
        }
    };


    loadLaunches();





    const PLANETS_API_URL =
        "./assets/data/planets.json";


    const planetsGrid =
        document.querySelector(".planets-grid");

    const planetCards =
        document.querySelectorAll(".planet-card");




    const planetDetailImage =
        document.getElementById("planet-detail-image");

    const planetDetailName =
        document.getElementById("planet-detail-name");

    const planetDescription =
        document.getElementById("planet-detail-description");

    const planetDistance =
        document.getElementById("planet-distance");

    const planetRadius =
        document.getElementById("planet-radius");

    const planetMass =
        document.getElementById("planet-mass");

    const planetDensity =
        document.getElementById("planet-density");

    const planetOrbitalPeriod =
        document.getElementById("planet-orbital-period");

    const planetRotation =
        document.getElementById("planet-rotation");

    const planetMoons =
        document.getElementById("planet-moons");

    const planetGravity =
        document.getElementById("planet-gravity");

    const planetDiscoverer =
        document.getElementById("planet-discoverer");

    const planetDiscoveryDate =
        document.getElementById("planet-discovery-date");

    const planetBodyType =
        document.getElementById("planet-body-type");

    const planetVolume =
        document.getElementById("planet-volume");

    const planetFacts =
        document.getElementById("planet-facts");

    const planetPerihelion =
        document.getElementById("planet-perihelion");

    const planetAphelion =
        document.getElementById("planet-aphelion");

    const planetEccentricity =
        document.getElementById("planet-eccentricity");

    const planetInclination =
        document.getElementById("planet-inclination");

    const planetAxialTilt =
        document.getElementById("planet-axial-tilt");

    const planetTemperature =
        document.getElementById("planet-temp");

    const planetEscapeVelocity =
        document.getElementById("planet-escape");

    const comparisonTableBody =
        document.getElementById("planet-comparison-tbody");




    const planetDescriptions = {

        mercury:
            "Mercury is the smallest planet in the Solar System and the closest planet to the Sun. It has a heavily cratered surface and experiences extreme temperature changes.",

        venus:
            "Venus is the second planet from the Sun. It is named after the Roman goddess of love and beauty. As the second-brightest natural object in the night sky after the Moon, Venus can cast shadows.",

        earth:
            "Earth is the third planet from the Sun and the only astronomical object known to harbor life. It has liquid water on its surface and a nitrogen-rich atmosphere.",

        mars:
            "Mars is the fourth planet from the Sun and is often called the Red Planet because of the iron minerals in its soil. It has the largest volcano and one of the deepest canyons in the Solar System.",

        jupiter:
            "Jupiter is the largest planet in the Solar System. It is a gas giant known for its Great Red Spot and powerful magnetic field.",

        saturn:
            "Saturn is the sixth planet from the Sun and is famous for its spectacular ring system. It is a gas giant with a large collection of moons.",

        uranus:
            "Uranus is the seventh planet from the Sun. It is an ice giant with a blue-green color caused by methane in its atmosphere and an extreme axial tilt.",

        neptune:
            "Neptune is the eighth and farthest known planet from the Sun. It is a cold, dark ice giant with some of the fastest winds in the Solar System."
    };




    const planetImages = {
        mercury: "./assets/images/mercury.png",
        venus: "./assets/images/venus.png",
        earth: "./assets/images/earth.png",
        mars: "./assets/images/mars.png",
        jupiter: "./assets/images/jupiter.png",
        saturn: "./assets/images/saturn.png",
        uranus: "./assets/images/uranus.png",
        neptune: "./assets/images/neptune.png"
    };




    const formatNumber = (value, decimals = 2) => {

        if (
            value === null ||
            value === undefined ||
            Number.isNaN(Number(value))
        ) {
            return "N/A";
        }

        return Number(value).toLocaleString("en-US", {
            maximumFractionDigits: decimals
        });
    };


    const formatDistanceKm = (km) => {

        if (
            km === null ||
            km === undefined ||
            Number.isNaN(Number(km))
        ) {
            return "N/A";
        }

        const value = Number(km);

        if (value >= 1000000000) {
            return `${formatNumber(value / 1000000000, 2)}B km`;
        }

        if (value >= 1000000) {
            return `${formatNumber(value / 1000000, 1)}M km`;
        }

        if (value >= 1000) {
            return `${formatNumber(value / 1000, 1)}K km`;
        }

        return `${formatNumber(value, 0)} km`;
    };


    const kmToAU = (km) => {

        if (
            km === null ||
            km === undefined ||
            Number.isNaN(Number(km))
        ) {
            return null;
        }

        return Number(km) / 149597870.7;
    };


    const formatDistanceAU = (km) => {

        const au = kmToAU(km);

        if (au === null) {
            return "N/A";
        }

        return `${formatNumber(au, 2)} AU`;
    };


    const formatRadius = (radiusKm) => {

        if (
            radiusKm === null ||
            radiusKm === undefined ||
            Number.isNaN(Number(radiusKm))
        ) {
            return "N/A";
        }

        return `${formatNumber(radiusKm, 0)} km`;
    };



    const formatMass = (mass) => {

        if (
            !mass ||
            mass.massValue === undefined ||
            mass.massExponent === undefined
        ) {
            return "N/A";
        }

        return `${formatNumber(
            mass.massValue,
            5
        )} × 10^${mass.massExponent} kg`;
    };


    const getMassKg = (mass) => {

        if (
            !mass ||
            mass.massValue === undefined ||
            mass.massExponent === undefined
        ) {
            return null;
        }

        return (
            Number(mass.massValue) *
            Math.pow(10, Number(mass.massExponent))
        );
    };


    const formatDensity = (density) => {

        if (
            density === null ||
            density === undefined ||
            Number.isNaN(Number(density))
        ) {
            return "N/A";
        }

        return `${formatNumber(density, 2)} g/cm³`;
    };


    const formatGravity = (gravity) => {

        if (
            gravity === null ||
            gravity === undefined ||
            Number.isNaN(Number(gravity))
        ) {
            return "N/A";
        }

        return `${formatNumber(gravity, 2)} m/s²`;
    };


    const formatOrbitalPeriod = (days) => {

        if (
            days === null ||
            days === undefined ||
            Number.isNaN(Number(days))
        ) {
            return "N/A";
        }

        if (Number(days) >= 365) {
            return `${formatNumber(
                Number(days) / 365.25,
                1
            )} years`;
        }

        return `${formatNumber(days, 2)} days`;
    };


    const formatRotation = (hours) => {

        if (
            hours === null ||
            hours === undefined ||
            Number.isNaN(Number(hours))
        ) {
            return "N/A";
        }

        return `${formatNumber(hours, 2)} hours`;
    };



    const formatVolume = (volume) => {

        if (
            !volume ||
            volume.volValue === undefined ||
            volume.volExponent === undefined
        ) {
            return "N/A";
        }

        return `${formatNumber(
            volume.volValue,
            5
        )} × 10^${volume.volExponent} km³`;
    };


    const formatTemperature = (kelvin) => {

        if (
            kelvin === null ||
            kelvin === undefined ||
            Number.isNaN(Number(kelvin))
        ) {
            return "N/A";
        }

        const celsius =
            Number(kelvin) - 273.15;

        return `${formatNumber(celsius, 0)}°C`;
    };


    const formatEscapeVelocity = (metersPerSecond) => {

        if (
            metersPerSecond === null ||
            metersPerSecond === undefined ||
            Number.isNaN(Number(metersPerSecond))
        ) {
            return "N/A";
        }

        return `${formatNumber(
            Number(metersPerSecond) / 1000,
            2
        )} km/s`;
    };


  

    const getBodyType = (planet) => {

        const name = planet.englishName;

        if (
            name === "Jupiter" ||
            name === "Saturn"
        ) {
            return "Gas Giant";
        }

        if (
            name === "Uranus" ||
            name === "Neptune"
        ) {
            return "Ice Giant";
        }

        return "Terrestrial";
    };




    const getDiscoverer = (planet) => {

        if (
            planet.discoveredBy &&
            planet.discoveredBy.trim()
        ) {
            return planet.discoveredBy;
        }

        return "Known since antiquity";
    };


    const getDiscoveryDate = (planet) => {

        if (
            planet.discoveryDate &&
            planet.discoveryDate.trim()
        ) {
            return planet.discoveryDate;
        }

        return "Ancient times";
    };


 

    const updatePlanetDetails = (planet) => {

        if (!planet) {
            return;
        }

        const planetId =
            planet.englishName.toLowerCase();


        if (planetDetailImage) {

            planetDetailImage.src =
                planetImages[planetId] ||
                `./assets/images/${planetId}.png`;

            planetDetailImage.alt =
                planet.englishName;
        }


        if (planetDetailName) {

            planetDetailName.textContent =
                planet.englishName;
        }


        if (planetDescription) {

            planetDescription.textContent =
                planetDescriptions[planetId] ||
                "No description available for this planet.";
        }


        if (planetDistance) {

            planetDistance.textContent =
                formatDistanceAU(
                    planet.semimajorAxis
                );
        }


        if (planetRadius) {

            planetRadius.textContent =
                formatRadius(
                    planet.meanRadius
                );
        }


        if (planetMass) {

            planetMass.textContent =
                formatMass(
                    planet.mass
                );
        }


        if (planetDensity) {

            planetDensity.textContent =
                formatDensity(
                    planet.density
                );
        }


        if (planetOrbitalPeriod) {

            planetOrbitalPeriod.textContent =
                formatOrbitalPeriod(
                    planet.sideralOrbit
                );
        }


        if (planetRotation) {

            planetRotation.textContent =
                formatRotation(
                    planet.sideralRotation
                );
        }


        if (planetMoons) {

            planetMoons.textContent =
                planet.moons?.length ?? 0;
        }


        if (planetGravity) {

            planetGravity.textContent =
                formatGravity(
                    planet.gravity
                );
        }


        if (planetDiscoverer) {

            planetDiscoverer.textContent =
                getDiscoverer(planet);
        }


        if (planetDiscoveryDate) {

            planetDiscoveryDate.textContent =
                getDiscoveryDate(planet);
        }


        if (planetBodyType) {

            planetBodyType.textContent =
                getBodyType(planet);
        }


        if (planetVolume) {

            planetVolume.textContent =
                formatVolume(
                    planet.vol
                );
        }


        if (planetFacts) {

            planetFacts.innerHTML = `
                <strong>Mass:</strong>
                ${formatMass(planet.mass)}
                <br>

                <strong>Surface gravity:</strong>
                ${formatGravity(planet.gravity)}
                <br>

                <strong>Density:</strong>
                ${formatDensity(planet.density)}
                <br>

                <strong>Axial tilt:</strong>
                ${
                    planet.axialTilt !== null &&
                    planet.axialTilt !== undefined
                        ? `${formatNumber(
                            planet.axialTilt,
                            2
                        )}°`
                        : "N/A"
                }
            `;
        }


        if (planetPerihelion) {

            planetPerihelion.textContent =
                formatDistanceKm(
                    planet.perihelion
                );
        }


        if (planetAphelion) {

            planetAphelion.textContent =
                formatDistanceKm(
                    planet.aphelion
                );
        }


        if (planetEccentricity) {

            planetEccentricity.textContent =
                planet.eccentricity !== null &&
                planet.eccentricity !== undefined
                    ? formatNumber(
                        planet.eccentricity,
                        5
                    )
                    : "N/A";
        }


        if (planetInclination) {

            planetInclination.textContent =
                planet.inclination !== null &&
                planet.inclination !== undefined
                    ? `${formatNumber(
                        planet.inclination,
                        2
                    )}°`
                    : "N/A";
        }


        if (planetAxialTilt) {

            planetAxialTilt.textContent =
                planet.axialTilt !== null &&
                planet.axialTilt !== undefined
                    ? `${formatNumber(
                        planet.axialTilt,
                        2
                    )}°`
                    : "N/A";
        }


        if (planetTemperature) {

            planetTemperature.textContent =
                formatTemperature(
                    planet.avgTemp
                );
        }


        if (planetEscapeVelocity) {

            planetEscapeVelocity.textContent =
                formatEscapeVelocity(
                    planet.escape
                );
        }
    };


 

    const getPlanetMassInEarths = (planet) => {

        const massKg =
            getMassKg(planet.mass);

        if (massKg === null) {
            return "N/A";
        }

        const earthMass =
            5.9722e24;

        return (
            massKg / earthMass
        ).toFixed(3);
    };


    const renderPlanetComparison = (planets) => {

        if (!comparisonTableBody) {
            return;
        }

        comparisonTableBody.innerHTML =
            planets
                .map((planet) => {

                    const diameter =
                        planet.meanRadius !== null &&
                        planet.meanRadius !== undefined
                            ? Number(planet.meanRadius) * 2
                            : null;

                    return `
                        <tr>

                            <td>
                                <strong>
                                    ${planet.englishName}
                                </strong>
                            </td>

                            <td>
                                ${formatNumber(
                                    kmToAU(
                                        planet.semimajorAxis
                                    ),
                                    2
                                )}
                            </td>

                            <td>
                                ${formatNumber(
                                    diameter,
                                    0
                                )}
                            </td>

                            <td>
                                ${getPlanetMassInEarths(
                                    planet
                                )}
                            </td>

                            <td>
                                ${formatOrbitalPeriod(
                                    planet.sideralOrbit
                                )}
                            </td>

                            <td>
                                ${planet.moons?.length ?? 0}
                            </td>

                            <td>
                                ${getBodyType(planet)}
                            </td>

                        </tr>
                    `;
                })
                .join("");
    };




    let planetsData = [];


    const showPlanetsLoading = () => {

        if (planetDetailName) {
            planetDetailName.textContent =
                "Loading...";
        }

        if (planetDescription) {
            planetDescription.textContent =
                "Loading planet information...";
        }
    };


    const showPlanetsError = (message) => {

        if (planetDetailName) {
            planetDetailName.textContent =
                "Unable to load";
        }

        if (planetDescription) {
            planetDescription.textContent =
                message ||
                "We couldn't load the planet information right now.";
        }
    };


    const loadPlanets = async () => {

        showPlanetsLoading();

        try {

            const response =
                await fetch(
                    PLANETS_API_URL
                );


            if (!response.ok) {

                throw new Error(
                    `Could not load planet data (${response.status}).`
                );
            }


            const planets =
                await response.json();


            if (!Array.isArray(planets)) {

                throw new Error(
                    "Invalid planet data."
                );
            }


            const filteredPlanets =
                planets
                    .filter(
                        (planet) =>
                            planet.isPlanet === true
                    )
                    .filter(
                        (planet) =>
                            [
                                "Mercury",
                                "Venus",
                                "Earth",
                                "Mars",
                                "Jupiter",
                                "Saturn",
                                "Uranus",
                                "Neptune"
                            ].includes(
                                planet.englishName
                            )
                    );


            if (filteredPlanets.length !== 8) {

                console.warn(
                    "Expected 8 planets, received:",
                    filteredPlanets.length
                );
            }


            if (!filteredPlanets.length) {

                throw new Error(
                    "No planets were found."
                );
            }


            planetsData =
                filteredPlanets;


            renderPlanetComparison(
                planetsData
            );


        

            const activeCard =
                document.querySelector(
                    ".planet-card.active"
                );


            const initialPlanetName =
                activeCard?.dataset.planetId ||
                "earth";


            const initialPlanet =
                planetsData.find(
                    (planet) =>
                        planet.englishName.toLowerCase() ===
                        initialPlanetName.toLowerCase()
                );


            if (initialPlanet) {

                updatePlanetDetails(
                    initialPlanet
                );
            }

        } catch (error) {

            console.error(
                "Planets Error:",
                error
            );

            showPlanetsError(
                error.message
            );
        }
    };


  

    planetCards.forEach((card) => {

        card.addEventListener(
            "click",
            () => {

                const planetId =
                    card.dataset.planetId;


                planetCards.forEach(
                    (planetCard) => {

                        planetCard.classList.remove(
                            "active"
                        );
                    }
                );


                card.classList.add(
                    "active"
                );


                const selectedPlanet =
                    planetsData.find(
                        (planet) =>
                            planet.englishName.toLowerCase() ===
                            planetId.toLowerCase()
                    );


                if (selectedPlanet) {

                    updatePlanetDetails(
                        selectedPlanet
                    );


                    const details =
                        document.querySelector(
                            ".planet-details"
                        );


                    if (details) {

                        details.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }
                }
            }
        );
    });


    

    loadPlanets();

})();