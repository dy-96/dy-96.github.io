import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  update,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

import { firebaseConfig } from "./conFb.js";
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const totalBtn = 3;
let kondisi = [, true, true, true];
let isOff = [, false, false, false];

head("CONTROL LED");
readData("SWITCH");
loopPrintSwBtn();

async function readData(path) {
  const dbRef = ref(db, path);
  get(dbRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        for (let i = 1; i <= totalBtn; i++) {
          const state = val["led" + i];
          stateSw(i, state);
          stateOnClickById(i);
        }
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error("Error reading data:", error);
    });
}

function stateSw(id, val) {
  if (val) {
    kondisi[id] = val;
    $(".sw" + id).toggleClass("sw-deactivated" + id);
    $("#sw-check" + id).attr({ checked: "checked" });
    $("#switch-selector" + id).css({ opacity: 0.8, left: "+=44px" });
  } else {
    kondisi[id] = val;
    $("#sw-check" + id).removeAttr("checked");
  }

  //----------------filter data----------------//
  if (kondisi[id]) {
    switch (id) {
      case 1:
        isOff[1] = true;
        break;
      case 2:
        isOff[2] = true;
        break;
      case 3:
        isOff[3] = true;
        break;
    }
  } else {
    switch (id) {
      case 1:
        isOff[1] = false;
        break;
      case 2:
        isOff[2] = false;
        break;
      case 3:
        isOff[3] = false;
        break;
    }
  }
}
async function _updateData(id, getData) {
  const dbRef = ref(db, "SWITCH");
  const dataJson = JSON.parse(`{"led${id}" : ${getData}}`);

  update(dbRef, dataJson)
    .then(() => {
      console.log(`Data updated successfuly btn: ${id}`);
    })
    .catch((error) => {
      console.error(`Error updating led${id}:`, error);
    });
}
function loopPrintSwBtn() {
  for (var i = 1; i <= totalBtn; i++) {
    printSwBtn(i);
    $("#name" + i)
      .text("LED " + i)
      .css({ color: "white" });
  }
}
function printSwBtn(id) {
  const s =
    ` <div class="sw-box"><div id="switch-box` +
    id +
    `"><div id="switch-selector` +
    id +
    `"></div>
                    <span class="sw-active` +
    id +
    ` sw-deactivated` +
    id +
    ` sw` +
    id +
    `">ON</span>
                    <span class="sw-inactive` +
    id +
    ` sw` +
    id +
    `">OFF</span>
                    </div>
                    <input id="sw-check` +
    id +
    `" type="checkbox" />
                    <div id="name` +
    id +
    `">name</div></div>`;
  $(".box-switch").append(s);
}

function head(judul) {
  $(".box-nav").append(`<nav>` + judul + `</nav>`);
}
function stateOnClickById(id) {
  $("#sw-check" + id).change(function () {
    const check = $(this).prop("checked");
    _updateData(id, check);
  });
}

//----------------btn switch-------------------//

$("#switch-box1").click(function () {
  $(".sw1").toggleClass("sw-deactivated1");
  $("#sw-check1").trigger("click");
  if (isOff[1]) {
    selectorSwN(1);
    isOff[1] = false;
  } else {
    selectorSwP(1);
    isOff[1] = true;
  }
});
$("#switch-box2").click(function () {
  $(".sw2").toggleClass("sw-deactivated2");
  $("#sw-check2").trigger("click");
  if (isOff[2]) {
    selectorSwN(2);
    isOff[2] = false;
  } else {
    selectorSwP(2);
    isOff[2] = true;
  }
});
$("#switch-box3").click(function () {
  $(".sw3").toggleClass("sw-deactivated3");
  $("#sw-check3").trigger("click");
  if (isOff[3]) {
    selectorSwN(3);
    isOff[3] = false;
  } else {
    selectorSwP(3);
    isOff[3] = true;
  }
});

function selectorSwP(id) {
  $("#switch-selector" + id).animate(
    {
      opacity: 0.8,
      left: "+=44px",
    },
    100
  );
}
function selectorSwN(id) {
  $("#switch-selector" + id).animate(
    {
      opacity: 0.8,
      left: "-=44px",
    },
    100
  );
}
//...............................................//
