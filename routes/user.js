// import router
const express = require('express');
const router =  express.Router()

const pool = require('../helper/connect')
const { createToken } = require('../helper/auth')

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Login
 *     summary: Login pengguna dan dapatkan token
 *     description: Login pengguna berdasarkan email dan password. Jika berhasil, kembalikan token JWT.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email pengguna
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: Password pengguna
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Otentikasi berhasil dan token diterima
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *             expired_in:
 *               type: number
 *       400:
 *         description: Email dan password harus diisi
 *       401:
 *         description: Password Salah
 *       404:
 *         description: Data tidak ada
 *       500:
 *         description: Kesalahan pada server
 */

router.post('/', async (req,res)=>{
    try{
        let {email, password } = req.body; 
        
        if (!(email && password)) {
            res.status(400).send("Email dan password harus diisi!");
        }
        
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Data tidak ada!" });
        }
        
        const user = result.rows[0];
        if (password !== user.password) {
            return res.status(401).json({ message: "Password Salah!" });
        }

        // buat token berdasarkan row result
        const token = createToken(user)
        res.json({token : token, expired_in:3600})

    } catch(error){
        res.status(500).json({message : 'Something happen with server.' + error})
    }
})

module.exports = router