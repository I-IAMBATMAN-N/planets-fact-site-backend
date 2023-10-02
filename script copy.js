"use strict";

const navItems = document.querySelectorAll(".main-nav--item");
const mainNav = document.querySelector(".main-nav");
const navBtn = document.querySelector(".main-nav--btn");

const secNavItems = document.querySelectorAll(".secondary-nav--item");
let secNavItemActive;

const img = document.querySelector(".img-container img");
const img2 = img.nextElementSibling;

const headingPrimary = document.querySelector(".heading-primary");
const planetInfoText = document.querySelector(".planet-info--text");
const planetInfoLink = document.querySelector(".planet-info--link a");

const planetParameters = document.querySelectorAll(
  ".planet-parameters--parameter"
);

let planetData = {};

function navBtnListener() {
  navBtn.addEventListener("click", function (e) {
    // console.log(this);
    mainNav.classList.toggle("active");
  });
}

function mobileNavItemsListener() {
  navItems.forEach((item) => {
    item.addEventListener("touchstart", function () {
      // console.log("mobile", this);
      mainNav.classList.toggle("active");
    });
  });
}

function resetSecondaryNav() {
  secNavItems.forEach((item, index) => {
    if (item.classList.contains("active")) {
      item.classList.remove("active");
      item.style.backgroundColor = "var(--color-background)";
    }
    if (index === 0) {
      // console.log(index);
      item.classList.add("active");
    }
  });
  // console.log(headingPrimary.innerText.toLowerCase());
  secNavItemActive = document.querySelector(".secondary-nav--item.active");
  setColor(secNavItemActive);
  // secNavItems[secNavItems.length].classList.add("active");
}

function setColor(item) {
  if (window.innerWidth > 420) {
    // console.log("background");
    secNavItems.forEach((navItem) => {
      navItem.style.backgroundColor = `var(--color-background)`;
    });
    item.style.backgroundColor = `var(--color-${headingPrimary.innerText.toLowerCase()})`;
  } else if (window.innerWidth <= 420) {
    // console.log("box shadow");
    secNavItems.forEach((navItem) => {
      navItem.style.boxShadow = `none`;
    });
    item.style.boxShadow = `inset 0px -0.4rem 0rem 0rem var(--color-${headingPrimary.innerText.toLowerCase()})`;
  }
}

//
function mainNavListener() {
  function changePageContent(planet) {
    console.log("PLANET FRONTEND", planet);
    //
    const { rotation, revolution, radius, temperature } = planet;
    const parameters = [rotation, revolution, radius, temperature];
    //
    // display image
    img.setAttribute("src", `${planet.images.planet}`);
    // display main heading
    headingPrimary.innerText = planet.name;
    //display panet info text
    planetInfoText.innerText = planet.overview.content;
    //display Wikipedia link source
    planetInfoLink.setAttribute("href", `${planet.overview.source}`);
    //display planet parameters
    planetParameters.forEach((parameter, index) => {
      parameter.children[1].innerText = parameters[index];
    });
  }

  navItems.forEach((navItem) => {
    navItem.addEventListener("click", function (e) {
      //
      const getPlanet = async (name) => {
        const initial = await fetch(`http://127.0.0.1:5000/api/v1/${name}`);
        const data = initial.json();

        return data;
      };

      const planetName = e.target.innerText.toLowerCase();

      getPlanet(planetName).then((planet) => {
        //
        planetData = planet.data;

        changePageContent(planet.data);

        resetSecondaryNav();
        //
        img2.style.display = "none";
      });
    });
  });
}

function secNavListener() {
  function changeSectionContent(planet, thisText) {
    //
    console.log("changeSectionContent - planet", planet);
    //
    let textString;
    let sourceString;
    const headingText = headingPrimary.innerText.toLowerCase();
    //
    if (headingText === planet.name.toLowerCase()) {
      if (thisText.search("overview") >= 0) {
        img.setAttribute("src", `${planet.images.planet}`);
        img2.style.display = "none";

        textString = planet.overview.content;
        sourceString = planet.overview.source;

        // console.log("overview");
      } else if (thisText.search("structure") >= 0) {
        img.setAttribute("src", `${planet.images.internal}`);
        img2.style.display = "none";

        textString = planet.structure.content;
        sourceString = planet.structure.source;

        // console.log("structure");
      } else if (thisText.search("surface") >= 0) {
        img.setAttribute("src", `${planet.images.planet}`);
        img2.style.display = "block";

        img2.setAttribute("src", `${planet.images.geology}`);

        textString = planet.geology.content;
        sourceString = planet.geology.source;
      }
      planetInfoText.innerText = textString;
      planetInfoLink.setAttribute("href", `${sourceString}`);
    }
  }
  //
  secNavItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      //
      // reset active state
      secNavItems.forEach((item) => {
        // item.style.backgroundColor = `var(--color-background)`;
        if (item.classList.contains("active")) {
          item.classList.remove("active");
        }
        event.target.closest(".secondary-nav--item").classList.add("active");
        setColor(event.target.closest(".secondary-nav--item"));
      });
      //
      const thisText = String(this.innerText).toLowerCase();
      //
      // console.log("planetData", planetData);
      //
      changeSectionContent(planetData, thisText);
    });
  });
}

window.addEventListener("load", function () {
  resetSecondaryNav();
  navBtnListener();
  mobileNavItemsListener();

  //
  mainNavListener();

  //
  secNavListener();
});
