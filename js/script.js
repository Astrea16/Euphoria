//Суворий режим
"use strict";

document.addEventListener("click", documentActions);

function documentActions(e) {
  const targetElement = e.target;
  if (targetElement.closest(".icon-menu")) {
    document.body.classList.toggle("menu-open");
  }
  if (targetElement.closest("[data-spoller]")) {
    const currentElement = targetElement.closest("[data-spoller]");
    if (!currentElement.nextElementSibling.classList.contains("--sliding")) {
      currentElement.classList.toggle("active");
    }
    slideToggle(currentElement.nextElementSibling);
    /*
    if (currentElement.nextElementSibling.hidden === true) {
      currentElement.nextElementSibling.hidden = false;
    } else {
      currentElement.nextElementSibling.hidden = true;
		верхній запис рівнозначний цьому
    }
	 */
  }
  if (targetElement.closest(".rating__input")) {
    const currentElement = targetElement.closest("rating__input");
    const rating = currentElement.closest(".rating");
    if (rating.classList.contains("rating--set")) {
      starRatingGet(rating, currentElement);
    }
  }
}

//Rating
const ratings = document.querySelectorAll("[data-rating]");
if (ratings) {
  ratings.forEach((rating) => {
    const currentValue = +rating.dataset.rating;
    currentValue ? starRatingSet(rating, currentValue) : null;
  });
}

function starRatingGet(rating, currentElement) {
  const ratingValue = +currentElement.value;
  // Тут відправка оцінки (ratingValue) на бекенд...
  // Уявімо, що ми отримали середню оцінку 3.2
  const resultRating = 3.2;
  starRatingSet(rating, resultRating);
}
function starRatingSet(rating, value) {
  const ratingItems = rating.querySelectorAll(".rating__item");
  const resultFullItems = parseInt(value);
  const resultPartItem = value - resultFullItems;

  ratingItems.forEach((ratingItem, index) => {
    ratingItem.classList.remove("active");
    ratingItem.querySelector("span") ? ratingItems[index].querySelector("span").remove() : null;

    if (index <= resultFullItems - 1) {
      ratingItem.classList.add("active");
    }
    if (index === resultFullItems && resultPartItem) {
      ratingItem.insertAdjacentHTML("beforeend", `<span style="width:${resultPartItem * 100}%"></span>`);
    }
  });
}

//Spoller
const spollers = document.querySelectorAll("[data-spoller]");

if (spollers.length) {
  spollers.forEach((spoller) => {
    spoller.dataset.spoller !== "open"
      ? (spoller.nextElementSibling.hidden = true)
      : spoller.classList.add("active");
  });
  //Filter
  // Відслідковування брейкпойнту
  const filterTitle = document.querySelector(".filter__title");
  if (filterTitle) {
    const breakPointValue = filterTitle.dataset.spollerMedia;
    const breakPoint = breakPointValue
      ? `(${breakPointValue.split(",")[0]}-width:${breakPointValue.split(",")[1]}px)`
      : null;
    if (breakPoint) {
      //matchMiedia спрацювує коли відбуваеться breakPoint і ми передаємо цей рядок з breakPoint
      const matchMedia = window.matchMedia(breakPoint);
      //тепер на matchMedia вішаємо прослуховувч change і дальші функція стрілочна
      matchMedia.addEventListener("change", (e) => {
        const isTrue = e.matches;
        if (isTrue) {
          slideUp(filterTitle.nextElementSibling);
          filterTitle.classList.remove("active");
        } else {
          slideDown(filterTitle.nextElementSibling);
          filterTitle.classList.add("active");
        }
      });
    }
  }
}
let slideDown = (target, duration = 500) => {
  if (!target.classList.contains("--sliding")) {
    target.classList.add("--sliding");
    target.hidden = false;
    let height = target.offsetHeight;

    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;

    target.style.overflow = "hidden";
    target.style.height = 0;

    target.offsetHeight;

    target.style.transitionProperty = `height, margin, padding`;
    target.style.transitionDuration = `${duration}ms`;

    target.style.height = `${height}px`;

    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-bottom");
    target.style.removeProperty("margin-top");

    setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("--sliding");
    }, duration);
  }
};
let slideUp = (target, duration = 500) => {
  if (!target.classList.contains("--sliding")) {
    target.classList.add("--sliding");
    let height = target.offsetHeight;

    target.style.transitionProperty = `height, margin, padding`;
    target.style.transitionDuration = `${duration}ms`;
    target.style.height = `${height}px`;

    target.offsetHeight;

    target.style.overflow = "hidden";
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;

    target.style.height = 0;

    setTimeout(() => {
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-bottom");
      target.style.removeProperty("margin-top");

      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("--sliding");

      target.hidden = true;
    }, duration);
  }
};
let slideToggle = (target, duration = 500) => {
  target.hidden ? slideDown(target, duration) : slideUp(target, duration);
};

//Slider
const heroSlider = document.querySelector(".hero");
if (heroSlider) {
  new Swiper(".hero", {
    // Optional parameters
    loop: true,
    autoHeight: true,
    speed: 800,
    parallax: true,

    // If we need pagination
    pagination: {
      el: ".hero__pagination",
      clickable: true,
    },

    // Navigation arrows
    navigation: {
      nextEl: ".hero__arrow--next",
      prevEl: ".hero__arrow--prev",
    },
  });
}

const arrivalSlider = document.querySelector(".arrival");
if (arrivalSlider) {
  new Swiper(".arrival__slider", {
    // Optional parameters
    loop: true,
    autoHeight: true,
    speed: 800,
    parallax: true,
    spaceBetween: 38,
    slidesPerView: 4,
    // Navigation arrows
    navigation: {
      nextEl: ".arrival__arrow--next",
      prevEl: ".arrival__arrow--prev",
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1.5,
        spaceBetween: 15,
      },
      480: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      // when window width is >= 480px
      650: {
        slidesPerView: 3,
        spaceBetween: 25,
      },
      // when window width is >= 640px
      991: {
        slidesPerView: 4,
        spaceBetween: 38,
      },
    },
  });
}
/*-------------------------------------------------------------------------------------------*/
const reviewsSlider = document.querySelector(".reviews");
if (reviewsSlider) {
  new Swiper(".reviews__slider", {
    // Optional parameters
    loop: true,
    speed: 800,
    parallax: true,
    spaceBetween: 23,
    slidesPerView: 3,

    // If we need pagination
    pagination: {
      el: ".reviews__pagination",
      clickable: true,
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1.3,
        spaceBetween: 15,
      },
      480: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      // when window width is >= 480px
      650: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      // when window width is >= 640px
      991: {
        slidesPerView: 3,
        spaceBetween: 23,
      },
    },
  });
}

/*-------------------------------------------------------------------------------------------*/
const mainProduct = document.querySelector(".main-product");
if (mainProduct) {
  const mainProductSliderImages = document.querySelectorAll(".main-product__slider img");
  let mainProductThumbSlider;

  if (mainProductSliderImages.length) {
    const productImagesBlock = document.querySelector(".main-product__images");
    let mainProductThumbSliderTemplate = `<div class="main-product__thumb-slider thumb-slider">`;
    mainProductThumbSliderTemplate += `<div class="thumb-slider__slider swiper">`;
    mainProductThumbSliderTemplate += `<div class="thumb-slider__wrapper swiper-wrapper">`;
    mainProductSliderImages.forEach((mainProductSliderImage) => {
      const srcImage = mainProductSliderImage.getAttribute("src").replace("/slider/", "/slider/thumbs/");
      mainProductThumbSliderTemplate += `<div class="thumb-slider__slide swiper-slide">
				<img src="${srcImage}" class="thumb-slider__image" alt="Image">
			</div>`;
    });
    mainProductThumbSliderTemplate += `</div>`;
    mainProductThumbSliderTemplate += `</div>`;
    mainProductThumbSliderTemplate += `<div class="thumb-slider__arrows">`;
    mainProductThumbSliderTemplate += `
			<button type="button" class="thumb-slider__arrow thumb-slider__arrow--up _icon-ch-up"></button>
			<button type="button" class="thumb-slider__arrow thumb-slider__arrow--down _icon-ch-down"></button>
		`;
    mainProductThumbSliderTemplate += `</div>`;
    mainProductThumbSliderTemplate += `</div>`;

    productImagesBlock.insertAdjacentHTML("afterbegin", mainProductThumbSliderTemplate);

    mainProductThumbSlider = new Swiper(".thumb-slider__slider", {
      // Optional parameters
      loop: true,
      direction: "vertical",
      spaceBetween: 20,
      // autoHeight: true,
      speed: 800,
      slidesPerView: 3,
    });
  }

  const mainProductSlider = new Swiper(".main-product__slider", {
    // Optional parameters
    loop: true,
    // direction: "vertical",
    autoHeight: true,
    // Navigation arrows
    navigation: {
      nextEl: ".thumb-slider__arrow--down",
      prevEl: ".thumb-slider__arrow--up",
    },
    keyboard: {
      enabled: true,
    },
    speed: 800,
    spaceBetween: 0,
    slidesPerView: 1,
    thumbs: {
      swiper: mainProductThumbSlider,
    },
  });
}
/*-------------------------------------------------------------------------------------------*/
//Filter
/*-------------------------------------------------------------------------------------------*/
//Price
const filterRange = document.querySelector(".price-filter__range");
if (filterRange) {
  const filterRangeFrom = document.querySelector(".price-filter__input--from");
  const filterRangeTo = document.querySelector(".price-filter__input--to");
  noUiSlider.create(filterRange, {
    start: [0, 100],
    connect: true,
    range: {
      min: 0,
      max: 100,
    },
    format: wNumb({
      decimals: 0,
      thousand: "",
      prefix: "$",
    }),
  });
  filterRange.noUiSlider.on("update", function (values, handle) {
    filterRangeFrom.value = values[0];
    filterRangeTo.value = values[1];
  });
  filterRangeFrom.addEventListener("change", function () {
    filterRange.noUiSlider.setHandle(0, filterRangeFrom.value);
  });
  filterRangeTo.addEventListener("change", function () {
    filterRange.noUiSlider.setHandle(0, filterRangeTo.value);
  });
}

//Catalog

const catalogItems = document.querySelector(".catalog__items");
if (catalogItems) {
  loadProducts();
}

async function loadProducts() {
  //fetch -запит на сервер- первий параметр в "",
  //другий параметр це всякі налаштування
  const response = await fetch("json/products.json", {
    method: "GET",
  });
  //Перевіряємо response.ok і отримуємо дані з цього файлу в const
  if (response.ok) {
    const responseData = await response.json();
    //і передаємо дані в функцію
    initProducts(responseData);
  }
}
function initProducts(data) {
  const productsList = data.products;
  if (productsList.length) {
    //Створюємо пусту зміну і циклом наповнюємо її. Цикл буде скільки скільки карток в json
    let productTemplate = ``;
    productsList.forEach((productItem) => {
      productTemplate += `<article class="item-product">`;
      productTemplate += `<a href="#" class="item-product__favorite ${
        productItem.favorite ? "item-product__favorite--active" : null
      }  _icon-favorit"></a>`;
      //Робимо перевірку чи є такий елемент
      if (productItem.image) {
        productTemplate += `<a href="${productItem.url}" class="item-product__picture-link">`;
        productTemplate += `<img src="${productItem.image}" class="item-product__image" alt="Image">`;
        productTemplate += `</a>`;
      }
      productTemplate += `<div class="item-product__body">`;
      productTemplate += `<h4 class="item-product__title">`;
      productTemplate += `<a href="${productItem.url}" class="item-product__link-title">${productItem.title}</a>`;
      productTemplate += `</h4>`;
      if (productItem.label) {
        productTemplate += `<div class="item-product__label">${productItem.label}</div>`;
      }
      productTemplate += `<div class="item-product__price">${productItem.price}</div>`;
      productTemplate += `</div>`;
      productTemplate += `</article>`;
    });
    //В  catalogItems виводимо  productTemplate
    catalogItems.innerHTML = productTemplate;
  }
}
