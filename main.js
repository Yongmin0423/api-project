const API_KEY = `8b29827c21c24c2a90a7231a1761642c`;
let newsList = [];
const searchIcon = document.getElementById("search-icon");
const searchInput = document.getElementById("search-input");

function onHandleToggle() {
  document.querySelector(".search-input").classList.toggle("hidden");
}

const getLatestNews = async () => {
  const url = new URL(
    //`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}` 기존
    //`http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines`
    `https://noona-news-project1.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
  console.log("dddd", newsList);
};
getLatestNews();

/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}
/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

const render = () => {
  let newsHTML = ``;

  newsHTML = newsList
    .map((news) => {
      let descriptionText = news.description;
      let newsImage = news.urlToImage;
      let source = news.source.name;
      let time = news.publishedAt;
      console.log(time);

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
