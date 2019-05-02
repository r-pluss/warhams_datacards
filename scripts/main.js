const battlefieldRoles = [
    'dedicated_transport',
    'elite',
    'fast_attack',
    'flyer',
    'fortification',
    'heavy_support',
    'hq',
    'lord_of_war',
    'troop'
];
const profileFields = [
    {
        classes: ['wname'],
        name: 'NAME',
        placeholder: 'Enter Model Name'
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
    let tbody = ev.target.parentNode.children[0].children[1];
    tbody.appendChild(makeProfileRow());
}

function changeBattlefieldRole(ev){
    console.log(ev);
    let currentClass;
    let currentIndex;
    for(let cls of ev.target.classList){
        if(battlefieldRoles.indexOf(cls) > -1){
            console.log('blah');
            currentIndex = battlefieldRoles.indexOf(cls);
            currentClass = battlefieldRoles[currentIndex];
            console.log([currentIndex, currentClass]);
            break;
        }
    }
    console.log(currentClass);
    if(currentClass !== undefined){
        ev.target.classList.remove(currentClass);
        if(currentIndex === (battlefieldRoles.length - 1)){
            ev.target.classList.add(battlefieldRoles[0]);
        }else{
            ev.target.classList.add(battlefieldRoles[currentIndex + 1]);
        }
    }
}

function hideUIElements(){
    let els = document.getElementsByClassName('ui-only');
    for(let el of els){
        el.classList.add('hidden');
    }
}

function makeProfileRow(){
    let row = document.createElement('tr');
    for(let fld of profileFields){
        row.appendChild(makeProfileCell(fld.classes, fld.hasOwnProperty('placeholder') ? fld.placeholder : undefined))
    }
    let removeBtn = document.createElement('button');
    removeBtn.classList.add(...['remove-profile', 'ui-only']);
    removeBtn.addEventListener('click', removeProfile, {passive: true});
    row.appendChild(removeBtn);
    return row;
}

function makeProfileCell(classList, placeholder){
    let cell = document.createElement('td');
    for(let cls of classList){
        cell.classList.add(cls);
    }
    let textarea = document.createElement('textarea');
    textarea.setAttribute('rows', '1');
    if(placeholder !== undefined){
        textarea.setAttribute('placeholder', placeholder);
    }
    cell.appendChild(textarea);
    return cell;
}

function removeProfile(ev){
    let tr = ev.target.parentNode;
    tr.parentNode.removeChild(tr);
}

function snapshot(){
    hideUIElements();
    let sheets = document.getElementsByClassName('datasheet');
    for(let sheet of sheets){
        html2canvas(sheet).then(
            function(canvas){
                let img = canvas.toDataURL();
                let a = document.createElement('a');
                a.href = img;
                a.setAttribute('download', 'datasheet_test.png');
                a.click();
            }
        );
    }
    unHideUIElements();
}

function unHideUIElements(){
    let els = document.getElementsByClassName('ui-only');
    for(let el of els){
        el.classList.remove('hidden');
    }
}

let bfRoles = document.getElementsByClassName('battlefield-role');
for(let el of bfRoles){
    el.addEventListener('click', changeBattlefieldRole, {passive: true})
}
let addProfileBtns = document.getElementsByClassName('add-profile');
for(let el of addProfileBtns){
    el.addEventListener('click', addProfile, {passive: true});
}

let snapshotBtns = document.getElementsByClassName('snapshot-btn');
for(let btn of snapshotBtns){
    btn.addEventListener('click', snapshot, {passive: true})
}
