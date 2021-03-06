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
                markForUpdate: true,
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
    let ul = ev.target.parentNode.nextElementSibling.children[1];
    ul.appendChild(makeNewWargearItem());
}

function applyDataToSheet(data, sheet){
    let entry;
    let fld;
    let i;
    let updateMe = [];
    if(data.id){
        sheet.dataset.datasheetId = data.id;
    }
    if(data.unitName){
        sheet.querySelector('.unit-name').value = data.unitName;
    }
    if(data.powerRating){
        sheet.querySelector(
            '.power-rating'
        ).querySelector('input').value = data.powerRating;
    }
    if(data.battlefieldRole){
        let bfRole = sheet.querySelector('.battlefield-role');
        bfRole.classList.remove(...battlefieldRoles);
        bfRole.classList.add(data.battlefieldRole);
    }
    if(data.profiles.length > 0){
        let profiles = sheet.querySelector('.profiles-content');
        for(let item of data.profiles){
            i = 0;
            entry = makeNewDataGridRow(dataGrids.profile);
            for(let val of item){
                fld = entry.children[i].firstElementChild;
                if(val){
                    fld.tagName === 'DIV' ?
                        fld.textContent = val :
                        fld.value = val ;
                }
                if(fld.dataset.hasOwnProperty('updateMe')){
                    updateMe.push(fld);
                }
                i++;
            }
            profiles.appendChild(entry);
        }
    }
    if(data.unitComposition){
        sheet.querySelector(
            '.unit-composition-textarea'
        ).value = data.unitComposition;
    }
    if(data.weapons.length > 0){
        let weapons = sheet.querySelector('.weapons-content');
        for(let item of data.weapons){
            i = 0;
            entry = makeNewDataGridRow(dataGrids.weapon);
            for(let val of item){
                fld = entry.children[i].firstElementChild;
                if(val){
                    fld.tagName === 'DIV' ?
                        fld.textContent = val :
                        fld.value = val ;
                }
                if(fld.dataset.hasOwnProperty('updateMe')){
                    updateMe.push(fld);
                }
                i++;
            }
            weapons.appendChild(entry);
        }
    }
    if(data.wargear.length > 0){
        let wargear = sheet.querySelector('.wargear-list');
        for(let item of data.wargear){
            wargear.appendChild(makeNewWargearItem(item))
        }
    }
    if(data.abilities.length > 0){
        let abilities = sheet.querySelector('.abilities-list');
        for(let item of data.abilities){
            appendAbility(abilities, {name: item[0], text: item[1]});
        }
    }
    if(data.factionKeywords){
        sheet.querySelector(
            '.faction-keywords-input'
        ).value = data.factionKeywords;
    }
    if(data.keywords){
        sheet.querySelector('.keywords-input').value = data.keywords;
    }
    for(let el of updateMe){
        el.dispatchEvent(new InputEvent('input'));
        delete el.dataset.updateMe;
    }
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

function checkAndRestoreSavedSheets(){
    retrieveLocallyPersistedData();
    if(savedSheets.length > 0){
        syncSavedSheetsMenu();
    }
}

function clearCurrentSheet(ev){
    clearDataSheet(document.querySelector('.datasheet'));
}

function clearDataSheet(sheet){
    sheet.dataset.datasheetId = 'undefined';
    sheet.querySelector('.unit-name').value = '';
    sheet.querySelector('.power-rating').querySelector('input').value = '';
    let bfRole = sheet.querySelector('.battlefield-role');
    bfRole.classList.remove(...battlefieldRoles);
    bfRole.classList.add('troop');
    let profiles = sheet.querySelector('.profiles-content');
    for(let item of profiles.querySelectorAll('.profile-item')){
        profiles.removeChild(item);
    }
    sheet.querySelector('.unit-composition-textarea').value = '';
    let weapons = sheet.querySelector('.weapons-content');
    for(let item of weapons.querySelectorAll('.weapon-item')){
        weapons.removeChild(item);
    }
    let wargear = sheet.querySelector('.wargear-list');
    for(let item of wargear.querySelectorAll('.wargear-item')){
        wargear.removeChild(item);
    }
    let abilities = sheet.querySelector('.abilities-list');
    for(let item of abilities.querySelectorAll('.ability-item')){
        abilities.removeChild(item);
    }
    sheet.querySelector('.faction-keywords-input').value = '';
    sheet.querySelector('.keywords-input').value = '';
}

function clearNode(node){
    while(node.firstChild){
        node.removeChild(node.firstChild);
    }
    return node;
}

function dynamicallySizeTextarea(ev){
    this.style.height = 'auto';
    this.style.height = `${this.scrollHeight}px`;
}

function extractAbilities(sectionContent, data){
    data.abilities = [];
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
            if(el.firstElementChild.tagName === 'DIV'){
                values.push(
                    el.firstElementChild.textContent.length > 0 ?
                        el.firstElementChild.textContent : undefined
                );
            }else{
                values.push(
                    el.firstElementChild.value.length > 0 ?
                        el.firstElementChild.value : undefined
                );
            }
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
    }else{
        data.factionKeywords = undefined;
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
    }else{
        data.keywords = undefined;
    }
}

function extractProfileData(sectionContent, data){
    console.log(data.profiles);
    if(sectionContent.childElementCount > 1){
        for(let child of sectionContent.children){
            if(child.classList.contains('profile-item')){
                data.profiles.push(extractDataFields(child));
            }
        }
    }else{
        data.profiles = [];
    }
}

function extractWargearData(sectionContent, data){
    let wargearList = sectionContent.querySelector('ul');
    data.wargear = [];
    for(let li of wargearList.querySelectorAll('.wargear-item')){
        data.wargear.push(
            li.firstElementChild.value.length > 0 ?
                li.firstElementChild.value : undefined
        );
    }
}

function extractWeaponData(sectionContent, data){
    console.log(data.weapons);
    if(sectionContent.childElementCount > 1){
        for(let child of sectionContent.children){
            if(child.classList.contains('weapon-item')){
                data.weapons.push(extractDataFields(child));
            }
        }
    }else{
        data.weapons = [];
    }
}

function extractUnitCompData(sectionContent, data){
    let descript = sectionContent.children[1].value;
    data.unitComposition = descript.length > 0 ? descript : undefined;
}

function loadSavedSheet(ev){
    if(ev.target.value && ev.target.value !== '__defaultValue'){
        let savedSheet;
        let domSheet = document.querySelector('.datasheet');
        for(let sht of savedSheets){
            if(sht.id === ev.target.value){
                savedSheet = sht;
                break;
            }
        }
        if(savedSheet){
            clearDataSheet(domSheet);
            applyDataToSheet(savedSheet, domSheet);
        }else{
            throw new Error(`No sheet with ID [${ev.target.value}] found.`);
        }
    }
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
    if(fld.hasOwnProperty('markForUpdate')){
        input.dataset.updateMe = true;
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
                vex.dialog.prompt({
                    message: 'Enter ability description',
                    callback: function(val){
                        if(val !== undefined && val.length > 0){
                            userInput.text = val;
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

function makeNewWargearItem(text){
    let li = document.createElement('li');
    li.classList.add('wargear-item');
    let input = document.createElement('input');
    input.setAttribute('placeholder', 'Describe equipment');
    if(text && text.length > 0){
        input.value = text;
    }
    let removeBtn = document.createElement('div');
    removeBtn.classList.add(...['remove-btn', 'remove-wargear-btn']);
    removeBtn.setAttribute('data-html2canvas-ignore', '');
    removeBtn.addEventListener('click', removeThisChild, {passive: true});
    li.append(...[input, removeBtn]);
    return li
}

function makeUnitTemplate(){
    return {
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
}

function persistDataLocally(){
    try{
        window.localStorage.setItem(
            'savedSheets',
            JSON.stringify({savedSheets: savedSheets})
        );
    }catch(e){
        throw new Error('Local storage is not supported!');
    }
}

function removeThisChild(ev){
    let child = ev.target.parentNode;
    child.parentNode.removeChild(child);
}

function resolveSheetIdCollision(data){
    vex.dialog.confirm({
        message: `There's already a sheet saved as ${data.id}. Overwrite it?`,
        callback: function(val){
            console.log(this);
            if(val){
                let i = 0;
                for(let sht of savedSheets){
                    if(sht.id === this.id){
                        savedSheets[i] = this;
                        persistDataLocally();
                        break;
                    }
                    i++;
                }
            }
        }.bind(data)
    });
}

function retrieveLocallyPersistedData(){
    let strSavedSheets;
    try{
        strSavedSheets = window.localStorage.getItem('savedSheets');
        if(strSavedSheets !== null){
            try{
                for(let sht of JSON.parse(strSavedSheets).savedSheets){
                    savedSheets.push(sht);
                }
            }catch(e){
                console.log(e);
                throw new Error('Unable to correctly parse.');
            }

        }
    }catch(e){
        console.log(e);
        throw new Error('Local storage is not supported!');
    }
}

function requestDatasheetId(data){
    let sheetID;
    let autoName = 'new_datasheet'
    if(data.unitName === undefined){
        let i = 1;
        for(let sht of savedSheets){
            if(sht.id.toLowerCase().slice(0, 13) === autoName){
                i++;
            }
        }
        autoName = `${autoName}_${'0'.repeat(
            Math.max(3 - i.toString().length, 0)
        )}${i.toString()}`;
    }
    vex.dialog.prompt({
        message: 'Please give this datasheet a unique name.',
        value: data.unitName || autoName,
        callback: function(val){
            if(val){
                let needIdConfirm = false;
                val = val.trim();
                for(let sht of savedSheets){
                    if(sht.id === val){
                        needIdConfirm = true;
                        resolveSheetIdCollision(this);
                        //throw new Error(`ID [${val}] ALREADY EXISTS`);
                    }
                }
                if(!needIdConfirm){
                    this.id = val;
                    savedSheets.push(this);
                }
            }
        }.bind(data)
    });
}

function saveCurrentSheet(ev){
    saveDatasheet(document.querySelector('.datasheet'));
    syncSavedSheetsMenu();
}

function saveDatasheet(datasheet){
    console.log(datasheet);
    let data = makeUnitTemplate();
    console.log(JSON.stringify(data));
    let sheetID = datasheet.dataset.datasheetId;
    if(sheetID && sheetID !== 'undefined'){
        data.id = sheetID;
    }
    console.log(sheetID);
    for(let section of datasheet.querySelectorAll('section')){
        extractDataFromSection(section, data);
    }
    console.log(data);
    if(data.id === undefined){
        data.id = requestDatasheetId(data);
    }else{
        let needIdConfirm = false;
        for(let sht of savedSheets){
            if(sht.id === data.id){
                needIdConfirm = true;
                resolveSheetIdCollision(data);
            }
        }
        if(!needIdConfirm){
            savedSheets.push(data);
            persistDataLocally();
        }
    }
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
    let clearBtn = document.getElementById('clear-sheet-btn');
    clearBtn.addEventListener('click', clearCurrentSheet, {passive: false});
    let snapshotBtn = document.getElementById('snapshot-btn');
    snapshotBtn.addEventListener('click', snapshot, {passive: true});
    let saveBtn = document.getElementById('persist-data-btn');
    saveBtn.addEventListener('click', saveCurrentSheet, {passive: true});
    let savedSheetMenu = document.getElementById('saved-sheets-menu');
    savedSheetMenu.addEventListener(
        'change', loadSavedSheet, {passive: false}
    );
}

function snapshot(){
    let sheets = document.getElementsByClassName('datasheet');
    for(let sheet of sheets){
        html2canvas(sheet).then(
            function(canvas){
                let fileName = sheet.dataset.hasOwnProperty('datasheetId') ?
                    sheet.dataset.datasheetId : 'datasheet_test.png';
                let img = canvas.toDataURL();
                let a = document.createElement('a');
                a.href = img;
                a.setAttribute('download', fileName);
                a.click();
            }
        );
    }
}

function syncSavedSheetsMenu(){
    let menu = document.querySelector('#saved-sheets-menu');
    for(let child of menu.querySelectorAll('option')){
        if(child.value !== '__defaultValue'){
            menu.removeChild(child);
        }
    }
    let opt;
    let txt;
    for(let sht of savedSheets){
        opt = document.createElement('option');
        opt.setAttribute('value', sht.id)
        opt.appendChild(document.createTextNode(sht.id));
        menu.appendChild(opt);
    }
}

vex.defaultOptions.className = 'vex-theme-flat-attack';
setupInitialEventListeners();
checkAndRestoreSavedSheets();
