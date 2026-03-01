let allGames = [];
let filteredGames = [];
let currentPage = 1;
const perPage = 24;

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') 
    .replace(/^-+|-+$/g, '');
}

async function init() {
  const res = await fetch("all_games.json");
  const data = await res.json();
  allGames = data.games.map(game => ({
    id: game.id,
    title: game.title,
    poster: game.poster,
    rating: game.rating,
    platforms: game.platforms,
    discount: game.discount,
    discount_end: game.discount_end,
    price_current_rub: game.price_current_rub,
    price_original_rub: game.price_original_rub,
    slug: slugify(game.title)
  }));
  applyFilters();
}

function applyFilters() {
  const search = document.getElementById("search").value.toLowerCase();
  const platform = document.getElementById("platformFilter").value;
  const sort = document.getElementById("sort").value;
  const onlyDiscount = document.getElementById("onlyDiscount").checked;

  filteredGames = allGames.filter(game => {
    const matchSearch = game.title.toLowerCase().includes(search);
    const matchPlatform = !platform || game.platforms.includes(platform);
    const matchDiscount = !onlyDiscount || game.discount > 0;
    return matchSearch && matchPlatform && matchDiscount;
  });

  if(sort === "discount") filteredGames.sort((a,b) => b.discount - a.discount);
  if(sort === "cheap") filteredGames.sort((a,b) => a.price_current_rub - b.price_current_rub);
  if(sort === "expensive") filteredGames.sort((a,b) => b.price_current_rub - a.price_current_rub);
  if(sort === "rating") filteredGames.sort((a,b) => b.rating - a.rating);

  currentPage = 1;
  render();
}

function render() {
  const start = (currentPage -1) * perPage;
  const end = start + perPage;
  const games = filteredGames.slice(start,end);

  const container = document.getElementById("games");
  container.innerHTML = "";
  games.forEach(game => {
    container.innerHTML += `
      <a href="game.html?slug=${game.slug}" class="card">
        <img src="${game.poster}" loading="lazy">
        <div class="card-body">
          <h3>${game.title}</h3>
          <div class="discount">-${game.discount}%</div>
          <div class="price">${game.price_current_rub} ₽</div>
          <div class="old-price">${game.price_original_rub} ₽</div>
        </div>
      </a>
    `;
  });

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredGames.length / perPage);
  const pag = document.getElementById("pagination");
  pag.innerHTML = "";
  for(let i=1;i<=totalPages;i++) {
    pag.innerHTML += <button onclick="goPage(${i})" class="${i===currentPage?'active':''}">${i}</button>;
  }
}

function goPage(page) {
  currentPage = page;
  render();
  window.scrollTo({top:0,behavior:"smooth"});
}

document.querySelectorAll("input, select").forEach(el => el.addEventListener("input", applyFilters));

init();