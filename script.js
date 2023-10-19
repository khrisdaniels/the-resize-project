const initApp = () => {

    // Define built-in formats as an objects array	
    const formats = [
        {
        	name: "Instagram",
        	size: {
        		stories: {
                    orientation: 'portrait',
        			width: 1080,
        			height: 1920
        		},
        		square: {
                    orientation: 'square',
        			width: 1080,
        			height: 1080
        		},
        		landscape: {
                    orientation: 'landscape',
        			width: 1920,
        			height: 1080
        		},
        	}
        },
        {
            name: "Facebook",
            size: {
                post: {
                    orientation: 'square',
                    width: 1080,
                    height: 1080
                }
            }
        },
    ];

    // Define HTML elements into variables

    const uploadBlockElement = document.getElementById('home-upload');
    const editorBlockElement = document.getElementById('editor-platform');
    const droparea = document.querySelector('.droparea');
    const fileInput = document.getElementById('img-file');
    const errorElement = document.querySelector('.file-type-label.error');
    const progressBarContainer = document.querySelector('.progressbar-container');
    const progressBar = document.getElementById('progress-bar');
    const progressNum = document.querySelector('.progress-num');
    const pseudoColorPicker = document.querySelector('span.pseudo-picker');
    const colorPickerInput = document.getElementById('color-input');
    const backButtonComponent = document.getElementById('back-btn');
    const previewBox = document.getElementById('image-previews');
    const genImagesContainer = document.getElementById('generated-images-container');
    const exportBtn = document.getElementById('export-btn');

    const imageURLs = [];

    /*
     * Function expressions
     */

    // Handles displaying of the File Upload Elements
    const loadFileUploadComponent = () => {

        if (editorBlockElement.classList.contains('active')) {

            editorBlockElement.style.opacity = 0;
            setTimeout(() => {
                editorBlockElement.classList.remove('active');
            }, 250)
        }

        uploadBlockElement.classList.add('active');

        setTimeout(() => {
            uploadBlockElement.style.opacity = 1;
            uploadBlockElement.style['z-index'] = 1;
        }, 250);

    }

    // Handle displaying of Editor when file is uploaded or drop
    const loadEditorComponent = () => {

        if (uploadBlockElement.classList.contains('active')) {
            uploadBlockElement.style.opacity = 0;
            setTimeout(() => {
                uploadBlockElement.classList.remove('active');
            }, 250)
        }

        editorBlockElement.classList.add('active');

        setTimeout(() => {
            editorBlockElement.style.opacity = 1;
            editorBlockElement.style['z-index'] = 1;
        }, 250);

        console.log('Editor loaded');

    }

    const onUploadProgress = (event) => {
        if (event.lengthComputable) {
            handleProgressBar(event);
        }
    }

    const handleProgressBar = (e) => {
        showProgressBar();
        const percentLoaded = Math.round((e.loaded / e.total) * 100);
        progressBar.value = percentLoaded;
        progressNum.textContent = percentLoaded + '%';
    }

    const onImageLoad = (event) => {
        let imageURL;

        if (event) {
            imageURL = event.target.result;
        }

        setTimeout(loadEditorComponent, 500);

        processImage(imageURL);
    }

    const handleFiles = (file) => {

        const reader = new FileReader();

        if (file && file.type.startsWith('image/')) {

            reader.addEventListener('progress', onUploadProgress);

            reader.addEventListener('load', onImageLoad);


        } else {
            handleNotImage();
        }

        reader.readAsDataURL(file);

    }

    const handleNotImage = () => {

        errorElement.style.display = 'block';
    }

    const handleInput = (event) => {
        const files = event.target.files;

        handleFiles(files[0]);
    }


    const handleDrop = (event) => {
        const dt = event.dataTransfer;
        const files = dt.files;

        handleFiles(files[0]);

    }

    const showProgressBar = () => {
        progressBarContainer.style.visibility = 'visible';
        setTimeout(() => {
            progressBarContainer.style.opacity = 1;
        }, 50);
    }

    const getFileName = (event) => {

        let fileName;

        if (event && event.type === 'drop') {

            const dt = event.dataTransfer;
            const files = dt.files;

            fileName = files[0].name;

        } else if (event && event.type === 'input') {
            fileName = event.target.files[0].name;
        } else {
            alert('Error occured.');
        }

        setFileName(fileName)

    }

    const setFileName = (fileName) => {

        const fileNameLabel = document.querySelector('span.file-name');
        const text = document.createTextNode(fileName);

        fileNameLabel.appendChild(text);

    }

    const processImage = (image) => {

        if (image) {
            // Instantiate Image constructor
            const myImage = new Image();
            myImage.src = image;

            myImage.onload = () => {
                formats.forEach(format => {
                    for (const item in format.size) {
                        const { orientation, width, height } = format.size[item];

                        createThumbnailCanvas(myImage, item, orientation);

                        imageURLs.push(generateImage(myImage, item, orientation, width, height));
                    }
                });
            }
        } else {
            console.log('No image loaded');
        }

        zipImageURLs(imageURLs);
    }

    const createThumbnailCanvas = (image, format, orientation) => {
        const thumbnailCanvas = document.createElement('canvas');

        thumbnailCanvas.classList.add('canvas-preview-item');
        thumbnailCanvas.classList.add(format);
        thumbnailCanvas.classList.add(orientation);

        const ctx = thumbnailCanvas.getContext('2d');

        switch(orientation) {
            case "portrait":
                thumbnailCanvas.width = 150;
                thumbnailCanvas.height = 200;
                break;
            case "square":
                thumbnailCanvas.width = 200;
                thumbnailCanvas.height = 200;
                break;
            case "landscape":
                thumbnailCanvas.width = 200;
                thumbnailCanvas.height = 150;
                break;
        }


        // Calculate the aspect ratios of the canvas and the image
        const canvasAspectRatio = thumbnailCanvas.width / thumbnailCanvas.height;
        const imageAspectRatio = image.width / image.height;

        // Calculate the scaling factors for width and height
        let scaleFactor;
        if (canvasAspectRatio > imageAspectRatio) {
            scaleFactor = thumbnailCanvas.width / image.width;
        } else {
            scaleFactor = thumbnailCanvas.height / image.height;
        }

        // Calculate the dimensions to fit the image inside the canvas
        const scaledWidth = image.width * scaleFactor;
        const scaledHeight = image.height * scaleFactor;

        // Calculate the positioning to center the image in the canvas
        const xOffset = (thumbnailCanvas.width - scaledWidth) / 2;
        const yOffset = (thumbnailCanvas.height - scaledHeight) / 2;

        // Draw the image on the canvas with the calculated dimensions and positioning
        ctx.drawImage(image, xOffset, yOffset, scaledWidth, scaledHeight);

        previewBox.appendChild(thumbnailCanvas);

    }

    const generateImage = (image, format, orientation, formatWidth, formatHeight) => {
        const canvas = document.createElement('canvas');

        // Add custom data attribute
        canvas.dataset.format = orientation;

        // Set dimension of the canvas
        canvas.width = formatWidth;
        canvas.height = formatHeight;

        // Set classes for the canvas
        canvas.classList.add('image-item');
        canvas.classList.add(format);
        canvas.classList.add(orientation);

        const ctx = canvas.getContext('2d');

        // Calculate the aspect ratios of the canvas and the image
        const canvasAspectRatio = canvas.width / canvas.height;
        const imageAspectRatio = image.width / image.height;

        // Calculate the scaling factors for width and height
        let scaleFactor;
        if (canvasAspectRatio > imageAspectRatio) {
            scaleFactor = canvas.width / image.width;
        } else {
            scaleFactor = canvas.height / image.height;
        }

        // Calculate the dimensions to fit the image inside the canvas
        const scaledWidth = image.width * scaleFactor;
        const scaledHeight = image.height * scaleFactor;

        // Calculate the positioning to center the image in the canvas
        const xOffset = (canvas.width - scaledWidth) / 2;
        const yOffset = (canvas.height - scaledHeight) / 2;

        // Draw the image on the canvas with the calculated dimensions and positioning
        ctx.drawImage(image, xOffset, yOffset, scaledWidth, scaledHeight);

        genImagesContainer.appendChild(canvas);

        const dataURL = canvas.toDataURL('image/jpg', 0.5);

        return dataURL;

    }

    const zipImageURLs = (urlsArray) => {
        
        const zip = new JSZip();
    }


    /*
     * /Function expressions
     */


    loadFileUploadComponent();

    const dragActive = () => droparea.classList.add("green-border");
    const dragInactive = () => droparea.classList.remove("green-border");
    const prevents = (event) => event.preventDefault();

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        droparea.addEventListener(eventName, prevents);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        droparea.addEventListener(eventName, dragActive);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        droparea.addEventListener(eventName, dragInactive);
    });

    // On file drop events
    droparea.addEventListener('drop', (event) => {
        handleDrop(event);
        getFileName(event);
    });

    // On File upload events
    fileInput.addEventListener('input', (event) => {

        handleInput(event);
        getFileName(event);

    });

    // Trigger click on Color Picker input field when pseudo color-picker is clicked
    pseudoColorPicker.addEventListener('click', () => {
        colorPickerInput.click();
    });

    // Listen to Color Picker input
    // colorPickerInput.addEventListener('input', onColorChange);

    // Listen to 'Back' button click
    backButtonComponent.addEventListener('click', () => {
        window.location.reload();
    });

}

// On document is fully-loaded, load the app
document.addEventListener('DOMContentLoaded', initApp);