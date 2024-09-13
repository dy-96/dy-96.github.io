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

async function updateData(path, data) {
  update(ref(db, path), data)
    .then(() => console.log("Data updated successfully"))
    .catch((error) => console.error("Error updating data:", error));
}

var isoff = true;
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

$("#sw-check").change(function () {
  const check = $(this).prop("checked");
  updateData("SWITCH", { led1: check });
});

// switch
$("#switch-container").click(function () {
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