function deletePost(){
    var checkBox = document.getElementsByClassName('checkbox');
    var itemsDeleted = [];
    for (var i = 0; i < checkBox.length; i++) {
        if (checkBox[i].checked)
            itemsDeleted.push(checkBox[i].value)
    }
    if (itemsDeleted.length < 1) {
        alert("please select at least one item for delete")
        return;
    }
    var cnf = confirm("Do u want to delete all entries??")
    if (!cnf)
        return;
    var deleteItems = {
        items: itemsDeleted
    }
    var httpreq = new XMLHttpRequest;
    httpreq.open('DELETE', '/delete')
    httpreq.setRequestHeader("content-type", "application/json");
    httpreq.send(JSON.stringify(deleteItems))
    httpreq.onreadystatechange = function () {
        if (httpreq.readyState === 4 && httpreq.status === 200)
            window.location.href = '/view';
    }

}