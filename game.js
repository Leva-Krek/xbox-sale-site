async function loadGame() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  const res = await fetch("all_games.json");
  const data = await res.json();
  const games = data.games.map(game => ({...game, slug: game.title.toLowerCase().replace(/[^a-z0-9]+/g,'-')}));
  const game = games.find(g => g.slug === slug);
  if(!game) return;

  document.title = game.title + " купить со скидкой";

  document.querySelector('meta[property="og:title"]').content = game.title;
  document.querySelector('meta[property="og:description"]').content = Купить ${game.title} за ${game.price_current_rub} ₽;
  document.querySelector('meta[property="og:image"]').content = game.poster;

  document.getElementById("game").innerHTML = `
    <div class="game-page">
      <img src="${game.poster}">
      <div class="info">
        <h1>${game.title}</h1>
        <div class="rating">⭐️ ${game.rating}</div>
        <div class="discount-big">-${game.discount}%</div>
        <div class="price-big">${game.price_current_rub} ₽</div>
        <div class="old-price">${game.price_original_rub} ₽</div>
        <div id="timer"></div>
      </div>
    </div>
  `;

  startTimer(game.discount_end);

  const telegramNick = "yourusername";
  const text = Хочу купить ${game.title} за ${game.price_current_rub} ₽;
  document.getElementById("buyBtn").href = https://t.me/${telegramNick}?text=${encodeURIComponent(text)};
}

function startTimer(endDate) {
  const timer = document.getElementById("timer");

  function update() {
    const diff = new Date(endDate) - new Date();
    if(diff <= 0){ timer.innerHTML="Скидка закончилась"; return; }
    const d = Math.floor(diff/(1000*60*60*24));
    const h = Math.floor(diff/(1000*60*60)%24);
    const m = Math.floor(diff/(1000*60)%60);
    timer.innerHTML = До конца скидки: ${d}д ${h}ч ${m}м;
  }

  setInterval(update,60000);
  update();
}

loadGame();