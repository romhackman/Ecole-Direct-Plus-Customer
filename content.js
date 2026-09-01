(() => {
    "use strict";

    const CUSTOMIZER_ID = "customizer";
    const POPUP_ID = "customizer-popup";
    const STORAGE_KEY = "ecole-directe-customizer";

    let settings = loadSettings();

    /*
     * =================================================
     * STOCKAGE
     * =================================================
     */

    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return {
                    firstName: null,
                    lastName: null,
                    hideLastName: false,
                    imageURL: null
                };
            }

            return {
                firstName: null,
                lastName: null,
                hideLastName: false,
                imageURL: null,
                ...JSON.parse(saved)
            };

        } catch (error) {
            console.warn(
                "[Customizer] Impossible de charger les réglages.",
                error
            );

            return {
                firstName: null,
                lastName: null,
                hideLastName: false,
                imageURL: null
            };
        }
    }


    function saveSettings() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(settings)
            );
        } catch (error) {
            console.warn(
                "[Customizer] Impossible de sauvegarder les réglages.",
                error
            );
        }
    }


    /*
     * =================================================
     * ÉCHAPPEMENT HTML
     * =================================================
     */

    function escapeHTML(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /*
     * =================================================
     * RÉCUPÉRATION DU COMPTE
     * =================================================
     */

    function getAccountData() {

        const activeAccount =
            document.querySelector("#active-account");

        if (!activeAccount) {
            return null;
        }

        const profilePicture =
            activeAccount.querySelector(".profile-picture");

        const schoolName =
            activeAccount.querySelector(".school-name");

        const firstName =
            activeAccount.querySelector(".first-name");

        const lastName =
            activeAccount.querySelector(".last-name");

        const className =
            activeAccount.querySelector(".class");


        return {
            activeAccount,

            profilePicture,

            school:
                schoolName
                    ? schoolName.textContent.trim()
                    : "",

            firstName:
                firstName
                    ? firstName.textContent.trim()
                    : "",

            lastName:
                lastName
                    ? lastName.textContent.trim()
                    : "",

            className:
                className
                    ? className.textContent.trim()
                    : ""
        };
    }


    /*
     * =================================================
     * OBTENIR LA VALEUR À AFFICHER
     * =================================================
     */

    function getFirstName(data) {
        if (
            settings.firstName !== null &&
            settings.firstName !== undefined
        ) {
            return settings.firstName;
        }

        return data.firstName;
    }


    function getLastName(data) {
        if (
            settings.lastName !== null &&
            settings.lastName !== undefined
        ) {
            return settings.lastName;
        }

        return data.lastName;
    }


    /*
     * =================================================
     * PHOTO
     * =================================================
     */

    function getImageURL(data) {

        if (
            settings.imageURL &&
            settings.imageURL.trim() !== ""
        ) {
            return settings.imageURL.trim();
        }

        if (data.profilePicture) {
            return data.profilePicture.src;
        }

        return "";
    }


    /*
     * =================================================
     * APPLIQUER LES MODIFICATIONS AU SITE
     * =================================================
     */

    function applySettings() {

        const data = getAccountData();

        if (!data) {
            return;
        }


        /*
         * PRÉNOM
         */

        const firstNameElement =
            data.activeAccount.querySelector(".first-name");

        if (firstNameElement) {

            firstNameElement.textContent =
                getFirstName(data);

        }


        /*
         * NOM
         */

        const lastNameElement =
            data.activeAccount.querySelector(".last-name");

        if (lastNameElement) {

            lastNameElement.textContent =
                getLastName(data);

            if (settings.hideLastName) {

                lastNameElement.style.display =
                    "none";

            } else {

                lastNameElement.style.display =
                    "";

            }

        }


        /*
         * PHOTO
         */

        const imageURL =
            getImageURL(data);

        const profilePicture =
            data.activeAccount.querySelector(
                ".profile-picture"
            );

        if (
            profilePicture &&
            imageURL
        ) {

            profilePicture.src =
                imageURL;

        }
    }


    /*
     * =================================================
     * OUVRIR LA POPUP
     * =================================================
     */

    function openPopup() {

        createPopup();

        const popup =
            document.getElementById(POPUP_ID);

        if (!popup) {
            return;
        }

        requestAnimationFrame(() => {

            popup.classList.add("visible");

        });

        const firstInput =
            popup.querySelector(
                "#customizer-first-name"
            );

        if (firstInput) {
            firstInput.focus();
        }
    }


    /*
     * =================================================
     * FERMER LA POPUP
     * =================================================
     */

    function closePopup() {

        const popup =
            document.getElementById(POPUP_ID);

        if (!popup) {
            return;
        }

        popup.classList.remove("visible");

        setTimeout(() => {

            popup.remove();

        }, 150);

        document.removeEventListener(
            "keydown",
            handleEscape
        );
    }


    /*
     * =================================================
     * ÉCHAP
     * =================================================
     */

    function handleEscape(event) {

        if (event.key === "Escape") {

            closePopup();

        }
    }


    /*
     * =================================================
     * CRÉER LA POPUP
     * =================================================
     */

    function createPopup() {

        if (
            document.getElementById(POPUP_ID)
        ) {
            return;
        }


        const data =
            getAccountData();

        if (!data) {

            console.warn(
                "[Customizer] #active-account introuvable."
            );

            return;
        }


        const currentFirstName =
            getFirstName(data);

        const currentLastName =
            getLastName(data);

        const currentImage =
            getImageURL(data);


        /*
         * =================================================
         * OVERLAY
         * =================================================
         */

        const overlay =
            document.createElement("div");

        overlay.id =
            POPUP_ID;


        /*
         * =================================================
         * HTML
         * =================================================
         */

        overlay.innerHTML = `
            <div
                class="customizer-popup-box"
                role="dialog"
                aria-modal="true"
                aria-labelledby="customizer-popup-title"
            >

                <button
                    class="customizer-popup-close"
                    type="button"
                    aria-label="Fermer"
                >
                    ×
                </button>


                <h2 id="customizer-popup-title">
                    Customizer
                </h2>


                <!-- ============================== -->
                <!-- COMPTE                          -->
                <!-- ============================== -->

                <div class="customizer-account">

                    <div class="customizer-account-header">


                        <div class="customizer-profile-container">

                            <img
                                class="customizer-profile-picture"
                                src="${escapeHTML(currentImage)}"
                                alt="Photo de profil"
                            >

                        </div>


                        <div class="customizer-account-info">

                            <span class="customizer-school-name">
                                ${escapeHTML(data.school)}
                            </span>

                            <span class="customizer-name">

                                <span
                                    class="customizer-first-name-preview"
                                >
                                    ${escapeHTML(currentFirstName)}
                                </span>

                                <span
                                    class="customizer-last-name-preview"
                                    style="${settings.hideLastName ? "display:none;" : ""}"
                                >
                                    ${escapeHTML(currentLastName)}
                                </span>

                            </span>

                            <span class="customizer-class">
                                ${escapeHTML(data.className)}
                            </span>

                        </div>

                    </div>

                </div>


                <div class="customizer-divider"></div>


                <!-- ============================== -->
                <!-- PRÉNOM                          -->
                <!-- ============================== -->

                <div class="customizer-field">

                    <label
                        for="customizer-first-name"
                    >
                        Prénom
                    </label>

                    <input
                        id="customizer-first-name"
                        type="text"
                        value="${escapeHTML(currentFirstName)}"
                        placeholder="${escapeHTML(data.firstName)}"
                        autocomplete="off"
                    >

                </div>


                <!-- ============================== -->
                <!-- NOM                             -->
                <!-- ============================== -->

                <div class="customizer-field">

                    <label
                        for="customizer-last-name"
                    >
                        Nom
                    </label>

                    <input
                        id="customizer-last-name"
                        type="text"
                        value="${escapeHTML(currentLastName)}"
                        placeholder="${escapeHTML(data.lastName)}"
                        autocomplete="off"
                    >

                </div>


                <!-- ============================== -->
                <!-- MASQUER LE NOM                  -->
                <!-- ============================== -->

                <label class="customizer-checkbox">

                    <input
                        id="customizer-hide-last-name"
                        type="checkbox"
                        ${settings.hideLastName ? "checked" : ""}
                    >

                    <span>
                        Masquer le nom
                    </span>

                </label>


                <!-- ============================== -->
                <!-- IMAGE                            -->
                <!-- ============================== -->

                <div class="customizer-field">

                    <label
                        for="customizer-image-url"
                    >
                        Image de profil
                    </label>

                    <input
                        id="customizer-image-url"
                        type="url"
                        value="${escapeHTML(settings.imageURL || "")}"
                        placeholder="https://exemple.com/image.jpg"
                        autocomplete="off"
                    >

                    <small>
                        Laisse vide pour utiliser l'image
                        originale.
                    </small>

                </div>


                <!-- ============================== -->
                <!-- ACTIONS                          -->
                <!-- ============================== -->

                <div class="customizer-actions">

                    <button
                        type="button"
                        id="customizer-reset"
                        class="customizer-button secondary"
                    >
                        Réinitialiser
                    </button>

                    <button
                        type="button"
                        id="customizer-save"
                        class="customizer-button primary"
                    >
                        Enregistrer
                    </button>

                </div>


            </div>
        `;


        document.body.appendChild(
            overlay
        );


        /*
         * =================================================
         * FERMER
         * =================================================
         */

        const closeButton =
            overlay.querySelector(
                ".customizer-popup-close"
            );

        closeButton.addEventListener(
            "click",
            closePopup
        );


        /*
         * CLIC EN DEHORS
         */

        overlay.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === overlay
                ) {

                    closePopup();

                }

            }
        );


        /*
         * =================================================
         * ÉCHAP
         * =================================================
         */

        document.addEventListener(
            "keydown",
            handleEscape
        );


        /*
         * =================================================
         * ÉLÉMENTS
         * =================================================
         */

        const firstNameInput =
            overlay.querySelector(
                "#customizer-first-name"
            );

        const lastNameInput =
            overlay.querySelector(
                "#customizer-last-name"
            );

        const hideLastNameInput =
            overlay.querySelector(
                "#customizer-hide-last-name"
            );

        const imageURLInput =
            overlay.querySelector(
                "#customizer-image-url"
            );

        const firstNamePreview =
            overlay.querySelector(
                ".customizer-first-name-preview"
            );

        const lastNamePreview =
            overlay.querySelector(
                ".customizer-last-name-preview"
            );

        const imagePreview =
            overlay.querySelector(
                ".customizer-profile-picture"
            );


        /*
         * =================================================
         * APERÇU PRÉNOM
         * =================================================
         */

        firstNameInput.addEventListener(
            "input",
            () => {

                firstNamePreview.textContent =
                    firstNameInput.value;

            }
        );


        /*
         * =================================================
         * APERÇU NOM
         * =================================================
         */

        lastNameInput.addEventListener(
            "input",
            () => {

                lastNamePreview.textContent =
                    lastNameInput.value;

            }
        );


        /*
         * =================================================
         * APERÇU MASQUAGE NOM
         * =================================================
         */

        hideLastNameInput.addEventListener(
            "change",
            () => {

                lastNamePreview.style.display =
                    hideLastNameInput.checked
                        ? "none"
                        : "";

            }
        );


        /*
         * =================================================
         * APERÇU IMAGE
         * =================================================
         */

        imageURLInput.addEventListener(
            "input",
            () => {

                const url =
                    imageURLInput.value.trim();

                if (!url) {

                    imagePreview.src =
                        data.profilePicture
                            ? data.profilePicture.src
                            : "";

                    return;

                }

                imagePreview.src =
                    url;

            }
        );


        /*
         * =================================================
         * ERREUR IMAGE
         * =================================================
         */

        imagePreview.addEventListener(
            "error",
            () => {

                imagePreview.classList.add(
                    "image-error"
                );

            }
        );

        imagePreview.addEventListener(
            "load",
            () => {

                imagePreview.classList.remove(
                    "image-error"
                );

            }
        );


        /*
         * =================================================
         * ENREGISTRER
         * =================================================
         */

        const saveButton =
            overlay.querySelector(
                "#customizer-save"
            );

        saveButton.addEventListener(
            "click",
            () => {

                settings.firstName =
                    firstNameInput.value.trim();

                settings.lastName =
                    lastNameInput.value.trim();

                settings.hideLastName =
                    hideLastNameInput.checked;

                settings.imageURL =
                    imageURLInput.value.trim();


                saveSettings();

                applySettings();

                closePopup();

                console.log(
                    "[Customizer] Réglages enregistrés."
                );

            }
        );


        /*
         * =================================================
         * RÉINITIALISER
         * =================================================
         */

        const resetButton =
            overlay.querySelector(
                "#customizer-reset"
            );

        resetButton.addEventListener(
            "click",
            () => {

                settings = {
                    firstName: null,
                    lastName: null,
                    hideLastName: false,
                    imageURL: null
                };

                saveSettings();

                /*
                 * Recharge la page pour récupérer
                 * complètement les données originales.
                 */

                location.reload();

            }
        );
    }


    /*
     * =================================================
     * CRÉER LE BOUTON CUSTOMIZER
     * =================================================
     */

    function createCustomizer() {

        const optionsWrapper =
            document.querySelector(
                "#options-wrapper"
            );

        if (!optionsWrapper) {
            return;
        }


        const animationWrapper =
            optionsWrapper.querySelector(
                ".animation-wrapper"
            );

        if (!animationWrapper) {
            return;
        }


        const optionsContainer =
            animationWrapper.querySelector(
                ".options-container"
            );

        if (!optionsContainer) {
            return;
        }


        const links =
            optionsContainer.querySelector(
                ".links"
            );

        if (!links) {
            return;
        }


        /*
         * Évite les doublons
         */

        if (
            links.querySelector(
                `#${CUSTOMIZER_ID}`
            )
        ) {
            return;
        }


        /*
         * =================================================
         * BOUTON
         * =================================================
         */

        const customizer =
            document.createElement("a");

        customizer.id =
            CUSTOMIZER_ID;

        customizer.href =
            "#";

        customizer.tabIndex = 0;


        customizer.innerHTML = `
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 35 35"
                fill="none"
                aria-hidden="true"
            >

                <path
                    d="M17.5 4L20.9 12.1L29.5 12.8L23 18.4L25 27L17.5 22.5L10 27L12 18.4L5.5 12.8L14.1 12.1L17.5 4Z"
                    class="extension-icon-path"
                    stroke-width="2"
                    stroke-linejoin="round"
                ></path>

            </svg>

            <span class="link-text">
                Customizer
            </span>
        `;


        /*
         * =================================================
         * CLIC
         * =================================================
         */

        customizer.addEventListener(
            "click",
            (event) => {

                event.preventDefault();
                event.stopPropagation();

                openPopup();

            }
        );


        /*
         * =================================================
         * CLAVIER
         * =================================================
         */

        customizer.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    openPopup();

                }

            }
        );


        /*
         * =================================================
         * AJOUT
         * =================================================
         */

        links.appendChild(
            customizer
        );


        console.log(
            "[Customizer] Bouton ajouté avec succès."
        );
    }


    /*
     * =================================================
     * INITIALISATION
     * =================================================
     */

    createCustomizer();


    /*
     * Applique les réglages sauvegardés
     */

    applySettings();


    /*
     * =================================================
     * OBSERVER
     * =================================================
     */

    const observer =
        new MutationObserver(
            () => {

                createCustomizer();

            }
        );


    observer.observe(
        document.documentElement,
        {
            childList: true,
            subtree: true
        }
    );


    /*
     * =================================================
     * TENTATIVES SUPPLÉMENTAIRES
     * =================================================
     */

    setTimeout(
        () => {
            createCustomizer();
            applySettings();
        },
        500
    );

    setTimeout(
        () => {
            createCustomizer();
            applySettings();
        },
        1000
    );

    setTimeout(
        () => {
            createCustomizer();
            applySettings();
        },
        2000
    );

    setTimeout(
        () => {
            createCustomizer();
            applySettings();
        },
        4000
    );

})();
