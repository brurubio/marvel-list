import '../scss/app.scss';

var md5 = require('md5');

// global variables
var characters = [];
var parsedCharacters = [];
const perPage = 10;
var selectedChar = '';
const numCharListItems = 3;
  
window.back = function () {
  window.location.href = '/';
}

window.mountDetailContent = function () {
  console.log(selectedChar);
  // building header
  let headerTitle = document.getElementsByClassName('character-detail__header__title')[0];
  headerTitle.innerHTML = selectedChar.name;

  // building main detail content
  let detailContent = document.getElementsByClassName('character-detail__content')[0];

  let detailImage = document.createElement("div");
  detailImage.classList.add("character-detail__content__image");
  let imageTag = document.createElement("img");
  let imageUrl = `${selectedChar.thumbnail.path}.${selectedChar.thumbnail.extension}`;
  imageTag.setAttribute("src", imageUrl);

  detailImage.appendChild(imageTag);
  detailContent.appendChild(detailImage);

  let detailInfo = document.createElement("div");
  detailInfo.classList.add("character-detail__content__info");

  let detailContentTitle = document.createElement("h1");
  detailContentTitle.innerHTML = selectedChar.name;
  detailInfo.appendChild(detailContentTitle);

  let detailContentDesc = document.createElement("p");
  detailContentDesc.innerHTML = selectedChar.description;
  detailInfo.appendChild(detailContentDesc);

  detailContent.appendChild(detailInfo);

  // building satistics content
  let statisticsTypes = ['comics', 'events', 'series', 'stories'];

  statisticsTypes.forEach(statistic => {
    let detailContentStatisticHeader = document.createElement("div");
    detailContentStatisticHeader.classList.add(`character-detail__content__${statistic}__header`);
    detailContentStatisticHeader.innerHTML = `<h4> ${statistic} </h4><i class="fa fa-chevron-down"></i>`;

    let detailContentStatisticContent = document.createElement("div");
    detailContentStatisticContent.classList.add(`character-detail__content__${statistic}__content`);
    detailContentStatisticContent.classList.add(`character-detail__content__${statistic}__content--hide`);

    let statisticCount = selectedChar[statistic].returned;

    for (var i = 0; i < statisticCount; i++) {
      let statisticItem = document.createElement("p");
      statisticItem.innerHTML = selectedChar[statistic].items[i].name;
      detailContentStatisticContent.appendChild(statisticItem);
    }

    detailContent.appendChild(detailContentStatisticHeader);
    detailContent.appendChild(detailContentStatisticContent);

    detailContentStatisticHeader.addEventListener('click', () => {  
      if (detailContentStatisticHeader.classList.contains(`character-detail__content__${statistic}__header--active`)) {
        detailContentStatisticHeader.classList.remove(`character-detail__content__${statistic}__header--active`);
        detailContentStatisticContent.classList.add(`character-detail__content__${statistic}__content--hide`);
        detailContentStatisticHeader.innerHTML = `<h4> ${statistic}  </h4><i class="fa fa-chevron-down"></i>`;
        return;
      } 
      detailContentStatisticHeader.classList.add(`character-detail__content__${statistic}__header--active`);
      detailContentStatisticContent.classList.remove(`character-detail__content__${statistic}__content--hide`);
      detailContentStatisticHeader.innerHTML = `<h4> ${statistic} </h4><i class="fa fa-chevron-up"></i>`;
    });
  });
}

// function to mount list content with characters
window.mountListContent = () => {
  parsedCharacters.forEach(function(item) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("id", item.id); 

    card.addEventListener('click', (event) => {  
      let cardElem = event.target;
      if (!cardElem.classList.contains('card')) {
        cardElem = cardElem.closest(".card");
      } 
      handleCardClick(cardElem);
    });
    
    let cardImageDiv = document.createElement("div");
    cardImageDiv.classList.add("card__image");
    
    let cardImage = document.createElement("img");
    let imageUrl = `${item.thumbnail.path}.${item.thumbnail.extension}`;
    cardImage.setAttribute("src", imageUrl);
    
    cardImageDiv.appendChild(cardImage);
    card.appendChild(cardImageDiv); 
    
    let cardContentDiv = document.createElement("div");
    cardContentDiv.classList.add("card__content");
    
    let characterInfo = document.createElement("div");
    characterInfo.classList.add("character-info");

    let characterName = document.createElement("div");
    characterName.classList.add("character-info__name");
    characterName.innerHTML = item.name;
    characterInfo.appendChild(characterName);

    let characterSeries = document.createElement("div");
    characterSeries.classList.add("character-info__series");

    for (var i = 0; i < numCharListItems; i++) {
      if (!item.series.items[i]) {
        continue;
      }
      let serieItem = document.createElement("p");
      serieItem.innerHTML = item.series.items[i].name;
      characterSeries.appendChild(serieItem);
    }

    characterInfo.appendChild(characterSeries);

    let characterEvents = document.createElement("div");
    characterEvents.classList.add("character-info__events");
    
    for (var i = 0; i < 3; i++) {
      if (!item.events.items[i]) {
        continue;
      }
      let eventItem = document.createElement("p");
      eventItem.innerHTML = item.events.items[i].name;
      characterEvents.appendChild(eventItem);
    }

    characterInfo.appendChild(characterEvents);
    
    cardContentDiv.appendChild(characterInfo);
    card.appendChild(cardContentDiv); 
    
    document.getElementById("list").appendChild(card);
  });
}

// function to mount pagination buttons due number of characters
window.mountPagination = function (items = []) {  
  document.getElementById('pag').innerHTML = '';
  let data = items.length > 0
    ? items
    : characters;

  let numPages = Math.ceil(data.length / perPage);
  for (var i = 1; i <= numPages; i++) {
    let btn = document.createElement('button');
    btn.classList.add('pagination__item');

    if (i === 1) {
      btn.classList.add('pagination__item--active');
    }
    
    btn.innerHTML = i;

    btn.addEventListener('click', (event) => {
      let button = event.target;
      let page = button.innerText;
      
      handlePaginateButtonClick(button, page);
    });

    let paginator = document.getElementById('pag');
    paginator.appendChild(btn);
  }
}

// function to search for character name with given value
window.searchData = function () {
  let searchValue = document.getElementById("search-input").value;
  
  if (!searchValue) {
    parsedCharacters = characters;
    mountPagination();
    paginate(1);
    return;
  }
  
  parsedCharacters = [characters
    .find(char => {
      let name = char.name.toLowerCase();
      return name.includes(searchValue);
  })];
  mountPagination(parsedCharacters);
  updateList();
}

// function to update DOM list content 
window.updateList = () => {
  document.getElementById("list").innerHTML = '';
  document.getElementById("search-input").value = '';
  mountListContent();
}

// function to update list content for given page number
window.paginate = function (page) {
  let pageStart = perPage * (page-1);
  
  parsedCharacters = characters.slice(pageStart, pageStart + perPage);
  
  updateList();
}

// function to handle pagination button click
window.handlePaginateButtonClick = function (button, page) {
  let activeBtn = document.getElementsByClassName('pagination__item--active')[0];
  activeBtn.classList.remove('pagination__item--active');

  button.classList.add("pagination__item--active");
  paginate(page);
}

// function to handle card click
window.handleCardClick = function (cardElem) {
  let id = cardElem.id;
  let selectedChar = characters.find(char => char.id.toString() === id);
  window.location.href = window.location.pathname + 'detail.html?id=' + selectedChar.id;
}

// function to load list data from API
window.loadAPIContent = async function () {
  let ts = Math.random();
  let publicKey = '7f373b34961bfd5de08cd7a71ea9ee83';
  let privateKey = '2573b736f8215b89e3ff93a4da91bba8651fd348';
  let hash = md5(ts+privateKey+publicKey);
  let url = `http://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
  let response = await fetch(url);
  response = await response.json();
  characters = response.data.results;
  parsedCharacters = characters;
}

// function to load data from API by given ID
window.loadAPIById = async function (id) {
  let ts = Math.random();
  let publicKey = '7f373b34961bfd5de08cd7a71ea9ee83';
  let privateKey = '2573b736f8215b89e3ff93a4da91bba8651fd348';
  let hash = md5(ts+privateKey+publicKey);
  let url = `http://gateway.marvel.com/v1/public/characters/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
  let response = await fetch(url);
  response = await response.json();
  selectedChar = response.data.results[0];
}

// function when page load
window.onload = async function () { 
  // load content for detail route
  if (/detail/.test(window.location.href)) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')
    await this.loadAPIById(id);
    this.mountDetailContent();
    return;
  }

  // load content for main route
  await this.loadAPIContent()
    .then(() => {
      this.mountPagination();
      this.paginate(1);
    });
}