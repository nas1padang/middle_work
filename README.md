
## Movie API
API sederhana yang dibuat untuk mengelola data-data film

Diasumsikan bahwa user yang didalam tabel user adalah admin.
untuk table dapat di di link berikut 👉 [Here](https://github.com/fathy17/dokumen-pembanding-2/raw/master/movies-database.sql)

```
hw_middleware
├── helper              # koneksi dan autentikasi
│   ├── connect.js
│   ├── auth.js
│   ├── verifyToken.js
├── documentation       # swagger dokumentasi
│   ├── documentation.json
├── routing             # perutean
│   ├── movie.js
│   ├── user.js
└── index.js
```

### Cara Menjalankan Program
```
npm run start
```
  
### Dokumentasi API

> Dapat dilihat pada router api-docs atau dapat dilihat di collection di repo ini

#### Konfigurasi Environment

```
# DB CONFIG

DB_HOST=xxxx
DB_PORT=xxxx
DB_NAME=xxxx
DB_USER=xxxx
DB_PASS=xxxx

# EXPRESS
PORT=xxxx

# USER
TOKEN_KEY=xxxx
```