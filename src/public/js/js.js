const server = "http://localhost:3000/";
$(document).ready(function () {
    $("#generar").click(function () {
        const form = $('form').serialize();
        $.post(server + '/api/prueba', form, function (file) {
            $.get(server + '/api/file/' + file, function (data) {
                var oSerializer = new XMLSerializer();
                downloadURI("data:text/xml," + oSerializer.serializeToString(data), file);
            })
        })
        return false;
    })
})
function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}
