// src/utils/webPolyfills/ImagePickerPolyfill.js
const createFileInput = (accept, multiple = false, capture = false) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = multiple;
    if (capture) {
      input.capture = 'environment';
    }
    input.style.display = 'none';
    document.body.appendChild(input);
    return input;
  };
  
  const processFiles = (files) => {
    return Array.from(files).map((file) => ({
      uri: URL.createObjectURL(file),
      fileName: file.name,
      type: file.type,
      fileSize: file.size,
      width: undefined,
      height: undefined,
    }));
  };
  
  const ImagePicker = {
    launchImageLibrary: (options = {}, callback) => {
      const input = createFileInput('image/*', options.selectionLimit > 1);
      
      input.onchange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          const assets = processFiles(files);
          callback({ assets });
        } else {
          callback({ didCancel: true });
        }
        document.body.removeChild(input);
      };
      
      input.onclick = () => {
        // Reset value to allow selecting the same file again
        input.value = '';
      };
      
      input.click();
    },
  
    launchCamera: (options = {}, callback) => {
      const input = createFileInput('image/*', false, true);
      
      input.onchange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          const assets = processFiles(files);
          callback({ assets });
        } else {
          callback({ didCancel: true });
        }
        document.body.removeChild(input);
      };
      
      input.click();
    },
  
    showImagePicker: (options = {}, callback) => {
      // Default to image library for web
      ImagePicker.launchImageLibrary(options, callback);
    },
  
    // react-native-image-crop-picker compatibility
    openPicker: (options = {}) => {
      return new Promise((resolve, reject) => {
        const input = createFileInput('image/*', options.multiple);
        
        input.onchange = (e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            const assets = processFiles(files);
            resolve(options.multiple ? assets : assets[0]);
          } else {
            reject(new Error('User cancelled'));
          }
          document.body.removeChild(input);
        };
        
        input.click();
      });
    },
  
    openCamera: (options = {}) => {
      return new Promise((resolve, reject) => {
        const input = createFileInput('image/*', false, true);
        
        input.onchange = (e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            const assets = processFiles(files);
            resolve(assets[0]);
          } else {
            reject(new Error('User cancelled'));
          }
          document.body.removeChild(input);
        };
        
        input.click();
      });
    },
  };
  
  export default ImagePicker;
  export const { launchImageLibrary, launchCamera, showImagePicker } = ImagePicker;