const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Putanja do foldera s PDF-ovima (na Linuxu promijeni u npr. '/var/www/Ino_skinuto')
const DATA_DIR = path.join(__dirname, 'Ino_skinuto');

// Zadane kategorije koje se uvijek prikazuju na sučelju, čak i ako folder još ne postoji
const DEFAULT_CATEGORIES = ['NOVINE', 'ČASOPISI', 'GODIŠNJACI', 'OSTALA GRAĐA'];

app.use(express.static(path.join(__dirname, 'public')));
app.use('/files', express.static(DATA_DIR));

// API: Dohvati strukturu (Kategorije -> Publikacije -> Godine)
app.get('/api/archive', (req, res) => {
    try {
        // Ako folder s podacima ne postoji, vrati sve 4 zadane kategorije kao prazne
        if (!fs.existsSync(DATA_DIR)) {
            return res.json(DEFAULT_CATEGORIES.map(cat => ({
                category: cat,
                publications: []
            })));
        }

        const existingFolders = fs.readdirSync(DATA_DIR, { withFileTypes: true })
                                  .filter(dirent => dirent.isDirectory())
                                  .map(dirent => dirent.name);

        // Spoji zadane kategorije i eventualne nove mape na disku bez duplikata
        const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...existingFolders])];
        const archive = [];

        for (const catName of allCategories) {
            const catPath = path.join(DATA_DIR, catName);
            const publications = [];

            if (fs.existsSync(catPath) && fs.statSync(catPath).isDirectory()) {
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
    const targetPath = path.join(DATA_DIR, category, publication, year);

    try {
        if (!fs.existsSync(targetPath)) return res.json([]);

        const files = fs.readdirSync(targetPath, { withFileTypes: true })
                        .filter(dirent => dirent.isFile())
                        .map(dirent => ({
                            // Miče .pdf (uključujući .pdf.pdf) ili bilo koju drugu ekstenziju
                            name: dirent.name.replace(/(\.pdf)+$/i, '').replace(/\.[^/.]+$/, ''),
                            url: `/files/${encodeURIComponent(category)}/${encodeURIComponent(publication)}/${encodeURIComponent(year)}/${encodeURIComponent(dirent.name)}`
                        }))
                        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

        res.json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Greška na serveru.' });
    }
});

app.listen(PORT, () => console.log(`Aplikacija radi na http://localhost:${PORT}`));