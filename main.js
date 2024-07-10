const API_KEY = `8b29827c21c24c2a90a7231a1761642c`;
let newsList = [];
const searchIcon = document.getElementById("search-icon");
const searchInput = document.getElementById("news-search");
const menus = document.querySelectorAll(".menus button");
const sideMenus = document.querySelectorAll(".sidenav button");
const searchButton = document.querySelector(".search-input button");
let url = new URL(
  `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
);

const getNews = async () => {
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
};

menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

sideMenus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

searchButton.addEventListener("click", getSearchNews);

function onHandleToggle() {
  document.querySelector(".search-input").classList.toggle("hidden");
}

const getLatestNews = () => {
  url = new URL(
    //`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`
    //`https://noona-news-project1.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`
  );
  getNews();
};
getLatestNews();
const getNewsByCategory = (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(
    //`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`
  );
  getNews();
};

async function getSearchNews(event) {
  event.preventDefault();
  const search = searchInput.value;
  url = new URL(
    //`https://newsapi.org/v2/top-headlines?country=kr&q=${search}&apiKey=${API_KEY}`
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${search}`
  );
  getNews();
}

const render = () => {
  let newsHTML = ``;

  newsHTML = newsList
    .map((news) => {
      let descriptionText = news.description;
      let newsImage = news.urlToImage;
      let source = news.source.name;
      let time = news.publishedAt;

      if (descriptionText == null || descriptionText == "") {
        descriptionText = "내용없음";
      } else if (descriptionText.length > 200) {
        descriptionText = descriptionText.substring(0, 200) + "...";
      }

      if (newsImage == null) {
        newsImage =
          "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo-available_87543-11093.jpg";
      }

      if (source == null) {
        source = "no resource";
      }
      return `<div class="row news">
        <div class="col-lg-4 news-img">
          <img
            class="news-img-size"
            src=${newsImage}
          />
        </div>
        <div class="col-lg-8 news-content">
          <h2>${news.title}</h2>
          <p>${descriptionText}</p>
          <div>${source}  ${moment(time).fromNow()}</div>
        </div>
      </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}
/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
