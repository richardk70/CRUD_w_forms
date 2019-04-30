var bySchool = document.getElementById('bySchool');
var byAll = document.getElementById('byAll');

bySchool.addEventListener('click', () => {
    var selectSchool = document.getElementById('select-school');
    fetch('/', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "school": selectSchool.value,
        })
    })
    .then(res => {
        if(res.ok) return res.json()
    })
    .then(data => {
        window.location.reload();
    });
});

byAll.addEventListener('click', () => {
    console.log('byAll');
});