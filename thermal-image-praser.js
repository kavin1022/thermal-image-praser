const readHTMLFile = (file) => {
    let imgList = [];
    let index = 0;
    let end = 0;

    while (index != -1){
        index = index + 1;
        index = file.indexOf("data:image", index);
        if (index != -1){
            end = file.indexOf('"', index);
            let curr = file.substring(index, end)
            if (curr.includes( "data:image/.png;base64,iVBOR") === false){
                imgList.push(file.substring(index, end));
            }

        }
    }
    return imgList;
}

const downloadFiles = () => {
    console.log(imgList);
    for(let i = 0; i < imgList.length; i++){
        console.log(i);
        let a = document.createElement("a"); //Create <a>
        a.href = imgList[i]; //Image Base64 Goes here
        a.download = `Image${i}.jpg`; //File name Here
        a.click(); //Downloaded file
    }

}

function download_files() {
    const files = imgList
    function download_next(i) {
        if (i >= files.length) {
            return;
        }
        var a = document.createElement('a');
        a.href = files[i];
        a.target = '_parent';
        // Use a.download if available, it prevents plugins from opening.
        if ('download' in a) {
            a.download = `image${i}.jpg`;
        }
        // Add a to the doc for click to work.
        (document.body || document.documentElement).appendChild(a);
        if (a.click) {
            a.click(); // The click method is supported by most browsers.
        } else {
            $(a).click(); // Backup using jquery
        }
        // Delete the temporary link.
        a.parentNode.removeChild(a);
        // Download the next file with a small timeout. The timeout is necessary
        // for IE, which will otherwise only download the first file.
        setTimeout(function() {
            download_next(i + 1);
        }, 500);
    }
    // Initiate the first download.
    download_next(0);
  }

const displayOnPage = (imgList) => {
    for (let i = 0; i < imgList.length; i++){
        const wrapper = document.getElementById("wrapper");
        wrapper.innerHTML += `<img id="thermal-img" src="${imgList[i]}">`;
    }
    document.getElementById("dWrapper").innerHTML += "<button onclick='download_files()'>Download All</button>"
}

window.onload = () => {
    document.getElementById('inputfile').addEventListener('change', function() {
        var fr=new FileReader();
        fr.onload=function(){
            imgList = readHTMLFile(fr.result);
            displayOnPage(imgList);
        }
        fr.readAsText(this.files[0]);
    })
}

let imgList = [];
