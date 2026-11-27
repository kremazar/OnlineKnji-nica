const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Putanje do mapa (po potrebi promijeni naziv mape s PDF-ovima)
const PUBLIC_DIR = path.join(__dirname, "public");
const ARCHIVE_DIR = path.join(__dirname, "Ino_skinuto");
const DESCRIPTIONS_PATH = path.join(__dirname, "descriptions.json");

// Zadani redoslijed glavnih kategorija
const DEFAULT_CATEGORIES = ["NOVINE", "ČASOPISI", "GODIŠNJACI", "OSTALA GRAĐA"];

// Posluživanje statičkih datoteka (index.html, style.css, script.js) i PDF arhive
app.use(express.static(PUBLIC_DIR));
app.use("/files", express.static(ARCHIVE_DIR));

// Prirodno sortiranje naziva (npr. br. 2 prije br. 10)
const naturalSort = (a, b) =>
  a.localeCompare(b, "hr", { numeric: true, sensitivity: "base" });

// Sigurno učitavanje descriptions.json ako postoji na disku
function loadDescriptions() {
  try {
    if (fs.existsSync(DESCRIPTIONS_PATH)) {
      const raw = fs.readFileSync(DESCRIPTIONS_PATH, "utf8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Upozorenje: descriptions.json nije učitan:", err.message);
  }
  return {};
}

// Pronalaženje opisa iz descriptions.json prema nazivu mape
function findDescriptionForPub(pubName, descriptions) {
  if (!pubName || !descriptions) return null;

  const normalize = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");

  const normPub = normalize(pubName);
  const keys = Object.keys(descriptions).sort((a, b) => b.length - a.length);

  for (const key of keys) {
    if (normPub.includes(normalize(key))) {
      const entry = descriptions[key];
      if (
        entry &&
        entry.descriptionHtml &&
        entry.descriptionHtml.trim() !== ""
      ) {
        return entry;
      }
    }
  }
  return null;
}

// Dohvat direktorija ili PDF datoteka
function getDirectories(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(naturalSort);
}

function getPdfFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.pdf$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort(naturalSort);
}

// API: Pregled svih kategorija, publikacija, godina i statistike
app.get("/api/archive", (req, res) => {
  try {
    if (!fs.existsSync(ARCHIVE_DIR)) {
      fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
    }

    const descriptions = loadDescriptions();
    const existingDirs = getDirectories(ARCHIVE_DIR);

    // Spoji zadane kategorije s eventualnim dodatnim mapama na disku
    const categoryNames = [...DEFAULT_CATEGORIES];
    existingDirs.forEach((dir) => {
      if (!categoryNames.some((c) => c.toUpperCase() === dir.toUpperCase())) {
        categoryNames.push(dir);
      }
    });

    let totalPublications = 0;
    let totalIssues = 0;

    const categories = categoryNames.map((catName) => {
      // Pronađi stvarni naziv mape (bez obzira na velika/mala slova)
      const actualCatDir =
        existingDirs.find((d) => d.toUpperCase() === catName.toUpperCase()) ||
        catName;
      const catPath = path.join(ARCHIVE_DIR, actualCatDir);

      if (!fs.existsSync(catPath)) {
        return { category: catName, publications: [] };
      }

      const pubDirs = getDirectories(catPath);
      const rootPdfs = getPdfFiles(catPath);
      const publications = [];

      // 1. Slučaj: PDF-ovi su spremljeni direktno u mapi kategorije (npr. GODIŠNJACI/*.pdf)
      if (rootPdfs.length > 0) {
        totalPublications += 1;
        totalIssues += rootPdfs.length;
        publications.push({
          name: actualCatDir,
          years: ["Svi brojevi"],
          info: findDescriptionForPub(actualCatDir, descriptions),
        });
      }

      // 2. Slučaj: Publikacije imaju vlastite podmape (npr. NOVINE/Naša sloga/...)
      pubDirs.forEach((pubName) => {
        const pubPath = path.join(catPath, pubName);
        const yearDirs = getDirectories(pubPath);
        const directPdfs = getPdfFiles(pubPath);

        const years = [];
        if (yearDirs.length > 0) {
          yearDirs.forEach((year) => {
            const pdfCount = getPdfFiles(path.join(pubPath, year)).length;
            if (pdfCount > 0) {
              years.push(year);
              totalIssues += pdfCount;
            }
          });
        }

        if (directPdfs.length > 0) {
          years.unshift("Svi brojevi");
          totalIssues += directPdfs.length;
        }

        if (years.length > 0) {
          totalPublications += 1;
          publications.push({
            name: pubName,
            years,
            info: findDescriptionForPub(pubName, descriptions),
          });
        }
      });

      return {
        category: actualCatDir,
        publications,
      };
    });

    res.json({
      categories,
      stats: {
        publications: totalPublications,
        issues: totalIssues,
      },
    });
  } catch (err) {
    console.error("Greška u /api/archive:", err);
    res.status(500).json({ error: "Greška pri čitanju arhive." });
  }
});

// API: Dohvat svih PDF brojeva za odabranu kategoriju, publikaciju i godinu
app.get("/api/archive/:category/:publication/:year", (req, res) => {
  try {
    const { category, publication, year } = req.params;

    // Odredi stvarnu putanju na disku ovisno o strukturi mapa
    let targetDir;
    let urlSegments;

    if (category === publication && year === "Svi brojevi") {
      targetDir = path.join(ARCHIVE_DIR, category);
      urlSegments = [category];
    } else if (year === "Svi brojevi") {
      targetDir = path.join(ARCHIVE_DIR, category, publication);
      urlSegments = [category, publication];
    } else {
      targetDir = path.join(ARCHIVE_DIR, category, publication, year);
      urlSegments = [category, publication, year];
    }

    // Sigurnosna provjera protiv izlaska izvan ARCHIVE_DIR
    const resolvedTarget = path.resolve(targetDir);
    const resolvedArchive = path.resolve(ARCHIVE_DIR);
    if (!resolvedTarget.startsWith(resolvedArchive)) {
      return res.status(403).json({ error: "Zabranjen pristup putanji." });
    }

    const pdfFiles = getPdfFiles(targetDir);
    const result = pdfFiles.map((file) => {
      const encodedPath = [...urlSegments, file]
        .map((seg) => encodeURIComponent(seg))
        .join("/");

      return {
        // Uklanja isključivo nastavak .pdf (ne reže točke u kraticama poput "k. und k.")
        name: file.replace(/\.pdf$/i, ""),
        url: `/files/${encodedPath}`,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Greška pri dohvaćanju PDF brojeva:", err);
    res.status(500).json({ error: "Greška pri dohvaćanju brojeva." });
  }
});

app.listen(PORT, () => {
  console.log(`INO server je pokrenut na: http://localhost:${PORT}`);
  console.log(`Mapa s arhivskom građom: ${ARCHIVE_DIR}`);
});
