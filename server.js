const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const DATA_DIR = path.join(__dirname, "Ino_skinuto");
const DESC_FILE = path.join(__dirname, "descriptions.json");

const DEFAULT_CATEGORIES = ["NOVINE", "ČASOPISI", "GODIŠNJACI", "OSTALA GRAĐA"];
const FLAT_CATEGORIES = ["GODIŠNJACI"];
const FLAT_PLACEHOLDER = "Svi brojevi";

app.use(express.static(path.join(__dirname, "public")));
app.use("/files", express.static(DATA_DIR));

// Učitaj opise publikacija ako postoje
function loadDescriptions() {
  try {
    if (fs.existsSync(DESC_FILE)) {
      return JSON.parse(fs.readFileSync(DESC_FILE, "utf8"));
    }
  } catch (e) {
    console.error("Greška pri čitanju descriptions.json:", e);
  }
  return {};
}

// Pronađi odgovarajući opis po nazivu mape (ignorira velika/mala slova i zagrade)
function findDescription(pubName, descriptions) {
  const cleanPub = pubName.toLowerCase().trim();
  if (descriptions[cleanPub]) return descriptions[cleanPub];

  for (const key of Object.keys(descriptions)) {
    const entry = descriptions[key];
    const cleanTitle = (entry.title || key).toLowerCase();
    if (cleanTitle.includes(cleanPub) || cleanPub.includes(key.toLowerCase())) {
      return entry;
    }
  }
  return null;
}

// API: Dohvati cijelu arhivu + metapodatke i statistiku
app.get("/api/archive", (req, res) => {
  try {
    const descriptions = loadDescriptions();
    let totalIssues = 0;
    let totalPublications = 0;

    if (!fs.existsSync(DATA_DIR)) {
      return res.json({
        stats: { publications: 0, issues: 0 },
        categories: DEFAULT_CATEGORIES.map((cat) => ({
          category: cat,
          publications: [],
        })),
      });
    }

    const existingFolders = fs
      .readdirSync(DATA_DIR, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    const allCategories = [
      ...new Set([...DEFAULT_CATEGORIES, ...existingFolders]),
    ];
    const archive = [];

    for (const catName of allCategories) {
      const catPath = path.join(DATA_DIR, catName);
      const publications = [];

      if (fs.existsSync(catPath) && fs.statSync(catPath).isDirectory()) {
        if (FLAT_CATEGORIES.includes(catName)) {
          const pdfFiles = fs
            .readdirSync(catPath, { withFileTypes: true })
            .filter((dirent) => dirent.isFile() && /\.pdf$/i.test(dirent.name));

          if (pdfFiles.length > 0) {
            totalIssues += pdfFiles.length;
            totalPublications += 1;
            publications.push({
              name: catName,
              years: [FLAT_PLACEHOLDER],
              info: findDescription(catName, descriptions),
            });
          }
        } else {
          const pubFolders = fs
            .readdirSync(catPath, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);

          for (const pubName of pubFolders) {
            const pubPath = path.join(catPath, pubName);
            const yearFolders = fs
              .readdirSync(pubPath, { withFileTypes: true })
              .filter((dirent) => dirent.isDirectory())
              .map((dirent) => dirent.name);

            // Prebroji PDF-ove po godinama za statistiku
            yearFolders.forEach((y) => {
              const yPath = path.join(pubPath, y);
              const count = fs
                .readdirSync(yPath)
                .filter((f) => /\.pdf$/i.test(f)).length;
              totalIssues += count;
            });

            totalPublications += 1;
            publications.push({
              name: pubName,
              years: yearFolders.sort((a, b) => parseInt(a) - parseInt(b)),
              info: findDescription(pubName, descriptions),
            });
          }
        }
      }

      archive.push({
        category: catName,
        publications: publications,
      });
    }

    res.json({
      stats: {
        publications: totalPublications,
        issues: totalIssues,
      },
      categories: archive,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Greška na serveru." });
  }
});

// API: Dohvati brojeve za odabranu kategoriju, publikaciju i godinu
app.get("/api/archive/:category/:publication/:year", (req, res) => {
  const { category, publication, year } = req.params;
  const isFlat =
    FLAT_CATEGORIES.includes(category) && year === FLAT_PLACEHOLDER;

  const targetPath = isFlat
    ? path.join(DATA_DIR, category)
    : path.join(DATA_DIR, category, publication, year);

  try {
    if (!fs.existsSync(targetPath)) return res.json([]);

    const files = fs
      .readdirSync(targetPath, { withFileTypes: true })
      .filter((dirent) => dirent.isFile() && /\.pdf$/i.test(dirent.name))
      .map((dirent) => {
        const url = isFlat
          ? `/files/${encodeURIComponent(category)}/${encodeURIComponent(dirent.name)}`
          : `/files/${encodeURIComponent(category)}/${encodeURIComponent(publication)}/${encodeURIComponent(year)}/${encodeURIComponent(dirent.name)}`;

        return {
          name: dirent.name.replace(/(\.+pdf)+$/i, "").replace(/\.[^/.]+$/, ""),
          url: url,
        };
      })
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true }),
      );

    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Greška na serveru." });
  }
});

app.listen(PORT, () =>
  console.log(`INO Virtualna čitaonica radi na http://localhost:${PORT}`),
);
