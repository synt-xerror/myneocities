const BrowserPonies = {};

BrowserPonies.setImage = function (url) {
    if (this.current_imgurl !== url) {
        this.img.src = dataUrl('text/html',
            '<html><head><title>' + Math.random() +
            '</title><style text="text/css">html,body{margin:0;padding:0;background:transparent;}</style><body></body><img src="' +
            escapeXml(URL.abs(url)) + '"/></html>');
        this.img.style.width = this.current_size.width + "px";
        this.img.style.height = this.current_size.height + "px";
        this.current_imgurl = url;
    }
}