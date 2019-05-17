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
                fieldClasses: ['profile-field'],
                placeholder: '-'
            },
            {
                fieldName: 'WS',
                fieldClasses: ['profile-field'],
                placeholder: '-'
            },
            {
                fieldName: 'BS',
                fieldClasses: ['profile-field'],
                placeholder: '-'
            },
            {
                fieldName: 'S',
                fieldClasses: ['profile-field'],
                placeholder: '-'
            },
            {
                fieldName: 'T',
                fieldClasses: ['profile-field'],
                placeholder: '-'
            },
            {
                fieldName: 'W',
                fieldClasses: ['profile-field'],
                placeholder: '-'
            },
            {
                fieldName: 'A',
                fieldClasses: ['profile-field'],
                placeholder: '-'
            },
            {
                fieldName: 'Ld',
                fieldClasses: ['profile-field'],
                placeholder: '-'
            },
            {
                fieldName: 'Sv',
                fieldClasses: ['profile-field'],
                placeholder: '-'
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
                fieldClasses: ['weapon-field'],
                placeholder: '-'
            },
            {
                fieldName: 'Type',
                fieldClasses: ['weapon-field'],
                placeholder: '-'
            },
            {
                fieldName: 'S',
                fieldClasses: ['weapon-field'],
                placeholder: '-'
            },
            {
                fieldName: 'AP',
                fieldClasses: ['weapon-field'],
                placeholder: '-'
            },
            {
                fieldName: 'D',
                fieldClasses: ['weapon-field'],
                placeholder: '-'
            },
            {
                fieldName: 'Abilities',
                fieldClasses: ['weapon-field'],
                input: 'textarea',
                inputEvents: [
                    {
                        func: dynamicallySizeTextarea,
                        type: 'input'
                    }
                ],
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
const datasheetSections = [
    {class: 'header', extractor: extractHeaderData},
    {class: 'profiles', extractor: extractProfileData},
    {class: 'unit-composition', extractor: extractUnitCompData},
    {class: 'weapons', extractor: extractWeaponData},
    {class: 'wargear', extractor: extractWargearData},
    {class: 'abilities', extractor: extractAbilities},
    {class: 'faction-keywords', extractor: extractFactionKeywords},
    {class: 'keywords', extractor: extractKeywords}
];
const savedSheets = [];
const unitTemplate = {
    abilities: [],
    battlefieldRole: 'troop',
    id: undefined,
    factionKeywords: undefined,
    keywords: undefined,
    powerRating: undefined,
    profiles: [],
    unitComposition: undefined,
    unitName: undefined,
    wargear: [],
    weapons: []
};

function appendAbility(list, config){
    console.log(list);
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
    let ul = ev.target.parentNode.nextElementSibling.children[1];
    let li = document.createElement('li');
    li.classList.add('wargear-item');
    let input = document.createElement('input');
    input.setAttribute('placeholder', 'Describe equipment');
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

function dynamicallySizeTextarea(ev){
    this.style.height = 'auto';
    this.style.height = `${this.scrollHeight}px`;
}

function extractAbilities(sectionContent, data){
    for(let item of sectionContent.querySelectorAll('.ability-item')){
        data.abilities.push(
            [
                item.querySelector('.ability-name').textContent,
                item.querySelector('.ability-text').textContent
            ]
        );
    }
}

function extractDataFields(item){
    let values = [];
    for(let el of item.children){
        if(!el.classList.contains('remove-btn')){
            values.push(
                el.firstElementChild.textContent.length > 0 ?
                    el.firstElementChild.textContent : undefined
            );
        }
    }
    return values;
}

function extractDataFromSection(section, data){
    for(let sect of datasheetSections){
        if(section.classList.contains(sect.class)){
            sect.extractor(section.children[1], data);
            break;
        }
    }
}

function extractFactionKeywords(sectionContent, data){
    if(sectionContent.children[1].value.length > 0){
        data.factionKeywords = sectionContent.children[1].value;
    }
}

function extractHeaderData(sectionContent, data){
    let battleRole = sectionContent.children[0];
    let pwrRating = sectionContent.children[1].children[0];
    let unitName = sectionContent.children[2];
    for(let role of battlefieldRoles){
        if(battleRole.classList.contains(role)){
            data.battlefieldRole = role;
            break;
        }
    }
    data.powerRating = pwrRating.value.length > 0 ?
        pwrRating.value : undefined;
    data.unitName = unitName.value.length > 0 ?
        unitName.value : undefined;
}

function extractKeywords(sectionContent, data){
    if(sectionContent.children[1].value.length > 0){
        data.keywords = sectionContent.children[1].value;
    }
}

function extractProfileData(sectionContent, data){
    if(sectionContent.childElementCount > 1){
        for(let child of sectionContent.children){
            if(child.classList.contains('profile-item')){
                data.profiles.push(extractDataFields(child));
            }
        }
    }
}

function extractWargearData(sectionContent, data){
    let wargearList = sectionContent.querySelector('ul');
    for(let li of wargearList.querySelectorAll('.wargear-item')){
        data.wargear.push(
            li.firstElementChild.value.length > 0 ?
                li.firstElementChild.value : undefined
        );
    }
}

function extractWeaponData(sectionContent, data){
    if(sectionContent.childElementCount > 1){
        for(let child of sectionContent.children){
            if(child.classList.contains('weapon-item')){
                data.weapons.push(extractDataFields(child));
            }
        }
    }
}

function extractUnitCompData(sectionContent, data){
    let descript = sectionContent.children[1].value;
    data.unitComposition = descript.length > 0 ? descript : undefined;
}

function makeDataGridCell(fld){
    let cell = document.createElement('div');
    cell.classList.add(...fld.fieldClasses);
    cell.dataset.fieldName = fld.fldName;
    let input = document.createElement(
        fld.hasOwnProperty('input') ? fld.input : 'div'
    );
    if(!fld.hasOwnProperty('input')||fld.input === 'input'){
        input.setAttribute('contenteditable', '');
        input.classList.add('grid-cell');
    }
    if(fld.hasOwnProperty('input')&&fld.input === 'textarea'){
        input.setAttribute('rows', '1');
    }
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
                            let cntnt = ev.target.parentNode.nextElementSibling;
                            appendAbility(
                                cntnt.querySelector('.abilities-list'),
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
            ev.type, ev.func, ev.config || false
        );
    }
    row.appendChild(removeBtn);
    return row;
}

function removeThisChild(ev){
    let child = ev.target.parentNode;
    child.parentNode.removeChild(child);
}

function saveDatasheet(datasheet){
    let data = Object.assign({}, unitTemplate);
    for(let section of datasheet.querySelectorAll('section')){
        extractDataFromSection(section, data);
    }
    return data;
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
    for(let sht of document.getElementsByClassName('datasheet')){
        for(let textarea of sht.querySelectorAll('textarea')){
            textarea.addEventListener('input', dynamicallySizeTextarea);
        }
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
