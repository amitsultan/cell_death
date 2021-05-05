from stardist.models import StarDist2D 
from csbdeep.utils import Path, normalize
from stardist import random_label_cmap, _draw_polygons, export_imagej_rois
import matplotlib.pyplot as plt
import tensorflow as tf
import numpy as np


class StarModel:
    
    
    def __init__(self, from_pretrained='2D_versatile_fluo', normalize_func=None):
        if from_pretrained is None:  # Train your own model
            raise NotImplementedError
        self.model = StarDist2D.from_pretrained(from_pretrained)
        self.lbl_cmap = random_label_cmap()
        if normalize_func is None:
            self.normalize_func = self.default_normalize
        
    def img2D_normalize(self, img):
        if self.normalize_func is None:
            return default_normalize(img)
        try:
            new_img = self.normalize_func(img)
            return new_img
        except:
            print("Warning: the normalization function given failed, default one is used")
            return default_normalize(img)
    
    def default_normalize(self, img):
        axis_norm = (0,1)
        return normalize(img, 1,99.8, axis=axis_norm)
    
    def img_as_tensor(self, img_rgb):
        img_tensor = tf.convert_to_tensor(img_rgb)
        img_gray = tf.image.rgb_to_grayscale(img_tensor)
        return img_gray.numpy()
    
    def run_single_pred(self, img):
        if self.model is None:
            raise Exception("Model isn't trained")
        img = self.img2D_normalize(img)
        img = self.img_as_tensor(img)
        labels, details = self.model.predict_instances(img)
        return (labels, details)
    
    def run_multiple_preds(self, images):
        if images is None:
            raise Exception("Cannot predict None images")
        results = []
        for img in images:
            tmp = self.run_single_pred(img)
            results.append({"labels": tmp[0], "details": tmp[1]})
        return results

    def get_images_points(self, images):
            results = self.run_multiple_preds(images)
            points = []
            for result in results:
                points.append(result['details']['points'])
            return points
    
    
    def print_img_preds(self, img, show_dist=True):
        if self.model is None:
            raise Exception("Model isn't trained")
        labels, details = self.run_single_pred(img)
        plt.figure(figsize=(13,10))
        img_show = img.astype(np.uint8)
        coord, points, prob = details['coord'], details['points'], details['prob']
        plt.subplot(121); plt.imshow(img_show, cmap='gray'); plt.axis('off')
        a = plt.axis()
        _draw_polygons(coord, points, prob, show_dist=show_dist)
        plt.axis(a)
        plt.subplot(122); plt.imshow(img_show); plt.axis('off')
        plt.tight_layout()
        plt.show()
