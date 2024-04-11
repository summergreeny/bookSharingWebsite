FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
);

//change styles of filePond Style
// set options for how we want to resize the image -> Image Review -> ImageResizeTargewidth and height
FilePond.setOptions({
  //setOptions is a method that allows you to set global options for FilePond. It's inside FilePond object
  stylePanelAspectRatio: 150 / 100,
  ImageResizeTargetWidth: 100,
  ImageResizeTargetHeight: 150,
});

// put all file inputs in our entire page into filepond inputs
FilePond.parse(document.body);
