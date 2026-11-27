let archiveData = [];
let currentCategory = null;

// Hardkodirani opisi publikacija (dodaj nove ključeve po istom obrascu)
const fallbackDescriptions = {
  illustrierte: {
    title: "Illustrierte Österreichische Riviera-Zeitung (1904.-1906.)",
    descriptionHtml: `
                <p>Illustrierte Österreichische Riviera-Zeitung (Ilustrirane novine Austrijske rivijere) su prve istarske novine koje su služile turističkoj promidžbi istočnojadranske obale (imale su podnaslov: "Organ za lječilišne i privredne interese Dalmacije, Istre i Trsta"). Izlazile su na njemačkom jeziku, najprije u Puli (od 15. 4. 1904. do ožujka 1905.), a nakon toga u Opatiji (do rujna 1906.). Izdavač i glavni urednik bio je Friedrich J. Weiss, a odgovorni urednici Ferdinand Štěpánek i Alfred Hartmann. Komisijski nakladnik bila je pulska Knjižara F. W. Schrinner (“Schrinnersche Buchhandlung”). Izlazile su uz novčanu potporu države.</p>
                <p>Izlazile su tjedno, odnosno – češće – dvaput mjesečno kao dvobroj, u formatu: 23 x 30 cm. Imale su razmjerno visoku nakladu od 2.500 primjeraka te su, unatoč visokoj cijeni, bile najtiražnija njemačkojezična periodična publikacija u Istri. U Puli su tiskane u tiskari Schrinner, a zatim u Opatiji u tiskari "V. Tomičić i dr."</p>
                <p>Glavna svrha lista bilo je informiranje potencijalnih gostiju iz Monarhije i inozemstva o prirodnim, kulturnim i turističko-lječilišnim sadržajima Istre i Dalmacije. Objavljivani su prilozi o povijesti, privredi, etnografiji, turističko-lječilišnim mogućnostima i prirodnim ljepotama Istre i Dalmacije, te o kulturi i sportu, uz brojne reklamne oglase. Posebna rubrika bila je posvećena književnosti, čemu je namijenjen veći prostor, zbog čega ove novine možemo odrediti kao turističko-literarne.</p>
                <p><strong>Literatura:</strong> Dobrić, Bruno, Novine i časopisi na njemačkom jeziku u Istri (1871. - 1918.) : Pula, Opatija, Brijuni, Pula : Istarski ogranak Društva hrvatskih književnika, 2016.</p>
            `,
  },
  brioni: {
    title: "Brioni Insel-Zeitung (1910.-1914.)",
    descriptionHtml: `
                <p>Brioni Insel-Zeitung izlazio je na otočju Brijuni (Brioni) kao tjednik (od sredine veljače do kraja listopada), odnosno tijekom ostalog dijela godine kao mjesečnik. Izdavao ga je austrijski industrijalac Paul Kupelwieser (Beč, 1843.-1919.), koji je od 1893. bio vlasnik tog otočja.</p>
                <p>List je izlazio od 6. 2. 1910. do 8. 3. 1914., na njemačkom jeziku. Uredništvo je bilo na otoku Veli Brijun, a izdavač lista bio je „Gutsdirektion Brioni“ (Uprava posjeda na Brijunima). Urednici su bili Otto Buchbaum, a od 31. 1. 1913. S. O. Fangor.</p>
                <p>Tiskan je u 800-1000 primjeraka u pulskoj tiskari „Adolf Fischer e C.“, a od 1913. kod Herrmanstorfera u Trstu. Imao je 12 stranica, a sadržavao je brojne fotografije i druge ilustracije.</p>
                <p><em>mr. sc. Bruno Dobrić</em></p>
            `,
  },
  giornaletto: {
    title: "Il Giornaletto di Pola (1900-1909)",
    descriptionHtml: `
                <p>Il Giornaletto di Pola, pulski dnevnik na talijanskom jeziku, izlazio je 1900–1915. i 1918–1920. Osnovao ga je, po uzoru na tršćanski Il Piccolo, talijanski novinar Giovanni Timeus, direktor lista. Urednici su bili A. Rinaldi, E. Godas, V. Venier, F. Manzutto i G. Salata. Bio je blizak vladajućoj talijanskoj građanskoj liberalnoj stranci, braneći talijanske nacionalne interese u Puli i Istri, zbog čega se sukobio s hrvatskim i njemačkim, ali i socijalističkim i klerikalnim strankama i novinama.</p>
            `,
  },
  istarskarijec: {
    title: "Istarska riječ (1923.-1929.)",
    descriptionHtml: `
                <p>List istarskih Hrvata i Slovenaca pod talijanskom vlašću, koji je pod imenom "Istarska riječ : glasilo za narodne i gospodarske interese" izlazio u Trstu kao tjednik od 2. kolovoza 1923. do 20. lipnja 1929. godine. Zamijenio je ugasli "Pučki prijatelj" te je s "Istarskom riječi" nastavljeno izlaženje novina na hrvatskom jeziku. List su osnovali i pokrenuli predstavnici hrvatske i slovenske manjine u Julijskoj krajini u okviru političkog društva "Edinost", i imao je za cilj prvenstveno zaštitu prava nacionalnih manjina. "Istarska riječ" se zalagala za prosvjetno-kulturni i ekonomski razvoj istarskog sela. Pisala je o političkim pitanjima, a stalne su rubrike bile posvećene gospodarstvu, prosvjeti i kulturi, događajima u Istri i u svijetu. Veliki prostor je bio posvećen književnim prilozima (romani i priče u nastavcima, poezija), a objavljivani su i tekstovi o značajnim osobama iz istarske i hrvatske povijesti. List je, također, pružao seljacima pravne i praktične savjete. Prvi je urednik bio Ivan Zuccon, nakon kojega list uređuje Ernest Radetić (od veljače 1925.). Od 1926. odgovorni je urednik bio Milan Banić, a zatim od kolovoza 1926. do gašenja 1929. Ivan Marija Čok. Za vrijeme talijanske fašističke vlasti novine su često bile zaplijenjivane, a u lipnju 1929. vlasti su zabranile izlaženje "Istarske riječi".</p>
                <p><strong>Literatura:</strong></p>
                <p>1. Istarska enciklopedija, Zagreb : Leksikografski zavod Miroslav Krleža, 2005.</p>
                <p>2. Radetić, Ernest, Istra pod Italijom : 1918.-1943., Zagreb : [s. n.], 1944.</p>
            `,
  },
  lazione: {
    title: "L'Azione (1919.-1922.)",
    descriptionHtml: `
                <p>Dnevne novine "L'Azione : quotidiano della Venezia Giulia" izlazile su u Puli od 17. travnja 1919. do 28. listopada 1922. godine. Pokrenute su nakon dolaska talijanskih vlasti u Pulu, kao novine koje su zastupale umjerene talijanske nacionalističke i liberalne krugove. Prvi je urednik bio Giovanni Timeus, a od 1921. Pio Riego Gambini. List je izlazio svakodnevno, osim ponedjeljkom, na četiri stranice. U njemu su se pratili politički događaji u Italiji, Europi i svijetu, ali je veliki prostor bio posvećen lokalnim i regionalnim temama, osobito gospodarskoj i društvenoj situaciji u Puli i Istri nakon Prvoga svjetskog rata (problem nezaposlenosti, prenamjena pulskog arsenala, obnova gospodarstva, školstvo, kultura, sport). Novine su imale i bogat kulturni i književni podlistak. Dolaskom fašista na vlast u Italiji u listopadu 1922., list prestaje izlaziti.</p>
                <p><strong>Literatura:</strong></p>
                <p>1. Istarska enciklopedija, Zagreb : Leksikografski zavod Miroslav Krleža, 2005.</p>
                <p>2. Gombač, Boris, La stampa quotidiana e periodica italiana in Istria (1918-1945), u: Atti, sv. 23, Rovinj-Trst, 1993.</p>
            `,
  },
  hrvatski_list: {
    title: "Hrvatski list (1915.-1918.)",
    descriptionHtml: `
                <p>Prvi hrvatski dnevnik u Istri, "Hrvatski list", izlazio je u Puli od 1. srpnja 1915. do 11. studenoga 1918. godine. Pokrenut je nakon što je u svibnju 1915. zbog ratnih prilika prestala izlaziti "Naša sloga", a pokrenuli su ga članovi Narodnog doma u Puli i vodstvo Hrvatsko-slovenske narodne stranke. Prvi glavni urednik bio je Josip Grašić, a odgovorni urednik Ante Juretić; kasnije su list uređivali i Matko Laginja, Vjekoslav Spinčić te drugi istaknuti istarski narodnjaci. Tiskan je u tiskari "Josip Krmpotić" u Puli. Izlazio je svakodnevno, u početku na četiri, a kasnije zbog ratne nestašice papira na dvije stranice. Unatoč strogoj ratnoj cenzuri, "Hrvatski list" je imao golemo značenje za informiranje hrvatskog stanovništva u Istri tijekom Prvoga svjetskog rata, donoseći vijesti s bojišta, iz Monarhije i iz Istre, te prateći rad Jugoslavenskog kluba u bečkom parlamentu i zbivanja oko raspada Austro-Ugarske Monarhije. U zadnjim danima izlaženja, u listopadu i studenome 1918., detaljno je pratio osnivanje Narodnog vijeća SHS i predaju austrougarske flote u Puli, sve dok talijanske okupacijske vlasti nisu zabranile njegovo izlaženje.</p>
                <p><strong>Literatura:</strong></p>
                <p>1. Istarska enciklopedija, Zagreb : Leksikografski zavod Miroslav Krleža, 2005.</p>
                <p>2. Šetić, Nevio, Istra između tradicionalnog i modernog, Pazin : Naša sloga, 1995.</p>
            `,
  },
  arena: {
    title: "L'Arena di Pola (1945.-1947.)",
    descriptionHtml: `
                <p>Dnevni list "L'Arena di Pola" počeo je izlaziti u Puli 29. srpnja 1945. godine, u vrijeme savezničke anglo-američke vojne uprave (Zona A Julijske krajine), kao glasilo talijanskog stanovništva u Puli koje se zalagalo za ostanak grada u sastavu Italije. Pokrenuli su ga članovi pulskog Komiteta nacionalnog oslobođenja (CLN), a prvi glavni urednik bio je Guido Miglia. List je izlazio svakodnevno, donoseći političke komentare, vijesti iz grada i okolice, kulturne i sportske priloge te intenzivno prateći mirovne pregovore o sudbini Istre i Pule. Nakon potpisivanja Mirovnog ugovora u Parizu u veljači 1947., kojim je Pula pripala Jugoslaviji, list je pratio masovni odlazak (egzodus) talijanskog stanovništva iz Pule. Posljednji broj u Puli izašao je 13. svibnja 1947. godine, nakon čega je redakcija preseljena u Goricu, a potom u Trst, gdje "L'Arena di Pola" nastavlja izlaziti kao glasilo istarskih esula.</p>
                <p><strong>Literatura:</strong></p>
                <p>1. Istarska enciklopedija, Zagreb : Leksikografski zavod Miroslav Krleža, 2005.</p>
            `,
  },
  istra: {
    title: "Istra (1929.-1940.)",
    descriptionHtml: `
                <p>Tjednik "Istra : glasilo hrvatskih i slovenskih emigranata iz Julijske krajine" izlazio je u Zagrebu od 1. veljače 1929. do 20. rujna 1940. godine. Pokrenulo ga je društvo istarskih, tršćanskih, goričkih i riječkih emigranata u Kraljevini Jugoslaviji kako bi okupljalo izbjeglice iz Julijske krajine, čuvalo njihovu nacionalnu svijest i informiralo domaću i međunarodnu javnost o teškom položaju Hrvata i Slovenaca pod talijanskom fašističkom vlašću. Među glavnim urednicima i suradnicima bili su istaknuti istarski intelektualci i političari u emigraciji, poput Ernesta Radetića, Ivana Marije Čoka, Mate Balote (Mije Mirkovića), Ive Mihovilovića i drugih. Osim političkih tekstova i vijesti iz Istre, list je objavljivao bogate priloge o istarskoj povijesti, književnosti, folkloru i gospodarstvu. Zbog vanjskopolitičkih pritisaka Italije na Kraljevinu Jugoslaviju, vlasti su ga 1940. godine zabranile.</p>
                <p><strong>Literatura:</strong></p>
                <p>1. Istarska enciklopedija, Zagreb : Leksikografski zavod Miroslav Krleža, 2005.</p>
                <p>2. Radetić, Ernest, Istra pod Italijom : 1918.-1943., Zagreb : [s. n.], 1944.</p>
            `,
  },
  corriere: {
    title: "Corriere Istriano (1925.-1945.)",
    descriptionHtml: `
                <p>Dnevne novine "Corriere Istriano" izlazile su u Puli od 1. siječnja 1925. do 28. travnja 1945. godine kao službeno glasilo Fašističke stranke (PNF) za Istarsku pokrajinu. Nastale su spajanjem ranijih lokalnih fašističkih i nacionalističkih listova te su tijekom dvadeset godina bile jedini dnevni list u Puli i glavni instrument fašističke propagande i talijanizacije Istre. Unatoč snažnoj ideološkoj obojenosti, "Corriere Istriano" predstavlja važan povijesni izvor za proučavanje svakodnevnog života, komunalnog razvoja, gospodarstva, urbanizma, kulture i sporta u Puli i Istri u međuratnom razdoblju i tijekom Drugoga svjetskog rata. List je prestao izlaziti neposredno prije oslobođenja Pule u svibnju 1945. godine.</p>
                <p><strong>Literatura:</strong></p>
                <p>1. Istarska enciklopedija, Zagreb : Leksikografski zavod Miroslav Krleža, 2005.</p>
            `,
  },
  polaer: {
    title: "Polaer Tagblatt (1905.-1918.)",
    descriptionHtml: `
                <p>"Polaer Tagblatt" bio je najznačajniji i najdugovječniji dnevni list na njemačkom jeziku u Puli i Istri. Izlazio je od 1. siječnja 1905. do 31. listopada 1918. godine, kao nastavak ranijeg lista "Polaer Morgenblatt" (1904.). Budući da je Pula bila glavna ratna luka Austro-Ugarske Monarhije s brojnim časnicima, mornarima, državnim službenicima i radnicima njemačkoga govornog područja, list je imao široku čitateljsku publiku. Izdavač i tiskar bio je Josip Krmpotić, a među urednicima se isticao Oskar Schalek. "Polaer Tagblatt" je donosio opširne vijesti iz Monarhije i svijeta, lokalnu kroniku, izvještaje o radu ratne mornarice i Arsenala, kulturne i kazališne recenzije, oglase te feljtone. Tijekom Prvoga svjetskog rata bio je glavni izvor ratnih vijesti za njemačkojezično stanovništvo Pule, a prestao je izlaziti raspadom Austro-Ugarske Monarhije krajem listopada 1918. godine.</p>
                <p><strong>Literatura:</strong></p>
                <p>1. Dobrić, Bruno, Novine i časopisi na njemačkom jeziku u Istri (1871. - 1918.) : Pula, Opatija, Brijuni, Pula : Istarski ogranak Društva hrvatskih književnika, 2016.</p>
            `,
  },
  nasa_sloga: {
    title: "Naša sloga (1870.-1915.)",
    descriptionHtml: `
                <p>"Naša sloga" bile su prve hrvatske novine u Istri i temeljno glasilo hrvatskoga narodnog preporoda na istarskom poluotoku. Pokrenute su u Trstu 1. lipnja 1870. godine na poticaj biskupa Jurja Dobrile, Antuna Karabaića, Mate Bastijana i drugih istarskih preporoditelja, s podnaslovom "Poučni, gospodarski i politički list". U Trstu je list izlazio do 1899. godine (najprije polumjesečno, zatim tjedno), a od 1900. do svibnja 1915. godine izlazio je u Puli (tjedno, a povremeno i dvaput tjedno), gdje ga je tiskala i izdavala Hrvatska tiskara Josipa Krmpotića. Među najpoznatijim urednicima bili su Lovro Testen, Matko Mandić, Antun Kalac, Matko Laginja i drugi. "Naša sloga" je odigrala presudnu ulogu u buđenju nacionalne svijesti, borbi za ravnopravnost hrvatskog jezika u školama, uredima i Istarskom saboru, te u prosvjećivanju i gospodarskom uzdizanju istarskog sela. Prestala je izlaziti u svibnju 1915. godine zbog ulaska Italije u Prvi svjetski rat i ratnih ograničenja.</p>
                <p><strong>Literatura:</strong></p>
                <p>1. Istarska enciklopedija, Zagreb : Leksikografski zavod Miroslav Krleža, 2005.</p>
                <p>2. Bratulić, Josip, Naša sloga 1870.-1915., Pazin : Istarsko književno društvo "Juraj Dobrila", 1995.</p>
            `,
  },
};

const icons = {
  NOVINE:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>',
  ČASOPISI:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  GODIŠNJACI:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  "OSTALA GRAĐA":
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
};

const pubSelect = document.getElementById("pubSelect");
const yearSelect = document.getElementById("yearSelect");
const issueSelect = document.getElementById("issueSelect");
const openPdfBtn = document.getElementById("openPdfBtn");

function getFallbackInfo(pubName) {
  if (!pubName) return null;
  const normalize = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");

  const normPub = normalize(pubName);
  const keys = Object.keys(fallbackDescriptions).sort(
    (a, b) => b.length - a.length,
  );

  for (const key of keys) {
    if (normPub.includes(normalize(key))) {
      return fallbackDescriptions[key];
    }
  }
  return null;
}

function switchTab(tabId) {
  document
    .querySelectorAll(".view-section")
    .forEach((sec) => sec.classList.remove("active"));
  document
    .querySelectorAll(".nav-btn")
    .forEach((btn) => btn.classList.remove("active"));

  document.getElementById(`tab-${tabId}`).classList.add("active");
  const activeBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
  if (activeBtn) activeBtn.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function init() {
  try {
    const res = await fetch("/api/archive");
    const data = await res.json();
    archiveData = data.categories || data;

    if (data.stats && data.stats.issues > 0) {
      document.getElementById("statPubs").textContent = data.stats.publications;
      document.getElementById("statIssues").textContent =
        data.stats.issues.toLocaleString("hr-HR");
    }

    renderCategoryCards();
  } catch (err) {
    console.error("Greška pri dohvaćanju arhive:", err);
  }
}

function renderCategoryCards() {
  const homeContainer = document.getElementById("homeCategoriesContainer");
  const gradjaContainer = document.getElementById("gradjaCategoriesContainer");
  homeContainer.innerHTML = "";
  gradjaContainer.innerHTML = "";

  archiveData.forEach((catObj, index) => {
    const count = catObj.publications.length;
    const countText = count === 1 ? "1 naslov" : `${count} naslova`;
    const iconSvg =
      icons[catObj.category.toUpperCase()] || icons["OSTALA GRAĐA"];

    const homeCard = document.createElement("div");
    homeCard.className = "category-card";
    homeCard.innerHTML = `
                <div>
                    <div class="cat-icon">${iconSvg}</div>
                    <div class="cat-title">${catObj.category}</div>
                </div>
                <div class="cat-count">${countText}</div>
            `;
    homeCard.addEventListener("click", () => {
      switchTab("gradja");
      selectCategory(catObj);
    });
    homeContainer.appendChild(homeCard);

    const gradjaCard = document.createElement("div");
    gradjaCard.className = "category-card";
    gradjaCard.dataset.cat = catObj.category;
    gradjaCard.innerHTML = `
                <div>
                    <div class="cat-icon">${iconSvg}</div>
                    <div class="cat-title">${catObj.category}</div>
                </div>
                <div class="cat-count">${countText}</div>
            `;
    gradjaCard.addEventListener("click", () => selectCategory(catObj));
    gradjaContainer.appendChild(gradjaCard);

    if (index === 0) {
      selectCategory(catObj);
    }
  });
}

async function selectCategory(catObj) {
  document
    .querySelectorAll("#gradjaCategoriesContainer .category-card")
    .forEach((c) => {
      c.classList.toggle("active", c.dataset.cat === catObj.category);
    });

  currentCategory = catObj;
  document.getElementById("selectedCategoryTitle").textContent =
    `Digitalizirana građa - ${catObj.category}`;

  const emptyNotice = document.getElementById("emptyNotice");
  const contentArea = document.getElementById("categoryContentArea");

  if (catObj.publications.length === 0) {
    emptyNotice.style.display = "block";
    contentArea.style.display = "none";
    return;
  }

  emptyNotice.style.display = "none";
  contentArea.style.display = "block";

  const isGodisnjaci = catObj.category.toUpperCase() === "GODIŠNJACI";
  const controlsGrid = document.querySelector(".controls-grid");
  const pubField = pubSelect.closest(".field-group");
  const yearField = yearSelect.closest(".field-group");

  // Za GODIŠNJAKE sakrij nepotrebne padajuće izbornike i prikaži sve PDF-ove direktno u popisu
  if (isGodisnjaci) {
    if (pubField) pubField.style.display = "none";
    if (yearField) yearField.style.display = "none";
    if (controlsGrid) controlsGrid.classList.add("compact");
    await renderGodisnjaciList(catObj);
    return;
  } else {
    if (pubField) pubField.style.display = "";
    if (yearField) yearField.style.display = "";
    if (controlsGrid) controlsGrid.classList.remove("compact");
  }

  const pubDirectory = document.getElementById("pubDirectory");
  pubDirectory.innerHTML = "";
  pubSelect.innerHTML = "";

  catObj.publications.forEach((pub) => {
    const infoData = pub.info || getFallbackInfo(pub.name);
    const displayTitle = infoData && infoData.title ? infoData.title : pub.name;

    const dirItem = document.createElement("div");
    dirItem.className = "pub-directory-item";
    dirItem.dataset.pub = pub.name;
    dirItem.innerHTML = `<span>•</span> ${displayTitle}`;
    dirItem.addEventListener("click", () => {
      pubSelect.value = pub.name;
      handlePublicationChange();
    });
    pubDirectory.appendChild(dirItem);

    const opt = document.createElement("option");
    opt.value = pub.name;
    opt.textContent = displayTitle;
    pubSelect.appendChild(opt);
  });

  handlePublicationChange();
}

async function renderGodisnjaciList(catObj) {
  const pubDirectory = document.getElementById("pubDirectory");
  const infoBox = document.getElementById("pubInfoBox");
  const infoTitle = document.getElementById("pubInfoTitle");
  const infoContent = document.getElementById("pubInfoContent");

  pubDirectory.innerHTML =
    '<div style="color: var(--text-muted); padding: 0.4rem;">Učitavanje godišnjaka...</div>';
  issueSelect.innerHTML = "";
  issueSelect.disabled = true;
  openPdfBtn.disabled = true;
  if (infoBox) infoBox.style.display = "none";

  try {
    let allFiles = [];
    for (const pub of catObj.publications) {
      for (const year of pub.years) {
        const url = `/api/archive/${encodeURIComponent(catObj.category)}/${encodeURIComponent(pub.name)}/${encodeURIComponent(year)}`;
        const res = await fetch(url);
        const files = await res.json();
        allFiles = allFiles.concat(files);
      }
    }

    pubDirectory.innerHTML = "";
    if (allFiles.length === 0) {
      pubDirectory.innerHTML =
        '<div style="color: var(--text-muted); padding: 0.4rem;">Nema dostupnih PDF izdanja.</div>';
      return;
    }

    const selectGodisnjak = (file) => {
      document
        .querySelectorAll("#pubDirectory .pub-directory-item")
        .forEach((el) => {
          el.classList.toggle("selected", el.dataset.url === file.url);
        });
      issueSelect.value = file.url;
      openPdfBtn.disabled = false;

      // Ako postoji opis za odabrani godišnjak u fallbackDescriptions, prikaži ga
      const infoData = getFallbackInfo(file.name);
      if (infoBox && infoTitle && infoContent) {
        if (infoData && infoData.descriptionHtml) {
          infoTitle.textContent = infoData.title || file.name;
          infoContent.innerHTML = infoData.descriptionHtml;
          infoBox.style.display = "block";
        } else {
          infoBox.style.display = "none";
        }
      }
    };

    allFiles.forEach((file, idx) => {
      const dirItem = document.createElement("div");
      dirItem.className = "pub-directory-item" + (idx === 0 ? " selected" : "");
      dirItem.dataset.url = file.url;
      dirItem.innerHTML = `<span>•</span> ${file.name}`;
      dirItem.addEventListener("click", () => selectGodisnjak(file));
      pubDirectory.appendChild(dirItem);

      const opt = document.createElement("option");
      opt.value = file.url;
      opt.textContent = file.name;
      issueSelect.appendChild(opt);
    });

    issueSelect.disabled = false;
    selectGodisnjak(allFiles[0]);
  } catch (err) {
    console.error("Greška pri učitavanju godišnjaka:", err);
    pubDirectory.innerHTML =
      '<div style="color: #dc2626; padding: 0.4rem;">Greška pri učitavanju popisa godišnjaka.</div>';
  }
}

pubSelect.addEventListener("change", handlePublicationChange);
yearSelect.addEventListener("change", handleYearChange);
issueSelect.addEventListener("change", () => {
  if (
    currentCategory &&
    currentCategory.category.toUpperCase() === "GODIŠNJACI"
  ) {
    document
      .querySelectorAll("#pubDirectory .pub-directory-item")
      .forEach((el) => {
        el.classList.toggle("selected", el.dataset.url === issueSelect.value);
      });
  }
});
openPdfBtn.addEventListener("click", () => {
  if (issueSelect.value) {
    window.open(issueSelect.value, "_blank");
  }
});

function handlePublicationChange() {
  const selectedPubName = pubSelect.value;
  const pubObj = currentCategory.publications.find(
    (p) => p.name === selectedPubName,
  );

  document.querySelectorAll(".pub-directory-item").forEach((item) => {
    item.classList.toggle("selected", item.dataset.pub === selectedPubName);
  });

  const infoBox = document.getElementById("pubInfoBox");
  const infoTitle = document.getElementById("pubInfoTitle");
  const infoContent = document.getElementById("pubInfoContent");

  // Koristi pubObj.info samo ako stvarno ima descriptionHtml, inače uzmi fallback
  const infoData =
    pubObj && pubObj.info && pubObj.info.descriptionHtml
      ? pubObj.info
      : getFallbackInfo(selectedPubName);

  console.log("Odabrano:", selectedPubName, "| Opis pronađen:", !!infoData);

  if (infoBox && infoTitle && infoContent) {
    if (infoData && infoData.descriptionHtml) {
      infoTitle.textContent = infoData.title || selectedPubName;
      infoContent.innerHTML = infoData.descriptionHtml;
      infoBox.style.display = "block";
    } else {
      infoBox.style.display = "none";
    }
  }

  yearSelect.innerHTML = "";
  issueSelect.innerHTML = "";
  issueSelect.disabled = true;
  openPdfBtn.disabled = true;

  if (!pubObj || pubObj.years.length === 0) {
    yearSelect.disabled = true;
    return;
  }

  yearSelect.disabled = false;
  pubObj.years.forEach((year) => {
    const opt = document.createElement("option");
    opt.value = year;
    opt.textContent = year;
    yearSelect.appendChild(opt);
  });

  handleYearChange();
}

async function handleYearChange() {
  const pubName = pubSelect.value;
  const year = yearSelect.value;

  issueSelect.innerHTML = "<option>Učitavanje...</option>";
  issueSelect.disabled = true;
  openPdfBtn.disabled = true;

  try {
    const url = `/api/archive/${encodeURIComponent(currentCategory.category)}/${encodeURIComponent(pubName)}/${encodeURIComponent(year)}`;
    const res = await fetch(url);
    const files = await res.json();

    issueSelect.innerHTML = "";
    if (files.length === 0) {
      issueSelect.innerHTML = "<option>Nema brojeva</option>";
      return;
    }

    files.forEach((file) => {
      const opt = document.createElement("option");
      opt.value = file.url;
      opt.textContent = file.name;
      issueSelect.appendChild(opt);
    });

    issueSelect.disabled = false;
    openPdfBtn.disabled = false;
  } catch (err) {
    console.error(err);
    issueSelect.innerHTML = "<option>Greška</option>";
  }
}

pubSelect.addEventListener("change", handlePublicationChange);
yearSelect.addEventListener("change", handleYearChange);
openPdfBtn.addEventListener("click", () => {
  if (issueSelect.value) {
    window.open(issueSelect.value, "_blank");
  }
});

init();
