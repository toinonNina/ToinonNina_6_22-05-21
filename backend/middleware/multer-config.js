const multer = require('multer'); // permet de gerer les fichiers entrants dans les req http

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => { // indique d'enregistrer les fichiers dans le dossier images
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); //split et join pour eliminer le probleme des espaces
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});
/*nous exportons ensuite l'élément multer entièrement configuré,
 lui passons notre constante storage et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image.*/
module.exports = multer({ storage: storage }).single('image');