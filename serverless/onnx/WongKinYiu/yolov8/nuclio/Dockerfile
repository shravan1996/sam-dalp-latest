# Start from Nuclio base image
ARG NUCLIO_LABEL=1.6.0
ARG NUCLIO_ARCH=amd64
ARG NUCLIO_BASE_IMAGE=python:3.8
ARG NUCLIO_ONBUILD_IMAGE=quay.io/nuclio/handler-builder-python-onbuild:${NUCLIO_LABEL}-${NUCLIO_ARCH}
FROM ${NUCLIO_ONBUILD_IMAGE} as processor

# Install necessary packages for building and running the model
FROM ${NUCLIO_BASE_IMAGE}
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0 libpython3-dev


# Copy the model and the necessary files
RUN mkdir -p /opt/nuclio
ADD https://drive.google.com/file/d/1W-EJc01-tnWnaSpYgyvyCJ1vV-GiitUX/view?usp=sharing /opt/nuclio/
RUN git clone https://github.com/ultralytics/ultralytics /opt/nuclio/yolov8/
RUN  ls /opt/nuclio/yolov8/

# COPY /opt/nuclio/yolov8/requirements.txt /opt/nuclio/

# Install the necessary Python packages
# RUN pip install --no-cache-dir -r /opt/nuclio/requirements.txt
RUN cp /opt/nuclio/yolov8/requirements.txt /opt/nuclio/ && \
    pip install --no-cache-dir -r /opt/nuclio/requirements.txt

# Copy the function code, including the handler directory to /opt/nuclio
COPY . /opt/nuclio

# Copy the model to the handler directory
RUN cp /opt/nuclio/yolov8n.pt /opt/nuclio/handler

# Set the working directory to the handler directory
WORKDIR /opt/nuclio/

# Run the function code
CMD ["python", "main.py"]