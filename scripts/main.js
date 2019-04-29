const addProfileBtn = document.getElementById('add-profile');
const profileFields = [
    {
        classes: ['wname'],
        name: 'NAME'
    },
    {
        classes: ['wstat'],
        name: 'M'
    },
    {
        classes: ['wstat'],
        name: 'WS'
    },
    {
        classes: ['wstat'],
        name: 'BS'
    },
    {
        classes: ['wstat'],
        name: 'S'
    },
    {
        classes: ['wstat'],
        name: 'T'
    },
    {
        classes: ['wstat'],
        name: 'W'
    },
    {
        classes: ['wstat'],
        name: 'A'
    },
    {
        classes: ['wstat'],
        name: 'Ld'
    },
    {
        classes: ['wstat'],
        name: 'Sv'
    },
];
function addProfile(ev){
    console.log(ev);
    let tbody = ev.target.parentNode.parentNode.children[1].children[1];
    tbody.appendChild(makeProfileRow());
}

function makeProfileRow(){
    let row = document.createElement('tr');
    for(let fld of profileFields){
        row.appendChild(makeProfileCell(fld.classes))
    }
    return row;
}

function makeProfileCell(classList){
    let cell = document.createElement('td');
    for(let cls of classList){
        cell.classList.add(cls);
    }
    let textarea = document.createElement('textarea');
    textarea.setAttribute('rows', '1');
    cell.appendChild(textarea);
    return cell;
}

addProfileBtn.addEventListener('click', addProfile, {passive: true});
