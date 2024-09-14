import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
import { firebaseConfig } from "./conFb.js";
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

_nav("CONTROL LAMPU");
_switch(1);
_switchCTRL();

// switch
var isoff = true;
async function _switchCTRL() {
  $("#sw-check").change(function () {
    const check = $(this).prop("checked");
    _updateData("SWITCH", { led1: check });
  });

  $("#switch-container1").click(function () {
    $(".sw").toggleClass("sw-deactivated");
    $("#sw-check").trigger("click");
    if (isoff) {
      $("#switch-selector").animate(
        {
          opacity: 0.8,
          left: "+=44px",
        },
        100
      );
      isoff = false;
    } else {
      $("#switch-selector").animate(
        {
          opacity: 1,
          left: "-=44px",
        },
        100
      );
      isoff = true;
    }
  });

  get(ref(db, "SWITCH"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const value = data["led1"];
        if (value) {
          $(".sw").toggleClass("sw-deactivated");
          $("#sw-check").attr({ checked: "checked" });
          $("#switch-selector").css({ opacity: 0.8, left: "+=44px" });
          isoff = false;
        } else {
          $("#sw-check").removeAttr("checked");
        }
        console.log(value);
      } else {
        return null;
      }
    })
    .catch((error) => console.error("Error reading data:", error));
}

async function _updateData(path, data) {
  update(ref(db, path), data)
    .then(() => console.log("Data updated successfully"))
    .catch((error) => console.error("Error updating data:", error));
}

function _switch(id) {
  const s =
    `<div class="container-switch">
                    <div id="switch-container` +
    id +
    `">
                    <div id="switch-selector"></div>
                    <span class="sw-active sw-deactivated sw">ON</span>
                    <span class="sw-inactive sw">OFF</span>
                    </div>
                    <input id="sw-check" type="checkbox" />
                </div>`;
  $(".box-switch").append(s);
}

function _nav(judul) {
  $(".box-nav").append(`<nav>` + judul + `</nav>`);
}
