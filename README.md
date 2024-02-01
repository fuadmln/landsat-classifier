# Landsat Classifier

![Eurosat Dataset](/static/EUROSAT.jpg)

Projek website untuk mengklasifikasi citra dalam skripsi penulis tentang `Klasifikasi Jenis Lahan Menggunakan CNN Berbasiskan Citra Satelit`.

- [**Dokumentasi**](https://fuad-maulana.gitbook.io/landsat-classifier-using-cnn/)

- [**Demo**](https://landsat-classifier.netlify.app/) (hanya UI tanpa implementasi backend)

- [**Skripsi**](http://repository.unsri.ac.id/89331/)

## Tech Stacks

- Python
- Flask
- Tensorflow

## Instalasi

1. **Install** semua tools yang dibutuhkan pada tech stacks
1. **Clone** repository </br>

    ```sh
    git clone https://github.com/fuadmln/landsat-classifier.git
    ```

1. **Download** dan **pindahkan** model ke folder `/model`. </br>
Model berupa file `.h5` [download disini](https://drive.google.com/file/d/1om58xtyD6sSBU_jto27An88WMKN9cvtM/view?usp=sharing) (171 MB)
1. **Jalankan perintah** di terminal

    ```sh
    python app.py
    ```

1. **Kunjungi url** yang dihasilkan pada browser

## Struktur Folder & File

Penjelasan fungsi folder dan file dalam proyek web ini.

### Folder /_scripts

Berisi script python notebook:

- **split_dataset.py** - membagi dataset ke data training dan testing.
- **trainig cnn.ipynb** - melatih model dengan data training.
- **testing cnn.ipynb** - menguji model dengan data testing.

### Folder **/model**

Folder untuk lokasi penyimpan file model

### Folder **/static**

File statis untuk komponen website seperti css dan js

### Folder **/templates**

Folder untuk menyimpan file HTML

### Folder **/test_images**

Folder untuk menyimpan file gambar yang akan diuji

### File **app.py**

File utama untuk menjalankan website

### File **Classifier.py**

File berupa class untuk proses klasifikasi

## Route Endpoint

### Beranda

`[GET] /`

Mengakses halaman beranda

### Classify

`[POST] /classify`

Melakukan klasifikasi pada sebuah gambar

**Request Payload** *(form)*:

- img: *(file)*

**Response** *(json)*:

```json
{
    "data": {
        "class": "Forest",  // hasil prediksi kelas
        "fileName": "Forest_1002.jpg",  // nama file
    },
    "error": false
}
```

### Evaluate

`[POST] /evaluate`

Melakukan evaluasi pada sekumpulan gambar

**Request Payload** *(form)*:

- folder: *(string)*

**Response** *(json)*:

```json
{
    "data": {
        "accuracy": 0.9,    // overall accuracy
        "confusion_matrix": [[]],   //2D array 10x10
        "metrics": [[]],    // 2D array 10x3 (precision, recall, f1-score)
    },
    "error": false
}
```
