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


// // switch
$("#toggle-event").change(function () {
  const check = $(this).prop("checked");
  updateData("SWITCH", { led1: check });
});
// //$("#toggle-event").attr({ checked: "checked" });
// readData("SWITCH", "led1");
// //$("#toggle-event").remove();

async function updateData(path, data) {
  update(ref(db, path), data)
    .then(() => console.log("Data updated successfully"))
    .catch((error) => console.error("Error updating data:", error));
}

async function readData(path, key) {
  get(ref(db, path))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let value = data[key];
        return value;
      } else {
        return null;
      }
    })
    .catch((error) => console.error("Error reading data:", error));
}
