import { db } from "./conFirebase.js";
console.log(db);

// switch
$("#toggle-event").change(function () {
  const check = $(this).prop("checked");
  console.log(check);
});
