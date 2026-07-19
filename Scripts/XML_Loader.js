function LoadXMLData() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../XML/Header.xml", true);
    xhr.onload = function() {
        if (this.status == 200) {
            var xmlDoc = this.responseXML;
            // process xml data here
            var banner = xmlDoc.getElementsByClassName("banner");
            var header = document.getElementByTagName("header");
            
            for (vat i = 0; i < banner.length; i++){
                header.add(banner[i]);
            }
        }
    };
    xhr.send()
}

window.onload = LoadXMLData();