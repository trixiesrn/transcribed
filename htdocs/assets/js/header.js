// Create header
const header = document.createElement("header");
header.innerHTML = `
   <div class="p-dashboard__header">
            <p class="p-dashboard__header__text">transcribed</p>
        </div>
        <div class="p-dashboard__header__user-details">
            <p id="user-name">Trixie L. Soriano</p>
            <p id="user-email" style="display:none;"></p>
            <img id="user-photo" src="./assets/img/dashboard/icon-user.svg" alt="User Photo" class="p-dashboard__content__message__user-details__img">
        </div>
`;

// Optionally add some styling
header.className = 'p-dashboard__header';

// const nav = header.querySelector("d");
// nav.style.listStyle = "none";
// nav.style.display = "flex";
// nav.style.gap = "1rem";

// Append to container or body
document.getElementById("container").appendChild(header);
