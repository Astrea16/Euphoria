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
    _slideToggle(currentElement.nextElementSibling);
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
  if (targetElement.closest("[data-tabs-button]")) {
    const currentElement = targetElement.closest("[data-tabs-button]");
    setTab(currentElement);
  }
  if (targetElement.closest(".form-sign-in__code")) {
    const formSignInInput = document.querySelector(".form-sign-in__input");
    if (formSignInInput.getAttribute("type") === "password") {
      formSignInInput.setAttribute("type", "text");
      targetElement.closest(".form-sign-in__code").textContent = "Hide";
      targetElement;
    } else {
      formSignInInput.setAttribute("type", "password");
      targetElement.closest(".form-sign-in__code").textContent = " To show";
    }
  }
}
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-da="item,2,992"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle
(function () {
  let originalPositions = [];
  let daElements = document.querySelectorAll("[data-da]");
  let daElementsArray = [];
  let daMatchMedia = [];
  //Заполняем массивы
  if (daElements.length > 0) {
    let number = 0;
    for (let index = 0; index < daElements.length; index++) {
      const daElement = daElements[index];
      const daMove = daElement.getAttribute("data-da");
      if (daMove != "") {
        const daArray = daMove.split(",");
        const daPlace = daArray[1] ? daArray[1].trim() : "last";
        const daBreakpoint = daArray[2] ? daArray[2].trim() : "767";
        const daType = daArray[3] === "min" ? daArray[3].trim() : "max";
        const daDestination = document.querySelector("." + daArray[0].trim());
        if (daArray.length > 0 && daDestination) {
          daElement.setAttribute("data-da-index", number);
          //Заполняем массив первоначальных позиций
          originalPositions[number] = {
            parent: daElement.parentNode,
            index: indexInParent(daElement),
          };
          //Заполняем массив элементов
          daElementsArray[number] = {
            element: daElement,
            destination: document.querySelector("." + daArray[0].trim()),
            place: daPlace,
            breakpoint: daBreakpoint,
            type: daType,
          };
          number++;
        }
      }
    }
    dynamicAdaptSort(daElementsArray);

    //Создаем события в точке брейкпоинта
    for (let index = 0; index < daElementsArray.length; index++) {
      const el = daElementsArray[index];
      const daBreakpoint = el.breakpoint;
      const daType = el.type;

      daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
      daMatchMedia[index].addListener(dynamicAdapt);
    }
  }
  //Основная функция
  function dynamicAdapt(e) {
    for (let index = 0; index < daElementsArray.length; index++) {
      const el = daElementsArray[index];
      const daElement = el.element;
      const daDestination = el.destination;
      const daPlace = el.place;
      const daBreakpoint = el.breakpoint;
      const daClassname = "_dynamic_adapt_" + daBreakpoint;

      if (daMatchMedia[index].matches) {
        //Перебрасываем элементы
        if (!daElement.classList.contains(daClassname)) {
          let actualIndex = indexOfElements(daDestination)[daPlace];
          if (daPlace === "first") {
            actualIndex = indexOfElements(daDestination)[0];
          } else if (daPlace === "last") {
            actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
          }
          daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
          daElement.classList.add(daClassname);
        }
      } else {
        //Возвращаем на место
        if (daElement.classList.contains(daClassname)) {
          dynamicAdaptBack(daElement);
          daElement.classList.remove(daClassname);
        }
      }
    }
    //customAdapt();
  }

  //Вызов основной функции
  dynamicAdapt();

  //Функция возврата на место
  function dynamicAdaptBack(el) {
    const daIndex = el.getAttribute("data-da-index");
    const originalPlace = originalPositions[daIndex];
    const parentPlace = originalPlace["parent"];
    const indexPlace = originalPlace["index"];
    const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
    parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
  }
  //Функция получения индекса внутри родителя
  function indexInParent(el) {
    var children = Array.prototype.slice.call(el.parentNode.children);
    return children.indexOf(el);
  }
  //Функция получения массива индексов элементов внутри родителя
  function indexOfElements(parent, back) {
    const children = parent.children;
    const childrenArray = [];
    for (let i = 0; i < children.length; i++) {
      const childrenElement = children[i];
      if (back) {
        childrenArray.push(i);
      } else {
        //Исключая перенесенный элемент
        if (childrenElement.getAttribute("data-da") == null) {
          childrenArray.push(i);
        }
      }
    }
    return childrenArray;
  }
  //Сортировка объекта
  function dynamicAdaptSort(arr) {
    arr.sort(function (a, b) {
      if (a.breakpoint > b.breakpoint) {
        return -1;
      } else {
        return 1;
      }
    });
    arr.sort(function (a, b) {
      if (a.place > b.place) {
        return 1;
      } else {
        return -1;
      }
    });
  }
  //Дополнительные сценарии адаптации
  function customAdapt() {
    //const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  }
})();
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

// SPOLLERS
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
          _slideUp(filterTitle.nextElementSibling);
          filterTitle.classList.remove("active");
        } else {
          _slideDown(filterTitle.nextElementSibling);
          filterTitle.classList.add("active");
        }
      });
    }
  }
}
const spollersArray = document.querySelectorAll("[data-spollers]");
if (spollersArray.length > 0) {
  // Получение обычных слойлеров
  const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
    return !item.dataset.spollers.split(",")[0];
  });
  // Инициализация обычных слойлеров
  if (spollersRegular.length > 0) {
    initSpollers(spollersRegular);
  }

  // Получение слойлеров с медиа запросами
  const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
    return item.dataset.spollers.split(",")[0];
  });

  // Инициализация слойлеров с медиа запросами
  if (spollersMedia.length > 0) {
    const breakpointsArray = [];
    spollersMedia.forEach((item) => {
      const params = item.dataset.spollers;
      const breakpoint = {};
      const paramsArray = params.split(",");
      breakpoint.value = paramsArray[0];
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
      breakpoint.item = item;
      breakpointsArray.push(breakpoint);
    });

    // Получаем уникальные брейкпоинты
    let mediaQueries = breakpointsArray.map(function (item) {
      return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
    });
    mediaQueries = mediaQueries.filter(function (item, index, self) {
      return self.indexOf(item) === index;
    });

    // Работаем с каждым брейкпоинтом
    mediaQueries.forEach((breakpoint) => {
      const paramsArray = breakpoint.split(",");
      const mediaBreakpoint = paramsArray[1];
      const mediaType = paramsArray[2];
      const matchMedia = window.matchMedia(paramsArray[0]);

      // Объекты с нужными условиями
      const spollersArray = breakpointsArray.filter(function (item) {
        if (item.value === mediaBreakpoint && item.type === mediaType) {
          return true;
        }
      });
      // Событие
      matchMedia.addListener(function () {
        initSpollers(spollersArray, matchMedia);
      });
      initSpollers(spollersArray, matchMedia);
    });
  }
  // Инициализация
  function initSpollers(spollersArray, matchMedia = false) {
    spollersArray.forEach((spollersBlock) => {
      spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
      if (matchMedia.matches || !matchMedia) {
        spollersBlock.classList.add("_init");
        initSpollerBody(spollersBlock);
        spollersBlock.addEventListener("click", setSpollerAction);
      } else {
        spollersBlock.classList.remove("_init");
        initSpollerBody(spollersBlock, false);
        spollersBlock.removeEventListener("click", setSpollerAction);
      }
    });
  }
  // Работа с контентом
  function initSpollerBody(spollersBlock, hideSpollerBody = true) {
    const spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
    if (spollerTitles.length > 0) {
      spollerTitles.forEach((spollerTitle) => {
        if (hideSpollerBody) {
          spollerTitle.removeAttribute("tabindex");
          if (!spollerTitle.classList.contains("_active")) {
            spollerTitle.nextElementSibling.hidden = true;
          }
        } else {
          spollerTitle.setAttribute("tabindex", "-1");
          spollerTitle.nextElementSibling.hidden = false;
        }
      });
    }
  }
  function setSpollerAction(e) {
    const el = e.target;
    if (el.hasAttribute("data-spoller") || el.closest("[data-spoller]")) {
      const spollerTitle = el.hasAttribute("data-spoller") ? el : el.closest("[data-spoller]");
      const spollersBlock = spollerTitle.closest("[data-spollers]");
      const oneSpoller = spollersBlock.hasAttribute("data-one-spoller") ? true : false;
      if (!spollersBlock.querySelectorAll("._slide").length) {
        if (oneSpoller && !spollerTitle.classList.contains("_active")) {
          hideSpollersBody(spollersBlock);
        }
        spollerTitle.classList.toggle("_active");
        _slideToggle(spollerTitle.nextElementSibling, 500);
      }
      e.preventDefault();
    }
  }
  function hideSpollersBody(spollersBlock) {
    const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._active");
    if (spollerActiveTitle) {
      spollerActiveTitle.classList.remove("_active");
      _slideUp(spollerActiveTitle.nextElementSibling, 500);
    }
  }
}
//=================
//SlideToggle
let _slideUp = (target, duration = 500) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = target.offsetHeight + "px";
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = true;
      target.style.removeProperty("height");
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
    }, duration);
  }
};
let _slideDown = (target, duration = 500) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    if (target.hidden) {
      target.hidden = false;
    }
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
    }, duration);
  }
};
let _slideToggle = (target, duration = 500) => {
  if (target.hidden) {
    return _slideDown(target, duration);
  } else {
    return _slideUp(target, duration);
  }
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

//Tabs
//tabElement таб на якому клік відбувся
function setTab(tabElement) {
  /*табів на сторінкі може бути багато, тому одержуємо батьківський елемент*/
  const tabsParent = tabElement.closest("[data-tabs]");
  /*
   В батьківському елементі будемо шукати всі кнопки tabsButtons - колекція всіх кнопок
   І для того щоб визначити порядковий номер переводимо колекцію в масив за допомогою Array.from
	*/
  const tabsButtons = Array.from(tabsParent.querySelectorAll("[data-tabs-button]"));
  /*
 в масиві через indexOf шукаємо натиснутий елемент tabElement і indexOf повертає нам порядковий номер кнопки, в данному випадку у нас це li
 */
  const tabsActiveButton = tabsParent.querySelector("[data-tabs-button].active");

  tabsActiveButton.classList.remove("active");
  tabElement.classList.add("active");

  const currentButtonIndex = tabsButtons.indexOf(tabElement);
  const tabsElements = tabsParent.querySelectorAll("[data-tabs-element]");
  tabsElements.forEach((tabsElement) => {
    tabsElement.hidden = true;
  });
  tabsElements[currentButtonIndex].hidden = false;
}
//quantity
let quantityButtons = document.querySelectorAll(".quantity__button");
if (quantityButtons.length > 0) {
  for (let index = 0; index < quantityButtons.length; index++) {
    const quantityButton = quantityButtons[index];
    quantityButton.addEventListener("click", function (e) {
      let value = parseInt(quantityButton.closest(".quantity").querySelector("input").value);
      if (quantityButton.classList.contains("quantity__button--plus")) {
        value++;
      } else {
        value = value - 1;
        if (value < 1) {
          value = 1;
        }
      }
      quantityButton.closest(".quantity").querySelector("input").value = value;
    });
  }
}
