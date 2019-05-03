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
const weaponFields = [
    {
        classes: ['wname'],
        name: 'WEAPON',
        placeholder: 'Enter Weapon Name'
    },
    {
        classes: ['wstat'],
        name: 'Range'
    },
    {
        classes: ['wstat'],
        name: 'Type'
    },
    {
        classes: ['wstat'],
        name: 'S'
    },
    {
        classes: ['wstat'],
        name: 'AP'
    },
    {
        classes: ['wstat'],
        name: 'D'
    },
    {
        classes: ['wname'],
        name: 'ABILITIES',
        placeholder: 'Special Properties'
    }
];

function appendDataTableRow(ev){
    let tbody = ev.target.parentNode.children[0].children[1];
    if(tbody.parentNode.classList.contains('profile-table')){
        tbody.appendChild(makeNewDataTableRow('remove-profile', profileFields));
    }else if(tbody.parentNode.classList.contains('weapon-table')){
        tbody.appendChild(makeNewDataTableRow('remove-weapon', weaponFields));
    }else{
        throw new Error('unrecognized data table type');
    }
}

function appendListItem(ev){
    let ul = ev.target.parentNode.nextSibling.nextSibling;
    let li = document.createElement('li');
    li.classList.add('wargear-item');
    let input = document.createElement('input');
    let removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-wargear');
    removeBtn.addEventListener('click', removeListItem, {passive: true});
    li.append(...[input, removeBtn]);
    ul.appendChild(li);
}

function changeBattlefieldRole(ev){
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
    if(currentClass !== undefined){
        ev.target.classList.remove(currentClass);
        if(currentIndex === (battlefieldRoles.length - 1)){
            ev.target.classList.add(battlefieldRoles[0]);
        }else{
            ev.target.classList.add(battlefieldRoles[currentIndex + 1]);
        }
    }
}

function makeDataTableCell(classList, placeholder){
    let cell = document.createElement('td');
    cell.classList.add(...classList);
    let input = document.createElement('input');
    if(placeholder !== undefined){
        input.setAttribute('placeholder', placeholder);
    }
    cell.appendChild(input);
    return cell;
}

function makeNewDataTableRow(removeBtnClass, fieldList){
    let row = document.createElement('tr');
    for(let fld of fieldList){
        row.appendChild(
            makeDataTableCell(
                fld.classes,
                fld.hasOwnProperty('placeholder') ? fld.placeholder : undefined
            )
        );
    }
    let removeBtn = document.createElement('button');
    removeBtn.classList.add(removeBtnClass);
    removeBtn.setAttribute('data-html2canvas-ignore', '');
    removeBtn.addEventListener('click', removeDataTableRow, {passive: true});
    row.appendChild(removeBtn);
    return row;
}

function removeDataTableRow(ev){
    let tr = ev.target.parentNode;
    tr.parentNode.removeChild(tr);
}

function removeListItem(ev){
    let li = ev.target.parentNode;
    li.parentNode.removeChild(li);
}

function setupInitialEventListeners(){
    let bfRoles = document.getElementsByClassName('battlefield-role');
    for(let el of bfRoles){
        el.addEventListener('click', changeBattlefieldRole, {passive: true})
    }
    let addProfileBtns = document.getElementsByClassName('add-profile');
    let addWeaponBtns = document.getElementsByClassName('add-weapon');
    for(let btn of [...addProfileBtns, ...addWeaponBtns]){
        btn.addEventListener('click', appendDataTableRow, {passive: true});
    }
    let addWargearBtns = document.getElementsByClassName('add-wargear');
    for(let btn of addWargearBtns){
        btn.addEventListener('click', appendListItem, {passive: true});
    }
    let snapshotBtns = document.getElementsByClassName('snapshot-btn');
    for(let btn of snapshotBtns){
        btn.addEventListener('click', snapshot, {passive: true})
    }
}

function snapshot(){
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
}

setupInitialEventListeners();
