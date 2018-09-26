function tableJsonify(elem){
    this.elem = elem;
}

tableJsonify.prototype.initFunction = function() {
    const table = this.elem.querySelector('table');
    const tbody = this.elem.querySelector('tbody');
    const add_json = this.elem.querySelector('#add-json');
    const load_json = this.elem.querySelector('#load-json');
    const replace_json = this.elem.querySelector('#replace-json');
    const file_load = this.elem.querySelector('#file-load');
    const textarea = this.elem.querySelector('#json-holder');
    const error_msg = this.elem.querySelector('#error-msg');
    const file_export = this.elem.querySelector('#file-export');
    const json_file = this.elem.querySelector('#json-file');
    const csv_file = this.elem.querySelector('#csv-file');

    // Constants for sorting
    const key_up = this.elem.querySelector('#key-up');
    const key_down = this.elem.querySelector('#key-down');
    const value_up = this.elem.querySelector('#value-up');
    const value_down = this.elem.querySelector('#value-down');

    const file_field = this.elem.querySelector('#hint');
    let format = 'json';

    add_json.addEventListener('click', function (e) {
        e.preventDefault();
        error_msg.style.display = 'none';
        let val = textarea.value;
        if(format === 'csv'){
            val = JSON.stringify(csv2json(val));
        }
        try {
            string2table(val, tbody);
        }catch (e) {
            error_msg.style.display = 'block';
            error_msg.innerHTML= e.message;
        }
    });
    load_json.addEventListener('click',function(e){
        e.preventDefault();
        error_msg.style.display = 'none';
        try{
            let str = '';
            let json = rows2json(tbody);
            if(format === 'csv'){
                str = json2csv(json);
            }else {
                str = JSON.stringify(json);
            }
            textarea.value = str;
        }catch (e) {
            error_msg.innerHTML = e.message;
            error_msg.style.display = 'block';
        }
    });
    replace_json.addEventListener('click',function(e){
        e.preventDefault();
        error_msg.style.display = 'none';
        tbody.innerHTML = '';
        let val = textarea.value;
        if(format === 'csv'){
            val = JSON.stringify(csv2json(val));
        }
        try{
            string2table(val, tbody);
        }catch (e) {
            error_msg.innerHTML = e.message;
            error_msg.style.display = 'block';
        }
    });
    file_load.addEventListener('change', function (e) {
        error_msg.style.display = 'none';
        const input = this;
        const url = input.value;
        const ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
        try{
            if (input.files && input.files[0] && (ext === "csv" || ext === "json")) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    let text = e.target.result;
                    if(ext === 'csv') {
                        string2table(JSON.stringify(csv2json(text.substr(0,text.length))),tbody);
                    }
                    else {
                        string2table(text, tbody);
                    }
                };
                reader.readAsText(input.files[0]);
            }
            else {
                error_msg.innerHTML = 'Error load file';
                error_msg.style.display = 'block';
            }
        }catch (e) {
            error_msg.innerHTML = e.message;
            error_msg.style.display = 'block';
        }
        input.value = '';
    });

    file_export.addEventListener('click',function (e) {
        e.preventDefault();
        let table_data = rows2json(tbody);
        if(format === 'csv') {
            write2file(json2csv(table_data),format);
        }else {
            write2file(JSON.stringify(table_data),format);
        }
    });

    //Sorting onclick actions implemented
    key_up.addEventListener('click',function (e) {
        e.preventDefault();
        let sort_array = rows2json(tbody);
        sort_array.sort(function (a, b) {
            let name_a = a.name.toLowerCase();
            let name_b = b.name.toLowerCase();
            if (name_a > name_b)
                return -1;
            else return 1;
        });
        tbody.innerHTML = '';
        sort_array.forEach(function (el) {
            tbody.append(obj2row(el));
        });
    });

    key_down.addEventListener('click',function (e) {
        e.preventDefault();
        let sort_array = rows2json(tbody);
        sort_array.sort(function (a, b) {
            let name_a = a.name.toLowerCase();
            let name_b = b.name.toLowerCase();
            if (name_a < name_b)
                return -1;
            else return 1;
        });
        tbody.innerHTML = '';
        sort_array.forEach(function (el) {
            tbody.append(obj2row(el));
        });
    });

    value_up.addEventListener('click',function (e) {
        e.preventDefault();
        let sort_array = rows2json(tbody);
        sort_array.sort(function (a, b) {
            let value_a = a.value.toLowerCase();
            let value_b = b.value.toLowerCase();
            if (value_a > value_b)
                return -1;
            else return 1;
        });
        tbody.innerHTML = '';
        sort_array.forEach(function (el) {
            tbody.append(obj2row(el));
        });
    });

    value_down.addEventListener('click',function (e) {
        e.preventDefault();
        let sort_array = rows2json(tbody);
        sort_array.sort(function (a, b) {
            let value_a = a.value.toLowerCase();
            let value_b = b.value.toLowerCase();
            if (value_a < value_b)
                return -1;
            else return 1;
        });
        tbody.innerHTML = '';
        sort_array.forEach(function (el) {
            tbody.append(obj2row(el));
        });
    });

    json_file.addEventListener('click',function () {
        format = this.value;
        file_field.innerHTML = '[{"name":"<code>your name</code>","value":"<code>your value</code>"},{"name":"<code>your second name</code>","value":"<code>your second value</code>"}]';
    });

    csv_file.addEventListener('click',function () {
        format = this.value;
        file_field.innerHTML = '<code>Yourname</code>,<code>Yourvalue</code><br><code>Yourname</code>,<code>Yourvalue</code>';
    });

};

function string2table(string, tbody){
    let object = JSON.parse(string);
    object.forEach(function(el){
        tbody.appendChild(obj2row(el));
    });
}

function rows2json(tbody){
    var array = [];
    tbody.querySelectorAll('tr').forEach(function(el){
        let name = el.querySelector('td:nth-child(1)').innerText;
        let value = el.querySelector('td:nth-child(2)').innerText;
        array.push({name:name, value:value});
    });
    return array;
}

function obj2row(obj){
    let tr = document.createElement('tr');
    let td_1 = tr.appendChild(document.createElement('td'));
    let td_2 = tr.appendChild(document.createElement('td'));
    let td_3 = tr.appendChild(document.createElement('td'));
    let btn = document.createElement('button');
    btn.className = 'btn';
    let btn_delete = btn.cloneNode(true);
    btn_delete.addEventListener("click", delete_tr, true);
    let btn_edit = btn.cloneNode(true);
    btn_edit.addEventListener("click", edit_tr, true);
    let span_edit = document.createElement('span');
    span_edit.className = 'fa fa-pencil';
    let span_delete = document.createElement('span');
    span_delete.className = 'fa fa-trash-o';
    btn_delete.appendChild(span_delete);
    btn_edit.appendChild(span_edit);
    td_1.innerText = obj.name;
    td_2.innerText = obj.value;
    td_3.appendChild(btn_edit);
    td_3.appendChild(btn_delete);
    return tr;
}

function write2file(string2write, format){
    const a = document.createElement("a");
    const data_format = (format === 'csv') ? 'text/csv' : 'application/json';
    const filename = 'export_table.'+format;
    a.href = "data:"+data_format+"," + encodeURIComponent(string2write);
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    setTimeout(function () {
        a.click();
        document.body.removeChild(a);
    }, 200);
}

function csv2json(str) {
    let rows = str.split('\n');
    let result = [];
    rows.forEach(function (el) {
        let obj = el.split(',');
        result.push({name:obj[0], value:obj[1]});
    });
    return result;
}

function json2csv(obj) {
    let str = '';
    obj.forEach(function (el) {
        str += el.name + ',' + el.value + '\n';
    });
    return str.substr(0,str.length-1);
}

function delete_tr(e){
    let current = e.currentTarget;
    let parent_tr = current.parentNode.parentNode;
    parent_tr.parentNode.removeChild(parent_tr);
}

function save_tr(e){
    let current = e.currentTarget;
    let parent_tr = current.parentNode.parentNode;
    let key_td = parent_tr.querySelector('td:nth-child(1)');
    let value_td = parent_tr.querySelector('td:nth-child(2)');
    current.querySelector('span').className = 'fa fa-pencil';

    current.removeEventListener('click', save_tr, true);
    current.addEventListener('click', edit_tr, true);

    let input_key = key_td.querySelector('input');
    let input_value = value_td.querySelector('input');

    key_td.innerText = input_key.value;
    value_td.innerText = input_value.value;
}

function edit_tr(e){
    let current = e.currentTarget;
    let parent_tr = current.parentNode.parentNode;
    let key_td = parent_tr.querySelector('td:nth-child(1)');
    let value_td = parent_tr.querySelector('td:nth-child(2)');

    current.querySelector('span').className = 'fa fa-save';

    current.removeEventListener('click', edit_tr, true);
    current.addEventListener('click', save_tr, true);

    let input_field = document.createElement('input');
    input_field.type = 'text';

    let input_key = input_field.cloneNode(true);
    input_key.value = key_td.innerText;

    let input_value = input_field.cloneNode(true);
    input_value.value = value_td.innerText;

    key_td.replaceChild(input_key,key_td.firstChild);
    value_td.replaceChild(input_value,value_td.firstChild);
}
