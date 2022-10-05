const navBtn = document.querySelector(".nav__btn");
const navLinks = document.querySelectorAll(".nav__link");
const nav = document.querySelector(".nav");
function handleNav() {
  nav.classList.toggle("change");
}

navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    nav.classList.remove("change");
  });
});

navBtn.addEventListener("click", handleNav);

// stickyNav

window.addEventListener("scroll", function (e) {
  if (window.scrollY > 0) {
    document.querySelector(".header").classList.add("active");
  } else {
    document.querySelector(".header").classList.remove("active");
  }
});

///search

const searchBtn = document.querySelector(".search__glass-btn--desktop");
const closeBtn = document.querySelector(".search__close-btn");
const searchInput = document.querySelector(".search__input");

searchBtn.addEventListener("click", handleAnimation);

function handleAnimation() {
  searchBtn.previousElementSibling.classList.add("change");
  searchBtn.classList.add("change");
  searchInput.focus();
}

function hideSearchInput(e) {
  e.preventDefault();
  searchBtn.previousElementSibling.classList.remove("change");
  searchBtn.classList.remove("change");
}

closeBtn.addEventListener("click", hideSearchInput);

//search api

const form = document.querySelector(".search");
const moviesContainer = document.querySelector(".movies__container");

const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=7e18ca8d7e31eb72f1b7c353b5881459&page=1`;
const imgPath = `https://image.tmdb.org/t/p/w1280`;
const searchApi = `https://api.themoviedb.org/3/search/movie?api_key=7e18ca8d7e31eb72f1b7c353b5881459&query="`;

getMovies(url);

async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();

  showMovies(data.results);
}

function showMovies(movies) {
  moviesContainer.innerHTML = "";

  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;

    if (!poster_path) {
      return;
    }

    let movieBox = document.createElement("div");
    movieBox.classList.add("movies__movie");

    movieBox.innerHTML = `
    <img
    src="${imgPath + poster_path}"
    alt="${title}"
    class="movies__img"
  />
  <div class="movies__info">
    <h3 class="movies__name">${title}</h3>
    <div class="movies__rate">
      <span class="${getColorClass(vote_average)}">${vote_average}</span>
    </div>
  </div>
  <button class="movies__btn btn-animation">choice</button>
  <p class="movies__overview">
   ${overview}
  </p>
    `;

    moviesContainer.appendChild(movieBox);
  });
}

function getColorClass(value) {
  if (value > 8) {
    return "green";
  } else if (value >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

searchInput.addEventListener("keyup", (e) => {
  e.preventDefault();

  if (searchInput.value) {
    getMovies(searchApi + searchInput.value);
  }
});

/// vertical-slider

const slider = document.querySelector(".slider__container");
const leftSlider = document.querySelector(".slider__left");
const rightSlider = document.querySelector(".slider__right");
const upBtn = document.querySelector(".slider__btn--up");
const downBtn = document.querySelector(".slider__btn--down");

const sliderLength = rightSlider.children.length;

let activeIndex = 0;

leftSlider.style.top = `-${(sliderLength - 1) * 100}vh`;

function changeSlide(direction) {
  const sliderHeight = slider.clientHeight;
  if (direction === "up") {
    activeIndex++;
    if (activeIndex == sliderLength) {
      activeIndex = 0;
    }
  } else if (direction === "down") {
    activeIndex--;
    if (activeIndex == -1) {
      activeIndex = sliderLength - 1;
    }
  }

  rightSlider.style.transform = `translateY(-${activeIndex * sliderHeight}px)`;
  leftSlider.style.transform = `translateY(${activeIndex * sliderHeight}px)`;
}

upBtn.addEventListener("click", function () {
  changeSlide("up");
});
downBtn.addEventListener("click", function () {
  changeSlide("down");
});

//form

const signInBtn = document.querySelector(".login__btn--signin");
const signUpBtn = document.querySelector(".login__btn--signup");
const formWrapper = document.querySelector(".login__wrapper");
const userForm = document.querySelector(".form");

const email = document.querySelector("#email");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const password2 = document.querySelector("#password2");

function checkRequiredFields(inputs) {
  inputs.forEach((input) => {
    if (input.id === "password2") {
      showError(input, `password confirmation is required`);
    } else if (input.value.trim() === "") {
      showError(input, `${input.id} is required`);
    }
  });
}

function checkLength(input, min, max) {
  if (input.value.length < min || input.value.length > max) {
    showError(
      input,
      `${input.id} should be between ${min} and ${max} characters`
    );
  } else {
    showSuccess(input);
  }
}

function checkConfirmed(pass, pass2) {
  if (pass.value !== pass2.value) {
    showError(pass2, "paswords are not the same");
  } else {
    showSuccess(pass2);
  }
}
const checkEmail = (input) => {
  const regEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (regEx.test(input.value.trim())) {
    showSuccess(input);
  } else {
    showError(input, "Email is not valid");
  }
};

function showSuccess(input) {
  input.parentElement.querySelector(".form__message").classList.remove("error");
}

function showError(input, message) {
  const temp = input.parentElement;
  const error = temp.querySelector(".form__message");
  console.log(error);
  error.className = "form__message error";
  error.textContent = message;
}

function clearForm() {
  userForm.reset();
  document.querySelectorAll(".form__message").forEach((el) => {
    el.className = "form__message";
  });
}

signInBtn.addEventListener("click", function () {
  formWrapper.classList.add("change");
  userForm.className = "form form-signin";
  clearForm();
});

signUpBtn.addEventListener("click", function () {
  formWrapper.classList.remove("change");
  userForm.className = "form form-signup";
  clearForm();
});

userForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (userForm.classList[1] === "form-signin") {
    checkRequiredFields([email, password]);
  } else {
    checkLength(username, 5, 15);
    checkLength(password, 10, 25);
    checkConfirmed(password, password2);
    checkRequiredFields([email, username, password, password2]);
  }
  checkEmail(email);
});
