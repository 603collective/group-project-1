let searchable = [
    "Acadia",
    "American Samoa",
    "arches",
    "badlands",
    "big bend",
    "biscayne",
    "black canyon of the gunnison",
    "bryce canyon",
    "canyonlands",
    "capitol Reef",
    "Carlsbad Caverns",
    "channel islands",
    "congaree",
    "crater lake",
    "Cuyahoga valley",
    "death valley",
    "Denali",
    "dry tortugas",
    "everglades",
    "gates of the arctic",
    "gateway arch",
    "glacier",
    "glacier bay",
    "grand canyon",
    "grand teton",
    "great basin",
    "great sand dunes",
    "great smokey mountains",
    "Guadalupe mountains",
    "haleakala",
    "hawaii volcanos",
    "hot springs",
    "indiana dunes",
    "isle royale",
    "joshua tree",
    "katmai",
    "kenai fjords",
    "kings canyon",
    "Kobuk valley",
    "lake clark",
    "lassen volcanic",
    "mammoth cave",
    "mesa verde",
    "mount rainier",
    "new river gorge",
    "north cascades",
    "olympic",
    "petrified forest",
    "pinnacles",
    "redwood",
    "rocky mountain",
    "saguaro",
    "sequoia",
    "shenandoah",
    "theodore Roosevelt",
    "virgin islands",
    "voyageurs",
    "white sands",
    "wind cave",
    "wrangell",
    "yellowstone",
    "yosemite",
    "zion",
  ];
  
  const searchInput = document.getElementById('search');
  const searchWrapper = document.querySelector('.wrapper');
  const resultsWrapper = document.querySelector('.results');
  
  searchInput.addEventListener('keyup', () => {
    let results = [];
    let input = searchInput.value;
    if (input.length) {
      results = searchable.filter((item) => {
        return item.toLowerCase().includes(input.toLowerCase());
      });
    }
    renderResults(results);
  });
  
  function renderResults(results) {
    if (!results.length) {
      return searchWrapper.classList.remove('show');
    }
  
    const content = results
      .map((item) => {
        return `<li>${item}</li>`;
      })
      .join('');
  
    searchWrapper.classList.add('show');
    resultsWrapper.innerHTML = `<ul>${content}</ul>`;
  }