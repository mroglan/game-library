FilePond.registerPlugin(
	FilePondPluginImagePreview,
	FilePondPluginImageResize,
	FilePondPluginFileEncode,
)

FilePond.setOptions({
	stylePanelAspectRatio: 150/150,
	imageResizeMode: 'cover',
});

FilePond.parse(document.body);