const initApp = () => {

    // Define built-in formats as an objects array	
    const formats = [
        // {
        // 	name: "Instagram",
        // 	size: {
        // 		stories: {
        // 			width: 1080,
        // 			height: 1920
        // 		},
        // 		square: {
        // 			width: 1080,
        // 			height: 1080
        // 		},
        // 		landscape: {
        // 			width: 1920,
        // 			height: 1080
        // 		},
        // 	}
        // },
        {
            name: "Facebook",
            size: {
                post: {
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
    const theCanvas = document.getElementById('the-canvas');


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

            console.log(myImage)

            formats.forEach(format => {
                for (const size in format.size) {
                    let { width, height } = format.size[size];

                    createCanvas(myImage, size, width, height);
                }
            });
        } else {
            console.log('No image loaded');
        }
    };

    const createCanvas = (img, formatName, width, height) => {
        console.log('create canvas executed');
        console.log('img:', img);
        console.log('formatName:', formatName);
        console.log('width:', width);
        console.log('height', height);
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