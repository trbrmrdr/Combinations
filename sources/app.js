
var COUNT_VAL = 12;

function* permutator(arr) {
    var i, a, b;

    function swap(arr, a, b) {
        let xx = arr[a];
        arr[a] = arr[b];
        arr[b] = xx;
    }

    yield arr.slice();

    while (true) {
        a = -1, b = -1;
        for (i = 0; i < arr.length - 1; i++) if (arr[i] < arr[1 + i]) a = i;
        if (!~a) return;
        for (i = a + 1; i < arr.length; i++) if (arr[a] < arr[i]) b = i;
        swap(arr, a++, b);
        b = arr.length - 1;
        while (a < b) swap(arr, a++, b--);
        yield arr.slice();
    }
}

function downloadFile(arr, filename = "Combinations.txt") {
    let text = "";
    arr.forEach(function (val_arr) {
        let str_line = "";
        val_arr.forEach(function (el) {
            if (str_line.length != 0) str_line += ",";
            str_line += "" + el;
        });
        if (text.length != 0) text += "\n";
        text += str_line;
    });

    console.log(text);
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


function calculate(cb = null) {

    var check_arr = [];///[{pos:i,val:val}];
    var target_arr = [];//[1, 2, 3, 4, 5];
    let hasNeededFix = false;

    for (let i = 0; i < COUNT_VAL; i++) {
        let val = document.getElementById(`item_val_${i}`).value;

        if (document.getElementById(`item_ch_${i}`).checked) {
            check_arr.push({ pos: i, val: val });
            hasNeededFix = true;
        } else {
            target_arr.push(val);
        }
    }
    //____

    let allCount = factorial(target_arr.length);
    var retAllCount = 0;
    let timeStart = Date.now();
    var all = [], result, G = permutator(target_arr.slice().sort());

    var iterFunc = () => {
        result = G.next();
        if (result.done) return false;

        retAllCount += 1;

        if (hasNeededFix) {
            let ret = result.value;
            check_arr.forEach((val) => {
                ret.splice(val.pos, 0, val.val);
            });
            all.push(result.value);
        } else {
            all.push(result.value);
        }
        return true;
    };

    var callTimeout = () => {
        setTimeout(() => {

            let i = 50000;
            while (i-- > 0) {
                if (!iterFunc()) {
                    cb != null ? cb(all) : 0;
                    return
                }
                let elapsed = Date.now() - timeStart;
                let percent = retAllCount / allCount * 100;
                let left = elapsed * (allCount / retAllCount) - elapsed;

                let strOut = `${percent.toFixed(2)}  осталось  ~${msToTime(left)}`;

                // console.log(strOut);
                document.getElementById("block_text").innerHTML = strOut;
            }

            callTimeout();
        }, 0);
    }

    callTimeout();
}


var bloack_div
function calculate_press() {

    bloack_div = document.getElementById("block");
    bloack_div.style.display = 'block';

    calculate((arr) => {
        bloack_div.style.display = 'none';
        downloadFile(arr);
    });
}


window.onload = async function () {

    let html_out = "";
    for (let i = 0; i < COUNT_VAL; i++) {
        html_out += ` <div class="item">
        ${i + 1})
        <input type="checkbox" id="item_ch_${i}" value="false" />
        <input type="text" id="item_val_${i}" value="${i + 1}" />
    </div>`;
    }
    document.getElementById(`list`).innerHTML = html_out;

    // calculate();
}

function factorial(n) {
    return (n != 1) ? n * factorial(n - 1) : 1;
}

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}