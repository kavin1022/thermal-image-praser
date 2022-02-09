const readHTMLFile = (file) => {
    let imgList = [];
    let index = 0;
    let start = 0;
    let end = 0;

    //Loop through HTML file and add all thermal image and digital image to page
    while (index != -1) {
        index = index + 1;
        index = file.indexOf("<img class", index);
        
        if (index != -1) {
            start = file.indexOf("data:image", index);
            end = file.indexOf('"', start);

            //Only pushing thermal images and their originals, skipping all other images in the file
            let n = file.substring(index, end)
            if (n.includes("c8e987c58b") || n.includes("F80e661d47")){
                imgList.push(file.substring(start, end));

            }
        }
    }
    return imgList;
}

const downloadZip = () => {
    compressed_img(imgList, "images");
}

function downloadIndividualImages() {
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
        setTimeout(function () {
            download_next(i + 1);
        }, 500);
    }
    // Initiate the first download.
    download_next(0);
}

const displayOnPage = (imgList) => {
    document.getElementById("dWrapper").innerHTML = "";
    document.getElementById("wrapper").innerHTML = "";

    for (let i = 0; i < imgList.length; i++) {
        document.getElementById("wrapper").innerHTML += `<img id="thermal-img" src="${imgList[i]}">`;
    }
    document.getElementById("dWrapper").innerHTML += "<button onclick='downloadZip()'>Download as Zip</button>"
    document.getElementById("dWrapper").innerHTML += "<button onclick='downloadIndividualImages()'>Download as Seperate Files</button>"
}

const readTable = (file) => {
    let table;
    let start = 0;
    let end = 0;

    let index = file.indexOf("Summary Table");
    if (index != -1) {
        start = file.indexOf("<tr ", index);
        end = file.indexOf("</table>", index);
        table = file.substring(start, end);

        document.getElementById("sumTitle").innerHTML += "Summary Table"
        document.getElementById("summary").innerHTML += table;
        document.getElementById("tableWrapper").innerHTML += "<button onclick='downloadTableAsCSV()'>Download as CSV</button>"
    }

    
    return table;
}

const downloadTableAsCSV = (table_id, separator = ',') => {
    // Select rows from table_id
    var rows = document.querySelectorAll('table#' + "summary" + ' tr');
    // Construct csv
    var csv = [];
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll('td, th');
        for (var j = 0; j < cols.length; j++) {
            // Clean innertext to remove multiple spaces and jumpline (break csv)
            var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
            // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
            data = data.replace(/"/g, '""');
            // Push escaped string
            row.push('"' + data + '"');
        }
        csv.push(row.join(separator));
    }
    var csv_string = csv.join('\n');
    // Download it
    var filename = "Summary_Table_" + new Date().toLocaleDateString() + '.csv';
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

window.onload = () => {
    document.getElementById('inputfile').addEventListener('change', function () {
        var fr = new FileReader();
        fr.onload = function () {
            imgList = readHTMLFile(fr.result);
            readTable(fr.result);
            displayOnPage(imgList);
        }
        fr.readAsText(this.files[0]);
    })
}

let imgList = [];
