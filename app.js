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

// switch
for (var i = 1; i <= 3; i++) {
  _switch(i);
}
_switchCTRL(1);
var isoff = true;
async function _switchCTRL(id) {
  $("#sw-check"+id).change(function () {
    const check = $(this).prop("checked");
    _updateData("SWITCH", { led1: check });
  });

  $("#switch-box" + id).click(function () {
    $(".sw"+id).toggleClass("sw-deactivated"+id);
    $("#sw-check"+id).trigger("click");
    if (isoff) {
      $("#switch-selector"+id).animate(
        {
          opacity: 0.8,
          left: "+=44px",
        },
        100
      );
      isoff = false;
    } else {
      $("#switch-selector"+id).animate(
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
          $(".sw"+id).toggleClass("sw-deactivated"+id);
          $("#sw-check"+id).attr({ checked: "checked" });
          $("#switch-selector"+id).css({ opacity: 0.8, left: "+=44px" });
          isoff = false;
        } else {
          $("#sw-check"+id).removeAttr("checked");
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
    ` <div class="sw-nama"><div id="switch-box` +
    id +
    `"><div id="switch-selector`+id+`"></div>
                    <span class="sw-active`+id+` sw-deactivated`+id+` sw`+id+`">ON</span>
                    <span class="sw-inactive`+id+` sw`+id+`">OFF</span>
                    </div>
                    <input id="sw-check`+id+`" type="checkbox" />
                    <div>dede</div></div>`;
  $(".box-switch").append(s);
}

function _nav(judul) {
  $(".box-nav").append(`<nav>` + judul + `</nav>`);
}
