const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Putanja do foldera s PDF-ovima
const DATA_DIR = path.join(__dirname, 'Ino_skinuto');

// Zadane kategorije koje se uvijek prikazuju na sučelju
const DEFAULT_CATEGORIES = ['NOVINE', 'ČASOPISI', 'GODIŠNJACI', 'OSTALA GRAĐA'];

// Kategorije koje nemaju podmape po godinama, nego izravno PDF datoteke
const FLAT_CATEGORIES = ['GODIŠNJACI'];
const FLAT_PLACEHOLDER = 'Svi brojevi';

app.use(express.static(path.join(__dirname, 'public')));
app.use('/files', express.static(DATA_DIR));

// API: Dohvati strukturu (Kategorije -> Publikacije -> Godine)
app.get('/api/archive', (req, res) => {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            return res.json(DEFAULT_CATEGORIES.map(cat => ({
                category: cat,
                publications: []
            })));
        }

        const existingFolders = fs.readdirSync(DATA_DIR, { withFileTypes: true })
                                  .filter(dirent => dirent.isDirectory())
                                  .map(dirent => dirent.name);

        const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...existingFolders])];
        const archive = [];

        for (const catName of allCategories) {
            const catPath = path.join(DATA_DIR, catName);
            const publications = [];

            if (fs.existsSync(catPath) && fs.statSync(catPath).isDirectory()) {
                // Ako je kategorija u FLAT_CATEGORIES (npr. GODIŠNJACI), čitaj PDF-ove izravno iz nje
                if (FLAT_CATEGORIES.includes(catName)) {
                    const pdfFiles = fs.readdirSync(catPath, { withFileTypes: true })
                                       .filter(dirent => dirent.isFile() && /\.pdf$/i.test(dirent.name));

                    if (pdfFiles.length > 0) {
                        publications.push({
                            name: catName,
                            years: [FLAT_PLACEHOLDER]
                        });
                    }
                } else {
                    // Standardna struktura: Kategorija -> Publikacija -> Godina -> PDF
                    const pubFolders = fs.readdirSync(catPath, { withFileTypes: true })
                                         .filter(dirent => dirent.isDirectory())
                                         .map(dirent => dirent.name);

                    for (const pubName of pubFolders) {
                        const pubPath = path.join(catPath, pubName);
                        const yearFolders = fs.readdirSync(pubPath, { withFileTypes: true })
                                              .filter(dirent => dirent.isDirectory())
                                              .map(dirent => dirent.name);

                        publications.push({
                            name: pubName,
                            years: yearFolders.sort((a, b) => parseInt(a) - parseInt(b))
                        });
                    }
                }
            }

            archive.push({
                category: catName,
                publications: publications
            });
        }

        res.json(archive);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška na serveru.' });
    }
});

// API: Dohvati brojeve (datoteke) za odabranu kategoriju, naslov i godinu
app.get('/api/archive/:category/:publication/:year', (req, res) => {
    const { category, publication, year } = req.params;
    const isFlat = FLAT_CATEGORIES.includes(category) && year === FLAT_PLACEHOLDER;

    // Za GODIŠNJACI čitaj izravno iz /Ino_skinuto/GODIŠNJACI, za ostale iz /Kategorija/Publikacija/Godina
    const targetPath = isFlat
        ? path.join(DATA_DIR, category)
        : path.join(DATA_DIR, category, publication, year);

    try {
        if (!fs.existsSync(targetPath)) return res.json([]);

        const files = fs.readdirSync(targetPath, { withFileTypes: true })
                        .filter(dirent => dirent.isFile() && /\.pdf$/i.test(dirent.name))
                        .map(dirent => {
                            const url = isFlat
                                ? `/files/${encodeURIComponent(category)}/${encodeURIComponent(dirent.name)}`
                                : `/files/${encodeURIComponent(category)}/${encodeURIComponent(publication)}/${encodeURIComponent(year)}/${encodeURIComponent(dirent.name)}`;

                            return {
                                // Miče .pdf (uključujući ..pdf ili .pdf.pdf) iz prikaza naziva
                                name: dirent.name.replace(/(\.+pdf)+$/i, '').replace(/\.[^/.]+$/, ''),
                                url: url
                            };
                        })
                        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

        res.json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška na serveru.' });
    }
});

app.listen(PORT, () => console.log(`Aplikacija radi na http://localhost:${PORT}`));