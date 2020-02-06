"use strict";

async function createDropdown(array, select) {
  array.forEach(value => {
    const option = document.createElement("option");
    
    option.text = value;
    option.value = value;
    select.add(option);
  });
}

export default createDropdown;
