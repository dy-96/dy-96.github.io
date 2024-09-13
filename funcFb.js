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

get(ref(db, "SWITCH"))
  .then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const value = data["led1"];
      if (value) {
        $("#switch").attr({ checked: "ckecked" });
      } else {
        $("#switch").removeAttr("ckecked");
      }
      console.log(value);
    } else {
      return null;
    }
  })
  .catch((error) => console.error("Error reading data:", error));

$("#switch").change(function () {
  const check = $(this).prop("checked");
  updateData("SWITCH", { led1: check });
});
