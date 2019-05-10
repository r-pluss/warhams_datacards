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
const dataGrids = {
    profile: {
        fieldList: [
            {
                fieldName: 'Name',
                fieldClasses: ['profile-field'],
                placeholder: 'Enter Model Name'
            },
            {
                fieldName: 'M',
                fieldClasses: ['profile-field']
            },
            {
                fieldName: 'WS',
                fieldClasses: ['profile-field']
            },
            {
                fieldName: 'BS',
                fieldClasses: ['profile-field']
            },
            {
                fieldName: 'S',
                fieldClasses: ['profile-field']
            },
            {
                fieldName: 'T',
                fieldClasses: ['profile-field']
            },
            {
                fieldName: 'W',
                fieldClasses: ['profile-field']
            },
            {
                fieldName: 'A',
                fieldClasses: ['profile-field']
            },
            {
                fieldName: 'Ld',
                fieldClasses: ['profile-field']
            },
            {
                fieldName: 'Sv',
                fieldClasses: ['profile-field']
            }
        ],
        itemClasses: ['profile-item'],
        removeBtn: {
            classList: ['remove-btn', 'remove-profile-btn'],
            events:[{func: removeThisChild, type: 'click'}]
        }
    },
    weapon: {
        fieldList: [
            {
                fieldName: 'Weapon',
                fieldClasses: ['weapon-field'],
                placeholder: 'Weapon Name'
            },
            {
                fieldName: 'Range',
                fieldClasses: ['weapon-field']
            },
            {
                fieldName: 'Type',
                fieldClasses: ['weapon-field']
            },
            {
                fieldName: 'S',
                fieldClasses: ['weapon-field']
            },
            {
                fieldName: 'AP',
                fieldClasses: ['weapon-field']
            },
            {
                fieldName: 'D',
                fieldClasses: ['weapon-field']
            },
            {
                fieldName: 'Abilities',
                fieldClasses: ['weapon-field'],
                input: 'textarea',
                inputEvents: [],
                placeholder: '--'
            }
        ],
        itemClasses: ['weapon-item'],
        removeBtn: {
            classList: ['remove-btn', 'remove-weapon-btn'],
            events:[{func: removeThisChild, type: 'click'}]
        }
    }
};

function appendAbility(list, config){
    let li = document.createElement('li');
    li.classList.add('ability-item');
    let abName = document.createElement('div');
    let abText = document.createElement('div');
    abName.appendChild(document.createTextNode(config.name));
    abName.classList.add('ability-name');
    abText.appendChild(document.createTextNode(config.text));
    abText.classList.add('ability-text');
    let removeBtn = document.createElement('div');
    removeBtn.classList.add(...['remove-btn', 'remove-ability-btn']);
    removeBtn.setAttribute('data-html2canvas-ignore', '');
    removeBtn.addEventListener('click', removeThisChild, {passive: true});
    li.append(...[abName, abText, removeBtn]);
    list.appendChild(li);
}

function appendDataGridRow(ev){
    let contentBody = ev.target.parentNode.nextElementSibling;
    if(contentBody.classList.contains('profiles-content')){
        contentBody.appendChild(makeNewDataGridRow(dataGrids.profile));
    }else if(contentBody.classList.contains('weapons-content')){
        contentBody.appendChild(makeNewDataGridRow(dataGrids.weapon));
    }else{
        throw new Error('unrecognized data table type');
    }
}

function appendWargearItem(ev){
    let ul = ev.target.parentNode.nextSibling.children[1];
    let li = document.createElement('li');
    li.classList.add('wargear-item');
    let input = document.createElement('input');
    let removeBtn = document.createElement('div');
    removeBtn.classList.add(...['remove-btn', 'remove-wargear-btn']);
    removeBtn.setAttribute('data-html2canvas-ignore', '');
    removeBtn.addEventListener('click', removeThisChild, {passive: true});
    li.append(...[input, removeBtn]);
    ul.appendChild(li);
}

function changeBattlefieldRole(ev){
    let currentClass;
    let currentIndex;
    for(let cls of ev.target.classList){
        if(battlefieldRoles.indexOf(cls) > -1){
            currentIndex = battlefieldRoles.indexOf(cls);
            currentClass = battlefieldRoles[currentIndex];
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

function makeDataGridCell(fld){
    let cell = document.createElement('div');
    cell.classList.add(...fld.fieldClasses);
    cell.dataset.fieldName = fld.fldName;
    let input = document.createElement(
        fld.hasOwnProperty('input') ? fld.input : 'input'
    );
    if(fld.hasOwnProperty('placeholder') && fld.placeholder !== ''){
        input.setAttribute('placeholder', fld.placeholder);
    }
    if(fld.hasOwnProperty('inputEvents')){
        for(let ev of fld.inputEvents){
            input.addEventListener(
                ev.type, ev.func, ev.conf || {passive: true}
            );
        }
    }
    if(fld.hasOwnProperty('value')){
        input.value = fld.value;
    }
    cell.appendChild(input);
    return cell;
}

function makeNewAbility(ev){
    let userInput = {
        name: undefined,
        text: undefined
    };
    vex.dialog.prompt({
        message: 'Enter ability name',
        callback: function(val){
            if(val !== undefined && val.length > 0){
                userInput.name = val;
                console.log(`Ability name: ${userInput.name}`);
                vex.dialog.prompt({
                    message: 'Enter ability description',
                    callback: function(val){
                        if(val !== undefined && val.length > 0){
                            userInput.text = val;
                            console.log(`Ability text: ${userInput.text}`);
                            console.log(ev.target);
                            appendAbility(
                                ev.target.parentNode.nextSibling.children[1],
                                userInput
                            );
                        }
                    }
                });
            }
        }
    });
}

function makeNewDataGridRow(config){
    let row = document.createElement('div');
    row.classList.add(...config.itemClasses);
    for(let fld of config.fieldList){
        row.appendChild(makeDataGridCell(fld));
    }
    let removeBtn = document.createElement('div');
    removeBtn.classList.add(...config.removeBtn.classList);
    removeBtn.setAttribute('data-html2canvas-ignore', '');
    for(let ev of config.removeBtn.events){
        removeBtn.addEventListener(
            ev.type, ev.func, ev.config || {passive: true}
        );
    }
    row.appendChild(removeBtn);
    return row;
}

function removeThisChild(ev){
    let child = ev.target.parentNode;
    child.parentNode.removeChild(child);
}

function setupInitialEventListeners(){
    let addAbilityBtns = document.getElementsByClassName('add-ability-btn');
    for(let el of addAbilityBtns){
        el.addEventListener('click', makeNewAbility, {passive: true});
    }
    let bfRoles = document.getElementsByClassName('battlefield-role');
    for(let el of bfRoles){
        el.addEventListener('click', changeBattlefieldRole, {passive: true})
    }
    let addProfileBtns = document.getElementsByClassName('add-profile-btn');
    let addWeaponBtns = document.getElementsByClassName('add-weapon-btn');
    for(let btn of [...addProfileBtns, ...addWeaponBtns]){
        btn.addEventListener('click', appendDataGridRow, {passive: true});
    }
    let addWargearBtns = document.getElementsByClassName('add-wargear-btn');
    for(let btn of addWargearBtns){
        btn.addEventListener('click', appendWargearItem, {passive: true});
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

vex.defaultOptions.className = 'vex-theme-flat-attack';
setupInitialEventListeners();
