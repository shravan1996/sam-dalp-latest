# Copyright (C) 2023 CVAT.ai Corporation
#
# SPDX-License-Identifier: MIT

import cv2
import numpy as np
import onnxruntime as ort


class ModelHandler:
    def __init__(self, labels):
        self.model = None
        self.labels = labels
        self.load_network(model="yolov8n.onnx")

    def load_network(self, model):
        try:
            providers = ['CPUExecutionProvider']
            so = ort.SessionOptions()
            so.log_severity_level = 3

            self.model = ort.InferenceSession(model, providers=providers, sess_options=so)
            self.output_details = [i.name for i in self.model.get_outputs()]
            self.input_details = [i.name for i in self.model.get_inputs()]

        except Exception as e:
            raise Exception(f"Cannot load model {model}: {e}")

    def letterbox(self, im, new_shape=(640, 640), color=(114, 114, 114), auto=True, scaleup=True, stride=32):
        # Resize and pad image while meeting stride-multiple constraints
        shape = im.shape[:2]  # current shape [height, width]
        if isinstance(new_shape, int):
            new_shape = (new_shape, new_shape)

        # Scale ratio (new / old)
        r = min(new_shape[0] / shape[0], new_shape[1] / shape[1])
        if not scaleup:  # only scale down, do not scale up (for better val mAP)
            r = min(r, 1.0)

        # Compute padding
        new_unpad = int(round(shape[1] * r)), int(round(shape[0] * r))
        dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - new_unpad[1]  # wh padding

        if auto:  # minimum rectangle
            dw, dh = np.mod(dw, stride), np.mod(dh, stride)  # wh padding

        dw /= 2  # divide padding into 2 sides
        dh /= 2

        if shape[::-1] != new_unpad:  # resize
            im = cv2.resize(im, new_unpad, interpolation=cv2.INTER_LINEAR)
        top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
        left, right = int(round(dw - 0.1)), int(round(dw + 0.1))
        im = cv2.copyMakeBorder(im, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color)  # add border
        return im, r, (dw, dh)

    def preprocess(self, img):
        try:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            image = img.copy()

            image, _, _ = self.letterbox(image, new_shape=(480, 640), auto=False)
            image = image.transpose((2, 0, 1))
            image = np.expand_dims(image, 0)
            image = image.astype(np.float32)
            image /= 255.0
            return image
        except Exception as e:
            raise Exception(f"Error in preprocessing image: {e}")

    def infer(self, img, threshold):
        img = np.array(img)
        img = img[:, :, ::-1].copy()
        preprocessed_img = self.preprocess(img)
        input_data = {self.input_details[0]: preprocessed_img}

        # ONNX inference
        output = list()
        try:
            output = self.model.run(self.output_details, input_data)[0]
        except Exception as e:
            raise Exception(f"Error in model running: {e}")

        h, w, _ = img.shape
        results = []
        for detection in output:
            scores = detection[:, 5]
            class_indices = np.argwhere(scores >= threshold).flatten()
            for class_index in class_indices:
                label = self.labels[class_index]
                score = scores[class_index]
                box = detection[class_index, :4]

                xtl = int(max(box[0], 0))
                ytl = int(max(box[1], 0))
                xbr = int(min(box[2], w))
                ybr = int(min(box[3], h))

                results.append({
                    "confidence": str(score),
                    "label": label,
                    "points": [xtl, ytl, xbr, ybr],
                    "type": "rectangle"
                })

        return results
