function availableSpace(active) {
  if (document.querySelector("#display input").value.length > 9) return false;
  return true;
}

function reset() {
  if (document.querySelector("#display input").classList.contains("active")) {
    document.querySelector("#display input").classList.remove("active");
    document.querySelector("#display b").classList.remove("active");
    document.querySelector("#display input").value = "";
    document.querySelector("#display b").textContent = "";
  }
}

document.querySelector("#buttons").addEventListener("click", (e) => {
  reset();
  let con = e.target.textContent;
  let display = (res) => {
    if (res) document.querySelector("#display input").value += res;
  };

  if (availableSpace() == true) {
    if (e.target.tagName == "BUTTON")
      if (con == "del" || con == "C" || con == "=") display(false);
      else if (con == "x²") display("²");
      else if (con == "√x") display("√");
      else display(con);
    result(e.target.textContent);
  } else if (con == "del" || con == "C" || con == "=")
    result(e.target.textContent);
});

window.addEventListener("keydown", (e) => {
  reset();
  if (availableSpace() == true) {
    if (!isNaN(parseInt(e.key)) || e.key == "+" || e.key == "-" || e.key == ".")
      str(e.key);
    else if (
      e.key == "c" ||
      e.key == "a" ||
      e.key == "s" ||
      e.key == "t" ||
      e.key == "e"
    ) {
      let arr = ["cos", "Ans", "sin", "tan", "E"];
      for (let i = 0; i < arr.length; i++)
        if (arr[i][0].toLowerCase() == e.key) str(arr[i]);
    } else if (e.key == "/") str("÷");
    else if (e.key == "*") str("×");
  }

  if (e.key == "Delete") str("C", false);
  else if (e.key == "Backspace") str("del", false);
  else if (e.key == "=") str("=", false);

  function str(findbtn, output) {
    if (output == undefined)
      document.querySelector("#display input").value += findbtn;
    findButton(findbtn);
    result(findbtn);
  }

  function findButton(button) {
    let buttons = document.querySelectorAll("button");

    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].textContent == button) {
        buttons[i].classList.add("active");
        setTimeout(() => {
          buttons[i].classList.remove("active");
        }, 300);
        break;
      }
    }
  }
});

let cachedResult = 0;
let globalAnswer = 0;

function result(button) {
  if (button === "C") {
    document.querySelector("#display input").value = "";
    document.querySelector("#display b").textContent = "";
    return;
  }

  if (button === "=" && document.querySelector("#display input").value != "") {
    if (document.querySelector("#display b").textContent == "") {
      document.querySelector("#display b").textContent = "Syntax error";
      return;
    }
    document.querySelector("#display input").classList.add("active");
    document.querySelector("#display b").classList.add("active");
    globalAnswer = parseFloat(cachedResult);

    addAnswer();
    return;
  }

  if (button === "del") {
    let inputValue = document.querySelector("#display input").value;
    inputValue = inputValue.slice(0, inputValue.length - 1);
    if (
      inputValue.slice(-2) == "An" ||
      inputValue.slice(-2) == "co" ||
      inputValue.slice(-2) == "ta" ||
      inputValue.slice(-2) == "si"
    )
      inputValue = inputValue.slice(0, inputValue.length - 2);
    document.querySelector("#display input").value = inputValue;
  }

  displayResult(filter());
}

function filter() {
  let rawValue = document.querySelector("#display input").value;
  let query = ["-", "÷", "×", "²", "√", "cos", "sin", "tan", "E"];
  let signs = rawValue;
  let value = rawValue;

  for (let i = 0; i < query.length; i++)
    if (rawValue.search(query[i]) != -1) {
      let sign = "@";
      if (i > 2) sign = "%";
      else if (i == 0) sign = "#";
      signs = signs.replace(new RegExp(query[i], "g"), `/${sign + (i + 1)}/`);
      value = value.replace(new RegExp(query[i], "g"), "$");
    } else if (rawValue.search(/\+/) != -1) {
      signs = signs.replace(/\+/, `/#0/`);
      value = value.replace(/\+/, "$");
    }
  if (rawValue.search("Ans") != -1) {
    signs = signs.replace("Ans", "");
    value = value.replace("Ans", globalAnswer.toString());
  }

  let num = 0;
  let numCheck = true;
  let pos = [];
  let pos2 = [];
  signs = signs.split("/").filter((sign) => isNaN(sign) && sign != "");
  for (let i = 0; i < value.length; i++) if (value[i] == "$") pos.push(i);
  for (let i = 0; i < value.length; i++)
    if (value[i] != "$") numCheck ? (numCheck = false) : num++;
    else {
      pos2.push(i - num);
      numCheck = true;
    }
  value = value.split("$").filter((n) => n != "");
  for (let i = 0; i < value.length; i++) value[i] = parseFloat(value[i]);

  return calC(value, signs, pos, pos2);
}

function calC(value, signs, pos, pos2) {
  let change = 0;
  for (let i = 0; i < signs.length; i++) {
    if (signs[i].slice(0, 1) == "%") {
      let id = signs[i].slice(1);
      let exp = (num) => {
        let i = 0;
        let value = 1;
        while (i < num) {
          value *= 10;
          i++;
        }
        return value;
      };
      let calCulate = (calcValue) => {
        if (value[pos2[i] - i - 1]) {
          if (pos[i - 1] && pos[i - 1] == pos[i] - 1)
            value[pos2[i] - i] = calcValue;
          else {
            value[pos2[i] - i] = calcValue * value[pos2[i] - i - 1];
            value.splice(pos2[i] - i - 1, 1);
            change++;
          }
        } else value[pos2[i] - i] = calcValue;
      };

      if (id == 4)
        value[pos2[i] - i - 1 - change] =
          value[pos2[i] - i - 1 - change] * value[pos2[i] - i - 1 - change];
      else if (id == 5) calCulate(Math.sqrt(value[pos2[i] - i]));
      else if (id == 6)
        calCulate(Math.cos((Math.PI * value[pos2[i] - i]) / 180));
      else if (id == 7)
        calCulate(Math.sin((Math.PI * value[pos2[i] - i]) / 180));
      else if (id == 8)
        calCulate(Math.tan((Math.PI * value[pos2[i] - i]) / 180));
      else if (id == 9) calCulate(exp(value[pos2[i] - i]));
    }
  }

  let total = value[0];
  let init = 0;

  for (let i = 0; i < signs.length; i++) {
    let id = signs[i].slice(1);
    let sign = signs[i].slice(0, 1);

    if (signs[i + 1]) sign = signs[i + 1].slice(0, 1);

    if (
      signs[i].slice(0, 1) == "#" &&
      sign == "#" &&
      pos[i + 1] == pos[i] + 1
    ) {
      let x = 0;
      let num = 1;
      while (pos[i + x] == pos[i] + x) x++;
      for (let r = 0; r < x; r++)
        if (signs[i + r].slice(1) == 0) num *= 1;
        else num *= -1;
      total = total + num * value[init + 1];
      i += x - 1;
      init++;
    } else if (id == 0) total = total + value[init + 1];
    else if (id == 1) total = total - value[init + 1];
    else if (id == 2) total = total / value[init + 1];
    else if (id == 3) total = total * value[init + 1];

    if (id > -1 && id < 4) init++;
  }

  if (total == NaN || total == undefined) total = "";
  return total;
}

function displayResult(result) {
  cachedResult = result;

  if (
    result !== "" &&
    result.toString().length > 8 &&
    result.toString().indexOf(".") == -1
  ) {
    let d = result.toString().length;
    result = result.toString().slice(0, 7) + `<sup>e${d - 7}</sup>`;
  }

  if (result !== "" && result.toString().indexOf(".") !== -1) {
    let d = result.toString().split(".");

    if (d[1].length > 4) {
      for (let i = 4; i >= 0; i--) {
        if (d[1][i] != "9") {
          result = result.toFixed(i + 1);
          break;
        }
        if (i == 0 && d[1][i] == "9") {
          result = Math.round(result);
          break;
        }
      }
    }
  }

  document.querySelector("#display b").innerHTML = result;
}

function addAnswer() {
  let equation = document.querySelector("#display input").value;
  let solution = document.querySelector("#display b").textContent;

  let li = document.createElement("li");
  let span1 = document.createElement("span");
  let span2 = document.createElement("span");

  li.classList.add("center", "col", "active");
  span1.classList.add("center");
  span1.textContent = equation;
  span2.textContent = solution;

  li.append(span1, span2);

  if (document.querySelector("#display ul").childElementCount > 1) {
    setTimeout(() => {
      document
        .querySelector("#display ul")
        .removeChild(document.querySelector("#display ul").children[2]);
    }, 500);
  }

  document.querySelector("#display ul").prepend(li);
  setTimeout(() => {
    li.classList.remove("active");
  }, 400);
}

document.querySelector("#display ul").addEventListener("click", (e) => {
  if (e.target.tagName == "LI") acquire(e.target);
  else acquire(e.target.parentElement);

  function acquire(tagName) {
    let equation = tagName.children[0].textContent;
    let solution = tagName.children[1].textContent;

    document.querySelector("#display input").value = equation;
    document.querySelector("#display b").textContent = solution;

    if (document.querySelector("#display input").classList.contains("active")) {
      document.querySelector("#display input").classList.remove("active");
      document.querySelector("#display b").classList.remove("active");
    }
  }
});
