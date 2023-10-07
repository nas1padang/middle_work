// import router
const express = require('express');
const router =  express.Router()

const pool = require('../helper/connect')
const authorizationChecker = require('../helper/verifyToken')

// fungsi ambil satu data untuk dipakai di get, post, and put
async function getMovieById(id) {
    const result = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
    return result.rows[0];
}


// implementasi pagination tambahkan query parameter page ex: ...endpoint?page=2
router.get('/', async (req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    
    const result = await pool.query('SELECT * FROM movies LIMIT $1 OFFSET $2', [limit, offset])
    res.json(result.rows)

})


// ambil id tertentu
router.get('/:id', async (req,res)=>{

    const id = parseInt(req.params.id);

    if(isNaN(id)){
        return res.status(400).json({message : "id must be number!"})
    }

    try{
        const result = await getMovieById(id);
        
        console.log(result)

        if (result.length===0){
            return res.status(404).json({message : "Data not found!"})
        }
        res.json(result);
    } catch(error){
        res.status(500).json({message : 'Something happen with server.'})
    }
})


// tambah data
router.post('/', authorizationChecker, async (req, res) => {
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


// ubah data keseluruhan
router.put('/:id', authorizationChecker, async (req, res) => {
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


// ubah data patch
router.patch('/:id', authorizationChecker, async (req, res) => {
    let {title, genres, year } = req.body; 
    const id = req.params.id;
    try{
        temp = []
        for (const key in req.body) {
            temp.push(key + ' = \'' + req.body[key]+'\'')
        }

        update = temp.toString().replace(/,/g, " , ");

        query = `UPDATE movies SET ${update} WHERE id = ${id}`

        await pool.query(query);        
        
        const movie = await getMovieById(id);

        res.json({message: 'Data berhasil diubah', hasil: movie});
        
    } catch(error){
        res.status(500).json({message : 'Something happen with server.' + error})
    }
})


// hapus data
router.delete('/:id', authorizationChecker, async (req,res)=>{
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