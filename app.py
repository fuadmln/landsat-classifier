# import Flask
from msilib.schema import Class
from flask import Flask, request, render_template, jsonify, url_for
from flask_cors import CORS, cross_origin
import os
from Classifier import Classifier

UPLOAD_FOLDER = 'test_images'
TEST_DIR = UPLOAD_FOLDER

# create an instance of Flask
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/classify', methods=['GET', 'POST'])
def classify():
    # simpan file
    f = request.files['img']
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], f.filename)
    f.save(save_path)

    LandClassifier = Classifier()
    predicted_label = LandClassifier.predict(image_file=save_path)

    return jsonify({
        'error': False,
        'data': {
            'fileName': f.filename,
            'class': predicted_label
        }
    })


@app.route('/evaluate', methods=['GET', 'POST'])
def evaluate():
    # get input folder
    data = request.get_json()
    folder = data['folder']
    test_path = os.path.join(TEST_DIR, folder)

    LandClassifier = Classifier()
    metrics = LandClassifier.evaluate_performance(test_path)

    return jsonify({
        'error': False,
        'data': metrics
    })


@app.route('/tes_classify', methods=['GET', 'POST'])
@cross_origin()
def tes_c():
    return jsonify({
        'error': False,
        'data': {
            'fileName': 'nama-file.jpg',
            'class': 'Forest'
        }
    })


@app.route('/tes_evaluate', methods=['GET', 'POST'])
@cross_origin()
def tes_e():
    return jsonify({
        'error': False,
        'data': {
            'accuracy': 90,
            'confMatrix': [
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            ],
            'metric': [
                [1, 2, 3],
                [1, 2, 3],
                [1, 2, 3],
                [1, 2, 3],
                [1, 2, 3],
                [1, 2, 3],
                [1, 2, 3],
                [1, 2, 3],
                [1, 2, 3],
                [1, 2, 3],
            ]
        }
    })


if __name__ == '__main__':
    app.run(debug=True)
