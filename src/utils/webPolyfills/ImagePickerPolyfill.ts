// src/utils/webPolyfills/ImagePickerPolyfill.ts
export const launchImageLibrary = (options: any, callback: any) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = options.selectionLimit > 1;
    
    input.onchange = (e: any) => {
      const files = Array.from(e.target.files || []);
      const assets = files.map((file: any) => ({
        uri: URL.createObjectURL(file),
        fileName: file.name,
        type: file.type,
        fileSize: file.size,
      }));
      
      callback({ assets });
    };
    
    input.click();
  };
  
  export const launchCamera = (options: any, callback: any) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        callback({
          assets: [{
            uri: URL.createObjectURL(file),
            fileName: file.name,
            type: file.type,
            fileSize: file.size,
          }]
        });
      }
    };
    
    input.click();
  };
  
  export default {
    launchImageLibrary,
    launchCamera,
    openPicker: launchImageLibrary,
    openCamera: launchCamera,
  };
  