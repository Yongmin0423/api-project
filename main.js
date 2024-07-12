//변수 선언
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

//햄버거 메뉴 사이드 바
/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}
/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

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
      console.log(data.articles);
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

//카테고리 메뉴 클릭 버튼 이벤트
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

//사이드 메뉴에서 클리 버튼 이벤트
sideMenus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);
//서치 버튼 클릭 이벤트
searchButton.addEventListener("click", getSearchNews);

//검색 창 가리기
const onHandleToggle = () => {
  document.querySelector(".search-input").classList.toggle("hidden");
};

const getLatestNews = async () => {
  url = new URL(
    //`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`
    //`https://noona-news-project1.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`
  );
  await getNews();
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(
    //`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`
  );
  page = 1; // 카테고리 변경 시 1페이지로 이동
  await getNews();
  console.log(page);
};

async function getSearchNews(event) {
  event.preventDefault();
  const search = searchInput.value;
  url = new URL(
    //`https://newsapi.org/v2/top-headlines?country=kr&q=${search}&apiKey=${API_KEY}`
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${search}`
  );
  page = 1; // 검색 시 1페이지로 이동
  await getNews();
}

const render = () => {
  let newsHTML = ``;

  newsHTML = newsList
    .map((news) => {
      let descriptionText = news.description;
      let newsImage = news.urlToImage;
      let source = news.source.name;
      let time = news.publishedAt;
      let newsURL = news.url;

      if (descriptionText == null || descriptionText == "") {
        descriptionText = "내용없음";
      } else if (descriptionText.length > 200) {
        descriptionText = descriptionText.substring(0, 200) + "...";
      }

      if (newsImage == null) {
        newsImage =
          "https://raw.githubusercontent.com/charleskim77/NooNa_JavaScript/main/TimesNews-step2/img/Noimage.jpg";
      }

      if (source == null) {
        source = "no resource";
      }
      return `<a href=${newsURL} target="_blank"><div class="row news">
        <div class="col-lg-4 news-img">
          <img
            class="news-img-size"
            src=${newsImage} onerror="this.src='https://raw.githubusercontent.com/charleskim77/NooNa_JavaScript/main/TimesNews-step2/img/Noimage.jpg';"
          />
        </div>
        <div class="col-lg-8 news-content">
          <h2>${news.title}</h2>
          <p>${descriptionText}</p>
          <div>${source}  ${moment(time).fromNow()}</div>
        </div>
      </div></a>`;
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

const paginationRender = () => {
  const totalPages = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSizes);
  let lastPage = pageGroup * groupSizes;
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }

  const firstPage =
    lastPage - (groupSizes - 1) <= 0 ? 1 : lastPage - (groupSizes - 1);

  let paginationHTML = `
  <li class="page-item" onclick="moveToPage(${1})">
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
  paginationHTML += `<li class="page-item" onclick="moveToPage(${totalPages})">
      <a class="page-link" href="#">
        >>
      </a>
    </li>`;
  document.querySelector(".pagination").innerHTML = paginationHTML;

  if (page === 1) {
    document
      .querySelector(".pagination li:first-child")
      .classList.add("hidden");
    document
      .querySelector(".pagination li:nth-child(2)")
      .classList.add("hidden");
  }

  if (page === lastPage) {
    document.querySelector(".pagination li:last-child").classList.add("hidden");
    document
      .querySelector(".pagination li:nth-last-child(2)")
      .classList.add("hidden");
  }
};

const moveToPage = async (pageNum) => {
  page = pageNum;
  await getNews();
};

getLatestNews();
