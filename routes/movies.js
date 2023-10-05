// import router
const express = require('express');
const router =  express.Router()

const pool = require('../helper/connect')

// fungsi ambil satu data untuk dipakai di get, post, and put
async function getMovieById(id) {
    const result = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
    return result.rows[0];
}

/**
 * @swagger
 * /movies:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Mengambil daftar film dengan paginasi
 *     description: Mengambil daftar film dengan paginasi berdasarkan nomor halaman dan jumlah item per halaman.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: page
 *         description: Nomor halaman yang ingin ditampilkan default 1
 *         in: query
 *         required: false
 *         type: integer
 *       - name: limit
 *         description: Jumlah item per halaman default 10
 *         in: query
 *         required: false
 *         type: integer
 *     responses:
 *       200:
 *         description: Daftar film berhasil diambil
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Movie"
 *       400:
 *         description: Permintaan tidak valid
 *       500:
 *         description: Kesalahan pada server
 */



// implementasi pagination tambahkan query parameter page ex: ...endpoint?page=2
router.get('/', async (req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    
    const result = await pool.query('SELECT * FROM movies LIMIT $1 OFFSET $2', [limit, offset])
    res.json(result.rows)

})

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Mengambil detail film berdasarkan ID
 *     description: Mengambil detail film berdasarkan ID yang diberikan.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID film yang ingin dilihat
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Detail film berhasil diambil
 *         schema:
 *           $ref: "#/definitions/Movie"
 *       400:
 *         description: Permintaan tidak valid
 *       404:
 *         description: Film tidak ditemukan
 *       500:
 *         description: Kesalahan pada server
 * definitions:
 *   Movie:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         description: ID film
 *       title:
 *         type: string
 *         description: Judul film
 *       genres:
 *         type: string
 *         description: Genre film
 *       year:
 *         type: string
 *         description: Tanggal rilis film
 */

// ambil id tertentu
router.get('/:id', async (req,res)=>{

    const id = parseInt(req.params.id); 

    if(isNaN(id)){
        return res.status(400).json({message : "id must be number!"})
    }

    try{
        const result = await getMovieById(id);
        if (result.rows.length===0){
            return res.status(404).json({message : "Data not found!"})
        }
        res.json(result.rows);
    } catch(error){
        res.status(500).json({message : 'Something happen with server.'})
    }
})


/**
 * @swagger
 * /movies:
 *   post:
 *     tags:
 *       - Movies
 *     summary: Menambahkan data film baru
 *     description: Menambahkan data film baru ke dalam database.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Data film yang akan ditambahkan
 *         in: body
 *         required: true
 *     responses:
 *       201:
 *         description: Data film berhasil ditambahkan
 *       400:
 *         description: Permintaan tidak valid
 *       500:
 *         description: Kesalahan pada server
 */


// tambah data
router.post('/', async (req, res) => {
    let {title, genres, year } = req.body; 
    try{
        let getID = await pool.query('SELECT MAX(id) FROM movies')
        let id = (getID.rows[0].max)+1
        await pool.query('INSERT INTO movies(id, title, genres, year) VALUES($1, $2, $3, $4)', [id, title, genres, year]);

        const movie = await getMovieById(id);
        res.json({message: 'Data berhasil ditambahkan', hasil: movie});

    } catch(error){
        res.status(500).json({message : 'Something happen with server.' + error})
    }
})


/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     tags:
 *       - Movies
 *     summary: Mengubah data film berdasarkan ID
 *     description: Mengubah data film berdasarkan ID yang diberikan.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID film yang akan diubah
 *         in: path
 *         required: true
 *         type: integer
 *       - name: body
 *         description: Data film yang akan diubah
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: Data film berhasil diubah
 *       400:
 *         description: Permintaan tidak valid
 *       404:
 *         description: Film tidak ditemukan
 *       500:
 *         description: Kesalahan pada server
 */


// ubah data
router.put('/:id', async (req, res) => {
    let {title, genres, year } = req.body; 
    const id = req.params.id;
    try{
        await pool.query('UPDATE movies SET title = $1, genres = $2, year = $3 WHERE id = $4', [title, genres, year, id]);
        
        const movie = await getMovieById(id);
        res.json({message: 'Data berhasil diubah', hasil: movie});
        
    } catch(error){
        res.status(500).json({message : 'Something happen with server.' + error})
    }
})

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     tags:
 *       - Movies
 *     summary: Menghapus data film berdasarkan ID
 *     description: Menghapus data film berdasarkan ID yang diberikan.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID film yang akan dihapus
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Data film berhasil dihapus
 *       400:
 *         description: Permintaan tidak valid
 *       404:
 *         description: Film tidak ditemukan
 *       500:
 *         description: Kesalahan pada server
 */


// hapus data
router.delete('/:id', async (req,res)=>{
    const id = parseInt(req.params.id); 
    if(isNaN(id)){
        return res.status(400).json({message : "id must be number!"})
    }

    try{
        await pool.query('DELETE FROM movies where id = $1', [id])
        res.json({message: 'Data berhasil dihapus!'});
    } catch(error){
        res.status(500).json({message : 'Something happen with server.'})
    }
})

module.exports = router