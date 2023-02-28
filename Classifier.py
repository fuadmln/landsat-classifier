from cgi import test
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.utils import load_img, img_to_array

from tensorflow.keras.preprocessing.image import ImageDataGenerator
import sklearn
from sklearn.metrics import confusion_matrix
from sklearn.metrics import classification_report


class Classifier():
    labels = [
        'Annual Crop',
        'Forest',
        'Herbaceous Vegetation',
        'Highway',
        'Industrial',
        'Pasture',
        'Permanent Crop',
        'Residential',
        'River',
        'Sea Lake'
    ]

    image_size = 224  # ex: 64, 224
    model_path = 'model/EuroSAT VGG16 x224.h5'  # set model path!
    model = None

    def __init__(self):
        self.set_model()

    # load selected model
    def set_model(self):
        print('...loading model')
        model = keras.models.load_model(self.model_path)
        self.model = model

    # raw image to np
    def process_img(self, image_file):
        print('...processing_image')
        # image_file='test_images/Residential_11.jpg' #example
        path = image_file  # image path
        img = load_img(path, target_size=(self.image_size, self.image_size))

        x = img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = x/255
        image = np.vstack([x])

        return image

    # decode from prob. to class name
    def decode_prediction(self, classes_prob, labels=labels):
        print('...decode prediction')
        maxValueIndex = np.argmax(classes_prob, axis=1).tolist()[0]
        predicted_label = labels[maxValueIndex]
        return predicted_label

    def predict(self, image_file):  # output label
        images = self.process_img(image_file=image_file)
        classes_prob = self.model.predict(images)
        predicted_label = self.decode_prediction(classes_prob, self.labels)
        return predicted_label

    def make_data_generator(self, test_dir):
        print('...generating test data')
        test_datagen = ImageDataGenerator(rescale=1./255)
        test_generator = test_datagen.flow_from_directory(
            test_dir,
            target_size=(self.image_size, self.image_size),
            batch_size=1,
            class_mode='categorical',
            shuffle=False)
        return test_generator

    def prfs_to_array(self, dict):
        arr = [
            round(dict['precision'], 3),
            round(dict['recall'], 3),
            round(dict['f1-score'], 3)
        ]
        return arr

    def extract_acc_metrics(self, dict):
        precision_recall_f1 = [
            self.prfs_to_array(dict['0']),
            self.prfs_to_array(dict['1']),
            self.prfs_to_array(dict['2']),
            self.prfs_to_array(dict['3']),
            self.prfs_to_array(dict['4']),
            self.prfs_to_array(dict['5']),
            self.prfs_to_array(dict['6']),
            self.prfs_to_array(dict['7']),
            self.prfs_to_array(dict['8']),
            self.prfs_to_array(dict['9']),
        ]
        accuracy = dict['accuracy']

        return {
            'accuracy': accuracy,
            'metrics': precision_recall_f1
        }

    # calculate confuiosn matrix, metrics: precision, recall, f1-score
    def get_metrics(self, test_generator, y_predict):
        print('..calculating metrics')
        true_label = test_generator.classes
        predicted_label = np.argmax(y_predict, axis=1)
        cm = confusion_matrix(true_label, predicted_label).tolist()
        metrics_report = classification_report(
            true_label, predicted_label, output_dict=True)
        extracted_metrics = self.extract_acc_metrics(metrics_report)
        return {
            "confusion_matrix": cm,
            "accuracy": extracted_metrics["accuracy"],
            "metrics": extracted_metrics["metrics"]
        }

    def evaluate_performance(self, folder_path):
        model = self.model
        test_generator = self.make_data_generator(folder_path)
        y_predict = model.predict(test_generator)
        metrics = self.get_metrics(test_generator, y_predict)

        return metrics
