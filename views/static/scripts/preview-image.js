function previewImage() {
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');

    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onloadend = function () {
            imagePreview.src = reader.result;
        }
        reader.readAsDataURL(file);
    } else {
        imagePreview.src = ''; // Clear preview if no file selected
    }
}