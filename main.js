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
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSizes = 5;

const getNews = async () => {
  try {
    url.searchParams.set("page", page); //&page==page
    url.searchParams.set("pageSize", pageSize);
    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
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

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
  ${errorMessage}
</div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
};

/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}
/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

const paginationRender = () => {
  const totalPages = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSizes);
  let lastPage = pageGroup * groupSizes;
  //마지막 페이지 그룹이 그룹 사이즈보다 작다? lastpage = totalpage
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }

  const firstPage =
    lastPage - (groupSizes - 1) <= 0 ? 1 : lastPage - (groupSizes - 1);

  let paginationHTML = `
  <li class="page-item" onclick="moveToPage(${firstPage})">
        <a class="page-link" href="#">
          <<
        </a>
      </li>

  <li class="page-item" onclick="moveToPage(${page - 1})">
        <a class="page-link" href="#">
          Previous
        </a>
      </li>`;

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? "active" : ""
    }"  onclick="moveToPage(${i})">
        <a class="page-link" href="#">
          ${i}
        </a>
      </li>`;
  }
  paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})">
        <a class="page-link" href="#">
          Next
        </a>
      </li>`;
  paginationHTML += `<li class="page-item" onclick="moveToPage(${lastPage})">
      <a class="page-link" href="#">
        >>
      </a>
    </li>`;
  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  page = pageNum;
  getNews();
};
getLatestNews();

//1. disabled 추가하기
